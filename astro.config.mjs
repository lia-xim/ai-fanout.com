import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ai-fanout.com/",
  output: "static",
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) => !["/404", "/404.html", "/tracker"].includes(new URL(page).pathname.replace(/\/$/, "") || "/"),
    }),
  ],
});
