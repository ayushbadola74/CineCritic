// CineCritic Movie Detail Page Logic - Live TMDB API Powered
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Movie Details Page Initialized');

  const movieDetailView = document.getElementById('movieDetailView');
  const trailerModal = document.getElementById('trailerModal');
  const trailerIframe = document.getElementById('trailerIframe');
  const closeTrailerBtn = document.getElementById('closeTrailerBtn');
  const watchlistCountBadge = document.getElementById('watchlistCount');

  // URL Query Parameter
  const urlParams = new URLSearchParams(window.location.search);
  const movieIdParam = urlParams.get('id') || '550';

  // LocalStorage Watchlist Helper
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

  // Fetch Movie Details
  async function loadMovieDetails() {
    let movie = null;
    try {
      const res = await fetch(`/api/movies/${movieIdParam}`);
      if (res.ok) {
        movie = await res.json();
      }
    } catch (e) {
      console.warn('API error, falling back to local dataset:', e);
    }

    if (!movie && typeof MOVIES_DATABASE !== 'undefined') {
      const parsedId = parseInt(movieIdParam);
      movie = MOVIES_DATABASE.find(m => m.id === parsedId || m.id === movieIdParam) || MOVIES_DATABASE[0];
    }

    if (movie) {
      renderMovieView(movie);
    } else if (movieDetailView) {
      movieDetailView.innerHTML = `
        <div class="container" style="padding: 5rem 0; text-align: center;">
          <h2>Movie not found</h2>
          <a href="index.html" class="back-link">← Back to Home</a>
        </div>
      `;
    }
  }

  // Render Movie Detail View
  function renderMovieView(movie) {
    if (!movieDetailView) return;

    const watchlist = getWatchlist();
    const isSaved = watchlist.includes(movie.id) || watchlist.includes(String(movie.id)) || watchlist.includes(Number(movie.id));
    
    const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre || 'Movie'];
    const genrePillsHTML = genres.map(g => `<span class="pill">${g}</span>`).join('');

    // Cast Cards HTML
    const castHTML = (movie.cast || []).map(c => `
      <div class="cast-card">
        <img class="cast-img" src="${c.photo}" alt="${c.name}" loading="lazy">
        <div class="cast-name">${c.name}</div>
        <div class="cast-role">${c.character}</div>
      </div>
    `).join('');

    // Local Reviews State
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

    // Similar Movies HTML (from TMDB recommended or local DB)
    let similarMovies = movie.similar && movie.similar.length > 0 ? movie.similar : [];
    if (similarMovies.length === 0 && typeof MOVIES_DATABASE !== 'undefined') {
      similarMovies = MOVIES_DATABASE.filter(m => m.id !== movie.id).slice(0, 6);
    }

    const similarCardsHTML = similarMovies.slice(0, 6).map(m => {
      const gTag = Array.isArray(m.genre) && m.genre.length > 0 ? m.genre[0] : (m.genre || 'Movie');
      return `
        <a href="movie.html?id=${m.id}" class="movie-card">
          <div class="poster-wrapper">
            <img class="movie-poster" src="${m.poster}" alt="${m.title}" loading="lazy">
            <div class="movie-badge-rating">★ ${m.rating}</div>
          </div>
          <div class="movie-info">
            <h3 class="movie-title">${m.title}</h3>
            <div class="movie-submeta">${m.year} • ${gTag}</div>
          </div>
        </a>
      `;
    }).join('');

    movieDetailView.innerHTML = `
      <section class="detail-hero" style="background-image: url('${movie.backdrop || movie.poster}');">
        <div class="detail-backdrop-overlay"></div>
        <div class="container">
          <a href="index.html" class="back-link">← Back to Movies</a>
          <div class="detail-layout">
            <div class="detail-poster-wrapper">
              <img class="detail-poster-img" src="${movie.poster}" alt="${movie.title}">
            </div>
            <div class="detail-content">
              <h1 class="detail-title">${movie.title}</h1>
              ${movie.tagline ? `<p class="detail-tagline">"${movie.tagline}"</p>` : ''}
              
              <div class="meta-pills">
                <span class="pill pill-gold">★ ${movie.rating} / 10 (${movie.voteCount || 1200} votes)</span>
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

    // Bind Watchlist Toggle
    const watchlistToggleBtn = document.getElementById('watchlistToggleBtn');
    if (watchlistToggleBtn) {
      watchlistToggleBtn.onclick = () => toggleWatchlist(movie.id);
    }

    // Bind Trailer Modal
    const watchTrailerBtn = document.getElementById('watchTrailerBtn');
    if (watchTrailerBtn) {
      watchTrailerBtn.onclick = () => openTrailerModal(movie.trailerUrl);
    }

    // Bind Review Form Submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
      reviewForm.onsubmit = async (e) => {
        e.preventDefault();
        const author = document.getElementById('authorInput').value.trim();
        const rating = parseInt(document.getElementById('ratingSelect').value);
        const comment = document.getElementById('commentInput').value.trim();

        if (author && comment) {
          const newReview = { author, rating, comment, date: 'Just now' };

          // Save locally
          const currentLocal = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');
          currentLocal.unshift(newReview);
          localStorage.setItem(localReviewsKey, JSON.stringify(currentLocal));

          // Post to server API
          try {
            await fetch(`/api/movies/${movie.id}/reviews`, {
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

  // Modal Player Controls
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
    trailerModal.onclick = (e) => {
      if (e.target === trailerModal) closeTrailerModal();
    };
  }

  updateWatchlistCount();
  loadMovieDetails();
});
