# Kardna proxy stack

Kardna ships one local Node service that serves the React site, the upstream proxy runtime assets, and a protected Wisp WebSocket transport.

## Engines and transports

The browser has two rewrite engines:

- **Ultraviolet** — default
- **Scramjet** — installed backup

The engine uses one of two network transports:

- **Epoxy TLS** — default and recommended
- **Libcurl.js** — optional backup

The active engine and transport can be changed under **Settings → Proxy engine**. The proxy page also has a UV/SJ selector for the current tab.

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:8080
```

`npm run dev` starts `server/index.mjs`, mounts Vite in middleware mode, exposes the runtime assets, and handles `/wisp/` WebSocket upgrades.

## Production

```bash
npm run build
npm start
```

The same Node server serves `dist/` on port 8080 by default. Set `PORT` and `HOST` through environment variables when needed. Production must be behind HTTPS; the browser then uses WSS automatically.

## Updating the proxy packages

Check whether the project differs from the compatible upstream manifests:

```bash
npm run proxy:check
```

Synchronize versions, install them, verify every required runtime asset, and run the TypeScript checks:

```bash
npm run proxy:update
```

The updater reads the current Nebula, official Ultraviolet-App, and Mercury Workshop Wisp package manifests. It changes only known proxy dependencies and refuses a new major version rather than silently installing an API-breaking update. If installation or type-checking fails, it restores the previous project manifests. The last synchronized versions are recorded in `docs/proxy-upstream.json`.


## Error 35 / `connection.streams is not iterable`

These two errors are connected in the original V5 build:

1. The enabled Wisp per-host limiter throws and terminates Node.
2. The browser transport then loses its Wisp socket and reports a TLS/connect failure such as curl code 35.

V5.1 disables only the broken limiter, keeps the other network protections, and uses Epoxy TLS by default. After replacing the files, reinstall dependencies and clear proxy data once so the old service worker cannot keep routing through stale code.

## Runtime files

- `server/index.mjs` — Express/Vite server, Wisp security policy, rate limiting, and WebSocket route
- `public/proxy-sw.js` — combined Ultraviolet and Scramjet service-worker router
- `public/uv/uv.config.js` — Kardna Ultraviolet prefix and runtime paths
- `src/utilities/proxyRuntime.ts` — lazy initialization, transport switching, and URL encoding
- `src/utilities/proxySafety.ts` — browser-side target validation
- `src/pages/ProxyPage.tsx` — proxy browser UI and tab state

## Security boundary

The browser rejects file URLs, embedded URL credentials, localhost names, private IPv4 ranges, local IPv6 ranges, and cloud-metadata hosts before launch. The Wisp server separately enforces:

- no direct-IP destinations
- no private or loopback IPs after DNS resolution
- hostname blocks for local, internal, metadata, service, and cluster domains
- no UDP streams
- a web-port allowlist
- a total stream limit
- per-IP concurrent-connection and upgrade-rate limits

The upstream `wisp-js` 0.4.1 per-host limiter is deliberately set to `-1`. Its current implementation loops over `connection.streams` as an iterable even though the connection stores streams as an object, which causes the exact `connection.streams is not iterable` crash. Kardna keeps the safe total cap and outer connection limits instead.

Defaults can be tuned through `.env.example`, but private-network and loopback access are intentionally not exposed as environment switches. Kardna does not log proxied page contents, form submissions, or credentials.

For a public deployment, also apply reverse-proxy limits, keep dependencies patched, and use infrastructure-level egress rules as a second boundary. Static-only hosts cannot run Wisp, so the proxy route requires the included Node service or an equivalent authorized backend.
