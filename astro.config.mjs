import { defineConfig } from 'astro/config';
import { rehypePlugins, remarkPlugins, shikiConfig } from './src/lib/markdown-plugins.ts';

export default defineConfig({
  site: 'https://khw1031.github.io',
  trailingSlash: 'never',
  output: 'static',
  markdown: {
    remarkPlugins,
    rehypePlugins,
    shikiConfig,
  },
});
