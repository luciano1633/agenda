'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
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

/**
 * Formulario de registro de solicitud de viaje.
 * Utiliza React Hook Form para manejo de estado, validaciones y envío del formulario.
 * Las validaciones están internacionalizadas con react-i18next.
 */
export default function TravelRequestForm() {
  const { t, i18n } = useTranslation();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
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
    },
    mode: 'onSubmit',
  });

  const [nextId, setNextId] = useState(null);
  const [registrationDateTime, setRegistrationDateTime] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Búsqueda de clientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const searchRef = useRef(null);

  // Observar campos para validaciones cruzadas
  const departureDateTime = watch('departureDateTime');

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
    setValue('passengerName', value, { shouldValidate: false });

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
    setValue('passengerName', client.name, { shouldValidate: true });
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  /**
   * Envío del formulario gestionado por React Hook Form.
   * Solo se ejecuta si todas las validaciones pasan.
   */
  const onSubmit = async (data) => {
    setSubmitError('');
    setSubmitSuccess('');
    setLoading(true);

    try {
      const sanitizedData = {
        ...data,
        clientDni: sanitizeInput(data.clientDni),
        clientName: sanitizeInput(data.clientName),
        email: sanitizeInput(data.email),
        origin: sanitizeInput(data.origin),
        destination: sanitizeInput(data.destination),
        passengerName: sanitizeInput(data.passengerName),
      };
      const result = await createRequest(sanitizedData);
      setSubmitSuccess(`✅ ${t('form.successMessage', { id: result.id })}`);

      reset();
      setClientSearch('');
      fetchNextId();
    } catch (err) {
      setSubmitError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setClientSearch('');
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

      <form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder={t('form.clientDniPlaceholder')}
              className={errors.clientDni ? 'error' : ''}
              {...register('clientDni', {
                required: t('validation.dniRequired'),
                pattern: {
                  value: /^\d{7,8}-[\dkK]$/,
                  message: t('validation.dniInvalid'),
                },
              })}
            />
            {errors.clientDni && <span className="error-text">{errors.clientDni.message}</span>}
          </div>

          {/* Nombre Cliente */}
          <div className="form-group">
            <label>
              {t('form.clientName')} <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder={t('form.clientNamePlaceholder')}
              className={errors.clientName ? 'error' : ''}
              {...register('clientName', {
                required: t('validation.clientNameRequired'),
                minLength: {
                  value: 3,
                  message: t('validation.clientNameMin'),
                },
              })}
            />
            {errors.clientName && <span className="error-text">{errors.clientName.message}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              {t('form.email')} <span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder={t('form.emailPlaceholder')}
              className={errors.email ? 'error' : ''}
              {...register('email', {
                required: t('validation.emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('validation.emailInvalid'),
                },
              })}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          {/* Tipo de Viaje */}
          <div className="form-group">
            <label>
              {t('form.tripType')} <span className="required">*</span>
            </label>
            <select
              className={errors.tripType ? 'error' : ''}
              {...register('tripType', {
                required: t('validation.tripTypeRequired'),
              })}
            >
              <option value="">{t('form.tripTypeSelect')}</option>
              <option value="negocios">{t('form.tripBusiness')}</option>
              <option value="turismo">{t('form.tripTourism')}</option>
              <option value="otros">{t('form.tripOther')}</option>
            </select>
            {errors.tripType && <span className="error-text">{errors.tripType.message}</span>}
          </div>

          {/* Origen */}
          <div className="form-group">
            <label>
              {t('form.origin')} <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder={t('form.originPlaceholder')}
              className={errors.origin ? 'error' : ''}
              {...register('origin', {
                required: t('validation.originRequired'),
              })}
            />
            {errors.origin && <span className="error-text">{errors.origin.message}</span>}
          </div>

          {/* Destino */}
          <div className="form-group">
            <label>
              {t('form.destination')} <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder={t('form.destinationPlaceholder')}
              className={errors.destination ? 'error' : ''}
              {...register('destination', {
                required: t('validation.destinationRequired'),
              })}
            />
            {errors.destination && <span className="error-text">{errors.destination.message}</span>}
          </div>

          {/* Nombre Pasajero (Búsqueda) */}
          <div className="form-group full-width" ref={searchRef}>
            <label>
              {t('form.passengerName')} <span className="required">*</span>
            </label>
            <input type="hidden" {...register('passengerName', {
              required: t('validation.passengerNameRequired'),
            })} />
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
            {errors.passengerName && <span className="error-text">{errors.passengerName.message}</span>}
          </div>

          {/* Fecha Salida */}
          <div className="form-group">
            <label>
              {t('form.departureDateTime')} <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              className={errors.departureDateTime ? 'error' : ''}
              {...register('departureDateTime', {
                required: t('validation.departureDateRequired'),
                validate: (value) => {
                  if (new Date(value) < new Date()) {
                    return t('validation.departureDatePast');
                  }
                  return true;
                },
              })}
            />
            {errors.departureDateTime && <span className="error-text">{errors.departureDateTime.message}</span>}
          </div>

          {/* Fecha Regreso */}
          <div className="form-group">
            <label>
              {t('form.returnDateTime')} <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              className={errors.returnDateTime ? 'error' : ''}
              {...register('returnDateTime', {
                required: t('validation.returnDateRequired'),
                validate: {
                  notPast: (value) => {
                    if (new Date(value) < new Date()) {
                      return t('validation.returnDatePast');
                    }
                    return true;
                  },
                  afterDeparture: (value) => {
                    const departure = getValues('departureDateTime');
                    if (departure && new Date(value) <= new Date(departure)) {
                      return t('validation.returnDateBeforeDeparture');
                    }
                    return true;
                  },
                },
              })}
            />
            {errors.returnDateTime && <span className="error-text">{errors.returnDateTime.message}</span>}
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
                  value="pendiente"
                  {...register('status', {
                    required: t('validation.statusRequired'),
                  })}
                />
                <label htmlFor="status-pendiente">🟡 {t('form.statusPending')}</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="status-en-proceso"
                  value="en proceso"
                  {...register('status', {
                    required: t('validation.statusRequired'),
                  })}
                />
                <label htmlFor="status-en-proceso">🔵 {t('form.statusInProgress')}</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="status-finalizada"
                  value="finalizada"
                  {...register('status', {
                    required: t('validation.statusRequired'),
                  })}
                />
                <label htmlFor="status-finalizada">🟢 {t('form.statusCompleted')}</label>
              </div>
            </div>
            {errors.status && <span className="error-text">{errors.status.message}</span>}
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
