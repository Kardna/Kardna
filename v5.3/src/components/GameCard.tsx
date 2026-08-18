import { memo, useRef, type CSSProperties, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import type { CardSize, Game } from "../types/game";
import { withBase } from "../utilities/paths";
import { ImageWithFallback } from "./ImageWithFallback";

interface GameCardProps {
  game: Game;
  size?: CardSize;
  index?: number;
}

type CardStyle = CSSProperties & {
  "--card-index": number;
  "--game-art": string;
  "--pointer-x": string;
  "--pointer-y": string;
  "--tilt-x": string;
  "--tilt-y": string;
};

export const GameCard = memo(function GameCard({ game, size = "small", index = 0 }: GameCardProps) {
  const { favoriteSet, toggleFavorite, profile } = useProfile();
  const cardRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const favorite = favoriteSet.has(game.id);
  const lastPlayed = profile.lastPlayed[game.id];
  const launchCount = profile.launches[game.id] ?? 0;
  const artwork = withBase(game.image).replace(/"/g, "\\\"");

  const updatePointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || profile.settings.lowPerformance || profile.settings.reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const clientX = event.clientX;
    const clientY = event.clientY;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      card.style.setProperty("--pointer-x", `${(x * 100).toFixed(2)}%`);
      card.style.setProperty("--pointer-y", `${(y * 100).toFixed(2)}%`);
      card.style.setProperty("--tilt-x", `${((0.5 - y) * 3.2).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${((x - 0.5) * 3.2).toFixed(2)}deg`);
    });
  };

  const resetPointer = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  const style: CardStyle = {
    "--card-index": index,
    "--game-art": `url("${artwork}")`,
    "--pointer-x": "50%",
    "--pointer-y": "50%",
    "--tilt-x": "0deg",
    "--tilt-y": "0deg",
  };

  return (
    <article
      ref={cardRef}
      className={`game-card game-card--${size}`}
      style={style}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <span className="game-card__ambient" aria-hidden="true" />
      <Link className="game-card__media" to={`/play/${game.id}`} aria-label={`Play ${game.name}`}>
        <ImageWithFallback src={game.image} alt={`${game.name} game artwork`} width={640} height={420} />
        <span className="game-card__shade" />
        <span className="game-card__sheen" aria-hidden="true" />
        <span className="game-card__type">{game.type.toUpperCase()}</span>
        {game.featured && <span className="game-card__signal">TRENDING</span>}
        <span className="game-card__play" aria-hidden="true">▶</span>
      </Link>
      <div className="game-card__glass">
        <div className="game-card__body">
          <div>
            <p>{game.category} · {game.players > 1 ? `${game.players} players` : game.sessionLength}</p>
            <h3><Link to={`/play/${game.id}`}>{game.name}</Link></h3>
          </div>
          <button type="button" className={favorite ? "is-favorite" : ""} onClick={() => toggleFavorite(game.id)} aria-pressed={favorite} aria-label={favorite ? `Remove ${game.name} from favorites` : `Save ${game.name}`}>♥</button>
        </div>
        <div className="game-card__details" aria-hidden="true">
          <span>{game.controls.slice(0, 2).join(" + ")}</span>
          <span>{lastPlayed ? `Played ${new Date(lastPlayed).toLocaleDateString()}` : launchCount ? `${launchCount} launches` : "Ready to launch"}</span>
        </div>
      </div>
    </article>
  );
});
