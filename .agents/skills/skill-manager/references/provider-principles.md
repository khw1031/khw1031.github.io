# Provider and Standard Principles

## 핵심 원칙은 간판, 본문, 창고로 나뉜다

Provider docs and the Agent Skills open standard converge on progressive disclosure:

- discovery metadata: `name` and `description`
- activation body: concise `SKILL.md`
- execution resources: `references/`, `scripts/`, `assets/`, optional `agents/`

The description should let the runtime decide when to load the skill. The body should handle the common path. References and scripts should carry heavy detail and deterministic work.

## Raw source anchors

Use these captured raw sources as the local evidence set. Do not copy their body into a skill; cite the path and extract only the needed principle.

- `raw/sources/cortex-skill-manager-local-skill-20260605.md`
- `raw/sources/openai-codex-agent-skills-20260605.md`
- `raw/sources/openai-codex-skill-creator-20260605.md`
- `raw/sources/anthropic-agent-skills-overview-20260605.md`
- `raw/sources/claude-code-skills-20260605.md`
- `raw/sources/agent-skills-open-standard-20260605.md`
- `raw/sources/agent-skills-client-implementation-20260605.md`
- `raw/sources/github-copilot-agent-skills-20260605.md`
- `raw/sources/vercel-ai-sdk-agent-workflows-20260605.md`
- `raw/sources/vercel-skills-ecosystem-20260605.md`
- `raw/sources/google-gemini-prompt-and-function-calling-20260605.md`
- `raw/sources/microsoft-foundry-prompt-engineering-20260605.md`

## Common application points

- Keep frontmatter portable: required `name`, required `description`, valid YAML.
- Keep `name` lowercase kebab-case, at most 64 chars, and matching the directory when possible.
- Put provider-specific UI or runtime adapter metadata outside the portable core unless the repo's local rules require it.
- Use deterministic scripts for fragile repeated checks.
- Prefer official docs or primary specs when provider behavior may have changed.
- Do not store secrets in a skill.
- Separate raw evidence from derived analysis. Raw source records remain in `raw/sources/`; skill references may point to them.
