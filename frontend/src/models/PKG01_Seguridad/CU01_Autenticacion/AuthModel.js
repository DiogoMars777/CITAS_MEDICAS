/**
 * Modelo de datos y validadores para CU01 - Autenticación y Recuperación
 * Clínica Vida Salud (2026)
 */

export const initialLoginFormState = {
  login: '',
  password: '',
  rememberMe: false,
};

export const initialRecoveryFormState = {
  email: '',
  otp: '',
  newPassword: '',
  confirmPassword: '',
  resetTicket: '',
};

/**
 * Validador reactivo de requisitos de contraseña ("Foquitos")
 * Retorna el estado individual de cada uno de los requisitos.
 */
export const checkPasswordRequirements = (password = '', confirmPassword = '') => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(password);
  const hasMatch = Boolean(password && confirmPassword && password === confirmPassword);

  const passedCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    hasMatch,
  ].filter(Boolean).length;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    hasMatch,
    passedCount,
    isAllValid: passedCount === 6,
  };
};

/**
 * Formateador de tiempo para bloqueo de 2 minutos (MM:SS)
 */
export const formatCooldownTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
