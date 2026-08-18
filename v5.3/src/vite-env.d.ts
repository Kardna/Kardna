/// <reference types="vite/client" />

interface Window {
  RufflePlayer?: {
    newest: () => {
      createPlayer: () => RufflePlayerElement;
    };
    config?: Record<string, unknown>;
  };
}

interface RufflePlayerElement extends HTMLElement {
  ruffle: () => {
    load: (options: string | Record<string, unknown>) => Promise<void>;
    volume: number;
    requestFullscreen?: () => Promise<void>;
  };
}
