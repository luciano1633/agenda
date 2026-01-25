// Función para validar la fortaleza de contraseñas
// Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
function isStrongPassword(password) {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return strongRegex.test(password);
}

module.exports = { isStrongPassword };
