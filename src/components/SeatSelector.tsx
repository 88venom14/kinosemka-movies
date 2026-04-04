'use client';
import React from 'react';
import { Seat } from '@/types';

interface SeatSelectorProps {
    seats: Seat[];
    selectedSeats: string[];
    onSeatSelect: (seatId: string) => void;
}

export default function SeatSelector({ seats, selectedSeats, onSeatSelect }: SeatSelectorProps) {
    const seatsByRow = seats.reduce((acc: Record<string, Seat[]>, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const sortedRows = Object.keys(seatsByRow).sort();
    const allSeatNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="seat-selector">
            <div className="seat-selector__screen-label">
                <p className="seat-selector__screen-text">Экран</p>
                <div className="seat-selector__screen-line" />
            </div>
            <div className="seat-selector__rows-wrapper">
                <div className="seat-selector__rows">
                    {sortedRows.map((row) => {
                        const rowSeats = seatsByRow[row] || [];
                        return (
                            <div key={row} className="seat-selector__row">
                                <div className="seat-selector__row-label">{row}</div>
                                <div className="seat-selector__seats">
                                    {allSeatNumbers.map((seatNum) => {
                                        const seat = rowSeats.find((s) => s.number === seatNum);
                                        if (!seat) return <div key={`empty-${row}-${seatNum}`} className="seat-selector__seat-placeholder" />;
                                        const selected = selectedSeats.includes(seat._id);
                                        const occupied = seat.status === 'occupied';
                                        const isVip = seat.type === 'vip';
                                        return (
                                            <button
                                                key={seat._id}
                                                onClick={() => !occupied && onSeatSelect(seat._id)}
                                                disabled={occupied}
                                                className={`seat-selector__seat ${
                                                    occupied ? 'seat-selector__seat--occupied'
                                                        : selected ? 'seat-selector__seat--selected'
                                                        : isVip ? 'seat-selector__seat--vip'
                                                        : 'seat-selector__seat--standard'
                                                }`}
                                            >
                                                {seat.number}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    <div className="seat-selector__column-labels">
                        {allSeatNumbers.map((num) => (
                            <span key={num} className="seat-selector__column-label">{num}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
