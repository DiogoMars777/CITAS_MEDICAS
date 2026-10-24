import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { PasswordRequirementBulbs } from '../CU01_Autenticacion/PasswordRequirementBulbs';
import { checkPasswordRequirements } from '../../../models/PKG01_Seguridad/CU01_Autenticacion/AuthModel';
import { initialUserFormState } from '../../../models/PKG01_Seguridad/CU03_GestionUsuarios/UsuarioModel';

export const ModalUsuarioForm = ({
  isOpen,
  onClose,
  onSave,
  roles = [],
  userToEdit = null,
  loading = false,
}) => {
  const isEditMode = Boolean(userToEdit);

  const [formData, setFormData] = useState(initialUserFormState);
  const [changePasswordInEdit, setChangePasswordInEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Cargar datos en caso de edición
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        username: userToEdit.username || '',
        email: userToEdit.email || '',
        password: '',
        confirmPassword: '',
        id_rol: userToEdit.id_rol || (roles[0]?.id_rol ?? 2),
        estado: userToEdit.estado || 'ACTIVO',
      });
      setChangePasswordInEdit(false);
    } else {
      setFormData({
        ...initialUserFormState,
        id_rol: roles[1]?.id_rol ?? roles[0]?.id_rol ?? 2,
      });
      setChangePasswordInEdit(true);
    }
    setLocalError(null);
  }, [userToEdit, isOpen, roles]);

  if (!isOpen) return null;

  // Evaluación de requisitos de contraseña
  const passwordRequirements = checkPasswordRequirements(
    formData.password,
    formData.confirmPassword
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Validaciones de contraseña
    if (!isEditMode || (isEditMode && changePasswordInEdit)) {
      if (!isEditMode && !formData.password) {
        setLocalError('La contraseña es obligatoria para nuevos usuarios.');
        return;
      }
      if (formData.password) {
        if (!passwordRequirements.isValid) {
          setLocalError('La contraseña no cumple con todas las directivas de seguridad requeridas.');
          return;
        }
      }
    }

    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      id_rol: parseInt(formData.id_rol, 10),
      estado: formData.estado,
    };

    if ((!isEditMode && formData.password) || (isEditMode && changePasswordInEdit && formData.password)) {
      payload.password = formData.password;
    }

    const res = await onSave(payload, userToEdit?.id_usuario);
    if (!res.success) {
      setLocalError(res.message || 'Error al guardar los datos del usuario.');
    }
  };

  const selectedRoleObj = roles.find((r) => r.id_rol === parseInt(formData.id_rol, 10));

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
      overflowY: 'auto',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '540px',
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        maxHeight: '92vh',
        overflowY: 'auto',
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
            borderRadius: '6px',
            padding: '0.4rem',
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
            CU03 • Seguridad PostgreSQL
          </span>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {isEditMode ? `Editar Usuario: ${userToEdit.username}` : 'Registrar Nuevo Usuario Interno'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {isEditMode
              ? 'Actualiza el rol, estado de acceso o restablece la contraseña del personal.'
              : 'Crea una nueva cuenta de acceso institucional con encriptación Bcrypt.'}
          </p>
        </div>

        {/* ALERTA DE ERROR */}
        {localError && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 500 }}>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* USERNAME */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Nombre de Usuario (Login) *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <User size={16} />
              </div>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="ej. dr.rodriguez"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
          </div>

          {/* EMAIL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Correo Electrónico Institucional *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="usuario@clinicavidasalud.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          </div>

          {/* ROL Y ESTADO (GRID 2 COLUMNAS) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* ROL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Rol Asignado *
              </label>
              <select
                value={formData.id_rol}
                disabled={loading}
                onChange={(e) => setFormData({ ...formData, id_rol: parseInt(e.target.value, 10) })}
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
                {roles.map((r) => (
                  <option key={r.id_rol} value={r.id_rol}>
                    {r.nombre_rol}
                  </option>
                ))}
              </select>
            </div>

            {/* ESTADO */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Estado de la Cuenta *
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
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
                <option value="BLOQUEADO">BLOQUEADO</option>
              </select>
            </div>
          </div>

          {selectedRoleObj?.descripcion && (
            <div style={{
              fontSize: '0.78rem',
              color: '#475569',
              padding: '0.6rem 0.85rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}>
              <strong style={{ color: '#0f172a' }}>Privilegio de rol:</strong> {selectedRoleObj.descripcion}
            </div>
          )}

          {/* SECCIÓN DE CONTRASEÑA */}
          {isEditMode && (
            <div style={{ marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setChangePasswordInEdit(!changePasswordInEdit)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: changePasswordInEdit ? '#d97706' : '#0284c7',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: 0,
                }}
              >
                <Lock size={14} />
                {changePasswordInEdit ? 'Cancelar cambio de contraseña' : '¿Deseas restablecer la contraseña?'}
              </button>
            </div>
          )}

          {(!isEditMode || changePasswordInEdit) && (
            <div style={{
              padding: '1.15rem',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isEditMode ? 'Nueva Contraseña' : 'Contraseña de Acceso *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!isEditMode}
                    disabled={loading}
                    placeholder="Mínimo 8 caracteres..."
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.75rem 0.65rem 0.85rem',
                      borderRadius: '10px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Confirmar Contraseña *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required={Boolean(formData.password)}
                    disabled={loading}
                    placeholder="Repite la contraseña..."
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.75rem 0.65rem 0.85rem',
                      borderRadius: '10px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* FOQUITOS DE SEGURIDAD REACTIVOS */}
              <PasswordRequirementBulbs
                requirements={passwordRequirements}
                password={formData.password}
                confirmPassword={formData.confirmPassword}
              />
            </div>
          )}

          {/* BOTONES DE ACCIÓN */}
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
                  {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuarioForm;
