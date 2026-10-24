import React from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Search,
  RefreshCw,
  Edit2,
  Power,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Mail,
  Stethoscope,
  ClipboardList,
  Activity,
  FlaskConical,
  BarChart3,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCU03GestionUsuariosController } from '../../../controllers/PKG01_Seguridad/CU03_GestionUsuarios/CU03_GestionUsuariosController';
import {
  ESTADOS_USUARIO,
  ROLES_BADGES,
} from '../../../models/PKG01_Seguridad/CU03_GestionUsuarios/UsuarioModel';
import { ModalUsuarioForm } from './ModalUsuarioForm';
import { ModalConfirmarEstado } from './ModalConfirmarEstado';

const MODULO_ICONS = {
  SEGURIDAD: Shield,
  MEDICOS: Stethoscope,
  PACIENTES: Users,
  AGENDAS: Calendar,
  CITAS: ClipboardList,
  CONSULTAS: Activity,
  LABORATORIOS: FlaskConical,
  REPORTES: BarChart3,
};

export const CU03_GestionUsuariosView = () => {
  const {
    activeTab,
    setActiveTab,
    usuarios,
    pagination,
    stats,
    roles,
    permisosAgrupados,
    totalPermisos,
    selectedRoleForPermisos,
    rolePermisosSet,
    savingPermisos,
    searchTerm,
    setSearchTerm,
    filterRol,
    setFilterRol,
    filterEstado,
    setFilterEstado,
    loading,
    actionLoading,
    error,
    successMsg,
    modalFormOpen,
    userToEdit,
    modalStatusOpen,
    userForStatus,
    nextStatusTarget,
    fetchUsuarios,
    handleSaveUser,
    handleConfirmChangeStatus,
    handleSelectRoleForPermisos,
    handleTogglePermiso,
    handleSaveRolePermissions,
    openCreateModal,
    openEditModal,
    openStatusModal,
    closeModals,
    clearMessages,
  } = useCU03GestionUsuariosController();

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', color: '#0f172a' }}>
      {/* ======================================================== */}
      {/* 1. ENCABEZADO EJECUTIVO */}
      {/* ======================================================== */}
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
            PKG01 Seguridad Institucional • CU03
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Usuarios y Roles
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.25rem 0 0' }}>
            Control de cuentas de acceso del personal clínico y matriz de privilegios por rol.
          </p>
        </div>

        {/* BOTÓN REGISTRAR NUEVO USUARIO EN EL HEADER */}
        {activeTab === 'usuarios' && (
          <button
            type="button"
            onClick={openCreateModal}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              transition: 'background 0.15s ease',
            }}
          >
            <UserPlus size={16} />
            Nuevo Usuario
          </button>
        )}
      </div>

      {/* MENSAJES FEEDBACK */}
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
          <button
            onClick={clearMessages}
            style={{ background: 'none', border: 'none', color: '#15803d', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Cerrar
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
          <button
            onClick={clearMessages}
            style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TARJETAS DE MÉTRICAS KPI BLANCAS */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {/* TOTAL */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #0284c7',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
            Total Cuentas
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            {stats.total}
          </div>
        </div>

        {/* ACTIVOS */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #059669',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
            Activos
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>
            {stats.activos}
          </div>
        </div>

        {/* MÉDICOS */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #6366f1',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
            Médicos
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6366f1' }}>
            {stats.medicos}
          </div>
        </div>

        {/* RECEPCIONISTAS */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #8b5cf6',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
            Recepción
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6' }}>
            {stats.recepcionistas}
          </div>
        </div>

        {/* ADMINISTRADORES */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #0284c7',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
            Administradores
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>
            {stats.administradores}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TABS EJECUTIVAS */}
      {/* ======================================================== */}
      <div style={{
        display: 'flex',
        gap: '0.65rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.75rem',
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('usuarios')}
          style={{
            padding: '0.6rem 1.15rem',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'usuarios' ? '#f0f9ff' : 'transparent',
            color: activeTab === 'usuarios' ? '#0284c7' : '#64748b',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease',
          }}
        >
          <Users size={16} />
          Cuentas de Usuarios
          <span style={{
            fontSize: '0.72rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '9999px',
            background: activeTab === 'usuarios' ? '#bae6fd' : '#e2e8f0',
            color: activeTab === 'usuarios' ? '#0369a1' : '#475569',
            fontWeight: 700,
          }}>
            {stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles_permisos')}
          style={{
            padding: '0.6rem 1.15rem',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'roles_permisos' ? '#f0f9ff' : 'transparent',
            color: activeTab === 'roles_permisos' ? '#0284c7' : '#64748b',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease',
          }}
        >
          <KeyRound size={16} />
          Roles y Privilegios
          <span style={{
            fontSize: '0.72rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '9999px',
            background: activeTab === 'roles_permisos' ? '#bae6fd' : '#e2e8f0',
            color: activeTab === 'roles_permisos' ? '#0369a1' : '#475569',
            fontWeight: 700,
          }}>
            {totalPermisos}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 4. CONTENIDO PESTAÑA 1: CUENTAS DE USUARIOS */}
      {/* ======================================================== */}
      {activeTab === 'usuarios' && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          {/* BARRA DE FILTROS LIMPIA */}
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.85rem',
          }}>
            {/* BUSCADOR */}
            <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Buscar por usuario o correo..."
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

            {/* FILTRO ROL */}
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              style={{
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
              <option value="">Todos los Roles</option>
              {roles.map((r) => (
                <option key={r.id_rol} value={r.id_rol}>
                  {r.nombre_rol}
                </option>
              ))}
            </select>

            {/* FILTRO ESTADO */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              style={{
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
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
              <option value="BLOQUEADO">Bloqueado</option>
            </select>

            {/* BOTÓN RECARGAR */}
            <button
              type="button"
              onClick={() => fetchUsuarios(pagination.currentPage)}
              disabled={loading}
              title="Actualizar tabla"
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* TABLA DE USUARIOS */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
              <thead>
                <tr style={{
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  letterSpacing: '0.04em',
                }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Usuario</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Rol</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Estado</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Último Acceso</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 700 }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading && usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                      <RefreshCw size={22} className="animate-spin" style={{ margin: '0 auto 0.6rem', color: '#0284c7' }} />
                      <div style={{ fontSize: '0.86rem' }}>Cargando usuarios...</div>
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '0.9rem', color: '#475569' }}>No se encontraron usuarios</div>
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => {
                    const rolBadge = ROLES_BADGES[u.rol_nombre] || {
                      color: '#64748b',
                      bg: '#f1f5f9',
                      border: '#e2e8f0',
                    };
                    const estadoBadge = ESTADOS_USUARIO[u.estado] || ESTADOS_USUARIO.ACTIVO;

                    return (
                      <tr
                        key={u.id_usuario}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* USUARIO CON AVATAR */}
                        <td style={{ padding: '0.95rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: '#f0f9ff',
                              border: '1px solid #bae6fd',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0284c7',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                            }}>
                              {u.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                                {u.username}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ROL */}
                        <td style={{ padding: '0.95rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            background: rolBadge.bg,
                            border: `1px solid ${rolBadge.border}`,
                            color: rolBadge.color,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}>
                            {u.rol_nombre}
                          </span>
                        </td>

                        {/* ESTADO */}
                        <td style={{ padding: '0.95rem 1rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            background: estadoBadge.bg,
                            border: `1px solid ${estadoBadge.border}`,
                            color: estadoBadge.color,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: estadoBadge.color }} />
                            {estadoBadge.label}
                          </span>
                        </td>

                        {/* ÚLTIMO LOGIN */}
                        <td style={{ padding: '0.95rem 1rem', fontSize: '0.82rem', color: u.ultimo_login ? '#334155' : '#94a3b8' }}>
                          {u.ultimo_login_bolivia}
                        </td>

                        {/* ACCIONES */}
                        <td style={{ padding: '0.95rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              style={{
                                padding: '0.4rem 0.65rem',
                                borderRadius: '8px',
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <Edit2 size={13} />
                              Editar
                            </button>

                            {u.estado === 'ACTIVO' ? (
                              <button
                                type="button"
                                onClick={() => openStatusModal(u, 'INACTIVO')}
                                style={{
                                  padding: '0.4rem 0.65rem',
                                  borderRadius: '8px',
                                  background: '#fef2f2',
                                  border: '1px solid #fecaca',
                                  color: '#dc2626',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <Power size={13} />
                                Desactivar
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openStatusModal(u, 'ACTIVO')}
                                style={{
                                  padding: '0.4rem 0.65rem',
                                  borderRadius: '8px',
                                  background: '#f0fdf4',
                                  border: '1px solid #bbf7d0',
                                  color: '#16a34a',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <Check size={13} />
                                Activar
                              </button>
                            )}
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
          {pagination.total > 0 && (
            <div style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Página <strong style={{ color: '#0f172a' }}>{pagination.currentPage}</strong> de <strong style={{ color: '#0f172a' }}>{pagination.lastPage}</strong> ({pagination.total} usuarios)
              </span>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  disabled={pagination.currentPage <= 1 || loading}
                  onClick={() => fetchUsuarios(pagination.currentPage - 1)}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: pagination.currentPage <= 1 ? '#94a3b8' : '#475569',
                    fontSize: '0.78rem',
                    cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    opacity: pagination.currentPage <= 1 ? 0.5 : 1,
                  }}
                >
                  <ChevronLeft size={14} />
                  Anterior
                </button>

                <button
                  disabled={pagination.currentPage >= pagination.lastPage || loading}
                  onClick={() => fetchUsuarios(pagination.currentPage + 1)}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: pagination.currentPage >= pagination.lastPage ? '#94a3b8' : '#475569',
                    fontSize: '0.78rem',
                    cursor: pagination.currentPage >= pagination.lastPage ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    opacity: pagination.currentPage >= pagination.lastPage ? 0.5 : 1,
                  }}
                >
                  Siguiente
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CONTENIDO PESTAÑA 2: MATRIZ DE ROLES Y PRIVILEGIOS */}
      {/* ======================================================== */}
      {activeTab === 'roles_permisos' && (
        <div>
          {/* SELECTOR DE ROL */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {roles.map((r) => {
              const isSelected = selectedRoleForPermisos?.id_rol === r.id_rol;
              const badge = ROLES_BADGES[r.nombre_rol] || { color: '#64748b', bg: '#f1f5f9' };

              return (
                <button
                  key={r.id_rol}
                  type="button"
                  onClick={() => handleSelectRoleForPermisos(r)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: isSelected ? '#f0f9ff' : '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected ? '0 4px 6px -1px rgba(2, 132, 199, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      background: badge.bg,
                      color: badge.color,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                    }}>
                      {r.nombre_rol}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                      {r.total_usuarios} usuarios
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Privilegios: <strong style={{ color: isSelected ? '#0284c7' : '#0f172a' }}>{isSelected ? rolePermisosSet.size : r.total_permisos}</strong> / {totalPermisos}
                  </div>
                </button>
              );
            })}
          </div>

          {/* BARRA DE GUARDADO PARA EL ROL */}
          {selectedRoleForPermisos && (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.85rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Privilegios de Acceso: {selectedRoleForPermisos.nombre_rol}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {rolePermisosSet.size} de {totalPermisos} permisos asignados al rol
                </span>
              </div>

              <button
                type="button"
                onClick={handleSaveRolePermissions}
                disabled={savingPermisos}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: savingPermisos ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
                }}
              >
                {savingPermisos ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          )}

          {/* MATRIZ DE PERMISOS POR MÓDULO */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.15rem',
          }}>
            {Object.entries(permisosAgrupados).map(([modulo, permisosList]) => {
              const ModuloIcon = MODULO_ICONS[modulo] || Shield;
              const countActivos = permisosList.filter((p) => rolePermisosSet.has(p.id_permiso)).length;

              return (
                <div
                  key={modulo}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.15rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {/* CABECERA MÓDULO */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.65rem',
                    borderBottom: '1px solid #f1f5f9',
                    marginBottom: '0.85rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#f0f9ff',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ModuloIcon size={16} />
                      </div>
                      <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }}>
                        {modulo}
                      </h4>
                    </div>

                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      background: '#f1f5f9',
                      color: '#475569',
                    }}>
                      {countActivos} / {permisosList.length}
                    </span>
                  </div>

                  {/* LISTA DE PERMISOS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {permisosList.map((p) => {
                      const isGranted = rolePermisosSet.has(p.id_permiso);

                      return (
                        <label
                          key={p.id_permiso}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.5rem 0.65rem',
                            borderRadius: '8px',
                            background: isGranted ? '#f0f9ff' : 'transparent',
                            border: isGranted ? '1px solid #bae6fd' : '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isGranted}
                            onChange={() => handleTogglePermiso(p.id_permiso)}
                            style={{
                              marginTop: '0.2rem',
                              accentColor: '#0284c7',
                              cursor: 'pointer',
                              width: '16px',
                              height: '16px',
                            }}
                          />

                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontFamily: 'monospace',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: isGranted ? '#0284c7' : '#334155',
                            }}>
                              {p.nombre_permiso}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.1rem' }}>
                              {p.descripcion}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODALES */}
      {/* ======================================================== */}
      <ModalUsuarioForm
        isOpen={modalFormOpen}
        onClose={closeModals}
        onSave={handleSaveUser}
        roles={roles}
        userToEdit={userToEdit}
        loading={actionLoading}
      />

      <ModalConfirmarEstado
        isOpen={modalStatusOpen}
        onClose={closeModals}
        onConfirm={handleConfirmChangeStatus}
        user={userForStatus}
        nextStatus={nextStatusTarget}
        loading={actionLoading}
      />
    </div>
  );
};

export default CU03_GestionUsuariosView;
