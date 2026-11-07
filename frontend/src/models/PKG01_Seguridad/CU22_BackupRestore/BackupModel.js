/**
 * Modelo de datos para PKG01_Seguridad - CU22_BackupRestore
 * Clínica Vida Salud
 */

export const TIPOS_BACKUP = {
  COMPLETO: 'COMPLETO',
  SOLO_DATOS: 'SOLO_DATOS',
  SOLO_ESTRUCTURA: 'SOLO_ESTRUCTURA',
};

export const TIPOS_DISPARO = {
  MANUAL: 'MANUAL',
  PROGRAMADO: 'PROGRAMADO',
};

export const ESTADOS_BACKUP = {
  COMPLETADO: 'COMPLETADO',
  EN_PROCESO: 'EN_PROCESO',
  FALLIDO: 'FALLIDO',
  RESTAURADO: 'RESTAURADO',
};

export const FRECUENCIAS_PROGRAMACION = {
  DIARIO: {
    id: 'DIARIO',
    label: 'Diario (Todos los días)',
    descripcion: 'Se ejecutará cada día automáticamente a la hora seleccionada.',
  },
  SEMANAL: {
    id: 'SEMANAL',
    label: 'Semanal (Un día a la semana)',
    descripcion: 'Se ejecutará una vez por semana en el día fijado (ej. Domingos o Lunes).',
  },
  MENSUAL: {
    id: 'MENSUAL',
    label: 'Mensual (Un día al mes)',
    descripcion: 'Se ejecutará el día del mes seleccionado (ej. día 1 de cada mes).',
  },
};

export const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' },
];

export const initialBackupModel = {
  id_backup: null,
  nombre_archivo: '',
  tipo_backup: TIPOS_BACKUP.COMPLETO,
  tipo_disparo: TIPOS_DISPARO.MANUAL,
  tamano_bytes: 0,
  tamano_formateado: '0 KB',
  estado: ESTADOS_BACKUP.COMPLETADO,
  checksum_sha256: '',
  detalles: {},
  creado_por_nombre: '',
  fecha_creacion: null,
  fecha_restauracion: null,
};

export const initialConfiguracionModel = {
  id_configuracion: 1,
  habilitado: true,
  frecuencia: 'DIARIO',
  dia_semana: 1,
  dia_mes: 1,
  hora_ejecucion: '02:00',
  tipo_backup: TIPOS_BACKUP.COMPLETO,
  retencion_dias: 30,
  limite_archivos: 10,
  email_notificacion: 'admin@clinicavidasalud.com',
  ultimo_respaldo_at: null,
  proximo_respaldo_at: null,
  estado_ultimo_respaldo: 'NINGUNO',
  mensaje_ultimo_respaldo: '',
  actualizado_por_nom: 'Admin',
  hora_servidor_bolivia: '',
};

export default initialBackupModel;
