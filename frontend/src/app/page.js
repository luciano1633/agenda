/**
 * Página principal - Server Component (SSR)
 * Los datos se obtienen en el servidor antes de enviar el HTML al cliente.
 * Esto mejora SEO, accesibilidad y tiempos de carga inicial.
 */
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Función asíncrona que se ejecuta en el SERVIDOR.
 * Next.js renderiza este componente en el servidor (SSR) y envía
 * el HTML completo al navegador, incluyendo los datos ya resueltos.
 */
async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/travel-requests`, {
      cache: 'no-store', // Siempre obtener datos frescos desde el servidor
    });
    const data = await res.json();

    if (!data.success) return { total: 0, pendiente: 0, enProceso: 0, finalizada: 0 };

    const requests = data.data;
    return {
      total: requests.length,
      pendiente: requests.filter(r => r.status === 'pendiente').length,
      enProceso: requests.filter(r => r.status === 'en proceso').length,
      finalizada: requests.filter(r => r.status === 'finalizada').length,
    };
  } catch (err) {
    console.error('Error SSR cargando estadísticas:', err.message);
    return { total: 0, pendiente: 0, enProceso: 0, finalizada: 0 };
  }
}

/**
 * Server Component: se ejecuta en el servidor de Next.js.
 * El HTML se genera con los datos ya resueltos y se envía al navegador.
 * No usa useState ni useEffect — todo ocurre en el servidor.
 */
export default async function HomePage() {
  // Esta llamada ocurre en el SERVIDOR, no en el navegador
  const stats = await fetchStats();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>✈️ Panel de Control</h2>
          <p>Bienvenido al sistema de gestión de solicitudes de viaje</p>
          <small className="ssr-badge">🖥️ Página renderizada desde el servidor (SSR)</small>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <h4>Total Solicitudes</h4>
              <div className="stat-number">{stats.total}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pendiente">🟡</div>
            <div className="stat-info">
              <h4>Pendientes</h4>
              <div className="stat-number">{stats.pendiente}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon proceso">🔵</div>
            <div className="stat-info">
              <h4>En Proceso</h4>
              <div className="stat-number">{stats.enProceso}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon finalizada">🟢</div>
            <div className="stat-info">
              <h4>Finalizadas</h4>
              <div className="stat-number">{stats.finalizada}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span>🚀</span>
            <h3>Acciones Rápidas</h3>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/solicitudes/nueva" className="btn btn-primary">
              ➕ Nueva Solicitud de Viaje
            </Link>
            <Link href="/solicitudes" className="btn btn-secondary">
              📋 Ver Todas las Solicitudes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
