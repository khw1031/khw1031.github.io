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
  wrap: true,
} as const;
