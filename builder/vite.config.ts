import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(root, "./src") } },
  server: {
    fs: { allow: [path.resolve(root, "..")] },
    proxy: {
      "/live-data/gamesradar-videos": {
        target: "https://airedale.futurecdn.net",
        changeOrigin: true,
        secure: false,
        rewrite: () => "/feeds/feed_1782389430417.yahoo-video",
      },
    },
  },
});
