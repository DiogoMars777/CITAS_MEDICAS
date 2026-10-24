<?php

namespace App\Controllers\PKG08_DashboardReportes\CU19_Recordatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * CU19 - Gestionar recordatorios y notificaciones
 * Actor(es): Sistema, Recepcionista
 */
class CU19_RecordatorioController extends Controller
{
    /**
     * CU19 - Listar y gestionar recordatorios automáticos
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG08_DashboardReportes',
            'case_of_use' => 'CU19_Recordatorios',
            'message' => 'Módulo CU19_RecordatorioController operativo.'
        ]);
    }
}
