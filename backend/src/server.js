const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const oauthRoutes = require('./routes/oauth.routes');
const travelRequestRoutes = require('./routes/travelRequest.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/globalRateLimiter');
const config = require('./config/config');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();
const PORT = config.PORT;

// Middlewares
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Middleware global de rate limiting
app.use(globalLimiter);
app.use(express.json());

// Configuración de sesión para Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'session_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Cambiar a true si usas HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
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
  console.log(`   POST /api/auth/register - Registrar usuario`);
  console.log(`   POST /api/auth/login    - Iniciar sesión`);
  console.log(`   POST /api/auth/logout   - Cerrar sesión`);
  console.log(`   GET  /api/auth/verify   - Verificar token\n`);
});
