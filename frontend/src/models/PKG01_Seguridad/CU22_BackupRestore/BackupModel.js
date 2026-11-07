/**
 * Modelo de datos para PKG01_Seguridad - CU22_BackupRestore
 */

export const TIPOS_BACKUP = {
  COMPLETO: 'COMPLETO',
  SOLO_DATOS: 'SOLO_DATOS',
  SOLO_ESTRUCTURA: 'SOLO_ESTRUCTURA',
};

export const ESTADOS_BACKUP = {
  COMPLETADO: 'COMPLETADO',
  EN_PROCESO: 'EN_PROCESO',
  FALLIDO: 'FALLIDO',
  RESTAURADO: 'RESTAURADO',
};

export const initialBackupModel = {
  id_backup: null,
  nombre_archivo: '',
  tipo_backup: TIPOS_BACKUP.COMPLETO,
  tamano_bytes: 0,
  tamano_formateado: '0 KB',
  estado: ESTADOS_BACKUP.COMPLETADO,
  checksum_sha256: '',
  detalles: {},
  creado_por_nombre: '',
  fecha_creacion: null,
  fecha_restauracion: null,
};

export default initialBackupModel;
