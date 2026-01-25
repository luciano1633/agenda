// Funciones para sanitizar entradas de usuario
const { escape, trim } = require('validator');

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return escape(trim(input));
  }
  return input;
}

function sanitizeObject(obj) {
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeInput(obj[key]);
    }
  }
  return sanitized;
}

module.exports = { sanitizeInput, sanitizeObject };
