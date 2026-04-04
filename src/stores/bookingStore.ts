import { create } from 'zustand';

interface BookingState {
    selectedSeats: string[];
    toggleSeat: (seatId: string) => void;
    clearSelection: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    selectedSeats: [],
    toggleSeat: (seatId: string) =>
        set((state) => ({
            selectedSeats: state.selectedSeats.includes(seatId)
                ? state.selectedSeats.filter((id) => id !== seatId)
                : [...state.selectedSeats, seatId],
        })),
    clearSelection: () => set({ selectedSeats: [] }),
}));
