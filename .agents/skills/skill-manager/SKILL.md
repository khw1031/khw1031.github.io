---
name: skill-manager
description: >
  Creates, updates, reviews, and tests project agent skills under .agents/skills with .claude symlink compatibility. Use when the user asks to write or improve SKILL.md, create a reusable skill, validate skill structure, restructure skill-manager, or prepare workflow skills such as git-stash-pull. 스킬 생성, 수정, 리뷰, 검증, SKILL.md 작성 요청에 사용.
compatibility: Project source .agents/skills; Claude Code compatibility through .claude/skills relative symlink.
repo-operating-targets: .agents/skills, .claude/skills, .codex/skills, AGENTS.md
argument-hint: "[create | update | review | test <skill>]"
---

# Skill Manager

## When to use

Use this skill when the user asks to create, update, review, test, delete, or restructure a project agent skill.

Typical triggers:

- "스킬 만들어줘", "스킬 수정", "SKILL.md 작성", "skill review"
- creating a workflow skill such as `git-stash-pull`
- checking whether a skill belongs under `.agents/skills/`
- validating frontmatter, references, scripts, index entry, or `.claude` symlink

## Boundary

- project skill 원본은 `.agents/skills/{skill-slug}/`에 둔다.
- `.claude/skills/{skill-slug}`는 `../../.agents/skills/{skill-slug}` relative symlink only.
- Do not write project skill originals under `.codex/skills`, `.claude/skills`, or another harness/domain-specific path unless the user explicitly asks for that external domain.
- Follow root `AGENTS.md`, `.agents/skills/AGENTS.md`, and target subtree rules before writing.
- Do not store secrets, browser cookies, tokens, or private API keys in a skill.

## Workflow

1. **Route** - Classify as `agent_skill.project_skill` and confirm the target slug.
2. **Inspect** - Read `.agents/skills/AGENTS.md`, `.agents/skills/index.md`, existing target skill files, and only the needed references.
3. **Research** - For provider or standard claims, use existing raw sources first. For current provider behavior, verify official docs before changing policy.
4. **Author** - Keep `SKILL.md` lean. Put local policy in [local-policy.md](references/local-policy.md), provider principles in [provider-principles.md](references/provider-principles.md), and detailed lifecycle notes in [lifecycle.md](references/lifecycle.md). Alongside the success path, write a **failure spec** (false-success / out-of-scope / insufficient-evidence signals plus the action for each) and observable **termination conditions** (success / abstain / escalate) — LLMs default to no abstention output, so the wrong-answer space must be written into the skill's context explicitly.
5. **Align behavior** - When changing executable behavior, update the CLI, `SKILL.md`, relevant references, and the target skill's eval in the same work.
6. **Validate** - Run `scripts/validate-skill` on the target skill and run the target skill's `scripts/eval` when present.
7. **Register** - Update `.agents/skills/index.md` and create or refresh the `.claude/skills/{skill-slug}` symlink.
8. **Close out** - Report changed files, validation result, and any follow-up proposal.

## Review Gates

Treat these as hard blockers before declaring a skill complete:

- `SKILL.md` has valid YAML frontmatter with `name` and `description`.
- `name` is lowercase kebab-case, at most 64 chars, and matches the directory basename.
- `description` says when to load the skill, not only what it is.
- `SKILL.md` stays under 500 lines and links to references instead of embedding long policy.
- Portability: the skill is self-contained. Required behavior must not depend on reading repository documents or repository paths outside the skill directory — internalize needed policy into `SKILL.md` or `references/`. Repo paths may appear only as (a) optional provenance the skill works without, or (b) the skill's explicit operating target. Generic conventions (e.g. reading a target directory's local rules before writing) stay conditional: "if present". `scripts/validate-skill` lints unconditional repo-path tokens in the `SKILL.md` body; declare intentional case (b) targets in frontmatter `repo-operating-targets` (comma-separated prefixes), and phrase case (a) lines as conditional/optional/boundary.
- Relative links in `SKILL.md` resolve from the skill directory.
- CLI behavior defaults to stdout; file writes require explicit options.
- Behavior-changing CLI edits update matching `SKILL.md`, references, and eval coverage before closeout.
- `.claude/skills/{skill-slug}` points to the `.agents/skills/{skill-slug}` source.
- `SKILL.md` declares a failure spec (including false-success signals) and observable termination conditions (success / abstain / escalate). A skill with only a success path is incomplete.

## Commands

Run from this skill directory:

```bash
./scripts/validate-skill ../skill-manager
./scripts/eval
```

Validate another project skill:

```bash
./scripts/validate-skill ../threads-fetch
```

## Optional Independent Checks

When the environment supports subagents, use [reviewer.md](agents/reviewer.md) for an independent quality pass and [smoke-tester.md](agents/smoke-tester.md) for prompt-level smoke tests. These checks are advisory; the main agent keeps final write-safety and repository routing responsibility.
