require('dotenv').config();

const express = require('express');
const path = require('path');
const { initDatabase, findUserByUsername, verifyPassword } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const db = initDatabase();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Usuario y contraseña son obligatorios.',
    });
  }

  const user = findUserByUsername(db, username.trim());

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos.',
    });
  }

  if (!user.activo) {
    return res.status(403).json({
      success: false,
      message: 'Su cuenta está desactivada. Contacte con el administrador.',
    });
  }

  const valid = verifyPassword(password, user.password);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos.',
    });
  }

  return res.json({
    success: true,
    message: 'Acceso concedido.',
    user: {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      rol: user.rol,
    },
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Rehab ZSC' });
});

app.listen(PORT, () => {
  console.log(`Rehab ZSC → http://localhost:${PORT}`);
});
