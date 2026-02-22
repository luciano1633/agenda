'use client';

import { useTranslation } from 'react-i18next';

/**
 * Encabezado internacionalizado para la página de nueva solicitud.
 */
export default function NewRequestPageHeader() {
  const { t } = useTranslation();

  return (
    <div className="page-header">
      <h2>➕ {t('newRequest.title')}</h2>
      <p>{t('newRequest.subtitle')}</p>
      <small className="ssr-badge">🖥️ {t('common.ssrBadgeLayout')}</small>
    </div>
  );
}
