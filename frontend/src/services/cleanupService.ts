import { Showtime, Seat } from '../types';

const SHOWTIMES_STORAGE_KEY = 'cineselect_showtimes';
const SEATS_STORAGE_KEY = 'cineselect_seats';

const safeParse = <T,>(stored: string | null, fallback: T): T => {
    if (!stored) return fallback;
    try {
        return JSON.parse(stored) as T;
    } catch {
        console.error('Failed to parse localStorage data');
        return fallback;
    }
};

export const cleanupOldShowtimes = (): void => {
    const allShowtimes: Showtime[] = safeParse(localStorage.getItem(SHOWTIMES_STORAGE_KEY), []);
    if (allShowtimes.length === 0) return;

    const now = new Date();

    const validShowtimes = allShowtimes.filter(showtime => {
        const showtimeDate = new Date(showtime.dateTime);
        return showtimeDate > now;
    });

    localStorage.setItem(SHOWTIMES_STORAGE_KEY, JSON.stringify(validShowtimes));

    const allSeats: Record<string, Seat[]> = safeParse(localStorage.getItem(SEATS_STORAGE_KEY), {});
    const validShowtimeIds = new Set(validShowtimes.map(s => s._id));

    const validSeats: Record<string, Seat[]> = {};
    Object.keys(allSeats).forEach(showtimeId => {
        if (validShowtimeIds.has(showtimeId)) {
            validSeats[showtimeId] = allSeats[showtimeId];
        }
    });

    localStorage.setItem(SEATS_STORAGE_KEY, JSON.stringify(validSeats));
};
