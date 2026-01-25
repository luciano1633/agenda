import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSession } from '../hooks/useGoogleSession';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { googleUser, loading: loadingGoogle } = useGoogleSession();

  if (loading || loadingGoogle) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated() && !googleUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
