/**
 * Página de Listado de Solicitudes - Server Component (SSR)
 * La carga inicial de datos se hace en el servidor.
 * Los datos pre-renderizados se pasan al componente interactivo del cliente.
 */
import Navbar from '@/components/Navbar';
import TravelRequestList from '@/components/TravelRequestList';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Función que se ejecuta en el SERVIDOR para obtener las solicitudes.
 * El HTML se genera con estos datos antes de enviarlo al navegador.
 */
async function fetchInitialRequests() {
  try {
    const res = await fetch(`${API_BASE_URL}/travel-requests`, {
      cache: 'no-store', // Sin cache para datos frescos en cada request
    });
    const data = await res.json();
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
  // Fetch ejecutado en el SERVIDOR (SSR)
  const initialRequests = await fetchInitialRequests();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>📋 Listado de Solicitudes</h2>
          <p>Consulte y filtre todas las solicitudes de viaje registradas</p>
          <small className="ssr-badge">🖥️ Datos cargados desde el servidor (SSR)</small>
        </div>
        <TravelRequestList initialData={initialRequests} />
      </main>
    </div>
  );
}
