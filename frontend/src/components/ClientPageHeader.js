'use client';

import { useTranslation } from 'react-i18next';

/**
 * Encabezado internacionalizado para la página del portal del cliente.
 */
export default function ClientPageHeader() {
  const { t } = useTranslation();

  return (
    <div className="page-header">
      <h2>👤 {t('client.title')}</h2>
      <p>{t('client.subtitle')}</p>
      <small className="ssr-badge">🖥️ {t('common.ssrBadgeLayout')}</small>
    </div>
  );
}
