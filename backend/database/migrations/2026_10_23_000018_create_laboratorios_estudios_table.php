<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laboratorios_estudios', function (Blueprint $table) {
            $table->bigIncrements('id_estudio');
            $table->string('codigo_estudio', 30)->unique();
            $table->unsignedBigInteger('id_paciente');
            $table->unsignedBigInteger('id_medico_solicitante');
            $table->unsignedBigInteger('id_cita')->nullable();
            $table->string('nombre_estudio', 120);
            $table->string('tipo_estudio', 80);
            $table->text('descripcion')->nullable();
            $table->timestamp('fecha_solicitud')->useCurrent();
            $table->string('estado', 20)->default('PENDIENTE'); // PENDIENTE, EN_PROCESO, PUBLICADO
            $table->text('resultado_diagnostico')->nullable();
            $table->string('archivo_resultado_url', 255)->nullable();
            $table->timestamp('publicado_en')->nullable();

            $table->foreign('id_paciente')->references('id_paciente')->on('pacientes')->onDelete('restrict');
            $table->foreign('id_medico_solicitante')->references('id_medico')->on('medicos')->onDelete('restrict');
            $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laboratorios_estudios');
    }
};