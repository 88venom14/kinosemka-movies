'use client';
import React from 'react';
import { Booking, User } from '@/types';
import BookingHistory from './BookingHistory';

interface DashboardProps {
    user: User & { _id: string };
    bookings: Booking[];
    onViewTicket: (booking: Booking) => void;
    onCancelBooking?: (id: string) => void;
}

export default function Dashboard({ user, bookings, onViewTicket, onCancelBooking }: DashboardProps) {
    const activeBookings = bookings.filter((b) => b.status === 'confirmed');
    const pastBookings = bookings.filter((b) => b.status !== 'confirmed');

    return (
        <div className="space-y-8">
            <div className="dashboard-card">
                <h2 className="dashboard-card__title">Аккаунт</h2>
                <div className="dashboard-card__info-grid">
                    <div>
                        <p className="dashboard-card__info-label">Имя</p>
                        <p className="dashboard-card__info-value">{user.name}</p>
                    </div>
                    <div>
                        <p className="dashboard-card__info-label">Email</p>
                        <p className="dashboard-card__info-value">{user.email}</p>
                    </div>
                    <div>
                        <p className="dashboard-card__info-label">Дата регистрации</p>
                        <p className="dashboard-card__info-value">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                </div>
            </div>

            {activeBookings.length > 0 && (
                <div>
                    <h3 className="dashboard-section__title">Активные бронирования</h3>
                    <BookingHistory bookings={activeBookings} onViewTicket={onViewTicket} onCancelBooking={onCancelBooking} />
                </div>
            )}

            {pastBookings.length > 0 && (
                <div>
                    <h3 className="dashboard-section__title">История</h3>
                    <BookingHistory bookings={pastBookings} onViewTicket={onViewTicket} />
                </div>
            )}
        </div>
    );
}
