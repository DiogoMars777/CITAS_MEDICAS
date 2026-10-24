import React from 'react';
import {
  Layers,
  FileCode2,
  Database,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Server,
  FolderGit2,
} from 'lucide-react';

export const SeniorCUPlaceholder = ({ cu, pkg, onNavigateToCU02 }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#f1f5f9' }}>
      {/* HEADER CARD */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}>
        {/* Glow de fondo con el color del paquete */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '350px',
          height: '350px',
          background: `radial-gradient(circle, ${pkg?.glow || 'rgba(13, 148, 136, 0.3)'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${pkg?.color || '#0d9488'}`,
            color: pkg?.color || '#5eead4',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}>
            <Layers size={13} />
            {pkg?.codigo || 'PAQUETE'}
          </span>

          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            ARQUITECTURA LISTA • FASE DE DESARROLLO
          </span>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0' }}>
          {cu?.numero}: {cu?.titulo}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '750px', lineHeight: 1.6 }}>
          {cu?.descripcion}
        </p>

        {/* ACCIÓN PRINCIPAL: IR A CU02 */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onNavigateToCU02}
            style={{
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <ShieldCheck size={18} />
            Ver CU02: Bitácora de Auditoría en Tiempo Real
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* DETALLES DE INGENIERÍA Y MAPEO MVC */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Backend MVC */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(14, 165, 233, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}>
              <Server size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1rem' }}>Controlador Laravel MVC</h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Estructura por Paquete</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(2, 6, 23, 0.7)',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: '#38bdf8',
            wordBreak: 'break-all',
          }}>
            app/Controllers/{pkg?.codigo}/{cu?.codigo}/{cu?.controlador}.php
          </div>
        </div>

        {/* Card 2: Base de Datos PostgreSQL */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
            }}>
              <Database size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1rem' }}>Tablas PostgreSQL 16</h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Relaciones del Modelo</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {cu?.tablas?.map((tbl, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#6ee7b7',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                }}
              >
                {tbl}
              </span>
            ))}
          </div>
        </div>

        {/* Card 3: Frontend View */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc',
            }}>
              <FileCode2 size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1rem' }}>Frontend React 19 View</h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Capa de Presentación</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(2, 6, 23, 0.7)',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: '#c084fc',
            wordBreak: 'break-all',
          }}>
            src/views/{pkg?.codigo}/{cu?.codigo}/{cu?.numero}_View.jsx
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorCUPlaceholder;
