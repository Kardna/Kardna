import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";


const serverSource = readFileSync("server/index.mjs", "utf8");
if (!serverSource.includes("wisp.options.stream_limit_per_host = -1")) {
  throw new Error("Unsafe Wisp per-host limiter is enabled. It crashes wisp-js 0.4.1 because connection.streams is not iterable.");
}

const profileSource = readFileSync("src/context/ProfileContext.tsx", "utf8");
if (!profileSource.includes('proxyTransport: "epoxy"')) {
  throw new Error("Epoxy TLS must remain the stable default transport.");
}

const requiredAssets = [
  [uvPath, "uv.bundle.js"],
  [uvPath, "uv.sw.js"],
  [uvPath, "uv.handler.js"],
  [uvPath, "uv.client.js"],
  [baremuxPath, "index.js"],
  [baremuxPath, "worker.js"],
  [epoxyPath, "index.mjs"],
  [libcurlPath, "index.mjs"],
  [scramjetPath, "scramjet.all.js"],
  [scramjetPath, "scramjet.sync.js"],
  [scramjetPath, "scramjet.wasm.wasm"],
];

const missing = requiredAssets
  .map(([directory, file]) => join(directory, file))
  .filter((path) => !existsSync(path));

for (const localFile of ["public/proxy-sw.js", "public/uv/uv.config.js", "server/index.mjs"]) {
  if (!existsSync(localFile)) missing.push(localFile);
}

if (typeof wisp.routeRequest !== "function" || typeof wisp.options !== "object") {
  throw new Error("@mercuryworkshop/wisp-js/server does not expose the expected server API.");
}

if (missing.length > 0) {
  console.error("Proxy verification failed. Missing runtime files:");
  for (const path of missing) console.error(`  - ${path}`);
  process.exit(1);
}

console.log("Proxy runtime verification passed.");
console.log(`  ${requiredAssets.length} upstream runtime assets found`);
console.log("  Wisp server API found");
console.log("  Kardna service worker and UV configuration found");
console.log("  Wisp crash regression guard passed");
console.log("  Epoxy TLS default regression guard passed");
