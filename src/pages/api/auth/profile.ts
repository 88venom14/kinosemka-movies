import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'cineselect-secret-key-change-in-production';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        const result = query(`SELECT id, name, email, created_at FROM users WHERE id = ?`, [decoded.userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        const u = result.rows[0] as Record<string, unknown>;
        res.status(200).json({ data: { user: { _id: String(u.id), name: u.name, email: u.email, createdAt: new Date(String(u.created_at)).toISOString() } } });
    } catch (error) {
        res.status(401).json({ error: 'Невалидный токен' });
    }
}
