/**
 * Componente de Lista de Solicitudes de Viaje
 * Muestra todas las solicitudes registradas en formato tabla
 */
import '../styles/TravelRequest.css';

const TravelRequestList = ({ requests, onEdit, onDelete, loading }) => {
  
  /**
   * Formatea la fecha para mostrar
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Obtiene la clase CSS según el estado
   */
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return 'status-pendiente';
      case 'en proceso':
        return 'status-en-proceso';
      case 'finalizada':
        return 'status-finalizada';
      default:
        return '';
    }
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

  if (loading) {
    return (
      <div className="travel-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="travel-list-container">
        <h2 className="list-title">📋 Listado de Solicitudes</h2>
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No hay solicitudes registradas</p>
          <p className="empty-hint">Utiliza el formulario para crear una nueva solicitud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="travel-list-container">
      <h2 className="list-title">
        📋 Listado de Solicitudes 
        <span className="request-count">({requests.length})</span>
      </h2>
      
      <div className="table-responsive">
        <table className="travel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Ruta</th>
              <th>Tipo</th>
              <th>Salida</th>
              <th>Regreso</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="cell-id">#{request.id}</td>
                <td className="cell-client">
                  <div className="client-info">
                    <span className="client-name">{request.clientName}</span>
                    <span className="client-dni">{request.clientDni}</span>
                  </div>
                </td>
                <td className="cell-route">
                  <div className="route-info">
                    <span className="origin">{request.origin}</span>
                    <span className="route-arrow">→</span>
                    <span className="destination">{request.destination}</span>
                  </div>
                </td>
                <td className="cell-type">
                  <span className="trip-type">
                    {getTripTypeIcon(request.tripType)} {request.tripType}
                  </span>
                </td>
                <td className="cell-date">{formatDateTime(request.departureDateTime)}</td>
                <td className="cell-date">{formatDateTime(request.returnDateTime)}</td>
                <td className="cell-status">
                  <span className={`status-badge ${getStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="cell-date cell-registration">
                  {formatDateTime(request.registrationDateTime)}
                </td>
                <td className="cell-actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => onEdit(request)}
                    title="Editar solicitud"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => {
                      if (window.confirm(`¿Está seguro de eliminar la solicitud #${request.id}?`)) {
                        onDelete(request.id);
                      }
                    }}
                    title="Eliminar solicitud"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelRequestList;
