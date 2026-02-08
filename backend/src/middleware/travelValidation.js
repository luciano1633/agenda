/**
 * Middleware de validación para solicitudes de viaje
 */

/**
 * Valida el formato del DNI chileno (RUT)
 * Formato: XXXXXXXX-X
 */
const validateDni = (dni) => {
  if (!dni) return false;
  const rutRegex = /^\d{7,8}-[\dkK]$/;
  return rutRegex.test(dni);
};

/**
 * Valida el formato de email
 */
const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que la fecha no esté vacía y sea válida
 */
const validateDateTime = (dateTime) => {
  if (!dateTime) return false;
  const date = new Date(dateTime);
  return !isNaN(date.getTime());
};

/**
 * Valida los tipos de viaje permitidos
 */
const validTripTypes = ['negocios', 'turismo', 'otros'];

/**
 * Valida los estados de solicitud permitidos
 */
const validStatuses = ['pendiente', 'en proceso', 'finalizada'];

/**
 * Middleware de validación para crear/actualizar solicitudes
 */
const validateTravelRequest = (req, res, next) => {
  const errors = [];
  const {
    clientDni,
    clientName,
    origin,
    destination,
    tripType,
    passengerName,
    departureDateTime,
    returnDateTime,
    status,
    email
  } = req.body;

  // Validar campos requeridos
  if (!clientDni || clientDni.trim() === '') {
    errors.push('El DNI del cliente es requerido');
  } else if (!validateDni(clientDni)) {
    errors.push('El formato del DNI no es válido. Use el formato: XXXXXXXX-X');
  }

  if (!clientName || clientName.trim() === '') {
    errors.push('El nombre del cliente es requerido');
  } else if (clientName.length < 3) {
    errors.push('El nombre del cliente debe tener al menos 3 caracteres');
  }

  if (!origin || origin.trim() === '') {
    errors.push('El origen es requerido');
  }

  if (!destination || destination.trim() === '') {
    errors.push('El destino es requerido');
  }

  if (!tripType || tripType.trim() === '') {
    errors.push('El tipo de viaje es requerido');
  } else if (!validTripTypes.includes(tripType.toLowerCase())) {
    errors.push(`El tipo de viaje debe ser: ${validTripTypes.join(', ')}`);
  }

  if (!passengerName || passengerName.trim() === '') {
    errors.push('El nombre del pasajero es requerido');
  }

  if (!departureDateTime) {
    errors.push('La fecha y hora de salida es requerida');
  } else if (!validateDateTime(departureDateTime)) {
    errors.push('La fecha y hora de salida no es válida');
  }

  if (!returnDateTime) {
    errors.push('La fecha y hora de regreso es requerida');
  } else if (!validateDateTime(returnDateTime)) {
    errors.push('La fecha y hora de regreso no es válida');
  }

  // Validar que la fecha de regreso sea posterior a la de salida
  if (departureDateTime && returnDateTime) {
    const departure = new Date(departureDateTime);
    const returnDate = new Date(returnDateTime);
    if (returnDate <= departure) {
      errors.push('La fecha de regreso debe ser posterior a la fecha de salida');
    }
  }

  if (status && !validStatuses.includes(status.toLowerCase())) {
    errors.push(`El estado debe ser: ${validStatuses.join(', ')}`);
  }

  if (!email || email.trim() === '') {
    errors.push('El email es requerido');
  } else if (!validateEmail(email)) {
    errors.push('El formato del email no es válido');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  next();
};

/**
 * Middleware de validación para actualización parcial
 */
const validatePartialUpdate = (req, res, next) => {
  const errors = [];
  const { clientDni, email, tripType, status, departureDateTime, returnDateTime } = req.body;

  if (clientDni && !validateDni(clientDni)) {
    errors.push('El formato del DNI no es válido');
  }

  if (email && !validateEmail(email)) {
    errors.push('El formato del email no es válido');
  }

  if (tripType && !validTripTypes.includes(tripType.toLowerCase())) {
    errors.push(`El tipo de viaje debe ser: ${validTripTypes.join(', ')}`);
  }

  if (status && !validStatuses.includes(status.toLowerCase())) {
    errors.push(`El estado debe ser: ${validStatuses.join(', ')}`);
  }

  if (departureDateTime && !validateDateTime(departureDateTime)) {
    errors.push('La fecha y hora de salida no es válida');
  }

  if (returnDateTime && !validateDateTime(returnDateTime)) {
    errors.push('La fecha y hora de regreso no es válida');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  next();
};

module.exports = {
  validateTravelRequest,
  validatePartialUpdate,
  validateDni,
  validateEmail
};
