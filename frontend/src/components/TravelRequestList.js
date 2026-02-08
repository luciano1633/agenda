'use client';

import { useState, useEffect } from 'react';
import { getAllRequests, deleteRequest } from '@/services/api';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza un string para prevenir ataques XSS antes de mostrarlo en la UI.
 * Usa DOMPurify para limpiar cualquier código HTML/JS malicioso.
 */
const sanitize = (value) => {
  if (!value) return '-';
  return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [] });
};

/**
 * Client Component que recibe datos pre-renderizados del servidor (SSR)
 * a través de initialData, y permite interactividad (filtrar, eliminar).
 */
export default function TravelRequestList({ initialData = [] }) {
  // Usar los datos del servidor como estado inicial (hidratación SSR)
  const [requests, setRequests] = useState(initialData);
  const [filteredRequests, setFilteredRequests] = useState(initialData);
  const [statusFilter, setStatusFilter] = useState('todas');
  // Si hay datos iniciales del SSR, no mostrar loading
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Solo hacer fetch del cliente si no hay datos del SSR
    if (initialData.length === 0) {
      fetchRequests();
    }
  }, []);

  useEffect(() => {
    filterRequests();
  }, [statusFilter, requests]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllRequests();
      setRequests(data);
    } catch (err) {
      setError('Error al cargar las solicitudes: ' + err.message);
    } finally {
      setLoading(false);
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
    if (!confirm(`¿Está seguro de eliminar la solicitud #${id}?`)) return;

    try {
      await deleteRequest(id);
      setSuccessMsg(`Solicitud #${id} eliminada exitosamente`);
      fetchRequests();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
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

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <span className="spinner"></span> Cargando solicitudes...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span>📋</span>
        <h3>Solicitudes de Viaje Registradas</h3>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Barra de filtros */}
      <div className="filter-bar">
        <label htmlFor="filter-status">🔍 Filtrar por estado:</label>
        <select
          id="filter-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="pendiente">🟡 Pendiente</option>
          <option value="en proceso">🔵 En Proceso</option>
          <option value="finalizada">🟢 Finalizada</option>
        </select>
        <span className="filter-count">
          Mostrando {filteredRequests.length} de {requests.length} solicitudes
        </span>
      </div>

      {/* Tabla */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <p>No se encontraron solicitudes{statusFilter !== 'todas' ? ` con estado "${statusFilter}"` : ''}.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI Cliente</th>
                <th>Nombre Cliente</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Tipo</th>
                <th>Pasajero</th>
                <th>Salida</th>
                <th>Regreso</th>
                <th>Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
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
                    <span className={`status-badge ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
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
