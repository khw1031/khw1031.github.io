# Project Agent Skills

Source of truth: `.agents/skills/{slug}/`. Claude Code loads them via
`.claude/skills/{slug}` relative symlinks.

| Skill | Use for |
| --- | --- |
| [cv-entry-writer](cv-entry-writer/SKILL.md) | Writing/revising CV project entries — narrative + separated impact, 개조식 voice. Targets `src/data/cv.ts`. |
| [interpretive-generative-visuals](interpretive-generative-visuals/SKILL.md) | Turning a word/concept into a mathematical generative visual grammar (Three.js/WebGL). |
| [lint](lint/SKILL.md) | Checking content `.md` frontmatter integrity and auto-filling missing fields (upper model analyzes, Haiku writes). Run before commit/push. |
| [note-writer](note-writer/SKILL.md) | Authoring learning/reference notes under `src/content/notes` — hub(map + 핵심 20%) + on-demand child notes, 비유·인출 질문·내 관점 포함. |
| [skill-manager](skill-manager/SKILL.md) | Creating, updating, reviewing, validating project skills. |
