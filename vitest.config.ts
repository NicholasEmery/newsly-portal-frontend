import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["scripts/**/*.test.ts", "src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["scripts/**/*.ts", "src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "scripts/**/*.test.ts",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
      ],
      reporter: ["text", "lcov"],
    },
  },
});
