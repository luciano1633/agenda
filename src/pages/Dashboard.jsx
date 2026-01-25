import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSession } from '../hooks/useGoogleSession';
import { API_ENDPOINTS, getDefaultHeaders } from '../config/api.config';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const { googleUser, loading: loadingGoogle } = useGoogleSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
            <span className="user-email">{currentUser?.email}</span>
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

      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="welcome-icon">🌍</div>
          <h2>¡Bienvenido al Portal de Reservas!</h2>
          <p className="welcome-message">
            Hola <strong>{currentUser?.displayName || currentUser?.email}</strong>, has iniciado sesión exitosamente.
          </p>
          {currentUser?.photo && (
            <img src={currentUser.photo} alt="avatar" style={{ width: 60, borderRadius: '50%', margin: '1rem auto' }} />
          )}
          <p className="welcome-subtitle">
            Desde aquí podrás gestionar tus reservas de vuelos y explorar nuevos destinos.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛫</div>
            <h3>Mis Reservas</h3>
            <p>Consulta y gestiona tus reservas de vuelos activas.</p>
            <button className="feature-button" disabled>Próximamente</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Buscar Vuelos</h3>
            <p>Encuentra los mejores vuelos a los destinos más populares.</p>
            <button className="feature-button" disabled>Próximamente</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Historial</h3>
            <p>Revisa el historial de todos tus viajes anteriores.</p>
            <button className="feature-button" disabled>Próximamente</button>
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
            Este es un prototipo de demostración del portal de reservas. 
            Las funcionalidades completas estarán disponibles en futuras versiones.
          </p>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>© 2026 Agencia de Viajes Oeste - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Dashboard;
