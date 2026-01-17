/**
 * Utilidad para realizar peticiones HTTP con reintentos automáticos
 * Implementa una estrategia de "exponential backoff" para manejar errores de red
 * 
 * @param {string} url - URL de la petición
 * @param {Object} options - Opciones de fetch (method, headers, body, etc.)
 * @param {Object} retryConfig - Configuración de reintentos
 * @param {number} retryConfig.maxRetries - Número máximo de reintentos (default: 3)
 * @param {number} retryConfig.baseDelay - Delay base en ms (default: 1000)
 * @param {function} retryConfig.onRetry - Callback llamado en cada reintento
 * @returns {Promise<Response>} - Respuesta del fetch
 */
export const fetchWithRetry = async (
  url,
  options = {},
  retryConfig = {}
) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    onRetry = null
  } = retryConfig;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        // Agregar timeout usando AbortController
        signal: options.signal || AbortSignal.timeout(10000)
      });
      
      // Si la respuesta es exitosa o es un error del cliente (4xx), retornar
      // Solo reintentar en errores de servidor (5xx) o errores de red
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }
      
      // Error del servidor (5xx) - intentar de nuevo
      if (response.status >= 500) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // No reintentar si es un error de abort manual
      if (error.name === 'AbortError' && options.signal?.aborted) {
        throw error;
      }
      
      // Si aún quedan reintentos, esperar y volver a intentar
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        const delay = baseDelay * Math.pow(2, attempt);
        
        // Llamar al callback de reintento si existe
        if (onRetry) {
          onRetry({
            attempt: attempt + 1,
            maxRetries,
            delay,
            error: getErrorMessage(error)
          });
        }
        
        await sleep(delay);
      }
    }
  }
  
  // Si llegamos aquí, todos los reintentos fallaron
  throw new NetworkError(
    'No se pudo conectar con el servidor después de varios intentos. ' +
    'Por favor, verifique su conexión a internet e intente nuevamente.',
    lastError
  );
};

/**
 * Función auxiliar para pausar la ejecución
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtener un mensaje de error legible
 */
const getErrorMessage = (error) => {
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return 'Error de conexión a internet';
  }
  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    return 'La solicitud tardó demasiado tiempo';
  }
  return error.message || 'Error desconocido';
};

/**
 * Error personalizado para errores de red
 */
export class NetworkError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
    this.isNetworkError = true;
  }
}

/**
 * Tipos de errores que se pueden mostrar al usuario
 */
export const ErrorTypes = {
  NETWORK: 'network',
  SERVER: 'server',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  UNKNOWN: 'unknown'
};

/**
 * Clasificar el tipo de error para mostrar mensajes apropiados
 */
export const classifyError = (error, response = null) => {
  if (error?.isNetworkError || error?.name === 'TypeError') {
    return {
      type: ErrorTypes.NETWORK,
      message: 'Error de conexión. Verifique su internet e intente nuevamente.',
      canRetry: true
    };
  }
  
  if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
    return {
      type: ErrorTypes.NETWORK,
      message: 'La solicitud tardó demasiado. Intente nuevamente.',
      canRetry: true
    };
  }
  
  if (response) {
    if (response.status === 401 || response.status === 403) {
      return {
        type: ErrorTypes.AUTHENTICATION,
        message: 'Credenciales inválidas. Verifique sus datos.',
        canRetry: false
      };
    }
    
    if (response.status >= 500) {
      return {
        type: ErrorTypes.SERVER,
        message: 'Error en el servidor. Intente más tarde.',
        canRetry: true
      };
    }
    
    if (response.status >= 400) {
      return {
        type: ErrorTypes.VALIDATION,
        message: 'Datos inválidos. Verifique la información ingresada.',
        canRetry: false
      };
    }
  }
  
  return {
    type: ErrorTypes.UNKNOWN,
    message: 'Ocurrió un error inesperado. Intente nuevamente.',
    canRetry: true
  };
};
