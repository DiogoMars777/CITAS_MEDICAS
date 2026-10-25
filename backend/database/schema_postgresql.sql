-- ==============================================================================
-- CLÍNICA VIDA SALUD - ESQUEMA Y DATOS INICIALES (POSTGRESQL 16 / SUPABASE)
-- Motor: PostgreSQL 16
-- Codificación: UTF-8
-- ==============================================================================

-- 0. EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ELIMINACIÓN DE TABLAS EN ORDEN DE DEPENDENCIAS (DROP CASCADE)
DROP TABLE IF EXISTS bitacora_auditoria CASCADE;
DROP TABLE IF EXISTS recordatorios CASCADE;
DROP TABLE IF EXISTS laboratorios_estudios CASCADE;
DROP TABLE IF EXISTS cancelaciones_citas CASCADE;
DROP TABLE IF EXISTS historial_reprogramaciones CASCADE;
DROP TABLE IF EXISTS atenciones_medicas CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS bloqueos_agenda CASCADE;
DROP TABLE IF EXISTS turnos_medicos CASCADE;
DROP TABLE IF EXISTS medico_especialidades CASCADE;
DROP TABLE IF EXISTS medicos CASCADE;
DROP TABLE IF EXISTS especialidades CASCADE;
DROP TABLE IF EXISTS historias_clinicas CASCADE;
DROP TABLE IF EXISTS contactos_emergencia CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS rol_permisos CASCADE;
DROP TABLE IF EXISTS permisos CASCADE;
DROP TABLE IF EXISTS personal_access_tokens CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ==============================================================================
-- 2. TABLAS DE SEGURIDAD, ROLES Y USUARIOS
-- ==============================================================================

CREATE TABLE roles (
    id_rol BIGSERIAL PRIMARY KEY,
    nombre_rol VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permisos (
    id_permiso BIGSERIAL PRIMARY KEY,
    modulo VARCHAR(50) NOT NULL,
    nombre_permiso VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150),
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rol_permisos (
    id_rol BIGINT NOT NULL,
    id_permiso BIGINT NOT NULL,
    fecha_asignacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT fk_rol_permisos_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rol_permisos_permiso FOREIGN KEY (id_permiso) REFERENCES permisos(id_permiso) ON DELETE CASCADE
);

CREATE TABLE usuarios (
    id_usuario BIGSERIAL PRIMARY KEY,
    id_rol BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),
    ultimo_login TIMESTAMP WITH TIME ZONE,
    intentos_fallidos INTEGER NOT NULL DEFAULT 0,
    fecha_bloqueo TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT
);

CREATE TABLE password_reset_tokens (
    email VARCHAR(100) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity);

CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pat_tokenable ON personal_access_tokens(tokenable_type, tokenable_id);
CREATE INDEX idx_pat_expires_at ON personal_access_tokens(expires_at);

-- ==============================================================================
-- 3. PACIENTES E HISTORIA CLÍNICA
-- ==============================================================================

CREATE TABLE pacientes (
    id_paciente BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT UNIQUE,
    ci VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10) NOT NULL CHECK (sexo IN ('MASCULINO', 'FEMENINO', 'OTRO')),
    telefono VARCHAR(25),
    email VARCHAR(100),
    direccion VARCHAR(200),
    primera_visita BOOLEAN NOT NULL DEFAULT TRUE,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pacientes_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE TABLE contactos_emergencia (
    id_contacto BIGSERIAL PRIMARY KEY,
    id_paciente BIGINT NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    parentesco VARCHAR(40) NOT NULL,
    telefono VARCHAR(25) NOT NULL,
    direccion VARCHAR(200),
    CONSTRAINT fk_contactos_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

CREATE TABLE historias_clinicas (
    id_historia_clinica BIGSERIAL PRIMARY KEY,
    id_paciente BIGINT NOT NULL UNIQUE,
    numero_expediente VARCHAR(30) NOT NULL UNIQUE,
    tipo_sangre VARCHAR(5),
    alergias_medicamentos TEXT,
    enfermedades_hereditarias TEXT,
    antecedentes_patologicos TEXT,
    antecedentes_quirurgicos TEXT,
    fecha_apertura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historias_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- ==============================================================================
-- 4. MÉDICOS, ESPECIALIDADES Y AGENDAS
-- ==============================================================================

CREATE TABLE especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

CREATE TABLE medicos (
    id_medico BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE,
    numero_registro_profesional VARCHAR(40) NOT NULL UNIQUE,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    telefono VARCHAR(25) NOT NULL,
    email VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'VACACIONES', 'LICENCIA')),
    fecha_ingreso DATE NOT NULL,
    CONSTRAINT fk_medicos_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

CREATE TABLE medico_especialidades (
    id_medico BIGINT NOT NULL,
    id_especialidad INTEGER NOT NULL,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_medico, id_especialidad),
    CONSTRAINT fk_medesp_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE,
    CONSTRAINT fk_medesp_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad) ON DELETE CASCADE
);

CREATE TABLE turnos_medicos (
    id_turno BIGSERIAL PRIMARY KEY,
    id_medico BIGINT NOT NULL,
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1: Lunes .. 7: Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_bloque_min INTEGER NOT NULL DEFAULT 15,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
    CONSTRAINT fk_turnos_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE
);

CREATE TABLE bloqueos_agenda (
    id_bloqueo BIGSERIAL PRIMARY KEY,
    id_medico BIGINT NOT NULL,
    fecha_inicio DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_fin TIME NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    todo_el_dia BOOLEAN NOT NULL DEFAULT FALSE,
    creado_por BIGINT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bloqueos_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE,
    CONSTRAINT fk_bloqueos_usuario FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- ==============================================================================
-- 5. GESTIÓN DE CITAS, RESERVAS Y ATENCIONES
-- ==============================================================================

CREATE TABLE citas (
    id_cita BIGSERIAL PRIMARY KEY,
    codigo_cita VARCHAR(30) NOT NULL UNIQUE,
    id_paciente BIGINT NOT NULL,
    id_medico BIGINT NOT NULL,
    id_especialidad INTEGER NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo_consulta VARCHAR(255) NOT NULL,
    estado_cita VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADA' 
        CHECK (estado_cita IN ('PROGRAMADA', 'CONFIRMADA', 'EN_SALA', 'ATENDIDA', 'CANCELADA', 'REPROGRAMADA', 'INASISTENCIA')),
    creado_por BIGINT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_citas_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_creador FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);
CREATE INDEX idx_citas_medico_agenda ON citas(id_medico, fecha_cita, hora_inicio);
CREATE INDEX idx_citas_paciente_fecha ON citas(id_paciente, fecha_cita);

CREATE TABLE reservas (
    id_reserva BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL UNIQUE,
    id_paciente BIGINT NOT NULL,
    token_reserva VARCHAR(100) NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
    estado_reserva VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_reserva IN ('PENDIENTE', 'CONFIRMADA', 'EXPIRADA')),
    CONSTRAINT fk_reservas_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE,
    CONSTRAINT fk_reservas_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

CREATE TABLE atenciones_medicas (
    id_atencion BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL UNIQUE,
    id_historia_clinica BIGINT NOT NULL,
    id_medico BIGINT NOT NULL,
    motivo_consulta VARCHAR(255) NOT NULL,
    sintomas TEXT,
    diagnostico_cie10 VARCHAR(20),
    diagnostico_descripcion TEXT NOT NULL,
    tratamiento TEXT,
    receta_medica TEXT,
    fecha_atencion TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atenciones_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE RESTRICT,
    CONSTRAINT fk_atenciones_historia FOREIGN KEY (id_historia_clinica) REFERENCES historias_clinicas(id_historia_clinica) ON DELETE RESTRICT,
    CONSTRAINT fk_atenciones_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE RESTRICT
);

CREATE TABLE historial_reprogramaciones (
    id_reprogramacion BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL,
    fecha_anterior DATE NOT NULL,
    hora_inicio_anterior TIME NOT NULL,
    hora_fin_anterior TIME NOT NULL,
    id_medico_anterior BIGINT NOT NULL,
    fecha_nueva DATE NOT NULL,
    hora_inicio_nueva TIME NOT NULL,
    hora_fin_nueva TIME NOT NULL,
    id_medico_nuevo BIGINT NOT NULL,
    motivo_reprogramacion TEXT NOT NULL,
    id_usuario_responsable BIGINT NOT NULL,
    fecha_operacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reprog_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE,
    CONSTRAINT fk_reprog_medico_ant FOREIGN KEY (id_medico_anterior) REFERENCES medicos(id_medico) ON DELETE RESTRICT,
    CONSTRAINT fk_reprog_medico_nuevo FOREIGN KEY (id_medico_nuevo) REFERENCES medicos(id_medico) ON DELETE RESTRICT,
    CONSTRAINT fk_reprog_usuario FOREIGN KEY (id_usuario_responsable) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

CREATE TABLE cancelaciones_citas (
    id_cancelacion BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL UNIQUE,
    motivo_cancelacion TEXT NOT NULL,
    id_usuario_responsable BIGINT NOT NULL,
    fecha_cancelacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cancel_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE,
    CONSTRAINT fk_cancel_usuario FOREIGN KEY (id_usuario_responsable) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- ==============================================================================
-- 6. LABORATORIOS, RECORDATORIOS Y BITÁCORA DE AUDITORÍA
-- ==============================================================================

CREATE TABLE laboratorios_estudios (
    id_estudio BIGSERIAL PRIMARY KEY,
    codigo_estudio VARCHAR(30) NOT NULL UNIQUE,
    id_paciente BIGINT NOT NULL,
    id_medico_solicitante BIGINT NOT NULL,
    id_cita BIGINT,
    nombre_estudio VARCHAR(120) NOT NULL,
    tipo_estudio VARCHAR(80) NOT NULL,
    descripcion TEXT,
    fecha_solicitud TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'PUBLICADO')),
    resultado_diagnostico TEXT,
    archivo_resultado_url VARCHAR(255),
    publicado_en TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_lab_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE RESTRICT,
    CONSTRAINT fk_lab_medico FOREIGN KEY (id_medico_solicitante) REFERENCES medicos(id_medico) ON DELETE RESTRICT,
    CONSTRAINT fk_lab_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE SET NULL
);

CREATE TABLE recordatorios (
    id_recordatorio BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL,
    tipo_canal VARCHAR(20) NOT NULL CHECK (tipo_canal IN ('EMAIL', 'SMS', 'WHATSAPP')),
    fecha_programada TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    estado_envio VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_envio IN ('PENDIENTE', 'ENVIADO', 'FALLIDO')),
    intentos INTEGER NOT NULL DEFAULT 0,
    mensaje TEXT NOT NULL,
    CONSTRAINT fk_recordatorios_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
);

CREATE TABLE bitacora_auditoria (
    id_bitacora BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT,
    modulo VARCHAR(50) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro_afectado BIGINT NOT NULL,
    operacion VARCHAR(30) NOT NULL, -- INSERT, UPDATE, DELETE, LOGIN, LOGOUT, CAMBIO_ESTADO
    valores_anteriores JSONB,
    valores_nuevos JSONB,
    direccion_ip VARCHAR(45),
    user_agent TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bitacora_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);
CREATE INDEX idx_bitacora_registro ON bitacora_auditoria(tabla_afectada, id_registro_afectado);
CREATE INDEX idx_bitacora_fecha ON bitacora_auditoria(fecha_creacion);

-- ==============================================================================
-- 7. DATOS SEMILLA (ROLES, USUARIOS, ESPECIALIDADES Y PERMISOS)
-- ==============================================================================

-- Roles
INSERT INTO roles (id_rol, nombre_rol, descripcion, activo) VALUES
(1, 'ADMINISTRADOR', 'Administrador con acceso total al sistema', TRUE),
(2, 'RECEPCIONISTA', 'Recepción, gestión de turnos y citas', TRUE),
(3, 'MEDICO', 'Cuerpo médico, agenda y atención de consultas', TRUE),
(4, 'PACIENTE', 'Portal de pacientes para reserva y resultados', TRUE)
ON CONFLICT (id_rol) DO UPDATE SET nombre_rol = EXCLUDED.nombre_rol;

-- Especialidades
INSERT INTO especialidades (id_especialidad, nombre, descripcion, estado) VALUES
(1, 'Medicina General', 'Atención médica primaria integral para adultos y familias', 'ACTIVO'),
(2, 'Pediatría', 'Atención integral de salud para niños y adolescentes', 'ACTIVO'),
(3, 'Geriatría', 'Atención médica especializada en adultos mayores', 'ACTIVO'),
(4, 'Ginecología', 'Salud femenina, reproductiva y control prenatal', 'ACTIVO'),
(5, 'Cardiología', 'Prevención, diagnóstico y tratamiento cardíaco', 'ACTIVO'),
(6, 'Odontología', 'Salud bucal integral y prevención', 'ACTIVO'),
(7, 'Traumatología', 'Lesiones osteoarticulares y rehabilitación', 'ACTIVO'),
(8, 'Oftalmología', 'Salud visual y patologías oculares', 'ACTIVO')
ON CONFLICT (id_especialidad) DO UPDATE SET nombre = EXCLUDED.nombre;

-- Usuarios (Contraseña: Password123#)
INSERT INTO usuarios (id_usuario, id_rol, username, email, password_hash, estado) VALUES
(1, 1, 'admin', 'admin@clinicavidasalud.com', '$2y$12$Z0H3rLkJh16K2y8B6pEweO0d34Yn0WpW1bQcR7yS9uV5xY4z0WbQ2', 'ACTIVO'),
(2, 2, 'recepcion', 'recepcion@clinicavidasalud.com', '$2y$12$Z0H3rLkJh16K2y8B6pEweO0d34Yn0WpW1bQcR7yS9uV5xY4z0WbQ2', 'ACTIVO'),
(3, 3, 'medico', 'medico@clinicavidasalud.com', '$2y$12$Z0H3rLkJh16K2y8B6pEweO0d34Yn0WpW1bQcR7yS9uV5xY4z0WbQ2', 'ACTIVO'),
(4, 4, 'paciente', 'paciente@clinicavidasalud.com', '$2y$12$Z0H3rLkJh16K2y8B6pEweO0d34Yn0WpW1bQcR7yS9uV5xY4z0WbQ2', 'ACTIVO')
ON CONFLICT (id_usuario) DO UPDATE SET username = EXCLUDED.username;

-- Perfil Médico Inicial
INSERT INTO medicos (id_medico, id_usuario, numero_registro_profesional, nombres, apellidos, telefono, email, estado, fecha_ingreso) VALUES
(1, 3, 'MP-98432', 'Carlos Alberto', 'Mendoza Suárez', '70012345', 'medico@clinicavidasalud.com', 'ACTIVO', CURRENT_DATE - INTERVAL '1 year')
ON CONFLICT (id_medico) DO NOTHING;

INSERT INTO medico_especialidades (id_medico, id_especialidad, es_principal) VALUES
(1, 1, TRUE)
ON CONFLICT (id_medico, id_especialidad) DO NOTHING;

-- Perfil Paciente Inicial
INSERT INTO pacientes (id_paciente, id_usuario, ci, nombres, apellidos, fecha_nacimiento, sexo, telefono, email, direccion, primera_visita, estado) VALUES
(1, 4, '87654321', 'Juan Pablo', 'Pérez Gómez', '1990-05-15', 'MASCULINO', '75598765', 'paciente@clinicavidasalud.com', 'Av. Las Américas #450', FALSE, 'ACTIVO')
ON CONFLICT (id_paciente) DO NOTHING;

-- Historia Clínica Inicial
INSERT INTO historias_clinicas (id_historia_clinica, id_paciente, numero_expediente, tipo_sangre, alergias_medicamentos, enfermedades_hereditarias, antecedentes_patologicos) VALUES
(1, 1, 'HC-2026-0001', 'O+', 'Penicilina', 'Hipertensión arterial (padre)', 'Rinitis alérgica estacional')
ON CONFLICT (id_paciente) DO NOTHING;

-- Permisos (33 permisos del sistema)
INSERT INTO permisos (id_permiso, modulo, nombre_permiso, descripcion) VALUES
(1, 'SEGURIDAD', 'usuarios.ver', 'Ver listado y detalles de usuarios internos'),
(2, 'SEGURIDAD', 'usuarios.crear', 'Registrar nuevas cuentas de personal'),
(3, 'SEGURIDAD', 'usuarios.editar', 'Modificar datos y roles de usuarios'),
(4, 'SEGURIDAD', 'usuarios.estado', 'Activar, desactivar o bloquear usuarios'),
(5, 'SEGURIDAD', 'roles.ver', 'Ver roles y privilegios asignados'),
(6, 'SEGURIDAD', 'roles.asignar_permisos', 'Modificar privilegios por rol'),
(7, 'SEGURIDAD', 'bitacora.ver', 'Consultar bitácora de auditoría del sistema'),
(8, 'SEGURIDAD', 'backups.gestionar', 'Generar y restaurar copias de seguridad'),
(9, 'MEDICOS', 'especialidades.ver', 'Consultar especialidades médicas'),
(10, 'MEDICOS', 'especialidades.gestionar', 'Crear y editar especialidades'),
(11, 'MEDICOS', 'medicos.ver', 'Consultar directorio de médicos'),
(12, 'MEDICOS', 'medicos.gestionar', 'Alta, edición y asignación de médicos'),
(13, 'PACIENTES', 'pacientes.ver', 'Consultar padrón de pacientes'),
(14, 'PACIENTES', 'pacientes.crear', 'Apertura de ficha de nuevos pacientes'),
(15, 'PACIENTES', 'pacientes.editar', 'Actualizar datos personales de pacientes'),
(16, 'PACIENTES', 'historial.ver', 'Visualizar antecedentes clínicos base'),
(17, 'PACIENTES', 'historial.editar', 'Registrar alergias y tipo de sangre'),
(18, 'AGENDAS', 'turnos.configurar', 'Configurar turnos y bloques de 15 min'),
(19, 'AGENDAS', 'bloqueos.gestionar', 'Registrar bloqueos de agenda médica'),
(20, 'AGENDAS', 'disponibilidad.ver', 'Consultar cupos libres de médicos'),
(21, 'CITAS', 'citas.ver', 'Ver agenda y listado general de citas'),
(22, 'CITAS', 'citas.reservar', 'Emitir ficha y reservar cita médica'),
(23, 'CITAS', 'citas.reprogramar', 'Reprogramar fecha/hora de cita'),
(24, 'CITAS', 'citas.cancelar', 'Cancelar cita con motivo justificado'),
(25, 'CITAS', 'citas.asistencia', 'Marcar asistencia o inasistencia en sala'),
(26, 'CONSULTAS', 'agenda_diaria.ver', 'Ver agenda médica de pacientes del día'),
(27, 'CONSULTAS', 'consultas.atender', 'Registrar evolución y diagnóstico CIE-10'),
(28, 'CONSULTAS', 'recetas.emitir', 'Emitir recetas médicas digitales'),
(29, 'LABORATORIOS', 'laboratorios.cargar', 'Cargar resultados y estudios clínicos'),
(30, 'LABORATORIOS', 'laboratorios.ver', 'Visualizar visor digital de laboratorios'),
(31, 'LABORATORIOS', 'laboratorios.descargar', 'Descargar informes de laboratorio'),
(32, 'REPORTES', 'dashboard.ver', 'Ver dashboard operativo y métricas'),
(33, 'REPORTES', 'reportes.exportar', 'Generar y exportar reportes estadísticos')
ON CONFLICT (nombre_permiso) DO UPDATE SET modulo = EXCLUDED.modulo, descripcion = EXCLUDED.descripcion;

-- Asignación de todos los permisos al Administrador (id_rol = 1)
INSERT INTO rol_permisos (id_rol, id_permiso)
SELECT 1, id_permiso FROM permisos
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- Asignación de permisos a Recepcionista (id_rol = 2)
INSERT INTO rol_permisos (id_rol, id_permiso)
SELECT 2, id_permiso FROM permisos 
WHERE modulo IN ('PACIENTES', 'CITAS', 'AGENDAS') 
   OR nombre_permiso IN ('laboratorios.cargar', 'laboratorios.ver', 'reportes.exportar')
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- Asignación de permisos a Médico (id_rol = 3)
INSERT INTO rol_permisos (id_rol, id_permiso)
SELECT 3, id_permiso FROM permisos 
WHERE modulo IN ('CONSULTAS', 'AGENDAS') 
   OR nombre_permiso IN ('pacientes.ver', 'historial.ver', 'historial.editar', 'laboratorios.ver', 'laboratorios.descargar', 'dashboard.ver')
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- Asignación de permisos a Paciente (id_rol = 4)
INSERT INTO rol_permisos (id_rol, id_permiso)
SELECT 4, id_permiso FROM permisos 
WHERE nombre_permiso IN ('disponibilidad.ver', 'citas.ver', 'citas.reservar', 'citas.reprogramar', 'citas.cancelar', 'laboratorios.ver', 'laboratorios.descargar')
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- ==============================================================================
-- 8. SINCRONIZACIÓN DE SECUENCIAS AUTO-INCREMENTABLES
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('roles', 'id_rol'), COALESCE((SELECT MAX(id_rol) FROM roles), 1));
SELECT setval(pg_get_serial_sequence('permisos', 'id_permiso'), COALESCE((SELECT MAX(id_permiso) FROM permisos), 1));
SELECT setval(pg_get_serial_sequence('usuarios', 'id_usuario'), COALESCE((SELECT MAX(id_usuario) FROM usuarios), 1));
SELECT setval(pg_get_serial_sequence('especialidades', 'id_especialidad'), COALESCE((SELECT MAX(id_especialidad) FROM especialidades), 1));
SELECT setval(pg_get_serial_sequence('medicos', 'id_medico'), COALESCE((SELECT MAX(id_medico) FROM medicos), 1));
SELECT setval(pg_get_serial_sequence('pacientes', 'id_paciente'), COALESCE((SELECT MAX(id_paciente) FROM pacientes), 1));
SELECT setval(pg_get_serial_sequence('historias_clinicas', 'id_historia_clinica'), COALESCE((SELECT MAX(id_historia_clinica) FROM historias_clinicas), 1));
