import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OauthWelcome = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener datos del usuario autenticado con Google
    fetch('http://localhost:3001/api/oauth/google/success', {
      credentials: 'include'
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setError('No autenticado con Google.');
          setTimeout(() => navigate('/login'), 2000);
        }
      })
      .catch(() => {
        setError('Error de red.');
        setTimeout(() => navigate('/login'), 2000);
      });
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('http://localhost:3001/api/oauth/logout', {
      credentials: 'include'
    });
    navigate('/login');
  };

  if (error) return <div className="auth-container"><div className="auth-card"><h2>{error}</h2></div></div>;
  if (!user) return <div className="auth-container"><div className="auth-card"><h2>Cargando datos...</h2></div></div>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={user.photo} alt="avatar" style={{ width: 60, borderRadius: '50%' }} />
          <h2>¡Bienvenido, {user.displayName}!</h2>
        </div>
        <div className="auth-info">
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <button className="auth-button" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default OauthWelcome;
