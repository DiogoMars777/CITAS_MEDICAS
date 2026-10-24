import React from 'react';
import {
  X,
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  FileText,
  CalendarCheck,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { ESTADOS_PACIENTE } from '../../../models/PKG03_PacientesHistorial/CU06_RegistroPaciente/PacienteModel';

export const ModalDetallePaciente = ({ isOpen, onClose, paciente }) => {
  if (!isOpen || !paciente) return null;

  const estadoCfg = ESTADOS_PACIENTE[paciente.estado] || ESTADOS_PACIENTE.ACTIVO;

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
        maxWidth: '560px',
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}>
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            padding: '0.35rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
          }}
        >
          <X size={18} />
        </button>

        {/* CABECERA PACIENTE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.2rem',
          }}>
            {(paciente.nombres || 'P')[0]}
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ficha Clínica de Paciente
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0.1rem 0' }}>
              {paciente.nombre_completo}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.74rem',
                color: paciente.estado === 'ACTIVO' ? '#059669' : '#64748b',
                background: paciente.estado === 'ACTIVO' ? '#ecfdf5' : '#f8fafc',
                border: `1px solid ${paciente.estado === 'ACTIVO' ? '#a7f3d0' : '#e2e8f0'}`,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                fontWeight: 700,
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: paciente.estado === 'ACTIVO' ? '#059669' : '#94a3b8' }} />
                {paciente.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
              </span>

              <span style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                <CreditCard size={13} color="#0284c7" />
                CI: {paciente.ci}
              </span>

              {paciente.primera_visita && (
                <span style={{
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  color: '#b45309',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  Primera Visita
                </span>
              )}
            </div>
          </div>
        </div>

        {/* EXPEDIENTE CLÍNICO */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '10px',
          padding: '0.9rem 1.1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Expediente Clínico
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
              {paciente.numero_expediente || 'Sin expediente'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Tipo de Sangre
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', marginTop: '0.15rem' }}>
              {paciente.tipo_sangre || 'No registrado'}
            </div>
          </div>
        </div>

        {/* ALERGIAS Y ANTECEDENTES */}
        {paciente.alergias && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#991b1b',
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, color: '#dc2626' }} />
            <span>Alergias médicas registradas: <strong>{paciente.alergias}</strong></span>
          </div>
        )}

        {/* GRILLA DE DATOS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '1rem',
          fontSize: '0.82rem',
          marginBottom: '1.25rem',
        }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Calendar size={13} style={{ color: '#0284c7' }} /> Edad y Nacimiento
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {paciente.edad !== null ? `${paciente.edad} años` : 'N/A'} ({paciente.fecha_nacimiento})
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Phone size={13} style={{ color: '#0284c7' }} /> Teléfono
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {paciente.telefono || 'No registrado'}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Mail size={13} style={{ color: '#0284c7' }} /> Correo Electrónico
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {paciente.email || 'Sin correo'}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <User size={13} style={{ color: '#0284c7' }} /> Usuario Digital
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {paciente.username || 'Sin cuenta web'}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Heart size={13} style={{ color: '#d97706' }} /> Contacto de Emergencia
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {paciente.contacto_emergencia
                ? `${paciente.contacto_emergencia.nombre} (${paciente.contacto_emergencia.parentesco}) - Tel: ${paciente.contacto_emergencia.telefono}`
                : 'No registrado'}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <CalendarCheck size={13} style={{ color: '#059669' }} /> Citas en Clínica
            </div>
            <div style={{ color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
              {paciente.total_citas || 0} cita(s)
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.65rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.84rem',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          Cerrar Ficha
        </button>
      </div>
    </div>
  );
};

export default ModalDetallePaciente;
