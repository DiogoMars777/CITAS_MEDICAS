<?php

namespace App\Models\PKG05_GestionCitasConcurrencia\CU23_GestionarPagos;

use Illuminate\Database\Eloquent\Model;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;
use App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente\Paciente;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

class Pago extends Model
{
    protected $table = 'pagos';
    protected $primaryKey = 'id_pago';

    public $timestamps = true;
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_actualizacion';

    protected $fillable = [
        'codigo_pago',
        'id_cita',
        'id_paciente',
        'monto',
        'moneda',
        'metodo_pago',
        'estado_pago',
        'canal_pago',
        'numero_comprobante',
        'referencia_transaccion',
        'detalles_pago',
        'politica_reembolso',
        'id_usuario_cajero',
        'fecha_pago',
    ];

    protected $casts = [
        'monto'               => 'decimal:2',
        'detalles_pago'       => 'array',
        'fecha_pago'          => 'datetime',
        'fecha_creacion'      => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    /**
     * Cita médica asociada al pago
     */
    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    /**
     * Paciente titular del pago
     */
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }

    /**
     * Cajero o personal que registró el cobro
     */
    public function cajero()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_cajero', 'id_usuario');
    }
}

