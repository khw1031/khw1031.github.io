import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import matter from 'gray-matter';
import { rehypePlugins, remarkPlugins, shikiConfig } from './src/lib/markdown-plugins.ts';

function* walkMarkdown(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkMarkdown(full);
    } else if (extname(entry.name) === '.md') {
      yield full;
    }
  }
}

// @astrojs/sitemap's filter only sees the final URL, not frontmatter, so
// excluding draft entries from collections that DO appear in the sitemap
// (posts, read-and-write, wiki — notes/inbox/specs/idea are already excluded
// wholesale by path below) means precomputing their draft routes here by
// reading frontmatter directly, the same way scripts/check-frontmatter.ts does.
function draftPagePaths() {
  const paths = new Set();
  for (const base of ['posts', 'read-and-write', 'wiki']) {
    const root = `src/content/${base}`;
    for (const file of walkMarkdown(root)) {
      const { data } = matter(readFileSync(file, 'utf-8'));
      if (data.draft) {
        const id = relative(root, file).replace(/\.md$/, '');
        paths.add(`/${base}/${id}/`);
      }
    }
  }
  return paths;
}

const DRAFT_PATHS = draftPagePaths();

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
        const isPrivate = (base) => path === base || path.startsWith(`${base}/`);
        return (
          !isPrivate('/notes') &&
          !isPrivate('/inbox') &&
          !isPrivate('/specs') &&
          !isPrivate('/idea') &&
          !DRAFT_PATHS.has(path)
        );
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
