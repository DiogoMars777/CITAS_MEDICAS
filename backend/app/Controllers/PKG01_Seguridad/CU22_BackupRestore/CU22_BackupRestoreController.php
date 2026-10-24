<?php

namespace App\Controllers\PKG01_Seguridad\CU22_BackupRestore;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CU22_BackupRestoreController extends Controller
{
    /**
     * CU22_BackupRestore - Accion principal
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'package' => 'PKG01_Seguridad',
            'case_of_use' => 'CU22_BackupRestore',
            'message' => 'Modulo CU22_BackupRestoreController operativo.'
        ]);
    }
}
