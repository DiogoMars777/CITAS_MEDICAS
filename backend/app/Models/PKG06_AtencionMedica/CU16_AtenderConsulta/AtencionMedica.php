<?php

namespace App\Models\PKG06_AtencionMedica\CU16_AtenderConsulta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;
use App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente\HistoriaClinica;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;

class AtencionMedica extends Model
{
    protected $table = 'atenciones_medicas';
    protected $primaryKey = 'id_atencion';

    public $timestamps = false;

    protected $fillable = [
        'id_cita',
        'id_historia_clinica',
        'id_medico',
        'motivo_consulta',
        'sintomas',
        'signos_vitales',
        'diagnostico_cie10',
        'diagnostico_descripcion',
        'tratamiento',
        'receta_medica',
        'derivacion_especialidad',
        'fecha_atencion',
        'fecha_creacion',
    ];

    protected $casts = [
        'id_atencion'         => 'integer',
        'id_cita'             => 'integer',
        'id_historia_clinica' => 'integer',
        'id_medico'           => 'integer',
        'fecha_atencion'      => 'datetime',
        'fecha_creacion'      => 'datetime',
        'signos_vitales'      => 'json',
    ];

    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    public function historiaClinica(): BelongsTo
    {
        return $this->belongsTo(HistoriaClinica::class, 'id_historia_clinica', 'id_historia_clinica');
    }

    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico', 'id_medico');
    }
}
