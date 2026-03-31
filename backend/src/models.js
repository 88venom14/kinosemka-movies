import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('moviesdatabase', 'postgres', 'admin', {
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false,
});

export const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'users', timestamps: false });

export const Movie = sequelize.define('Movie', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    poster_url: { type: DataTypes.TEXT },
    backdrop_url: { type: DataTypes.TEXT },
    rating: { type: DataTypes.DECIMAL(3, 1) },
    release_date: { type: DataTypes.DATEONLY },
    director: { type: DataTypes.STRING(255) },
    cast: { type: DataTypes.ARRAY(DataTypes.TEXT) },
    genres: { type: DataTypes.ARRAY(DataTypes.TEXT) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'movies', timestamps: false });

export const Hall = sequelize.define('Hall', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    total_rows: { type: DataTypes.INTEGER, allowNull: false },
    seats_per_row: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'halls', timestamps: false });

export const Seat = sequelize.define('Seat', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    hall_id: { type: DataTypes.BIGINT, allowNull: false },
    row_letter: { type: DataTypes.CHAR(1), allowNull: false },
    seat_number: { type: DataTypes.INTEGER, allowNull: false },
    seat_type: { type: DataTypes.ENUM('standard', 'vip', 'wheelchair'), defaultValue: 'standard' },
    price_multiplier: { type: DataTypes.DECIMAL(4, 2), defaultValue: 1.00 },
}, { tableName: 'seats', timestamps: false });

export const Session = sequelize.define('Session', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    movie_id: { type: DataTypes.BIGINT, allowNull: false },
    hall_id: { type: DataTypes.BIGINT, allowNull: false },
    start_time: { type: DataTypes.DATE, allowNull: false },
    base_price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'sessions', timestamps: false });

export const SessionSeat = sequelize.define('SessionSeat', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    session_id: { type: DataTypes.BIGINT, allowNull: false },
    seat_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.ENUM('available', 'reserved', 'sold'), defaultValue: 'available' },
    reserved_until: { type: DataTypes.DATE },
}, { tableName: 'session_seats', timestamps: false });

export const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    session_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'bookings', timestamps: false });

export const BookingItem = sequelize.define('BookingItem', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.BIGINT, allowNull: false },
    seat_id: { type: DataTypes.BIGINT, allowNull: false },
    price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
}, { tableName: 'booking_items', timestamps: false });

Movie.hasMany(Session, { foreignKey: 'movie_id' });
Session.belongsTo(Movie, { foreignKey: 'movie_id' });

Hall.hasMany(Session, { foreignKey: 'hall_id' });
Session.belongsTo(Hall, { foreignKey: 'hall_id' });

Hall.hasMany(Seat, { foreignKey: 'hall_id' });
Seat.belongsTo(Hall, { foreignKey: 'hall_id' });

Session.hasMany(SessionSeat, { foreignKey: 'session_id' });
SessionSeat.belongsTo(Session, { foreignKey: 'session_id' });

Seat.hasMany(SessionSeat, { foreignKey: 'seat_id' });
SessionSeat.belongsTo(Seat, { foreignKey: 'seat_id' });

User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Session.hasMany(Booking, { foreignKey: 'session_id' });
Booking.belongsTo(Session, { foreignKey: 'session_id' });

Booking.hasMany(BookingItem, { foreignKey: 'booking_id' });
BookingItem.belongsTo(Booking, { foreignKey: 'booking_id' });

Seat.hasMany(BookingItem, { foreignKey: 'seat_id' });
BookingItem.belongsTo(Seat, { foreignKey: 'seat_id' });

export default sequelize;
