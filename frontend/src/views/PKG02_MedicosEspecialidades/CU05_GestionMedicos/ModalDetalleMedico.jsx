import React from 'react';
import {
  X,
  Stethoscope,
  BadgeCheck,
  Mail,
  Phone,
  Calendar,
  User,
  Star,
  CalendarCheck,
} from 'lucide-react';
import { ESTADOS_MEDICO } from '../../../models/PKG02_MedicosEspecialidades/CU05_GestionMedicos/MedicoModel';

export const ModalDetalleMedico = ({ isOpen, onClose, medico }) => {
  if (!isOpen || !medico) return null;

  const estadoCfg = ESTADOS_MEDICO[medico.estado] || ESTADOS_MEDICO.ACTIVO;

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
        maxWidth: '540px',
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
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
            color: '#94a3b8',
            padding: '0.4rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
          }}
        >
          <X size={18} />
        </button>

        {/* CABECERA PERFIL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}>
            {(medico.nombres || 'M')[0]}
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ficha del Facultativo
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>
              Dr(a). {medico.nombre_completo}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.74rem',
                color: estadoCfg.color,
                background: estadoCfg.bg,
                border: `1px solid ${estadoCfg.border}`,
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontWeight: 600,
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: estadoCfg.color }} />
                {estadoCfg.label}
              </span>

              <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <BadgeCheck size={14} color="#0284c7" />
                Matrícula: <strong style={{ color: '#334155' }}>{medico.numero_registro_profesional}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ESPECIALIDADES */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.55rem' }}>
            Especialidades Médicas Asignadas
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {medico.especialidades && medico.especialidades.length > 0 ? (
              medico.especialidades.map((esp) => (
                <span
                  key={esp.id_especialidad}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '8px',
                    background: esp.es_principal ? '#f0f9ff' : '#f8fafc',
                    border: esp.es_principal ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                    color: esp.es_principal ? '#0284c7' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: esp.es_principal ? 700 : 500,
                  }}
                >
                  <Stethoscope size={14} color={esp.es_principal ? '#0284c7' : '#64748b'} />
                  {esp.nombre}
                  {esp.es_principal && <Star size={12} fill="#0284c7" color="#0284c7" />}
                </span>
              ))
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontStyle: 'italic' }}>
                Sin especialidades vinculadas
              </span>
            )}
          </div>
        </div>

        {/* DATOS DE CONTACTO Y SISTEMA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem',
          fontSize: '0.82rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={13} color="#0284c7" /> Teléfono
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {medico.telefono || 'No registrado'}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={13} color="#0284c7" /> Correo Electrónico
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {medico.email || 'No registrado'}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={13} color="#0284c7" /> Usuario de Sistema
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {medico.username || `ID #${medico.id_usuario}`}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={13} color="#0284c7" /> Fecha de Ingreso
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {medico.fecha_ingreso || 'No registrada'}
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CalendarCheck size={13} color="#059669" /> Citas Totales
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              {medico.total_citas || 0} cita(s)
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.74rem' }}>
              ID Facultativo
            </div>
            <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
              #{medico.id_medico}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
        >
          Cerrar Ficha
        </button>
      </div>
    </div>
  );
};

export default ModalDetalleMedico;
