# Project Agent Skills

Source of truth: `.agents/skills/{slug}/`. Claude Code loads them via
`.claude/skills/{slug}` relative symlinks.

| Skill | Use for |
| --- | --- |
| [cv-entry-writer](cv-entry-writer/SKILL.md) | Writing/revising CV project entries — narrative + separated impact, 개조식 voice. Targets `src/data/cv.ts`. |
| [interpretive-generative-visuals](interpretive-generative-visuals/SKILL.md) | Turning a word/concept into a mathematical generative visual grammar (Three.js/WebGL). |
| [skill-manager](skill-manager/SKILL.md) | Creating, updating, reviewing, validating project skills. |
