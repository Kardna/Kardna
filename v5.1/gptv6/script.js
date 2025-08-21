let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentGame = null;
let gamesData = [];
let currentFilter = 'all'; // 'all' | 'gfn'

function loadGames() {
  fetch('games.json')
    .then(res => res.json())
    .then(data => {
      gamesData = data.games || [];
      renderGames();
      updateFavoritesUI();
      wireTabs();
    });
}

function wireTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.onclick = () => {
      currentFilter = btn.dataset.filter;
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGames();
    };
  });
}

function getFilteredGames() {
  if (currentFilter === 'gfn') {
    return gamesData.filter(g => g.gfn === true);
  }
  return gamesData;
}

function renderGames() {
  const container = document.getElementById('game-container');
  container.innerHTML = '';
  const list = getFilteredGames();

  list.forEach(g => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${g.image}" alt="${g.title}">
      <h3>${g.title}</h3>
    `;
    card.addEventListener('click', () => openDetails(g.id));
    container.appendChild(card);
  });
}

function openDetails(id) {
  const game = gamesData.find(g => g.id === id);
  if (!game) return;
  currentGame = game;
  document.getElementById('details-title').textContent = game.title;
  document.getElementById('details-description').textContent = game.description;
  document.getElementById('details-image').src = game.image;

  const gallery = document.getElementById('screenshot-gallery');
  gallery.innerHTML = '';
  (game.screenshots || []).forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.onerror = () => (img.style.display = 'none');
    gallery.appendChild(img);
  });

  document.getElementById('favorite-btn').textContent =
    favorites.some(f => f.id === id) ? '❌ Remove' : '❤️ Add';
  document.getElementById('mod-btn').classList.toggle('hidden', !game.modding);
  document.getElementById('game-details-modal').classList.remove('hidden');
}

function closeDetails() {
  document.getElementById('game-details-modal').classList.add('hidden');
}

function toggleFavorite() {
  if (!currentGame) return;
  const exists = favorites.some(f => f.id === currentGame.id);
  exists ? favorites = favorites.filter(f => f.id !== currentGame.id) : favorites.push(currentGame);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesUI();
  closeDetails();
}

function playGame() {
  if (!currentGame) return;
  closeDetails();
  launchGame(currentGame.id);
}

/* Prefer game's iframe; for GFN games we use their search deep-link in iframe */
function gfnSearchUrl(title) {
  return `https://play.geforcenow.com/mall/#/search?q=${encodeURIComponent(title)}`;
}

function launchGame(id) {
  const game = gamesData.find(g => g.id === id);
  if (!game) return;
  currentGame = game;

  document.getElementById('fullscreen-game-title').textContent = game.title;

  const url = (game.iframe && game.iframe.trim().length)
    ? game.iframe
    : (game.gfn ? gfnSearchUrl(game.title) : 'about:blank');

  const iframe = document.getElementById('fullscreen-iframe');
  iframe.src = url;

  document.getElementById('game-launcher-fullscreen').classList.remove('hidden');
  document.getElementById('mod-launch-btn').classList.toggle('hidden', !game.modding);
}

function closeGame() {
  document.getElementById('game-launcher-fullscreen').classList.add('hidden');
  const iframe = document.getElementById('fullscreen-iframe');
  iframe.src = '';
  document.getElementById('mod-panel').classList.add('hidden');
}

function toggleFullscreen() {
  const container = document.getElementById('game-launcher-fullscreen');
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  } else {
    container.requestFullscreen?.();
  }
}

function openModPanel() {
  document.getElementById('mod-panel').classList.remove('hidden');
  document.querySelector('.close-launcher')?.setAttribute('disabled', 'disabled');
}

function closeModPanel() {
  document.getElementById('mod-panel').classList.add('hidden');
  document.querySelector('.close-launcher')?.removeAttribute('disabled');
}

function updateFavoritesUI() {
  const list = document.getElementById('favorites-list');
  list.innerHTML = '';
  favorites.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'styled-btn';
    btn.innerHTML = `${g.title} <span style="margin-left:8px; cursor:pointer;">✖</span>`;
    btn.onclick = e => {
      if (e.target.tagName === 'SPAN') removeFromFavorites(g.id);
      else openDetails(g.id);
    };
    list.appendChild(btn);
  });
}

function removeFromFavorites(id) {
  favorites = favorites.filter(f => f.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesUI();
}

function openSettings() {
  document.getElementById('settingsOverlay').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settingsOverlay').classList.add('hidden');
}

function setTheme(m) {
  if (m === 'light') document.body.classList.add('light');
  else document.body.classList.remove('light');
  localStorage.setItem('theme', m);
  closeSettings();
}

(() => {
  const t = localStorage.getItem('theme');
  if (t === 'light') document.body.classList.add('light');
  loadGames();
})();
