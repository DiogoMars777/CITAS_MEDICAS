<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atenciones_medicas', function (Blueprint $table) {
            $table->bigIncrements('id_atencion');
            $table->unsignedBigInteger('id_cita')->unique();
            $table->unsignedBigInteger('id_historia_clinica');
            $table->unsignedBigInteger('id_medico');
            $table->string('motivo_consulta', 255);
            $table->text('sintomas')->nullable();
            $table->string('diagnostico_cie10', 20)->nullable();
            $table->text('diagnostico_descripcion');
            $table->text('tratamiento')->nullable();
            $table->text('receta_medica')->nullable();
            $table->timestamp('fecha_atencion');
            $table->timestamp('fecha_creacion')->useCurrent();

            $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('restrict');
            $table->foreign('id_historia_clinica')->references('id_historia_clinica')->on('historias_clinicas')->onDelete('restrict');
            $table->foreign('id_medico')->references('id_medico')->on('medicos')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atenciones_medicas');
    }
};