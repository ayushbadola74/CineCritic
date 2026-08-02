import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';

const HeroBanner = ({ movie, onWatchTrailer }) => {
  if (!movie) return null;

  const backdropUrl = movie.backdrop || (movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1400&q=80');

  return (
    <section
      className="hero-spotlight"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-tag">🔥 FEATURED SPOTLIGHT</div>
          <h1 className="hero-title">{movie.title}</h1>
          <div className="hero-meta">
            <span className="meta-rating">
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <span>{movie.rating || movie.vote_average?.toFixed(1) || '8.2'}</span>
            </span>
            <span>{movie.year || '2026'}</span>
            <span>Action • Sci-Fi • Adventure</span>
          </div>
          <p className="hero-desc">{movie.overview}</p>
          <div className="hero-actions">
            <button
              className="btn-watch-now"
              onClick={() => onWatchTrailer && onWatchTrailer(movie)}
            >
              <Play size={18} fill="black" /> Watch Trailer
            </button>
            <Link to={`/movie/${movie.id}`} className="btn-more-info">
              <Info size={18} /> More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
