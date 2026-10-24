<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bloqueos_agenda', function (Blueprint $table) {
            $table->bigIncrements('id_bloqueo');
            $table->unsignedBigInteger('id_medico');
            $table->date('fecha_inicio');
            $table->time('hora_inicio');
            $table->date('fecha_fin');
            $table->time('hora_fin');
            $table->string('motivo', 255);
            $table->boolean('todo_el_dia')->default(false);
            $table->unsignedBigInteger('creado_por');
            $table->timestamp('fecha_creacion')->useCurrent();

            $table->foreign('id_medico')->references('id_medico')->on('medicos')->onDelete('cascade');
            $table->foreign('creado_por')->references('id_usuario')->on('usuarios')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bloqueos_agenda');
    }
};