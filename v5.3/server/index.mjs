import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { hostname } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { server as wisp, logging as wispLogging } from "@mercuryworkshop/wisp-js/server";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const isDevelopment = process.argv.includes("--dev");
const port = Number.parseInt(process.env.PORT ?? "8080", 10) || 8080;
const host = process.env.HOST ?? "0.0.0.0";
const maxWispConnectionsPerIp = positiveInteger(process.env.WISP_MAX_CONNECTIONS_PER_IP, 4);
const maxWispUpgradesPerMinute = positiveInteger(process.env.WISP_MAX_UPGRADES_PER_MINUTE, 30);
const app = express();
const server = createServer((request, response) => app(request, response));
const activeWispConnections = new Map();
const wispUpgradeWindows = new Map();
const wispWindowCleanup = setInterval(() => {
  const cutoff = Date.now() - 5 * 60_000;
  for (const [clientIp, window] of wispUpgradeWindows) {
    if (window.startedAt < cutoff) wispUpgradeWindows.delete(clientIp);
  }
}, 5 * 60_000);
wispWindowCleanup.unref();

// Keep Wisp useful as a web transport without turning Kardna into an unrestricted TCP relay.
wispLogging.set_level(wispLogging.WARN);
wisp.options.allow_direct_ip = false;
wisp.options.allow_private_ips = false;
wisp.options.allow_loopback_ips = false;
wisp.options.allow_udp_streams = false;
// wisp-js 0.4.1 stores streams as an object but its per-host limiter iterates it
// as if it were an array. Leaving this upstream option enabled crashes Node with
// `connection.streams is not iterable`. Kardna keeps the total stream cap plus
// its own per-IP connection and upgrade limits instead.
wisp.options.stream_limit_per_host = -1;
wisp.options.stream_limit_total = 96;
wisp.options.port_whitelist = [80, 443, 3000, 5000, 8000, 8080, 8443, 8888];
wisp.options.hostname_blacklist = [
  /^localhost\.?$/i,
  /\.localhost\.?$/i,
  /\.local\.?$/i,
  /\.lan\.?$/i,
  /\.internal\.?$/i,
  /\.home\.arpa\.?$/i,
  /\.cluster\.local\.?$/i,
  /\.svc\.?$/i,
  /^metadata(?:\.google\.internal)?\.?$/i,
  /^instance-data(?:\.ec2\.internal)?\.?$/i,
  /^kubernetes\.default\.svc\.?$/i,
];

app.disable("x-powered-by");
app.use((request, response, next) => {
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// Kardna's UV configuration must win over the package's stock config.
app.get("/uv/uv.config.js", (_request, response) => {
  response.type("application/javascript");
  response.sendFile(join(rootDir, "public", "uv", "uv.config.js"));
});

// Proxy runtime assets are served straight from the installed upstream packages.
app.use("/uv", express.static(uvPath, { immutable: true, maxAge: "1d" }));
app.use("/epoxy", express.static(epoxyPath, { immutable: true, maxAge: "1d" }));
app.use("/libcurl", express.static(libcurlPath, { immutable: true, maxAge: "1d" }));
app.use("/baremux", express.static(baremuxPath, { immutable: true, maxAge: "1d" }));
app.use("/scram", express.static(scramjetPath, { immutable: true, maxAge: "1d" }));

app.get("/api/proxy/health", (_request, response) => {
  response.setHeader("Cache-Control", "no-store");
  response.json({
    ok: true,
    port,
    engines: ["ultraviolet", "scramjet"],
    transports: ["epoxy", "libcurl"],
    wisp: "/wisp/",
    protections: {
      privateNetworks: "blocked",
      loopback: "blocked",
      directIpTargets: "blocked",
      udp: "blocked",
      connectionLimitPerIp: maxWispConnectionsPerIp,
      upgradeLimitPerMinute: maxWispUpgradesPerMinute,
      totalStreams: wisp.options.stream_limit_total,
      perHostStreamLimiter: "disabled-upstream-bug",
    },
  });
});

if (isDevelopment) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root: rootDir,
    appType: "spa",
    server: {
      middlewareMode: true,
      hmr: { server },
    },
  });
  app.use(vite.middlewares);
} else {
  const distDir = join(rootDir, "dist");
  const indexPath = join(distDir, "index.html");
  if (!existsSync(indexPath)) {
    console.error("Kardna production build was not found. Run npm run build first.");
    process.exit(1);
  }
  app.use(express.static(distDir, { maxAge: "1h", index: false }));
  app.use((request, response, next) => {
    if (request.method !== "GET" || !request.accepts("html")) return next();
    response.sendFile(indexPath);
  });
}

server.on("upgrade", (request, socket, head) => {
  if (!request.url?.startsWith("/wisp/")) {
    // Vite owns its HMR upgrade route during development.
    if (!isDevelopment) socket.destroy();
    return;
  }

  const clientIp = normalizeRemoteAddress(socket.remoteAddress);
  if (!allowWispUpgrade(clientIp)) {
    rejectUpgrade(socket, 429, "Too Many Requests");
    return;
  }

  const active = activeWispConnections.get(clientIp) ?? 0;
  if (active >= maxWispConnectionsPerIp) {
    rejectUpgrade(socket, 429, "Too Many Connections");
    return;
  }

  activeWispConnections.set(clientIp, active + 1);
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    const count = activeWispConnections.get(clientIp) ?? 1;
    if (count <= 1) activeWispConnections.delete(clientIp);
    else activeWispConnections.set(clientIp, count - 1);
  };
  socket.once("close", release);

  try {
    wisp.routeRequest(request, socket, head);
  } catch (error) {
    release();
    console.error("Wisp upgrade failed:", error instanceof Error ? error.message : error);
    socket.destroy();
  }
});

server.listen({ port, host }, () => {
  console.log("\nKardna is online:");
  console.log(`  http://localhost:${port}`);
  console.log(`  http://${hostname()}:${port}`);
  console.log(`  mode: ${isDevelopment ? "development" : "production"}`);
  console.log("  proxy: Ultraviolet default / Scramjet backup");
  console.log("  transport: Epoxy TLS default / Libcurl.js optional");
  console.log("  Wisp: private networks blocked / rate limits active\n");
});

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeRemoteAddress(address) {
  if (!address) return "unknown";
  return address.startsWith("::ffff:") ? address.slice(7) : address;
}

function allowWispUpgrade(clientIp) {
  const now = Date.now();
  const previous = wispUpgradeWindows.get(clientIp);
  if (!previous || now - previous.startedAt >= 60_000) {
    wispUpgradeWindows.set(clientIp, { startedAt: now, count: 1 });
    return true;
  }
  if (previous.count >= maxWispUpgradesPerMinute) return false;
  previous.count += 1;
  return true;
}

function rejectUpgrade(socket, status, message) {
  socket.end(
    `HTTP/1.1 ${status} ${message}\r\n` +
    "Connection: close\r\n" +
    "Content-Type: text/plain; charset=utf-8\r\n" +
    `Content-Length: ${Buffer.byteLength(message)}\r\n\r\n${message}`,
  );
}

function shutdown(signal) {
  clearInterval(wispWindowCleanup);
  console.log(`${signal} received; closing Kardna.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
