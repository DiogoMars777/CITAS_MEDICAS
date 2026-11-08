<?php

namespace App\Controllers\PKG08_DashboardReportes\CU24_AsistenteVozIA;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Services\PKG08_DashboardReportes\CU24_AsistenteVozService;

/**
 * CU24: Asistente IA por Voz para Reserva Rápida de Citas
 * Integra Google Gemini API y síntesis de voz en español boliviano
 * Actor(es): Paciente, Recepcionista, Administrador
 */
class CU24_AsistenteVozController extends Controller
{
    protected CU24_AsistenteVozService $service;

    public function __construct(CU24_AsistenteVozService $service)
    {
        $this->service = $service;
    }

    /**
     * Interpreta la entrada de voz o texto del paciente y retorna los cupos disponibles
     */
    public function interpretarVoz(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'mensaje'         => 'required|string|min:2|max:1000',
            'id_paciente'     => 'nullable|integer|exists:pacientes,id_paciente',
            'contexto_previo' => 'nullable|array',
        ], [
            'mensaje.required' => 'Debe proporcionar el mensaje hablado o escrito del paciente.',
            'mensaje.min'      => 'El mensaje es demasiado corto para identificar una consulta clínica.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $resultado = $this->service->interpretarVoz(
                $request->input('mensaje'),
                $request->input('id_paciente'),
                $request->input('contexto_previo')
            );

            return response()->json([
                'success' => true,
                'data'    => $resultado,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Error al procesar la solicitud con el Asistente IA: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Confirma la reserva rápida de cita seleccionada por el paciente en 1 clic
     */
    public function confirmarReserva(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_medico'        => 'required|integer|exists:medicos,id_medico',
            'id_especialidad'  => 'required|integer|exists:especialidades,id_especialidad',
            'fecha_cita'       => 'required|date|after_or_equal:today',
            'hora_inicio'      => 'required|string',
            'hora_fin'         => 'nullable|string',
            'motivo_consulta'  => 'nullable|string|max:255',
            'id_paciente'      => 'nullable|integer|exists:pacientes,id_paciente',
            'id_conversacion'  => 'nullable|integer',
        ], [
            'id_medico.required'       => 'El médico es obligatorio.',
            'id_especialidad.required' => 'La especialidad es obligatoria.',
            'fecha_cita.required'      => 'La fecha de la cita es obligatoria.',
            'hora_inicio.required'     => 'La hora de inicio es obligatoria.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $idUsuario = $request->user()?->id_usuario ?? 1;
            $reserva = $this->service->confirmarReservaRapida($request->all(), $idUsuario);

            if (!$reserva['success']) {
                return response()->json([
                    'success' => false,
                    'error'   => $reserva['error'],
                ], 409);
            }

            return response()->json([
                'success' => true,
                'mensaje' => $reserva['mensaje'],
                'data'    => $reserva,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Error al confirmar la reserva médica: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retorna ejemplos clínicos recomendados para probar rápidamente
     */
    public function ejemplos(): JsonResponse
    {
        return response()->json([
            'success'  => true,
            'ejemplos' => $this->service->ejemplosGuiados(),
        ]);
    }

    /**
     * Retorna el estado actual de la integración con Google Gemini API
     */
    public function estadoMotor(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'estado'  => $this->service->obtenerEstadoMotor(),
        ]);
    }

    /**
     * Guarda la configuración de la API Key de Gemini en el backend
     */
    public function guardarConfiguracion(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'api_key' => 'required|string|min:10',
            'modelo'  => 'nullable|string',
        ], [
            'api_key.required' => 'La API Key de Google Gemini es obligatoria.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $ok = $this->service->guardarConfiguracionGemini(
                $request->input('api_key'),
                $request->input('modelo', 'gemini-2.5-flash')
            );

            return response()->json([
                'success' => $ok,
                'mensaje' => $ok ? 'Configuración de Gemini API actualizada con éxito.' : 'No se pudo guardar la configuración.',
                'estado'  => $this->service->obtenerEstadoMotor(),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Error al actualizar configuración: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retorna el historial de conversaciones recientes del Asistente IA
     */
    public function historial(Request $request): JsonResponse
    {
        $historial = DB::table('ia_conversaciones')
            ->leftJoin('pacientes', 'ia_conversaciones.id_paciente', '=', 'pacientes.id_paciente')
            ->leftJoin('citas', 'ia_conversaciones.id_cita_generada', '=', 'citas.id_cita')
            ->select(
                'ia_conversaciones.*',
                DB::raw("CONCAT(pacientes.nombres, ' ', pacientes.apellidos) as nombre_paciente"),
                'citas.fecha_cita',
                'citas.hora_inicio',
                'citas.estado_cita'
            )
            ->orderBy('ia_conversaciones.fecha_creacion', 'desc')
            ->take(15)
            ->get();

        return response()->json([
            'success'   => true,
            'historial' => $historial,
        ]);
    }
}

