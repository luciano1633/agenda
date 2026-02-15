'use client';

/**
 * Componente Skeleton para el formulario de solicitudes de viaje.
 * Muestra una retroalimentación visual mientras el formulario se carga de forma diferida.
 */
export default function SkeletonForm() {
  return (
    <div className="card skeleton-card">
      <div className="card-header">
        <div className="skeleton-icon skeleton-pulse"></div>
        <div className="skeleton-title skeleton-pulse"></div>
      </div>

      <div className="form-grid">
        {/* ID y Fecha de registro */}
        <div className="form-group">
          <div className="skeleton-label skeleton-pulse"></div>
          <div className="skeleton-input-box skeleton-pulse"></div>
        </div>
        <div className="form-group">
          <div className="skeleton-label skeleton-pulse"></div>
          <div className="skeleton-input-box skeleton-pulse"></div>
        </div>

        {/* 8 campos de formulario */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="form-group">
            <div className="skeleton-label skeleton-pulse"></div>
            <div className="skeleton-input skeleton-pulse"></div>
          </div>
        ))}

        {/* Campo pasajero (full width) */}
        <div className="form-group full-width">
          <div className="skeleton-label skeleton-pulse"></div>
          <div className="skeleton-input skeleton-pulse"></div>
        </div>

        {/* Radio buttons (full width) */}
        <div className="form-group full-width">
          <div className="skeleton-label skeleton-pulse"></div>
          <div className="skeleton-radio-group">
            <div className="skeleton-radio skeleton-pulse"></div>
            <div className="skeleton-radio skeleton-pulse"></div>
            <div className="skeleton-radio skeleton-pulse"></div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <div className="skeleton-btn skeleton-pulse"></div>
        <div className="skeleton-btn-lg skeleton-pulse"></div>
      </div>

      <div className="skeleton-loading-text">
        <span className="spinner"></span> Cargando formulario...
      </div>
    </div>
  );
}
