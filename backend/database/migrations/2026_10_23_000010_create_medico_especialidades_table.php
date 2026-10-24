<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medico_especialidades', function (Blueprint $table) {
            $table->unsignedBigInteger('id_medico');
            $table->unsignedInteger('id_especialidad');
            $table->boolean('es_principal')->default(false);

            $table->primary(['id_medico', 'id_especialidad']);
            $table->foreign('id_medico')->references('id_medico')->on('medicos')->onDelete('cascade');
            $table->foreign('id_especialidad')->references('id_especialidad')->on('especialidades')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medico_especialidades');
    }
};