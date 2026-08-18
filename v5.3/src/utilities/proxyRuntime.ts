export type ProxyEngine = "ultraviolet" | "scramjet";
export type ProxyTransport = "libcurl" | "epoxy";

interface BareMuxConnectionLike {
  getTransport: () => Promise<string | null>;
  setTransport: (path: string, args: unknown[]) => Promise<void>;
}

interface ScramjetControllerLike {
  init: () => Promise<void>;
  encodeUrl: (url: string) => string;
}

interface UltravioletConfigLike {
  prefix: string;
  encodeUrl: (url: string) => string;
}

interface ProxyRuntimeState {
  connection: BareMuxConnectionLike;
  scramjet: ScramjetControllerLike;
}

const loadedScripts = new Map<string, Promise<void>>();
let runtimePromise: Promise<ProxyRuntimeState> | null = null;
let activeTransport: ProxyTransport | null = null;

function loadScript(src: string) {
  const existing = loadedScripts.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const alreadyLoaded = document.querySelector<HTMLScriptElement>(`script[data-proxy-runtime="${src}"]`);
    if (alreadyLoaded?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = alreadyLoaded ?? document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.proxyRuntime = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => {
      loadedScripts.delete(src);
      script.remove();
      reject(new Error(`Failed to load proxy asset: ${src}`));
    }, { once: true });
    if (!alreadyLoaded) document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
}

function getGlobal<T>(name: string): T {
  const value = (window as unknown as Record<string, unknown>)[name];
  if (!value) throw new Error(`Proxy runtime global ${name} was not created.`);
  return value as T;
}

function getWispUrl() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}/wisp/`;
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("This browser does not support service workers.");
  }

  if (location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(location.hostname)) {
    throw new Error("Proxy service workers require HTTPS outside localhost.");
  }

  const registration = await navigator.serviceWorker.register("/proxy-sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
  await registration.update();
  await navigator.serviceWorker.ready;
}

async function createRuntime(): Promise<ProxyRuntimeState> {
  await Promise.all([
    loadScript("/baremux/index.js"),
    loadScript("/uv/uv.bundle.js"),
    loadScript("/scram/scramjet.all.js"),
  ]);
  await loadScript("/uv/uv.config.js");

  const bareMux = getGlobal<{
    BareMuxConnection: new (workerPath: string) => BareMuxConnectionLike;
  }>("BareMux");

  const loadScramjetController = getGlobal<() => {
    ScramjetController: new (config: {
      prefix: string;
      files: { wasm: string; all: string; sync: string };
      flags: { rewriterLogs: boolean };
    }) => ScramjetControllerLike;
  }>("$scramjetLoadController");

  const { ScramjetController } = loadScramjetController();
  const scramjet = new ScramjetController({
    prefix: "/~/scramjet",
    files: {
      wasm: "/scram/scramjet.wasm.wasm",
      all: "/scram/scramjet.all.js",
      sync: "/scram/scramjet.sync.js",
    },
    flags: { rewriterLogs: false },
  });

  // Initialize Scramjet before the combined worker starts so the backup
  // engine's configuration is available as soon as its route is selected.
  await scramjet.init();
  await registerServiceWorker();

  return {
    connection: new bareMux.BareMuxConnection("/baremux/worker.js"),
    scramjet,
  };
}

async function getRuntime() {
  runtimePromise ??= createRuntime().catch((error) => {
    runtimePromise = null;
    throw error;
  });
  return runtimePromise;
}

export async function setProxyTransport(transport: ProxyTransport) {
  const runtime = await getRuntime();
  const path = transport === "libcurl" ? "/libcurl/index.mjs" : "/epoxy/index.mjs";
  const current = await runtime.connection.getTransport();
  if (activeTransport === transport && current === path) return;

  await runtime.connection.setTransport(path, [{ wisp: getWispUrl() }]);
  activeTransport = transport;
}

export async function initializeProxyRuntime(transport: ProxyTransport) {
  const runtime = await getRuntime();
  await setProxyTransport(transport);
  return runtime;
}

export async function encodeProxyUrl(url: string, engine: ProxyEngine, transport: ProxyTransport) {
  const runtime = await initializeProxyRuntime(transport);

  if (engine === "scramjet") {
    return runtime.scramjet.encodeUrl(url);
  }

  const config = getGlobal<UltravioletConfigLike>("__uv$config");
  return `${config.prefix}${config.encodeUrl(url)}`;
}

export async function checkProxyServer() {
  const response = await fetch("/api/proxy/health", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error(`Proxy server returned ${response.status}.`);
  const payload = await response.json() as { ok?: unknown };
  if (payload.ok !== true) throw new Error("Proxy server health check failed.");
}

export async function clearProxyBrowserData() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations
      .filter((registration) => registration.active?.scriptURL.endsWith("/proxy-sw.js"))
      .map((registration) => registration.unregister()));
  }

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames
    .filter((name) => /uv|ultraviolet|scramjet|baremux|proxy/i.test(name))
    .map((name) => caches.delete(name)));

  const databaseApi = indexedDB as IDBFactory & { databases?: () => Promise<Array<{ name?: string }>> };
  if (databaseApi.databases) {
    const databases = await databaseApi.databases();
    for (const database of databases) {
      if (database.name && /uv|ultraviolet|scramjet|baremux|proxy/i.test(database.name)) {
        indexedDB.deleteDatabase(database.name);
      }
    }
  }

  for (const key of Object.keys(localStorage)) {
    if (/^(uv|ultraviolet|scramjet|baremux|proxy):?/i.test(key)) localStorage.removeItem(key);
  }

  runtimePromise = null;
  activeTransport = null;
}
