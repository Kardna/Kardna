import { useCallback, useEffect, useRef, useState } from "react";
import type { Game } from "../types/game";
import { useProfile } from "../context/ProfileContext";
import { withBase } from "../utilities/paths";
import { encodeProxyUrl } from "../utilities/proxyRuntime";

let rufflePromise: Promise<void> | null = null;

type HTMLGameWindow = Window & { __KARDNA_SET_MUTED__?: (muted: boolean) => void };

function loadRuffleScript(): Promise<void> {
  if (window.RufflePlayer?.newest) return Promise.resolve();
  if (rufflePromise) return rufflePromise;
  rufflePromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-kardna-ruffle]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Ruffle failed to download.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@ruffle-rs/ruffle";
    script.async = true;
    script.dataset.kardnaRuffle = "true";
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); rufflePromise = null; reject(new Error("Ruffle failed to download. Check your connection or content blocker.")); };
    document.head.appendChild(script);
  });
  return rufflePromise;
}

function HTMLGamePlayer({ game, muted, volume }: { game: Game; muted: boolean; volume: number }) {
  const { profile } = useProfile();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [frameUrl, setFrameUrl] = useState(() => /^https?:/i.test(game.url) ? "" : withBase(game.url));
  const [proxyNote, setProxyNote] = useState("");

  const applyAudioState = useCallback(() => {
    const iframe = iframeRef.current;
    const target = iframe?.contentWindow as HTMLGameWindow | null | undefined;
    if (!iframe || !target) return;
    target.postMessage({ type: "kardna:set-muted", muted }, "*");
    target.postMessage({ type: "kardna:set-volume", volume }, "*");
    try {
      target.__KARDNA_SET_MUTED__?.(muted);
      iframe.contentDocument?.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => { media.muted = muted; media.volume = volume; });
    } catch {
      // Cross-origin games may not expose media controls to the parent frame.
    }
  }, [muted, volume]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSlow(false);
    setProxyNote("");
    if (!/^https?:/i.test(game.url)) {
      setFrameUrl(withBase(game.url));
      return () => { cancelled = true; };
    }

    setFrameUrl("");
    encodeProxyUrl(game.url, profile.settings.proxyEngine, profile.settings.proxyTransport)
      .then((url) => { if (!cancelled) setFrameUrl(url); })
      .catch(() => {
        if (!cancelled) {
          setProxyNote("The proxy runtime was unavailable, so Kardna is trying the original embed directly.");
          setFrameUrl(game.url);
        }
      });
    return () => { cancelled = true; };
  }, [game.id, game.url, profile.settings.proxyEngine, profile.settings.proxyTransport]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 12000);
    return () => window.clearTimeout(timer);
  }, [game.id, frameUrl]);

  useEffect(() => {
    applyAudioState();
    const retry = window.setTimeout(applyAudioState, 120);
    const onMessage = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow && event.data?.type === "kardna:audio-ready") applyAudioState();
    };
    window.addEventListener("message", onMessage);
    return () => { window.clearTimeout(retry); window.removeEventListener("message", onMessage); };
  }, [applyAudioState]);

  return (
    <div className="embed-shell">
      {(loading || !frameUrl) && <div className="player-loading" role="status"><span /><p>{frameUrl ? `LAUNCHING ${game.name.toUpperCase()}` : "PREPARING SECURE GAME ROUTE"}</p><small>{/^https?:/i.test(game.url) ? `${profile.settings.proxyEngine.toUpperCase()} / ${profile.settings.proxyTransport.toUpperCase()}` : "HTML5 RUNTIME"}</small></div>}
      {frameUrl && <iframe
        ref={iframeRef}
        className="game-iframe"
        src={frameUrl}
        title={`${game.name} browser game`}
        allow="fullscreen; gamepad; autoplay"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms allow-downloads"
        allowFullScreen
        onLoad={() => { setLoading(false); applyAudioState(); }}
      />}
      {proxyNote && <div className="player-note" role="status">{proxyNote}</div>}
      {slow && loading && <div className="player-note" role="alert">The game is taking longer than expected. The host may block iframe loading or require a sign-in.</div>}
    </div>
  );
}

function FlashGamePlayer({ game, muted, volume }: { game: Game; muted: boolean; volume: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<RufflePlayerElement | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;
    host.replaceChildren();
    setState("loading");
    setMessage("");
    loadRuffleScript().then(async () => {
      if (cancelled || !window.RufflePlayer?.newest) return;
      const player = window.RufflePlayer.newest().createPlayer();
      player.className = "ruffle-player";
      playerRef.current = player;
      host.appendChild(player);
      const api = player.ruffle();
      api.volume = muted ? 0 : volume;
      await api.load({ url: withBase(game.url), allowScriptAccess: false, allowFullscreen: true, autoplay: "auto", unmuteOverlay: "hidden" });
      if (!cancelled) setState("ready");
    }).catch((error: unknown) => {
      if (!cancelled) { setState("error"); setMessage(error instanceof Error ? error.message : "This Flash game could not be loaded."); }
    });
    return () => { cancelled = true; playerRef.current = null; host.replaceChildren(); };
  }, [attempt, game.id, game.url]);

  useEffect(() => { if (playerRef.current) playerRef.current.ruffle().volume = muted ? 0 : volume; }, [muted, volume, state]);

  return <div className="embed-shell embed-shell--flash"><div ref={hostRef} className="ruffle-host" />{state === "loading" && <div className="player-loading"><span /><p>LOADING FLASH RUNTIME</p><small>RUFFLE COMPATIBILITY LAYER</small></div>}{state === "error" && <div className="player-error"><span>⚡</span><h2>Flash compatibility problem</h2><p>{message}</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>RETRY</button></div>}</div>;
}

export function GamePlayer({ game, muted, volume }: { game: Game; muted: boolean; volume: number }) {
  return game.type === "flash" ? <FlashGamePlayer game={game} muted={muted} volume={volume} /> : <HTMLGamePlayer game={game} muted={muted} volume={volume} />;
}
