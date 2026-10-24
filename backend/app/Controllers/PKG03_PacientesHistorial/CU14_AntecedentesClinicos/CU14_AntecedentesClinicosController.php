<?php

namespace App\Controllers\PKG03_PacientesHistorial\CU14_AntecedentesClinicos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

use App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente\Paciente;
use App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente\HistoriaClinica;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;

/**
 * CU14 - Registrar y actualizar antecedentes clínicos base
 * Actor(es): Médico, Recepcionista
 */
class CU14_AntecedentesClinicosController extends Controller
{
    /**
     * Listado de antecedentes clínicos base de los pacientes
     */
    public function index(Request $request): JsonResponse
    {
        $query = Paciente::with(['historiaClinica', 'contactoEmergencia'])
            ->where('estado', 'ACTIVO')
            ->orderBy('apellidos', 'asc');

        if ($request->filled('search')) {
            $search = strtolower(trim($request->input('search')));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nombres) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(apellidos) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(ci) LIKE ?', ["%{$search}%"])
                  ->orWhereHas('historiaClinica', function ($hq) use ($search) {
                      $hq->whereRaw('LOWER(numero_expediente) LIKE ?', ["%{$search}%"])
                         ->orWhereRaw('LOWER(alergias_medicamentos) LIKE ?', ["%{$search}%"]);
                  });
            });
        }

        if ($request->filled('tipo_sangre')) {
            $ts = $request->input('tipo_sangre');
            $query->whereHas('historiaClinica', function ($q) use ($ts) {
                $q->where('tipo_sangre', $ts);
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        $pacientes = $query->paginate($perPage);

        $pacientes->getCollection()->transform(function ($p) {
            $hc = $p->historiaClinica;
            $ce = $p->contactoEmergencia;

            return [
                'id_paciente'               => $p->id_paciente,
                'nombre_completo'           => "{$p->apellidos}, {$p->nombres}",
                'ci'                        => $p->ci,
                'fecha_nacimiento'          => $p->fecha_nacimiento,
                'genero'                    => $p->genero,
                'telefono'                  => $p->telefono,
                'email'                     => $p->email,
                'id_historia_clinica'       => $hc?->id_historia_clinica,
                'numero_expediente'         => $hc?->numero_expediente ?? 'Sin expediente',
                'tipo_sangre'               => $hc?->tipo_sangre ?? 'No registrado',
                'alergias_medicamentos'     => $hc?->alergias_medicamentos ?? 'Ninguna registrada',
                'enfermedades_hereditarias' => $hc?->enfermedades_hereditarias ?? 'Ninguna registrada',
                'antecedentes_patologicos'  => $hc?->antecedentes_patologicos ?? 'Ninguno registrado',
                'antecedentes_quirurgicos'  => $hc?->antecedentes_quirurgicos ?? 'Ninguno registrado',
                'fecha_apertura'            => $hc?->fecha_apertura,
                'fecha_actualizacion'       => $hc?->fecha_actualizacion,
                'contacto_emergencia'       => $ce ? [
                    'nombre'    => $ce->nombre_contacto,
                    'parentesco' => $ce->parentesco,
                    'telefono'  => $ce->telefono_contacto,
                ] : null,
            ];
        });

        $kpis = [
            'total_expedientes'     => HistoriaClinica::count(),
            'con_tipo_sangre'       => HistoriaClinica::whereNotNull('tipo_sangre')->where('tipo_sangre', '!=', '')->count(),
            'con_alergias_alertas'  => HistoriaClinica::whereNotNull('alergias_medicamentos')
                                        ->where('alergias_medicamentos', '!=', 'Ninguna')
                                        ->where('alergias_medicamentos', '!=', '')->count(),
        ];

        return response()->json([
            'success' => true,
            'kpis'    => $kpis,
            'data'    => $pacientes,
        ]);
    }

    /**
     * Ver expediente clínico base individual
     */
    public function show(int $idPaciente): JsonResponse
    {
        $paciente = Paciente::with(['historiaClinica', 'contactoEmergencia'])->find($idPaciente);

        if (!$paciente) {
            return response()->json(['success' => false, 'message' => 'Paciente no encontrado.'], 404);
        }

        $hc = $paciente->historiaClinica;
        $ce = $paciente->contactoEmergencia;

        return response()->json([
            'success' => true,
            'data'    => [
                'id_paciente'               => $paciente->id_paciente,
                'nombre_completo'           => "{$paciente->nombres} {$paciente->apellidos}",
                'ci'                        => $paciente->ci,
                'fecha_nacimiento'          => $paciente->fecha_nacimiento,
                'genero'                    => $paciente->genero,
                'telefono'                  => $paciente->telefono,
                'id_historia_clinica'       => $hc?->id_historia_clinica,
                'numero_expediente'         => $hc?->numero_expediente ?? 'N/A',
                'tipo_sangre'               => $hc?->tipo_sangre ?? '',
                'alergias_medicamentos'     => $hc?->alergias_medicamentos ?? '',
                'enfermedades_hereditarias' => $hc?->enfermedades_hereditarias ?? '',
                'antecedentes_patologicos'  => $hc?->antecedentes_patologicos ?? '',
                'antecedentes_quirurgicos'  => $hc?->antecedentes_quirurgicos ?? '',
                'fecha_apertura'            => $hc?->fecha_apertura,
                'fecha_actualizacion'       => $hc?->fecha_actualizacion,
                'contacto_emergencia'       => $ce ? [
                    'nombre'     => $ce->nombre_contacto,
                    'parentesco' => $ce->parentesco,
                    'telefono'   => $ce->telefono_contacto,
                ] : null,
            ],
        ]);
    }

    /**
     * Actualizar antecedentes clínicos base del paciente
     */
    public function update(Request $request, int $idPaciente): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tipo_sangre'               => 'nullable|string|in:O+,O-,A+,A-,B+,B-,AB+,AB-',
            'alergias_medicamentos'     => 'nullable|string|max:500',
            'enfermedades_hereditarias' => 'nullable|string|max:500',
            'antecedentes_patologicos'  => 'nullable|string|max:500',
            'antecedentes_quirurgicos'  => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor verifique los datos del expediente clínico.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $paciente = Paciente::with('historiaClinica')->find($idPaciente);
        if (!$paciente) {
            return response()->json(['success' => false, 'message' => 'Paciente no encontrado.'], 404);
        }

        $hc = $paciente->historiaClinica;
        $timezone = 'America/La_Paz';
        $ahoraBolivia = Carbon::now($timezone);
        $usuarioId = $request->user()?->id_usuario ?? 1;

        if (!$hc) {
            // Si no tiene expediente, crearlo
            $anio = date('Y');
            $correlativo = HistoriaClinica::count() + 1;
            $numExp = sprintf('HC-%s-%05d', $anio, $correlativo);

            $hc = new HistoriaClinica();
            $hc->id_paciente = $paciente->id_paciente;
            $hc->numero_expediente = $numExp;
            $hc->fecha_apertura = $ahoraBolivia->format('Y-m-d H:i:s');
        }

        $datosAnteriores = [
            'tipo_sangre'               => $hc->tipo_sangre,
            'alergias_medicamentos'     => $hc->alergias_medicamentos,
            'enfermedades_hereditarias' => $hc->enfermedades_hereditarias,
            'antecedentes_patologicos'  => $hc->antecedentes_patologicos,
            'antecedentes_quirurgicos'  => $hc->antecedentes_quirurgicos,
        ];

        $hc->tipo_sangre               = $request->input('tipo_sangre');
        $hc->alergias_medicamentos     = $request->input('alergias_medicamentos');
        $hc->enfermedades_hereditarias = $request->input('enfermedades_hereditarias');
        $hc->antecedentes_patologicos  = $request->input('antecedentes_patologicos');
        $hc->antecedentes_quirurgicos  = $request->input('antecedentes_quirurgicos');
        $hc->fecha_actualizacion       = $ahoraBolivia->format('Y-m-d H:i:s');
        $hc->save();

        BitacoraAuditoria::registrar(
            'PKG03_PacientesHistorial',
            'historias_clinicas',
            $hc->id_historia_clinica,
            'UPDATE',
            $datosAnteriores,
            [
                'paciente'                  => "{$paciente->nombres} {$paciente->apellidos}",
                'ci'                        => $paciente->ci,
                'numero_expediente'         => $hc->numero_expediente,
                'tipo_sangre'               => $hc->tipo_sangre,
                'alergias_medicamentos'     => $hc->alergias_medicamentos,
                'enfermedades_hereditarias' => $hc->enfermedades_hereditarias,
                'antecedentes_patologicos'  => $hc->antecedentes_patologicos,
                'antecedentes_quirurgicos'  => $hc->antecedentes_quirurgicos,
            ],
            $usuarioId,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => "Antecedentes clínicos base del paciente {$paciente->nombres} {$paciente->apellidos} actualizados exitosamente.",
            'data'    => $hc,
        ]);
    }
}
