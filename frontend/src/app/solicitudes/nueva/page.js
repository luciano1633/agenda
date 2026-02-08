'use client';

import Navbar from '@/components/Navbar';
import TravelRequestForm from '@/components/TravelRequestForm';
import { useRouter } from 'next/navigation';

export default function NuevaSolicitudPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Opcionalmente redirigir al listado después de crear
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>➕ Nueva Solicitud de Viaje</h2>
          <p>Complete el formulario para registrar una nueva solicitud</p>
        </div>
        <TravelRequestForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
}
