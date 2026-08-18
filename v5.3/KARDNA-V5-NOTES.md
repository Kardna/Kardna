# Kardna V5 notes

This revision keeps the strong Kardna design and adds the integrated local proxy runtime.

## Proxy stack

- Ultraviolet is the default rewrite engine.
- Scramjet is initialized as the backup engine.
- Epoxy TLS is the default transport.
- Libcurl.js remains selectable as an optional compatibility transport.
- The React app, runtime assets, and protected Wisp WebSocket service use one Node server.
- Development and production default to `http://localhost:8080`.
- Engine and transport preferences persist in the local Kardna profile.
- `npm run proxy:update` checks compatible upstream manifests, installs updates, verifies runtime assets, and type-checks the project.

## Security defaults

The Wisp service uses Mercury Workshop's `wisp-js` server. Private and loopback addresses, direct-IP targets, internal hostnames, UDP, non-web ports, and excessive connections are blocked by default. The broken upstream per-host stream limiter is disabled while the safe total and per-IP limits remain active.

## Visual and performance direction retained

- Editorial typography and oversized headings
- Broadcast-channel labels and system-status details
- Mixed-size featured grid and curated collections
- Accent-driven styling
- Premium player dock and proxy browser shell
- No Liquid Glass, custom cursor, permanent blur, particles, or per-card animation loops
