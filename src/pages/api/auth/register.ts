import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'cineselect-secret-key-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { name, email, password } = req.body;
        const existing = query(`SELECT id FROM users WHERE email = ?`, [email]);
        if (existing.rows.length > 0) return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
        const hash = await bcrypt.hash(password, 10);
        const result = query(`INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?) RETURNING id, name, email, created_at`, [name, email, hash]);
        const user = result.rows[0] as Record<string, unknown>;
        const token = jwt.sign({ userId: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ data: { token, user: { _id: String(user.id), name: user.name, email: user.email, createdAt: new Date(String(user.created_at)).toISOString() } } });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
