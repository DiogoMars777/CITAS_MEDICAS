/**
 * Modelo y Constantes para CU05 - Gestión de Médicos y Asignación de Especialidades
 * Paleta tranquila, sobria y profesional (2026)
 */

export const ESTADOS_MEDICO = {
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

export const getInitialMedicoFormState = () => ({
  nombres: '',
  apellidos: '',
  numero_registro_profesional: '',
  telefono: '',
  email: '',
  fecha_ingreso: new Date().toISOString().split('T')[0],
  estado: 'ACTIVO',
  crear_usuario: false,
  id_usuario: '',
  username: '',
  password: '',
  especialidades: [], // Array de { id_especialidad, es_principal }
});
