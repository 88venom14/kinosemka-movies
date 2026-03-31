import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Movie, Showtime, Seat } from '../types';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import SeatSelector from '../components/booking/SeatSelector';
import { useBookingStore } from '../stores/bookingStore';
import { useAuth } from '../hooks/useAuth';

const BookMovie = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { selectedSeats, clearSelection, setMovie, toggleSeat } = useBookingStore();

    const [movie, setMovieData] = useState<Movie | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const fetchMovieDetails = useCallback(async (id: string) => {
        try {
            const movieRes = await api.get.movie(id);
            setMovieData(movieRes.data);
            if (movieRes.data) setMovie(movieRes.data);

            const showtimesRes = await api.get.showtimes(id);
            setShowtimes(showtimesRes.data);
        } catch (error) {
            console.error('Error fetching movie:', error);
        } finally {
            setLoading(false);
        }
    }, [setMovie]);

    const fetchSeats = useCallback(async (showtimeId: string) => {
        try {
            const response = await api.get.seats(showtimeId);
            setSeats(response.data);
        } catch (error) {
            console.error('Error fetching seats:', error);
        }
    }, []);

    useEffect(() => {
        if (movieId) {
            fetchMovieDetails(movieId);
        }
    }, [movieId, fetchMovieDetails]);

    useEffect(() => {
        if (selectedShowtime) {
            fetchSeats(selectedShowtime._id);
        }
    }, [selectedShowtime, fetchSeats]);

    const handleSeatSelect = (seatId: string) => {
        toggleSeat(seatId);
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!selectedShowtime || selectedSeats.length === 0) return;

        setBookingLoading(true);
        setBookingError(null);
        try {
            await api.post.booking({
                showtimeId: selectedShowtime._id,
                seats: selectedSeats,
            });

            setBookingModalOpen(true);
            clearSelection();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Ошибка при бронировании. Попробуйте снова.';
            setBookingError(message);
        } finally {
            setBookingLoading(false);
        }
    };

    const calculateTotal = useMemo(() => {
        if (!selectedShowtime) return 0;
        const basePrice = selectedShowtime.ticketPrice;
        return selectedSeats.reduce((total, seatId) => {
            const seat = seats.find((s) => s._id === seatId);
            return total + basePrice * (seat?.priceMultiplier || 1);
        }, 0);
    }, [selectedSeats, selectedShowtime, seats]);

    const seatLabels = useMemo(() => {
        return selectedSeats.map(seatId => {
            const seat = seats.find(s => s._id === seatId);
            return seat ? `${seat.row}${seat.number}` : seatId;
        }).join(', ');
    }, [selectedSeats, seats]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Загрузка фильма..." />
            </div>
        );
    }

    if (!movie || !movie.title) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-cs-text-secondary mb-4">Фильм не найден</p>
                    <button
                        onClick={() => navigate('/movies')}
                        className="px-6 py-3 bg-white text-cs-black hover:bg-gray-200 transition-colors"
                    >
                        Вернуться к фильмам
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-4 md:py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 md:mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
                        <div className="w-32 md:w-48 flex-shrink-0 mx-auto md:mx-0">
                            <div className="aspect-[2/3] overflow-hidden border border-cs-border bg-cs-dark">
                                <img
                                    src={movie.posterUrl || movie.backdropUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750/111111/777777?text=No+Poster';
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-xl md:text-3xl font-light text-white mb-2">{movie.title}</h1>
                            <p className="text-sm md:text-base text-cs-text-secondary mb-4">
                                {movie.duration} мин • {movie.genre.join(', ')} • {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                            </p>

                            {movie.rating && (
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="text-white font-medium">{movie.rating.toFixed(1)}</span>
                                    <span className="text-cs-text-secondary text-sm">/ 10</span>
                                </div>
                            )}

                            {movie.director && (
                                <p className="text-sm text-cs-text-secondary mb-2">
                                    <span className="text-white">Режиссёр:</span> {movie.director}
                                </p>
                            )}

                            {movie.cast && movie.cast.length > 0 && (
                                <p className="text-sm text-cs-text-secondary mb-4">
                                    <span className="text-white">В ролях:</span> {movie.cast.join(', ')}
                                </p>
                            )}

                            {movie.description && (
                                <p className="text-cs-text-secondary text-sm leading-relaxed line-clamp-3">
                                    {movie.description}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-6 md:space-y-8">
                        <div className="border border-cs-border p-4 md:p-6 bg-cs-dark">
                            <h2 className="text-base md:text-lg text-white mb-4">Выберите сеанс</h2>
                            <div className="flex flex-wrap gap-2">
                                {showtimes.map((showtime) => {
                                    const date = new Date(showtime.dateTime);
                                    const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
                                    const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <button
                                            key={showtime._id}
                                            onClick={() => setSelectedShowtime(showtime)}
                                            className={`min-w-[100px] md:min-w-[120px] px-2 md:px-3 py-2 text-xs md:text-sm border transition-colors text-center ${
                                                selectedShowtime?._id === showtime._id
                                                    ? 'border-white bg-white text-black'
                                                    : 'border-cs-border text-cs-text-secondary hover:border-white hover:text-white'
                                            }`}
                                        >
                                            <div className="font-medium">{dateStr}</div>
                                            <div className="text-xs mt-0.5">{timeStr} · Зал {showtime.screenNumber}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedShowtime && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border border-cs-border p-4 md:p-6 bg-cs-dark"
                            >
                                <h2 className="text-base md:text-lg text-white mb-4">Выберите места</h2>
                                <div className="overflow-x-auto">
                                    <SeatSelector
                                        seats={seats}
                                        selectedSeats={selectedSeats}
                                        onSeatSelect={handleSeatSelect}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-3 md:gap-6 mt-4 md:mt-6 justify-center text-xs text-cs-text-secondary">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border border-cs-border" />
                                        <span>Свободно</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border border-cs-vip" />
                                        <span>VIP</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-white" />
                                        <span>Выбрано</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-cs-border opacity-30" />
                                        <span>Занято</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div>
                        <div className="border border-cs-border p-4 md:p-6 bg-cs-dark lg:sticky lg:top-8">
                            <h2 className="text-base md:text-lg text-white mb-4">Итого</h2>

                            {bookingError && (
                                <p className="text-red-500 text-sm mb-4">{bookingError}</p>
                            )}

                            {selectedSeats.length > 0 ? (
                                <>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-cs-text-secondary">Места:</span>
                                            <span className="text-white">{seatLabels}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-cs-text-secondary">Количество:</span>
                                            <span className="text-white">{selectedSeats.length}</span>
                                        </div>
                                        <div className="border-t border-cs-border pt-3 flex justify-between">
                                            <span className="text-white font-medium">Всего:</span>
                                            <span className="text-white font-medium">{calculateTotal} ₽</span>
                                        </div>
                                    </div>

                                    <Button
                                        fullWidth
                                        onClick={handleBooking}
                                        loading={bookingLoading}
                                        disabled={selectedSeats.length === 0}
                                    >
                                        {isAuthenticated ? 'Забронировать' : 'Войти для бронирования'}
                                    </Button>
                                </>
                            ) : (
                                <p className="text-cs-text-secondary text-sm">
                                    Выберите места для бронирования
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={bookingModalOpen} onClose={() => { setBookingModalOpen(false); navigate('/dashboard'); }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl text-white mb-2">Бронирование успешно!</h3>
                    <p className="text-cs-text-secondary mb-6">
                        Ваши билеты забронированы. Проверьте личный кабинет.
                    </p>
                    <Button onClick={() => { setBookingModalOpen(false); navigate('/dashboard'); }}>
                        В личный кабинет
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default BookMovie;
