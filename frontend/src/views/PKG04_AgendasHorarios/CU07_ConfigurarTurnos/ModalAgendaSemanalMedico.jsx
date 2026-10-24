import React from 'react';
import { X, Calendar, Clock, RefreshCw, User, CheckCircle2 } from 'lucide-react';

export const ModalAgendaSemanalMedico = ({
  isOpen,
  onClose,
  agendaData,
  loading = false,
}) => {
  if (!isOpen) return null;

  const medicoNombre = agendaData?.medico || 'Médico';
  const dias = agendaData?.agenda_semanal ? Object.values(agendaData.agenda_semanal) : [];

  // Calcular total de cupos semanales
  const totalCuposSemana = dias.reduce((acc, d) => {
    return acc + (d.turnos || []).reduce((subAcc, t) => subAcc + (t.cupos || 0), 0);
  }, 0);

  const diasConTurnos = dias.filter((d) => (d.turnos || []).length > 0).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#f0f9ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #bae6fd',
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Agenda Semanal de Turnos
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                {medicoNombre}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* METADATA BAR */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Días con turno activo: </span>
              <strong style={{ color: '#0f172a' }}>{diasConTurnos} de 7 días</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Capacidad semanal: </span>
              <strong style={{ color: '#0284c7' }}>{totalCuposSemana} cupos de 15 min</strong>
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
            Vista general de disponibilidad
          </div>
        </div>

        {/* CUERPO - GRILLA SEMANAL */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1,
            maxHeight: '520px',
            background: '#ffffff',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem', color: '#0284c7' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Cargando cuadrícula de agenda semanal...</p>
            </div>
          ) : dias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <Calendar size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No se encontraron turnos configurados para este médico.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {dias.map((diaObj, idx) => {
                const turnosDelDia = diaObj.turnos || [];
                const tieneTurnos = turnosDelDia.length > 0;

                return (
                  <div
                    key={idx}
                    style={{
                      background: tieneTurnos ? '#ffffff' : '#f8fafc',
                      border: `1px solid ${tieneTurnos ? '#bae6fd' : '#e2e8f0'}`,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: tieneTurnos ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
                    }}
                  >
                    {/* ENCABEZADO DÍA */}
                    <div
                      style={{
                        padding: '0.6rem 0.5rem',
                        textAlign: 'center',
                        background: tieneTurnos ? '#f0f9ff' : '#f1f5f9',
                        borderBottom: `1px solid ${tieneTurnos ? '#bae6fd' : '#e2e8f0'}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: tieneTurnos ? '#0284c7' : '#94a3b8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {diaObj.nombre}
                      </span>
                    </div>

                    {/* TURNOS DEL DÍA */}
                    <div style={{ padding: '0.65rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {tieneTurnos ? (
                        turnosDelDia.map((t, tIdx) => (
                          <div
                            key={tIdx}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              textAlign: 'center',
                            }}
                          >
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                              {t.hora_inicio} - {t.hora_fin}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                              {t.cupos} cupos (15m)
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            padding: '1.5rem 0.25rem',
                            textAlign: 'center',
                            color: '#94a3b8',
                            fontSize: '0.72rem',
                            fontStyle: 'italic',
                          }}
                        >
                          Libre
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#f8fafc',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgendaSemanalMedico;
