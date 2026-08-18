import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { normalizeProxyUrl } from "../utilities/proxySafety";
import {
  checkProxyServer,
  clearProxyBrowserData,
  encodeProxyUrl,
  initializeProxyRuntime,
  type ProxyEngine,
} from "../utilities/proxyRuntime";

type TabState = {
  id: number;
  title: string;
  input: string;
  targetUrl: string;
  frameUrl: string;
  engine: ProxyEngine;
  status: "idle" | "connecting" | "ready" | "error";
  error: string;
  reloadKey: number;
  history: string[];
  historyIndex: number;
};

type RuntimeStatus = "booting" | "online" | "error";

function newTab(id: number, engine: ProxyEngine, input = ""): TabState {
  return {
    id,
    title: "New tab",
    input,
    targetUrl: "",
    frameUrl: "",
    engine,
    status: "idle",
    error: "",
    reloadKey: 0,
    history: [],
    historyIndex: -1,
  };
}

export function ProxyPage() {
  const { profile, updateSettings } = useProfile();
  const settings = profile.settings;
  const [tabs, setTabs] = useState<TabState[]>([newTab(1, settings.proxyEngine)]);
  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus>("booting");
  const [runtimeError, setRuntimeError] = useState("");
  const [clearing, setClearing] = useState(false);
  const browserRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0] ?? newTab(activeId, settings.proxyEngine);

  const updateTab = useCallback((id: number, patch: Partial<TabState>) => {
    setTabs((current) => current.map((tab) => tab.id === id ? { ...tab, ...patch } : tab));
  }, []);

  const bootRuntime = useCallback(async () => {
    setRuntimeStatus("booting");
    setRuntimeError("");
    try {
      await checkProxyServer();
      await initializeProxyRuntime(settings.proxyTransport);
      setRuntimeStatus("online");
    } catch (error) {
      setRuntimeStatus("error");
      setRuntimeError(error instanceof Error ? error.message : "The local proxy runtime could not start.");
    }
  }, [settings.proxyTransport]);

  useEffect(() => {
    void bootRuntime();
  }, [bootRuntime]);

  const statusLabel = useMemo(() => {
    if (runtimeStatus === "booting") return "STARTING LOCAL PROXY";
    if (runtimeStatus === "error") return "PROXY RUNTIME ERROR";
    if (active.status === "connecting") return `LAUNCHING ${active.engine.toUpperCase()}`;
    return `${active.engine === "ultraviolet" ? "ULTRAVIOLET" : "SCRAMJET"} + ${settings.proxyTransport === "libcurl" ? "LIBCURL.JS" : "EPOXY TLS"} ONLINE`;
  }, [active.engine, active.status, runtimeStatus, settings.proxyTransport]);

  const launchTarget = useCallback(async (tab: TabState, targetUrl: string, historyIndex?: number, engineOverride?: ProxyEngine) => {
    const engine = engineOverride ?? tab.engine;
    updateTab(tab.id, {
      status: "connecting",
      error: "",
      targetUrl,
      input: targetUrl,
      engine,
    });

    try {
      const frameUrl = await encodeProxyUrl(targetUrl, engine, settings.proxyTransport);
      const currentTab = tabs.find((item) => item.id === tab.id) ?? tab;
      const nextHistory = historyIndex === undefined
        ? [...currentTab.history.slice(0, currentTab.historyIndex + 1), targetUrl]
        : currentTab.history;
      const nextIndex = historyIndex ?? nextHistory.length - 1;

      updateTab(tab.id, {
        frameUrl,
        title: new URL(targetUrl).hostname,
        status: "connecting",
        reloadKey: currentTab.reloadKey + 1,
        history: nextHistory,
        historyIndex: nextIndex,
        engine,
      });
    } catch (error) {
      updateTab(tab.id, {
        status: "error",
        error: error instanceof Error ? error.message : "The proxy engine could not launch this address.",
      });
    }
  }, [settings.proxyTransport, tabs, updateTab]);

  const launch = useCallback(async () => {
    const result = normalizeProxyUrl(active.input);
    if (!result.ok || !result.url) {
      updateTab(active.id, { status: "error", error: result.error ?? "Invalid address." });
      return;
    }
    await launchTarget(active, result.url);
  }, [active, launchTarget, updateTab]);

  const navigateHistory = useCallback(async (direction: -1 | 1) => {
    const index = active.historyIndex + direction;
    const target = active.history[index];
    if (!target) return;
    await launchTarget(active, target, index);
  }, [active, launchTarget]);

  const addTab = useCallback((input = "") => {
    const id = nextId;
    setNextId((value) => value + 1);
    setTabs((current) => [...current, newTab(id, settings.proxyEngine, input)]);
    setActiveId(id);
    return id;
  }, [nextId, settings.proxyEngine]);

  const openInNewTab = useCallback(() => {
    const result = normalizeProxyUrl(active.input);
    const id = addTab(active.input);
    if (!result.ok || !result.url) return;
    const tab = newTab(id, settings.proxyEngine, active.input);
    window.setTimeout(() => void launchTarget(tab, result.url as string), 0);
  }, [active.input, addTab, launchTarget, settings.proxyEngine]);

  const closeTab = useCallback((id: number) => {
    setTabs((current) => {
      if (current.length === 1) return [newTab(current[0]?.id ?? 1, settings.proxyEngine)];
      const index = current.findIndex((tab) => tab.id === id);
      const next = current.filter((tab) => tab.id !== id);
      if (id === activeId) setActiveId(next[Math.max(0, index - 1)]?.id ?? next[0]?.id ?? 1);
      return next;
    });
  }, [activeId, settings.proxyEngine]);

  const requestFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await browserRef.current?.requestFullscreen();
    } catch {
      updateTab(active.id, { status: "error", error: "The browser blocked fullscreen mode." });
    }
  };

  const reload = () => {
    if (!active.frameUrl) return;
    try {
      frameRef.current?.contentWindow?.location.reload();
    } catch {
      updateTab(active.id, { reloadKey: active.reloadKey + 1, status: "connecting" });
    }
  };

  const switchEngine = async (engine: ProxyEngine) => {
    updateSettings({ proxyEngine: engine });
    updateTab(active.id, { engine });
    if (active.targetUrl) await launchTarget(active, active.targetUrl, active.historyIndex, engine);
  };

  const useBackup = async () => {
    const backup: ProxyEngine = active.engine === "ultraviolet" ? "scramjet" : "ultraviolet";
    if (active.targetUrl) await launchTarget(active, active.targetUrl, active.historyIndex, backup);
  };

  const clearSession = async () => {
    setClearing(true);
    try {
      await clearProxyBrowserData();
      window.location.reload();
    } catch (error) {
      setRuntimeStatus("error");
      setRuntimeError(error instanceof Error ? error.message : "Proxy data could not be cleared.");
      setClearing(false);
    }
  };

  return (
    <main id="main-content" className="proxy-page">
      <header className="proxy-heading">
        <div><p className="channel-label">KARDNA / LOCAL NETWORK STACK</p><h1>Proxy <em>browser.</em></h1></div>
        <div className={`proxy-status ${runtimeStatus === "online" ? "is-ready" : "is-offline"}`}><i />{statusLabel}</div>
      </header>

      <section className="proxy-notice"><strong>Local runtime:</strong> Kardna now runs the proxy stack from the same Node server at <code>http://localhost:8080</code>. Ultraviolet is default, Scramjet is the backup, Epoxy TLS is the stable default transport, and browsing contents are not written to Kardna’s profile.</section>

      <section ref={browserRef} className="proxy-browser">
        <div className="proxy-tabs">
          {tabs.map((tab) => (
            <div key={tab.id} className={tab.id === active.id ? "proxy-tab is-active" : "proxy-tab"}>
              <button type="button" className="proxy-tab__select" onClick={() => setActiveId(tab.id)}>
                <i className={`tab-signal tab-signal--${tab.status}`} />
                <span>{tab.title}</span>
              </button>
              <button type="button" className="proxy-tab__close" onClick={() => closeTab(tab.id)} aria-label={`Close ${tab.title}`}>×</button>
            </div>
          ))}
          <button type="button" className="new-tab" onClick={() => addTab()} aria-label="New proxy tab">+</button>
        </div>

        <div className="proxy-toolbar">
          <div className="proxy-nav-buttons">
            <button type="button" disabled={active.historyIndex <= 0} onClick={() => void navigateHistory(-1)} title="Back">←</button>
            <button type="button" disabled={active.historyIndex >= active.history.length - 1} onClick={() => void navigateHistory(1)} title="Forward">→</button>
            <button type="button" onClick={reload} disabled={!active.frameUrl} title="Reload">↻</button>
            <button type="button" onClick={() => updateTab(active.id, newTab(active.id, settings.proxyEngine))} title="Home">⌂</button>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); void launch(); }}>
            <span aria-hidden="true">◎</span>
            <input value={active.input} onChange={(event) => updateTab(active.id, { input: event.target.value })} placeholder="Search or enter an address" aria-label="Proxy address" autoComplete="off" spellCheck={false} />
            <button type="submit" disabled={runtimeStatus !== "online"}>GO</button>
          </form>

          <div className="proxy-extra-buttons">
            <label className="proxy-engine-select" title="Proxy engine">
              <span className="sr-only">Proxy engine</span>
              <select value={active.engine} onChange={(event) => void switchEngine(event.target.value as ProxyEngine)}>
                <option value="ultraviolet">UV</option>
                <option value="scramjet">SJ</option>
              </select>
            </label>
            <button type="button" onClick={openInNewTab} title="Open in new proxy tab">↗</button>
            <button type="button" onClick={() => void requestFullscreen()} title="Fullscreen">⛶</button>
          </div>
        </div>

        <div className="proxy-viewport">
          {active.frameUrl && active.status !== "error" ? (
            <iframe
              ref={frameRef}
              key={`${active.id}-${active.reloadKey}`}
              src={active.frameUrl}
              title={`Proxy tab: ${active.title}`}
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="no-referrer"
              onLoad={() => updateTab(active.id, { status: "ready" })}
              onError={() => updateTab(active.id, { status: "error", error: "The proxied page failed to load." })}
            />
          ) : (
            <div className="proxy-start">
              <div className="proxy-start__mark">◎</div>
              <p className="channel-label">TITANIUM NETWORK STACK / KARDNA</p>
              <h2>{runtimeStatus === "error" || active.status === "error" ? "Connection unavailable." : "Browse through Kardna."}</h2>
              <p>{active.error || runtimeError || (runtimeStatus === "booting" ? "Loading Ultraviolet, Scramjet, Libcurl.js, Epoxy TLS, and the local Wisp transport…" : "Enter an address above. Ultraviolet and Epoxy TLS are active by default; Scramjet and Libcurl.js remain available as backups.")}</p>
              {(runtimeStatus === "error" || active.status === "error") && <div className="proxy-error-actions"><button type="button" onClick={() => void bootRuntime()}>RETRY RUNTIME</button>{active.targetUrl && <button type="button" onClick={() => void useBackup()}>TRY {active.engine === "ultraviolet" ? "SCRAMJET" : "ULTRAVIOLET"}</button>}<Link to="/settings#proxy">OPEN SETTINGS</Link></div>}
            </div>
          )}
          {(runtimeStatus === "booting" || active.status === "connecting") && <div className="proxy-loading"><span /><p>{runtimeStatus === "booting" ? "STARTING LOCAL PROXY STACK" : `LAUNCHING ${active.engine.toUpperCase()}`}</p></div>}
        </div>

        <footer>
          <span><i /> Local Wisp transport: {runtimeStatus === "online" ? "ONLINE" : "OFFLINE"}</span>
          <span>ENGINE: {active.engine === "ultraviolet" ? "UV" : "SCRAMJET"}</span>
          <span>TRANSPORT: {settings.proxyTransport === "libcurl" ? "LIBCURL.JS" : "EPOXY TLS"}</span>
          <button type="button" disabled={clearing} onClick={() => void clearSession()}>{clearing ? "CLEARING…" : "CLEAR PROXY DATA"}</button>
        </footer>
      </section>
    </main>
  );
}
