<?php

namespace App\Controllers\PKG01_Seguridad\CU03_GestionUsuarios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;
use App\Models\PKG01_Seguridad\CU03_GestionUsuarios\Rol;
use App\Models\PKG01_Seguridad\CU03_GestionUsuarios\Permiso;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;

class CU03_GestionUsuariosController extends Controller
{
    /**
     * CU03 - Listar usuarios internos con filtros, estadísticas y paginación
     */
    public function listarUsuarios(Request $request): JsonResponse
    {
        $query = Usuario::with('rol')->select(
            'id_usuario',
            'id_rol',
            'username',
            'email',
            'estado',
            'ultimo_login',
            'fecha_creacion',
            'fecha_actualizacion'
        );

        // 1. Filtro por Rol
        if ($request->filled('id_rol')) {
            $query->where('id_rol', $request->input('id_rol'));
        }

        // 2. Filtro por Estado (ACTIVO, INACTIVO, BLOQUEADO)
        if ($request->filled('estado')) {
            $query->where('estado', strtoupper($request->input('estado')));
        }

        // 3. Filtro por Búsqueda (username o email)
        if ($request->filled('search')) {
            $search = strtolower(trim($request->input('search')));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(username) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
            });
        }

        // 4. Ordenamiento
        $query->orderBy('id_usuario', 'asc');

        // 5. Paginación
        $perPage = (int) $request->input('per_page', 10);
        $usuarios = $query->paginate($perPage);

        // Formatear timestamps a Hora Boliviana (BOT - America/La_Paz)
        $usuarios->getCollection()->transform(function ($u) {
            return [
                'id_usuario'           => $u->id_usuario,
                'id_rol'               => $u->id_rol,
                'rol_nombre'           => $u->rol ? $u->rol->nombre_rol : 'SIN ROL',
                'rol_descripcion'      => $u->rol ? $u->rol->descripcion : null,
                'username'             => $u->username,
                'email'                => $u->email,
                'estado'               => $u->estado,
                'ultimo_login'         => $u->ultimo_login,
                'ultimo_login_bolivia' => $u->ultimo_login
                    ? Carbon::parse($u->ultimo_login)->setTimezone('America/La_Paz')->format('d/m/Y H:i:s') . ' BOT'
                    : 'Sin registro',
                'fecha_creacion'       => $u->fecha_creacion,
                'fecha_creacion_bolivia' => $u->fecha_creacion
                    ? Carbon::parse($u->fecha_creacion)->setTimezone('America/La_Paz')->format('d/m/Y H:i') . ' BOT'
                    : 'Sin registro',
            ];
        });

        // Métricas resumidas
        $stats = [
            'total'          => Usuario::count(),
            'activos'        => Usuario::where('estado', 'ACTIVO')->count(),
            'inactivos'      => Usuario::where('estado', 'INACTIVO')->count(),
            'bloqueados'     => Usuario::where('estado', 'BLOQUEADO')->count(),
            'administradores'=> Usuario::whereHas('rol', fn($q) => $q->where('nombre_rol', 'ADMINISTRADOR'))->count(),
            'medicos'        => Usuario::whereHas('rol', fn($q) => $q->where('nombre_rol', 'MEDICO'))->count(),
            'recepcionistas' => Usuario::whereHas('rol', fn($q) => $q->where('nombre_rol', 'RECEPCIONISTA'))->count(),
            'pacientes'      => Usuario::whereHas('rol', fn($q) => $q->where('nombre_rol', 'PACIENTE'))->count(),
        ];

        return response()->json([
            'status'                => 'success',
            'case_of_use'           => 'CU03_GestionUsuarios',
            'timezone'              => 'America/La_Paz (UTC-4)',
            'hora_servidor_bolivia' => Carbon::now('America/La_Paz')->format('d/m/Y H:i:s') . ' [BOT]',
            'stats'                 => $stats,
            'data'                  => $usuarios,
        ]);
    }

    /**
     * CU03 - Crear un nuevo usuario interno con validaciones de seguridad
     */
    public function crearUsuario(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:3|max:50|unique:usuarios,username',
            'email'    => 'required|email|max:100|unique:usuarios,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',      // Al menos una mayúscula
                'regex:/[a-z]/',      // Al menos una minúscula
                'regex:/[0-9]/',      // Al menos un número
                'regex:/[\W_]/',      // Al menos un símbolo
            ],
            'id_rol'   => 'required|integer|exists:roles,id_rol',
            'estado'   => 'nullable|string|in:ACTIVO,INACTIVO,BLOQUEADO',
        ], [
            'username.required' => 'El nombre de usuario es obligatorio.',
            'username.unique'   => 'Este nombre de usuario ya está registrado en el sistema.',
            'email.required'    => 'El correo electrónico es obligatorio.',
            'email.email'       => 'Debe ingresar un correo electrónico válido.',
            'email.unique'      => 'Este correo electrónico ya pertenece a otra cuenta.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min'      => 'La contraseña debe contener al menos 8 caracteres.',
            'password.regex'    => 'La contraseña debe incluir al menos una mayúscula, un número y un símbolo especial.',
            'id_rol.required'   => 'Debe seleccionar un rol para el usuario.',
            'id_rol.exists'     => 'El rol seleccionado no es válido.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor verifique los datos ingresados.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $nowBolivia = Carbon::now('America/La_Paz');

            $usuario = Usuario::create([
                'id_rol'             => $request->input('id_rol'),
                'username'           => trim($request->input('username')),
                'email'              => strtolower(trim($request->input('email'))),
                'password_hash'      => Hash::make($request->input('password')),
                'estado'             => $request->input('estado', 'ACTIVO'),
                'fecha_creacion'     => $nowBolivia,
                'fecha_actualizacion'=> $nowBolivia,
            ]);

            $rolNombre = DB::table('roles')->where('id_rol', $usuario->id_rol)->value('nombre_rol');

            // Registrar en Bitácora de Auditoría (CU02)
            BitacoraAuditoria::registrar(
                'PKG01_Seguridad',
                'usuarios',
                $usuario->id_usuario,
                'INSERT',
                null,
                [
                    'username' => $usuario->username,
                    'email'    => $usuario->email,
                    'id_rol'   => $usuario->id_rol,
                    'rol'      => $rolNombre,
                    'estado'   => $usuario->estado,
                ],
                $request->user()?->id_usuario ?? 1,
                $request->ip(),
                $request->userAgent()
            );

            return response()->json([
                'success' => true,
                'message' => "Usuario '{$usuario->username}' registrado exitosamente con rol {$rolNombre}.",
                'data'    => [
                    'id_usuario' => $usuario->id_usuario,
                    'username'   => $usuario->username,
                    'email'      => $usuario->email,
                    'id_rol'     => $usuario->id_rol,
                    'rol_nombre' => $rolNombre,
                    'estado'     => $usuario->estado,
                ],
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Error al crear usuario CU03: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al guardar el usuario en PostgreSQL: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * CU03 - Consultar un usuario específico por ID
     */
    public function obtenerUsuario(int $id): JsonResponse
    {
        $usuario = Usuario::with('rol')->find($id);

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario no existe.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id_usuario'      => $usuario->id_usuario,
                'username'        => $usuario->username,
                'email'           => $usuario->email,
                'id_rol'          => $usuario->id_rol,
                'rol_nombre'      => $usuario->rol ? $usuario->rol->nombre_rol : null,
                'estado'          => $usuario->estado,
                'ultimo_login'    => $usuario->ultimo_login,
                'fecha_creacion'  => $usuario->fecha_creacion,
            ],
        ]);
    }

    /**
     * CU03 - Actualizar datos de un usuario interno
     */
    public function actualizarUsuario(Request $request, int $id): JsonResponse
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario solicitado no fue encontrado.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'username' => "required|string|min:3|max:50|unique:usuarios,username,{$id},id_usuario",
            'email'    => "required|email|max:100|unique:usuarios,email,{$id},id_usuario",
            'id_rol'   => 'required|integer|exists:roles,id_rol',
            'estado'   => 'required|string|in:ACTIVO,INACTIVO,BLOQUEADO',
            'password' => [
                'nullable',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
                'regex:/[\W_]/',
            ],
        ], [
            'username.required' => 'El nombre de usuario es obligatorio.',
            'username.unique'   => 'Este nombre de usuario ya está en uso por otro registro.',
            'email.required'    => 'El correo electrónico es obligatorio.',
            'email.unique'      => 'Este correo electrónico ya pertenece a otra cuenta.',
            'id_rol.required'   => 'Debe indicar un rol para el usuario.',
            'password.min'      => 'La nueva contraseña debe tener al menos 8 caracteres.',
            'password.regex'    => 'La nueva contraseña debe contener mayúsculas, minúsculas, números y símbolos.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos para actualización.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Proteger que no se deshabilite al único administrador activo
        if ($usuario->id_rol == 1 && $request->input('estado') !== 'ACTIVO') {
            $otrosAdminsActivos = Usuario::where('id_rol', 1)
                ->where('id_usuario', '!=', $id)
                ->where('estado', 'ACTIVO')
                ->count();

            if ($otrosAdminsActivos === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Operación rechazada: No es posible desactivar al único Administrador activo del sistema.',
                ], 400);
            }
        }

        try {
            $valoresAnteriores = [
                'username' => $usuario->username,
                'email'    => $usuario->email,
                'id_rol'   => $usuario->id_rol,
                'estado'   => $usuario->estado,
            ];

            $usuario->username = trim($request->input('username'));
            $usuario->email = strtolower(trim($request->input('email')));
            $usuario->id_rol = $request->input('id_rol');
            $usuario->estado = $request->input('estado');
            $usuario->fecha_actualizacion = Carbon::now('America/La_Paz');

            $passwordCambiado = false;
            if ($request->filled('password')) {
                $usuario->password_hash = Hash::make($request->input('password'));
                $passwordCambiado = true;
            }

            $usuario->save();

            $rolNombre = DB::table('roles')->where('id_rol', $usuario->id_rol)->value('nombre_rol');

            $valoresNuevos = [
                'username'          => $usuario->username,
                'email'             => $usuario->email,
                'id_rol'            => $usuario->id_rol,
                'rol'               => $rolNombre,
                'estado'            => $usuario->estado,
                'password_cambiado' => $passwordCambiado,
            ];

            // Registrar en Bitácora de Auditoría (CU02)
            BitacoraAuditoria::registrar(
                'PKG01_Seguridad',
                'usuarios',
                $usuario->id_usuario,
                'UPDATE',
                $valoresAnteriores,
                $valoresNuevos,
                $request->user()?->id_usuario ?? 1,
                $request->ip(),
                $request->userAgent()
            );

            return response()->json([
                'success' => true,
                'message' => "Usuario '{$usuario->username}' actualizado correctamente.",
                'data'    => [
                    'id_usuario' => $usuario->id_usuario,
                    'username'   => $usuario->username,
                    'email'      => $usuario->email,
                    'id_rol'     => $usuario->id_rol,
                    'rol_nombre' => $rolNombre,
                    'estado'     => $usuario->estado,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Error al actualizar usuario CU03: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar cambios: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * CU03 - Cambiar rápidamente el estado (ACTIVO / INACTIVO / BLOQUEADO)
     */
    public function cambiarEstado(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|string|in:ACTIVO,INACTIVO,BLOQUEADO',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Estado no válido.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado.'], 404);
        }

        $nuevoEstado = strtoupper($request->input('estado'));

        // Proteger el último administrador activo
        if ($usuario->id_rol == 1 && $nuevoEstado !== 'ACTIVO') {
            $otrosAdmins = Usuario::where('id_rol', 1)
                ->where('id_usuario', '!=', $id)
                ->where('estado', 'ACTIVO')
                ->count();

            if ($otrosAdmins === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes desactivar al único Administrador activo del hospital.',
                ], 400);
            }
        }

        $estadoAnterior = $usuario->estado;
        $usuario->estado = $nuevoEstado;
        $usuario->fecha_actualizacion = Carbon::now('America/La_Paz');
        $usuario->save();

        // Registrar en Bitácora de Auditoría
        BitacoraAuditoria::registrar(
            'PKG01_Seguridad',
            'usuarios',
            $usuario->id_usuario,
            'CAMBIO_ESTADO',
            ['estado' => $estadoAnterior],
            ['estado' => $nuevoEstado],
            $request->user()?->id_usuario ?? 1,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => "Estado de '{$usuario->username}' modificado a {$nuevoEstado}.",
            'data'    => [
                'id_usuario' => $usuario->id_usuario,
                'estado'     => $nuevoEstado,
            ],
        ]);
    }

    /**
     * CU03 - Eliminación o Desactivación segura
     */
    public function eliminarUsuario(Request $request, int $id): JsonResponse
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado.'], 404);
        }

        // Proteger último administrador
        if ($usuario->id_rol == 1) {
            $otrosAdmins = Usuario::where('id_rol', 1)->where('id_usuario', '!=', $id)->where('estado', 'ACTIVO')->count();
            if ($otrosAdmins === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar al único Administrador activo.',
                ], 400);
            }
        }

        // Desactivación lógica para preservar integridad referencial de auditoría y citas
        $usuario->estado = 'INACTIVO';
        $usuario->fecha_actualizacion = Carbon::now('America/La_Paz');
        $usuario->save();

        BitacoraAuditoria::registrar(
            'PKG01_Seguridad',
            'usuarios',
            $usuario->id_usuario,
            'DELETE',
            ['estado' => 'ACTIVO'],
            ['estado' => 'INACTIVO', 'motivo' => 'Baja lógica de usuario'],
            $request->user()?->id_usuario ?? 1,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => "Usuario '{$usuario->username}' dado de baja lógicamente (Estado: INACTIVO).",
        ]);
    }

    /**
     * CU03 - Consultar todos los Roles con sus Permisos asignados
     */
    public function obtenerRoles(): JsonResponse
    {
        $roles = Rol::with('permisos')->orderBy('id_rol', 'asc')->get();

        $rolesData = $roles->map(function ($r) {
            return [
                'id_rol'          => $r->id_rol,
                'nombre_rol'      => $r->nombre_rol,
                'descripcion'     => $r->descripcion,
                'activo'          => $r->activo,
                'total_usuarios'  => Usuario::where('id_rol', $r->id_rol)->count(),
                'permisos_ids'    => $r->permisos->pluck('id_permiso')->toArray(),
                'total_permisos'  => $r->permisos->count(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $rolesData,
        ]);
    }

    /**
     * CU03 - Consultar todos los Permisos del sistema agrupados por Módulo
     */
    public function obtenerPermisos(): JsonResponse
    {
        $permisos = Permiso::orderBy('modulo', 'asc')->orderBy('id_permiso', 'asc')->get();

        $agrupados = $permisos->groupBy('modulo');

        return response()->json([
            'status'    => 'success',
            'total'     => $permisos->count(),
            'agrupados' => $agrupados,
            'data'      => $permisos,
        ]);
    }

    /**
     * CU03 - Asignar privilegios a un Rol específico (rol_permisos)
     */
    public function asignarPermisosRol(Request $request, int $idRol): JsonResponse
    {
        $rol = Rol::find($idRol);
        if (!$rol) {
            return response()->json(['success' => false, 'message' => 'Rol no encontrado.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'permisos'   => 'array',
            'permisos.*' => 'integer|exists:permisos,id_permiso',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Lista de permisos no válida.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $permisosIds = $request->input('permisos', []);

        // Obtener permisos anteriores para la bitácora
        $anterioresIds = DB::table('rol_permisos')->where('id_rol', $idRol)->pluck('id_permiso')->toArray();

        // Sincronizar permisos en rol_permisos
        $rol->permisos()->sync($permisosIds);

        // Registrar en Bitácora de Auditoría (CU02)
        BitacoraAuditoria::registrar(
            'PKG01_Seguridad',
            'rol_permisos',
            $idRol,
            'ASIGNAR_PERMISOS',
            ['rol' => $rol->nombre_rol, 'total_permisos_anteriores' => count($anterioresIds), 'permisos_ids' => $anterioresIds],
            ['rol' => $rol->nombre_rol, 'total_permisos_nuevos' => count($permisosIds), 'permisos_ids' => $permisosIds],
            $request->user()?->id_usuario ?? 1,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => "Privilegios actualizados correctamente para el rol {$rol->nombre_rol}.",
            'data'    => [
                'id_rol'         => $rol->id_rol,
                'nombre_rol'     => $rol->nombre_rol,
                'total_permisos' => count($permisosIds),
                'permisos_ids'   => $permisosIds,
            ],
        ]);
    }

    // ==========================================
    // Alias para compatibilidad de rutas y llamadas
    // ==========================================
    public function index(Request $request): JsonResponse { return $this->listarUsuarios($request); }
    public function store(Request $request): JsonResponse { return $this->crearUsuario($request); }
    public function show(int $id): JsonResponse { return $this->obtenerUsuario($id); }
    public function update(Request $request, int $id): JsonResponse { return $this->actualizarUsuario($request, $id); }
    public function destroy(Request $request, int $id): JsonResponse { return $this->eliminarUsuario($request, $id); }
    public function roles(): JsonResponse { return $this->obtenerRoles(); }
    public function permisos(): JsonResponse { return $this->obtenerPermisos(); }
}
