const Review = require('../models/Review');

// @desc Add a review for a movie
// @route POST /api/reviews
// @access Private
const addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;

    if (!movieId || rating === undefined || !comment) {
      return res.status(400).json({ error: 'Please provide movieId, rating, and comment' });
    }

    const review = await Review.create({
      userId: req.user._id,
      username: req.user.name,
      userAvatar: req.user.avatar,
      movieId: Number(movieId),
      rating: Number(rating),
      comment: comment.trim()
    });

    res.status(201).json({
      success: true,
      review: {
        _id: review._id,
        author: review.username,
        avatar: review.userAvatar,
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.createdAt).toLocaleDateString()
      }
    });
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ error: 'Failed to post review', details: error.message });
  }
};

// @desc Get reviews for a movie
// @route GET /api/reviews/:movieId
// @access Public
const getMovieReviews = async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);
    const reviews = await Review.find({ movieId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const formatted = reviews.map(r => ({
      _id: r._id,
      author: r.username || r.userId?.name || 'CineCritic Critic',
      avatar: r.userAvatar || r.userId?.avatar || '',
      rating: r.rating,
      comment: r.comment,
      date: new Date(r.createdAt).toLocaleDateString()
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error getting reviews:', error.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// @desc Get user reviews
// @route GET /api/reviews/user/:userId
// @access Public / Private
const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const reviews = await Review.find({ userId }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error getting user reviews:', error.message);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
};

module.exports = {
  addReview,
  getMovieReviews,
  getUserReviews
};
