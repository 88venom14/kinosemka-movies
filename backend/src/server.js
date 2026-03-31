import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'cineselect-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// ─── Middleware ──────────────────────────────────────────────

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: 'Невалидный токен' });
    }
};

// ─── Movies ──────────────────────────────────────────────────

app.get('/api/movies', async (req, res) => {
    try {
        const filter = req.query.filter;
        let query = 'SELECT * FROM movies WHERE release_date < CURRENT_DATE ORDER BY rating DESC';
        if (filter === 'upcoming') {
            query = 'SELECT * FROM movies WHERE release_date >= CURRENT_DATE ORDER BY release_date ASC';
        }
        const { rows } = await pool.query(query);
        const movies = rows.map(r => ({
            _id: String(r.id),
            title: r.title,
            description: r.description || '',
            releaseDate: r.release_date ? r.release_date.toISOString().split('T')[0] : '',
            duration: r.duration,
            posterUrl: r.poster_url || '',
            backdropUrl: r.backdrop_url || '',
            rating: parseFloat(r.rating) || 0,
            genre: r.genres || [],
            director: r.director || '',
            cast: r.cast || [],
        }));
        res.json({ data: movies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Фильм не найден' });
        const r = rows[0];
        res.json({ data: {
            _id: String(r.id),
            title: r.title,
            description: r.description || '',
            releaseDate: r.release_date ? r.release_date.toISOString().split('T')[0] : '',
            duration: r.duration,
            posterUrl: r.poster_url || '',
            backdropUrl: r.backdrop_url || '',
            rating: parseFloat(r.rating) || 0,
            genre: r.genres || [],
            director: r.director || '',
            cast: r.cast || [],
        }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ─── Sessions ────────────────────────────────────────────────

app.get('/api/showtimes', async (req, res) => {
    try {
        const movieId = req.query.movieId;
        let query = `
            SELECT s.id, s.movie_id, s.hall_id, s.start_time, s.base_price, h.name AS hall_name,
                   COUNT(ss.id) FILTER (WHERE ss.status = 'available') AS available_seats,
                   COUNT(ss.id) AS total_seats
            FROM sessions s
            JOIN halls h ON s.hall_id = h.id
            LEFT JOIN session_seats ss ON s.id = ss.session_id
        `;
        const params = [];
        if (movieId) {
            query += ' WHERE s.movie_id = $1';
            params.push(parseInt(movieId));
        }
        query += ' GROUP BY s.id, h.name ORDER BY s.start_time';

        const { rows } = await pool.query(query, params);
        const showtimes = rows.map(r => ({
            _id: String(r.id),
            movieId: String(r.movie_id),
            dateTime: r.start_time.toISOString(),
            screenNumber: r.hall_id,
            totalSeats: parseInt(r.total_seats),
            availableSeats: parseInt(r.available_seats),
            ticketPrice: parseFloat(r.base_price),
        }));
        res.json({ data: showtimes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/showtimes/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT s.id, s.movie_id, s.hall_id, s.start_time, s.base_price,
                    COUNT(ss.id) FILTER (WHERE ss.status = 'available') AS available_seats,
                    COUNT(ss.id) AS total_seats
             FROM sessions s
             LEFT JOIN session_seats ss ON s.id = ss.session_id
             WHERE s.id = $1 GROUP BY s.id`,
            [req.params.id]
        );
        if (rows.length === 0) return res.json({ data: null });
        const r = rows[0];
        res.json({ data: {
            _id: String(r.id),
            movieId: String(r.movie_id),
            dateTime: r.start_time.toISOString(),
            screenNumber: r.hall_id,
            totalSeats: parseInt(r.total_seats),
            availableSeats: parseInt(r.available_seats),
            ticketPrice: parseFloat(r.base_price),
        }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ─── Seats ───────────────────────────────────────────────────

app.get('/api/seats', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT ss.id, ss.session_id, ss.seat_id, ss.status, ss.reserved_until,
                    s.row_letter, s.seat_number, s.seat_type, s.price_multiplier
             FROM session_seats ss
             JOIN seats s ON ss.seat_id = s.id
             WHERE ss.session_id = $1
             ORDER BY s.row_letter, s.seat_number`,
            [req.query.showtimeId]
        );
        const seats = rows.map(r => ({
            _id: String(r.seat_id),
            showtimeId: String(r.session_id),
            row: r.row_letter,
            number: r.seat_number,
            type: r.seat_type,
            status: r.status === 'sold' ? 'occupied' : r.status,
            priceMultiplier: parseFloat(r.price_multiplier),
        }));
        res.json({ data: seats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ─── Auth ────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Неверный email или пароль' });

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Неверный email или пароль' });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ data: { token, user: { _id: String(user.id), name: user.name, email: user.email, createdAt: user.created_at.toISOString() } } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) return res.status(409).json({ error: 'Пользователь с таким email уже существует' });

        const hash = await bcrypt.hash(password, 10);
        const { rows } = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, hash]
        );
        const user = rows[0];
        const token = jwt.sign({ userId: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ data: { token, user: { _id: String(user.id), name: user.name, email: user.email, createdAt: user.created_at.toISOString() } } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/auth/profile', authenticate, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.userId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        const u = rows[0];
        res.json({ data: { user: { _id: String(u.id), name: u.name, email: u.email, createdAt: u.created_at.toISOString() } } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ─── Bookings ────────────────────────────────────────────────

app.get('/api/bookings', authenticate, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT b.id, b.user_id, b.session_id, b.status, b.total_price, b.created_at,
                    m.title AS movie_title, s.start_time, s.base_price, h.name AS hall_name
             FROM bookings b
             JOIN sessions s ON b.session_id = s.id
             JOIN movies m ON s.movie_id = m.id
             JOIN halls h ON s.hall_id = h.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
            [req.userId]
        );
        const bookings = await Promise.all(rows.map(async (r) => {
            const { rows: items } = await pool.query(
                `SELECT s.row_letter, s.seat_number
                 FROM booking_items bi
                 JOIN seats s ON bi.seat_id = s.id
                 WHERE bi.booking_id = $1`,
                [r.id]
            );
            return {
                _id: String(r.id),
                userId: String(r.user_id),
                showtimeId: String(r.session_id),
                seatNumbers: items.map(i => `${i.row_letter}${i.seat_number}`),
                totalPrice: parseFloat(r.total_price),
                bookingDate: r.created_at.toISOString(),
                status: r.status,
                movieTitle: r.movie_title,
                showtime: {
                    _id: String(r.session_id),
                    dateTime: r.start_time.toISOString(),
                    screenNumber: r.hall_name,
                    ticketPrice: parseFloat(r.base_price),
                },
            };
        }));
        res.json({ data: bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/bookings', authenticate, async (req, res) => {
    const client = await pool.connect();
    try {
        const { showtimeId, seats: seatIds } = req.body;

        // Lock session seats
        const { rows: lockedSeats } = await client.query(
            `SELECT ss.id, ss.status FROM session_seats ss
             WHERE ss.session_id = $1 AND ss.seat_id = ANY($2::bigint[])
             FOR UPDATE`,
            [parseInt(showtimeId), seatIds.map(id => parseInt(id))]
        );

        const soldSeats = lockedSeats.filter(s => s.status !== 'available');
        if (soldSeats.length > 0) {
            return res.status(409).json({ error: 'Некоторые места уже заняты' });
        }

        // Get seat info for pricing
        const { rows: seatInfo } = await client.query(
            `SELECT s.id, s.price_multiplier FROM seats s WHERE s.id = ANY($1::bigint[])`,
            [seatIds.map(id => parseInt(id))]
        );
        const { rows: sessionInfo } = await client.query(
            'SELECT base_price FROM sessions WHERE id = $1', [parseInt(showtimeId)]
        );
        const basePrice = parseFloat(sessionInfo[0].base_price);

        const totalPrice = seatInfo.reduce((sum, s) => sum + basePrice * parseFloat(s.price_multiplier), 0);

        // Create booking
        const { rows: bookingRows } = await client.query(
            `INSERT INTO bookings (user_id, session_id, status, total_price)
             VALUES ($1, $2, 'confirmed', $3) RETURNING id`,
            [req.userId, parseInt(showtimeId), totalPrice]
        );
        const bookingId = bookingRows[0].id;

        // Create booking items
        for (const seat of seatInfo) {
            await client.query(
                'INSERT INTO booking_items (booking_id, seat_id, price) VALUES ($1, $2, $3)',
                [bookingId, seat.id, basePrice * parseFloat(seat.price_multiplier)]
            );
        }

        // Update seat statuses
        await client.query(
            `UPDATE session_seats SET status = 'sold'
             WHERE session_id = $1 AND seat_id = ANY($2::bigint[])`,
            [parseInt(showtimeId), seatIds.map(id => parseInt(id))]
        );

        // Return booking
        const { rows: result } = await client.query(
            `SELECT b.id, b.user_id, b.session_id, b.status, b.total_price, b.created_at
             FROM bookings b WHERE b.id = $1`,
            [bookingId]
        );
        const b = result[0];
        res.status(201).json({ data: {
            _id: String(b.id),
            userId: String(b.user_id),
            showtimeId: String(b.session_id),
            seatNumbers: seatInfo.map(s => s.id),
            totalPrice: parseFloat(b.total_price),
            bookingDate: b.created_at.toISOString(),
            status: b.status,
        }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        client.release();
    }
});

app.delete('/api/bookings/:id', authenticate, async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
            [req.params.id, req.userId]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Бронирование не найдено' });

        const booking = rows[0];
        await pool.query(
            `UPDATE session_seats ss SET status = 'available'
             FROM booking_items bi
             WHERE bi.booking_id = $1 AND ss.seat_id = bi.seat_id AND ss.session_id = $2`,
            [booking.id, booking.session_id]
        );
        await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [booking.id]);

        res.json({ data: { _id: String(booking.id), status: 'cancelled' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ─── Start ───────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`🚀 CineSelect API running on http://localhost:${PORT}`);
});
