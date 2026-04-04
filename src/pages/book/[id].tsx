'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Movie, Showtime, Seat } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import SeatSelector from '@/components/SeatSelector';

export default function BookMovie() {
    const router = useRouter();
    const { id } = router.query as { id: string };

    const [movie, setMovieData] = useState<Movie | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [bookingResult, setBookingResult] = useState<any>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const fetchMovieDetails = useCallback(async () => {
        try {
            const res = await fetch(`/api/movies/${id}`);
            const json = await res.json();
            setMovieData(json.data);
            const showRes = await fetch(`/api/showtimes?movieId=${id}`);
            const showJson = await showRes.json();
            setShowtimes(showJson.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [id]);

    const fetchSeats = useCallback(async (showtimeId: string) => {
        try {
            const res = await fetch(`/api/seats?showtimeId=${showtimeId}`);
            const json = await res.json();
            setSeats(json.data || []);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { if (id) fetchMovieDetails(); }, [id, fetchMovieDetails]);
    useEffect(() => { if (selectedShowtime) fetchSeats(selectedShowtime._id); }, [selectedShowtime, fetchSeats]);

    const handleSeatSelect = (seatId: string) => {
        setSelectedSeats((prev) => prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]);
    };

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }
        if (!selectedShowtime || selectedSeats.length === 0) return;
        setBookingLoading(true);
        setBookingError(null);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ showtimeId: selectedShowtime._id, seats: selectedSeats }),
            });
            const data = await res.json();
            if (!res.ok) { setBookingError(data.error || 'Ошибка при бронировании'); return; }
            setSelectedSeats([]);
            setBookingResult(data.data);
            setBookingModalOpen(true);
        } catch { setBookingError('Ошибка при бронировании'); }
        finally { setBookingLoading(false); }
    };

    const calculateTotal = useMemo(() => {
        if (!selectedShowtime) return 0;
        return selectedSeats.reduce((total, seatId) => {
            const seat = seats.find((s) => s._id === seatId);
            return total + selectedShowtime.ticketPrice * (seat?.priceMultiplier || 1);
        }, 0);
    }, [selectedSeats, selectedShowtime, seats]);

    const seatLabels = useMemo(() => selectedSeats.map(seatId => { const seat = seats.find(s => s._id === seatId); return seat ? `${seat.row}${seat.number}` : seatId; }).join(', '), [selectedSeats, seats]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Загрузка фильма..." /></div>;
    if (!movie) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-cs-text-secondary mb-4">Фильм не найден</p><Link href="/movies" className="btn btn--primary px-6 py-3">Вернуться к фильмам</Link></div></div>;

    return (
        <div className="book-page">
            <Head><title>КиноСемка — {movie.title}</title></Head>
            <div className="book-page__inner">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="book-page__movie-info">
                    <div className="book-page__movie-header">
                        <div className="book-page__poster-wrapper">
                            <div className="book-page__poster">
                                <img src={movie.posterUrl || movie.backdropUrl} alt={movie.title} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750/111111/777777?text=No+Poster'; }} />
                            </div>
                        </div>
                        <div className="book-page__details">
                            <h1 className="book-page__title">{movie.title}</h1>
                            <p className="book-page__meta">{movie.duration} мин • {movie.genre.join(', ')} • {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</p>
                            {movie.rating > 0 && <div className="book-page__rating"><span className="text-yellow">⭐</span><span className="text-white font-medium">{movie.rating.toFixed(1)}</span><span className="text-cs-text-secondary text-sm">/ 10</span></div>}
                            {movie.director && <p className="book-page__director"><span className="text-white">Режиссёр:</span> {movie.director}</p>}
                            {movie.cast?.length > 0 && <p className="book-page__cast"><span className="text-white">В ролях:</span> {movie.cast.join(', ')}</p>}
                            {movie.description && <p className="book-page__description">{movie.description}</p>}
                        </div>
                    </div>
                </motion.div>

                <div className="book-page__layout">
                    <div>
                        <div className="book-page__section mb-6">
                            <h2 className="book-page__section-title">Выберите сеанс</h2>
                            <div className="book-page__showtimes">
                                {showtimes.map((showtime) => {
                                    const date = new Date(showtime.dateTime);
                                    const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
                                    const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                                    return (<button key={showtime._id} onClick={() => setSelectedShowtime(showtime)} className={`book-page__showtime-btn ${selectedShowtime?._id === showtime._id ? 'book-page__showtime-btn--active' : ''}`}><div className="book-page__showtime-date">{dateStr}</div><div className="book-page__showtime-time">{timeStr} · Зал {showtime.screenNumber}</div></button>);
                                })}
                            </div>
                        </div>
                        {selectedShowtime && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="book-page__section">
                                <h2 className="book-page__section-title">Выберите места</h2>
                                <div className="overflow-x-auto">
                                    <SeatSelector seats={seats} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
                                </div>
                                <div className="legend">
                                    <div className="legend__item"><div className="legend__swatch legend__swatch--available" /><span>Свободно</span></div>
                                    <div className="legend__item"><div className="legend__swatch legend__swatch--vip" /><span>VIP</span></div>
                                    <div className="legend__item"><div className="legend__swatch legend__swatch--selected" /><span>Выбрано</span></div>
                                    <div className="legend__item"><div className="legend__swatch legend__swatch--occupied" /><span>Занято</span></div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <div>
                        <div className="book-page__summary">
                            <h2 className="book-page__summary-title">Итого</h2>
                            {bookingError && <p className="book-page__error">{bookingError}</p>}
                            {selectedSeats.length > 0 ? (
                                <>
                                    <div className="mb-6">
                                        <div className="book-page__summary-row"><span className="book-page__summary-label">Места:</span><span className="book-page__summary-value">{seatLabels}</span></div>
                                        <div className="book-page__summary-row"><span className="book-page__summary-label">Количество:</span><span className="book-page__summary-value">{selectedSeats.length}</span></div>
                                        <div className="book-page__summary-total"><span className="book-page__summary-total-label">Всего:</span><span className="book-page__summary-total-value">{calculateTotal} ₽</span></div>
                                    </div>
                                    <Button fullWidth onClick={handleBooking} loading={bookingLoading}>Забронировать</Button>
                                </>
                            ) : <p className="book-page__empty-text">Выберите места для бронирования</p>}
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={bookingModalOpen} onClose={() => { setBookingModalOpen(false); router.push('/dashboard'); }}>
                <div className="booking-confirm">
                    <div className="booking-confirm__icon"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <h3 className="booking-confirm__title">Бронирование успешно!</h3>
                    {bookingResult && (
                        <div className="mb-6 text-center">
                            <p className="text-cs-text-secondary text-sm mb-2">Заказ #{bookingResult._id.slice(-6).toUpperCase()}</p>
                            <p className="text-white mb-1">Места: {bookingResult.seatNumbers?.join(', ')}</p>
                            <p className="text-white mb-1">Всего: <strong>{bookingResult.totalPrice} ₽</strong></p>
                            {bookingResult.showtime && (
                                <p className="text-cs-text-secondary text-sm">
                                    {new Date(bookingResult.showtime.dateTime).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}{' '}
                                    {new Date(bookingResult.showtime.dateTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}{' '}
                                    • Зал {bookingResult.showtime.screenNumber}
                                </p>
                            )}
                        </div>
                    )}
                    <p className="booking-confirm__text">Ваши билеты забронированы. Проверьте личный кабинет.</p>
                    <Button onClick={() => { setBookingModalOpen(false); router.push('/dashboard'); }}>В личный кабинет</Button>
                </div>
            </Modal>
        </div>
    );
}
