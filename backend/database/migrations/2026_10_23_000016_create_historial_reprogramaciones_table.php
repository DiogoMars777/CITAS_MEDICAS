<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_reprogramaciones', function (Blueprint $table) {
            $table->bigIncrements('id_reprogramacion');
            $table->unsignedBigInteger('id_cita');
            $table->date('fecha_anterior');
            $table->time('hora_inicio_anterior');
            $table->time('hora_fin_anterior');
            $table->unsignedBigInteger('id_medico_anterior');
            $table->date('fecha_nueva');
            $table->time('hora_inicio_nueva');
            $table->time('hora_fin_nueva');
            $table->unsignedBigInteger('id_medico_nuevo');
            $table->text('motivo_reprogramacion');
            $table->unsignedBigInteger('id_usuario_responsable');
            $table->timestamp('fecha_operacion')->useCurrent();

            $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('cascade');
            $table->foreign('id_medico_anterior')->references('id_medico')->on('medicos')->onDelete('restrict');
            $table->foreign('id_medico_nuevo')->references('id_medico')->on('medicos')->onDelete('restrict');
            $table->foreign('id_usuario_responsable')->references('id_usuario')->on('usuarios')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_reprogramaciones');
    }
};