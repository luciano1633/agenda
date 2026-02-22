'use client';

import { useTranslation } from 'react-i18next';

/**
 * Encabezado internacionalizado para la página de listado de solicitudes.
 */
export default function ListPageHeader() {
  const { t } = useTranslation();

  return (
    <div className="page-header">
      <h2>📋 {t('list.title')}</h2>
      <p>{t('list.subtitle')}</p>
      <small className="ssr-badge">🖥️ {t('common.ssrBadgeData')}</small>
    </div>
  );
}
