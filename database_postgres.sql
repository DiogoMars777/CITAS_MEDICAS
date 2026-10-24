-- =============================================================================
-- BASE DE DATOS: CLÍNICA VIDA SALUD (POSTGRESQL 14+ / 16+)
-- Script DDL Relacional Normalizado con Restricciones e Índices
-- =============================================================================

-- 0. Crear base de datos (Ejecutar por separado si es necesario)
-- CREATE DATABASE clinica_vida_salud WITH ENCODING 'UTF8';

-- Conectar a la base de datos:
-- \c clinica_vida_salud;

-- Asegurar extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. TABLA: roles
-- =============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. TABLA: permisos
-- =============================================================================
CREATE TABLE IF NOT EXISTS permisos (
    id_permiso SERIAL PRIMARY KEY,
    modulo VARCHAR(50) NOT NULL,
    nombre_permiso VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

-- =============================================================================
-- 3. TABLA: rol_permisos (N:M)
-- =============================================================================
CREATE TABLE IF NOT EXISTS rol_permisos (
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT fk_rol_permisos_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rol_permisos_permiso FOREIGN KEY (id_permiso) REFERENCES permisos(id_permiso) ON DELETE CASCADE
);

-- =============================================================================
-- 4. TABLA: usuarios
-- =============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario BIGSERIAL PRIMARY KEY,
    id_rol INT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),
    ultimo_login TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT
);

-- =============================================================================
-- 5. TABLA: pacientes
-- =============================================================================
CREATE TABLE IF NOT EXISTS pacientes (
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
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_pacientes_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- =============================================================================
-- 6. TABLA: contactos_emergencia
-- =============================================================================
CREATE TABLE IF NOT EXISTS contactos_emergencia (
    id_contacto BIGSERIAL PRIMARY KEY,
    id_paciente BIGINT NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    parentesco VARCHAR(40) NOT NULL,
    telefono VARCHAR(25) NOT NULL,
    direccion VARCHAR(200),
    CONSTRAINT fk_contactos_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- =============================================================================
-- 7. TABLA: historias_clinicas
-- =============================================================================
CREATE TABLE IF NOT EXISTS historias_clinicas (
    id_historia_clinica BIGSERIAL PRIMARY KEY,
    id_paciente BIGINT NOT NULL UNIQUE,
    numero_expediente VARCHAR(30) NOT NULL UNIQUE,
    tipo_sangre VARCHAR(5),
    alergias_medicamentos TEXT,
    enfermedades_hereditarias TEXT,
    antecedentes_patologicos TEXT,
    antecedentes_quirurgicos TEXT,
    fecha_apertura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_historias_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- =============================================================================
-- 8. TABLA: especialidades
-- =============================================================================
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

-- =============================================================================
-- 9. TABLA: medicos
-- =============================================================================
CREATE TABLE IF NOT EXISTS medicos (
    id_medico BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE,
    numero_registro_profesional VARCHAR(40) NOT NULL UNIQUE,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    telefono VARCHAR(25) NOT NULL,
    email VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_medicos_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- =============================================================================
-- 10. TABLA: medico_especialidades (N:M)
-- =============================================================================
CREATE TABLE IF NOT EXISTS medico_especialidades (
    id_medico BIGINT NOT NULL,
    id_especialidad INT NOT NULL,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_medico, id_especialidad),
    CONSTRAINT fk_medico_especialidades_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE,
    CONSTRAINT fk_medico_especialidades_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad) ON DELETE CASCADE
);

-- =============================================================================
-- 11. TABLA: turnos_medicos
-- =============================================================================
CREATE TABLE IF NOT EXISTS turnos_medicos (
    id_turno BIGSERIAL PRIMARY KEY,
    id_medico BIGINT NOT NULL,
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1: Lunes .. 7: Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_bloque_min INT NOT NULL DEFAULT 15,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
    CONSTRAINT fk_turnos_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE,
    CONSTRAINT chk_turno_horas CHECK (hora_inicio < hora_fin)
);

-- =============================================================================
-- 12. TABLA: bloqueos_agenda
-- =============================================================================
CREATE TABLE IF NOT EXISTS bloqueos_agenda (
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
    CONSTRAINT fk_bloqueos_creador FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- =============================================================================
-- 13. TABLA: citas
-- =============================================================================
CREATE TABLE IF NOT EXISTS citas (
    id_cita BIGSERIAL PRIMARY KEY,
    codigo_cita VARCHAR(30) NOT NULL UNIQUE,
    id_paciente BIGINT NOT NULL,
    id_medico BIGINT NOT NULL,
    id_especialidad INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo_consulta VARCHAR(255) NOT NULL,
    estado_cita VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADA' 
        CHECK (estado_cita IN ('PROGRAMADA', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA', 'INASISTENCIA')),
    creado_por BIGINT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_citas_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_creador FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT chk_cita_horas CHECK (hora_inicio < hora_fin)
);

-- Índices clave para búsquedas de agenda y citas concurrentes
CREATE INDEX IF NOT EXISTS idx_citas_medico_fecha_hora ON citas (id_medico, fecha_cita, hora_inicio);
CREATE INDEX IF NOT EXISTS idx_citas_paciente_fecha ON citas (id_paciente, fecha_cita);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas (estado_cita);

-- =============================================================================
-- 14. TABLA: reservas
-- =============================================================================
CREATE TABLE IF NOT EXISTS reservas (
    id_reserva BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL UNIQUE,
    id_paciente BIGINT NOT NULL,
    token_reserva VARCHAR(100) NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
    estado_reserva VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_reserva IN ('PENDIENTE', 'CONFIRMADA', 'EXPIRADA')),
    CONSTRAINT fk_reservas_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE,
    CONSTRAINT fk_reservas_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- =============================================================================
-- 15. TABLA: atenciones_medicas
-- =============================================================================
CREATE TABLE IF NOT EXISTS atenciones_medicas (
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

-- =============================================================================
-- 16. TABLA: historial_reprogramaciones
-- =============================================================================
CREATE TABLE IF NOT EXISTS historial_reprogramaciones (
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
    CONSTRAINT fk_reprog_medico_new FOREIGN KEY (id_medico_nuevo) REFERENCES medicos(id_medico) ON DELETE RESTRICT,
    CONSTRAINT fk_reprog_responsable FOREIGN KEY (id_usuario_responsable) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- =============================================================================
-- 17. TABLA: cancelaciones_citas
-- =============================================================================
CREATE TABLE IF NOT EXISTS cancelaciones_citas (
    id_cancelacion BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL UNIQUE,
    motivo_cancelacion TEXT NOT NULL,
    id_usuario_responsable BIGINT NOT NULL,
    fecha_cancelacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_canc_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE,
    CONSTRAINT fk_canc_responsable FOREIGN KEY (id_usuario_responsable) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- =============================================================================
-- 18. TABLA: laboratorios_estudios
-- =============================================================================
CREATE TABLE IF NOT EXISTS laboratorios_estudios (
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

-- =============================================================================
-- 19. TABLA: recordatorios
-- =============================================================================
CREATE TABLE IF NOT EXISTS recordatorios (
    id_recordatorio BIGSERIAL PRIMARY KEY,
    id_cita BIGINT NOT NULL,
    tipo_canal VARCHAR(20) NOT NULL CHECK (tipo_canal IN ('EMAIL', 'SMS', 'WHATSAPP')),
    fecha_programada TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    estado_envio VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_envio IN ('PENDIENTE', 'ENVIADO', 'FALLIDO')),
    intentos INT NOT NULL DEFAULT 0,
    mensaje TEXT NOT NULL,
    CONSTRAINT fk_recordatorios_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
);

-- =============================================================================
-- 20. TABLA: bitacora_auditoria
-- =============================================================================
CREATE TABLE IF NOT EXISTS bitacora_auditoria (
    id_bitacora BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT,
    modulo VARCHAR(50) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro_afectado BIGINT NOT NULL,
    operacion VARCHAR(30) NOT NULL CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'CAMBIO_ESTADO')),
    valores_anteriores JSONB,
    valores_nuevos JSONB,
    direccion_ip VARCHAR(45),
    user_agent TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_bitacora_tabla_reg ON bitacora_auditoria (tabla_afectada, id_registro_afectado);
CREATE INDEX IF NOT EXISTS idx_bitacora_fecha ON bitacora_auditoria (fecha_creacion);

-- =============================================================================
-- DATOS INICIALES SEMILLA (SEED DATA BÁSICO)
-- =============================================================================
INSERT INTO roles (nombre_rol, descripcion, activo) VALUES
('ADMINISTRADOR', 'Acceso total y configuración del sistema', TRUE),
('RECEPCIONISTA', 'Gestión de pacientes, turnos y control de asistencia', TRUE),
('MEDICO', 'Consulta de agenda, historial y atención médica', TRUE),
('PACIENTE', 'Consulta de médicos, reserva y visualización de resultados', TRUE)
ON CONFLICT (nombre_rol) DO NOTHING;

INSERT INTO especialidades (nombre, descripcion, estado) VALUES
('Medicina General', 'Atención médica primaria integral para adultos y familias', 'ACTIVO'),
('Pediatría', 'Atención integral de salud para niños y adolescentes', 'ACTIVO'),
('Geriatría', 'Atención médica integral especializada en adultos mayores', 'ACTIVO'),
('Ginecología', 'Salud del sistema reproductor femenino y obstetricia', 'ACTIVO'),
('Cardiología', 'Diagnóstico y tratamiento de enfermedades del corazón', 'ACTIVO'),
('Odontología', 'Salud bucal, prevención y tratamientos odontológicos', 'ACTIVO'),
('Traumatología', 'Tratamiento de lesiones del aparato locomotor y huesos', 'ACTIVO'),
('Oftalmología', 'Salud visual y patologías oculares', 'ACTIVO')
ON CONFLICT (nombre) DO NOTHING;
