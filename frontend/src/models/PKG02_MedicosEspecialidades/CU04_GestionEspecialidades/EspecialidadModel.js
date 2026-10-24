/**
 * Modelo y Constantes para CU04 - Gestión de Especialidades Médicas
 * Paleta tranquila, sobria y profesional
 */

export const ESTADOS_ESPECIALIDAD = {
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

export const ESPECIALIDADES_SUGERIDAS = [
  'Dermatología',
  'Neurología',
  'Urología',
  'Neumología',
  'Endocrinología',
  'Reumatología',
  'Otorrinolaringología',
  'Psiquiatría',
];

export const initialEspecialidadFormState = {
  nombre: '',
  descripcion: '',
  estado: 'ACTIVO',
};
