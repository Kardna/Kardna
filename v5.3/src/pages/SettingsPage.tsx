import { useState } from "react";
import { useProfile, type ProfileSettings } from "../context/ProfileContext";

export function SettingsPage() {
  const { profile, updateSettings, clearLocalData } = useProfile();
  const [confirmClear, setConfirmClear] = useState(false);
  const settings = profile.settings;
  const update = <K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) => updateSettings({ [key]: value });

  return (
    <main id="main-content" className="settings-page">
      <header>
        <p className="channel-label">KARDNA / LOCAL CONFIGURATION</p>
        <h1>Kardna <em>settings.</em></h1>
        <p>Everything here stays in this browser. No account required.</p>
      </header>

      <div className="settings-layout">
        <aside>
          <a href="#appearance">01 Appearance</a>
          <a href="#performance">02 Performance</a>
          <a href="#player">03 Player</a>
          <a href="#proxy">04 Proxy engine</a>
          <a href="#privacy">05 Local data</a>
        </aside>

        <div className="settings-sections">
          <section id="appearance">
            <div className="settings-title"><span>01</span><div><p>INTERFACE</p><h2>Appearance</h2></div></div>
            <div className="setting-row"><div><h3>Color direction</h3><p>Kardna stays black and white. Game artwork supplies the color.</p></div><span className="monochrome-chip">MONOCHROME</span></div>
            <label className="setting-row"><div><h3>Dark theme</h3><p>Choose the base Kardna surface.</p></div><select value={settings.theme} onChange={(event) => update("theme", event.target.value as ProfileSettings["theme"])}><option value="ink">Ink</option><option value="midnight">Midnight</option><option value="carbon">Carbon</option></select></label>
            <label className="setting-row switch-row"><div><h3>Liquid glass</h3><p>Uses focused glass on navigation, controls, and hovered cards. Low-performance mode disables it.</p></div><input type="checkbox" checked={settings.liquidGlass} onChange={(event) => update("liquidGlass", event.target.checked)} /></label>
            <label className="setting-row switch-row"><div><h3>Startup animation</h3><p>Small one-time entrance transitions only.</p></div><input type="checkbox" checked={settings.startupAnimation} onChange={(event) => update("startupAnimation", event.target.checked)} /></label>
            <label className="setting-row"><div><h3>Card layout</h3><p>Mixed grid looks editorial; uniform is simpler.</p></div><select value={settings.cardPreference} onChange={(event) => update("cardPreference", event.target.value as ProfileSettings["cardPreference"])}><option value="mixed">Mixed grid</option><option value="uniform">Uniform grid</option></select></label>
            <label className="setting-row"><div><h3>Grid density</h3><p>Adjust spacing without changing image quality.</p></div><select value={settings.gridDensity} onChange={(event) => update("gridDensity", event.target.value as ProfileSettings["gridDensity"])}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label>
          </section>

          <section id="performance">
            <div className="settings-title"><span>02</span><div><p>DEVICE LOAD</p><h2>Performance</h2></div></div>
            <label className="setting-row switch-row"><div><h3>Low-performance mode</h3><p>Disables decorative transitions, mixed cards, and nonessential effects.</p></div><input type="checkbox" checked={settings.lowPerformance} onChange={(event) => update("lowPerformance", event.target.checked)} /></label>
            <label className="setting-row switch-row"><div><h3>Reduced motion</h3><p>Turns off movement while preserving the visual design.</p></div><input type="checkbox" checked={settings.reducedMotion} onChange={(event) => update("reducedMotion", event.target.checked)} /></label>
            <label className="setting-row switch-row"><div><h3>Hide mature or horror collections</h3><p>Filters locally tagged mature games from discovery views.</p></div><input type="checkbox" checked={settings.hideMature} onChange={(event) => update("hideMature", event.target.checked)} /></label>
          </section>

          <section id="player">
            <div className="settings-title"><span>03</span><div><p>GAME PLAYER</p><h2>Player</h2></div></div>
            <label className="setting-row volume-row"><div><h3>Default volume</h3><p>{Math.round(settings.volume * 100)}% when a compatible game launches.</p></div><input type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(event) => update("volume", Number(event.target.value))} /></label>
          </section>

          <section id="proxy">
            <div className="settings-title"><span>04</span><div><p>NETWORK STACK</p><h2>Proxy engine</h2></div></div>
            <p className="settings-section-copy">Ultraviolet is the default engine. Scramjet stays installed as the compatibility backup. Epoxy TLS is the stable default transport. Libcurl.js remains selectable underneath either engine.</p>

            <div className="proxy-choice-grid" role="radiogroup" aria-label="Proxy engine">
              <button type="button" role="radio" aria-checked={settings.proxyEngine === "ultraviolet"} className={settings.proxyEngine === "ultraviolet" ? "proxy-choice is-active" : "proxy-choice"} onClick={() => update("proxyEngine", "ultraviolet")}>
                <span className="proxy-choice__mark proxy-choice__mark--uv">UV</span>
                <span><b>Ultraviolet</b><small>Default · broad compatibility</small></span>
                <i>{settings.proxyEngine === "ultraviolet" ? "ACTIVE" : "SELECT"}</i>
              </button>
              <button type="button" role="radio" aria-checked={settings.proxyEngine === "scramjet"} className={settings.proxyEngine === "scramjet" ? "proxy-choice is-active" : "proxy-choice"} onClick={() => update("proxyEngine", "scramjet")}>
                <span className="proxy-choice__mark proxy-choice__mark--sj">SJ</span>
                <span><b>Scramjet</b><small>Backup · newer rewrite engine</small></span>
                <i>{settings.proxyEngine === "scramjet" ? "ACTIVE" : "SELECT"}</i>
              </button>
            </div>

            <div className="proxy-choice-grid proxy-choice-grid--transport" role="radiogroup" aria-label="Proxy transport">
              <button type="button" role="radio" aria-checked={settings.proxyTransport === "libcurl"} className={settings.proxyTransport === "libcurl" ? "proxy-choice is-active" : "proxy-choice"} onClick={() => update("proxyTransport", "libcurl")}>
                <span className="proxy-choice__mark proxy-choice__mark--curl">LC</span>
                <span><b>Libcurl.js</b><small>Optional compatibility transport</small></span>
                <i>{settings.proxyTransport === "libcurl" ? "ACTIVE" : "SELECT"}</i>
              </button>
              <button type="button" role="radio" aria-checked={settings.proxyTransport === "epoxy"} className={settings.proxyTransport === "epoxy" ? "proxy-choice is-active" : "proxy-choice"} onClick={() => update("proxyTransport", "epoxy")}>
                <span className="proxy-choice__mark proxy-choice__mark--epoxy">ET</span>
                <span><b>Epoxy TLS</b><small>Default · recommended on Windows</small></span>
                <i>{settings.proxyTransport === "epoxy" ? "ACTIVE" : "SELECT"}</i>
              </button>
            </div>

            <label className="setting-row switch-row"><div><h3>Remember proxy tabs</h3><p>Disabled by default. Page contents and form data are never written to Kardna profile storage.</p></div><input type="checkbox" checked={settings.proxyRememberTabs} onChange={(event) => update("proxyRememberTabs", event.target.checked)} /></label>
            <div className="proxy-command"><span>UPDATE COMMAND</span><code>npm run proxy:update</code><p>Checks Nebula’s compatible proxy matrix, the official Ultraviolet app, and Mercury Workshop Wisp, then verifies the installed runtime.</p></div>
          </section>

          <section id="privacy">
            <div className="settings-title"><span>05</span><div><p>LOCAL PROFILE</p><h2>Privacy and data</h2></div></div>
            <div className="local-stats"><span><strong>{profile.favorites.length}</strong> Favorites</span><span><strong>{profile.recent.length}</strong> Recent games</span><span><strong>{Object.values(profile.launches).reduce((sum: number, value: number) => sum + value, 0)}</strong> Launches</span></div>
            {!confirmClear ? <button className="danger-button" type="button" onClick={() => setConfirmClear(true)}>CLEAR ALL LOCAL DATA</button> : <div className="clear-confirm"><p>This removes favorites, recent games, playtime, Mix preferences, and settings from this browser.</p><button type="button" onClick={() => { clearLocalData(); setConfirmClear(false); }}>CONFIRM CLEAR</button><button type="button" onClick={() => setConfirmClear(false)}>CANCEL</button></div>}
          </section>
        </div>
      </div>
    </main>
  );
}
