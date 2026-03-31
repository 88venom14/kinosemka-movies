import { Showtime } from '../types';

const SHOWTIMES_STORAGE_KEY = 'cineselect_showtimes';

export const generateShowtimes = (movieId: string): Showtime[] => {
    const showtimes: Showtime[] = [];
    const today = new Date();

    for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);
        date.setHours(0, 0, 0, 0);

        const times = [
            { time: '10:00', price: 350 },
            { time: '13:00', price: 350 },
            { time: '16:00', price: 400 },
            { time: '19:00', price: 450 },
            { time: '21:30', price: 500 },
        ];

        times.forEach((slot, index) => {
            const [hours, minutes] = slot.time.split(':').map(Number);
            date.setHours(hours, minutes, 0, 0);

            showtimes.push({
                _id: `${movieId}-${day}-${index}`,
                movieId,
                dateTime: date.toISOString(),
                screenNumber: (index % 6) + 1,
                totalSeats: 96,
                availableSeats: 96,
                ticketPrice: slot.price,
            });
        });
    }

    return showtimes;
};

export const getShowtimesForMovie = (movieId: string): Showtime[] => {
    const stored = localStorage.getItem(SHOWTIMES_STORAGE_KEY);
    const allShowtimes: Showtime[] = stored ? JSON.parse(stored) : [];

    const movieShowtimes = allShowtimes.filter(s => s.movieId === movieId);

    if (movieShowtimes.length === 0) {
        const newShowtimes = generateShowtimes(movieId);
        allShowtimes.push(...newShowtimes);
        localStorage.setItem(SHOWTIMES_STORAGE_KEY, JSON.stringify(allShowtimes));
        return newShowtimes;
    }

    return movieShowtimes;
};

export const getShowtimeById = (showtimeId: string): Showtime | null => {
    const stored = localStorage.getItem(SHOWTIMES_STORAGE_KEY);
    const allShowtimes: Showtime[] = stored ? JSON.parse(stored) : [];
    return allShowtimes.find(s => s._id === showtimeId) || null;
};

export const updateShowtimeAvailableSeats = (showtimeId: string, availableSeats: number): void => {
    const stored = localStorage.getItem(SHOWTIMES_STORAGE_KEY);
    const allShowtimes: Showtime[] = stored ? JSON.parse(stored) : [];

    const updated = allShowtimes.map(s => {
        if (s._id === showtimeId) {
            return { ...s, availableSeats };
        }
        return s;
    });

    localStorage.setItem(SHOWTIMES_STORAGE_KEY, JSON.stringify(updated));
};
