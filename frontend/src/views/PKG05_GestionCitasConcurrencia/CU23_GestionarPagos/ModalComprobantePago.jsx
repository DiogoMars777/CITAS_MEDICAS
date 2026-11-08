import React, { useRef } from 'react';
import { X, Printer, CheckCircle, ShieldCheck, QrCode, FileText, HeartPulse } from 'lucide-react';

export const ModalComprobantePago = ({ isOpen, onClose, comprobante }) => {
  const printRef = useRef(null);

  if (!isOpen || !comprobante) return null;

  const handleImprimir = () => {
    window.print();
  };

  const c = comprobante;

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
        zIndex: 1200,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* HEADER DE LA VENTANA */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', fontWeight: 700 }}>
            <FileText size={16} color="#38bdf8" />
            <span>Recibo Oficial de Cobro • Clínica Vida Salud</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* RECIBO OFICIAL IMPRIMIBLE */}
        <div
          ref={printRef}
          style={{
            padding: '1.75rem',
            overflowY: 'auto',
            flex: 1,
            color: '#0f172a',
            fontFamily: 'system-ui, sans-serif',
          }}
          className="print-receipt"
        >
          {/* MEMBRETE INSTITUCIONAL */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 900, fontSize: '1.15rem' }}>
              <HeartPulse size={22} color="#0284c7" />
              <span>CLÍNICA VIDA SALUD S.R.L.</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px' }}>
              NIT: 1028473029 • Santa Cruz de la Sierra, Bolivia
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              Av. San Martín #450, Equipetrol • Tel: +591 (3) 345-6789
            </div>
            <div style={{ marginTop: '0.4rem', display: 'inline-block', padding: '2px 10px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', fontWeight: 800, fontSize: '0.72rem' }}>
              COMPROBANTE DE PAGO: {c.comprobante?.numero_comprobante}
            </div>
          </div>

          {/* DATOS DEL COMPROBANTE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.74rem', marginBottom: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>FECHA DE EMISIÓN:</span>
              <span style={{ fontWeight: 700 }}>{c.comprobante?.fecha_emision}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>CÓDIGO DE CONTROL / PAGO:</span>
              <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0284c7' }}>{c.comprobante?.codigo_pago}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>PACIENTE:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{c.paciente?.nombre_completo}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>C.I. / DOCUMENTO:</span>
              <span style={{ fontWeight: 700 }}>{c.paciente?.ci || 'S/N'}</span>
            </div>
          </div>

          {/* DETALLE DEL SERVICIO MÉDICO */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.85rem', fontSize: '0.74rem' }}>
            <div style={{ fontWeight: 800, color: '#0369a1', marginBottom: '0.3rem', fontSize: '0.76rem' }}>
              DETALLE DE ATENCIÓN MÉDICA:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.66rem' }}>CÓDIGO CITA:</span>
                <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>{c.servicio?.codigo_cita}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.66rem' }}>ESPECIALIDAD:</span>
                <div style={{ fontWeight: 700 }}>{c.servicio?.especialidad}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.66rem' }}>MÉDICO TRATANTE:</span>
                <div style={{ fontWeight: 600 }}>{c.servicio?.medico}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.66rem' }}>FECHA Y TURNO:</span>
                <div style={{ fontWeight: 700, color: '#0284c7' }}>{c.servicio?.fecha_cita} • {c.servicio?.horario}</div>
              </div>
            </div>
          </div>

          {/* MONTO Y FORMA DE PAGO */}
          <div style={{ border: '2px solid #bae6fd', borderRadius: '10px', padding: '0.75rem', background: '#f0f9ff', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1' }}>IMPORTE TOTAL PAGADO:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7' }}>
                Bs. {parseFloat(c.pago?.monto).toFixed(2)}
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#475569', fontStyle: 'italic', marginBottom: '0.4rem' }}>
              SON: {c.pago?.monto_literal}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.4rem' }}>
              <span><strong>Método:</strong> {c.pago?.metodo_pago}</span>
              <span><strong>Ref:</strong> {c.pago?.referencia}</span>
              <span><strong>Cajero/Emisor:</strong> {c.pago?.cajero_responsable}</span>
            </div>
          </div>

          {/* POLÍTICA CLÍNICA Y CÓDIGO QR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.6rem' }}>
            <div style={{ flexShrink: 0 }}>
              <QrCode size={40} color="#b45309" />
            </div>
            <div style={{ fontSize: '0.66rem', color: '#92400e', lineHeight: 1.35 }}>
              <strong>POLÍTICA DE REEMBOLSO:</strong> De acuerdo con el reglamento de Clínica Vida Salud, <strong>no se aceptan devoluciones de dinero</strong> en caso de cancelación de la cita. El pago efectuado cuenta con <strong>reprogramación garantizada</strong> para una nueva fecha u horario.
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.62rem', color: '#94a3b8' }}>
            Documento digital oficial emitido por Sistema CVS-2026 • Conservar para control en recepción médica.
          </div>
        </div>

        {/* ACCIONES DEL MODAL */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={handleImprimir}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            }}
          >
            <Printer size={15} />
            <span>Imprimir Recibo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalComprobantePago;

