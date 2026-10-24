/**
 * Modelo y Constantes para CU07 - Configuración de Agenda y Horarios Médicos (15 min)
 * Paleta tranquila, sobria y profesional (2026)
 */

export const ESTADOS_TURNO = {
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
};

export const DIAS_SEMANA_MAP = {
  1: { nombre: 'Lunes', corto: 'Lun', color: '#60a5fa' },
  2: { nombre: 'Martes', corto: 'Mar', color: '#60a5fa' },
  3: { nombre: 'Miércoles', corto: 'Mié', color: '#60a5fa' },
  4: { nombre: 'Jueves', corto: 'Jue', color: '#60a5fa' },
  5: { nombre: 'Viernes', corto: 'Vie', color: '#60a5fa' },
  6: { nombre: 'Sábado', corto: 'Sáb', color: '#f59e0b' },
  7: { nombre: 'Domingo', corto: 'Dom', color: '#f43f5e' },
};

export const getInitialTurnoFormState = () => ({
  id_medico: '',
  dias_semana: [1, 2, 3, 4, 5], // Lunes a Viernes por defecto
  hora_inicio: '08:00',
  hora_fin: '12:00',
  duracion_bloque_min: 15,
  estado: 'ACTIVO',
});

/**
 * Calcular cupos estimados en minutos
 */
export const calcularCuposEstimados = (horaInicio, horaFin, duracionMin = 15) => {
  if (!horaInicio || !horaFin || !duracionMin) return 0;

  const [hIni, mIni] = horaInicio.split(':').map(Number);
  const [hFin, mFin] = horaFin.split(':').map(Number);

  const minutosIni = hIni * 60 + mIni;
  const minutosFin = hFin * 60 + mFin;

  if (minutosFin <= minutosIni) return 0;
  return Math.floor((minutosFin - minutosIni) / duracionMin);
};
