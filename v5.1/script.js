function getCurrentURL() {
  return window.location.href;
}

const currentUrl = getCurrentURL();
const hostName = new URL(currentUrl).host;
const encodedData = "WyJrYXJkbmEubmV0Iiwia2FyZG5hbmV0d29yay5jb20iLCJrYXJkbmEub3JnIiwia2FyZG5hLXJldml2ZS5jb20iXQ==";
const allowedHosts = JSON.parse(atob(encodedData));
const url22 = allowedHosts.includes(hostName) ? `bg.${hostName}` : "bg.kardna.net";

const state = {
  games: [],
  filteredGames: [],
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
  currentGame: null,
  activeFilter: "all",
  search: ""
};

const els = {
  grid: document.getElementById("gameGrid"),
  template: document.getElementById("cardTemplate"),
  favoritesList: document.getElementById("favoritesList"),
  resultsTitle: document.getElementById("resultsTitle"),
  resultsMeta: document.getElementById("resultsMeta"),
  searchInput: document.getElementById("searchInput"),
  gameCount: document.getElementById("gameCount"),
  favoriteCount: document.getElementById("favoriteCount"),
  featuredCarousel: document.getElementById("featuredCarousel"),
  detailsOverlay: document.getElementById("detailsOverlay"),
  launcherOverlay: document.getElementById("launcherOverlay"),
  settingsOverlay: document.getElementById("settingsOverlay"),
  detailsTitle: document.getElementById("detailsTitle"),
  detailsImage: document.getElementById("detailsImage"),
  detailsDescription: document.getElementById("detailsDescription"),
  detailsTags: document.getElementById("detailsTags"),
  screenshots: document.getElementById("screenshots"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  playBtn: document.getElementById("playBtn"),
  launcherTitle: document.getElementById("launcherTitle"),
  launcherFrame: document.getElementById("launcherFrame")
};

function normalizeFavorites() {
  const validIds = new Set(state.games.map(game => game.id));
  state.favorites = state.favorites.filter(game => validIds.has(game.id));
  localStorage.setItem("favorites", JSON.stringify(state.favorites));
}

function isFavorite(id) {
  return state.favorites.some(game => game.id === id);
}

function toggleFavorite(game) {
  const exists = isFavorite(game.id);
  state.favorites = exists
    ? state.favorites.filter(item => item.id !== game.id)
    : [...state.favorites, game];

  localStorage.setItem("favorites", JSON.stringify(state.favorites));
  renderFavorites();
  renderGames();
  updateStats();

  if (state.currentGame && state.currentGame.id === game.id) {
    updateDetailsFavoriteButton();
  }
}

function getGameType(game) {
  const value = String(game.click || game.iframe || "").toLowerCase();

  if (value.includes("geforcenow")) return "gfn";
  if (value.includes("xbox.com/play")) return "xbox";
  if (value.includes("now.gg")) return "cloud";
  if (value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) return "local";
  if (!/^https?:\/\//i.test(value) && !/^www\./i.test(value)) return "local";
  return "browser";
}

function getBadges(game) {
  const type = getGameType(game);
  const badges = [];
  if (type === "gfn") badges.push("GFN");
  else if (type === "xbox") badges.push("Xbox Cloud");
  else if (type === "cloud") badges.push("Cloud");
  else if (type === "local") badges.push("Local");
  else badges.push("Browser");

  if (game.modding) badges.push("Modding");
  if (isFavorite(game.id)) badges.push("Favorite");
  return badges;
}

function getFilterTitle(filter) {
  const map = {
    all: "All games",
    favorites: "Favorite games",
    local: "Local games",
    browser: "Browser games",
    cloud: "Cloud games",
    gfn: "GeForce NOW games",
    xbox: "Xbox Cloud games"
  };
  return map[filter] || "Games";
}

function filterGames() {
  const q = state.search.trim().toLowerCase();

  let result = [...state.games];

  if (state.activeFilter === "favorites") {
    const favIds = new Set(state.favorites.map(game => game.id));
    result = result.filter(game => favIds.has(game.id));
  } else if (state.activeFilter !== "all") {
    result = result.filter(game => {
      const type = getGameType(game);
      if (state.activeFilter === "cloud") {
        return type === "cloud" || type === "gfn" || type === "xbox";
      }
      return type === state.activeFilter;
    });
  }

  if (q) {
    result = result.filter(game => {
      const haystack = [
        game.title,
        game.description,
        getBadges(game).join(" "),
        getGameType(game)
      ].join(" ").toLowerCase();

      return haystack.includes(q);
    });
  }

  state.filteredGames = result;
}

function makePlaceholder(title = "Kardna") {
  const text = encodeURIComponent(title);
  return `https://placehold.co/800x500/0f1b31/e6f0ff?text=${text}`;
}

function safeImage(value, fallbackTitle) {
  return value && String(value).trim() ? value : makePlaceholder(fallbackTitle);
}

function renderGames() {
  filterGames();
  els.grid.innerHTML = "";

  els.resultsTitle.textContent = getFilterTitle(state.activeFilter);
  els.resultsMeta.textContent = `${state.filteredGames.length} result${state.filteredGames.length === 1 ? "" : "s"}`;

  if (!state.filteredGames.length) {
    const empty = document.createElement("div");
    empty.className = "glass-soft";
    empty.style.padding = "20px";
    empty.style.borderRadius = "24px";
    empty.textContent = "No games match that search yet.";
    els.grid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  state.filteredGames.forEach(game => {
    const node = els.template.content.firstElementChild.cloneNode(true);
    const thumb = node.querySelector(".game-thumb");
    const title = node.querySelector(".game-title");
    const desc = node.querySelector(".game-description");
    const badges = node.querySelector(".game-badges");
    const favoriteStar = node.querySelector(".favorite-star");
    const playBtn = node.querySelector(".play-card-btn");

    thumb.src = safeImage(game.image, game.title);
    thumb.alt = game.title;
    title.textContent = game.title;
    desc.textContent = game.description || "No description yet.";

    badges.innerHTML = "";
    getBadges(game).forEach(label => {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = label;
      badges.appendChild(badge);
    });

    if (isFavorite(game.id)) favoriteStar.classList.add("active");

    favoriteStar.addEventListener("click", event => {
      event.stopPropagation();
      toggleFavorite(game);
    });

    playBtn.addEventListener("click", event => {
      event.stopPropagation();
      launchGame(game);
    });

    node.addEventListener("click", () => openDetails(game));
    fragment.appendChild(node);
  });

  els.grid.appendChild(fragment);
}

function renderFavorites() {
  els.favoritesList.innerHTML = "";

  if (!state.favorites.length) {
    els.favoritesList.className = "favorites-list empty-state";
    els.favoritesList.textContent = "No favorites yet";
    return;
  }

  els.favoritesList.className = "favorites-list";

  state.favorites.forEach(game => {
    const button = document.createElement("button");
    button.className = "favorite-pill";
    button.type = "button";
    button.innerHTML = `<span>${game.title}</span><span class="remove">✕</span>`;
    button.addEventListener("click", event => {
      if (event.target.classList.contains("remove")) {
        toggleFavorite(game);
      } else {
        openDetails(game);
      }
    });
    els.favoritesList.appendChild(button);
  });
}

function updateStats() {
  els.gameCount.textContent = state.games.length;
  els.favoriteCount.textContent = state.favorites.length;
}

function updateDetailsFavoriteButton() {
  if (!state.currentGame) return;
  els.favoriteBtn.textContent = isFavorite(state.currentGame.id) ? "Remove favorite" : "Add favorite";
}

function openDetails(game) {
  state.currentGame = game;
  els.detailsTitle.textContent = game.title;
  els.detailsImage.src = safeImage(game.image, game.title);
  els.detailsImage.alt = game.title;
  els.detailsDescription.textContent = game.description || "No description yet.";
  els.detailsTags.innerHTML = "";
  getBadges(game).forEach(label => {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = label;
    els.detailsTags.appendChild(badge);
  });

  els.screenshots.innerHTML = "";
  const shots = Array.isArray(game.screenshots) && game.screenshots.length
    ? game.screenshots
    : [safeImage(game.image, game.title)];

  shots.slice(0, 6).forEach(src => {
    const img = document.createElement("img");
    img.src = safeImage(src, game.title);
    img.alt = `${game.title} screenshot`;
    img.onerror = () => {
      img.src = makePlaceholder(game.title);
    };
    els.screenshots.appendChild(img);
  });

  updateDetailsFavoriteButton();
  els.detailsOverlay.classList.remove("hidden");
}

function closeOverlay(id) {
  document.getElementById(id).classList.add("hidden");
}

function isFileOrRelativePath(value) {
  if (!value) return false;
  const str = String(value).trim();
  if (str.startsWith("/") || str.startsWith("./") || str.startsWith("../")) return true;
  if (!/^https?:\/\//i.test(str) && !/^www\./i.test(str)) return true;
  return false;
}

function getUvHost() {
  return url22 || location.host;
}

function launchViaClickValue(clickValue) {
  if (!clickValue) return false;
  const value = String(clickValue).trim();

  if (value.startsWith("/")) {
    window.location.href = value;
    return true;
  }

  if (value.startsWith("http") || value.startsWith("www")) {
    const dest = value.startsWith("http") ? value : `https://${value}`;
    window.location.href = `https://${getUvHost()}/scram.html#${btoa(dest)}`;
    return true;
  }

  window.alert("Error, Please Contact Zenfy.");
  return true;
}

function launchGame(game) {
  state.currentGame = game;

  if (game.click) {
    const handled = launchViaClickValue(game.click);
    if (handled) return;
  }

  if (!game.iframe) {
    window.alert("Error, Please Contact Zenfy.");
    return;
  }

  let finalSrc;
  if (isFileOrRelativePath(game.iframe)) {
    finalSrc = game.iframe;
  } else {
    const dest = game.iframe.startsWith("http") ? game.iframe : `https://${game.iframe}`;
    finalSrc = `https://${getUvHost()}/scram.html#${btoa(dest)}`;
  }

  closeOverlay("detailsOverlay");
  els.launcherTitle.textContent = game.title;
  els.launcherFrame.src = finalSrc;
  els.launcherOverlay.classList.remove("hidden");
}

function closeLauncher() {
  els.launcherOverlay.classList.add("hidden");
  els.launcherFrame.src = "";
}

function renderFeaturedCarousel() {
  const featured = state.games
    .filter(game => safeImage(game.image, game.title))
    .slice(0, 8);

  els.featuredCarousel.innerHTML = "";

  const count = Math.max(featured.length, 1);
  const radius = Math.max(260, count * 34);

  featured.forEach((game, index) => {
    const angle = (360 / count) * index;
    const item = document.createElement("button");
    item.className = "carousel-item";
    item.type = "button";
    item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    item.innerHTML = `
      <img src="${safeImage(game.image, game.title)}" alt="${game.title}">
      <div class="caption">${game.title}</div>
    `;
    item.addEventListener("click", () => openDetails(game));
    els.featuredCarousel.appendChild(item);
  });
}

function syncFilterButtons() {
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === state.activeFilter);
  });
}

function applyFilter(filter) {
  state.activeFilter = filter;
  syncFilterButtons();
  renderGames();
}

function setupFilters() {
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });
}

function setupSearch() {
  els.searchInput.addEventListener("input", event => {
    state.search = event.target.value;
    renderGames();
  });
}

function setupTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light", theme === "light");

  document.querySelectorAll("[data-theme]").forEach(button => {
    button.addEventListener("click", () => {
      const nextTheme = button.dataset.theme;
      document.body.classList.toggle("light", nextTheme === "light");
      localStorage.setItem("theme", nextTheme);
      closeOverlay("settingsOverlay");
    });
  });
}

function setupOverlayButtons() {
  document.querySelectorAll("[data-close-overlay]").forEach(button => {
    button.addEventListener("click", () => closeOverlay(button.dataset.closeOverlay));
  });

  document.getElementById("settingsBtn").addEventListener("click", () => {
    els.settingsOverlay.classList.remove("hidden");
  });

  document.getElementById("favoritesQuickBtn").addEventListener("click", () => {
    applyFilter("favorites");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupHeroButtons() {
  document.getElementById("exploreBtn").addEventListener("click", () => {
    document.getElementById("resultsTitle").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("randomBtn").addEventListener("click", () => {
    if (!state.games.length) return;
    const randomGame = state.games[Math.floor(Math.random() * state.games.length)];
    openDetails(randomGame);
  });
}

function setupDetailsButtons() {
  els.favoriteBtn.addEventListener("click", () => {
    if (!state.currentGame) return;
    toggleFavorite(state.currentGame);
  });

  els.playBtn.addEventListener("click", () => {
    if (!state.currentGame) return;
    launchGame(state.currentGame);
  });

  document.getElementById("launcherCloseBtn").addEventListener("click", closeLauncher);
  document.getElementById("launcherFullscreenBtn").addEventListener("click", () => {
    els.launcherFrame.requestFullscreen?.();
  });
}

function setupDroplets() {
  const droplets = document.getElementById("droplets");
  const count = 6;
  const nodes = [];

  for (let i = 0; i < count; i += 1) {
    const node = document.createElement("div");
    node.className = "droplet";
    node.style.setProperty("--s", String(1 - i * 0.08));
    droplets.appendChild(node);
    nodes.push({
      el: node,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      lag: 0.06 + i * 0.02
    });
  }

  const update = () => {
    nodes.forEach((node, index) => {
      node.x += (node.tx - node.x) * node.lag;
      node.y += (node.ty - node.y) * node.lag;
      node.el.style.left = `${node.x}px`;
      node.el.style.top = `${node.y}px`;
      node.el.style.opacity = `${0.42 - index * 0.045}`;
    });
    requestAnimationFrame(update);
  };

  window.addEventListener("pointermove", event => {
    nodes.forEach((node, index) => {
      node.tx = event.clientX + index * 16;
      node.ty = event.clientY + index * 10;
    });
  });

  update();
}

async function loadGames() {
  try {
    const response = await fetch("games.json");
    const data = await response.json();

    state.games = (data.games || []).map(game => ({
      ...game,
      image: safeImage(game.image, game.title)
    }));

    normalizeFavorites();
    renderFavorites();
    updateStats();
    renderFeaturedCarousel();
    renderGames();
  } catch (error) {
    console.error(error);
    els.resultsMeta.textContent = "Could not load games.json";
  }
}

setupTheme();
setupFilters();
setupSearch();
setupOverlayButtons();
setupHeroButtons();
setupDetailsButtons();
setupDroplets();
loadGames();
