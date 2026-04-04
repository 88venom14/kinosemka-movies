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
    type: string;
    status: string;
    priceMultiplier: number;
}

export interface User {
    name: string;
    email: string;
    createdAt: string;
}

export interface Booking {
    _id: string;
    userId: string;
    showtimeId: string;
    seatNumbers: string[];
    totalPrice: number;
    bookingDate: string;
    status: string;
    movieTitle?: string;
    showtime?: { _id: string; dateTime: string; screenNumber: number; ticketPrice: number };
}
