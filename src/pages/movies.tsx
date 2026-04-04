import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Movie } from '@/types';

export default function Movies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'now-playing' | 'upcoming'>('now-playing');

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const url = filter === 'now-playing' ? '/api/movies' : '/api/movies?filter=upcoming';
                const res = await globalThis.fetch(url);
                const json = await res.json();
                setMovies(json.data || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        loadMovies();
    }, [filter]);

    return (
        <div className="movies-page">
            <Head><title>КиноСемка — Фильмы</title></Head>
            <div className="movies-page__inner">
                <div className="movies-page__header">
                    <h1 className="movies-page__title">Фильмы</h1>
                    <div className="movies-page__filters">
                        <button onClick={() => setFilter('now-playing')} className={`movies-page__filter-btn ${filter === 'now-playing' ? 'movies-page__filter-btn--active' : 'movies-page__filter-btn--inactive'}`}>Сейчас в кино</button>
                        <button onClick={() => setFilter('upcoming')} className={`movies-page__filter-btn ${filter === 'upcoming' ? 'movies-page__filter-btn--active' : 'movies-page__filter-btn--inactive'}`}>Скоро</button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Загрузка фильмов..." /></div>
                ) : movies.length === 0 ? (
                    <div className="movies-page__empty"><p className="movies-page__empty-text">Фильмы не найдены</p></div>
                ) : (
                    <div className="movies-page__grid">
                        {movies.filter(m => m.posterUrl || m.backdropUrl).map((movie, index) => (
                            <motion.div key={movie._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="movies-page__card">
                                <Link href={`/book/${movie._id}`} className="block">
                                    <div className="movies-page__card-poster">
                                        <img src={movie.posterUrl || movie.backdropUrl} alt={movie.title} className="movies-page__card-img" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/500x750/111111/777777?text=No+Poster'; }} />
                                        {movie.rating > 0 && <div className="movies-page__card-rating">⭐ {movie.rating.toFixed(1)}</div>}
                                    </div>
                                    <h3 className="movies-page__card-title">{movie.title}</h3>
                                    <p className="movies-page__card-meta">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}{movie.duration ? ` • ${movie.duration} мин` : ''}</p>
                                    {movie.description && <p className="movies-page__card-desc">{movie.description}</p>}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
