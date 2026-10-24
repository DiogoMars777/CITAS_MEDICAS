<?php

namespace App\Models\PKG01_Seguridad\CU01_Autenticacion;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\PKG01_Seguridad\CU03_GestionUsuarios\Rol;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'id_rol',
        'username',
        'email',
        'password_hash',
        'estado',
        'ultimo_login',
        'fecha_creacion',
        'fecha_actualizacion',
    ];

    protected $hidden = [
        'password_hash',
    ];

    /**
     * Get the password for authentication.
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    /**
     * Relación con el Rol
     */
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }
}
