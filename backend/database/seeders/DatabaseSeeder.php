<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with Clínica Vida Salud initial records.
     */
    public function run(): void
    {
        // 1. ROLES
        $roles = [
            ['id_rol' => 1, 'nombre_rol' => 'ADMINISTRADOR', 'descripcion' => 'Administrador con acceso total al sistema', 'activo' => true],
            ['id_rol' => 2, 'nombre_rol' => 'RECEPCIONISTA', 'descripcion' => 'Recepción, gestión de turnos y citas', 'activo' => true],
            ['id_rol' => 3, 'nombre_rol' => 'MEDICO', 'descripcion' => 'Cuerpo médico, agenda y atención de consultas', 'activo' => true],
            ['id_rol' => 4, 'nombre_rol' => 'PACIENTE', 'descripcion' => 'Portal de pacientes para reserva y resultados', 'activo' => true],
        ];

        foreach ($roles as $rol) {
            DB::table('roles')->updateOrInsert(
                ['id_rol' => $rol['id_rol']],
                [
                    'nombre_rol'     => $rol['nombre_rol'],
                    'descripcion'    => $rol['descripcion'],
                    'activo'         => $rol['activo'],
                    'fecha_creacion' => Carbon::now(),
                ]
            );
        }

        // 2. ESPECIALIDADES MÉDICAS
        $especialidades = [
            ['id_especialidad' => 1, 'nombre' => 'Medicina General', 'descripcion' => 'Atención médica primaria integral para adultos y familias', 'estado' => 'ACTIVO'],
            ['id_especialidad' => 2, 'nombre' => 'Pediatría', 'descripcion' => 'Atención integral de salud para niños y adolescentes', 'estado' => 'ACTIVO'],
            ['id_especialidad' => 3, 'nombre' => 'Geriatría', 'descripcion' => 'Atención médica especializada en adultos mayores', 'estado' => 'ACTIVO'],
            ['id_especialidad' => 4, 'nombre' => 'Ginecología', 'descripcion' => 'Salud femenina, reproductiva y control prenatal', 'estado' => 'ACTIVO'],
            ['id_especialidad' => 5, 'nombre' => 'Cardiología', 'descripcion' => 'Prevención, diagnóstico y tratamiento cardíaco', 'estado' => 'ACTIVO'],
            ['id_especialidad' => 6, 'nombre' => 'Odontología', 'descripcion' => 'Salud bucal integral y prevención', 'estado' => 'ACTIVO'],
            ['id_especialidad' => 7, 'nombre' => 'Traumatología', 'descripcion' => 'Lesiones osteoarticulares y rehabilitación', 'estado' => 'ACTIVO'],
            ['id_especialidad' => 8, 'nombre' => 'Oftalmología', 'descripcion' => 'Salud visual y patologías oculares', 'estado' => 'ACTIVO'],
        ];

        foreach ($especialidades as $esp) {
            DB::table('especialidades')->updateOrInsert(
                ['id_especialidad' => $esp['id_especialidad']],
                [
                    'nombre'      => $esp['nombre'],
                    'descripcion' => $esp['descripcion'],
                    'estado'      => $esp['estado'],
                ]
            );
        }

        // 3. USUARIOS INICIALES (Contraseña para todos: Password123#)
        $hashedPassword = password_hash('Password123#', PASSWORD_BCRYPT);

        $usuarios = [
            [
                'id_usuario'    => 1,
                'id_rol'        => 1, // ADMINISTRADOR
                'username'      => 'admin',
                'email'         => 'admin@clinicavidasalud.com',
                'password_hash' => $hashedPassword,
                'estado'        => 'ACTIVO',
            ],
            [
                'id_usuario'    => 2,
                'id_rol'        => 2, // RECEPCIONISTA
                'username'      => 'recepcion',
                'email'         => 'recepcion@clinicavidasalud.com',
                'password_hash' => $hashedPassword,
                'estado'        => 'ACTIVO',
            ],
            [
                'id_usuario'    => 3,
                'id_rol'        => 3, // MEDICO
                'username'      => 'medico',
                'email'         => 'medico@clinicavidasalud.com',
                'password_hash' => $hashedPassword,
                'estado'        => 'ACTIVO',
            ],
            [
                'id_usuario'    => 4,
                'id_rol'        => 4, // PACIENTE
                'username'      => 'paciente',
                'email'         => 'paciente@clinicavidasalud.com',
                'password_hash' => $hashedPassword,
                'estado'        => 'ACTIVO',
            ],
        ];

        foreach ($usuarios as $usr) {
            DB::table('usuarios')->updateOrInsert(
                ['id_usuario' => $usr['id_usuario']],
                [
                    'id_rol'               => $usr['id_rol'],
                    'username'             => $usr['username'],
                    'email'                => $usr['email'],
                    'password_hash'        => $usr['password_hash'],
                    'estado'               => $usr['estado'],
                    'fecha_creacion'       => Carbon::now(),
                    'fecha_actualizacion'  => Carbon::now(),
                ]
            );
        }

        // 4. PERFIL MÉDICO ASOCIADO
        DB::table('medicos')->updateOrInsert(
            ['id_medico' => 1],
            [
                'id_usuario'                   => 3,
                'numero_registro_profesional'  => 'MP-98432',
                'nombres'                      => 'Carlos Alberto',
                'apellidos'                    => 'Mendoza Suárez',
                'telefono'                     => '70012345',
                'email'                        => 'medico@clinicavidasalud.com',
                'estado'                       => 'ACTIVO',
                'fecha_ingreso'                => Carbon::now()->subMonths(12)->toDateString(),
            ]
        );

        // Asignar especialidades al médico
        DB::table('medico_especialidades')->updateOrInsert(
            ['id_medico' => 1, 'id_especialidad' => 1],
            ['es_principal' => true]
        );

        // 5. PERFIL PACIENTE ASOCIADO
        DB::table('pacientes')->updateOrInsert(
            ['id_paciente' => 1],
            [
                'id_usuario'          => 4,
                'ci'                  => '87654321',
                'nombres'             => 'Juan Pablo',
                'apellidos'           => 'Pérez Gómez',
                'fecha_nacimiento'    => '1990-05-15',
                'sexo'                => 'MASCULINO',
                'telefono'            => '75598765',
                'email'               => 'paciente@clinicavidasalud.com',
                'direccion'           => 'Av. Las Américas #450',
                'primera_visita'      => false,
                'estado'              => 'ACTIVO',
                'fecha_creacion'      => Carbon::now(),
                'fecha_actualizacion' => Carbon::now(),
            ]
        );
        // 6. PERMISOS Y PRIVILEGIOS POR ROL
        $this->call(PermisosSeeder::class);

        // 7. SINCRONIZACIÓN DE SECUENCIAS POSTGRESQL (AUTO-INCREMENT)
        $tablasSecuencias = [
            'usuarios'           => 'id_usuario',
            'roles'              => 'id_rol',
            'especialidades'     => 'id_especialidad',
            'medicos'            => 'id_medico',
            'pacientes'          => 'id_paciente',
            'bitacora_auditoria' => 'id_bitacora',
            'permisos'           => 'id_permiso',
        ];

        foreach ($tablasSecuencias as $tabla => $columna) {
            try {
                $maxVal = DB::table($tabla)->max($columna);
                if ($maxVal) {
                    DB::statement("SELECT setval(pg_get_serial_sequence('{$tabla}', '{$columna}'), {$maxVal})");
                }
            } catch (\Throwable $e) {
                // Omitir si la secuencia no aplica
            }
        }
    }
}
