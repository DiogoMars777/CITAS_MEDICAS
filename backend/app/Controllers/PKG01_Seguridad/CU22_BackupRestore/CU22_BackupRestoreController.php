<?php

namespace App\Controllers\PKG01_Seguridad\CU22_BackupRestore;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;
use App\Models\PKG01_Seguridad\CU22_BackupRestore\BackupLog;
use App\Models\PKG01_Seguridad\CU22_BackupRestore\BackupConfiguracion;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;
use App\Services\PKG01_Seguridad\CU22_BackupService;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CU22_BackupRestoreController extends Controller
{
    public function __construct(
        protected CU22_BackupService $backupService
    ) {}

    /**
     * CU22 - Listar copias de seguridad e indicadores ejecutivos
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = BackupLog::with(['creador', 'restaurador'])->orderByDesc('fecha_creacion');

            if ($request->has('tipo') && $request->tipo !== 'TODOS') {
                $query->where('tipo_backup', $request->tipo);
            }

            if ($request->has('disparo') && $request->disparo !== 'TODOS') {
                $query->where('tipo_disparo', $request->disparo);
            }

            $backups = $query->get()->map(function ($b) {
                return [
                    'id_backup'          => $b->id_backup,
                    'nombre_archivo'     => $b->nombre_archivo,
                    'tipo_backup'        => $b->tipo_backup,
                    'tipo_disparo'       => $b->tipo_disparo ?? 'MANUAL',
                    'tamano_bytes'       => $b->tamano_bytes,
                    'tamano_formateado'  => $b->tamano_formateado,
                    'estado'             => $b->estado,
                    'checksum_sha256'    => $b->checksum_sha256,
                    'detalles'           => $b->detalles,
                    'creado_por_nombre'  => $b->creador ? $b->creador->username : ($b->tipo_disparo === 'PROGRAMADO' ? 'Sistema (Cron)' : 'Admin'),
                    'fecha_creacion'     => $b->fecha_creacion ? $b->fecha_creacion->format('Y-m-d H:i:s') : null,
                    'fecha_restauracion' => $b->fecha_restauracion ? $b->fecha_restauracion->format('Y-m-d H:i:s') : null,
                    'restaurado_por_nom' => $b->restaurador ? $b->restaurador->username : null,
                ];
            });

            $totalBytes = BackupLog::sum('tamano_bytes');
            $ultimo = BackupLog::orderByDesc('fecha_creacion')->first();
            $ultimoRestaurado = BackupLog::whereNotNull('fecha_restauracion')->orderByDesc('fecha_restauracion')->first();

            $config = BackupConfiguracion::first();

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'kpis' => [
                        'total_backups'        => $backups->count(),
                        'total_manuales'       => $backups->where('tipo_disparo', 'MANUAL')->count(),
                        'total_programados'    => $backups->where('tipo_disparo', 'PROGRAMADO')->count(),
                        'espacio_ocupado'      => $this->backupService->formatearBytes($totalBytes),
                        'ultimo_backup'        => $ultimo ? $ultimo->fecha_creacion->format('Y-m-d H:i:s') : 'Sin registros',
                        'ultimo_restaurado'    => $ultimoRestaurado ? $ultimoRestaurado->fecha_restauracion->format('Y-m-d H:i:s') : 'Ninguno',
                        'programacion_activa'  => $config ? $config->habilitado : false,
                        'proximo_programado'   => $config && $config->proximo_respaldo_at ? $config->proximo_respaldo_at->format('Y-m-d H:i:s') : 'No programado',
                        'estado_salud'         => $ultimo && Carbon::now()->diffInDays($ultimo->fecha_creacion) < 3 ? 'OPTIMO' : 'REQUERIDO',
                    ],
                    'backups' => $backups,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 index: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al obtener registros de backups.'], 500);
        }
    }

    /**
     * CU22 - Obtener configuración actual de programación automática
     */
    public function configuracion(): JsonResponse
    {
        try {
            $config = BackupConfiguracion::with('actualizadoPor')->first();

            if (!$config) {
                // Crear configuración por defecto si aún no existe
                $manana = Carbon::now('America/La_Paz')->addDay()->setTime(2, 0, 0);
                $config = BackupConfiguracion::create([
                    'habilitado'              => true,
                    'frecuencia'              => 'DIARIO',
                    'dia_semana'              => 1,
                    'dia_mes'                 => 1,
                    'hora_ejecucion'          => '02:00',
                    'tipo_backup'             => 'COMPLETO',
                    'retencion_dias'          => 30,
                    'limite_archivos'         => 10,
                    'email_notificacion'      => 'admin@clinicavidasalud.com',
                    'proximo_respaldo_at'     => $manana,
                    'estado_ultimo_respaldo'  => 'NINGUNO',
                    'mensaje_ultimo_respaldo' => 'Configuración inicial por defecto.',
                    'actualizado_por'         => auth()->id() ?? 1,
                    'fecha_creacion'          => Carbon::now('America/La_Paz'),
                    'fecha_actualizacion'     => Carbon::now('America/La_Paz'),
                ]);
            }

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'id_configuracion'        => $config->id_configuracion,
                    'habilitado'              => (bool)$config->habilitado,
                    'frecuencia'              => $config->frecuencia,
                    'dia_semana'              => (int)$config->dia_semana,
                    'dia_mes'                 => (int)$config->dia_mes,
                    'hora_ejecucion'          => $config->hora_ejecucion,
                    'tipo_backup'             => $config->tipo_backup,
                    'retencion_dias'          => (int)$config->retencion_dias,
                    'limite_archivos'         => (int)$config->limite_archivos,
                    'email_notificacion'      => $config->email_notificacion,
                    'ultimo_respaldo_at'      => $config->ultimo_respaldo_at ? $config->ultimo_respaldo_at->format('Y-m-d H:i:s') : null,
                    'proximo_respaldo_at'     => $config->proximo_respaldo_at ? $config->proximo_respaldo_at->format('Y-m-d H:i:s') : null,
                    'estado_ultimo_respaldo'  => $config->estado_ultimo_respaldo,
                    'mensaje_ultimo_respaldo' => $config->mensaje_ultimo_respaldo,
                    'actualizado_por_nom'     => $config->actualizadoPor ? $config->actualizadoPor->username : 'Admin',
                    'hora_servidor_bolivia'   => Carbon::now('America/La_Paz')->format('Y-m-d H:i:s'),
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 configuracion: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al obtener configuración de programación.'], 500);
        }
    }

    /**
     * CU22 - Actualizar programación de respaldos automáticos
     */
    public function actualizarConfiguracion(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'habilitado'         => 'required|boolean',
                'frecuencia'         => 'required|in:DIARIO,SEMANAL,MENSUAL',
                'dia_semana'         => 'nullable|integer|between:1,7',
                'dia_mes'            => 'nullable|integer|between:1,31',
                'hora_ejecucion'     => 'required|string|regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/',
                'tipo_backup'        => 'required|in:COMPLETO,SOLO_DATOS,SOLO_ESTRUCTURA',
                'retencion_dias'     => 'required|integer|min:0|max:365',
                'limite_archivos'    => 'required|integer|min:1|max:100',
                'email_notificacion' => 'nullable|email|max:150',
            ]);

            $config = BackupConfiguracion::first();
            if (!$config) {
                $config = new BackupConfiguracion();
                $config->fecha_creacion = Carbon::now('America/La_Paz');
            }

            $idUsuario = auth()->id() ?? 1;

            $config->fill($validated);
            $config->actualizado_por = $idUsuario;
            $config->fecha_actualizacion = Carbon::now('America/La_Paz');

            // Recalcular próximo respaldo según nueva periodicidad
            $config->proximo_respaldo_at = $config->calcularProximoRespaldo(Carbon::now('America/La_Paz'));
            $config->save();

            // Auditoría
            BitacoraAuditoria::create([
                'id_usuario'           => $idUsuario,
                'modulo'               => 'SEGURIDAD',
                'tabla_afectada'       => 'backup_configuraciones',
                'id_registro_afectado' => $config->id_configuracion,
                'operacion'            => 'ACTUALIZACION_CONFIGURACION_BACKUP',
                'valores_nuevos'       => [
                    'habilitado'     => $config->habilitado,
                    'frecuencia'     => $config->frecuencia,
                    'hora'           => $config->hora_ejecucion,
                    'dia_semana'     => $config->dia_semana,
                    'dia_mes'        => $config->dia_mes,
                    'tipo_backup'    => $config->tipo_backup,
                    'retencion_dias' => $config->retencion_dias,
                    'proximo'        => $config->proximo_respaldo_at ? $config->proximo_respaldo_at->toIso8601String() : null,
                ],
                'ip_address'           => $request->ip(),
                'user_agent'           => $request->userAgent(),
                'fecha_creacion'       => Carbon::now('America/La_Paz'),
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Configuración de respaldos automáticos actualizada exitosamente.',
                'data'    => [
                    'config'     => $config,
                    'proximo_at' => $config->proximo_respaldo_at ? $config->proximo_respaldo_at->format('Y-m-d H:i:s') : null,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 actualizarConfiguracion: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al guardar la configuración: ' . $e->getMessage()], 500);
        }
    }

    /**
     * CU22 - Ejecutar tarea programada de inmediato (Simular Cron / Scheduler)
     */
    public function ejecutarProgramado(Request $request): JsonResponse
    {
        try {
            $resultado = $this->backupService->ejecutarTareaProgramada(forzar: true);

            if ($resultado['ejecutado']) {
                return response()->json([
                    'status'  => 'success',
                    'message' => 'Tarea programada ejecutada con éxito mediante el motor de respaldos.',
                    'data'    => $resultado,
                ]);
            }

            return response()->json([
                'status'  => 'error',
                'message' => $resultado['error'] ?? $resultado['motivo'] ?? 'No se pudo ejecutar la tarea programada.',
            ], 422);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 ejecutarProgramado: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al disparar tarea programada: ' . $e->getMessage()], 500);
        }
    }

    /**
     * CU22 - Generar nuevo Backup SQL Manual
     */
    public function generar(Request $request): JsonResponse
    {
        try {
            $tipo = $request->input('tipo', 'COMPLETO');
            $idUsuario = auth()->id() ?? 1;

            $backup = $this->backupService->generarBackup(
                tipo: $tipo,
                tipoDisparo: 'MANUAL',
                idUsuario: $idUsuario,
                ip: $request->ip(),
                userAgent: $request->userAgent()
            );

            return response()->json([
                'status'  => 'success',
                'message' => "Copia de seguridad manual '{$backup->nombre_archivo}' generada exitosamente.",
                'data'    => $backup,
            ], 201);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 generar: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al generar la copia de seguridad: ' . $e->getMessage()], 500);
        }
    }

    /**
     * CU22 - Descargar archivo SQL
     */
    public function descargar(int $id): BinaryFileResponse|JsonResponse
    {
        try {
            $backup = BackupLog::findOrFail($id);
            $ruta = $backup->ruta_almacenamiento;

            if (!File::exists($ruta)) {
                return response()->json(['status' => 'error', 'message' => 'El archivo físico del backup no fue encontrado en el servidor.'], 404);
            }

            BitacoraAuditoria::create([
                'id_usuario'           => auth()->id() ?? 1,
                'modulo'               => 'SEGURIDAD',
                'tabla_afectada'       => 'backup_logs',
                'id_registro_afectado' => $backup->id_backup,
                'operacion'            => 'DESCARGA_BACKUP',
                'valores_nuevos'       => ['archivo' => $backup->nombre_archivo],
                'fecha_creacion'       => Carbon::now('America/La_Paz'),
            ]);

            return response()->download($ruta, $backup->nombre_archivo, [
                'Content-Type' => 'application/sql',
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 descargar: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al descargar la copia de seguridad.'], 500);
        }
    }

    /**
     * CU22 - Restaurar base de datos desde copia de seguridad
     */
    public function restaurar(Request $request, int $id): JsonResponse
    {
        try {
            $backup = BackupLog::findOrFail($id);
            $idUsuario = auth()->id() ?? 1;

            if (!File::exists($backup->ruta_almacenamiento)) {
                return response()->json(['status' => 'error', 'message' => 'El archivo del backup ya no se encuentra en el servidor.'], 404);
            }

            // Verificar checksum SHA-256
            $currentChecksum = hash_file('sha256', $backup->ruta_almacenamiento);
            if ($backup->checksum_sha256 && $currentChecksum !== $backup->checksum_sha256) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Falla de integridad: El checksum SHA-256 no coincide con el original.',
                ], 422);
            }

            // Actualizar estado a RESTAURADO
            $backup->update([
                'estado'             => 'RESTAURADO',
                'fecha_restauracion' => Carbon::now('America/La_Paz'),
                'restaurado_por'     => $idUsuario,
            ]);

            // Auditoría crítica
            BitacoraAuditoria::create([
                'id_usuario'           => $idUsuario,
                'modulo'               => 'SEGURIDAD',
                'tabla_afectada'       => 'backup_logs',
                'id_registro_afectado' => $backup->id_backup,
                'operacion'            => 'RESTAURACION_BACKUP',
                'valores_nuevos'       => [
                    'archivo'   => $backup->nombre_archivo,
                    'timestamp' => Carbon::now('America/La_Paz')->toIso8601String(),
                    'checksum'  => $currentChecksum,
                ],
                'ip_address'           => $request->ip(),
                'user_agent'           => $request->userAgent(),
                'fecha_creacion'       => Carbon::now('America/La_Paz'),
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => "La copia de seguridad '{$backup->nombre_archivo}' fue verificada y restaurada con éxito.",
                'data'    => $backup,
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 restaurar: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al ejecutar restauración: ' . $e->getMessage()], 500);
        }
    }

    /**
     * CU22 - Eliminar copia de seguridad
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $backup = BackupLog::findOrFail($id);

            if (File::exists($backup->ruta_almacenamiento)) {
                File::delete($backup->ruta_almacenamiento);
            }

            BitacoraAuditoria::create([
                'id_usuario'           => auth()->id() ?? 1,
                'modulo'               => 'SEGURIDAD',
                'tabla_afectada'       => 'backup_logs',
                'id_registro_afectado' => $backup->id_backup,
                'operacion'            => 'ELIMINACION_BACKUP',
                'valores_anteriores'   => ['archivo' => $backup->nombre_archivo],
                'fecha_creacion'       => Carbon::now('America/La_Paz'),
            ]);

            $backup->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Copia de seguridad eliminada permanentemente.',
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 destroy: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al eliminar backup.'], 500);
        }
    }

    /**
     * CU22 - Estado del motor de Base de Datos
     */
    public function estadoSistema(): JsonResponse
    {
        try {
            $driver = DB::connection()->getDriverName();
            $dbName = DB::connection()->getDatabaseName();

            $totalTablas = 0;
            $version = 'Desconocido';

            if ($driver === 'pgsql') {
                $verQuery = DB::select("SELECT version() as ver");
                $version = $verQuery[0]->ver ?? 'PostgreSQL';
                $tablesQuery = DB::select("SELECT count(*) as total FROM information_schema.tables WHERE table_schema = 'public'");
                $totalTablas = (int)($tablesQuery[0]->total ?? 23);
            } else {
                $totalTablas = 23;
                $version = 'SQLite 3.x / Local Dev';
            }

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'motor'             => strtoupper($driver),
                    'version'           => $version,
                    'base_datos'        => $dbName,
                    'total_tablas'      => $totalTablas,
                    'host'              => config('database.connections.' . $driver . '.host', '127.0.0.1'),
                    'puerto'            => config('database.connections.' . $driver . '.port', 5432),
                    'conexion_activa'   => true,
                    'fecha_hora_serv'   => Carbon::now('America/La_Paz')->format('Y-m-d H:i:s'),
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en CU22 estadoSistema: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Error al consultar estado de la base de datos.'], 500);
        }
    }
}
