import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useGames } from "../hooks/useGames";
import { Logo } from "./Logo";

export function Navbar() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { games } = useGames();
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("menu-open", menuOpen);
    return () => { window.removeEventListener("keydown", onKey); document.body.classList.remove("menu-open"); };
  }, [menuOpen]);

  const randomGame = () => {
    const game = games[Math.floor(Math.random() * games.length)];
    if (game) navigate(`/play/${game.id}`);
    setMenuOpen(false);
  };

  return (
    <header className={`site-header ${compact ? "site-header--compact" : ""}`}>
      <nav className="navbar" aria-label="Primary navigation">
        <Logo compact={compact} />
        <div className="navbar__links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/games">Games</NavLink>
          <NavLink to="/mix">Mix</NavLink>
          <NavLink to="/proxy">Proxy</NavLink>
        </div>
        <div className="navbar__actions">
          <button className="command-trigger" type="button" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))} aria-label="Open command search">
            <span aria-hidden="true">⌕</span><span>Search</span><kbd>Ctrl K</kbd>
          </button>
          <Link className="nav-heart" to="/games?favorites=1" aria-label={`${profile.favorites.length} favorites`}>♥ <span>{profile.favorites.length}</span></Link>
          <button className={`menu-button ${menuOpen ? "is-open" : ""}`} type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
        </div>
      </nav>
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/games" onClick={() => setMenuOpen(false)}>Games</NavLink>
        <NavLink to="/mix" onClick={() => setMenuOpen(false)}>Kardna Mix</NavLink>
        <NavLink to="/proxy" onClick={() => setMenuOpen(false)}>Proxy</NavLink>
        <NavLink to="/settings" onClick={() => setMenuOpen(false)}>Settings</NavLink>
        <button type="button" onClick={randomGame}>Surprise me <span>↗</span></button>
        <small>KARDNA ONLINE</small>
      </div>
    </header>
  );
}
