import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "kardna:profile:v2";
const PROFILE_SCHEMA_VERSION = 4;

export type ThemeVariant = "ink" | "midnight" | "carbon";
export type GridDensity = "comfortable" | "compact";
export type CardPreference = "mixed" | "uniform";
export type ProxyEngine = "ultraviolet" | "scramjet";
export type ProxyTransport = "libcurl" | "epoxy";

export interface ProfileSettings {
  accent: string;
  theme: ThemeVariant;
  reducedMotion: boolean;
  lowPerformance: boolean;
  volume: number;
  hideMature: boolean;
  startupAnimation: boolean;
  gridDensity: GridDensity;
  cardPreference: CardPreference;
  proxyRememberTabs: boolean;
  liquidGlass: boolean;
  proxyEngine: ProxyEngine;
  proxyTransport: ProxyTransport;
}

interface ProfileState {
  schemaVersion: number;
  favorites: string[];
  recent: string[];
  continuePlaying: string[];
  searchHistory: string[];
  launches: Record<string, number>;
  playtime: Record<string, number>;
  lastPlayed: Record<string, number>;
  mixDisliked: string[];
  settings: ProfileSettings;
}

interface ProfileContextValue {
  profile: ProfileState;
  favoriteSet: Set<string>;
  toggleFavorite: (id: string) => void;
  recordLaunch: (id: string) => void;
  recordPlaytime: (id: string, seconds: number) => void;
  addSearch: (query: string) => void;
  dislikeMixGame: (id: string) => void;
  updateSettings: (patch: Partial<ProfileSettings>) => void;
  clearLocalData: () => void;
}

const defaults: ProfileState = {
  schemaVersion: PROFILE_SCHEMA_VERSION,
  favorites: [],
  recent: [],
  continuePlaying: [],
  searchHistory: [],
  launches: {},
  playtime: {},
  lastPlayed: {},
  mixDisliked: [],
  settings: {
    accent: "#ffffff",
    theme: "ink",
    reducedMotion: false,
    lowPerformance: false,
    volume: 0.8,
    hideMature: false,
    startupAnimation: true,
    gridDensity: "comfortable",
    cardPreference: "mixed",
    proxyRememberTabs: false,
    liquidGlass: true,
    proxyEngine: "ultraviolet",
    proxyTransport: "epoxy",
  },
};

function loadProfile(): ProfileState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<ProfileState>;
    const previousSchema = typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : 2;
    const settings = { ...defaults.settings, ...(parsed.settings ?? {}) };
    settings.accent = "#ffffff";

    // V5 shipped Libcurl.js as the default. On some Windows/Wisp combinations it
    // can fail TLS handshakes with curl error 35, so existing V5 profiles migrate
    // once to the more compatible Epoxy transport without clearing any user data.
    if (previousSchema < PROFILE_SCHEMA_VERSION && settings.proxyTransport === "libcurl") {
      settings.proxyTransport = "epoxy";
    }

    return {
      ...defaults,
      ...parsed,
      schemaVersion: PROFILE_SCHEMA_VERSION,
      settings,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      continuePlaying: Array.isArray(parsed.continuePlaying) ? parsed.continuePlaying : [],
      searchHistory: Array.isArray(parsed.searchHistory) ? parsed.searchHistory : [],
      mixDisliked: Array.isArray(parsed.mixDisliked) ? parsed.mixDisliked : [],
      launches: parsed.launches ?? {},
      playtime: parsed.playtime ?? {},
      lastPlayed: parsed.lastPlayed ?? {},
    };
  } catch {
    return defaults;
  }
}

function saveProfile(profile: ProfileState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Local storage can be blocked in private browser modes.
  }
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileState>(loadProfile);

  const update = useCallback((recipe: (current: ProfileState) => ProfileState) => {
    setProfile((current) => {
      const next = recipe(current);
      saveProfile(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => update((current) => ({
    ...current,
    favorites: current.favorites.includes(id) ? current.favorites.filter((item) => item !== id) : [id, ...current.favorites],
  })), [update]);

  const recordLaunch = useCallback((id: string) => update((current) => ({
    ...current,
    recent: [id, ...current.recent.filter((item) => item !== id)].slice(0, 24),
    continuePlaying: [id, ...current.continuePlaying.filter((item) => item !== id)].slice(0, 12),
    launches: { ...current.launches, [id]: (current.launches[id] ?? 0) + 1 },
    lastPlayed: { ...current.lastPlayed, [id]: Date.now() },
  })), [update]);

  const recordPlaytime = useCallback((id: string, seconds: number) => {
    if (seconds < 1) return;
    update((current) => ({ ...current, playtime: { ...current.playtime, [id]: (current.playtime[id] ?? 0) + seconds } }));
  }, [update]);

  const addSearch = useCallback((query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    update((current) => ({ ...current, searchHistory: [cleaned, ...current.searchHistory.filter((item) => item !== cleaned)].slice(0, 10) }));
  }, [update]);

  const dislikeMixGame = useCallback((id: string) => update((current) => ({
    ...current,
    mixDisliked: [id, ...current.mixDisliked.filter((item) => item !== id)].slice(0, 100),
  })), [update]);

  const updateSettings = useCallback((patch: Partial<ProfileSettings>) => update((current) => ({
    ...current,
    settings: { ...current.settings, ...patch },
  })), [update]);

  const clearLocalData = useCallback(() => {
    saveProfile(defaults);
    setProfile(defaults);
  }, []);

  const value = useMemo<ProfileContextValue>(() => ({
    profile,
    favoriteSet: new Set(profile.favorites),
    toggleFavorite,
    recordLaunch,
    recordPlaytime,
    addSearch,
    dislikeMixGame,
    updateSettings,
    clearLocalData,
  }), [addSearch, clearLocalData, dislikeMixGame, profile, recordLaunch, recordPlaytime, toggleFavorite, updateSettings]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
