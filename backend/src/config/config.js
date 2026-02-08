/**
 * Configuración del servidor backend
 * Agencia de Viajes Oeste - Sistema de Solicitudes
 */
module.exports = {
  // Puerto del servidor
  PORT: process.env.PORT || 3001,

  // Configuración de CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
