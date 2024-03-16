import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";

import fs from "node:fs";

export default defineConfig([
  {
    input: ["src/index.ts", "src/icons/lazy.ts", "src/element.ts", "src/cdn.ts"],
    treeshake: true,
    output: {
      format: "esm",
      dir: "dist",
      chunkFileNames: "icons/[name].js",
    },
    plugins: [
      esbuild({
        target: "esnext",
        platform: "neutral",
      }),
      {
        name: "server-bundle",
        closeBundle() {
          fs.mkdirSync("dist/server");
          fs.writeFileSync("dist/server/element.js", "export class MediaIconElement {}");
        },
      },
    ],
  },
]);
