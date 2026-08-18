# Kardna project instructions

## Product

This repository is Kardna, a polished browser-game platform. Do not rename it to Kardna OS. Keep the product name simply **Kardna**.

## Visual direction

- Black-and-white interface.
- Game artwork must remain grayscale, including hover states.
- Use matching game artwork rather than generic placeholders whenever a reliable source exists.
- Liquid-glass surfaces are allowed for focused UI such as navigation, search, player controls, settings, and proxy controls.
- Do not add a custom cursor, particle field, WebGL background, video background, or constant per-card animation loops.
- Preserve the pointer-reactive card lighting and restrained tilt, but keep a low-performance fallback.

## Performance

- Performance on school laptops and Chromebooks is a priority.
- Lazy-load images and game frames.
- Never preload every game iframe.
- Prefer transforms and opacity.
- Respect reduced motion and low-performance mode.
- Avoid unnecessary rerenders and permanent heavy blur across large page areas.

## Games

- Preserve every working existing game.
- Local games live under `public/games` and their metadata URLs use `./games/<folder>/...`.
- Add games through `public/games.json`; do not hardcode cards.
- Run `npm run sync-games` after adding local game folders.
- Verify that artwork matches the exact game title.

## Player

- The player dock must remain visible inside the top of the game frame when summoned.
- Fullscreen, theater mode, restart, mute/unmute, favorite, controls, report, exit, and next-game buttons must remain functional.
- Create the iframe only after launch.

## Proxy

- Ultraviolet is the default engine and Scramjet is the backup.
- Epoxy TLS is the default transport and Libcurl.js remains optional.
- Keep the V5.1 Wisp limiter crash fix.
- Do not weaken localhost/private-network protections or log proxied content.
- Run `npm run proxy:verify` after proxy dependency changes.

## Validation

Before declaring work complete, run the available checks, inspect console/build errors, and report anything that could not be tested honestly.
