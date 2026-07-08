---
type: Reference
title: 코드 기반 디자인 시스템 관리 도구
pubDate: '2026-07-08'
description: 디자인 토큰·컴포넌트·문서 자체를 코드/텍스트로 관리해, Figma 없이도 디자인 시스템의 원본을 유지하는 산업 전반의 도구들
lang: ko
tags: ['design-to-code', 'design-tokens', 'design-system', 'ai-agent-workflow', 'mcp']
summary: "Style Dictionary·Terrazzo(W3C DTCG 토큰 표준), Storybook(코드에서 생성하는 컴포넌트 문서), bit.dev(진짜 코드-퍼스트 플랫폼), Vanilla Extract/Panda CSS/StyleX(코드에 내장된 토큰) 등, 디자인 시스템의 원본을 애초에 코드/텍스트로 두는 산업 전반의 도구를 정리한다. 2026-06 Meta가 공개한 Astryx는 여기에 'MCP 서버로 사람과 AI 에이전트가 같은 참조를 읽는다'는 축을 더한, 가장 최근이자 이 조사 주제에 가장 정확히 들어맞는 사례다."
lintHash: '04d764076dd3'
---

> 한 줄 명제: Figma를 우회하는 AI 에이전트 워크플로 이전에, 디자인 시스템의 원본을 애초에 코드/텍스트로 두는 산업 관행이 이미 있었다 — 토큰 컴파일러, 코드에서 뽑는 컴포넌트 문서, 코드-퍼스트 플랫폼, CSS-in-JS 토큰이 그것이고, Meta의 Astryx(2026-06)는 여기에 "사람과 AI 에이전트가 같은 참조를 읽는다"는 축을 새로 더했다.

## 핵심

이 카테고리의 다른 카드들이 "AI 에이전트가 어떻게 Figma를 우회하는가"를 다룬다면, 이 카드는 한 걸음 물러나 "애초에 디자인 시스템을 코드로 관리하는 도구가 산업에 이미 있는가"를 묻는다. 답은 그렇다는 것이고, 네 층으로 나뉜다.

**토큰 관리**: Style Dictionary(원래 Amazon 오픈소스, 현재 독립 조직 `style-dictionary`가 관리, v5.5.0)는 JSON 토큰을 CSS 변수·iOS·Android 등 여러 플랫폼 출력으로 컴파일하는 사실상 표준 도구다. Terrazzo(구 Cobalt UI, 동일 팀의 리브랜딩)도 W3C DTCG 토큰 포맷을 기반으로 같은 역할을 한다. 그리고 이 둘이 따르는 **W3C Design Tokens(DTCG) 스펙 자체가 2025-10-28 정식 stable 버전에 도달**했다 — "아직 초안 단계"라는 통념은 이제 낡은 정보다.

**컴포넌트 문서화**: Storybook은 여전히 지배적인 도구로, 실제 소스 코드에서 컴포넌트를 격리해 보여주는 "코드가 원본, 문서는 파생물"이라는 패턴의 원조격이다(2026-06 기준 v10대, 자체 저장소에 `AGENTS.md`/Claude skills를 넣어 AI 에이전트 대응을 명시할 정도로 이 흐름에 올라타 있다). Ladle(React 전용)은 활발하고, Histoire(Vue/Svelte용)는 2024-04 이후 릴리스가 없어 사실상 방치된 것으로 보인다.

**코드-퍼스트 상용 플랫폼**: 여기서 주의할 점은 "코드 기반"을 표방해도 실제로는 결이 다르다는 것이다. Backlight.dev는 코드-퍼스트 철학의 대표 주자였으나 **2025-06-01 서비스를 종료**했고, 운영사(divRIOTS)는 아예 Figma 플러그인 사업으로 방향을 틀었다 — 코드 기반 접근이 항상 살아남는 건 아니라는 반례다. Knapsack은 "코드 소스"라기보다 Figma↔코드 양방향 동기화 하이브리드에 가깝다. 반면 bit.dev(Bit)는 Figma가 거의 등장하지 않는, 컴포넌트를 원자 단위로 버저닝·배포하는 진짜 코드-퍼스트 플랫폼이다.

**CSS-in-JS/TS에 내장된 토큰**: Vanilla Extract, Panda CSS(Chakra 팀), StyleX(Meta)는 모두 토큰을 코드(타입이 있는 객체) 안에 직접 둔다. 다만 StyleX 자체는 "토큰·테마" 이야기를 하지 않고 순수 빌드타임 CSS 컴파일러로 스코프를 좁혀 놓았다.

이 네 층을 하나로 합친, 이번 조사에서 가장 이 주제에 정확히 들어맞는 신규 사례가 **Meta Astryx**(2026-06-18 오픈소스, MIT, Beta)다. StyleX 위에 컴포넌트·테마·CLI를 얹고, 무엇보다 **MCP 서버를 내장해 사람 개발자와 AI 에이전트가 컴포넌트당 하나의 `.doc.mjs` 파일이라는 같은 원본을 읽도록** 설계했다. "코드 기반 디자인 시스템"과 "AI 에이전트가 읽을 수 있는 디자인 시스템"이 하나의 아키텍처로 합쳐진 사례라 별도 심층 노트로 다뤘다 — [Meta Astryx 심층 노트](/notes/meta-astryx-코드-기반-agent-ready-디자인-시스템/) 참조.

## 레퍼런스

- [Style Dictionary (GitHub)](https://github.com/style-dictionary/style-dictionary) — 1차. v5.5.0(2026-06-21), Apache 2.0. `amzn` 조직에서 독립 조직으로 이전됨.
- [Style Dictionary 공식 문서 — DTCG 지원](https://styledictionary.com/info/dtcg/) — 1차. 최신 스펙(2025.10) 전체 지원은 v5에서도 아직 작업 중이라고 명시.
- [Terrazzo (GitHub)](https://github.com/terrazzoapp/terrazzo) — 1차. 구 Cobalt UI 리브랜딩, MIT, DTCG 토큰 기반, 2026-06 릴리스까지 확인.
- [W3C, Design Tokens Specification 정식 stable 버전 도달 발표](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) (2025-10-28) — 1차. Format/Color/Resolver 모듈이 정식 리포트로 발행됨.
- [Storybook (GitHub)](https://github.com/storybookjs/storybook) — 1차. v10.4.6(2026-06-16). 여러 2026년 2차 글이 "v8"이라 쓰는 것은 낡은 정보.
- [Backlight.dev 홈페이지 종료 배너](https://backlight.dev/) — 1차. "Backlight.dev is shutting down June 1st 2025"를 직접 확인.
- [Knapsack 홈페이지](https://www.knapsack.cloud/) — 1차. "디자인·코드·문서를 위한 단일 소스, 항상 동기화"라는 양방향(Figma+코드) 포지셔닝.
- [bit.dev 홈페이지](https://bit.dev/) — 1차. 컴포넌트 단위 버저닝·배포 중심, Figma는 통합 로고로만 등장.
- [Vanilla Extract (GitHub)](https://github.com/vanilla-extract-css/vanilla-extract) — 1차. 2026-07-06까지 릴리스 확인, 다만 메인테이너 리소스 한계가 자체 GitHub Discussions에서 언급됨(2차 확인).
- [Panda CSS (GitHub)](https://github.com/chakra-ui/panda) — 1차. 2026-06-27 릴리스까지 확인. DTCG 정합성에 대한 공식 선언은 찾지 못함(미확인으로 표기).
- [StyleX (GitHub)](https://github.com/facebook/stylex) 및 [Meta Engineering, CSS at Scale with StyleX](https://engineering.fb.com/2026/01/12/web/css-at-scale-with-stylex/) — 1차. 토큰/테마 언어 없이 순수 빌드타임 컴파일러로 스코프를 한정.
- [Meta, Astryx (GitHub)](https://github.com/facebook/astryx) — 1차. 상세는 심층 노트 참조.

## 연결

- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — 이 카드가 속한 카테고리.
- [코드/캔버스를 디자인 소스로 쓰는 도구](/wiki/design-to-code/code-as-design-source/) — 저쪽은 AI 에이전트가 앱의 실제 UI 코드를 직접 조작하는 워크플로(Onlook/Subframe/tldraw)를, 이 카드는 그 아래 깔리는 "디자인 시스템 자체를 코드로 관리하는" 더 일반적인 산업 인프라를 다룬다는 점에서 층위가 다르다.
- [컴포넌트 레지스트리 기반 생성](/wiki/design-to-code/component-registry-first-generation/) — bit.dev·Astryx 모두 "정해진 컴포넌트 집합에서 조합"이라는 shadcn/v0 registry와 같은 발상을 공유한다.
