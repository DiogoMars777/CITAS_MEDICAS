<?php

namespace App\Models\PKG04_AgendasHorarios\CU07_ConfigurarTurnos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;

class TurnoMedico extends Model
{
    protected $table = 'turnos_medicos';
    protected $primaryKey = 'id_turno';
    public $timestamps = false;

    protected $fillable = [
        'id_medico',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
        'duracion_bloque_min',
        'estado',
    ];

    protected $casts = [
        'id_turno'            => 'integer',
        'id_medico'           => 'integer',
        'dia_semana'          => 'integer',
        'duracion_bloque_min' => 'integer',
    ];

    /**
     * Médico titular del turno
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico', 'id_medico');
    }

    /**
     * Nombre textual del día de la semana
     */
    public function getDiaNombreAttribute(): string
    {
        $dias = [
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
            7 => 'Domingo',
        ];

        return $dias[$this->dia_semana] ?? 'Desconocido';
    }

    /**
     * Conteo total de cupos o citas posibles en el turno
     */
    public function getCuposTotalesAttribute(): int
    {
        if (!$this->hora_inicio || !$this->hora_fin || !$this->duracion_bloque_min) {
            return 0;
        }

        $inicio = Carbon::parse($this->hora_inicio);
        $fin = Carbon::parse($this->hora_fin);

        if ($fin->lessThanOrEqualTo($inicio)) {
            return 0;
        }

        $minutos = abs($fin->diffInMinutes($inicio));
        return (int) floor($minutos / $this->duracion_bloque_min);
    }

    /**
     * Desglose de bloques de 15 minutos generados para el turno
     */
    public function generarBloques(): array
    {
        $bloques = [];
        $inicio = Carbon::parse($this->hora_inicio);
        $fin = Carbon::parse($this->hora_fin);
        $duracion = $this->duracion_bloque_min ?: 15;

        while ($inicio->copy()->addMinutes($duracion)->lessThanOrEqualTo($fin)) {
            $slotFin = $inicio->copy()->addMinutes($duracion);
            $bloques[] = [
                'inicio' => $inicio->format('H:i'),
                'fin'    => $slotFin->format('H:i'),
                'etiqueta' => $inicio->format('H:i') . ' - ' . $slotFin->format('H:i'),
            ];
            $inicio->addMinutes($duracion);
        }

        return $bloques;
    }
}
