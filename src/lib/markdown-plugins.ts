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
  /* Single theme: Shiki inlines token colors so syntax highlighting
     shows. The transformer below strips only the background-color
     from the <pre> inline style so our prose pre rule can paint the
     code-block bg. */
  theme: 'github-light',
  wrap: true,
  transformers: [
    {
      name: 'strip-pre-bg',
      pre(node: { properties?: Record<string, unknown> }) {
        const props = node.properties;
        if (!props) return;
        const style = props.style;
        if (typeof style !== 'string') return;
        props.style = style.replace(/background-color\s*:\s*[^;]+;?/g, '').trim();
      },
    },
  ],
} as const;
