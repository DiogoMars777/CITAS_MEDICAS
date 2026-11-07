<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * CU22 - Verificador continuo del Scheduler de Copias de Seguridad Automáticas
 * Clínica Vida Salud
 */
Schedule::command('backup:run-scheduled')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground();
