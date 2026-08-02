import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Play, Heart, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { fetchMovieDetails } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

const MovieDetails = () => {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    getDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Movie Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error || "We couldn't find details for this movie."}</p>
        <Link to="/" className="btn-auth-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(movie.id);

  const handleReviewAdded = (newReview) => {
    setMovie((prev) => ({
      ...prev,
      reviews: [newReview, ...prev.reviews]
    }));
  };

  return (
    <main style={{ paddingBottom: '3rem' }}>
      {/* Detail Hero Section */}
      <div
        className="detail-hero"
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      >
        <div className="detail-backdrop-overlay"></div>
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Movies
          </Link>

          <div className="detail-layout">
            <div className="detail-poster-wrapper">
              <img src={movie.poster} alt={movie.title} className="detail-poster-img" />
            </div>

            <div className="detail-content">
              <h1 className="detail-title">{movie.title}</h1>
              {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

              <div className="meta-pills">
                <div className="pill pill-gold">
                  <Star size={14} fill="#ffb400" color="#ffb400" inline />
                  <span style={{ marginLeft: '4px' }}>{movie.rating} / 10 ({movie.voteCount} votes)</span>
                </div>
                <div className="pill">
                  <Calendar size={14} inline />
                  <span style={{ marginLeft: '4px' }}>{movie.year}</span>
                </div>
                <div className="pill">
                  <Clock size={14} inline />
                  <span style={{ marginLeft: '4px' }}>{movie.runtime}</span>
                </div>
                {movie.genres && movie.genres.map((g, idx) => (
                  <div key={idx} className="pill">{g}</div>
                ))}
              </div>

              <p className="detail-overview">{movie.overview}</p>

              <div className="hero-actions">
                <button
                  className="btn-watch-now"
                  onClick={() => setTrailerModalOpen(true)}
                >
                  <Play size={18} fill="black" /> Watch Trailer
                </button>
                <button
                  className="btn-more-info"
                  onClick={() => toggleFavorite(movie)}
                  style={{
                    background: favorited ? 'rgba(255, 59, 75, 0.3)' : 'rgba(255, 255, 255, 0.18)',
                    borderColor: favorited ? '#ff3b4b' : 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <Heart size={18} fill={favorited ? '#ff3b4b' : 'none'} color={favorited ? '#ff3b4b' : 'white'} />
                  {favorited ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <section style={{ margin: '2rem 0' }}>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Featured Cast</h2>
            <div className="cast-grid">
              {movie.cast.map((actor, i) => (
                <div key={i} className="cast-card">
                  <img src={actor.photo} alt={actor.name} className="cast-img" />
                  <div className="cast-name">{actor.name}</div>
                  <div className="cast-role">{actor.character}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="reviews-section">
          <ReviewForm movieId={movie.id} onReviewAdded={handleReviewAdded} />
          <ReviewList reviews={movie.reviews} />
        </section>

        {/* Similar Movies */}
        {movie.similar && movie.similar.length > 0 && (
          <section style={{ marginTop: '3rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>More Like This</h2>
            <div className="carousel-row">
              {movie.similar.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        trailerUrl={movie.trailerUrl}
        onClose={() => setTrailerModalOpen(false)}
      />
    </main>
  );
};

export default MovieDetails;
