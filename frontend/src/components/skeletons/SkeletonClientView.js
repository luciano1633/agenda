'use client';

/**
 * Componente Skeleton para la vista de cliente (consulta de solicitudes).
 * Muestra retroalimentación visual mientras se carga el contenido.
 */
export default function SkeletonClientView() {
  return (
    <div className="card skeleton-card">
      <div className="card-header">
        <div className="skeleton-icon skeleton-pulse"></div>
        <div className="skeleton-title skeleton-pulse"></div>
      </div>

      {/* Search bar skeleton */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div className="skeleton-label skeleton-pulse"></div>
        <div className="skeleton-input skeleton-pulse"></div>
      </div>

      {/* Result cards skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton-client-card skeleton-pulse" style={{ marginBottom: '1rem' }}>
          <div className="skeleton-client-row">
            <div className="skeleton-td skeleton-pulse" style={{ width: '30%' }}></div>
            <div className="skeleton-td skeleton-pulse" style={{ width: '50%' }}></div>
          </div>
          <div className="skeleton-client-row">
            <div className="skeleton-td skeleton-pulse" style={{ width: '40%' }}></div>
            <div className="skeleton-td skeleton-pulse" style={{ width: '35%' }}></div>
          </div>
          <div className="skeleton-client-row">
            <div className="skeleton-td skeleton-pulse" style={{ width: '25%' }}></div>
            <div className="skeleton-td skeleton-pulse" style={{ width: '20%' }}></div>
          </div>
        </div>
      ))}

      <div className="skeleton-loading-text">
        <span className="spinner"></span> Cargando consulta de solicitudes...
      </div>
    </div>
  );
}
