'use client';

import { useState, useEffect, useRef } from 'react';
import { getNextId, createRequest, searchClients } from '@/services/api';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza un valor de entrada para prevenir ataques XSS.
 */
const sanitizeInput = (value) => {
  if (!value) return '';
  return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [] });
};

export default function TravelRequestForm() {
  // Estado del formulario
  const [formData, setFormData] = useState({
    clientDni: '',
    clientName: '',
    origin: '',
    destination: '',
    tripType: '',
    passengerName: '',
    departureDateTime: '',
    returnDateTime: '',
    status: 'pendiente',
    email: '',
  });

  const [nextId, setNextId] = useState(null);
  const [registrationDateTime, setRegistrationDateTime] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Búsqueda de clientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const searchRef = useRef(null);

  // Obtener el siguiente ID al cargar
  useEffect(() => {
    fetchNextId();
    updateRegistrationDateTime();
    const interval = setInterval(updateRegistrationDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNextId = async () => {
    try {
      const id = await getNextId();
      setNextId(id);
    } catch (err) {
      console.error('Error al obtener ID:', err);
    }
  };

  const updateRegistrationDateTime = () => {
    const now = new Date();
    const formatted = now.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    setRegistrationDateTime(formatted);
  };

  // Búsqueda de pasajeros
  const handlePassengerSearch = async (value) => {
    setClientSearch(value);
    setFormData(prev => ({ ...prev, passengerName: value }));

    if (value.length >= 2) {
      try {
        const results = await searchClients(value);
        setClientResults(results);
        setShowClientDropdown(true);
      } catch (err) {
        console.error('Error buscando clientes:', err);
      }
    } else {
      setClientResults([]);
      setShowClientDropdown(false);
    }
  };

  const selectClient = (client) => {
    setFormData(prev => ({
      ...prev,
      passengerName: client.name,
    }));
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientDni.trim()) {
      newErrors.clientDni = 'El DNI del cliente es requerido';
    } else if (!/^\d{7,8}-[\dkK]$/.test(formData.clientDni.trim())) {
      newErrors.clientDni = 'Formato inválido. Ej: 16414595-0';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    } else if (formData.clientName.trim().length < 3) {
      newErrors.clientName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.origin.trim()) {
      newErrors.origin = 'El origen es requerido';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'El destino es requerido';
    }

    if (!formData.tripType) {
      newErrors.tripType = 'Seleccione un tipo de viaje';
    }

    if (!formData.passengerName.trim()) {
      newErrors.passengerName = 'El nombre del pasajero es requerido';
    }

    if (!formData.departureDateTime) {
      newErrors.departureDateTime = 'La fecha de salida es requerida';
    } else {
      const departure = new Date(formData.departureDateTime);
      const now = new Date();
      if (departure < now) {
        newErrors.departureDateTime = 'La fecha de salida no puede ser en el pasado';
      }
    }

    if (!formData.returnDateTime) {
      newErrors.returnDateTime = 'La fecha de regreso es requerida';
    } else {
      const returnDate = new Date(formData.returnDateTime);
      const now = new Date();
      if (returnDate < now) {
        newErrors.returnDateTime = 'La fecha de regreso no puede ser en el pasado';
      }
    }

    if (formData.departureDateTime && formData.returnDateTime) {
      if (new Date(formData.returnDateTime) <= new Date(formData.departureDateTime)) {
        newErrors.returnDateTime = 'La fecha de regreso debe ser posterior a la de salida';
      }
    }

    if (!formData.status) {
      newErrors.status = 'Seleccione un estado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Sanitizar todos los campos antes de enviarlos al backend (prevención XSS)
      const sanitizedData = {
        ...formData,
        clientDni: sanitizeInput(formData.clientDni),
        clientName: sanitizeInput(formData.clientName),
        email: sanitizeInput(formData.email),
        origin: sanitizeInput(formData.origin),
        destination: sanitizeInput(formData.destination),
        passengerName: sanitizeInput(formData.passengerName),
      };
      const result = await createRequest(sanitizedData);
      setSubmitSuccess(`✅ Solicitud #${result.id} creada exitosamente`);

      // Resetear formulario
      setFormData({
        clientDni: '',
        clientName: '',
        origin: '',
        destination: '',
        tripType: '',
        passengerName: '',
        departureDateTime: '',
        returnDateTime: '',
        status: 'pendiente',
        email: '',
      });
      setClientSearch('');
      setErrors({});
      fetchNextId();
    } catch (err) {
      setSubmitError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formulario
  const handleReset = () => {
    setFormData({
      clientDni: '',
      clientName: '',
      origin: '',
      destination: '',
      tripType: '',
      passengerName: '',
      departureDateTime: '',
      returnDateTime: '',
      status: 'pendiente',
      email: '',
    });
    setClientSearch('');
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <span>📝</span>
        <h3>Registro de Solicitud de Viaje</h3>
      </div>

      {submitSuccess && <div className="alert alert-success">{submitSuccess}</div>}
      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* ID Automático */}
          <div className="form-group">
            <label>Identificador de Solicitud</label>
            <div className="auto-id-display">
              🔢 {nextId !== null ? `#${nextId}` : 'Cargando...'}
            </div>
          </div>

          {/* Fecha de Registro */}
          <div className="form-group">
            <label>Fecha y Hora de Registro</label>
            <div className="registration-datetime">
              🕐 {registrationDateTime || 'Cargando...'}
            </div>
          </div>

          {/* DNI Cliente */}
          <div className="form-group">
            <label>
              DNI / Identificación del Cliente <span className="required">*</span>
            </label>
            <input
              type="text"
              name="clientDni"
              value={formData.clientDni}
              onChange={handleChange}
              placeholder="Ej: 16414595-0"
              className={errors.clientDni ? 'error' : ''}
            />
            {errors.clientDni && <span className="error-text">{errors.clientDni}</span>}
          </div>

          {/* Nombre Cliente */}
          <div className="form-group">
            <label>
              Nombre del Cliente <span className="required">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Ej: Esteban Castro Paredes"
              className={errors.clientName ? 'error' : ''}
            />
            {errors.clientName && <span className="error-text">{errors.clientName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email del Cliente <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: cliente@correo.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Tipo de Viaje */}
          <div className="form-group">
            <label>
              Tipo de Viaje <span className="required">*</span>
            </label>
            <select
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              className={errors.tripType ? 'error' : ''}
            >
              <option value="">-- Seleccione tipo de viaje --</option>
              <option value="negocios">Negocios</option>
              <option value="turismo">Turismo</option>
              <option value="otros">Otros</option>
            </select>
            {errors.tripType && <span className="error-text">{errors.tripType}</span>}
          </div>

          {/* Origen */}
          <div className="form-group">
            <label>
              Origen <span className="required">*</span>
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="Ej: Santiago, Chile"
              className={errors.origin ? 'error' : ''}
            />
            {errors.origin && <span className="error-text">{errors.origin}</span>}
          </div>

          {/* Destino */}
          <div className="form-group">
            <label>
              Destino <span className="required">*</span>
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Ej: Madrid, España"
              className={errors.destination ? 'error' : ''}
            />
            {errors.destination && <span className="error-text">{errors.destination}</span>}
          </div>

          {/* Nombre Pasajero (Búsqueda) */}
          <div className="form-group full-width" ref={searchRef}>
            <label>
              Nombre del Pasajero <span className="required">*</span>
            </label>
            <div className="search-container">
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => handlePassengerSearch(e.target.value)}
                placeholder="🔍 Buscar pasajero por nombre... Ej: Fabián Gamboa Martínez"
                className={errors.passengerName ? 'error' : ''}
              />
              {showClientDropdown && clientResults.length > 0 && (
                <div className="search-results">
                  {clientResults.map((client, index) => (
                    <div
                      key={index}
                      className="search-result-item"
                      onClick={() => selectClient(client)}
                    >
                      <div className="client-name">👤 {client.name}</div>
                      <div className="client-dni">DNI: {client.dni}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.passengerName && <span className="error-text">{errors.passengerName}</span>}
          </div>

          {/* Fecha Salida */}
          <div className="form-group">
            <label>
              Fecha y Hora de Salida <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              name="departureDateTime"
              value={formData.departureDateTime}
              onChange={handleChange}
              className={errors.departureDateTime ? 'error' : ''}
            />
            {errors.departureDateTime && <span className="error-text">{errors.departureDateTime}</span>}
          </div>

          {/* Fecha Regreso */}
          <div className="form-group">
            <label>
              Fecha y Hora de Regreso <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              name="returnDateTime"
              value={formData.returnDateTime}
              onChange={handleChange}
              className={errors.returnDateTime ? 'error' : ''}
            />
            {errors.returnDateTime && <span className="error-text">{errors.returnDateTime}</span>}
          </div>

          {/* Estado (Radio Buttons) */}
          <div className="form-group full-width">
            <label>
              Estado de la Solicitud <span className="required">*</span>
            </label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="status-pendiente"
                  name="status"
                  value="pendiente"
                  checked={formData.status === 'pendiente'}
                  onChange={handleChange}
                />
                <label htmlFor="status-pendiente">🟡 Pendiente</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="status-en-proceso"
                  name="status"
                  value="en proceso"
                  checked={formData.status === 'en proceso'}
                  onChange={handleChange}
                />
                <label htmlFor="status-en-proceso">🔵 En Proceso</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="status-finalizada"
                  name="status"
                  value="finalizada"
                  checked={formData.status === 'finalizada'}
                  onChange={handleChange}
                />
                <label htmlFor="status-finalizada">🟢 Finalizada</label>
              </div>
            </div>
            {errors.status && <span className="error-text">{errors.status}</span>}
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            🗑️ Limpiar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Registrando...
              </>
            ) : (
              '💾 Registrar Solicitud'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
