import { createRequire } from 'module';
import bcrypt from 'bcryptjs';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const db = new Database('clinic.db');

// Initialize database
export function initDb() {
  // Create admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  // Create appointments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      date TEXT NOT NULL, -- YYYY-MM-DD
      time_slot TEXT NOT NULL, -- HH:mm
      status TEXT DEFAULT 'booked', -- booked, cancelled
      created_by TEXT DEFAULT 'patient', -- patient, admin
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create default admin if not exists
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
  if (!admin) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
    console.log('Default admin user created: admin / admin123');
  }
}

export default db;
