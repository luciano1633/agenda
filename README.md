# Agencia de Viajes Oeste - Portal de Reservas

Portal web para la gestión de reservas de vuelos y solicitudes de viaje de la Agencia de Viajes Oeste.

## 🌐 Novedades: Sistema de Solicitudes de Viaje

- **Gestión de Solicitudes**: Registra, edita y elimina solicitudes de viaje personalizadas para clientes
- **Historial de Viajes**: Visualiza todos los viajes finalizados en un formato de tarjetas
- **Validación Completa**: Validaciones en frontend y backend (DNI/RUT, email, fechas)
- **Login con Google**: Inicia sesión usando tu cuenta de Google de manera segura
- **Preparado para la nube**: Configuración flexible para despliegue en producción


## 🚀 Características

### Sistema de Autenticación
- **Registro de usuarios**: Formulario con validación de email y contraseña
- **Inicio de sesión**: Autenticación con JWT (JSON Web Tokens) o Google OAuth
- **Login con Google**: Acceso rápido y seguro usando tu cuenta de Google
- **Vista protegida**: Dashboard accesible solo para usuarios autenticados
- **Cierre de sesión**: Eliminación del token/sesión y redirección al login

### Sistema de Solicitudes de Viaje
- **Formulario completo**: Registro de solicitudes con todos los datos requeridos
  - ID automático y correlativo
  - DNI/RUT del cliente (formato chileno: XXXXXXXX-X)
  - Nombre del cliente
  - Email del cliente
  - Origen y destino (selector de ciudades)
  - Tipo de viaje (negocios, turismo, otros)
  - Fecha y hora de salida/regreso
  - Estado de la solicitud (pendiente, en proceso, finalizada)
- **Listado de solicitudes**: Tabla con todas las solicitudes registradas
- **Edición y eliminación**: Gestión completa de solicitudes
- **Historial**: Visualización de viajes finalizados con diseño de tarjetas

### Validaciones
- Campos vacíos y formato de email
- Formato de DNI/RUT chileno
- Fechas (regreso posterior a salida)
- Validaciones en cliente y servidor

### Seguridad
- Contraseñas encriptadas con bcrypt
- Tokens JWT
- Rate limiting
- Sanitización de entradas

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

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión (requiere token) |
| GET | `/api/auth/verify` | Verificar token (requiere token) |

### OAuth (Google)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/oauth/google` | Iniciar login con Google |
| GET | `/api/oauth/callback` | Callback de Google OAuth |
| GET | `/api/oauth/logout` | Cerrar sesión Google/local |

### Solicitudes de Viaje
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/travel-requests` | Obtener todas las solicitudes |
| GET | `/api/travel-requests/:id` | Obtener una solicitud por ID |
| POST | `/api/travel-requests` | Crear nueva solicitud |
| PUT | `/api/travel-requests/:id` | Actualizar solicitud |
| DELETE | `/api/travel-requests/:id` | Eliminar solicitud |
| GET | `/api/travel-requests/clients/search` | Buscar clientes |

### Utilidades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |

## 🔑 Uso de la Aplicación

1. **Registro**: Accede a `/register` y crea una cuenta con tu email y contraseña (mínimo 6 caracteres)
2. **Login**: Usa tus credenciales en `/login` para obtener un token JWT, o usa el botón de Google
3. **Dashboard**: Si el login es exitoso, serás redirigido al dashboard
4. **Solicitudes de Viaje**: Ve a la pestaña "✈️ Solicitudes de Viaje" para registrar y gestionar solicitudes
5. **Historial**: Ve a la pestaña "📋 Historial" para ver los viajes finalizados
6. **Logout**: Usa el botón "Cerrar Sesión" para eliminar el token y volver al login

## 📁 Estructura del Proyecto

```
├── backend/                          # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js             # Configuración del servidor
│   │   │   └── passport.js           # Configuración Google OAuth
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Lógica de autenticación
│   │   │   └── travelRequest.controller.js  # Lógica de solicitudes
│   │   ├── data/
│   │   │   ├── users.json            # Almacenamiento de usuarios
│   │   │   └── travelRequests.json   # Almacenamiento de solicitudes
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # Verificación de JWT
│   │   │   ├── errorHandler.js       # Manejo de errores
│   │   │   ├── globalRateLimiter.js  # Rate limiting
│   │   │   └── travelValidation.js   # Validación de solicitudes
│   │   ├── models/
│   │   │   ├── user.model.js         # Modelo de usuario
│   │   │   └── travelRequest.model.js # Modelo de solicitud
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Rutas de autenticación
│   │   │   ├── oauth.routes.js       # Rutas de OAuth
│   │   │   └── travelRequest.routes.js # Rutas de solicitudes
│   │   └── server.js                 # Punto de entrada
│   └── package.json
│
├── src/                              # Aplicación React (Frontend)
│   ├── components/
│   │   ├── ProtectedRoute.jsx        # Componente para rutas protegidas
│   │   ├── TravelRequestForm.jsx     # Formulario de solicitudes
│   │   ├── TravelRequestList.jsx     # Lista de solicitudes
│   │   └── TravelHistory.jsx         # Historial de viajes
│   ├── config/
│   │   └── api.config.js             # Configuración de la API
│   ├── context/
│   │   └── AuthContext.jsx           # Contexto de autenticación
│   ├── hooks/
│   │   ├── useAuth.js                # Hook de autenticación
│   │   ├── useGoogleSession.js       # Hook para sesión Google
│   │   ├── useRateLimiter.js         # Hook para rate limiting
│   │   └── useTravelRequests.js      # Hook para solicitudes
│   ├── pages/
│   │   ├── Login.jsx                 # Página de inicio de sesión
│   │   ├── Register.jsx              # Página de registro
│   │   ├── Dashboard.jsx             # Panel principal
│   │   ├── TravelRequests.jsx        # Página de solicitudes
│   │   └── OauthWelcome.jsx          # Bienvenida OAuth
│   ├── services/
│   │   └── travelRequestService.js   # Servicio API de solicitudes
│   ├── styles/
│   │   ├── Auth.css                  # Estilos de autenticación
│   │   ├── Dashboard.css             # Estilos del dashboard
│   │   └── TravelRequest.css         # Estilos de solicitudes
│   └── utils/
│       ├── fetchWithRetry.js         # Utilidad para peticiones HTTP
│       └── validation.js             # Validaciones del formulario
│
├── package.json
└── README.md
```

## 🔧 Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- React Router DOM
- CSS3 (diseño responsivo)

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Passport.js (Google OAuth)
- bcryptjs (encriptación)


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
- Navegación por pestañas (Inicio, Solicitudes, Historial)
- Cards interactivas para acceso rápido
- Botón de cierre de sesión
- Diseño responsivo

### Solicitudes de Viaje
- Formulario de registro con validaciones
- ID automático y correlativo
- Listado en tabla con todas las solicitudes
- Edición y eliminación de solicitudes
- Estados: pendiente, en proceso, finalizada
- Validación de DNI/RUT chileno
- Validación de fechas

### Historial de Viajes
- Visualización de viajes finalizados
- Tarjetas con información completa
- Ruta del viaje con duración
- Datos del cliente
- Fechas de salida y regreso

## 📄 Licencia

© 2026 Agencia de Viajes Oeste - Todos los derechos reservados
