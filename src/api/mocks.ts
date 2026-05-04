import fs from "fs";
import path from "path";
let cache: any | false | null = null;

// Returns the exported object from src/mocks/index.ts if the folder exists
// or `false` if it does not. Caches result between calls.

export function hasMocksDirectory(): boolean {
  if (cache !== null) return cache;
  const cwd = process.cwd();
  const mocksDir = path.join(cwd, "src", "mocks");
  const exists = fs.existsSync(mocksDir);
  cache = exists;
  if (!exists) {
    // diagnostic: log current cwd and expected mocks folder
    // This helps debugging when Next's runtime changes the working directory
    // and prevents silent failures when mocks are present in the repo but
    // not visible at runtime.
    // eslint-disable-next-line no-console
    console.debug(
      `[hasMocksDirectory] cwd=${cwd} mocksDir=${mocksDir} exists=${exists}`,
    );
  }
  return cache;
}

// loadMocks is used throughout the api routes to synchronously grab the
// exported values from `src/mocks/index.ts` when the directory exists.
// It returns `null` if the folder doesn't exist or loading fails.
export function loadMocks(): any | null {
  if (!hasMocksDirectory()) return null;
  try {
    // alias '@/mocks' points to the top-level mocks folder via tsconfig paths
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const mocks = require("@/mocks");
    return mocks || null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[loadMocks] failed to require '@/mocks'", { err });
    return null;
  }
}

// Async loader for server routes that prefer dynamic import semantics.
// Returns the mocks object or null.
export async function loadMocksAsync(): Promise<any | null> {
  if (!hasMocksDirectory()) return null;
  try {
    // Try alias import first
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const m = await import("@/mocks");
    return m || null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[loadMocksAsync] failed to import '@/mocks'", { err });
    return null;
  }
}
