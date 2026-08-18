import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useGames } from "../hooks/useGames";

interface CommandItem {
  id: string;
  label: string;
  detail: string;
  icon: string;
  keywords: string;
  run: () => void;
}

export function CommandPalette() {
  const { games } = useGames();
  const { profile, addSearch } = useProfile();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    window.setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const base: CommandItem[] = [
      { id: "games", label: "Browse all games", detail: "Library", icon: "▦", keywords: "catalog browse games", run: () => navigate("/games") },
      { id: "mix", label: "Open Kardna Mix", detail: "Discovery", icon: "✦", keywords: "random recommend discovery", run: () => navigate("/mix") },
      { id: "proxy", label: "Open Proxy", detail: "Browser", icon: "◎", keywords: "proxy browse web scramjet", run: () => navigate("/proxy") },
      { id: "favorites", label: "Show favorites", detail: `${profile.favorites.length} saved`, icon: "♥", keywords: "saved favorites", run: () => navigate("/games?favorites=1") },
      { id: "recent", label: "Show recent games", detail: `${profile.recent.length} played`, icon: "↺", keywords: "recent continue history", run: () => navigate("/games?recent=1") },
      { id: "settings", label: "Open settings", detail: "Kardna", icon: "⚙", keywords: "settings theme performance volume", run: () => navigate("/settings") },
    ];
    const gameItems = games.map((game) => ({
      id: `game-${game.id}`,
      label: game.name,
      detail: `${game.category} · ${game.type.toUpperCase()}`,
      icon: "▶",
      keywords: `${game.name} ${game.category} ${game.tags.join(" ")}`,
      run: () => navigate(`/play/${game.id}`),
    }));
    return [...base, ...gameItems];
  }, [games, navigate, profile.favorites.length, profile.recent.length]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items.slice(0, 10);
    return items.filter((item) => `${item.label} ${item.detail} ${item.keywords}`.toLowerCase().includes(needle)).slice(0, 12);
  }, [items, query]);

  useEffect(() => setActive(0), [query]);

  const runItem = (item: CommandItem) => {
    if (query) addSearch(query);
    item.run();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setOpen(false);
    }}>
      <section className="command-panel" role="dialog" aria-modal="true" aria-label="Kardna command search">
        <div className="command-search">
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(results.length - 1, value + 1)); }
              if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(0, value - 1)); }
              if (event.key === "Enter" && results[active]) { event.preventDefault(); runItem(results[active]); }
            }}
            placeholder="Search games, collections, proxy, settings…"
            aria-label="Search Kardna"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-results" role="listbox" aria-live="polite">
          {results.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={index === active}
              className={index === active ? "is-active" : ""}
              onMouseEnter={() => setActive(index)}
              onClick={() => runItem(item)}
            >
              <span className="command-icon" aria-hidden="true">{item.icon}</span>
              <span><strong>{item.label}</strong><small>{item.detail}</small></span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
          {!results.length && <p className="command-empty">No commands found. Press Enter in the game catalog for a wider search.</p>}
        </div>
        <footer><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span>KARDNA ONLINE <i /></span></footer>
      </section>
    </div>
  );
}
