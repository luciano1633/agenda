'use client';

/**
 * Componente Skeleton para la tabla de solicitudes de viaje.
 * Muestra una retroalimentación visual mientras se cargan los datos (3 segundos de espera simulada).
 */
export default function SkeletonTable() {
  const rows = 5;
  const cols = 12;

  return (
    <div className="card skeleton-card">
      <div className="card-header">
        <div className="skeleton-icon skeleton-pulse"></div>
        <div className="skeleton-title skeleton-pulse"></div>
      </div>

      {/* Barra de filtros skeleton */}
      <div className="filter-bar">
        <div className="skeleton-filter-label skeleton-pulse"></div>
        <div className="skeleton-filter-select skeleton-pulse"></div>
        <div className="skeleton-filter-count skeleton-pulse"></div>
      </div>

      {/* Tabla skeleton */}
      <div className="table-container">
        <table className="data-table skeleton-table">
          <thead>
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i}>
                  <div className="skeleton-th skeleton-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: cols }).map((_, colIdx) => (
                  <td key={colIdx}>
                    <div
                      className="skeleton-td skeleton-pulse"
                      style={{ width: colIdx === 0 ? '50px' : colIdx === 11 ? '40px' : `${60 + Math.random() * 40}%` }}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="skeleton-loading-text">
        <span className="spinner"></span> Cargando solicitudes de viaje...
      </div>
    </div>
  );
}
