/**
 * CU23: Asistente IA por Voz para Reserva Rápida de Citas
 * Modelo de datos y cliente API REST (Google Gemini API / Backend CVS-2026)
 */

const API_BASE = '/api/ia-asistente';

export const CU23_AsistenteVozModel = {
  /**
   * Envía mensaje hablado/escrito a la IA para interpretación y búsqueda de cupos
   */
  async interpretarVoz(mensaje, idPaciente = null) {
    const res = await fetch(`${API_BASE}/interpretar-voz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        mensaje,
        id_paciente: idPaciente,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Error al interpretar la consulta con la IA');
    }
    return data.data;
  },

  /**
   * Confirma la reserva rápida de la cita seleccionada
   */
  async confirmarReserva(datos) {
    const res = await fetch(`${API_BASE}/confirmar-reserva`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(datos),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Error al confirmar la reserva');
    }
    return data.data;
  },

  /**
   * Obtiene ejemplos clínicos de triaje guiado
   */
  async obtenerEjemplos() {
    const res = await fetch(`${API_BASE}/ejemplos`, {
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();
    return data.ejemplos || [];
  },

  /**
   * Obtiene el estado del motor Gemini (API Key, modelo activo, voz)
   */
  async obtenerEstadoMotor() {
    const res = await fetch(`${API_BASE}/estado-motor`, {
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();
    return data.estado || {};
  },

  /**
   * Guarda o actualiza la Gemini API Key en el backend
   */
  async guardarConfiguracionGemini(apiKey, modelo = 'gemini-2.5-flash') {
    const res = await fetch(`${API_BASE}/configuracion-gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        modelo,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Error al guardar la clave de Gemini');
    }
    return data;
  },

  /**
   * Obtiene el historial de consultas recientes a la IA
   */
  async obtenerHistorial() {
    const res = await fetch(`${API_BASE}/historial`, {
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();
    return data.historial || [];
  },
};

export default CU23_AsistenteVozModel;
