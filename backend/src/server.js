const express = require('express');
const cors = require('cors');
const travelRequestRoutes = require('./routes/travelRequest.routes');
const { errorHandler } = require('./middleware/errorHandler');
const config = require('./config/config');

const app = express();
const PORT = config.PORT;

// Middlewares
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Rutas de solicitudes de viaje
app.use('/api/travel-requests', travelRequestRoutes);

// Ruta de verificación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor de Agencia de Viajes Oeste funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejador de errores global
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor de Agencia de Viajes Oeste`);
  console.log(`   Ejecutándose en: http://localhost:${PORT}`);
  console.log(`   Estado: http://localhost:${PORT}/api/health`);
  console.log(`\n📋 Endpoints disponibles:`);
  console.log(`   GET    /api/travel-requests          - Listar solicitudes`);
  console.log(`   GET    /api/travel-requests?status=X  - Filtrar por estado`);
  console.log(`   GET    /api/travel-requests/next-id   - Siguiente ID`);
  console.log(`   GET    /api/travel-requests/clients/search?q=X - Buscar clientes`);
  console.log(`   POST   /api/travel-requests           - Crear solicitud`);
  console.log(`   PUT    /api/travel-requests/:id       - Actualizar solicitud`);
  console.log(`   DELETE /api/travel-requests/:id       - Eliminar solicitud\n`);
});
