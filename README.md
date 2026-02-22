# Agencia de Viajes Oeste - Sistema de Solicitudes de Viaje

Portal web para la gestión de solicitudes de viaje de la Agencia de Viajes Oeste, desarrollado con **Next.js** (frontend SSR) y **Node.js/Express** (backend API REST).

## 📋 Manejo de Formularios con React Hook Form

La aplicación utiliza **React Hook Form** para gestionar todos los formularios, reemplazando el manejo manual con `useState`:

- **`useForm()`**: Inicializa el formulario con `defaultValues` y modo de validación `onSubmit`.
- **`register()`**: Vincula cada campo del formulario con reglas de validación declarativas.
- **`handleSubmit()`**: Gestiona el envío del formulario, ejecutando la lógica solo si las validaciones pasan.
- **`formState.errors`**: Objeto de errores reactivo que muestra mensajes de validación internacionalizados.
- **`reset()`**: Resetea el formulario a sus valores por defecto tras un envío exitoso.
- **`setValue()` / `watch()` / `getValues()`**: Métodos auxiliares para campos con lógica especial (búsqueda de pasajeros, validaciones cruzadas de fechas).

### Formularios migrados a React Hook Form

| Componente | Campos | Validaciones |
|------------|--------|--------------|
| `TravelRequestForm` | 10 campos (DNI, nombre, email, origen, destino, tipo viaje, pasajero, salida, regreso, estado) | required, pattern (DNI/email), minLength, validate (fechas pasadas, fecha regreso > salida) |
| `ClientRequestView` | 2 campos (tipo búsqueda, valor búsqueda) | required, validate dinámico (DNI o email según tipo seleccionado) |

### Ejemplo de validación con React Hook Form + i18n

```jsx
<input
  {...register('clientDni', {
    required: t('validation.dniRequired'),
    pattern: {
      value: /^\d{7,8}-[\dkK]$/,
      message: t('validation.dniInvalid'),
    },
  })}
/>
{errors.clientDni && <span className="error-text">{errors.clientDni.message}</span>}
```

## 🌐 Internacionalización (i18n) con react-i18next

La aplicación implementa **internacionalización completa** usando `react-i18next`, permitiendo cambiar manualmente el idioma entre **español (es)** e **inglés (en)**:

- **Selector de idioma manual** visible en la barra de navegación (botones 🇨🇱 ES / 🇺🇸 EN).
- **Persistencia del idioma** seleccionado en `localStorage` (se recuerda entre sesiones).
- **Detección automática** del idioma del navegador como valor inicial (`i18next-browser-languagedetector`).
- **Todos los textos de la interfaz** están traducidos: etiquetas, placeholders, botones, encabezados, mensajes de error y validación.
- **Mensajes de validación localizados**: por ejemplo, `"Este campo es obligatorio"` / `"This field is required"`.
- **Formato de fechas regional**: se adapta al locale del idioma (`es-CL` para español, `en-US` para inglés).
- **Formato de hora regional**: las fechas de registro, salida y regreso se muestran en el formato correspondiente al país.

| Idioma | Código | Archivo de traducciones | Formato de fecha |
|--------|--------|------------------------|-----------------|
| Español | `es` | `src/i18n/locales/es.json` | DD/MM/YYYY (es-CL) |
| Inglés | `en` | `src/i18n/locales/en.json` | MM/DD/YYYY (en-US) |

### Arquitectura i18n

```
frontend/src/i18n/
├── i18n.js                  # Configuración de i18next (fallback, detección, cache)
└── locales/
    ├── es.json              # Traducciones en español
    └── en.json              # Traducciones en inglés
```

- `I18nProvider` envuelve toda la aplicación desde `layout.js`.
- Los Server Components usan componentes wrapper de tipo Client (`HomeContent`, `ListPageHeader`, etc.) para acceder a las traducciones.
- El `LanguageSwitcher` en el Navbar permite cambiar el idioma en cualquier momento.

## 🖥️ Renderizado desde el Servidor (SSR)

Esta aplicación implementa **Server-Side Rendering (SSR)** con Next.js App Router:

- **Páginas como Server Components**: Las páginas (`page.js`) se ejecutan en el servidor de Next.js, realizando `fetch` a la API backend antes de enviar el HTML completo al navegador.
- **Datos pre-renderizados**: Las estadísticas del panel de control y el listado de solicitudes llegan al cliente ya resueltos en el HTML, sin necesidad de esperar llamadas AJAX.
- **Hidratación selectiva**: Solo los componentes que requieren interactividad (formulario, filtros, eliminación) usan `'use client'` para hidratarse en el navegador.
- **Beneficios**: Mejor SEO, accesibilidad mejorada, tiempos de carga inicial más rápidos.

| Página | Tipo | Descripción |
|--------|------|-------------|
| `/` (panel de control) | Server Component | Fetch de estadísticas en el servidor |
| `/solicitudes` (listado) | Server Component | Fetch de solicitudes en el servidor con espera simulada 3s |
| `/solicitudes/nueva` (formulario) | Server Component + Client Component | Layout SSR, formulario interactivo cargado con lazy loading |
| `/cliente` (portal cliente) | Server Component + Client Component | Layout SSR, vista de consulta cargada con lazy loading |

## ⚡ Carga Diferida con next/dynamic y Lazy Loading

Todos los componentes pesados se cargan de forma diferida usando `next/dynamic`:

| Componente | Página | Skeleton |
|------------|--------|----------|
| `DashboardContent` | `/` | `SkeletonDashboard` |
| `TravelRequestList` | `/solicitudes` | `SkeletonTable` |
| `TravelRequestForm` | `/solicitudes/nueva` | `SkeletonForm` |
| `ClientRequestView` | `/cliente` | `SkeletonClientView` |

- Los componentes se cargan **solo cuando el usuario navega a la página** (lazy loading bajo demanda).
- Mientras se cargan, se muestra un **componente Skeleton** como retroalimentación visual.
- Las páginas que muestran listados incluyen una **espera simulada de 3 segundos** para demostrar los Skeletons.

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
- Fechas de salida y regreso no pueden ser en el pasado
- Tipos de viaje y estados válidos
- Nombre del cliente con mínimo 3 caracteres
- **Mensajes de validación internacionalizados** (español e inglés) usando `react-i18next`
- **React Hook Form** para validaciones declarativas con `register()` y `validate`
- Validación del formato de búsqueda en el portal del cliente (DNI y email)

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
6. **Cambiar Estado**: En el listado, usa el selector desplegable en la columna "Estado" para cambiar el estado de cualquier solicitud
7. **Eliminar**: Haz clic en el botón 🗑️ de la fila correspondiente para eliminar una solicitud
8. **Portal Cliente**: Navega a `/cliente` para consultar solicitudes por DNI o email (vista de solo lectura)

## 📁 Estructura del Proyecto

```
├── backend/                              # Servidor Node.js/Express (API REST)
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js                 # Configuración (puerto, CORS, JWT)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js         # Controlador de autenticación
│   │   │   └── travelRequest.controller.js  # Lógica de solicitudes (CRUD)
│   │   ├── data/
│   │   │   ├── travelRequests.json        # Almacenamiento mock (persistencia local)
│   │   │   └── users.json                 # Datos de usuarios
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js          # Verificación de token JWT
│   │   │   ├── errorHandler.js            # Manejo centralizado de errores
│   │   │   └── travelValidation.js        # Validación de campos, formatos y fechas
│   │   ├── models/
│   │   │   ├── travelRequest.model.js     # Modelo de solicitud + clientes mock
│   │   │   └── user.model.js              # Modelo de usuario con bcrypt
│   │   ├── routes/
│   │   │   ├── auth.routes.js             # Rutas de autenticación
│   │   │   └── travelRequest.routes.js    # Definición de rutas API
│   │   ├── utils/
│   │   │   ├── passwordStrength.js        # Validación de fortaleza de contraseña
│   │   │   └── sanitize.js                # Sanitización XSS (middleware + utilidades)
│   │   └── server.js                      # Punto de entrada del servidor
│   └── package.json
│
├── frontend/                              # Aplicación Next.js (SSR + Lazy Loading)
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css                # Estilos globales (CSS responsive + Skeletons)
│   │   │   ├── layout.js                  # Layout raíz de la aplicación
│   │   │   ├── page.js                    # Panel de control (SSR + dynamic import)
│   │   │   ├── cliente/
│   │   │   │   └── page.js                # Portal del cliente (SSR + lazy loading)
│   │   │   └── solicitudes/
│   │   │       ├── page.js                # Listado con espera simulada 3s + Skeleton
│   │   │       └── nueva/
│   │   │           └── page.js            # Formulario con carga diferida + Skeleton
│   │   ├── components/
│   │   │   ├── ClientPageHeader.js         # Encabezado i18n para portal del cliente
│   │   │   ├── ClientRequestView.js       # Vista de consulta para clientes (RHF + i18n)
│   │   │   ├── DashboardContent.js        # Contenido del dashboard (lazy loaded + i18n)
│   │   │   ├── HomeContent.js             # Encabezado i18n para página principal
│   │   │   ├── I18nProvider.js            # Proveedor de contexto i18next
│   │   │   ├── LanguageSwitcher.js        # Selector manual de idioma (ES/EN)
│   │   │   ├── ListPageHeader.js          # Encabezado i18n para listado
│   │   │   ├── Navbar.js                  # Barra de navegación (i18n + selector idioma)
│   │   │   ├── NewRequestPageHeader.js    # Encabezado i18n para nueva solicitud
│   │   │   ├── TravelRequestForm.js       # Formulario de solicitud (RHF + i18n + validaciones)
│   │   │   ├── TravelRequestList.js       # Tabla de solicitudes (i18n + filtros)
│   │   │   └── skeletons/                 # Componentes Skeleton (retroalimentación visual)
│   │   │       ├── SkeletonClientView.js  # Skeleton para vista cliente
│   │   │       ├── SkeletonDashboard.js   # Skeleton para dashboard
│   │   │       ├── SkeletonForm.js        # Skeleton para formulario
│   │   │       └── SkeletonTable.js       # Skeleton para tabla de solicitudes
│   │   ├── i18n/                          # Internacionalización (react-i18next)
│   │   │   ├── i18n.js                    # Configuración de i18next
│   │   │   └── locales/
│   │   │       ├── es.json                # Traducciones en español
│   │   │       └── en.json                # Traducciones en inglés
│   │   └── services/
│   │       └── api.js                     # Servicio de conexión con la API (CRUD completo)
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
- **next/dynamic** (carga diferida / lazy loading de componentes)
- **react-i18next** + **i18next** (internacionalización ES/EN con cambio manual)
- **i18next-browser-languagedetector** (detección automática del idioma del navegador)
- **isomorphic-dompurify** (sanitización XSS compatible con SSR)
- **react-hook-form** (manejo declarativo de formularios y validaciones)
- **CSS3** (diseño responsivo, grid, flexbox, animaciones Skeleton)

### Backend
- **Node.js**
- **Express.js**
- **bcryptjs** (hash de contraseñas)
- **jsonwebtoken** (autenticación JWT)
- **xss** (sanitización de entradas contra ataques XSS)
- **Archivo JSON** (persistencia mock local)
- **CORS** (comunicación cross-origin)

## 📝 Funcionalidades Implementadas

### Panel de Control (Página principal) — SSR + Lazy Loading
- Estadísticas renderizadas desde el servidor (no requiere AJAX en carga inicial)
- Componente `DashboardContent` cargado con `next/dynamic`
- Skeleton de retroalimentación visual durante la carga
- Accesos rápidos a nueva solicitud, listado y portal cliente
- Diseño con tarjetas informativas

### Formulario de Solicitud de Viaje — React Hook Form + Lazy Loading + Skeleton
- **React Hook Form** (`useForm`, `register`, `handleSubmit`) para manejo del estado y validaciones
- Validaciones declarativas con `register()`: `required`, `pattern`, `minLength`, `validate`
- Mensajes de validación internacionalizados con `t()` de react-i18next
- Validaciones cruzadas: fecha de regreso debe ser posterior a la de salida (`getValues`)
- ID automático correlativo (obtenido del backend)
- Fecha y hora de registro en tiempo real (se actualiza cada segundo)
- **Validación de fechas pasadas** (salida y regreso no pueden ser en el pasado)
- **Sanitización XSS** con DOMPurify antes de enviar datos al backend
- Campo de búsqueda de pasajeros con dropdown (`setValue` para sincronizar con RHF)
- Tipo de viaje con control de listado (select)
- Estado con botones de opción (radio buttons)
- Componente cargado con `next/dynamic` + `SkeletonForm`
- Botones de limpiar (`reset()`) y registrar

### Listado de Solicitudes — SSR + Lazy Loading + Skeleton 3s
- **Datos pre-renderizados desde el servidor** (tabla lista en el HTML inicial)
- **Espera simulada de 3 segundos** con componente `SkeletonTable`
- Componente `TravelRequestList` cargado con `next/dynamic`
- Tabla con todas las columnas: ID, DNI, nombre, origen, destino, tipo, pasajero, salida, regreso, registro, estado
- **Sanitización XSS** con DOMPurify al mostrar datos en la tabla
- Filtro por estado con selector desplegable
- **Cambio de estado** directamente desde la tabla (selector inline por solicitud)
- Contador de resultados filtrados
- Botón de eliminar por solicitud (seleccionable)
- Diseño responsive con scroll horizontal en pantallas pequeñas

### Portal del Cliente — React Hook Form + Lazy Loading + Skeleton
- **React Hook Form** para el formulario de búsqueda con validación dinámica
- Validación adaptativa: aplica regex de DNI o email según el tipo de búsqueda seleccionado
- Página `/cliente` con búsqueda por DNI o email
- Los clientes solo pueden visualizar sus propias solicitudes (solo lectura)
- Espera simulada de 3 segundos con Skeleton durante la búsqueda
- Tarjetas con detalle completo de cada solicitud encontrada

### Internacionalización (i18n)
- Soporte completo para **español** e **inglés** con `react-i18next`
- Selector de idioma manual en la barra de navegación (🇨🇱 ES / 🇺🇸 EN)
- Persistencia del idioma seleccionado en `localStorage`
- Detección del idioma preferido del navegador como valor inicial
- Todos los formularios, validaciones, etiquetas, placeholders y mensajes traducidos
- Formato de fechas adaptado al locale del idioma seleccionado (`es-CL` / `en-US`)
- Componentes wrapper (`HomeContent`, `ListPageHeader`, etc.) para integrar traducciones en Server Components
- `I18nProvider` envuelve la aplicación desde `layout.js`

### Seguridad y Sanitización
- Middleware XSS global en backend (librería `xss`)
- Sanitización de datos en formulario con DOMPurify (frontend)
- Sanitización de datos renderizados en tabla con DOMPurify (frontend)
- Protección contra inyección de `<script>`, `onerror`, y otros vectores XSS

## 📄 Licencia

© 2026 Agencia de Viajes Oeste - Todos los derechos reservados
