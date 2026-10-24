<?php

namespace App\Controllers\PKG08_DashboardReportes\CU20_Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CU20_DashboardController extends Controller
{
    /**
     * CU20_Dashboard - Accion principal
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG08_DashboardReportes',
            'case_of_use' => 'CU20_Dashboard',
            'message' => 'Modulo CU20_DashboardController operativo.'
        ]);
    }
}
