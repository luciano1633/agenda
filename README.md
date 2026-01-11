# Agencia de Viajes Oeste - Portal de Reservas

Portal web para la gestión de reservas de vuelos de la Agencia de Viajes Oeste.

## 🚀 Características

- **Registro de usuarios**: Formulario con validación de email y contraseña
- **Inicio de sesión**: Autenticación con la API de reqres.in
- **Vista protegida**: Dashboard accesible solo para usuarios autenticados
- **Cierre de sesión**: Eliminación del token y redirección al login
- **Validaciones**: Campos vacíos, formato de email, confirmación de contraseña

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. Abrir el navegador en `http://localhost:5173`

## 🔑 Credenciales de Prueba

Para probar el registro y login, usa las siguientes credenciales compatibles con la API de reqres.in:

- **Email**: `eve.holt@reqres.in`
- **Contraseña**: cualquier texto

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── ProtectedRoute.jsx    # Componente para rutas protegidas
├── context/
│   └── AuthContext.jsx       # Contexto de autenticación
├── pages/
│   ├── Login.jsx             # Página de inicio de sesión
│   ├── Register.jsx          # Página de registro
│   └── Dashboard.jsx         # Panel principal (vista protegida)
├── styles/
│   ├── Auth.css              # Estilos para login/registro
│   └── Dashboard.css         # Estilos para el dashboard
├── App.jsx                   # Componente principal con rutas
├── App.css                   # Estilos globales
└── main.jsx                  # Punto de entrada
```

## 🔧 Tecnologías Utilizadas

- React 18
- Vite
- React Router DOM
- API: reqres.in (para simulación)

## 📝 Funcionalidades Implementadas

### Registro
- Validación de email (formato)
- Validación de contraseña (mínimo 6 caracteres)
- Confirmación de contraseña
- Almacenamiento de token en localStorage
- Redirección al login tras registro exitoso

### Login
- Validación de campos vacíos
- Validación de formato de email
- Conexión con API reqres.in
- Almacenamiento de token en localStorage
- Redirección al dashboard tras login exitoso
- Mensajes de error para credenciales inválidas

### Dashboard
- Mensaje de bienvenida personalizado
- Botón de cierre de sesión
- Eliminación de token al cerrar sesión
- Redirección al login

## 📄 Licencia

© 2026 Agencia de Viajes Oeste - Todos los derechos reservados
