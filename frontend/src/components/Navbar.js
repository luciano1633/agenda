'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/solicitudes/nueva', label: 'Nueva Solicitud', icon: '➕' },
    { href: '/solicitudes', label: 'Listado', icon: '📋' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-brand">
          <span className="logo">✈️</span>
          <h1>Agencia de Viajes Oeste</h1>
        </Link>
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
      </div>
    </nav>
  );
}
