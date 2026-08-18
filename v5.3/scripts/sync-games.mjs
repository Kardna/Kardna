import { readdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gamesDir = path.join(root, "public", "games");
const manifestPath = path.join(root, "public", "games.json");
const imageExtensions = ["webp", "avif", "png", "jpg", "jpeg", "svg"];
const audioBridgeMarker = "data-kardna-audio-bridge";
const audioBridgeTag = '<script src="../../kardna-audio-bridge.js" data-kardna-audio-bridge></script>';

const titleCase = (value) => value
  .replace(/[-_]+/g, " ")
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const slug = (value) => value
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureAudioBridge(htmlPath) {
  const source = await readFile(htmlPath, "utf8");
  if (source.includes(audioBridgeMarker)) return false;

  let next = source;
  const headMatch = source.match(/<head(?:\s[^>]*)?>/i);
  if (headMatch?.index !== undefined) {
    const insertAt = headMatch.index + headMatch[0].length;
    next = `${source.slice(0, insertAt)}\n    ${audioBridgeTag}${source.slice(insertAt)}`;
  } else {
    const htmlMatch = source.match(/<html(?:\s[^>]*)?>/i);
    if (htmlMatch?.index !== undefined) {
      const insertAt = htmlMatch.index + htmlMatch[0].length;
      next = `${source.slice(0, insertAt)}\n  <head>${audioBridgeTag}</head>${source.slice(insertAt)}`;
    } else {
      next = `${audioBridgeTag}\n${source}`;
    }
  }

  await writeFile(htmlPath, next);
  return true;
}

const parsedManifest = JSON.parse(await readFile(manifestPath, "utf8"));
const wrappedManifest = !Array.isArray(parsedManifest) && Array.isArray(parsedManifest?.games);
const manifest = Array.isArray(parsedManifest) ? parsedManifest : wrappedManifest ? parsedManifest.games : null;
if (!manifest) throw new Error("public/games.json must contain an array or an object with a games array.");

const knownFolders = new Set(
  manifest
    .map((game) => {
      const gameUrl = typeof game?.url === "string" ? game.url : typeof game?.iframe === "string" ? game.iframe : "";
      return gameUrl.match(/^(?:\.\/|\/)?games\/([^/]+)\//)?.[1] ?? null;
    })
    .filter(Boolean),
);

const directories = (await readdir(gamesDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name !== "shared")
  .map((entry) => entry.name)
  .sort();

const additions = [];
let patchedGames = 0;

for (const folder of directories) {
  const folderPath = path.join(gamesDir, folder);
  const htmlPath = path.join(folderPath, "index.html");
  const files = await readdir(folderPath);
  const hasHtml = await exists(htmlPath);

  if (hasHtml && await ensureAudioBridge(htmlPath)) patchedGames += 1;
  if (knownFolders.has(folder)) continue;

  const swf = files.find((file) => file.toLowerCase().endsWith(".swf"));
  const type = hasHtml ? "html" : swf ? "flash" : null;
  if (!type) {
    console.warn(`[Kardna] Skipped ${folder}: no index.html or .swf file found.`);
    continue;
  }

  let image = "./fallback-cover.svg";
  for (const extension of imageExtensions) {
    const candidate = `cover.${extension}`;
    if (files.includes(candidate)) {
      image = `./games/${folder}/${candidate}`;
      break;
    }
  }

  const name = titleCase(folder);
  additions.push({
    id: slug(folder),
    name,
    image,
    url: type === "html" ? `./games/${folder}/index.html` : `./games/${folder}/${swf}`,
    type,
    category: "Other",
    description: `Play ${name} on Kardna.`,
    tags: [],
    featured: false,
    dateAdded: new Date().toISOString().slice(0, 10),
  });
}

if (additions.length) {
  const nextManifest = wrappedManifest ? { ...parsedManifest, games: [...manifest, ...additions] } : [...manifest, ...additions];
  await writeFile(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`);
  console.log(`Added ${additions.length} game${additions.length === 1 ? "" : "s"} to public/games.json:`);
  for (const game of additions) console.log(`- ${game.name}`);
} else {
  console.log("Kardna catalog is already in sync.");
}

if (patchedGames) {
  console.log(`Added the mute bridge to ${patchedGames} HTML game${patchedGames === 1 ? "" : "s"}.`);
}
