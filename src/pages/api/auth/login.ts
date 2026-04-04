import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'cineselect-secret-key-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { email, password } = req.body;
        const result = query(`SELECT id, name, email, password_hash FROM users WHERE email = ?`, [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Неверный email или пароль' });
        const user = result.rows[0] as Record<string, unknown>;
        const valid = await bcrypt.compare(password, String(user.password_hash));
        if (!valid) return res.status(401).json({ error: 'Неверный email или пароль' });
        const token = jwt.sign({ userId: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ data: { token, user: { _id: String(user.id), name: user.name, email: user.email, createdAt: new Date().toISOString() } } });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
