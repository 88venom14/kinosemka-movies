'use client';
import React from 'react';
import { Booking } from '@/types';

interface BookingHistoryProps {
    bookings: Booking[];
    onViewTicket: (booking: Booking) => void;
    onCancelBooking?: (id: string) => void;
}

export default function BookingHistory({ bookings, onViewTicket, onCancelBooking }: BookingHistoryProps) {
    if (bookings.length === 0) {
        return <div className="booking-history__empty"><p>У вас пока нет бронирований</p></div>;
    }

    return (
        <div className="booking-history">
            {bookings.map((booking) => (
                <div key={booking._id} className="booking-history__item">
                    <div className="booking-history__item-header">
                        <div>
                            <h3 className="booking-history__item-title">{booking.movieTitle || 'Фильм'}</h3>
                            <p className="booking-history__item-date">
                                {booking.showtime
                                    ? new Date(booking.showtime.dateTime).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
                                    : new Date(booking.bookingDate).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                        <div className="booking-history__item-right">
                            <span className={`booking-history__status ${
                                booking.status === 'confirmed' ? 'booking-history__status--confirmed'
                                    : booking.status === 'cancelled' ? 'booking-history__status--cancelled'
                                    : 'booking-history__status--other'
                            }`}>
                                {booking.status === 'confirmed' ? 'Подтверждено' : booking.status === 'cancelled' ? 'Отменено' : 'Завершено'}
                            </span>
                            <p className="booking-history__price">{booking.totalPrice} ₽</p>
                        </div>
                    </div>
                    <div className="booking-history__seats">
                        <span>Места: {booking.seatNumbers.join(', ')}</span>
                    </div>
                    <div className="booking-history__actions">
                        <button onClick={() => onViewTicket(booking)} className="booking-history__btn booking-history__btn--primary">Показать билет</button>
                        {onCancelBooking && booking.status === 'confirmed' && (
                            <button onClick={() => onCancelBooking(booking._id)} className="booking-history__btn booking-history__btn--outline">Отменить</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
