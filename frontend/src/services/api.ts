import { Movie, Showtime, Seat, User, Booking } from '../types';

const API_URL = 'http://127.0.0.1:5000/api';

const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

const api = {
    get: {
        movies: async (endpoint?: string): Promise<{ data: Movie[] }> => {
            const url = endpoint === 'upcoming'
                ? `${API_URL}/movies?filter=upcoming`
                : `${API_URL}/movies`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Ошибка загрузки фильмов');
            return res.json();
        },

        movie: async (id: string): Promise<{ data: Movie | null }> => {
            const res = await fetch(`${API_URL}/movies/${id}`);
            if (res.status === 404) return { data: null };
            if (!res.ok) throw new Error('Ошибка загрузки фильма');
            return res.json();
        },

        showtimes: async (movieId?: string): Promise<{ data: Showtime[] }> => {
            const url = movieId
                ? `${API_URL}/showtimes?movieId=${movieId}`
                : `${API_URL}/showtimes`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Ошибка загрузки сеансов');
            return res.json();
        },

        showtime: async (id: string): Promise<{ data: Showtime | null }> => {
            const res = await fetch(`${API_URL}/showtimes/${id}`);
            if (!res.ok) return { data: null };
            return res.json();
        },

        seats: async (showtimeId: string): Promise<{ data: Seat[] }> => {
            const res = await fetch(`${API_URL}/seats?showtimeId=${showtimeId}`);
            if (!res.ok) throw new Error('Ошибка загрузки мест');
            return res.json();
        },

        profile: async (): Promise<{ data: { user: (User & { _id: string }) | null } }> => {
            const res = await fetch(`${API_URL}/auth/profile`, { headers: getHeaders() });
            if (res.status === 401) return { data: { user: null } };
            if (!res.ok) throw new Error('Ошибка загрузки профиля');
            return res.json();
        },

        bookings: async (): Promise<{ data: Booking[] }> => {
            const res = await fetch(`${API_URL}/bookings`, { headers: getHeaders() });
            if (res.status === 401) return { data: [] };
            if (!res.ok) throw new Error('Ошибка загрузки бронирований');
            return res.json();
        },
    },

    post: {
        login: async (email: string, password: string): Promise<{ data: { token: string; user: { _id: string; name: string; email: string; createdAt: string } } }> => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Ошибка входа');
            }
            const result = await res.json();
            localStorage.setItem('token', result.data.token);
            return result;
        },

        register: async (name: string, email: string, password: string): Promise<{ data: { token: string; user: { _id: string; name: string; email: string; createdAt: string } } }> => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Ошибка регистрации');
            }
            const result = await res.json();
            localStorage.setItem('token', result.data.token);
            return result;
        },

        booking: async (data: { showtimeId: string; seats: string[] }): Promise<{ data: Booking }> => {
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Ошибка бронирования');
            }
            return res.json();
        },
    },

    delete: {
        booking: async (id: string): Promise<{ data: Booking }> => {
            const res = await fetch(`${API_URL}/bookings/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Ошибка отмены бронирования');
            }
            return res.json();
        },
    },
};

export default api;
