const Review = require('../models/Review');
const watchmodeService = require('../services/watchmodeService');

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80';
const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80';

// Curated Top Rated Masterpieces List (Guaranteed high quality)
const CURATED_TOP_RATED_MOVIES = [
  {
    id: 1418767,
    title: "The Shawshank Redemption",
    year: "1994",
    genres: ["Drama", "Crime"],
    rating: 9.5,
    voteCount: 38200,
    runtime: "2h 22m",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    poster: "https://image.tmdb.org/t/p/w342/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A banker sentenced to life in prison begins a difficult new existence behind Shawshank's walls, holding tightly to hope."
  },
  {
    id: 1386160,
    title: "The Dark Knight",
    year: "2008",
    genres: ["Action", "Crime", "Drama"],
    rating: 9.2,
    voteCount: 31000,
    runtime: "2h 32m",
    tagline: "Welcome to a world without rules.",
    poster: "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Batman joins forces with a police lieutenant and a prosecutor to dismantle Gotham's criminal organizations until the Joker unleashes chaos."
  },
  {
    id: 1335706,
    title: "Schindler's List",
    year: "1993",
    genres: ["Biography", "Drama", "History"],
    rating: 9.1,
    voteCount: 22000,
    runtime: "3h 15m",
    tagline: "Whoever saves one life, saves the world entire.",
    poster: "https://image.tmdb.org/t/p/w342/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "During World War II, a wealthy German businessman gradually risks his fortune and safety to save Jewish workers from Nazi brutality."
  },
  {
    id: 1394258,
    title: "The Godfather",
    year: "1972",
    genres: ["Crime", "Drama"],
    rating: 9.0,
    voteCount: 29000,
    runtime: "2h 55m",
    tagline: "An offer you can't refuse.",
    poster: "https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A powerful crime family faces growing threats after its patriarch barely survives an attack, drawing his youngest son into the family empire."
  },
  {
    id: 1182444,
    title: "Inception",
    year: "2010",
    genres: ["Action", "Sci-Fi", "Adventure"],
    rating: 9.0,
    voteCount: 35000,
    runtime: "2h 28m",
    tagline: "Your mind is the scene of the crime.",
    poster: "https://image.tmdb.org/t/p/w342/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A skilled thief who infiltrates dreams to steal secrets is offered a chance to return home by completing the impossible task of dream inception."
  },
  {
    id: 1310542,
    title: "Pulp Fiction",
    year: "1994",
    genres: ["Crime", "Drama"],
    rating: 8.9,
    voteCount: 28000,
    runtime: "2h 34m",
    tagline: "Just because you are a character doesn't mean that you have character.",
    poster: "https://image.tmdb.org/t/p/w342/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertw in four tales of violence and redemption."
  },
  {
    id: 1404362,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: "2001",
    genres: ["Adventure", "Fantasy", "Action"],
    rating: 8.7,
    voteCount: 27000,
    runtime: "2h 58m",
    tagline: "One ring to rule them all.",
    poster: "https://image.tmdb.org/t/p/w342/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A young hobbit inherits a mysterious ring and embarks on a perilous journey across Middle-earth to destroy it."
  },
  {
    id: 1132806,
    title: "Fight Club",
    year: "1999",
    genres: ["Drama", "Thriller"],
    rating: 8.7,
    voteCount: 29000,
    runtime: "2h 19m",
    tagline: "Mischief. Mayhem. Soap.",
    poster: "https://image.tmdb.org/t/p/w342/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "An insomniac office worker and a soap maker form an underground fight club that evolves into much more."
  },
  {
    id: 1184713,
    title: "Interstellar",
    year: "2014",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    rating: 8.6,
    voteCount: 34000,
    runtime: "2h 49m",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    poster: "https://image.tmdb.org/t/p/w342/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  }
];

// Offline fallback dataset for other sections
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
    overview: "A young airbender discovers an ancient power that could save his endangered culture.",
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
    overview: "Charlie and Nick navigate adulthood, growing relationships, and college choices in the final chapter."
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
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Ryland Grace is the sole survivor on a desperate mission to save humanity from an extinction-level solar crisis."
  }
];

// Quality Control helper: format & validate movie objects
const formatWatchmodeMovie = (m) => {
  if (!m) return null;

  const title = (m.title || m.name || m.original_title || '').trim();
  if (!title || title.toLowerCase() === 'untitled' || title.toLowerCase() === 'unknown') {
    return null; // Quality control filter
  }

  const rating = m.user_rating ? Number(Number(m.user_rating).toFixed(1)) : (m.rating || 7.5);
  if (rating < 5.0) {
    return null; // Quality control filter: exclude low quality movies (<5)
  }

  const poster = m.poster || m.posterLarge || m.posterMedium || FALLBACK_POSTER;
  const backdrop = m.backdrop || poster || FALLBACK_BACKDROP;
  const year = m.year ? String(m.year) : (m.release_date ? m.release_date.split('-')[0] : '2026');

  return {
    id: m.id,
    title: title,
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

// GET /api/movies/top-rated (Always serves curated masterpieces)
const getTopRatedMovies = async (req, res) => {
  return res.json(CURATED_TOP_RATED_MOVIES);
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

      // Local fallback search including curated top rated list
      const q = search.toLowerCase();
      const combinedFallback = [...CURATED_TOP_RATED_MOVIES, ...FALLBACK_MOVIES];
      const filtered = combinedFallback.filter(
        (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
      );
      return res.json(filtered);
    }

    return getPopularMovies(req, res);
  } catch (error) {
    return res.json(CURATED_TOP_RATED_MOVIES);
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

  // First check if movie matches one of our curated top rated movies
  const curatedMatch = CURATED_TOP_RATED_MOVIES.find((m) => m.id === movieId);
  if (curatedMatch) {
    let avgRating = curatedMatch.rating;
    if (mongoReviews.length > 0) {
      const sum = mongoReviews.reduce((acc, curr) => acc + curr.rating, 0);
      avgRating = Number(((avgRating + (sum / mongoReviews.length)) / 2).toFixed(1));
    }

    return res.json({
      ...curatedMatch,
      rating: avgRating,
      voteCount: curatedMatch.voteCount + mongoReviews.length,
      reviews: formattedMongoReviews,
      similar: CURATED_TOP_RATED_MOVIES.filter((f) => f.id !== movieId).slice(0, 5)
    });
  }

  try {
    const m = await watchmodeService.getTitleDetails(movieId);

    if (m && m.id) {
      let avgRating = m.user_rating ? Number(Number(m.user_rating).toFixed(1)) : 8.0;
      if (mongoReviews.length > 0) {
        const sum = mongoReviews.reduce((acc, curr) => acc + curr.rating, 0);
        avgRating = Number(((avgRating + (sum / mongoReviews.length)) / 2).toFixed(1));
      }

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
        similar: CURATED_TOP_RATED_MOVIES.slice(0, 5)
      });
    }
  } catch (error) {
    console.warn(`Watchmode details failed for ${movieId}, using fallback:`, error.message);
  }

  // Local fallback for details
  const local = FALLBACK_MOVIES.find((m) => m.id === movieId) || CURATED_TOP_RATED_MOVIES[0];
  return res.json({
    ...local,
    reviews: [...formattedMongoReviews],
    similar: CURATED_TOP_RATED_MOVIES.filter((m) => m.id !== local.id).slice(0, 5)
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
