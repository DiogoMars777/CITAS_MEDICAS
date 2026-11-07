<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('atenciones_medicas', function (Blueprint $table) {
            if (!Schema::hasColumn('atenciones_medicas', 'signos_vitales')) {
                $table->text('signos_vitales')->nullable()->after('sintomas');
            }
            if (!Schema::hasColumn('atenciones_medicas', 'derivacion_especialidad')) {
                $table->string('derivacion_especialidad', 100)->nullable()->after('receta_medica');
            }
        });
    }

    public function down(): void
    {
        Schema::table('atenciones_medicas', function (Blueprint $table) {
            if (Schema::hasColumn('atenciones_medicas', 'signos_vitales')) {
                $table->dropColumn('signos_vitales');
            }
            if (Schema::hasColumn('atenciones_medicas', 'derivacion_especialidad')) {
                $table->dropColumn('derivacion_especialidad');
            }
        });
    }
};

