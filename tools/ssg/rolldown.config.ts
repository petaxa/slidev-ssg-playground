import { defineConfig } from "rolldown";

export default defineConfig({
  input: "tools/ssg/src/run.ts",
  output: {
    format: "esm",
    file: "tools/ssg/dist/run.js",
  },
  external: [
    "@playwright/test",
    // Node built-ins を明示するならこのへん（環境により要不要）
    "node:fs/promises",
    "node:path",
    "node:child_process",
    "fs",
    "path",
    "child_process",
    "unhead/parser",
    "unhead/server"
  ],
});
