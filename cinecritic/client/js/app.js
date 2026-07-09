// CineCritic Main App Logic
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 CineCritic App loaded successfully');

  // DOM Elements
  const heroBanner = document.getElementById('heroBanner');
  const heroTitle = document.getElementById('heroTitle');
  const heroRating = document.getElementById('heroRating');
  const heroYear = document.getElementById('heroYear');
  const heroGenre = document.getElementById('heroGenre');
  const heroRuntime = document.getElementById('heroRuntime');
  const heroDesc = document.getElementById('heroDesc');
  const heroWatchTrailerBtn = document.getElementById('heroWatchTrailerBtn');
  const heroMoreInfoBtn = document.getElementById('heroMoreInfoBtn');

  const popularRow = document.getElementById('popularRow');
  const trendingRow = document.getElementById('trendingRow');
  const topRatedRow = document.getElementById('topRatedRow');
  const upcomingRow = document.getElementById('upcomingRow');
  const watchlistRow = document.getElementById('watchlistRow');
  const watchlistSection = document.getElementById('watchlist');
  const watchlistCountBadge = document.getElementById('watchlistCount');

  const searchInput = document.getElementById('searchInput');
  const searchResultsHeader = document.getElementById('searchResultsHeader');
  const searchResultsRow = document.getElementById('searchResultsRow');
  const searchTitle = document.getElementById('searchTitle');

  const genreFilterBar = document.getElementById('genreFilterBar');

  const trailerModal = document.getElementById('trailerModal');
  const trailerIframe = document.getElementById('trailerIframe');
  const closeTrailerBtn = document.getElementById('closeTrailerBtn');

  let allMovies = [...MOVIES_DATABASE];

  // Watchlist LocalStorage State
  function getWatchlist() {
    return JSON.parse(localStorage.getItem('cinecritic_watchlist') || '[]');
  }

  function setWatchlist(list) {
    localStorage.setItem('cinecritic_watchlist', JSON.stringify(list));
    updateWatchlistCount();
  }

  function toggleWatchlist(movieId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    let list = getWatchlist();
    if (list.includes(movieId)) {
      list = list.filter(id => id !== movieId);
    } else {
      list.push(movieId);
    }
    setWatchlist(list);
    renderAllSections();
  }

  function updateWatchlistCount() {
    const list = getWatchlist();
    if (watchlistCountBadge) {
      watchlistCountBadge.textContent = list.length;
    }
  }

  // Fetch Movies from API or fallback
  async function fetchMovies() {
    try {
      const response = await fetch('/api/movies');
      if (response.ok) {
        allMovies = await response.json();
      }
    } catch (e) {
      console.warn('API unavailable, using client database array');
    }
    setupHeroSpotlight();
    renderAllSections();
  }

  // Setup Featured Hero Spotlight
  function setupHeroSpotlight() {
    const featuredMovie = allMovies.find(m => m.featured) || allMovies[0];
    if (!featuredMovie) return;

    if (heroBanner) heroBanner.style.backgroundImage = `url('${featuredMovie.backdrop}')`;
    if (heroTitle) heroTitle.textContent = featuredMovie.title;
    if (heroRating) heroRating.textContent = featuredMovie.rating;
    if (heroYear) heroYear.textContent = featuredMovie.year;
    if (heroGenre) heroGenre.textContent = featuredMovie.genre.join(' • ');
    if (heroRuntime) heroRuntime.textContent = featuredMovie.runtime || '2h 15m';
    if (heroDesc) heroDesc.textContent = featuredMovie.overview;

    if (heroMoreInfoBtn) {
      heroMoreInfoBtn.href = `movie.html?id=${featuredMovie.id}`;
    }

    if (heroWatchTrailerBtn) {
      heroWatchTrailerBtn.onclick = () => openTrailerModal(featuredMovie.trailerUrl);
    }
  }

  // Card Generator Function
  function createMovieCard(movie) {
    const watchlist = getWatchlist();
    const isSaved = watchlist.includes(movie.id);

    const card = document.createElement('a');
    card.href = `movie.html?id=${movie.id}`;
    card.className = 'movie-card';

    const genreTag = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;

    card.innerHTML = `
      <div class="poster-wrapper">
        <img class="movie-poster" src="${movie.poster}" alt="${movie.title}" loading="lazy">
        <div class="movie-badge-rating">★ ${movie.rating}</div>
        <button class="watchlist-toggle-btn ${isSaved ? 'active' : ''}" title="${isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}">
          ${isSaved ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-submeta">
          <span>${movie.year}</span>
          <span>• ${genreTag}</span>
        </div>
      </div>
    `;

    const toggleBtn = card.querySelector('.watchlist-toggle-btn');
    toggleBtn.addEventListener('click', (e) => toggleWatchlist(movie.id, e));

    return card;
  }

  // Render Section Carousel
  function renderCarousel(container, movies) {
    if (!container) return;
    container.innerHTML = '';

    if (movies.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); padding: 2rem 0; width: 100%;">No movies found in this section.</div>`;
      return;
    }

    movies.forEach(movie => {
      container.appendChild(createMovieCard(movie));
    });
  }

  // Render All Movie Sections
  function renderAllSections() {
    renderCarousel(popularRow, allMovies.filter(m => m.isPopular));
    renderCarousel(trendingRow, allMovies.filter(m => m.isTrending));
    renderCarousel(topRatedRow, allMovies.filter(m => m.isTopRated));
    renderCarousel(upcomingRow, allMovies.filter(m => m.isUpcoming));

    const watchlistIds = getWatchlist();
    const watchlistMovies = allMovies.filter(m => watchlistIds.includes(m.id));

    if (watchlistSection) {
      if (watchlistMovies.length > 0) {
        watchlistSection.style.display = 'block';
        renderCarousel(watchlistRow, watchlistMovies);
      } else {
        watchlistSection.style.display = 'none';
      }
    }

    updateWatchlistCount();
  }

  // Live Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (!query) {
        if (searchResultsHeader) searchResultsHeader.style.display = 'none';
        if (searchResultsRow) searchResultsRow.style.display = 'none';
        return;
      }

      const filtered = allMovies.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.overview.toLowerCase().includes(query) ||
        m.genre.some(g => g.toLowerCase().includes(query))
      );

      if (searchResultsHeader) searchResultsHeader.style.display = 'block';
      if (searchTitle) searchTitle.textContent = `Search Results for "${query}" (${filtered.length})`;
      if (searchResultsRow) {
        searchResultsRow.style.display = 'flex';
        renderCarousel(searchResultsRow, filtered);
      }
    });
  }

  // Genre Pill Filter Handler
  if (genreFilterBar) {
    genreFilterBar.addEventListener('click', (e) => {
      const pill = e.target.closest('.genre-pill');
      if (!pill) return;

      document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedGenre = pill.dataset.genre;
      if (selectedGenre === 'All') {
        if (searchResultsHeader) searchResultsHeader.style.display = 'none';
        if (searchResultsRow) searchResultsRow.style.display = 'none';
        renderAllSections();
      } else {
        const filtered = allMovies.filter(m => m.genre.includes(selectedGenre));
        if (searchResultsHeader) searchResultsHeader.style.display = 'block';
        if (searchTitle) searchTitle.textContent = `${selectedGenre} Movies (${filtered.length})`;
        if (searchResultsRow) {
          searchResultsRow.style.display = 'flex';
          renderCarousel(searchResultsRow, filtered);
        }
      }
    });
  }

  // Trailer Video Modal Controls
  function openTrailerModal(url) {
    if (!trailerModal || !trailerIframe) return;
    trailerIframe.src = url + "?autoplay=1";
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

  // Initialize App
  fetchMovies();
});
