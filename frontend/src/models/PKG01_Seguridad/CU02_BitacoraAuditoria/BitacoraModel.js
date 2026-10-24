/**
 * Modelo de datos y configuraciones para CU02 - Bitácora de Auditoría
 * Clínica Vida Salud (Hora Boliviana: America/La_Paz)
 */

export const MODULOS_AUDITORIA = [
  { id: 'TODOS', value: 'TODOS', label: 'Todos los Módulos' },
  { id: 'SEGURIDAD', value: 'SEGURIDAD', label: 'Seguridad y Acceso' },
  { id: 'PACIENTES', value: 'PACIENTES', label: 'Pacientes y Filiación' },
  { id: 'MEDICOS', value: 'MEDICOS', label: 'Cuerpo Médico' },
  { id: 'HORARIOS', value: 'HORARIOS', label: 'Turnos y Horarios' },
  { id: 'CITAS', value: 'CITAS', label: 'Gestión de Citas' },
  { id: 'HISTORIAS_CLINICAS', value: 'HISTORIAS_CLINICAS', label: 'Historias Clínicas' },
  { id: 'LABORATORIOS', value: 'LABORATORIOS', label: 'Laboratorios y Estudios' },
];

export const OPERACIONES_AUDITORIA = [
  { id: 'TODOS', value: 'TODOS', label: 'Todas las Operaciones' },
  { id: 'INSERT', value: 'INSERT', label: 'Inserción (INSERT)' },
  { id: 'UPDATE', value: 'UPDATE', label: 'Modificación (UPDATE)' },
  { id: 'DELETE', value: 'DELETE', label: 'Eliminación (DELETE)' },
  { id: 'LOGIN', value: 'LOGIN', label: 'Inicio de Sesión (LOGIN)' },
  { id: 'LOGOUT', value: 'LOGOUT', label: 'Cierre de Sesión (LOGOUT)' },
  { id: 'CAMBIO_ESTADO', value: 'CAMBIO_ESTADO', label: 'Cambio de Estado' },
  { id: 'LOGIN_FALLIDO', value: 'LOGIN_FALLIDO', label: 'Alerta / Intento Fallido' },
];

export const getOperacionBadgeStyle = (operacion) => {
  switch (operacion) {
    case 'INSERT':
      return {
        bg: '#ecfdf5',
        text: '#059669',
        color: '#059669',
        border: '1px solid #a7f3d0',
        label: 'INSERT',
      };
    case 'UPDATE':
      return {
        bg: '#f0f9ff',
        text: '#0284c7',
        color: '#0284c7',
        border: '1px solid #bae6fd',
        label: 'UPDATE',
      };
    case 'DELETE':
      return {
        bg: '#fef2f2',
        text: '#dc2626',
        color: '#dc2626',
        border: '1px solid #fecaca',
        label: 'DELETE',
      };
    case 'LOGIN':
      return {
        bg: '#f5f3ff',
        text: '#7c3aed',
        color: '#7c3aed',
        border: '1px solid #ddd6fe',
        label: 'LOGIN',
      };
    case 'LOGOUT':
      return {
        bg: '#f1f5f9',
        text: '#475569',
        color: '#475569',
        border: '1px solid #cbd5e1',
        label: 'LOGOUT',
      };
    case 'CAMBIO_ESTADO':
      return {
        bg: '#fffbeb',
        text: '#d97706',
        color: '#d97706',
        border: '1px solid #fde68a',
        label: 'CAMBIO ESTADO',
      };
    case 'LOGIN_FALLIDO':
      return {
        bg: '#fef2f2',
        text: '#b91c1c',
        color: '#b91c1c',
        border: '1px solid #fca5a5',
        label: 'ALERTA / FALLO',
      };
    default:
      return {
        bg: '#f8fafc',
        text: '#475569',
        color: '#475569',
        border: '1px solid #e2e8f0',
        label: operacion,
      };
  }
};
