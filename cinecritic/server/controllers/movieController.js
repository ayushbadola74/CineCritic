const Review = require('../models/Review');
const watchmodeService = require('../services/watchmodeService');

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80';
const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80';

// Offline fallback dataset if API is blocked or offline
const FALLBACK_MOVIES = [
  {
    id: 1684276,
    title: "Avatar Aang: The Last Airbender",
    year: "2026",
    genres: ["Animation", "Action", "Adventure"],
    rating: 8.1,
    voteCount: 1420,
    runtime: "1h 39m",
    tagline: "The epic journey of the last airbender.",
    isPopular: true,
    isTrending: true,
    isUpcoming: true,
    poster: "https://image.tmdb.org/t/p/w342/3sgnSfNT27Bx5O5ukr7B26mhEQq.jpg",
    backdrop: "https://image.tmdb.org/t/p/w780/sS3zGYFPcfM5pArVNWl6qLyaSmU.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A young airbender discovers an ancient power that could save his endangered culture. Joined by trusted friends, he travels across the world to find it.",
    cast: [
      { id: 1, name: "Gordon Cormier", character: "Aang", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { id: 2, name: "Kiawentiio", character: "Katara", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 1996547,
    title: "Heartstopper Forever",
    year: "2026",
    genres: ["Drama", "Romance"],
    rating: 7.2,
    voteCount: 3120,
    runtime: "1h 50m",
    tagline: "Love grows stronger with time.",
    isPopular: true,
    isTrending: true,
    poster: "https://image.tmdb.org/t/p/w342/r4lVJVO1BeBb11cBcXBdbHc9e9k.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Charlie and Nick navigate adulthood, growing relationships, and college choices in the final chapter of their journey.",
    cast: [
      { id: 3, name: "Kit Connor", character: "Nick Nelson", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: 4, name: "Joe Locke", character: "Charlie Spring", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 687163,
    title: "Project Hail Mary",
    year: "2026",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 8.7,
    voteCount: 3120,
    runtime: "2h 35m",
    tagline: "Science will save humanity.",
    isPopular: true,
    isTrending: true,
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level solar crisis.",
    cast: [
      { id: 5, name: "Ryan Gosling", character: "Ryland Grace", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    rating: 8.6,
    voteCount: 34000,
    runtime: "2h 49m",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    isPopular: true,
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    cast: [
      { id: 6, name: "Matthew McConaughey", character: "Joseph Cooper", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: "2008",
    genres: ["Action", "Crime", "Drama"],
    rating: 8.5,
    voteCount: 31000,
    runtime: "2h 32m",
    tagline: "Welcome to a world without rules.",
    isPopular: true,
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests of his ability.",
    cast: [
      { id: 7, name: "Christian Bale", character: "Bruce Wayne / Batman", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ]
  }
];

// Helper to format Watchmode response item into standard movie format
const formatWatchmodeMovie = (m) => {
  if (!m) return null;

  const poster = m.poster || m.posterLarge || m.posterMedium || FALLBACK_POSTER;
  const backdrop = m.backdrop || poster || FALLBACK_BACKDROP;
  const rating = m.user_rating ? Number(Number(m.user_rating).toFixed(1)) : (m.rating || 7.5);
  const year = m.year ? String(m.year) : (m.release_date ? m.release_date.split('-')[0] : '2026');

  return {
    id: m.id,
    title: m.title || m.name || m.original_title || 'Untitled Movie',
    poster: poster,
    backdrop: backdrop,
    rating: rating,
    voteCount: m.voteCount || m.critic_score || 0,
    year: year,
    overview: m.plot_overview || m.overview || '',
    runtime: m.runtime_minutes ? `${Math.floor(m.runtime_minutes / 60)}h ${m.runtime_minutes % 60}m` : (m.runtime || '2h 15m'),
    genres: m.genre_names || m.genres || ['Action', 'Adventure']
  };
};

// GET /api/movies/popular
const getPopularMovies = async (req, res) => {
  try {
    const titles = await watchmodeService.fetchListTitles({ sort_by: 'popularity_desc', limit: 12 });
    if (titles && titles.length > 0) {
      const enriched = await watchmodeService.enrichTitlesWithDetails(titles, 10);
      const formatted = enriched.map(formatWatchmodeMovie).filter(Boolean);
      if (formatted.length > 0) {
        return res.json(formatted);
      }
    }
  } catch (error) {
    console.warn('Watchmode API error, using local popular movies fallback:', error.message);
  }
  return res.json(FALLBACK_MOVIES.filter((m) => m.isPopular));
};

// GET /api/movies/trending
const getTrendingMovies = async (req, res) => {
  try {
    const titles = await watchmodeService.fetchListTitles({ sort_by: 'relevance_desc', limit: 12 });
    if (titles && titles.length > 0) {
      const enriched = await watchmodeService.enrichTitlesWithDetails(titles, 10);
      const formatted = enriched.map(formatWatchmodeMovie).filter(Boolean);
      if (formatted.length > 0) {
        return res.json(formatted);
      }
    }
  } catch (error) {
    console.warn('Watchmode API error, using local trending movies fallback:', error.message);
  }
  return res.json(FALLBACK_MOVIES.filter((m) => m.isTrending || m.isPopular));
};

// GET /api/movies/top-rated
const getTopRatedMovies = async (req, res) => {
  try {
    const titles = await watchmodeService.fetchListTitles({ sort_by: 'popularity_desc', limit: 12, page: 2 });
    if (titles && titles.length > 0) {
      const enriched = await watchmodeService.enrichTitlesWithDetails(titles, 10);
      const formatted = enriched
        .map(formatWatchmodeMovie)
        .filter(Boolean)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
      if (formatted.length > 0) {
        return res.json(formatted);
      }
    }
  } catch (error) {
    console.warn('Watchmode API error, using local top rated movies fallback:', error.message);
  }
  return res.json(FALLBACK_MOVIES.filter((m) => m.isTopRated || m.rating >= 8.0));
};

// GET /api/movies/upcoming
const getUpcomingMovies = async (req, res) => {
  try {
    const titles = await watchmodeService.fetchListTitles({ sort_by: 'release_date_desc', limit: 12 });
    if (titles && titles.length > 0) {
      const enriched = await watchmodeService.enrichTitlesWithDetails(titles, 10);
      const formatted = enriched.map(formatWatchmodeMovie).filter(Boolean);
      if (formatted.length > 0) {
        return res.json(formatted);
      }
    }
  } catch (error) {
    console.warn('Watchmode API error, using local upcoming movies fallback:', error.message);
  }
  return res.json(FALLBACK_MOVIES.filter((m) => m.isUpcoming));
};

// GET /api/movies?search=query
const searchMovies = async (req, res) => {
  const { search } = req.query;
  try {
    if (search) {
      const results = await watchmodeService.searchMovies(search);
      if (results && results.length > 0) {
        const enriched = await watchmodeService.enrichTitlesWithDetails(results, 8);
        const formatted = enriched.map(formatWatchmodeMovie).filter(Boolean);
        if (formatted.length > 0) {
          return res.json(formatted);
        }
      }

      // Local fallback search
      const q = search.toLowerCase();
      const filtered = FALLBACK_MOVIES.filter(
        (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
      );
      return res.json(filtered);
    }

    return getPopularMovies(req, res);
  } catch (error) {
    return res.json(FALLBACK_MOVIES);
  }
};

// GET /api/movies/:id
const getMovieDetails = async (req, res) => {
  const movieId = Number(req.params.id);

  // Retrieve MongoDB user reviews for this movie
  let mongoReviews = [];
  try {
    mongoReviews = await Review.find({ movieId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
  } catch (e) {}

  const formattedMongoReviews = mongoReviews.map((r) => ({
    _id: r._id,
    author: r.username || r.userId?.name || 'CineCritic User',
    avatar: r.userAvatar || r.userId?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently'
  }));

  try {
    const m = await watchmodeService.getTitleDetails(movieId);

    if (m && m.id) {
      let avgRating = m.user_rating ? Number(Number(m.user_rating).toFixed(1)) : 8.0;
      if (mongoReviews.length > 0) {
        const sum = mongoReviews.reduce((acc, curr) => acc + curr.rating, 0);
        avgRating = Number(((avgRating + (sum / mongoReviews.length)) / 2).toFixed(1));
      }

      // Extract cast from cast_crew array if available
      let castList = [];
      if (Array.isArray(m.cast_crew)) {
        castList = m.cast_crew
          .filter((person) => person.type === 'Cast' || person.role === 'Actor' || person.headshot)
          .slice(0, 10)
          .map((c) => ({
            id: c.person_id || c.id,
            name: c.full_name || c.name,
            character: c.role || c.character || 'Actor',
            photo: c.headshot || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
          }));
      }

      const poster = m.poster || m.posterLarge || FALLBACK_POSTER;
      const backdrop = m.backdrop || poster || FALLBACK_BACKDROP;

      return res.json({
        id: m.id,
        title: m.title || m.original_title,
        tagline: m.will_you_like_this || m.review_summary || '',
        rating: avgRating,
        voteCount: (m.critic_score || 0) + mongoReviews.length,
        year: m.year ? String(m.year) : (m.release_date ? m.release_date.split('-')[0] : '2026'),
        runtime: m.runtime_minutes ? `${Math.floor(m.runtime_minutes / 60)}h ${m.runtime_minutes % 60}m` : '2h 15m',
        overview: m.plot_overview || m.overview || '',
        poster: poster,
        backdrop: backdrop,
        genres: m.genre_names || ['Action', 'Adventure'],
        trailerUrl: m.trailer || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        cast: castList,
        reviews: formattedMongoReviews,
        similar: FALLBACK_MOVIES.filter((f) => f.id !== m.id).slice(0, 5)
      });
    }
  } catch (error) {
    console.warn(`Watchmode details failed for ${movieId}, using fallback:`, error.message);
  }

  // Local fallback for details
  const local = FALLBACK_MOVIES.find((m) => m.id === movieId) || FALLBACK_MOVIES[0];
  return res.json({
    ...local,
    reviews: [...formattedMongoReviews],
    similar: FALLBACK_MOVIES.filter((m) => m.id !== local.id).slice(0, 5)
  });
};

module.exports = {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails
};
