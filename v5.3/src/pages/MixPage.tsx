import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { PageLoader } from "../components/PageLoader";
import { useProfile } from "../context/ProfileContext";
import { useGames } from "../hooks/useGames";

export function MixPage() {
  const { games, loading } = useGames();
  const { profile, favoriteSet, toggleFavorite, dislikeMixGame } = useProfile();
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  const recommendations = useMemo(() => {
    const categoryScores = new Map<string, number>();
    profile.recent.forEach((id, index) => {
      const game = games.find((item) => item.id === id);
      if (game) categoryScores.set(game.category, (categoryScores.get(game.category) ?? 0) + Math.max(1, 8 - index));
    });
    profile.favorites.forEach((id) => {
      const game = games.find((item) => item.id === id);
      if (game) categoryScores.set(game.category, (categoryScores.get(game.category) ?? 0) + 10);
    });
    return games
      .filter((game) => !profile.mixDisliked.includes(game.id) && (!profile.settings.hideMature || !game.mature))
      .sort((a, b) => (categoryScores.get(b.category) ?? 0) - (categoryScores.get(a.category) ?? 0) || b.popularity - a.popularity || a.name.localeCompare(b.name));
  }, [games, profile.favorites, profile.mixDisliked, profile.recent, profile.settings.hideMature]);

  if (loading) return <PageLoader />;
  const game = recommendations[offset % Math.max(1, recommendations.length)];
  if (!game) return <main className="mix-page"><div className="empty-state"><h1>Mix is empty.</h1><p>Reset your local preferences in Settings to refill it.</p><Link to="/settings">Open Settings</Link></div></main>;
  const favorite = favoriteSet.has(game.id);

  return (
    <main id="main-content" className="mix-page">
      <header className="mix-header"><div><p className="channel-label">PERSONAL DISCOVERY ENGINE</p><h1>Kardna <em>Mix.</em></h1></div><div className="mix-progress"><span>{String((offset % recommendations.length) + 1).padStart(2, "0")}</span><i /><span>{String(recommendations.length).padStart(2, "0")}</span></div></header>
      <section className="mix-stage">
        <div className="mix-art"><ImageWithFallback src={game.image} alt={`${game.name} artwork`} width={1200} height={800} /><span>{game.category}</span></div>
        <div className="mix-info">
          <div className="system-line"><span><i /> MATCH FOUND</span><span>{game.popularity}% SIGNAL</span></div>
          <p>{game.type.toUpperCase()} · {game.players > 1 ? `${game.players} PLAYERS` : game.sessionLength.toUpperCase()}</p>
          <h2>{game.name}</h2>
          <p className="mix-description">{game.description}</p>
          <div className="tag-list">{game.tags.slice(0, 5).map((tag) => <span key={tag}>#{tag}</span>)}</div>
          <div className="mix-actions">
            <button className="mix-play" type="button" onClick={() => navigate(`/play/${game.id}`)}>PLAY NOW <span>▶</span></button>
            <button type="button" className={favorite ? "is-active" : ""} onClick={() => toggleFavorite(game.id)}>{favorite ? "SAVED ♥" : "SAVE ♡"}</button>
            <button type="button" onClick={() => setOffset((value) => value + 1)}>SKIP →</button>
            <button type="button" onClick={() => { dislikeMixGame(game.id); setOffset((value) => value + 1); }}>NOT INTERESTED</button>
          </div>
        </div>
      </section>
    </main>
  );
}
