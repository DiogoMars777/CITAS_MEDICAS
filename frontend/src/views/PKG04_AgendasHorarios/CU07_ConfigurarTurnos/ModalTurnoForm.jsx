import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  User,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  getInitialTurnoFormState,
  calcularCuposEstimados,
  DIAS_SEMANA_MAP,
} from '../../../models/PKG04_AgendasHorarios/CU07_ConfigurarTurnos/TurnoModel';

export const ModalTurnoForm = ({
  isOpen,
  onClose,
  onSave,
  turnoToEdit = null,
  medicosMeta = [],
  diasSemanaMeta = [],
  duracionesMeta = [],
  loading = false,
}) => {
  const isEditMode = Boolean(turnoToEdit);

  const [formData, setFormData] = useState(getInitialTurnoFormState());
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (turnoToEdit) {
      setFormData({
        id_medico: String(turnoToEdit.id_medico || ''),
        dias_semana: [turnoToEdit.dia_semana || 1],
        hora_inicio: turnoToEdit.hora_inicio || '08:00',
        hora_fin: turnoToEdit.hora_fin || '12:00',
        duracion_bloque_min: turnoToEdit.duracion_bloque_min || 15,
        estado: turnoToEdit.estado || 'ACTIVO',
      });
    } else {
      setFormData(getInitialTurnoFormState());
    }
    setLocalError(null);
  }, [turnoToEdit, isOpen]);

  if (!isOpen) return null;

  // Cálculo en tiempo real de cupos
  const cuposPorDia = calcularCuposEstimados(
    formData.hora_inicio,
    formData.hora_fin,
    formData.duracion_bloque_min
  );
  const totalCuposSemana = cuposPorDia * formData.dias_semana.length;

  // Alternar día
  const handleToggleDia = (diaId) => {
    if (isEditMode) {
      setFormData((prev) => ({ ...prev, dias_semana: [diaId] }));
      return;
    }

    setFormData((prev) => {
      const exists = prev.dias_semana.includes(diaId);
      if (exists) {
        if (prev.dias_semana.length === 1) return prev; // Mantener al menos un día
        return { ...prev, dias_semana: prev.dias_semana.filter((d) => d !== diaId) };
      }
      return { ...prev, dias_semana: [...prev.dias_semana, diaId].sort((a, b) => a - b) };
    });
  };

  const handleSelectLunesViernes = () => {
    setFormData((prev) => ({ ...prev, dias_semana: [1, 2, 3, 4, 5] }));
  };

  const handleSelectTodosLosDias = () => {
    setFormData((prev) => ({ ...prev, dias_semana: [1, 2, 3, 4, 5, 6, 7] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.id_medico) {
      setLocalError('Debe seleccionar el médico facultativo para el turno.');
      return;
    }

    if (formData.dias_semana.length === 0) {
      setLocalError('Debe seleccionar al menos un día de la semana.');
      return;
    }

    if (formData.hora_fin <= formData.hora_inicio) {
      setLocalError('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }

    if (cuposPorDia <= 0) {
      setLocalError('El rango horario no es suficiente para generar al menos un bloque de 15 minutos.');
      return;
    }

    const payload = {
      id_medico: parseInt(formData.id_medico, 10),
      dias_semana: formData.dias_semana,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
      duracion_bloque_min: parseInt(formData.duracion_bloque_min, 10),
      estado: formData.estado,
    };

    if (isEditMode) {
      payload.dia_semana = formData.dias_semana[0];
    }

    const res = await onSave(payload, turnoToEdit?.id_turno);
    if (!res.success) {
      setLocalError(res.message || 'Error al guardar la configuración del turno.');
    }
  };

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
        borderRadius: '12px',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}>
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            padding: '0.35rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
          }}
        >
          <X size={18} />
        </button>

        {/* CABECERA */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}>
            Agendas y Horarios • CU07
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {isEditMode ? `Editar Turno: ${turnoToEdit.dia_nombre}` : 'Configurar Turnos de Atención Médica'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
            {isEditMode
              ? 'Ajuste el rango horario o duración de bloque para este día específico.'
              : 'Asigne turnos de atención y fraccionamiento automático de citas en bloques de 15 minutos.'}
          </p>
        </div>

        {/* ALERTA DE ERROR */}
        {localError && (
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, color: '#dc2626' }} />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* SELECCIÓN DE MÉDICO */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Médico Facultativo *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <select
                required
                disabled={loading || isEditMode}
                value={formData.id_medico}
                onChange={(e) => setFormData({ ...formData, id_medico: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                  borderRadius: '6px',
                  background: isEditMode ? '#f1f5f9' : '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="">-- Seleccionar médico --</option>
                {medicosMeta.map((m) => (
                  <option key={m.id_medico} value={m.id_medico}>
                    {m.nombre_completo} • {m.especialidad_principal} ({m.matricula})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DÍAS DE LA SEMANA */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                {isEditMode ? 'Día de la Semana *' : 'Días de Atención Médica *'}
              </label>

              {!isEditMode && (
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={handleSelectLunesViernes}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '0.2rem 0.5rem',
                      color: '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Lun - Vie
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectTodosLosDias}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '0.2rem 0.5rem',
                      color: '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Todos
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((diaId) => {
                const diaInfo = DIAS_SEMANA_MAP[diaId];
                const isSelected = formData.dias_semana.includes(diaId);

                return (
                  <button
                    key={diaId}
                    type="button"
                    disabled={loading}
                    onClick={() => handleToggleDia(diaId)}
                    style={{
                      padding: '0.55rem 0.2rem',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0f9ff' : '#f8fafc',
                      color: isSelected ? '#0284c7' : '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {diaInfo.corto}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RANGO HORARIO (HORA INICIO Y HORA FIN) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Hora de Inicio *
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="time"
                  required
                  disabled={loading}
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem 0.55rem 2rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Hora de Fin *
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="time"
                  required
                  disabled={loading}
                  value={formData.hora_fin}
                  onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem 0.55rem 2rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* DURACIÓN DE BLOQUE Y ESTADO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Fraccionamiento de Citas *
              </label>
              <select
                value={formData.duracion_bloque_min}
                disabled={loading}
                onChange={(e) => setFormData({ ...formData, duracion_bloque_min: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              >
                <option value={15}>15 minutos (Estándar consulta clínica)</option>
                <option value={20}>20 minutos</option>
                <option value={30}>30 minutos (Especialidad / Primera vez)</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos (Procedimiento)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Estado *
              </label>
              <select
                value={formData.estado}
                disabled={loading}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          </div>

          {/* TARJETA DE CÁLCULO EN TIEMPO REAL */}
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Capacidad de Atención Calculada
              </div>
              <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, marginTop: '0.15rem' }}>
                {cuposPorDia > 0 ? (
                  <>
                    <strong style={{ color: '#059669', fontSize: '1.15rem' }}>{cuposPorDia}</strong> cupos por día
                    {!isEditMode && formData.dias_semana.length > 1 && (
                      <span style={{ color: '#64748b', fontWeight: 500 }}> ({totalCuposSemana} cupos semanales en {formData.dias_semana.length} días)</span>
                    )}
                  </>
                ) : (
                  <span style={{ color: '#dc2626' }}>Horario insuficiente</span>
                )}
              </div>
            </div>

            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Layers size={18} />
            </div>
          </div>

          {/* BOTONES */}
          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: '#0284c7',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Guardando en PostgreSQL...
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  {isEditMode ? 'Guardar Cambios' : 'Generar Agenda y Turnos'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTurnoForm;
