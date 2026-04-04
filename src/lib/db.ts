import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'moviesdatabase.sqlite');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schemaPath = path.join(process.cwd(), 'database', 'schema-sqlite.sql');
if (fs.existsSync(schemaPath)) db.exec(fs.readFileSync(schemaPath, 'utf-8'));

export function query(sql: string, params: unknown[] = []) {
    const lower = sql.trim().toLowerCase();
    if (lower.startsWith('select') || lower.includes('returning')) {
        return { rows: db.prepare(sql).all(...params) as Record<string, unknown>[] };
    }
    const info = db.prepare(sql).run(...params);
    return { rows: [], lastInsertRowid: info.lastInsertRowid, rowCount: info.changes };
}

export default db;
