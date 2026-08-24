import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ai-fanout.com/",
  output: "static",
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, "") || "/";
        return !["/404", "/404.html", "/tracker", "/lab", "/protocol-builder", "/research", "/research/methodology", "/datasets", "/protocols/example-2026-08-22"].includes(path);
      },
    }),
  ],
});
