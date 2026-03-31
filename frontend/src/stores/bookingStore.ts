import { create } from 'zustand';
import { Movie, Showtime } from '../types';

interface BookingState {
    selectedMovie: Movie | null;
    selectedShowtime: Showtime | null;
    selectedSeats: string[];
    step: number;

    setMovie: (movie: Movie) => void;
    setShowtime: (showtime: Showtime) => void;
    toggleSeat: (seatId: string) => void;
    clearSelection: () => void;
    nextStep: () => void;
    prevStep: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    selectedMovie: null,
    selectedShowtime: null,
    selectedSeats: [],
    step: 1,

    setMovie: (movie) => set({ selectedMovie: movie }),

    setShowtime: (showtime) => set({ selectedShowtime: showtime }),

    toggleSeat: (seatId: string) => {
        const { selectedSeats } = get();
        if (selectedSeats.includes(seatId)) {
            set({ selectedSeats: selectedSeats.filter((id) => id !== seatId) });
        } else {
            set({ selectedSeats: [...selectedSeats, seatId] });
        }
    },

    clearSelection: () => set({
        selectedMovie: null,
        selectedShowtime: null,
        selectedSeats: [],
        step: 1,
    }),

    nextStep: () => set((state) => ({ step: state.step + 1 })),

    prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
}));
