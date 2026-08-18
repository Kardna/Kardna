(function () {
  const statusEl = document.getElementById('status');
  const frameHostEl = document.getElementById('proxy-frame');

  function setStatus(message, persist = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('hidden');
    if (!persist) {
      clearTimeout(setStatus._timer);
      setStatus._timer = setTimeout(() => statusEl.classList.add('hidden'), 2200);
    }
  }

  function decodeHashUrl(hash) {
    const raw = (hash || '').replace(/^#/, '').trim();
    if (!raw) return '';
    try {
      return decodeURIComponent(escape(atob(raw)));
    } catch {
      try {
        return atob(raw);
      } catch {
        return '';
      }
    }
  }

  function getAutoWispUrl() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${location.host}/wisp/`;
  }

  async function ensureFreshServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      await reg.unregister();
    }

    await navigator.serviceWorker.register('/sw.js?v=3', { scope: '/' });
    await navigator.serviceWorker.ready;

    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  async function boot() {
    const target = decodeHashUrl(location.hash);
    if (!target) {
      setStatus('Missing target URL in the hash.', true);
      return;
    }

    let hostname = target;
    try {
      hostname = new URL(target).hostname;
    } catch {
      setStatus('Invalid target URL in the hash.', true);
      return;
    }

    setStatus(`Preparing transport for ${hostname}…`, true);

    if (typeof $scramjetLoadController !== 'function') {
      throw new Error('Scramjet bundle did not load');
    }

    await ensureFreshServiceWorker();

    const connection = new BareMux.BareMuxConnection('/baremux/worker.js');
    await connection.setTransport('/libcurl/index.mjs', [{
      websocket: getAutoWispUrl(),
      connections: [60, 50, 6]
    }]);

    const { ScramjetController } = $scramjetLoadController();
    const scramjet = new ScramjetController({
      prefix: '/scram/',
      files: {
        wasm: '/scram/scramjet.wasm.wasm',
        all: '/scram/scramjet.all.js',
        sync: '/scram/scramjet.sync.js'
      },
      flags: {
        captureErrors: true,
        serviceworkers: true,
        syncxhr: true
      }
    });

    await scramjet.init();

    const frame = scramjet.createFrame(frameHostEl);
    setStatus(`Launching ${new URL(target).hostname}…`);

    // FIX HERE
    frame.go(target);

    document.title = `Kardna • ${new URL(target).hostname}`;
  }

  window.addEventListener('hashchange', () => window.location.reload());
  window.addEventListener('load', () => {
    boot().catch((error) => {
      console.error(error);
      setStatus(`Scramjet failed to start: ${error?.message || error}`, true);
    });
  });
})();