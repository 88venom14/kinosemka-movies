// Типы

export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: string;
}

export interface Movie {
    _id: string;
    title: string;
    description: string;
    releaseDate: string;
    duration: number;
    posterUrl: string;
    backdropUrl: string;
    rating: number;
    genre: string[];
    director: string;
    cast: string[];
}

export interface Showtime {
    _id: string;
    movieId: string;
    dateTime: string;
    screenNumber: number;
    totalSeats: number;
    availableSeats: number;
    ticketPrice: number;
}

export interface Seat {
    _id: string;
    showtimeId: string;
    row: string;
    number: number;
    type: 'regular' | 'vip';
    status: 'available' | 'occupied' | 'reserved';
    priceMultiplier: number;
}

export interface Booking {
    _id: string;
    userId: string;
    showtimeId: string;
    seatNumbers: string[];
    totalPrice: number;
    bookingDate: string;
    status: 'confirmed' | 'cancelled' | 'completed';
    showtime?: Showtime;
    movieTitle?: string;
}
