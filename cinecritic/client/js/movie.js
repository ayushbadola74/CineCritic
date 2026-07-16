// CineCritic Movie Detail Page Logic - Live TMDB API Powered
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Movie Details Page Initialized');

  const API_BASE_URL = 'http://localhost:5000/api/movies';
  const movieDetailView = document.getElementById('movieDetailView');
  const trailerModal = document.getElementById('trailerModal');
  const trailerIframe = document.getElementById('trailerIframe');
  const closeTrailerBtn = document.getElementById('closeTrailerBtn');
  const watchlistCountBadge = document.getElementById('watchlistCount');

  // Get Movie ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const movieIdParam = urlParams.get('id') || '550';

  // Watchlist LocalStorage Helpers
  function getWatchlist() {
    return JSON.parse(localStorage.getItem('cinecritic_watchlist') || '[]');
  }

  function toggleWatchlist(id) {
    let list = getWatchlist();
    const strId = String(id);
    const numId = Number(id);

    if (list.includes(id) || list.includes(strId) || list.includes(numId)) {
      list = list.filter(item => String(item) !== strId && Number(item) !== numId);
    } else {
      list.push(id);
    }
    localStorage.setItem('cinecritic_watchlist', JSON.stringify(list));
    updateWatchlistCount();
    loadMovieDetails();
  }

  function updateWatchlistCount() {
    if (watchlistCountBadge) {
      watchlistCountBadge.textContent = getWatchlist().length;
    }
  }

  // 1. NAVBAR SEARCH DROPDOWN FOR MOVIE.HTML
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

  document.addEventListener('click', (e) => {
    if (searchWrapper && !searchWrapper.contains(e.target)) {
      searchDropdown.style.display = 'none';
    }
  });

  // 2. FETCH MOVIE DETAILS
  async function loadMovieDetails() {
    if (!movieDetailView) return;

    movieDetailView.innerHTML = `
      <div class="container" style="padding: 5rem 0; text-align: center;">
        <div style="color: var(--text-muted); font-size: 1.2rem;">Loading movie details...</div>
      </div>
    `;

    let movie = null;
    try {
      const res = await fetch(`${API_BASE_URL}/${movieIdParam}`);
      if (res.ok) {
        movie = await res.json();
      }
    } catch (e) {
      console.warn('API error fetching movie details:', e);
    }

    if (movie) {
      renderMovieView(movie);
    } else {
      movieDetailView.innerHTML = `
        <div class="container" style="padding: 5rem 0; text-align: center;">
          <h2 style="font-size: 2rem; margin-bottom: 1rem;">Movie Not Found</h2>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">We couldn't retrieve the requested movie from TMDB.</p>
          <a href="index.html" class="back-link" style="font-size: 1.1rem;">← Back to Home</a>
        </div>
      `;
    }
  }

  // 3. RENDER MOVIE DETAIL VIEW
  function renderMovieView(movie) {
    if (!movieDetailView) return;

    const watchlist = getWatchlist();
    const isSaved = watchlist.includes(movie.id) || watchlist.includes(String(movie.id)) || watchlist.includes(Number(movie.id));

    const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre || 'Movie'];
    const genrePillsHTML = genres.map(g => `<span class="pill">${g}</span>`).join('');

    // Cast Cards
    const castHTML = (movie.cast || []).map(c => `
      <div class="cast-card">
        <img class="cast-img" src="${c.photo}" alt="${c.name}" loading="lazy">
        <div class="cast-name">${c.name}</div>
        <div class="cast-role">${c.character}</div>
      </div>
    `).join('');

    // Reviews State
    const localReviewsKey = `cinecritic_reviews_${movie.id}`;
    const storedReviews = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');
    const allReviews = [...storedReviews, ...(movie.reviews || [])];

    const reviewsHTML = allReviews.length > 0
      ? allReviews.map(r => `
          <div class="review-card">
            <div class="review-author">
              <span>${r.author}</span>
              <span style="color: var(--accent-gold); font-size: 0.88rem;">★ ${r.rating} / 10 • ${r.date || 'Recently'}</span>
            </div>
            <p class="review-comment">${r.comment}</p>
          </div>
        `).join('')
      : `<div style="color: var(--text-muted); padding: 1rem 0;">Be the first to review "${movie.title}"!</div>`;

    // Similar / Recommended Movies
    let similarMovies = movie.similar && movie.similar.length > 0 ? movie.similar : [];
    const similarCardsHTML = similarMovies.slice(0, 6).map(m => {
      const poster = m.poster_path 
        ? (m.poster_path.startsWith('http') ? m.poster_path : `https://image.tmdb.org/t/p/w500${m.poster_path}`)
        : (m.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80');

      const rating = m.vote_average !== undefined ? m.vote_average : (m.rating || 'N/A');
      const year = m.year || (m.release_date ? m.release_date.split('-')[0] : '');

      return `
        <a href="movie.html?id=${m.id}" class="movie-card">
          <div class="poster-wrapper">
            <img class="movie-poster" src="${poster}" alt="${m.title}" loading="lazy">
            <div class="movie-badge-rating">★ ${rating}</div>
            <div class="card-overlay">
              <div class="card-overlay-title">${m.title || m.original_title}</div>
              <div class="card-overlay-rating">★ ${rating}</div>
              <button class="card-overlay-btn">View Details</button>
            </div>
          </div>
          <div class="movie-info">
            <h3 class="movie-title">${m.title || m.original_title}</h3>
            <div class="movie-submeta">${year}</div>
          </div>
        </a>
      `;
    }).join('');

    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : (movie.backdrop || movie.poster);
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.poster;

    movieDetailView.innerHTML = `
      <section class="detail-hero" style="background-image: url('${backdropUrl}');">
        <div class="detail-backdrop-overlay"></div>
        <div class="container">
          <a href="index.html" class="back-link">← Back to Movies</a>
          <div class="detail-layout">
            <div class="detail-poster-wrapper">
              <img class="detail-poster-img" src="${posterUrl}" alt="${movie.title}">
            </div>
            <div class="detail-content">
              <h1 class="detail-title">${movie.title}</h1>
              ${movie.tagline ? `<p class="detail-tagline">"${movie.tagline}"</p>` : ''}
              
              <div class="meta-pills">
                <span class="pill pill-gold">★ ${movie.vote_average !== undefined ? movie.vote_average : movie.rating} / 10 (${movie.voteCount || 1200} votes)</span>
                <span class="pill">${movie.year}</span>
                <span class="pill">${movie.runtime || '2h 15m'}</span>
                ${genrePillsHTML}
              </div>

              <p class="detail-overview">${movie.overview}</p>

              <div class="hero-actions">
                <button class="btn-watch-now" id="watchTrailerBtn">
                  ▶ Watch Trailer
                </button>
                <button class="btn-more-info" id="watchlistToggleBtn">
                  ${isSaved ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="container">
        <!-- Cast Section -->
        ${castHTML ? `
          <div class="section-header">
            <h2 class="section-title">Top Cast</h2>
          </div>
          <div class="cast-grid">
            ${castHTML}
          </div>
        ` : ''}

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h2 class="section-title" style="margin-bottom: 1.5rem;">User Reviews & Ratings</h2>
          
          <form class="review-form" id="reviewForm">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <input type="text" id="authorInput" class="review-input" placeholder="Your Name or Handle" style="flex: 1; min-width: 200px;" required>
              <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(9,9,11,0.8); padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
                <span style="color: var(--text-muted); font-size: 0.9rem;">Rating:</span>
                <select id="ratingSelect" class="review-input" style="padding: 0.2rem 0.5rem; width: auto; border: none;">
                  <option value="10">★ 10 / 10 (Masterpiece)</option>
                  <option value="9">★ 9 / 10 (Awesome)</option>
                  <option value="8" selected>★ 8 / 10 (Great)</option>
                  <option value="7">★ 7 / 10 (Good)</option>
                  <option value="6">★ 6 / 10 (Okay)</option>
                  <option value="5">★ 5 / 10 (Mediocre)</option>
                </select>
              </div>
            </div>
            <textarea id="commentInput" class="review-textarea" rows="3" placeholder="Share your honest thoughts about this movie..." required></textarea>
            <button type="submit" class="btn-submit-review">Post Review</button>
          </form>

          <div id="reviewsList">
            ${reviewsHTML}
          </div>
        </div>

        <!-- Similar Movies Carousel -->
        ${similarCardsHTML ? `
          <div class="section-header">
            <h2 class="section-title">Recommended Movies</h2>
          </div>
          <div class="carousel-row" style="margin-bottom: 4rem;">
            ${similarCardsHTML}
          </div>
        ` : ''}
      </section>
    `;

    // Watchlist Toggle
    const watchlistToggleBtn = document.getElementById('watchlistToggleBtn');
    if (watchlistToggleBtn) {
      watchlistToggleBtn.onclick = () => toggleWatchlist(movie.id);
    }

    // Trailer Modal
    const watchTrailerBtn = document.getElementById('watchTrailerBtn');
    if (watchTrailerBtn) {
      watchTrailerBtn.onclick = () => openModal(movie.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    }

    // Review Form Submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
      reviewForm.onsubmit = async (e) => {
        e.preventDefault();
        const author = document.getElementById('authorInput').value.trim();
        const rating = parseInt(document.getElementById('ratingSelect').value);
        const comment = document.getElementById('commentInput').value.trim();

        if (author && comment) {
          const newReview = { author, rating, comment, date: 'Just now' };

          const currentLocal = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');
          currentLocal.unshift(newReview);
          localStorage.setItem(localReviewsKey, JSON.stringify(currentLocal));

          try {
            await fetch(`${API_BASE_URL}/${movie.id}/reviews`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newReview)
            });
          } catch (err) {
            console.warn('Backend review sync failed');
          }

          loadMovieDetails();
        }
      };
    }
  }

  // Modal Controls
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
    trailerModal.onclick = (e) => {
      if (e.target === trailerModal) closeModal();
    };
  }

  updateWatchlistCount();
  loadMovieDetails();
});
