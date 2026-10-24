<?php

namespace App\Controllers\PKG06_AtencionMedica\CU16_AtenderConsulta;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CU16_AtencionMedicaController extends Controller
{
    /**
     * CU16_AtenderConsulta - Accion principal
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG06_AtencionMedica',
            'case_of_use' => 'CU16_AtenderConsulta',
            'message' => 'Modulo CU16_AtencionMedicaController operativo.'
        ]);
    }
}
