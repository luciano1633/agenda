'use client';

import Link from 'next/link';

/**
 * Componente del Dashboard con estadísticas y acciones rápidas.
 * Se carga de forma diferida con next/dynamic desde la página principal.
 * Recibe los datos pre-renderizados del servidor (SSR) como props.
 */
export default function DashboardContent({ stats }) {
  return (
    <>
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
          <Link href="/cliente" className="btn btn-secondary">
            👤 Portal del Cliente
          </Link>
        </div>
      </div>
    </>
  );
}
