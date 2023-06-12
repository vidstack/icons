import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";

export default defineConfig([
  {
    input: ["src/index.ts", "src/icons/lazy.ts"],
    treeshake: true,
    output: {
      format: "esm",
      dir: "dist/browser",
      chunkFileNames: "icons/[name].js",
    },
    plugins: [esbuild({ target: "esnext", platform: "browser" })],
  },
  {
    input: ["src/index.ts", "src/icons/lazy.ts"],
    treeshake: true,
    output: {
      format: "esm",
      dir: "dist/server",
      chunkFileNames: "icons/[name].js",
    },
    plugins: [esbuild({ target: "node16", platform: "node" })],
  },
]);
