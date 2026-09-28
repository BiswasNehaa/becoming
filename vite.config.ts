import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon.svg"],
      manifest: {
        name: "Becoming — Personal Growth Tracker",
        short_name: "Becoming",
        description: "A private personal-growth tracker for habits, learning, reading, nutrition, and reflection.",
        start_url: "/",
        display: "standalone",
        background_color: "#F7F5FB",
        theme_color: "#6D4FEB",
        icons: [
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
        ],
      },
      // Only precache the app shell (JS/CSS/HTML) so the UI itself still
      // opens offline — no runtimeCaching for API calls, so data fetches
      // keep going over the network and fail visibly (via the existing
      // sync-error banner) instead of silently serving stale cached data.
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:4321",
    },
  },
});
