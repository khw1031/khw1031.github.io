---
name: lint
description: >
  Check frontmatter integrity across all content .md files and auto-fill missing
  fields by analyzing each post's content. Run before committing/pushing content
  changes. Analysis (deriving field values from content) is done by the upper
  (current) model; the mechanical frontmatter write is delegated to a lower model
  (Haiku) subagent. Use when frontmatter is incomplete, before a content commit/push,
  or when the pre-push hook reports frontmatter errors.
compatibility: Project source .agents/skills; Claude Code via .claude/skills relative symlink.
repo-operating-targets: src/content/**/*.md, scripts/check-frontmatter.ts
---

# lint — frontmatter integrity + auto-fill

Verify every content `.md` file has schema-valid, complete frontmatter, and fill
what is missing by analyzing the post body. The check is deterministic (a script);
the fill splits work by model tier — **the upper model analyzes, a lower model writes.**

## Principles

- **Every `src/content/**/*.md` is a target.** The checker scans the whole content
  tree, not a fixed list, and holds every file to the same required-key set (known
  collections use their configured schema; unknown ones validate with the base
  schema), so new collections are covered automatically.
- **The upper model owns all analysis and decisions.** Deriving every field value
  from content is the upper (current) model's job.
- **The lower model performs mechanical insertion only.** The delegated Haiku
  subagent never analyzes content, decides values, rewords, or edits the body — it
  splices the exact key/value lines it is handed into the frontmatter. If a write
  would require any judgment, that judgment belongs to the upper model, not the writer.

## When to use

- Before committing/pushing content changes (the routine gate).
- When the `pre-push` hook fails with frontmatter errors.
- When a post was written/edited and its frontmatter looks incomplete.

## Schema (source of truth: `src/content/schemas.ts`)

Required by schema for every collection: `title`, `pubDate`.
Optional: `description`, `summary`, `tags` (`string[]`), `draft` (`bool`), `lang`
(`ko`|`en`, default `ko`), `updatedDate`, `canonical` (URL), `ogImage`.

Required-key convention enforced by the checker (`scripts/check-frontmatter.ts`):
**every `.md` under `src/content/` must have `title`, `pubDate`, `description`,
`summary`, `lang`, `tags` present** — including `notes` and `inbox`, which are
unlisted from search/sitemap but still carry complete frontmatter. New/unknown
directories are held to the same set (validated with the base schema).

**Labs** are also a target. They are hand-authored in `src/lib/labs.ts` (a TS
registry, not `.md`), so they have no frontmatter — the checker instead requires
each entry to have a non-empty `title` and `description`. Labs share the same
listings as posts, so their `description` follows the same one-line rule below.

## Workflow

1. **Check** — run the deterministic checker and read its JSON:

   ```bash
   npx tsx scripts/check-frontmatter.ts --json
   ```

   Each entry is `{ file, collection, missing[], invalid[] }`. Exit code is `1`
   when any file has issues, `0` when clean. If clean, stop — report success.

2. **Analyze (upper model — you).** For each flagged file, read the full file and
   derive concrete values for every `missing`/`invalid` field using the rules below.
   Never invent facts. If a value cannot be derived safely (e.g. no date source),
   leave it out and report it as needing human input — do not guess.

3. **Write (lower model — delegated).** For each file, spawn one subagent with the
   **Agent tool, `model: "haiku"`**, handing it the file path and the exact key/value
   pairs to set. The subagent does a mechanical merge only (see "Writer contract").
   Independent files → spawn the subagents in parallel.

4. **Re-check.** Run the checker again (no `--json`). Confirm it exits `0`. Report
   any files still flagged (e.g. undeterminable `pubDate`/`title`) for human input.

**Labs** (`collection: "labs"`, `file: "src/lib/labs.ts"`, `ref: <href>`): analyze
by reading the lab's page under `src/pages/labs/…` for that href, write a one-line
`description` per the rule below, then delegate the mechanical edit to Haiku — set
the `description` string on the matching entry in `src/lib/labs.ts` (match by
`href`), touching nothing else.

## Field-fill rules (analysis)

Follow the repo language policy: write `description`/`summary`/`tags` in Korean by
default, preserving standard English technical terms.

- **`title`** — use the first `# H1` in the body. If absent and `title` is missing,
  do **not** invent one; report for human input.
- **`pubDate`** — derive only from a reliable source: a date in the filename
  (`251129` → `2025-11-29`, `20251210` → `2025-12-10`) or the file's first git commit
  date (`git log --diff-filter=A --format=%as -- <file> | tail -1`). If neither
  exists, leave it and report — never fabricate a date.
- **`description`** — one front-loaded sentence capturing the post's core, and the
  SEO/meta description. Listings render it on a **single truncated line**, so the
  right edges only align when every description fills that line: write it long
  enough to fill/slightly exceed one line (≈ 60–80 characters incl. spaces) and put
  the essential words first, since the tail may be clipped with an ellipsis. Never
  pad with filler to hit the length — if the post is genuinely thin, keep it honest.
- **`summary`** — a short standalone abstract (1–2 sentences) distinct from
  `description`: what the reader will get, not just the topic label.
- **`lang`** — detect from the body: `en` if the prose is predominantly English,
  otherwise `ko`.
- **`tags`** — 2–5 lowercase topical tags from the actual content. Prefer reusing
  vocabulary already present in other files' tags over inventing new ones. If the
  content is too thin to tag meaningfully, use `[]`.

## Writer contract (subagent, Haiku)

The delegated write must be purely mechanical. Instruct the subagent to:

- Edit ONLY the frontmatter block. Never touch the body.
- ADD the provided missing keys and CORRECT the provided invalid keys. Do not remove,
  reorder, or rewrite existing valid keys or their values.
- Match the existing YAML quoting style (e.g. `pubDate: '2025-12-01'`).
- Write arrays inline for tags: `tags: ['a', 'b']`.
- Return the final frontmatter block it wrote (for verification).

For a lab, the same rule applies to `src/lib/labs.ts`: set only the `description`
string on the entry whose `href` matches, leaving every other field and entry intact.

Give the subagent the values verbatim — it does not analyze content or decide values.

## Closeout report

- checker command + before/after result (issue count, exit code)
- files filled and which fields per file
- files delegated to Haiku (count)
- any file left for human input and why (undeterminable title/date)

## Pre-push hook

`scripts/hooks/pre-push` runs the checker and blocks the push on frontmatter errors,
pointing the user to `/lint`. It only *checks* — it never calls a model, so auto-fill
stays an explicit `/lint` invocation. Enabled via `git config core.hooksPath scripts/hooks`.
