<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('especialidades', function (Blueprint $table) {
            $table->increments('id_especialidad');
            $table->string('nombre', 80)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->string('estado', 20)->default('ACTIVO');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('especialidades');
    }
};