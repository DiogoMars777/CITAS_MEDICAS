/**
 * Model y constantes para CU10 - Reservar cita médica con control de concurrencia
 * Actor(es): Paciente, Recepcionista
 */

export const ESTADOS_CITA = {
  PROGRAMADA: {
    key: 'PROGRAMADA',
    label: 'Programada',
    color: '#0284c7',
    bg: '#e0f2fe',
    border: '#bae6fd',
    text: '#0369a1',
  },
  CONFIRMADA: {
    key: 'CONFIRMADA',
    label: 'Confirmada (En sala)',
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#bbf7d0',
    text: '#15803d',
  },
  ATENDIDA: {
    key: 'ATENDIDA',
    label: 'Atendida',
    color: '#0284c7',
    bg: '#e0f2fe',
    border: '#bae6fd',
    text: '#026aa2',
  },
  CANCELADA: {
    key: 'CANCELADA',
    label: 'Cancelada',
    color: '#dc2626',
    bg: '#fee2e2',
    border: '#fecaca',
    text: '#b91c1c',
  },
  INASISTENCIA: {
    key: 'INASISTENCIA',
    label: 'Inasistencia',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
    text: '#92400e',
  },
};

export const getNextWorkingDate = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  const hour = now.getHours();

  const target = new Date(now);

  if (dayOfWeek === 5 && hour >= 17) {
    target.setDate(target.getDate() + 3);
  } else if (dayOfWeek === 6) {
    target.setDate(target.getDate() + 2);
  } else if (dayOfWeek === 0) {
    target.setDate(target.getDate() + 1);
  } else if (hour >= 18) {
    target.setDate(target.getDate() + 1);
  }

  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getInitialReservaFormState = () => ({
  id_paciente: '',
  id_especialidad: '',
  id_medico: '',
  fecha_cita: getNextWorkingDate(),
  hora_inicio: '08:00',
  hora_fin: '08:15',
  motivo_consulta: '',
});
