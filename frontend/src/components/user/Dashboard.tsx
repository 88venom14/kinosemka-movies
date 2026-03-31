import React from 'react';
import { User, Booking } from '../../types';
import { BookingHistory } from './BookingHistory';

interface DashboardProps {
  user: User;
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onCancelBooking?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  bookings,
  onViewTicket,
  onCancelBooking,
}) => {
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status !== 'confirmed');

  return (
    <div className="space-y-8">
      <div className="border border-cs-border p-6 bg-cs-dark">
        <h2 className="text-xl text-white mb-4">Аккаунт</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-cs-text-secondary mb-1">Имя</p>
            <p className="text-white">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-cs-text-secondary mb-1">Email</p>
            <p className="text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-cs-text-secondary mb-1">Дата регистрации</p>
            <p className="text-white">
              {new Date(user.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>

      {activeBookings.length > 0 && (
        <div>
          <h3 className="text-lg text-white mb-4">Активные бронирования</h3>
          <BookingHistory
            bookings={activeBookings}
            onViewTicket={onViewTicket}
            onCancelBooking={onCancelBooking}
          />
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h3 className="text-lg text-white mb-4">История</h3>
          <BookingHistory
            bookings={pastBookings}
            onViewTicket={onViewTicket}
          />
        </div>
      )}
    </div>
  );
};
