import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ai-fanout.com/",
  output: "static",
  trailingSlash: "never",
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
