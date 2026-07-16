// CineCritic Main App Logic - Fully Interactive TMDB Powered
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 CineCritic App - Fully Interactive Mode Initialized');

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

  // 1. NAVBAR LIVE SEARCH & FLOATING DROPDOWN
  const searchInput = document.getElementById('searchInput');
  const searchWrapper = document.querySelector('.search-wrapper');
  let searchDropdown = document.createElement('div');
  searchDropdown.className = 'search-dropdown';
  searchDropdown.style.display = 'none';
  if (searchWrapper) searchWrapper.appendChild(searchDropdown);

  let searchDebounce = null;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(searchDebounce);

      if (!query) {
        searchDropdown.style.display = 'none';
        return;
      }

      searchDebounce = setTimeout(async () => {
        try {
          searchDropdown.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">Searching TMDB...</div>';
          searchDropdown.style.display = 'flex';

          const res = await fetch(`${API_BASE_URL}?search=${encodeURIComponent(query)}`);
          if (res.ok) {
            const results = await res.json();
            renderSearchDropdown(results);
          }
        } catch (err) {
          searchDropdown.innerHTML = '<div style="padding: 1rem; color: #ef4444; font-size: 0.85rem;">Failed to load search results</div>';
        }
      }, 300);
    });
  }

  function renderSearchDropdown(results) {
    if (!results || results.length === 0) {
      searchDropdown.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">No movies found</div>';
      return;
    }

    searchDropdown.innerHTML = '';
    results.slice(0, 7).forEach(movie => {
      const poster = movie.poster_path 
        ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w185${movie.poster_path}`)
        : (movie.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=200&q=80');

      const rating = movie.vote_average !== undefined ? movie.vote_average : (movie.rating || 'N/A');
      const year = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '');

      const item = document.createElement('a');
      item.href = `movie.html?id=${movie.id}`;
      item.className = 'search-dropdown-item';
      item.innerHTML = `
        <img class="search-dropdown-poster" src="${poster}" alt="${movie.title}" loading="lazy">
        <div class="search-dropdown-info">
          <div class="search-dropdown-title">${movie.title || movie.original_title}</div>
          <div class="search-dropdown-meta">
            <span style="color: var(--accent-gold);">★ ${rating}</span>
            ${year ? `<span>• ${year}</span>` : ''}
          </div>
        </div>
      `;
      searchDropdown.appendChild(item);
    });
  }

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (searchWrapper && !searchWrapper.contains(e.target)) {
      searchDropdown.style.display = 'none';
    }
  });

  // 2. MOVIE CARD GENERATOR WITH HOVER OVERLAY
  function createMovieCard(movie) {
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

    const title = movie.title || movie.original_title || 'Untitled';
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
        <div class="card-overlay">
          <div class="card-overlay-title">${title}</div>
          <div class="card-overlay-rating">★ ${rating}</div>
          <button class="card-overlay-btn">View Details</button>
        </div>
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

  // SKELETON LOADER
  function renderSkeletons(container, count = 6) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const skel = document.createElement('div');
      skel.className = 'skeleton-card';
      container.appendChild(skel);
    }
  }

  // 3. NETFLIX-STYLE HERO CAROUSEL WITH AUTO-SLIDE
  let heroCarouselTimer = null;
  let heroMoviesList = [];
  let currentHeroIndex = 0;

  function loadHero(movies) {
    if (!movies || movies.length === 0) return;
    heroMoviesList = movies.slice(0, 5); // Pick top 5 featured movies
    currentHeroIndex = 0;
    renderHeroSpotlight(heroMoviesList[0]);

    // Start auto carousel
    if (heroCarouselTimer) clearInterval(heroCarouselTimer);
    heroCarouselTimer = setInterval(() => {
      currentHeroIndex = (currentHeroIndex + 1) % heroMoviesList.length;
      renderHeroSpotlight(heroMoviesList[currentHeroIndex]);
    }, 6000);

    // Pause carousel on hover
    const heroBanner = document.getElementById('heroBanner');
    if (heroBanner) {
      heroBanner.onmouseenter = () => clearInterval(heroCarouselTimer);
      heroBanner.onmouseleave = () => {
        clearInterval(heroCarouselTimer);
        heroCarouselTimer = setInterval(() => {
          currentHeroIndex = (currentHeroIndex + 1) % heroMoviesList.length;
          renderHeroSpotlight(heroMoviesList[currentHeroIndex]);
        }, 6000);
      };
    }
  }

  function renderHeroSpotlight(movie) {
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
    if (heroGenre) heroGenre.textContent = Array.isArray(movie.genre) ? movie.genre.join(' • ') : (movie.genre || 'Action • Feature');
    if (heroRuntime) heroRuntime.textContent = movie.runtime || '2h 15m';
    if (heroDesc) heroDesc.textContent = movie.overview;
    if (heroMoreInfoBtn) heroMoreInfoBtn.href = `movie.html?id=${movie.id}`;
    if (heroWatchTrailerBtn) {
      heroWatchTrailerBtn.onclick = () => openModal(movie.trailerUrl || `https://www.youtube.com/embed/dQw4w9WgXcQ`);
    }
  }

  // 4. TRAILER MODAL
  const trailerModal = document.getElementById('trailerModal');
  const trailerIframe = document.getElementById('trailerIframe');
  const closeTrailerBtn = document.getElementById('closeTrailerBtn');

  function openModal(url) {
    if (!trailerModal || !trailerIframe) return;
    trailerIframe.src = url + (url.includes('?') ? '&' : '?') + "autoplay=1";
    trailerModal.classList.add('open');
  }

  function closeModal() {
    if (!trailerModal || !trailerIframe) return;
    trailerIframe.src = "";
    trailerModal.classList.remove('open');
  }

  if (closeTrailerBtn) closeTrailerBtn.onclick = closeModal;
  if (trailerModal) {
    trailerModal.addEventListener('click', (e) => {
      if (e.target === trailerModal) closeModal();
    });
  }

  // 5. INDEPENDENT SECTION FETCHERS
  async function fetchMovies(endpoint) {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  }

  function renderMovies(container, movies) {
    if (!container) return;
    container.innerHTML = '';
    if (!movies || movies.length === 0) {
      container.innerHTML = '<div style="padding: 2rem; color: var(--text-muted); font-size: 1rem; width: 100%;">No movies found</div>';
      return;
    }
    movies.forEach(m => container.appendChild(createMovieCard(m)));
  }

  async function loadPopularMovies() {
    const container = document.getElementById('popularRow');
    renderSkeletons(container);
    try {
      const movies = await fetchMovies('popular');
      renderMovies(container, movies);
    } catch (e) {
      if (container) container.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load movies</div>';
    }
  }

  async function loadTrendingMovies() {
    const container = document.getElementById('trendingRow');
    renderSkeletons(container);
    try {
      const movies = await fetchMovies('trending');
      renderMovies(container, movies);
      loadHero(movies); // Initialize Hero Spotlight from Trending movies
    } catch (e) {
      if (container) container.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load movies</div>';
    }
  }

  async function loadTopRatedMovies() {
    const container = document.getElementById('topRatedRow');
    renderSkeletons(container);
    try {
      const movies = await fetchMovies('top-rated');
      renderMovies(container, movies);
    } catch (e) {
      if (container) container.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load movies</div>';
    }
  }

  async function loadUpcomingMovies() {
    const container = document.getElementById('upcomingRow');
    renderSkeletons(container);
    try {
      const movies = await fetchMovies('upcoming');
      renderMovies(container, movies);
    } catch (e) {
      if (container) container.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load movies</div>';
    }
  }

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
    renderSkeletons(watchlistRow, 3);

    try {
      const fetched = await Promise.all(
        list.map(async (id) => {
          try {
            const res = await fetch(`${API_BASE_URL}/${id}`);
            if (res.ok) return await res.json();
          } catch (e) { }
          return null;
        })
      );
      const valid = fetched.filter(Boolean);
      renderMovies(watchlistRow, valid);
    } catch (e) {
      watchlistRow.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load watchlist</div>';
    }
  }

  // 6. CATEGORY & GENRE FILTERING
  const genreFilterBar = document.getElementById('genreFilterBar');
  const searchResultsHeader = document.getElementById('searchResultsHeader');
  const searchResultsRow = document.getElementById('searchResultsRow');
  const searchTitle = document.getElementById('searchTitle');

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
          if (searchResultsRow) {
            searchResultsRow.style.display = 'flex';
            renderSkeletons(searchResultsRow);
          }
          if (searchResultsHeader) searchResultsHeader.style.display = 'block';
          if (searchTitle) searchTitle.textContent = `${selectedGenre} Movies`;

          const res = await fetch(`${API_BASE_URL}?genre=${encodeURIComponent(selectedGenre)}`);
          if (res.ok) {
            const filtered = await res.json();
            if (searchTitle) searchTitle.textContent = `${selectedGenre} Movies (${filtered.length})`;
            renderMovies(searchResultsRow, filtered);
          }
        } catch (err) {
          if (searchResultsRow) searchResultsRow.innerHTML = '<div style="padding: 2rem; color: #ef4444; width: 100%;">Failed to load movies</div>';
        }
      }
    });
  }

  // Global Horizontal Carousel Scroll Control
  window.scrollCarousel = function(rowId, delta) {
    const row = document.getElementById(rowId);
    if (row) {
      row.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  // INITIALIZE APP ON PAGE LOAD
  updateWatchlistCount();
  loadPopularMovies();
  loadTrendingMovies();
  loadTopRatedMovies();
  loadUpcomingMovies();
  loadWatchlistMovies();
});
