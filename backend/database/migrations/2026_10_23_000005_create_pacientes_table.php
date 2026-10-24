<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->bigIncrements('id_paciente');
            $table->unsignedBigInteger('id_usuario')->nullable()->unique();
            $table->string('ci', 20)->unique();
            $table->string('nombres', 80);
            $table->string('apellidos', 80);
            $table->date('fecha_nacimiento');
            $table->string('sexo', 10);
            $table->string('telefono', 25)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('direccion', 200)->nullable();
            $table->boolean('primera_visita')->default(true);
            $table->string('estado', 20)->default('ACTIVO');
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamp('fecha_actualizacion')->nullable();

            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};