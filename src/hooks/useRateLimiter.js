import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

/**
 * Obtener el estado inicial desde localStorage
 */
const getInitialState = (storageKey, windowMs) => {
  if (!storageKey) {
    return { attempts: [], lockoutEndTime: null, isLocked: false };
  }
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();
      
      // Filtrar intentos expirados
      const validAttempts = data.attempts?.filter(
        timestamp => now - timestamp < windowMs
      ) || [];
      
      // Verificar si todavía está bloqueado
      const isLocked = data.lockoutEndTime && data.lockoutEndTime > now;
      const remainingTime = isLocked ? Math.max(0, data.lockoutEndTime - now) : 0;
      
      return {
        attempts: validAttempts,
        lockoutEndTime: isLocked ? data.lockoutEndTime : null,
        isLocked,
        remainingTime
      };
    }
  } catch (e) {
    console.warn('Error loading rate limiter state:', e);
  }
  
  return { attempts: [], lockoutEndTime: null, isLocked: false, remainingTime: 0 };
};

/**
 * Hook personalizado para implementar rate limiting en el frontend
 * Previene intentos repetidos de acciones (como login) para mitigar
 * ataques de fuerza bruta desde la interfaz
 * 
 * @param {Object} config - Configuración del rate limiter
 * @param {number} config.maxAttempts - Número máximo de intentos permitidos (default: 5)
 * @param {number} config.windowMs - Ventana de tiempo en ms (default: 60000 = 1 minuto)
 * @param {number} config.lockoutMs - Tiempo de bloqueo después de exceder intentos (default: 30000 = 30 segundos)
 * @param {string} config.storageKey - Clave para persistir en localStorage (opcional)
 * @returns {Object} - Estado y funciones del rate limiter
 */
export const useRateLimiter = (config = {}) => {
  const {
    maxAttempts = 5,
    windowMs = 60000, // 1 minuto
    lockoutMs = 30000, // 30 segundos de bloqueo
    storageKey = null
  } = config;

  // Obtener estado inicial desde localStorage
  const initialState = useMemo(
    () => getInitialState(storageKey, windowMs),
    [storageKey, windowMs]
  );

  // Estado para rastrear intentos
  const [attempts, setAttempts] = useState(initialState.attempts);
  const [isLocked, setIsLocked] = useState(initialState.isLocked);
  const [lockoutEndTime, setLockoutEndTime] = useState(initialState.lockoutEndTime);
  const [remainingTime, setRemainingTime] = useState(initialState.remainingTime || 0);
  
  const timerRef = useRef(null);

  // Guardar estado en localStorage cuando cambia
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          attempts,
          lockoutEndTime
        }));
      } catch (e) {
        console.warn('Error saving rate limiter state:', e);
      }
    }
  }, [attempts, lockoutEndTime, storageKey]);

  // Timer para actualizar el tiempo restante durante el bloqueo
  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      const updateRemainingTime = () => {
        const remaining = Math.max(0, lockoutEndTime - Date.now());
        setRemainingTime(remaining);
        
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutEndTime(null);
          setRemainingTime(0);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }
      };

      updateRemainingTime();
      timerRef.current = setInterval(updateRemainingTime, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isLocked, lockoutEndTime]);

  /**
   * Verificar si se puede realizar un intento
   * @returns {Object} - { allowed: boolean, remainingAttempts: number, message: string }
   */
  const checkLimit = useCallback(() => {
    const now = Date.now();

    // Si está bloqueado, no permitir
    if (isLocked) {
      const seconds = Math.ceil(remainingTime / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        message: `Demasiados intentos. Espere ${seconds} segundos.`,
        isLocked: true,
        remainingSeconds: seconds
      };
    }

    // Filtrar intentos dentro de la ventana de tiempo
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < windowMs
    );

    const remainingAttempts = Math.max(0, maxAttempts - recentAttempts.length);

    if (recentAttempts.length >= maxAttempts) {
      // Bloquear al usuario
      const newLockoutEnd = now + lockoutMs;
      setIsLocked(true);
      setLockoutEndTime(newLockoutEnd);
      
      const seconds = Math.ceil(lockoutMs / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        message: `Demasiados intentos fallidos. Por favor, espere ${seconds} segundos antes de intentar nuevamente.`,
        isLocked: true,
        remainingSeconds: seconds
      };
    }

    return {
      allowed: true,
      remainingAttempts,
      message: remainingAttempts <= 2 
        ? `Quedan ${remainingAttempts} intentos antes del bloqueo temporal.`
        : null,
      isLocked: false,
      remainingSeconds: 0
    };
  }, [attempts, isLocked, remainingTime, maxAttempts, windowMs, lockoutMs]);

  /**
   * Registrar un intento
   */
  const recordAttempt = useCallback(() => {
    const now = Date.now();
    
    // Limpiar intentos antiguos y agregar el nuevo
    setAttempts(prev => {
      const recentAttempts = prev.filter(
        timestamp => now - timestamp < windowMs
      );
      return [...recentAttempts, now];
    });
  }, [windowMs]);

  /**
   * Registrar un intento exitoso (resetea el contador si es exitoso)
   */
  const recordSuccess = useCallback(() => {
    setAttempts([]);
    setIsLocked(false);
    setLockoutEndTime(null);
    setRemainingTime(0);
    
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  /**
   * Resetear manualmente el rate limiter
   */
  const reset = useCallback(() => {
    setAttempts([]);
    setIsLocked(false);
    setLockoutEndTime(null);
    setRemainingTime(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  /**
   * Obtener información del estado actual
   */
  const getStatus = useCallback(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < windowMs
    );
    
    return {
      currentAttempts: recentAttempts.length,
      maxAttempts,
      remainingAttempts: Math.max(0, maxAttempts - recentAttempts.length),
      isLocked,
      remainingLockoutSeconds: Math.ceil(remainingTime / 1000)
    };
  }, [attempts, maxAttempts, windowMs, isLocked, remainingTime]);

  return {
    checkLimit,
    recordAttempt,
    recordSuccess,
    reset,
    getStatus,
    isLocked,
    remainingTime,
    remainingSeconds: Math.ceil(remainingTime / 1000)
  };
};

export default useRateLimiter;
