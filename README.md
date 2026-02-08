# Agencia de Viajes Oeste - Sistema de Solicitudes de Viaje

Portal web para la gestión de solicitudes de viaje de la Agencia de Viajes Oeste, desarrollado con **Next.js** (frontend) y **Node.js/Express** (backend).

## �️ Renderizado desde el Servidor (SSR)

Esta aplicación implementa **Server-Side Rendering (SSR)** con Next.js App Router:

- **Páginas como Server Components**: Las páginas (`page.js`) se ejecutan en el servidor de Next.js, realizando `fetch` a la API backend antes de enviar el HTML completo al navegador.
- **Datos pre-renderizados**: Las estadísticas del panel de control y el listado de solicitudes llegan al cliente ya resueltos en el HTML, sin necesidad de esperar llamadas AJAX.
- **Hidratación selectiva**: Solo los componentes que requieren interactividad (formulario, filtros, eliminación) usan `'use client'` para hidratarse en el navegador.
- **Beneficios**: Mejor SEO, accesibilidad mejorada, tiempos de carga inicial más rápidos.

| Página | Tipo | Descripción |
|--------|------|-------------|
| `/` (panel de control) | Server Component | Fetch de estadísticas en el servidor |
| `/solicitudes` (listado) | Server Component | Fetch de solicitudes en el servidor, pasa datos al Client Component |
| `/solicitudes/nueva` (formulario) | Server Component + Client Component | Layout SSR, formulario interactivo en cliente |

## 🛡️ Sanitización y Protección XSS

Se implementa protección contra ataques Cross-Site Scripting (XSS) en ambas capas:

- **Backend**: Middleware con la librería `xss` que sanitiza automáticamente todos los campos del `req.body` antes de que lleguen a los controladores.
- **Frontend**: Uso de `DOMPurify` (versión isomorphic compatible con SSR) para:
  - Sanitizar datos del formulario antes de enviarlos al backend.
  - Limpiar datos renderizados en la tabla de solicitudes.
- Los tags HTML maliciosos como `<script>`, atributos como `onerror`, y código JavaScript inyectado son eliminados o escapados automáticamente.

## �🚀 Características

### Sistema de Solicitudes de Viaje
- **Formulario completo** de registro con todos los campos requeridos:
  - Identificador de solicitud automático y correlativo (Ej: 1001, 1002...)
  - DNI / Identificación del cliente con validación de formato chileno (Ej: 16414595-0)
  - Nombre del cliente (Ej: Esteban Castro Paredes)
  - Email del cliente con validación de formato
  - Origen (Ej: Santiago, Chile)
  - Destino (Ej: Madrid, España)
  - Tipo de viaje: negocios, turismo u otros (control de listado/select)
  - Nombre del pasajero con campo de búsqueda sobre clientes mock
  - Fecha y hora de salida (Ej: lunes 15 de septiembre del 2025 a las 10:00)
  - Fecha y hora de regreso (Ej: domingo 21 de diciembre del 2025 a las 17:00)
  - Fecha y hora de registro de la solicitud (generada automáticamente en tiempo real)
  - Estado de la solicitud: pendiente, en proceso o finalizada (botones de opción/radio)
- **Listado de solicitudes** con tabla completa de todos los registros
- **Filtrado por estado** (todas, pendiente, en proceso, finalizada)
- **Eliminación** de solicitudes
- **Panel de control** con estadísticas en tiempo real

### Validaciones (Frontend y Backend)
- Campos vacíos en todos los campos requeridos
- Formato de email (`usuario@dominio.ext`)
- Formato de DNI/RUT chileno (`XXXXXXXX-X`)
- Fecha de regreso posterior a la de salida
- Tipos de viaje y estados válidos
- Nombre del cliente con mínimo 3 caracteres

### Persistencia de Datos
- Almacenamiento simulado (mock) mediante archivo JSON local (`travelRequests.json`)
- 8 clientes mock precargados para el campo de búsqueda de pasajeros
- ID correlativo persistente que se incrementa automáticamente

## 📋 Requisitos

- Node.js 18 o superior
- npm

## 🛠️ Instalación y Ejecución

### 1. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Iniciar los servidores

**Terminal 1 - Backend (puerto 3001):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (puerto 3000):**
```bash
cd frontend
npm run dev
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🔗 Endpoints de la API (Backend)

### Solicitudes de Viaje
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/travel-requests` | Obtener todas las solicitudes |
| GET | `/api/travel-requests?status=pendiente` | Filtrar solicitudes por estado |
| GET | `/api/travel-requests/:id` | Obtener una solicitud por ID |
| GET | `/api/travel-requests/next-id` | Obtener el siguiente ID correlativo |
| GET | `/api/travel-requests/clients/search?q=nombre` | Buscar clientes por nombre o DNI |
| POST | `/api/travel-requests` | Crear nueva solicitud |
| PUT | `/api/travel-requests/:id` | Actualizar solicitud existente |
| DELETE | `/api/travel-requests/:id` | Eliminar solicitud |

### Utilidades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |

## 🔑 Uso de la Aplicación

1. **Inicio**: Accede a `http://localhost:3000` para ver el panel de control con estadísticas
2. **Nueva Solicitud**: Haz clic en "Nueva Solicitud" o navega a `/solicitudes/nueva` para registrar una solicitud de viaje
3. **Buscar Pasajero**: En el campo "Nombre del Pasajero", escribe al menos 2 caracteres para buscar entre los clientes registrados
4. **Listado**: Navega a `/solicitudes` para ver todas las solicitudes registradas
5. **Filtrar**: Usa el selector de estado para filtrar solicitudes por pendiente, en proceso o finalizada

## 📁 Estructura del Proyecto

```
├── backend/                              # Servidor Node.js/Express (API REST)
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js                 # Configuración (puerto, CORS)
│   │   ├── controllers/
│   │   │   └── travelRequest.controller.js  # Lógica de solicitudes (CRUD)
│   │   ├── data/
│   │   │   └── travelRequests.json       # Almacenamiento mock (persistencia local)
│   │   ├── middleware/
│   │   │   ├── errorHandler.js           # Manejo centralizado de errores
│   │   │   └── travelValidation.js       # Validación de campos y formatos
│   │   ├── models/
│   │   │   └── travelRequest.model.js    # Modelo de solicitud + clientes mock
│   │   ├── routes/
│   │   │   └── travelRequest.routes.js   # Definición de rutas API
│   │   ├── utils/
│   │   │   └── sanitize.js               # Sanitización XSS (middleware + utilidades)
│   │   └── server.js                     # Punto de entrada del servidor
│   └── package.json
│
├── frontend/                             # Aplicación Next.js (React)
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css               # Estilos globales (CSS responsive)
│   │   │   ├── layout.js                 # Layout raíz de la aplicación
│   │   │   ├── page.js                   # Página principal (panel de control)
│   │   │   └── solicitudes/
│   │   │       ├── page.js               # Listado de solicitudes con filtros
│   │   │       └── nueva/
│   │   │           └── page.js           # Formulario de nueva solicitud
│   │   ├── components/
│   │   │   ├── Navbar.js                 # Barra de navegación
│   │   │   ├── TravelRequestForm.js      # Formulario de solicitud de viaje
│   │   │   └── TravelRequestList.js      # Tabla de solicitudes con filtro
│   │   └── services/
│   │       └── api.js                    # Servicio de conexión con la API
│   ├── next.config.js
│   ├── jsconfig.json
│   └── package.json
│
└── README.md
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **Next.js 14** (App Router con Server Components para SSR)
- **React 18** (Server Components + Client Components con `'use client'`)
- **isomorphic-dompurify** (sanitización XSS compatible con SSR)
- **CSS3** (diseño responsivo, grid, flexbox)

### Backend
- **Node.js**
- **Express.js**
- **xss** (sanitización de entradas contra ataques XSS)
- **Archivo JSON** (persistencia mock local)
- **CORS** (comunicación cross-origin)

## 📝 Funcionalidades Implementadas

### Panel de Control (Página principal) — SSR
- Estadísticas renderizadas desde el servidor (no requiere AJAX en carga inicial)
- Accesos rápidos a nueva solicitud y listado
- Diseño con tarjetas informativas

### Formulario de Solicitud de Viaje
- ID automático correlativo (obtenido del backend)
- Fecha y hora de registro en tiempo real (se actualiza cada segundo)
- Validación completa de todos los campos antes del envío
- **Sanitización XSS** con DOMPurify antes de enviar datos al backend
- Campo de búsqueda de pasajeros con dropdown de resultados
- Tipo de viaje con control de listado (select)
- Estado con botones de opción (radio buttons)
- Botones de limpiar y registrar

### Listado de Solicitudes — SSR
- **Datos pre-renderizados desde el servidor** (tabla lista en el HTML inicial)
- Tabla con todas las columnas: ID, DNI, nombre, origen, destino, tipo, pasajero, salida, regreso, registro, estado
- **Sanitización XSS** con DOMPurify al mostrar datos en la tabla
- Filtro por estado con selector desplegable
- Contador de resultados filtrados
- Badges de color por estado
- Botón de eliminar por solicitud
- Diseño responsive con scroll horizontal en pantallas pequeñas

### Seguridad y Sanitización
- Middleware XSS global en backend (librería `xss`)
- Sanitización de datos en formulario con DOMPurify (frontend)
- Sanitización de datos renderizados en tabla con DOMPurify (frontend)
- Protección contra inyección de `<script>`, `onerror`, y otros vectores XSS

## 📄 Licencia

© 2026 Agencia de Viajes Oeste - Todos los derechos reservados
