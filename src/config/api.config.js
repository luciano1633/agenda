/**
 * Configuración de la API del frontend
 * Centraliza las URLs y configuraciones del backend
 */

// URL base del servidor backend
export const API_BASE_URL = 'http://localhost:3001/api';

// Endpoints de autenticación
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY: `${API_BASE_URL}/auth/verify`
  },
  HEALTH: `${API_BASE_URL}/health`
};

// Headers por defecto para las peticiones
export const getDefaultHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
