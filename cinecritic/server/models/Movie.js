const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  poster: String,
  backdrop: String,
  rating: Number,
  year: String,
  genre: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
