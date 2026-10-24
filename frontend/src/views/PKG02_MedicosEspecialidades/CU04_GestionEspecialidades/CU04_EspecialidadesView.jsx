import React from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Edit2,
  Power,
  Users,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react';

import { useCU04EspecialidadController } from '../../../controllers/PKG02_MedicosEspecialidades/CU04_GestionEspecialidades/CU04_EspecialidadController';
import { ESTADOS_ESPECIALIDAD } from '../../../models/PKG02_MedicosEspecialidades/CU04_GestionEspecialidades/EspecialidadModel';
import { ModalEspecialidadForm } from './ModalEspecialidadForm';
import { ModalConfirmarEstadoEsp } from './ModalConfirmarEstadoEsp';

export const CU04_EspecialidadesView = () => {
  const {
    especialidades,
    pagination,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    loading,
    actionLoading,
    error,
    successMsg,
    modalFormOpen,
    especialidadToEdit,
    modalStatusOpen,
    especialidadForStatus,
    nextStatusTarget,
    fetchEspecialidades,
    handleSaveEspecialidad,
    handleConfirmChangeStatus,
    openCreateModal,
    openEditModal,
    openStatusModal,
    closeModals,
    clearMessages,
  } = useCU04EspecialidadController();

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', color: '#0f172a' }}>
      {/* CABECERA EJECUTIVA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.45rem',
          }}>
            PKG02 Médicos y Especialidades • CU04
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Especialidades Médicas
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0.25rem 0 0' }}>
            Catálogo clínico de áreas de atención facultativa para asignación médica y agenda de citas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.65rem 1.25rem',
            fontSize: '0.86rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={16} />
          Nueva Especialidad
        </button>
      </div>

      {/* MENSAJES DE NOTIFICACIÓN */}
      {successMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span style={{ fontWeight: 500 }}>{successMsg}</span>
          </div>
          <button onClick={clearMessages} style={{ background: 'transparent', border: 'none', color: '#15803d', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
          <button onClick={clearMessages} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* MÉTRICAS KPI BLANCAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #0284c7',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Especialidades</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{stats.total}</div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #059669',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Activas para Citas</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>{stats.activas}</div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #94a3b8',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Inactivas / Pausadas</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#64748b', marginTop: '0.25rem' }}>{stats.inactivas}</div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #6366f1',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Médicos con Especialidad</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6366f1', marginTop: '0.25rem' }}>{stats.medicos_vinculados}</div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: FILTROS + TABLA */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}>
        {/* BARRA DE BÚSQUEDA Y FILTRO */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
            {/* INPUT BÚSQUEDA */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Buscar por especialidad o descripción clínica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* FILTRO ESTADO */}
            <div style={{ minWidth: '160px' }}>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.86rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Todos los Estados</option>
                <option value="ACTIVO">Solo Activos</option>
                <option value="INACTIVO">Solo Inactivos</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => fetchEspecialidades(pagination.currentPage)}
            disabled={loading}
            title="Recargar catálogo"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              color: '#475569',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {/* TABLA DE ESPECIALIDADES */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ESPECIALIDAD MÉDICA</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>DESCRIPCIÓN</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>MÉDICOS</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>CITAS</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ESTADO</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {loading && especialidades.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                    <RefreshCw size={22} className="animate-spin" style={{ margin: '0 auto 0.6rem', color: '#0284c7' }} />
                    Cargando especialidades médicas...
                  </td>
                </tr>
              ) : especialidades.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                    No se encontraron especialidades que coincidan con los criterios.
                  </td>
                </tr>
              ) : (
                especialidades.map((esp) => {
                  const estadoCfg = ESTADOS_ESPECIALIDAD[esp.estado] || ESTADOS_ESPECIALIDAD.ACTIVO;
                  const isActivo = esp.estado === 'ACTIVO';

                  return (
                    <tr
                      key={esp.id_especialidad}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* NOMBRE */}
                      <td style={{ padding: '0.95rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#f0f9ff',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #bae6fd',
                          }}>
                            <Stethoscope size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                              {esp.nombre}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              ID #{esp.id_especialidad}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DESCRIPCIÓN */}
                      <td style={{ padding: '0.95rem 1.25rem', color: '#475569', maxWidth: '380px' }}>
                        {esp.descripcion ? (
                          <span style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>{esp.descripcion}</span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>Sin descripción clínica</span>
                        )}
                      </td>

                      {/* MÉDICOS */}
                      <td style={{ padding: '0.95rem 1.25rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#0284c7',
                        }}>
                          <Users size={13} color="#0284c7" />
                          {esp.total_medicos || 0}
                        </span>
                      </td>

                      {/* CITAS */}
                      <td style={{ padding: '0.95rem 1.25rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#475569',
                        }}>
                          <CalendarCheck size={13} color="#64748b" />
                          {esp.total_citas || 0}
                        </span>
                      </td>

                      {/* ESTADO BADGE */}
                      <td style={{ padding: '0.95rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          background: estadoCfg.bg,
                          color: estadoCfg.color,
                          border: `1px solid ${estadoCfg.border}`,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: estadoCfg.color }} />
                          {estadoCfg.label}
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td style={{ padding: '0.95rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.45rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openEditModal(esp)}
                            title="Editar especialidad"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              padding: '0.4rem 0.65rem',
                              color: '#334155',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Edit2 size={13} />
                            Editar
                          </button>

                          <button
                            onClick={() => openStatusModal(esp, isActivo ? 'INACTIVO' : 'ACTIVO')}
                            title={isActivo ? 'Pausar especialidad' : 'Activar especialidad'}
                            style={{
                              background: isActivo ? '#fef2f2' : '#f0fdf4',
                              border: `1px solid ${isActivo ? '#fecaca' : '#bbf7d0'}`,
                              borderRadius: '8px',
                              padding: '0.4rem 0.65rem',
                              color: isActivo ? '#dc2626' : '#16a34a',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Power size={13} />
                            {isActivo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {pagination.lastPage > 1 && (
          <div style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#64748b',
          }}>
            <div>
              Mostrando <strong style={{ color: '#0f172a' }}>{especialidades.length}</strong> de <strong style={{ color: '#0f172a' }}>{pagination.total}</strong> especialidades
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <button
                disabled={pagination.currentPage <= 1 || loading}
                onClick={() => fetchEspecialidades(pagination.currentPage - 1)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.4rem 0.65rem',
                  color: '#475569',
                  cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: pagination.currentPage <= 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={14} />
              </button>

              <span style={{ padding: '0 0.6rem', color: '#0f172a', fontWeight: 700 }}>
                {pagination.currentPage} / {pagination.lastPage}
              </span>

              <button
                disabled={pagination.currentPage >= pagination.lastPage || loading}
                onClick={() => fetchEspecialidades(pagination.currentPage + 1)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.4rem 0.65rem',
                  color: '#475569',
                  cursor: pagination.currentPage >= pagination.lastPage ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: pagination.currentPage >= pagination.lastPage ? 0.5 : 1,
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR */}
      <ModalEspecialidadForm
        isOpen={modalFormOpen}
        onClose={closeModals}
        onSave={handleSaveEspecialidad}
        especialidadToEdit={especialidadToEdit}
        loading={actionLoading}
      />

      {/* MODAL CONFIRMAR ESTADO */}
      <ModalConfirmarEstadoEsp
        isOpen={modalStatusOpen}
        onClose={closeModals}
        onConfirm={handleConfirmChangeStatus}
        especialidad={especialidadForStatus}
        nextStatus={nextStatusTarget}
        loading={actionLoading}
      />
    </div>
  );
};

export default CU04_EspecialidadesView;
