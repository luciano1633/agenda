const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Rutas de autenticación
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', AuthController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', AuthController.login);

// POST /api/auth/logout - Cerrar sesión (requiere token)
router.post('/logout', verifyToken, AuthController.logout);

// GET /api/auth/verify - Verificar token (requiere token)
router.get('/verify', verifyToken, AuthController.verify);

module.exports = router;
