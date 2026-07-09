const express = require('express');
const cors = require('cors');
const path = require('path');
const sampleMovies = require('../client/js/data.js');

const app = express();
const PORT = process.env.PORT || 5000;

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
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// API endpoint to fetch movies list with search and filter
app.get('/api/movies', (req, res) => {
  const { category, genre, search } = req.query;
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
      m.overview.toLowerCase().includes(q) ||
      m.genre.some(g => g.toLowerCase().includes(q))
    );
  }

  res.json(result);
});

// Category-specific convenience endpoints
app.get('/api/movies/popular', (req, res) => {
  res.json(sampleMovies.filter(m => m.isPopular));
});

app.get('/api/movies/trending', (req, res) => {
  res.json(sampleMovies.filter(m => m.isTrending));
});

app.get('/api/movies/top-rated', (req, res) => {
  res.json(sampleMovies.filter(m => m.isTopRated));
});

app.get('/api/movies/upcoming', (req, res) => {
  res.json(sampleMovies.filter(m => m.isUpcoming));
});

// API endpoint to fetch movie by ID
app.get('/api/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = sampleMovies.find(m => m.id === movieId);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
});

// API endpoint to post a review for a movie
app.post('/api/movies/:id/reviews', (req, res) => {
  const movieId = parseInt(req.params.id);
  const { author, rating, comment } = req.body;
  const movie = sampleMovies.find(m => m.id === movieId);

  if (movie) {
    const newReview = {
      author: author || 'Anonymous Critic',
      rating: parseInt(rating) || 8,
      date: 'Just now',
      comment: comment || ''
    };
    if (!movie.reviews) movie.reviews = [];
    movie.reviews.unshift(newReview);
    res.json({ success: true, review: newReview, reviews: movie.reviews });
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
});

// Fallback to index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🎬 CineCritic Server running on port ${PORT}`);
  console.log(`🌐 Application URL: http://localhost:${PORT}/`);
  console.log(`=========================================`);
});
