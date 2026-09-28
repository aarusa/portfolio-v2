import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pages = process.env.GITHUB_PAGES === "true";
const base = pages ? "/" : "./";
let outDir = "dist";

export default defineConfig({
  // arusha.com.np is the site root, so Pages assets must be /assets/….
  // A local build uses relative paths so opening dist/index.html can run it.
  base,
  define: {
    "import.meta.env.BASE_URL": JSON.stringify(base),
  },
  build: pages
    ? undefined
    : {
        modulePreload: false,
        cssCodeSplit: false,
        assetsInlineLimit: 0,
        rolldownOptions: {
          // Silence EMPTY_IMPORT_META for IIFE (import.meta is invalid outside ESM).
          transform: {
            define: {
              "import.meta": "{}",
            },
          },
        },
        rollupOptions: {
          output: {
            format: "iife",
            entryFileNames: "assets/app.js",
            assetFileNames: "assets/[name][extname]",
            name: "ArushaPortfolio",
          },
        },
      },
  plugins: [
    react(),
    {
      name: "dist-html",
      apply: "build",
      configResolved(config) {
        outDir = config.build.outDir;
      },
      transformIndexHtml: {
        order: "post",
        handler(html) {
          if (pages) return html;
          // A classic script in <head> runs before #root exists, so the page stays blank.
          const src = html.match(/<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>/)?.[1];
          if (!src) return html;
          return html
            .replace(/href="\/favicon\.svg"/g, 'href="./favicon.svg"')
            .replace(/<script[^>]*\ssrc="[^"]+"[^>]*><\/script>\s*/g, "")
            .replace(
              /<link rel="stylesheet"[^>]*href="(\.\/assets\/[^"]+\.css)"[^>]*>/,
              '<link rel="stylesheet" href="$1">',
            )
            .replace("</body>", `  <script src="${src}"></script>\n  </body>`);
        },
      },
      closeBundle() {
        const file = join(outDir, "index.html");
        if (!pages) {
          let html = readFileSync(file, "utf8");
          const assetsDir = join(outDir, "assets");
          const files = readdirSync(assetsDir);
          const cssFile = files.find((name) => name.endsWith(".css"));
          const jsFile = files.find((name) => name.endsWith(".js"));

          if (cssFile) {
            const css = readFileSync(join(assetsDir, cssFile), "utf8");
            if (/<link rel="stylesheet" href="\.\/assets\/[^"]+\.css">/.test(html)) {
              html = html.replace(
                /<link rel="stylesheet" href="\.\/assets\/[^"]+\.css">/,
                () => `<style>${css}</style>`,
              );
            } else {
              html = html.replace("</head>", `<style>${css}</style>\n  </head>`);
            }
          }

          if (jsFile) {
            const js = readFileSync(join(assetsDir, jsFile), "utf8").replaceAll(
              "</script",
              "<\\/script",
            );
            if (/<script src="\.\/assets\/[^"]+\.js"><\/script>/.test(html)) {
              html = html.replace(
                /<script src="\.\/assets\/[^"]+\.js"><\/script>/,
                () => `<script>${js}</script>`,
              );
            } else {
              html = html.replace("</body>", `<script>${js}</script>\n  </body>`);
            }
          }

          writeFileSync(file, html);
        }
        copyFileSync(file, join(outDir, "404.html"));
      },
    },
  ],
});
