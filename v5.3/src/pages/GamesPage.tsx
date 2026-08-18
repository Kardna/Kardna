import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GameGrid } from "../components/GameGrid";
import { PageLoader } from "../components/PageLoader";
import { useProfile } from "../context/ProfileContext";
import { useGames } from "../hooks/useGames";
import type { GameSort, GameType } from "../types/game";

const PAGE_SIZE = 32;

export function GamesPage() {
  const { games, loading, error } = useGames();
  const { favoriteSet, profile, addSearch } = useProfile();
  const [params, setParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchRef = useRef<HTMLInputElement>(null);

  const query = params.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);
  const category = params.get("category") ?? "All";
  const typeParam = params.get("type");
  const type: GameType | "all" = typeParam === "html" || typeParam === "flash" ? typeParam : "all";
  const sortParam = params.get("sort");
  const sort: GameSort = sortParam === "az" || sortParam === "za" || sortParam === "newest" || sortParam === "popular" ? sortParam : "featured";
  const favoritesOnly = params.get("favorites") === "1";
  const recentOnly = params.get("recent") === "1";
  const players = params.get("players") ?? "all";
  const session = params.get("session") ?? "all";

  const updateParam = (key: string, value: string, defaultValue = "") => {
    const next = new URLSearchParams(params);
    next.delete("focus");
    if (!value || value === defaultValue) next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (params.get("focus") === "search") window.setTimeout(() => searchRef.current?.focus(), 50);
  }, [params]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [deferredQuery, category, type, sort, favoritesOnly, recentOnly, players, session]);

  useEffect(() => {
    const timer = window.setTimeout(() => deferredQuery.trim() && addSearch(deferredQuery), 800);
    return () => window.clearTimeout(timer);
  }, [addSearch, deferredQuery]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(games.map((game) => game.category))).sort()], [games]);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    const recentRank = new Map(profile.recent.map((id, index) => [id, index]));
    const result = games.filter((game) => {
      const haystack = [game.name, game.description, game.category, game.sessionLength, ...game.tags, ...game.controls].join(" ").toLowerCase();
      return (!needle || haystack.includes(needle))
        && (category === "All" || game.category === category)
        && (type === "all" || game.type === type)
        && (players === "all" || (players === "2" ? game.players > 1 : game.players === 1))
        && (session === "all" || game.sessionLength === session)
        && (!favoritesOnly || favoriteSet.has(game.id))
        && (!recentOnly || recentRank.has(game.id))
        && (!profile.settings.hideMature || !game.mature);
    });

    return result.sort((a, b) => {
      if (recentOnly) return (recentRank.get(a.id) ?? 999) - (recentRank.get(b.id) ?? 999);
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      if (sort === "newest") return b.dateAdded.localeCompare(a.dateAdded);
      if (sort === "popular") return b.popularity - a.popularity;
      return Number(b.featured) - Number(a.featured) || b.popularity - a.popularity || a.name.localeCompare(b.name);
    });
  }, [category, deferredQuery, favoriteSet, favoritesOnly, games, players, profile.recent, profile.settings.hideMature, recentOnly, session, sort, type]);

  const visibleGames = filtered.slice(0, visibleCount);
  const activeFilters = Boolean(query || category !== "All" || type !== "all" || sort !== "featured" || favoritesOnly || recentOnly || players !== "all" || session !== "all");

  if (loading) return <PageLoader />;

  return (
    <main id="main-content" className="catalog-page">
      <header className="catalog-hero">
        <div className="system-line"><span><i /> LIBRARY INDEX ONLINE</span><span>{games.length} RECORDS</span></div>
        <p className="channel-label">KARDNA / GAME DIRECTORY</p>
        <h1>Every game.<br /><em>Zero clutter.</em></h1>
        <p>Search instantly, filter locally, and launch only what you play.</p>
      </header>

      <section className="filter-panel" aria-label="Game filters">
        <label className="catalog-search">
          <span aria-hidden="true">⌕</span>
          <input ref={searchRef} value={query} onChange={(event) => updateParam("q", event.target.value)} placeholder="Search games, tags, controls, categories…" aria-label="Search game library" />
          {query && <button type="button" onClick={() => updateParam("q", "")}>CLEAR</button>}
        </label>
        <div className="filter-grid">
          <label><span>Category</span><select value={category} onChange={(event) => updateParam("category", event.target.value, "All")}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Game type</span><select value={type} onChange={(event) => updateParam("type", event.target.value, "all")}><option value="all">All types</option><option value="html">HTML5</option><option value="flash">Flash / Ruffle</option></select></label>
          <label><span>Players</span><select value={players} onChange={(event) => updateParam("players", event.target.value, "all")}><option value="all">Any players</option><option value="1">Solo</option><option value="2">Multiplayer</option></select></label>
          <label><span>Session</span><select value={session} onChange={(event) => updateParam("session", event.target.value, "all")}><option value="all">Any length</option><option value="quick">Quick</option><option value="medium">Medium</option><option value="long">Long</option></select></label>
          <label><span>Sort</span><select value={sort} onChange={(event) => updateParam("sort", event.target.value, "featured")}><option value="featured">Featured</option><option value="popular">Popular</option><option value="newest">Newest</option><option value="az">A–Z</option><option value="za">Z–A</option></select></label>
          <div className="filter-toggles">
            <button type="button" className={favoritesOnly ? "is-active" : ""} onClick={() => updateParam("favorites", favoritesOnly ? "" : "1")}>♥ Favorites</button>
            <button type="button" className={recentOnly ? "is-active" : ""} onClick={() => updateParam("recent", recentOnly ? "" : "1")}>↺ Recent</button>
          </div>
        </div>
      </section>

      <div className="catalog-summary">
        <p aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? "GAME" : "GAMES"} FOUND {visibleGames.length < filtered.length ? `· SHOWING ${visibleGames.length}` : ""}</p>
        {activeFilters && <button type="button" onClick={() => setParams({}, { replace: true })}>RESET FILTERS ↺</button>}
      </div>

      {error && <div className="site-error" role="alert">Catalog signal lost: {error}</div>}
      <GameGrid games={visibleGames} mixed={profile.settings.cardPreference === "mixed" && !profile.settings.lowPerformance} emptyTitle={favoritesOnly ? "No favorites yet" : "No matching games"} emptyText={favoritesOnly ? "Save a game from any card or player." : "Try another search or reset the filters."} />
      {visibleGames.length < filtered.length && <div className="load-more-row"><button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>LOAD {Math.min(PAGE_SIZE, filtered.length - visibleGames.length)} MORE <span>↓</span></button></div>}
    </main>
  );
}
