'use client';

import Navbar from '@/components/Navbar';
import TravelRequestList from '@/components/TravelRequestList';

export default function SolicitudesPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>📋 Listado de Solicitudes</h2>
          <p>Consulte y filtre todas las solicitudes de viaje registradas</p>
        </div>
        <TravelRequestList />
      </main>
    </div>
  );
}
