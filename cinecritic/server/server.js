require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const sampleMovies = require('../client/js/data.js');

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'd8a30baaabc6ed9ab7c42a6efab19039';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// In-memory store for custom user reviews posted via the site
const userReviewsStore = {};

// Cache for TMDB Genre ID -> Name mapping
let genreMap = {};

// Helper: HTTP request using node fetch or native https
function tmdbFetch(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({ api_key: TMDB_API_KEY, ...params }).toString();
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}${query}`;

    if (typeof fetch !== 'undefined') {
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`TMDB error ${res.status}`);
          return res.json();
        })
        .then(resolve)
        .catch(reject);
    } else {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(JSON.parse(data));
            } else {
              reject(new Error(`TMDB status ${res.statusCode}: ${data}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    }
  });
}

// Fetch & cache TMDB genres on server start
async function initGenres() {
  try {
    const data = await tmdbFetch('/genre/movie/list');
    if (data && data.genres) {
      data.genres.forEach(g => {
        genreMap[g.id] = g.name;
      });
      console.log(`✅ Loaded ${Object.keys(genreMap).length} TMDB genres`);
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch TMDB genres:', err.message);
  }
}
initGenres();

// Helper: Normalize single movie object
function normalizeMovie(m) {
  if (!m) return null;

  // Extract genre names
  let genres = [];
  if (Array.isArray(m.genres) && m.genres.length > 0) {
    genres = m.genres.map(g => typeof g === 'object' ? g.name : (genreMap[g] || 'Movie'));
  } else if (Array.isArray(m.genre_ids) && m.genre_ids.length > 0) {
    genres = m.genre_ids.map(id => genreMap[id]).filter(Boolean);
  }
  if (genres.length === 0 && Array.isArray(m.genre)) {
    genres = m.genre;
  }
  if (genres.length === 0) genres = ['Drama', 'Action'];

  // Runtime formatting
  let runtimeStr = '2h 15m';
  if (m.runtime) {
    const hrs = Math.floor(m.runtime / 60);
    const mins = m.runtime % 60;
    runtimeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }

  // Trailer URL
  let trailerUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  if (m.videos && m.videos.results && m.videos.results.length > 0) {
    const trailer = m.videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || m.videos.results[0];
    if (trailer && trailer.key) {
      trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
    }
  }

  // Cast members
  let cast = [];
  if (m.credits && m.credits.cast) {
    cast = m.credits.cast.slice(0, 10).map(c => ({
      name: c.name,
      character: c.character || 'Actor',
      photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    }));
  }

  // TMDB Reviews
  let reviews = [];
  if (m.reviews && m.reviews.results) {
    reviews = m.reviews.results.slice(0, 5).map(r => ({
      author: r.author || 'TMDB Critic',
      rating: r.author_details?.rating || 8,
      date: r.created_at ? r.created_at.substring(0, 10) : 'Recently',
      comment: r.content ? (r.content.length > 300 ? r.content.substring(0, 300) + '...' : r.content) : ''
    }));
  }

  // Merge with custom local user reviews if available
  const storedReviews = userReviewsStore[m.id] || [];
  reviews = [...storedReviews, ...reviews];

  // Recommendations / Similar
  let similar = [];
  if (m.recommendations && m.recommendations.results) {
    similar = m.recommendations.results.slice(0, 6).map(normalizeMovie);
  }

  return {
    id: m.id,
    title: m.title || m.original_title || 'Untitled',
    tagline: m.tagline || '',
    vote_average: m.vote_average !== undefined ? m.vote_average : (m.rating || 8.0),
    rating: m.vote_average ? m.vote_average.toFixed(1) : (m.rating || '8.0'),
    voteCount: m.vote_count || m.voteCount || 1200,
    year: m.release_date ? m.release_date.split('-')[0] : (m.year || '2024'),
    runtime: runtimeStr,
    overview: m.overview || 'No overview provided.',
    poster_path: m.poster_path || null,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : (m.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80'),
    backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : (m.backdrop || m.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80'),
    genre: genres,
    featured: m.featured || (m.vote_average > 7.8),
    isPopular: true,
    isTrending: true,
    isTopRated: true,
    isUpcoming: true,
    trailerUrl: trailerUrl,
    cast: cast.length > 0 ? cast : (m.cast || []),
    reviews: reviews,
    similar: similar
  };
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// API endpoint for status check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CineCritic API',
    tmdbConnected: Boolean(TMDB_API_KEY),
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// API endpoint to fetch list of TMDB genres
app.get('/api/genres', async (req, res) => {
  try {
    if (Object.keys(genreMap).length === 0) {
      await initGenres();
    }
    const genresList = Object.keys(genreMap).map(id => ({
      id: Number(id),
      name: genreMap[id]
    }));
    res.json(genresList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Main API endpoint to fetch movies list with search, category, and filter
app.get('/api/movies', async (req, res) => {
  const { category, genre, search } = req.query;

  try {
    let rawMovies = [];

    if (search && search.trim().length > 0) {
      // TMDB Search API
      const searchData = await tmdbFetch('/search/movie', { query: search.trim() });
      rawMovies = searchData.results || [];
    } else if (category === 'trending') {
      // TMDB Trending API
      const trendData = await tmdbFetch('/trending/movie/day');
      rawMovies = trendData.results || [];
    } else if (category === 'top-rated') {
      // TMDB Top Rated API
      const topData = await tmdbFetch('/movie/top_rated');
      rawMovies = topData.results || [];
    } else if (category === 'upcoming') {
      // TMDB Upcoming API
      const upcomingData = await tmdbFetch('/movie/upcoming');
      rawMovies = upcomingData.results || [];
    } else {
      // Default: Popular movies
      const popData = await tmdbFetch('/movie/popular');
      rawMovies = popData.results || [];
    }

    let movies = rawMovies.map(normalizeMovie);

    // Filter by genre if provided
    if (genre && genre !== 'All') {
      movies = movies.filter(m => 
        m.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      );
    }

    res.json(movies);
  } catch (err) {
    console.warn('⚠️ TMDB Fetch Error, serving local sample dataset fallback:', err.message);
    let result = [...sampleMovies];

    if (category) {
      if (category === 'popular') result = result.filter(m => m.isPopular);
      else if (category === 'trending') result = result.filter(m => m.isTrending);
      else if (category === 'top-rated') result = result.filter(m => m.isTopRated);
      else if (category === 'upcoming') result = result.filter(m => m.isUpcoming);
    }

    if (genre && genre !== 'All') {
      result = result.filter(m => m.genre.includes(genre));
    }

    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.overview.toLowerCase().includes(q)
      );
    }

    res.json(result);
  }
});

// Category-specific convenience endpoints
app.get('/api/movies/popular', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/popular');
    res.json((data.results || []).map(normalizeMovie));
  } catch (e) {
    res.json(sampleMovies.filter(m => m.isPopular));
  }
});

app.get('/api/movies/trending', async (req, res) => {
  try {
    const data = await tmdbFetch('/trending/movie/day');
    res.json((data.results || []).map(normalizeMovie));
  } catch (e) {
    res.json(sampleMovies.filter(m => m.isTrending));
  }
});

app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/top_rated');
    res.json((data.results || []).map(normalizeMovie));
  } catch (e) {
    res.json(sampleMovies.filter(m => m.isTopRated));
  }
});

app.get('/api/movies/upcoming', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/upcoming');
    res.json((data.results || []).map(normalizeMovie));
  } catch (e) {
    res.json(sampleMovies.filter(m => m.isUpcoming));
  }
});

// API endpoint to fetch movie by ID (with videos, credits, recommendations, reviews)
app.get('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const movieData = await tmdbFetch(`/movie/${movieId}`, {
      append_to_response: 'videos,credits,recommendations,reviews'
    });
    const normalized = normalizeMovie(movieData);
    res.json(normalized);
  } catch (err) {
    // Fallback search in sampleMovies
    const numId = parseInt(movieId);
    const movie = sampleMovies.find(m => m.id === numId);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  }
});

// API endpoint to post a review for a movie
app.post('/api/movies/:id/reviews', (req, res) => {
  const movieId = req.params.id;
  const { author, rating, comment } = req.body;

  const newReview = {
    author: author || 'Anonymous Critic',
    rating: parseInt(rating) || 8,
    date: 'Just now',
    comment: comment || ''
  };

  if (!userReviewsStore[movieId]) {
    userReviewsStore[movieId] = [];
  }
  userReviewsStore[movieId].unshift(newReview);

  res.json({ success: true, review: newReview, reviews: userReviewsStore[movieId] });
});

// Fallback to index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🎬 CineCritic Server running on port ${PORT}`);
  console.log(`🔑 TMDB API Key Active: ${TMDB_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌐 Application URL: http://localhost:${PORT}/`);
  console.log(`=========================================`);
});
