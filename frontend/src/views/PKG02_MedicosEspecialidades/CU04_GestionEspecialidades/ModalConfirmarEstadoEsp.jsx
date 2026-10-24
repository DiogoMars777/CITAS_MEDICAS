import React from 'react';
import { AlertTriangle, Check, RefreshCw, X } from 'lucide-react';

export const ModalConfirmarEstadoEsp = ({
  isOpen,
  onClose,
  onConfirm,
  especialidad,
  nextStatus,
  loading = false,
}) => {
  if (!isOpen || !especialidad) return null;

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
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* ICONO */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: isDeactivating ? '#fef2f2' : '#f0fdf4',
          color: isDeactivating ? '#dc2626' : '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.15rem',
          border: `1px solid ${isDeactivating ? '#fecaca' : '#bbf7d0'}`,
        }}>
          <AlertTriangle size={24} />
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
          {isDeactivating ? `¿Desactivar ${especialidad.nombre}?` : `¿Activar ${especialidad.nombre}?`}
        </h3>

        <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.55, margin: '0 0 1.5rem' }}>
          {isDeactivating ? (
            <>
              La especialidad pasará a estado <strong style={{ color: '#0f172a' }}>INACTIVO</strong>. No podrá seleccionarse para agendar nuevas citas médicas hasta que vuelva a activarse. Los historiales se preservan intactos.
            </>
          ) : (
            <>
              La especialidad pasará a estado <strong style={{ color: '#0f172a' }}>ACTIVO</strong> y estará disponible inmediatamente para la asignación de médicos y programación de citas.
            </>
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(especialidad, nextStatus)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '10px',
              border: 'none',
              background: isDeactivating ? '#dc2626' : '#16a34a',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: isDeactivating ? '0 2px 4px rgba(220, 38, 38, 0.25)' : '0 2px 4px rgba(22, 163, 74, 0.25)',
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
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

export default ModalConfirmarEstadoEsp;
