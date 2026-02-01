/**
 * Componente de Formulario de Solicitud de Viaje
 * Permite crear y editar solicitudes de viaje
 */
import { useState, useEffect } from 'react';
import { validateTravelForm } from '../utils/validation';
import '../styles/TravelRequest.css';

// Datos mock para ciudades
const CITIES = [
  'Santiago, Chile',
  'Buenos Aires, Argentina',
  'Lima, Perú',
  'Bogotá, Colombia',
  'Ciudad de México, México',
  'Madrid, España',
  'Barcelona, España',
  'París, Francia',
  'Londres, Reino Unido',
  'Nueva York, Estados Unidos',
  'Miami, Estados Unidos',
  'Los Ángeles, Estados Unidos',
  'Roma, Italia',
  'Berlín, Alemania',
  'Tokio, Japón',
  'Sídney, Australia'
];

// Tipos de viaje
const TRIP_TYPES = [
  { value: 'negocios', label: 'Negocios' },
  { value: 'turismo', label: 'Turismo' },
  { value: 'otros', label: 'Otros' }
];

// Estados de solicitud
const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en proceso', label: 'En Proceso' },
  { value: 'finalizada', label: 'Finalizada' }
];

const initialFormState = {
  clientDni: '',
  clientName: '',
  origin: '',
  destination: '',
  tripType: '',
  departureDateTime: '',
  returnDateTime: '',
  status: 'pendiente',
  email: ''
};

const TravelRequestForm = ({ onSubmit, editingRequest, onCancel }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingRequest) {
      setFormData({
        clientDni: editingRequest.clientDni || '',
        clientName: editingRequest.clientName || '',
        origin: editingRequest.origin || '',
        destination: editingRequest.destination || '',
        tripType: editingRequest.tripType || '',
        departureDateTime: editingRequest.departureDateTime ? 
          editingRequest.departureDateTime.slice(0, 16) : '',
        returnDateTime: editingRequest.returnDateTime ? 
          editingRequest.returnDateTime.slice(0, 16) : '',
        status: editingRequest.status || 'pendiente',
        email: editingRequest.email || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al modificar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateTravelForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    try {
      await onSubmit(formData);
      // Limpiar formulario después de enviar
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    if (onCancel) onCancel();
  };

  return (
    <div className="travel-form-container">
      <h2 className="form-title">
        {editingRequest ? '✏️ Editar Solicitud de Viaje' : '✈️ Nueva Solicitud de Viaje'}
      </h2>
      
      <form onSubmit={handleSubmit} className="travel-form">
        <div className="form-grid">
          {/* DNI del Cliente */}
          <div className="form-group">
            <label htmlFor="clientDni">DNI / RUT del Cliente *</label>
            <input
              type="text"
              id="clientDni"
              name="clientDni"
              value={formData.clientDni}
              onChange={handleChange}
              placeholder="Ej: 16414595-0"
              className={errors.clientDni ? 'error' : ''}
            />
            {errors.clientDni && <span className="error-message">{errors.clientDni}</span>}
          </div>

          {/* Nombre del Cliente */}
          <div className="form-group">
            <label htmlFor="clientName">Nombre del Cliente *</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Ej: Esteban Castro Paredes"
              className={errors.clientName ? 'error' : ''}
            />
            {errors.clientName && <span className="error-message">{errors.clientName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: cliente@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Origen */}
          <div className="form-group">
            <label htmlFor="origin">Origen *</label>
            <select
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className={errors.origin ? 'error' : ''}
            >
              <option value="">Seleccione origen</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.origin && <span className="error-message">{errors.origin}</span>}
          </div>

          {/* Destino */}
          <div className="form-group">
            <label htmlFor="destination">Destino *</label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className={errors.destination ? 'error' : ''}
            >
              <option value="">Seleccione destino</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.destination && <span className="error-message">{errors.destination}</span>}
          </div>

          {/* Tipo de Viaje */}
          <div className="form-group">
            <label htmlFor="tripType">Tipo de Viaje *</label>
            <select
              id="tripType"
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              className={errors.tripType ? 'error' : ''}
            >
              <option value="">Seleccione tipo</option>
              {TRIP_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.tripType && <span className="error-message">{errors.tripType}</span>}
          </div>

          {/* Fecha y Hora de Salida */}
          <div className="form-group">
            <label htmlFor="departureDateTime">Fecha y Hora de Salida *</label>
            <input
              type="datetime-local"
              id="departureDateTime"
              name="departureDateTime"
              value={formData.departureDateTime}
              onChange={handleChange}
              className={errors.departureDateTime ? 'error' : ''}
            />
            {errors.departureDateTime && <span className="error-message">{errors.departureDateTime}</span>}
          </div>

          {/* Fecha y Hora de Regreso */}
          <div className="form-group">
            <label htmlFor="returnDateTime">Fecha y Hora de Regreso *</label>
            <input
              type="datetime-local"
              id="returnDateTime"
              name="returnDateTime"
              value={formData.returnDateTime}
              onChange={handleChange}
              className={errors.returnDateTime ? 'error' : ''}
            />
            {errors.returnDateTime && <span className="error-message">{errors.returnDateTime}</span>}
          </div>

          {/* Estado de la Solicitud (botones de opción) */}
          <div className="form-group full-width">
            <label>Estado de la Solicitud *</label>
            <div className="status-options">
              {STATUS_OPTIONS.map(option => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={formData.status === option.value}
                    onChange={handleChange}
                  />
                  <span className={`status-badge status-${option.value.replace(' ', '-')}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingRequest ? '💾 Guardar Cambios' : '➕ Registrar Solicitud'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            {editingRequest ? '❌ Cancelar' : '🗑️ Limpiar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelRequestForm;
