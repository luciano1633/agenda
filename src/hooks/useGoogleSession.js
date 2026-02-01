import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hook para obtener usuario Google si existe sesión
export function useGoogleSession() {
  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/oauth/google/success', {
      credentials: 'include'
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setGoogleUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { googleUser, loading };
}
