<?php

namespace App\Controllers\PKG07_Laboratorios\CU18_VisualizarEstudios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CU18_VisualizarEstudiosController extends Controller
{
    /**
     * CU18_VisualizarEstudios - Accion principal
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG07_Laboratorios',
            'case_of_use' => 'CU18_VisualizarEstudios',
            'message' => 'Modulo CU18_VisualizarEstudiosController operativo.'
        ]);
    }
}
