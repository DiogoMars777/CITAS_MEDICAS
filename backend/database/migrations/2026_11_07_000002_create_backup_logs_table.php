<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('backup_logs')) {
            Schema::create('backup_logs', function (Blueprint $table) {
                $table->id('id_backup');
                $table->string('nombre_archivo', 150)->unique();
                $table->string('tipo_backup', 30)->default('COMPLETO'); // COMPLETO, SOLO_DATOS, SOLO_ESTRUCTURA
                $table->unsignedBigInteger('tamano_bytes')->default(0);
                $table->string('tamano_formateado', 20)->default('0 KB');
                $table->string('estado', 20)->default('COMPLETADO'); // COMPLETADO, EN_PROCESO, FALLIDO, RESTAURADO
                $table->string('checksum_sha256', 64)->nullable();
                $table->string('ruta_almacenamiento', 255)->nullable();
                $table->json('detalles')->nullable();
                $table->unsignedBigInteger('creado_por')->default(1);
                $table->timestamp('fecha_creacion')->useCurrent();
                $table->timestamp('fecha_restauracion')->nullable();
                $table->unsignedBigInteger('restaurado_por')->nullable();

                $table->foreign('creado_por')->references('id_usuario')->on('usuarios')->onDelete('cascade');
                $table->foreign('restaurado_por')->references('id_usuario')->on('usuarios')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('backup_logs');
    }
};

