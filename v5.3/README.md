# Kardna

Kardna is a fast browser-gaming platform built with React, Vite, TypeScript, and modern CSS. This revision removes the previous OS-style branding, moves the interface to a black-and-white art direction, adds focused liquid-glass surfaces, and keeps the integrated Ultraviolet/Scramjet proxy stack on the same Node server.

## What changed in V5.3

- Kardna is branded simply as **Kardna** throughout the UI, server output, metadata, and documentation.
- The interface and game artwork remain fully black and white.
- Cards stay grayscale on hover; hover only changes contrast, brightness, scale, and white lighting.
- The ambient card effect uses a grayscale copy of the matching artwork, so no colored glow leaks into the page.
- Pointer-reactive card lighting and a restrained 3D tilt run only for the currently hovered card.
- Liquid glass is limited to navigation, search, player controls, settings surfaces, proxy controls, and the hovered card information panel.
- Low-performance mode and reduced-motion mode remove blur, ambient glow, tilt, and nonessential animation.
- The supplied legacy `games.json` was merged with the existing local catalog. Placeholder `example.com` records and duplicate local games were not added.
- Matching online artwork or live-page captures are used for 106 catalog entries. Generic Google Images result captures were removed.
- `public/games.json` contains **144 catalog records**. All 60 locally hosted entries use `./games/<folder>/...` URLs.
- The loader accepts both the modern array format and the older `{ "games": [...] }` format using `title` and `iframe` fields.
- External games are routed through the selected Kardna proxy engine when launched, with a direct-embed fallback if the proxy runtime cannot initialize.

## Install and run

Requirements: Node.js 20.19 or newer. Node.js 22 is supported.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:8080
```

Production:

```bash
npm run build
npm start
```

The server uses port 8080 unless `PORT` is set.

## Proxy setup

- Ultraviolet is the default rewrite engine.
- Scramjet is installed as the backup engine.
- Epoxy TLS is the default transport for better Windows/TLS compatibility.
- Libcurl.js remains available as an optional transport.
- Wisp runs through `@mercuryworkshop/wisp-js` with private-network blocking, a total stream cap, and per-IP connection limits.
- Engine and transport controls are available in Settings.
- The proxy browser includes tabs, back/forward, reload, home, fullscreen, clear-data controls, error states, and a per-tab UV/SJ switch.

### Existing V5 proxy hotfix

The original V5 package could crash with `TypeError: connection.streams is not iterable`. This project includes the V5.1 Wisp limiter fix. After replacing an older build, run:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
npm run proxy:verify
npm run dev
```

Open `http://localhost:8080`, go to Proxy, choose **Clear Proxy Data** once, and reload.

## Updating the proxy stack

```bash
npm run proxy:check
npm run proxy:update
npm run proxy:verify
```

The update script checks compatible upstream dependency versions, installs them, verifies required assets, and restores the previous manifests if validation fails.

## Gaming features

- 144 normalized game records
- Local HTML5 and Flash/Ruffle games
- External web and cloud-game records from the supplied legacy catalog
- Favorites, recent games, continue playing, playtime, launches, search history, settings, and Mix preferences stored locally
- Universal command search with `/` or `Ctrl/Cmd + K`
- Kardna Mix discovery route
- Local search, filters, sorting, and paginated rendering
- Launch-on-demand iframes only
- Player dock with restart, fullscreen, theater mode, mute/unmute, favorite, controls, report, exit, and next-game actions
- Lazy-loaded Ruffle only for Flash games
- Route-level code splitting

## Performance design

The visual effects are intentionally focused instead of running across the full page:

- No custom cursor
- No particle system, video background, or WebGL decoration
- No continuous JavaScript animation loop
- Pointer calculations use one `requestAnimationFrame` only while a card is hovered
- Monochrome artwork glow exists only on the hovered card
- Glass blur is disabled by low-performance mode and reduced-motion mode
- Images have explicit dimensions, lazy loading, and asynchronous decoding
- Large libraries render in pages
- Cards use `content-visibility: auto`

## Adding games

Local HTML game:

```text
public/games/game-id/index.html
```

Flash game:

```text
public/games/game-id/game.swf
```

Then run:

```bash
npm run sync-games
```

You can also edit `public/games.json` directly. Both of these shapes are supported:

```json
[
  {
    "name": "Example",
    "image": "./games/example/cover.webp",
    "url": "./games/example/index.html",
    "type": "html"
  }
]
```

```json
{
  "games": [
    {
      "title": "Legacy Example",
      "image": "https://example.com/cover.webp",
      "iframe": "https://example.com/game"
    }
  ]
}
```

## VS Code and Codex

See [`VS-CODE-CODEX.md`](./VS-CODE-CODEX.md) for setup instructions. The repository includes an `AGENTS.md` file so OpenAI Codex in VS Code receives the permanent Kardna project rules before editing.

## Deployment note

The games frontend can be built as static files, but the integrated proxy requires the included Node server because Wisp uses WebSockets. In production, run the Node service behind HTTPS so service workers and WSS work correctly.
