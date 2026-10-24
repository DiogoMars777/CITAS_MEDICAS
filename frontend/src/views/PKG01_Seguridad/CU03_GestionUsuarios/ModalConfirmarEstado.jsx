import React from 'react';
import { AlertTriangle, X, Check, RefreshCw } from 'lucide-react';

export const ModalConfirmarEstado = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  nextStatus,
  loading = false,
}) => {
  if (!isOpen || !user) return null;

  const isDeactivating = nextStatus === 'INACTIVO' || nextStatus === 'BLOQUEADO';

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
        maxWidth: '460px',
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        textAlign: 'center',
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
          <AlertTriangle size={26} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          {isDeactivating ? `¿Desactivar a ${user.username}?` : `¿Activar cuenta de ${user.username}?`}
        </h3>

        <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
          El usuario pasará al estado <strong style={{ color: '#0f172a' }}>{nextStatus}</strong>.
          {isDeactivating
            ? ' El usuario no podrá iniciar sesión en la clínica mientras permanezca inactivo, pero se preservarán todos sus registros históricos y auditoría.'
            : ' El usuario recuperará inmediatamente el acceso al sistema con su rol correspondiente.'}
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
            onClick={() => onConfirm(user, nextStatus)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '10px',
              border: 'none',
              background: isDeactivating ? '#dc2626' : '#16a34a',
              color: '#ffffff',
              fontWeight: 700,
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

export default ModalConfirmarEstado;
