import React from 'react';
import { X, Clock, Calendar, User, ShieldAlert, CheckCircle2, AlertCircle, ArrowRight, Layers } from 'lucide-react';
import { ESTADOS_SLOT } from '../../../models/PKG04_AgendasHorarios/CU09_ConsultarDisponibilidad/DisponibilidadModel';

export const ModalDetalleSlot = ({
  isOpen,
  onClose,
  slot,
  medico,
  fecha,
  onReservar = null,
}) => {
  if (!isOpen || !slot || !medico) return null;

  const estadoCfg = ESTADOS_SLOT[slot.estado] || ESTADOS_SLOT.DISPONIBLE;
  const isDisponible = slot.estado === 'DISPONIBLE';

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
          maxWidth: '500px',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
      >
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: estadoCfg.bg,
              color: estadoCfg.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${estadoCfg.border}`,
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: estadoCfg.text,
              }}
            >
              {estadoCfg.label}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              {slot.intervalo}
            </h3>
          </div>
        </div>

        {/* DETALLE MÉDICO & FECHA */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <User size={16} style={{ color: '#0284c7' }} />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                {medico.nombre_completo}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                {medico.especialidad_principal}
                {medico.matricula && ` • Reg: ${medico.matricula}`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Calendar size={16} style={{ color: '#0284c7' }} />
            <div style={{ fontSize: '0.82rem', color: '#475569' }}>
              Fecha: <strong style={{ color: '#0f172a' }}>{fecha}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Layers size={16} style={{ color: '#64748b' }} />
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Duración: <strong style={{ color: '#0f172a' }}>{slot.duracion_min || 15} minutos</strong> (Estándar clínico)
            </div>
          </div>
        </div>

        {/* INFORMACIÓN SEGÚN ESTADO */}
        {slot.estado === 'BLOQUEADO' && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 500,
            }}
          >
            <ShieldAlert size={16} />
            <span>{slot.motivo || 'Horario bloqueado administrativamente.'}</span>
          </div>
        )}

        {slot.estado === 'OCUPADO' && slot.cita && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>Cita Agendada: #{slot.cita.codigo}</div>
            <div style={{ fontSize: '0.78rem', color: '#b91c1c' }}>Paciente: {slot.cita.paciente}</div>
          </div>
        )}

        {slot.estado === 'EXPIRADO' && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
            }}
          >
            {slot.motivo || 'Este bloque horario ya transcurrió en el día de hoy.'}
          </div>
        )}

        {/* ACCIONES */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.84rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>

          {isDisponible && (
            <button
              type="button"
              onClick={() => {
                if (onReservar) onReservar(slot, medico, fecha);
                onClose();
              }}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
              }}
            >
              <span>Seleccionar para Reservar</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleSlot;
