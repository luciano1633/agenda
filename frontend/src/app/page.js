'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getAllRequests } from '@/services/api';
import Link from 'next/link';

export default function HomePage() {
  const [stats, setStats] = useState({
    total: 0,
    pendiente: 0,
    enProceso: 0,
    finalizada: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getAllRequests();
      setStats({
        total: data.length,
        pendiente: data.filter(r => r.status === 'pendiente').length,
        enProceso: data.filter(r => r.status === 'en proceso').length,
        finalizada: data.filter(r => r.status === 'finalizada').length,
      });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>✈️ Panel de Control</h2>
          <p>Bienvenido al sistema de gestión de solicitudes de viaje</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <h4>Total Solicitudes</h4>
              <div className="stat-number">{loading ? '...' : stats.total}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pendiente">🟡</div>
            <div className="stat-info">
              <h4>Pendientes</h4>
              <div className="stat-number">{loading ? '...' : stats.pendiente}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon proceso">🔵</div>
            <div className="stat-info">
              <h4>En Proceso</h4>
              <div className="stat-number">{loading ? '...' : stats.enProceso}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon finalizada">🟢</div>
            <div className="stat-info">
              <h4>Finalizadas</h4>
              <div className="stat-number">{loading ? '...' : stats.finalizada}</div>
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
