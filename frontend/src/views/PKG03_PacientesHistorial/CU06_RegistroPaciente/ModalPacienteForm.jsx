import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Heart,
  ShieldAlert,
  FileText,
  Lock,
} from 'lucide-react';
import {
  getInitialPacienteFormState,
  TIPOS_SANGRE,
  PARENTESCOS,
} from '../../../models/PKG03_PacientesHistorial/CU06_RegistroPaciente/PacienteModel';

export const ModalPacienteForm = ({
  isOpen,
  onClose,
  onSave,
  pacienteToEdit = null,
  loading = false,
}) => {
  const isEditMode = Boolean(pacienteToEdit);

  const [formData, setFormData] = useState(getInitialPacienteFormState());
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (pacienteToEdit) {
      setFormData({
        ci: pacienteToEdit.ci || '',
        nombres: pacienteToEdit.nombres || '',
        apellidos: pacienteToEdit.apellidos || '',
        fecha_nacimiento: pacienteToEdit.fecha_nacimiento || '',
        sexo: pacienteToEdit.sexo || 'MASCULINO',
        telefono: pacienteToEdit.telefono || '',
        email: pacienteToEdit.email || '',
        direccion: pacienteToEdit.direccion || '',
        primera_visita: Boolean(pacienteToEdit.primera_visita),
        estado: pacienteToEdit.estado || 'ACTIVO',

        crear_usuario: false,
        username: pacienteToEdit.username || '',
        password: '',

        contacto_nombre: pacienteToEdit.contacto_emergencia?.nombre || '',
        contacto_parentesco: pacienteToEdit.contacto_emergencia?.parentesco || 'Familiar',
        contacto_telefono: pacienteToEdit.contacto_emergencia?.telefono || '',
        contacto_direccion: '',

        aperturar_expediente: false,
        tipo_sangre: pacienteToEdit.tipo_sangre || 'O+',
        alergias_medicamentos: pacienteToEdit.alergias || '',
        antecedentes_patologicos: '',
        antecedentes_quirurgicos: '',
        enfermedades_hereditarias: '',
      });
    } else {
      setFormData(getInitialPacienteFormState());
    }
    setLocalError(null);
  }, [pacienteToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto calcular edad orientativa
  const calcularEdad = (fecha) => {
    if (!fecha) return null;
    const diff = Date.now() - new Date(fecha).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const edadActual = calcularEdad(formData.fecha_nacimiento);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.ci.trim() || formData.ci.trim().length < 4) {
      setLocalError('El Carnet de Identidad (CI) debe contener al menos 4 caracteres.');
      return;
    }

    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      setLocalError('Los nombres y apellidos del paciente son obligatorios.');
      return;
    }

    if (!formData.telefono.trim()) {
      setLocalError('El teléfono o celular es obligatorio para el contacto clínico.');
      return;
    }

    if (!isEditMode && formData.crear_usuario) {
      if (!formData.username.trim() || formData.username.trim().length < 3) {
        setLocalError('El nombre de usuario digital debe tener al menos 3 caracteres.');
        return;
      }
      if (!formData.password || formData.password.length < 8) {
        setLocalError('La contraseña inicial del portal debe tener al menos 8 caracteres.');
        return;
      }
    }

    const payload = {
      ci: formData.ci.trim().toUpperCase(),
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      fecha_nacimiento: formData.fecha_nacimiento,
      sexo: formData.sexo,
      telefono: formData.telefono.trim(),
      email: formData.email.trim() || null,
      direccion: formData.direccion.trim() || null,
      primera_visita: formData.primera_visita,
      estado: formData.estado,

      // Contacto
      contacto_nombre: formData.contacto_nombre.trim() || null,
      contacto_parentesco: formData.contacto_parentesco || null,
      contacto_telefono: formData.contacto_telefono.trim() || null,
      contacto_direccion: formData.contacto_direccion.trim() || null,

      // Expediente
      aperturar_expediente: formData.aperturar_expediente,
      tipo_sangre: formData.tipo_sangre,
      alergias_medicamentos: formData.alergias_medicamentos.trim() || null,
      antecedentes_patologicos: formData.antecedentes_patologicos.trim() || null,
      antecedentes_quirurgicos: formData.antecedentes_quirurgicos.trim() || null,
      enfermedades_hereditarias: formData.enfermedades_hereditarias.trim() || null,
    };

    if (!isEditMode) {
      payload.crear_usuario = formData.crear_usuario;
      if (formData.crear_usuario) {
        payload.username = formData.username.trim();
        payload.password = formData.password;
      }
    }

    const res = await onSave(payload, pacienteToEdit?.id_paciente);
    if (!res.success) {
      setLocalError(res.message || 'Error al guardar los datos del paciente.');
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
        borderRadius: '16px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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
            Admisión de Pacientes • CU06
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {isEditMode ? `Editar Ficha: ${pacienteToEdit.nombre_completo}` : 'Registro y Apertura de Paciente'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
            {isEditMode
              ? 'Actualice los datos personales, contacto de emergencia o expediente clínico.'
              : 'Filiación de paciente, control de CI único, apertura de expediente en primera visita y portal digital.'}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              1. Datos de Filiación del Paciente
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1.4fr', gap: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Cédula de Identidad (CI) *
                </label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    disabled={loading}
                    placeholder="ej. 8765432-LP"
                    value={formData.ci}
                    onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.7rem 0.55rem 2rem',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Nombres *
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="ej. Juan Pablo"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Apellidos *
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="ej. Pérez Gómez"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.65rem', marginTop: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Fecha de Nacimiento * {edadActual !== null && <span style={{ color: '#059669' }}>({edadActual} años)</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="date"
                    required
                    disabled={loading}
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.7rem 0.55rem 2rem',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Sexo Biológico *
                </label>
                <select
                  value={formData.sexo}
                  disabled={loading}
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                >
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Teléfono / Celular *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    disabled={loading}
                    placeholder="ej. 75598765"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.7rem 0.55rem 2rem',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '0.65rem', marginTop: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Correo Electrónico (Opcional)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    disabled={loading}
                    placeholder="ej. juan.perez@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.7rem 0.55rem 2rem',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Dirección de Residencia
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    disabled={loading}
                    placeholder="ej. Av. Las Américas #450, Zona Sur"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.7rem 0.55rem 2rem',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#334155', cursor: 'pointer', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={formData.primera_visita}
                  onChange={(e) => setFormData({ ...formData, primera_visita: e.target.checked })}
                />
                <span>¿Es la primera visita del paciente a la clínica?</span>
              </label>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Estado:</span>
                <select
                  value={formData.estado}
                  disabled={loading}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.78rem',
                    outline: 'none',
                  }}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: CONTACTO DE EMERGENCIA */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              2. Contacto de Emergencia
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Nombre Completo del Contacto
                </label>
                <input
                  type="text"
                  disabled={loading}
                  placeholder="ej. María Gómez (Madre)"
                  value={formData.contacto_nombre}
                  onChange={(e) => setFormData({ ...formData, contacto_nombre: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Parentesco
                </label>
                <select
                  value={formData.contacto_parentesco}
                  disabled={loading}
                  onChange={(e) => setFormData({ ...formData, contacto_parentesco: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                >
                  {PARENTESCOS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Teléfono de Emergencia
                </label>
                <input
                  type="text"
                  disabled={loading}
                  placeholder="ej. 71122334"
                  value={formData.contacto_telefono}
                  onChange={(e) => setFormData({ ...formData, contacto_telefono: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: APERTURA DE EXPEDIENTE / HISTORIA CLÍNICA */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                3. Apertura de Expediente Clínico (Historia Clínica)
              </div>
              {!isEditMode && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#0284c7', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.aperturar_expediente}
                    onChange={(e) => setFormData({ ...formData, aperturar_expediente: e.target.checked })}
                  />
                  <span>Generar expediente automático</span>
                </label>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Tipo de Sangre
                </label>
                <select
                  value={formData.tipo_sangre}
                  disabled={loading}
                  onChange={(e) => setFormData({ ...formData, tipo_sangre: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                >
                  {TIPOS_SANGRE.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Alergias a Medicamentos
                </label>
                <input
                  type="text"
                  disabled={loading}
                  placeholder="ej. Penicilina, AINEs o Ninguna conocida"
                  value={formData.alergias_medicamentos}
                  onChange={(e) => setFormData({ ...formData, alergias_medicamentos: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '0.65rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Antecedentes Patológicos Relevantes
              </label>
              <textarea
                rows={2}
                disabled={loading}
                placeholder="ej. Hipertensión arterial, Diabetes Mellitus Tipo 2, Asma..."
                value={formData.antecedentes_patologicos}
                onChange={(e) => setFormData({ ...formData, antecedentes_patologicos: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.84rem',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>
          </div>

          {/* SECCIÓN 4: CUENTA DIGITAL DEL PACIENTE */}
          {!isEditMode && (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  4. Portal Digital y Citas Web (Opcional)
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#7c3aed', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.crear_usuario}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        crear_usuario: checked,
                        username: checked && !prev.username ? (prev.ci || '') : prev.username,
                      }));
                    }}
                  />
                  <span>Habilitar cuenta digital</span>
                </label>
              </div>

              {formData.crear_usuario && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                      Usuario Digital (Username) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="text"
                        required
                        disabled={loading}
                        placeholder="ej. CI o correo"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.7rem 0.55rem 2rem',
                          borderRadius: '6px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#0f172a',
                          fontSize: '0.84rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                      Contraseña Inicial (mín. 8 car.) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="password"
                        required
                        disabled={loading}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.7rem 0.55rem 2rem',
                          borderRadius: '6px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#0f172a',
                          fontSize: '0.84rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOTONES */}
          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.84rem',
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
                borderRadius: '8px',
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
                  {isEditMode ? 'Guardar Cambios' : 'Registrar Paciente y Abrir Expediente'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPacienteForm;
