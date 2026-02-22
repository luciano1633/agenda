'use client';

import { useState, useEffect, useRef } from 'react';
import { getNextId, createRequest, searchClients } from '@/services/api';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from 'react-i18next';

/**
 * Sanitiza un valor de entrada para prevenir ataques XSS.
 */
const sanitizeInput = (value) => {
  if (!value) return '';
  return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [] });
};

export default function TravelRequestForm() {
  const { t, i18n } = useTranslation();

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

  // Actualizar formato de fecha cuando cambia el idioma
  useEffect(() => {
    updateRegistrationDateTime();
  }, [i18n.language]);

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

  /**
   * Actualiza la fecha/hora de registro usando el locale actual de i18n.
   * Se adapta automáticamente al idioma seleccionado (formato regional).
   */
  const updateRegistrationDateTime = () => {
    const now = new Date();
    const locale = i18n.language === 'en' ? 'en-US' : 'es-CL';
    const formatted = now.toLocaleString(locale, {
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validaciones del formulario con mensajes internacionalizados.
   * Incluye validaciones de campos vacíos, formato y lógica de fechas.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientDni.trim()) {
      newErrors.clientDni = t('validation.dniRequired');
    } else if (!/^\d{7,8}-[\dkK]$/.test(formData.clientDni.trim())) {
      newErrors.clientDni = t('validation.dniInvalid');
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = t('validation.clientNameRequired');
    } else if (formData.clientName.trim().length < 3) {
      newErrors.clientName = t('validation.clientNameMin');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (!formData.origin.trim()) {
      newErrors.origin = t('validation.originRequired');
    }

    if (!formData.destination.trim()) {
      newErrors.destination = t('validation.destinationRequired');
    }

    if (!formData.tripType) {
      newErrors.tripType = t('validation.tripTypeRequired');
    }

    if (!formData.passengerName.trim()) {
      newErrors.passengerName = t('validation.passengerNameRequired');
    }

    if (!formData.departureDateTime) {
      newErrors.departureDateTime = t('validation.departureDateRequired');
    } else {
      const departure = new Date(formData.departureDateTime);
      const now = new Date();
      if (departure < now) {
        newErrors.departureDateTime = t('validation.departureDatePast');
      }
    }

    if (!formData.returnDateTime) {
      newErrors.returnDateTime = t('validation.returnDateRequired');
    } else {
      const returnDate = new Date(formData.returnDateTime);
      const now = new Date();
      if (returnDate < now) {
        newErrors.returnDateTime = t('validation.returnDatePast');
      }
    }

    if (formData.departureDateTime && formData.returnDateTime) {
      if (new Date(formData.returnDateTime) <= new Date(formData.departureDateTime)) {
        newErrors.returnDateTime = t('validation.returnDateBeforeDeparture');
      }
    }

    if (!formData.status) {
      newErrors.status = t('validation.statusRequired');
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
      setSubmitSuccess(`✅ ${t('form.successMessage', { id: result.id })}`);

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
        <h3>{t('form.title')}</h3>
      </div>

      {submitSuccess && <div className="alert alert-success">{submitSuccess}</div>}
      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* ID Automático */}
          <div className="form-group">
            <label>{t('form.requestId')}</label>
            <div className="auto-id-display">
              🔢 {nextId !== null ? `#${nextId}` : t('common.loading')}
            </div>
          </div>

          {/* Fecha de Registro */}
          <div className="form-group">
            <label>{t('form.registrationDateTime')}</label>
            <div className="registration-datetime">
              🕐 {registrationDateTime || t('common.loading')}
            </div>
          </div>

          {/* DNI Cliente */}
          <div className="form-group">
            <label>
              {t('form.clientDni')} <span className="required">*</span>
            </label>
            <input
              type="text"
              name="clientDni"
              value={formData.clientDni}
              onChange={handleChange}
              placeholder={t('form.clientDniPlaceholder')}
              className={errors.clientDni ? 'error' : ''}
            />
            {errors.clientDni && <span className="error-text">{errors.clientDni}</span>}
          </div>

          {/* Nombre Cliente */}
          <div className="form-group">
            <label>
              {t('form.clientName')} <span className="required">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder={t('form.clientNamePlaceholder')}
              className={errors.clientName ? 'error' : ''}
            />
            {errors.clientName && <span className="error-text">{errors.clientName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              {t('form.email')} <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('form.emailPlaceholder')}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Tipo de Viaje */}
          <div className="form-group">
            <label>
              {t('form.tripType')} <span className="required">*</span>
            </label>
            <select
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              className={errors.tripType ? 'error' : ''}
            >
              <option value="">{t('form.tripTypeSelect')}</option>
              <option value="negocios">{t('form.tripBusiness')}</option>
              <option value="turismo">{t('form.tripTourism')}</option>
              <option value="otros">{t('form.tripOther')}</option>
            </select>
            {errors.tripType && <span className="error-text">{errors.tripType}</span>}
          </div>

          {/* Origen */}
          <div className="form-group">
            <label>
              {t('form.origin')} <span className="required">*</span>
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder={t('form.originPlaceholder')}
              className={errors.origin ? 'error' : ''}
            />
            {errors.origin && <span className="error-text">{errors.origin}</span>}
          </div>

          {/* Destino */}
          <div className="form-group">
            <label>
              {t('form.destination')} <span className="required">*</span>
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder={t('form.destinationPlaceholder')}
              className={errors.destination ? 'error' : ''}
            />
            {errors.destination && <span className="error-text">{errors.destination}</span>}
          </div>

          {/* Nombre Pasajero (Búsqueda) */}
          <div className="form-group full-width" ref={searchRef}>
            <label>
              {t('form.passengerName')} <span className="required">*</span>
            </label>
            <div className="search-container">
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => handlePassengerSearch(e.target.value)}
                placeholder={`🔍 ${t('form.passengerSearchPlaceholder')}`}
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
              {t('form.departureDateTime')} <span className="required">*</span>
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
              {t('form.returnDateTime')} <span className="required">*</span>
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
              {t('form.status')} <span className="required">*</span>
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
                <label htmlFor="status-pendiente">🟡 {t('form.statusPending')}</label>
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
                <label htmlFor="status-en-proceso">🔵 {t('form.statusInProgress')}</label>
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
                <label htmlFor="status-finalizada">🟢 {t('form.statusCompleted')}</label>
              </div>
            </div>
            {errors.status && <span className="error-text">{errors.status}</span>}
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            🗑️ {t('form.clearForm')}
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> {t('form.submitting')}
              </>
            ) : (
              `💾 ${t('form.submitForm')}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
