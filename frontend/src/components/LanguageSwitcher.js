'use client';

import { useTranslation } from 'react-i18next';

/**
 * Selector de idioma manual para cambiar entre español e inglés.
 * Usa i18next.changeLanguage() para cambiar el idioma de la aplicación.
 * El idioma seleccionado se persiste en localStorage automáticamente.
 */
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'es', label: 'ES', flag: '🇨🇱' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="language-switcher">
      <span className="language-label">🌐</span>
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
            title={lang.code === 'es' ? 'Español' : 'English'}
            aria-label={lang.code === 'es' ? 'Cambiar a español' : 'Switch to English'}
          >
            {lang.flag} {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
