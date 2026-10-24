<?php

namespace App\Models\PKG01_Seguridad\CU03_GestionUsuarios;

use Illuminate\Database\Eloquent\Model;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

class Rol extends Model
{
    protected $table = 'roles';
    protected $primaryKey = 'id_rol';
    public $timestamps = false;

    protected $fillable = [
        'nombre_rol',
        'descripcion',
        'activo',
        'fecha_creacion',
    ];

    protected $casts = [
        'activo'         => 'boolean',
        'fecha_creacion' => 'datetime',
    ];

    /**
     * Relación con los Usuarios que tienen este Rol
     */
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_rol', 'id_rol');
    }

    /**
     * Relación N:M con los Permisos asignados
     */
    public function permisos()
    {
        return $this->belongsToMany(
            Permiso::class,
            'rol_permisos',
            'id_rol',
            'id_permiso'
        );
    }
}
