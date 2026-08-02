require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Express Middleware
app.use(cors());
app.use(express.json());

// API Root Information & Health Check
const apiOverview = (req, res) => {
  res.json({
    status: 'ok',
    app: 'CineCritic API (MERN Stack)',
    endpoints: {
      status: '/api/status',
      auth: ['POST /api/auth/signup', 'POST /api/auth/login', 'GET /api/auth/me'],
      movies: [
        'GET /api/movies',
        'GET /api/movies/popular',
        'GET /api/movies/trending',
        'GET /api/movies/top-rated',
        'GET /api/movies/upcoming',
        'GET /api/movies/search?search=query',
        'GET /api/movies/:id'
      ],
      reviews: [
        'POST /api/reviews',
        'GET /api/reviews/:movieId',
        'GET /api/reviews/user/:userId'
      ],
      favorites: [
        'POST /api/favorites',
        'GET /api/favorites',
        'DELETE /api/favorites/:movieId'
      ]
    },
    uptime: process.uptime(),
    timestamp: new Date()
  });
};

app.get('/api', apiOverview);
app.get('/api/status', apiOverview);

// API Routes (Supporting both plural and singular path aliases)
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/favorite', favoriteRoutes);

// Serve frontend static build in production if available
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      error: 'API route not found',
      requestedPath: req.originalUrl,
      hint: 'Visit http://localhost:5000/api to see all supported endpoints.'
    });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('CineCritic Backend API Running. Frontend is running on Vite dev server.');
    }
  });
});

// Central Error Handler
app.use(errorHandler);

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🎬 CineCritic Server running on port ${PORT}`);
    console.log(`🔑 Watchmode API Key Active: ${process.env.WATCHMODE_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`=========================================`);
  });
}

module.exports = app;
