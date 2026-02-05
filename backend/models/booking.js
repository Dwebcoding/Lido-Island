// Renamed to booking.cjs for CommonJS compatibility
import { getDb } from '../config/db.js';

export async function initBookingModel() {
  const db = await getDb();
  await db.run(`CREATE TABLE IF NOT EXISTS prenotazioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    data TEXT NOT NULL,
    persone INTEGER,
    messaggio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}

export async function createBooking({ nome, email, telefono, data, persone, messaggio }) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO prenotazioni (nome, email, telefono, data, persone, messaggio) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, email, telefono, data, persone, messaggio]
  );
  return result.lastID;
}

export async function getAllBookings() {
  const db = await getDb();
  return db.all('SELECT * FROM prenotazioni ORDER BY created_at DESC');
}
