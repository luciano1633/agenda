const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const config = require('../config/config');

// Configuración de serialización/deserialización
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Estrategia de Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
(accessToken, refreshToken, profile, done) => {
  // Aquí puedes validar el dominio del correo si es necesario
  // Ejemplo: solo permitir @duocuc.cl
  const email = profile.emails[0].value;
  if (process.env.GOOGLE_DOMAIN && !email.endsWith(`@${process.env.GOOGLE_DOMAIN}`)) {
    return done(null, false, { message: 'Dominio no autorizado' });
  }
  // Puedes guardar el usuario en la base de datos si lo deseas
  return done(null, {
    id: profile.id,
    displayName: profile.displayName,
    email,
    photo: profile.photos[0]?.value
  });
}
));

module.exports = passport;
