<?php

namespace App\Models\PKG08_DashboardReportes\CU19_Recordatorios;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;

class Recordatorio extends Model
{
    protected $table = 'recordatorios';
    protected $primaryKey = 'id_recordatorio';

    public $timestamps = false;

    protected $fillable = [
        'id_cita',
        'tipo_canal', // EMAIL, SMS, WHATSAPP
        'fecha_programada',
        'fecha_envio',
        'estado_envio', // PENDIENTE, ENVIADO, FALLIDO
        'intentos',
        'mensaje',
    ];

    protected $casts = [
        'id_recordatorio'  => 'integer',
        'id_cita'          => 'integer',
        'intentos'         => 'integer',
        'fecha_programada' => 'datetime',
        'fecha_envio'      => 'datetime',
    ];

    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }
}

