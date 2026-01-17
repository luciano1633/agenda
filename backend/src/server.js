const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend de Vite
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

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
  console.log(`   POST /api/auth/register - Registrar usuario`);
  console.log(`   POST /api/auth/login    - Iniciar sesión`);
  console.log(`   POST /api/auth/logout   - Cerrar sesión`);
  console.log(`   GET  /api/auth/verify   - Verificar token\n`);
});
