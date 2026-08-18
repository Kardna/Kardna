import type { CardSize, Game } from "../types/game";
import { GameCard } from "./GameCard";

interface GameGridProps {
  games: Game[];
  mixed?: boolean;
  size?: CardSize;
  emptyTitle?: string;
  emptyText?: string;
}

export function GameGrid({ games, mixed = false, size = "small", emptyTitle = "No games here", emptyText = "Try another collection." }: GameGridProps) {
  if (!games.length) {
    return <div className="empty-state"><span>□</span><h2>{emptyTitle}</h2><p>{emptyText}</p></div>;
  }
  return (
    <div className={`game-grid ${mixed ? "game-grid--mixed" : ""}`}>
      {games.map((game, index) => {
        const mixedSize: CardSize = index === 0 || index === 7 ? "large" : index === 2 || index === 5 ? "medium" : size;
        return <GameCard key={game.id} game={game} size={mixed ? mixedSize : size} index={index} />;
      })}
    </div>
  );
}
