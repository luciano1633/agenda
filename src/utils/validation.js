/**
 * Utilidades de validación para el frontend
 */

/**
 * Valida el formato del DNI chileno (RUT)
 * Formato: XXXXXXXX-X
 */
export const validateDni = (dni) => {
  if (!dni) return { valid: false, message: 'El DNI es requerido' };
  const rutRegex = /^\d{7,8}-[\dkK]$/;
  if (!rutRegex.test(dni)) {
    return { valid: false, message: 'Formato de DNI inválido. Use: XXXXXXXX-X' };
  }
  return { valid: true, message: '' };
};

/**
 * Valida el formato de email
 */
export const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'El email es requerido' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Formato de email inválido' };
  }
  return { valid: true, message: '' };
};

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: `${fieldName} es requerido` };
  }
  return { valid: true, message: '' };
};

/**
 * Valida que la fecha de regreso sea posterior a la de salida
 */
export const validateDates = (departureDate, returnDate) => {
  if (!departureDate) {
    return { valid: false, message: 'La fecha de salida es requerida' };
  }
  if (!returnDate) {
    return { valid: false, message: 'La fecha de regreso es requerida' };
  }
  
  const departure = new Date(departureDate);
  const returnD = new Date(returnDate);
  
  if (returnD <= departure) {
    return { valid: false, message: 'La fecha de regreso debe ser posterior a la de salida' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Valida todos los campos del formulario
 */
export const validateTravelForm = (formData) => {
  const errors = {};
  
  // Validar DNI
  const dniValidation = validateDni(formData.clientDni);
  if (!dniValidation.valid) errors.clientDni = dniValidation.message;
  
  // Validar nombre del cliente
  const clientNameValidation = validateRequired(formData.clientName, 'Nombre del cliente');
  if (!clientNameValidation.valid) errors.clientName = clientNameValidation.message;
  
  // Validar origen
  const originValidation = validateRequired(formData.origin, 'Origen');
  if (!originValidation.valid) errors.origin = originValidation.message;
  
  // Validar destino
  const destinationValidation = validateRequired(formData.destination, 'Destino');
  if (!destinationValidation.valid) errors.destination = destinationValidation.message;
  
  // Validar tipo de viaje
  const tripTypeValidation = validateRequired(formData.tripType, 'Tipo de viaje');
  if (!tripTypeValidation.valid) errors.tripType = tripTypeValidation.message;
  
  // Validar fechas
  const datesValidation = validateDates(formData.departureDateTime, formData.returnDateTime);
  if (!datesValidation.valid) {
    if (datesValidation.message.includes('salida')) {
      errors.departureDateTime = datesValidation.message;
    } else if (datesValidation.message.includes('regreso')) {
      errors.returnDateTime = datesValidation.message;
    }
  }
  
  // Validar email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) errors.email = emailValidation.message;
  
  // Validar estado
  const statusValidation = validateRequired(formData.status, 'Estado');
  if (!statusValidation.valid) errors.status = statusValidation.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
