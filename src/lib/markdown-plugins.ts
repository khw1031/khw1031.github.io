import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import type { Pluggable, PluggableList } from 'unified';

export const remarkPlugins: PluggableList = [
  remarkGfm,
  [remarkSmartypants, { dashes: 'oldschool' }],
];

export const rehypePlugins: ReadonlyArray<Pluggable> = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
  [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
];

export const shikiConfig = {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  /* Suppress Shiki's inline background-color so our prose code-block
     bg (color-mix on --color-foreground) can show through. Without
     this, Shiki writes style="background-color:#fff" on <pre>, which
     no external CSS rule can override. */
  defaultColor: false,
  wrap: true,
} as const;
