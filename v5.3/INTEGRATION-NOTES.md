# Integrating this performance update

1. Back up the current Kardna folder.
2. Extract this archive over the existing project folder.
3. Keep the third-party game folders already placed under `public/games/`.
4. Run `npm install` and `npm run dev`.
5. Open `http://localhost:8080`.
6. Run `npm run proxy:verify`, then test Ultraviolet, Scramjet, Libcurl.js, and Epoxy TLS from the Proxy and Settings pages.
7. Open the catalog and test each imported game, including mute and fullscreen.

`npm run dev` and `npm run build` now run the game sync script automatically. It adds missing catalog entries and inserts the lightweight mute bridge into every local HTML game.

This archive contains catalog records and covers for the folders shown in the screenshot, but not the third-party game files themselves. Extracting the archive over the existing project does not remove extra folders that are already present.

Most imported records expect this layout:

```text
public/games/<folder-name>/index.html
```

When a package uses a different launch filename, update that game's `url` inside `public/games.json`.


## V5.1 proxy hotfix

- Disabled the broken wisp-js 0.4.1 per-host stream limiter.
- Kept total stream, private-network, direct-IP, WebSocket connection, and upgrade-rate protections.
- Moved the default transport to Epoxy TLS and migrated V5 local profiles automatically.
- Fixed `npm run proxy:update` branch URLs and official source selection.
