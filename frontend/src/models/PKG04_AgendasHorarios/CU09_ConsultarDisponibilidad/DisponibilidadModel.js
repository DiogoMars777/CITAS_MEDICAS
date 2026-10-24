/**
 * Constantes y utilidades para CU09 - Consultar disponibilidad de horarios médicos
 */

export const ESTADOS_SLOT = {
  DISPONIBLE: {
    key: 'DISPONIBLE',
    label: 'Disponible',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    text: '#34d399',
  },
  OCUPADO: {
    key: 'OCUPADO',
    label: 'Cita Agendada',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    text: '#f87171',
  },
  BLOQUEADO: {
    key: 'BLOQUEADO',
    label: 'Bloqueado',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    text: '#fbbf24',
  },
  EXPIRADO: {
    key: 'EXPIRADO',
    label: 'Horario Pasado',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.1)',
    border: 'rgba(100, 116, 139, 0.2)',
    text: '#94a3b8',
  },
};

export const getInitialFiltrosDisponibilidad = () => {
  const hoy = new Date().toISOString().split('T')[0];
  return {
    fecha: hoy,
    id_especialidad: '',
    id_medico: '',
    turno_filtro: 'TODOS',
  };
};
