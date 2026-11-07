<?php

namespace App\Services\PKG01_Seguridad;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\PKG01_Seguridad\CU22_BackupRestore\BackupLog;
use App\Models\PKG01_Seguridad\CU22_BackupRestore\BackupConfiguracion;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;

class CU22_BackupService
{
    /**
     * Formatear bytes a unidad legible (KB, MB, GB)
     */
    public function formatearBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return round($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return round($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }

    /**
     * Generar un respaldo físico y registrar en BD y Auditoría
     */
    public function generarBackup(
        string $tipo = 'COMPLETO',
        string $tipoDisparo = 'MANUAL',
        ?int $idUsuario = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): BackupLog {
        $idUsuario = $idUsuario ?? 1;

        $backupDir = storage_path('app/backups');
        if (!File::isDirectory($backupDir)) {
            File::makeDirectory($backupDir, 0755, true, true);
        }

        $timestamp = Carbon::now('America/La_Paz')->format('Ymd_His');
        $slugTipo = strtolower($tipo);
        $slugDisparo = strtolower($tipoDisparo);
        $nombreArchivo = "clinica_vidasalud_{$slugTipo}_{$slugDisparo}_{$timestamp}.sql";
        $rutaArchivo = $backupDir . DIRECTORY_SEPARATOR . $nombreArchivo;

        $tablas = [
            'roles', 'permisos', 'rol_permisos', 'usuarios', 'pacientes',
            'contactos_emergencia', 'historias_clinicas', 'especialidades',
            'medicos', 'medico_especialidades', 'turnos_medicos', 'bloqueos_agenda',
            'citas', 'reservas', 'atenciones_medicas', 'historial_reprogramaciones',
            'cancelaciones_citas', 'laboratorios_estudios', 'recordatorios', 'bitacora_auditoria',
            'backup_configuraciones'
        ];

        $sqlContent = "-- ==============================================================================\n";
        $sqlContent .= "-- CLÍNICA VIDA SALUD - RESPALDO DE BASE DE DATOS\n";
        $sqlContent .= "-- Tipo de Respaldo : {$tipo}\n";
        $sqlContent .= "-- Tipo de Disparo  : {$tipoDisparo}\n";
        $sqlContent .= "-- Fecha Generación : " . Carbon::now('America/La_Paz')->toIso8601String() . " (BOT)\n";
        $sqlContent .= "-- Motor de BD      : " . DB::connection()->getDriverName() . "\n";
        $sqlContent .= "-- ==============================================================================\n\n";

        $totalRegistrosDump = 0;
        $resumenTablas = [];

        foreach ($tablas as $tabla) {
            try {
                $count = DB::table($tabla)->count();
                $totalRegistrosDump += $count;
                $resumenTablas[$tabla] = $count;

                $sqlContent .= "-- Tabla: {$tabla} ({$count} registros)\n";
                if ($tipo !== 'SOLO_ESTRUCTURA' && $count > 0) {
                    $filas = DB::table($tabla)->get();
                    foreach ($filas as $fila) {
                        $campos = array_keys((array)$fila);
                        $valores = array_map(function ($val) {
                            if (is_null($val)) return 'NULL';
                            if (is_bool($val)) return $val ? 'TRUE' : 'FALSE';
                            if (is_numeric($val)) return $val;
                            return "'" . addslashes((string)$val) . "'";
                        }, array_values((array)$fila));

                        $sqlContent .= "INSERT INTO {$tabla} (" . implode(', ', $campos) . ") VALUES (" . implode(', ', $valores) . ") ON CONFLICT DO NOTHING;\n";
                    }
                }
                $sqlContent .= "\n";
            } catch (\Throwable $tbError) {
                $resumenTablas[$tabla] = 'omitida';
            }
        }

        File::put($rutaArchivo, $sqlContent);

        $tamanoBytes = File::size($rutaArchivo);
        $tamanoFormateado = $this->formatearBytes($tamanoBytes);
        $sha256 = hash_file('sha256', $rutaArchivo);

        $backup = BackupLog::create([
            'nombre_archivo'      => $nombreArchivo,
            'tipo_backup'         => $tipo,
            'tipo_disparo'        => $tipoDisparo,
            'tamano_bytes'        => $tamanoBytes,
            'tamano_formateado'   => $tamanoFormateado,
            'estado'              => 'COMPLETADO',
            'checksum_sha256'     => $sha256,
            'ruta_almacenamiento' => $rutaArchivo,
            'detalles'            => [
                'tablas_respaldadas'  => count($resumenTablas),
                'total_registros'     => $totalRegistrosDump,
                'resumen_por_tabla'   => $resumenTablas,
                'tipo_disparo'        => $tipoDisparo,
            ],
            'creado_por'          => $idUsuario,
            'fecha_creacion'      => Carbon::now('America/La_Paz'),
        ]);

        // Registrar en Bitácora de Auditoría
        BitacoraAuditoria::create([
            'id_usuario'           => $idUsuario,
            'modulo'               => 'SEGURIDAD',
            'tabla_afectada'       => 'backup_logs',
            'id_registro_afectado' => $backup->id_backup,
            'operacion'            => $tipoDisparo === 'PROGRAMADO' ? 'BACKUP_PROGRAMADO' : 'GENERACION_BACKUP',
            'valores_nuevos'       => [
                'archivo'      => $nombreArchivo,
                'tipo'         => $tipo,
                'disparo'      => $tipoDisparo,
                'tamano'       => $tamanoFormateado,
                'checksum'     => $sha256,
            ],
            'ip_address'           => $ip ?? '127.0.0.1',
            'user_agent'           => $userAgent ?? 'Sistema Scheduler/Cron',
            'fecha_creacion'       => Carbon::now('America/La_Paz'),
        ]);

        return $backup;
    }

    /**
     * Aplicar política de retención y purgado de respaldos antiguos
     */
    public function aplicarPoliticaRetencion(BackupConfiguracion $config): array
    {
        $eliminados = [];
        $dias = (int)$config->retencion_dias;
        $limiteArchivos = (int)$config->limite_archivos;

        // 1. Purgado por antigüedad (días)
        if ($dias > 0) {
            $fechaCorte = Carbon::now('America/La_Paz')->subDays($dias);
            $expirados = BackupLog::where('fecha_creacion', '<', $fechaCorte)->get();

            foreach ($expirados as $item) {
                if (File::exists($item->ruta_almacenamiento)) {
                    File::delete($item->ruta_almacenamiento);
                }
                $eliminados[] = [
                    'id_backup' => $item->id_backup,
                    'archivo'   => $item->nombre_archivo,
                    'motivo'    => "Expiró período de retención de {$dias} días",
                ];
                $item->delete();
            }
        }

        // 2. Purgado por límite máximo de archivos en disco (rotación FIFO)
        if ($limiteArchivos > 0) {
            $totalActual = BackupLog::count();
            if ($totalActual > $limiteArchivos) {
                $exceso = $totalActual - $limiteArchivos;
                $masAntiguos = BackupLog::orderBy('fecha_creacion', 'asc')->limit($exceso)->get();

                foreach ($masAntiguos as $antiguo) {
                    if (File::exists($antiguo->ruta_almacenamiento)) {
                        File::delete($antiguo->ruta_almacenamiento);
                    }
                    $eliminados[] = [
                        'id_backup' => $antiguo->id_backup,
                        'archivo'   => $antiguo->nombre_archivo,
                        'motivo'    => "Superado límite de rotación ({$limiteArchivos} archivos)",
                    ];
                    $antiguo->delete();
                }
            }
        }

        return $eliminados;
    }

    /**
     * Ejecutar la tarea programada automática del Cron/Scheduler
     */
    public function ejecutarTareaProgramada(bool $forzar = false): array
    {
        $config = BackupConfiguracion::first();
        if (!$config) {
            return [
                'ejecutado' => false,
                'motivo'    => 'No existe configuración de backups programados.',
            ];
        }

        $ahora = Carbon::now('America/La_Paz');

        if (!$forzar && !$config->habilitado) {
            return [
                'ejecutado' => false,
                'motivo'    => 'La programación automática se encuentra deshabilitada.',
            ];
        }

        if (!$forzar) {
            // Evaluar si corresponde ejecutar hoy
            $proximo = $config->proximo_respaldo_at ? Carbon::parse($config->proximo_respaldo_at)->setTimezone('America/La_Paz') : null;
            if ($proximo && $ahora->lt($proximo)) {
                return [
                    'ejecutado' => false,
                    'motivo'    => "Aún no es la hora programada. Próximo respaldo: " . $proximo->format('Y-m-d H:i:s'),
                ];
            }
        }

        try {
            // Generar el backup con tipo_disparo PROGRAMADO
            $backup = $this->generarBackup(
                tipo: $config->tipo_backup ?? 'COMPLETO',
                tipoDisparo: 'PROGRAMADO',
                idUsuario: $config->actualizado_por ?? 1,
                ip: '127.0.0.1',
                userAgent: 'Laravel Schedule Worker'
            );

            // Aplicar política de retención
            $eliminados = $this->aplicarPoliticaRetencion($config);

            // Calcular siguiente ejecución
            $siguiente = $config->calcularProximoRespaldo($ahora);

            $config->update([
                'ultimo_respaldo_at'      => $ahora,
                'proximo_respaldo_at'     => $siguiente,
                'estado_ultimo_respaldo'  => 'EXITOSO',
                'mensaje_ultimo_respaldo' => "Respaldo automático '{$backup->nombre_archivo}' completado. Tam: {$backup->tamano_formateado}.",
                'fecha_actualizacion'     => $ahora,
            ]);

            return [
                'ejecutado'      => true,
                'backup'         => $backup,
                'eliminados'     => $eliminados,
                'proximo_at'     => $siguiente ? $siguiente->format('Y-m-d H:i:s') : null,
                'mensaje'        => "Respaldo automático ejecutado exitosamente.",
            ];
        } catch (\Throwable $e) {
            Log::error("Error en tarea programada de backup: " . $e->getMessage());

            $config->update([
                'estado_ultimo_respaldo'  => 'FALLIDO',
                'mensaje_ultimo_respaldo' => "Fallo al ejecutar respaldo: " . $e->getMessage(),
                'fecha_actualizacion'     => $ahora,
            ]);

            return [
                'ejecutado' => false,
                'error'     => $e->getMessage(),
            ];
        }
    }
}

