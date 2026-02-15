/**
 * Página de Listado de Solicitudes - Server Component (SSR)
 * La carga inicial de datos se hace en el servidor.
 * El componente TravelRequestList se carga de forma diferida con next/dynamic.
 * Incluye un Skeleton como retroalimentación visual con espera simulada de 3 segundos.
 */
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import SkeletonTable from '@/components/skeletons/SkeletonTable';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Carga diferida del componente TravelRequestList con next/dynamic.
 * Muestra un SkeletonTable como retroalimentación visual mientras se carga.
 */
const TravelRequestList = dynamic(
  () => import('@/components/TravelRequestList'),
  {
    ssr: false,
    loading: () => <SkeletonTable />,
  }
);

/**
 * Función que se ejecuta en el SERVIDOR para obtener las solicitudes.
 * Incluye espera simulada de 3 segundos para demostrar carga diferida con Skeleton.
 */
async function fetchInitialRequests() {
  try {
    const res = await fetch(`${API_BASE_URL}/travel-requests`, {
      cache: 'no-store',
    });
    const data = await res.json();

    // Espera simulada de 3 segundos para demostración de Skeleton
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!data.success) return [];
    return data.data;
  } catch (err) {
    console.error('Error SSR cargando solicitudes:', err.message);
    return [];
  }
}

/**
 * Server Component: obtiene datos en el servidor y los pasa
 * como props al Client Component (TravelRequestList) para
 * que el usuario pueda filtrar y eliminar interactivamente.
 */
export default async function SolicitudesPage() {
  const initialRequests = await fetchInitialRequests();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>📋 Listado de Solicitudes</h2>
          <p>Consulte y filtre todas las solicitudes de viaje registradas</p>
          <small className="ssr-badge">🖥️ Datos cargados desde el servidor (SSR) con espera simulada de 3s</small>
        </div>
        <TravelRequestList initialData={initialRequests} />
      </main>
    </div>
  );
}
