import { useEffect, useState } from "react";
import type { Game } from "../types/game";
import { ImageWithFallback } from "./ImageWithFallback";

type Props = { games: Game[] };

function canShowArtwork() {
  const wideEnough = window.matchMedia("(min-width: 861px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return wideEnough && !reducedMotion && navigator.hardwareConcurrency > 4 && deviceMemory > 4;
}

export function HeroArtworkBands({ games }: Props) {
  const [enabled, setEnabled] = useState(canShowArtwork);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 861px)");
    const update = () => setEnabled(canShowArtwork());
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  const artwork = games.slice(0, 6);
  if (!artwork.length) return <div className="hero-artwork hero-artwork--loading" aria-hidden="true" />;

  return (
    <div className="hero-artwork" aria-hidden="true">
      {artwork.map((game, index) => (
        <div className="art-tile" key={game.id}>
          <ImageWithFallback
            src={game.image}
            alt=""
            width={520}
            height={380}
            loading={index < 3 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}
