import { useEffect, useState } from "react";
import type { Game } from "../types/game";
import { normalizeGames } from "../utilities/gameData";
import { withBase } from "../utilities/paths";

type GamesState = {
  games: Game[];
  loading: boolean;
  error: string | null;
};

let cachedGames: Game[] | null = null;
let request: Promise<Game[]> | null = null;

async function loadGames(): Promise<Game[]> {
  if (cachedGames) return cachedGames;
  if (!request) {
    request = fetch(withBase("games.json"), { cache: import.meta.env.DEV ? "no-store" : "default" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`games.json returned ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then(normalizeGames)
      .then((games) => {
        cachedGames = games;
        return games;
      })
      .finally(() => {
        request = null;
      });
  }
  return request;
}

export function useGames(): GamesState {
  const [state, setState] = useState<GamesState>({
    games: cachedGames ?? [],
    loading: !cachedGames,
    error: null,
  });

  useEffect(() => {
    let active = true;
    if (cachedGames) {
      setState({ games: cachedGames, loading: false, error: null });
      return () => {
        active = false;
      };
    }

    loadGames()
      .then((games) => {
        if (active) setState({ games, loading: false, error: null });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown loading error";
        if (active) setState({ games: [], loading: false, error: message });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
