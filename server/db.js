const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'rehabzsc.db');
const SALT_ROUNDS = 10;

function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function initDatabase() {
  ensureDataDir();

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  seedDefaultUser(db);

  return db;
}

function seedDefaultUser(db) {
  const count = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total;

  if (count === 0) {
    const hash = bcrypt.hashSync('Rehab2026!', SALT_ROUNDS);
    db.prepare(`
      INSERT INTO usuarios (username, password, nombre, rol)
      VALUES (?, ?, ?, ?)
    `).run('admin', hash, 'Administrador Rehab ZSC', 'administrador');

    console.log('Usuario demo creado → usuario: admin | contraseña: Rehab2026!');
  }
}

function findUserByUsername(db, username) {
  return db.prepare(`
    SELECT id, username, password, nombre, rol, activo
    FROM usuarios
    WHERE username = ?
  `).get(username);
}

function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

module.exports = { initDatabase, findUserByUsername, verifyPassword };
