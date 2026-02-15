/**
 * Página de Nueva Solicitud - Server Component (SSR)
 * El layout y encabezado se renderizan en el servidor.
 * El formulario se carga de forma diferida con next/dynamic (lazy loading).
 * Muestra un SkeletonForm como retroalimentación visual durante la carga.
 */
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import SkeletonForm from '@/components/skeletons/SkeletonForm';

/**
 * Carga diferida del formulario con next/dynamic.
 * Muestra un SkeletonForm mientras el componente se carga.
 */
const TravelRequestForm = dynamic(
  () => import('@/components/TravelRequestForm'),
  {
    ssr: false,
    loading: () => <SkeletonForm />,
  }
);

/**
 * Server Component: el HTML del layout se genera en el servidor.
 * TravelRequestForm se carga de forma diferida con next/dynamic
 * y muestra un Skeleton como retroalimentación visual.
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
