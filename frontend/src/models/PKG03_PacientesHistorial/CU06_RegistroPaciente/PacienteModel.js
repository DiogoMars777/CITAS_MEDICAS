/**
 * Modelo y Constantes para CU06 - Registro de Pacientes y Apertura en Primera Visita
 * Arquitectura MVC Clínica Vida Salud (2026)
 */

export const ESTADOS_PACIENTE = {
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

export const TIPOS_SANGRE = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const PARENTESCOS = [
  'Madre',
  'Padre',
  'Cónyuge',
  'Hijo/a',
  'Hermano/a',
  'Tutor/a Legal',
  'Familiar',
  'Amigo/a',
];

export const getInitialPacienteFormState = () => ({
  ci: '',
  nombres: '',
  apellidos: '',
  fecha_nacimiento: '',
  sexo: 'MASCULINO',
  telefono: '',
  email: '',
  direccion: '',
  primera_visita: true,
  estado: 'ACTIVO',

  // Cuenta digital
  crear_usuario: false,
  username: '',
  password: '',

  // Contacto de emergencia
  contacto_nombre: '',
  contacto_parentesco: 'Familiar',
  contacto_telefono: '',
  contacto_direccion: '',

  // Expediente / Historia Clínica
  aperturar_expediente: true,
  tipo_sangre: 'O+',
  alergias_medicamentos: '',
  antecedentes_patologicos: '',
  antecedentes_quirurgicos: '',
  enfermedades_hereditarias: '',
});
