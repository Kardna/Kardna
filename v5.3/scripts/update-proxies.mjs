import { spawnSync } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = join(rootDir, "package.json");
const lockPath = join(rootDir, "package-lock.json");
const metadataPath = join(rootDir, "docs", "proxy-upstream.json");
const shouldInstall = process.argv.includes("--install");
const checkOnly = process.argv.includes("--check");

const sources = {
  // Nebula is the compatibility matrix for the path-export based browser stack.
  // Newer transport majors use a different server asset API, so they are not
  // installed blindly just because a standalone repository changed its major.
  nebula: process.env.KARDNA_NEBULA_PACKAGE_URL ?? "https://raw.githubusercontent.com/NebulaServices/Nebula/main/package.json",
  ultravioletApp: process.env.KARDNA_UV_APP_PACKAGE_URL ?? "https://raw.githubusercontent.com/titaniumnetwork-dev/Ultraviolet-App/main/package.json",
  // wisp-js uses `master`, not `main`. V5 used the wrong branch and its update
  // command failed before it could compare versions.
  wispJs: process.env.KARDNA_WISP_JS_PACKAGE_URL ?? "https://raw.githubusercontent.com/MercuryWorkshop/wisp-js/master/package.json",
};

const compatibleMajors = {
  "@mercuryworkshop/bare-mux": 2,
  "@mercuryworkshop/epoxy-transport": 2,
  "@mercuryworkshop/libcurl-transport": 1,
  "@mercuryworkshop/scramjet": 1,
  "@mercuryworkshop/wisp-js": 0,
  "@titaniumnetwork-dev/ultraviolet": 3,
  express: 5,
};

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "Kardna-Proxy-Updater/3.0" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

function dependencyFrom(manifest, name) {
  const spec = manifest?.dependencies?.[name];
  if (typeof spec !== "string" || !spec.trim()) throw new Error(`Upstream manifest is missing ${name}.`);
  return spec.trim();
}

function packageVersion(manifest, expectedName) {
  if (manifest?.name !== expectedName || typeof manifest?.version !== "string") {
    throw new Error(`Unexpected package manifest returned for ${expectedName}.`);
  }
  return manifest.version.trim();
}

function majorOf(spec) {
  const release = spec.match(/(?:\/v|[-@])([0-9]+)(?:\.[0-9]+){0,2}/i);
  const semver = spec.match(/(?:^|[^0-9])([0-9]+)\.[0-9]+\.[0-9]+/);
  return Number.parseInt((release ?? semver)?.[1] ?? "", 10);
}

function assertCompatible(name, spec) {
  if (name === "@mercuryworkshop/wisp-js" && !/^0\.4\./.test(spec)) {
    throw new Error(`${name} moved outside the validated 0.4.x series. Refusing an unsafe automatic upgrade.`);
  }
  const expected = compatibleMajors[name];
  const actual = majorOf(spec);
  if (!Number.isFinite(actual)) throw new Error(`Could not determine ${name} major version from ${spec}.`);
  if (actual !== expected) throw new Error(`${name} moved to major ${actual}; Kardna expects major ${expected}. Refusing an unsafe automatic upgrade.`);
}

function run(command, args) {
  const result = spawnSync(process.platform === "win32" ? `${command}.cmd` : command, args, { cwd: rootDir, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} exited with code ${result.status ?? 1}.`);
}

try {
  console.log("Checking Nebula, Ultraviolet-App, and Mercury Workshop Wisp manifests…");
  const [nebula, ultravioletApp, wispJs, packageText, metadataText, lockText] = await Promise.all([
    fetchJson(sources.nebula),
    fetchJson(sources.ultravioletApp),
    fetchJson(sources.wispJs),
    readFile(packagePath, "utf8"),
    readFile(metadataPath, "utf8").catch(() => null),
    readFile(lockPath, "utf8").catch(() => null),
  ]);

  const localPackage = JSON.parse(packageText);
  localPackage.dependencies ??= {};
  const before = { ...localPackage.dependencies };
  const synced = {
    "@mercuryworkshop/bare-mux": dependencyFrom(nebula, "@mercuryworkshop/bare-mux"),
    "@mercuryworkshop/epoxy-transport": dependencyFrom(nebula, "@mercuryworkshop/epoxy-transport"),
    "@mercuryworkshop/libcurl-transport": dependencyFrom(nebula, "@mercuryworkshop/libcurl-transport"),
    "@mercuryworkshop/scramjet": dependencyFrom(nebula, "@mercuryworkshop/scramjet"),
    "@titaniumnetwork-dev/ultraviolet": dependencyFrom(nebula, "@titaniumnetwork-dev/ultraviolet"),
    "@mercuryworkshop/wisp-js": packageVersion(wispJs, "@mercuryworkshop/wisp-js"),
    express: dependencyFrom(ultravioletApp, "express"),
  };

  for (const [name, spec] of Object.entries(synced)) assertCompatible(name, spec);
  Object.assign(localPackage.dependencies, synced);
  delete localPackage.dependencies["wisp-server-node"];
  delete localPackage.dependencies.ws;

  const changes = Object.entries(synced).filter(([name, version]) => before[name] !== version);
  for (const removed of ["wisp-server-node", "ws"]) {
    if (before[removed]) changes.push([removed, "removed (replaced by @mercuryworkshop/wisp-js)"]);
  }

  if (changes.length === 0) {
    console.log("Proxy dependencies already match the compatible upstream versions.");
    process.exit(0);
  }

  for (const [name, version] of changes) console.log(`  ${name}: ${before[name] ?? "not installed"} -> ${version}`);

  if (checkOnly) {
    process.exitCode = 2;
  } else {
    const nextPackageText = `${JSON.stringify(localPackage, null, 2)}\n`;
    const nextMetadataText = `${JSON.stringify({
      checkedAt: new Date().toISOString(),
      sources,
      versions: synced,
      compatibilityPolicy: "Automatic updates stop at a new major version so the runtime integration cannot silently break.",
    }, null, 2)}\n`;

    await writeFile(packagePath, nextPackageText);
    await writeFile(metadataPath, nextMetadataText);
    console.log("Updated package.json and docs/proxy-upstream.json.");

    if (shouldInstall) {
      try {
        console.log("Installing and validating the synchronized proxy stack…");
        run("npm", ["install"]);
        run("npm", ["run", "proxy:verify"]);
        run("npm", ["run", "typecheck"]);
        console.log("Proxy update completed successfully.");
      } catch (error) {
        console.error("Update validation failed; restoring project manifests.");
        await writeFile(packagePath, packageText);
        if (metadataText === null) await rm(metadataPath, { force: true });
        else await writeFile(metadataPath, metadataText);
        if (lockText === null) await rm(lockPath, { force: true });
        else await writeFile(lockPath, lockText);
        throw error;
      }
    } else {
      console.log("Run npm install and npm run typecheck to validate the synchronized versions.");
    }
  }
} catch (error) {
  console.error("Proxy update failed:", error instanceof Error ? error.message : error);
  console.error("Unsafe or incomplete updates are not kept. Check internet access and try again.");
  process.exit(1);
}
