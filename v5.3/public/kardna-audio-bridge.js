(() => {
  "use strict";

  let muted = false;
  let volume = 0.8;
  try {
    muted = window.localStorage.getItem("kardna:player-muted") === "1";
  } catch {
    // Storage can be blocked in some sandboxed or private contexts.
  }

  const mediaState = new WeakMap();
  const audioContexts = new Set();
  const suspendedByKardna = new WeakSet();

  function setMediaMuted(element, nextMuted) {
    if (nextMuted) {
      if (!mediaState.has(element)) mediaState.set(element, { muted: element.muted });
      element.muted = true;
      element.volume = volume;
      return;
    }

    const previous = mediaState.get(element);
    if (previous) element.muted = previous.muted;
    element.volume = volume;
    mediaState.delete(element);
  }

  function updateMedia() {
    document.querySelectorAll("audio, video").forEach((element) => setMediaMuted(element, muted));
  }

  function updateContext(context) {
    if (muted) {
      if (context.state === "running") {
        suspendedByKardna.add(context);
        context.suspend().catch(() => undefined);
      }
      return;
    }

    if (suspendedByKardna.has(context) && context.state === "suspended") {
      context.resume().catch(() => undefined).finally(() => suspendedByKardna.delete(context));
    }
  }

  function setVolume(nextVolume) {
    const numeric = Number(nextVolume);
    if (Number.isFinite(numeric)) volume = Math.max(0, Math.min(1, numeric));
    document.querySelectorAll("audio, video").forEach((element) => { element.volume = volume; });
  }

  function setMuted(nextMuted) {
    muted = Boolean(nextMuted);
    window.__KARDNA_MUTED__ = muted;
    updateMedia();
    audioContexts.forEach(updateContext);
  }

  function wrapAudioContext(name) {
    const NativeAudioContext = window[name];
    if (typeof NativeAudioContext !== "function") return;

    try {
      window[name] = new Proxy(NativeAudioContext, {
        construct(target, args, newTarget) {
          const context = Reflect.construct(target, args, newTarget);
          audioContexts.add(context);
          updateContext(context);
          return context;
        },
      });
    } catch {
      // Some older browsers expose non-writable audio constructors.
    }
  }

  function wrapAudioConstructor() {
    const NativeAudio = window.Audio;
    if (typeof NativeAudio !== "function") return;

    try {
      window.Audio = new Proxy(NativeAudio, {
        construct(target, args, newTarget) {
          const element = Reflect.construct(target, args, newTarget);
          setMediaMuted(element, muted);
          return element;
        },
      });
    } catch {
      // Keep the native constructor when it cannot be replaced.
    }
  }

  wrapAudioContext("AudioContext");
  wrapAudioContext("webkitAudioContext");
  wrapAudioConstructor();

  document.addEventListener("play", (event) => {
    if (event.target instanceof HTMLMediaElement) setMediaMuted(event.target, muted);
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateMedia, { once: true });
  } else {
    updateMedia();
  }

  window.__KARDNA_SET_MUTED__ = setMuted;
  window.__KARDNA_MUTED__ = muted;
  window.addEventListener("message", (event) => {
    if (event.data?.type === "kardna:set-muted") setMuted(event.data.muted);
    if (event.data?.type === "kardna:set-volume") setVolume(event.data.volume);
  });

  window.parent?.postMessage({ type: "kardna:audio-ready" }, "*");
})();
