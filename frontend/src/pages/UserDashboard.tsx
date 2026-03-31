import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Dashboard } from '../components/user/Dashboard';
import { DigitalTicket } from '../components/user/DigitalTicket';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import api from '../services/api';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
    const [cancelError, setCancelError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        if (isAuthenticated) {
            fetchBookings();
        }
    }, [isAuthenticated, authLoading, navigate]);

    const fetchBookings = async () => {
        try {
            const response = await api.get.bookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTicket = (booking: Booking) => {
        setSelectedBooking(booking);
        setTicketModalOpen(true);
    };

    const handleCancelClick = (bookingId: string) => {
        setBookingToCancel(bookingId);
        setCancelModalOpen(true);
        setCancelError(null);
    };

    const handleCancelConfirm = async () => {
        if (!bookingToCancel) return;

        try {
            await api.delete.booking(bookingToCancel);
            setBookings(prev => prev.filter((b) => b._id !== bookingToCancel));
            setCancelModalOpen(false);
            setBookingToCancel(null);
        } catch (error) {
            console.error('Error canceling booking:', error);
            setCancelError('Ошибка при отмене бронирования');
        }
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem('currentUserId');
        navigate('/');
    };

    if (authLoading || (loading && !user)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Загрузка..." />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-light text-white">Личный кабинет</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate('/movies')}>
                            К фильмам
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </div>
                </div>

                {/* Dashboard Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" text="Загрузка бронирований..." />
                    </div>
                ) : (
                    <Dashboard
                        user={user}
                        bookings={bookings}
                        onViewTicket={handleViewTicket}
                        onCancelBooking={handleCancelClick}
                    />
                )}
            </div>

            {/* Ticket Modal */}
            <DigitalTicket
                booking={selectedBooking}
                isOpen={ticketModalOpen}
                onClose={() => {
                    setTicketModalOpen(false);
                    setSelectedBooking(null);
                }}
            />

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={cancelModalOpen}
                onClose={() => {
                    setCancelModalOpen(false);
                    setBookingToCancel(null);
                    setCancelError(null);
                }}
                title="Отмена бронирования"
            >
                {cancelError && (
                    <p className="text-red-500 text-sm mb-4">{cancelError}</p>
                )}
                <p className="text-cs-text-secondary mb-6">
                    Вы уверены, что хотите отменить бронирование? Это действие нельзя отменить.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setCancelModalOpen(false);
                            setBookingToCancel(null);
                            setCancelError(null);
                        }}
                    >
                        Нет
                    </Button>
                    <Button variant="primary" onClick={handleCancelConfirm}>
                        Да, отменить
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default UserDashboard;
