const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: ''
  },
  movieId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please provide a rating between 1 and 10']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
