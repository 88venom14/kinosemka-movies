PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT                NOT NULL,
    email           TEXT                NOT NULL UNIQUE,
    password_hash   TEXT                NOT NULL,
    role            TEXT                NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at      DATETIME            NOT NULL DEFAULT (datetime('now')),
    updated_at      DATETIME            NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS movies (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT                NOT NULL,
    description     TEXT,
    duration        INTEGER             NOT NULL CHECK (duration > 0),
    poster_url      TEXT,
    backdrop_url    TEXT,
    rating          REAL                CHECK (rating >= 0 AND rating <= 10),
    release_date    DATE,
    director        TEXT,
    cast            TEXT,
    genres          TEXT,
    created_at      DATETIME            NOT NULL DEFAULT (datetime('now')),
    updated_at      DATETIME            NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies (release_date);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies (rating DESC);

CREATE TABLE IF NOT EXISTS halls (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT                NOT NULL,
    total_rows      INTEGER             NOT NULL CHECK (total_rows > 0),
    seats_per_row   INTEGER             NOT NULL CHECK (seats_per_row > 0),
    created_at      DATETIME            NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS seats (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    hall_id         INTEGER             NOT NULL REFERENCES halls (id) ON DELETE CASCADE,
    row_letter      TEXT                NOT NULL,
    seat_number     INTEGER             NOT NULL,
    seat_type       TEXT                NOT NULL DEFAULT 'standard' CHECK (seat_type IN ('standard', 'vip', 'wheelchair')),
    price_multiplier REAL               NOT NULL DEFAULT 1.00,
    UNIQUE (hall_id, row_letter, seat_number)
);

CREATE INDEX IF NOT EXISTS idx_seats_hall_id ON seats (hall_id);

CREATE TABLE IF NOT EXISTS sessions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id        INTEGER             NOT NULL REFERENCES movies (id) ON DELETE CASCADE,
    hall_id         INTEGER             NOT NULL REFERENCES halls (id) ON DELETE RESTRICT,
    start_time      DATETIME            NOT NULL,
    base_price      REAL                NOT NULL CHECK (base_price >= 0),
    created_at      DATETIME            NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_movie_id ON sessions (movie_id);
CREATE INDEX IF NOT EXISTS idx_sessions_hall_id ON sessions (hall_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions (start_time);

CREATE TABLE IF NOT EXISTS session_seats (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id      INTEGER             NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
    seat_id         INTEGER             NOT NULL REFERENCES seats (id) ON DELETE CASCADE,
    status          TEXT                NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    reserved_until  DATETIME,
    UNIQUE (session_id, seat_id)
);

CREATE INDEX IF NOT EXISTS idx_session_seats_session_id ON session_seats (session_id);
CREATE INDEX IF NOT EXISTS idx_session_seats_status ON session_seats (session_id, status);

CREATE TABLE IF NOT EXISTS bookings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER             NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    session_id      INTEGER             NOT NULL REFERENCES sessions (id) ON DELETE RESTRICT,
    status          TEXT                NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    total_price     REAL                NOT NULL CHECK (total_price >= 0),
    created_at      DATETIME            NOT NULL DEFAULT (datetime('now')),
    updated_at      DATETIME            NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON bookings (session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

CREATE TABLE IF NOT EXISTS booking_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id      INTEGER             NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
    seat_id         INTEGER             NOT NULL REFERENCES seats (id) ON DELETE RESTRICT,
    price           REAL                NOT NULL CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items (booking_id);

CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
    AFTER UPDATE ON users
    FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_movies_updated_at
    AFTER UPDATE ON movies
    FOR EACH ROW
BEGIN
    UPDATE movies SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_bookings_updated_at
    AFTER UPDATE ON bookings
    FOR EACH ROW
BEGIN
    UPDATE bookings SET updated_at = datetime('now') WHERE id = NEW.id;
END;
