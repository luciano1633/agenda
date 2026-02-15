/**
 * Configuración del servidor backend
 * Agencia de Viajes Oeste - Sistema de Solicitudes
 */
module.exports = {
  // Puerto del servidor
  PORT: process.env.PORT || 3001,

  // Configuración de CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Configuración de JWT para autenticación
  JWT_SECRET: process.env.JWT_SECRET || 'agencia_viajes_oeste_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // Configuración de bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
};
