<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * CU23: Gestionar Pagos - Cobro y Facturación de Citas Médicas
     */
    public function up(): void
    {
        if (!Schema::hasTable('pagos')) {
            Schema::create('pagos', function (Blueprint $table) {
                $table->id('id_pago');
                $table->string('codigo_pago', 30)->unique(); // Ej: PAG-20261107-A1B2
                $table->unsignedBigInteger('id_cita');
                $table->unsignedBigInteger('id_paciente');
                $table->decimal('monto', 10, 2);
                $table->string('moneda', 10)->default('BOB'); // BOB (Bolivianos), USD
                $table->string('metodo_pago', 30); // EFECTIVO, QR, TRANSFERENCIA, TARJETA, PAYPAL
                $table->string('estado_pago', 20)->default('COMPLETADO'); // PENDIENTE, COMPLETADO, NO_REEMBOLSABLE, ANULADO
                $table->string('canal_pago', 20)->default('RECEPCION'); // RECEPCION, EN_LINEA_PACIENTE, IA_ASISTENTE
                $table->string('numero_comprobante', 50)->unique(); // Ej: REC-2026-00001
                $table->string('referencia_transaccion', 120)->nullable(); // TX bancaria, ID PayPal, Hash QR
                $table->jsonb('detalles_pago')->nullable(); // Desglose, titular, banco emisor, cambio
                $table->string('politica_reembolso', 255)->default('No se aceptan devoluciones monetarias. Cita sujeta a reprogramación.');
                $table->unsignedBigInteger('id_usuario_cajero')->nullable(); // Cajero o recepcionista responsable
                $table->timestampTz('fecha_pago')->useCurrent();
                $table->timestampTz('fecha_creacion')->useCurrent();
                $table->timestampTz('fecha_actualizacion')->useCurrent();

                // Llaves foráneas e índices
                $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('restrict');
                $table->foreign('id_paciente')->references('id_paciente')->on('pacientes')->onDelete('restrict');
                $table->foreign('id_usuario_cajero')->references('id_usuario')->on('usuarios')->onDelete('restrict');

                $table->index('id_cita');
                $table->index('id_paciente');
                $table->index('fecha_pago');
                $table->index('estado_pago');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
