# Project Agent Skills

Source of truth: `.agents/skills/{slug}/`. Claude Code loads them via
`.claude/skills/{slug}` relative symlinks.

Note authoring (`core`) is a **global** skill at `~/.agents/skills/core`, not a project skill, so it
is not in this table. Its default note destination is `$HOME/khw1031.github.io/src/content/notes`.

The question-answer logger (`q`, `/q`) is likewise a **global** skill at `~/.agents/skills/q`
(enabled via `install.sh`), so it is not in this table either. It appends to this repo's
schema-free `logs` collection under `src/content/logs/questions/`; the project-local `migrate`
skill below organizes those logs into `study-note`.

| Skill | Use for |
| --- | --- |
| [capture](capture/SKILL.md) | Explicit `/capture` logger — turns a completed conversation decision, observation, explanation, plan, or progress snapshot into an organized final-form block under `src/content/logs/capture/YYYY-MM-DD.md`; append-only and KST-dated. |
| [content-delete](content-delete/SKILL.md) | Reference-safe deletion of an agent-authored doc (notes/inbox/sources/idea) — repo-wide inbound-reference scan + hub/child structural check, then `git rm`; never orphans children or auto-rewrites links. |
| [cv-entry-writer](cv-entry-writer/SKILL.md) | Writing/revising CV project entries — narrative + separated impact, 개조식 voice. Targets `src/data/cv.ts`. |
| [idea](idea/SKILL.md) | Developing a raw idea (methodology + domain research, official/primary first) into an OKF note on the unlisted `/idea` route — like notes (URL-only, out of search/sitemap/robots) but also unlinked from the footer. Promotes an `idea/inbox` capture (deletes the source). Committed plaintext (public-if-found). Targets `src/content/idea`. |
| [ideabox](ideabox/SKILL.md) | Lightweight idea capture (`/ideabox`) — light cleanup + questions-to-explore + a quick related/service reference scan, saved under `src/content/idea/inbox` (`/idea/inbox/`). The fast front-end to `idea`; no methodology/business analysis. |
| [interpretive-generative-visuals](interpretive-generative-visuals/SKILL.md) | Turning a word/concept into a mathematical generative visual grammar (Three.js/WebGL). |
| [lint](lint/SKILL.md) | Checking content `.md` frontmatter integrity and auto-filling missing fields (upper model analyzes, Haiku writes). Run before commit/push. |
| [migrate](migrate/SKILL.md) | The repo's single reusable "document-organization" pattern (project-local) — moves items from a staging `logs` sub-index into a permanent categorized space and deletes them from the log (move, not copy). Current instance: `/q`'s `logs/questions/*.md` Q&A → `src/content/study-note/{category}` topic tree, integrating into existing notes (no duplicates) with 앞/뒤 links. Mandatory approval gate before write/delete; per-item deletion of `<!-- q … --> … <!-- /q -->` blocks. |
| [notes-polish](notes-polish/SKILL.md) | Highlight (`==마커==`) + structure alignment over agent-authored collections (notes/inbox/idea). Body-mutating; independent of `/lint`. Manual batch or scoped to named files. |
