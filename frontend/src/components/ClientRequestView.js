'use client';

import { useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Sanitiza un string para prevenir XSS.
 */
const sanitize = (value) => {
  if (!value) return '-';
  return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [] });
};

/**
 * Componente de vista de cliente internacionalizado.
 * Los clientes solo pueden visualizar las solicitudes asociadas a su DNI o email.
 */
export default function ClientRequestView() {
  const { t, i18n } = useTranslation();

  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('dni');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const validateSearch = () => {
    if (!searchValue.trim()) {
      setError(t('validation.searchValueRequired'));
      return false;
    }

    if (searchType === 'dni') {
      const rutRegex = /^\d{7,8}-[\dkK]$/;
      if (!rutRegex.test(searchValue.trim())) {
        setError(t('validation.dniFormatInvalid'));
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchValue.trim())) {
        setError(t('validation.emailFormatInvalid'));
        return false;
      }
    }

    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSearched(false);

    if (!validateSearch()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/travel-requests`);
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      await new Promise(resolve => setTimeout(resolve, 3000));

      const filtered = data.data.filter((req) => {
        if (searchType === 'dni') {
          return req.clientDni === searchValue.trim();
        } else {
          return req.email?.toLowerCase() === searchValue.trim().toLowerCase();
        }
      });

      setRequests(filtered);
      setSearched(true);
    } catch (err) {
      setError(t('client.searchError') + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formatea fecha/hora adaptándose al locale del idioma actual.
   */
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const locale = i18n.language === 'en' ? 'en-US' : 'es-CL';
    return date.toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
    const map = {
      'pendiente': 'pendiente',
      'en proceso': 'en-proceso',
      'finalizada': 'finalizada',
    };
    return map[status] || '';
  };

  const getTripTypeLabel = (type) => {
    const map = {
      'negocios': `💼 ${t('list.tripBusiness')}`,
      'turismo': `🏖️ ${t('list.tripTourism')}`,
      'otros': `📌 ${t('list.tripOther')}`,
    };
    return map[type] || type;
  };

  return (
    <div className="card">
      <div className="card-header">
        <span>🔍</span>
        <h3>{t('client.searchTitle')}</h3>
      </div>

      <p style={{ marginBottom: '1rem', color: 'var(--gray-700)', fontSize: '0.9rem' }}>
        {t('client.searchDescription')}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div className="form-grid">
          <div className="form-group">
            <label>{t('client.searchBy')}</label>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchValue('');
                setError('');
              }}
            >
              <option value="dni">{t('client.searchByDni')}</option>
              <option value="email">{t('client.searchByEmail')}</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              {searchType === 'dni' ? t('client.dniLabel') : t('client.emailLabel')} <span className="required">*</span>
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (error) setError('');
              }}
              placeholder={searchType === 'dni' ? t('client.dniPlaceholder') : t('client.emailPlaceholder')}
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> {t('client.searching')}
              </>
            ) : (
              `🔍 ${t('client.searchButton')}`
            )}
          </button>
        </div>
      </form>

      {/* Skeleton de carga */}
      {loading && (
        <div className="skeleton-client-loading">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="client-request-card skeleton-pulse" style={{ marginBottom: '1rem', padding: '1.5rem', borderRadius: 'var(--radius)', background: 'var(--gray-100)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="skeleton-td skeleton-pulse" style={{ width: '40%', height: '16px' }}></div>
                <div className="skeleton-td skeleton-pulse" style={{ width: '60%', height: '14px' }}></div>
                <div className="skeleton-td skeleton-pulse" style={{ width: '50%', height: '14px' }}></div>
                <div className="skeleton-td skeleton-pulse" style={{ width: '30%', height: '14px' }}></div>
              </div>
            </div>
          ))}
          <div className="skeleton-loading-text">
            <span className="spinner"></span> {t('client.loadingClient')}
          </div>
        </div>
      )}

      {/* Resultados */}
      {searched && !loading && (
        <>
          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div>
              <p>{searchType === 'dni' ? t('client.noResultsDni') : t('client.noResultsEmail')}</p>
            </div>
          ) : (
            <>
              <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                {t('client.resultsFound', { count: requests.length })}
              </div>

              {requests.map((req) => (
                <div key={req.id} className="client-request-card">
                  <div className="client-card-header">
                    <strong>{t('client.requestNumber', { id: req.id })}</strong>
                    <span className={`status-badge ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="client-card-body">
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelClient')}:</span>
                      <span>{sanitize(req.clientName)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelDni')}:</span>
                      <span>{sanitize(req.clientDni)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelOrigin')}:</span>
                      <span>{sanitize(req.origin)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelDestination')}:</span>
                      <span>{sanitize(req.destination)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelTripType')}:</span>
                      <span>{getTripTypeLabel(req.tripType)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelPassenger')}:</span>
                      <span>{sanitize(req.passengerName)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelDeparture')}:</span>
                      <span>{formatDateTime(req.departureDateTime)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelReturn')}:</span>
                      <span>{formatDateTime(req.returnDateTime)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">{t('client.labelRegistration')}:</span>
                      <span>{formatDateTime(req.registrationDateTime)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
