import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Each page is drawn by its script, so the browser should not paint the page before that script has run. Without
// this, a page opened for the first time shows one blank frame, and Chrome drops the page-change fade because the
// new page is empty when it is revealed. The HTML files carry blocking="render" on their entry script for the dev
// server; the build swaps that script for the bundled one and drops the attribute, so this puts it back.
// Browsers that do not know the attribute ignore it and load as before.
function renderBlockingEntry(): Plugin {
  return {
    name: "render-blocking-entry",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: html => html.replace(/<script type="module" crossorigin/g, '<script type="module" blocking="render" crossorigin'),
    },
  }
}

// Multi-page build: the home page plus one HTML page per case study,
// so the published URLs stay the same as the old static site.
export default defineConfig({
  plugins: [react(), tailwindcss(), renderBlockingEntry()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        bustech: path.resolve(import.meta.dirname, "projects/bustech.html"),
        networking: path.resolve(import.meta.dirname, "projects/networking.html"),
        windowsServer: path.resolve(import.meta.dirname, "projects/windows-server.html"),
      },
    },
  },
})
