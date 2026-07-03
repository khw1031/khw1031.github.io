import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { rehypePlugins, remarkPlugins, shikiConfig } from './src/lib/markdown-plugins.ts';

export default defineConfig({
  site: 'https://khw1031.github.io',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/notes' && !path.startsWith('/notes/');
      },
    }),
  ],
  markdown: {
    processor: unified({ remarkPlugins, rehypePlugins }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['hyunwoo-macbookpro.taild4a895.ts.net'],
    },
  },
});
