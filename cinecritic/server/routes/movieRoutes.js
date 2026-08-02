const express = require('express');
const router = express.Router();
const {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails
} = require('../controllers/movieController');

router.get('/popular', getPopularMovies);
router.get('/trending', getTrendingMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/search', searchMovies);
router.get('/', searchMovies);
router.get('/:id', getMovieDetails);

module.exports = router;
