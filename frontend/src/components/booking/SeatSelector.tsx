import React from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../../types';

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({
  seats,
  selectedSeats,
  onSeatSelect,
}) => {
  const seatsByRow = seats.reduce((acc: Record<string, Seat[]>, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(seatsByRow).sort();

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    onSeatSelect(seat._id);
  };

  const isSelected = (seatId: string) => selectedSeats.includes(seatId);

  const allSeatNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-8 text-center">
        <p className="text-xs text-cs-text-secondary uppercase tracking-widest mb-2">Экран</p>
        <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-cs-accent to-transparent mx-auto" />
      </div>

      <div className="flex justify-center overflow-x-auto pb-4">
        <div className="inline-block min-w-fit">
          {sortedRows.map((row) => {
            const rowSeats = seatsByRow[row] || [];

            return (
              <div key={row} className="flex items-center mb-1 md:mb-2 gap-1 md:gap-2">
                <div className="w-4 md:w-6 text-center text-cs-text-secondary text-xs font-medium flex-shrink-0">
                  {row}
                </div>
                <div className="flex gap-0.5 md:gap-1">
                  {allSeatNumbers.map((seatNum) => {
                    const seat = rowSeats.find(s => s.number === seatNum);

                    if (!seat) {
                      return (
                        <div
                          key={`empty-${row}-${seatNum}`}
                          className="w-6 h-6 md:w-8 md:h-8"
                        />
                      );
                    }

                    const selected = isSelected(seat._id);
                    const occupied = seat.status === 'occupied';
                    const isVip = seat.type === 'vip';

                    return (
                      <motion.button
                        key={seat._id}
                        whileHover={occupied ? {} : { scale: 1.1 }}
                        whileTap={occupied ? {} : { scale: 0.95 }}
                        onClick={() => handleSeatClick(seat)}
                        disabled={occupied}
                        className={`
                          w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs rounded
                          transition-all duration-200
                          ${occupied
                            ? 'bg-cs-border opacity-30 cursor-not-allowed'
                            : selected
                              ? 'bg-white text-black font-semibold border border-white'
                              : isVip
                                ? 'border border-cs-vip text-cs-vip hover:border-white hover:text-white'
                                : 'border border-cs-border text-cs-text-secondary hover:border-white hover:text-white'
                          }
                        `}
                        aria-label={`Ряд ${seat.row}, место ${seat.number}, ${isVip ? 'VIP' : 'стандарт'}, ${occupied ? 'занято' : selected ? 'выбрано' : 'свободно'}`}
                      >
                        {seat.number}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex gap-0.5 md:gap-1 mt-2" style={{ marginLeft: '1.5rem' }}>
            {allSeatNumbers.map((num) => (
              <span
                key={num}
                className="w-6 md:w-8 text-center text-cs-text-secondary text-xs flex-shrink-0"
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
