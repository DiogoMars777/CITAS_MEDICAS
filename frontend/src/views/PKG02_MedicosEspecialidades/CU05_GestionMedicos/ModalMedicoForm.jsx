import React, { useState, useEffect } from 'react';
import {
  X,
  Stethoscope,
  User,
  BadgeCheck,
  Mail,
  Phone,
  Calendar,
  Lock,
  Star,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';
import { getInitialMedicoFormState } from '../../../models/PKG02_MedicosEspecialidades/CU05_GestionMedicos/MedicoModel';

export const ModalMedicoForm = ({
  isOpen,
  onClose,
  onSave,
  medicoToEdit = null,
  especialidadesMeta = [],
  usuariosDisponiblesMeta = [],
  loading = false,
}) => {
  const isEditMode = Boolean(medicoToEdit);

  const [formData, setFormData] = useState(getInitialMedicoFormState());
  const [selectedEspecialidades, setSelectedEspecialidades] = useState([]); // [{ id_especialidad, nombre, es_principal }]
  const [especialidadToAdd, setEspecialidadToAdd] = useState('');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (medicoToEdit) {
      setFormData({
        nombres: medicoToEdit.nombres || '',
        apellidos: medicoToEdit.apellidos || '',
        numero_registro_profesional: medicoToEdit.numero_registro_profesional || '',
        telefono: medicoToEdit.telefono || '',
        email: medicoToEdit.email || '',
        fecha_ingreso: medicoToEdit.fecha_ingreso || new Date().toISOString().split('T')[0],
        estado: medicoToEdit.estado || 'ACTIVO',
        crear_usuario: false,
        id_usuario: medicoToEdit.id_usuario || '',
        username: medicoToEdit.username || '',
        password: '',
      });

      // Mapear especialidades existentes
      if (Array.isArray(medicoToEdit.especialidades)) {
        setSelectedEspecialidades(
          medicoToEdit.especialidades.map((e) => ({
            id_especialidad: e.id_especialidad,
            nombre: e.nombre,
            es_principal: Boolean(e.es_principal),
          }))
        );
      } else {
        setSelectedEspecialidades([]);
      }
    } else {
      setFormData(getInitialMedicoFormState());
      setSelectedEspecialidades([]);
    }
    setLocalError(null);
  }, [medicoToEdit, isOpen]);

  if (!isOpen) return null;

  // Agregar especialidad
  const handleAddEspecialidad = () => {
    if (!especialidadToAdd) return;
    const espId = parseInt(especialidadToAdd, 10);
    const yaExiste = selectedEspecialidades.some((e) => e.id_especialidad === espId);
    if (yaExiste) {
      setLocalError('Esta especialidad ya fue asignada al médico.');
      return;
    }

    const espMeta = especialidadesMeta.find((e) => e.id_especialidad === espId);
    if (!espMeta) return;

    // Si es la primera, marcarla como principal por defecto
    const esPrimera = selectedEspecialidades.length === 0;
    setSelectedEspecialidades((prev) => [
      ...prev,
      {
        id_especialidad: espMeta.id_especialidad,
        nombre: espMeta.nombre,
        es_principal: esPrimera,
      },
    ]);
    setEspecialidadToAdd('');
    setLocalError(null);
  };

  // Quitar especialidad
  const handleRemoveEspecialidad = (id) => {
    setSelectedEspecialidades((prev) => {
      const filtered = prev.filter((e) => e.id_especialidad !== id);
      // Si eliminamos la principal y quedan otras, marcar la primera como principal
      if (filtered.length > 0 && !filtered.some((e) => e.es_principal)) {
        filtered[0].es_principal = true;
      }
      return filtered;
    });
  };

  // Marcar como principal
  const handleSetPrincipal = (id) => {
    setSelectedEspecialidades((prev) =>
      prev.map((e) => ({
        ...e,
        es_principal: e.id_especialidad === id,
      }))
    );
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (selectedEspecialidades.length === 0) {
      setLocalError('Debe asignar al menos una especialidad médica al profesional.');
      return;
    }

    if (!isEditMode) {
      if (formData.crear_usuario) {
        if (!formData.username.trim() || formData.username.trim().length < 3) {
          setLocalError('El nombre de usuario debe contener al menos 3 caracteres.');
          return;
        }
        if (!formData.password || formData.password.length < 8) {
          setLocalError('La contraseña inicial debe contener al menos 8 caracteres.');
          return;
        }
      } else if (!formData.id_usuario) {
        setLocalError('Debe seleccionar una cuenta de usuario existente o elegir crear una nueva.');
        return;
      }
    }

    const payload = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      numero_registro_profesional: formData.numero_registro_profesional.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      fecha_ingreso: formData.fecha_ingreso,
      estado: formData.estado,
      especialidades: selectedEspecialidades.map((e) => ({
        id_especialidad: e.id_especialidad,
        es_principal: Boolean(e.es_principal),
      })),
    };

    if (!isEditMode) {
      payload.crear_usuario = formData.crear_usuario;
      if (formData.crear_usuario) {
        payload.username = formData.username.trim();
        payload.password = formData.password;
      } else {
        payload.id_usuario = parseInt(formData.id_usuario, 10);
      }
    }

    const res = await onSave(payload, medicoToEdit?.id_medico);
    if (!res.success) {
      setLocalError(res.message || 'Error al guardar los datos del médico.');
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
        maxWidth: '680px',
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
            Personal Clínico • CU05
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {isEditMode ? `Editar: Dr(a). ${medicoToEdit.nombre_completo}` : 'Registrar Nuevo Médico'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
            {isEditMode
              ? 'Actualice los datos profesionales, teléfono, correo y especialidades asignadas.'
              : 'Registre los datos profesionales, matrícula profesional única y vincule especialidades.'}
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
          {/* SECCIÓN 1: DATOS PERSONALES Y MATRÍCULA */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              1. Datos Personales y Profesionales
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Nombres *
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="ej. Carlos Alberto"
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
                  placeholder="ej. Mendoza Suárez"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Matrícula Profesional / Registro Único *
                </label>
                <div style={{ position: 'relative' }}>
                  <BadgeCheck size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    disabled={loading}
                    placeholder="ej. MP-98432 o COL-MED-5401"
                    value={formData.numero_registro_profesional}
                    onChange={(e) => setFormData({ ...formData, numero_registro_profesional: e.target.value })}
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
                  Fecha de Ingreso *
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="date"
                    required
                    disabled={loading}
                    value={formData.fecha_ingreso}
                    onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Teléfono / Móvil *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    disabled={loading}
                    placeholder="ej. 70012345"
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

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Correo Electrónico *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    disabled={loading}
                    placeholder="ej. medico@clinicavidasalud.com"
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
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Estado de Disponibilidad *
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
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              >
                <option value="ACTIVO">Activo (Habilitado para turnos y citas)</option>
                <option value="INACTIVO">Inactivo (Suspendido o de baja)</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN 2: CUENTA DE USUARIO */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              2. Cuenta de Acceso al Sistema
            </div>

            {isEditMode ? (
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <User size={15} color="#0284c7" />
                <span>Cuenta de usuario vinculada: <strong style={{ color: '#0f172a' }}>{medicoToEdit.username || 'Sin username'}</strong> (ID #{medicoToEdit.id_usuario})</span>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#334155', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="tipo_cuenta"
                      checked={!formData.crear_usuario}
                      onChange={() => setFormData({ ...formData, crear_usuario: false })}
                    />
                    <span>Vincular cuenta con rol Médico existente</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#334155', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="tipo_cuenta"
                      checked={formData.crear_usuario}
                      onChange={() => setFormData({ ...formData, crear_usuario: true })}
                    />
                    <span>Crear nueva cuenta de usuario</span>
                  </label>
                </div>

                {!formData.crear_usuario ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                      Usuario disponible con Rol Médico *
                    </label>
                    <select
                      value={formData.id_usuario}
                      onChange={(e) => {
                        const val = e.target.value;
                        const u = usuariosDisponiblesMeta.find((usr) => String(usr.id_usuario) === String(val));
                        setFormData((prev) => ({
                          ...prev,
                          id_usuario: val,
                          email: u ? u.email : prev.email,
                        }));
                      }}
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
                      <option value="">-- Seleccione una cuenta de usuario disponible --</option>
                      {usuariosDisponiblesMeta.map((usr) => (
                        <option key={usr.id_usuario} value={usr.id_usuario}>
                          {usr.username} ({usr.email})
                        </option>
                      ))}
                    </select>
                    {usuariosDisponiblesMeta.length === 0 && (
                      <div style={{ fontSize: '0.74rem', color: '#d97706', marginTop: '0.35rem', fontWeight: 500 }}>
                        No hay usuarios con rol Médico sin perfil asignado. Seleccione "Crear nueva cuenta de usuario" arriba.
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                        Nombre de Usuario (Username) *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                          type="text"
                          required
                          placeholder="ej. dr.carlos"
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
                        Contraseña de Acceso (mín 8 car.) *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                          type="password"
                          required
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
          </div>

          {/* SECCIÓN 3: ASIGNACIÓN N:M DE ESPECIALIDADES */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                3. Especialidades Clínicas Asignadas (N:M) *
              </div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                {selectedEspecialidades.length} asignada(s)
              </span>
            </div>

            {/* SELECTOR PARA AGREGAR */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <select
                value={especialidadToAdd}
                onChange={(e) => setEspecialidadToAdd(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.7rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              >
                <option value="">-- Seleccionar especialidad a vincular --</option>
                {especialidadesMeta.map((esp) => {
                  const yaAsignada = selectedEspecialidades.some((e) => e.id_especialidad === esp.id_especialidad);
                  return (
                    <option key={esp.id_especialidad} value={esp.id_especialidad} disabled={yaAsignada}>
                      {esp.nombre} {yaAsignada ? '(Ya agregada)' : ''}
                    </option>
                  );
                })}
              </select>

              <button
                type="button"
                onClick={handleAddEspecialidad}
                disabled={!especialidadToAdd}
                style={{
                  padding: '0.55rem 0.95rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: especialidadToAdd ? '#0284c7' : '#f1f5f9',
                  color: especialidadToAdd ? '#ffffff' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: especialidadToAdd ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: especialidadToAdd ? '0 1px 2px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                <Plus size={14} />
                Agregar
              </button>
            </div>

            {/* LISTA DE ESPECIALIDADES ASIGNADAS */}
            {selectedEspecialidades.length === 0 ? (
              <div style={{
                padding: '1.25rem',
                textAlign: 'center',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                color: '#64748b',
                fontSize: '0.82rem',
              }}>
                No hay especialidades asignadas. Debe seleccionar al menos una del catálogo arriba.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {selectedEspecialidades.map((esp) => (
                  <div
                    key={esp.id_especialidad}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: esp.es_principal ? '#f0f9ff' : '#f8fafc',
                      border: esp.es_principal ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <Stethoscope size={15} color={esp.es_principal ? '#0284c7' : '#64748b'} />
                      <span style={{ fontSize: '0.84rem', fontWeight: esp.es_principal ? 700 : 500, color: esp.es_principal ? '#0369a1' : '#1e293b' }}>
                        {esp.nombre}
                      </span>
                      {esp.es_principal && (
                        <span style={{
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: '#e0f2fe',
                          color: '#0284c7',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <Star size={10} fill="#0284c7" color="#0284c7" />
                          Principal
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      {!esp.es_principal && (
                        <button
                          type="button"
                          onClick={() => handleSetPrincipal(esp.id_especialidad)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            color: '#475569',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          Hacer principal
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveEspecialidad(esp.id_especialidad)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          padding: '0.25rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTONES DE ACCIÓN */}
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
                  {isEditMode ? 'Guardar Cambios' : 'Registrar Médico'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMedicoForm;
