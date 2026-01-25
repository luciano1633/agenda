# Agencia de Viajes Oeste - Portal de Reservas


Portal web para la gestión de reservas de vuelos de la Agencia de Viajes Oeste.

## 🌐 Novedades: Integración con Google y Despliegue en la Nube

- **Login con Google**: Ahora puedes iniciar sesión usando tu cuenta de Google de manera segura y rápida. El backend utiliza Passport.js con Google OAuth 2.0 y el frontend ofrece un botón dedicado para autenticación con Google.
- **Preparado para la nube**: El proyecto está listo para ser desplegado en plataformas cloud (como Render, Railway, Vercel, etc.), con variables de entorno y configuración flexible para producción.


## 🚀 Características

- **Registro de usuarios**: Formulario con validación de email y contraseña
- **Inicio de sesión**: Autenticación con JWT (JSON Web Tokens) o Google OAuth
- **Login con Google**: Acceso rápido y seguro usando tu cuenta de Google
- **Vista protegida**: Dashboard accesible solo para usuarios autenticados
- **Cierre de sesión**: Eliminación del token/sesión y redirección al login
- **Validaciones**: Campos vacíos, formato de email, confirmación de contraseña
- **Backend local y cloud-ready**: Servidor Node.js/Express con almacenamiento en JSON y preparado para despliegue en la nube
- **Seguridad**: Contraseñas encriptadas con bcrypt, tokens JWT, rate limiting, sanitización de entradas

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn


## 🛠️ Instalación y Ejecución

### Opción 1: Iniciar ambos servidores (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Opción 2: Comandos separados

1. **Instalar dependencias del backend:**
```bash
cd backend
npm install
```

2. **Iniciar el servidor backend:**
```bash
npm run dev
```
El servidor estará disponible en `http://localhost:3001`

3. **En otra terminal, instalar dependencias del frontend:**
```bash
cd ..
npm install
```

4. **Iniciar el frontend:**
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`


## 🔗 Endpoints del Backend

### OAuth (Google)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/oauth/google`   | Iniciar login con Google |
| GET    | `/api/oauth/callback` | Callback de Google OAuth |
| GET    | `/api/oauth/logout`   | Cerrar sesión Google/local |

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión (requiere token) |
| GET | `/api/auth/verify` | Verificar token (requiere token) |
| GET | `/api/health` | Estado del servidor |

## 🔑 Uso de la Aplicación

1. **Registro**: Accede a `/register` y crea una cuenta con tu email y contraseña (mínimo 6 caracteres)
2. **Login**: Usa tus credenciales en `/login` para obtener un token JWT
3. **Dashboard**: Si el login es exitoso, serás redirigido al dashboard con un mensaje de bienvenida
4. **Logout**: Usa el botón "Cerrar Sesión" para eliminar el token y volver al login

## 📁 Estructura del Proyecto

```
├── backend/                      # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js         # Configuración del servidor
│   │   ├── controllers/
│   │   │   └── auth.controller.js # Lógica de autenticación
│   │   ├── data/
│   │   │   └── users.json        # Almacenamiento de usuarios
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js # Verificación de JWT
│   │   │   └── errorHandler.js   # Manejo de errores
│   │   ├── models/
│   │   │   └── user.model.js     # Modelo de usuario
│   │   ├── routes/
│   │   │   └── auth.routes.js    # Rutas de autenticación
│   │   └── server.js             # Punto de entrada
│   └── package.json
│
├── src/                          # Aplicación React (Frontend)
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Componente para rutas protegidas
│   ├── config/
│   │   └── api.config.js         # Configuración de la API
│   ├── context/
│   │   └── AuthContext.jsx       # Contexto de autenticación
│   ├── hooks/
│   │   ├── useAuth.js            # Hook de autenticación
│   │   └── useRateLimiter.js     # Hook para rate limiting
│   ├── pages/
│   │   ├── Login.jsx             # Página de inicio de sesión
│   │   ├── Register.jsx          # Página de registro
│   │   └── Dashboard.jsx         # Panel principal (vista protegida)
│   ├── styles/
│   │   ├── Auth.css              # Estilos de autenticación
│   │   └── Dashboard.css         # Estilos del dashboard
│   └── utils/
│       └── fetchWithRetry.js     # Utilidad para peticiones HTTP
│
├── package.json
└── README.md
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
- Login local (JWT) y con Google OAuth
- Almacenamiento de token/sesión en localStorage o cookie
- Redirección al dashboard tras login exitoso
- Mensajes de error para credenciales inválidas

### Google OAuth
- Botón de login con Google en el frontend
- Redirección automática tras autenticación exitosa
- Soporte para cierre de sesión Google/local

### Despliegue en la nube
- Configuración lista para plataformas cloud (variables de entorno, CORS, etc.)
- Documentación para adaptar URLs y credenciales según el entorno
### Dashboard
- Mensaje de bienvenida personalizado
- Botón de cierre de sesión
- Eliminación de token al cerrar sesión
- Redirección al login

## 📄 Licencia

© 2026 Agencia de Viajes Oeste - Todos los derechos reservados
