<?php

namespace App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;
use App\Models\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades\Especialidad;

class Medico extends Model
{
    protected $table = 'medicos';
    protected $primaryKey = 'id_medico';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'numero_registro_profesional',
        'nombres',
        'apellidos',
        'telefono',
        'email',
        'estado',
        'fecha_ingreso',
    ];

    protected $casts = [
        'id_medico'     => 'integer',
        'id_usuario'    => 'integer',
        'fecha_ingreso' => 'date',
    ];

    /**
     * Cuenta de usuario vinculada
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    /**
     * Especialidades clínicas asignadas
     */
    public function especialidades(): BelongsToMany
    {
        return $this->belongsToMany(
            Especialidad::class,
            'medico_especialidades',
            'id_medico',
            'id_especialidad'
        )->withPivot('es_principal');
    }

    /**
     * Registros de tabla pivote medico_especialidades
     */
    public function medicoEspecialidades(): HasMany
    {
        return $this->hasMany(MedicoEspecialidad::class, 'id_medico', 'id_medico');
    }

    /**
     * Nombre completo formateado
     */
    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->nombres} {$this->apellidos}");
    }
}
