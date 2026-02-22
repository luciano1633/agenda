'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    { href: '/', label: t('navbar.home'), icon: '🏠' },
    { href: '/solicitudes/nueva', label: t('navbar.newRequest'), icon: '➕' },
    { href: '/solicitudes', label: t('navbar.list'), icon: '📋' },
    { href: '/cliente', label: t('navbar.clientPortal'), icon: '👤' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-brand">
          <span className="logo">✈️</span>
          <h1>{t('common.appName')}</h1>
        </Link>
        <div className="navbar-right">
          <ul className="navbar-nav">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.icon} {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
