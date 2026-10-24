<?php

namespace App\Controllers\PKG02_MedicosEspecialidades\CU05_GestionMedicos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\MedicoEspecialidad;
use App\Models\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades\Especialidad;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;

class CU05_MedicoController extends Controller
{
    /**
     * CU05 - Listado general de médicos con especialidades, filtros y métricas
     */
    public function index(Request $request): JsonResponse
    {
        $query = Medico::with(['usuario', 'especialidades']);

        // 1. Filtro por Estado
        if ($request->filled('estado')) {
            $query->where('medicos.estado', strtoupper($request->input('estado')));
        }

        // 2. Filtro por Especialidad
        if ($request->filled('id_especialidad')) {
            $idEspecialidad = (int) $request->input('id_especialidad');
            $query->whereHas('especialidades', function ($q) use ($idEspecialidad) {
                $q->where('especialidades.id_especialidad', $idEspecialidad);
            });
        }

        // 3. Filtro por Búsqueda (nombres, apellidos, matrícula profesional, email, teléfono)
        if ($request->filled('search')) {
            $search = strtolower(trim($request->input('search')));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nombres) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(apellidos) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(numero_registro_profesional) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(telefono) LIKE ?', ["%{$search}%"]);
            });
        }

        // 4. Ordenamiento
        $query->orderBy('apellidos', 'asc')->orderBy('nombres', 'asc');

        // 5. Paginación
        $perPage = (int) $request->input('per_page', 10);
        $medicos = $query->paginate($perPage);

        // Transformación enriquecida para el cliente
        $medicos->getCollection()->transform(function ($medico) {
            $especialidadesList = $medico->especialidades->map(function ($esp) {
                return [
                    'id_especialidad' => $esp->id_especialidad,
                    'nombre'          => $esp->nombre,
                    'es_principal'    => (bool) $esp->pivot->es_principal,
                ];
            });

            // Encontrar la especialidad principal
            $espPrincipal = $especialidadesList->firstWhere('es_principal', true) 
                ?? $especialidadesList->first();

            // Total de citas asignadas al médico
            $totalCitas = DB::table('citas')
                ->where('id_medico', $medico->id_medico)
                ->count();

            return [
                'id_medico'                    => $medico->id_medico,
                'id_usuario'                   => $medico->id_usuario,
                'username'                     => $medico->usuario?->username,
                'numero_registro_profesional'  => $medico->numero_registro_profesional,
                'nombres'                      => $medico->nombres,
                'apellidos'                    => $medico->apellidos,
                'nombre_completo'              => $medico->nombre_completo,
                'telefono'                     => $medico->telefono,
                'email'                        => $medico->email,
                'estado'                       => $medico->estado,
                'fecha_ingreso'                => $medico->fecha_ingreso ? Carbon::parse($medico->fecha_ingreso)->format('Y-m-d') : null,
                'especialidades'               => $especialidadesList,
                'especialidad_principal'       => $espPrincipal ? $espPrincipal['nombre'] : 'Sin asignar',
                'total_citas'                  => $totalCitas,
            ];
        });

        // Métricas estadísticas para el encabezado
        $stats = [
            'total'               => Medico::count(),
            'activos'             => Medico::where('estado', 'ACTIVO')->count(),
            'inactivos'           => Medico::where('estado', 'INACTIVO')->count(),
            'con_especialidad'    => DB::table('medico_especialidades')->distinct('id_medico')->count('id_medico'),
            'total_asignaciones'  => DB::table('medico_especialidades')->count(),
        ];

        return response()->json([
            'status'                => 'success',
            'case_of_use'           => 'CU05_GestionMedicos',
            'timezone'              => 'America/La_Paz (UTC-4)',
            'hora_servidor_bolivia' => Carbon::now('America/La_Paz')->format('d/m/Y H:i:s') . ' [BOT]',
            'stats'                 => $stats,
            'data'                  => $medicos,
        ]);
    }

    /**
     * CU05 - Metadatos auxiliares para formularios (Especialidades y Usuarios de rol Médico disponibles)
     */
    public function meta(): JsonResponse
    {
        // 1. Especialidades activas
        $especialidades = Especialidad::where('estado', 'ACTIVO')
            ->orderBy('nombre', 'asc')
            ->select('id_especialidad', 'nombre', 'descripcion')
            ->get();

        // 2. Usuarios con rol Médico (id_rol = 3) que NO tengan ya un registro en medicos
        $medicosUsuariosIds = Medico::pluck('id_usuario')->toArray();

        $usuariosDisponibles = Usuario::where('id_rol', 3)
            ->whereNotIn('id_usuario', $medicosUsuariosIds)
            ->where('estado', 'ACTIVO')
            ->select('id_usuario', 'username', 'email')
            ->orderBy('username', 'asc')
            ->get();

        return response()->json([
            'success'             => true,
            'especialidades'      => $especialidades,
            'usuarios_disponibles'=> $usuariosDisponibles,
        ]);
    }

    /**
     * CU05 - Registrar nuevo médico con número de registro único y asignación de especialidades
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'nombres'                     => 'required|string|min:2|max:80',
            'apellidos'                   => 'required|string|min:2|max:80',
            'numero_registro_profesional' => 'required|string|min:3|max:40|unique:medicos,numero_registro_profesional',
            'telefono'                    => 'required|string|max:25',
            'email'                       => 'required|email|max:100',
            'fecha_ingreso'               => 'required|date',
            'estado'                      => 'nullable|string|in:ACTIVO,INACTIVO',
            'crear_usuario'               => 'nullable|boolean',
            'especialidades'              => 'required|array|min:1',
            'especialidades.*.id_especialidad' => 'required|integer|exists:especialidades,id_especialidad',
            'especialidades.*.es_principal'    => 'nullable|boolean',
        ];

        // Si se pide crear nuevo usuario
        if ($request->boolean('crear_usuario')) {
            $rules['username'] = 'required|string|min:3|max:50|unique:usuarios,username';
            $rules['password'] = 'required|string|min:8';
        } else {
            $rules['id_usuario'] = 'required|integer|exists:usuarios,id_usuario|unique:medicos,id_usuario';
        }

        $messages = [
            'nombres.required'                     => 'El nombre del médico es obligatorio.',
            'apellidos.required'                   => 'Los apellidos son obligatorios.',
            'numero_registro_profesional.required' => 'El número de registro profesional (matrícula) es obligatorio.',
            'numero_registro_profesional.unique'   => 'Este número de registro profesional ya pertenece a otro médico.',
            'email.required'                       => 'El correo electrónico es obligatorio.',
            'email.email'                          => 'Ingrese una dirección de correo válida.',
            'fecha_ingreso.required'               => 'La fecha de ingreso a la clínica es obligatoria.',
            'id_usuario.required'                  => 'Debe vincular el perfil a un usuario con rol de Médico.',
            'id_usuario.unique'                    => 'El usuario seleccionado ya posee un perfil médico asignado.',
            'username.unique'                      => 'El nombre de usuario elegido ya se encuentra en uso.',
            'password.min'                         => 'La contraseña de acceso debe tener al menos 8 caracteres.',
            'especialidades.required'              => 'Debe asignar al menos una especialidad médica al facultativo.',
            'especialidades.min'                   => 'Debe asignar al menos una especialidad médica.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor verifique los datos del médico.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                $nowBolivia = Carbon::now('America/La_Paz');
                $idUsuario = null;

                // 1. Manejo de cuenta de usuario
                if ($request->boolean('crear_usuario')) {
                    $nuevoUsuario = Usuario::create([
                        'id_rol'             => 3, // Rol Médico
                        'username'           => trim($request->input('username')),
                        'email'              => trim($request->input('email')),
                        'password_hash'      => Hash::make($request->input('password')),
                        'estado'             => 'ACTIVO',
                        'fecha_creacion'     => $nowBolivia,
                        'fecha_actualizacion'=> $nowBolivia,
                    ]);
                    $idUsuario = $nuevoUsuario->id_usuario;

                    // Auditoría para creación de usuario
                    BitacoraAuditoria::registrar(
                        'PKG01_Seguridad',
                        'usuarios',
                        $idUsuario,
                        'INSERT',
                        null,
                        [
                            'username' => $nuevoUsuario->username,
                            'id_rol'   => 3,
                            'email'    => $nuevoUsuario->email,
                            'origen'   => 'CU05_AltaMedico'
                        ],
                        $request->user()?->id_usuario ?? 1,
                        $request->ip(),
                        $request->userAgent()
                    );
                } else {
                    $idUsuario = (int) $request->input('id_usuario');
                }

                // 2. Registro del Médico
                $medico = Medico::create([
                    'id_usuario'                  => $idUsuario,
                    'numero_registro_profesional' => trim($request->input('numero_registro_profesional')),
                    'nombres'                     => trim($request->input('nombres')),
                    'apellidos'                   => trim($request->input('apellidos')),
                    'telefono'                    => trim($request->input('telefono')),
                    'email'                       => trim($request->input('email')),
                    'estado'                      => $request->input('estado', 'ACTIVO'),
                    'fecha_ingreso'               => $request->input('fecha_ingreso'),
                ]);

                // 3. Asignación N:M de especialidades
                $especialidadesInput = $request->input('especialidades', []);
                $hasPrincipal = false;

                foreach ($especialidadesInput as $esp) {
                    if (!empty($esp['es_principal'])) {
                        $hasPrincipal = true;
                        break;
                    }
                }

                $auditEspecialidades = [];
                foreach ($especialidadesInput as $index => $esp) {
                    $esPrincipal = !empty($esp['es_principal']) || (!$hasPrincipal && $index === 0);
                    DB::table('medico_especialidades')->insert([
                        'id_medico'       => $medico->id_medico,
                        'id_especialidad' => (int) $esp['id_especialidad'],
                        'es_principal'    => $esPrincipal,
                    ]);
                    $auditEspecialidades[] = [
                        'id_especialidad' => (int) $esp['id_especialidad'],
                        'es_principal'    => $esPrincipal,
                    ];
                }

                // 4. Auditoría de creación de Médico (CU02)
                BitacoraAuditoria::registrar(
                    'PKG02_MedicosEspecialidades',
                    'medicos',
                    $medico->id_medico,
                    'INSERT',
                    null,
                    [
                        'nombres'                     => $medico->nombres,
                        'apellidos'                   => $medico->apellidos,
                        'numero_registro_profesional' => $medico->numero_registro_profesional,
                        'id_usuario'                  => $medico->id_usuario,
                        'email'                       => $medico->email,
                        'telefono'                    => $medico->telefono,
                        'estado'                      => $medico->estado,
                        'fecha_ingreso'               => $medico->fecha_ingreso,
                        'especialidades_asignadas'    => $auditEspecialidades,
                    ],
                    $request->user()?->id_usuario ?? 1,
                    $request->ip(),
                    $request->userAgent()
                );

                return response()->json([
                    'success' => true,
                    'message' => "Médico Dr(a). {$medico->nombre_completo} registrado exitosamente.",
                    'data'    => $medico,
                ], 201);
            });
        } catch (\Throwable $e) {
            Log::error('Error en CU05 store médico: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el médico en la base de datos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * CU05 - Consultar detalle de un médico
     */
    public function show(int $id): JsonResponse
    {
        $medico = Medico::with(['usuario', 'especialidades'])->find($id);

        if (!$medico) {
            return response()->json([
                'success' => false,
                'message' => 'El médico solicitado no existe.',
            ], 404);
        }

        $especialidades = $medico->especialidades->map(function ($esp) {
            return [
                'id_especialidad' => $esp->id_especialidad,
                'nombre'          => $esp->nombre,
                'es_principal'    => (bool) $esp->pivot->es_principal,
            ];
        });

        $totalCitas = DB::table('citas')->where('id_medico', $medico->id_medico)->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'id_medico'                    => $medico->id_medico,
                'id_usuario'                   => $medico->id_usuario,
                'username'                     => $medico->usuario?->username,
                'numero_registro_profesional'  => $medico->numero_registro_profesional,
                'nombres'                      => $medico->nombres,
                'apellidos'                    => $medico->apellidos,
                'nombre_completo'              => $medico->nombre_completo,
                'telefono'                     => $medico->telefono,
                'email'                        => $medico->email,
                'estado'                       => $medico->estado,
                'fecha_ingreso'                => $medico->fecha_ingreso ? Carbon::parse($medico->fecha_ingreso)->format('Y-m-d') : null,
                'especialidades'               => $especialidades,
                'total_citas'                  => $totalCitas,
            ],
        ]);
    }

    /**
     * CU05 - Actualizar datos del médico y sincronizar especialidades
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $medico = Medico::with('especialidades')->find($id);

        if (!$medico) {
            return response()->json([
                'success' => false,
                'message' => 'El médico solicitado no fue encontrado.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombres'                          => 'required|string|min:2|max:80',
            'apellidos'                        => 'required|string|min:2|max:80',
            'numero_registro_profesional'      => "required|string|min:3|max:40|unique:medicos,numero_registro_profesional,{$id},id_medico",
            'telefono'                         => 'required|string|max:25',
            'email'                            => 'required|email|max:100',
            'fecha_ingreso'                    => 'required|date',
            'estado'                           => 'required|string|in:ACTIVO,INACTIVO',
            'especialidades'                   => 'required|array|min:1',
            'especialidades.*.id_especialidad' => 'required|integer|exists:especialidades,id_especialidad',
            'especialidades.*.es_principal'    => 'nullable|boolean',
        ], [
            'nombres.required'                     => 'El nombre del médico es obligatorio.',
            'apellidos.required'                   => 'Los apellidos son obligatorios.',
            'numero_registro_profesional.required' => 'La matrícula o registro profesional es obligatoria.',
            'numero_registro_profesional.unique'   => 'Este número de registro ya pertenece a otro profesional.',
            'especialidades.required'              => 'Debe asignar al menos una especialidad médica.',
            'especialidades.min'                   => 'Debe asignar al menos una especialidad médica.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos para actualización.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request, $medico) {
                $valoresAnteriores = [
                    'nombres'                     => $medico->nombres,
                    'apellidos'                   => $medico->apellidos,
                    'numero_registro_profesional' => $medico->numero_registro_profesional,
                    'telefono'                    => $medico->telefono,
                    'email'                       => $medico->email,
                    'estado'                      => $medico->estado,
                    'fecha_ingreso'               => $medico->fecha_ingreso,
                    'especialidades'              => $medico->especialidades->map(fn($e) => [
                        'id_especialidad' => $e->id_especialidad,
                        'nombre'          => $e->nombre,
                        'es_principal'    => (bool) $e->pivot->es_principal,
                    ])->toArray(),
                ];

                // Actualizar atributos de médico
                $medico->nombres                     = trim($request->input('nombres'));
                $medico->apellidos                   = trim($request->input('apellidos'));
                $medico->numero_registro_profesional = trim($request->input('numero_registro_profesional'));
                $medico->telefono                    = trim($request->input('telefono'));
                $medico->email                       = trim($request->input('email'));
                $medico->estado                      = $request->input('estado');
                $medico->fecha_ingreso               = $request->input('fecha_ingreso');
                $medico->save();

                // Sincronizar especialidades
                DB::table('medico_especialidades')->where('id_medico', $medico->id_medico)->delete();

                $especialidadesInput = $request->input('especialidades', []);
                $hasPrincipal = false;
                foreach ($especialidadesInput as $esp) {
                    if (!empty($esp['es_principal'])) {
                        $hasPrincipal = true;
                        break;
                    }
                }

                $auditEspecialidadesNuevas = [];
                foreach ($especialidadesInput as $index => $esp) {
                    $esPrincipal = !empty($esp['es_principal']) || (!$hasPrincipal && $index === 0);
                    DB::table('medico_especialidades')->insert([
                        'id_medico'       => $medico->id_medico,
                        'id_especialidad' => (int) $esp['id_especialidad'],
                        'es_principal'    => $esPrincipal,
                    ]);
                    $auditEspecialidadesNuevas[] = [
                        'id_especialidad' => (int) $esp['id_especialidad'],
                        'es_principal'    => $esPrincipal,
                    ];
                }

                // Sincronizar email en la cuenta de usuario vinculada
                if ($medico->usuario) {
                    $medico->usuario->email = $medico->email;
                    $medico->usuario->save();
                }

                $valoresNuevos = [
                    'nombres'                     => $medico->nombres,
                    'apellidos'                   => $medico->apellidos,
                    'numero_registro_profesional' => $medico->numero_registro_profesional,
                    'telefono'                    => $medico->telefono,
                    'email'                       => $medico->email,
                    'estado'                      => $medico->estado,
                    'fecha_ingreso'               => $medico->fecha_ingreso,
                    'especialidades'              => $auditEspecialidadesNuevas,
                ];

                // Auditoría (CU02)
                BitacoraAuditoria::registrar(
                    'PKG02_MedicosEspecialidades',
                    'medicos',
                    $medico->id_medico,
                    'UPDATE',
                    $valoresAnteriores,
                    $valoresNuevos,
                    $request->user()?->id_usuario ?? 1,
                    $request->ip(),
                    $request->userAgent()
                );

                return response()->json([
                    'success' => true,
                    'message' => "Datos del Dr(a). {$medico->nombre_completo} actualizados correctamente.",
                    'data'    => $medico,
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('Error en CU05 update médico: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar modificaciones: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * CU05 - Alternar rápidamente estado de disponibilidad (ACTIVO / INACTIVO)
     */
    public function cambiarEstado(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|string|in:ACTIVO,INACTIVO',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Estado inválido.',
            ], 422);
        }

        $medico = Medico::find($id);
        if (!$medico) {
            return response()->json(['success' => false, 'message' => 'Médico no encontrado.'], 404);
        }

        $nuevoEstado = strtoupper($request->input('estado'));
        $estadoAnterior = $medico->estado;

        $medico->estado = $nuevoEstado;
        $medico->save();

        // Si se desactiva el médico, también desactivar su usuario para impedir login
        if ($medico->usuario) {
            $medico->usuario->estado = $nuevoEstado;
            $medico->usuario->save();
        }

        BitacoraAuditoria::registrar(
            'PKG02_MedicosEspecialidades',
            'medicos',
            $medico->id_medico,
            'CAMBIO_ESTADO',
            ['estado' => $estadoAnterior],
            ['estado' => $nuevoEstado, 'usuario_sincronizado' => true],
            $request->user()?->id_usuario ?? 1,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => "Estado del Dr(a). {$medico->nombre_completo} actualizado a {$nuevoEstado}.",
            'data'    => [
                'id_medico' => $medico->id_medico,
                'estado'    => $nuevoEstado,
            ],
        ]);
    }

    /**
     * CU05 - Baja lógica
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $medico = Medico::find($id);
        if (!$medico) {
            return response()->json(['success' => false, 'message' => 'Médico no encontrado.'], 404);
        }

        $medico->estado = 'INACTIVO';
        $medico->save();

        if ($medico->usuario) {
            $medico->usuario->estado = 'INACTIVO';
            $medico->usuario->save();
        }

        BitacoraAuditoria::registrar(
            'PKG02_MedicosEspecialidades',
            'medicos',
            $medico->id_medico,
            'DELETE',
            ['estado' => 'ACTIVO'],
            ['estado' => 'INACTIVO', 'motivo' => 'Baja de perfil médico'],
            $request->user()?->id_usuario ?? 1,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => "Médico Dr(a). {$medico->nombre_completo} dado de baja (Estado: INACTIVO).",
        ]);
    }
}
