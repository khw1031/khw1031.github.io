# Skill Lifecycle

## Create

1. Capture the user goal and target slug.
2. Check whether an existing skill already covers the behavior.
3. Read local rules and relevant raw/provider references.
4. Write `SKILL.md` first with lean routing and safety guidance.
5. Add references only for details that should not stay in the body.
6. Add scripts when the workflow is fragile, repetitive, or worth deterministic validation.
7. Register index and symlink.
8. Run validation.

## Modify

1. Identify the existing skill directory.
2. Read the current `SKILL.md` and only referenced files needed for the change.
3. Preserve the skill's public trigger behavior unless the user asked to change it.
4. Keep edits minimal.
5. Re-run validation and affected scripts.

## Review

Use this scoring shape when a review is useful:

| Category | Weight | Check |
|---|---:|---|
| Loader compatibility | 25 | frontmatter, name, description, directory match |
| Routing precision | 20 | when-to-use clarity and should-not-use boundary |
| Progressive disclosure | 20 | lean body, targeted references, no bulk duplication |
| Tool reliability | 20 | scripts, stdout defaults, explicit file writes, offline eval |
| Repo fit | 15 | local AGENTS rules, index, symlink, no secrets |

Pass if there are no critical issues and score is at least 70.

Critical issues:

- missing or invalid frontmatter
- unclear trigger description
- wrong canonical path
- unsafe write or auth boundary
- missing symlink/index for completed project skill

## Test

Minimum deterministic test:

```bash
./scripts/validate-skill ../target-skill
```

Recommended closeout:

```bash
../target-skill/scripts/eval
```

when the target skill provides an eval script.

## Delete

1. Confirm the user explicitly wants deletion.
2. Search for references to the skill slug.
3. Remove `.claude/skills/{skill-slug}` symlink.
4. Remove `.agents/skills/{skill-slug}`.
5. Update `.agents/skills/index.md`.
6. Run validation on affected indexes and routes.
