/**
 * Modelo de datos para PKG08_DashboardReportes - CU21_Reportes
 * Representa los tipos de informes estadísticos, filtros y estructuras de datos
 */

export const TIPOS_REPORTE = {
  PRODUCTIVIDAD: 'PRODUCTIVIDAD',
  MORBILIDAD: 'MORBILIDAD',
  LABORATORIOS: 'LABORATORIOS',
  CANCELACIONES: 'CANCELACIONES',
};

export const PERIODOS_REPORTE = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'esta_semana', label: 'Esta Semana' },
  { id: 'este_mes', label: 'Este Mes' },
  { id: 'trimestre', label: 'Último Trimestre' },
  { id: 'anio', label: 'Año en Curso' },
  { id: 'personalizado', label: 'Personalizado' },
];

export const initialFiltrosReporte = {
  periodo: 'este_mes',
  fecha_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  fecha_fin: new Date().toISOString().split('T')[0],
  id_medico: 'todos',
  id_especialidad: 'todas',
};

export const initialReporteModel = {
  tipo: TIPOS_REPORTE.PRODUCTIVIDAD,
  filtros: initialFiltrosReporte,
  resumen_kpi: {},
  filas: [],
  fecha_emision: new Date().toISOString(),
};

export default initialReporteModel;
