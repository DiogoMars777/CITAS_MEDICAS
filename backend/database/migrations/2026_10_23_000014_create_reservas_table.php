<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->bigIncrements('id_reserva');
            $table->unsignedBigInteger('id_cita')->unique();
            $table->unsignedBigInteger('id_paciente');
            $table->string('token_reserva', 100)->unique();
            $table->timestamp('fecha_expiracion');
            $table->string('estado_reserva', 20)->default('PENDIENTE'); // PENDIENTE, CONFIRMADA, EXPIRADA

            $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('cascade');
            $table->foreign('id_paciente')->references('id_paciente')->on('pacientes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};