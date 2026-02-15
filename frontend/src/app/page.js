/**
 * Página principal - Server Component (SSR)
 * Los datos se obtienen en el servidor antes de enviar el HTML al cliente.
 * Esto mejora SEO, accesibilidad y tiempos de carga inicial.
 * El contenido del dashboard se carga de forma diferida con next/dynamic.
 */
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import SkeletonDashboard from '@/components/skeletons/SkeletonDashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Carga diferida del componente DashboardContent con next/dynamic.
 * Muestra un SkeletonDashboard como retroalimentación visual mientras se carga.
 */
const DashboardContent = dynamic(
  () => import('@/components/DashboardContent'),
  {
    ssr: false,
    loading: () => <SkeletonDashboard />,
  }
);

/**
 * Función asíncrona que se ejecuta en el SERVIDOR.
 * Next.js renderiza este componente en el servidor (SSR) y envía
 * el HTML completo al navegador, incluyendo los datos ya resueltos.
 */
async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/travel-requests`, {
      cache: 'no-store',
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
 * DashboardContent se carga de forma diferida con next/dynamic.
 */
export default async function HomePage() {
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
        <DashboardContent stats={stats} />
      </main>
    </div>
  );
}
