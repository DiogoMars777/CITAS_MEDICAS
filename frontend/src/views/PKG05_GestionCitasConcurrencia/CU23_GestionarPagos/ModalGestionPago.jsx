import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  DollarSign,
  Send,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building,
  Clock,
  User,
  Stethoscope,
  Calendar,
} from 'lucide-react';

export const ModalGestionPago = ({
  isOpen,
  onClose,
  cita,
  currentUser,
  onConfirmarPago,
  loading = false,
}) => {
  const isPaciente = currentUser?.rol === 'Paciente' || currentUser?.rol === 'paciente';

  // Métodos disponibles según actor
  // Recepcionista: EFECTIVO, QR, TRANSFERENCIA
  // Paciente en línea: QR, PAYPAL, TARJETA
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(isPaciente ? 'QR' : 'EFECTIVO');

  const montoInicial = cita?.tarifa_sugerida || 150.0;
  const [monto, setMonto] = useState(montoInicial);

  // Efectivo
  const [montoRecibido, setMontoRecibido] = useState(montoInicial);

  // Transferencia / Tarjeta
  const [bancoEmisor, setBancoEmisor] = useState('Banco Unión S.A.');
  const [numeroTransaccion, setNumeroTransaccion] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('4532 •••• •••• 8821');
  const [titularTarjeta, setTitularTarjeta] = useState(cita?.paciente_nombre || 'JUAN PÉREZ VACA');
  const [vencimientoTarjeta, setVencimientoTarjeta] = useState('12/28');
  const [cvv, setCvv] = useState('782');

  // PayPal
  const [emailPaypal, setEmailPaypal] = useState(currentUser?.email || 'paciente.vida@salud.bo');
  const [paypalRedirigido, setPaypalRedirigido] = useState(false);

  // Temporizador QR (10 minutos)
  const [qrTiempoRestante, setQrTiempoRestante] = useState(600);
  const [qrVerificando, setQrVerificando] = useState(false);

  useEffect(() => {
    if (cita) {
      const tarifa = cita.tarifa_sugerida || (cita.monto ? cita.monto : 150.0);
      setMonto(tarifa);
      setMontoRecibido(tarifa);
      setMetodoSeleccionado(isPaciente ? 'QR' : 'EFECTIVO');
      setPaypalRedirigido(false);
      setQrTiempoRestante(600);
    }
  }, [cita, isPaciente]);

  // Contador regresivo QR
  useEffect(() => {
    if (!isOpen || metodoSeleccionado !== 'QR') return;
    const interval = setInterval(() => {
      setQrTiempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, metodoSeleccionado]);

  if (!isOpen || !cita) return null;

  const cambioEfectivo = Math.max(0, (parseFloat(montoRecibido) || 0) - (parseFloat(monto) || 0));
  const montoUSD = (monto / 6.96).toFixed(2);

  const formatoMinutos = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAbrirPayPal = () => {
    window.open('https://www.sandbox.paypal.com/checkoutnow', '_blank', 'noopener,noreferrer');
    setPaypalRedirigido(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datosPago = {
      id_cita: cita.id_cita,
      monto: parseFloat(monto),
      metodo_pago: metodoSeleccionado,
      canal_pago: isPaciente ? 'EN_LINEA_PACIENTE' : 'RECEPCION',
      monto_recibido: metodoSeleccionado === 'EFECTIVO' ? parseFloat(montoRecibido) : parseFloat(monto),
      referencia_transaccion:
        metodoSeleccionado === 'EFECTIVO'
          ? 'COBRO-CAJA-EFECTIVO'
          : metodoSeleccionado === 'QR'
          ? `QR-BNB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          : metodoSeleccionado === 'PAYPAL'
          ? `PAYID-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
          : numeroTransaccion || `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      email_paypal: metodoSeleccionado === 'PAYPAL' ? emailPaypal : null,
      detalles_pago: {
        banco: bancoEmisor,
        titular: titularTarjeta,
        ultimos4: numeroTarjeta.replace(/\D/g, '').slice(-4) || '4242',
        cambio: metodoSeleccionado === 'EFECTIVO' ? cambioEfectivo : 0,
      },
    };

    onConfirmarPago(datosPago);
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
        zIndex: 1100,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* HEADER MODAL */}
        <div
          style={{
            padding: '1.1rem 1.4rem',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                {isPaciente ? 'Pasarela de Pago de Cita Médica' : 'Caja y Cobro de Cita Médica'}
              </h3>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#bae6fd' }}>
              Clínica Vida Salud • Comprobante Oficial con Validez Institucional
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* RESUMEN DE LA CITA */}
        <div
          style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.85rem 1.4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.6rem',
            fontSize: '0.76rem',
          }}
        >
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>CÓDIGO:</span>
            <span style={{ fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              {cita.codigo_cita}
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>PACIENTE:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              {cita.paciente_nombre}
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>MÉDICO / ESP:</span>
            <span style={{ fontWeight: 700, color: '#334155' }}>
              {cita.especialidad}
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>FECHA / HORA:</span>
            <span style={{ fontWeight: 700, color: '#0369a1' }}>
              {cita.fecha_cita} • {cita.hora_inicio}
            </span>
          </div>
        </div>

        {/* POLÍTICA CLÍNICA INSTITUCIONAL (IMPORTANTE) */}
        <div
          style={{
            padding: '0.6rem 1.4rem',
            background: '#fffbeb',
            borderBottom: '1px solid #fef3c7',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.72rem',
            color: '#92400e',
            lineHeight: 1.35,
          }}
        >
          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0 }} />
          <span>
            <strong>Política de Clínica Vida Salud:</strong> No se aceptan devoluciones de dinero si se cancela la cita. La cita cuenta con <strong>reprogramación garantizada</strong> para otra fecha disponible.
          </span>
        </div>

        {/* TABS DE SELECCIÓN DE MÉTODO DE PAGO */}
        <div style={{ padding: '1rem 1.4rem 0.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '0.4rem' }}>
            SELECCIONA EL MÉTODO DE PAGO:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {/* Opciones para Recepcionista */}
            {!isPaciente && (
              <>
                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('EFECTIVO')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'EFECTIVO' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'EFECTIVO' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'EFECTIVO' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <DollarSign size={20} />
                  <span>Efectivo (Caja)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('QR')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'QR' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'QR' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'QR' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <QrCode size={20} />
                  <span>QR Simple (Bolivia)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('TRANSFERENCIA')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'TRANSFERENCIA' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'TRANSFERENCIA' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'TRANSFERENCIA' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Building size={20} />
                  <span>Transferencia / Tarjeta</span>
                </button>
              </>
            )}

            {/* Opciones para Paciente en Línea */}
            {isPaciente && (
              <>
                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('QR')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'QR' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'QR' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'QR' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <QrCode size={20} />
                  <span>QR Simple Bolivia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('PAYPAL')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'PAYPAL' ? '2px solid #0070ba' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'PAYPAL' ? '#f0f7ff' : '#ffffff',
                    color: metodoSeleccionado === 'PAYPAL' ? '#003087' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#003087' }}>P</span>
                  <span>PayPal Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('TARJETA')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'TARJETA' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'TARJETA' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'TARJETA' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CreditCard size={20} />
                  <span>Tarjeta Débito/Crédito</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* CUERPO INTERACTIVO POR MÉTODO */}
        <form onSubmit={handleSubmit} style={{ padding: '0.5rem 1.4rem 1.25rem', overflowY: 'auto' }}>
          {/* 1. SECCIÓN EFECTIVO */}
          {metodoSeleccionado === 'EFECTIVO' && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>Total a Cobrar (Bs):</label>
                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>Efectivo Recibido (Bs):</label>
                  <input
                    type="number"
                    value={montoRecibido}
                    onChange={(e) => setMontoRecibido(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>

              {/* Botones rápidos de billetes bolivianos */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center', fontWeight: 600 }}>Rápido:</span>
                {[monto, 100, 150, 200, 500].map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMontoRecibido(v)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    Bs. {v}
                  </button>
                ))}
              </div>

              {/* Cálculo de vuelto / cambio */}
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: cambioEfectivo >= 0 ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${cambioEfectivo >= 0 ? '#bbf7d0' : '#fecaca'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: cambioEfectivo >= 0 ? '#15803d' : '#b91c1c' }}>
                  {cambioEfectivo >= 0 ? 'Cambio / Vuelto a Devolver:' : 'Efectivo Insuficiente:'}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: cambioEfectivo >= 0 ? '#166534' : '#dc2626' }}>
                  Bs. {cambioEfectivo.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* 2. SECCIÓN QR SIMPLE BOLIVIA */}
          {metodoSeleccionado === 'QR' && (
            <div
              style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.74rem',
                  color: '#0284c7',
                  fontWeight: 800,
                  marginBottom: '0.4rem',
                }}
              >
                <Clock size={14} />
                <span>QR Simple • Expira en: {formatoMinutos(qrTiempoRestante)}</span>
              </div>

              {/* QR CODE REALISTA EN CANVAS / SVG */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '2px solid #bae6fd',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '0.6rem',
                }}
              >
                <svg width="150" height="150" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Patrones de esquina QR oficiales */}
                  <rect x="5" y="5" width="26" height="26" fill="#0369a1" />
                  <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
                  <rect x="13" y="13" width="10" height="10" fill="#0369a1" />

                  <rect x="69" y="5" width="26" height="26" fill="#0369a1" />
                  <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
                  <rect x="77" y="13" width="10" height="10" fill="#0369a1" />

                  <rect x="5" y="69" width="26" height="26" fill="#0369a1" />
                  <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
                  <rect x="13" y="77" width="10" height="10" fill="#0369a1" />

                  {/* Datos QR simulados */}
                  <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="14" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="24" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="28" width="6" height="6" fill="#0f172a" />
                  <rect x="8" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="20" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="38" width="14" height="14" fill="#0284c7" />
                  <rect x="54" y="42" width="8" height="8" fill="#0f172a" />
                  <rect x="68" y="36" width="6" height="6" fill="#0f172a" />
                  <rect x="80" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="58" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="66" width="6" height="6" fill="#0f172a" />
                  <rect x="58" y="58" width="6" height="6" fill="#0f172a" />
                  <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="78" y="60" width="8" height="8" fill="#0f172a" />
                  <rect x="84" y="76" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="78" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="84" width="6" height="6" fill="#0f172a" />
                  <rect x="60" y="78" width="6" height="6" fill="#0f172a" />

                  {/* Logo central Cruz Médica */}
                  <rect x="43" y="43" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="47" y="45" width="6" height="10" fill="#dc2626" />
                  <rect x="45" y="47" width="10" height="6" fill="#dc2626" />
                </svg>

                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0369a1', marginTop: '4px' }}>
                  CLÍNICA VIDA SALUD • QR SIMPLE BCP / BANCO UNIÓN
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                Monto: Bs. {parseFloat(monto).toFixed(2)}
              </div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', maxWidth: '380px' }}>
                Escanea desde la app de cualquier banco boliviano (Banco Unión, BCP, BNB, Banco Mercantil, GanaMóvil).
              </p>
            </div>
          )}

          {/* 3. SECCIÓN PAYPAL CHECKOUT */}
          {metodoSeleccionado === 'PAYPAL' && (
            <div
              style={{
                background: '#f8fafc',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#003087',
                  color: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>PayPal Express Checkout</div>
                  <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Pasarela de pago internacional segura</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>${montoUSD} USD</div>
                  <div style={{ fontSize: '0.65rem', color: '#93c5fd' }}>(Equiv. a Bs. {monto})</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>
                  Correo de cuenta PayPal:
                </label>
                <input
                  type="email"
                  value={emailPaypal}
                  onChange={(e) => setEmailPaypal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    background: '#ffffff',
                  }}
                />
              </div>

              {/* Botón oficial de Redirección PayPal */}
              <button
                type="button"
                onClick={handleAbrirPayPal}
                style={{
                  background: '#ffc439',
                  border: '1px solid #f2ba36',
                  borderRadius: '24px',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  color: '#003087',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Pagar con</span>
                <span style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem' }}>PayPal</span>
                <ExternalLink size={15} />
              </button>

              {paypalRedirigido && (
                <div
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    fontSize: '0.74rem',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckCircle size={16} />
                  <span>
                    Ventana de PayPal abierta. Tras autorizar el cobro, pulsa el botón inferior para confirmar la reserva.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 4. SECCIÓN TARJETA / TRANSFERENCIA BANCARIA */}
          {(metodoSeleccionado === 'TARJETA' || metodoSeleccionado === 'TRANSFERENCIA') && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {/* Tarjeta visual 3D interactiva */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  color: '#ffffff',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  marginBottom: '0.85rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#94a3b8', fontWeight: 700 }}>
                    RED ENLACE • BOLIVIA
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, fontStyle: 'italic', color: '#38bdf8' }}>
                    VISA
                  </span>
                </div>

                <div style={{ fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 700, marginBottom: '0.8rem', fontFamily: 'monospace' }}>
                  {numeroTarjeta}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.72rem' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.62rem' }}>TITULAR:</span>
                    <span style={{ fontWeight: 700 }}>{titularTarjeta}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.62rem' }}>VENCE:</span>
                    <span style={{ fontWeight: 700 }}>{vencimientoTarjeta}</span>
                  </div>
                </div>
              </div>

              {/* Formulario de tarjeta o transferencia */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Banco Emisor:</label>
                  <select
                    value={bancoEmisor}
                    onChange={(e) => setBancoEmisor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      background: '#ffffff',
                    }}
                  >
                    <option value="Banco Unión S.A.">Banco Unión S.A.</option>
                    <option value="Banco de Crédito BCP">Banco de Crédito BCP</option>
                    <option value="Banco Nacional de Bolivia (BNB)">Banco Nacional de Bolivia (BNB)</option>
                    <option value="Banco Mercantil Santa Cruz">Banco Mercantil Santa Cruz</option>
                    <option value="Banco Ganadero">Banco Ganadero</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                    {metodoSeleccionado === 'TARJETA' ? 'CVV / Código de Seguridad:' : 'Nº Transacción / Voucher:'}
                  </label>
                  <input
                    type="text"
                    value={metodoSeleccionado === 'TARJETA' ? cvv : numeroTransaccion}
                    onChange={(e) =>
                      metodoSeleccionado === 'TARJETA' ? setCvv(e.target.value) : setNumeroTransaccion(e.target.value)
                    }
                    placeholder={metodoSeleccionado === 'TARJETA' ? '782' : 'Ej: 9840215'}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div
            style={{
              marginTop: '1.1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
              }}
            >
              {loading ? (
                <span>Procesando pago...</span>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>
                    Confirmar Cobro de Bs. {parseFloat(monto).toFixed(2)}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGestionPago;
