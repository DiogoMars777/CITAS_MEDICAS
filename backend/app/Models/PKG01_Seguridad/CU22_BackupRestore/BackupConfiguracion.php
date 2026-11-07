<?php

namespace App\Models\PKG01_Seguridad\CU22_BackupRestore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;
use Carbon\Carbon;

class BackupConfiguracion extends Model
{
    protected $table = 'backup_configuraciones';
    protected $primaryKey = 'id_configuracion';

    public $timestamps = false;

    protected $fillable = [
        'habilitado',
        'frecuencia',
        'dia_semana',
        'dia_mes',
        'hora_ejecucion',
        'tipo_backup',
        'retencion_dias',
        'limite_archivos',
        'email_notificacion',
        'ultimo_respaldo_at',
        'proximo_respaldo_at',
        'estado_ultimo_respaldo',
        'mensaje_ultimo_respaldo',
        'actualizado_por',
        'fecha_creacion',
        'fecha_actualizacion',
    ];

    protected $casts = [
        'id_configuracion'   => 'integer',
        'habilitado'         => 'boolean',
        'dia_semana'         => 'integer',
        'dia_mes'            => 'integer',
        'retencion_dias'     => 'integer',
        'limite_archivos'    => 'integer',
        'actualizado_por'    => 'integer',
        'ultimo_respaldo_at' => 'datetime',
        'proximo_respaldo_at'=> 'datetime',
        'fecha_creacion'     => 'datetime',
        'fecha_actualizacion'=> 'datetime',
    ];

    public function actualizadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'actualizado_por', 'id_usuario');
    }

    /**
     * Calcular con precisión la fecha y hora del próximo respaldo automático
     */
    public function calcularProximoRespaldo(?Carbon $desde = null): ?Carbon
    {
        if (!$this->habilitado) {
            return null;
        }

        $zona = 'America/La_Paz';
        $ahora = $desde ? $desde->copy()->setTimezone($zona) : Carbon::now($zona);

        $partesHora = explode(':', $this->hora_ejecucion ?? '02:00');
        $hora = (int)($partesHora[0] ?? 2);
        $minuto = (int)($partesHora[1] ?? 0);

        if ($this->frecuencia === 'DIARIO') {
            $candidato = $ahora->copy()->setTime($hora, $minuto, 0);
            if ($candidato->isFuture()) {
                return $candidato;
            }
            return $candidato->addDay();
        }

        if ($this->frecuencia === 'SEMANAL') {
            // dia_semana: 1 (Lunes) ... 7 (Domingo)
            $diaDeseado = (int)($this->dia_semana ?: 1);
            $diaActual = $ahora->dayOfWeekIso; // 1 (Mon) a 7 (Sun)

            if ($diaActual === $diaDeseado) {
                $candidato = $ahora->copy()->setTime($hora, $minuto, 0);
                if ($candidato->isFuture()) {
                    return $candidato;
                }
            }

            $diasHastaObjetivo = ($diaDeseado - $diaActual + 7) % 7;
            if ($diasHastaObjetivo === 0) {
                $diasHastaObjetivo = 7;
            }

            return $ahora->copy()->addDays($diasHastaObjetivo)->setTime($hora, $minuto, 0);
        }

        if ($this->frecuencia === 'MENSUAL') {
            $diaDeseado = (int)($this->dia_mes ?: 1);

            // Verificar este mes
            $diasEnMesActual = $ahora->daysInMonth;
            $diaAjustado = min($diaDeseado, $diasEnMesActual);
            $candidato = $ahora->copy()->setDate($ahora->year, $ahora->month, $diaAjustado)->setTime($hora, $minuto, 0);

            if ($candidato->isFuture()) {
                return $candidato;
            }

            // Próximo mes
            $proximoMes = $ahora->copy()->addMonthNoOverflow();
            $diasEnProxMes = $proximoMes->daysInMonth;
            $diaAjustadoProx = min($diaDeseado, $diasEnProxMes);

            return $proximoMes->setDate($proximoMes->year, $proximoMes->month, $diaAjustadoProx)->setTime($hora, $minuto, 0);
        }

        return $ahora->copy()->addDay()->setTime($hora, $minuto, 0);
    }
}
