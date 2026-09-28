import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Resolve the public base URL.
 *
 * - Local `npm run build`: "./" (open dist/index.html offline)
 * - GitHub Pages project URL: "/<repo>/" e.g. /portfolio-v2/
 * - Custom domain: "/" when public/CNAME exists (add arusha.com.np there later)
 * - Override anytime with BASE_PATH=/ or BASE_PATH=/portfolio-v2/
 */
function normalizeBase(value) {
  if (!value || value === "./") return "./";
  let next = value.trim();
  if (!next.startsWith("/")) next = `/${next}`;
  if (!next.endsWith("/")) next = `${next}/`;
  return next;
}

function resolveBase() {
  if (process.env.BASE_PATH) return normalizeBase(process.env.BASE_PATH);

  const pages = process.env.GITHUB_PAGES === "true";
  if (!pages) return "./";

  if (existsSync(join("public", "CNAME")) || existsSync("CNAME")) return "/";

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (repo) return normalizeBase(`/${repo}/`);

  return "/";
}

const pages = process.env.GITHUB_PAGES === "true";
const base = resolveBase();
let outDir = "dist";

export default defineConfig({
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
        // SPA deep links on GitHub Pages: missing paths serve 404.html → same app shell.
        copyFileSync(file, join(outDir, "404.html"));
      },
    },
  ],
});
