/**
 * Componente de Historial de Viajes
 * Muestra las solicitudes de viaje finalizadas
 */
import '../styles/TravelRequest.css';

const TravelHistory = ({ requests, loading }) => {
  
  // Filtrar solo las solicitudes finalizadas
  const completedRequests = requests?.filter(
    req => req.status?.toLowerCase() === 'finalizada'
  ) || [];

  /**
   * Formatea la fecha para mostrar
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Formatea fecha corta
   */
  const formatShortDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  /**
   * Obtiene el icono según el tipo de viaje
   */
  const getTripTypeIcon = (tripType) => {
    switch (tripType?.toLowerCase()) {
      case 'negocios':
        return '💼';
      case 'turismo':
        return '🏖️';
      default:
        return '✈️';
    }
  };

  /**
   * Calcula la duración del viaje
   */
  const calculateDuration = (departure, returnDate) => {
    if (!departure || !returnDate) return '-';
    const start = new Date(departure);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (completedRequests.length === 0) {
    return (
      <div className="history-container">
        <h2 className="history-title">📜 Historial de Viajes</h2>
        <div className="empty-state">
          <span className="empty-icon">🗂️</span>
          <p>No hay viajes finalizados en el historial</p>
          <p className="empty-hint">Los viajes marcados como "Finalizada" aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2 className="history-title">
        📜 Historial de Viajes 
        <span className="history-count">({completedRequests.length} viaje{completedRequests.length !== 1 ? 's' : ''} completado{completedRequests.length !== 1 ? 's' : ''})</span>
      </h2>
      
      <div className="history-grid">
        {completedRequests.map((request) => (
          <div key={request.id} className="history-card">
            <div className="history-card-header">
              <span className="history-id">#{request.id}</span>
              <span className="history-type">
                {getTripTypeIcon(request.tripType)} {request.tripType}
              </span>
            </div>
            
            <div className="history-card-body">
              <div className="history-route">
                <div className="route-point origin-point">
                  <span className="point-icon">🛫</span>
                  <span className="point-text">{request.origin}</span>
                </div>
                <div className="route-line">
                  <span className="duration-badge">{calculateDuration(request.departureDateTime, request.returnDateTime)}</span>
                </div>
                <div className="route-point destination-point">
                  <span className="point-icon">🛬</span>
                  <span className="point-text">{request.destination}</span>
                </div>
              </div>

              <div className="history-details">
                <div className="detail-item">
                  <span className="detail-label">👤 Cliente:</span>
                  <span className="detail-value">{request.clientName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🆔 DNI:</span>
                  <span className="detail-value">{request.clientDni}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{request.email}</span>
                </div>
              </div>

              <div className="history-dates">
                <div className="date-item">
                  <span className="date-label">Salida:</span>
                  <span className="date-value">{formatShortDate(request.departureDateTime)}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Regreso:</span>
                  <span className="date-value">{formatShortDate(request.returnDateTime)}</span>
                </div>
              </div>
            </div>

            <div className="history-card-footer">
              <span className="completed-badge">✅ Viaje Completado</span>
              <span className="registration-date">Registrado: {formatShortDate(request.registrationDateTime)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelHistory;
