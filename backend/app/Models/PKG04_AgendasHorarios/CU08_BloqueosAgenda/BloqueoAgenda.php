<?php

namespace App\Models\PKG04_AgendasHorarios\CU08_BloqueosAgenda;

use Illuminate\Database\Eloquent\Model;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;
use Carbon\Carbon;

class BloqueoAgenda extends Model
{
    protected $table = 'bloqueos_agenda';
    protected $primaryKey = 'id_bloqueo';

    public $timestamps = false;

    protected $fillable = [
        'id_medico',
        'fecha_inicio',
        'hora_inicio',
        'fecha_fin',
        'hora_fin',
        'motivo',
        'todo_el_dia',
        'creado_por',
        'fecha_creacion',
    ];

    protected $casts = [
        'fecha_inicio' => 'date:Y-m-d',
        'fecha_fin'    => 'date:Y-m-d',
        'todo_el_dia'  => 'boolean',
    ];

    /**
     * Médico afectado por el bloqueo
     */
    public function medico()
    {
        return $this->belongsTo(Medico::class, 'id_medico', 'id_medico');
    }

    /**
     * Usuario que registró el bloqueo
     */
    public function creador()
    {
        return $this->belongsTo(Usuario::class, 'creado_por', 'id_usuario');
    }

    /**
     * Verifica si este bloqueo solapa con una fecha y rango de horas de un slot
     */
    public function solapaConSlot(string $fecha, string $horaInicio, string $horaFin): bool
    {
        $fSlot = Carbon::parse($fecha)->format('Y-m-d');
        $fIni = Carbon::parse($this->fecha_inicio)->format('Y-m-d');
        $fFin = Carbon::parse($this->fecha_fin)->format('Y-m-d');

        // Fuera de rango de fechas
        if ($fSlot < $fIni || $fSlot > $fFin) {
            return false;
        }

        // Si es todo el día y la fecha coincide
        if ($this->todo_el_dia) {
            return true;
        }

        // Si es fecha intermedia en un rango multidia
        if ($fSlot > $fIni && $fSlot < $fFin) {
            return true;
        }

        // Para el día de inicio o fin, verificar horarios
        $hSlotIni = substr($horaInicio, 0, 5);
        $hSlotFin = substr($horaFin, 0, 5);
        $hBloqIni = substr($this->hora_inicio, 0, 5);
        $hBloqFin = substr($this->hora_fin, 0, 5);

        // Si fecha inicio == fecha fin
        if ($fIni === $fFin) {
            return ($hSlotIni < $hBloqFin && $hSlotFin > $hBloqIni);
        }

        // Si es el primer día
        if ($fSlot === $fIni) {
            return ($hSlotFin > $hBloqIni);
        }

        // Si es el último día
        if ($fSlot === $fFin) {
            return ($hSlotIni < $hBloqFin);
        }

        return false;
    }
}
