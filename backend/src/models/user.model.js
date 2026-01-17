const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { BCRYPT_SALT_ROUNDS } = require('../config/config');

// Ruta al archivo de usuarios
const USERS_FILE = path.join(__dirname, '../data/users.json');

/**
 * Modelo de Usuario
 * Maneja las operaciones de lectura/escritura en el archivo users.json
 */
class UserModel {
  /**
   * Lee todos los usuarios del archivo JSON
   * @returns {Array} Lista de usuarios
   */
  static getAllUsers() {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.users || [];
    } catch (error) {
      // Si el archivo no existe o hay error, retornar array vacío
      console.error('Error leyendo usuarios:', error.message);
      return [];
    }
  }

  /**
   * Guarda la lista de usuarios en el archivo JSON
   * @param {Array} users - Lista de usuarios a guardar
   */
  static saveAllUsers(users) {
    try {
      const data = JSON.stringify({ users }, null, 2);
      fs.writeFileSync(USERS_FILE, data, 'utf8');
    } catch (error) {
      console.error('Error guardando usuarios:', error.message);
      throw new Error('Error al guardar los datos del usuario');
    }
  }

  /**
   * Busca un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  static findByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  static findById(id) {
    const users = this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  /**
   * Crea un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {Object} Usuario creado (sin contraseña)
   */
  static async create(email, password) {
    const users = this.getAllUsers();

    // Verificar si el email ya existe
    if (this.findByEmail(email)) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Crear el nuevo usuario
    const newUser = {
      id: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Agregar a la lista y guardar
    users.push(newUser);
    this.saveAllUsers(users);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Verifica las credenciales de un usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {Object|null} Usuario si las credenciales son válidas, null si no
   */
  static async verifyCredentials(email, password) {
    const user = this.findByEmail(email);
    
    if (!user) {
      return null;
    }

    // Comparar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return null;
    }

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = UserModel;
