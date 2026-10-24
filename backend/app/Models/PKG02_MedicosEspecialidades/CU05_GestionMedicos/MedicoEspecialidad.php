<?php

namespace App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades\Especialidad;

class MedicoEspecialidad extends Model
{
    protected $table = 'medico_especialidades';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id_medico',
        'id_especialidad',
        'es_principal',
    ];

    protected $casts = [
        'id_medico'       => 'integer',
        'id_especialidad' => 'integer',
        'es_principal'    => 'boolean',
    ];

    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico', 'id_medico');
    }

    public function especialidad(): BelongsTo
    {
        return $this->belongsTo(Especialidad::class, 'id_especialidad', 'id_especialidad');
    }
}
