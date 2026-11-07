import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  History,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Key,
} from 'lucide-react';
import { useAsistenteVoz } from '../../../controllers/PKG08_DashboardReportes/CU23_AsistenteVozIA/CU23_AsistenteVozController';

export const CU23_AsistenteVozView = ({ currentUser }) => {
  const {
    messages,
    inputText,
    setInputText,
    isListening,
    isSpeaking,
    isLoading,
    voiceEnabled,
    setVoiceEnabled,
    motorInfo,
    ejemplos,
    ticketConfirmado,
    setTicketConfirmado,
    modalConfigOpen,
    setModalConfigOpen,
    modalHistorialOpen,
    setModalHistorialOpen,
    historialList,
    transcripcionEnVivo,
    startListening,
    stopListening,
    handleEnviarMensaje,
    handleConfirmarCupo,
    reproducirAudio,
    detenerAudio,
    handleGuardarGeminiConfig,
    handleAbrirHistorial,
  } = useAsistenteVoz(currentUser);

  // Estado local para el formulario de configuración Gemini
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [modeloInput, setModeloInput] = useState(motorInfo.modelo || 'gemini-2.5-flash');

  const onSubmitConfig = (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      alert('Por favor introduce tu clave de Google Gemini API.');
      return;
    }
    handleGuardarGeminiConfig(apiKeyInput.trim(), modeloInput);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. ENCABEZADO EJECUTIVO CU23 */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}>
            <Sparkles size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                PKG08 • Inteligencia Artificial y Voz
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: '#ede9fe', color: '#6d28d9', fontWeight: 700 }}>
                CU23 Oficial
              </span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Asistente Médico IA por Voz para Reserva Rápida
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Dile por voz tus síntomas o la especialidad requerida y el horario que deseas; la IA te encontrará y agendará el cupo en segundos.
            </p>
          </div>
        </div>

        {/* Acciones y estado del motor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Badge del Motor */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            background: motorInfo.usa_gemini_api ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${motorInfo.usa_gemini_api ? '#bbf7d0' : '#e2e8f0'}`,
            fontSize: '0.74rem',
            fontWeight: 700,
            color: motorInfo.usa_gemini_api ? '#15803d' : '#475569',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: motorInfo.usa_gemini_api ? '#22c55e' : '#0284c7',
            }} />
            <span>{motorInfo.motor_nombre}</span>
          </div>

          {/* Botón Alternar Voz */}
          <button
            type="button"
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled) detenerAudio();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: voiceEnabled ? '#ffffff' : '#f1f5f9',
              color: voiceEnabled ? '#0284c7' : '#94a3b8',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={voiceEnabled ? 'Silenciar voz de la IA' : 'Activar voz hablada de la IA'}
          >
            {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{voiceEnabled ? 'Voz Activa' : 'Voz Silenciada'}</span>
          </button>

          {/* Botón Configurar Gemini */}
          <button
            type="button"
            onClick={() => setModalConfigOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #c7d2fe',
              background: '#eef2ff',
              color: '#4338ca',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Key size={14} />
            <span>Configurar Gemini API</span>
          </button>

          {/* Botón Historial */}
          <button
            type="button"
            onClick={handleAbrirHistorial}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <History size={14} />
            <span>Historial</span>
          </button>
        </div>
      </div>

      {/* 2. CONSOLA PRINCIPAL DE VOZ Y CONVERSACIÓN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: '1rem',
      }}>
        
        {/* ÁREA DE CHAT Y RESULTADOS */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          overflow: 'hidden',
        }}>

          {/* Barra de Ejemplos Sugeridos con 1 Clic */}
          <div style={{
            padding: '0.75rem 1rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
          }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>
              💡 Ejemplos rápidos:
            </span>
            {ejemplos.map((ej, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleEnviarMensaje(ej.texto)}
                style={{
                  padding: '0.3rem 0.7rem',
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eef2ff';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#4338ca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                <span>{ej.icono}</span>
                <span>{ej.titulo}</span>
              </button>
            ))}
          </div>

          {/* FEED DE MENSAJES CONVERSACIONALES */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: '#fcfcfd',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.75rem',
                }}
              >
                {/* Avatar IA */}
                {msg.sender === 'ia' && (
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(99, 102, 241, 0.25)',
                  }}>
                    <Bot size={20} />
                  </div>
                )}

                {/* Burbuja de Mensaje */}
                <div style={{
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                      : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: msg.sender === 'user'
                      ? '0 2px 6px rgba(2, 132, 199, 0.25)'
                      : '0 2px 6px rgba(0, 0, 0, 0.03)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                  }}>
                    {/* Texto principal */}
                    <p style={{ margin: 0, fontWeight: 500 }}>{msg.text}</p>

                    {/* Botón reproducir audio si es IA */}
                    {msg.sender === 'ia' && msg.guionVoz && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => reproducirAudio(msg.guionVoz)}
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#0284c7',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Volume2 size={13} />
                          <span>Repetir audio</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TARJETA DE TRIAJE CLÍNICO (Si la IA identificó especialidad) */}
                  {msg.sugerencias && (
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.76rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Stethoscope size={15} color="#0284c7" />
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>Especialidad sugerida:</span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: '#e0f2fe',
                            color: '#0369a1',
                            fontWeight: 800,
                          }}>
                            {msg.sugerencias.especialidad}
                          </span>
                        </div>

                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: msg.sugerencias.urgencia === 'URGENTE' ? '#fee2e2' : '#fef3c7',
                          color: msg.sugerencias.urgencia === 'URGENTE' ? '#b91c1c' : '#b45309',
                          fontWeight: 800,
                          fontSize: '0.68rem',
                        }}>
                          Prioridad: {msg.sugerencias.urgencia}
                        </span>
                      </div>

                      {msg.sugerencias.sintomas && msg.sugerencias.sintomas.length > 0 && (
                        <div style={{ color: '#475569' }}>
                          <strong>Síntomas detectados:</strong> {msg.sugerencias.sintomas.join(', ')}
                        </div>
                      )}

                      <div style={{ color: '#64748b', fontSize: '0.72rem' }}>
                        {msg.sugerencias.justificacion}
                      </div>
                    </div>
                  )}

                  {/* CARDS DE CUPOS MÉDICOS DISPONIBLES */}
                  {msg.cupos && msg.cupos.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      marginTop: '0.3rem',
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} />
                        <span>Cupos recomendados en tiempo real (Clínica Vida Salud):</span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '0.6rem',
                      }}>
                        {msg.cupos.map((cupo, cIdx) => (
                          <div
                            key={cIdx}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #bae6fd',
                              borderRadius: '10px',
                              padding: '0.8rem 0.9rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '0.6rem',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: '#e0f2fe',
                                  color: '#0284c7',
                                  fontWeight: 700,
                                }}>
                                  {cupo.turno_label}
                                </span>
                                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                                  {cupo.matricula}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                                {cupo.nombre_medico}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                {cupo.especialidad}
                              </div>
                              <div style={{
                                marginTop: '0.4rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                color: '#0369a1',
                              }}>
                                <Clock size={13} />
                                <span>{cupo.dia_nombre} {cupo.fecha} • {cupo.hora_inicio} - {cupo.hora_fin}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleConfirmarCupo(cupo, msg.sugerencias?.idConversacion)}
                              disabled={isLoading}
                              style={{
                                padding: '0.5rem 0.8rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                color: '#ffffff',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)',
                              }}
                            >
                              <span>Reservar con 1 Clic</span>
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hora del mensaje */}
                  <span style={{
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginRight: msg.sender === 'user' ? '0.4rem' : 0,
                    marginLeft: msg.sender === 'ia' ? '0.4rem' : 0,
                  }}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Avatar Usuario */}
                {msg.sender === 'user' && (
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    flexShrink: 0,
                  }}>
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}

            {/* Spinner de Procesamiento */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}>
                  <Bot size={20} />
                </div>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.7rem 1rem',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    border: '2px solid #6366f1',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <span>Dra. Sofía (Gemini AI) está analizando tus síntomas y consultando turnos médicos...</span>
                </div>
              </div>
            )}
          </div>

          {/* BANNER DE TRANSCRIPCIÓN EN VIVO (CUANDO EL MIC ESTÁ ACTIVO) */}
          {isListening && (
            <div style={{
              background: '#fee2e2',
              borderTop: '1px solid #fecaca',
              padding: '0.6rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: '#b91c1c',
              fontWeight: 700,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 8px #ef4444',
                }} />
                <span>{transcripcionEnVivo || 'Escuchando tu voz... Habla ahora.'}</span>
              </div>
              <button
                type="button"
                onClick={stopListening}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                Listo / Detener
              </button>
            </div>
          )}

          {/* BARRA DE ENTRADA CON MICRÓFONO INTEGRADO */}
          <div style={{
            padding: '1rem',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}>
            {/* Botón Gran Micrófono */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                border: 'none',
                background: isListening
                  ? '#ef4444'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: isListening
                  ? '0 0 16px rgba(239, 68, 68, 0.6)'
                  : '0 4px 12px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.2s ease',
              }}
              title={isListening ? 'Detener micrófono' : 'Hablar por micrófono con la IA'}
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* Input de Texto */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEnviarMensaje();
                }
              }}
              placeholder={isListening ? 'Te estoy escuchando...' : 'Escribe o habla por el micrófono tus síntomas y horario deseado...'}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                background: isListening ? '#fef2f2' : '#ffffff',
                color: '#0f172a',
              }}
            />

            {/* Botón Enviar */}
            <button
              type="button"
              onClick={() => handleEnviarMensaje()}
              disabled={isLoading || (!inputText.trim() && !isListening)}
              style={{
                padding: '0.75rem 1.15rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                opacity: isLoading || (!inputText.trim() && !isListening) ? 0.6 : 1,
              }}
            >
              <Send size={15} />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MODAL DE CONFIRMACIÓN Y TICKET DE CITA MÉDICA */}
      {ticketConfirmado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
          }}>
            {/* Header del Ticket */}
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              padding: '1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle size={26} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>¡Cita Médica Reservada!</h3>
                  <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>Emisión instantánea con Asistente IA</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTicketConfirmado(null)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido del Ticket */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Código de Ficha */}
              <div style={{
                background: '#f8fafc',
                border: '2px dashed #059669',
                borderRadius: '10px',
                padding: '0.85rem',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Ficha / Token de Cita Médica
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#047857', letterSpacing: '1.5px', marginTop: '0.2rem' }}>
                  {ticketConfirmado.ticket_token || ticketConfirmado.cita?.codigo_cita}
                </div>
              </div>

              {/* Detalles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Médico Asignado:</span>
                  <strong style={{ color: '#0f172a' }}>{ticketConfirmado.cita?.medico?.nombre_completo || 'Médico Asignado'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Especialidad:</span>
                  <strong style={{ color: '#0284c7' }}>{ticketConfirmado.cita?.especialidad?.nombre || 'Especialidad'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Fecha de Atención:</span>
                  <strong style={{ color: '#0f172a' }}>{ticketConfirmado.cita?.fecha_cita}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Horario del Turno:</span>
                  <strong style={{ color: '#0f172a' }}>{ticketConfirmado.cita?.hora_inicio} - {ticketConfirmado.cita?.hora_fin}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Estado:</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.72rem' }}>
                    PROGRAMADA (EN AGENDA)
                  </span>
                </div>
              </div>

              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.75rem',
                color: '#166534',
                lineHeight: 1.4,
              }}>
                📌 <strong>Instrucciones:</strong> Preséntate en recepción 10 minutos antes con tu documento de identidad para el control de sala (CU13).
              </div>

              {/* Botones del Modal */}
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Printer size={15} />
                  <span>Imprimir Ficha</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTicketConfirmado(null)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL DE CONFIGURACIÓN DE GOOGLE GEMINI API */}
      {modalConfigOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '540px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
              padding: '1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Key size={22} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Configuración de Google Gemini API</h3>
                  <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>Motor de Inteligencia Artificial para el Asistente por Voz</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalConfigOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmitConfig} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.76rem',
                color: '#475569',
                lineHeight: 1.45,
              }}>
                ℹ️ <strong>Clave de Google Gemini:</strong> Puedes generar tu API Key gratuita en{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#4338ca', fontWeight: 700 }}
                >
                  Google AI Studio (aistudio.google.com)
                </a>.
                Se guardará en el archivo de entorno seguro del servidor.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Gemini API Key:
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Ej: AIzaSyD..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                  Clave actual: <strong>{motorInfo.key_enmascarada}</strong>
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Modelo de Gemini:
                </label>
                <select
                  value={modeloInput}
                  onChange={(e) => setModeloInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recomendado • Alta velocidad y precisión clínica)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultrarrápido y ligero)</option>
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Modelo multimodal de última generación)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalConfigOpen(false)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL DE HISTORIAL DE CONSULTAS IA */}
      {modalHistorialOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '720px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Historial de Interacciones del Asistente IA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalHistorialOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {historialList.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                  No hay interacciones registradas aún.
                </div>
              ) : (
                historialList.map((h) => (
                  <div
                    key={h.id_conversacion}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#0284c7' }}>
                        🩺 {h.especialidad_sugerida || 'Medicina General'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {new Date(h.fecha_creacion).toLocaleString('es-BO')}
                      </span>
                    </div>
                    <div style={{ color: '#0f172a' }}>
                      <strong>Mensaje del paciente:</strong> "{h.mensaje_usuario}"
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.74rem' }}>
                      <strong>Respuesta IA:</strong> {h.respuesta_voz_texto}
                    </div>
                    {h.id_cita_generada && (
                      <div style={{
                        marginTop: '0.2rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#15803d',
                        background: '#dcfce7',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        alignSelf: 'flex-start',
                      }}>
                        ✅ Concretó reserva de Cita #{h.id_cita_generada} ({h.fecha_cita} a las {h.hora_inicio})
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CU23_AsistenteVozView;

