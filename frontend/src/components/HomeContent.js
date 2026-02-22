'use client';

import { useTranslation } from 'react-i18next';

/**
 * Componente cliente para el encabezado de la página principal.
 * Necesario para usar traducciones i18n en un Server Component.
 */
export default function HomeContent() {
  const { t } = useTranslation();

  return (
    <div className="page-header">
      <h2>✈️ {t('dashboard.title')}</h2>
      <p>{t('dashboard.welcome')}</p>
      <small className="ssr-badge">🖥️ {t('common.ssrBadge')}</small>
    </div>
  );
}
