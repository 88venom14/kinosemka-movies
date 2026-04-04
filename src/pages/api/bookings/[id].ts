import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'cineselect-secret-key-change-in-production';

function getUserId(req: NextApiRequest): number | null {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    try { return (jwt.verify(token, JWT_SECRET) as { userId: number }).userId; } catch { return null; }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Требуется авторизация' });
    try {
        const result = query(`SELECT * FROM bookings WHERE id = ? AND user_id = ?`, [req.query.id, userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Бронирование не найдено' });
        const booking = result.rows[0] as Record<string, unknown>;
        query(`UPDATE session_seats SET status = 'available' WHERE session_id = ? AND seat_id IN (SELECT bi.seat_id FROM booking_items bi WHERE bi.booking_id = ?)`, [booking.session_id, booking.id]);
        query(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`, [booking.id]);
        res.status(200).json({ data: { _id: String(booking.id), status: 'cancelled' } });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
