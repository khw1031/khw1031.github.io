import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import rehypeSlug from 'rehype-slug';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkFlexibleMarkers from 'remark-flexible-markers';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
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

/**
 * Block elements that are worth pointing at when reviewing content. Anything
 * finer (inline emphasis, links) shares its parent block's line, and anything
 * coarser (section wrappers) is too vague to edit against.
 */
const ANCHORED_BLOCKS = new Set([
  'p',
  'li',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  // A table row, not its cells: one markdown row is one source line, so `tr`
  // is both the finest useful anchor and the only one that adds no noise.
  'tr',
]);

/**
 * Stamp each block element with the markdown line it came from, so a rendered
 * page can point back at its source. Consumed by the dev-only note annotator
 * (src/components/NoteAnnotator.astro, src/lib/annotations.ts) as a location
 * hint and as the handle for finding a block again on the page.
 *
 * The number is body-relative — frontmatter is stripped before parsing — so
 * against the full source file it can sit a line or so off.
 *
 * Runs last in the rehype phase so it sees the tree after mermaid/KaTeX/Shiki
 * substitutions. Those plugins rebuild their subtrees from HTML strings, which
 * drops position info; such nodes simply go unstamped rather than erroring.
 */
function rehypeStampSourceLines() {
  return (tree: unknown) => {
    const visit = (node: unknown): void => {
      if (typeof node !== 'object' || node === null) return;
      const n = node as {
        type?: unknown;
        tagName?: unknown;
        properties?: Record<string, unknown>;
        children?: unknown;
        position?: { start?: { line?: number } };
      };
      const line = n.position?.start?.line;
      if (
        n.type === 'element' &&
        typeof n.tagName === 'string' &&
        ANCHORED_BLOCKS.has(n.tagName) &&
        typeof line === 'number'
      ) {
        n.properties = { ...(n.properties ?? {}), 'data-line': line };
      }
      if (Array.isArray(n.children)) {
        for (const child of n.children) visit(child);
      }
    };
    visit(tree);
  };
}

export const remarkPlugins: PluggableList = [
  // singleTilde: false — GFM strikethrough only via `~~...~~`. A single
  // `~` is kept literal, so Korean range notation (`8~12배`, `140만~160만`)
  // no longer pairs up into accidental strikethrough within a block.
  [remarkGfm, { singleTilde: false }],
  // Make CommonMark emphasis flanking rules CJK-aware so patterns like
  // `**강조**조사` or `**"…"**라는` (closing ** after punctuation, before a
  // Korean letter) parse as emphasis instead of rendering as literal `**`.
  remarkCjkFriendly,
  // Sentence/inline highlight: `==텍스트==` -> <mark>. Handles Korean josa
  // right after the closing `==` (e.g. `==강조==를`) natively, so no extra
  // CJK patch is needed here. Styled via `.prose mark` in global.css.
  remarkFlexibleMarkers,
  // Math via KaTeX. singleDollarTextMath: false disables single-`$` inline
  // math so existing prose dollars ($1.4B, $0.21→$0.12, Svelte `$state`)
  // stay literal; only `$$…$$` (and ```math fences) are treated as math.
  // Pairs with rehypeKatex in the rehype phase.
  [remarkMath, { singleDollarTextMath: false }],
  [remarkSmartypants, { dashes: 'oldschool' }],
];

export const rehypePlugins: ReadonlyArray<Pluggable> = [
  // ```mermaid blocks -> build-time inline <svg> (browser via playwright).
  // Requires `mermaid` in markdown.syntaxHighlight.excludeLangs
  // (astro.config.mjs) so Shiki leaves the block for this plugin.
  rehypeMermaid,
  // Renders remark-math nodes ($$…$$, ```math) to KaTeX HTML. Requires the
  // KaTeX stylesheet, imported globally in src/styles/global.css.
  rehypeKatex,
  rehypeShiftHeadings,
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
  [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
  // Last: stamps data-line after every other plugin has settled the tree.
  rehypeStampSourceLines,
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
