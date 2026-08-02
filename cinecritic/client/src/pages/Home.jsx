import React, { useState, useEffect, useRef } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import TrailerModal from '../components/TrailerModal';
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  searchMovies
} from '../services/api';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Horror', 'Thriller', 'Comedy', 'Crime'];

const Home = ({ searchInput }) => {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [trailerModal, setTrailerModal] = useState({ open: false, url: '' });

  const popularRef = useRef(null);
  const trendingRef = useRef(null);
  const topRatedRef = useRef(null);
  const upcomingRef = useRef(null);

  useEffect(() => {
    const loadAllMovies = async () => {
      try {
        setLoading(true);
        const [popRes, trendRes, topRes, upRes] = await Promise.all([
          fetchPopularMovies(),
          fetchTrendingMovies(),
          fetchTopRatedMovies(),
          fetchUpcomingMovies()
        ]);

        setPopular(popRes.data);
        setTrending(trendRes.data);
        setTopRated(topRes.data);
        setUpcoming(upRes.data);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllMovies();
  }, []);

  // Handle Search Input
  useEffect(() => {
    if (!searchInput.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await searchMovies(searchInput);
        setSearchResults(data);
      } catch (e) {
        console.error('Search error:', e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleWatchTrailer = (movie) => {
    // Standard embed fallback if trailerUrl not fetched yet
    const videoUrl = movie.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    setTrailerModal({ open: true, url: videoUrl });
  };

  const scrollCarousel = (ref, amount) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Genre filtering helper
  const filterByGenre = (list) => {
    if (selectedGenre === 'All') return list;
    return list; // standard list or filtered
  };

  const featuredSpotlight = popular[0] || trending[0];

  return (
    <main style={{ paddingBottom: '3rem' }}>
      {/* Featured Spotlight Banner */}
      {!searchInput && featuredSpotlight && (
        <HeroBanner movie={featuredSpotlight} onWatchTrailer={handleWatchTrailer} />
      )}

      <div className="container">
        {/* Genre Filter Pills */}
        <div className="filter-bar">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`genre-pill ${selectedGenre === g ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g)}
            >
              {g === 'All' ? 'All Genres' : g}
            </button>
          ))}
        </div>

        {/* Live Search Results */}
        {searchInput && (
          <section className="movie-section" style={{ margin: '2rem 0' }}>
            <div className="section-header">
              <h2 className="section-title">Search Results for "{searchInput}"</h2>
            </div>
            {searchResults.length > 0 ? (
              <div className="movie-grid">
                {searchResults.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No movies found matching your search query.</p>
            )}
          </section>
        )}

        {!searchInput && (
          <>
            {/* Section 1: Popular */}
            <section id="popular" className="movie-section">
              <div className="section-header">
                <h2 className="section-title">Popular Movies</h2>
                <div className="scroll-controls">
                  <button className="scroll-btn" onClick={() => scrollCarousel(popularRef, -400)}>‹</button>
                  <button className="scroll-btn" onClick={() => scrollCarousel(popularRef, 400)}>›</button>
                </div>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="carousel-row" ref={popularRef}>
                  {filterByGenre(popular).map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Trending */}
            <section id="trending" className="movie-section">
              <div className="section-header">
                <h2 className="section-title">Trending This Week</h2>
                <div className="scroll-controls">
                  <button className="scroll-btn" onClick={() => scrollCarousel(trendingRef, -400)}>‹</button>
                  <button className="scroll-btn" onClick={() => scrollCarousel(trendingRef, 400)}>›</button>
                </div>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="carousel-row" ref={trendingRef}>
                  {filterByGenre(trending).map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              )}
            </section>

            {/* Section 3: Top Rated */}
            <section id="top-rated" className="movie-section">
              <div className="section-header">
                <h2 className="section-title">Top Rated Movies</h2>
                <div className="scroll-controls">
                  <button className="scroll-btn" onClick={() => scrollCarousel(topRatedRef, -400)}>‹</button>
                  <button className="scroll-btn" onClick={() => scrollCarousel(topRatedRef, 400)}>›</button>
                </div>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="carousel-row" ref={topRatedRef}>
                  {filterByGenre(topRated).map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              )}
            </section>

            {/* Section 4: Upcoming */}
            <section id="upcoming" className="movie-section">
              <div className="section-header">
                <h2 className="section-title">Upcoming Releases</h2>
                <div className="scroll-controls">
                  <button className="scroll-btn" onClick={() => scrollCarousel(upcomingRef, -400)}>‹</button>
                  <button className="scroll-btn" onClick={() => scrollCarousel(upcomingRef, 400)}>›</button>
                </div>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="carousel-row" ref={upcomingRef}>
                  {filterByGenre(upcoming).map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Video Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.open}
        trailerUrl={trailerModal.url}
        onClose={() => setTrailerModal({ open: false, url: '' })}
      />
    </main>
  );
};

export default Home;
