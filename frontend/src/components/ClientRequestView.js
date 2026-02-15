'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Sanitiza un string para prevenir XSS.
 */
const sanitize = (value) => {
  if (!value) return '-';
  return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [] });
};

/**
 * Componente de vista de cliente.
 * Los clientes solo pueden visualizar las solicitudes asociadas a su DNI o email.
 */
export default function ClientRequestView() {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('dni');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const validateSearch = () => {
    if (!searchValue.trim()) {
      setError('Ingrese un valor de búsqueda');
      return false;
    }

    if (searchType === 'dni') {
      const rutRegex = /^\d{7,8}-[\dkK]$/;
      if (!rutRegex.test(searchValue.trim())) {
        setError('Formato de DNI inválido. Use el formato: XXXXXXXX-X (Ej: 16414595-0)');
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchValue.trim())) {
        setError('Formato de email inválido');
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

      // Simular espera de 3 segundos para carga diferida
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
      setError('Error al buscar solicitudes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('es-CL', {
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
      'negocios': '💼 Negocios',
      'turismo': '🏖️ Turismo',
      'otros': '📌 Otros',
    };
    return map[type] || type;
  };

  return (
    <div className="card">
      <div className="card-header">
        <span>🔍</span>
        <h3>Consulta de Solicitudes - Vista Cliente</h3>
      </div>

      <p style={{ marginBottom: '1rem', color: 'var(--gray-700)', fontSize: '0.9rem' }}>
        Ingrese su DNI o email para consultar sus solicitudes de viaje asociadas.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div className="form-grid">
          <div className="form-group">
            <label>Buscar por:</label>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchValue('');
                setError('');
              }}
            >
              <option value="dni">DNI / RUT</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              {searchType === 'dni' ? 'DNI / Identificación' : 'Email'} <span className="required">*</span>
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (error) setError('');
              }}
              placeholder={searchType === 'dni' ? 'Ej: 16414595-0' : 'Ej: cliente@correo.com'}
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Buscando...
              </>
            ) : (
              '🔍 Consultar Solicitudes'
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
            <span className="spinner"></span> Cargando solicitudes del cliente...
          </div>
        </div>
      )}

      {/* Resultados */}
      {searched && !loading && (
        <>
          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div>
              <p>No se encontraron solicitudes asociadas a {searchType === 'dni' ? 'este DNI' : 'este email'}.</p>
            </div>
          ) : (
            <>
              <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                Se encontraron {requests.length} solicitud(es) asociada(s)
              </div>

              {requests.map((req) => (
                <div key={req.id} className="client-request-card">
                  <div className="client-card-header">
                    <strong>Solicitud #{req.id}</strong>
                    <span className={`status-badge ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="client-card-body">
                    <div className="client-card-row">
                      <span className="client-card-label">Cliente:</span>
                      <span>{sanitize(req.clientName)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">DNI:</span>
                      <span>{sanitize(req.clientDni)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">Origen:</span>
                      <span>{sanitize(req.origin)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">Destino:</span>
                      <span>{sanitize(req.destination)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">Tipo de viaje:</span>
                      <span>{getTripTypeLabel(req.tripType)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">Pasajero:</span>
                      <span>{sanitize(req.passengerName)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">Salida:</span>
                      <span>{formatDateTime(req.departureDateTime)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">Regreso:</span>
                      <span>{formatDateTime(req.returnDateTime)}</span>
                    </div>
                    <div className="client-card-row">
                      <span className="client-card-label">Registro:</span>
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
