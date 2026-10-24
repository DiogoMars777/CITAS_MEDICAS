import React from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Power,
  Eye,
  BadgeCheck,
  Star,
  Users,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
} from 'lucide-react';

import { useCU05MedicoController } from '../../../controllers/PKG02_MedicosEspecialidades/CU05_GestionMedicos/CU05_MedicoController';
import { ESTADOS_MEDICO } from '../../../models/PKG02_MedicosEspecialidades/CU05_GestionMedicos/MedicoModel';
import { ModalMedicoForm } from './ModalMedicoForm';
import { ModalConfirmarEstadoMed } from './ModalConfirmarEstadoMed';
import { ModalDetalleMedico } from './ModalDetalleMedico';

export const CU05_MedicosView = () => {
  const {
    medicos,
    pagination,
    stats,
    especialidadesMeta,
    usuariosDisponiblesMeta,
    searchTerm,
    setSearchTerm,
    filterEspecialidad,
    setFilterEspecialidad,
    filterEstado,
    setFilterEstado,
    loading,
    actionLoading,
    error,
    successMsg,
    modalFormOpen,
    medicoToEdit,
    modalStatusOpen,
    medicoForStatus,
    nextStatusTarget,
    modalDetailOpen,
    medicoDetail,
    fetchMedicos,
    handleSaveMedico,
    handleConfirmChangeStatus,
    openCreateModal,
    openEditModal,
    openStatusModal,
    openDetailModal,
    closeModals,
    clearMessages,
  } = useCU05MedicoController();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* CABECERA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}>
            PKG02 Médicos y Especialidades • CU05
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0.2rem 0 0' }}>
            Personal Médico y Especialidades
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.25rem 0 0' }}>
            Registro de facultativos con número de matrícula profesional único y asignación N:M de especialidades.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
          }}
        >
          <Plus size={16} />
          Nuevo Médico
        </button>
      </div>

      {/* ALERTAS */}
      {successMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} style={{ color: '#059669' }} />
            <span style={{ fontWeight: 500 }}>{successMsg}</span>
          </div>
          <button onClick={clearMessages} style={{ background: 'transparent', border: 'none', color: '#065f46', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} style={{ color: '#dc2626' }} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
          <button onClick={clearMessages} style={{ background: 'transparent', border: 'none', color: '#991b1b', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* MÉTRICAS SOBRIAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '10px', padding: '1.1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Médicos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginTop: '0.35rem' }}>{stats.total}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #059669', borderRadius: '10px', padding: '1.1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Médicos Activos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669', marginTop: '0.35rem' }}>{stats.activos}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #94a3b8', borderRadius: '10px', padding: '1.1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Médicos Inactivos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#64748b', marginTop: '0.35rem' }}>{stats.inactivos}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '10px', padding: '1.1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Asignaciones N:M</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0284c7', marginTop: '0.35rem' }}>{stats.total_asignaciones}</div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: FILTROS + TABLA */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}>
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', flex: 1, minWidth: '300px' }}>
            {/* INPUT BÚSQUEDA */}
            <div style={{ position: 'relative', flex: 2, minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Buscar por médico, matrícula, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* FILTRO POR ESPECIALIDAD */}
            <div style={{ flex: 1, minWidth: '180px' }}>
              <select
                value={filterEspecialidad}
                onChange={(e) => setFilterEspecialidad(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              >
                <option value="">Todas las Especialidades</option>
                {especialidadesMeta.map((esp) => (
                  <option key={esp.id_especialidad} value={esp.id_especialidad}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* FILTRO ESTADO */}
            <div style={{ minWidth: '130px' }}>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              >
                <option value="">Todos los Estados</option>
                <option value="ACTIVO">Solo Activos</option>
                <option value="INACTIVO">Solo Inactivos</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => fetchMedicos(pagination.currentPage)}
            disabled={loading}
            title="Recargar catálogo de médicos"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '0.55rem 0.85rem',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {/* TABLA DE MÉDICOS */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>MÉDICO FACULTATIVO</th>
                <th style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>MATRÍCULA PROFESIONAL</th>
                <th style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ESPECIALIDAD(ES)</th>
                <th style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CONTACTO</th>
                <th style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ESTADO</th>
                <th style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {loading && medicos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: '#0284c7' }} />
                    Cargando catálogo de médicos...
                  </td>
                </tr>
              ) : medicos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                    No se encontraron médicos registrados con los criterios especificados.
                  </td>
                </tr>
              ) : (
                medicos.map((medico) => {
                  const isActivo = medico.estado === 'ACTIVO';

                  return (
                    <tr
                      key={medico.id_medico}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* MÉDICO Y USUARIO */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: '#f0f9ff',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            border: '1px solid #bae6fd',
                            flexShrink: 0,
                          }}>
                            {(medico.nombres || 'M')[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.86rem' }}>
                              Dr(a). {medico.nombre_completo}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '1px' }}>
                              Usuario: {medico.username || 'Sin cuenta'} • ID #{medico.id_medico}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* MATRÍCULA PROFESIONAL */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontFamily: 'monospace',
                          fontSize: '0.82rem',
                          color: '#334155',
                          background: '#f8fafc',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                        }}>
                          <BadgeCheck size={13} color="#0284c7" />
                          {medico.numero_registro_profesional}
                        </span>
                      </td>

                      {/* ESPECIALIDADES */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '320px' }}>
                          {medico.especialidades && medico.especialidades.length > 0 ? (
                            medico.especialidades.map((esp) => (
                              <span
                                key={esp.id_especialidad}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  background: esp.es_principal ? '#f0f9ff' : '#f8fafc',
                                  color: esp.es_principal ? '#0284c7' : '#64748b',
                                  border: esp.es_principal ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                                  fontWeight: esp.es_principal ? 700 : 500,
                                }}
                              >
                                {esp.es_principal && <Star size={10} fill="#0284c7" color="#0284c7" />}
                                {esp.nombre}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.74rem' }}>
                              Sin especialidad
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CONTACTO */}
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.76rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#334155', fontWeight: 500 }}>
                            <Phone size={12} color="#64748b" /> {medico.telefono}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                            <Mail size={12} color="#64748b" /> {medico.email}
                          </span>
                        </div>
                      </td>

                      {/* ESTADO */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          background: isActivo ? '#ecfdf5' : '#f8fafc',
                          color: isActivo ? '#059669' : '#64748b',
                          border: `1px solid ${isActivo ? '#a7f3d0' : '#e2e8f0'}`,
                          fontSize: '0.74rem',
                          fontWeight: 700,
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActivo ? '#059669' : '#94a3b8' }} />
                          {isActivo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openDetailModal(medico)}
                            title="Ver ficha completa"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              color: '#334155',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <Eye size={13} style={{ color: '#0284c7' }} />
                            Ficha
                          </button>

                          <button
                            onClick={() => openEditModal(medico)}
                            title="Editar médico"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              color: '#334155',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <Edit2 size={13} style={{ color: '#0284c7' }} />
                            Editar
                          </button>

                          <button
                            onClick={() => openStatusModal(medico, isActivo ? 'INACTIVO' : 'ACTIVO')}
                            title={isActivo ? 'Suspender disponibilidad' : 'Habilitar médico'}
                            style={{
                              background: isActivo ? '#fef2f2' : '#ecfdf5',
                              border: `1px solid ${isActivo ? '#fecaca' : '#a7f3d0'}`,
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              color: isActivo ? '#dc2626' : '#059669',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                            }}
                          >
                            <Power size={13} />
                            {isActivo ? 'Pausar' : 'Activar'}
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
            padding: '0.85rem 1rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#64748b',
          }}>
            <div>
              Mostrando {medicos.length} de {pagination.total} médicos registrados
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <button
                disabled={pagination.currentPage <= 1 || loading}
                onClick={() => fetchMedicos(pagination.currentPage - 1)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.35rem 0.55rem',
                  color: '#334155',
                  cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft size={14} />
              </button>

              <span style={{ padding: '0 0.5rem', color: '#0f172a', fontWeight: 600 }}>
                {pagination.currentPage} / {pagination.lastPage}
              </span>

              <button
                disabled={pagination.currentPage >= pagination.lastPage || loading}
                onClick={() => fetchMedicos(pagination.currentPage + 1)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.35rem 0.55rem',
                  color: '#334155',
                  cursor: pagination.currentPage >= pagination.lastPage ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR */}
      <ModalMedicoForm
        isOpen={modalFormOpen}
        onClose={closeModals}
        onSave={handleSaveMedico}
        medicoToEdit={medicoToEdit}
        especialidadesMeta={especialidadesMeta}
        usuariosDisponiblesMeta={usuariosDisponiblesMeta}
        loading={actionLoading}
      />

      {/* MODAL CONFIRMAR ESTADO */}
      <ModalConfirmarEstadoMed
        isOpen={modalStatusOpen}
        onClose={closeModals}
        onConfirm={handleConfirmChangeStatus}
        medico={medicoForStatus}
        nextStatus={nextStatusTarget}
        loading={actionLoading}
      />

      {/* MODAL FICHA DETALLE */}
      <ModalDetalleMedico
        isOpen={modalDetailOpen}
        onClose={closeModals}
        medico={medicoDetail}
      />
    </div>
  );
};

export default CU05_MedicosView;
