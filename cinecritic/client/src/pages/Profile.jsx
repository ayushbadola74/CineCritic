import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserReviews } from '../services/api';
import MovieCard from '../components/MovieCard';
import { Heart, MessageSquare, Star, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, favorites } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        try {
          const { data } = await fetchUserReviews(user._id);
          setUserReviews(data);
        } catch (e) {
          console.error('Error loading user reviews:', e);
        } finally {
          setLoadingReviews(false);
        }
      }
    };

    getUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Sign In Required</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Please log in to view your profile, watchlist, and custom reviews.
        </p>
        <Link to="/login" className="btn-auth-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <main className="container" style={{ paddingBottom: '3rem' }}>
      {/* Profile Header Banner */}
      <div className="profile-header">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
          alt={user.name}
          className="profile-avatar-large"
        />
        <div className="profile-details">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <span className="pill pill-gold">
              <Heart size={14} fill="#ffb400" inline /> {favorites.length} Saved Watchlist
            </span>
            <span className="pill">
              <MessageSquare size={14} inline /> {userReviews.length} Reviews Submitted
            </span>
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <section style={{ margin: '3rem 0' }}>
        <div className="section-header">
          <h2 className="section-title">My Saved Watchlist ({favorites.length})</h2>
        </div>
        {favorites.length > 0 ? (
          <div className="movie-grid">
            {favorites.map((fav) => (
              <MovieCard key={fav._id || fav.movieId} movie={fav} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>
            Your watchlist is currently empty. Click the heart icon on any movie card to save it here!
          </p>
        )}
      </section>

      {/* User Posted Reviews Section */}
      <section style={{ margin: '3rem 0' }}>
        <div className="section-header">
          <h2 className="section-title">My Reviews ({userReviews.length})</h2>
        </div>
        {userReviews.length > 0 ? (
          <div className="reviews-section" style={{ margin: 0 }}>
            {userReviews.map((rev) => (
              <div key={rev._id} className="review-card">
                <img src={user.avatar} alt={user.name} className="review-avatar" />
                <div className="review-body">
                  <div className="review-author">
                    <Link to={`/movie/${rev.movieId}`} style={{ color: 'white', textDecoration: 'none' }}>
                      Movie ID: {rev.movieId}
                    </Link>
                    <span style={{ color: 'var(--accent-gold)' }}>★ {rev.rating} / 10</span>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                    Posted on {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>You haven't written any movie reviews yet.</p>
        )}
      </section>
    </main>
  );
};

export default Profile;
