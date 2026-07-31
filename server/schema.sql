-- Rehab ZSC — Esquema de base de datos
-- Compatible con SQLite (por defecto) y MySQL

CREATE TABLE IF NOT EXISTS usuarios (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  username    TEXT    NOT NULL UNIQUE,
  password    TEXT    NOT NULL,
  nombre      TEXT    NOT NULL,
  rol         TEXT    NOT NULL DEFAULT 'fisioterapeuta',
  activo      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Usuario de demostración (contraseña: Rehab2026!)
-- El hash se genera automáticamente al iniciar el servidor si la tabla está vacía.
