<?php

namespace App\Controllers\PKG08_DashboardReportes\CU21_Reportes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades\Especialidad;
use App\Models\PKG06_AtencionMedica\CU16_AtenderConsulta\AtencionMedica;
use App\Models\PKG07_Laboratorios\CU17_CargarEstudios\LaboratorioEstudioCarga;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;

class CU21_ReportesController extends Controller
{
    /**
     * Parsear rango de fechas por defecto o parámetros
     */
    private function parseRangoFechas(Request $request): array
    {
        $periodo = $request->input('periodo', 'este_mes');
        $hoy = Carbon::now('America/La_Paz');

        switch ($periodo) {
            case 'hoy':
                $inicio = $hoy->copy()->startOfDay()->toDateString();
                $fin = $hoy->copy()->endOfDay()->toDateString();
                break;
            case 'esta_semana':
                $inicio = $hoy->copy()->startOfWeek()->toDateString();
                $fin = $hoy->copy()->endOfWeek()->toDateString();
                break;
            case 'este_mes':
                $inicio = $hoy->copy()->startOfMonth()->toDateString();
                $fin = $hoy->copy()->endOfMonth()->toDateString();
                break;
            case 'trimestre':
                $inicio = $hoy->copy()->subMonths(3)->startOfDay()->toDateString();
                $fin = $hoy->copy()->endOfDay()->toDateString();
                break;
            case 'anio':
                $inicio = $hoy->copy()->startOfYear()->toDateString();
                $fin = $hoy->copy()->endOfYear()->toDateString();
                break;
            case 'personalizado':
            default:
                $inicio = $request->input('fecha_inicio', $hoy->copy()->subDays(30)->toDateString());
                $fin = $request->input('fecha_fin', $hoy->copy()->toDateString());
                break;
        }

        return [$inicio, $fin];
    }

    /**
     * CU21 - Metadatos para filtros
     */
    public function meta(Request $request): JsonResponse
    {
        try {
            $medicos = DB::table('medicos')
                ->where('estado', 'ACTIVO')
                ->select('id_medico', 'nombres', 'apellidos')
                ->orderBy('nombres')
                ->get()
                ->map(fn($m) => [
                    'id_medico' => $m->id_medico,
                    'nombre_completo' => "Dr(a). {$m->nombres} {$m->apellidos}",
                ]);

            $especialidades = DB::table('especialidades')
                ->where('estado', 'ACTIVO')
                ->select('id_especialidad', 'nombre')
                ->orderBy('nombre')
                ->get();

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'medicos'        => $medicos,
                    'especialidades' => $especialidades,
                    'periodos'       => [
                        ['id' => 'hoy', 'nombre' => 'Hoy'],
                        ['id' => 'esta_semana', 'nombre' => 'Esta Semana'],
                        ['id' => 'este_mes', 'nombre' => 'Este Mes'],
                        ['id' => 'trimestre', 'nombre' => 'Último Trimestre (90 días)'],
                        ['id' => 'anio', 'nombre' => 'Año en Curso'],
                        ['id' => 'personalizado', 'nombre' => 'Rango Personalizado'],
                    ],
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU21 meta: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al obtener metadatos de reportes.'], 500);
        }
    }

    /**
     * Reporte 1: Productividad Médica y Ocupación
     */
    public function productividadMedica(Request $request): JsonResponse
    {
        try {
            [$fechaInicio, $fechaFin] = $this->parseRangoFechas($request);
            $idMedico = $request->input('id_medico');
            $idEspecialidad = $request->input('id_especialidad');

            $query = DB::table('citas')
                ->join('medicos', 'citas.id_medico', '=', 'medicos.id_medico')
                ->leftJoin('especialidades', 'citas.id_especialidad', '=', 'especialidades.id_especialidad')
                ->whereBetween('citas.fecha_cita', [$fechaInicio, $fechaFin]);

            if (!empty($idMedico) && $idMedico !== 'todos') {
                $query->where('citas.id_medico', (int)$idMedico);
            }
            if (!empty($idEspecialidad) && $idEspecialidad !== 'todas') {
                $query->where('citas.id_especialidad', (int)$idEspecialidad);
            }

            // Agrupación por médico
            $productividad = $query->select(
                'medicos.id_medico',
                'medicos.nombres',
                'medicos.apellidos',
                DB::raw("COALESCE(especialidades.nombre, 'General') as especialidad"),
                DB::raw("COUNT(citas.id_cita) as total_citas"),
                DB::raw("SUM(CASE WHEN citas.estado_cita IN ('COMPLETADA', 'ATENDIDA') THEN 1 ELSE 0 END) as atendidas"),
                DB::raw("SUM(CASE WHEN citas.estado_cita IN ('PROGRAMADA', 'CONFIRMADA', 'EN_SALA', 'EN_ESPERA', 'EN_CONSULTA') THEN 1 ELSE 0 END) as pendientes"),
                DB::raw("SUM(CASE WHEN citas.estado_cita IN ('CANCELADA') THEN 1 ELSE 0 END) as canceladas"),
                DB::raw("SUM(CASE WHEN citas.estado_cita IN ('NO_ASISTIO', 'INASISTENCIA') THEN 1 ELSE 0 END) as inasistencias")
            )
            ->groupBy('medicos.id_medico', 'medicos.nombres', 'medicos.apellidos', 'especialidades.nombre')
            ->orderByDesc('total_citas')
            ->get()
            ->map(function ($row) {
                $total = (int)$row->total_citas;
                $atendidas = (int)$row->atendidas;
                $inasistencias = (int)$row->inasistencias;
                $canceladas = (int)$row->canceladas;

                $tasaEfectividad = $total > 0 ? round(($atendidas / $total) * 100, 1) : 0;
                $tasaInasistencia = $total > 0 ? round(($inasistencias / $total) * 100, 1) : 0;
                $tasaCancelacion = $total > 0 ? round(($canceladas / $total) * 100, 1) : 0;

                return [
                    'id_medico'          => $row->id_medico,
                    'medico'             => "Dr(a). {$row->nombres} {$row->apellidos}",
                    'especialidad'       => $row->especialidad,
                    'total_citas'        => $total,
                    'atendidas'          => $atendidas,
                    'pendientes'         => (int)$row->pendientes,
                    'canceladas'         => $canceladas,
                    'inasistencias'      => $inasistencias,
                    'tasa_efectividad'   => $tasaEfectividad,
                    'tasa_inasistencia'  => $tasaInasistencia,
                    'tasa_cancelacion'   => $tasaCancelacion,
                ];
            });

            // Resumen Global
            $totalCitas = $productividad->sum('total_citas');
            $totalAtendidas = $productividad->sum('atendidas');
            $totalInasistencias = $productividad->sum('inasistencias');
            $totalCanceladas = $productividad->sum('canceladas');
            $tasaGlobalEfectividad = $totalCitas > 0 ? round(($totalAtendidas / $totalCitas) * 100, 1) : 0;

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'rango_fechas' => ['inicio' => $fechaInicio, 'fin' => $fechaFin],
                    'resumen_kpi'  => [
                        'total_citas'            => $totalCitas,
                        'total_atendidas'        => $totalAtendidas,
                        'total_inasistencias'    => $totalInasistencias,
                        'total_canceladas'       => $totalCanceladas,
                        'tasa_global_efectividad'=> $tasaGlobalEfectividad,
                        'total_medicos_activos'  => $productividad->count(),
                    ],
                    'filas'        => $productividad,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU21 productividadMedica: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al generar reporte de productividad médica.'], 500);
        }
    }

    /**
     * Reporte 2: Morbilidad y Epidemiología (Diagnósticos CIE-10)
     */
    public function morbilidadCie10(Request $request): JsonResponse
    {
        try {
            [$fechaInicio, $fechaFin] = $this->parseRangoFechas($request);
            $idMedico = $request->input('id_medico');
            $idEspecialidad = $request->input('id_especialidad');

            $query = DB::table('atenciones_medicas')
                ->join('citas', 'atenciones_medicas.id_cita', '=', 'citas.id_cita')
                ->join('pacientes', 'citas.id_paciente', '=', 'pacientes.id_paciente')
                ->whereBetween(DB::raw("CAST(atenciones_medicas.fecha_atencion AS DATE)"), [$fechaInicio, $fechaFin]);

            if (!empty($idMedico) && $idMedico !== 'todos') {
                $query->where('atenciones_medicas.id_medico', (int)$idMedico);
            }
            if (!empty($idEspecialidad) && $idEspecialidad !== 'todas') {
                $query->where('citas.id_especialidad', (int)$idEspecialidad);
            }

            $totalAtenciones = (clone $query)->count();

            // Diagnósticos más frecuentes
            $diagnosticos = (clone $query)
                ->select(
                    DB::raw("COALESCE(atenciones_medicas.diagnostico_cie10, 'CIE-SIN') as codigo_cie10"),
                    'atenciones_medicas.diagnostico_descripcion',
                    DB::raw("COUNT(*) as total_casos"),
                    DB::raw("SUM(CASE WHEN pacientes.sexo = 'MASCULINO' THEN 1 ELSE 0 END) as casos_masculinos"),
                    DB::raw("SUM(CASE WHEN pacientes.sexo = 'FEMENINO' THEN 1 ELSE 0 END) as casos_femeninos")
                )
                ->groupBy('atenciones_medicas.diagnostico_cie10', 'atenciones_medicas.diagnostico_descripcion')
                ->orderByDesc('total_casos')
                ->limit(15)
                ->get()
                ->map(function ($diag) use ($totalAtenciones) {
                    $casos = (int)$diag->total_casos;
                    $porcentaje = $totalAtenciones > 0 ? round(($casos / $totalAtenciones) * 100, 1) : 0;

                    return [
                        'codigo_cie10'      => $diag->codigo_cie10,
                        'diagnostico'       => $diag->diagnostico_descripcion,
                        'total_casos'       => $casos,
                        'porcentaje'        => $porcentaje,
                        'casos_masculinos'  => (int)$diag->casos_masculinos,
                        'casos_femeninos'   => (int)$diag->casos_femeninos,
                    ];
                });

            // Grupos etarios
            $distribucionEdad = [
                ['grupo' => '0 a 17 años (Pediatría)', 'total' => 0],
                ['grupo' => '18 a 35 años (Adulto Joven)', 'total' => 0],
                ['grupo' => '36 a 59 años (Adulto)', 'total' => 0],
                ['grupo' => '60 años o más (Adulto Mayor)', 'total' => 0],
            ];

            $pacientesEdades = (clone $query)->select('pacientes.fecha_nacimiento')->get();
            $hoy = Carbon::now();

            foreach ($pacientesEdades as $p) {
                if ($p->fecha_nacimiento) {
                    $edad = Carbon::parse($p->fecha_nacimiento)->age;
                    if ($edad < 18) {
                        $distribucionEdad[0]['total']++;
                    } elseif ($edad <= 35) {
                        $distribucionEdad[1]['total']++;
                    } elseif ($edad <= 59) {
                        $distribucionEdad[2]['total']++;
                    } else {
                        $distribucionEdad[3]['total']++;
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'rango_fechas'      => ['inicio' => $fechaInicio, 'fin' => $fechaFin],
                    'total_atenciones'  => $totalAtenciones,
                    'top_diagnosticos'  => $diagnosticos,
                    'distribucion_edad' => $distribucionEdad,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU21 morbilidadCie10: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al generar reporte de morbilidad.'], 500);
        }
    }

    /**
     * Reporte 3: Rendimiento de Laboratorios y Gabinetes
     */
    public function laboratoriosEstudios(Request $request): JsonResponse
    {
        try {
            [$fechaInicio, $fechaFin] = $this->parseRangoFechas($request);
            $tipoEstudio = $request->input('tipo_estudio');
            $estado = $request->input('estado');

            $query = DB::table('laboratorios_estudios')
                ->join('pacientes', 'laboratorios_estudios.id_paciente', '=', 'pacientes.id_paciente')
                ->leftJoin('medicos', 'laboratorios_estudios.id_medico_solicitante', '=', 'medicos.id_medico')
                ->whereBetween(DB::raw("CAST(laboratorios_estudios.fecha_solicitud AS DATE)"), [$fechaInicio, $fechaFin]);

            if (!empty($tipoEstudio) && $tipoEstudio !== 'todos') {
                $query->where('laboratorios_estudios.tipo_estudio', $tipoEstudio);
            }
            if (!empty($estado) && $estado !== 'todos') {
                $query->where('laboratorios_estudios.estado', $estado);
            }

            $estudios = (clone $query)
                ->select(
                    'laboratorios_estudios.id_estudio',
                    'laboratorios_estudios.codigo_estudio',
                    'laboratorios_estudios.nombre_estudio',
                    'laboratorios_estudios.tipo_estudio',
                    'laboratorios_estudios.estado',
                    'laboratorios_estudios.fecha_solicitud',
                    'laboratorios_estudios.publicado_en',
                    'laboratorios_estudios.resultado_diagnostico',
                    DB::raw("CONCAT(pacientes.nombres, ' ', pacientes.apellidos) as paciente"),
                    'pacientes.ci as paciente_ci',
                    DB::raw("CONCAT('Dr(a). ', medicos.nombres, ' ', medicos.apellidos) as medico_solicitante")
                )
                ->orderByDesc('laboratorios_estudios.fecha_solicitud')
                ->limit(50)
                ->get();

            $total = (clone $query)->count();
            $publicados = (clone $query)->where('laboratorios_estudios.estado', 'PUBLICADO')->count();
            $pendientes = (clone $query)->where('laboratorios_estudios.estado', 'PENDIENTE')->count();
            $enProceso = (clone $query)->where('laboratorios_estudios.estado', 'EN_PROCESO')->count();

            // Desglose por tipo
            $porTipo = (clone $query)
                ->select('laboratorios_estudios.tipo_estudio', DB::raw("COUNT(*) as total"))
                ->groupBy('laboratorios_estudios.tipo_estudio')
                ->orderByDesc('total')
                ->get();

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'rango_fechas' => ['inicio' => $fechaInicio, 'fin' => $fechaFin],
                    'kpis'         => [
                        'total'      => $total,
                        'publicados' => $publicados,
                        'pendientes' => $pendientes,
                        'en_proceso' => $enProceso,
                        'tasa_cumplimiento' => $total > 0 ? round(($publicados / $total) * 100, 1) : 0,
                    ],
                    'por_tipo'     => $porTipo,
                    'estudios'     => $estudios,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU21 laboratoriosEstudios: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al generar reporte de laboratorios.'], 500);
        }
    }

    /**
     * Reporte 4: Análisis de Inasistencias y Cancelaciones
     */
    public function cancelacionesInasistencias(Request $request): JsonResponse
    {
        try {
            [$fechaInicio, $fechaFin] = $this->parseRangoFechas($request);
            $idMedico = $request->input('id_medico');
            $idEspecialidad = $request->input('id_especialidad');

            $query = DB::table('citas')
                ->join('pacientes', 'citas.id_paciente', '=', 'pacientes.id_paciente')
                ->join('medicos', 'citas.id_medico', '=', 'medicos.id_medico')
                ->leftJoin('cancelaciones_citas', 'citas.id_cita', '=', 'cancelaciones_citas.id_cita')
                ->whereBetween('citas.fecha_cita', [$fechaInicio, $fechaFin])
                ->whereIn('citas.estado_cita', ['CANCELADA', 'NO_ASISTIO', 'INASISTENCIA']);

            if (!empty($idMedico) && $idMedico !== 'todos') {
                $query->where('citas.id_medico', (int)$idMedico);
            }
            if (!empty($idEspecialidad) && $idEspecialidad !== 'todas') {
                $query->where('citas.id_especialidad', (int)$idEspecialidad);
            }

            $filas = $query->select(
                'citas.id_cita',
                'citas.codigo_cita',
                'citas.fecha_cita',
                'citas.hora_inicio',
                'citas.estado_cita',
                'citas.motivo_consulta',
                DB::raw("CONCAT(pacientes.nombres, ' ', pacientes.apellidos) as paciente"),
                'pacientes.telefono as paciente_telefono',
                DB::raw("CONCAT('Dr(a). ', medicos.nombres, ' ', medicos.apellidos) as medico"),
                DB::raw("COALESCE(cancelaciones_citas.motivo_cancelacion, 'Sin registro de motivo') as motivo_cancelacion")
            )
            ->orderByDesc('citas.fecha_cita')
            ->limit(50)
            ->get();

            $totalCanceladas = $filas->where('estado_cita', 'CANCELADA')->count();
            $totalInasistencias = $filas->whereIn('estado_cita', ['NO_ASISTIO', 'INASISTENCIA'])->count();

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'rango_fechas'        => ['inicio' => $fechaInicio, 'fin' => $fechaFin],
                    'total_perdidas'      => $filas->count(),
                    'total_canceladas'    => $totalCanceladas,
                    'total_inasistencias' => $totalInasistencias,
                    'citas_afectadas'     => $filas,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU21 cancelacionesInasistencias: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al generar reporte de cancelaciones e inasistencias.'], 500);
        }
    }

    /**
     * CU21 - Auditar exportación de reporte
     */
    public function auditarExportacion(Request $request): JsonResponse
    {
        try {
            $tipoReporte = $request->input('tipo_reporte', 'GENERAL');
            $formato = $request->input('formato', 'EXCEL_CSV');
            $filtros = $request->input('filtros', []);

            BitacoraAuditoria::create([
                'id_usuario'           => auth()->id() ?? 1,
                'modulo'               => 'REPORTES',
                'tabla_afectada'       => 'reportes_estadisticos',
                'id_registro_afectado' => 0,
                'operacion'            => 'EXPORTACION',
                'valores_nuevos'       => [
                    'tipo_reporte' => $tipoReporte,
                    'formato'      => $formato,
                    'filtros'      => $filtros,
                    'fecha_hora'   => Carbon::now('America/La_Paz')->toIso8601String(),
                ],
                'ip_address'           => $request->ip(),
                'user_agent'           => $request->userAgent(),
                'fecha_creacion'       => Carbon::now('America/La_Paz'),
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Exportación auditada correctamente en bitácora.',
            ]);
        } catch (\Throwable $e) {
            Log::warning("No se pudo auditar la exportación: " . $e->getMessage());
            return response()->json(['status' => 'ok']);
        }
    }
}
