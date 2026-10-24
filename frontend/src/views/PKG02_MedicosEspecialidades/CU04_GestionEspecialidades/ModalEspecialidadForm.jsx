import React, { useState, useEffect } from 'react';
import {
  X,
  Stethoscope,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  initialEspecialidadFormState,
  ESPECIALIDADES_SUGERIDAS,
} from '../../../models/PKG02_MedicosEspecialidades/CU04_GestionEspecialidades/EspecialidadModel';

export const ModalEspecialidadForm = ({
  isOpen,
  onClose,
  onSave,
  especialidadToEdit = null,
  loading = false,
}) => {
  const isEditMode = Boolean(especialidadToEdit);

  const [formData, setFormData] = useState(initialEspecialidadFormState);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (especialidadToEdit) {
      setFormData({
        nombre: especialidadToEdit.nombre || '',
        descripcion: especialidadToEdit.descripcion || '',
        estado: especialidadToEdit.estado || 'ACTIVO',
      });
    } else {
      setFormData(initialEspecialidadFormState);
    }
    setLocalError(null);
  }, [especialidadToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) {
      setLocalError('El nombre de la especialidad debe contener al menos 3 caracteres.');
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || null,
      estado: formData.estado,
    };

    const res = await onSave(payload, especialidadToEdit?.id_especialidad);
    if (!res.success) {
      setLocalError(res.message || 'Error al guardar la especialidad.');
    }
  };

  const handleSelectSuggestion = (suggestedName) => {
    setFormData((prev) => ({
      ...prev,
      nombre: suggestedName,
    }));
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
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        position: 'relative',
      }}>
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            padding: '0.4rem',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
          }}
        >
          <X size={18} />
        </button>

        {/* CABECERA */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{
            display: 'inline-block',
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
            Catálogo Médico • CU04
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {isEditMode ? `Editar: ${especialidadToEdit.nombre}` : 'Nueva Especialidad Médica'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0.25rem 0 0' }}>
            {isEditMode
              ? 'Actualiza el nombre, descripción clínica o estado en el hospital.'
              : 'Registra un área de atención facultativa con validación de nombre único.'}
          </p>
        </div>

        {/* ALERTA DE ERROR */}
        {localError && (
          <div style={{
            padding: '0.75rem 0.9rem',
            borderRadius: '10px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 500 }}>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* NOMBRE DE LA ESPECIALIDAD */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Nombre de la Especialidad *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Stethoscope size={16} />
              </div>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="ej. Dermatología, Cardiología..."
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* SUGERENCIAS RÁPIDAS PARA CREACIÓN */}
            {!isEditMode && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Sugerencias:</span>
                {ESPECIALIDADES_SUGERIDAS.slice(0, 4).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSelectSuggestion(sug)}
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '9999px',
                      padding: '0.2rem 0.6rem',
                      color: '#0284c7',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Descripción Clínica (Opcional)
            </label>
            <textarea
              rows={3}
              disabled={loading}
              placeholder="Alcance de atención, diagnóstico y tratamiento..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.86rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {/* ESTADO */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Estado del Servicio *
            </label>
            <select
              value={formData.estado}
              disabled={loading}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.86rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ACTIVO">Activo (Disponible para citas)</option>
              <option value="INACTIVO">Inactivo (Pausado temporalmente)</option>
            </select>
          </div>

          {/* BOTONES */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: '#0284c7',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Guardando en PostgreSQL...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  {isEditMode ? 'Guardar Cambios' : 'Registrar Especialidad'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEspecialidadForm;
