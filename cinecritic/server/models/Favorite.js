const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

favoriteSchema.index({ movieId: 1, username: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
