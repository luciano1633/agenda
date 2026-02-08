/**
 * Funciones de sanitización para prevenir ataques XSS
 * Utiliza la librería 'xss' para limpiar entradas de usuario
 * eliminando cualquier código HTML/JavaScript malicioso.
 */
const xss = require('xss');

/**
 * Sanitiza un valor individual (string).
 * Elimina tags HTML peligrosos y atributos que podrían ejecutar JavaScript.
 */
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return xss(input.trim());
  }
  return input;
}

/**
 * Sanitiza todos los campos string de un objeto.
 * Útil para limpiar todo el req.body de una sola vez.
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeInput(obj[key]);
    }
  }
  return sanitized;
}

/**
 * Middleware Express que sanitiza automáticamente
 * todos los campos del body de la request.
 * Se aplica ANTES de las validaciones y controladores.
 */
function sanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

module.exports = { sanitizeInput, sanitizeObject, sanitizeMiddleware };
