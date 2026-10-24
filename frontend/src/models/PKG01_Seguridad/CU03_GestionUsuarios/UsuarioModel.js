/**
 * Modelo de Datos y Constantes para CU03 - Gestión de Usuarios, Roles y Permisos
 * Paleta tranquila, profesional y descansada
 */

export const ESTADOS_USUARIO = {
  ACTIVO: {
    label: 'Activo',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.1)',
    border: 'rgba(52, 211, 153, 0.25)',
  },
  INACTIVO: {
    label: 'Inactivo',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.1)',
    border: 'rgba(148, 163, 184, 0.2)',
  },
  BLOQUEADO: {
    label: 'Bloqueado',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.1)',
    border: 'rgba(248, 113, 113, 0.25)',
  },
};

export const ROLES_BADGES = {
  ADMINISTRADOR: {
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.25)',
  },
  MEDICO: {
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.1)',
    border: 'rgba(96, 165, 250, 0.25)',
  },
  RECEPCIONISTA: {
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.1)',
    border: 'rgba(167, 139, 250, 0.25)',
  },
  PACIENTE: {
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.1)',
    border: 'rgba(74, 222, 128, 0.25)',
  },
};

export const MODULOS_ICONOS = {
  SEGURIDAD: 'Shield',
  MEDICOS: 'Stethoscope',
  PACIENTES: 'Users',
  AGENDAS: 'Calendar',
  CITAS: 'ClipboardList',
  CONSULTAS: 'Activity',
  LABORATORIOS: 'FlaskConical',
  REPORTES: 'BarChart3',
};

export const initialUserFormState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  id_rol: 2,
  estado: 'ACTIVO',
};
