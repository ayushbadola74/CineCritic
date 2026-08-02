const Favorite = require('../models/Favorite');

// @desc Add movie to user favorites / watchlist
// @route POST /api/favorites
// @access Private
const addFavorite = async (req, res) => {
  try {
    const { movieId, title, poster, rating, year } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({ error: 'movieId and title are required' });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { userId: req.user._id, movieId: Number(movieId) },
      {
        userId: req.user._id,
        movieId: Number(movieId),
        title,
        poster: poster || '',
        rating: rating || 0,
        year: year || ''
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({ error: 'Failed to add movie to watchlist' });
  }
};

// @desc Remove movie from user favorites / watchlist
// @route DELETE /api/favorites/:movieId
// @access Private
const removeFavorite = async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);
    await Favorite.findOneAndDelete({ userId: req.user._id, movieId });
    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};

// @desc Get user's favorites / watchlist
// @route GET /api/favorites
// @access Private
const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Error getting favorites:', error.message);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites
};
