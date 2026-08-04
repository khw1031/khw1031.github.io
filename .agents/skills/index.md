# Project Agent Skills

Source of truth: `.agents/skills/{slug}/`. Claude Code loads them via
`.claude/skills/{slug}` relative symlinks.

Note authoring (`core`) is a **global** skill at `~/.agents/skills/core`, not a project skill, so it
is not in this table. Its default note destination is `$HOME/khw1031.github.io/src/content/notes`.

| Skill | Use for |
| --- | --- |
| [content-delete](content-delete/SKILL.md) | Reference-safe deletion of an agent-authored doc (notes/inbox/sources/wiki) — repo-wide inbound-reference scan + hub/child structural check, then `git rm`; never orphans children or auto-rewrites links. |
| [cv-entry-writer](cv-entry-writer/SKILL.md) | Writing/revising CV project entries — narrative + separated impact, 개조식 voice. Targets `src/data/cv.ts`. |
| [idea](idea/SKILL.md) | Developing a raw idea (methodology + domain research, official/primary first) into an OKF note on the unlisted `/idea` route — like notes (URL-only, out of search/sitemap/robots) but also unlinked from the footer. Promotes an `idea/inbox` capture (deletes the source). Committed plaintext (public-if-found). Targets `src/content/idea`. |
| [ideabox](ideabox/SKILL.md) | Lightweight idea capture (`/ideabox`) — light cleanup + questions-to-explore + a quick related/service reference scan, saved under `src/content/idea/inbox` (`/idea/inbox/`). The fast front-end to `idea`; no methodology/business analysis. |
| [interpretive-generative-visuals](interpretive-generative-visuals/SKILL.md) | Turning a word/concept into a mathematical generative visual grammar (Three.js/WebGL). |
| [lint](lint/SKILL.md) | Checking content `.md` frontmatter integrity and auto-filling missing fields (upper model analyzes, Haiku writes). Run before commit/push. |
| [notes-polish](notes-polish/SKILL.md) | Highlight (`==마커==`) + structure alignment over agent-authored collections (notes/inbox/wiki/idea). Body-mutating; independent of `/lint`. Manual batch or scoped to named files. |
| [research](research/SKILL.md) | Researching references (official/primary sources first) and persisting them into the OKF wiki under `src/content/wiki` — nested categories, `type` frontmatter, 1차/2차 링크. Public + searchable. |
