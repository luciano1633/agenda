'use client';

/**
 * Componente Skeleton para las tarjetas de estadísticas del dashboard.
 * Muestra una retroalimentación visual mientras se cargan los datos con espera simulada.
 */
export default function SkeletonDashboard() {
  return (
    <div className="skeleton-dashboard-wrapper">
      {/* Stat cards skeleton */}
      <div className="dashboard-stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card skeleton-stat-card">
            <div className="skeleton-stat-icon skeleton-pulse"></div>
            <div className="skeleton-stat-info">
              <div className="skeleton-stat-label skeleton-pulse"></div>
              <div className="skeleton-stat-number skeleton-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Action card skeleton */}
      <div className="card skeleton-card">
        <div className="card-header">
          <div className="skeleton-icon skeleton-pulse"></div>
          <div className="skeleton-title skeleton-pulse"></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="skeleton-btn skeleton-pulse"></div>
          <div className="skeleton-btn skeleton-pulse"></div>
        </div>
      </div>

      <div className="skeleton-loading-text">
        <span className="spinner"></span> Cargando panel de control...
      </div>
    </div>
  );
}
