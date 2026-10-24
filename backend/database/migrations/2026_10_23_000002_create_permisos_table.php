<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permisos', function (Blueprint $table) {
            $table->increments('id_permiso');
            $table->string('modulo', 50);
            $table->string('nombre_permiso', 50)->unique();
            $table->string('descripcion', 150)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permisos');
    }
};