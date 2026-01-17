/**
 * Configuración del servidor backend
 * En un entorno de producción, estas variables deberían estar en un archivo .env
 */
module.exports = {
  // Clave secreta para firmar los tokens JWT
  // En producción, usar una variable de entorno: process.env.JWT_SECRET
  JWT_SECRET: 'agencia_viajes_oeste_secret_key_2026',
  
  // Tiempo de expiración del token (1 hora)
  JWT_EXPIRES_IN: '1h',
  
  // Puerto del servidor
  PORT: process.env.PORT || 3001,
  
  // Configuración de CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rondas de salt para bcrypt (mayor = más seguro pero más lento)
  BCRYPT_SALT_ROUNDS: 10
};
