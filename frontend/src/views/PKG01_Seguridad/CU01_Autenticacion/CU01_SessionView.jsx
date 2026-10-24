import React from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  Key,
  Clock,
  LogOut,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useHoraBoliviana } from '../../../controllers/PKG01_Seguridad/CU02_BitacoraAuditoria/CU02_BitacoraAuditoriaController';

export const CU01_SessionView = ({ currentUser, onLogout, onSwitchToLoginDemo }) => {
  const horaBolivia = useHoraBoliviana();

  return (
    <div style={{ padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto', color: '#0f172a' }}>
      {/* HEADER */}
      <div style={{
        marginBottom: '1.5rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          color: '#0284c7',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.4rem',
        }}>
          <span>Seguridad • CU01</span>
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
          Sesión de Usuario Activa & Políticas de Seguridad
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
          Gestión de token Sanctum, auditoría de credenciales y control de bloqueo de 2 minutos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* CARD 1: DETALLES DE USUARIO */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #0284c7',
          borderRadius: '14px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
            }}>
              <User size={26} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: 800 }}>
                {currentUser?.username || 'Usuario Sistema'}
              </h3>
              <span style={{
                display: 'inline-block',
                marginTop: '0.3rem',
                padding: '0.15rem 0.65rem',
                borderRadius: '6px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#059669',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                ROL: {currentUser?.rol || 'ADMINISTRADOR'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
              <Mail size={16} color="#0284c7" />
              <span>Correo:</span>
              <strong style={{ color: '#0f172a', marginLeft: 'auto', fontWeight: 600 }}>
                {currentUser?.email || 'admin@clinicavidasalud.com'}
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
              <Clock size={16} color="#d97706" />
              <span>Hora Bolivia Actual:</span>
              <strong style={{ color: '#0f172a', marginLeft: 'auto', fontFamily: 'monospace', fontWeight: 600 }}>
                {horaBolivia.time}
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.85rem' }}>
              <Key size={16} color="#7c3aed" />
              <span>Token Sanctum:</span>
              <span style={{ color: '#334155', marginLeft: 'auto', fontFamily: 'monospace', fontSize: '0.78rem', background: '#f8fafc', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                {currentUser?.token ? `${currentUser.token.substring(0, 14)}...` : 'demo_bearer_active'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onLogout}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#dc2626',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
            >
              <LogOut size={16} />
              Cerrar Sesión Activa
            </button>
          </div>
        </div>

        {/* CARD 2: CARACTERÍSTICAS DE SEGURIDAD IMPLEMENTADAS */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #059669',
          borderRadius: '14px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <h3 style={{ margin: '0 0 1.25rem', color: '#0f172a', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#059669" />
            Políticas de Seguridad Verificadas (2026)
          </h3>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong style={{ color: '#0f172a' }}>Bloqueo de 2 minutos (120s):</strong> Aplicado automáticamente en login tras 3 intentos fallidos y en reseteo OTP.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong style={{ color: '#0f172a' }}>Foquitos de contraseña:</strong> Indicadores reactivos que validan 8 caracteres, mayúscula, símbolo y confirmación.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong style={{ color: '#0f172a' }}>Recuperación por Gmail Google:</strong> Código OTP seguro de 6 dígitos con expiración.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong style={{ color: '#0f172a' }}>Trazabilidad en Bitácora (CU02):</strong> Todo inicio y cierre de sesión se audita en PostgreSQL con Hora Boliviana.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CU01_SessionView;
