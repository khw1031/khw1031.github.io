# Local Skill Policy

## 원본은 한 곳에 둔다

Project skill 원본은 `.agents/skills/{skill-slug}/` 하나다. 다른 harness는 symlink로 이 원본을 본다.

Required paths:

- source: `.agents/skills/{skill-slug}/SKILL.md`
- scripts: `.agents/skills/{skill-slug}/scripts/`
- references: `.agents/skills/{skill-slug}/references/`
- Claude compatibility: `.claude/skills/{skill-slug} -> ../../.agents/skills/{skill-slug}`

Do not create project-skill originals in:

- `.codex/skills/*`
- `.claude/skills/*`
- another provider cache, plugin cache, or personal/global domain

Exception: if the user explicitly requests a personal/global/provider-specific skill outside this repo, read that domain's rules first and do not treat it as this repo's project skill.

## 쓰기는 라우팅 이후에 한다

Before writing:

1. Classify the request as `agent_skill.project_skill`.
2. Read root `AGENTS.md`.
3. Read `.agents/skills/AGENTS.md`.
4. If touching evals, routes, queues, or raw sources, read that target's local `AGENTS.md`.
5. Propose first when the change affects route behavior, safety boundary, or shared instruction artifacts.

## Skill package contract

Minimal package:

```text
.agents/skills/{skill-slug}/
  SKILL.md
```

Recommended package:

```text
.agents/skills/{skill-slug}/
  SKILL.md
  references/
  scripts/
  agents/
```

Do not add README, changelog, install guide, or broad narrative docs unless the user explicitly asks. Put runtime guidance in `SKILL.md`; put heavy details in `references/`; put deterministic checks in `scripts/`.

## Validation closeout

A complete project-skill change should report:

- skill path
- symlink path and target
- index update
- validation command and result
- remaining risk or follow-up proposal
