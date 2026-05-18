import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

// Returns whether the src/mocks folder exists.
// Re-checks the filesystem on every call so dev-time renames are reflected
// immediately in service-unavailable decisions and mock fallback logic.

export function hasMocksDirectory(): boolean {
  const cwd = process.cwd();
  let projectRoot = cwd;
  // Try to locate project root by walking up from current file dir
  try {
    let dir = __dirname;
    for (let i = 0; i < 8; i += 1) {
      const pkg = path.join(dir, "package.json");
      if (fs.existsSync(pkg)) {
        projectRoot = dir;
        break;
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch (_e) {
    // fallback to process.cwd()
  }

  const mocksDir = path.join(projectRoot, "src", "mocks");
  const exists = fs.existsSync(mocksDir);
  if (!exists) {
    // diagnostic: log current cwd and expected mocks folder
    // This helps debugging when Next's runtime changes the working directory
    // and prevents silent failures when mocks are present in the repo but
    // not visible at runtime.
    // eslint-disable-next-line no-console
    console.debug(
      `[hasMocksDirectory] cwd=${cwd} projectRoot=${projectRoot} mocksDir=${mocksDir} exists=${exists}`,
    );
  }
  return exists;
}

// loadMocks is used throughout the api routes to synchronously grab the
// exported values from `src/mocks/index.ts` when the directory exists.
// It returns `null` if the folder doesn't exist or loading fails.
export function loadMocks(): any | null {
  if (!hasMocksDirectory()) return null;
  try {
    let projectRoot = process.cwd();
    try {
      let dir = __dirname;
      for (let i = 0; i < 8; i += 1) {
        const pkg = path.join(dir, "package.json");
        if (fs.existsSync(pkg)) {
          projectRoot = dir;
          break;
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
    } catch (_e) {
      /* ignore */
    }

    const mocksDir = path.join(projectRoot, "src", "mocks");
    const candidates = [
      "index.js",
      "index.cjs",
      "index.mjs",
      "index.ts",
      "index.tsx",
      "index.jsx",
    ];

    // Use indirect require to avoid bundler static analysis
    const _req: any = eval("require");

    for (const file of candidates) {
      const p = path.join(mocksDir, file);
      const exists = fs.existsSync(p);
      if (!exists) continue;
      try {
        try {
          const resolved = _req.resolve(p);
          if (resolved && _req.cache) delete _req.cache[resolved];
        } catch (resErr) {
          /* ignore */
        }
        const mod = _req(p);
        return mod?.default ?? mod;
      } catch (_e) {
        // continue to next candidate
      }
    }

    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.debug("[loadMocks] failed to load mocks", err);
    return null;
  }
}

// Async loader for server routes that prefer dynamic import semantics.
// Returns the mocks object or null.
export async function loadMocksAsync(): Promise<any | null> {
  if (!hasMocksDirectory()) return null;
  // Prefer a statically-imported dev bundle to avoid dynamic import restrictions
  try {
    const devModule = await import("./mocks.dev");
    return devModule?.default ?? devModule;
  } catch (_e) {
    /* ignore */
  }
  try {
    let projectRoot = process.cwd();
    try {
      let dir = __dirname;
      for (let i = 0; i < 8; i += 1) {
        const pkg = path.join(dir, "package.json");
        if (fs.existsSync(pkg)) {
          projectRoot = dir;
          break;
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
    } catch (_e) {
      /* ignore */
    }

    const mocksDir = path.join(projectRoot, "src", "mocks");
    const candidates = [
      "index.mjs",
      "index.cjs",
      "index.js",
      "index.ts",
      "index.tsx",
      "index.jsx",
    ];

    for (const file of candidates) {
      const p = path.join(mocksDir, file);
      if (!fs.existsSync(p)) continue;
      try {
        const url = pathToFileURL(p).href;
        const mod = await import(url);
        return mod?.default ?? mod;
      } catch (e) {
        // continue to next candidate
      }
    }

    // fallback to sync loader
    return loadMocks();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.debug("[loadMocksAsync] failed to load mocks", err);
    return null;
  }
}

// Try to dynamically import a single mock module that corresponds to a
// specific API path. This is useful when importing the aggregated
// `index.ts` fails due to ESM/TS re-export resolution in the dev runtime.
export async function loadMockForPathAsync(
  pathName: string,
): Promise<any | null> {
  if (!hasMocksDirectory()) return null;
  try {
    let projectRoot = process.cwd();
    try {
      let dir = __dirname;
      for (let i = 0; i < 8; i += 1) {
        const pkg = path.join(dir, "package.json");
        if (fs.existsSync(pkg)) {
          projectRoot = dir;
          break;
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
    } catch (e) {
      /* ignore */
    }

    const mocksDir = path.join(projectRoot, "src", "mocks");

    // mapping from request paths to candidate module files and export keys
    const map: Record<string, { file: string; key?: string }[]> = {
      "categories": [
        { file: "navigation.ts", key: "NAV_ALL_CATEGORIES" },
        { file: "navigation.ts", key: "NAV_PRIMARY_CATEGORIES" },
      ],
      "social-links": [{ file: "socialLinks.ts", key: "SOCIAL_LINKS_MOCK" }],
      "sections/top-notice": [{ file: "topNotice.ts", key: "TOP_NOTICE_MOCK" }],
      "sections/trending-now": [
        { file: "trending.ts", key: "TRENDING_SECTION_MOCK" },
      ],
      "sections/latest-news": [
        { file: "latestNews.ts", key: "LATEST_NEWS_SECTION_MOCK" },
      ],
      "sections/subscriber-news": [
        { file: "subscriberNews.ts", key: "SUBSCRIBER_NEWS_MOCK" },
      ],
      "sections/home-grids": [{ file: "home.ts", key: "HOME_SECTIONS_MOCK" }],
    };

    const candidates = map[pathName] ?? [];
    for (const c of candidates) {
      const p = path.join(mocksDir, c.file);
      if (!fs.existsSync(p)) continue;
      try {
        const url = pathToFileURL(p).href;
        const mod = await import(url);
        const exported = c.key
          ? (mod[c.key] ?? mod.default ?? mod)
          : (mod.default ?? mod);
        if (exported !== undefined) return exported;
      } catch (_e) {
        continue;
      }
    }

    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.debug("[loadMockForPathAsync] failed", err);
    return null;
  }
}
