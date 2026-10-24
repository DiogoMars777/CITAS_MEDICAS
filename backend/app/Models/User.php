<?php

namespace App\Models;

use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

/**
 * Clase User que hereda de Usuario para compatibilidad total con Laravel Sanctum y Auth
 */
class User extends Usuario
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
}
