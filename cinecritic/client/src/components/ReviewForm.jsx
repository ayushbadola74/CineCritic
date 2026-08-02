import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postReview } from '../services/api';
import { Link } from 'react-router-dom';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(9,9,11,0.6)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
          Want to share your review? Sign in to post your thoughts!
        </p>
        <Link to="/login" className="btn-auth-submit" style={{ display: 'inline-block', padding: '0.5rem 1.5rem', textDecoration: 'none' }}>
          Log In to Review
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const { data } = await postReview({
        movieId,
        rating,
        comment
      });

      setComment('');
      setRating(8);
      if (onReviewAdded) {
        onReviewAdded(data.review);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
        Write a Review
      </h3>

      {error && <div className="error-badge">{error}</div>}

      <div className="form-group">
        <label>Your Rating ({rating} / 10)</label>
        <div className="star-rating-select">
          {[...Array(10)].map((_, i) => {
            const starValue = i + 1;
            return (
              <Star
                key={starValue}
                size={22}
                fill={starValue <= rating ? '#ffb400' : 'none'}
                color={starValue <= rating ? '#ffb400' : '#4a4a52'}
                onClick={() => setRating(starValue)}
                style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
              />
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <label>Your Review</label>
        <textarea
          className="review-textarea"
          rows="3"
          placeholder="What did you think of the movie? Mention performance, story, direction..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>

      <button type="submit" className="btn-submit-review" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
