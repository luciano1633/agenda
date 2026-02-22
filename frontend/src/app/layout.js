import './globals.css';
import I18nProvider from '@/components/I18nProvider';

export const metadata = {
  title: 'Agencia de Viajes Oeste - Sistema de Solicitudes',
  description: 'Portal de gestión de solicitudes de viaje - Agencia de Viajes Oeste',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
