const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getUserFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', addFavorite);
router.get('/', getUserFavorites);
router.delete('/:movieId', removeFavorite);

module.exports = router;
