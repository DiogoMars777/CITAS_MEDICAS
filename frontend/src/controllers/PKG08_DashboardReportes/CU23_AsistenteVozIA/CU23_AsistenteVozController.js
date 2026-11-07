import { useState, useEffect, useRef, useCallback } from 'react';
import CU23_AsistenteVozModel from '../../../models/PKG08_DashboardReportes/CU23_AsistenteVozIA/CU23_AsistenteVozModel';

export function useAsistenteVoz(currentUser) {
  // Mensajes de la conversación interactiva
  const [messages, setMessages] = useState([
    {
      id: 'welcome-01',
      sender: 'ia',
      text: '¡Hola! Soy la Dra. Sofía, tu Asistente Médica con Inteligencia Artificial de Clínica Vida Salud. Cuéntame con tus propias palabras qué síntomas tienes o qué especialidad buscas, y para qué horario o día prefieres tu cita. Presiona el micrófono para hablar o escribe en el chat.',
      guionVoz: '¡Hola! Soy la Dra. Sofía, tu Asistente Médica de Clínica Vida Salud. Dime qué síntomas tienes y en qué horario prefieres tu cita para agendarla de inmediato.',
      timestamp: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
      cupos: [],
      sugerencias: null,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Estado del motor Gemini
  const [motorInfo, setMotorInfo] = useState({
    activo: true,
    usa_gemini_api: true,
    motor_nombre: 'Google Gemini 3.5 Flash',
    modelo: 'gemini-3.5-flash',
  });

  // Ejemplos y modales
  const [ejemplos, setEjemplos] = useState([]);
  const [ticketConfirmado, setTicketConfirmado] = useState(null);
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);
  const [historialList, setHistorialList] = useState([]);
  const [transcripcionEnVivo, setTranscripcionEnVivo] = useState('');

  // Referencias a Speech API
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Reproducir voz mediante Web Speech Synthesis
  const reproducirAudio = useCallback((texto) => {
    if (!voiceEnabled || !synthRef.current) return;

    try {
      synthRef.current.cancel(); // Detener cualquier audio previo
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-BO'; // Preferencia español boliviano
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Buscar voz en español disponible
      const voices = synthRef.current.getVoices();
      const vozEs = voices.find((v) => v.lang.startsWith('es') || v.lang.includes('ES') || v.lang.includes('BO'));
      if (vozEs) utterance.voice = vozEs;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Error en síntesis de voz:', e);
      setIsSpeaking(false);
    }
  }, [voiceEnabled]);

  // Detener audio
  const detenerAudio = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Inicializar Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'es-BO';

        reco.onstart = () => {
          setIsListening(true);
          setTranscripcionEnVivo('Escuchando tu voz... habla ahora.');
        };

        reco.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const textoDetectado = finalTranscript || interimTranscript;
          setTranscripcionEnVivo(textoDetectado);
          setInputText(textoDetectado);
        };

        reco.onerror = (event) => {
          console.warn('Error de reconocimiento de voz:', event.error);
          setIsListening(false);
          setTranscripcionEnVivo('');
        };

        reco.onend = () => {
          setIsListening(false);
          setTranscripcionEnVivo('');
        };

        recognitionRef.current = reco;
      }
    }

    // Cargar estado inicial y ejemplos
    cargarEstadoInicial();
  }, []);

  // Cargar estado del motor y ejemplos
  const cargarEstadoInicial = async () => {
    try {
      const [estado, ej] = await Promise.all([
        CU23_AsistenteVozModel.obtenerEstadoMotor(),
        CU23_AsistenteVozModel.obtenerEjemplos(),
      ]);
      if (estado) setMotorInfo(estado);
      if (ej) setEjemplos(ej);
    } catch (e) {
      console.error('Error al cargar datos iniciales de la IA:', e);
    }
  };

  // Iniciar reconocimiento de voz
  const startListening = () => {
    detenerAudio();
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz nativo (Web Speech API). Puedes escribir directamente en el chat.');
      return;
    }
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition ya estaba iniciado:', e);
    }
  };

  // Detener reconocimiento de voz
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    setIsListening(false);
  };

  // Enviar mensaje a la IA
  const handleEnviarMensaje = async (textoMensaje) => {
    const texto = (textoMensaje || inputText).trim();
    if (!texto) return;

    detenerAudio();
    stopListening();
    setInputText('');
    setTranscripcionEnVivo('');

    // Agregar mensaje del usuario
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: texto,
      timestamp: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const idPaciente = currentUser?.id_paciente || null;

      // Identificar contexto previo para retención multi-turno (especialidad, turno, síntomas)
      const ultimaSugerencia = [...messages].reverse().find(
        (m) => m.sugerencias && m.sugerencias.especialidad
      );
      const contextoPrevio = ultimaSugerencia ? {
        especialidad: ultimaSugerencia.sugerencias.especialidad,
        turno: ultimaSugerencia.sugerencias.turno,
        sintomas: ultimaSugerencia.sugerencias.sintomas,
        id_conversacion: ultimaSugerencia.sugerencias.idConversacion,
      } : null;

      const res = await CU23_AsistenteVozModel.interpretarVoz(texto, idPaciente, contextoPrevio);

      const iaMsg = {
        id: `ia-${Date.now()}`,
        sender: 'ia',
        text: res.guion_voz,
        guionVoz: res.guion_voz,
        timestamp: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
        cupos: res.cupos_disponibles || [],
        sugerencias: {
          especialidad: res.especialidad,
          sintomas: res.sintomas,
          turno: res.turno_preferido,
          urgencia: res.urgencia,
          justificacion: res.justificacion_medica,
          motor: res.motor_ia,
          modelo: res.modelo_usado,
          idConversacion: res.id_conversacion,
        },
      };

      setMessages((prev) => [...prev, iaMsg]);

      // Reproducir audio de respuesta si está habilitado
      if (res.guion_voz) {
        reproducirAudio(res.guion_voz);
      }
    } catch (error) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ia',
        text: `Lo siento, ocurrió una dificultad técnica al consultar con la IA: ${error.message}. Por favor intenta nuevamente o selecciona uno de los ejemplos sugeridos.`,
        timestamp: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
        cupos: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar reserva rápida en 1 clic
  const handleConfirmarCupo = async (cupo, idConversacion) => {
    detenerAudio();
    setIsLoading(true);

    try {
      const datos = {
        id_medico: cupo.id_medico,
        id_especialidad: cupo.id_especialidad,
        fecha_cita: cupo.fecha,
        hora_inicio: cupo.hora_inicio,
        hora_fin: cupo.hora_fin,
        motivo_consulta: `Reserva IA: Consulta en ${cupo.especialidad}`,
        id_paciente: currentUser?.id_paciente || 1,
        id_conversacion: idConversacion,
      };

      const resultado = await CU23_AsistenteVozModel.confirmarReserva(datos);
      setTicketConfirmado(resultado);

      // Agregar mensaje de confirmación en el chat
      const confirmMsg = {
        id: `conf-${Date.now()}`,
        sender: 'ia',
        text: resultado.guion_confirmacion || `¡Listo! Tu cita ha sido confirmada con éxito. Código de ticket: ${resultado.ticket_token}.`,
        guionVoz: resultado.guion_confirmacion,
        timestamp: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
        cupos: [],
        esExito: true,
      };

      setMessages((prev) => [...prev, confirmMsg]);

      if (resultado.guion_confirmacion) {
        reproducirAudio(resultado.guion_confirmacion);
      }
    } catch (e) {
      alert(`Error al confirmar cita: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar historial
  const handleAbrirHistorial = async () => {
    try {
      const list = await CU23_AsistenteVozModel.obtenerHistorial();
      setHistorialList(list);
      setModalHistorialOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  return {
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
    handleAbrirHistorial,
  };
}

export default useAsistenteVoz;
