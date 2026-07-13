// CineCritic Main App Logic - Independent TMDB API Endpoints
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 CineCritic App loaded with independent TMDB section endpoints');

  const API_BASE_URL = 'http://localhost:5000/api/movies';

  // Watchlist LocalStorage Helpers
  function getWatchlist() {
    return JSON.parse(localStorage.getItem('cinecritic_watchlist') || '[]');
  }

  function setWatchlist(list) {
    localStorage.setItem('cinecritic_watchlist', JSON.stringify(list));
    updateWatchlistCount();
    loadWatchlistMovies();
  }

  function toggleWatchlist(movieId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    let list = getWatchlist();
    const strId = String(movieId);
    const numId = Number(movieId);

    if (list.includes(movieId) || list.includes(strId) || list.includes(numId)) {
      list = list.filter(id => String(id) !== strId && Number(id) !== numId);
    } else {
      list.push(movieId);
    }
    setWatchlist(list);

    // Refresh rows so heart icon updates
    loadPopularMovies();
    loadTrendingMovies();
    loadTopRatedMovies();
    loadUpcomingMovies();
  }

  function updateWatchlistCount() {
    const watchlistCountBadge = document.getElementById('watchlistCount');
    if (watchlistCountBadge) {
      watchlistCountBadge.textContent = getWatchlist().length;
    }
  }

  // Universal Movie Card Renderer
  function createMovieCard(movie) {
    // Poster: https://image.tmdb.org/t/p/w500 + poster_path
    let posterUrl = '';
    if (movie.poster_path) {
      posterUrl = movie.poster_path.startsWith('http') 
        ? movie.poster_path 
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    } else if (movie.poster) {
      posterUrl = movie.poster;
    } else {
      posterUrl = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';
    }

    // Title
    const title = movie.title || movie.original_title || 'Untitled';

    // Rating (vote_average)
    let rating = 'N/A';
    if (movie.vote_average !== undefined && movie.vote_average !== null) {
      rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : movie.vote_average;
    } else if (movie.rating) {
      rating = movie.rating;
    }

    const year = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '');
    const genreTag = Array.isArray(movie.genre) && movie.genre.length > 0 
      ? movie.genre[0] 
      : (typeof movie.genre === 'string' ? movie.genre : '');

    const watchlist = getWatchlist();
    const isSaved = watchlist.includes(movie.id) || watchlist.includes(String(movie.id)) || watchlist.includes(Number(movie.id));

    const card = document.createElement('a');
    card.href = `movie.html?id=${movie.id}`;
    card.className = 'movie-card';

    card.innerHTML = `
      <div class="poster-wrapper">
        <img class="movie-poster" src="${posterUrl}" alt="${title}" loading="lazy">
        <div class="movie-badge-rating">★ ${rating}</div>
        <button class="watchlist-toggle-btn ${isSaved ? 'active' : ''}" title="${isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}">
          ${isSaved ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${title}</h3>
        <div class="movie-submeta">
          ${year ? `<span>${year}</span>` : ''}
          ${genreTag ? `<span>• ${genreTag}</span>` : ''}
        </div>
      </div>
    `;

    const toggleBtn = card.querySelector('.watchlist-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => toggleWatchlist(movie.id, e));
    }

    return card;
  }

  // 1. Popular Movies: GET /api/movies/popular
  async function loadPopularMovies() {
    const container = document.getElementById('popularRow');
    if (!container) return;

    container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); font-size: 1.1rem; width: 100%;">Loading...</div>';

    try {
      const response = await fetch(`${API_BASE_URL}/popular`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const movies = await response.json();

      container.innerHTML = '';
      if (!movies || movies.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">No popular movies found</div>';
        return;
      }

      movies.forEach(movie => {
        container.appendChild(createMovieCard(movie));
      });

      if (movies[0]) setupHeroSpotlight(movies[0]);

    } catch (error) {
      console.error('Failed to load popular movies:', error);
      container.innerHTML = '<div style="padding: 2rem; color: #ef4444; font-size: 1.1rem; width: 100%;">Failed to load movies</div>';
    }
  }

  // 2. Trending Movies: GET /api/movies/trending
  async function loadTrendingMovies() {
    const container = document.getElementById('trendingRow');
    if (!container) return;

    container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); font-size: 1.1rem; width: 100%;">Loading...</div>';

    try {
      const response = await fetch(`${API_BASE_URL}/trending`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const movies = await response.json();

      container.innerHTML = '';
      if (!movies || movies.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">No trending movies found</div>';
        return;
      }

      movies.forEach(movie => {
        container.appendChild(createMovieCard(movie));
      });
    } catch (error) {
      console.error('Failed to load trending movies:', error);
      container.innerHTML = '<div style="padding: 2rem; color: #ef4444; font-size: 1.1rem; width: 100%;">Failed to load movies</div>';
    }
  }

  // 3. Top Rated Movies: GET /api/movies/top-rated
  async function loadTopRatedMovies() {
    const container = document.getElementById('topRatedRow');
    if (!container) return;

    container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); font-size: 1.1rem; width: 100%;">Loading...</div>';

    try {
      const response = await fetch(`${API_BASE_URL}/top-rated`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const movies = await response.json();

      container.innerHTML = '';
      if (!movies || movies.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">No top rated movies found</div>';
        return;
      }

      movies.forEach(movie => {
        container.appendChild(createMovieCard(movie));
      });
    } catch (error) {
      console.error('Failed to load top rated movies:', error);
      container.innerHTML = '<div style="padding: 2rem; color: #ef4444; font-size: 1.1rem; width: 100%;">Failed to load movies</div>';
    }
  }

  // 4. Upcoming Movies: GET /api/movies/upcoming
  async function loadUpcomingMovies() {
    const container = document.getElementById('upcomingRow');
    if (!container) return;

    container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); font-size: 1.1rem; width: 100%;">Loading...</div>';

    try {
      const response = await fetch(`${API_BASE_URL}/upcoming`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const movies = await response.json();

      container.innerHTML = '';
      if (!movies || movies.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">No upcoming movies found</div>';
        return;
      }

      movies.forEach(movie => {
        container.appendChild(createMovieCard(movie));
      });
    } catch (error) {
      console.error('Failed to load upcoming movies:', error);
      container.innerHTML = '<div style="padding: 2rem; color: #ef4444; font-size: 1.1rem; width: 100%;">Failed to load movies</div>';
    }
  }

  // Watchlist Section Loader
  async function loadWatchlistMovies() {
    const watchlistSection = document.getElementById('watchlist');
    const watchlistRow = document.getElementById('watchlistRow');
    if (!watchlistSection || !watchlistRow) return;

    const list = getWatchlist();
    if (list.length === 0) {
      watchlistSection.style.display = 'none';
      return;
    }

    watchlistSection.style.display = 'block';
    watchlistRow.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); font-size: 1.1rem; width: 100%;">Loading watchlist...</div>';

    try {
      const fetchedMovies = await Promise.all(
        list.map(async (id) => {
          try {
            const res = await fetch(`${API_BASE_URL}/${id}`);
            if (res.ok) return await res.json();
          } catch (e) { }
          return null;
        })
      );

      const validMovies = fetchedMovies.filter(Boolean);
      watchlistRow.innerHTML = '';
      if (validMovies.length === 0) {
        watchlistSection.style.display = 'none';
        return;
      }
      validMovies.forEach(movie => {
        watchlistRow.appendChild(createMovieCard(movie));
      });
    } catch (e) {
      watchlistRow.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load watchlist</div>';
    }
  }

  // Setup Spotlight Hero
  function setupHeroSpotlight(movie) {
    if (!movie) return;
    const heroBanner = document.getElementById('heroBanner');
    const heroTitle = document.getElementById('heroTitle');
    const heroRating = document.getElementById('heroRating');
    const heroYear = document.getElementById('heroYear');
    const heroGenre = document.getElementById('heroGenre');
    const heroRuntime = document.getElementById('heroRuntime');
    const heroDesc = document.getElementById('heroDesc');
    const heroMoreInfoBtn = document.getElementById('heroMoreInfoBtn');
    const heroWatchTrailerBtn = document.getElementById('heroWatchTrailerBtn');

    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : (movie.backdrop || movie.poster);
    if (heroBanner && backdropUrl) heroBanner.style.backgroundImage = `url('${backdropUrl}')`;
    if (heroTitle) heroTitle.textContent = movie.title || movie.original_title;
    if (heroRating) heroRating.textContent = movie.vote_average !== undefined ? movie.vote_average : movie.rating;
    if (heroYear) heroYear.textContent = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '');
    if (heroGenre) heroGenre.textContent = Array.isArray(movie.genre) ? movie.genre.join(' • ') : (movie.genre || 'Action • Movie');
    if (heroRuntime) heroRuntime.textContent = movie.runtime || '2h 15m';
    if (heroDesc) heroDesc.textContent = movie.overview;
    if (heroMoreInfoBtn) heroMoreInfoBtn.href = `movie.html?id=${movie.id}`;
    if (heroWatchTrailerBtn && movie.trailerUrl) {
      heroWatchTrailerBtn.onclick = () => openTrailerModal(movie.trailerUrl);
    }
  }

  // Live Search Input Handler
  const searchInput = document.getElementById('searchInput');
  const searchResultsHeader = document.getElementById('searchResultsHeader');
  const searchResultsRow = document.getElementById('searchResultsRow');
  const searchTitle = document.getElementById('searchTitle');
  let searchDebounceTimeout = null;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(searchDebounceTimeout);

      if (!query) {
        if (searchResultsHeader) searchResultsHeader.style.display = 'none';
        if (searchResultsRow) searchResultsRow.style.display = 'none';
        return;
      }

      searchDebounceTimeout = setTimeout(async () => {
        try {
          if (searchResultsRow) searchResultsRow.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">Loading...</div>';
          const res = await fetch(`${API_BASE_URL}?search=${encodeURIComponent(query)}`);
          if (res.ok) {
            const results = await res.json();
            if (searchResultsHeader) searchResultsHeader.style.display = 'block';
            if (searchTitle) searchTitle.textContent = `Search Results for "${query}" (${results.length})`;
            if (searchResultsRow) {
              searchResultsRow.style.display = 'flex';
              searchResultsRow.innerHTML = '';
              if (results.length === 0) {
                searchResultsRow.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">No movies found</div>';
              } else {
                results.forEach(m => searchResultsRow.appendChild(createMovieCard(m)));
              }
            }
          }
        } catch (err) {
          if (searchResultsRow) searchResultsRow.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load movies</div>';
        }
      }, 300);
    });
  }

  // Genre Filter Bar Handler
  const genreFilterBar = document.getElementById('genreFilterBar');
  if (genreFilterBar) {
    genreFilterBar.addEventListener('click', async (e) => {
      const pill = e.target.closest('.genre-pill');
      if (!pill) return;

      document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedGenre = pill.dataset.genre;
      if (selectedGenre === 'All') {
        if (searchResultsHeader) searchResultsHeader.style.display = 'none';
        if (searchResultsRow) searchResultsRow.style.display = 'none';
      } else {
        try {
          if (searchResultsRow) searchResultsRow.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">Loading...</div>';
          const res = await fetch(`${API_BASE_URL}?genre=${encodeURIComponent(selectedGenre)}`);
          if (res.ok) {
            const filtered = await res.json();
            if (searchResultsHeader) searchResultsHeader.style.display = 'block';
            if (searchTitle) searchTitle.textContent = `${selectedGenre} Movies (${filtered.length})`;
            if (searchResultsRow) {
              searchResultsRow.style.display = 'flex';
              searchResultsRow.innerHTML = '';
              if (filtered.length === 0) {
                searchResultsRow.innerHTML = '<div style="padding: 2rem; color: var(--text-muted, #94a3b8); width: 100%;">No movies found</div>';
              } else {
                filtered.forEach(m => searchResultsRow.appendChild(createMovieCard(m)));
              }
            }
          }
        } catch (err) {
          if (searchResultsRow) searchResultsRow.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load movies</div>';
        }
      }
    });
  }

  // Trailer Modal Controls
  const trailerModal = document.getElementById('trailerModal');
  const trailerIframe = document.getElementById('trailerIframe');
  const closeTrailerBtn = document.getElementById('closeTrailerBtn');

  function openTrailerModal(url) {
    if (!trailerModal || !trailerIframe) return;
    trailerIframe.src = url + (url.includes('?') ? '&' : '?') + "autoplay=1";
    trailerModal.classList.add('open');
  }

  function closeTrailerModal() {
    if (!trailerModal || !trailerIframe) return;
    trailerIframe.src = "";
    trailerModal.classList.remove('open');
  }

  if (closeTrailerBtn) closeTrailerBtn.onclick = closeTrailerModal;
  if (trailerModal) {
    trailerModal.addEventListener('click', (e) => {
      if (e.target === trailerModal) closeTrailerModal();
    });
  }

  // Global Horizontal Carousel Scroll Control
  window.scrollCarousel = function(rowId, delta) {
    const row = document.getElementById(rowId);
    if (row) {
      row.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  // ON PAGE LOAD: Execute all 4 independent fetch functions
  updateWatchlistCount();
  loadPopularMovies();
  loadTrendingMovies();
  loadTopRatedMovies();
  loadUpcomingMovies();
  loadWatchlistMovies();
});
