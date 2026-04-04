import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const filter = req.query.filter;
        let sql: string;
        if (filter === 'upcoming') {
            sql = `SELECT id, title, description, release_date, duration, poster_url, backdrop_url, rating, genres, director, "cast" FROM movies WHERE release_date >= date('now') ORDER BY release_date ASC`;
        } else {
            sql = `SELECT id, title, description, release_date, duration, poster_url, backdrop_url, rating, genres, director, "cast" FROM movies WHERE release_date < date('now') ORDER BY rating DESC`;
        }
        const result = query(sql);
        const movies = (result.rows as Record<string, unknown>[]).map((row) => ({
            _id: String(row.id), title: row.title, description: row.description || '',
            releaseDate: row.release_date ? String(row.release_date).split(/[T\s]/)[0] : '',
            duration: row.duration, posterUrl: row.poster_url || '', backdropUrl: row.backdrop_url || '',
            rating: parseFloat(String(row.rating || 0)), genre: row.genres ? JSON.parse(String(row.genres)) : [],
            director: row.director || '', cast: row.cast ? JSON.parse(String(row.cast)) : [],
        }));
        res.status(200).json({ data: movies });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
