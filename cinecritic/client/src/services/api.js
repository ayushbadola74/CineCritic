import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL
});

// Attach Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinecritic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const fetchMe = () => API.get('/auth/me');

// Movie Services
export const fetchPopularMovies = () => API.get('/movies/popular');
export const fetchTrendingMovies = () => API.get('/movies/trending');
export const fetchTopRatedMovies = () => API.get('/movies/top-rated');
export const fetchUpcomingMovies = () => API.get('/movies/upcoming');
export const searchMovies = (query) => API.get(`/movies?search=${encodeURIComponent(query)}`);
export const fetchMovieDetails = (id) => API.get(`/movies/${id}`);

// Review Services
export const postReview = (data) => API.post('/reviews', data);
export const fetchMovieReviews = (movieId) => API.get(`/reviews/${movieId}`);
export const fetchUserReviews = (userId) => API.get(`/reviews/user/${userId}`);

// Favorite / Watchlist Services
export const fetchUserFavorites = () => API.get('/favorites');
export const addFavorite = (data) => API.post('/favorites', data);
export const removeFavorite = (movieId) => API.delete(`/favorites/${movieId}`);

export default API;
