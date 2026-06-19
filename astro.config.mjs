// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: update `site` to the production domain before deploy.
// Used for canonical URLs, sitemap, RSS, and absolute schema/OG URLs.
export default defineConfig({
  site: 'https://aits.llc',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
