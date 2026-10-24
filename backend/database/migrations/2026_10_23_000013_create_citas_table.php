<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->bigIncrements('id_cita');
            $table->string('codigo_cita', 30)->unique();
            $table->unsignedBigInteger('id_paciente');
            $table->unsignedBigInteger('id_medico');
            $table->unsignedInteger('id_especialidad');
            $table->date('fecha_cita');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->string('motivo_consulta', 255);
            $table->string('estado_cita', 20)->default('PROGRAMADA'); // PROGRAMADA, CONFIRMADA, ATENDIDA, CANCELADA, INASISTENCIA
            $table->unsignedBigInteger('creado_por');
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamp('fecha_actualizacion')->nullable();

            $table->foreign('id_paciente')->references('id_paciente')->on('pacientes')->onDelete('restrict');
            $table->foreign('id_medico')->references('id_medico')->on('medicos')->onDelete('restrict');
            $table->foreign('id_especialidad')->references('id_especialidad')->on('especialidades')->onDelete('restrict');
            $table->foreign('creado_por')->references('id_usuario')->on('usuarios')->onDelete('restrict');

            $table->index(['id_medico', 'fecha_cita', 'hora_inicio'], 'idx_citas_medico_agenda');
            $table->index(['id_paciente', 'fecha_cita'], 'idx_citas_paciente_fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};