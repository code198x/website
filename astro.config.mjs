// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    mdx({
      syntaxHighlight: "prism",
    }),
    sitemap(),
  ],
  site: "https://code198x.stevehill.xyz",
  markdown: {
    syntaxHighlight: "prism",
  },
});
