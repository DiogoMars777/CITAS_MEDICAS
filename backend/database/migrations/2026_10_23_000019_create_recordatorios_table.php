<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recordatorios', function (Blueprint $table) {
            $table->bigIncrements('id_recordatorio');
            $table->unsignedBigInteger('id_cita');
            $table->string('tipo_canal', 20); // EMAIL, SMS, WHATSAPP
            $table->timestamp('fecha_programada');
            $table->timestamp('fecha_envio')->nullable();
            $table->string('estado_envio', 20)->default('PENDIENTE'); // PENDIENTE, ENVIADO, FALLIDO
            $table->integer('intentos')->default(0);
            $table->text('mensaje');

            $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recordatorios');
    }
};