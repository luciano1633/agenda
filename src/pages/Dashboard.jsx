import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSession } from '../hooks/useGoogleSession';
import { API_ENDPOINTS, getDefaultHeaders } from '../config/api.config';
import TravelRequestForm from '../components/TravelRequestForm';
import TravelRequestList from '../components/TravelRequestList';
import TravelHistory from '../components/TravelHistory';
import useTravelRequests from '../hooks/useTravelRequests';
import '../styles/Dashboard.css';
import '../styles/TravelRequest.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const { googleUser, loading: loadingGoogle } = useGoogleSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('travel-requests'); // Tab activo
  const [editingRequest, setEditingRequest] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Hook para solicitudes de viaje
  const { requests, loading, error, createRequest, updateRequest, deleteRequest } = useTravelRequests();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (googleUser) {
      // Logout Google
      await fetch('http://localhost:3001/api/oauth/logout', { credentials: 'include' });
      setIsLoggingOut(false);
      navigate('/login');
    } else {
      try {
        // Notificar al backend del cierre de sesión
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: getDefaultHeaders(token)
        });
      } catch (error) {
        // Si hay error de red, igualmente cerrar sesión localmente
        console.warn('Error al notificar logout al servidor:', error);
      } finally {
        // Siempre cerrar sesión localmente
        logout();
        navigate('/login');
      }
    }
  };

  // Funciones para manejar solicitudes de viaje
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingRequest) {
        await updateRequest(editingRequest.id, formData);
        showSuccess('✅ Solicitud actualizada exitosamente');
        setEditingRequest(null);
      } else {
        await createRequest(formData);
        showSuccess('✅ Solicitud registrada exitosamente');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequest(id);
      showSuccess('✅ Solicitud eliminada exitosamente');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleCancel = () => {
    setEditingRequest(null);
  };

  if (loadingGoogle) return <div className="dashboard-container"><h2>Cargando...</h2></div>;

  // Prioridad: usuario local, luego Google
  const currentUser = user || googleUser;
  if (!currentUser) return <div className="dashboard-container"><h2>No autenticado</h2></div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <span className="logo">✈️</span>
            <h1>Agencia de Viajes Oeste</h1>
          </div>
          <div className="user-section">
            {currentUser?.photo && (
              <img src={currentUser.photo} alt="avatar" className="user-avatar" />
            )}
            <span className="user-email">{currentUser?.displayName || currentUser?.email}</span>
            <button 
              onClick={handleLogout} 
              className="logout-button"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
            </button>
          </div>
        </div>
      </header>

      {/* Navegación por pestañas */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          🏠 Inicio
        </button>
        <button 
          className={`nav-tab ${activeTab === 'travel-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('travel-requests')}
        >
          ✈️ Solicitudes de Viaje
        </button>
        <button 
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 Historial
        </button>
      </nav>

      <main className="dashboard-main">
        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        {/* Contenido según pestaña activa */}
        {activeTab === 'home' && (
          <>
            <div className="welcome-card">
              <div className="welcome-icon">🌍</div>
              <h2>¡Bienvenido al Portal de Reservas!</h2>
              <p className="welcome-message">
                Hola <strong>{currentUser?.displayName || currentUser?.email}</strong>, has iniciado sesión exitosamente.
              </p>
              <p className="welcome-subtitle">
                Desde aquí podrás gestionar tus solicitudes de viaje y explorar nuevos destinos.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card" onClick={() => setActiveTab('travel-requests')}>
                <div className="feature-icon">✈️</div>
                <h3>Solicitudes de Viaje</h3>
                <p>Registra y gestiona solicitudes de viaje personalizadas.</p>
                <button className="feature-button">Ir a Solicitudes</button>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Buscar Vuelos</h3>
                <p>Encuentra los mejores vuelos a los destinos más populares.</p>
                <button className="feature-button" disabled>Próximamente</button>
              </div>

              <div className="feature-card" onClick={() => setActiveTab('history')}>
                <div className="feature-icon">📋</div>
                <h3>Historial</h3>
                <p>Revisa el historial de todos tus viajes finalizados.</p>
                <button className="feature-button">Ver Historial</button>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⚙️</div>
                <h3>Mi Perfil</h3>
                <p>Actualiza tu información personal y preferencias.</p>
                <button className="feature-button" disabled>Próximamente</button>
              </div>
            </div>

            <div className="info-section">
              <h3>📢 Información del Sistema</h3>
              <p>
                Sistema de gestión de solicitudes de viaje para la Agencia de Viajes Oeste. 
                Registra solicitudes personalizadas para tus clientes.
              </p>
            </div>
          </>
        )}

        {activeTab === 'travel-requests' && (
          <div className="travel-requests-section">
            {/* Formulario de solicitudes */}
            <TravelRequestForm 
              onSubmit={handleSubmit}
              editingRequest={editingRequest}
              onCancel={handleCancel}
            />

            {/* Lista de solicitudes */}
            <TravelRequestList 
              requests={requests}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <TravelHistory 
            requests={requests}
            loading={loading}
          />
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© 2026 Agencia de Viajes Oeste - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Dashboard;
