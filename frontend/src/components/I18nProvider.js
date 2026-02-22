'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';

/**
 * Proveedor de internacionalización (i18n) para la aplicación.
 * Envuelve los componentes hijos con el contexto de i18next,
 * permitiendo el uso de useTranslation() en cualquier componente cliente.
 */
export default function I18nProvider({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
