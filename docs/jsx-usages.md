# Legacy JSX Component Usages

Inventory of JSX components used in `legacy/nextjs` content, and how they were
handled during Phase 2.2 migration. Use this as the reference when restoring
the corresponding pages in later phases.

## Resolved (converted to plain markdown)

### `<Quote url="…">{`text`}</Quote>`

Six occurrences across `read-and-write` posts. Converted by
`src/lib/quote-jsx.ts` to a GFM blockquote with an em-dash + autolink to the
source URL.

| File | Quotes |
| --- | --- |
| `read-and-write/251129.md` | 1 |
| `read-and-write/251201.md` | 1 |
| `read-and-write/251211.md` | 1 |
| `read-and-write/251214.md` | 1 |
| `read-and-write/251222.md` | 2 |

## Resolved — Phase 4.4 (TS data + `.astro` renderer)

The CV, cover letter, and portfolio pages were not markdown documents in
`legacy/nextjs` — they were JSX templates whose data was inlined as React
component props. They now live as:

- `src/data/cv.ts` (typed object, `documentPageSchema.parse(...)`) → `src/pages/cv.astro`
- `src/data/cover-letter.ts` → `src/pages/cover-letter.astro`
- `src/data/portfolio.ts` → `src/pages/portfolio.astro`

Shared shape lives in `src/data/types.ts` (`documentPageSchema`,
`sectionSchema`, `detailSchema`, `detailContentSchema`).

Legacy → new mapping:

| Legacy JSX | New |
| --- | --- |
| `Layout` (gray panel + PDF button) | dropped per DESIGN.md (no chrome) — `src/layouts/DocumentLayout.astro` wraps `Base.astro` |
| `Header hideContact?` | `src/components/document/DocumentHeader.astro` |
| `Section title="…">` | `src/components/document/Section.astro` |
| `Detail` | `src/components/document/Detail.astro` |
| `Keywords` (Tailwind color chips) | plain `name · name · ...` line in `src/components/document/Keywords.astro` |

The legacy `cv` / `cover-letter` / `portfolio` content collections were
removed in the same pass (empty collection warning gone). Legacy slug
references like `/20251218` were rewritten to the new `/posts/<slug>/`
routes.

## Excluded from migration

Per the migration policy, `hidden` (one test entry) and `playground` (placeholder)
were not migrated. They remain available under the `legacy/nextjs` branch.
