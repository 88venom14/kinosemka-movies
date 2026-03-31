import React from 'react';
import { Booking } from '../../types';

interface BookingHistoryProps {
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onCancelBooking?: (id: string) => void;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  bookings,
  onViewTicket,
  onCancelBooking,
}) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cs-text-secondary">У вас пока нет бронирований</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="border border-cs-border p-4 bg-cs-dark"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-medium">
                {booking.movieTitle || 'Фильм'}
              </h3>
              <p className="text-sm text-cs-text-secondary">
                {booking.showtime
                  ? new Date(booking.showtime.dateTime).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : new Date(booking.bookingDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 text-xs ${
                  booking.status === 'confirmed'
                    ? 'bg-white text-black'
                    : booking.status === 'cancelled'
                    ? 'bg-cs-border text-cs-text-secondary'
                    : 'bg-cs-dark text-white border border-cs-border'
                }`}
              >
                {booking.status === 'confirmed'
                  ? 'Подтверждено'
                  : booking.status === 'cancelled'
                  ? 'Отменено'
                  : 'Завершено'}
              </span>
              <p className="text-white font-medium mt-2">{booking.totalPrice} ₽</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-cs-text-secondary mb-4">
            <span>Места: {booking.seatNumbers.join(', ')}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewTicket(booking)}
              className="px-4 py-2 text-sm bg-white text-black hover:bg-gray-200 transition-colors"
            >
              Показать билет
            </button>
            {onCancelBooking && booking.status === 'confirmed' && (
              <button
                onClick={() => onCancelBooking(booking._id)}
                className="px-4 py-2 text-sm border border-cs-border text-cs-text-secondary hover:border-white hover:text-white transition-colors"
              >
                Отменить
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
