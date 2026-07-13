require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Status check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CineCritic API',
    tmdbConnected: Boolean(process.env.TMDB_API_KEY),
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// 1. GET /api/movies/popular -> /movie/popular
app.get('/api/movies/popular', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching popular movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

// 2. GET /api/movies/trending -> /trending/movie/day
app.get('/api/movies/trending', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching trending movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// 3. GET /api/movies/top-rated -> /movie/top_rated
app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching top rated movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch top-rated movies' });
  }
});

// 4. GET /api/movies/upcoming -> /movie/upcoming
app.get('/api/movies/upcoming', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
});

// Search & filter general endpoint
app.get('/api/movies', async (req, res) => {
  const { search } = req.query;
  try {
    if (search) {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: search
        }
      });
      return res.json(response.data.results);
    }
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Movie Detail endpoint by ID
app.get('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: 'videos,credits,recommendations,reviews'
      }
    });

    const m = response.data;
    const trailer = m.videos?.results?.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
    
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
      reviews: m.reviews?.results ? m.reviews.results.slice(0, 5).map(r => ({
        author: r.author || 'TMDB Critic',
        rating: r.author_details?.rating || 8,
        comment: r.content
      })) : [],
      similar: m.recommendations?.results ? m.recommendations.results.slice(0, 6) : []
    });
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error.message);
    res.status(404).json({ error: 'Movie not found' });
  }
});

// Fallback route to serve client index.html
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
