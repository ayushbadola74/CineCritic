import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
        <MessageSquare size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
        <p>No reviews yet for this movie. Be the first to share your review!</p>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = (
    reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / reviews.length
  ).toFixed(1);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
          User Reviews ({reviews.length})
        </h3>
        <div className="pill pill-gold">
          ★ {avgRating} / 10 Average Rating
        </div>
      </div>

      {reviews.map((r, index) => (
        <div key={r._id || index} className="review-card">
          <img
            src={r.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={r.author}
            className="review-avatar"
          />
          <div className="review-body">
            <div className="review-author">
              <span>{r.author}</span>
              <span style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                ★ {r.rating} / 10
              </span>
            </div>
            <p className="review-comment">{r.comment}</p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
              {r.date || 'Verified Review'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
