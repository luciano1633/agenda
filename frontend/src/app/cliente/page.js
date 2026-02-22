import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import SkeletonClientView from '@/components/skeletons/SkeletonClientView';
import ClientPageHeader from '@/components/ClientPageHeader';

/**
 * Página SSR de consulta de solicitudes para clientes.
 * Los clientes solo pueden visualizar las solicitudes asociadas a su DNI o email.
 * El componente ClientRequestView se carga de forma diferida (lazy loading) con next/dynamic.
 */
const ClientRequestView = dynamic(
  () => import('@/components/ClientRequestView'),
  {
    ssr: false,
    loading: () => <SkeletonClientView />,
  }
);

export const metadata = {
  title: 'Consulta de Solicitudes - Cliente | Agencia de Viajes Oeste',
  description: 'Consulte el estado de sus solicitudes de viaje ingresando su DNI o email',
};

export default function ClientePage() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <ClientPageHeader />
        <ClientRequestView />
      </main>
    </div>
  );
}
