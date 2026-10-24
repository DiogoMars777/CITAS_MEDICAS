import React from 'react';
import { X, Clock, Calendar, User, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ModalBloquesTurno = ({
  isOpen,
  onClose,
  turno,
}) => {
  if (!isOpen || !turno) return null;

  const bloques = turno.bloques || [];

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
          maxWidth: '680px',
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
              <Clock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Desglose de Bloques de Consulta
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                Intervalos precalculados de 15 minutos para agendamiento
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
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Médico
            </span>
            <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
              {turno.medico_nombre}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Día & Horario
            </span>
            <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
              {turno.dia_nombre} ({turno.horario_rango})
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Duración Bloque
            </span>
            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
              {turno.duracion_bloque_min || 15} min
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Total Cupos
            </span>
            <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
              {bloques.length} cupos generados
            </span>
          </div>
        </div>

        {/* LISTADO DE BLOQUES / SLOTS */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            flex: 1,
            maxHeight: '420px',
            background: '#ffffff',
          }}
        >
          {bloques.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
              <Clock size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No se generaron bloques para este rango de horario.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {bloques.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.65rem 0.75rem',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: '#64748b',
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Cupo #{index + 1}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {slot.etiqueta}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b' }}>
            <ShieldCheck size={16} style={{ color: '#059669' }} />
            <span>Los turnos cumplen validación de no superposición horaria</span>
          </div>
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

export default ModalBloquesTurno;
