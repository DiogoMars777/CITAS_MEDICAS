<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('turnos_medicos', function (Blueprint $table) {
            $table->bigIncrements('id_turno');
            $table->unsignedBigInteger('id_medico');
            $table->smallInteger('dia_semana'); // 1 = Lunes .. 7 = Domingo
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->integer('duracion_bloque_min')->default(15);
            $table->string('estado', 20)->default('ACTIVO');

            $table->foreign('id_medico')->references('id_medico')->on('medicos')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('turnos_medicos');
    }
};