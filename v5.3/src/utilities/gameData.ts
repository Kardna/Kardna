import type { Game, GameType } from "../types/game";
import { createSlug } from "./createSlug";

const FALLBACK_DATE = "1970-01-01";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeType(value: unknown, url: string): GameType | null {
  if (value === "html" || value === "flash") return value;
  if (/\.swf(?:$|[?#])/i.test(url)) return "flash";
  return url ? "html" : null;
}

function normalizeSession(value: unknown, tags: string[]): Game["sessionLength"] {
  if (value === "quick" || value === "medium" || value === "long") return value;
  if (tags.some((tag) => ["quick", "fast", "reaction", "casual", "puzzle", "arcade"].includes(tag.toLowerCase()))) return "quick";
  if (tags.some((tag) => ["cloud", "adventure", "rpg", "horror"].includes(tag.toLowerCase()))) return "long";
  return "medium";
}

function inferCategory(name: string, description: string, url: string): string {
  const value = `${name} ${description} ${url}`.toLowerCase();
  if (/soccer|football|basketball|pool|chess|checkers|madden|fifa|street fighter/.test(value)) return "Sports";
  if (/race|racing|kart|forza|drift|moto|slope|flight/.test(value)) return "Racing";
  if (/2048|puzzle|bloxorz|breaklock|doodle god|chroma|portal/.test(value)) return "Puzzle";
  if (/shooter|fps|warzone|call of duty|apex|destiny|overwatch|rainbow six|halo|space invaders/.test(value)) return "Action";
  if (/horror|dead by daylight|phasmophobia|poppy|resident evil|dying light/.test(value)) return "Horror";
  if (/minecraft|roblox|stardew|terraria|witcher|cyberpunk|assassin|far cry|diablo|sea of thieves|grand theft|gta/.test(value)) return "Adventure";
  if (/duck life|idle|cookie|freezeria|pizzeria|sushiria|wingeria|tiny fishing/.test(value)) return "Casual";
  if (/pacman|flappy|doodle jump|crossy|dinosaur|run 3|vex|geometry|tomb of the mask/.test(value)) return "Arcade";
  return "Other";
}

function inferTags(name: string, description: string, url: string, category: string): string[] {
  const value = `${name} ${description} ${url}`.toLowerCase();
  const tags = new Set<string>([category.toLowerCase()]);
  const checks: Array<[RegExp, string]> = [
    [/multiplayer|two-player|2-player|1v1/, "multiplayer"],
    [/cloud|now\.gg|geforcenow|xbox\.com\/play/, "cloud"],
    [/horror|dead by daylight|phasmophobia|resident evil|poppy playtime/, "horror"],
    [/fps|shooter/, "shooter"],
    [/puzzle/, "puzzle"],
    [/runner/, "runner"],
    [/race|racing/, "racing"],
    [/classic|retro/, "classic"],
    [/idle/, "idle"],
    [/platform/, "platformer"],
  ];
  checks.forEach(([pattern, tag]) => pattern.test(value) && tags.add(tag));
  if (/^https?:/i.test(url)) tags.add("external");
  return [...tags];
}

export function normalizeGames(input: unknown): Game[] {
  const source = Array.isArray(input)
    ? input
    : isRecord(input) && Array.isArray(input.games)
      ? input.games
      : null;

  if (!source) {
    if (import.meta.env.DEV) console.warn("[Kardna] games.json must contain an array or an object with a games array.");
    return [];
  }

  const seen = new Set<string>();
  const games: Game[] = [];

  source.forEach((entry, index) => {
    if (!isRecord(entry)) {
      if (import.meta.env.DEV) console.warn(`[Kardna] Skipped game at index ${index}: expected an object.`);
      return;
    }

    const rawName = nonEmptyString(entry.name) ? entry.name : nonEmptyString(entry.title) ? entry.title : "";
    const rawImage = nonEmptyString(entry.image) ? entry.image : "";
    const rawUrl = nonEmptyString(entry.url) ? entry.url : nonEmptyString(entry.iframe) ? entry.iframe : "";
    const cleanedUrl = rawUrl.trim().replace(/;$/, "");
    const type = normalizeType(entry.type, cleanedUrl);

    if (!rawName || !rawImage || !cleanedUrl || !type) {
      if (import.meta.env.DEV) {
        console.warn(`[Kardna] Skipped game at index ${index}: name/title, image, url/iframe, and a valid type are required.`, entry);
      }
      return;
    }

    const name = rawName.trim();
    const description = nonEmptyString(entry.description) ? entry.description.trim() : `Play ${name} on Kardna.`;
    const category = nonEmptyString(entry.category) ? entry.category.trim() : inferCategory(name, description, cleanedUrl);
    const baseId = nonEmptyString(entry.id) ? createSlug(entry.id) : createSlug(name);
    let id = baseId;
    let suffix = 2;
    while (seen.has(id)) id = `${baseId}-${suffix++}`;
    seen.add(id);

    const providedTags = Array.isArray(entry.tags) ? entry.tags.filter(nonEmptyString).map((tag) => tag.trim()) : [];
    const tags = providedTags.length ? providedTags : inferTags(name, description, cleanedUrl, category);
    const controls = Array.isArray(entry.controls)
      ? entry.controls.filter(nonEmptyString).map((control) => control.trim())
      : tags.includes("cloud") ? ["Keyboard", "Mouse", "Controller"] : tags.includes("keyboard") ? ["Keyboard"] : ["Keyboard", "Mouse"];

    games.push({
      id,
      name,
      image: rawImage.trim().replace(/;$/, ""),
      url: cleanedUrl,
      type,
      category,
      description,
      tags,
      featured: entry.featured === true,
      dateAdded: nonEmptyString(entry.dateAdded) && /^\d{4}-\d{2}-\d{2}$/.test(entry.dateAdded) ? entry.dateAdded : FALLBACK_DATE,
      players: typeof entry.players === "number" && entry.players > 0 ? Math.min(4, Math.round(entry.players)) : tags.includes("multiplayer") || tags.includes("cloud") ? 2 : 1,
      controls,
      popularity: typeof entry.popularity === "number" ? Math.max(0, Math.min(100, entry.popularity)) : entry.featured ? 82 : 50,
      sessionLength: normalizeSession(entry.sessionLength, tags),
      fullscreen: entry.fullscreen !== false,
      mobile: entry.mobile === true || tags.includes("touch") || tags.includes("mobile"),
      mature: entry.mature === true || tags.includes("horror") || tags.includes("mature"),
    });
  });

  return games;
}
