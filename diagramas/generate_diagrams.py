import os
import re
import urllib.request
import time

DIAGRAMS = {
    "cu01_analisis_iniciar_cerrar_sesion": """@startuml cu01_analisis_iniciar_cerrar_sesion
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU01 Iniciar y cerrar sesión" {
    actor "Usuario / Administrador" as UserActor
    
    class UI_Sesion {
        + iniciarSesion(): void
        + solicitarRecuperacion(): void
        + verificarOtp(): void
        + restablecerContrasena(): void
        + cerrarSesion(): void
        + obtenerUsuarioActual(): void
    }

    class AutenticacionController {
        + iniciarSesion(Request): JsonResponse
        + solicitarRecuperacion(Request): JsonResponse
        + verificarCodigoOtp(Request): JsonResponse
        + restablecerContrasena(Request): JsonResponse
        + cerrarSesion(Request): JsonResponse
        + obtenerUsuarioActual(Request): JsonResponse
        + login(Request): JsonResponse
        + logout(Request): JsonResponse
    }

    class Usuario {
        - id_usuario: bigint
        - id_rol: int
        - username: string
        - email: string
        - password_hash: string
        - estado: string
        - ultimo_login: timestamp
        - fecha_creacion: timestamp
        - fecha_actualizacion: timestamp
        --
        + createToken(): string
        + first(): Usuario
        + save(): boolean
        + whereRaw(): QueryBuilder
    }

    class Rol {
        - id_rol: int
        - nombre_rol: string
        - descripcion: string
        - activo: boolean
        - fecha_creacion: timestamp
        --
        + find(): Rol
        + get(): Collection
    }

    class BitacoraAuditoria {
        - id_bitacora: bigint
        - id_usuario: bigint
        - modulo: string
        - tabla_afectada: string
        - id_registro_afectado: bigint
        - operacion: string
        - valores_anteriores: jsonb
        - valores_nuevos: jsonb
        - direccion_ip: string
        - user_agent: string
        - fecha_creacion: timestamp
        --
        + registrar(): void
    }

    UserActor -right- UI_Sesion
    UI_Sesion -right- AutenticacionController
    AutenticacionController -right- Usuario

    Usuario "0..*" ---up--- "1" Rol
    Usuario "1" ---right--- "0..*" BitacoraAuditoria
}
@enduml""",

    "cu02_analisis_consultar_bitacora": """@startuml cu02_analisis_consultar_bitacora
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU02 Consultar bitácora de auditoría" {
    actor Administrador
    
    class UI_Auditoria {
        + mostrarBitacora(): void
        + filtrarPorCriterios(): void
        + verDetalleEvento(): void
        + consultarEstadisticas(): void
    }

    class BitacoraAuditoriaController {
        + listarAuditoria(Request): JsonResponse
        + obtenerDetalleAuditoria(id: int): JsonResponse
        + estadisticasAuditoria(): JsonResponse
        + index(Request): JsonResponse
        + show(id: int): JsonResponse
        + stats(): JsonResponse
    }

    class BitacoraAuditoria {
        - id_bitacora: bigint
        - id_usuario: bigint
        - modulo: string
        - tabla_afectada: string
        - id_registro_afectado: bigint
        - operacion: string
        - valores_anteriores: jsonb
        - valores_nuevos: jsonb
        - direccion_ip: string
        - user_agent: string
        - fecha_creacion: timestamp
        --
        + count(): int
        + find(): BitacoraAuditoria
        + paginate(): LengthAwarePaginator
        + with(): QueryBuilder
    }

    class Usuario {
        - id_usuario: bigint
        - id_rol: int
        - username: string
        - email: string
        - estado: string
        --
        + find(): Usuario
        + get(): Collection
    }

    Administrador -right- UI_Auditoria
    UI_Auditoria -right- BitacoraAuditoriaController
    BitacoraAuditoriaController -right- BitacoraAuditoria

    BitacoraAuditoria "0..*" ---right--- "0..1" Usuario
}
@enduml""",

    "cu03_analisis_gestionar_usuarios_roles": """@startuml cu03_analisis_gestionar_usuarios_roles
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU03 Gestionar usuarios, roles y permisos" {
    actor Administrador
    
    class UI_GestionUsuarios {
        + mostrarUsuarios(): void
        + crearUsuario(): void
        + editarUsuario(): void
        + cambiarEstadoUsuario(): void
        + gestionarPermisosRol(): void
    }

    class GestionUsuariosController {
        + listarUsuarios(Request): JsonResponse
        + crearUsuario(Request): JsonResponse
        + obtenerUsuario(id: int): JsonResponse
        + actualizarUsuario(Request, id: int): JsonResponse
        + cambiarEstado(Request, id: int): JsonResponse
        + eliminarUsuario(Request, id: int): JsonResponse
        + obtenerRoles(): JsonResponse
        + obtenerPermisos(): JsonResponse
        + asignarPermisosRol(Request, idRol: int): JsonResponse
    }

    class Usuario {
        - id_usuario: bigint
        - id_rol: int
        - username: string
        - email: string
        - password_hash: string
        - estado: string
        - ultimo_login: timestamp
        - fecha_creacion: timestamp
        - fecha_actualizacion: timestamp
        --
        + create(): Usuario
        + find(): Usuario
        + update(): boolean
        + with(): QueryBuilder
    }

    class Rol {
        - id_rol: int
        - nombre_rol: string
        - descripcion: string
        - activo: boolean
        - fecha_creacion: timestamp
        --
        + find(): Rol
        + get(): Collection
    }

    class RolPermiso {
        - id_rol: int
        - id_permiso: int
        --
        + insert(): boolean
    }

    class Permiso {
        - id_permiso: int
        - modulo: string
        - nombre_permiso: string
        - descripcion: string
        --
        + get(): Collection
    }

    Administrador -right- UI_GestionUsuarios
    UI_GestionUsuarios -right- GestionUsuariosController
    GestionUsuariosController -right- Usuario

    Usuario "0..*" ---up--- "1" Rol
    Rol "1" ---right--- "0..*" RolPermiso
    RolPermiso "0..*" ---right--- "1" Permiso
}
@enduml""",

    "cu04_analisis_gestionar_especialidades": """@startuml cu04_analisis_gestionar_especialidades
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU04 Gestionar especialidades médicas" {
    actor Administrador
    
    class UI_Especialidad {
        + mostrarEspecialidades(): void
        + crearEspecialidad(): void
        + editarEspecialidad(): void
        + cambiarEstado(): void
    }

    class EspecialidadController {
        + index(Request): JsonResponse
        + store(Request): JsonResponse
        + show(id: int): JsonResponse
        + update(Request, id: int): JsonResponse
        + cambiarEstado(Request, id: int): JsonResponse
        + destroy(Request, id: int): JsonResponse
    }

    class Especialidad {
        - id_especialidad: int
        - nombre: string
        - descripcion: string
        - estado: string
        --
        + create(): Especialidad
        + find(): Especialidad
        + paginate(): LengthAwarePaginator
        + update(): boolean
    }

    class MedicoEspecialidad {
        - id_medico: bigint
        - id_especialidad: int
        - es_principal: boolean
        --
        + where(): QueryBuilder
    }

    class Medico {
        - id_medico: bigint
        - numero_registro_profesional: string
        - nombres: string
        - apellidos: string
        - estado: string
        --
        + get(): Collection
    }

    Administrador -right- UI_Especialidad
    UI_Especialidad -right- EspecialidadController
    EspecialidadController -right- Especialidad

    Especialidad "1" ---right--- "0..*" MedicoEspecialidad
    MedicoEspecialidad "0..*" ---right--- "1" Medico
}
@enduml""",

    "cu05_analisis_gestionar_medicos": """@startuml cu05_analisis_gestionar_medicos
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU05 Gestionar médicos y asignaciones" {
    actor Administrador
    
    class UI_Medico {
        + mostrarMedicos(): void
        + registrarMedico(): void
        + verDetalleMedico(): void
        + actualizarMedico(): void
        + cambiarEstado(): void
    }

    class MedicoController {
        + index(Request): JsonResponse
        + meta(): JsonResponse
        + store(Request): JsonResponse
        + show(id: int): JsonResponse
        + update(Request, id: int): JsonResponse
        + cambiarEstado(Request, id: int): JsonResponse
        + destroy(Request, id: int): JsonResponse
    }

    class Medico {
        - id_medico: bigint
        - id_usuario: bigint
        - numero_registro_profesional: string
        - nombres: string
        - apellidos: string
        - telefono: string
        - email: string
        - estado: string
        - fecha_ingreso: date
        --
        + create(): Medico
        + findOrFail(): Medico
        + update(): boolean
        + with(): QueryBuilder
    }

    class Usuario {
        - id_usuario: bigint
        - username: string
        - email: string
        - id_rol: int
        - estado: string
        --
        + create(): Usuario
        + save(): boolean
    }

    class Especialidad {
        - id_especialidad: int
        - nombre: string
        - estado: string
        --
        + get(): Collection
    }

    class MedicoEspecialidad {
        - id_medico: bigint
        - id_especialidad: int
        - es_principal: boolean
        --
        + delete(): boolean
        + insert(): boolean
    }

    Administrador -right- UI_Medico
    UI_Medico -right- MedicoController
    MedicoController -right- Medico

    Medico "1" ---up--- "0..1" Usuario
    Medico "1" ---right--- "1..*" MedicoEspecialidad
    MedicoEspecialidad "0..*" ---down--- "1" Especialidad
}
@enduml""",

    "cu06_analisis_registrar_paciente": """@startuml cu06_analisis_registrar_paciente
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU06 Registrar y gestionar pacientes" {
    actor "Recepcionista / Administrador" as Recep
    
    class UI_Paciente {
        + mostrarPacientes(): void
        + buscarPorCI(): void
        + registrarPaciente(): void
        + editarPaciente(): void
        + cambiarEstado(): void
    }

    class PacienteController {
        + index(Request): JsonResponse
        + store(Request): JsonResponse
        + show(id: int): JsonResponse
        + update(Request, id: int): JsonResponse
        + cambiarEstado(Request, id: int): JsonResponse
        + destroy(Request, id: int): JsonResponse
    }

    class Paciente {
        - id_paciente: bigint
        - id_usuario: bigint
        - ci: string
        - nombres: string
        - apellidos: string
        - fecha_nacimiento: date
        - sexo: string
        - telefono: string
        - email: string
        - direccion: string
        - primera_visita: boolean
        - estado: string
        - fecha_creacion: timestamp
        - fecha_actualizacion: timestamp
        --
        + create(): Paciente
        + findOrFail(): Paciente
        + update(): boolean
        + with(): QueryBuilder
    }

    class HistoriaClinica {
        - id_historia_clinica: bigint
        - id_paciente: bigint
        - numero_expediente: string
        - tipo_sangre: string
        - alergias_medicamentos: text
        - enfermedades_hereditarias: text
        - antecedentes_patologicos: text
        - antecedentes_quirurgicos: text
        - fecha_apertura: timestamp
        --
        + create(): HistoriaClinica
        + updateOrCreate(): HistoriaClinica
    }

    class ContactoEmergencia {
        - id_contacto: bigint
        - id_paciente: bigint
        - nombre_completo: string
        - parentesco: string
        - telefono: string
        - direccion: string
        --
        + create(): ContactoEmergencia
        + updateOrCreate(): ContactoEmergencia
    }

    Recep -right- UI_Paciente
    UI_Paciente -right- PacienteController
    PacienteController -right- Paciente

    Paciente "1" ---right--- "1" HistoriaClinica
    Paciente "1" ---down--- "0..1" ContactoEmergencia
}
@enduml""",

    "cu07_analisis_configurar_turnos": """@startuml cu07_analisis_configurar_turnos
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU07 Configurar turnos y fraccionamiento de agenda" {
    actor "Administrador / Recepción" as Admin
    
    class UI_TurnoMedico {
        + mostrarTurnos(): void
        + crearTurno(): void
        + editarTurno(): void
        + verBloques15Min(): void
        + cambiarEstado(): void
    }

    class TurnoMedicoController {
        + index(Request): JsonResponse
        + meta(): JsonResponse
        + store(Request): JsonResponse
        + show(id: int): JsonResponse
        + update(Request, id: int): JsonResponse
        + cambiarEstado(Request, id: int): JsonResponse
        + destroy(Request, id: int): JsonResponse
        + agendaSemanalMedico(idMedico: int): JsonResponse
    }

    class TurnoMedico {
        - id_turno: bigint
        - id_medico: bigint
        - dia_semana: smallint
        - hora_inicio: time
        - hora_fin: time
        - duracion_bloque_min: int
        - estado: string
        --
        + create(): TurnoMedico
        + findOrFail(): TurnoMedico
        + generarBloques(): array
        + update(): boolean
    }

    class Medico {
        - id_medico: bigint
        - nombres: string
        - apellidos: string
        - numero_registro_profesional: string
        - estado: string
        --
        + find(): Medico
    }

    class Especialidad {
        - id_especialidad: int
        - nombre: string
        --
        + get(): Collection
    }

    Admin -right- UI_TurnoMedico
    UI_TurnoMedico -right- TurnoMedicoController
    TurnoMedicoController -right- TurnoMedico

    TurnoMedico "0..*" ---right--- "1" Medico
    Medico "0..*" ---up--- "1..*" Especialidad
}
@enduml""",

    "cu08_analisis_bloqueos_agenda": """@startuml cu08_analisis_bloqueos_agenda
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU08 Registrar bloqueos de agenda médica" {
    actor "Administrador / Recepción" as Admin
    
    class UI_BloqueoAgenda {
        + mostrarBloqueos(): void
        + registrarBloqueo(): void
        + eliminarBloqueo(): void
    }

    class BloqueoAgendaController {
        + index(Request): JsonResponse
        + meta(): JsonResponse
        + store(Request): JsonResponse
        + destroy(Request, id: int): JsonResponse
    }

    class BloqueoAgenda {
        - id_bloqueo: bigint
        - id_medico: bigint
        - fecha_inicio: date
        - hora_inicio: time
        - fecha_fin: date
        - hora_fin: time
        - motivo: string
        - todo_el_dia: boolean
        - creado_por: bigint
        - fecha_creacion: timestamp
        --
        + create(): BloqueoAgenda
        + delete(): boolean
        + findOrFail(): BloqueoAgenda
        + where(): QueryBuilder
    }

    class Medico {
        - id_medico: bigint
        - nombres: string
        - apellidos: string
        - numero_registro_profesional: string
        --
        + find(): Medico
    }

    class Cita {
        - id_cita: bigint
        - id_medico: bigint
        - fecha_cita: date
        - hora_inicio: time
        - hora_fin: time
        - estado_cita: string
        --
        + count(): int
        + where(): QueryBuilder
    }

    Admin -right- UI_BloqueoAgenda
    UI_BloqueoAgenda -right- BloqueoAgendaController
    BloqueoAgendaController -right- BloqueoAgenda

    BloqueoAgenda "0..*" ---right--- "1" Medico
    Medico "1" ---down--- "0..*" Cita
}
@enduml""",

    "cu09_analisis_consultar_disponibilidad": """@startuml cu09_analisis_consultar_disponibilidad
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU09 Consultar disponibilidad de horarios médicos" {
    actor "Paciente / Recepción" as UsuarioActor
    
    class UI_Disponibilidad {
        + cargarFiltrosMeta(): void
        + consultarCuposDisponibles(): void
        + verCalendarioQuincenal(): void
    }

    class DisponibilidadController {
        + meta(Request): JsonResponse
        + consultar(Request): JsonResponse
    }

    class TurnoMedico {
        - id_turno: bigint
        - id_medico: bigint
        - dia_semana: smallint
        - hora_inicio: time
        - hora_fin: time
        - duracion_bloque_min: int
        - estado: string
        --
        + generarBloques(): array
        + get(): Collection
        + where(): QueryBuilder
    }

    class Cita {
        - id_cita: bigint
        - id_medico: bigint
        - fecha_cita: date
        - hora_inicio: time
        - hora_fin: time
        - estado_cita: string
        --
        + get(): Collection
        + where(): QueryBuilder
    }

    class BloqueoAgenda {
        - id_bloqueo: bigint
        - id_medico: bigint
        - fecha_inicio: date
        - hora_inicio: time
        - fecha_fin: date
        - hora_fin: time
        --
        + get(): Collection
        + where(): QueryBuilder
    }

    class Medico {
        - id_medico: bigint
        - nombres: string
        - apellidos: string
        --
        + find(): Medico
    }

    UsuarioActor -right- UI_Disponibilidad
    UI_Disponibilidad -right- DisponibilidadController
    DisponibilidadController -right- TurnoMedico

    TurnoMedico "0..*" ---right--- "1" Medico
    Medico "1" ---up--- "0..*" Cita
    Medico "1" ---down--- "0..*" BloqueoAgenda
}
@enduml""",

    "cu10_analisis_reservar_cita_medica": """@startuml cu10_analisis_reservar_cita_medica
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU10 Reservar cita médica con control de concurrencia" {
    actor "Paciente / Recepcionista" as ActorReserva
    
    class UI_ReservaCita {
        + mostrarFormularioReserva(): void
        + confirmarReservaConBloqueo(): void
        + generarComprobante(): void
    }

    class ReservaCitaController {
        + meta(Request): JsonResponse
        + index(Request): JsonResponse
        + store(Request): JsonResponse
        + show(id: int): JsonResponse
        + cambiarEstado(Request, id: int): JsonResponse
    }

    class Cita {
        - id_cita: bigint
        - codigo_cita: string
        - id_paciente: bigint
        - id_medico: bigint
        - id_especialidad: int
        - fecha_cita: date
        - hora_inicio: time
        - hora_fin: time
        - motivo_consulta: string
        - estado_cita: string
        - creado_por: bigint
        - fecha_creacion: timestamp
        - fecha_actualizacion: timestamp
        --
        + create(): Cita
        + findOrFail(): Cita
        + lockForUpdate(): QueryBuilder
    }

    class Paciente {
        - id_paciente: bigint
        - ci: string
        - nombres: string
        - apellidos: string
        - telefono: string
        --
        + find(): Paciente
    }

    class Medico {
        - id_medico: bigint
        - nombres: string
        - apellidos: string
        - numero_registro_profesional: string
        --
        + find(): Medico
    }

    class Especialidad {
        - id_especialidad: int
        - nombre: string
        --
        + find(): Especialidad
    }

    class BloqueoAgenda {
        - id_bloqueo: bigint
        - id_medico: bigint
        - fecha_inicio: date
        - fecha_fin: date
        --
        + exists(): boolean
        + where(): QueryBuilder
    }

    ActorReserva -right- UI_ReservaCita
    UI_ReservaCita -right- ReservaCitaController
    ReservaCitaController -right- Cita

    Cita "0..*" ---up--- "1" Paciente
    Cita "0..*" ---down--- "1" Medico
    Cita "0..*" ---right--- "1" Especialidad
    Medico "1" ---right--- "0..*" BloqueoAgenda
}
@enduml""",

    "cu11_analisis_reprogramar_cita": """@startuml cu11_analisis_reprogramar_cita
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU11 Reprogramar cita médica" {
    actor "Paciente / Recepcionista" as ActorReprog
    
    class UI_ReprogramacionCita {
        + solicitarReprogramacion(): void
        + guardarNuevaFechaHora(): void
        + consultarHistorial(): void
    }

    class ReprogramacionController {
        + reprogramarCita(Request, id: int): JsonResponse
        + historial(id: int): JsonResponse
    }

    class Cita {
        - id_cita: bigint
        - codigo_cita: string
        - id_paciente: bigint
        - id_medico: bigint
        - fecha_cita: date
        - hora_inicio: time
        - hora_fin: time
        - estado_cita: string
        --
        + findOrFail(): Cita
        + lockForUpdate(): QueryBuilder
        + update(): boolean
    }

    class HistorialReprogramacion {
        - id_reprogramacion: bigint
        - id_cita: bigint
        - fecha_anterior: date
        - hora_inicio_anterior: time
        - hora_fin_anterior: time
        - id_medico_anterior: bigint
        - fecha_nueva: date
        - hora_inicio_nueva: time
        - hora_fin_nueva: time
        - id_medico_nuevo: bigint
        - motivo_reprogramacion: text
        - id_usuario_responsable: bigint
        - fecha_operacion: timestamp
        --
        + create(): HistorialReprogramacion
        + where(): QueryBuilder
    }

    class Medico {
        - id_medico: bigint
        - nombres: string
        - apellidos: string
        --
        + find(): Medico
    }

    class BloqueoAgenda {
        - id_bloqueo: bigint
        - id_medico: bigint
        - fecha_inicio: date
        - fecha_fin: date
        --
        + exists(): boolean
        + where(): QueryBuilder
    }

    ActorReprog -right- UI_ReprogramacionCita
    UI_ReprogramacionCita -right- ReprogramacionController
    ReprogramacionController -right- Cita

    Cita "1" ---right--- "0..*" HistorialReprogramacion
    Cita "0..*" ---down--- "1" Medico
    Medico "1" ---right--- "0..*" BloqueoAgenda
}
@enduml""",

    "cu12_analisis_cancelar_cita": """@startuml cu12_analisis_cancelar_cita
allowmixing

skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 60
skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam classAttributeIconSize 0
hide circle

skinparam class {
    BackgroundColor #FFF2E6
    BorderColor #8A4B38
    RoundCorner 6
    HeaderBackgroundColor #FFF2E6
    ArrowColor black
}

skinparam actor {
    BackgroundColor #FEFECE
    BorderColor #A80036
}

frame "sd CU12 Cancelar cita médica" {
    actor "Paciente / Recepcionista" as ActorCanc
    
    class UI_CancelacionCita {
        + seleccionarCita(): void
        + registrarCancelacion(): void
        + liberarCupo(): void
    }

    class CancelacionController {
        + cancelarCita(Request, id: int): JsonResponse
        + detalleCancelacion(id: int): JsonResponse
    }

    class Cita {
        - id_cita: bigint
        - codigo_cita: string
        - id_paciente: bigint
        - id_medico: bigint
        - fecha_cita: date
        - hora_inicio: time
        - hora_fin: time
        - estado_cita: string
        - fecha_actualizacion: timestamp
        --
        + findOrFail(): Cita
        + lockForUpdate(): QueryBuilder
        + update(): boolean
    }

    class CancelacionCita {
        - id_cancelacion: bigint
        - id_cita: bigint
        - motivo_cancelacion: text
        - id_usuario_responsable: bigint
        - fecha_cancelacion: timestamp
        --
        + create(): CancelacionCita
    }

    class Paciente {
        - id_paciente: bigint
        - ci: string
        - nombres: string
        - apellidos: string
        --
        + find(): Paciente
    }

    class Medico {
        - id_medico: bigint
        - nombres: string
        - apellidos: string
        --
        + find(): Medico
    }

    ActorCanc -right- UI_CancelacionCita
    UI_CancelacionCita -right- CancelacionController
    CancelacionController -right- Cita

    Cita "1" ---right--- "1" CancelacionCita
    Cita "0..*" ---up--- "1" Paciente
    Cita "0..*" ---down--- "1" Medico
}
@enduml"""
}

# 1. Guardar el archivo PUML completo
puml_path = os.path.join("diagramas", "diagramas_analisis_clases_cu01_cu12.puml")
with open(puml_path, "w", encoding="utf-8") as f:
    f.write("' ==============================================================================\n")
    f.write("' CLÍNICA VIDA SALUD - DIAGRAMAS DE ANÁLISIS DE CLASES (CU01 AL CU12)\n")
    f.write("' Estilo: Enterprise Architect (Actor - Boundary - Control - Entity)\n")
    f.write("' Controladores sin prefijo CU y cardinalidades nítidas con ortogonalidad\n")
    f.write("' ==============================================================================\n\n")
    for name, puml in DIAGRAMS.items():
        f.write(puml + "\n\n")

print(f"Archivo PUML guardado exitosamente: {puml_path}")

# 2. Renderizar imágenes usando Kroki POST
for name, puml in DIAGRAMS.items():
    png_path = os.path.join("diagramas", f"{name}.png")
    print(f"Renderizando {name}...")
    
    success = False
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                "https://kroki.io/plantuml/png",
                data=puml.encode("utf-8"),
                headers={
                    "Content-Type": "text/plain; charset=utf-8",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                if data.startswith(b"\x89PNG"):
                    with open(png_path, "wb") as img:
                        img.write(data)
                    print(f"  -> Éxito: {png_path} ({len(data)} bytes)")
                    success = True
                    break
        except Exception as e:
            print(f"  -> Error intento {attempt+1}: {e}")
            time.sleep(1.5)
            
    if not success:
        print(f" [FALLÓ] {name}")

print("\nRenderizado completo de todos los diagramas.")
