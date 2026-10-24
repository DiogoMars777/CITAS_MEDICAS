<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contactos_emergencia', function (Blueprint $table) {
            $table->bigIncrements('id_contacto');
            $table->unsignedBigInteger('id_paciente');
            $table->string('nombre_completo', 120);
            $table->string('parentesco', 40);
            $table->string('telefono', 25);
            $table->string('direccion', 200)->nullable();

            $table->foreign('id_paciente')->references('id_paciente')->on('pacientes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contactos_emergencia');
    }
};