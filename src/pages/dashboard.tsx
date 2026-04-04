'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/authStore';
import Dashboard from '@/components/Dashboard';
import DigitalTicket from '@/components/DigitalTicket';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Booking } from '@/types';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
        if (isAuthenticated && user) fetchBookings();
    }, [isAuthenticated, authLoading, router, user]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
            const json = await res.json();
            setBookings(json.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCancelConfirm = async () => {
        if (!bookingToCancel) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/bookings/${bookingToCancel}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            setBookings(prev => prev.filter((b) => b._id !== bookingToCancel));
            setCancelModalOpen(false);
            setBookingToCancel(null);
        } catch (e) { console.error(e); }
    };

    if (authLoading || !user || loading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Загрузка..." /></div>;
    }

    return (
        <div className="dashboard-page">
            <Head><title>КиноСемка — Личный кабинет</title></Head>
            <div className="dashboard-page__inner">
                <div className="dashboard-page__header">
                    <h1 className="dashboard-page__title">Личный кабинет</h1>
                    <div className="dashboard-page__actions">
                        <Button variant="outline" onClick={() => router.push('/movies')}>К фильмам</Button>
                        <Button variant="outline" onClick={() => { logout(); router.push('/'); }}>Выйти</Button>
                    </div>
                </div>
                <Dashboard user={user} bookings={bookings} onViewTicket={(b) => { setSelectedBooking(b); setTicketModalOpen(true); }} onCancelBooking={(id) => { setBookingToCancel(id); setCancelModalOpen(true); }} />
            </div>
            <DigitalTicket booking={selectedBooking} isOpen={ticketModalOpen} onClose={() => { setTicketModalOpen(false); setSelectedBooking(null); }} />
            <Modal isOpen={cancelModalOpen} onClose={() => { setCancelModalOpen(false); setBookingToCancel(null); }} title="Отмена бронирования">
                <p className="cancel-modal__text">Вы уверены, что хотите отменить бронирование?</p>
                <div className="cancel-modal__actions">
                    <Button variant="outline" onClick={() => { setCancelModalOpen(false); setBookingToCancel(null); }}>Нет</Button>
                    <Button variant="primary" onClick={handleCancelConfirm}>Да, отменить</Button>
                </div>
            </Modal>
        </div>
    );
}
