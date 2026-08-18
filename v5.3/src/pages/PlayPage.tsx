import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GameGrid } from "../components/GameGrid";
import { GamePlayer } from "../components/GamePlayer";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { PageLoader } from "../components/PageLoader";
import { useProfile } from "../context/ProfileContext";
import { useGames } from "../hooks/useGames";
import { NotFoundPage } from "./NotFoundPage";

export function PlayPage() {
  const { id } = useParams();
  const { games, loading } = useGames();
  const { profile, favoriteSet, toggleFavorite, recordLaunch, recordPlaytime } = useProfile();
  const navigate = useNavigate();
  const frameRef = useRef<HTMLElement>(null);
  const hideTimer = useRef<number | null>(null);
  const launchStartedAt = useRef<number | null>(null);
  const [launched, setLaunched] = useState(false);
  const [instance, setInstance] = useState(0);
  const [muted, setMuted] = useState(profile.settings.volume === 0);
  const [theater, setTheater] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const game = games.find((item) => item.id === id);

  const related = useMemo(() => game ? games.filter((item) => item.id !== game.id).sort((a, b) => Number(b.category === game.category) - Number(a.category === game.category) || b.popularity - a.popularity).slice(0, 8) : [], [game, games]);
  const nextGame = related[0];

  const showDockTemporarily = useCallback(() => {
    setDockVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    if (launched && !showControls && !reportOpen) hideTimer.current = window.setTimeout(() => setDockVisible(false), 2600);
  }, [launched, reportOpen, showControls]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement === frameRef.current) await document.exitFullscreen();
      else await frameRef.current?.requestFullscreen();
    } catch {
      // Fullscreen can be disabled by browser or device policy.
    }
  }, []);

  const restart = useCallback(() => {
    setInstance((value) => value + 1);
    showDockTemporarily();
  }, [showDockTemporarily]);

  const exitGame = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    setLaunched(false);
    setInstance(0);
    setTheater(false);
    setShowControls(false);
    setReportOpen(false);
    setDockVisible(true);
  }, [game?.id]);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    if (!launched || !game) return;
    launchStartedAt.current = Date.now();
    recordLaunch(game.id);
    return () => {
      if (launchStartedAt.current) recordPlaytime(game.id, Math.round((Date.now() - launchStartedAt.current) / 1000));
      launchStartedAt.current = null;
    };
  }, [game, launched, recordLaunch, recordPlaytime]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      const key = event.key.toLowerCase();
      if (key === "m") setMuted((value) => !value);
      if (key === "f") void toggleFullscreen();
      if (key === "r" && launched) restart();
      if (key === "t") setTheater((value) => !value);
      if (key === "c") setShowControls((value) => !value);
      if (event.key === "Escape" && !document.fullscreenElement && theater) setTheater(false);
      showDockTemporarily();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launched, restart, showDockTemporarily, theater, toggleFullscreen]);

  useEffect(() => {
    showDockTemporarily();
    return () => { if (hideTimer.current) window.clearTimeout(hideTimer.current); };
  }, [showDockTemporarily]);

  if (loading) return <PageLoader />;
  if (!game) return <NotFoundPage compact title="Game not found" text="That game may have moved, changed names, or escaped the catalog." />;

  const favorite = favoriteSet.has(game.id);

  return (
    <main id="main-content" className={`play-page ${theater ? "is-theater" : ""}`}>
      <header className="play-header">
        <button type="button" onClick={exitGame}>← RETURN TO LIBRARY</button>
        <div><p>{game.category} / {game.type.toUpperCase()}</p><h1>{game.name}</h1></div>
        <div className="play-header__status"><i /> PLAYER READY</div>
      </header>

      <section
        ref={frameRef}
        className={`player-frame ${launched ? "is-launched" : ""} ${dockVisible ? "dock-visible" : "dock-hidden"}`}
        aria-label={`${game.name} player`}
        onMouseMove={showDockTemporarily}
        onTouchStart={showDockTemporarily}
      >
        {!launched ? (
          <div className="launch-screen">
            <ImageWithFallback src={game.image} alt="" width={1400} height={900} />
            <span className="launch-screen__shade" />
            <div className="launch-screen__content">
              <p><i /> GAME IMAGE VERIFIED</p>
              <h2>{game.name}</h2>
              <span>{game.description}</span>
              <button type="button" onClick={() => setLaunched(true)}>LAUNCH GAME <b>▶</b></button>
              <small>No iframe is created until launch.</small>
            </div>
          </div>
        ) : (
          <div className="player-stage"><GamePlayer key={`${game.id}-${instance}`} game={game} muted={muted} volume={profile.settings.volume} /></div>
        )}

        <div className="player-dock" aria-label="Game player dock">
          <div className="dock-game"><span className="player-live-dot" /><div><small>NOW PLAYING</small><strong>{game.name}</strong></div></div>
          <div className="dock-actions">
            <button type="button" onClick={exitGame} title="Exit game"><span>←</span><small>EXIT</small></button>
            <button type="button" onClick={restart} disabled={!launched} title="Restart game"><span>↻</span><small>RESTART</small></button>
            <button type="button" onClick={toggleFullscreen} title="Fullscreen"><span>{isFullscreen ? "↙" : "⛶"}</span><small>{isFullscreen ? "WINDOW" : "FULL"}</small></button>
            <button type="button" className={theater ? "is-active" : ""} onClick={() => setTheater((value) => !value)} title="Theater mode"><span>▭</span><small>THEATER</small></button>
            <button type="button" className={muted ? "is-active" : ""} onClick={() => setMuted((value) => !value)} title={muted ? "Unmute" : "Mute"}><span>{muted ? "🔇" : "🔊"}</span><small>{muted ? "UNMUTE" : "MUTE"}</small></button>
            <button type="button" className={favorite ? "is-active" : ""} onClick={() => toggleFavorite(game.id)} title="Favorite"><span>♥</span><small>SAVE</small></button>
            <button type="button" className={showControls ? "is-active" : ""} onClick={() => setShowControls((value) => !value)} title="Show controls"><span>⌨</span><small>CONTROLS</small></button>
            <button type="button" onClick={() => setReportOpen(true)} title="Report broken game"><span>!</span><small>REPORT</small></button>
            <button type="button" onClick={() => nextGame && navigate(`/play/${nextGame.id}`)} disabled={!nextGame} title="Next game"><span>→</span><small>NEXT</small></button>
          </div>
        </div>

        {showControls && <aside className="controls-panel"><button type="button" onClick={() => setShowControls(false)}>×</button><p>GAME CONTROLS</p><h2>{game.controls.join(" + ")}</h2><ul><li><kbd>M</kbd> Mute</li><li><kbd>F</kbd> Fullscreen</li><li><kbd>R</kbd> Restart</li><li><kbd>T</kbd> Theater</li><li><kbd>C</kbd> Controls</li></ul></aside>}

        {reportOpen && <div className="report-dialog" role="dialog" aria-modal="true" aria-label="Report broken game"><div><p>BROKEN GAME REPORT</p><h2>Report {game.name}?</h2><p>This opens a prefilled email. Kardna does not collect gameplay or browsing contents automatically.</p><a href={`mailto:support@kardna.net?subject=${encodeURIComponent(`Broken game: ${game.name}`)}&body=${encodeURIComponent(`Game ID: ${game.id}\nURL: ${window.location.href}\n\nWhat went wrong?\n`)}`}>OPEN EMAIL REPORT</a><button type="button" onClick={() => setReportOpen(false)}>CANCEL</button></div></div>}
      </section>

      <section className="game-details">
        <div><p className="channel-label">GAME RECORD / {game.id.toUpperCase()}</p><h2>{game.description}</h2></div>
        <dl><div><dt>PLAYERS</dt><dd>{game.players}</dd></div><div><dt>CONTROLS</dt><dd>{game.controls.join(", ")}</dd></div><div><dt>SESSION</dt><dd>{game.sessionLength}</dd></div><div><dt>FULLSCREEN</dt><dd>{game.fullscreen ? "Supported" : "Limited"}</dd></div></dl>
      </section>

      <section className="broadcast-section related-games" aria-labelledby="related-title"><div className="broadcast-heading"><div><span className="channel-number">NEXT</span><p>SIMILAR SIGNAL</p><h2 id="related-title">Keep playing.</h2></div></div><GameGrid games={related} /></section>
    </main>
  );
}
