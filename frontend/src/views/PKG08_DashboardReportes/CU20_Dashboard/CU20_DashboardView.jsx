import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Stethoscope,
  FlaskConical,
  Bell,
  RefreshCw,
  Filter,
  Shield,
  Activity,
  UserCheck,
  ChevronRight,
  ArrowUpRight,
  Building2,
  Percent,
} from 'lucide-react';
import { useCU20DashboardController } from '../../../controllers/PKG08_DashboardReportes/CU20_Dashboard/CU20_DashboardController';

export const CU20_DashboardView = ({ onNavigateToAgenda, onNavigateToLaboratorios }) => {
  const {
    metricas,
    loading,
    error,
    periodo,
    setPeriodo,
    rolActivo,
    setRolActivo,
    recargar,
  } = useCU20DashboardController();

  const admin = metricas?.admin_kpis;
  const medico = metricas?.medico_kpis;

  return (
    <div style={{ padding: '0.5rem 1rem 3rem', maxWidth: '1440px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 1. CABECERA PRINCIPAL DEL DASHBOARD */}
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
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
          }}>
            <BarChart3 size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}>
                CU20
              </span>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Dashboard Operativo y Administrativo en Tiempo Real
              </h1>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Métricas ejecutivas de ocupación de agenda, cumplimiento de citas, demanda por especialidad y laboratorios.
            </p>
          </div>
        </div>

        {/* SELECTORES DE ROL Y PERÍODO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* SWITCH DE ROL */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setRolActivo('ADMIN')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: rolActivo === 'ADMIN' ? '#ffffff' : 'transparent',
                color: rolActivo === 'ADMIN' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: rolActivo === 'ADMIN' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Administrador
            </button>
            <button
              type="button"
              onClick={() => setRolActivo('MEDICO')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: rolActivo === 'MEDICO' ? '#ffffff' : 'transparent',
                color: rolActivo === 'MEDICO' ? '#0284c7' : '#64748b',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: rolActivo === 'MEDICO' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Médico Tratante
            </button>
          </div>

          {/* FILTRO PERÍODO */}
          <div style={{ display: 'flex', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { id: 'hoy', label: 'Hoy' },
              { id: 'semana', label: 'Esta Semana' },
              { id: 'mes', label: 'Este Mes' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodo(p.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  border: 'none',
                  background: periodo === p.id ? '#0284c7' : 'transparent',
                  color: periodo === p.id ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={recargar}
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              color: '#475569',
            }}
            title="Actualizar métricas"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {loading && !metricas ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
          Calculando métricas operativas en tiempo real...
        </div>
      ) : metricas ? (
        <>
          {/* ======================================================== */}
          {/* VISTA 1: MÉTRICAS DE MÉDICO TRATANTE (SI SE ELIGIÓ MÉDICO) */}
          {/* ======================================================== */}
          {rolActivo === 'MEDICO' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#bae6fd' }}>
                    Panel de Consulta del Médico
                  </span>
                  <h2 style={{ margin: '0.2rem 0', fontSize: '1.3rem', fontWeight: 800 }}>
                    {medico?.medico_nombre}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>
                    Especialidad: <strong>{medico?.especialidad}</strong> | Jornada de Hoy
                  </div>
                </div>

                {onNavigateToAgenda && (
                  <button
                    type="button"
                    onClick={onNavigateToAgenda}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#ffffff',
                      color: '#0369a1',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    Abrir mi Agenda Diaria (CU15)
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* KPIS DEL MÉDICO */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Pacientes Agendados Hoy</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
                    {medico?.total_hoy}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>Pacientes Atendidos</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', marginTop: '0.2rem' }}>
                    {medico?.atendidos_hoy}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>En Espera / Pendientes</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>
                    {medico?.pendientes_hoy}
                  </div>
                </div>
              </div>

              {/* PRÓXIMO PACIENTE EN TURNO */}
              {medico?.proximo_paciente && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock size={24} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>
                        Próximo Paciente en Turno (15 min)
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        {medico.proximo_paciente.paciente}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        Horario: <strong>{medico.proximo_paciente.hora}</strong> | Motivo: {medico.proximo_paciente.motivo}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    {medico.proximo_paciente.estado}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 2: DASHBOARD OPERATIVO INSTITUCIONAL (ADMINISTRADOR) */}
          {/* ======================================================== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* TOTAL CITAS */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Total Citas ({periodo})</span>
                <Calendar size={18} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.35rem 0' }}>
                {admin?.total_citas}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                Tasa Cumplimiento: {admin?.tasa_efectividad}%
              </div>
            </div>

            {/* ATENDIDAS */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>Citas Atendidas</span>
                <CheckCircle2 size={18} color="#16a34a" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16a34a', margin: '0.35rem 0' }}>
                {admin?.atendidas}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Consultas cerradas con evolución
              </div>
            </div>

            {/* PROGRAMADAS / PENDIENTES */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>Citas Pendientes</span>
                <Clock size={18} color="#d97706" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#d97706', margin: '0.35rem 0' }}>
                {admin?.programadas}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                En sala o agendadas
              </div>
            </div>

            {/* CANCELADAS */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Cancelaciones</span>
                <XCircle size={18} color="#dc2626" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#dc2626', margin: '0.35rem 0' }}>
                {admin?.canceladas}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>
                Tasa Cancelación: {admin?.tasa_cancelacion}%
              </div>
            </div>
          </div>

          {/* SECCIÓN INTERMEDIA: DEMANDA POR ESPECIALIDAD Y ESTADO DE LABORATORIOS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* GRÁFICO / BARRAS DE DEMANDA POR ESPECIALIDAD */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <TrendingUp size={18} color="#0284c7" />
                  Demanda Asistencial por Especialidad Médica
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Período: {periodo}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {admin?.demanda_especialidades?.map((esp, idx) => (
                  <div key={esp.especialidad || idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>{esp.especialidad}</span>
                      <span style={{ color: '#0f172a', fontWeight: 800 }}>{esp.total} citas ({esp.porcentaje}%)</span>
                    </div>
                    {/* BARRA DE PROGRESO */}
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(esp.porcentaje * 1.5, 100)}%`,
                        height: '100%',
                        background: idx === 0 ? '#0284c7' : idx === 1 ? '#0d9488' : idx === 2 ? '#8b5cf6' : '#f59e0b',
                        borderRadius: '4px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ESTADO DE LABORATORIOS Y NOTIFICACIONES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* TARJETA LABORATORIO */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.15rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FlaskConical size={16} color="#0d9488" />
                    Estado de Laboratorios Clínicos
                  </h4>
                  {onNavigateToLaboratorios && (
                    <button
                      type="button"
                      onClick={onNavigateToLaboratorios}
                      style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Ver todos →
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                  <div style={{ background: '#f0fdf4', padding: '0.65rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>Completados</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#16a34a' }}>
                      {admin?.laboratorios?.completados}
                    </div>
                  </div>
                  <div style={{ background: '#fffbeb', padding: '0.65rem', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                    <div style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 700 }}>Pendientes</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#d97706' }}>
                      {admin?.laboratorios?.pendientes}
                    </div>
                  </div>
                </div>
              </div>

              {/* TARJETA RECORDATORIOS Y ALERTAS */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.15rem',
              }}>
                <h4 style={{ margin: '0 0 0.65rem', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={16} color="#6366f1" />
                  Efectividad de Recordatorios (CU19)
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Avisos automáticos enviados</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4338ca' }}>
                      {admin?.recordatorios?.enviados} / {admin?.recordatorios?.total}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#4338ca' }}>
                    WhatsApp / Email
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CU20_DashboardView;
