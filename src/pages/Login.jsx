import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchWithRetry, classifyError, ErrorTypes } from '../utils/fetchWithRetry';
import { useRateLimiter } from '../hooks/useRateLimiter';
import { API_ENDPOINTS } from '../config/api.config';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [retryInfo, setRetryInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Rate limiter para prevenir ataques de fuerza bruta
  const rateLimiter = useRateLimiter({
    maxAttempts: 5,
    windowMs: 60000, // 1 minuto
    lockoutMs: 30000, // 30 segundos de bloqueo
    storageKey: 'login_rate_limit'
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

  <div className="form-group">
    <label htmlFor="password">Contraseña</label>
    <input
      type="password"
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Ingrese su contraseña"
      className={errors.password ? 'input-error' : ''}
      disabled={isLoading}
    />
    {errors.password && <span className="error-text">{errors.password}</span>}
  </div>
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
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
        API_ENDPOINTS.AUTH.LOGIN,
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
        // Login exitoso - resetear rate limiter y redireccionar
        rateLimiter.recordSuccess();
        login(data.token, data.user.email);
        navigate('/dashboard');
      } else {
        // Error en el login - registrar intento fallido
        rateLimiter.recordAttempt();

        // Mostrar advertencia si quedan pocos intentos
        const status = rateLimiter.getStatus();
        let errorMessage = data.error || 'Credenciales inválidas';

        if (status.remainingAttempts <= 2 && status.remainingAttempts > 0) {
          errorMessage += ` (${status.remainingAttempts} intentos restantes)`;
        }

        setApiError(errorMessage);
      }
    } catch (error) {
      // Clasificar el error para mostrar mensaje apropiado
      const errorInfo = classifyError(error);

      // Solo registrar intento si no es error de red (el usuario puede reintentar)
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
          <h2>Iniciar Sesión</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {apiError && (
            <div className="error-message api-error">
              {apiError}
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
              placeholder="Ingrese su contraseña"
              className={errors.password ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || rateLimiter.isLocked}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="oauth-divider">
            <span>o</span>
          </div>
          <a
            href="http://localhost:3001/api/oauth/google"
            className="auth-button google-login"
            style={{ background: '#fff', color: '#333', border: '1px solid #ccc', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 20, height: 20, marginRight: 8 }} />
            Iniciar sesión con Google
          </a>
        </form>

        <div className="auth-footer">
          <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
  ;
}
export default Login;
