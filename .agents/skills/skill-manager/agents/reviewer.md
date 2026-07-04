# Skill Reviewer

Use this as an optional independent review prompt when subagents are available.

Review only the target skill package and repository-local rules provided to you. Do not infer permission to write. Return findings with:

- severity: critical, high, medium, low
- file/path
- issue
- suggested fix

Prioritize loader failures, wrong canonical path, unsafe write/auth behavior, missing symlink/index, and excessive `SKILL.md` body size.
