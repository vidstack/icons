import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";

import fs from "node:fs";
import path from "node:path";

export default defineConfig([
  // NPM
  {
    input: ["src/index.ts", "src/icons/lazy.ts", "src/element.ts"],
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
  // CDN
  {
    input: { cdn: "src/element.ts" },
    treeshake: true,
    output: {
      format: "esm",
      dir: "dist",
    },
    plugins: [
      {
        name: "external",
        async resolveId(id, importer) {
          if (id.startsWith(".") && !id.includes("lazy")) {
            const filePath = (await this.resolve(id, importer, { skipSelf: true }))?.id;
            if (filePath?.includes("src/icons")) {
              return {
                id: `./icons/${path.basename(id.replace(".ts", ".js"))}`,
                external: true,
              };
            }
          }
        },
      },
      esbuild({
        target: "esnext",
        platform: "neutral",
        minify: true,
        mangleProps: /^_/,
      }),
    ],
  },
]);
