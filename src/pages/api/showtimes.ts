import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { movieId } = req.query;
        let sql = `SELECT s.id, s.movie_id, s.hall_id, s.start_time, s.base_price, h.name as hall_name, COUNT(ss.id) as total_seats, SUM(CASE WHEN ss.status = 'available' THEN 1 ELSE 0 END) as available_seats FROM sessions s JOIN halls h ON s.hall_id = h.id LEFT JOIN session_seats ss ON s.id = ss.session_id`;
        const params: unknown[] = [];
        if (movieId) { sql += ` WHERE s.movie_id = ?`; params.push(movieId); }
        sql += ` GROUP BY s.id, h.name ORDER BY s.start_time ASC`;
        const result = query(sql, params);
        const showtimes = (result.rows as Record<string, unknown>[]).map((row) => ({
            _id: String(row.id), movieId: String(row.movie_id),
            dateTime: new Date(String(row.start_time).replace(' ', 'T')).toISOString(),
            screenNumber: parseInt(String(row.hall_id)),
            totalSeats: parseInt(String(row.total_seats || 0)),
            availableSeats: parseInt(String(row.available_seats || 0)),
            ticketPrice: parseFloat(String(row.base_price || 0)),
        }));
        res.status(200).json({ data: showtimes });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
