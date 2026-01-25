// Middleware global de rate limiting para Express
const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const globalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW * 60 * 1000, // minutos a ms
  max: config.RATE_LIMIT_MAX, // máximo de requests por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { globalLimiter };
