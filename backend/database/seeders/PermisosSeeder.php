<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermisosSeeder extends Seeder
{
    public function run(): void
    {
        $permisos = [
            // Módulo: SEGURIDAD
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'usuarios.ver', 'descripcion' => 'Ver listado y detalles de usuarios internos'],
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'usuarios.crear', 'descripcion' => 'Registrar nuevas cuentas de personal'],
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'usuarios.editar', 'descripcion' => 'Modificar datos y roles de usuarios'],
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'usuarios.estado', 'descripcion' => 'Activar, desactivar o bloquear usuarios'],
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'roles.ver', 'descripcion' => 'Ver roles y privilegios asignados'],
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'roles.asignar_permisos', 'descripcion' => 'Modificar privilegios por rol'],
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'bitacora.ver', 'descripcion' => 'Consultar bitácora de auditoría del sistema'],
            ['modulo' => 'SEGURIDAD', 'nombre_permiso' => 'backups.gestionar', 'descripcion' => 'Generar y restaurar copias de seguridad'],

            // Módulo: MEDICOS Y ESPECIALIDADES
            ['modulo' => 'MEDICOS', 'nombre_permiso' => 'especialidades.ver', 'descripcion' => 'Consultar especialidades médicas'],
            ['modulo' => 'MEDICOS', 'nombre_permiso' => 'especialidades.gestionar', 'descripcion' => 'Crear y editar especialidades'],
            ['modulo' => 'MEDICOS', 'nombre_permiso' => 'medicos.ver', 'descripcion' => 'Consultar directorio de médicos'],
            ['modulo' => 'MEDICOS', 'nombre_permiso' => 'medicos.gestionar', 'descripcion' => 'Alta, edición y asignación de médicos'],

            // Módulo: PACIENTES
            ['modulo' => 'PACIENTES', 'nombre_permiso' => 'pacientes.ver', 'descripcion' => 'Consultar padrón de pacientes'],
            ['modulo' => 'PACIENTES', 'nombre_permiso' => 'pacientes.crear', 'descripcion' => 'Apertura de ficha de nuevos pacientes'],
            ['modulo' => 'PACIENTES', 'nombre_permiso' => 'pacientes.editar', 'descripcion' => 'Actualizar datos personales de pacientes'],
            ['modulo' => 'PACIENTES', 'nombre_permiso' => 'historial.ver', 'descripcion' => 'Visualizar antecedentes clínicos base'],
            ['modulo' => 'PACIENTES', 'nombre_permiso' => 'historial.editar', 'descripcion' => 'Registrar alergias y tipo de sangre'],

            // Módulo: AGENDAS
            ['modulo' => 'AGENDAS', 'nombre_permiso' => 'turnos.configurar', 'descripcion' => 'Configurar turnos y bloques de 15 min'],
            ['modulo' => 'AGENDAS', 'nombre_permiso' => 'bloqueos.gestionar', 'descripcion' => 'Registrar bloqueos de agenda médica'],
            ['modulo' => 'AGENDAS', 'nombre_permiso' => 'disponibilidad.ver', 'descripcion' => 'Consultar cupos libres de médicos'],

            // Módulo: CITAS
            ['modulo' => 'CITAS', 'nombre_permiso' => 'citas.ver', 'descripcion' => 'Ver agenda y listado general de citas'],
            ['modulo' => 'CITAS', 'nombre_permiso' => 'citas.reservar', 'descripcion' => 'Emitir ficha y reservar cita médica'],
            ['modulo' => 'CITAS', 'nombre_permiso' => 'citas.reprogramar', 'descripcion' => 'Reprogramar fecha/hora de cita'],
            ['modulo' => 'CITAS', 'nombre_permiso' => 'citas.cancelar', 'descripcion' => 'Cancelar cita con motivo justificado'],
            ['modulo' => 'CITAS', 'nombre_permiso' => 'citas.asistencia', 'descripcion' => 'Marcar asistencia o inasistencia en sala'],

            // Módulo: CONSULTAS
            ['modulo' => 'CONSULTAS', 'nombre_permiso' => 'agenda_diaria.ver', 'descripcion' => 'Ver agenda médica de pacientes del día'],
            ['modulo' => 'CONSULTAS', 'nombre_permiso' => 'consultas.atender', 'descripcion' => 'Registrar evolución y diagnóstico CIE-10'],
            ['modulo' => 'CONSULTAS', 'nombre_permiso' => 'recetas.emitir', 'descripcion' => 'Emitir recetas médicas digitales'],

            // Módulo: LABORATORIOS
            ['modulo' => 'LABORATORIOS', 'nombre_permiso' => 'laboratorios.cargar', 'descripcion' => 'Cargar resultados y estudios clínicos'],
            ['modulo' => 'LABORATORIOS', 'nombre_permiso' => 'laboratorios.ver', 'descripcion' => 'Visualizar visor digital de laboratorios'],
            ['modulo' => 'LABORATORIOS', 'nombre_permiso' => 'laboratorios.descargar', 'descripcion' => 'Descargar informes de laboratorio'],

            // Módulo: REPORTES
            ['modulo' => 'REPORTES', 'nombre_permiso' => 'dashboard.ver', 'descripcion' => 'Ver dashboard operativo y métricas'],
            ['modulo' => 'REPORTES', 'nombre_permiso' => 'reportes.exportar', 'descripcion' => 'Generar y exportar reportes estadísticos'],
        ];

        foreach ($permisos as $p) {
            DB::table('permisos')->updateOrInsert(
                ['nombre_permiso' => $p['nombre_permiso']],
                ['modulo' => $p['modulo'], 'descripcion' => $p['descripcion']]
            );
        }

        // Obtener IDs de roles
        $rolAdmin = DB::table('roles')->where('nombre_rol', 'ADMINISTRADOR')->value('id_rol') ?? 1;
        $rolRecepcion = DB::table('roles')->where('nombre_rol', 'RECEPCIONISTA')->value('id_rol') ?? 2;
        $rolMedico = DB::table('roles')->where('nombre_rol', 'MEDICO')->value('id_rol') ?? 3;
        $rolPaciente = DB::table('roles')->where('nombre_rol', 'PACIENTE')->value('id_rol') ?? 4;

        $todosPermisos = DB::table('permisos')->pluck('id_permiso')->toArray();

        // 1. Asignar todos los permisos al ADMINISTRADOR
        foreach ($todosPermisos as $idPermiso) {
            DB::table('rol_permisos')->updateOrInsert([
                'id_rol' => $rolAdmin,
                'id_permiso' => $idPermiso,
            ]);
        }

        // 2. Asignar permisos a RECEPCIONISTA
        $permisosRecepcion = DB::table('permisos')->whereIn('modulo', ['PACIENTES', 'CITAS', 'AGENDAS'])
            ->orWhereIn('nombre_permiso', ['laboratorios.cargar', 'laboratorios.ver', 'reportes.exportar'])
            ->pluck('id_permiso');
        foreach ($permisosRecepcion as $idPermiso) {
            DB::table('rol_permisos')->updateOrInsert([
                'id_rol' => $rolRecepcion,
                'id_permiso' => $idPermiso,
            ]);
        }

        // 3. Asignar permisos a MEDICO
        $permisosMedico = DB::table('permisos')->whereIn('modulo', ['CONSULTAS', 'AGENDAS'])
            ->orWhereIn('nombre_permiso', ['pacientes.ver', 'historial.ver', 'historial.editar', 'laboratorios.ver', 'laboratorios.descargar', 'dashboard.ver'])
            ->pluck('id_permiso');
        foreach ($permisosMedico as $idPermiso) {
            DB::table('rol_permisos')->updateOrInsert([
                'id_rol' => $rolMedico,
                'id_permiso' => $idPermiso,
            ]);
        }

        // 4. Asignar permisos a PACIENTE
        $permisosPaciente = DB::table('permisos')->whereIn('nombre_permiso', [
            'disponibilidad.ver',
            'citas.reservar',
            'citas.cancelar',
            'citas.ver',
            'laboratorios.ver',
            'laboratorios.descargar',
        ])->pluck('id_permiso');
        foreach ($permisosPaciente as $idPermiso) {
            DB::table('rol_permisos')->updateOrInsert([
                'id_rol' => $rolPaciente,
                'id_permiso' => $idPermiso,
            ]);
        }
    }
}
