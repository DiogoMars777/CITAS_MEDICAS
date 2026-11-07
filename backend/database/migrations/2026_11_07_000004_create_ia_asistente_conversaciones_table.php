<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('ia_conversaciones')) {
            Schema::create('ia_conversaciones', function (Blueprint $table) {
                $table->id('id_conversacion');
                $table->foreignId('id_paciente')->nullable()->constrained('pacientes', 'id_paciente')->nullOnDelete();
                $table->text('mensaje_usuario');
                $table->string('especialidad_sugerida', 100)->nullable();
                $table->jsonb('sintomas_detectados')->nullable();
                $table->string('preferencia_horario', 100)->nullable();
                $table->string('preferencia_turno', 30)->nullable();
                $table->text('respuesta_voz_texto');
                $table->integer('opciones_encontradas')->default(0);
                $table->foreignId('id_cita_generada')->nullable()->constrained('citas', 'id_cita')->nullOnDelete();
                $table->timestampTz('fecha_creacion')->default(DB::raw('CURRENT_TIMESTAMP'));
            });
        }

        // Agregar médicos especialistas faltantes (Odontología, Ginecología, Oftalmología) si no existen
        $odontologia = DB::table('especialidades')->where('nombre', 'Odontología')->first();
        $ginecologia = DB::table('especialidades')->where('nombre', 'Ginecología')->first();
        $oftalmologia = DB::table('especialidades')->where('nombre', 'Oftalmología')->first();

        // Dra. Silvia Méndez (Odontología)
        $medOdonto = DB::table('medicos')->where('numero_registro_profesional', 'MP-10543')->first();
        if (!$medOdonto && $odontologia) {
            $idUserO = DB::table('usuarios')->insertGetId([
                'id_rol' => 3,
                'username' => 'dr_silvia_mendez',
                'email' => 'silvia.mendez@clinicavidasalud.com',
                'password_hash' => '$2y$12$Z0H3rLkJh16K2y8B6pEweO0d34Yn0WpW1bQcR7yS9uV5xY4z0WbQ2',
                'estado' => 'ACTIVO',
            ], 'id_usuario');

            $idMed = DB::table('medicos')->insertGetId([
                'id_usuario' => $idUserO,
                'numero_registro_profesional' => 'MP-10543',
                'nombres' => 'Silvia Marcela',
                'apellidos' => 'Méndez Cortez',
                'telefono' => '71239845',
                'email' => 'silvia.mendez@clinicavidasalud.com',
                'estado' => 'ACTIVO',
                'fecha_ingreso' => DB::raw('CURRENT_DATE'),
            ], 'id_medico');

            DB::table('medico_especialidades')->insert([
                'id_medico' => $idMed,
                'id_especialidad' => $odontologia->id_especialidad,
                'es_principal' => true,
            ]);

            // Turnos Lunes a Viernes Tarde (14:00 - 18:00) y Mañana (08:00 - 12:00)
            for ($dia = 1; $dia <= 5; $dia++) {
                DB::table('turnos_medicos')->insert([
                    'id_medico' => $idMed,
                    'dia_semana' => $dia,
                    'hora_inicio' => '14:00:00',
                    'hora_fin' => '18:00:00',
                    'duracion_bloque_min' => 15,
                    'estado' => 'ACTIVO',
                ]);
            }
        }

        // Dra. Claudia Silva (Ginecología)
        $medGineco = DB::table('medicos')->where('numero_registro_profesional', 'MP-10876')->first();
        if (!$medGineco && $ginecologia) {
            $idUserG = DB::table('usuarios')->insertGetId([
                'id_rol' => 3,
                'username' => 'dr_claudia_silva',
                'email' => 'claudia.silva@clinicavidasalud.com',
                'password_hash' => '$2y$12$Z0H3rLkJh16K2y8B6pEweO0d34Yn0WpW1bQcR7yS9uV5xY4z0WbQ2',
                'estado' => 'ACTIVO',
            ], 'id_usuario');

            $idMedG = DB::table('medicos')->insertGetId([
                'id_usuario' => $idUserG,
                'numero_registro_profesional' => 'MP-10876',
                'nombres' => 'Claudia Elena',
                'apellidos' => 'Silva Vargas',
                'telefono' => '72345612',
                'email' => 'claudia.silva@clinicavidasalud.com',
                'estado' => 'ACTIVO',
                'fecha_ingreso' => DB::raw('CURRENT_DATE'),
            ], 'id_medico');

            DB::table('medico_especialidades')->insert([
                'id_medico' => $idMedG,
                'id_especialidad' => $ginecologia->id_especialidad,
                'es_principal' => true,
            ]);

            // Turnos Lunes a Viernes Mañana (08:00 - 12:00)
            for ($dia = 1; $dia <= 5; $dia++) {
                DB::table('turnos_medicos')->insert([
                    'id_medico' => $idMedG,
                    'dia_semana' => $dia,
                    'hora_inicio' => '08:00:00',
                    'hora_fin' => '12:00:00',
                    'duracion_bloque_min' => 15,
                    'estado' => 'ACTIVO',
                ]);
            }
        }

        // Dr. Roberto Flores (Oftalmología)
        $medOftalmo = DB::table('medicos')->where('numero_registro_profesional', 'MP-11234')->first();
        if (!$medOftalmo && $oftalmologia) {
            $idUserOf = DB::table('usuarios')->insertGetId([
                'id_rol' => 3,
                'username' => 'dr_roberto_flores',
                'email' => 'roberto.flores@clinicavidasalud.com',
                'password_hash' => '$2y$12$Z0H3rLkJh16K2y8B6pEweO0d34Yn0WpW1bQcR7yS9uV5xY4z0WbQ2',
                'estado' => 'ACTIVO',
            ], 'id_usuario');

            $idMedO = DB::table('medicos')->insertGetId([
                'id_usuario' => $idUserOf,
                'numero_registro_profesional' => 'MP-11234',
                'nombres' => 'Roberto Carlos',
                'apellidos' => 'Flores Antelo',
                'telefono' => '73456789',
                'email' => 'roberto.flores@clinicavidasalud.com',
                'estado' => 'ACTIVO',
                'fecha_ingreso' => DB::raw('CURRENT_DATE'),
            ], 'id_medico');

            DB::table('medico_especialidades')->insert([
                'id_medico' => $idMedO,
                'id_especialidad' => $oftalmologia->id_especialidad,
                'es_principal' => true,
            ]);

            // Turnos Lunes a Viernes Tarde (14:00 - 18:00)
            for ($dia = 1; $dia <= 5; $dia++) {
                DB::table('turnos_medicos')->insert([
                    'id_medico' => $idMedO,
                    'dia_semana' => $dia,
                    'hora_inicio' => '14:00:00',
                    'hora_fin' => '18:00:00',
                    'duracion_bloque_min' => 15,
                    'estado' => 'ACTIVO',
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ia_conversaciones');
    }
};
