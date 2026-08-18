import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GameCard } from "../components/GameCard";
import { GameGrid } from "../components/GameGrid";
import { PageLoader } from "../components/PageLoader";
import { useProfile } from "../context/ProfileContext";
import { useGames } from "../hooks/useGames";

const quickPrompts = [
  ["Drive something", "Racing"],
  ["Play with a friend", "multiplayer"],
  ["Waste five minutes", "quick"],
  ["Try something difficult", "hard"],
  ["Surprise me", "random"],
] as const;


const randomModes = [
  ["Anything", "anything"],
  ["Something Fast", "fast"],
  ["Multiplayer", "multiplayer"],
  ["Something Weird", "weird"],
  ["Hidden Gem", "hidden"],
  ["Kardna Classic", "classic"],
] as const;

const collectionDefinitions = [
  { title: "Games Under Five Minutes", kicker: "QUICK SESSION", query: "quick", symbol: "05" },
  { title: "Keyboard Only", kicker: "NO MOUSE NEEDED", query: "keyboard", symbol: "⌨" },
  { title: "Play With a Friend", kicker: "MULTIPLAYER", query: "multiplayer", symbol: "02" },
  { title: "Kardna Classics", kicker: "ARCHIVE CHANNEL", query: "Classics", symbol: "K" },
  { title: "Games That Get Hard Fast", kicker: "HIGH INTENSITY", query: "parkour", symbol: "↑" },
  { title: "Hidden Gems", kicker: "LOW SIGNAL / HIGH VALUE", query: "logic", symbol: "✦" },
];

export function HomePage() {
  const { games, loading, error } = useGames();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const visibleGames = useMemo(() => profile.settings.hideMature ? games.filter((game) => !game.mature) : games, [games, profile.settings.hideMature]);
  const trending = useMemo(() => [...visibleGames].sort((a, b) => b.popularity - a.popularity || Number(b.featured) - Number(a.featured)).slice(0, 8), [visibleGames]);
  const featured = trending.slice(0, 5);
  const recent = profile.recent.map((id) => visibleGames.find((game) => game.id === id)).filter((game): game is NonNullable<typeof game> => Boolean(game)).slice(0, 8);
  const recentlyAdded = useMemo(() => [...visibleGames].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 8), [visibleGames]);

  const submitSearch = () => {
    const cleaned = query.trim();
    navigate(cleaned ? `/games?q=${encodeURIComponent(cleaned)}` : "/games");
  };

  const quickAction = (value: string) => {
    if (value === "random") {
      const game = visibleGames[Math.floor(Math.random() * visibleGames.length)];
      if (game) navigate(`/play/${game.id}`);
      return;
    }
    if (value === "quick") navigate("/games?session=quick");
    else if (value === "multiplayer") navigate("/games?players=2");
    else navigate(`/games?q=${encodeURIComponent(value)}`);
  };

  const playRandomMode = (mode: string) => {
    let pool = visibleGames;
    if (mode === "fast") pool = visibleGames.filter((game) => game.sessionLength === "quick");
    if (mode === "multiplayer") pool = visibleGames.filter((game) => game.players > 1);
    if (mode === "weird") pool = visibleGames.filter((game) => game.tags.some((tag) => ["weird", "physics", "experimental", "3d"].includes(tag.toLowerCase())));
    if (mode === "hidden") pool = visibleGames.filter((game) => !game.featured && game.popularity < 70);
    if (mode === "classic") pool = visibleGames.filter((game) => game.category === "Classics" || game.tags.includes("classic") || game.tags.includes("retro"));
    const game = (pool.length ? pool : visibleGames)[Math.floor(Math.random() * Math.max(1, (pool.length ? pool : visibleGames).length))];
    if (game) navigate(`/play/${game.id}`);
  };

  if (loading) return <PageLoader />;

  return (
    <main id="main-content" className="kardna-home">
      <section className="kardna-hero">
        <div className="system-line"><span><i /> KARDNA ONLINE</span><span>{visibleGames.length} GAMES INDEXED</span><span>LOCAL PROFILE ACTIVE</span></div>
        <div className="kardna-hero__copy">
          <p className="channel-label">KARDNA / PLAY NOW</p>
          <div className="hero-brand-glow" data-text="KARDNA" aria-label="Kardna">KARDNA</div>
          <h1>What are we <em>playing?</em></h1>
          <p className="kardna-hero__lede">A fast home for browser classics, strange little games, and whatever steals the next hour.</p>
        </div>
        <form className="universal-search" onSubmit={(event) => { event.preventDefault(); submitSearch(); }}>
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games, categories, and collections…" aria-label="Search games" />
          <button type="submit">SEARCH <span>↗</span></button>
          <kbd>/</kbd>
        </form>
        <div className="quick-prompts" aria-label="Quick game suggestions">
          {quickPrompts.map(([label, value]) => <button key={label} type="button" onClick={() => quickAction(value)}>{label}<span>↗</span></button>)}
        </div>
        <div className="random-channel" aria-label="Random game modes">
          <span>RANDOM CHANNEL</span>
          {randomModes.map(([label, mode]) => <button key={mode} type="button" onClick={() => playRandomMode(mode)}>{label}</button>)}
        </div>
      </section>

      {error && <div className="site-error" role="alert">Catalog signal lost: {error}</div>}

      <section className="broadcast-section featured-broadcast" aria-labelledby="featured-heading">
        <div className="broadcast-heading">
          <div><span className="channel-number">01</span><p>FEATURED BROADCAST</p><h2 id="featured-heading">On air now.</h2></div>
          <Link to="/games">View full library <span>↗</span></Link>
        </div>
        <div className="featured-grid">
          {featured.map((game, index) => <GameCard key={game.id} game={game} size={index === 0 ? "large" : index < 3 ? "medium" : "small"} index={index} />)}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="broadcast-section" aria-labelledby="continue-heading">
          <div className="broadcast-heading">
            <div><span className="channel-number">02</span><p>LOCAL MEMORY</p><h2 id="continue-heading">Continue playing.</h2></div>
            <Link to="/games?recent=1">Open recent <span>↗</span></Link>
          </div>
          <div className="horizontal-games">{recent.map((game, index) => <GameCard key={game.id} game={game} index={index} />)}</div>
        </section>
      )}

      <section className="broadcast-section" aria-labelledby="trending-heading">
        <div className="broadcast-heading">
          <div><span className="channel-number">03</span><p>KARDNA NETWORK</p><h2 id="trending-heading">Trending on Kardna.</h2></div>
          <span className="live-badge"><i /> LIVE RANKING</span>
        </div>
        <GameGrid games={trending} />
      </section>

      <section className="broadcast-section collections-section" aria-labelledby="collections-heading">
        <div className="broadcast-heading"><div><span className="channel-number">04</span><p>CURATED CHANNELS</p><h2 id="collections-heading">Pick a frequency.</h2></div></div>
        <div className="collection-grid">
          {collectionDefinitions.map((collection, index) => (
            <Link key={collection.title} to={`/games?q=${encodeURIComponent(collection.query)}`} className={`collection-card collection-card--${(index % 3) + 1}`}>
              <span className="collection-card__symbol">{collection.symbol}</span>
              <p>{collection.kicker}</p>
              <h3>{collection.title}</h3>
              <span className="collection-card__arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mix-banner">
        <div><span className="channel-label">KARDNA MIX / PERSONAL DISCOVERY</span><h2>One game at a time.<br />No endless scrolling.</h2><p>Save it, skip it, or launch immediately. Recommendations improve locally as you play.</p></div>
        <Link to="/mix" className="mix-orb" aria-label="Open Kardna Mix"><span>START<br />MIX</span><i>↗</i></Link>
      </section>

      <section className="broadcast-section" aria-labelledby="new-heading">
        <div className="broadcast-heading"><div><span className="channel-number">05</span><p>FRESH INDEX</p><h2 id="new-heading">Recently added.</h2></div><Link to="/games?sort=newest">See newest <span>↗</span></Link></div>
        <GameGrid games={recentlyAdded} />
      </section>

      <section className="library-callout">
        <div><p>FULL GAME LIBRARY</p><h2>{visibleGames.length} games.<br />One clean index.</h2></div>
        <div><p>Every game is loaded only when you launch it. No background iframes. Glass effects stay focused on interactive surfaces and turn off automatically in low-performance mode.</p><Link to="/games">OPEN THE LIBRARY <span>↗</span></Link></div>
      </section>
    </main>
  );
}
