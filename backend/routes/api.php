<?php

use Illuminate\Support\Facades\Route;
use App\Controllers\PKG01_Seguridad\CU01_Autenticacion\CU01_AutenticacionController;
use App\Controllers\PKG01_Seguridad\CU02_BitacoraAuditoria\CU02_BitacoraAuditoriaController;
use App\Controllers\PKG01_Seguridad\CU03_GestionUsuarios\CU03_GestionUsuariosController;
use App\Controllers\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades\CU04_EspecialidadController;
use App\Controllers\PKG02_MedicosEspecialidades\CU05_GestionMedicos\CU05_MedicoController;
use App\Controllers\PKG03_PacientesHistorial\CU06_RegistroPaciente\CU06_PacienteController;
use App\Controllers\PKG04_AgendasHorarios\CU07_ConfigurarTurnos\CU07_TurnoMedicoController;
use App\Controllers\PKG04_AgendasHorarios\CU08_BloqueosAgenda\CU08_BloqueoAgendaController;
use App\Controllers\PKG04_AgendasHorarios\CU09_ConsultarDisponibilidad\CU09_DisponibilidadController;
use App\Controllers\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\CU10_ReservaCitaController;
use App\Controllers\PKG05_GestionCitasConcurrencia\CU11_ReprogramarCita\CU11_ReprogramacionController;
use App\Controllers\PKG05_GestionCitasConcurrencia\CU12_CancelarCita\CU12_CancelacionController;
use App\Controllers\PKG05_GestionCitasConcurrencia\CU13_ControlAsistencia\CU13_AsistenciaController;
use App\Controllers\PKG03_PacientesHistorial\CU14_AntecedentesClinicos\CU14_AntecedentesClinicosController;

/*
|--------------------------------------------------------------------------
| API Routes - Clínica Vida Salud
|--------------------------------------------------------------------------
*/

// ==========================================
// CU01: Autenticación y Recuperación
// ==========================================
Route::prefix('auth')->group(function () {
    Route::post('/login', [CU01_AutenticacionController::class, 'iniciarSesion']);
    Route::post('/forgot-password', [CU01_AutenticacionController::class, 'solicitarRecuperacion']);
    Route::post('/verify-otp', [CU01_AutenticacionController::class, 'verificarCodigoOtp']);
    Route::post('/reset-password', [CU01_AutenticacionController::class, 'restablecerContrasena']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [CU01_AutenticacionController::class, 'cerrarSesion']);
        Route::get('/me', [CU01_AutenticacionController::class, 'obtenerUsuarioActual']);
    });
});

// ==========================================
// CU02: Bitácora de Auditoría (Hora Bolivia)
// ==========================================
Route::prefix('audit')->group(function () {
    Route::get('/logs', [CU02_BitacoraAuditoriaController::class, 'listarAuditoria']);
    Route::get('/stats', [CU02_BitacoraAuditoriaController::class, 'estadisticasAuditoria']);
    Route::get('/logs/{id}', [CU02_BitacoraAuditoriaController::class, 'obtenerDetalleAuditoria']);
});

// ==========================================
// CU03: Gestión de Usuarios Internos, Roles y Permisos
// ==========================================
Route::prefix('usuarios')->group(function () {
    Route::get('/', [CU03_GestionUsuariosController::class, 'listarUsuarios']);
    Route::post('/', [CU03_GestionUsuariosController::class, 'crearUsuario']);
    Route::get('/meta/roles', [CU03_GestionUsuariosController::class, 'obtenerRoles']);
    Route::get('/meta/permisos', [CU03_GestionUsuariosController::class, 'obtenerPermisos']);
    Route::post('/meta/roles/{idRol}/permisos', [CU03_GestionUsuariosController::class, 'asignarPermisosRol']);
    Route::get('/{id}', [CU03_GestionUsuariosController::class, 'obtenerUsuario']);
    Route::put('/{id}', [CU03_GestionUsuariosController::class, 'actualizarUsuario']);
    Route::patch('/{id}/estado', [CU03_GestionUsuariosController::class, 'cambiarEstado']);
    Route::delete('/{id}', [CU03_GestionUsuariosController::class, 'eliminarUsuario']);
});

// ==========================================
// CU04: Gestión de Especialidades Médicas
// ==========================================
Route::prefix('especialidades')->group(function () {
    Route::get('/', [CU04_EspecialidadController::class, 'index']);
    Route::post('/', [CU04_EspecialidadController::class, 'store']);
    Route::get('/{id}', [CU04_EspecialidadController::class, 'show']);
    Route::put('/{id}', [CU04_EspecialidadController::class, 'update']);
    Route::patch('/{id}/estado', [CU04_EspecialidadController::class, 'cambiarEstado']);
    Route::delete('/{id}', [CU04_EspecialidadController::class, 'destroy']);
});

// ==========================================
// CU05: Gestión de Médicos y Asignación de Especialidades
// ==========================================
Route::prefix('medicos')->group(function () {
    Route::get('/', [CU05_MedicoController::class, 'index']);
    Route::get('/meta', [CU05_MedicoController::class, 'meta']);
    Route::post('/', [CU05_MedicoController::class, 'store']);
    Route::get('/{id}', [CU05_MedicoController::class, 'show']);
    Route::put('/{id}', [CU05_MedicoController::class, 'update']);
    Route::patch('/{id}/estado', [CU05_MedicoController::class, 'cambiarEstado']);
    Route::delete('/{id}', [CU05_MedicoController::class, 'destroy']);
});

// ==========================================
// CU06: Registro de Paciente y Apertura en Primera Visita
// ==========================================
Route::prefix('pacientes')->group(function () {
    Route::get('/', [CU06_PacienteController::class, 'index']);
    Route::post('/', [CU06_PacienteController::class, 'store']);
    Route::get('/{id}', [CU06_PacienteController::class, 'show']);
    Route::put('/{id}', [CU06_PacienteController::class, 'update']);
    Route::patch('/{id}/estado', [CU06_PacienteController::class, 'cambiarEstado']);
    Route::delete('/{id}', [CU06_PacienteController::class, 'destroy']);
});

// ==========================================
// CU07: Configuración de Agenda y Horarios Médicos (15 min)
// ==========================================
Route::prefix('turnos')->group(function () {
    Route::get('/', [CU07_TurnoMedicoController::class, 'index']);
    Route::get('/meta', [CU07_TurnoMedicoController::class, 'meta']);
    Route::get('/medico/{idMedico}/semanal', [CU07_TurnoMedicoController::class, 'agendaSemanalMedico']);
    Route::post('/', [CU07_TurnoMedicoController::class, 'store']);
    Route::get('/{id}', [CU07_TurnoMedicoController::class, 'show']);
    Route::put('/{id}', [CU07_TurnoMedicoController::class, 'update']);
    Route::patch('/{id}/estado', [CU07_TurnoMedicoController::class, 'cambiarEstado']);
    Route::delete('/{id}', [CU07_TurnoMedicoController::class, 'destroy']);
});

// ==========================================
// CU08: Registrar bloqueos de agenda médica
// ==========================================
Route::prefix('bloqueos')->group(function () {
    Route::get('/', [CU08_BloqueoAgendaController::class, 'index']);
    Route::get('/meta', [CU08_BloqueoAgendaController::class, 'meta']);
    Route::post('/', [CU08_BloqueoAgendaController::class, 'store']);
    Route::delete('/{id}', [CU08_BloqueoAgendaController::class, 'destroy']);
});

// ==========================================
// CU09: Consultar disponibilidad de horarios médicos
// ==========================================
Route::prefix('disponibilidad')->group(function () {
    Route::get('/meta', [CU09_DisponibilidadController::class, 'meta']);
    Route::get('/', [CU09_DisponibilidadController::class, 'consultar']);
    // Compatibilidad
    Route::get('/bloqueos', [CU08_BloqueoAgendaController::class, 'index']);
    Route::post('/bloqueos', [CU08_BloqueoAgendaController::class, 'store']);
    Route::delete('/bloqueos/{id}', [CU08_BloqueoAgendaController::class, 'destroy']);
});

// ==========================================
// CU10: Reservar cita médica con control de concurrencia
// ==========================================
Route::prefix('citas')->group(function () {
    Route::get('/', [CU10_ReservaCitaController::class, 'index']);
    Route::get('/meta', [CU10_ReservaCitaController::class, 'meta']);
    Route::post('/', [CU10_ReservaCitaController::class, 'store']);
    Route::get('/{id}', [CU10_ReservaCitaController::class, 'show']);

    // CU11: Reprogramar cita médica
    Route::post('/{id}/reprogramar', [CU11_ReprogramacionController::class, 'reprogramarCita']);
    Route::get('/{id}/historial', [CU11_ReprogramacionController::class, 'historial']);

    // CU12: Cancelar cita médica
    Route::patch('/{id}/cancelar', [CU12_CancelacionController::class, 'cancelarCita']);
    Route::get('/{id}/cancelacion', [CU12_CancelacionController::class, 'detalleCancelacion']);

    // CU13: Registrar asistencia e inasistencia
    Route::patch('/{id}/estado', [CU10_ReservaCitaController::class, 'cambiarEstado']);
    Route::patch('/{id}/asistencia', [CU13_AsistenciaController::class, 'registrarAsistencia']);
});

// ==========================================
// CU13: Bandeja de Control de Asistencia en Sala de Espera
// ==========================================
Route::prefix('asistencia')->group(function () {
    Route::get('/', [CU13_AsistenciaController::class, 'index']);
    Route::patch('/{id}', [CU13_AsistenciaController::class, 'registrarAsistencia']);
});

// ==========================================
// CU14: Registrar y actualizar antecedentes clínicos base
// ==========================================
Route::prefix('antecedentes-clinicos')->group(function () {
    Route::get('/', [CU14_AntecedentesClinicosController::class, 'index']);
    Route::get('/paciente/{idPaciente}', [CU14_AntecedentesClinicosController::class, 'show']);
    Route::put('/paciente/{idPaciente}', [CU14_AntecedentesClinicosController::class, 'update']);
});





