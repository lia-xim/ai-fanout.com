import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { includeInSitemap, serializeSitemapItem } from "./src/data/sitemap-registry.mjs";

export default defineConfig({
  site: "https://ai-fanout.com/",
  output: "static",
  trailingSlash: "never",
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      filter: includeInSitemap,
      serialize: serializeSitemapItem,
      namespaces: {
        news: false,
        image: false,
        video: false,
        xhtml: true,
      },
    }),
  ],
});
