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

## Deferred (handled in Phase 4.4 as TS data + `.astro` renderer)

The CV, cover letter, and portfolio pages were not markdown documents in
`legacy/nextjs` — they were JSX templates whose data was inlined as React
component props. Migrating them as `.md` would lose the structured layout,
so per the TODO they will become:

- `src/data/cv.ts` (typed object) + `src/pages/cv.astro`
- `src/data/cover-letter.ts` + `src/pages/cover-letter.astro`
- `src/data/portfolio.ts` + `src/pages/portfolio.astro`

Components used in the legacy files:

| Component | Files | Notes |
| --- | --- | --- |
| `Layout` | `cv.mdx`, `cover-letter.mdx`, `portfolio.mdx` | Page wrapper |
| `Header` | same | Page heading + optional `hideContact` prop |
| `Section title="…">` | same | Grouped block with a title |
| `Detail` | same | Item with `title`, `period`, `role?`, `url?`, `content[]` (array of `{ title, description: string[] }`) |

Until Phase 4.4 lands, these collections (`cv`, `cover-letter`, `portfolio`)
are intentionally empty; the build emits a benign `glob-loader` warning that
will be resolved by adding the corresponding TS data + `.astro` page.

## Excluded from migration

Per the migration policy, `hidden` (one test entry) and `playground` (placeholder)
were not migrated. They remain available under the `legacy/nextjs` branch.
