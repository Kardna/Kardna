(function () {
  const statusEl = document.getElementById('status');
  const frameEl = document.getElementById('proxy-frame');

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

  async function boot() {
    const target = decodeHashUrl(location.hash);
    if (!target) {
      setStatus('Missing target URL in the hash.', true);
      return;
    }

    setStatus(`Preparing transport for ${new URL(target).hostname}…`, true);

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

    if (!navigator.serviceWorker.controller) {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
    }

    const connection = new BareMux.BareMuxConnection('/baremux/worker.js');
    await connection.setTransport('/libcurl/index.mjs', [{
      websocket: getAutoWispUrl(),
      connections: [60, 50, 6]
    }]);

    const frame = scramjet.createFrame(frameEl);
    setStatus(`Launching ${new URL(target).hostname}…`);
    await frame.navigate(target);
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
