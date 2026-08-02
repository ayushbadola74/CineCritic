import React, { createContext, useState, useEffect, useContext } from 'react';
import { signupUser, loginUser, fetchMe, fetchUserFavorites, addFavorite, removeFavorite } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cinecritic_token') || '');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user profile & favorites on mount if token present
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const { data: userData } = await fetchMe();
          setUser(userData);
          const { data: favs } = await fetchUserFavorites();
          setFavorites(favs);
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('cinecritic_token', data.token);
    setToken(data.token);
    setUser(data);
    try {
      const { data: favs } = await fetchUserFavorites();
      setFavorites(favs);
    } catch (e) {}
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await signupUser({ name, email, password });
    localStorage.setItem('cinecritic_token', data.token);
    setToken(data.token);
    setUser(data);
    setFavorites([]);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cinecritic_token');
    setToken('');
    setUser(null);
    setFavorites([]);
  };

  const isFavorite = (movieId) => {
    return favorites.some((f) => f.movieId === Number(movieId));
  };

  const toggleFavorite = async (movie) => {
    if (!user) {
      alert('Please log in to add movies to your Watchlist!');
      return false;
    }

    const movieId = Number(movie.id || movie.movieId);
    const exists = isFavorite(movieId);

    try {
      if (exists) {
        await removeFavorite(movieId);
        setFavorites((prev) => prev.filter((f) => f.movieId !== movieId));
      } else {
        const moviePayload = {
          movieId,
          title: movie.title,
          poster: movie.poster || movie.backdrop || '',
          rating: movie.rating || 0,
          year: movie.year || ''
        };
        const { data } = await addFavorite(moviePayload);
        setFavorites((prev) => [data.favorite, ...prev]);
      }
      return !exists;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return exists;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        favorites,
        loading,
        login,
        signup,
        logout,
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
