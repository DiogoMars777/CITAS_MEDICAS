<?php

namespace App\Models\PKG07_Laboratorios\CU17_CargarEstudios;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente\Paciente;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;

class LaboratorioEstudioCarga extends Model
{
    protected $table = 'laboratorios_estudios';
    protected $primaryKey = 'id_estudio';

    public $timestamps = false;

    protected $fillable = [
        'codigo_estudio',
        'id_paciente',
        'id_medico_solicitante',
        'id_cita',
        'nombre_estudio',
        'tipo_estudio',
        'descripcion',
        'fecha_solicitud',
        'estado',
        'resultado_diagnostico',
        'archivo_resultado_url',
        'publicado_en',
    ];

    protected $casts = [
        'id_estudio'            => 'integer',
        'id_paciente'           => 'integer',
        'id_medico_solicitante' => 'integer',
        'id_cita'               => 'integer',
        'fecha_solicitud'       => 'datetime',
        'publicado_en'          => 'datetime',
    ];

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }

    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico_solicitante', 'id_medico');
    }

    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }
}
