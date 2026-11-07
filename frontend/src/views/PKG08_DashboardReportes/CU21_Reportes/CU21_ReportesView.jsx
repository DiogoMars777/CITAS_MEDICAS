import React from 'react';
import {
  FileText,
  Download,
  Printer,
  RefreshCw,
  Calendar,
  Filter,
  Users,
  UserCheck,
  UserX,
  Clock,
  Activity,
  BarChart2,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import useCU21ReportesController from '../../../controllers/PKG08_DashboardReportes/CU21_Reportes/CU21_ReportesController';

export const CU21_ReportesView = () => {
  const {
    reporteActivo,
    setReporteActivo,
    loading,
    error,
    meta,
    periodo,
    setPeriodo,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    idMedico,
    setIdMedico,
    idEspecialidad,
    setIdEspecialidad,
    datosProductividad,
    datosMorbilidad,
    datosLaboratorios,
    datosCancelaciones,
    recargar,
    exportarCSV,
    modalImpresionAbierto,
    setModalImpresionAbierto,
    abrirVistaImpresion,
  } = useCU21ReportesController();

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. HEADER EJECUTIVO
      ========================================================================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Reportes Clínicos y Estadísticos
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  CU21 • Nivel Senior
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Módulo de inteligencia clínica, productividad médica, epidemiología y calidad asistencial.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones principales de exportación */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={recargar}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refrescar datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={exportarCSV}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
            title="Descargar tabla actual en formato CSV para Microsoft Excel"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Excel / CSV</span>
          </button>

          <button
            onClick={abrirVistaImpresion}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            title="Generar vista imprimible o PDF formal con membrete"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF Formal</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. BARRA DE FILTROS PARAMÉTRICOS
      ========================================================================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Pills de Período Rápido */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Período:
            </span>
            {(meta.periodos || []).map((p) => {
              const active = periodo === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPeriodo(p.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {p.nombre}
                </button>
              );
            })}
          </div>

          {/* Filtros Selectivos de Catálogo */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Especialidad */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Especialidad:</span>
              <select
                value={idEspecialidad}
                onChange={(e) => setIdEspecialidad(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todas">Todas las Especialidades</option>
                {(meta.especialidades || []).map((esp) => (
                  <option key={esp.id_especialidad} value={esp.id_especialidad}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Médico */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Médico:</span>
              <select
                value={idMedico}
                onChange={(e) => setIdMedico(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todos">Todos los Médicos</option>
                {(meta.medicos || []).map((m) => (
                  <option key={m.id_medico} value={m.id_medico}>
                    {m.nombre_completo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rango de fechas manual si está en 'personalizado' */}
        {periodo === 'personalizado' && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs bg-indigo-50/50 p-3 rounded-lg border">
            <span className="font-semibold text-indigo-900">Rango Manual:</span>
            <div className="flex items-center gap-2">
              <label className="text-slate-600">Desde:</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="px-2 py-1 rounded border border-slate-300 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-600">Hasta:</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="px-2 py-1 rounded border border-slate-300 bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          3. PESTAÑAS DE NAVEGACIÓN TEMÁTICA
      ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setReporteActivo('PRODUCTIVIDAD')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            reporteActivo === 'PRODUCTIVIDAD'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>1. Productividad Médica</span>
        </button>

        <button
          onClick={() => setReporteActivo('MORBILIDAD')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            reporteActivo === 'MORBILIDAD'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>2. Morbilidad y CIE-10</span>
        </button>

        <button
          onClick={() => setReporteActivo('LABORATORIOS')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            reporteActivo === 'LABORATORIOS'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>3. Laboratorios y Gabinetes</span>
        </button>

        <button
          onClick={() => setReporteActivo('CANCELACIONES')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            reporteActivo === 'CANCELACIONES'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>4. Inasistencias y Pérdidas</span>
        </button>
      </div>

      {/* Manejo de Error Global */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={recargar}
            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded text-xs transition"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* =========================================================================
          4. CONTENIDO DEL REPORTE SELECCIONADO
      ========================================================================= */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Calculando indicadores y consolidando datos...</p>
          <p className="text-xs text-slate-400 mt-1">Procesando agregaciones estadísticas en tiempo real.</p>
        </div>
      ) : (
        <>
          {/* TAB 1: PRODUCTIVIDAD MÉDICA */}
          {reporteActivo === 'PRODUCTIVIDAD' && (
            <div className="space-y-6">
              {/* Tarjetas KPI de Resumen */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Citas</span>
                  <div className="text-2xl font-extrabold text-slate-800 mt-1">
                    {datosProductividad?.resumen_kpi?.total_citas || 0}
                  </div>
                  <span className="text-[11px] text-slate-500">Agendadas en período</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Atendidas</span>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {datosProductividad?.resumen_kpi?.total_atendidas || 0}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">Evolución completada</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Efectividad</span>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1">
                    {datosProductividad?.resumen_kpi?.tasa_global_efectividad || 0}%
                  </div>
                  <span className="text-[11px] text-amber-600 font-medium">Cumplimiento global</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Inasistencias</span>
                  <div className="text-2xl font-extrabold text-red-700 mt-1">
                    {datosProductividad?.resumen_kpi?.total_inasistencias || 0}
                  </div>
                  <span className="text-[11px] text-red-600 font-medium">Paciente ausente</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Canceladas</span>
                  <div className="text-2xl font-extrabold text-slate-700 mt-1">
                    {datosProductividad?.resumen_kpi?.total_canceladas || 0}
                  </div>
                  <span className="text-[11px] text-slate-500">Anuladas con motivo</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Médicos Activos</span>
                  <div className="text-2xl font-extrabold text-indigo-700 mt-1">
                    {datosProductividad?.resumen_kpi?.total_medicos_activos || 0}
                  </div>
                  <span className="text-[11px] text-indigo-600 font-medium">En plantilla</span>
                </div>
              </div>

              {/* Tabla de Productividad */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                    Detalle de Desempeño por Profesional y Especialidad
                  </h3>
                  <span className="text-xs text-slate-400">
                    Rango: {datosProductividad?.rango_fechas?.inicio} al {datosProductividad?.rango_fechas?.fin}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Médico</th>
                        <th className="py-3 px-4">Especialidad</th>
                        <th className="py-3 px-4 text-center">Total Citas</th>
                        <th className="py-3 px-4 text-center text-emerald-700">Atendidas</th>
                        <th className="py-3 px-4 text-center text-amber-700">Pendientes</th>
                        <th className="py-3 px-4 text-center text-red-700">Inasistencias</th>
                        <th className="py-3 px-4 text-center text-slate-600">Canceladas</th>
                        <th className="py-3 px-4 text-right">Efectividad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(datosProductividad?.filas || []).length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                            No se encontraron registros de citas en el rango seleccionado.
                          </td>
                        </tr>
                      ) : (
                        datosProductividad.filas.map((f) => (
                          <tr key={f.id_medico} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-bold text-slate-900">{f.medico}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {f.especialidad}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-bold">{f.total_citas}</td>
                            <td className="py-3 px-4 text-center font-semibold text-emerald-700 bg-emerald-50/30">
                              {f.atendidas}
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-amber-700">
                              {f.pendientes}
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-red-700">
                              {f.inasistencias}
                            </td>
                            <td className="py-3 px-4 text-center text-slate-500">
                              {f.canceladas}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      f.tasa_efectividad >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${Math.min(100, f.tasa_efectividad)}%` }}
                                  />
                                </div>
                                <span className="font-extrabold text-slate-900">{f.tasa_efectividad}%</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MORBILIDAD Y CIE-10 */}
          {reporteActivo === 'MORBILIDAD' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Diagnósticos (2 columnas) */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-indigo-600" />
                      Patologías y Diagnósticos Clínicos más Frecuentes (CIE-10)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Total de atenciones registradas: <span className="font-bold text-slate-700">{datosMorbilidad?.total_atenciones || 0}</span>
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">CIE-10</th>
                        <th className="py-3 px-4">Diagnóstico Clínico</th>
                        <th className="py-3 px-4 text-center">Casos</th>
                        <th className="py-3 px-4 text-center">Masc / Fem</th>
                        <th className="py-3 px-4 text-right">% Relativo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(datosMorbilidad?.top_diagnosticos || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                            No hay atenciones médicas con diagnóstico en el período.
                          </td>
                        </tr>
                      ) : (
                        datosMorbilidad.top_diagnosticos.map((d, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                              {d.codigo_cie10}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              {d.diagnostico}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-slate-800">
                              {d.total_casos}
                            </td>
                            <td className="py-3 px-4 text-center text-slate-500 font-medium">
                              <span className="text-blue-600 font-semibold">{d.casos_masculinos}M</span> /{' '}
                              <span className="text-pink-600 font-semibold">{d.casos_femeninos}F</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-14 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-600 rounded-full"
                                    style={{ width: `${Math.min(100, d.porcentaje)}%` }}
                                  />
                                </div>
                                <span className="font-extrabold text-slate-900">{d.porcentaje}%</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Distribución por Grupos de Edad (1 columna) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Perfil Demográfico de Pacientes
                </h3>
                <p className="text-xs text-slate-500">
                  Distribución de consultas por grupos etarios en el intervalo de fechas.
                </p>

                <div className="space-y-3 pt-2">
                  {(datosMorbilidad?.distribucion_edad || []).map((e, idx) => {
                    const totalAt = datosMorbilidad?.total_atenciones || 1;
                    const pct = totalAt > 0 ? Math.round((e.total / totalAt) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">{e.grupo}</span>
                          <span className="font-bold text-slate-900">
                            {e.total} <span className="text-slate-400 font-normal">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LABORATORIOS Y GABINETES */}
          {reporteActivo === 'LABORATORIOS' && (
            <div className="space-y-6">
              {/* KPIs de laboratorio */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Estudios</span>
                  <div className="text-2xl font-extrabold text-slate-800 mt-1">
                    {datosLaboratorios?.kpis?.total || 0}
                  </div>
                  <span className="text-[11px] text-slate-500">Solicitados</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Publicados</span>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {datosLaboratorios?.kpis?.publicados || 0}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">Con resultado listo</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pendientes</span>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1">
                    {datosLaboratorios?.kpis?.pendientes || 0}
                  </div>
                  <span className="text-[11px] text-amber-600 font-medium">Por procesar</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">En Proceso</span>
                  <div className="text-2xl font-extrabold text-blue-700 mt-1">
                    {datosLaboratorios?.kpis?.en_proceso || 0}
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium">En análisis técnico</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Cumplimiento</span>
                  <div className="text-2xl font-extrabold text-indigo-700 mt-1">
                    {datosLaboratorios?.kpis?.tasa_cumplimiento || 0}%
                  </div>
                  <span className="text-[11px] text-indigo-600 font-medium">Tasa de entrega</span>
                </div>
              </div>

              {/* Listado de Estudios */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-indigo-600" />
                    Estudios y Exámenes Paraclínicos Solicitados
                  </h3>
                  <span className="text-xs text-slate-400">Últimos registros auditados</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Estudio</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">Paciente</th>
                        <th className="py-3 px-4">Médico Solicitante</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(datosLaboratorios?.estudios || []).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                            No se encontraron órdenes de laboratorio en el intervalo.
                          </td>
                        </tr>
                      ) : (
                        datosLaboratorios.estudios.map((est) => (
                          <tr key={est.id_estudio} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">{est.codigo_estudio}</td>
                            <td className="py-3 px-4 font-semibold text-slate-900">{est.nombre_estudio}</td>
                            <td className="py-3 px-4 text-slate-500">{est.tipo_estudio}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{est.paciente}</div>
                              <div className="text-[10px] text-slate-400">CI: {est.paciente_ci}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{est.medico_solicitante}</td>
                            <td className="py-3 px-4 text-slate-500">{est.fecha_solicitud?.split(' ')[0]}</td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  est.estado === 'PUBLICADO'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : est.estado === 'EN_PROCESO'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {est.estado}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CANCELACIONES E INASISTENCIAS */}
          {reporteActivo === 'CANCELACIONES' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Citas Perdidas</span>
                  <div className="text-2xl font-extrabold text-red-700 mt-1">
                    {datosCancelaciones?.total_perdidas || 0}
                  </div>
                  <span className="text-[11px] text-red-600 font-medium">Canceladas + No asistidas</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Cancelaciones Formales</span>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1">
                    {datosCancelaciones?.total_canceladas || 0}
                  </div>
                  <span className="text-[11px] text-slate-500">Notificadas con antelación</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Inasistencias Sin Aviso</span>
                  <div className="text-2xl font-extrabold text-slate-800 mt-1">
                    {datosCancelaciones?.total_inasistencias || 0}
                  </div>
                  <span className="text-[11px] text-slate-500">Deserción en horario de atención</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Bitácora de Citas No Concretadas y Motivos Registrados
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Fecha y Hora</th>
                        <th className="py-3 px-4">Paciente</th>
                        <th className="py-3 px-4">Médico</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4">Motivo de Cancelación / Ausencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(datosCancelaciones?.citas_afectadas || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                            Excelente: No se registran cancelaciones ni inasistencias en este intervalo.
                          </td>
                        </tr>
                      ) : (
                        datosCancelaciones.citas_afectadas.map((c) => (
                          <tr key={c.id_cita} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">{c.codigo_cita}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {c.fecha_cita} ({c.hora_inicio})
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">{c.paciente}</td>
                            <td className="py-3 px-4 text-slate-700">{c.medico}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.estado_cita === 'CANCELADA'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {c.estado_cita}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 italic">
                              {c.motivo_cancelacion}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          5. MODAL FORMAL DE IMPRESIÓN Y EXPORTACIÓN A PDF CON MEMBRETE
      ========================================================================= */}
      {modalImpresionAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Cabecera del Modal (No se imprime) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm">Vista Previa de Informe Formal (Listo para Imprimir / PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Documento</span>
                </button>
                <button
                  onClick={() => setModalImpresionAbierto(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Hoja Formal Imprimible */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0">
              {/* Membrete Oficial */}
              <div className="border-b-2 border-indigo-900 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-indigo-950 uppercase tracking-wide">
                    Clínica Vida Salud S.R.L.
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Departamento de Estadística Médica, Calidad Asistencial y Auditoría
                  </p>
                  <p className="text-[11px] text-slate-400">
                    NIT: 1028472024 • Av. Las Américas #450 • Santa Cruz de la Sierra, Bolivia
                  </p>
                </div>
                <div className="text-right text-xs space-y-0.5">
                  <div className="font-bold text-indigo-900">INFORME ESTADÍSTICO OFICIAL</div>
                  <div className="text-slate-500">Módulo: CU21 - {reporteActivo}</div>
                  <div className="text-slate-400 text-[10px]">
                    Fecha de emisión: {new Date().toLocaleString('es-BO')}
                  </div>
                </div>
              </div>

              {/* Parámetros del Reporte */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">Tipo de Reporte:</span>
                  <div className="font-bold text-slate-800">{reporteActivo}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Intervalo de Fechas:</span>
                  <div className="font-bold text-slate-800">{fechaInicio} al {fechaFin}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Especialidad:</span>
                  <div className="font-bold text-slate-800">{idEspecialidad === 'todas' ? 'Todas' : 'Filtrada'}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Responsable:</span>
                  <div className="font-bold text-slate-800">Dirección Médica / Auditoría</div>
                </div>
              </div>

              {/* Contenido según el reporte activo */}
              {reporteActivo === 'PRODUCTIVIDAD' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tabla Consolidada de Productividad Médica
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                      <tr>
                        <th className="p-2 text-left">Médico</th>
                        <th className="p-2 text-left">Especialidad</th>
                        <th className="p-2 text-center">Citas</th>
                        <th className="p-2 text-center">Atendidas</th>
                        <th className="p-2 text-center">Inasistencias</th>
                        <th className="p-2 text-center">Canceladas</th>
                        <th className="p-2 text-right">Efectividad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(datosProductividad?.filas || []).map((f) => (
                        <tr key={f.id_medico}>
                          <td className="p-2 font-medium">{f.medico}</td>
                          <td className="p-2">{f.especialidad}</td>
                          <td className="p-2 text-center font-bold">{f.total_citas}</td>
                          <td className="p-2 text-center">{f.atendidas}</td>
                          <td className="p-2 text-center">{f.inasistencias}</td>
                          <td className="p-2 text-center">{f.canceladas}</td>
                          <td className="p-2 text-right font-bold">{f.tasa_efectividad}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reporteActivo === 'MORBILIDAD' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Morbilidad y Frecuencia de Patologías (CIE-10)
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                      <tr>
                        <th className="p-2 text-left">CIE-10</th>
                        <th className="p-2 text-left">Diagnóstico Clínico</th>
                        <th className="p-2 text-center">Casos Totales</th>
                        <th className="p-2 text-center">Masc / Fem</th>
                        <th className="p-2 text-right">Porcentaje (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(datosMorbilidad?.top_diagnosticos || []).map((d, i) => (
                        <tr key={i}>
                          <td className="p-2 font-mono font-bold">{d.codigo_cie10}</td>
                          <td className="p-2">{d.diagnostico}</td>
                          <td className="p-2 text-center font-bold">{d.total_casos}</td>
                          <td className="p-2 text-center">{d.casos_masculinos}M / {d.casos_femeninos}F</td>
                          <td className="p-2 text-right font-bold">{d.porcentaje}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pie de Firma Institucional */}
              <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-800">Dra. Claudia Gutiérrez</div>
                  <div className="text-slate-500">Jefa de Auditoría y Calidad Médica</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-800">Dr. Roberto Fernández V.</div>
                  <div className="text-slate-500">Director Médico Asistencial</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CU21_ReportesView;
