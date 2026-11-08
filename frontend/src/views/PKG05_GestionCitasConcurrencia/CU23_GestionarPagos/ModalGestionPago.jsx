import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  DollarSign,
  Building,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Wifi,
  Sparkles,
  ArrowRight,
  Clock,
  User,
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

  // Métodos disponibles según actor:
  // Recepcionista: EFECTIVO, QR, TARJETA, TRANSFERENCIA
  // Paciente en línea: TARJETA, QR, PAYPAL
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(isPaciente ? 'TARJETA' : 'EFECTIVO');

  const montoInicial = cita?.tarifa_sugerida || (cita?.monto ? cita.monto : 150.0);
  const [monto, setMonto] = useState(montoInicial);

  // Efectivo
  const [montoRecibido, setMontoRecibido] = useState(montoInicial);

  // Tarjeta de Débito / Crédito (Interactiva y realista)
  const [numeroTarjeta, setNumeroTarjeta] = useState('4532 8910 2341 8821');
  const [titularTarjeta, setTitularTarjeta] = useState(cita?.paciente_nombre || 'MARIANA CLAUDIA ROCA');
  const [vencimientoTarjeta, setVencimientoTarjeta] = useState('12/28');
  const [cvv, setCvv] = useState('782');
  const [mostrarCvv, setMostrarCvv] = useState(false);
  const [bancoEmisor, setBancoEmisor] = useState('Banco Unión S.A.');
  const [tipoTarjeta, setTipoTarjeta] = useState('DEBITO'); // DEBITO | CREDITO

  // Estado de autorización bancaria en pantalla
  const [autorizandoPago, setAutorizandoPago] = useState(false);
  const [pasoAutorizacion, setPasoAutorizacion] = useState(0);

  // Transferencia Bancaria Directa
  const [bancoOrigenTrf, setBancoOrigenTrf] = useState('Banco de Crédito BCP');
  const [numeroVoucherTrf, setNumeroVoucherTrf] = useState('9840215');
  const [titularCuentaTrf, setTitularCuentaTrf] = useState(cita?.paciente_nombre || '');

  // PayPal
  const [emailPaypal, setEmailPaypal] = useState(currentUser?.email || 'paciente.vida@salud.bo');
  const [paypalRedirigido, setPaypalRedirigido] = useState(false);

  // Temporizador QR (10 minutos)
  const [qrTiempoRestante, setQrTiempoRestante] = useState(600);
  const [qrVerificando, setQrVerificando] = useState(false);
  const [qrVerificadoExito, setQrVerificadoExito] = useState(false);

  useEffect(() => {
    if (cita) {
      const tarifa = cita.tarifa_sugerida || (cita.monto ? cita.monto : 150.0);
      setMonto(tarifa);
      setMontoRecibido(tarifa);
      setMetodoSeleccionado(isPaciente ? 'TARJETA' : 'EFECTIVO');
      setTitularTarjeta(cita.paciente_nombre || 'MARIANA CLAUDIA ROCA');
      setTitularCuentaTrf(cita.paciente_nombre || '');
      setPaypalRedirigido(false);
      setQrTiempoRestante(600);
      setQrVerificadoExito(false);
      setAutorizandoPago(false);
      setPasoAutorizacion(0);
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

  // Detección automática de marca de tarjeta según los primeros dígitos
  const detectarMarcaTarjeta = (num) => {
    const limpio = (num || '').replace(/\s+/g, '');
    if (limpio.startsWith('4')) return { marca: 'VISA', color: '#1e3a8a', label: 'Visa' };
    if (/^(5[1-5]|2[2-7])/.test(limpio)) return { marca: 'MASTERCARD', color: '#ea580c', label: 'Mastercard' };
    if (/^3[47]/.test(limpio)) return { marca: 'AMEX', color: '#047857', label: 'American Express' };
    return { marca: 'RED_ENLACE', color: '#0284c7', label: 'Red Enlace' };
  };

  const redTarjeta = detectarMarcaTarjeta(numeroTarjeta);

  // Formateador de número de tarjeta con espacios cada 4 dígitos
  const handleCambioNumeroTarjeta = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formateado = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNumeroTarjeta(formateado);
  };

  // Formateador de vencimiento MM/AA
  const handleCambioVencimiento = (e) => {
    let valor = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (valor.length >= 2) {
      const mes = parseInt(valor.slice(0, 2), 10);
      if (mes > 12) valor = '12' + valor.slice(2);
      if (mes === 0) valor = '01' + valor.slice(2);
      valor = valor.slice(0, 2) + '/' + valor.slice(2);
    }
    setVencimientoTarjeta(valor);
  };

  // Carga rápida de tarjetas institucionales
  const cargarTarjetaRapida = (tipo) => {
    if (tipo === 'VISA') {
      setNumeroTarjeta('4532 8910 2341 8821');
      setVencimientoTarjeta('12/28');
      setCvv('782');
      setBancoEmisor('Banco Unión S.A.');
    } else if (tipo === 'MASTERCARD') {
      setNumeroTarjeta('5412 7512 8901 4432');
      setVencimientoTarjeta('09/27');
      setCvv('356');
      setBancoEmisor('Banco de Crédito BCP');
    } else if (tipo === 'BNB') {
      setNumeroTarjeta('4111 2233 4455 6677');
      setVencimientoTarjeta('04/29');
      setCvv('912');
      setBancoEmisor('Banco Nacional de Bolivia (BNB)');
    }
  };

  const handleAbrirPayPal = () => {
    window.open('https://www.sandbox.paypal.com/checkoutnow', '_blank', 'noopener,noreferrer');
    setPaypalRedirigido(true);
  };

  const handleVerificarQRManual = () => {
    setQrVerificando(true);
    setTimeout(() => {
      setQrVerificando(false);
      setQrVerificadoExito(true);
    }, 1200);
  };

  // Formateador visual para el plástico de la tarjeta (con máscara de puntos)
  const obtenerNumeroTarjetaVisual = () => {
    const raw = numeroTarjeta.replace(/\s+/g, '');
    let display = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) display += '   ';
      display += raw[i] ? raw[i] : '•';
    }
    return display;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si es tarjeta, reproducir la secuencia de procesamiento bancario seguro
    if (metodoSeleccionado === 'TARJETA') {
      setAutorizandoPago(true);
      setPasoAutorizacion(1);

      setTimeout(() => {
        setPasoAutorizacion(2);
      }, 900);

      setTimeout(() => {
        setPasoAutorizacion(3);
      }, 1800);

      setTimeout(() => {
        setAutorizandoPago(false);
        ejecutarConfirmacionPago();
      }, 2600);
      return;
    }

    ejecutarConfirmacionPago();
  };

  const ejecutarConfirmacionPago = () => {
    const authCode = Math.floor(100000 + Math.random() * 900000);
    const ultimos4 = numeroTarjeta.replace(/\D/g, '').slice(-4) || '8821';

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
          : metodoSeleccionado === 'TARJETA'
          ? `AUTH-RE-${authCode}`
          : numeroVoucherTrf || `TRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      email_paypal: metodoSeleccionado === 'PAYPAL' ? emailPaypal : null,
      detalles_pago: {
        banco: metodoSeleccionado === 'TRANSFERENCIA' ? bancoOrigenTrf : bancoEmisor,
        titular: metodoSeleccionado === 'TRANSFERENCIA' ? titularCuentaTrf : titularTarjeta,
        ultimos4: ultimos4,
        marca_tarjeta: `${redTarjeta.label} ${tipoTarjeta === 'DEBITO' ? 'Débito' : 'Crédito'}`,
        codigo_autorizacion: authCode,
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
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '650px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {/* OVERLAY DE PROCESAMIENTO BANCARIO AUTORIZADO */}
        {autorizandoPago && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.88)',
              zIndex: 1300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: pasoAutorizacion === 3 ? '#10b981' : '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                boxShadow: '0 0 30px rgba(2, 132, 199, 0.5)',
                transition: 'all 0.3s ease',
              }}
            >
              {pasoAutorizacion === 3 ? (
                <CheckCircle size={36} color="#ffffff" />
              ) : (
                <RefreshCw size={32} color="#ffffff" className="spin-animate" style={{ animation: 'spin 1s linear infinite' }} />
              )}
            </div>

            <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              {pasoAutorizacion === 1 && 'Conectando con Red Enlace Bolivia...'}
              {pasoAutorizacion === 2 && 'Validando Criptograma EMV y Fondos...'}
              {pasoAutorizacion === 3 && '¡Transacción Aprobada Exitosamente!'}
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '380px' }}>
              {pasoAutorizacion === 1 && 'Estableciendo canal cifrado TLS 1.3 con switch bancario nacional.'}
              {pasoAutorizacion === 2 && `Verificando línea con ${bancoEmisor} y terminal POS virtual.`}
              {pasoAutorizacion === 3 && 'Generando comprobante oficial de caja para Clínica Vida Salud.'}
            </div>

            {/* Barra de progreso visual */}
            <div
              style={{
                width: '260px',
                height: '6px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '999px',
                marginTop: '1.5rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: pasoAutorizacion === 3 ? '#10b981' : '#38bdf8',
                  width: pasoAutorizacion === 1 ? '35%' : pasoAutorizacion === 2 ? '75%' : '100%',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        )}

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
              Clínica Vida Salud • Registro Oficial de Pago y Emisión de Recibo
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading || autorizandoPago}
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

        {/* POLÍTICA INSTITUCIONAL CLÍNICA */}
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
        <div style={{ padding: '0.85rem 1.4rem 0.4rem' }}>
          <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '0.45rem' }}>
            SELECCIONA EL MÉTODO DE PAGO:
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: !isPaciente ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              gap: '0.45rem',
            }}
          >
            {/* Opciones para Recepcionista: Efectivo, QR, Tarjeta, Transferencia */}
            {!isPaciente && (
              <>
                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('EFECTIVO')}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'EFECTIVO' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'EFECTIVO' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'EFECTIVO' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <DollarSign size={18} />
                  <span>Efectivo (Caja)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('QR')}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'QR' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'QR' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'QR' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <QrCode size={18} />
                  <span>QR Simple</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('TARJETA')}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'TARJETA' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'TARJETA' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'TARJETA' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CreditCard size={18} />
                  <span>Tarjeta Débito/Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoSeleccionado('TRANSFERENCIA')}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '10px',
                    border: metodoSeleccionado === 'TRANSFERENCIA' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: metodoSeleccionado === 'TRANSFERENCIA' ? '#f0f9ff' : '#ffffff',
                    color: metodoSeleccionado === 'TRANSFERENCIA' ? '#0369a1' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Building size={18} />
                  <span>Transferencia</span>
                </button>
              </>
            )}

            {/* Opciones para Paciente en Línea: Tarjeta, QR, PayPal */}
            {isPaciente && (
              <>
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
                  <span>Tarjeta Débito / Crédito</span>
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
              </>
            )}
          </div>
        </div>

        {/* CUERPO INTERACTIVO POR MÉTODO */}
        <form onSubmit={handleSubmit} style={{ padding: '0.5rem 1.4rem 1.25rem', overflowY: 'auto', flex: 1 }}>
          {/* ============================================================== */}
          {/* 1. SECCIÓN TARJETA DE DÉBITO / CRÉDITO INTERACTIVA             */}
          {/* ============================================================== */}
          {metodoSeleccionado === 'TARJETA' && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {/* PLÁSTICO DE TARJETA BANCARIA INTERACTIVA */}
              <div
                style={{
                  background:
                    redTarjeta.marca === 'VISA'
                      ? 'linear-gradient(135deg, #0a1e38 0%, #1e3a8a 55%, #0f172a 100%)'
                      : redTarjeta.marca === 'MASTERCARD'
                      ? 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #0f172a 100%)'
                      : redTarjeta.marca === 'AMEX'
                      ? 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #022c22 100%)'
                      : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0a0f1d 100%)',
                  color: '#ffffff',
                  padding: '1.25rem 1.4rem',
                  borderRadius: '16px',
                  boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.45)',
                  marginBottom: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'background 0.3s ease',
                }}
              >
                {/* Textura decorativa de fondo */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Fila superior: Banco / Red Enlace y Logo de Red */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={16} color="#38bdf8" />
                    <span style={{ fontSize: '0.68rem', letterSpacing: '1.2px', color: '#cbd5e1', fontWeight: 800 }}>
                      RED ENLACE • {bancoEmisor.toUpperCase()}
                    </span>
                  </div>

                  {/* Logo dinámico de red */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {redTarjeta.marca === 'VISA' && (
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', letterSpacing: '1px' }}>
                        VISA
                      </span>
                    )}

                    {redTarjeta.marca === 'MASTERCARD' && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eb001b', opacity: 0.95 }} />
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: '#f79e1b',
                            marginLeft: '-10px',
                            opacity: 0.95,
                          }}
                        />
                      </div>
                    )}

                    {redTarjeta.marca === 'AMEX' && (
                      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#34d399', letterSpacing: '1.5px', border: '1px solid #34d399', padding: '2px 6px', borderRadius: '4px' }}>
                        AMEX
                      </span>
                    )}

                    {redTarjeta.marca === 'RED_ENLACE' && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                        RED ENLACE
                      </span>
                    )}
                  </div>
                </div>

                {/* Chip EMV y Contactless */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  {/* Chip metálico dorado con circuitos */}
                  <div
                    style={{
                      width: '42px',
                      height: '30px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                      border: '1px solid #fef3c7',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
                    }}
                  >
                    <div style={{ width: '100%', height: '1px', background: '#b45309' }} />
                    <div
                      style={{
                        position: 'absolute',
                        width: '1px',
                        height: '100%',
                        background: '#b45309',
                      }}
                    />
                  </div>

                  {/* Símbolo Contactless / NFC */}
                  <div style={{ transform: 'rotate(90deg)', opacity: 0.85 }}>
                    <Wifi size={17} color="#ffffff" />
                  </div>

                  {/* Badge Débito o Crédito */}
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    {tipoTarjeta === 'DEBITO' ? 'DÉBITO' : 'CRÉDITO'}
                  </span>
                </div>

                {/* Número de Tarjeta dinámico (con máscara visual en tiempo real) */}
                <div
                  style={{
                    fontSize: '1.22rem',
                    letterSpacing: '2.5px',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {obtenerNumeroTarjetaVisual()}
                </div>

                {/* Datos del Titular, Vencimiento y CVV */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.74rem' }}>
                  <div style={{ flex: 1, marginRight: '0.5rem', overflow: 'hidden' }}>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                      TITULAR DE LA TARJETA
                    </span>
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {titularTarjeta || 'NOMBRE DEL TITULAR'}
                    </span>
                  </div>

                  <div style={{ marginRight: '1.25rem', textAlign: 'center' }}>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                      VENCE
                    </span>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>
                      {vencimientoTarjeta || 'MM/AA'}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                      SEGURIDAD
                    </span>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#fef08a' }}>
                      CVV: {mostrarCvv ? cvv : '•••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de selección rápida institucional */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>
                  Completar con tarjeta:
                </span>
                <button
                  type="button"
                  onClick={() => cargarTarjetaRapida('VISA')}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#0369a1',
                    cursor: 'pointer',
                  }}
                >
                  Visa Red Enlace
                </button>
                <button
                  type="button"
                  onClick={() => cargarTarjetaRapida('MASTERCARD')}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#c2410c',
                    cursor: 'pointer',
                  }}
                >
                  Mastercard BCP
                </button>
                <button
                  type="button"
                  onClick={() => cargarTarjetaRapida('BNB')}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#15803d',
                    cursor: 'pointer',
                  }}
                >
                  Débito BNB
                </button>
              </div>

              {/* FORMULARIO DIRECTO PARA INTRODUCIR TARJETA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Fila 1: Número de Tarjeta y Tipo */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                      Número de Tarjeta (16 dígitos):
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={numeroTarjeta}
                        onChange={handleCambioNumeroTarjeta}
                        placeholder="4532 8910 2341 8821"
                        maxLength={19}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          color: '#0f172a',
                          background: '#ffffff',
                        }}
                      />
                      <CreditCard
                        size={16}
                        color="#64748b"
                        style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                      Tipo de Plástico:
                    </label>
                    <select
                      value={tipoTarjeta}
                      onChange={(e) => setTipoTarjeta(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.6rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="DEBITO">Débito Bancario</option>
                      <option value="CREDITO">Crédito Rotativo</option>
                    </select>
                  </div>
                </div>

                {/* Fila 2: Nombre del Titular */}
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                    Nombre del Titular (como figura en la tarjeta):
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={titularTarjeta}
                      onChange={(e) => setTitularTarjeta(e.target.value.toUpperCase())}
                      placeholder="Ej: MARIANA CLAUDIA ROCA"
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        background: '#ffffff',
                      }}
                    />
                    <User
                      size={16}
                      color="#64748b"
                      style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                </div>

                {/* Fila 3: Vencimiento, CVV y Banco Emisor */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                      Vencimiento:
                    </label>
                    <input
                      type="text"
                      value={vencimientoTarjeta}
                      onChange={handleCambioVencimiento}
                      placeholder="MM/AA"
                      maxLength={5}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.6rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        color: '#0f172a',
                        background: '#ffffff',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                      Código CVV:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={mostrarCvv ? 'text' : 'password'}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="782"
                        maxLength={4}
                        style={{
                          width: '100%',
                          padding: '0.55rem 1.8rem 0.55rem 0.6rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          textAlign: 'center',
                          color: '#0f172a',
                          background: '#ffffff',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarCvv(!mostrarCvv)}
                        style={{
                          position: 'absolute',
                          right: '6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                          padding: 0,
                          display: 'flex',
                        }}
                      >
                        {mostrarCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                      Banco Emisor:
                    </label>
                    <select
                      value={bancoEmisor}
                      onChange={(e) => setBancoEmisor(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.5rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        background: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="Banco Unión S.A.">Banco Unión S.A.</option>
                      <option value="Banco de Crédito BCP">Banco de Crédito BCP</option>
                      <option value="Banco Nacional de Bolivia (BNB)">Banco Nacional de Bolivia</option>
                      <option value="Banco Mercantil Santa Cruz">Banco Mercantil Santa Cruz</option>
                      <option value="Banco Ganadero">Banco Ganadero</option>
                      <option value="Banco Bisa">Banco Bisa</option>
                      <option value="Banco FIE">Banco FIE</option>
                    </select>
                  </div>
                </div>

                {/* Sello de seguridad institucional y encriptación */}
                <div
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.7rem',
                    color: '#166534',
                  }}
                >
                  <Lock size={15} color="#15803d" style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Conexión Cifrada SSL 256-bit:</strong> Procesamiento seguro mediante Switch Red Enlace Bolivia y cumplimiento normativo ASFI.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. SECCIÓN TRANSFERENCIA BANCARIA (SEPARADA DE TARJETA)       */}
          {/* ============================================================== */}
          {metodoSeleccionado === 'TRANSFERENCIA' && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {/* Tarjeta de cuenta bancaria receptora de la clínica */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                  color: '#ffffff',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '0.85rem',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px', color: '#e0f2fe' }}>
                    CUENTA RECEPTORA OFICIAL
                  </span>
                  <span style={{ fontSize: '0.72rem', background: '#ffffff', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                    BANCO UNIÓN S.A.
                  </span>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '1.5px', marginBottom: '0.3rem' }}>
                  Cta. Cte: 1-0000492817290
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '0.72rem', color: '#f0f9ff' }}>
                  <div>Titular: CLÍNICA VIDA SALUD S.R.L.</div>
                  <div style={{ textAlign: 'right' }}>NIT: 1028473029</div>
                </div>
              </div>

              {/* Formulario de registro del comprobante de transferencia */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                    Banco de Origen del Paciente:
                  </label>
                  <select
                    value={bancoOrigenTrf}
                    onChange={(e) => setBancoOrigenTrf(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      background: '#ffffff',
                      color: '#0f172a',
                    }}
                  >
                    <option value="Banco de Crédito BCP">Banco de Crédito BCP</option>
                    <option value="Banco Unión S.A.">Banco Unión S.A.</option>
                    <option value="Banco Nacional de Bolivia (BNB)">Banco Nacional de Bolivia (BNB)</option>
                    <option value="Banco Mercantil Santa Cruz">Banco Mercantil Santa Cruz</option>
                    <option value="Banco Ganadero (GanaMóvil)">Banco Ganadero (GanaMóvil)</option>
                    <option value="Banco Bisa">Banco Bisa</option>
                    <option value="Banco FIE">Banco FIE</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                    Nº de Transacción / Voucher:
                  </label>
                  <input
                    type="text"
                    value={numeroVoucherTrf}
                    onChange={(e) => setNumeroVoucherTrf(e.target.value)}
                    placeholder="Ej: 9840215"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      background: '#ffffff',
                      color: '#0f172a',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  Nombre del Depositante / Titular de la Cuenta:
                </label>
                <input
                  type="text"
                  value={titularCuentaTrf}
                  onChange={(e) => setTitularCuentaTrf(e.target.value)}
                  placeholder="Ej: Mariana Claudia Roca Méndez"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    background: '#ffffff',
                    color: '#0f172a',
                  }}
                />
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. SECCIÓN EFECTIVO (CAJA)                                     */}
          {/* ============================================================== */}
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

          {/* ============================================================== */}
          {/* 4. SECCIÓN QR SIMPLE BOLIVIA                                   */}
          {/* ============================================================== */}
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

              {/* QR CODE EN SVG OFICIAL */}
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

                  {/* Patrón de datos de seguridad QR */}
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

                  {/* Cruz Médica central */}
                  <rect x="43" y="43" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="47" y="45" width="6" height="10" fill="#dc2626" />
                  <rect x="45" y="47" width="10" height="6" fill="#dc2626" />
                </svg>

                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0369a1', marginTop: '4px' }}>
                  CLÍNICA VIDA SALUD • QR SIMPLE BCP / BANCO UNIÓN
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                Monto: Bs. {parseFloat(monto).toFixed(2)}
              </div>
              <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', color: '#64748b', maxWidth: '380px' }}>
                Escanea desde la app de cualquier banco boliviano (Banco Unión, BCP, BNB, Banco Mercantil, GanaMóvil).
              </p>

              {/* Botón de verificación interbancaria ASFI */}
              <button
                type="button"
                onClick={handleVerificarQRManual}
                disabled={qrVerificando || qrVerificadoExito}
                style={{
                  background: qrVerificadoExito ? '#10b981' : '#ffffff',
                  border: qrVerificadoExito ? '1px solid #059669' : '1px solid #cbd5e1',
                  color: qrVerificadoExito ? '#ffffff' : '#0369a1',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: qrVerificando || qrVerificadoExito ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {qrVerificando ? (
                  <>
                    <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Verificando conciliación ASFI...</span>
                  </>
                ) : qrVerificadoExito ? (
                  <>
                    <CheckCircle size={14} color="#ffffff" />
                    <span>Acreditación Bancaria Verificada</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>Comprobar Recepción Interbancaria</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. SECCIÓN PAYPAL EXPRESS CHECKOUT                             */}
          {/* ============================================================== */}
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
                    Portal seguro de PayPal abierto. Una vez autorizado, haz clic en el botón inferior para confirmar la reserva.
                  </span>
                </div>
              )}
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
              disabled={loading || autorizandoPago}
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
              disabled={loading || autorizandoPago}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
              }}
            >
              {loading || autorizandoPago ? (
                <span>Procesando pago seguro...</span>
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
