const axios = require('axios');
const Review = require('../models/Review');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'd8a30baaabc6ed9ab7c42a6efab19039';

// Rich local movie database for instant fallback if TMDB API is blocked/slow
const FALLBACK_MOVIES = [
  {
    id: 1368337,
    title: "The Odyssey",
    year: "2026",
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 7.7,
    voteCount: 1420,
    runtime: "2h 45m",
    tagline: "The epic return of a king.",
    isPopular: true,
    isTrending: true,
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Odysseus, the legendary King of Ithaca, embarks on a long and perilous journey home following the Trojan War. Throughout his voyage, he is forced to confront the whims of gods, mythological monsters, and trials that stretch both his cunning and his humanity.",
    cast: [
      { id: 1, name: "Matt Damon", character: "Odysseus", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { id: 2, name: "Charlize Theron", character: "Penelope", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 687163,
    title: "Project Hail Mary",
    year: "2026",
    genre: ["Sci-Fi", "Adventure", "Drama"],
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
    overview: "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level solar crisis. Alone in deep space, he must use science and unexpected camaraderie to solve an impossible mystery.",
    cast: [
      { id: 3, name: "Ryan Gosling", character: "Ryland Grace", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: 4, name: "Sandra Hüller", character: "Eva Stratt", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 936075,
    title: "Michael",
    year: "2026",
    genre: ["Drama", "Music", "Biography"],
    rating: 8.7,
    voteCount: 4500,
    runtime: "2h 40m",
    tagline: "The King of Pop.",
    isPopular: true,
    isTrending: true,
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "An in-depth portrait of the complicated man who became the King of Pop, featuring iconic performances that defined a generation.",
    cast: [
      { id: 5, name: "Jaafar Jackson", character: "Michael Jackson", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    rating: 8.5,
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
    genre: ["Action", "Crime", "Drama"],
    rating: 8.5,
    voteCount: 31000,
    runtime: "2h 32m",
    tagline: "Welcome to a world without rules.",
    isPopular: true,
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: [
      { id: 7, name: "Christian Bale", character: "Bruce Wayne / Batman", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { id: 8, name: "Heath Ledger", character: "Joker", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 969681,
    title: "Spider-Man: Brand New Day",
    year: "2026",
    genre: ["Action", "Sci-Fi", "Adventure"],
    rating: 8.2,
    voteCount: 1640,
    runtime: "2h 20m",
    tagline: "A fresh start in a dark neighborhood.",
    isTrending: true,
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Peter Parker navigates life as a street-level vigilante in New York City with no memory of his past relationships.",
    cast: [
      { id: 9, name: "Tom Holland", character: "Peter Parker / Spider-Man", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: 1084244,
    title: "Toy Story 5",
    year: "2026",
    genre: ["Animation", "Comedy", "Family"],
    rating: 7.4,
    voteCount: 2200,
    runtime: "1h 42m",
    tagline: "Tech meets Toys.",
    isUpcoming: true,
    isPopular: true,
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Woody, Buzz Lightyear and the gang face off against the greatest threat to playtime yet: modern electronic gadgets and tablet screens.",
    cast: []
  }
];

// Helper to format TMDB response item
const formatMovie = (m) => ({
  id: m.id,
  title: m.title || m.original_title,
  poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
  backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
  rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 7.5,
  voteCount: m.vote_count || 0,
  year: m.release_date ? m.release_date.split('-')[0] : '2026',
  overview: m.overview || '',
  genre_ids: m.genre_ids || []
});

// GET /api/movies/popular
const getPopularMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY },
      timeout: 2500
    });
    return res.json(response.data.results.map(formatMovie));
  } catch (error) {
    console.warn('TMDB API unreachable, using local popular movies fallback');
    return res.json(FALLBACK_MOVIES.filter(m => m.isPopular));
  }
};

// GET /api/movies/trending
const getTrendingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
      params: { api_key: TMDB_API_KEY },
      timeout: 2500
    });
    return res.json(response.data.results.map(formatMovie));
  } catch (error) {
    console.warn('TMDB API unreachable, using local trending movies fallback');
    return res.json(FALLBACK_MOVIES.filter(m => m.isTrending || m.isPopular));
  }
};

// GET /api/movies/top-rated
const getTopRatedMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: { api_key: TMDB_API_KEY },
      timeout: 2500
    });
    return res.json(response.data.results.map(formatMovie));
  } catch (error) {
    console.warn('TMDB API unreachable, using local top rated movies fallback');
    return res.json(FALLBACK_MOVIES.filter(m => m.isTopRated || m.rating >= 8.0));
  }
};

// GET /api/movies/upcoming
const getUpcomingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: { api_key: TMDB_API_KEY },
      timeout: 2500
    });
    return res.json(response.data.results.map(formatMovie));
  } catch (error) {
    console.warn('TMDB API unreachable, using local upcoming movies fallback');
    return res.json(FALLBACK_MOVIES.filter(m => m.isUpcoming));
  }
};

// GET /api/movies?search=query
const searchMovies = async (req, res) => {
  const { search } = req.query;
  try {
    if (search) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
          params: { api_key: TMDB_API_KEY, query: search },
          timeout: 2500
        });
        if (response.data.results.length > 0) {
          return res.json(response.data.results.map(formatMovie));
        }
      } catch (e) {}

      // Local fallback search
      const q = search.toLowerCase();
      const filtered = FALLBACK_MOVIES.filter(
        m => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
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

  const formattedMongoReviews = mongoReviews.map(r => ({
    _id: r._id,
    author: r.username || r.userId?.name || 'CineCritic User',
    avatar: r.userAvatar || r.userId?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently'
  }));

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'videos,credits,recommendations'
      },
      timeout: 2500
    });

    const m = response.data;
    const trailer = m.videos?.results?.find(
      v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    let avgRating = m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0;
    if (mongoReviews.length > 0) {
      const sum = mongoReviews.reduce((acc, curr) => acc + curr.rating, 0);
      avgRating = Number(((avgRating + (sum / mongoReviews.length)) / 2).toFixed(1));
    }

    return res.json({
      id: m.id,
      title: m.title || m.original_title,
      tagline: m.tagline || '',
      rating: avgRating,
      voteCount: (m.vote_count || 0) + mongoReviews.length,
      year: m.release_date ? m.release_date.split('-')[0] : '2026',
      runtime: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : '2h 15m',
      overview: m.overview || '',
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
      backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
      genres: m.genres ? m.genres.map(g => g.name) : ['Action', 'Adventure'],
      trailerUrl: trailer && trailer.key ? `https://www.youtube.com/embed/${trailer.key}` : 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      cast: m.credits?.cast ? m.credits.cast.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        character: c.character || 'Actor',
        photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      })) : [],
      reviews: formattedMongoReviews,
      similar: m.recommendations?.results ? m.recommendations.results.slice(0, 6).map(formatMovie) : FALLBACK_MOVIES.slice(1, 6)
    });
  } catch (error) {
    // Local fallback for details
    const local = FALLBACK_MOVIES.find(m => m.id === movieId) || FALLBACK_MOVIES[0];
    return res.json({
      ...local,
      reviews: [...formattedMongoReviews],
      similar: FALLBACK_MOVIES.filter(m => m.id !== local.id).slice(0, 5)
    });
  }
};

module.exports = {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails
};
