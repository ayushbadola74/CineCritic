const axios = require('axios');

const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1';

// Simple in-memory Cache with TTL (default 1 hour)
class SimpleCache {
  constructor(ttlMs = 3600000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, customTtl = null) {
    const expiry = Date.now() + (customTtl || this.ttlMs);
    this.cache.set(key, { value, expiry });
  }
}

const apiCache = new SimpleCache();

// Helper to delay execution (prevents concurrent request limits on Watchmode)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getApiKey = () => {
  const key = process.env.WATCHMODE_API_KEY;
  if (!key) {
    console.warn('WATCHMODE_API_KEY is not defined in environment variables');
  }
  return key;
};

/**
 * Fetch list of titles from Watchmode API
 * @param {Object} options - { types, limit, sort_by, page }
 */
const fetchListTitles = async (options = {}) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const { types = 'movie', limit = 20, sort_by = 'popularity_desc', page = 1 } = options;
  const cacheKey = `list-titles-${types}-${limit}-${sort_by}-${page}`;

  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${WATCHMODE_BASE_URL}/list-titles/`, {
      params: {
        apiKey,
        types,
        limit,
        sort_by,
        page
      },
      timeout: 5000
    });

    if (response.data && response.data.titles) {
      apiCache.set(cacheKey, response.data.titles);
      return response.data.titles;
    }
    return null;
  } catch (error) {
    console.warn(`Watchmode list-titles error (${sort_by}):`, error.response?.data?.errorMessage || error.message);
    return null;
  }
};

/**
 * Search movies on Watchmode API
 * @param {string} query
 */
const searchMovies = async (query) => {
  const apiKey = getApiKey();
  if (!apiKey || !query) return [];

  const cacheKey = `search-${query.toLowerCase().trim()}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${WATCHMODE_BASE_URL}/search/`, {
      params: {
        apiKey,
        search_field: 'name',
        search_value: query
      },
      timeout: 5000
    });

    const results = response.data?.title_results || response.data?.results || [];
    // Filter to movie types only
    const movieResults = results.filter((r) => r.type === 'movie' || r.resultType === 'title');
    apiCache.set(cacheKey, movieResults);
    return movieResults;
  } catch (error) {
    console.warn('Watchmode search error:', error.response?.data?.errorMessage || error.message);
    return [];
  }
};

/**
 * Fetch detailed information for a specific movie ID
 * @param {number|string} titleId
 */
const getTitleDetails = async (titleId) => {
  const apiKey = getApiKey();
  if (!apiKey || !titleId) return null;

  const cacheKey = `details-${titleId}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${WATCHMODE_BASE_URL}/title/${titleId}/details/`, {
      params: {
        apiKey,
        append_to_response: 'cast_crew'
      },
      timeout: 5000
    });

    if (response.data && response.data.id) {
      apiCache.set(cacheKey, response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.warn(`Watchmode details error for ID ${titleId}:`, error.response?.data?.errorMessage || error.message);
    return null;
  }
};

/**
 * Helper to enrich a list of Watchmode title stubs with details
 * Fetches sequentially with delay to avoid rate limits
 */
const enrichTitlesWithDetails = async (titles, maxItems = 10) => {
  if (!titles || !Array.isArray(titles)) return [];

  const slice = titles.slice(0, maxItems);
  const enriched = [];

  for (const item of slice) {
    if (!item.id) continue;
    
    // Check if already in details cache
    let details = apiCache.get(`details-${item.id}`);
    if (!details) {
      // Small sleep to respect Watchmode API rate limits
      if (enriched.length > 0) {
        await sleep(150);
      }
      details = await getTitleDetails(item.id);
    }

    if (details) {
      enriched.push(details);
    } else {
      // Fallback stub if details call failed
      enriched.push({
        id: item.id,
        title: item.title,
        year: item.year,
        plot_overview: '',
        user_rating: 7.5,
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80'
      });
    }
  }

  return enriched;
};

module.exports = {
  fetchListTitles,
  searchMovies,
  getTitleDetails,
  enrichTitlesWithDetails
};
