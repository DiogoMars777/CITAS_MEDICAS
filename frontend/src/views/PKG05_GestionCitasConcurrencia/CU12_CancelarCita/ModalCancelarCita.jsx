import React, { useState } from 'react';
import { AlertTriangle, X, RefreshCw, CheckCircle2, Calendar, Clock, User } from 'lucide-react';

export const ModalCancelarCita = ({ isOpen, onClose, onConfirm, cita, loading = false }) => {
  const [motivo, setMotivo] = useState('');
  const [localError, setLocalError] = useState(null);

  if (!isOpen || !cita) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!motivo.trim() || motivo.trim().length < 4) {
      setLocalError('Por favor ingrese un motivo de cancelación detallado (mínimo 4 caracteres).');
      return;
    }

    const res = await onConfirm(cita.id_cita, motivo.trim());
    if (!res.success) {
      setLocalError(res.message);
    } else {
      setMotivo('');
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #fecaca',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Cancelar Cita Médica
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                Liberación inmediata de cupo horario en agenda clínica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENIDO */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.4rem' }}>
          {localError && (
            <div
              style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '0.8rem',
                marginBottom: '1rem',
              }}
            >
              {localError}
            </div>
          )}

          {/* DETALLES DE LA CITA */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Código Cita:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                {cita.codigo_cita}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Paciente:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{cita.paciente_nombre}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Médico:</span>
              <span style={{ color: '#334155' }}>{cita.medico_nombre}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Horario Actual:</span>
              <span style={{ color: '#d97706', fontWeight: 700 }}>
                {cita.fecha_cita} • {cita.horario_rango || `${cita.hora_inicio} - ${cita.hora_fin}`}
              </span>
            </div>
          </div>

          {/* ADVERTENCIA DE LIBERACIÓN */}
          <div
            style={{
              padding: '0.7rem 0.85rem',
              borderRadius: '8px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.76rem',
              marginBottom: '1rem',
              lineHeight: 1.4,
            }}
          >
            ℹ️ Al confirmar la cancelación, este cupo quedará <strong>DISPONIBLE</strong> inmediatamente en la agenda médica para que otros pacientes puedan reservarlo.
          </div>

          {/* MOTIVO DE CANCELACIÓN */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', fontWeight: 600, marginBottom: '5px' }}>
              Motivo de la Cancelación (Auditable) *
            </label>
            <textarea
              rows={3}
              placeholder="Indique la razón: solicitud del paciente, reprogramación externa, fuerza mayor..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.65rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Volver
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Cancelando...
                </>
              ) : (
                <>
                  <AlertTriangle size={14} />
                  Confirmar Cancelación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCancelarCita;
