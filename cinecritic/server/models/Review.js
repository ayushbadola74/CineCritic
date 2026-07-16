const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    default: 'Anonymous Critic'
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
