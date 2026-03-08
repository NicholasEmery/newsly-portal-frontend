import fs from "fs";
import path from "path";
let cache: any | false | null = null;

// Returns the exported object from src/mocks/index.ts if the folder exists
// or `false` if it does not. Caches result between calls.

export function hasMocksDirectory(): boolean {
  if (cache !== null) return cache;
  const cwd = process.cwd();
  const mocksDir = path.join(cwd, "src", "mocks");
  cache = fs.existsSync(mocksDir);
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
    console.error("[loadMocks] failed to import mocks", err);
    return null;
  }
}
