import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithRetry, classifyError, ErrorTypes } from '../utils/fetchWithRetry';
import { useRateLimiter } from '../hooks/useRateLimiter';
import { API_ENDPOINTS } from '../config/api.config';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [retryInfo, setRetryInfo] = useState(null);

  // Rate limiter para prevenir registros abusivos
  const rateLimiter = useRateLimiter({
    maxAttempts: 3,
    windowMs: 120000, // 2 minutos
    lockoutMs: 60000, // 1 minuto de bloqueo
    storageKey: 'register_rate_limit'
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email vacío
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }

    // Validar contraseña vacía
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setRetryInfo(null);

    if (!validateForm()) {
      return;
    }

    // Verificar rate limiting antes de intentar
    const limitCheck = rateLimiter.checkLimit();
    if (!limitCheck.allowed) {
      setApiError(limitCheck.message);
      return;
    }

    setIsLoading(true);

    try {
      // Usar fetchWithRetry para manejo robusto de errores de red
      const response = await fetchWithRetry(
        API_ENDPOINTS.AUTH.REGISTER,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        },
        {
          maxRetries: 3,
          baseDelay: 1000,
          onRetry: (info) => {
            setRetryInfo({
              attempt: info.attempt,
              maxRetries: info.maxRetries,
              message: `Reintentando conexión (${info.attempt}/${info.maxRetries})...`
            });
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso - resetear rate limiter
        rateLimiter.recordSuccess();
        setSuccessMessage('¡Registro exitoso! Redirigiendo al login...');
        
        // Redireccionar al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Error en el registro - registrar intento fallido
        rateLimiter.recordAttempt();
        
        // Mostrar advertencia si quedan pocos intentos
        const status = rateLimiter.getStatus();
        let errorMessage = data.error || 'Error al registrar el usuario';
        
        if (status.remainingAttempts > 0 && status.remainingAttempts <= 2) {
          errorMessage += ` (${status.remainingAttempts} intentos restantes)`;
        }
        
        setApiError(errorMessage);
      }
    } catch (error) {
      // Clasificar el error para mostrar mensaje apropiado
      const errorInfo = classifyError(error);
      
      // Solo registrar intento si no es error de red
      if (errorInfo.type !== ErrorTypes.NETWORK) {
        rateLimiter.recordAttempt();
      }
      
      setApiError(errorInfo.message);
    } finally {
      setIsLoading(false);
      setRetryInfo(null);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">✈️</div>
          <h1>Agencia de Viajes Oeste</h1>
          <h2>Registro de Usuario</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {apiError && (
            <div className="error-message api-error">
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {retryInfo && (
            <div className="retry-message">
              <span className="retry-spinner"></span>
              {retryInfo.message}
            </div>
          )}

          {rateLimiter.isLocked && (
            <div className="lockout-message">
              <span className="lockout-icon">🔒</span>
              <span>Bloqueado temporalmente. Espere {rateLimiter.remainingSeconds} segundos.</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={errors.password ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repita la contraseña"
              className={errors.confirmPassword ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading || rateLimiter.isLocked}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
