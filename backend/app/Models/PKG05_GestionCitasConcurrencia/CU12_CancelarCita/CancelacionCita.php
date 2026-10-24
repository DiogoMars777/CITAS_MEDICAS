<?php

namespace App\Models\PKG05_GestionCitasConcurrencia\CU12_CancelarCita;

use Illuminate\Database\Eloquent\Model;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

class CancelacionCita extends Model
{
    protected $table = 'cancelaciones_citas';
    protected $primaryKey = 'id_cancelacion';

    public $timestamps = false;

    protected $fillable = [
        'id_cita',
        'motivo_cancelacion',
        'id_usuario_responsable',
        'fecha_cancelacion',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    public function responsable()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_responsable', 'id_usuario');
    }
}
