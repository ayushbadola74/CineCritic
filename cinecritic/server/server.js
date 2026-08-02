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

// API Health Check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CineCritic API (MERN Stack)',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);

// Serve frontend static build in production if available
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
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
    console.log(`🔑 TMDB API Key Active: ${process.env.TMDB_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🌐 API Server URL: http://localhost:${PORT}/`);
    console.log(`=========================================`);
  });
}

module.exports = app;
