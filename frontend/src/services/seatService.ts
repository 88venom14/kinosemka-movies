import { Seat } from '../types';

const SEATS_STORAGE_KEY = 'cineselect_seats';

export const generateSeats = (showtimeId: string): Seat[] => {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    for (const row of rows) {
        const isVip = row === 'G' || row === 'H';

        for (let num = 1; num <= seatsPerRow; num++) {
            const isOccupied = Math.random() < 0.15;

            seats.push({
                _id: `${showtimeId}-${row}-${num}`,
                showtimeId,
                row,
                number: num,
                type: isVip ? 'vip' : 'regular',
                status: isOccupied ? 'occupied' : 'available',
                priceMultiplier: isVip ? 1.5 : 1,
            });
        }
    }

    return seats;
};

export const getSeatsForShowtime = (showtimeId: string): Seat[] => {
    const stored = localStorage.getItem(SEATS_STORAGE_KEY);
    const allSeats: Record<string, Seat[]> = stored ? JSON.parse(stored) : {};

    if (!allSeats[showtimeId] || allSeats[showtimeId].length === 0) {
        const newSeats = generateSeats(showtimeId);
        allSeats[showtimeId] = newSeats;
        localStorage.setItem(SEATS_STORAGE_KEY, JSON.stringify(allSeats));
        return newSeats;
    }

    return allSeats[showtimeId];
};

export const updateSeatStatus = (
    showtimeId: string,
    seatIds: string[],
    status: 'available' | 'occupied' | 'reserved'
): void => {
    const stored = localStorage.getItem(SEATS_STORAGE_KEY);
    const allSeats: Record<string, Seat[]> = stored ? JSON.parse(stored) : {};

    if (!allSeats[showtimeId]) return;

    allSeats[showtimeId] = allSeats[showtimeId].map(seat => {
        if (seatIds.includes(seat._id)) {
            return { ...seat, status };
        }
        return seat;
    });

    localStorage.setItem(SEATS_STORAGE_KEY, JSON.stringify(allSeats));
};

export const getSeatById = (showtimeId: string, seatId: string): Seat | null => {
    const stored = localStorage.getItem(SEATS_STORAGE_KEY);
    const allSeats: Record<string, Seat[]> = stored ? JSON.parse(stored) : {};

    if (!allSeats[showtimeId]) return null;
    return allSeats[showtimeId].find(s => s._id === seatId) || null;
};
