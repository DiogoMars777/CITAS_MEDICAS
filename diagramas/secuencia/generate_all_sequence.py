import os
import urllib.request
import time

os.makedirs(os.path.join("diagramas", "secuencia"), exist_ok=True)

COMMON_SKINPARAM = """skinparam backgroundColor white
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11

' Estilo Enterprise Architect (Actor - Boundary - Control - Entity)
skinparam actorBackgroundColor #FEFECE
skinparam actorBorderColor #A80036

skinparam boundaryBackgroundColor #CCEEFF
skinparam boundaryBorderColor #0088CC

skinparam controlBackgroundColor #CCEEFF
skinparam controlBorderColor #0088CC

skinparam entityBackgroundColor #CCEEFF
skinparam entityBorderColor #0088CC

' Líneas de vida celestes y Barras de activación amarillas (Idénticas a Enterprise Architect)
skinparam sequenceLifeLineBorderColor #80BFFF
skinparam sequenceLifeLineBackgroundColor #FDF1A9
skinparam sequenceLifeLineBorderThickness 1

' Flechas estilo Enterprise Architect
skinparam sequenceArrowColor #4A708B
skinparam sequenceArrowFontColor #000000
skinparam sequenceArrowFontSize 11

' Fragmento ALT estilo Enterprise Architect (Borde y pestaña dorada)
skinparam sequenceGroupBorderColor #D4A017
skinparam sequenceGroupBackgroundColor transparent
skinparam sequenceGroupHeaderBackgroundColor #FDD050
skinparam sequenceGroupHeaderBorderColor #D4A017
skinparam sequenceGroupHeaderFontColor #000000
skinparam sequenceGroupFontColor #C59B27
skinparam sequenceGroupFontSize 11
skinparam sequenceGroupFontStyle bold"""

DIAGRAMS = {
    "cu01_secuencia_iniciar_cerrar_sesion": f"""@startuml cu01_secuencia_iniciar_cerrar_sesion
{COMMON_SKINPARAM}

actor "Usuario / Administrador" as User
boundary "UI_Sesion" as UI
control "AutenticacionController" as Control
entity "Usuario" as Usuario
entity "Rol" as Rol
entity "BitacoraAuditoria" as Bitacora

alt Iniciar sesión exitoso
    User -> UI : 1. IniciarSesion(credenciales)
    activate User #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. IniciarSesion(Request)
    activate Control #FDF1A9
    
    Control -> Usuario : 1.2. BuscarPorCredenciales(login)
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaUsuario()
    deactivate Usuario
    
    Control -> Rol : 1.3. ObtenerRol(idRol)
    activate Rol #FDF1A9
    Rol --> Control : RespuestaRol()
    deactivate Rol
    
    Control -> Bitacora : 1.4. RegistrarAcceso("LOGIN", idUsuario)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaLogin(token, usuario)
    deactivate Control
    
    UI --> User : Confirmación(dashboard)
    deactivate UI
    deactivate User

else Cerrar sesión
    User -> UI : 2. CerrarSesion()
    activate User #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. CerrarSesion(Request)
    activate Control #FDF1A9
    
    Control -> Usuario : 2.2. RevocarToken()
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaToken()
    deactivate Usuario
    
    Control -> Bitacora : 2.3. RegistrarSalida("LOGOUT", idUsuario)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaCierre()
    deactivate Control
    
    UI --> User : Confirmación()
    deactivate UI
    deactivate User

else Recuperar contraseña
    User -> UI : 3. SolicitarRecuperacion(email)
    activate User #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. SolicitarRecuperacion(email)
    activate Control #FDF1A9
    
    Control -> Usuario : 3.2. VerificarEmail(email)
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaEmail()
    deactivate Usuario
    
    Control -> Usuario : 3.3. GuardarCodigoOtp(otp)
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaOtp()
    deactivate Usuario
    
    Control --> UI : RespuestaEnvioOtp()
    deactivate Control
    
    UI --> User : Confirmación()
    deactivate UI
    deactivate User
end
@enduml""",

    "cu02_secuencia_consultar_bitacora": f"""@startuml cu02_secuencia_consultar_bitacora
{COMMON_SKINPARAM}

actor "Administrador" as Admin
boundary "UI_Auditoria" as UI
control "BitacoraAuditoriaController" as Control
entity "BitacoraAuditoria" as Bitacora
entity "Usuario" as Usuario

alt Listar registros de auditoría
    Admin -> UI : 1. MostrarBitacora(filtros, pagina)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. ListarAuditoria(Request)
    activate Control #FDF1A9
    
    Control -> Bitacora : 1.2. ConsultarConFiltros(modulo, operacion, rangoFechas)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaRegistros()
    deactivate Bitacora
    
    Control --> UI : RespuestaAuditoria(datosPaginados)
    deactivate Control
    
    UI --> Admin : Confirmación(tablaAuditoria)
    deactivate UI
    deactivate Admin

else Ver detalle de evento de auditoría
    Admin -> UI : 2. VerDetalleEvento(idBitacora)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. ObtenerDetalleAuditoria(idBitacora)
    activate Control #FDF1A9
    
    Control -> Bitacora : 2.2. FindOrFail(idBitacora)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaEvento(valoresAnteriores, valoresNuevos)
    deactivate Bitacora
    
    Control -> Usuario : 2.3. ObtenerUsuarioResponsable(idUsuario)
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaUsuario()
    deactivate Usuario
    
    Control --> UI : RespuestaDetalle(eventoCompleto)
    deactivate Control
    
    UI --> Admin : Confirmación(modalDetalle)
    deactivate UI
    deactivate Admin

else Consultar estadísticas de seguridad
    Admin -> UI : 3. ConsultarEstadisticas()
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. EstadisticasAuditoria()
    activate Control #FDF1A9
    
    Control -> Bitacora : 3.2. CalcularMetricasHoy(operacionesCriticas, totalAccesos)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaMetricas()
    deactivate Bitacora
    
    Control --> UI : RespuestaEstadisticas(metricas)
    deactivate Control
    
    UI --> Admin : Confirmación(tarjetasMetricas)
    deactivate UI
    deactivate Admin
end
@enduml""",

    "cu03_secuencia_gestionar_usuarios_roles": f"""@startuml cu03_secuencia_gestionar_usuarios_roles
{COMMON_SKINPARAM}

actor "Administrador" as Admin
boundary "UI_GestionUsuarios" as UI
control "GestionUsuariosController" as Control
entity "Usuario" as Usuario
entity "Rol" as Rol
entity "Permiso" as Permiso
entity "BitacoraAuditoria" as Bitacora

alt Crear nuevo usuario interno
    Admin -> UI : 1. RegistrarUsuario(datosUsuario)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. CrearUsuario(Request)
    activate Control #FDF1A9
    
    Control -> Usuario : 1.2. ValidarUnicidad(username, email)
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaValidacion()
    deactivate Usuario
    
    Control -> Usuario : 1.3. Create(datosConPasswordHash)
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaUsuarioCreado(idUsuario)
    deactivate Usuario
    
    Control -> Bitacora : 1.4. Registrar("INSERT", "usuarios", idUsuario)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaCreacion(usuario)
    deactivate Control
    
    UI --> Admin : Confirmación(usuarioCreado)
    deactivate UI
    deactivate Admin

else Cambiar estado de usuario (Activar / Desactivar)
    Admin -> UI : 2. CambiarEstado(idUsuario, nuevoEstado)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. CambiarEstado(Request, idUsuario)
    activate Control #FDF1A9
    
    Control -> Usuario : 2.2. Update(["estado" => nuevoEstado])
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaActualizacion()
    deactivate Usuario
    
    Control -> Bitacora : 2.3. Registrar("CAMBIO_ESTADO", "usuarios", idUsuario)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaEstado()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin

else Asignar permisos a un rol
    Admin -> UI : 3. AsignarPermisosRol(idRol, listaPermisos)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. AsignarPermisosRol(Request, idRol)
    activate Control #FDF1A9
    
    Control -> Rol : 3.2. SincronizarPermisos(permisosIds)
    activate Rol #FDF1A9
    Rol --> Control : RespuestaSincronizacion()
    deactivate Rol
    
    Control -> Bitacora : 3.3. Registrar("UPDATE", "rol_permisos", idRol)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaPermisosActualizados()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin
end
@enduml""",

    "cu04_secuencia_gestionar_especialidades": f"""@startuml cu04_secuencia_gestionar_especialidades
{COMMON_SKINPARAM}

actor "Administrador" as Admin
boundary "UI_Especialidad" as UI
control "EspecialidadController" as Control
entity "Especialidad" as Especialidad
entity "BitacoraAuditoria" as Bitacora

alt Crear especialidad médica
    Admin -> UI : 1. CrearEspecialidad(nombre, descripcion)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. Store(Request)
    activate Control #FDF1A9
    
    Control -> Especialidad : 1.2. ValidarYCrear(nombre, descripcion)
    activate Especialidad #FDF1A9
    Especialidad --> Control : RespuestaEspecialidad(idEspecialidad)
    deactivate Especialidad
    
    Control -> Bitacora : 1.3. Registrar("INSERT", "especialidades", idEspecialidad)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaCreacion()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin

else Editar especialidad médica
    Admin -> UI : 2. EditarEspecialidad(idEspecialidad, datos)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. Update(Request, idEspecialidad)
    activate Control #FDF1A9
    
    Control -> Especialidad : 2.2. FindOrFail(id)->Update(datos)
    activate Especialidad #FDF1A9
    Especialidad --> Control : RespuestaActualizacion()
    deactivate Especialidad
    
    Control -> Bitacora : 2.3. Registrar("UPDATE", "especialidades", idEspecialidad)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaEdicion()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin

else Cambiar estado de especialidad
    Admin -> UI : 3. CambiarEstado(idEspecialidad, nuevoEstado)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. CambiarEstado(Request, idEspecialidad)
    activate Control #FDF1A9
    
    Control -> Especialidad : 3.2. Update(["estado" => nuevoEstado])
    activate Especialidad #FDF1A9
    Especialidad --> Control : RespuestaEstado()
    deactivate Especialidad
    
    Control -> Bitacora : 3.3. Registrar("CAMBIO_ESTADO", "especialidades", idEspecialidad)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaEstado()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin
end
@enduml""",

    "cu05_secuencia_gestionar_medicos": f"""@startuml cu05_secuencia_gestionar_medicos
{COMMON_SKINPARAM}

actor "Administrador" as Admin
boundary "UI_Medico" as UI
control "MedicoController" as Control
entity "Medico" as Medico
entity "Usuario" as Usuario
entity "MedicoEspecialidad" as MedicoEsp
entity "BitacoraAuditoria" as Bitacora

alt Registrar nuevo médico con especialidades
    Admin -> UI : 1. RegistrarMedico(datosPersonales, especialidades, crearUsuario)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. Store(Request)
    activate Control #FDF1A9
    
    Control -> Usuario : 1.2. CrearCuentaUsuario(email, rol="MEDICO")
    activate Usuario #FDF1A9
    Usuario --> Control : RespuestaUsuario(idUsuario)
    deactivate Usuario
    
    Control -> Medico : 1.3. Create(datosMedico, idUsuario)
    activate Medico #FDF1A9
    Medico --> Control : RespuestaMedico(idMedico)
    deactivate Medico
    
    Control -> MedicoEsp : 1.4. AsignarEspecialidades(idMedico, especialidadesInput)
    activate MedicoEsp #FDF1A9
    MedicoEsp --> Control : RespuestaAsignacion()
    deactivate MedicoEsp
    
    Control -> Bitacora : 1.5. Registrar("INSERT", "medicos", idMedico)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaMedicoRegistrado()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin

else Actualizar datos y especialidades del médico
    Admin -> UI : 2. ActualizarMedico(idMedico, datosActualizados)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. Update(Request, idMedico)
    activate Control #FDF1A9
    
    Control -> Medico : 2.2. FindOrFail(idMedico)->Update(datos)
    activate Medico #FDF1A9
    Medico --> Control : RespuestaActualizacion()
    deactivate Medico
    
    Control -> MedicoEsp : 2.3. SincronizarEspecialidades(idMedico, especialidadesInput)
    activate MedicoEsp #FDF1A9
    MedicoEsp --> Control : RespuestaSincronizacion()
    deactivate MedicoEsp
    
    Control -> Bitacora : 2.4. Registrar("UPDATE", "medicos", idMedico)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaEdicion()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin

else Cambiar estado de médico
    Admin -> UI : 3. CambiarEstado(idMedico, estado)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. CambiarEstado(Request, idMedico)
    activate Control #FDF1A9
    
    Control -> Medico : 3.2. Update(["estado" => estado])
    activate Medico #FDF1A9
    Medico --> Control : RespuestaEstado()
    deactivate Medico
    
    Control -> Bitacora : 3.3. Registrar("CAMBIO_ESTADO", "medicos", idMedico)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaEstado()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin
end
@enduml""",

    "cu06_secuencia_registrar_paciente": f"""@startuml cu06_secuencia_registrar_paciente
{COMMON_SKINPARAM}

actor "Recepcionista / Administrador" as Recep
boundary "UI_Paciente" as UI
control "PacienteController" as Control
entity "Paciente" as Paciente
entity "HistoriaClinica" as Historia
entity "ContactoEmergencia" as Contacto
entity "BitacoraAuditoria" as Bitacora

alt Registrar nuevo paciente y apertura de historia
    Recep -> UI : 1. RegistrarPaciente(datosPersonales, antecedentes, contacto)
    activate Recep #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. Store(Request)
    activate Control #FDF1A9
    
    Control -> Paciente : 1.2. ValidarCIYCrear(datosPaciente)
    activate Paciente #FDF1A9
    Paciente --> Control : RespuestaPaciente(idPaciente)
    deactivate Paciente
    
    Control -> Historia : 1.3. GenerarAperturaExpediente(idPaciente, antecedentes)
    activate Historia #FDF1A9
    Historia --> Control : RespuestaHistoria(numeroExpediente)
    deactivate Historia
    
    Control -> Contacto : 1.4. Create(idPaciente, datosContacto)
    activate Contacto #FDF1A9
    Contacto --> Control : RespuestaContacto()
    deactivate Contacto
    
    Control -> Bitacora : 1.5. Registrar("INSERT", "pacientes", idPaciente)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaPacienteRegistrado(expediente)
    deactivate Control
    
    UI --> Recep : Confirmación(pacienteCreado)
    deactivate UI
    deactivate Recep

else Actualizar datos personales y antecedentes
    Recep -> UI : 2. EditarPaciente(idPaciente, datos)
    activate Recep #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. Update(Request, idPaciente)
    activate Control #FDF1A9
    
    Control -> Paciente : 2.2. FindOrFail(idPaciente)->Update(datos)
    activate Paciente #FDF1A9
    Paciente --> Control : RespuestaActualizacion()
    deactivate Paciente
    
    Control -> Historia : 2.3. UpdateOrCreate(antecedentes)
    activate Historia #FDF1A9
    Historia --> Control : RespuestaHistoriaActualizada()
    deactivate Historia
    
    Control -> Bitacora : 2.4. Registrar("UPDATE", "pacientes", idPaciente)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaActualizacion()
    deactivate Control
    
    UI --> Recep : Confirmación()
    deactivate UI
    deactivate Recep

else Buscar paciente por CI
    Recep -> UI : 3. BuscarPorCI(ci)
    activate Recep #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. Index(Request con filtro CI)
    activate Control #FDF1A9
    
    Control -> Paciente : 3.2. Where("ci", ci)->With(["historiaClinica","contactos"])->First()
    activate Paciente #FDF1A9
    Paciente --> Control : RespuestaPacienteEncontrado()
    deactivate Paciente
    
    Control --> UI : RespuestaBusqueda(paciente)
    deactivate Control
    
    UI --> Recep : Confirmación(detallePaciente)
    deactivate UI
    deactivate Recep
end
@enduml""",

    "cu07_secuencia_configurar_turnos": f"""@startuml cu07_secuencia_configurar_turnos
{COMMON_SKINPARAM}

actor "Administrador / Recepción" as Admin
boundary "UI_TurnoMedico" as UI
control "TurnoMedicoController" as Control
entity "TurnoMedico" as Turno
entity "BitacoraAuditoria" as Bitacora

alt Crear turno y fraccionar a bloques de 15 minutos
    Admin -> UI : 1. CrearTurno(idMedico, diaSemana, horas, duracionBloque=15)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. Store(Request)
    activate Control #FDF1A9
    
    Control -> Turno : 1.2. ValidarSolapamientoHorario(idMedico, diaSemana, horas)
    activate Turno #FDF1A9
    Turno --> Control : RespuestaValidacion()
    deactivate Turno
    
    Control -> Turno : 1.3. Create(datosTurno)
    activate Turno #FDF1A9
    Turno --> Control : RespuestaTurnoCreado(idTurno)
    deactivate Turno
    
    Control -> Bitacora : 1.4. Registrar("INSERT", "turnos_medicos", idTurno)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaTurnoConBloques(bloques15Min)
    deactivate Control
    
    UI --> Admin : Confirmación(agendaFraccionada)
    deactivate UI
    deactivate Admin

else Consultar agenda semanal de médico
    Admin -> UI : 2. ConsultarAgendaSemanal(idMedico)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. AgendaSemanalMedico(idMedico)
    activate Control #FDF1A9
    
    Control -> Turno : 2.2. Where("id_medico", idMedico)->OrderBy("dia_semana")->Get()
    activate Turno #FDF1A9
    Turno --> Control : RespuestaTurnosSemanales()
    deactivate Turno
    
    Control --> UI : RespuestaGrillaSemanal(lunesADomingo)
    deactivate Control
    
    UI --> Admin : Confirmación(grillaTurnos)
    deactivate UI
    deactivate Admin

else Cambiar estado de turno
    Admin -> UI : 3. CambiarEstadoTurno(idTurno, estado)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. CambiarEstado(Request, idTurno)
    activate Control #FDF1A9
    
    Control -> Turno : 3.2. Update(["estado" => estado])
    activate Turno #FDF1A9
    Turno --> Control : RespuestaActualizacion()
    deactivate Turno
    
    Control -> Bitacora : 3.3. Registrar("CAMBIO_ESTADO", "turnos_medicos", idTurno)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaEstado()
    deactivate Control
    
    UI --> Admin : Confirmación()
    deactivate UI
    deactivate Admin
end
@enduml""",

    "cu08_secuencia_bloqueos_agenda": f"""@startuml cu08_secuencia_bloqueos_agenda
{COMMON_SKINPARAM}

actor "Administrador / Recepción" as Admin
boundary "UI_BloqueoAgenda" as UI
control "BloqueoAgendaController" as Control
entity "BloqueoAgenda" as Bloqueo
entity "Cita" as Cita
entity "BitacoraAuditoria" as Bitacora

alt Registrar bloqueo de agenda y verificar citas afectadas
    Admin -> UI : 1. RegistrarBloqueo(idMedico, fechas, horas, motivo)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. Store(Request)
    activate Control #FDF1A9
    
    Control -> Cita : 1.2. ContarCitasAfectadas(idMedico, fechas, horas)
    activate Cita #FDF1A9
    Cita --> Control : RespuestaCitasConflicto(totalAfectadas)
    deactivate Cita
    
    Control -> Bloqueo : 1.3. Create(datosBloqueo, creadoPor)
    activate Bloqueo #FDF1A9
    Bloqueo --> Control : RespuestaBloqueoCreado(idBloqueo)
    deactivate Bloqueo
    
    Control -> Bitacora : 1.4. Registrar("INSERT", "bloqueos_agenda", idBloqueo)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaBloqueo(bloqueo, citasPorReprogramar)
    deactivate Control
    
    UI --> Admin : Confirmación(alertaCitasAfectadas)
    deactivate UI
    deactivate Admin

else Eliminar o liberar bloqueo de agenda
    Admin -> UI : 2. EliminarBloqueo(idBloqueo)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. Destroy(Request, idBloqueo)
    activate Control #FDF1A9
    
    Control -> Bloqueo : 2.2. FindOrFail(idBloqueo)->Delete()
    activate Bloqueo #FDF1A9
    Bloqueo --> Control : RespuestaEliminado()
    deactivate Bloqueo
    
    Control -> Bitacora : 2.3. Registrar("DELETE", "bloqueos_agenda", idBloqueo)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaLiberacion()
    deactivate Control
    
    UI --> Admin : Confirmación(horariosLiberados)
    deactivate UI
    deactivate Admin

else Listar bloqueos vigentes
    Admin -> UI : 3. ListarBloqueos(filtros)
    activate Admin #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. Index(Request)
    activate Control #FDF1A9
    
    Control -> Bloqueo : 3.2. With("medico")->OrderBy("fecha_inicio")->Get()
    activate Bloqueo #FDF1A9
    Bloqueo --> Control : RespuestaListaBloqueos()
    deactivate Bloqueo
    
    Control --> UI : RespuestaBloqueos(datos)
    deactivate Control
    
    UI --> Admin : Confirmación(tablaBloqueos)
    deactivate UI
    deactivate Admin
end
@enduml""",

    "cu09_secuencia_consultar_disponibilidad": f"""@startuml cu09_secuencia_consultar_disponibilidad
{COMMON_SKINPARAM}

actor "Paciente / Recepción" as UsuarioActor
boundary "UI_Disponibilidad" as UI
control "DisponibilidadController" as Control
entity "TurnoMedico" as Turno
entity "Cita" as Cita
entity "BloqueoAgenda" as Bloqueo

alt Cargar metadatos de especialidades y médicos
    UsuarioActor -> UI : 1. CargarFiltros()
    activate UsuarioActor #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. Meta(Request)
    activate Control #FDF1A9
    
    Control --> UI : RespuestaMeta(especialidades, medicosActivos)
    deactivate Control
    
    UI --> UsuarioActor : Confirmación(selectoresCargados)
    deactivate UI
    deactivate UsuarioActor

else Consultar cupos disponibles en fecha específica
    UsuarioActor -> UI : 2. ConsultarDisponibilidad(idMedico, idEspecialidad, fecha)
    activate UsuarioActor #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. Consultar(Request)
    activate Control #FDF1A9
    
    Control -> Turno : 2.2. ObtenerTurnoDelDia(idMedico, diaSemana)
    activate Turno #FDF1A9
    Turno --> Control : RespuestaTurno(bloques15Min)
    deactivate Turno
    
    Control -> Cita : 2.3. ObtenerCitasOcupadas(idMedico, fecha)
    activate Cita #FDF1A9
    Cita --> Control : RespuestaCitasOcupadas()
    deactivate Cita
    
    Control -> Bloqueo : 2.4. ObtenerBloqueosActivos(idMedico, fecha)
    activate Bloqueo #FDF1A9
    Bloqueo --> Control : RespuestaBloqueos()
    deactivate Bloqueo
    
    Control -> Control : 2.5. FiltrarCuposLibres(turnos, citas, bloqueos)
    
    Control --> UI : RespuestaCuposDisponibles(listaSlotsDisponibles)
    deactivate Control
    
    UI --> UsuarioActor : Confirmación(grillaHorariosVerdes)
    deactivate UI
    deactivate UsuarioActor

else Consultar resumen de calendario quincenal
    UsuarioActor -> UI : 3. ConsultarQuincena(idMedico, rangoFechas)
    activate UsuarioActor #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. CalendarioQuincenal(Request)
    activate Control #FDF1A9
    
    Control --> UI : RespuestaResumenQuincena(diasConCuposLibres)
    deactivate Control
    
    UI --> UsuarioActor : Confirmación(calendarioMensual)
    deactivate UI
    deactivate UsuarioActor
end
@enduml""",

    "cu10_secuencia_reservar_cita_medica": f"""@startuml cu10_secuencia_reservar_cita_medica
{COMMON_SKINPARAM}

actor "Paciente / Recepcionista" as ActorReserva
boundary "UI_ReservaCita" as UI
control "ReservaCitaController" as Control
entity "BloqueoAgenda" as Bloqueo
entity "Cita" as Cita
entity "BitacoraAuditoria" as Bitacora

alt Confirmar reserva con bloqueo pesimista
    ActorReserva -> UI : 1. ConfirmarReserva(idPaciente, idMedico, idEspecialidad, fecha, horas)
    activate ActorReserva #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. Store(Request)
    activate Control #FDF1A9
    
    Control -> Bloqueo : 1.2. VerificarBloqueoAgenda(idMedico, fecha, horas)
    activate Bloqueo #FDF1A9
    Bloqueo --> Control : RespuestaSinBloqueo()
    deactivate Bloqueo
    
    Control -> Cita : 1.3. Where(idMedico, fecha, horas)->LockForUpdate()->Exists()
    activate Cita #FDF1A9
    Cita --> Control : RespuestaCupoDisponible()
    deactivate Cita
    
    Control -> Cita : 1.4. Create(datosCita, codigoCita, estado="PROGRAMADA")
    activate Cita #FDF1A9
    Cita --> Control : RespuestaCitaConfirmada(idCita, codigoCita)
    deactivate Cita
    
    Control -> Bitacora : 1.5. Registrar("INSERT", "citas", idCita)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaReservaExitosa(cita, comprobante)
    deactivate Control
    
    UI --> ActorReserva : Confirmación(boletaCita)
    deactivate UI
    deactivate ActorReserva

else Colisión de concurrencia (Cupo ocupado)
    Control -> Cita : 2.1. Where(idMedico, fecha, horas)->LockForUpdate()->Exists()
    activate Control #FDF1A9
    activate Cita #FDF1A9
    Cita --> Control : ConflictoHorarioOcupado()
    deactivate Cita
    
    Control --> UI : Error 409 Conflict("El cupo ya fue reservado por otro usuario")
    deactivate Control
    activate UI #FDF1A9
    
    UI --> ActorReserva : MostrarMensajeConflicto("Horario ocupado, elija otro cupo")
    deactivate UI

else Consultar detalle de cita existente
    ActorReserva -> UI : 3. VerDetalleCita(idCita)
    activate ActorReserva #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 3.1. Show(idCita)
    activate Control #FDF1A9
    
    Control -> Cita : 3.2. With(["paciente","medico","especialidad"])->FindOrFail(idCita)
    activate Cita #FDF1A9
    Cita --> Control : RespuestaCitaCompleta()
    deactivate Cita
    
    Control --> UI : RespuestaDetalle(cita)
    deactivate Control
    
    UI --> ActorReserva : Confirmación(fichaCita)
    deactivate UI
    deactivate ActorReserva
end
@enduml""",

    "cu11_secuencia_reprogramar_cita": f"""@startuml cu11_secuencia_reprogramar_cita
{COMMON_SKINPARAM}

actor "Paciente / Recepcionista" as ActorReprog
boundary "UI_ReprogramacionCita" as UI
control "ReprogramacionController" as Control
entity "BloqueoAgenda" as Bloqueo
entity "Cita" as Cita
entity "HistorialReprogramacion" as Historial
entity "BitacoraAuditoria" as Bitacora

alt Reprogramar cita médica a nuevo horario
    ActorReprog -> UI : 1. SolicitarReprogramacion(idCita, nuevaFecha, nuevoHorario, motivo)
    activate ActorReprog #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. ReprogramarCita(Request, idCita)
    activate Control #FDF1A9
    
    Control -> Bloqueo : 1.2. VerificarDisponibilidadNuevoHorario(idMedico, nuevaFecha, nuevoHorario)
    activate Bloqueo #FDF1A9
    Bloqueo --> Control : RespuestaDisponible()
    deactivate Bloqueo
    
    Control -> Cita : 1.3. FindOrFail(idCita)->LockForUpdate()
    activate Cita #FDF1A9
    Cita --> Control : DatosCitaOriginal()
    deactivate Cita
    
    Control -> Historial : 1.4. Create(idCita, fechaAnterior, fechaNueva, motivo, idUsuario)
    activate Historial #FDF1A9
    Historial --> Control : RespuestaHistorialCreado()
    deactivate Historial
    
    Control -> Cita : 1.5. Update(["fecha_cita" => nuevaFecha, "hora_inicio" => nuevaHora, "estado_cita" => "REPROGRAMADA"])
    activate Cita #FDF1A9
    Cita --> Control : RespuestaCitaActualizada()
    deactivate Cita
    
    Control -> Bitacora : 1.6. Registrar("REPROGRAMACION", "citas", idCita)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaReprogramacionExitosa(citaActualizada)
    deactivate Control
    
    UI --> ActorReprog : Confirmación(nuevaBoleta)
    deactivate UI
    deactivate ActorReprog

else Consultar historial de reprogramaciones de una cita
    ActorReprog -> UI : 2. ConsultarHistorial(idCita)
    activate ActorReprog #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. Historial(idCita)
    activate Control #FDF1A9
    
    Control -> Historial : 2.2. Where("id_cita", idCita)->With("usuarioResponsable")->Get()
    activate Historial #FDF1A9
    Historial --> Control : ListaReprogramaciones()
    deactivate Historial
    
    Control --> UI : RespuestaHistorial(lista)
    deactivate Control
    
    UI --> ActorReprog : Confirmación(lineaDeTiempo)
    deactivate UI
    deactivate ActorReprog
end
@enduml""",

    "cu12_secuencia_cancelar_cita": f"""@startuml cu12_secuencia_cancelar_cita
{COMMON_SKINPARAM}

actor "Paciente / Recepcionista" as ActorCanc
boundary "UI_CancelacionCita" as UI
control "CancelacionController" as Control
entity "Cita" as Cita
entity "CancelacionCita" as Cancelacion
entity "BitacoraAuditoria" as Bitacora

alt Cancelar cita médica y liberar cupo
    ActorCanc -> UI : 1. CancelarCita(idCita, motivo)
    activate ActorCanc #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 1.1. CancelarCita(Request, idCita)
    activate Control #FDF1A9
    
    Control -> Cita : 1.2. FindOrFail(idCita)->LockForUpdate()
    activate Cita #FDF1A9
    Cita --> Control : CitaOriginal()
    deactivate Cita
    
    Control -> Cancelacion : 1.3. Create(idCita, motivo, idUsuarioResponsable)
    activate Cancelacion #FDF1A9
    Cancelacion --> Control : RespuestaCancelacionCreada()
    deactivate Cancelacion
    
    Control -> Cita : 1.4. Update(["estado_cita" => "CANCELADA"])
    activate Cita #FDF1A9
    Cita --> Control : RespuestaCitaCancelada()
    deactivate Cita
    
    Control -> Bitacora : 1.5. Registrar("CANCELACION", "citas", idCita)
    activate Bitacora #FDF1A9
    Bitacora --> Control : RespuestaBitacora()
    deactivate Bitacora
    
    Control --> UI : RespuestaCancelacionExitosa(mensaje, cupoLiberado=true)
    deactivate Control
    
    UI --> ActorCanc : Confirmación(notificacionCancelacion)
    deactivate UI
    deactivate ActorCanc

else Consultar motivo y detalle de cancelación
    ActorCanc -> UI : 2. VerDetalleCancelacion(idCita)
    activate ActorCanc #FDF1A9
    activate UI #FDF1A9
    
    UI -> Control : 2.1. DetalleCancelacion(idCita)
    activate Control #FDF1A9
    
    Control -> Cancelacion : 2.2. Where("id_cita", idCita)->With("usuarioResponsable")->First()
    activate Cancelacion #FDF1A9
    Cancelacion --> Control : DatosCancelacion()
    deactivate Cancelacion
    
    Control --> UI : RespuestaDetalle(motivo, fecha, usuario)
    deactivate Control
    
    UI --> ActorCanc : Confirmación(modalCancelacion)
    deactivate UI
    deactivate ActorCanc
end
@enduml"""
}

# 1. Guardar el archivo PUML con todos los diagramas de secuencia en diagramas/secuencia/
puml_path = os.path.join("diagramas", "secuencia", "diagramas_secuencia_cu01_cu12.puml")
with open(puml_path, "w", encoding="utf-8") as f:
    f.write("' ==============================================================================\n")
    f.write("' CLÍNICA VIDA SALUD - DIAGRAMAS DE SECUENCIA (CU01 AL CU12)\n")
    f.write("' Estilo: Enterprise Architect (Actor - Boundary - Control - Entity)\n")
    f.write("' Fragmento ALT dorado, barras de activación amarillas y numeración jerárquica\n")
    f.write("' ==============================================================================\n\n")
    for name, puml in DIAGRAMS.items():
        f.write(puml + "\n\n")

print(f"Archivo PUML guardado: {puml_path}")

# 2. Renderizar todas las imágenes PNG en diagramas/secuencia/
for name, puml in DIAGRAMS.items():
    png_path = os.path.join("diagramas", "secuencia", f"{name}.png")
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
            print(f"  -> Error en intento {attempt+1}: {e}")
            time.sleep(1.5)
            
    if not success:
        print(f" [FALLÓ] {name}")

print("\nRenderizado completo de los 12 diagramas de secuencia.")
