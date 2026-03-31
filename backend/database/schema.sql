-- ============================================================================
-- CineSelect — PostgreSQL Database Schema
-- ============================================================================

-- ============================================================================
-- ENUM Types
-- ============================================================================

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE seat_type AS ENUM ('standard', 'vip', 'wheelchair');
CREATE TYPE seat_status AS ENUM ('available', 'reserved', 'sold');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- ============================================================================
-- Users
-- ============================================================================

CREATE TABLE users (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR(100)        NOT NULL,
    email           VARCHAR(255)        NOT NULL UNIQUE,
    password_hash   VARCHAR(255)        NOT NULL,
    role            user_role           NOT NULL DEFAULT 'user',
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);

-- ============================================================================
-- Movies
-- ============================================================================

CREATE TABLE movies (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR(255)        NOT NULL,
    description     TEXT,
    duration        INT                 NOT NULL CHECK (duration > 0),
    poster_url      TEXT,
    backdrop_url    TEXT,
    rating          NUMERIC(3, 1)       CHECK (rating >= 0 AND rating <= 10),
    release_date    DATE,
    director        VARCHAR(255),
    "cast"          TEXT[],             -- array of actor names
    genres          TEXT[],             -- array of genre names
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movies_release_date ON movies (release_date);
CREATE INDEX idx_movies_rating ON movies (rating DESC);
CREATE INDEX idx_movies_genres ON movies USING GIN (genres);

-- ============================================================================
-- Halls
-- ============================================================================

CREATE TABLE halls (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR(100)        NOT NULL,
    total_rows      INT                 NOT NULL CHECK (total_rows > 0),
    seats_per_row   INT                 NOT NULL CHECK (seats_per_row > 0),
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Seats
-- ============================================================================

CREATE TABLE seats (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hall_id         BIGINT              NOT NULL REFERENCES halls (id) ON DELETE CASCADE,
    row_letter      CHAR(1)             NOT NULL,
    seat_number     INT                 NOT NULL,
    seat_type       seat_type           NOT NULL DEFAULT 'standard',
    price_multiplier NUMERIC(4, 2)      NOT NULL DEFAULT 1.00,
    UNIQUE (hall_id, row_letter, seat_number)
);

CREATE INDEX idx_seats_hall_id ON seats (hall_id);

-- ============================================================================
-- Sessions
-- ============================================================================

CREATE TABLE sessions (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    movie_id        BIGINT              NOT NULL REFERENCES movies (id) ON DELETE CASCADE,
    hall_id         BIGINT              NOT NULL REFERENCES halls (id) ON DELETE RESTRICT,
    start_time      TIMESTAMPTZ         NOT NULL,
    base_price      NUMERIC(8, 2)       NOT NULL CHECK (base_price >= 0),
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CHECK (start_time > NOW())
);

CREATE INDEX idx_sessions_movie_id ON sessions (movie_id);
CREATE INDEX idx_sessions_hall_id ON sessions (hall_id);
CREATE INDEX idx_sessions_start_time ON sessions (start_time);
CREATE INDEX idx_sessions_movie_time ON sessions (movie_id, start_time);

-- ============================================================================
-- Session Seats (real-time availability)
-- ============================================================================

CREATE TABLE session_seats (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id      BIGINT              NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
    seat_id         BIGINT              NOT NULL REFERENCES seats (id) ON DELETE CASCADE,
    status          seat_status         NOT NULL DEFAULT 'available',
    reserved_until  TIMESTAMPTZ,
    UNIQUE (session_id, seat_id)
);

CREATE INDEX idx_session_seats_session_id ON session_seats (session_id);
CREATE INDEX idx_session_seats_status ON session_seats (session_id, status);
CREATE INDEX idx_session_seats_reserved_until ON session_seats (reserved_until)
    WHERE reserved_until IS NOT NULL;

-- ============================================================================
-- Bookings
-- ============================================================================

CREATE TABLE bookings (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         BIGINT              NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    session_id      BIGINT              NOT NULL REFERENCES sessions (id) ON DELETE RESTRICT,
    status          booking_status      NOT NULL DEFAULT 'pending',
    total_price     NUMERIC(10, 2)      NOT NULL CHECK (total_price >= 0),
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_session_id ON bookings (session_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_user_status ON bookings (user_id, status);

-- ============================================================================
-- Booking Items
-- ============================================================================

CREATE TABLE booking_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id      BIGINT              NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
    seat_id         BIGINT              NOT NULL REFERENCES seats (id) ON DELETE RESTRICT,
    price           NUMERIC(8, 2)       NOT NULL CHECK (price >= 0)
);

CREATE INDEX idx_booking_items_booking_id ON booking_items (booking_id);
CREATE INDEX idx_booking_items_seat_id ON booking_items (seat_id);

-- ============================================================================
-- Auto-update updated_at trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_movies_updated_at
    BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Example Queries
-- ============================================================================

-- 1. Browse sessions for a specific movie (next 7 days)
-- SELECT s.id, s.start_time, h.name AS hall_name, s.base_price,
--        COUNT(ss.id) FILTER (WHERE ss.status = 'available') AS available_seats
-- FROM sessions s
-- JOIN halls h ON s.hall_id = h.id
-- LEFT JOIN session_seats ss ON s.id = ss.session_id
-- WHERE s.movie_id = 1
--   AND s.start_time BETWEEN NOW() AND NOW() + INTERVAL '7 days'
-- GROUP BY s.id, h.name
-- ORDER BY s.start_time;

-- 2. Check available seats for a session
-- SELECT ss.id, s.row_letter, s.seat_number, s.seat_type, s.price_multiplier,
--        ss.status, ses.base_price * s.price_multiplier AS final_price
-- FROM session_seats ss
-- JOIN seats s ON ss.seat_id = s.id
-- JOIN sessions ses ON ss.session_id = ses.id
-- WHERE ss.session_id = 1
--   AND ss.status = 'available'
-- ORDER BY s.row_letter, s.seat_number;

-- 3. Create a booking (within a transaction to prevent overbooking)
-- BEGIN;
--
-- -- Lock session seats to prevent concurrent modifications
-- SELECT id FROM session_seats
-- WHERE session_id = 1 AND seat_id IN (10, 11, 12) AND status = 'available'
-- FOR UPDATE;
--
-- -- Insert booking
-- INSERT INTO bookings (user_id, session_id, status, total_price)
-- VALUES (1, 1, 'confirmed', 1350.00)
-- RETURNING id;
--
-- -- Insert booking items
-- INSERT INTO booking_items (booking_id, seat_id, price)
-- VALUES (1, 10, 450.00), (1, 11, 450.00), (1, 12, 450.00);
--
-- -- Update seat statuses
-- UPDATE session_seats
-- SET status = 'sold'
-- WHERE session_id = 1 AND seat_id IN (10, 11, 12);
--
-- COMMIT;

-- ============================================================================
-- Design Notes
-- ============================================================================
--
-- 1. session_seats is a separate table from seats because seat availability
--    is per-session, not global. A physical seat exists once per hall, but
--    its availability changes for every screening.
--
-- 2. Overbooking prevention: booking creation uses SELECT ... FOR UPDATE
--    within a transaction to lock the relevant session_seats rows. This
--    ensures two concurrent bookings cannot claim the same seat.
--
-- 3. reserved_until: seats can be temporarily reserved during the checkout
--    flow. A background job clears reservations older than 15 minutes.
--
-- 4. booking_items stores the final price per seat at the time of purchase,
--    so historical bookings are unaffected by future price changes.
--
-- 5. CHECK (start_time > NOW()) on sessions prevents creating sessions in
--    the past. This constraint should be disabled for historical data imports.
--
-- 6. GIN index on movies.genres enables efficient filtering with
--    WHERE 'фантастика' = ANY(genres) or WHERE genres @> ARRAY['фантастика'].
