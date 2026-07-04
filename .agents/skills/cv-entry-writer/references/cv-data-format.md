# CV data format

Operating targets: `src/data/cv.ts` (main experience/projects) and
`src/data/side-projects.ts` (side projects). Schema: `src/data/types.ts` →
`detailSchema`. Rendering: `src/components/document/Detail.astro`. Markdown export:
`src/lib/serialize.ts`.

## Detail fields used for an entry

```ts
{
  title: string,            // project name; links out if `url` is set
  period?: string,          // e.g. '2026.02 — 2026.03' — shown in its own column
  role?: string,            // e.g. 'FE 리드' (main projects) / 'Open Source / Go TUI' (side)
  url?: string,             // optional internal (/posts/…/) or external link on the title
  subtitle?: string,        // optional one-line tagline (side projects)
  content: DetailContent[], // the narrative (see below)
  impact: string[],         // quantified outcomes, rendered as a separate block
  references?: { label: string, url: string }[],  // optional related links
}
```

`DetailContent`: `{ title?, kind?: 'prose' | 'list', description: string[] }`.
Titles are NOT rendered on the CV page (labels are hidden), so leave them out for
project narratives. `kind` only affects markdown export (`list` → `- ` bullets).

## Worked example (narrative + impact)

```ts
{
  title: '한샘 인테리어 플래너',
  period: '2026.02 — 2026.03',
  role: 'FE 리드',
  url: '/posts/hanssem-interior-planner/',
  content: [
    {
      kind: 'prose',
      description: [
        // Optional Why goes first, folded in (omit if unknown — do not invent):
        // '<디자인→개발 리드타임 단축이 목표>',
        'Claude Code 기반 AI 워크플로우로 한샘 인테리어 플래너 웹뷰 개발 (3인 팀)',
        '요구사항 분석 → 설계 → 태스크 분해 → 구현 → 리뷰 & QA의 5단계 품질 파이프라인 운영',
        '33개 커스텀 Claude Skills로 반복 작업 자동화, Figma MCP + AI Rules로 디자인-코드 정밀도 확보',
        'React + TypeScript + Tailwind CSS, Jest 기반 TDD',
      ],
    },
  ],
  impact: [
    '예상 2~3개월을 21일로 단축, 약 62% 일정 절감',
    '53개 태스크·265+ 산출물, 소스 19,127줄·테스트 15,227줄, 125 Jira 티켓, AI 협업 비율 86.8%',
  ],
  references: [
    { label: 'App Store', url: 'https://apps.apple.com/…' },
    { label: 'Google Play', url: 'https://play.google.com/…' },
  ],
}
```

## Notes

- **Section placement**: main entries under the `주요 프로젝트` section in `cv.ts`;
  side projects in `side-projects.ts` (role is a category like `Open Source / Go TUI`,
  no `impact` required). Career/education entries are dense one-liners (no `content`).
- **Period source**: for side projects, first-commit date is a reasonable `period`.
- **Verify after editing**: `pnpm astro check` and
  `pnpm vitest run tests/document-data.test.ts` (a test asserts each 주요 프로젝트 has
  narrative `content` and non-empty `impact`).
