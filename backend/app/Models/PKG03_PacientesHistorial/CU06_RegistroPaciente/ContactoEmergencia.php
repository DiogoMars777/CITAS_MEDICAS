<?php

namespace App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactoEmergencia extends Model
{
    protected $table = 'contactos_emergencia';
    protected $primaryKey = 'id_contacto';
    public $timestamps = false;

    protected $fillable = [
        'id_paciente',
        'nombre_completo',
        'parentesco',
        'telefono',
        'direccion',
    ];

    protected $casts = [
        'id_contacto' => 'integer',
        'id_paciente' => 'integer',
    ];

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }
}
