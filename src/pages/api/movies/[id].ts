import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const result = query(`SELECT id, title, description, release_date, duration, poster_url, backdrop_url, rating, genres, director, "cast" FROM movies WHERE id = ?`, [req.query.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Фильм не найден' });
        const row = result.rows[0] as Record<string, unknown>;
        res.status(200).json({ data: {
            _id: String(row.id), title: row.title, description: row.description || '',
            releaseDate: row.release_date ? String(row.release_date).split(/[T\s]/)[0] : '',
            duration: row.duration, posterUrl: row.poster_url || '', backdropUrl: row.backdrop_url || '',
            rating: parseFloat(String(row.rating || 0)), genre: row.genres ? JSON.parse(String(row.genres)) : [],
            director: row.director || '', cast: row.cast ? JSON.parse(String(row.cast)) : [],
        }});
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
