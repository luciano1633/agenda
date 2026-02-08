import './globals.css';

export const metadata = {
  title: 'Agencia de Viajes Oeste - Sistema de Solicitudes',
  description: 'Portal de gestión de solicitudes de viaje - Agencia de Viajes Oeste',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
