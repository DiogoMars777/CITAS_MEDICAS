<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bitacora_auditoria', function (Blueprint $table) {
            $table->bigIncrements('id_bitacora');
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->string('modulo', 50);
            $table->string('tabla_afectada', 50);
            $table->unsignedBigInteger('id_registro_afectado');
            $table->string('operacion', 30); // INSERT, UPDATE, DELETE, LOGIN, LOGOUT, CAMBIO_ESTADO
            $table->jsonb('valores_anteriores')->nullable();
            $table->jsonb('valores_nuevos')->nullable();
            $table->string('direccion_ip', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();

            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onDelete('set null');
            $table->index(['tabla_afectada', 'id_registro_afectado'], 'idx_bitacora_registro');
            $table->index(['fecha_creacion'], 'idx_bitacora_fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bitacora_auditoria');
    }
};