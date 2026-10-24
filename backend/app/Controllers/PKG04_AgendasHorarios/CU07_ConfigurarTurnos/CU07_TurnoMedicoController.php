<?php

namespace App\Controllers\PKG04_AgendasHorarios\CU07_ConfigurarTurnos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\PKG04_AgendasHorarios\CU07_ConfigurarTurnos\TurnoMedico;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;

class CU07_TurnoMedicoController extends Controller
{
    /**
     * CU07 - Listado general de turnos y agendas médicas con métricas y filtros
     */
    public function index(Request $request): JsonResponse
    {
        $query = TurnoMedico::with(['medico.especialidades']);

        // 1. Filtro por Médico
        if ($request->filled('id_medico')) {
            $query->where('turnos_medicos.id_medico', (int) $request->input('id_medico'));
        }

        // 2. Filtro por Día de la Semana (1 = Lunes .. 7 = Domingo)
        if ($request->filled('dia_semana')) {
            $query->where('turnos_medicos.dia_semana', (int) $request->input('dia_semana'));
        }

        // 3. Filtro por Estado (ACTIVO / INACTIVO)
        if ($request->filled('estado')) {
            $query->where('turnos_medicos.estado', strtoupper($request->input('estado')));
        }

        // 4. Búsqueda por Nombre de Médico o Especialidad
        if ($request->filled('search')) {
            $search = strtolower(trim($request->input('search')));
            $query->whereHas('medico', function ($q) use ($search) {
                $q->whereRaw('LOWER(nombres) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(apellidos) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(numero_registro_profesional) LIKE ?', ["%{$search}%"]);
            });
        }

        // 5. Ordenamiento cronológico por médico, día de semana y hora de inicio
        $query->orderBy('turnos_medicos.id_medico', 'asc')
              ->orderBy('turnos_medicos.dia_semana', 'asc')
              ->orderBy('turnos_medicos.hora_inicio', 'asc');

        // 6. Paginación
        $perPage = (int) $request->input('per_page', 15);
        $turnos = $query->paginate($perPage);

        // Transformación
        $turnos->getCollection()->transform(function ($turno) {
            $medico = $turno->medico;
            $espPrincipal = $medico?->especialidades->firstWhere('pivot.es_principal', true)
                ?? $medico?->especialidades->first();

            return [
                'id_turno'               => $turno->id_turno,
                'id_medico'              => $turno->id_medico,
                'medico_nombre'          => $medico ? "Dr(a). {$medico->nombre_completo}" : 'Médico no asignado',
                'matricula_profesional'  => $medico?->numero_registro_profesional,
                'especialidad_principal' => $espPrincipal ? $espPrincipal->nombre : 'Sin especialidad',
                'dia_semana'             => $turno->dia_semana,
                'dia_nombre'             => $turno->dia_nombre,
                'hora_inicio'            => substr($turno->hora_inicio, 0, 5),
                'hora_fin'               => substr($turno->hora_fin, 0, 5),
                'horario_rango'          => substr($turno->hora_inicio, 0, 5) . ' - ' . substr($turno->hora_fin, 0, 5),
                'duracion_bloque_min'    => $turno->duracion_bloque_min,
                'cupos_totales'          => $turno->cupos_totales,
                'estado'                 => $turno->estado,
                'bloques'                => $turno->generarBloques(),
            ];
        });

        // Métricas analíticas
        $allTurnosActivos = TurnoMedico::where('estado', 'ACTIVO')->get();
        $cuposSemanales = $allTurnosActivos->sum(fn($t) => $t->cupos_totales);

        $stats = [
            'total_turnos'            => TurnoMedico::count(),
            'turnos_activos'          => TurnoMedico::where('estado', 'ACTIVO')->count(),
            'turnos_inactivos'        => TurnoMedico::where('estado', 'INACTIVO')->count(),
            'medicos_con_agenda'      => TurnoMedico::distinct('id_medico')->count('id_medico'),
            'cupos_semanales_totales' => $cuposSemanales,
        ];

        return response()->json([
            'status'                => 'success',
            'case_of_use'           => 'CU07_ConfigurarTurnos',
            'timezone'              => 'America/La_Paz (UTC-4)',
            'hora_servidor_bolivia' => Carbon::now('America/La_Paz')->format('d/m/Y H:i:s') . ' [BOT]',
            'stats'                 => $stats,
            'data'                  => $turnos,
        ]);
    }

    /**
     * CU07 - Metadatos auxiliares para configurar turnos y agendas
     */
    public function meta(): JsonResponse
    {
        $medicos = Medico::with('especialidades')
            ->where('estado', 'ACTIVO')
            ->orderBy('apellidos', 'asc')
            ->orderBy('nombres', 'asc')
            ->get()
            ->map(function ($m) {
                $esp = $m->especialidades->firstWhere('pivot.es_principal', true) ?? $m->especialidades->first();
                return [
                    'id_medico'             => $m->id_medico,
                    'nombre_completo'       => "Dr(a). {$m->nombre_completo}",
                    'matricula'             => $m->numero_registro_profesional,
                    'especialidad_principal'=> $esp ? $esp->nombre : 'Sin especialidad',
                ];
            });

        $diasSemana = [
            ['id' => 1, 'nombre' => 'Lunes', 'corto' => 'Lun'],
            ['id' => 2, 'nombre' => 'Martes', 'corto' => 'Mar'],
            ['id' => 3, 'nombre' => 'Miércoles', 'corto' => 'Mié'],
            ['id' => 4, 'nombre' => 'Jueves', 'corto' => 'Jue'],
            ['id' => 5, 'nombre' => 'Viernes', 'corto' => 'Vie'],
            ['id' => 6, 'nombre' => 'Sábado', 'corto' => 'Sáb'],
            ['id' => 7, 'nombre' => 'Domingo', 'corto' => 'Dom'],
        ];

        $duraciones = [
            ['minutos' => 15, 'label' => '15 minutos (Estándar consulta clínica)'],
            ['minutos' => 20, 'label' => '20 minutos'],
            ['minutos' => 30, 'label' => '30 minutos (Especialidad / Primera vez)'],
            ['minutos' => 45, 'label' => '45 minutos'],
            ['minutos' => 60, 'label' => '60 minutos (Procedimiento / Junta)'],
        ];

        return response()->json([
            'success'      => true,
            'medicos'      => $medicos,
            'dias_semana'  => $diasSemana,
            'duraciones'   => $duraciones,
        ]);
    }

    /**
     * CU07 - Registrar turno(s) médico(s) con control estricto de solapamientos horarios
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_medico'           => 'required|integer|exists:medicos,id_medico',
            'dias_semana'         => 'required|array|min:1',
            'dias_semana.*'       => 'required|integer|between:1,7',
            'hora_inicio'         => 'required|date_format:H:i',
            'hora_fin'            => 'required|date_format:H:i|after:hora_inicio',
            'duracion_bloque_min' => 'nullable|integer|in:10,15,20,30,45,60',
            'estado'              => 'nullable|string|in:ACTIVO,INACTIVO',
        ], [
            'id_medico.required'    => 'Debe seleccionar un médico.',
            'dias_semana.required'  => 'Debe seleccionar al menos un día de atención para el turno.',
            'hora_inicio.required'  => 'La hora de inicio es obligatoria (ej. 08:00).',
            'hora_fin.required'     => 'La hora de finalización es obligatoria (ej. 12:00).',
            'hora_fin.after'        => 'La hora de fin debe ser posterior a la hora de inicio.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor verifique los parámetros del turno.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $idMedico = (int) $request->input('id_medico');
        $diasSemana = array_unique($request->input('dias_semana'));
        $horaInicio = $request->input('hora_inicio') . ':00';
        $horaFin = $request->input('hora_fin') . ':00';
        $duracionBloque = (int) $request->input('duracion_bloque_min', 15);
        $estado = $request->input('estado', 'ACTIVO');

        $nombresDias = [
            1 => 'Lunes', 2 => 'Martes', 3 => 'Miércoles',
            4 => 'Jueves', 5 => 'Viernes', 6 => 'Sábado', 7 => 'Domingo'
        ];

        // 1. Validación de solapamiento por cada día solicitado
        foreach ($diasSemana as $dia) {
            $solapado = TurnoMedico::where('id_medico', $idMedico)
                ->where('dia_semana', $dia)
                ->where('estado', 'ACTIVO')
                ->where(function ($query) use ($horaInicio, $horaFin) {
                    $query->where(function ($q) use ($horaInicio, $horaFin) {
                        $q->where('hora_inicio', '<', $horaFin)
                          ->where('hora_fin', '>', $horaInicio);
                    });
                })
                ->exists();

            if ($solapado) {
                $nombreDia = $nombresDias[$dia] ?? "Día $dia";
                return response()->json([
                    'success' => false,
                    'message' => "Conflicto de horario: El médico ya posee un turno activo asignado el día {$nombreDia} que colisiona con el rango {$request->input('hora_inicio')} - {$request->input('hora_fin')}.",
                ], 422);
            }
        }

        try {
            return DB::transaction(function () use ($idMedico, $diasSemana, $horaInicio, $horaFin, $duracionBloque, $estado, $request) {
                $creados = [];
                $medico = Medico::find($idMedico);

                foreach ($diasSemana as $dia) {
                    $turno = TurnoMedico::create([
                        'id_medico'           => $idMedico,
                        'dia_semana'          => $dia,
                        'hora_inicio'         => $horaInicio,
                        'hora_fin'            => $horaFin,
                        'duracion_bloque_min' => $duracionBloque,
                        'estado'              => $estado,
                    ]);

                    $creados[] = [
                        'id_turno'   => $turno->id_turno,
                        'dia_semana' => $dia,
                        'dia_nombre' => $turno->dia_nombre,
                        'cupos'      => $turno->cupos_totales,
                    ];

                    // Auditoría por cada turno configurado
                    BitacoraAuditoria::registrar(
                        'PKG04_AgendasHorarios',
                        'turnos_medicos',
                        $turno->id_turno,
                        'INSERT',
                        null,
                        [
                            'id_medico'           => $idMedico,
                            'medico'              => $medico?->nombre_completo,
                            'dia_semana'          => $dia,
                            'dia_nombre'          => $turno->dia_nombre,
                            'hora_inicio'         => $horaInicio,
                            'hora_fin'            => $horaFin,
                            'duracion_bloque_min' => $duracionBloque,
                            'cupos_generados'     => $turno->cupos_totales,
                            'estado'              => $estado,
                        ],
                        $request->user()?->id_usuario ?? 1,
                        $request->ip(),
                        $request->userAgent()
                    );
                }

                $totalDias = count($creados);
                $totalCupos = array_sum(array_column($creados, 'cupos'));

                return response()->json([
                    'success' => true,
                    'message' => "Se configuraron exitosamente {$totalDias} turno(s) para el Dr(a). {$medico?->nombre_completo} ({$totalCupos} cupos de 15 min generados).",
                    'data'    => $creados,
                ], 201);
            });
        } catch (\Throwable $e) {
            Log::error('Error en CU07 store turno: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar los turnos en la base de datos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * CU07 - Consultar detalle de un turno
     */
    public function show(int $id): JsonResponse
    {
        $turno = TurnoMedico::with(['medico.especialidades'])->find($id);

        if (!$turno) {
            return response()->json(['success' => false, 'message' => 'Turno no encontrado.'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id_turno'            => $turno->id_turno,
                'id_medico'           => $turno->id_medico,
                'medico_nombre'       => "Dr(a). {$turno->medico?->nombre_completo}",
                'dia_semana'          => $turno->dia_semana,
                'dia_nombre'          => $turno->dia_nombre,
                'hora_inicio'         => substr($turno->hora_inicio, 0, 5),
                'hora_fin'            => substr($turno->hora_fin, 0, 5),
                'duracion_bloque_min' => $turno->duracion_bloque_min,
                'cupos_totales'       => $turno->cupos_totales,
                'estado'              => $turno->estado,
                'bloques'             => $turno->generarBloques(),
            ],
        ]);
    }

    /**
     * CU07 - Actualizar horario de un turno
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $turno = TurnoMedico::find($id);
        if (!$turno) {
            return response()->json(['success' => false, 'message' => 'El turno solicitado no existe.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'dia_semana'          => 'required|integer|between:1,7',
            'hora_inicio'         => 'required|date_format:H:i',
            'hora_fin'            => 'required|date_format:H:i|after:hora_inicio',
            'duracion_bloque_min' => 'nullable|integer|in:10,15,20,30,45,60',
            'estado'              => 'required|string|in:ACTIVO,INACTIVO',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Parámetros inválidos para actualización.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $diaSemana = (int) $request->input('dia_semana');
        $horaInicio = $request->input('hora_inicio') . ':00';
        $horaFin = $request->input('hora_fin') . ':00';

        // Validar que no solape con otros turnos activos del mismo médico
        $solapado = TurnoMedico::where('id_medico', $turno->id_medico)
            ->where('dia_semana', $diaSemana)
            ->where('id_turno', '!=', $id)
            ->where('estado', 'ACTIVO')
            ->where(function ($query) use ($horaInicio, $horaFin) {
                $query->where('hora_inicio', '<', $horaFin)
                      ->where('hora_fin', '>', $horaInicio);
            })
            ->exists();

        if ($solapado) {
            return response()->json([
                'success' => false,
                'message' => 'Conflicto: El rango horario choca con otro turno activo del mismo médico.',
            ], 422);
        }

        try {
            $valoresAnteriores = [
                'dia_semana'          => $turno->dia_semana,
                'hora_inicio'         => $turno->hora_inicio,
                'hora_fin'            => $turno->hora_fin,
                'duracion_bloque_min' => $turno->duracion_bloque_min,
                'estado'              => $turno->estado,
            ];

            $turno->dia_semana          = $diaSemana;
            $turno->hora_inicio         = $horaInicio;
            $turno->hora_fin            = $horaFin;
            $turno->duracion_bloque_min = (int) $request->input('duracion_bloque_min', 15);
            $turno->estado              = $request->input('estado');
            $turno->save();

            $valoresNuevos = [
                'dia_semana'          => $turno->dia_semana,
                'hora_inicio'         => $turno->hora_inicio,
                'hora_fin'            => $turno->hora_fin,
                'duracion_bloque_min' => $turno->duracion_bloque_min,
                'estado'              => $turno->estado,
            ];

            BitacoraAuditoria::registrar(
                'PKG04_AgendasHorarios',
                'turnos_medicos',
                $turno->id_turno,
                'UPDATE',
                $valoresAnteriores,
                $valoresNuevos,
                $request->user()?->id_usuario ?? 1,
                $request->ip(),
                $request->userAgent()
            );

            return response()->json([
                'success' => true,
                'message' => "Turno del día {$turno->dia_nombre} actualizado correctamente ({$turno->cupos_totales} cupos).",
                'data'    => $turno,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error en CU07 update turno: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error al guardar cambios: ' . $e->getMessage()], 500);
        }
    }

    /**
     * CU07 - Cambiar rápidamente estado (ACTIVO / INACTIVO)
     */
    public function cambiarEstado(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|string|in:ACTIVO,INACTIVO',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Estado inválido.'], 422);
        }

        $turno = TurnoMedico::find($id);
        if (!$turno) {
            return response()->json(['success' => false, 'message' => 'Turno no encontrado.'], 404);
        }

        $nuevoEstado = strtoupper($request->input('estado'));
        $estadoAnterior = $turno->estado;

        $turno->estado = $nuevoEstado;
        $turno->save();

        BitacoraAuditoria::registrar(
            'PKG04_AgendasHorarios',
            'turnos_medicos',
            $turno->id_turno,
            'CAMBIO_ESTADO',
            ['estado' => $estadoAnterior],
            ['estado' => $nuevoEstado],
            $request->user()?->id_usuario ?? 1,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => "Estado del turno ({$turno->dia_nombre}) actualizado a {$nuevoEstado}.",
            'data'    => ['id_turno' => $turno->id_turno, 'estado' => $nuevoEstado],
        ]);
    }

    /**
     * CU07 - Eliminar turno
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $turno = TurnoMedico::find($id);
        if (!$turno) {
            return response()->json(['success' => false, 'message' => 'Turno no encontrado.'], 404);
        }

        $diaNombre = $turno->dia_nombre;
        $idMedico = $turno->id_medico;

        BitacoraAuditoria::registrar(
            'PKG04_AgendasHorarios',
            'turnos_medicos',
            $turno->id_turno,
            'DELETE',
            [
                'id_medico'   => $idMedico,
                'dia_semana'  => $turno->dia_semana,
                'hora_inicio' => $turno->hora_inicio,
                'hora_fin'    => $turno->hora_fin,
            ],
            null,
            $request->user()?->id_usuario ?? 1,
            $request->ip(),
            $request->userAgent()
        );

        $turno->delete();

        return response()->json([
            'success' => true,
            'message' => "Turno del día {$diaNombre} eliminado de la agenda.",
        ]);
    }

    /**
     * CU07 - Consulta de la cuadrícula semanal completa de un médico
     */
    public function agendaSemanalMedico(int $idMedico): JsonResponse
    {
        $medico = Medico::with('especialidades')->find($idMedico);
        if (!$medico) {
            return response()->json(['success' => false, 'message' => 'Médico no encontrado.'], 404);
        }

        $turnos = TurnoMedico::where('id_medico', $idMedico)
            ->where('estado', 'ACTIVO')
            ->orderBy('dia_semana', 'asc')
            ->orderBy('hora_inicio', 'asc')
            ->get();

        $diasMap = [
            1 => ['nombre' => 'Lunes', 'turnos' => []],
            2 => ['nombre' => 'Martes', 'turnos' => []],
            3 => ['nombre' => 'Miércoles', 'turnos' => []],
            4 => ['nombre' => 'Jueves', 'turnos' => []],
            5 => ['nombre' => 'Viernes', 'turnos' => []],
            6 => ['nombre' => 'Sábado', 'turnos' => []],
            7 => ['nombre' => 'Domingo', 'turnos' => []],
        ];

        foreach ($turnos as $t) {
            if (isset($diasMap[$t->dia_semana])) {
                $diasMap[$t->dia_semana]['turnos'][] = [
                    'id_turno'            => $t->id_turno,
                    'hora_inicio'         => substr($t->hora_inicio, 0, 5),
                    'hora_fin'            => substr($t->hora_fin, 0, 5),
                    'duracion_bloque_min' => $t->duracion_bloque_min,
                    'cupos'               => $t->cupos_totales,
                    'bloques'             => $t->generarBloques(),
                ];
            }
        }

        return response()->json([
            'success'        => true,
            'medico'         => "Dr(a). {$medico->nombre_completo}",
            'agenda_semanal' => $diasMap,
        ]);
    }
}
