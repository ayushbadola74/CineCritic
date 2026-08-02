import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, User as UserIcon, LogOut, Clapperboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ searchInput, setSearchInput }) => {
  const { user, logout, favorites } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <Clapperboard size={28} color="#e50914" />
          🎬 Cine<span>Critic</span>
        </Link>

        <div className="nav-menu">
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <a href="#popular" className="nav-link">
                Movies
              </a>
            </li>
            <li>
              <a href="#trending" className="nav-link">
                Trending
              </a>
            </li>
            <li>
              <a href="#top-rated" className="nav-link">
                Top Rated
              </a>
            </li>
          </ul>

          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search movies..."
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
            />
          </div>

          <Link to={user ? "/profile" : "/login"} className="watchlist-btn">
            <Heart size={16} color="#e50914" fill="#e50914" />
            Watchlist <span className="watchlist-badge">{favorites.length}</span>
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Link to="/profile" className="nav-user-btn">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="nav-avatar"
                />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-user-btn">
              <UserIcon size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
