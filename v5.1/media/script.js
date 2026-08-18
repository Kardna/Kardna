const CONFIG = {
  TMDB_BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTVlMzY2ZDhhZjA0YzkwM2RhZjA3NDM2OWJjYjI3NSIsIm5iZiI6MTcwOTQ0NjczNC41MDQ5OTk5LCJzdWIiOiI2NWU0MTY0ZWM5OTgyNjAxNjI2MTY3MjYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0SZRRr7mEXqtuj_bnfRkH0gwLDE2WwWK0Kh80ao_fcQ',
  LANGUAGE: 'en-US',
  REGION: 'US',
  IMAGE_BASE: 'https://image.tmdb.org/t/p/',
  POSTER_SIZE: 'w500',
  BACKDROP_SIZE: 'original'
};

const state = {
  filter: 'all',
  sort: 'rank',
  genre: 'All',
  search: '',
  favorites: new Set(JSON.parse(localStorage.getItem('kardna-media-favorites') || '[]')),
  datasets: {
    popularMovies: [],
    popularShows: [],
    trending: [],
    search: []
  },
  genres: ['All'],
  currentHero: null,
  currentViewer: null,
  currentSeason: 1,
  currentEpisode: 1
};

const els = {
  configBox: document.getElementById('configBox'),
  loader: document.getElementById('loader'),
  favoriteCount: document.getElementById('favoriteCount'),
  searchInput: document.getElementById('searchInput'),
  heroBg: document.getElementById('heroBg'),
  heroTitle: document.getElementById('heroTitle'),
  heroMeta: document.getElementById('heroMeta'),
  heroOverview: document.getElementById('heroOverview'),
  heroPlayBtn: document.getElementById('heroPlayBtn'),
  heroInfoBtn: document.getElementById('heroInfoBtn'),
  heroFavBtn: document.getElementById('heroFavBtn'),
  trendingMini: document.getElementById('trendingMini'),
  genreChips: document.getElementById('genreChips'),
  topMoviesRow: document.getElementById('topMoviesRow'),
  topShowsRow: document.getElementById('topShowsRow'),
  trendingRow: document.getElementById('trendingRow'),
  libraryGrid: document.getElementById('libraryGrid'),
  libraryTitle: document.getElementById('libraryTitle'),
  libraryDesc: document.getElementById('libraryDesc'),
  emptyState: document.getElementById('emptyState'),
  watchModal: document.getElementById('watchModal'),
  closeModal: document.getElementById('closeModal'),
  playerFrame: document.getElementById('playerFrame'),
  viewerPoster: document.getElementById('viewerPoster'),
  viewerTitle: document.getElementById('viewerTitle'),
  viewerMeta: document.getElementById('viewerMeta'),
  viewerOverview: document.getElementById('viewerOverview'),
  viewerPlayBtn: document.getElementById('viewerPlayBtn'),
  viewerFavBtn: document.getElementById('viewerFavBtn'),
  seasonBar: document.getElementById('seasonBar'),
  episodesGrid: document.getElementById('episodesGrid')
};

function hasToken() {
  return Boolean(CONFIG.TMDB_BEARER_TOKEN && CONFIG.TMDB_BEARER_TOKEN.trim());
}

function saveFavorites() {
  localStorage.setItem('kardna-media-favorites', JSON.stringify([...state.favorites]));
  els.favoriteCount.textContent = `${state.favorites.size} favorite${state.favorites.size === 1 ? '' : 's'}`;
}

function isFavorite(id, type) {
  return state.favorites.has(`${type}:${id}`);
}

function toggleFavorite(item) {
  const key = `${item.type}:${item.id}`;
  if (state.favorites.has(key)) state.favorites.delete(key);
  else state.favorites.add(key);
  saveFavorites();
  syncHeroFavorite();
  syncViewerFavorite();
  renderAll();
}

function imageUrl(path, size) {
  if (!path) return 'https://placehold.co/1000x1500/111111/FFFFFF?text=No+Image';
  return `${CONFIG.IMAGE_BASE}${size}${path}`;
}

async function api(path, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${CONFIG.TMDB_BEARER_TOKEN}`,
      accept: 'application/json'
    }
  });

  if (!res.ok) throw new Error(`TMDB request failed: ${res.status}`);
  return res.json();
}

function normalizeItem(item, forcedType = null) {
  const type = forcedType || item.media_type || (item.title ? 'movie' : 'tv');
  const isMovie = type === 'movie';
  return {
    id: item.id,
    type,
    title: item.title || item.name || 'Untitled',
    year: (isMovie ? item.release_date : item.first_air_date || '').slice(0, 4) || '—',
    rating: item.vote_average ? Number(item.vote_average).toFixed(1) : '—',
    rank: 999,
    runtime: item.runtime ? `${item.runtime}m` : null,
    seasons: item.number_of_seasons || null,
    episodesPerSeason: item.episodesPerSeason || [],
    genres: item.genre_names || item.genres?.map(g => g.name) || [],
    genreIds: item.genre_ids || item.genres?.map(g => g.id) || [],
    overview: item.overview || 'No overview available yet.',
    poster: imageUrl(item.poster_path, CONFIG.POSTER_SIZE),
    backdrop: imageUrl(item.backdrop_path || item.poster_path, CONFIG.BACKDROP_SIZE),
    embedUrl: isMovie ? `https://www.vidking.net/embed/movie/${item.id}?autoPlay=true` : null,
    embedBase: !isMovie ? `https://www.vidking.net/embed/tv/${item.id}` : null,
    original_language: item.original_language,
    origin_country: item.origin_country || []
  };
}

function attachGenreNames(items, movieGenres, tvGenres) {
  return items.map(entry => {
    const lookup = entry.media_type === 'tv' || (!entry.title && entry.name) ? tvGenres : movieGenres;
    return {
      ...entry,
      genre_names: (entry.genre_ids || []).map(id => lookup.get(id)).filter(Boolean)
    };
  });
}

async function fetchGenres() {
  const [movieGenreRes, tvGenreRes] = await Promise.all([
    api('/genre/movie/list', { language: CONFIG.LANGUAGE }),
    api('/genre/tv/list', { language: CONFIG.LANGUAGE })
  ]);
  return {
    movieMap: new Map(movieGenreRes.genres.map(g => [g.id, g.name])),
    tvMap: new Map(tvGenreRes.genres.map(g => [g.id, g.name]))
  };
}

async function fetchInitialData() {
  const { movieMap, tvMap } = await fetchGenres();

  const [popularMoviesRes, popularShowsRes, trendingRes] = await Promise.all([
    api('/movie/popular', { language: CONFIG.LANGUAGE, page: 1, region: CONFIG.REGION }),
    api('/tv/popular', { language: CONFIG.LANGUAGE, page: 1 }),
    api('/trending/all/week', { language: CONFIG.LANGUAGE })
  ]);

  const popularMovies = attachGenreNames(popularMoviesRes.results || [], movieMap, tvMap)
    .map(entry => normalizeItem(entry, 'movie'))
    .slice(0, 20)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const popularShows = attachGenreNames(popularShowsRes.results || [], movieMap, tvMap)
    .map(entry => normalizeItem(entry, 'tv'))
    .slice(0, 20)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const trending = attachGenreNames(
    (trendingRes.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv'),
    movieMap,
    tvMap
  )
    .map(entry => normalizeItem(entry))
    .slice(0, 20)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  state.datasets.popularMovies = popularMovies;
  state.datasets.popularShows = popularShows;
  state.datasets.trending = trending;
  state.genres = ['All', 'Anime', ...new Set([...popularMovies, ...popularShows, ...trending].flatMap(item => item.genres))].filter(Boolean);
}

async function fetchSearch(query) {
  if (!query.trim()) {
    state.datasets.search = [];
    renderAll();
    return;
  }

  els.loader.hidden = false;
  els.loader.textContent = `Searching for “${query.trim()}”...`;

  const searchRes = await api('/search/multi', {
    query: query.trim(),
    include_adult: false,
    language: CONFIG.LANGUAGE,
    page: 1
  });

  const valid = (searchRes.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv');
  const { movieMap, tvMap } = await fetchGenres();

  state.datasets.search = attachGenreNames(valid, movieMap, tvMap)
    .map(entry => normalizeItem(entry))
    .slice(0, 36)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  els.loader.hidden = true;
  renderAll();
}

function getBaseLibrary() {
  if (state.search.trim()) return [...state.datasets.search];
  return [...state.datasets.trending, ...state.datasets.popularMovies, ...state.datasets.popularShows]
    .filter((item, index, arr) => arr.findIndex(other => other.id === item.id && other.type === item.type) === index);
}

function getFilteredLibrary() {
  let list = getBaseLibrary();

  if (state.filter === 'movie') list = list.filter(item => item.type === 'movie');
  if (state.filter === 'tv') list = list.filter(item => item.type === 'tv');
  if (state.filter === 'favorites') list = list.filter(item => isFavorite(item.id, item.type));

  if (state.genre !== 'All') {
    if (state.genre === 'Anime') {
      list = list.filter(item =>
        item.genres.includes('Animation') &&
        (item.original_language === 'ja' || (item.origin_country || []).includes('JP'))
      );
    } else {
      list = list.filter(item => item.genres.includes(state.genre));
    }
  }

  if (!state.search.trim()) {
    if (state.sort === 'rank') list.sort((a, b) => a.rank - b.rank);
    if (state.sort === 'year') list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    if (state.sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    if (state.sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    if (state.sort === 'year') list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  }

  return list;
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function tileTemplate(item, rankLabel = false) {
  return `
    <article class="tile">
      <div class="tile-image">
        <img src="${item.poster}" alt="${escapeHtml(item.title)} poster" loading="lazy" />
        ${rankLabel ? `<div class="rank-tag">Top ${item.rank}</div>` : ''}
        <div class="type-tag">${item.type === 'movie' ? 'Movie' : 'Series'}</div>
        <div class="score-tag">★ ${item.rating}</div>
      </div>
      <div class="tile-body">
        <div class="tile-title">${escapeHtml(item.title)}</div>
        <div class="tile-sub">${escapeHtml((item.overview || '').slice(0, 90))}${item.overview && item.overview.length > 90 ? '...' : ''}</div>
        <div class="tile-meta">
          <span>${item.year}</span>
          <span>${item.type === 'movie' ? 'Movie' : 'TV'}</span>
          ${item.genres[0] ? `<span>${item.genres[0]}</span>` : ''}
        </div>
        <div class="tile-actions">
          <button class="tile-btn play" data-action="play" data-id="${item.id}" data-type="${item.type}">Play</button>
          <button class="tile-btn" data-action="info" data-id="${item.id}" data-type="${item.type}">Info</button>
          <button class="icon-btn ${isFavorite(item.id, item.type) ? 'active' : ''}" data-action="favorite" data-id="${item.id}" data-type="${item.type}">${isFavorite(item.id, item.type) ? '♥' : '♡'}</button>
        </div>
      </div>
    </article>
  `;
}

function renderGenres() {
  els.genreChips.innerHTML = state.genres.map(genre => `
    <button class="chip ${state.genre === genre ? 'active' : ''}" data-genre="${genre}">${genre}</button>
  `).join('');
}

function renderHero(item) {
  if (!item) return;
  state.currentHero = item;
  els.heroBg.style.backgroundImage = `url(${item.backdrop})`;
  els.heroTitle.textContent = item.title;
  els.heroOverview.textContent = item.overview || 'No overview available.';
  els.heroMeta.innerHTML = [
    `<span class="meta-pill">${item.type === 'movie' ? 'Movie' : 'Series'}</span>`,
    `<span class="meta-pill">${item.year}</span>`,
    `<span class="meta-pill">★ ${item.rating}</span>`,
    ...item.genres.slice(0, 3).map(genre => `<span class="meta-pill">${genre}</span>`)
  ].join('');
  syncHeroFavorite();
}

function syncHeroFavorite() {
  if (!state.currentHero) return;
  const active = isFavorite(state.currentHero.id, state.currentHero.type);
  els.heroFavBtn.classList.toggle('active', active);
  els.heroFavBtn.textContent = active ? '♥ Favorited' : '♡ Favorite';
}

function syncViewerFavorite() {
  if (!state.currentViewer) return;
  const active = isFavorite(state.currentViewer.id, state.currentViewer.type);
  els.viewerFavBtn.classList.toggle('active', active);
  els.viewerFavBtn.textContent = active ? '♥ Favorited' : '♡ Favorite';
}

function renderTrendingMini() {
  const list = state.datasets.trending.slice(0, 4);
  els.trendingMini.innerHTML = list.map(item => `
    <button class="mini-item" data-mini-open="${item.id}" data-type="${item.type}">
      <img src="${item.poster}" alt="${escapeHtml(item.title)} poster" loading="lazy" />
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${item.type === 'movie' ? 'Movie' : 'Show'} • ${item.year}</span>
      </div>
      <span>▶</span>
    </button>
  `).join('');
}

function renderRows() {
  els.topMoviesRow.innerHTML = state.datasets.popularMovies.slice(0, 14).map(item => tileTemplate(item, true)).join('');
  els.topShowsRow.innerHTML = state.datasets.popularShows.slice(0, 14).map(item => tileTemplate(item, true)).join('');
  els.trendingRow.innerHTML = state.datasets.trending.slice(0, 14).map(item => tileTemplate(item, true)).join('');
}

function renderLibrary() {
  const list = getFilteredLibrary();
  els.libraryGrid.innerHTML = list.map(item => tileTemplate(item)).join('');
  els.emptyState.hidden = list.length > 0;

  if (state.search.trim()) {
    els.libraryTitle.textContent = `Search results for “${state.search.trim()}”`;
    els.libraryDesc.textContent = `${list.length} result${list.length === 1 ? '' : 's'} found.`;
  } else if (state.filter === 'favorites') {
    els.libraryTitle.textContent = 'Your favorites';
    els.libraryDesc.textContent = 'Everything you saved in one place.';
  } else if (state.filter === 'movie') {
    els.libraryTitle.textContent = 'Movie library';
    els.libraryDesc.textContent = 'Current movie picks from the API.';
  } else if (state.filter === 'tv') {
    els.libraryTitle.textContent = 'TV library';
    els.libraryDesc.textContent = 'Current show picks from the API.';
  } else {
    els.libraryTitle.textContent = 'Browse the library';
    els.libraryDesc.textContent = 'Search anything and launch it fast.';
  }
}

function renderAll() {
  renderGenres();
  renderRows();
  renderLibrary();
  renderTrendingMini();
  if (!state.currentHero) renderHero(state.datasets.trending[0] || state.datasets.popularMovies[0] || state.datasets.popularShows[0]);
}

function findItem(id, type) {
  return [...state.datasets.popularMovies, ...state.datasets.popularShows, ...state.datasets.trending, ...state.datasets.search]
    .find(item => String(item.id) === String(id) && item.type === type);
}

async function ensureTvDetails(item) {
  if (item.type !== 'tv' || item.seasons) return item;
  const details = await api(`/tv/${item.id}`, { language: CONFIG.LANGUAGE });
  const seasonCounts = (details.seasons || [])
    .filter(season => season.season_number > 0)
    .map(season => season.episode_count || 1);
  item.seasons = seasonCounts.length || details.number_of_seasons || 1;
  item.episodesPerSeason = seasonCounts.length ? seasonCounts : Array.from({ length: item.seasons }, () => 10);
  item.genres = details.genres?.map(g => g.name) || item.genres;
  item.origin_country = details.origin_country || item.origin_country;
  return item;
}

function buildWatchUrl(item, season = 1, episode = 1) {
  if (item.type === 'movie') return item.embedUrl;
  return `${item.embedBase}/${season}/${episode}?autoPlay=true`;
}

function updatePlayer() {
  if (!state.currentViewer) return;
  els.playerFrame.src = buildWatchUrl(state.currentViewer, state.currentSeason, state.currentEpisode);
}

function renderSeasonEpisodeControls(item) {
  if (item.type !== 'tv') {
    els.seasonBar.innerHTML = '';
    els.episodesGrid.innerHTML = '';
    return;
  }

  const seasons = Array.from({ length: item.seasons || 1 }, (_, i) => i + 1);
  els.seasonBar.innerHTML = seasons.map(num => `
    <button class="season-btn ${state.currentSeason === num ? 'active' : ''}" data-season="${num}">Season ${num}</button>
  `).join('');

  const episodeCount = item.episodesPerSeason?.[state.currentSeason - 1] || 10;
  els.episodesGrid.innerHTML = Array.from({ length: episodeCount }, (_, i) => i + 1).map(num => `
    <button class="episode-btn ${state.currentEpisode === num ? 'active' : ''}" data-episode="${num}">Episode ${num}</button>
  `).join('');
}

async function openViewer(item) {
  state.currentViewer = await ensureTvDetails({ ...item });
  state.currentSeason = 1;
  state.currentEpisode = 1;

  els.viewerPoster.src = state.currentViewer.poster;
  els.viewerTitle.textContent = state.currentViewer.title;
  els.viewerOverview.textContent = state.currentViewer.overview || 'No overview available.';
  els.viewerMeta.innerHTML = [
    `<span class="meta-pill">${state.currentViewer.type === 'movie' ? 'Movie' : 'Series'}</span>`,
    `<span class="meta-pill">${state.currentViewer.year}</span>`,
    `<span class="meta-pill">★ ${state.currentViewer.rating}</span>`,
    ...state.currentViewer.genres.slice(0, 3).map(genre => `<span class="meta-pill">${genre}</span>`)
  ].join('');

  syncViewerFavorite();
  renderSeasonEpisodeControls(state.currentViewer);
  updatePlayer();
  els.watchModal.classList.add('open');
  els.watchModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeViewer() {
  els.watchModal.classList.remove('open');
  els.watchModal.setAttribute('aria-hidden', 'true');
  els.playerFrame.src = 'about:blank';
  document.body.style.overflow = '';
}

function refreshHeroFromCurrentView() {
  const list = getFilteredLibrary();
  renderHero(list[0] || state.datasets.trending[0] || state.datasets.popularMovies[0] || state.datasets.popularShows[0]);
}

function initEvents() {
  document.getElementById('mainNav').addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    state.filter = btn.dataset.filter;
    [...document.querySelectorAll('#mainNav button')].forEach(node => node.classList.toggle('active', node === btn));
    refreshHeroFromCurrentView();
    renderLibrary();
  });

  document.querySelector('.toolbar-left').addEventListener('click', e => {
    const btn = e.target.closest('[data-sort]');
    if (!btn) return;
    state.sort = btn.dataset.sort;
    [...document.querySelectorAll('.sort-btn')].forEach(node => node.classList.toggle('active', node === btn));
    refreshHeroFromCurrentView();
    renderLibrary();
  });

  els.genreChips.addEventListener('click', e => {
    const btn = e.target.closest('[data-genre]');
    if (!btn) return;
    state.genre = btn.dataset.genre;
    renderGenres();
    refreshHeroFromCurrentView();
    renderLibrary();
  });

  let searchTimer;
  els.searchInput.addEventListener('input', e => {
    state.search = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
      if (!hasToken()) return;
      try {
        await fetchSearch(state.search);
        refreshHeroFromCurrentView();
      } catch (error) {
        console.error(error);
      }
    }, 300);
  });

  els.heroPlayBtn.addEventListener('click', () => state.currentHero && openViewer(state.currentHero));
  els.heroInfoBtn.addEventListener('click', () => state.currentHero && openViewer(state.currentHero));
  els.heroFavBtn.addEventListener('click', () => state.currentHero && toggleFavorite(state.currentHero));
  els.viewerPlayBtn.addEventListener('click', updatePlayer);
  els.viewerFavBtn.addEventListener('click', () => state.currentViewer && toggleFavorite(state.currentViewer));

  document.body.addEventListener('click', e => {
    const mini = e.target.closest('[data-mini-open]');
    if (mini) {
      const item = findItem(mini.dataset.miniOpen, mini.dataset.type);
      if (item) openViewer(item);
      return;
    }

    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const item = findItem(actionBtn.dataset.id, actionBtn.dataset.type);
    if (!item) return;

    if (actionBtn.dataset.action === 'play' || actionBtn.dataset.action === 'info') openViewer(item);
    if (actionBtn.dataset.action === 'favorite') toggleFavorite(item);
  });

  els.closeModal.addEventListener('click', closeViewer);
  els.watchModal.addEventListener('click', e => {
    if (e.target === els.watchModal) closeViewer();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && els.watchModal.classList.contains('open')) closeViewer();
  });

  els.seasonBar.addEventListener('click', e => {
    const btn = e.target.closest('[data-season]');
    if (!btn || !state.currentViewer) return;
    state.currentSeason = Number(btn.dataset.season);
    state.currentEpisode = 1;
    renderSeasonEpisodeControls(state.currentViewer);
    updatePlayer();
  });

  els.episodesGrid.addEventListener('click', e => {
    const btn = e.target.closest('[data-episode]');
    if (!btn || !state.currentViewer) return;
    state.currentEpisode = Number(btn.dataset.episode);
    renderSeasonEpisodeControls(state.currentViewer);
    updatePlayer();
  });
}

async function init() {
  saveFavorites();
  initEvents();

  if (!hasToken()) {
    els.configBox.classList.add('show');
    els.loader.textContent = 'Add your TMDB token to load live movies and shows.';
    return;
  }

  try {
    await fetchInitialData();
    els.loader.hidden = true;
    renderAll();
    refreshHeroFromCurrentView();
  } catch (error) {
    console.error(error);
    els.loader.hidden = false;
    els.loader.textContent = 'Could not load TMDB data. Check your token and API setup.';
  }
}

init();
