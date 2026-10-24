<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicos', function (Blueprint $table) {
            $table->bigIncrements('id_medico');
            $table->unsignedBigInteger('id_usuario')->unique();
            $table->string('numero_registro_profesional', 40)->unique();
            $table->string('nombres', 80);
            $table->string('apellidos', 80);
            $table->string('telefono', 25);
            $table->string('email', 100);
            $table->string('estado', 20)->default('ACTIVO');
            $table->date('fecha_ingreso');

            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicos');
    }
};