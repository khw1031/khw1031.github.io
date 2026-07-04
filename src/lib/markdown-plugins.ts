import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkFlexibleMarkers from 'remark-flexible-markers';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import type { Pluggable, PluggableList } from 'unified';

/**
 * Shift markdown body headings down one level so the page title (h1
 * rendered by PostLayout) stays the only h1. Markdown `# foo` then
 * becomes a section <h2>, which matches both the visual hierarchy
 * and a11y/SEO expectations.
 *
 * Also normalizes the heading text: strips leading `#` characters
 * from the first text child. Markdown sources that accidentally
 * write `## # foo` end up with `# foo` as the heading text, which
 * would clash with our CSS `::before` pseudo-prefix.
 */
function rehypeShiftHeadings() {
  return (tree: unknown) => {
    const visit = (node: unknown): void => {
      if (typeof node !== 'object' || node === null) return;
      const n = node as { tagName?: unknown; children?: unknown };
      if (typeof n.tagName === 'string') {
        const m = n.tagName.match(/^h([1-5])$/);
        if (m) {
          n.tagName = `h${Number(m[1]) + 1}`;
          stripLeadingHash(n);
        }
      }
      if (Array.isArray(n.children)) {
        for (const child of n.children) visit(child);
      }
    };
    visit(tree);
  };
}

function stripLeadingHash(heading: { children?: unknown }): void {
  const children = heading.children;
  if (!Array.isArray(children) || children.length === 0) return;
  const first = children[0] as { type?: unknown; value?: unknown };
  if (first.type !== 'text' || typeof first.value !== 'string') return;
  first.value = first.value.replace(/^[#\s]+/, '');
}

export const remarkPlugins: PluggableList = [
  remarkGfm,
  // Make CommonMark emphasis flanking rules CJK-aware so patterns like
  // `**강조**조사` or `**"…"**라는` (closing ** after punctuation, before a
  // Korean letter) parse as emphasis instead of rendering as literal `**`.
  remarkCjkFriendly,
  // Sentence/inline highlight: `==텍스트==` -> <mark>. Handles Korean josa
  // right after the closing `==` (e.g. `==강조==를`) natively, so no extra
  // CJK patch is needed here. Styled via `.prose mark` in global.css.
  remarkFlexibleMarkers,
  [remarkSmartypants, { dashes: 'oldschool' }],
];

export const rehypePlugins: ReadonlyArray<Pluggable> = [
  rehypeShiftHeadings,
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
