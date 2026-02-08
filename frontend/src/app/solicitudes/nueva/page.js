/**
 * Página de Nueva Solicitud - Server Component (SSR)
 * El layout y encabezado se renderizan en el servidor.
 * El formulario interactivo se carga como Client Component.
 */
import Navbar from '@/components/Navbar';
import TravelRequestForm from '@/components/TravelRequestForm';

/**
 * Server Component: el HTML del layout se genera en el servidor.
 * TravelRequestForm es un Client Component que se hidrata en el navegador
 * para mantener la interactividad del formulario.
 */
export default function NuevaSolicitudPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>➕ Nueva Solicitud de Viaje</h2>
          <p>Complete el formulario para registrar una nueva solicitud</p>
          <small className="ssr-badge">🖥️ Layout renderizado desde el servidor (SSR)</small>
        </div>
        <TravelRequestForm />
      </main>
    </div>
  );
}
