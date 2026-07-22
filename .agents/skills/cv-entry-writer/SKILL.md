---
name: cv-entry-writer
description: >
  Write and revise CV/résumé project entries in a consistent Korean résumé voice —
  flowing narrative + separated impact, with an optional leading Why. Use when adding
  a project or experience to the CV, rewriting an entry, tightening wording, removing
  redundant dates, or converting segmented What/How/Impact bullets into narrative flow.
  CV 항목 작성·수정, 이력서 문체(개조식) 정리, 프로젝트 추가 시 사용.
compatibility: Project source .agents/skills; Claude Code via .claude/skills relative symlink.
repo-operating-targets: src/data/cv.ts, src/data/side-projects.ts
argument-hint: "[추가·수정할 CV 항목|프로젝트 (+ 요청사항)]"
---

# CV Entry Writer

Write CV project/experience entries as **narrative + separated impact**, in Korean
개조식 voice. Do not split content into visible What/How/Impact labels — dissolve
them into flowing prose, and keep only the quantified outcomes in a separate `impact`.

## When to use

- Adding a new project/experience entry to the CV
- Rewriting an entry (tighten, restructure, fix voice, remove date redundancy)
- Converting bullet-y What/How/Impact into one narrative flow
- Unifying 문체 across existing entries

## Entry model

Every entry has four parts. Only the first two are required.

1. **Why** (optional, 1 sentence, first): the problem or context — *why this work
   mattered*. Fold it into the opening of the narrative; never as a separate label.
   Strongest for lead/senior entries. Omit if unknown — never invent it.
2. **Narrative** (`content`): what was built and how, woven into flowing prose lines.
   No `What`/`How` headings. Order: Why → what → how → stack.
3. **Impact** (`impact`): concrete, quantified outcomes only. Separate block.
4. **References** (`references`, optional): related links (post, store, repo, demo).

## Voice — 개조식 (명사형 종결)

Korean résumé standard. See [references/frameworks.md](references/frameworks.md) for
the framework menu (STAR / CAR / XYZ) behind this model.

- End phrases with a noun/nominalization: 개발 · 구축 · 운영 · 확보 · 단축 · 전환.
- Drop the subject and sentence endings (`-했다` / `-합니다` / `-함`).
- Put numbers up front in impact.
- ✗ "…웹뷰를 Claude Code 기반으로 개발했다" → ✓ "Claude Code 기반 AI 워크플로우로 웹뷰 개발 (3인 팀)".

## Hard rules

- **Remove redundant dates** from prose. The entry already shows `period` in its own
  column, so do not repeat "2026.02~2026.03 기간 동안 …".
- **No labels in prose.** Do not write "What:", "How:", "Impact:", "개요", "성과" as
  headings inside the narrative.
- **Impact = numbers, separated.** Keep metrics (%, counts, LOC, tickets, ratios) in
  `impact`, not mixed into the narrative.
- **Never fabricate.** Metrics, dates, team size, tool names, and the Why must come
  from the user or existing data. If a fact is missing, leave a placeholder and ask.

## Data format (operating target: `src/data/cv.ts`)

Full schema, worked example, and side-project notes: [references/cv-data-format.md](references/cv-data-format.md).

Shape (per project detail):

```ts
{
  title: '한샘 인테리어 플래너',
  period: '2026.02 — 2026.03',   // shown separately; keep out of prose
  role: 'FE 리드',
  url: '/posts/…/',              // optional: links the title
  content: [{ kind: 'prose', description: ['<why→what→how lines>'] }],
  impact: ['<quantified outcome>', '…'],
  references: [{ label: 'App Store', url: 'https://…' }],  // optional
}
```

## Failure spec

- **False success**: entry still contains `-했다`/`-합니다` endings, a repeated date,
  a visible What/How/Impact label, or metrics buried in the narrative → not done.
- **Out of scope**: page layout/CSS, link colors, section ordering → this is content
  authoring only; defer styling to the component/DESIGN work.
- **Insufficient evidence**: a metric, date, team size, or Why is not supplied and not
  already in the data → do NOT invent it. Insert a clearly marked placeholder (e.g.
  `'<Why: 풀려던 문제 한 줄>'`) and ask the user for it.

## Termination

- **Success**: entry is narrative + separated impact, 개조식, no repeated date, no
  fabricated facts; `pnpm astro check` and `pnpm vitest run tests/document-data.test.ts`
  pass.
- **Abstain**: required fact missing → write placeholder, list what's needed, stop.
- **Escalate**: the change needs a schema field that does not exist (e.g. a new
  structured field) → propose the schema change before writing data.
