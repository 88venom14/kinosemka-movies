CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE seat_type AS ENUM ('standard', 'vip', 'wheelchair');
CREATE TYPE seat_status AS ENUM ('available', 'reserved', 'sold');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

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
    "cast"          TEXT[],
    genres          TEXT[],
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movies_release_date ON movies (release_date);
CREATE INDEX idx_movies_rating ON movies (rating DESC);
CREATE INDEX idx_movies_genres ON movies USING GIN (genres);

CREATE TABLE halls (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR(100)        NOT NULL,
    total_rows      INT                 NOT NULL CHECK (total_rows > 0),
    seats_per_row   INT                 NOT NULL CHECK (seats_per_row > 0),
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

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

CREATE TABLE booking_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id      BIGINT              NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
    seat_id         BIGINT              NOT NULL REFERENCES seats (id) ON DELETE RESTRICT,
    price           NUMERIC(8, 2)       NOT NULL CHECK (price >= 0)
);

CREATE INDEX idx_booking_items_booking_id ON booking_items (booking_id);
CREATE INDEX idx_booking_items_seat_id ON booking_items (seat_id);

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
