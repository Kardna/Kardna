import { useCallback, useEffect, useMemo, useState } from "react";

const EVENT_NAME = "kardna-storage-change";

function readIds(key: string): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function useStoredIds(key: string) {
  const [ids, setIds] = useState<string[]>(() => (typeof window === "undefined" ? [] : readIds(key)));

  useEffect(() => {
    const sync = (event: Event) => {
      if (event instanceof CustomEvent && event.detail?.key && event.detail.key !== key) return;
      setIds(readIds(key));
    };
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT_NAME, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT_NAME, sync);
    };
  }, [key]);

  const update = useCallback(
    (next: string[] | ((current: string[]) => string[])) => {
      const current = readIds(key);
      const resolved = typeof next === "function" ? next(current) : next;
      const unique = [...new Set(resolved)];
      window.localStorage.setItem(key, JSON.stringify(unique));
      setIds(unique);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
    },
    [key],
  );

  return useMemo(() => ({ ids, update }), [ids, update]);
}
