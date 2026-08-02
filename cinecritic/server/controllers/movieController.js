const axios = require('axios');
const Review = require('../models/Review');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '4f8b901cd54d2477376f0e3659263e7c'; // Fallback demo key

// Format movie list item
const formatMovie = (m) => ({
  id: m.id,
  title: m.title || m.original_title,
  poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
  backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : '',
  rating: m.vote_average ? m.vote_average.toFixed(1) : '7.5',
  voteCount: m.vote_count || 0,
  year: m.release_date ? m.release_date.split('-')[0] : '2026',
  overview: m.overview || '',
  genre_ids: m.genre_ids || []
});

// @desc Get Popular Movies
// @route GET /api/movies/popular
const getPopularMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    const movies = response.data.results.map(formatMovie);
    res.json(movies);
  } catch (error) {
    console.error('TMDB Popular fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
};

// @desc Get Trending Movies
// @route GET /api/movies/trending
const getTrendingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    const movies = response.data.results.map(formatMovie);
    res.json(movies);
  } catch (error) {
    console.error('TMDB Trending fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
};

// @desc Get Top Rated Movies
// @route GET /api/movies/top-rated
const getTopRatedMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    const movies = response.data.results.map(formatMovie);
    res.json(movies);
  } catch (error) {
    console.error('TMDB Top Rated fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch top-rated movies' });
  }
};

// @desc Get Upcoming Movies
// @route GET /api/movies/upcoming
const getUpcomingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    const movies = response.data.results.map(formatMovie);
    res.json(movies);
  } catch (error) {
    console.error('TMDB Upcoming fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
};

// @desc Search Movies or General Fetch
// @route GET /api/movies?search=query
const searchMovies = async (req, res) => {
  const { search } = req.query;
  try {
    if (search) {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY || TMDB_API_KEY,
          query: search
        }
      });
      const movies = response.data.results.map(formatMovie);
      return res.json(movies);
    }
    // Fallback to popular
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    const movies = response.data.results.map(formatMovie);
    res.json(movies);
  } catch (error) {
    console.error('TMDB Search error:', error.message);
    res.status(500).json({ error: 'Failed to search movies' });
  }
};

// @desc Get Movie Details by ID
// @route GET /api/movies/:id
const getMovieDetails = async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY || TMDB_API_KEY,
        append_to_response: 'videos,credits,recommendations'
      }
    });

    const m = response.data;
    const trailer = m.videos?.results?.find(
      v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    // Retrieve user reviews stored in MongoDB
    let mongoReviews = [];
    try {
      mongoReviews = await Review.find({ movieId: Number(movieId) })
        .populate('userId', 'name avatar')
        .sort({ createdAt: -1 });
    } catch (e) {
      console.warn('Mongo reviews fetch warning:', e.message);
    }

    const formattedMongoReviews = mongoReviews.map(r => ({
      _id: r._id,
      author: r.username || r.userId?.name || 'CineCritic User',
      avatar: r.userAvatar || r.userId?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently'
    }));

    // Calculate dynamic average rating combining TMDB & custom user reviews
    let avgRating = m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0;
    if (mongoReviews.length > 0) {
      const sum = mongoReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const customAvg = sum / mongoReviews.length;
      avgRating = Number(((avgRating + customAvg) / 2).toFixed(1));
    }

    res.json({
      id: m.id,
      title: m.title || m.original_title,
      tagline: m.tagline || '',
      rating: avgRating,
      voteCount: (m.vote_count || 0) + mongoReviews.length,
      year: m.release_date ? m.release_date.split('-')[0] : '2026',
      runtime: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : '2h 15m',
      overview: m.overview || '',
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
      backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : '',
      genres: m.genres ? m.genres.map(g => g.name) : [],
      trailerUrl: trailer && trailer.key ? `https://www.youtube.com/embed/${trailer.key}` : 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      cast: m.credits?.cast ? m.credits.cast.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        character: c.character || 'Actor',
        photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      })) : [],
      reviews: formattedMongoReviews,
      similar: m.recommendations?.results ? m.recommendations.results.slice(0, 6).map(formatMovie) : []
    });
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error.message);
    res.status(404).json({ error: 'Movie not found' });
  }
};

module.exports = {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails
};
