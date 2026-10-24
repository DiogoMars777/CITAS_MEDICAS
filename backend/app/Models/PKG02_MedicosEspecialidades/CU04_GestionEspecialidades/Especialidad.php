<?php

namespace App\Models\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Especialidad extends Model
{
    protected $table = 'especialidades';
    protected $primaryKey = 'id_especialidad';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
    ];

    /**
     * Médicos vinculados a esta especialidad
     */
    public function medicos()
    {
        return $this->hasManyThrough(
            \App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico::class ?? null,
            \App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\MedicoEspecialidad::class ?? null,
            'id_especialidad',
            'id_medico',
            'id_especialidad',
            'id_medico'
        );
    }

    /**
     * Obtener el conteo de médicos asignados directamente de PostgreSQL
     */
    public function getTotalMedicosAttribute(): int
    {
        return DB::table('medico_especialidades')
            ->where('id_especialidad', $this->id_especialidad)
            ->count();
    }

    /**
     * Obtener el conteo de citas agendadas en esta especialidad
     */
    public function getTotalCitasAttribute(): int
    {
        return DB::table('citas')
            ->where('id_especialidad', $this->id_especialidad)
            ->count();
    }
}
