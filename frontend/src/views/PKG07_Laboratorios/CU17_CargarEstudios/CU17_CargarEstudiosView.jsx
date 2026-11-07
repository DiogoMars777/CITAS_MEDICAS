import React, { useState } from 'react';
import {
  FlaskConical,
  Search,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  FileCheck,
  Plus,
  RefreshCw,
  Eye,
  Filter,
  Activity,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import { useCU17CargaEstudioController } from '../../../controllers/PKG07_Laboratorios/CU17_CargarEstudios/CU17_CargaEstudioController';

export const CU17_CargarEstudiosView = ({ onNavigateToCU18 }) => {
  const {
    estudios,
    kpis,
    loading,
    guardando,
    error,
    mensajeExito,
    filtroEstado,
    setFiltroEstado,
    searchTerm,
    setSearchTerm,
    pacienteSeleccionado,
    buscandoPaciente,
    buscarPaciente,
    estudioSeleccionado,
    modalCargaAbierto,
    formResultado,
    setFormResultado,
    abrirModalCarga,
    cerrarModalCarga,
    guardarResultado,
    modalNuevaOrden,
    setModalNuevaOrden,
    formNuevaOrden,
    setFormNuevaOrden,
    crearOrden,
    cargarEstudios,
    limpiarMensajes,
  } = useCU17CargaEstudioController();

  const [inputBusquedaCI, setInputBusquedaCI] = useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    if (inputBusquedaCI.trim()) {
      buscarPaciente(inputBusquedaCI);
    }
  };

  return (
    <div style={{ padding: '0.5rem 1rem 3rem', maxWidth: '1440px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 1. CABECERA EJECUTIVA DEL CU17 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        background: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.25)',
          }}>
            <FlaskConical size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: '#0d9488',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}>
                CU17
              </span>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Cargar Estudios y Resultados de Laboratorio
              </h1>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Digitalización de analíticas clínicas, valores de referencia etarios y publicación en el expediente.
            </p>
          </div>
        </div>

        {/* ACCIONES SUPERIORES */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {onNavigateToCU18 && (
            <button
              type="button"
              onClick={onNavigateToCU18}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f766e',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Eye size={16} />
              Ir al Visor de Paciente (CU18)
            </button>
          )}

          <button
            type="button"
            onClick={() => setModalNuevaOrden(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              background: '#0d9488',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)',
            }}
          >
            <Plus size={16} />
            Nueva Orden de Estudio
          </button>
        </div>
      </div>

      {/* NOTIFICACIONES Y FEEDBACK */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          color: '#b91c1c',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={limpiarMensajes} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 800 }}>✕</button>
        </div>
      )}

      {mensajeExito && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          padding: '0.85rem 1.15rem',
          color: '#15803d',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.88rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={20} color="#16a34a" />
            <span style={{ fontWeight: 600 }}>{mensajeExito}</span>
          </div>
          <button onClick={limpiarMensajes} style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: 800 }}>✕</button>
        </div>
      )}

      {/* 2. TARJETAS DE INDICADORES (KPIS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlaskConical size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Estudios Registrados</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{kpis.total}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Pendientes / En Proceso</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{kpis.pendientes}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Completados / Habilitados</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>{kpis.completados}</div>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN DE CONSULTA RÁPIDA DE PACIENTE Y PARÁMETROS ETARIOS */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1.15rem',
        marginBottom: '1.25rem',
      }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} color="#0d9488" />
          Módulo de Consulta: Buscar Paciente por CI o Nombre (Parámetros Etarios)
        </h3>

        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Ingrese CI del paciente (ej. 87654321 o 65432109)..."
            value={inputBusquedaCI}
            onChange={(e) => setInputBusquedaCI(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
            }}
          />
          <button
            type="submit"
            disabled={buscandoPaciente}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#0d9488',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: buscandoPaciente ? 'not-allowed' : 'pointer',
            }}
          >
            {buscandoPaciente ? 'Consultando...' : 'Consultar Parámetros'}
          </button>
        </form>

        {pacienteSeleccionado && (
          <div style={{
            marginTop: '1rem',
            borderRadius: '10px',
            background: '#f0fdfa',
            border: '1px solid #99f6e4',
            padding: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f766e' }}>
                  {pacienteSeleccionado.nombre_completo}
                </span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                  CI: {pacienteSeleccionado.ci} | F. Nac: {pacienteSeleccionado.fecha_nacimiento}
                </span>
              </div>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                background: '#0d9488',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                Grupo Etario: {pacienteSeleccionado.grupo_etario} ({pacienteSeleccionado.edad} años)
              </span>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#0f766e', fontWeight: 700 }}>
              Rangos de Referencia Normales para {pacienteSeleccionado.grupo_etario}:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.4rem' }}>
              {Object.entries(pacienteSeleccionado.parametros_referencia || {}).map(([param, rango]) => (
                <div key={param} style={{ background: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #ccfbf1', fontSize: '0.72rem' }}>
                  <strong>{param}:</strong> {rango}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. LISTADO Y BANDEJA DE ESTUDIOS */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1.25rem',
      }}>
        {/* FILTROS Y BÚSQUEDA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Filtrar Estado:</span>
            {['TODOS', 'PENDIENTE', 'COMPLETADO'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFiltroEstado(st)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: filtroEstado === st ? '1px solid #0d9488' : '1px solid #e2e8f0',
                  background: filtroEstado === st ? '#0d9488' : '#f8fafc',
                  color: filtroEstado === st ? '#ffffff' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {st === 'TODOS' ? 'Todos' : st === 'PENDIENTE' ? 'Pendientes' : 'Completados'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Buscar por código, examen o paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.4rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                minWidth: '220px',
              }}
            />
            <button
              onClick={cargarEstudios}
              style={{
                padding: '0.4rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* TABLA DE ESTUDIOS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
            Cargando bandeja de laboratorio...
          </div>
        ) : estudios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
            No se encontraron estudios registrados con los criterios seleccionados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.6rem' }}>CÓDIGO</th>
                  <th style={{ padding: '0.6rem' }}>PACIENTE</th>
                  <th style={{ padding: '0.6rem' }}>EDAD / GRUPO</th>
                  <th style={{ padding: '0.6rem' }}>ESTUDIO MÉDICO</th>
                  <th style={{ padding: '0.6rem' }}>FECHA SOLICITUD</th>
                  <th style={{ padding: '0.6rem' }}>ESTADO</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {estudios.map((est) => (
                  <tr key={est.id_estudio} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem', fontFamily: 'monospace', fontWeight: 700, color: '#0f766e' }}>
                      {est.codigo_estudio}
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{est.paciente_nombre}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>CI: {est.paciente_ci}</div>
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{est.paciente_edad} años</span>
                      <div style={{ fontSize: '0.68rem', color: '#0d9488' }}>{est.grupo_etario}</div>
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{est.nombre_estudio}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{est.tipo_estudio}</div>
                    </td>
                    <td style={{ padding: '0.65rem', color: '#64748b', fontSize: '0.76rem' }}>
                      {est.fecha_solicitud}
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: est.estado === 'COMPLETADO' ? '#dcfce7' : '#fef9c3',
                        color: est.estado === 'COMPLETADO' ? '#166534' : '#854d0e',
                      }}>
                        {est.estado === 'COMPLETADO' ? 'Habilitado' : 'Pendiente'}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => abrirModalCarga(est)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: est.estado === 'COMPLETADO' ? '#f0fdfa' : '#0d9488',
                          color: est.estado === 'COMPLETADO' ? '#0f766e' : '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {est.estado === 'COMPLETADO' ? 'Editar Resultado' : 'Cargar Resultado'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. MODAL DE CARGA DE RESULTADOS DIGITALIZADOS */}
      {modalCargaAbierto && estudioSeleccionado && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FlaskConical size={20} color="#0d9488" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Cargar Resultado Clínico: {estudioSeleccionado.codigo_estudio}
                </h3>
              </div>
              <button onClick={cerrarModalCarga} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.78rem' }}>
              <div><strong>Paciente:</strong> {estudioSeleccionado.paciente_nombre} (CI: {estudioSeleccionado.paciente_ci})</div>
              <div><strong>Edad:</strong> {estudioSeleccionado.paciente_edad} años ({estudioSeleccionado.grupo_etario})</div>
              <div><strong>Estudio:</strong> {estudioSeleccionado.nombre_estudio}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Valores Obtenidos y Diagnóstico del Laboratorio *
              </label>
              <textarea
                rows={4}
                value={formResultado.resultado_diagnostico}
                onChange={(e) => setFormResultado((prev) => ({ ...prev, resultado_diagnostico: e.target.value }))}
                placeholder="Ej. Glucosa basal: 88 mg/dL (Normal). Colesterol: 175 mg/dL. Triglicéridos: 130 mg/dL..."
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Observaciones Técnicas o Comentarios del Analista
              </label>
              <input
                type="text"
                value={formResultado.observaciones}
                onChange={(e) => setFormResultado((prev) => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Muestra procesada en analizador automatizado. Sin interferencias de hemólisis."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Documento Digitalizado / Informe Firmado (PDF/Imagen)
              </label>
              <div style={{
                border: '2px dashed #99f6e4',
                background: '#f0fdfa',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
              }}>
                <UploadCloud size={24} color="#0d9488" />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f766e', marginTop: '0.25rem' }}>
                  Documento digital generado y vinculado institucionalmente
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {formResultado.archivo_resultado_url || `/laboratorios/descargas/${estudioSeleccionado.codigo_estudio.toLowerCase()}.pdf`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={cerrarModalCarga}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={guardando}
                onClick={guardarResultado}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0d9488',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                }}
              >
                {guardando ? 'Guardando...' : 'Completar y Habilitar en Línea'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL PARA CREAR NUEVA ORDEN DE ESTUDIO */}
      {modalNuevaOrden && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '520px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Nueva Orden de Laboratorio
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  ID o Paciente Destino *
                </label>
                <select
                  value={formNuevaOrden.id_paciente}
                  onChange={(e) => setFormNuevaOrden((prev) => ({ ...prev, id_paciente: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="">-- Seleccionar Paciente --</option>
                  <option value="1">Juan Pablo Pérez Gómez (CI: 87654321)</option>
                  <option value="2">Andrea Sofía Morales Paz (CI: 65432109)</option>
                  <option value="3">Carlos Rodrigo Vargas Castro (CI: 43210987)</option>
                  <option value="4">María Elena Suárez Ribera (CI: 54321678)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Nombre del Estudio / Prueba *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Urocultivo y Antibiograma / Glucemia en ayunas"
                  value={formNuevaOrden.nombre_estudio}
                  onChange={(e) => setFormNuevaOrden((prev) => ({ ...prev, nombre_estudio: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Tipo de Examen
                </label>
                <select
                  value={formNuevaOrden.tipo_estudio}
                  onChange={(e) => setFormNuevaOrden((prev) => ({ ...prev, tipo_estudio: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="Laboratorio Clínico">Laboratorio Clínico (Bioquímica / Sangre)</option>
                  <option value="Microbiología">Microbiología / Cultivos</option>
                  <option value="Imagenología">Radiología / Rayos X</option>
                  <option value="Ecografía">Ecografía / Ultrasonido</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Indicaciones u Observaciones
                </label>
                <input
                  type="text"
                  placeholder="Paciente debe guardar ayuno de 8 a 12 horas."
                  value={formNuevaOrden.descripcion}
                  onChange={(e) => setFormNuevaOrden((prev) => ({ ...prev, descripcion: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setModalNuevaOrden(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={guardando}
                onClick={crearOrden}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0d9488',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                }}
              >
                {guardando ? 'Creando...' : 'Crear Orden'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CU17_CargarEstudiosView;
