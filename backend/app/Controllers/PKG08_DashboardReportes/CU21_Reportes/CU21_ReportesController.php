<?php

namespace App\Controllers\PKG08_DashboardReportes\CU21_Reportes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CU21_ReportesController extends Controller
{
    /**
     * CU21_Reportes - Accion principal
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG08_DashboardReportes',
            'case_of_use' => 'CU21_Reportes',
            'message' => 'Modulo CU21_ReportesController operativo.'
        ]);
    }
}
