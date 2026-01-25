/**
 * Configuración del servidor backend
 * En un entorno de producción, estas variables deberían estar en un archivo .env
 */
require('dotenv').config();
module.exports = {
  // Clave secreta para firmar los tokens JWT
  JWT_SECRET: process.env.JWT_SECRET,

  // Tiempo de expiración del token (1 hora)
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

  // Puerto del servidor
  PORT: process.env.PORT || 3001,

  // Configuración de CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Rondas de salt para bcrypt (mayor = más seguro pero más lento)
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 10,

  // Configuración de rate limiting
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15, // minutos
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100
};
