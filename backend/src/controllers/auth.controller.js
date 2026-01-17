const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

/**
 * Controlador de autenticación
 * Maneja registro, login, logout y verificación de token
 */
class AuthController {
  /**
   * Registrar un nuevo usuario
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          error: 'El correo electrónico y la contraseña son requeridos'
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'El formato del correo electrónico no es válido'
        });
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        return res.status(400).json({
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Crear usuario
      const newUser = await UserModel.create(email, password);

      console.log(`✅ Usuario registrado: ${email}`);

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error('Error en registro:', error.message);
      
      if (error.message === 'El correo electrónico ya está registrado') {
        return res.status(409).json({ error: error.message });
      }
      
      res.status(500).json({
        error: 'Error al registrar el usuario'
      });
    }
  }

  /**
   * Iniciar sesión
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          error: 'El correo electrónico y la contraseña son requeridos'
        });
      }

      // Verificar credenciales
      const user = await UserModel.verifyCredentials(email, password);

      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      console.log(`✅ Usuario autenticado: ${email}`);

      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error en login:', error.message);
      res.status(500).json({
        error: 'Error al iniciar sesión'
      });
    }
  }

  /**
   * Cerrar sesión
   * POST /api/auth/logout
   * Nota: En una implementación más robusta, se podría usar una lista negra de tokens
   */
  static async logout(req, res) {
    try {
      // En el cliente, el token se elimina del localStorage
      // En el servidor, simplemente confirmamos el logout
      // Para una implementación más segura, se podría mantener una lista negra de tokens
      
      console.log(`✅ Usuario cerró sesión: ${req.user?.email || 'desconocido'}`);

      res.json({
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      console.error('Error en logout:', error.message);
      res.status(500).json({
        error: 'Error al cerrar sesión'
      });
    }
  }

  /**
   * Verificar token y obtener información del usuario
   * GET /api/auth/verify
   */
  static async verify(req, res) {
    try {
      // El middleware verifyToken ya verificó el token y agregó req.user
      const user = UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        valid: true,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error en verificación:', error.message);
      res.status(500).json({
        error: 'Error al verificar el token'
      });
    }
  }
}

module.exports = AuthController;
