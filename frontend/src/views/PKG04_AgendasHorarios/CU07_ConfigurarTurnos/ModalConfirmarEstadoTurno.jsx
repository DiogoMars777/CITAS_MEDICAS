import React from 'react';
import { AlertTriangle, Check, RefreshCw, X } from 'lucide-react';

export const ModalConfirmarEstadoTurno = ({
  isOpen,
  onClose,
  onConfirm,
  turno,
  nextStatus,
  loading = false,
}) => {
  if (!isOpen || !turno) return null;

  const isDeactivating = nextStatus === 'INACTIVO';

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
          maxWidth: '440px',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            borderRadius: '6px',
          }}
        >
          <X size={18} />
        </button>

        {/* ICONO */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: isDeactivating ? '#fffbeb' : '#ecfdf5',
            color: isDeactivating ? '#d97706' : '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: `1px solid ${isDeactivating ? '#fde68a' : '#a7f3d0'}`,
          }}
        >
          <AlertTriangle size={24} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
          {isDeactivating
            ? `¿Pausar disponibilidad de este turno?`
            : `¿Reactivar turno de atención?`}
        </h3>

        <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
          {isDeactivating ? (
            <>
              Al pausar el turno del día <strong style={{ color: '#0f172a' }}>{turno.dia_nombre}</strong> ({turno.horario_rango}), 
              no se podrán agendar nuevas citas en este horario para <strong style={{ color: '#0f172a' }}>{turno.medico_nombre}</strong>.
            </>
          ) : (
            <>
              El turno del día <strong style={{ color: '#0f172a' }}>{turno.dia_nombre}</strong> ({turno.horario_rango}) 
              volverá a estar disponible para la reserva de citas en bloques de 15 minutos.
            </>
          )}
        </p>

        {/* DETALLE RESUMEN */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            textAlign: 'left',
            fontSize: '0.82rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Médico Asignado</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{turno.medico_nombre}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Cupos de 15m</span>
            <span style={{ color: '#0284c7', fontWeight: 700 }}>{turno.cupos_totales} cupos</span>
          </div>
        </div>

        {/* ACCIONES */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(turno, nextStatus)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: isDeactivating ? '#d97706' : '#0284c7',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: isDeactivating ? '0 2px 4px rgba(217, 119, 6, 0.25)' : '0 2px 4px rgba(2, 132, 199, 0.25)',
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                Procesando...
              </>
            ) : isDeactivating ? (
              <>Pausar Turno</>
            ) : (
              <>
                <Check size={16} />
                Reactivar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarEstadoTurno;
