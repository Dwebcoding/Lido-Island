// Renamed to db.cjs for CommonJS compatibility
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDb() {
  return open({
    filename: './backend/prenotazioni.db',
    driver: sqlite3.Database
  });
}
