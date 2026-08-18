import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from "react";
import { Link } from "react-router-dom";
import type { Game } from "../types/game";
import { ImageWithFallback } from "./ImageWithFallback";

type Props = { games: Game[] };

export function FeaturedCarousel({ games }: Props) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const active = games[index];

  useEffect(() => {
    if (index >= games.length) setIndex(0);
  }, [games.length, index]);

  if (!active) return null;

  const go = (next: number) => setIndex((next + games.length) % games.length);
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  };
  const onTouchStart = (event: TouchEvent) => { touchStart.current = event.touches[0]?.clientX ?? null; };
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return;
    const end = event.changedTouches[0]?.clientX ?? touchStart.current;
    const delta = end - touchStart.current;
    if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
    touchStart.current = null;
  };

  return (
    <section
      className="featured-carousel"
      aria-roledescription="carousel"
      aria-label="Featured games"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ "--feature-accent": index % 2 ? "var(--pink)" : "var(--blue)" } as CSSProperties}
    >
      <div className="featured-carousel__media">
        <ImageWithFallback key={active.id} src={active.image} alt={`${active.name} featured artwork`} width={1200} height={800} />
        <span className="featured-carousel__number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="featured-carousel__copy" aria-live="polite" aria-atomic="true">
        <div className="featured-carousel__meta">
          <span>{active.category}</span>
          <span className={`badge badge--${active.type}`}>{active.type.toUpperCase()}</span>
        </div>
        <h3 key={`${active.id}-title`}>{active.name}</h3>
        <p key={`${active.id}-desc`}>{active.description}</p>
        <Link className="button button--dark" to={`/play/${active.id}`}>Play now <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="featured-carousel__controls">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous featured game">←</button>
        <div className="featured-carousel__progress" aria-label={`Slide ${index + 1} of ${games.length}`}>
          {games.map((game, itemIndex) => (
            <button
              type="button"
              key={game.id}
              className={itemIndex === index ? "is-active" : ""}
              onClick={() => setIndex(itemIndex)}
              aria-label={`Show ${game.name}`}
              aria-current={itemIndex === index ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next featured game">→</button>
      </div>
    </section>
  );
}
