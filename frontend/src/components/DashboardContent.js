'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

/**
 * Componente del Dashboard con estadísticas y acciones rápidas.
 * Se carga de forma diferida con next/dynamic desde la página principal.
 * Recibe los datos pre-renderizados del servidor (SSR) como props.
 */
export default function DashboardContent({ stats }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-info">
            <h4>{t('dashboard.totalRequests')}</h4>
            <div className="stat-number">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pendiente">🟡</div>
          <div className="stat-info">
            <h4>{t('dashboard.pending')}</h4>
            <div className="stat-number">{stats.pendiente}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon proceso">🔵</div>
          <div className="stat-info">
            <h4>{t('dashboard.inProgress')}</h4>
            <div className="stat-number">{stats.enProceso}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon finalizada">🟢</div>
          <div className="stat-info">
            <h4>{t('dashboard.completed')}</h4>
            <div className="stat-number">{stats.finalizada}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span>🚀</span>
          <h3>{t('dashboard.quickActions')}</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/solicitudes/nueva" className="btn btn-primary">
            ➕ {t('dashboard.newTravelRequest')}
          </Link>
          <Link href="/solicitudes" className="btn btn-secondary">
            📋 {t('dashboard.viewAllRequests')}
          </Link>
          <Link href="/cliente" className="btn btn-secondary">
            👤 {t('dashboard.clientPortal')}
          </Link>
        </div>
      </div>
    </>
  );
}
