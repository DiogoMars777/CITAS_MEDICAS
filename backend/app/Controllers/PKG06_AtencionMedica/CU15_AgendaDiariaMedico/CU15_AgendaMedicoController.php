<?php

namespace App\Controllers\PKG06_AtencionMedica\CU15_AgendaDiariaMedico;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CU15_AgendaMedicoController extends Controller
{
    /**
     * CU15_AgendaDiariaMedico - Accion principal
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG06_AtencionMedica',
            'case_of_use' => 'CU15_AgendaDiariaMedico',
            'message' => 'Modulo CU15_AgendaMedicoController operativo.'
        ]);
    }
}
