'use client';

import { useState, useEffect } from 'react';
import { getAllRequests, deleteRequest, updateRequest } from '@/services/api';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from 'react-i18next';

/**
 * Sanitiza un string para prevenir ataques XSS antes de mostrarlo en la UI.
 */
const sanitize = (value) => {
  if (!value) return '-';
  return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [] });
};

/**
 * Client Component que recibe datos pre-renderizados del servidor (SSR)
 * a través de initialData, y permite interactividad (filtrar, eliminar).
 * Internacionalizado con react-i18next.
 */
export default function TravelRequestList({ initialData = [] }) {
  const { t, i18n } = useTranslation();

  const [requests, setRequests] = useState(initialData);
  const [filteredRequests, setFilteredRequests] = useState(initialData);
  const [statusFilter, setStatusFilter] = useState('todas');
  const [loading, setLoading] = useState(initialData.length === 0);
  const [showSkeleton, setShowSkeleton] = useState(initialData.length === 0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialData.length === 0) {
      fetchRequests();
    } else {
      setShowSkeleton(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    filterRequests();
  }, [statusFilter, requests]);

  const fetchRequests = async () => {
    setLoading(true);
    setShowSkeleton(true);
    setError('');
    try {
      const data = await getAllRequests();
      await new Promise(resolve => setTimeout(resolve, 3000));
      setRequests(data);
    } catch (err) {
      setError(t('list.loadError') + err.message);
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  const filterRequests = () => {
    if (statusFilter === 'todas') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === statusFilter));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('list.confirmDelete', { id }))) return;

    try {
      await deleteRequest(id);
      setSuccessMsg(t('list.deleteSuccess', { id }));
      const data = await getAllRequests();
      setRequests(data);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(t('list.deleteError') + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRequest(id, { status: newStatus });
      setSuccessMsg(t('list.statusUpdateSuccess', { id, status: newStatus }));
      setRequests(prev => prev.map(req =>
        req.id === id ? { ...req, status: newStatus } : req
      ));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(t('list.updateError') + err.message);
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

  if (loading || showSkeleton) {
    return (
      <div className="card skeleton-card">
        <div className="card-header">
          <div className="skeleton-icon skeleton-pulse"></div>
          <div className="skeleton-title skeleton-pulse"></div>
        </div>
        <div className="filter-bar">
          <div className="skeleton-filter-label skeleton-pulse"></div>
          <div className="skeleton-filter-select skeleton-pulse"></div>
          <div className="skeleton-filter-count skeleton-pulse"></div>
        </div>
        <div className="table-container">
          <table className="data-table skeleton-table">
            <thead>
              <tr>
                {Array.from({ length: 12 }).map((_, i) => (
                  <th key={i}><div className="skeleton-th skeleton-pulse"></div></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {Array.from({ length: 12 }).map((_, colIdx) => (
                    <td key={colIdx}>
                      <div className="skeleton-td skeleton-pulse" style={{ width: colIdx === 0 ? '50px' : colIdx === 11 ? '40px' : '80%' }}></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="skeleton-loading-text">
          <span className="spinner"></span> {t('list.loadingRequests')}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span>📋</span>
        <h3>{t('list.tableTitle')}</h3>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Barra de filtros */}
      <div className="filter-bar">
        <label htmlFor="filter-status">🔍 {t('list.filterByStatus')}</label>
        <select
          id="filter-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="todas">{t('list.allStatuses')}</option>
          <option value="pendiente">🟡 {t('list.pendingStatus')}</option>
          <option value="en proceso">🔵 {t('list.inProgressStatus')}</option>
          <option value="finalizada">🟢 {t('list.completedStatus')}</option>
        </select>
        <span className="filter-count">
          {t('common.showing')} {filteredRequests.length} {t('common.of')} {requests.length} {t('common.requests')}
        </span>
      </div>

      {/* Tabla */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <p>
            {statusFilter !== 'todas'
              ? t('list.emptyStateFiltered', { status: statusFilter })
              : t('list.emptyState')}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('list.columnId')}</th>
                <th>{t('list.columnDni')}</th>
                <th>{t('list.columnClientName')}</th>
                <th>{t('list.columnOrigin')}</th>
                <th>{t('list.columnDestination')}</th>
                <th>{t('list.columnType')}</th>
                <th>{t('list.columnPassenger')}</th>
                <th>{t('list.columnDeparture')}</th>
                <th>{t('list.columnReturn')}</th>
                <th>{t('list.columnRegistration')}</th>
                <th>{t('list.columnStatus')}</th>
                <th>{t('list.columnActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td><strong>#{req.id}</strong></td>
                  <td>{sanitize(req.clientDni)}</td>
                  <td>{sanitize(req.clientName)}</td>
                  <td>{sanitize(req.origin)}</td>
                  <td>{sanitize(req.destination)}</td>
                  <td>{getTripTypeLabel(req.tripType)}</td>
                  <td>{sanitize(req.passengerName)}</td>
                  <td>{formatDateTime(req.departureDateTime)}</td>
                  <td>{formatDateTime(req.returnDateTime)}</td>
                  <td>{formatDateTime(req.registrationDateTime)}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusClass(req.status)}`}
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    >
                      <option value="pendiente">🟡 {t('list.pendingStatus')}</option>
                      <option value="en proceso">🔵 {t('list.inProgressStatus')}</option>
                      <option value="finalizada">🟢 {t('list.completedStatus')}</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(req.id)}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
