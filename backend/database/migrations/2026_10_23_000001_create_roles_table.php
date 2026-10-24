<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id_rol');
            $table->string('nombre_rol', 30)->unique();
            $table->string('descripcion', 150)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};