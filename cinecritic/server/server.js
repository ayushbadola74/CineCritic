require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');

// Import MongoDB Models
const User = require('./models/User');
const Review = require('./models/Review');
const Favorite = require('./models/Favorite');

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinecritic';

// 1. SETUP EXPRESS SERVER & MIDDLEWARE
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// 2. CONNECT MONGODB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`=========================================`);
    console.log(`🍃 Connected to MongoDB: ${MONGO_URI}`);
    console.log(`=========================================`);
  })
  .catch((err) => {
    console.warn(`⚠️ MongoDB connection warning: ${err.message}`);
  });

// API Status Check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CineCritic API',
    tmdbConnected: Boolean(process.env.TMDB_API_KEY || TMDB_API_KEY),
    mongoConnected: mongoose.connection.readyState === 1,
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// ----------------------------------
// 4. REVIEWS API ROUTES (MONGODB)
// ----------------------------------

// POST /api/reviews → Add review
app.post('/api/reviews', async (req, res) => {
  try {
    const { movieId, username, author, rating, comment } = req.body;

    if (!movieId || (!comment && comment !== 0)) {
      return res.status(400).json({ error: 'movieId and comment are required' });
    }

    const review = new Review({
      movieId: Number(movieId),
      username: username || author || 'Anonymous Critic',
      rating: Number(rating) || 8,
      comment: comment
    });

    const savedReview = await review.save();
    res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    console.error('Error posting review:', error.message);
    res.status(500).json({ error: 'Failed to post review', details: error.message });
  }
});

// GET /api/reviews/:movieId → Get all reviews for a movie
app.get('/api/reviews/:movieId', async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
});

// ----------------------------------
// 4. FAVORITES API ROUTES (MONGODB)
// ----------------------------------

// POST /api/favorites → Add movie to favorites
app.post('/api/favorites', async (req, res) => {
  try {
    const { movieId, username } = req.body;

    if (!movieId || !username) {
      return res.status(400).json({ error: 'movieId and username are required' });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { movieId: Number(movieId), username: username.trim() },
      { movieId: Number(movieId), username: username.trim() },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({ error: 'Failed to add favorite', details: error.message });
  }
});

// GET /api/favorites/:username → Get user's favorite movies
app.get('/api/favorites/:username', async (req, res) => {
  try {
    const username = req.params.username.trim();
    const favorites = await Favorite.find({ username }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ error: 'Failed to fetch favorites', details: error.message });
  }
});

// DELETE /api/favorites → Remove from favorites
app.delete('/api/favorites', async (req, res) => {
  try {
    const { movieId, username } = req.body.movieId ? req.body : req.query;

    if (!movieId || !username) {
      return res.status(400).json({ error: 'movieId and username are required' });
    }

    await Favorite.findOneAndDelete({ movieId: Number(movieId), username: String(username).trim() });
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({ error: 'Failed to remove favorite', details: error.message });
  }
});

// ----------------------------------
// 5. TMDB API ROUTES (MUST BE KEPT)
// ----------------------------------

// 1. GET /api/movies/popular → TMDB /movie/popular
app.get('/api/movies/popular', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error.message);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

// 2. GET /api/movies/trending → TMDB /trending/movie/day
app.get('/api/movies/trending', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching trending movies from TMDB:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// 3. GET /api/movies/top-rated → TMDB /movie/top_rated
app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching top rated movies from TMDB:', error.message);
    res.status(500).json({ error: 'Failed to fetch top-rated movies' });
  }
});

// 4. GET /api/movies/upcoming → TMDB /movie/upcoming
app.get('/api/movies/upcoming', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching upcoming movies from TMDB:', error.message);
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
});

// GET /api/movies (search & general query endpoint)
app.get('/api/movies', async (req, res) => {
  const { search } = req.query;
  try {
    if (search) {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY || TMDB_API_KEY,
          query: search
        }
      });
      return res.json(response.data.results);
    }
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: process.env.TMDB_API_KEY || TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching movies from TMDB:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// 5. GET /api/movies/:id → TMDB /movie/:id
app.get('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY || TMDB_API_KEY,
        append_to_response: 'videos,credits,recommendations,reviews'
      }
    });

    const m = response.data;
    const trailer = m.videos?.results?.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));

    // Fetch MongoDB custom reviews for this movie
    let mongoReviews = [];
    try {
      mongoReviews = await Review.find({ movieId: Number(movieId) }).sort({ createdAt: -1 });
    } catch (e) { }

    const tmdbReviews = m.reviews?.results ? m.reviews.results.slice(0, 5).map(r => ({
      author: r.author || 'TMDB Critic',
      rating: r.author_details?.rating || 8,
      comment: r.content
    })) : [];

    const formattedMongoReviews = mongoReviews.map(r => ({
      author: r.username,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently'
    }));

    res.json({
      id: m.id,
      title: m.title || m.original_title,
      tagline: m.tagline || '',
      vote_average: m.vote_average,
      rating: m.vote_average ? m.vote_average.toFixed(1) : '8.0',
      voteCount: m.vote_count || 0,
      year: m.release_date ? m.release_date.split('-')[0] : '',
      runtime: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : '2h 15m',
      overview: m.overview || '',
      poster_path: m.poster_path,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
      backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : '',
      genre: m.genres ? m.genres.map(g => g.name) : [],
      trailerUrl: trailer && trailer.key ? `https://www.youtube.com/embed/${trailer.key}` : 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      cast: m.credits?.cast ? m.credits.cast.slice(0, 10).map(c => ({
        name: c.name,
        character: c.character || 'Actor',
        photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      })) : [],
      reviews: [...formattedMongoReviews, ...tmdbReviews],
      similar: m.recommendations?.results ? m.recommendations.results.slice(0, 6) : []
    });
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error.message);
    res.status(404).json({ error: 'Movie not found' });
  }
});

// Fallback to client index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🎬 CineCritic Server running on port ${PORT}`);
  console.log(`🔑 TMDB API Key Active: ${process.env.TMDB_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌐 Application URL: http://localhost:${PORT}/`);
  console.log(`=========================================`);
});
