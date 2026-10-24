<?php

namespace App\Models\PKG05_GestionCitasConcurrencia\CU11_ReprogramarCita;

use Illuminate\Database\Eloquent\Model;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

class HistorialReprogramacion extends Model
{
    protected $table = 'historial_reprogramaciones';
    protected $primaryKey = 'id_reprogramacion';

    public $timestamps = false;

    protected $fillable = [
        'id_cita',
        'fecha_anterior',
        'hora_inicio_anterior',
        'hora_fin_anterior',
        'id_medico_anterior',
        'fecha_nueva',
        'hora_inicio_nueva',
        'hora_fin_nueva',
        'id_medico_nuevo',
        'motivo_reprogramacion',
        'id_usuario_responsable',
        'fecha_operacion',
    ];

    protected $casts = [
        'fecha_anterior' => 'date:Y-m-d',
        'fecha_nueva'    => 'date:Y-m-d',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    public function medicoAnterior()
    {
        return $this->belongsTo(Medico::class, 'id_medico_anterior', 'id_medico');
    }

    public function medicoNuevo()
    {
        return $this->belongsTo(Medico::class, 'id_medico_nuevo', 'id_medico');
    }

    public function responsable()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_responsable', 'id_usuario');
    }
}
