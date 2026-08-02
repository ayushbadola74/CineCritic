import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const movieId = movie.id || movie.movieId;
  const favorited = isFavorite(movieId);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const posterSrc = movie.poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80');
  const ratingVal = movie.rating || (movie.vote_average ? movie.vote_average.toFixed(1) : '7.5');
  const releaseYear = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '2026');

  return (
    <Link to={`/movie/${movieId}`} className="movie-card">
      <div className="poster-wrapper">
        <img
          src={posterSrc}
          alt={movie.title}
          className="movie-poster"
          loading="lazy"
        />

        <div className="movie-badge-rating">
          <Star size={12} fill="#ffb400" color="#ffb400" />
          <span>{ratingVal}</span>
        </div>

        <button
          className={`watchlist-toggle-btn ${favorited ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Heart size={16} fill={favorited ? '#ff3b4b' : 'none'} color={favorited ? '#ff3b4b' : 'currentColor'} />
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-submeta">
          <span>{releaseYear}</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>CineCritic</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
