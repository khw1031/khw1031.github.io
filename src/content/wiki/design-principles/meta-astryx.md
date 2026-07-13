---
type: Reference
title: Meta Astryx — 코드 기반 Agent-Ready 디자인 시스템 (구현 사례)
pubDate: '2026-07-10T21:15:00+09:00'
resource: https://github.com/facebook/astryx
description: DESIGN.md 문제를 한 단계 더 밀어붙인 구현 사례 — 컴포넌트당 하나의 .doc.mjs에서 CLI·문서사이트·MCP 서버를 파생해 사람과 AI 에이전트가 같은 참조를 읽는 Meta의 오픈소스 디자인 시스템
lang: ko
tags: ['astryx', 'meta', 'design-system', 'mcp', 'agent-ready', 'design-md']
summary: "Meta가 2026-06-18 오픈소스로 공개한 Astryx는 사내 8년(코드명 XDS, 13,000+ 앱)을 거친 코드 기반 디자인 시스템이다. 이 카테고리의 앵커 DESIGN.md와 같은 문제 — '에이전트에게 디자인 컨텍스트를 지속적으로 전달' — 를 한 단계 더 밀어붙인 구현 사례다. 핵심은 컴포넌트마다 하나뿐인 .doc.mjs 문서 파일이 CLI·문서 사이트·MCP 서버(search/get 두 도구)로 동시에 파생된다는 아키텍처. DESIGN.md가 '에이전트에게 주는 편지'라면 Astryx는 '에이전트가 직접 열람하는 서고'다. StyleX로 작성되지만 소비자는 몰라도 되게 분리했고(이 분리 자체가 LLM 코드 품질 이슈에서 나옴), 접근성은 WAI-ARIA APG + PR별 axe 감사. beta(0.x)."
lintHash: 'c3d452d29f49'
---

> 한 줄 명제: Astryx는 컴포넌트당 하나의 `.doc.mjs`를 유일 원본으로 두고 CLI·문서사이트·MCP를 파생해 사람과 에이전트가 같은 참조를 읽게 한 코드 기반 디자인 시스템 — DESIGN.md가 "에이전트에게 주는 편지"라면 Astryx는 "에이전트가 직접 열람하는 서고"다.

## 핵심

Astryx(Meta, 2026-06-18 오픈소스, MIT, beta)는 컴포넌트·테마·템플릿·CLI를 묶은 디자인 시스템으로, 사내 8년(내부 코드명 XDS)·13,000+ 앱을 거쳐 공개됐다. 이 카드가 이 카테고리에 있는 이유는 단순한 "또 하나의 디자인 시스템"이 아니라, ==앵커인 [DESIGN.md](/wiki/design-principles/design-md/)와 **같은 문제**(에이전트에게 디자인 컨텍스트를 지속 전달)를 한 단계 더 밀어붙인 구현 사례==이기 때문이다.

**agent-ready의 실체 — `.doc.mjs` 하나 → 세 소비자.** 컴포넌트/훅 하나당 `{Name}.doc.mjs`(JSDoc 타입 붙은 순수 JS) 파일이 정확히 하나 있고, ==이 파일 하나가 세 곳으로 자동 파생==된다:

1. **CLI** — `astryx docs <name>` 등이 이 파일을 읽어 출력.
2. **문서 사이트** — `astryx.atmeta.com` 컴포넌트 페이지가 같은 파일에서 렌더.
3. **MCP 서버** — Next.js 라우트가 `.doc.mjs`에서 생성된 레지스트리를 그대로 노출.

==MCP 서버는 정확히 **두 도구**만 노출==한다: `search(query, limit=8)`는 역색인·스코어링으로 컴포넌트를 찾아 결과당 ~1.5K 토큰의 짧은 브리프를 반환하고, `get(name, section?)`은 props·가이드·예제까지 전체를 반환하되 `MAX_TOPIC_BRIEF_CHARS=4000`을 넘으면 요약+힌트로 자른다. ==즉 "코드를 생성해주는 서버"가 아니라 **에이전트의 컨텍스트 예산에 맞춘 문서 조회 서버**다== — Astryx는 "코드 생성"이 아니라 "문서 조회"만 자동화했다.

**소비자-측 StyleX 분리 (AI가 만든 설계 결정).** 내부는 Meta의 CSS 컴파일러 StyleX로 작성되지만 소비자는 몰라도 된다 — 배포물은 미리 컴파일된 `astryx.css` + 타입 붙은 JS이고, Tailwind든 플레인 CSS든 `className`으로 오버라이드한다. ==이 분리는 "LLM이 StyleX 문법을 능숙히 다루지 못해 37~60% 더 장황한 코드를 생성한다"는 이슈에서 나왔다== — 오픈소스 공개를 가능케 한 아키텍처 변경이 AI 코드 생성 품질 문제에서 비롯된 것.

**CLI도 에이전트 친화.** `astryx manifest --json`("CLI를 위한 OpenAPI"), 문자열 파싱 대신 쓸 30개 안정 에러 코드, `astryx init --features agents`가 프로젝트의 `CLAUDE.md`/`.cursorrules`/`AGENTS.md`를 감지해 스타일링 방식에 맞춘 치트시트 주입.

**테마·접근성.** `defineTheme` + `extends`, `[data-astryx-theme="name"]` 스코프 캐스케이드, 공식 테마 7종. WCAG 등급 명시는 없으나 ==WAI-ARIA APG 패턴== 준수 + ==PR마다 `@axe-core/playwright` 접근성 감사==(`pr-a11y` 잡). 외부 기여 PR을 실제 병합 중.

**DESIGN.md와의 결정적 차이.** 둘 다 "기계가 읽는 원본 + 사람이 읽는 문서"를 한 원본에 둔다. 그러나 [DESIGN.md](/wiki/design-principles/design-md/)는 YAML 토큰+산문을 **파일로 건네는** 정적 핸드오프인 반면, Astryx는 그 원본을 **MCP 서버로 직접 노출**해 에이전트가 컨텍스트 예산에 맞춰 질의하게 한다.

**Gotcha (beta 인용 주의)**: (1) 2차 기사는 테마 10개라 썼으나 저장소·npm·공식 문서엔 **7개**뿐(`default`/`daily`/`brutalist`는 없음). (2) 컴포넌트 수는 소스마다 다름 — README "150+", 홈 "160+", CLI 소스 `'90+'`는 **라이브 탐색 실패 시 폴백 문자열**인데 여러 기사가 "저장소가 90+라 명시"로 오인용. (3) "Figma·Snowflake가 Astryx를 쓴다"는 오귀속 — 원문은 **StyleX** 얘기다. (4) 0.x beta라 semver 안정성 보장 없음.

## 레퍼런스

- [facebook/astryx — GitHub](https://github.com/facebook/astryx) — 1차. README·패키지 구조·LICENSE(MIT)·CONTRIBUTING. HEAD `5bf024f`, 확인일 2026-07-08.
- [Astryx — Introducing Astryx](https://astryx.atmeta.com/blog/introducing-astryx) (2026-06-18) · [How Astryx Works](https://astryx.atmeta.com/blog/how-astryx-works) (2026-06-29) · [v0.1.3](https://astryx.atmeta.com/blog/astryx-v0-1-3) (2026-07-04) — 1차. 8년 내부·13,000+ 앱, "사람과 AI가 같은 참조", WAI-ARIA APG.
- [facebook/astryx wiki — Why StyleX](https://github.com/facebook/astryx/wiki/Why-StyleX) — 1차. 저작-소비 분리 근거(이슈 #506, LLM 코드 품질).
- 저장소 소스 `apps/docsite/src/app/mcp/route.ts`·`__tests__/mcp-server.test.ts`·`packages/cli/src/commands/agent-docs.mjs` — 1차(직접 확인). MCP 두 도구 정의·테스트, agent-docs 프리셋. 확인일 2026-07-08.
- [MarkTechPost (2026-06-27)](https://www.marktechpost.com/2026/06/27/) — 2차. shadcn/ui 비교, beta 약점. "Figma/Snowflake" 문장은 StyleX 가리킴(오귀속 주의).

## 연결

- [DESIGN.md](/wiki/design-principles/design-md/) — 같은 문제의 형제 사례. DESIGN.md=핸드오프 파일, Astryx=MCP로 노출된 서고. **이 카테고리 앵커와의 대비가 이 카드의 핵심.**
- [Design Principles](/wiki/design-principles/) — 상위 허브. Astryx는 "구현된 디자인 시스템 사례"의 하나(agent-ready 극단).
- [material-design](/wiki/design-principles/material-design/) — 또 다른 구현 사례(Google). Material=시각 언어 스펙, Astryx=코드+MCP 배포.
- [코드 기반 디자인 시스템 관리 도구](/wiki/design-to-code/code-based-design-system-tools/) — 이 위키의 인접 카드가 Astryx를 헤드라인 사례로 다룬다(Style Dictionary·Storybook·bit.dev 계열과의 관계).
