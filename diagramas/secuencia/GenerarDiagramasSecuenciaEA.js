!INC Local Scripts.EAConstants-JScript

/*
 * ==============================================================================
 * CLÍNICA VIDA SALUD - DIAGRAMAS DE SECUENCIA (CU01 AL CU12)
 * Motor de Automatización para Enterprise Architect (JScript)
 * Estilo: Robustness Analysis (Actor - Boundary - Control - Entity)
 * ==============================================================================
 * Instrucciones:
 * 1. En Enterprise Architect, abre: Specialize > Tools > Scripting.
 * 2. Crea un nuevo script de tipo "JScript" (o edita uno existente).
 * 3. Selecciona el Paquete destino en el Project Browser.
 * 4. Pega este código completo y presiona "Run" (Ejecutar).
 * ==============================================================================
 */

// Función auxiliar para obtener o crear un Elemento en el Paquete
function obtenerOCrearElemento(pkg, nombre, tipo, estereotipo) {
    for (var i = 0; i < pkg.Elements.Count; i++) {
        var elExistente = pkg.Elements.GetAt(i);
        if (elExistente.Name == nombre) {
            if (estereotipo && estereotipo != "" && elExistente.Stereotype != estereotipo) {
                elExistente.Stereotype = estereotipo;
                elExistente.Update();
            }
            return elExistente;
        }
    }
    var nuevoEl = pkg.Elements.AddNew(nombre, tipo);
    if (estereotipo && estereotipo != "") {
        nuevoEl.Stereotype = estereotipo;
    }
    nuevoEl.Update();
    pkg.Elements.Refresh();
    return nuevoEl;
}

// Función auxiliar para posicionar un Elemento en el Diagrama de Secuencia con icono BCE
function agregarAlDiagrama(diagrama, elemento, left, right, top, bottom) {
    var pos = "l=" + left + ";r=" + right + ";t=" + top + ";b=" + bottom + ";";
    var dobj = diagrama.DiagramObjects.AddNew(pos, "");
    dobj.ElementID = elemento.ElementID;

    // Desactivar Notación de Rectángulo (UCRect=0)
    // Esto obliga a Enterprise Architect a mostrar el ICONO oficial BCE (círculo con línea para Vista / Boundary)
    var style = dobj.StyleEx ? dobj.StyleEx : "";
    if (style.indexOf("UCRect=1") >= 0) {
        dobj.StyleEx = style.replace("UCRect=1", "UCRect=0");
    } else if (style.indexOf("UCRect=0") < 0) {
        dobj.StyleEx = style + (style.length > 0 && style.charAt(style.length - 1) != ";" ? ";" : "") + "UCRect=0;";
    }

    dobj.Update();
    return dobj;
}

// Función para corregir al instante cualquier diagrama existente en el paquete
function corregirVistasExistentes(pkg) {
    Session.Output("Aplicando icono BCE (círculo con barra vertical) a todas las Vistas en los diagramas...");
    for (var d = 0; d < pkg.Diagrams.Count; d++) {
        var diag = pkg.Diagrams.GetAt(d);
        if (diag.Type == "Sequence") {
            for (var o = 0; o < diag.DiagramObjects.Count; o++) {
                var dobj = diag.DiagramObjects.GetAt(o);
                var el = Repository.GetElementByID(dobj.ElementID);
                if (el) {
                    if (el.Name.indexOf("UI_") == 0 || el.Type == "Boundary" || el.Stereotype == "boundary") {
                        if (el.Stereotype != "boundary") {
                            el.Stereotype = "boundary";
                            el.Update();
                        }
                    }
                    var style = dobj.StyleEx ? dobj.StyleEx : "";
                    if (style.indexOf("UCRect=1") >= 0) {
                        dobj.StyleEx = style.replace("UCRect=1", "UCRect=0");
                    } else if (style.indexOf("UCRect=0") < 0) {
                        dobj.StyleEx = style + (style.length > 0 && style.charAt(style.length - 1) != ";" ? ";" : "") + "UCRect=0;";
                    }
                    dobj.Update();
                }
            }
            diag.DiagramObjects.Refresh();
            diag.Update();
            try {
                Repository.ReloadDiagram(diag.DiagramID);
            } catch (e) {}
        }
    }
}

// Función auxiliar para crear Mensajes de Secuencia con numeración jerárquica
function crearMensaje(origen, destino, nombre, secuencia, esRetorno) {
    var conn = origen.Connectors.AddNew(nombre, "Sequence");
    conn.SupplierID = destino.ElementID;
    conn.SequenceNo = secuencia;
    if (esRetorno) {
        conn.Stereotype = "return";
    }
    conn.Update();
    origen.Connectors.Refresh();
    return conn;
}

// ==============================================================================
// CU01: Iniciar y cerrar sesión
// ==============================================================================
function generarCU01(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU01 Iniciar y cerrar sesion", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Usuario / Administrador", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_Sesion", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "AutenticacionController", "Control", "control");
    var entUsu = obtenerOCrearElemento(pkg, "Usuario", "Entity", "entity");
    var entRol = obtenerOCrearElemento(pkg, "Rol", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -650);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -650);
    agregarAlDiagrama(diag, ctl, 370, 470, -50, -650);
    agregarAlDiagrama(diag, entUsu, 550, 630, -50, -650);
    agregarAlDiagrama(diag, entRol, 690, 760, -50, -650);
    agregarAlDiagrama(diag, entBit, 820, 910, -50, -650);

    // 1. Iniciar sesión exitoso
    crearMensaje(act, bnd, "1. IniciarSesion(credenciales)", 1, false);
    crearMensaje(bnd, ctl, "1.1. IniciarSesion(Request)", 2, false);
    crearMensaje(ctl, entUsu, "1.2. BuscarPorCredenciales(login)", 3, false);
    crearMensaje(entUsu, ctl, "RespuestaUsuario()", 4, true);
    crearMensaje(ctl, entRol, "1.3. ObtenerRol(idRol)", 5, false);
    crearMensaje(entRol, ctl, "RespuestaRol()", 6, true);
    crearMensaje(ctl, entBit, "1.4. RegistrarAcceso('LOGIN', idUsuario)", 7, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 8, true);
    crearMensaje(ctl, bnd, "RespuestaLogin(token, usuario)", 9, true);
    crearMensaje(bnd, act, "Confirmacion(dashboard)", 10, true);

    // 2. Cerrar sesión
    crearMensaje(act, bnd, "2. CerrarSesion()", 11, false);
    crearMensaje(bnd, ctl, "2.1. CerrarSesion(Request)", 12, false);
    crearMensaje(ctl, entUsu, "2.2. RevocarToken()", 13, false);
    crearMensaje(entUsu, ctl, "RespuestaToken()", 14, true);
    crearMensaje(ctl, entBit, "2.3. RegistrarSalida('LOGOUT', idUsuario)", 15, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 16, true);
    crearMensaje(ctl, bnd, "RespuestaCierre()", 17, true);
    crearMensaje(bnd, act, "Confirmacion()", 18, true);

    // 3. Recuperar contraseña
    crearMensaje(act, bnd, "3. SolicitarRecuperacion(email)", 19, false);
    crearMensaje(bnd, ctl, "3.1. SolicitarRecuperacion(email)", 20, false);
    crearMensaje(ctl, entUsu, "3.2. VerificarEmail(email)", 21, false);
    crearMensaje(entUsu, ctl, "RespuestaEmail()", 22, true);
    crearMensaje(ctl, entUsu, "3.3. GuardarCodigoOtp(otp)", 23, false);
    crearMensaje(entUsu, ctl, "RespuestaOtp()", 24, true);
    crearMensaje(ctl, bnd, "RespuestaEnvioOtp()", 25, true);
    crearMensaje(bnd, act, "Confirmacion()", 26, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU02: Consultar bitácora de auditoría
// ==============================================================================
function generarCU02(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU02 Consultar bitacora de auditoria", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Administrador", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_Auditoria", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "BitacoraAuditoriaController", "Control", "control");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");
    var entUsu = obtenerOCrearElemento(pkg, "Usuario", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -550);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -550);
    agregarAlDiagrama(diag, ctl, 370, 490, -50, -550);
    agregarAlDiagrama(diag, entBit, 580, 680, -50, -550);
    agregarAlDiagrama(diag, entUsu, 760, 840, -50, -550);

    // 1. Listar registros
    crearMensaje(act, bnd, "1. MostrarBitacora(filtros, pagina)", 1, false);
    crearMensaje(bnd, ctl, "1.1. ListarAuditoria(Request)", 2, false);
    crearMensaje(ctl, entBit, "1.2. ConsultarConFiltros(modulo, operacion, rangoFechas)", 3, false);
    crearMensaje(entBit, ctl, "RespuestaRegistros()", 4, true);
    crearMensaje(ctl, bnd, "RespuestaAuditoria(datosPaginados)", 5, true);
    crearMensaje(bnd, act, "Confirmacion(tablaAuditoria)", 6, true);

    // 2. Detalle de evento
    crearMensaje(act, bnd, "2. VerDetalleEvento(idBitacora)", 7, false);
    crearMensaje(bnd, ctl, "2.1. ObtenerDetalleAuditoria(idBitacora)", 8, false);
    crearMensaje(ctl, entBit, "2.2. FindOrFail(idBitacora)", 9, false);
    crearMensaje(entBit, ctl, "RespuestaEvento(valoresPrevios, valoresNuevos)", 10, true);
    crearMensaje(ctl, entUsu, "2.3. ObtenerUsuarioResponsable(idUsuario)", 11, false);
    crearMensaje(entUsu, ctl, "RespuestaUsuario()", 12, true);
    crearMensaje(ctl, bnd, "RespuestaDetalle(eventoCompleto)", 13, true);
    crearMensaje(bnd, act, "Confirmacion(modalDetalle)", 14, true);

    // 3. Estadísticas
    crearMensaje(act, bnd, "3. ConsultarEstadisticas()", 15, false);
    crearMensaje(bnd, ctl, "3.1. EstadisticasAuditoria()", 16, false);
    crearMensaje(ctl, entBit, "3.2. CalcularMetricasHoy(operacionesCriticas, totalAccesos)", 17, false);
    crearMensaje(entBit, ctl, "RespuestaMetricas()", 18, true);
    crearMensaje(ctl, bnd, "RespuestaEstadisticas(metricas)", 19, true);
    crearMensaje(bnd, act, "Confirmacion(tarjetasMetricas)", 20, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU03: Gestionar usuarios internos, roles y permisos
// ==============================================================================
function generarCU03(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU03 Gestionar usuarios, roles y permisos", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Administrador", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_GestionUsuarios", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "GestionUsuariosController", "Control", "control");
    var entUsu = obtenerOCrearElemento(pkg, "Usuario", "Entity", "entity");
    var entRol = obtenerOCrearElemento(pkg, "Rol", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -580);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -580);
    agregarAlDiagrama(diag, ctl, 370, 480, -50, -580);
    agregarAlDiagrama(diag, entUsu, 570, 650, -50, -580);
    agregarAlDiagrama(diag, entRol, 720, 790, -50, -580);
    agregarAlDiagrama(diag, entBit, 850, 940, -50, -580);

    // 1. Crear usuario
    crearMensaje(act, bnd, "1. RegistrarUsuario(datosUsuario)", 1, false);
    crearMensaje(bnd, ctl, "1.1. CrearUsuario(Request)", 2, false);
    crearMensaje(ctl, entUsu, "1.2. ValidarUnicidad(username, email)", 3, false);
    crearMensaje(entUsu, ctl, "RespuestaValidacion()", 4, true);
    crearMensaje(ctl, entUsu, "1.3. Create(datosConPasswordHash)", 5, false);
    crearMensaje(entUsu, ctl, "RespuestaUsuarioCreado(idUsuario)", 6, true);
    crearMensaje(ctl, entBit, "1.4. Registrar('INSERT', 'usuarios', idUsuario)", 7, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 8, true);
    crearMensaje(ctl, bnd, "RespuestaCreacion(usuario)", 9, true);
    crearMensaje(bnd, act, "Confirmacion(usuarioCreado)", 10, true);

    // 2. Cambiar estado
    crearMensaje(act, bnd, "2. CambiarEstado(idUsuario, nuevoEstado)", 11, false);
    crearMensaje(bnd, ctl, "2.1. CambiarEstado(Request, idUsuario)", 12, false);
    crearMensaje(ctl, entUsu, "2.2. Update(['estado' => nuevoEstado])", 13, false);
    crearMensaje(entUsu, ctl, "RespuestaActualizacion()", 14, true);
    crearMensaje(ctl, entBit, "2.3. Registrar('CAMBIO_ESTADO', 'usuarios', idUsuario)", 15, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 16, true);
    crearMensaje(ctl, bnd, "RespuestaEstado()", 17, true);
    crearMensaje(bnd, act, "Confirmacion()", 18, true);

    // 3. Asignar permisos a rol
    crearMensaje(act, bnd, "3. AsignarPermisosRol(idRol, listaPermisos)", 19, false);
    crearMensaje(bnd, ctl, "3.1. AsignarPermisosRol(Request, idRol)", 20, false);
    crearMensaje(ctl, entRol, "3.2. SincronizarPermisos(permisosIds)", 21, false);
    crearMensaje(entRol, ctl, "RespuestaSincronizacion()", 22, true);
    crearMensaje(ctl, entBit, "3.3. Registrar('UPDATE', 'rol_permisos', idRol)", 23, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 24, true);
    crearMensaje(ctl, bnd, "RespuestaPermisosActualizados()", 25, true);
    crearMensaje(bnd, act, "Confirmacion()", 26, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU04: Gestionar especialidades médicas
// ==============================================================================
function generarCU04(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU04 Gestionar especialidades medicas", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Administrador", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_Especialidad", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "EspecialidadController", "Control", "control");
    var entEsp = obtenerOCrearElemento(pkg, "Especialidad", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -520);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -520);
    agregarAlDiagrama(diag, ctl, 370, 470, -50, -520);
    agregarAlDiagrama(diag, entEsp, 570, 650, -50, -520);
    agregarAlDiagrama(diag, entBit, 750, 840, -50, -520);

    // 1. Crear especialidad
    crearMensaje(act, bnd, "1. CrearEspecialidad(nombre, descripcion)", 1, false);
    crearMensaje(bnd, ctl, "1.1. Store(Request)", 2, false);
    crearMensaje(ctl, entEsp, "1.2. ValidarYCrear(nombre, descripcion)", 3, false);
    crearMensaje(entEsp, ctl, "RespuestaEspecialidad(idEspecialidad)", 4, true);
    crearMensaje(ctl, entBit, "1.3. Registrar('INSERT', 'especialidades', idEspecialidad)", 5, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 6, true);
    crearMensaje(ctl, bnd, "RespuestaCreacion()", 7, true);
    crearMensaje(bnd, act, "Confirmacion()", 8, true);

    // 2. Editar especialidad
    crearMensaje(act, bnd, "2. EditarEspecialidad(idEspecialidad, datos)", 9, false);
    crearMensaje(bnd, ctl, "2.1. Update(Request, idEspecialidad)", 10, false);
    crearMensaje(ctl, entEsp, "2.2. FindOrFail(id)->Update(datos)", 11, false);
    crearMensaje(entEsp, ctl, "RespuestaActualizacion()", 12, true);
    crearMensaje(ctl, entBit, "2.3. Registrar('UPDATE', 'especialidades', idEspecialidad)", 13, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 14, true);
    crearMensaje(ctl, bnd, "RespuestaEdicion()", 15, true);
    crearMensaje(bnd, act, "Confirmacion()", 16, true);

    // 3. Cambiar estado
    crearMensaje(act, bnd, "3. CambiarEstado(idEspecialidad, nuevoEstado)", 17, false);
    crearMensaje(bnd, ctl, "3.1. CambiarEstado(Request, idEspecialidad)", 18, false);
    crearMensaje(ctl, entEsp, "3.2. Update(['estado' => nuevoEstado])", 19, false);
    crearMensaje(entEsp, ctl, "RespuestaEstado()", 20, true);
    crearMensaje(ctl, entBit, "3.3. Registrar('CAMBIO_ESTADO', 'especialidades', idEspecialidad)", 21, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 22, true);
    crearMensaje(ctl, bnd, "RespuestaEstado()", 23, true);
    crearMensaje(bnd, act, "Confirmacion()", 24, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU05: Gestionar médicos y asignaciones
// ==============================================================================
function generarCU05(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU05 Gestionar medicos y asignaciones", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Administrador", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_Medico", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "MedicoController", "Control", "control");
    var entMed = obtenerOCrearElemento(pkg, "Medico", "Entity", "entity");
    var entUsu = obtenerOCrearElemento(pkg, "Usuario", "Entity", "entity");
    var entEsp = obtenerOCrearElemento(pkg, "MedicoEspecialidad", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -580);
    agregarAlDiagrama(diag, bnd, 190, 270, -50, -580);
    agregarAlDiagrama(diag, ctl, 340, 440, -50, -580);
    agregarAlDiagrama(diag, entMed, 500, 580, -50, -580);
    agregarAlDiagrama(diag, entUsu, 640, 710, -50, -580);
    agregarAlDiagrama(diag, entEsp, 770, 860, -50, -580);
    agregarAlDiagrama(diag, entBit, 910, 990, -50, -580);

    // 1. Registrar médico
    crearMensaje(act, bnd, "1. RegistrarMedico(datosPersonales, especialidades, crearUsuario)", 1, false);
    crearMensaje(bnd, ctl, "1.1. Store(Request)", 2, false);
    crearMensaje(ctl, entUsu, "1.2. CrearCuentaUsuario(email, rol='MEDICO')", 3, false);
    crearMensaje(entUsu, ctl, "RespuestaUsuario(idUsuario)", 4, true);
    crearMensaje(ctl, entMed, "1.3. Create(datosMedico, idUsuario)", 5, false);
    crearMensaje(entMed, ctl, "RespuestaMedico(idMedico)", 6, true);
    crearMensaje(ctl, entEsp, "1.4. AsignarEspecialidades(idMedico, especialidadesInput)", 7, false);
    crearMensaje(entEsp, ctl, "RespuestaAsignacion()", 8, true);
    crearMensaje(ctl, entBit, "1.5. Registrar('INSERT', 'medicos', idMedico)", 9, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 10, true);
    crearMensaje(ctl, bnd, "RespuestaMedicoRegistrado()", 11, true);
    crearMensaje(bnd, act, "Confirmacion()", 12, true);

    // 2. Actualizar médico
    crearMensaje(act, bnd, "2. ActualizarMedico(idMedico, datosActualizados)", 13, false);
    crearMensaje(bnd, ctl, "2.1. Update(Request, idMedico)", 14, false);
    crearMensaje(ctl, entMed, "2.2. FindOrFail(idMedico)->Update(datos)", 15, false);
    crearMensaje(entMed, ctl, "RespuestaActualizacion()", 16, true);
    crearMensaje(ctl, entEsp, "2.3. SincronizarEspecialidades(idMedico, especialidadesInput)", 17, false);
    crearMensaje(entEsp, ctl, "RespuestaSincronizacion()", 18, true);
    crearMensaje(ctl, entBit, "2.4. Registrar('UPDATE', 'medicos', idMedico)", 19, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 20, true);
    crearMensaje(ctl, bnd, "RespuestaEdicion()", 21, true);
    crearMensaje(bnd, act, "Confirmacion()", 22, true);

    // 3. Cambiar estado
    crearMensaje(act, bnd, "3. CambiarEstado(idMedico, estado)", 23, false);
    crearMensaje(bnd, ctl, "3.1. CambiarEstado(Request, idMedico)", 24, false);
    crearMensaje(ctl, entMed, "3.2. Update(['estado' => estado])", 25, false);
    crearMensaje(entMed, ctl, "RespuestaEstado()", 26, true);
    crearMensaje(ctl, entBit, "3.3. Registrar('CAMBIO_ESTADO', 'medicos', idMedico)", 27, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 28, true);
    crearMensaje(ctl, bnd, "RespuestaEstado()", 29, true);
    crearMensaje(bnd, act, "Confirmacion()", 30, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU06: Registrar y gestionar pacientes
// ==============================================================================
function generarCU06(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU06 Registrar y gestionar pacientes", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Recepcionista / Administrador", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_Paciente", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "PacienteController", "Control", "control");
    var entPac = obtenerOCrearElemento(pkg, "Paciente", "Entity", "entity");
    var entHis = obtenerOCrearElemento(pkg, "HistoriaClinica", "Entity", "entity");
    var entCon = obtenerOCrearElemento(pkg, "ContactoEmergencia", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -580);
    agregarAlDiagrama(diag, bnd, 190, 270, -50, -580);
    agregarAlDiagrama(diag, ctl, 330, 430, -50, -580);
    agregarAlDiagrama(diag, entPac, 490, 570, -50, -580);
    agregarAlDiagrama(diag, entHis, 630, 710, -50, -580);
    agregarAlDiagrama(diag, entCon, 770, 860, -50, -580);
    agregarAlDiagrama(diag, entBit, 910, 990, -50, -580);

    // 1. Registrar paciente
    crearMensaje(act, bnd, "1. RegistrarPaciente(datosPersonales, antecedentes, contacto)", 1, false);
    crearMensaje(bnd, ctl, "1.1. Store(Request)", 2, false);
    crearMensaje(ctl, entPac, "1.2. ValidarCIYCrear(datosPaciente)", 3, false);
    crearMensaje(entPac, ctl, "RespuestaPaciente(idPaciente)", 4, true);
    crearMensaje(ctl, entHis, "1.3. GenerarAperturaExpediente(idPaciente, antecedentes)", 5, false);
    crearMensaje(entHis, ctl, "RespuestaHistoria(numeroExpediente)", 6, true);
    crearMensaje(ctl, entCon, "1.4. Create(idPaciente, datosContacto)", 7, false);
    crearMensaje(entCon, ctl, "RespuestaContacto()", 8, true);
    crearMensaje(ctl, entBit, "1.5. Registrar('INSERT', 'pacientes', idPaciente)", 9, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 10, true);
    crearMensaje(ctl, bnd, "RespuestaPacienteRegistrado(expediente)", 11, true);
    crearMensaje(bnd, act, "Confirmacion(pacienteCreado)", 12, true);

    // 2. Editar paciente
    crearMensaje(act, bnd, "2. EditarPaciente(idPaciente, datos)", 13, false);
    crearMensaje(bnd, ctl, "2.1. Update(Request, idPaciente)", 14, false);
    crearMensaje(ctl, entPac, "2.2. FindOrFail(idPaciente)->Update(datos)", 15, false);
    crearMensaje(entPac, ctl, "RespuestaActualizacion()", 16, true);
    crearMensaje(ctl, entHis, "2.3. UpdateOrCreate(antecedentes)", 17, false);
    crearMensaje(entHis, ctl, "RespuestaHistoriaActualizada()", 18, true);
    crearMensaje(ctl, entBit, "2.4. Registrar('UPDATE', 'pacientes', idPaciente)", 19, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 20, true);
    crearMensaje(ctl, bnd, "RespuestaActualizacion()", 21, true);
    crearMensaje(bnd, act, "Confirmacion()", 22, true);

    // 3. Buscar por CI
    crearMensaje(act, bnd, "3. BuscarPorCI(ci)", 23, false);
    crearMensaje(bnd, ctl, "3.1. Index(Request con filtro CI)", 24, false);
    crearMensaje(ctl, entPac, "3.2. Where('ci', ci)->With(['historiaClinica'])->First()", 25, false);
    crearMensaje(entPac, ctl, "RespuestaPacienteEncontrado()", 26, true);
    crearMensaje(ctl, bnd, "RespuestaBusqueda(paciente)", 27, true);
    crearMensaje(bnd, act, "Confirmacion(detallePaciente)", 28, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU07: Configurar turnos y fraccionamiento de agenda
// ==============================================================================
function generarCU07(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU07 Configurar turnos y fraccionamiento de agenda", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Administrador / Recepción", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_TurnoMedico", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "TurnoMedicoController", "Control", "control");
    var entTur = obtenerOCrearElemento(pkg, "TurnoMedico", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -520);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -520);
    agregarAlDiagrama(diag, ctl, 370, 480, -50, -520);
    agregarAlDiagrama(diag, entTur, 580, 660, -50, -520);
    agregarAlDiagrama(diag, entBit, 760, 850, -50, -520);

    // 1. Crear turno
    crearMensaje(act, bnd, "1. CrearTurno(idMedico, diaSemana, horas, duracionBloque=15)", 1, false);
    crearMensaje(bnd, ctl, "1.1. Store(Request)", 2, false);
    crearMensaje(ctl, entTur, "1.2. ValidarSolapamientoHorario(idMedico, diaSemana, horas)", 3, false);
    crearMensaje(entTur, ctl, "RespuestaValidacion()", 4, true);
    crearMensaje(ctl, entTur, "1.3. Create(datosTurno)", 5, false);
    crearMensaje(entTur, ctl, "RespuestaTurnoCreado(idTurno)", 6, true);
    crearMensaje(ctl, entBit, "1.4. Registrar('INSERT', 'turnos_medicos', idTurno)", 7, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 8, true);
    crearMensaje(ctl, bnd, "RespuestaTurnoConBloques(bloques15Min)", 9, true);
    crearMensaje(bnd, act, "Confirmacion(agendaFraccionada)", 10, true);

    // 2. Consultar agenda semanal
    crearMensaje(act, bnd, "2. ConsultarAgendaSemanal(idMedico)", 11, false);
    crearMensaje(bnd, ctl, "2.1. AgendaSemanalMedico(idMedico)", 12, false);
    crearMensaje(ctl, entTur, "2.2. Where('id_medico', idMedico)->OrderBy('dia_semana')->Get()", 13, false);
    crearMensaje(entTur, ctl, "RespuestaTurnosSemanales()", 14, true);
    crearMensaje(ctl, bnd, "RespuestaGrillaSemanal(lunesADomingo)", 15, true);
    crearMensaje(bnd, act, "Confirmacion(grillaTurnos)", 16, true);

    // 3. Cambiar estado
    crearMensaje(act, bnd, "3. CambiarEstadoTurno(idTurno, estado)", 17, false);
    crearMensaje(bnd, ctl, "3.1. CambiarEstado(Request, idTurno)", 18, false);
    crearMensaje(ctl, entTur, "3.2. Update(['estado' => estado])", 19, false);
    crearMensaje(entTur, ctl, "RespuestaActualizacion()", 20, true);
    crearMensaje(ctl, entBit, "3.3. Registrar('CAMBIO_ESTADO', 'turnos_medicos', idTurno)", 21, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 22, true);
    crearMensaje(ctl, bnd, "RespuestaEstado()", 23, true);
    crearMensaje(bnd, act, "Confirmacion()", 24, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU08: Registrar bloqueos de agenda médica
// ==============================================================================
function generarCU08(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU08 Registrar bloqueos de agenda medica", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Administrador / Recepción", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_BloqueoAgenda", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "BloqueoAgendaController", "Control", "control");
    var entBlo = obtenerOCrearElemento(pkg, "BloqueoAgenda", "Entity", "entity");
    var entCit = obtenerOCrearElemento(pkg, "Cita", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -520);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -520);
    agregarAlDiagrama(diag, ctl, 370, 480, -50, -520);
    agregarAlDiagrama(diag, entBlo, 570, 660, -50, -520);
    agregarAlDiagrama(diag, entCit, 730, 800, -50, -520);
    agregarAlDiagrama(diag, entBit, 870, 960, -50, -520);

    // 1. Registrar bloqueo
    crearMensaje(act, bnd, "1. RegistrarBloqueo(idMedico, fechas, horas, motivo)", 1, false);
    crearMensaje(bnd, ctl, "1.1. Store(Request)", 2, false);
    crearMensaje(ctl, entCit, "1.2. ContarCitasAfectadas(idMedico, fechas, horas)", 3, false);
    crearMensaje(entCit, ctl, "RespuestaCitasConflicto(totalAfectadas)", 4, true);
    crearMensaje(ctl, entBlo, "1.3. Create(datosBloqueo, creadoPor)", 5, false);
    crearMensaje(entBlo, ctl, "RespuestaBloqueoCreado(idBloqueo)", 6, true);
    crearMensaje(ctl, entBit, "1.4. Registrar('INSERT', 'bloqueos_agenda', idBloqueo)", 7, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 8, true);
    crearMensaje(ctl, bnd, "RespuestaBloqueo(bloqueo, citasPorReprogramar)", 9, true);
    crearMensaje(bnd, act, "Confirmacion(alertaCitasAfectadas)", 10, true);

    // 2. Eliminar bloqueo
    crearMensaje(act, bnd, "2. EliminarBloqueo(idBloqueo)", 11, false);
    crearMensaje(bnd, ctl, "2.1. Destroy(Request, idBloqueo)", 12, false);
    crearMensaje(ctl, entBlo, "2.2. FindOrFail(idBloqueo)->Delete()", 13, false);
    crearMensaje(entBlo, ctl, "RespuestaEliminado()", 14, true);
    crearMensaje(ctl, entBit, "2.3. Registrar('DELETE', 'bloqueos_agenda', idBloqueo)", 15, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 16, true);
    crearMensaje(ctl, bnd, "RespuestaLiberacion()", 17, true);
    crearMensaje(bnd, act, "Confirmacion(horariosLiberados)", 18, true);

    // 3. Listar bloqueos
    crearMensaje(act, bnd, "3. ListarBloqueos(filtros)", 19, false);
    crearMensaje(bnd, ctl, "3.1. Index(Request)", 20, false);
    crearMensaje(ctl, entBlo, "3.2. With('medico')->OrderBy('fecha_inicio')->Get()", 21, false);
    crearMensaje(entBlo, ctl, "RespuestaListaBloqueos()", 22, true);
    crearMensaje(ctl, bnd, "RespuestaBloqueos(datos)", 23, true);
    crearMensaje(bnd, act, "Confirmacion(tablaBloqueos)", 24, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU09: Consultar disponibilidad de horarios médicos
// ==============================================================================
function generarCU09(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU09 Consultar disponibilidad de horarios medicos", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Paciente / Recepción", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_Disponibilidad", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "DisponibilidadController", "Control", "control");
    var entTur = obtenerOCrearElemento(pkg, "TurnoMedico", "Entity", "entity");
    var entCit = obtenerOCrearElemento(pkg, "Cita", "Entity", "entity");
    var entBlo = obtenerOCrearElemento(pkg, "BloqueoAgenda", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -520);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -520);
    agregarAlDiagrama(diag, ctl, 370, 480, -50, -520);
    agregarAlDiagrama(diag, entTur, 570, 660, -50, -520);
    agregarAlDiagrama(diag, entCit, 730, 800, -50, -520);
    agregarAlDiagrama(diag, entBlo, 870, 960, -50, -520);

    // 1. Cargar filtros
    crearMensaje(act, bnd, "1. CargarFiltros()", 1, false);
    crearMensaje(bnd, ctl, "1.1. Meta(Request)", 2, false);
    crearMensaje(ctl, bnd, "RespuestaMeta(especialidades, medicosActivos)", 3, true);
    crearMensaje(bnd, act, "Confirmacion(selectoresCargados)", 4, true);

    // 2. Consultar cupos
    crearMensaje(act, bnd, "2. ConsultarDisponibilidad(idMedico, idEspecialidad, fecha)", 5, false);
    crearMensaje(bnd, ctl, "2.1. Consultar(Request)", 6, false);
    crearMensaje(ctl, entTur, "2.2. ObtenerTurnoDelDia(idMedico, diaSemana)", 7, false);
    crearMensaje(entTur, ctl, "RespuestaTurno(bloques15Min)", 8, true);
    crearMensaje(ctl, entCit, "2.3. ObtenerCitasOcupadas(idMedico, fecha)", 9, false);
    crearMensaje(entCit, ctl, "RespuestaCitasOcupadas()", 10, true);
    crearMensaje(ctl, entBlo, "2.4. ObtenerBloqueosActivos(idMedico, fecha)", 11, false);
    crearMensaje(entBlo, ctl, "RespuestaBloqueos()", 12, true);
    crearMensaje(ctl, bnd, "RespuestaCuposDisponibles(listaSlotsDisponibles)", 13, true);
    crearMensaje(bnd, act, "Confirmacion(grillaHorariosVerdes)", 14, true);

    // 3. Calendario quincenal
    crearMensaje(act, bnd, "3. ConsultarQuincena(idMedico, rangoFechas)", 15, false);
    crearMensaje(bnd, ctl, "3.1. CalendarioQuincenal(Request)", 16, false);
    crearMensaje(ctl, bnd, "RespuestaResumenQuincena(diasConCuposLibres)", 17, true);
    crearMensaje(bnd, act, "Confirmacion(calendarioMensual)", 18, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU10: Reservar cita médica con control de concurrencia
// ==============================================================================
function generarCU10(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU10 Reservar cita medica con control de concurrencia", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Paciente / Recepcionista", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_ReservaCita", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "ReservaCitaController", "Control", "control");
    var entBlo = obtenerOCrearElemento(pkg, "BloqueoAgenda", "Entity", "entity");
    var entCit = obtenerOCrearElemento(pkg, "Cita", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -550);
    agregarAlDiagrama(diag, bnd, 200, 290, -50, -550);
    agregarAlDiagrama(diag, ctl, 370, 480, -50, -550);
    agregarAlDiagrama(diag, entBlo, 570, 660, -50, -550);
    agregarAlDiagrama(diag, entCit, 730, 800, -50, -550);
    agregarAlDiagrama(diag, entBit, 870, 960, -50, -550);

    // 1. Confirmar reserva con bloqueo pesimista
    crearMensaje(act, bnd, "1. ConfirmarReserva(idPaciente, idMedico, idEspecialidad, fecha, horas)", 1, false);
    crearMensaje(bnd, ctl, "1.1. Store(Request)", 2, false);
    crearMensaje(ctl, entBlo, "1.2. VerificarBloqueoAgenda(idMedico, fecha, horas)", 3, false);
    crearMensaje(entBlo, ctl, "RespuestaSinBloqueo()", 4, true);
    crearMensaje(ctl, entCit, "1.3. Where(idMedico, fecha, horas)->LockForUpdate()->Exists()", 5, false);
    crearMensaje(entCit, ctl, "RespuestaCupoDisponible()", 6, true);
    crearMensaje(ctl, entCit, "1.4. Create(datosCita, codigoCita, estado='PROGRAMADA')", 7, false);
    crearMensaje(entCit, ctl, "RespuestaCitaConfirmada(idCita, codigoCita)", 8, true);
    crearMensaje(ctl, entBit, "1.5. Registrar('INSERT', 'citas', idCita)", 9, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 10, true);
    crearMensaje(ctl, bnd, "RespuestaReservaExitosa(cita, comprobante)", 11, true);
    crearMensaje(bnd, act, "Confirmacion(boletaCita)", 12, true);

    // 2. Colisión de concurrencia
    crearMensaje(ctl, entCit, "2.1. Where(idMedico, fecha, horas)->LockForUpdate()->Exists()", 13, false);
    crearMensaje(entCit, ctl, "ConflictoHorarioOcupado()", 14, true);
    crearMensaje(ctl, bnd, "Error 409 Conflict('Cupo ocupado')", 15, true);
    crearMensaje(bnd, act, "MostrarMensajeConflicto('Horario ocupado, elija otro cupo')", 16, true);

    // 3. Ver detalle
    crearMensaje(act, bnd, "3. VerDetalleCita(idCita)", 17, false);
    crearMensaje(bnd, ctl, "3.1. Show(idCita)", 18, false);
    crearMensaje(ctl, entCit, "3.2. With(['paciente','medico','especialidad'])->FindOrFail(idCita)", 19, false);
    crearMensaje(entCit, ctl, "RespuestaCitaCompleta()", 20, true);
    crearMensaje(ctl, bnd, "RespuestaDetalle(cita)", 21, true);
    crearMensaje(bnd, act, "Confirmacion(fichaCita)", 22, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU11: Reprogramar cita médica
// ==============================================================================
function generarCU11(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU11 Reprogramar cita medica", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Paciente / Recepcionista", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_ReprogramacionCita", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "ReprogramacionController", "Control", "control");
    var entBlo = obtenerOCrearElemento(pkg, "BloqueoAgenda", "Entity", "entity");
    var entCit = obtenerOCrearElemento(pkg, "Cita", "Entity", "entity");
    var entHis = obtenerOCrearElemento(pkg, "HistorialReprogramacion", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -550);
    agregarAlDiagrama(diag, bnd, 190, 280, -50, -550);
    agregarAlDiagrama(diag, ctl, 340, 450, -50, -550);
    agregarAlDiagrama(diag, entBlo, 520, 600, -50, -550);
    agregarAlDiagrama(diag, entCit, 670, 740, -50, -550);
    agregarAlDiagrama(diag, entHis, 800, 890, -50, -550);
    agregarAlDiagrama(diag, entBit, 940, 1020, -50, -550);

    // 1. Reprogramar cita
    crearMensaje(act, bnd, "1. SolicitarReprogramacion(idCita, nuevaFecha, nuevoHorario, motivo)", 1, false);
    crearMensaje(bnd, ctl, "1.1. ReprogramarCita(Request, idCita)", 2, false);
    crearMensaje(ctl, entBlo, "1.2. VerificarDisponibilidadNuevoHorario(idMedico, nuevaFecha, nuevoHorario)", 3, false);
    crearMensaje(entBlo, ctl, "RespuestaDisponible()", 4, true);
    crearMensaje(ctl, entCit, "1.3. FindOrFail(idCita)->LockForUpdate()", 5, false);
    crearMensaje(entCit, ctl, "DatosCitaOriginal()", 6, true);
    crearMensaje(ctl, entHis, "1.4. Create(idCita, fechaAnterior, fechaNueva, motivo, idUsuario)", 7, false);
    crearMensaje(entHis, ctl, "RespuestaHistorialCreado()", 8, true);
    crearMensaje(ctl, entCit, "1.5. Update(['fecha_cita' => nuevaFecha, 'estado_cita' => 'REPROGRAMADA'])", 9, false);
    crearMensaje(entCit, ctl, "RespuestaCitaActualizada()", 10, true);
    crearMensaje(ctl, entBit, "1.6. Registrar('REPROGRAMACION', 'citas', idCita)", 11, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 12, true);
    crearMensaje(ctl, bnd, "RespuestaReprogramacionExitosa(citaActualizada)", 13, true);
    crearMensaje(bnd, act, "Confirmacion(nuevaBoleta)", 14, true);

    // 2. Consultar historial
    crearMensaje(act, bnd, "2. ConsultarHistorial(idCita)", 15, false);
    crearMensaje(bnd, ctl, "2.1. Historial(idCita)", 16, false);
    crearMensaje(ctl, entHis, "2.2. Where('id_cita', idCita)->With('usuarioResponsable')->Get()", 17, false);
    crearMensaje(entHis, ctl, "ListaReprogramaciones()", 18, true);
    crearMensaje(ctl, bnd, "RespuestaHistorial(lista)", 19, true);
    crearMensaje(bnd, act, "Confirmacion(lineaDeTiempo)", 20, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// CU12: Cancelar cita médica
// ==============================================================================
function generarCU12(pkg) {
    var diag = pkg.Diagrams.AddNew("sd CU12 Cancelar cita medica", "Sequence");
    diag.Update();

    var act = obtenerOCrearElemento(pkg, "Paciente / Recepcionista", "Actor", "");
    var bnd = obtenerOCrearElemento(pkg, "UI_CancelacionCita", "Boundary", "boundary");
    var ctl = obtenerOCrearElemento(pkg, "CancelacionController", "Control", "control");
    var entCit = obtenerOCrearElemento(pkg, "Cita", "Entity", "entity");
    var entCan = obtenerOCrearElemento(pkg, "CancelacionCita", "Entity", "entity");
    var entBit = obtenerOCrearElemento(pkg, "BitacoraAuditoria", "Entity", "entity");

    agregarAlDiagrama(diag, act, 50, 140, -50, -520);
    agregarAlDiagrama(diag, bnd, 190, 280, -50, -520);
    agregarAlDiagrama(diag, ctl, 340, 450, -50, -520);
    agregarAlDiagrama(diag, entCit, 530, 600, -50, -520);
    agregarAlDiagrama(diag, entCan, 680, 770, -50, -520);
    agregarAlDiagrama(diag, entBit, 850, 940, -50, -520);

    // 1. Cancelar cita
    crearMensaje(act, bnd, "1. CancelarCita(idCita, motivo)", 1, false);
    crearMensaje(bnd, ctl, "1.1. CancelarCita(Request, idCita)", 2, false);
    crearMensaje(ctl, entCit, "1.2. FindOrFail(idCita)->LockForUpdate()", 3, false);
    crearMensaje(entCit, ctl, "CitaOriginal()", 4, true);
    crearMensaje(ctl, entCan, "1.3. Create(idCita, motivo, idUsuarioResponsable)", 5, false);
    crearMensaje(entCan, ctl, "RespuestaCancelacionCreada()", 6, true);
    crearMensaje(ctl, entCit, "1.4. Update(['estado_cita' => 'CANCELADA'])", 7, false);
    crearMensaje(entCit, ctl, "RespuestaCitaCancelada()", 8, true);
    crearMensaje(ctl, entBit, "1.5. Registrar('CANCELACION', 'citas', idCita)", 9, false);
    crearMensaje(entBit, ctl, "RespuestaBitacora()", 10, true);
    crearMensaje(ctl, bnd, "RespuestaCancelacionExitosa(mensaje, cupoLiberado=true)", 11, true);
    crearMensaje(bnd, act, "Confirmacion(notificacionCancelacion)", 12, true);

    // 2. Detalle de cancelación
    crearMensaje(act, bnd, "2. VerDetalleCancelacion(idCita)", 13, false);
    crearMensaje(bnd, ctl, "2.1. DetalleCancelacion(idCita)", 14, false);
    crearMensaje(ctl, entCan, "2.2. Where('id_cita', idCita)->With('usuarioResponsable')->First()", 15, false);
    crearMensaje(entCan, ctl, "DatosCancelacion()", 16, true);
    crearMensaje(ctl, bnd, "RespuestaDetalle(motivo, fecha, usuario)", 17, true);
    crearMensaje(bnd, act, "Confirmacion(modalCancelacion)", 18, true);

    diag.Update();
    Repository.ReloadDiagram(diag.DiagramID);
}

// ==============================================================================
// Función Principal (Main)
// ==============================================================================
function Main() {
    var currentPackage as EA.Package;
    currentPackage = Repository.GetTreeSelectedPackage();

    if (currentPackage != null) {
        Session.Output("======================================================");
        Session.Output("Iniciando generacion de Diagramas de Secuencia (CU01 a CU12)...");
        Session.Output("Paquete seleccionado: " + currentPackage.Name);
        Session.Output("======================================================");

        // 1. Corregir cualquier diagrama ya existente para que use el icono BCE
        corregirVistasExistentes(currentPackage);

        // 2. Generar CU01 a CU12
        generarCU01(currentPackage);
        Session.Output("-> CU01 generado con exito.");

        generarCU02(currentPackage);
        Session.Output("-> CU02 generado con exito.");

        generarCU03(currentPackage);
        Session.Output("-> CU03 generado con exito.");

        generarCU04(currentPackage);
        Session.Output("-> CU04 generado con exito.");

        generarCU05(currentPackage);
        Session.Output("-> CU05 generado con exito.");

        generarCU06(currentPackage);
        Session.Output("-> CU06 generado con exito.");

        generarCU07(currentPackage);
        Session.Output("-> CU07 generado con exito.");

        generarCU08(currentPackage);
        Session.Output("-> CU08 generado con exito.");

        generarCU09(currentPackage);
        Session.Output("-> CU09 generado con exito.");

        generarCU10(currentPackage);
        Session.Output("-> CU10 generado con exito.");

        generarCU11(currentPackage);
        Session.Output("-> CU11 generado con exito.");

        generarCU12(currentPackage);
        Session.Output("-> CU12 generado con exito.");

        // 3. Re-asegurar que todas las vistas de los diagramas tengan el icono BCE
        corregirVistasExistentes(currentPackage);

        currentPackage.Diagrams.Refresh();
        currentPackage.Elements.Refresh();

        Session.Output("======================================================");
        Session.Output("Todos los diagramas de secuencia (CU01 al CU12) han sido creados correctamente!");
        Session.Output("======================================================");
    } else {
        Session.Prompt("Por favor, selecciona un paquete en el Project Browser antes de ejecutar el script.", promptOK);
    }
}

Main();