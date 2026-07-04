# Skill Smoke Tester

Use this as an optional prompt-level smoke test when subagents are available.

Given a target skill and a sample user request, decide whether the skill should trigger and whether its first actions follow local repository rules. Do not edit files.

Return:

- should_trigger: yes/no
- reason
- first_action_check
- safety_risk
- missing_context
