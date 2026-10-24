<?php

namespace App\Controllers\PKG07_Laboratorios\CU17_CargarEstudios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CU17_CargaEstudioController extends Controller
{
    /**
     * CU17_CargarEstudios - Accion principal
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG07_Laboratorios',
            'case_of_use' => 'CU17_CargarEstudios',
            'message' => 'Modulo CU17_CargaEstudioController operativo.'
        ]);
    }
}
