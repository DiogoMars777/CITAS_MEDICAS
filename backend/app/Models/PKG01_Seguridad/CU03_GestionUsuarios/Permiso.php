<?php

namespace App\Models\PKG01_Seguridad\CU03_GestionUsuarios;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    protected $table = 'permisos';
    protected $primaryKey = 'id_permiso';
    public $timestamps = false;

    protected $fillable = [
        'modulo',
        'nombre_permiso',
        'descripcion',
    ];

    /**
     * Relación N:M con los Roles que poseen este permiso
     */
    public function roles()
    {
        return $this->belongsToMany(
            Rol::class,
            'rol_permisos',
            'id_permiso',
            'id_rol'
        );
    }
}
