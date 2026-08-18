export type GameType = "html" | "flash";
export type GameSort = "featured" | "az" | "za" | "newest" | "popular";
export type CardSize = "small" | "medium" | "large";

export interface Game {
  id: string;
  name: string;
  image: string;
  url: string;
  type: GameType;
  category: string;
  description: string;
  tags: string[];
  featured: boolean;
  dateAdded: string;
  players: number;
  controls: string[];
  popularity: number;
  sessionLength: "quick" | "medium" | "long";
  fullscreen: boolean;
  mobile: boolean;
  mature: boolean;
}
