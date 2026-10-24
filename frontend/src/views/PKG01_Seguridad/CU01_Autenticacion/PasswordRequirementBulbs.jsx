import React from 'react';
import { Lightbulb, CheckCircle2, ShieldAlert } from 'lucide-react';

/**
 * Componente interactivo de "Foquitos" para requerimientos de contraseña
 * Cumple con: Mínimo 8 caracteres, Mayúscula, Minúscula, Número, Símbolo y Confirmación.
 */
export const PasswordRequirementBulbs = ({ requirements }) => {
  const {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    hasMatch,
    passedCount,
  } = requirements;

  const items = [
    {
      id: 'length',
      label: 'Mínimo 8 caracteres',
      valid: hasMinLength,
      detail: 'Longitud mínima',
    },
    {
      id: 'uppercase',
      label: 'Al menos una letra mayúscula (A-Z)',
      valid: hasUppercase,
      detail: 'Mayúscula requerida',
    },
    {
      id: 'lowercase',
      label: 'Al menos una letra minúscula (a-z)',
      valid: hasLowercase,
      detail: 'Minúscula requerida',
    },
    {
      id: 'number',
      label: 'Al menos un número (0-9)',
      valid: hasNumber,
      detail: 'Dígito numérico',
    },
    {
      id: 'symbol',
      label: 'Al menos un símbolo (@, $, !, %, *, #, etc.)',
      valid: hasSymbol,
      detail: 'Carácter especial',
    },
    {
      id: 'match',
      label: 'Confirmar contraseña (coincidencia exacta)',
      valid: hasMatch,
      detail: 'Ambas deben coincidir',
    },
  ];

  const percent = Math.round((passedCount / 6) * 100);

  return (
    <div style={{
      marginTop: '1.25rem',
      padding: '1.15rem',
      borderRadius: '16px',
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Barra de progreso de seguridad */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Seguridad de la Contraseña
        </span>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '20px',
          background: percent === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
          color: percent === 100 ? '#34d399' : '#fbbf24',
          border: percent === 100 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)',
        }}>
          {percent}% Cumplido ({passedCount}/6)
        </span>
      </div>

      <div style={{
        height: '6px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        overflow: 'hidden',
        marginBottom: '1rem',
      }}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          background: percent === 100 
            ? 'linear-gradient(90deg, #10b981, #34d399)' 
            : percent >= 50 
            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
            : 'linear-gradient(90deg, #f43f5e, #fb7185)',
          transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: percent === 100 ? '0 0 10px rgba(16, 185, 129, 0.8)' : 'none',
        }} />
      </div>

      {/* Grid de "Foquitos" Indicadores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '0.65rem',
      }}>
        {items.map((item) => {
          const isOn = item.valid;

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '12px',
                background: isOn ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: isOn 
                  ? '1px solid rgba(16, 185, 129, 0.45)' 
                  : '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.3s ease',
                boxShadow: isOn ? '0 0 14px rgba(16, 185, 129, 0.2)' : 'none',
              }}
            >
              {/* Foquito con Luz / Efecto Iluminado */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isOn
                    ? 'radial-gradient(circle, #34d399 20%, #10b981 70%, #065f46 100%)'
                    : 'rgba(51, 65, 85, 0.4)',
                  boxShadow: isOn
                    ? '0 0 14px #34d399, inset 0 0 6px #ffffff'
                    : 'inset 0 0 3px rgba(0, 0, 0, 0.5)',
                  flexShrink: 0,
                  transition: 'all 0.35s ease',
                }}
              >
                <Lightbulb
                  size={15}
                  color={isOn ? '#ffffff' : '#64748b'}
                  style={{
                    filter: isOn ? 'drop-shadow(0 0 4px #ffffff)' : 'none',
                    transition: 'all 0.3s',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: isOn ? 600 : 400,
                    color: isOn ? '#f0fdf4' : '#94a3b8',
                    transition: 'color 0.25s',
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
