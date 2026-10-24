import React from 'react';
import { AlertTriangle, Check, RefreshCw } from 'lucide-react';

export const ModalConfirmarEstadoPac = ({
  isOpen,
  onClose,
  onConfirm,
  paciente,
  nextStatus,
  loading = false,
}) => {
  if (!isOpen || !paciente) return null;

  const isDeactivating = nextStatus === 'INACTIVO';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.25rem',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        padding: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* ICONO */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: isDeactivating ? '#fef2f2' : '#ecfdf5',
          color: isDeactivating ? '#dc2626' : '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          border: `1px solid ${isDeactivating ? '#fecaca' : '#a7f3d0'}`,
        }}>
          <AlertTriangle size={24} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
          {isDeactivating ? `¿Suspender ficha de ${paciente.nombre_completo}?` : `¿Reactivar ficha de ${paciente.nombre_completo}?`}
        </h3>

        <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
          {isDeactivating ? (
            <>
              El paciente pasará a estado <strong style={{ color: '#0f172a' }}>INACTIVO</strong>. Se suspenderá la posibilidad de agendar nuevas citas médicas mientras esté inactivo. Su historial clínico, expediente y antecedentes se conservan íntegramente.
            </>
          ) : (
            <>
              La ficha del paciente pasará a estado <strong style={{ color: '#0f172a' }}>ACTIVO</strong>. Podrá agendar citas médicas y acceder a su historial digital inmediatamente.
            </>
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(paciente, nextStatus)}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              background: isDeactivating ? '#dc2626' : '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: isDeactivating ? '0 2px 4px rgba(220, 38, 38, 0.25)' : '0 2px 4px rgba(2, 132, 199, 0.25)',
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Check size={16} />
                Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarEstadoPac;
