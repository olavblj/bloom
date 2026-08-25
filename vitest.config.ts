import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["packages/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@bloom/render": path.resolve(__dirname, "packages/bloom-render/src"),
    },
  },
});
