<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cancelaciones_citas', function (Blueprint $table) {
            $table->bigIncrements('id_cancelacion');
            $table->unsignedBigInteger('id_cita')->unique();
            $table->text('motivo_cancelacion');
            $table->unsignedBigInteger('id_usuario_responsable');
            $table->timestamp('fecha_cancelacion')->useCurrent();

            $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('cascade');
            $table->foreign('id_usuario_responsable')->references('id_usuario')->on('usuarios')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cancelaciones_citas');
    }
};