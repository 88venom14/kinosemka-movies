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
    if (req.method === 'GET') return getBookings(req, res);
    if (req.method === 'POST') return createBooking(req, res);
    res.status(405).json({ error: 'Method not allowed' });
}

async function getBookings(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Требуется авторизация' });
    try {
        const result = query(`SELECT b.id, b.user_id, b.session_id, b.status, b.total_price, b.created_at, m.title AS movie_title, s.start_time, s.base_price, h.name AS hall_name FROM bookings b JOIN sessions s ON b.session_id = s.id JOIN movies m ON s.movie_id = m.id JOIN halls h ON s.hall_id = h.id WHERE b.user_id = ? ORDER BY b.created_at DESC`, [userId]);
        const bookings = await Promise.all((result.rows as Record<string, unknown>[]).map(async (r) => {
            const items = query(`SELECT s.row_letter, s.seat_number FROM booking_items bi JOIN seats s ON bi.seat_id = s.id WHERE bi.booking_id = ?`, [r.id]);
            return {
                _id: String(r.id), userId: String(r.user_id), showtimeId: String(r.session_id),
                seatNumbers: (items.rows as Record<string, unknown>[]).map((i: Record<string, unknown>) => `${i.row_letter}${i.seat_number}`),
                totalPrice: parseFloat(String(r.total_price)),
                bookingDate: new Date(String(r.created_at)).toISOString(),
                status: r.status, movieTitle: r.movie_title,
                showtime: { _id: String(r.session_id), dateTime: new Date(String(r.start_time)).toISOString(), screenNumber: r.hall_name, ticketPrice: parseFloat(String(r.base_price)) },
            };
        }));
        res.status(200).json({ data: bookings });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}

async function createBooking(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Требуется авторизация' });
    try {
        const { showtimeId, seats: seatIds } = req.body;
        const placeholders = seatIds.map(() => '?').join(',');
        const locked = query(`SELECT ss.id, ss.status FROM session_seats ss WHERE ss.session_id = ? AND ss.seat_id IN (${placeholders})`, [parseInt(showtimeId), ...seatIds.map((id: string) => parseInt(id))]);
        const sold = (locked.rows as Record<string, unknown>[]).filter((s: Record<string, unknown>) => s.status !== 'available');
        if (sold.length > 0) return res.status(409).json({ error: 'Некоторые места уже заняты' });
        const seatInfo = query(`SELECT s.id, s.price_multiplier FROM seats s WHERE s.id IN (${placeholders})`, [...seatIds.map((id: string) => parseInt(id))]);
        const sessionInfo = query(`SELECT base_price FROM sessions WHERE id = ?`, [parseInt(showtimeId)]);
        const basePrice = parseFloat(String((sessionInfo.rows[0] as Record<string, unknown>).base_price));
        const totalPrice = (seatInfo.rows as Record<string, unknown>[]).reduce((sum: number, s: Record<string, unknown>) => sum + basePrice * parseFloat(String(s.price_multiplier)), 0);
        const bookingRows = query(`INSERT INTO bookings (user_id, session_id, status, total_price) VALUES (?, ?, 'confirmed', ?) RETURNING id`, [userId, parseInt(showtimeId), totalPrice]);
        const bookingId = (bookingRows.rows[0] as Record<string, unknown>).id;
        for (const seat of seatInfo.rows as Record<string, unknown>[]) {
            query(`INSERT INTO booking_items (booking_id, seat_id, price) VALUES (?, ?, ?)`, [bookingId, seat.id, basePrice * parseFloat(String(seat.price_multiplier))]);
        }
        query(`UPDATE session_seats SET status = 'sold' WHERE session_id = ? AND seat_id IN (${placeholders})`, [parseInt(showtimeId), ...seatIds.map((id: string) => parseInt(id))]);
        const b = (query(`SELECT id, user_id, session_id, status, total_price, created_at FROM bookings WHERE id = ?`, [bookingId]).rows[0] as Record<string, unknown>);
        const seatLabels = query(`SELECT s.row_letter, s.seat_number FROM booking_items bi JOIN seats s ON bi.seat_id = s.id WHERE bi.booking_id = ?`, [bookingId]);
        const seatNums = (seatLabels.rows as Record<string, unknown>[]).map((s: Record<string, unknown>) => `${s.row_letter}${s.seat_number}`);
        const sessionData = query(`SELECT s.start_time, s.base_price, h.name AS hall_name FROM sessions s JOIN halls h ON s.hall_id = h.id WHERE s.id = ?`, [parseInt(showtimeId)]);
        const sd = sessionData.rows[0] as Record<string, unknown>;
        res.status(201).json({ data: {
            _id: String(b.id), userId: String(b.user_id), showtimeId: String(b.session_id),
            seatNumbers: seatNums,
            totalPrice: parseFloat(String(b.total_price)),
            bookingDate: new Date(String(b.created_at)).toISOString(),
            status: b.status,
            showtime: {
                _id: String(b.session_id),
                dateTime: new Date(String(sd.start_time)).toISOString(),
                screenNumber: sd.hall_name,
                ticketPrice: parseFloat(String(sd.base_price)),
            },
        }});
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed' });
    }
}
