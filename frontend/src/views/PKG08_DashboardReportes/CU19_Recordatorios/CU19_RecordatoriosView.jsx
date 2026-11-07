import React, { useState } from 'react';
import {
  Bell,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  User,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useCU19RecordatorioController } from '../../../controllers/PKG08_DashboardReportes/CU19_Recordatorios/CU19_RecordatorioController';

export const CU19_RecordatoriosView = () => {
  const {
    recordatorios,
    estadisticas,
    loading,
    escaneando,
    reenviandoId,
    error,
    mensajeExito,
    filtroEstado,
    setFiltroEstado,
    filtroCanal,
    setFiltroCanal,
    searchTerm,
    setSearchTerm,
    modalNuevoAviso,
    setModalNuevoAviso,
    formAviso,
    setFormAviso,
    escanearProximas24Horas,
    reenviarRecordatorio,
    enviarAvisoManual,
    cargarRecordatorios,
    limpiarMensajes,
  } = useCU19RecordatorioController();

  const getCanalIcon = (canal) => {
    switch (canal) {
      case 'WHATSAPP':
        return <Smartphone size={15} color="#16a34a" />;
      case 'EMAIL':
        return <Mail size={15} color="#0284c7" />;
      case 'SMS':
        return <MessageSquare size={15} color="#d97706" />;
      default:
        return <Bell size={15} />;
    }
  };

  return (
    <div style={{ padding: '0.5rem 1rem 3rem', maxWidth: '1440px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 1. CABECERA DEL CU19 */}
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
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
          }}>
            <Bell size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: '#6366f1',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}>
                CU19
              </span>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Gestionar Recordatorios y Notificaciones
              </h1>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Alertas automáticas preventivas para citas en las próximas 24h, confirmaciones y avisos de laboratorio.
            </p>
          </div>
        </div>

        {/* ACCIONES SUPERIORES */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            disabled={escaneando}
            onClick={escanearProximas24Horas}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              background: '#6366f1',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: escaneando ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.25)',
            }}
          >
            <Sparkles size={16} />
            {escaneando ? 'Escaneando citas...' : 'Escanear Citas Próximas (24 Horas)'}
          </button>

          <button
            type="button"
            onClick={() => setModalNuevoAviso(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Notificación Manual
          </button>
        </div>
      </div>

      {/* FEEDBACK */}
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

      {/* 2. CONTADORES / ESTADÍSTICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Avisos Generados</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{estadisticas.total}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Enviados con Éxito</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>{estadisticas.enviados}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Pendientes de Envío</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{estadisticas.pendientes}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Fallidos / Reintentos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>{estadisticas.fallidos}</div>
          </div>
        </div>
      </div>

      {/* 3. FILTROS Y TABLA DE NOTIFICACIONES */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Canal:</span>
            {['TODOS', 'WHATSAPP', 'EMAIL', 'SMS'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFiltroCanal(c)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: filtroCanal === c ? '1px solid #6366f1' : '1px solid #e2e8f0',
                  background: filtroCanal === c ? '#6366f1' : '#f8fafc',
                  color: filtroCanal === c ? '#ffffff' : '#475569',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginLeft: '0.5rem' }}>Estado:</span>
            {['TODOS', 'ENVIADO', 'PENDIENTE', 'FALLIDO'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFiltroEstado(s)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: filtroEstado === s ? '1px solid #6366f1' : '1px solid #e2e8f0',
                  background: filtroEstado === s ? '#e0e7ff' : '#f8fafc',
                  color: filtroEstado === s ? '#4338ca' : '#475569',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Buscar en mensajes o pacientes..."
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
              onClick={cargarRecordatorios}
              style={{ padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* LISTADO DE RECORDATORIOS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
            Cargando bitácora de recordatorios...
          </div>
        ) : recordatorios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
            No se encontraron recordatorios con los filtros aplicados.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recordatorios.map((rec) => (
              <div
                key={rec.id_recordatorio}
                style={{
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '0.9rem 1.15rem',
                  background: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {getCanalIcon(rec.tipo_canal)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                        {rec.paciente?.nombre}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        CI: {rec.paciente?.ci} | Tel: {rec.paciente?.telefono}
                      </span>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: '#e0e7ff',
                        color: '#4338ca',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}>
                        {rec.tipo_canal}
                      </span>
                    </div>

                    <p style={{ margin: '0.35rem 0', fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                      {rec.mensaje}
                    </p>

                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Cita: {rec.codigo_cita} | {rec.especialidad} ({rec.medico}) • Enviado: {rec.fecha_envio || rec.fecha_programada}
                    </div>
                  </div>
                </div>

                {/* ESTADO Y BOTÓN REENVIAR */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: rec.estado_envio === 'ENVIADO' ? '#dcfce7' : '#fef9c3',
                    color: rec.estado_envio === 'ENVIADO' ? '#166534' : '#854d0e',
                  }}>
                    {rec.estado_envio} (Int: {rec.intentos})
                  </span>

                  <button
                    type="button"
                    disabled={reenviandoId === rec.id_recordatorio}
                    onClick={() => reenviarRecordatorio(rec.id_recordatorio)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: reenviandoId === rec.id_recordatorio ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {reenviandoId === rec.id_recordatorio ? 'Enviando...' : 'Reenviar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. MODAL NUEVA NOTIFICACIÓN MANUAL */}
      {modalNuevoAviso && (
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
              Redactar Notificación / Aviso al Paciente
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Cita del Paciente *
                </label>
                <select
                  value={formAviso.id_cita}
                  onChange={(e) => setFormAviso((prev) => ({ ...prev, id_cita: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="">-- Seleccionar Cita --</option>
                  <option value="1">CITA-001 - Juan Pablo Pérez (08:00 - Medicina General)</option>
                  <option value="2">CITA-002 - Andrea Sofía Morales (08:15 - Medicina General)</option>
                  <option value="3">CITA-003 - Carlos Rodrigo Vargas (08:30 - Medicina General)</option>
                  <option value="4">CITA-004 - María Elena Suárez (08:45 - Medicina General)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Canal de Notificación
                </label>
                <select
                  value={formAviso.tipo_canal}
                  onChange={(e) => setFormAviso((prev) => ({ ...prev, tipo_canal: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="WHATSAPP">WhatsApp Institucional</option>
                  <option value="EMAIL">Correo Electrónico</option>
                  <option value="SMS">Mensaje de Texto (SMS)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Contenido del Recordatorio *
                </label>
                <textarea
                  rows={3}
                  value={formAviso.mensaje}
                  onChange={(e) => setFormAviso((prev) => ({ ...prev, mensaje: e.target.value }))}
                  placeholder="Estimado paciente: Le recordamos su cita el día de hoy a las..."
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setModalNuevoAviso(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={enviarAvisoManual}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#6366f1',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Enviando...' : 'Enviar Inmediatamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CU19_RecordatoriosView;
