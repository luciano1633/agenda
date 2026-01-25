const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta para iniciar autenticación con Google
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);


// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure',
    session: true
  }),
  (req, res) => {
    // Autenticación exitosa: redirigir al dashboard del frontend
    res.redirect('http://localhost:5173/dashboard');
  }
);

// Ruta de éxito
router.get('/google/success', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  res.json({
    message: 'Autenticación con Google exitosa',
    user: req.user
  });
});

// Ruta de fallo
router.get('/google/failure', (req, res) => {
  res.status(401).json({ error: 'Error en autenticación con Google' });
});

// Logout Google/local
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.json({ message: 'Sesión cerrada correctamente' });
    });
  });
});

module.exports = router;
