<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PKG01_Seguridad\CU22_BackupService;
use Carbon\Carbon;

class EjecutarBackupProgramadoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:run-scheduled {--force : Forzar la ejecución inmediata ignorando la fecha/hora programada}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalúa y ejecuta el respaldo automatizado de la base de datos de Clínica Vida Salud según la programación configurada';

    /**
     * Execute the console command.
     */
    public function handle(CU22_BackupService $backupService): int
    {
        $forzar = (bool)$this->option('force');
        $ahora = Carbon::now('America/La_Paz')->format('Y-m-d H:i:s');

        $this->info("[{$ahora}] Iniciando verificación de tarea programada de backup...");

        $resultado = $backupService->ejecutarTareaProgramada($forzar);

        if ($resultado['ejecutado']) {
            $backup = $resultado['backup'];
            $this->info("✔ Respaldo automático generado con éxito:");
            $this->line("   - Archivo:  {$backup->nombre_archivo}");
            $this->line("   - Tamaño:   {$backup->tamano_formateado}");
            $this->line("   - SHA-256:  {$backup->checksum_sha256}");
            $this->line("   - Próximo:  {$resultado['proximo_at']}");

            if (!empty($resultado['eliminados'])) {
                $this->warn("   - Política de retención: Se purgaron " . count($resultado['eliminados']) . " respaldos antiguos.");
            }

            return Command::SUCCESS;
        }

        if (isset($resultado['error'])) {
            $this->error("✖ Error al ejecutar respaldo programado: " . $resultado['error']);
            return Command::FAILURE;
        }

        $this->comment("ℹ {$resultado['motivo']}");
        return Command::SUCCESS;
    }
}
