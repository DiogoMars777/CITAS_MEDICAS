<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historias_clinicas', function (Blueprint $table) {
            $table->bigIncrements('id_historia_clinica');
            $table->unsignedBigInteger('id_paciente')->unique();
            $table->string('numero_expediente', 30)->unique();
            $table->string('tipo_sangre', 5)->nullable();
            $table->text('alergias_medicamentos')->nullable();
            $table->text('enfermedades_hereditarias')->nullable();
            $table->text('antecedentes_patologicos')->nullable();
            $table->text('antecedentes_quirurgicos')->nullable();
            $table->timestamp('fecha_apertura')->useCurrent();
            $table->timestamp('fecha_actualizacion')->nullable();

            $table->foreign('id_paciente')->references('id_paciente')->on('pacientes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historias_clinicas');
    }
};