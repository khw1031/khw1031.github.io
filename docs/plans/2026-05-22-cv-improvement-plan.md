# CV Improvement Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** `pies/agents/company`의 최신 한샘 AI 워크플로우 성과를 반영해 `khw1031.github.io`의 `/cv/`와 `/portfolio/`가 “프론트엔드 기반 AI/Developer Productivity 리드” 포지션을 더 선명하게 전달하도록 개선한다.

**Architecture:** 현재 사이트는 Astro + TypeScript 데이터 파일(`src/data/*.ts`)을 `DocumentLayout`으로 렌더링한다. 개선은 우선 데이터 레이어(`cv.ts`, `portfolio.ts`, 필요 시 `cover-letter.ts`)의 문장·구조를 정리하고, 현재 컴포넌트 스키마를 유지해 최소 변경으로 반영한다.

**Tech Stack:** Astro, TypeScript, Zod schema, Vitest, Playwright, Biome, pnpm.

---

## 1. 현재 이력서 평가

### 강점

- **최근 방향성이 좋다:** 한샘 섹션의 상단에 Swagger MCP, Agentic Coding Workflow, Figma MCP, 성능 개선이 배치되어 있어 “AI 도구 + 프론트엔드 생산성” 방향은 잘 보인다.
- **정량 성과 일부가 이미 있다:** 한샘몰 성능 개선의 번들 40% 감소, script 실행시간 22% 감소, 한화생명 CMS의 리드타임 40% 단축 등은 채용자가 빠르게 이해할 수 있는 강한 근거다.
- **별도 상세 페이지 구조가 있다:** `/cv/` → `/portfolio/` → `/cover-letter/`로 이어지는 구조가 있어, 이력서는 압축하고 상세 근거는 포트폴리오로 넘기기 좋다.
- **사이드 프로젝트가 포지셔닝을 보강한다:** `@hynu/swagger-mcp`, `add-ai-tools`, `ai-library`가 본업 성과와 연결되어 “업무에서 만든 도구를 제품화/오픈소스화하는 사람”이라는 인상을 줄 수 있다.

### 약점

- **첫 화면에 요약/핵심 역량이 없다:** 현재 `/cv/`는 바로 경력 사항으로 시작한다. 채용자는 10초 안에 “이 사람이 어떤 문제를 해결하는 사람인가”를 잡기 어렵다.
- **2026년 회사 기록의 강한 성과가 아직 CV에 덜 반영됐다:** `PRJ-2026-005`, `PRJ-2026-006`, `PRJ-2026-009`, `ACH-2026-001~003`에는 37개 라이브러리 항목, 21일 완료, 62% 일정 단축, 86.8% AI 협업 비율, 53개 태스크, 265+ 산출물, 125 Jira 티켓, 테스트:소스 0.80 같은 강한 수치가 있는데, 현재 `/cv/`에는 일부만 간접 반영되어 있다.
- **프로젝트 제목과 기간이 최신 기록과 불일치한다:** 현재 `cv.ts`에는 2025.12 중심의 “팀 기반 Agentic Coding Workflow 구축”으로 보이지만, 회사 기록에는 2026.02~2026.03 Feature Workflow Skill 표준화와 2026.01~ AI Toolkit 구축이 별도 성과로 정리되어 있다.
- **STAR 구조가 약하다:** 많은 bullet이 “무엇을 했다”에 머물고, 문제 상황(Situation), 맡은 역할(Task/Role), 구체 행동(Action), 결과(Result)가 한 문장 안에 연결되지 않는다.
- **이직사유가 노출 우선순위에 비해 강하다:** 모든 회사 카드에 `※ 이직사유`가 바로 노출되어 경력의 강점보다 이동 맥락이 먼저 보일 수 있다. 필요하면 면접에서 설명하면 되고, 공개 CV에서는 접거나 제거하는 편이 안전하다.
- **기술 스택이 평면적이다:** 키워드가 나열되어 있지만 “AI Workflow / Frontend Platform / Performance / Product Engineering” 같은 역량 축으로 묶이지 않는다.
- **초기 커리어와 학점 정보가 길게 보인다:** 10년차 이상 개발자 CV에서 낮은 학점·중퇴/자퇴 사유는 강점을 만들기 어렵다. 교육은 압축하고 경력/성과에 공간을 줘야 한다.

## 2. 개선 방향

### 포지셔닝 문장

현재 타이틀 `Frontend Based Product Developer`는 넓고 무난하지만, 최신 경력의 차별점은 더 구체적이다.

추천 포지션:

> **Frontend-based AI Workflow & Developer Productivity Lead**

한국어 요약:

> 프론트엔드 제품 개발을 기반으로, AI 에이전트·MCP·사내 개발 워크플로우를 제품화해 팀의 구현 속도와 품질을 높이는 개발자.

### 핵심 메시지 3개

1. **AI 개발 워크플로우 표준화:** Requirements → Design → Task → Implementation → Review 5단계로 기능 구현 절차를 표준화하고, 4종 AI 에이전트에서 재사용 가능한 팀 자산으로 전환.
2. **Developer Productivity 제품화:** Hanssem AI Toolkit으로 Skills/Rules/Agents 라이브러리, `install-ai` CLI, 검색형 Web UI를 묶어 37개 항목을 배포 가능한 사내 도구로 운영.
3. **검증된 프론트엔드 실행력:** 인테리어 플래너 프로젝트에서 3인 팀으로 21일 완료, 62% 일정 단축, 86.8% AI 협업 비율, 테스트:소스 0.80 달성.

## 3. 반영할 회사 기록 매핑

| 출처 | 반영 위치 | 핵심 반영 내용 |
|---|---|---|
| `records/projects/PRJ-2026-005-hanssem-ai-toolkit.md` | `src/data/cv.ts`, `src/data/portfolio.ts` | AI Toolkit / Frontend AI Library 구축, 37개 항목, v2.18.0 운영, 멀티 에이전트 지원 |
| `records/projects/PRJ-2026-006-interior-planner-ai.md` | `src/data/cv.ts`, `src/data/portfolio.ts` | 21일 완료, 62% 일정 단축, 86.8% AI 협업, 53개 태스크, 265+ 산출물, 125 Jira 티켓 |
| `records/projects/PRJ-2026-009-feature-workflow-skill.md` | `src/data/cv.ts`, `src/data/portfolio.ts`, 필요 시 `src/data/cover-letter.ts` | 5단계 워크플로우, Context Isolation, Human in the Loop, Document as Interface, Git as History |
| `records/achievements/ACH-2026-001.json` | `src/data/cv.ts`의 한샘 대표 성과 bullet | 검증 수치: 일정 단축, AI 협업 비율, 테스트 코드 규모 |
| `records/achievements/ACH-2026-002.json` | `src/data/cv.ts`와 portfolio 상세 | 37개 라이브러리 항목, CLI/Web UI 제품화 |
| `records/achievements/ACH-2026-003.json` | `src/data/cv.ts`와 portfolio 상세 | Feature Workflow Skill 표준화, 4종 에이전트 호환, v1.1.0 |

## 4. 구현 태스크

### Task 1: CV 상단 요약 섹션 추가

**Objective:** `/cv/` 첫 화면에서 채용자가 포지셔닝과 핵심 성과를 10초 안에 이해하게 한다.

**Files:**
- Modify: `src/data/cv.ts`
- Test: `tests/document-data.test.ts`

**Step 1: 데이터 구조 확인**

현재 `documentPageSchema`는 `sections` 배열만 사용하므로, 별도 컴포넌트 변경 없이 `sections`의 첫 번째에 `요약` 섹션을 추가한다.

**Step 2: 테스트 추가**

`tests/document-data.test.ts`의 `describe('cv data')`에 다음 기대를 추가한다.

```ts
it('starts with a summary section before career details', () => {
  expect(cv.sections[0]?.title).toBe('요약');
  expect(cv.sections[1]?.title).toBe('경력 사항');
});
```

기존 테스트 `includes the 경력 사항 section as the first block`은 `includes the 경력 사항 section after summary`로 수정한다.

**Step 3: `src/data/cv.ts`에 요약 섹션 추가**

`sections`의 첫 번째 항목으로 아래 구조를 추가한다.

```ts
{
  title: '요약',
  details: [
    {
      title: 'Frontend-based AI Workflow & Developer Productivity Lead',
      subtitle:
        '프론트엔드 제품 개발을 기반으로 AI 에이전트·MCP·사내 개발 워크플로우를 제품화해 팀의 구현 속도와 품질을 높이는 개발자',
      content: [
        {
          title: '핵심 성과',
          description: [
            '인테리어 플래너 프로젝트에서 3인 팀·21일 개발로 기존 예상 대비 62% 일정 단축, AI 협업 비율 86.8%, 테스트:소스 비율 0.80 달성',
            'Hanssem AI Toolkit / Frontend AI Library를 설계·구축해 37개 Skills/Rules/Agents 항목을 검색·설치 가능한 사내 도구 자산으로 전환',
            'Requirements → Design → Task → Implementation → Review 5단계 Feature Workflow Skill을 설계해 Claude Code, Cursor, GitHub Copilot, Antigravity 4종 에이전트에서 동일 절차로 사용 가능하게 표준화',
          ],
        },
      ],
    },
  ],
},
```

**Step 4: 검증**

Run:

```bash
pnpm test tests/document-data.test.ts
```

Expected: PASS.

### Task 2: 한샘 경력 상단 3개 성과 재구성

**Objective:** 최신 회사 기록의 강한 성과를 CV의 가장 중요한 영역에 반영한다.

**Files:**
- Modify: `src/data/cv.ts`
- Test: `tests/document-data.test.ts`

**Step 1: 현재 한샘 content의 상단 항목 교체/재정렬**

`(주)한샘`의 `content` 앞부분을 다음 순서로 정리한다.

1. `Feature Workflow Skill 설계 및 사내 표준화`
2. `Hanssem AI Toolkit / Frontend AI Library 구축`
3. `인테리어 플래너 AI 활용 개발`
4. `한샘 Swagger MCP Server 개발 및 도입`
5. 기존 Figma MCP, Memory Leak/OOM, 성능 개선 등

**Step 2: 추천 문안**

```ts
{
  title: 'Feature Workflow Skill 설계 및 사내 표준화',
  description: [
    '기능 구현을 Requirements → Design → Task → Implementation → Review 5단계로 표준화하는 AI 워크플로우 설계',
    'Context Isolation, Human in the Loop, Document as Interface, Git as History 원칙을 적용해 긴 작업의 재개 가능성과 결과 재현성 확보',
    'Claude Code, Cursor, GitHub Copilot, Antigravity 4종 에이전트에서 동일 절차로 사용 가능한 사내 공통 Skill(v1.1.0)로 등록',
  ],
},
{
  title: 'Hanssem AI Toolkit / Frontend AI Library 구축',
  description: [
    'Skills/Rules/Agents 라이브러리, install-ai CLI, 검색형 Web UI를 설계·구축해 사내 AI 도구를 제품화',
    '37개 문서화된 라이브러리 항목을 검색·설치 가능하게 구성하고 v2.18.0까지 릴리즈 운영',
    'Claude Code, Cursor, GitHub Copilot, Antigravity별 설치 경로를 지원해 팀 지식을 멀티 에이전트 환경에서 재사용 가능하게 전환',
  ],
},
{
  title: '인테리어 플래너 AI 활용 개발',
  description: [
    '3인 팀에서 Claude Code 기반 5단계 AI 워크플로우를 적용해 기존 예상 2~3개월 규모의 프론트엔드 개발을 21일에 완료',
    '53개 태스크, 265+ 작업 산출물, 125 Jira 티켓, 약 410 커밋을 처리하며 62% 일정 단축과 AI 협업 비율 86.8% 달성',
    'React, TypeScript, Tailwind CSS, Jest 기반 TDD로 소스 19,127줄·테스트 15,227줄, 테스트:소스 비율 0.80 확보',
  ],
},
```

**Step 3: 중복 제거**

기존 `팀 기반 Agentic Coding Workflow 구축 리드`는 위 `Feature Workflow Skill`과 내용이 겹치므로 제거하거나 제목을 새 항목으로 대체한다.

**Step 4: 검증**

Run:

```bash
pnpm test tests/document-data.test.ts
```

Expected: PASS.

### Task 3: Portfolio 상세 페이지를 STAR 구조로 보강

**Objective:** `/cv/`는 압축하고 `/portfolio/`에서 상세 근거를 제공한다.

**Files:**
- Modify: `src/data/portfolio.ts`
- Test: `tests/document-data.test.ts`, `e2e/document-pages.spec.ts`

**Step 1: 주요 프로젝트 앞부분 재정렬**

`src/data/portfolio.ts`의 `주요 프로젝트`를 다음 순서로 둔다.

1. 인테리어 플래너 AI 활용 개발
2. Feature Workflow Skill 설계 및 사내 표준화
3. Hanssem AI Toolkit / Frontend AI Library 구축
4. 한샘 Swagger MCP Server 개발
5. Figma MCP Server 도입
6. 스토어웹 Memory Leak/OOM
7. 한샘몰 모바일 웹 성능 개선

**Step 2: 각 프로젝트는 같은 하위 제목을 사용**

각 `content` 항목은 가능하면 아래 4개 블록을 사용한다.

- `문제`
- `역할`
- `접근`
- `성과`

**Step 3: 테스트 추가**

`tests/document-data.test.ts`의 portfolio describe에 다음을 추가한다.

```ts
it('highlights AI workflow projects before legacy projects', () => {
  const projects = portfolio.sections[0]?.details.map((d) => d.title) ?? [];
  expect(projects.slice(0, 3)).toEqual([
    '인테리어 플래너 AI 활용 개발',
    'Feature Workflow Skill 설계 및 사내 표준화',
    'Hanssem AI Toolkit / Frontend AI Library 구축',
  ]);
});
```

**Step 4: 검증**

Run:

```bash
pnpm test tests/document-data.test.ts
pnpm test:e2e e2e/document-pages.spec.ts
```

Expected: PASS.

### Task 4: 공개 CV에서 이직사유와 교육 정보를 압축

**Objective:** 강점보다 방어적 정보가 먼저 보이지 않게 한다.

**Files:**
- Modify: `src/data/cv.ts`
- Optional Modify: `src/components/document/Detail.astro` only if hiding `ect` via UI flag is preferred
- Test: `tests/document-data.test.ts`, `e2e/document-pages.spec.ts`

**Step 1: 이직사유 처리 방식 선택**

권장안: 공개 CV에서는 `ect`를 제거한다. 면접용 별도 문서가 필요하면 나중에 `privateCv`나 PDF 버전으로 분리한다.

대안: `Detail.astro`에 `ect`를 접는 UI를 추가할 수 있지만, 현재 사이트 미니멀 구조에서는 YAGNI일 가능성이 크다.

**Step 2: 교육 정보 압축**

`교육 사항`은 다음 정도로 압축한다.

- 패스트캠퍼스 프론트엔드 부트캠프, 2017 수료
- Udacity Nano Degree, Intro to Programming, 2016 수료
- 성균관대학교 경영학과, 2014 졸업
- 홍익대학교 예술학과, 중퇴

학점과 `자퇴 후 재입학`, `제대 후 자퇴`는 삭제 권장.

**Step 3: 테스트 추가**

```ts
it('does not expose career move reasons in public cv data', () => {
  const careers = cv.sections.find((s) => s.title === '경력 사항');
  for (const d of careers?.details ?? []) {
    expect(d.ect).toBeUndefined();
  }
});
```

**Step 4: 검증**

Run:

```bash
pnpm test tests/document-data.test.ts
pnpm test:e2e e2e/document-pages.spec.ts
```

Expected: PASS.

### Task 5: 기술 스택을 역량 축으로 재정렬

**Objective:** 단순 키워드 나열이 아니라 현재 포지셔닝을 강화한다.

**Files:**
- Modify: `src/data/cv.ts`
- Optional Modify: `src/data/types.ts`, `src/components/document/Keywords.astro` if grouped keyword rendering is needed
- Test: `tests/document-data.test.ts`

**Step 1: 최소 변경안**

현재 `keywords: string[]` 구조를 유지하고 순서만 바꾼다.

추천 순서:

```ts
keywords: [
  'AI Workflow',
  'MCP',
  'Claude Code',
  'Cursor',
  'GitHub Copilot',
  'Developer Productivity',
  'Frontend Platform',
  'React',
  'NextJS',
  'TypeScript',
  'React Query',
  'Tailwind CSS',
  'Vite',
  'Vitest',
  'Jest',
  'Turborepo',
  'Rollup',
  'CI/CD',
  'GitHub Actions',
  'Jenkins',
  'Performance Optimization',
  'Core Web Vitals',
]
```

**Step 2: 확장안은 후순위**

키워드를 그룹 렌더링하려면 스키마를 `string[] | KeywordGroup[]` 형태로 넓혀야 한다. 지금은 CV 문장 개선이 우선이므로 별도 후속 작업으로 둔다.

**Step 3: 검증**

Run:

```bash
pnpm test tests/document-data.test.ts
```

Expected: PASS.

### Task 6: Markdown copy와 실제 페이지 수동 확인

**Objective:** 채용자가 복사하거나 공유할 때도 문맥이 잘 전달되는지 확인한다.

**Files:**
- No code changes unless defects are found

**Step 1: 전체 검증 실행**

Run:

```bash
pnpm check
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

Expected: all PASS.

**Step 2: 로컬 미리보기**

Run:

```bash
pnpm dev
```

Open:

- `http://localhost:4321/cv/`
- `http://localhost:4321/cv.md`
- `http://localhost:4321/portfolio/`
- `http://localhost:4321/portfolio.md`

**Step 3: 수동 검토 체크리스트**

- `/cv/` 첫 화면에서 “AI Workflow / Developer Productivity / Frontend”가 바로 보이는가?
- 한샘 상위 3개 성과가 수치와 함께 보이는가?
- `/portfolio/`가 상세 근거를 제공하고 `/cv/`와 중복이 과하지 않은가?
- 공개 페이지에 불필요하게 방어적인 이직사유/학점 정보가 보이지 않는가?
- `copy markdown` 결과가 이력서 제출용 텍스트로 자연스러운가?

## 5. 예상 변경 파일 요약

- `src/data/cv.ts`: 핵심 변경. 요약 섹션 추가, 한샘 성과 재작성, 교육/이직사유 압축, keywords 재정렬.
- `src/data/portfolio.ts`: 최신 AI 워크플로우 프로젝트 상세 보강 및 순서 재정렬.
- `tests/document-data.test.ts`: CV/portfolio 구조 회귀 테스트 추가 및 기존 “경력 사항 첫 블록” 기대값 수정.
- `e2e/document-pages.spec.ts`: 필요 시 `/cv/` 섹션 기대값에 `요약` 추가.
- `src/data/cover-letter.ts`: 선택 사항. 자기소개까지 포지셔닝을 맞추고 싶을 때 후속으로 수정.

## 6. 리스크와 주의점

- **내부 정보 노출:** 사내 URL, Bitbucket repo, Confluence URL 등은 공개 CV에 그대로 넣지 않는다. 공개 가능한 성과 수치와 개념 중심으로 표현한다.
- **성과 과장:** 62% 일정 단축, 86.8% AI 협업 비율 등은 `pies/agents/company` 기록에 있는 수치만 사용한다.
- **연도 불일치:** 현재 공개 페이지의 2025.12 항목과 회사 기록의 2026.01~03 항목이 섞여 있다. 구현 전 실제 공개 가능한 기간 표기를 사용자가 최종 확인해야 한다.
- **너무 AI 일변도:** 프론트엔드 실행력도 함께 보여야 한다. `인테리어 플래너`, 성능 개선, OOM 해결, 인프런/텀블벅 마이그레이션을 남겨 균형을 맞춘다.

## 7. 완료 기준

- `/cv/`에 요약 섹션이 추가되고, 한샘 최신 AI 워크플로우 성과 3개가 상단에 정량 수치와 함께 반영된다.
- `/portfolio/`가 CV의 상세 근거 페이지로 동작하며, 최신 프로젝트가 상단에 정렬된다.
- 공개 CV에서 이직사유와 낮은 우선순위 교육 세부정보가 제거/압축된다.
- `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build`가 통과한다.
