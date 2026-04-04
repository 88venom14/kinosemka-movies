import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { showtimeId } = req.query;
        if (!showtimeId) return res.status(400).json({ error: 'showtimeId required' });
        const result = query(`SELECT s.id as seat_id, ss.session_id, s.row_letter, s.seat_number, s.seat_type, ss.status, s.price_multiplier FROM session_seats ss JOIN seats s ON ss.seat_id = s.id WHERE ss.session_id = ? ORDER BY s.row_letter ASC, s.seat_number ASC`, [showtimeId]);
        const seats = (result.rows as Record<string, unknown>[]).map((row) => ({
            _id: String(row.seat_id), showtimeId: String(row.session_id), row: row.row_letter,
            number: row.seat_number, type: row.seat_type,
            status: row.status === 'sold' ? 'occupied' : row.status,
            priceMultiplier: parseFloat(String(row.price_multiplier || 1)),
        }));
        res.status(200).json({ data: seats });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
