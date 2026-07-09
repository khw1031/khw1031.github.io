---
title: Meta Astryx — 코드 기반 Agent-Ready 디자인 시스템
pubDate: '2026-07-08'
description: 컴포넌트당 문서 파일 하나에서 CLI·문서사이트·MCP를 동시에 파생시켜 사람과 AI 에이전트가 같은 참조를 읽게 만든 Meta의 오픈소스 디자인 시스템
summary: "Meta가 2026-06-18 공개한 Astryx는 사내 8년(코드명 XDS, 13,000+ 앱)을 거친 디자인 시스템으로, StyleX 위에 컴포넌트·테마·CLI를 얹되 소비자는 StyleX를 몰라도 되게 분리했다. 핵심은 컴포넌트마다 하나뿐인 `.doc.mjs` 문서 파일이 CLI·문서 사이트·MCP 서버(search/get 두 도구) 세 곳으로 동시에 파생된다는 아키텍처 — '사람과 AI 에이전트가 같은 참조를 읽는다'는 주장이 슬로건이 아니라 실제 코드 구조임을 원문 소스로 확인한 심층 노트."
lang: ko
tags: ['astryx', 'design-system', 'mcp', 'stylex', 'ai-agents']
lintHash: '29e24d89b5f6'
polishHash: '29e24d89b5f6'
---

> 한 줄 명제: Astryx는 컴포넌트마다 하나뿐인 `.doc.mjs` 파일을 유일한 원본으로 두고, 거기서 CLI·문서 사이트·MCP 서버 세 곳을 동시에 파생시켜 사람 개발자와 AI 에이전트가 정확히 같은 참조를 읽게 만든 코드 기반 디자인 시스템이다.

## 큰 그림

```text
Astryx (Meta, 2026-06-18 오픈소스)
├─ 1 정체        — 컴포넌트+테마+템플릿+CLI를 묶은 시스템, StyleX로 작성되지만 소비자는 모름
├─ 2 히스토리     — 사내 8년(내부 코드명 XDS), 13,000+ 앱에서 사용, 2026-06 공개
├─ 3 테마         — defineTheme + extends, data-attribute 스코프 캐스케이드, 공식 테마 7종
├─ 4 agent 인터페이스 — .doc.mjs 하나 → CLI/문서사이트/MCP 세 곳으로 파생 (가장 핵심인 설계)
├─ 5 접근성·거버넌스 — WAI-ARIA APG 패턴 + PR마다 자동 a11y 감사, MIT, beta, 외부 기여 실제 병합
└─ 6 평판         — shadcn/ui과 가장 자주 비교, 2차 기사의 오귀속 사례(Figma/Snowflake는 사실 StyleX 얘기)
```

## 핵심

Astryx는 컴포넌트 라이브러리·테마 시스템·페이지 템플릿·CLI를 "하나로 묶은 시스템"이라고 스스로 정의한다. 내부적으로는 모든 컴포넌트를 Meta의 CSS 컴파일러 StyleX(`stylex.create()`)로 작성하지만, 이 사실은 소비자에게 완전히 숨겨진다 — 배포되는 것은 미리 컴파일된 `astryx.css`와 타입이 붙은 JS이고, 소비자는 Tailwind든 CSS Modules든 플레인 CSS든 원하는 대로 `className`으로 오버라이드하면 된다. 흥미로운 점은 이 소비자-측 분리가 처음부터 그랬던 게 아니라는 것이다 — 원래는 소비자도 StyleX 빌드 플러그인을 직접 돌려야 했는데, "LLM이 StyleX 문법을 능숙히 다루지 못해 37~60% 더 장황한 코드를 생성한다"는 이슈(#506)를 계기로 지금의 분리 구조로 바뀌었다. 즉 ==오픈소스 공개를 가능하게 한 아키텍처 변경 자체가 AI 에이전트 코드 생성 품질 문제에서 나왔다==.

최소 설치·사용 흐름(README 원문, 실행 검증은 하지 않음 — 아래 레퍼런스의 확인 시점·커밋 참고):

```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral
npm install -D @astryxdesign/cli
```

```css
/* globals.css — 순서가 @layer 캐스케이드에 대응 */
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
```

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export function Providers({children}) {
  return <Theme theme={neutralTheme}>{children}</Theme>;
}
```

이 노트가 다른 "디자인 시스템 코드로 관리하기" 사례들과 Astryx를 구분해서 다루는 이유는 4번 가지(agent 인터페이스) 때문이다 — 아래 §깊이에서 확대한다.

## 깊이

### 가지 4 확대 — `.doc.mjs` 하나가 세 곳으로 파생되는 구조 ⭐

컴포넌트/훅 하나당 `packages/core/src/` 아래 `{Name}.doc.mjs` 파일이 정확히 하나 있다(JSDoc 타입이 붙은 순수 JS, `ComponentDoc` 객체를 export). 이 파일 하나가 세 소비자를 자동 생성한다:

1. **CLI** — `astryx docs <name>`, `astryx component <name>` 등이 이 파일을 읽어 터미널에 출력.
2. **문서 사이트** — `astryx.atmeta.com`의 컴포넌트 페이지가 같은 파일에서 렌더링.
3. **MCP 서버** — `apps/docsite/src/app/mcp/route.ts`(Next.js 라우트, `mcp-handler` + `zod`, Streamable HTTP 전송)가 `generated/componentRegistry` 등 **`.doc.mjs`에서 생성된 레지스트리**를 그대로 가져다 쓴다.

MCP 서버는 정확히 **두 개**의 tool만 노출한다 — 이게 중요하다. `search(query, limit=8)`은 컴포넌트·문서 토픽·템플릿을 한 번에 검색해, 정확/접두/부분 문자열 스코어링과 컴포넌트별 `keywords` 필드로 만든 역색인으로("snackbar"→`Toast`, "dropdown"→`Selector`, "modal"→`Dialog"가 실제 테스트 케이스로 확인됨) 결과당 약 1.5K 토큰 예산의 짧은 브리프를 반환한다. `get(name, section?)`은 props 테이블·사용 가이드·테마 노트·Storybook 기반 예제 코드까지 포함한 전체 상세를 반환하되, 토픽 문서는 섹션 단위로 나눠 가져올 수 있고 `MAX_TOPIC_BRIEF_CHARS = 4000`을 넘으면 요약+힌트로 잘라낸다. 즉 **코드를 생성해주는 서버가 아니라, 에이전트의 컨텍스트 예산에 맞춰 사전 스코어링된 문서 조회 서버**다 — "코드 생성"과 "문서 조회"는 다른 문제고, Astryx는 후자만 자동화했다.

"사람과 AI가 같은 참조를 읽는다"는 문구는 마케팅 슬로건이 아니라, 이 세 소비자가 전부 같은 `.doc.mjs`에서 파생된다는 실제 코드 구조를 가리킨다. 다만 이건 동시에 취약점이기도 하다 — 아래 비유의 깨지는 지점 참고.

또 하나, CLI 자체가 에이전트 친화적으로 설계된 흔적이 있다: `astryx manifest --json`은 모든 커맨드·인자·플래그·응답 타입을 기술한 자기서술 매니페스트("CLI를 위한 OpenAPI 스펙")를 내놓고, 30개의 안정적인 에러 코드(`ERR_UNKNOWN_COMPONENT` 등)를 문자열 파싱 대신 분기 조건으로 쓰라고 제공한다. `astryx init --features agents`는 프로젝트에 이미 있는 에이전트 문서 포맷(`CLAUDE.md`/`.claude/CLAUDE.md` → claude, `.cursorrules`/`AGENTS.md` → cursor/codex)을 자동 감지해 프로젝트의 스타일링 방식(StyleX/Tailwind/plain CSS)에 맞춘 치트시트를 주입한다.

### 가지 3 확대 — 테마 캐스케이드와 개수 불일치 gotcha ⭐

테마는 `defineTheme({...})`로 정의되고, 색·타이포·스페이싱 등을 직접 지정하거나 "scale config"(예: `typography.scale: {base: 14, ratio: 1.2}`)로 전체 스케일을 자동 생성할 수 있다. `extends`로 기존 테마를 상속해 일부만 오버라이드할 수 있고(`tokens`는 얕은 병합, `components`는 깊은 병합), 생성된 CSS는 `[data-astryx-theme="name"]` 속성으로 스코프되어 중첩된 테마끼리 서로 새지 않는다. 이 구조는 v0.0.15 코드모드에서 확인되듯, 원래 클래스 기반(`.xds-button.primary.sm:hover`)이던 선택자를 지금의 data-attribute 기반(`[data-variant="primary"][data-size="sm"]`)으로 마이그레이션한 결과다.

**Gotcha**: 2026-06-27 보도(2차)는 테마가 10개("default, neutral, daily, butter, chocolate, matcha, stone, gothic, brutalist, y2k")라고 썼지만, 이 노트 작성 시점(2026-07-08) 저장소·npm 패키지·공식 문서에는 **7개**(neutral/butter/chocolate/gothic/matcha/stone/y2k)만 존재한다. `default`/`daily`/`brutalist`는 어디에도 없다 — 다만 `CONTRIBUTING.md`가 여전히 "default, neutral, daily, and more"라고 (동기화되지 않은 채) 남아 있어, 이 세 테마가 한때 실제로 존재했다가 beta 기간 중 정리됐을 가능성이 높다(변경 로그로 명시적으로 확인되지는 않음 — 추론). 컴포넌트 개수도 마찬가지로 소스마다 다르다: README/블로그는 "150+", 홈페이지는 "160+", CLI 소스의 `componentCount = '90+'`는 **라이브 탐색이 실패했을 때만 쓰는 폴백 문자열**인데 여러 2차 기사가 이걸 "GitHub 저장소가 90+라고 명시한다"로 잘못 인용했다. 빠르게 움직이는 beta 프로젝트를 인용할 때는 홈페이지/README 중 어느 쪽이 더 최신인지, 그리고 코드 안의 폴백값과 실제 라이브 값을 혼동하지 않았는지를 항상 확인해야 한다는 사례다.

### 📎 접근성·거버넌스 — offload 정보

- WCAG 등급(예: "2.1 AA")은 어디에도 명시돼 있지 않다 — 대신 TabList/TreeList/Toolbar/SegmentedControl/메뉴류가 **WAI-ARIA APG 패턴**(화살표 키 내비게이션, Home/End, 타입어헤드, roving focus)을 따른다고 명시하고, `useListFocus`/`useGridFocus`/`useTypeahead`/`useAnnounce` 같은 재사용 가능한 접근성 훅을 제공한다.
- CI에 `@axe-core/playwright` 기반 PR별 접근성 감사(`pr-a11y` 잡)가 실제로 걸려 있다 — 컴포넌트가 바뀐 PR마다 Storybook 빌드에 대해 자동 실행되고 위반 사항을 PR 코멘트로 남긴다.
- 라이선스는 순수 MIT(PATENTS 파일 없음 — 초기 React의 BSD+Patents 논란과 다른, StyleX/React 계열에서 최근 쓰는 방식). Beta 상태이며 `0.x`에서 모든 변경을 patch로 릴리스(breaking 변경은 changelog `[breaking]` 태그로만 구분) — semver 안정성 보장이 아직 없다는 뜻.
- 최근 병합된 PR 20개 중 대부분이 `MEMBER`가 아니라 `CONTRIBUTOR`(외부 기여자) 계정 — "오픈소스로 공개만 하고 커뮤니티 기여는 기대 안 함" 부류가 아니라 실제로 외부 PR을 병합하고 있다.

## 비유

Astryx의 `.doc.mjs`는 방송국의 **마스터 테이프**와 같다. 하나의 마스터에서 TV용·라디오용·유튜브용 버전이 파생되듯, 컴포넌트 하나의 문서 파일에서 CLI 출력·문서 사이트 페이지·MCP 응답이 자동으로 파생된다.

**깨지는 지점**: 방송국 마스터 테이프는 각 채널로 나간 뒤에도 개별적으로 재편집할 수 있다. 하지만 Astryx의 세 소비자는 전부 자동 생성이라 개별적으로 손볼 수 없다 — `.doc.mjs`가 부실하거나 오래되면 CLI·문서사이트·MCP 응답이 **동시에** 부실해진다. 단일 원본의 강점(세 곳이 절대 어긋나지 않는다)이 그대로 단일 실패점이 된다.

## 곁가지

- **StyleX 자체 심화** — Astryx가 내부적으로 쓰는 원자적 CSS 생성·컴파일 방식을 직접 파고들고 싶어질 때(예: `stylex.create()`의 타입 시스템, 빌드타임 정적 추출 원리).
- **W3C DTCG 정합성 확인** — Astryx의 `defineTheme` 토큰이 실제로 W3C Design Tokens 표준(2025.10 stable)과 얼마나 정합적인지 검증이 필요해질 때. (현재로선 원문에서 DTCG 언급 자체를 찾지 못했다 — 확인 필요 항목.)
- **MCP 프로토콜 자체 스펙** — `mcp-handler`가 구현하는 Streamable HTTP 전송 방식이나 MCP 프로토콜 일반의 tool/resource 스펙 자체가 궁금해질 때.

## 연결

- [DESIGN.md](/notes/design-md/) — 같은 "기계가 읽는 원본 + 사람이 읽는 문서"라는 패턴의 형제 사례. DESIGN.md는 YAML 토큰+마크다운 산문을 한 파일에 담아 에이전트에게 넘기지만, Astryx는 한 단계 더 나아가 **MCP 서버**로 직접 노출한다는 차이가 있다 — DESIGN.md가 "에이전트에게 주는 편지"라면 Astryx는 "에이전트가 직접 열람하는 서고"에 가깝다.
- [코드 기반 디자인 시스템 관리 도구](/wiki/design-to-code/code-based-design-system-tools/) — 이 위키 카드의 헤드라인 사례가 이 노트의 심층판이다. Style Dictionary·Storybook·bit.dev 같은 코드-퍼스트 도구들과의 관계는 그쪽에서 다룬다.

## 레퍼런스

- [facebook/astryx — GitHub](https://github.com/facebook/astryx) — 1차. README, 패키지 구조, LICENSE(MIT), CONTRIBUTING.md 전문 확인. HEAD 커밋 `5bf024f`, 확인일 2026-07-08.
- [facebook/astryx wiki — Why StyleX](https://github.com/facebook/astryx/wiki/Why-StyleX) — 1차. StyleX 저작-소비 분리 근거(이슈 #506, LLM 코드 품질).
- [Astryx 공식 블로그 — Introducing Astryx](https://astryx.atmeta.com/blog/introducing-astryx) (2026-06-18) — 1차. 8년 내부 사용, 13,000+ 앱 공식 발표문.
- [Astryx 공식 블로그 — How Astryx Works](https://astryx.atmeta.com/blog/how-astryx-works) (2026-06-29) — 1차. "사람과 AI 에이전트가 같은 참조를 읽는다"는 주장 원문(특정 에이전트 이름은 명시하지 않음).
- [Astryx 공식 블로그 — v0.1.3 릴리스](https://astryx.atmeta.com/blog/astryx-v0-1-3) (2026-07-04) — 1차. WAI-ARIA APG 패턴 적용 컴포넌트 목록.
- `apps/docsite/src/app/mcp/route.ts`, `apps/docsite/src/__tests__/mcp-server.test.ts`, `packages/cli/src/commands/agent-docs.mjs`, `packages/core/src/theme/generateThemeRules.ts` (저장소 내 소스 직접 확인) — 1차. MCP 서버 tool 정의·테스트, agent-docs 프리셋, 테마 캐스케이드 구현. 확인일 2026-07-08.
- [MarkTechPost, Meta's Astryx Brings a CLI and MCP Server to an Open-Source React Design System](https://www.marktechpost.com/2026/06/27/) (2026-06-27) — 2차. shadcn/ui 비교, 약점 지적(beta, 외부 채택 미검증). "Figma/Snowflake가 쓴다"는 문장은 원문을 읽으면 **StyleX**를 가리키는 것으로 확인됨 — 이 문장을 Astryx 얘기로 재인용한 다른 2차 기사(예: AI Daily Post)는 오귀속.
- [Hacker News 스레드](https://news.ycombinator.com/item?id=48665555) — 2차. 12포인트, 댓글 2개뿐 — 반응을 판단하기엔 표본이 매우 얕음.

---

## 인출 질문

- Astryx가 StyleX로 작성되는데도 왜 소비자는 StyleX를 몰라도 되는가? 이 분리는 애초에 왜(어떤 문제 때문에) 도입됐나?
- `.doc.mjs` 파일 하나에서 파생되는 세 소비자는 무엇이고, 이 구조가 "사람과 에이전트가 같은 참조를 읽는다"는 주장을 어떻게 기술적으로 뒷받침하는가?
- MCP 서버의 두 tool(`search`/`get`)은 각각 어떤 문제를 풀도록 스코프가 좁혀져 있나 — 이게 "코드 생성 서버"가 아니라는 근거는?
- 테마 개수·컴포넌트 개수가 소스마다(README/홈페이지/CLI 폴백/2차 기사) 다르게 보고된 이유를 재구성해보기. 어느 소스를 가장 신뢰해야 하나?
- 전이: "Figma와 Snowflake가 Astryx를 쓴다"는 오류는 어디서 비롯됐나? 이런 오귀속을 피하려면 조사 중 어떤 확인 습관이 필요한가?
- 전이: DESIGN.md와 Astryx는 같은 문제("에이전트에게 디자인 컨텍스트를 어떻게 지속적으로 전달할까")를 다른 층위에서 푼다 — 두 접근의 결정적 차이는 무엇인가?

## 내 관점

(학습자 영역 — 비어 있음)
