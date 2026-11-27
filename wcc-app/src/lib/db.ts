import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Inisialisasi Tabel jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    pin TEXT,
    clientName TEXT,
    clientPhone TEXT,
    date TEXT,
    package TEXT,
    status TEXT,
    assignedTeam TEXT,
    requestStatus TEXT DEFAULT 'Belum Isi',
    rating INTEGER,
    remainingBill TEXT,
    requestDetail TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT,
    amount INTEGER,
    description TEXT,
    date TEXT
  );
`);

export default db;
