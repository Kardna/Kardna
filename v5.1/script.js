// ---------- url22 derivation (your logic) ----------
function getCurrentURL () { return window.location.href; }

let site1 = getCurrentURL();
var name = new URL(site1).host;
console.log(name);

// ["kardna.net","kardnanetwork.com","kardna.org","kardna-revive.com"]
const encodedData = "WyJrYXJkbmEubmV0Iiwia2FyZG5hbmV0d29yay5jb20iLCJrYXJkbmEub3JnIiwia2FyZG5hLXJldml2ZS5jb20iXQ==";
const decodedString = atob(encodedData);
const myArray = JSON.parse(decodedString);
const myVariable = name;

if (myArray.includes(myVariable)) {
  var url22 = 'bg.' + name;
} else {
  console.log("Its working!!!");
  var url22 = 'bg.kardna.net';
}
console.log('url22 ->', url22);

// ---------- helpers ----------
function getUvHost() {
  // prefer computed url22, otherwise current host
  return (typeof url22 !== "undefined" && url22) ? url22 : location.host;
}

function launchViaClickValue(clickValue) {
  if (!clickValue) return false;
  const v = String(clickValue).trim();

  if (v.startsWith('/')) {
    // Internal route
    window.location.href = v;
    return true;
  } else if (v.startsWith('http') || v.startsWith('www')) {
    // External -> wrap through UV
    const dest = v.startsWith('http') ? v : `https://${v}`;
    window.location.href = `https://${getUvHost()}/uv.html#${btoa(dest)}`;
    return true;
  } else {
    window.alert("Error, Please Contact Zenfy.");
    return true;
  }
}

// ---------- your existing code (unchanged except launchGame) ----------
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentGame = null;
let gamesData = [];

function loadGames() {
  fetch('games.json').then(res => res.json()).then(data => {
    gamesData = data.games;
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    gamesData.forEach(g => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `<img src="${g.image}" alt="${g.title}"><h3>${g.title}</h3>`;
      card.addEventListener('click', () => openDetails(g.id));
      container.appendChild(card);
    });
    updateFavoritesUI();
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

// UPDATED: uses your click rules if `game.click` exists; else falls back to iframe
function launchGame(id) {
  const game = gamesData.find(g => g.id === id);
  if (!game) return;
  currentGame = game;

  if (game.click) {
    const handled = launchViaClickValue(game.click);
    if (handled) return;
  }

  if (game.iframe) {
    // NEW: only wrap external URLs; leave file/relative paths alone
    let finalSrc;
    if (isFileOrRelativePath(game.iframe)) {
      finalSrc = game.iframe; // direct, no UV
    } else {
      const dest = game.iframe.startsWith('http') ? game.iframe : `https://${game.iframe}`;
      finalSrc = `https://${getUvHost()}/uv.html#${btoa(dest)}`;
    }

    document.getElementById('fullscreen-game-title').textContent = game.title;
    document.getElementById('fullscreen-iframe').src = finalSrc;
    document.getElementById('game-launcher-fullscreen').classList.remove('hidden');
    document.getElementById('mod-launch-btn').classList.toggle('hidden', !game.modding);
  } else {
    window.alert("Error, Please Contact Zenfy.");
  }
}


function closeGame() {
  document.getElementById('game-launcher-fullscreen').classList.add('hidden');
  document.getElementById('fullscreen-iframe').src = '';
  document.getElementById('mod-panel').classList.add('hidden');
}

function toggleFullscreen() {
  document.getElementById('fullscreen-iframe').requestFullscreen?.();
}

function openModPanel() {
  document.getElementById('mod-panel').classList.remove('hidden');
  document.querySelector('.close-launcher').style.display = 'none';
}

function closeModPanel() {
  document.getElementById('mod-panel').classList.add('hidden');
  document.querySelector('.close-launcher').style.display = '';
}

// Detect paths like "/games/astray/", "./local.html", "games/2048/index.html"
function isFileOrRelativePath(u) {
  if (!u) return false;
  const s = String(u).trim();

  // obvious relative/file-y
  if (s.startsWith('/') || s.startsWith('./') || s.startsWith('../')) return true;

  // no scheme, no "www.", likely local asset or route (e.g., "games/foo/index.html")
  if (!/^https?:\/\//i.test(s) && !/^www\./i.test(s)) return true;

  return false;
}


function updateFavoritesUI() {
  const list = document.getElementById('favorites-list');
  list.innerHTML = '';
  favorites.forEach(g => {
    const btn = document.createElement('button');
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
