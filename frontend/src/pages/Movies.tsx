import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'now-playing' | 'upcoming'>('now-playing');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const endpoint = filter === 'now-playing' ? 'now-playing' : 'upcoming';
        const response = await api.get.movies(endpoint);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filter]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-white">Фильмы</h1>
          
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('now-playing')}
              className={`px-4 py-2 text-sm transition-colors ${
                filter === 'now-playing'
                  ? 'bg-white text-black'
                  : 'bg-cs-dark text-cs-text-secondary hover:text-white'
              }`}
            >
              Сейчас в кино
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 text-sm transition-colors ${
                filter === 'upcoming'
                  ? 'bg-white text-black'
                  : 'bg-cs-dark text-cs-text-secondary hover:text-white'
              }`}
            >
              Скоро
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Загрузка фильмов..." />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cs-text-secondary">Фильмы не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies
              .filter(movie => movie.posterUrl || movie.backdropUrl) // Фильтруем фильмы без изображений
              .map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/book/${movie._id}`} className="block">
                    <div className="relative aspect-[2/3] overflow-hidden border border-cs-border bg-cs-dark mb-3">
                      <img
                        src={movie.posterUrl || movie.backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/500x750/111111/777777?text=No+Poster';
                        }}
                      />
                      {movie.rating && (
                        <div className="absolute top-2 right-2 bg-black/90 px-2 py-1 text-xs text-white font-medium">
                          ⭐ {movie.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm text-white font-medium truncate">{movie.title}</h3>
                    <p className="text-xs text-cs-text-secondary mt-1">
                      {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                      {movie.duration ? ` • ${movie.duration} мин` : ''}
                    </p>
                    {movie.description && (
                      <p className="text-xs text-cs-text-secondary mt-2 line-clamp-2">
                        {movie.description}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
