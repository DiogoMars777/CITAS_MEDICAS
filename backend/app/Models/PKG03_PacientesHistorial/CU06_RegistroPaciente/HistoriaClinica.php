<?php

namespace App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaClinica extends Model
{
    protected $table = 'historias_clinicas';
    protected $primaryKey = 'id_historia_clinica';

    const CREATED_AT = 'fecha_apertura';
    const UPDATED_AT = 'fecha_actualizacion';

    protected $fillable = [
        'id_paciente',
        'numero_expediente',
        'tipo_sangre',
        'alergias_medicamentos',
        'enfermedades_hereditarias',
        'antecedentes_patologicos',
        'antecedentes_quirurgicos',
    ];

    protected $casts = [
        'id_historia_clinica' => 'integer',
        'id_paciente'         => 'integer',
    ];

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }
}
