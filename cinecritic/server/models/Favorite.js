const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  year: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure a user can only favorite a movie once
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
