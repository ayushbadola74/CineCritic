const express = require('express');
const router = express.Router();
const { addReview, getMovieReviews, getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addReview);
router.get('/:movieId', getMovieReviews);
router.get('/user/:userId', getUserReviews);

module.exports = router;
