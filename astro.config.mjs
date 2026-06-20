// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: update `site` to the production domain before deploy.
// Used for canonical URLs, sitemap, RSS, and absolute schema/OG URLs.
export default defineConfig({
  site: 'https://aits.llc',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://aits.llc/') {
          item.priority = 1.0;
        } else if (item.url.includes('/blog/') && item.url !== 'https://aits.llc/blog') {
          item.priority = 0.7;
        } else {
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
