---
type: Reference
title: 컴포넌트 레지스트리 기반 생성 (shadcn/v0)
pubDate: '2026-07-08'
description: 열린 시각적 디자인을 해석시키는 대신, 정해진 실제 컴포넌트 집합을 구조화된 레지스트리로 노출해 에이전트가 그 안에서 고르고 조합하게 하는 접근
lang: ko
tags: ['design-to-code', 'component-registry', 'shadcn', 'mcp', 'ai-agent-workflow']
summary: "v0와 shadcn은 registry.json 이라는 구조화된 스펙으로 컴포넌트·블록·디자인 토큰과 그 의존관계를 노출하고, 공식 MCP 서버를 통해 Claude Code·Cursor·Copilot 같은 에이전트가 자연어로 검색·설치하게 한다. Vercel은 이를 '시각 도구에서 디자인 의도를 역공학하는 것'에 대한 명시적 대안으로 제시한다 — 열린 해석이 아니라 닫힌 후보 집합에서 조합하므로 결과가 결정론적이다."
lintHash: 'b8f23ff75f18'
polishHash: 'b8f23ff75f18'
---

> 한 줄 명제: v0와 shadcn은 열린 시각적 디자인을 해석시키는 대신, 정해진 실제 컴포넌트 집합(registry.json)에서 고르고 조합하게 함으로써 "디자인 의도 역공학"이라는 문제 자체를 없앤다.

## 핵심

컴포넌트 레지스트리 방식은 앞의 두 접근(스크린샷 해석, 텍스트 디자인 스펙)과 다른 축에 있다. ==저 둘은 여전히 "무엇을 만들지"를 이미지나 스타일 규칙으로부터 LLM이 추론해야 하지만, 레지스트리 방식은 애초에 추론 대상을 닫힌 집합으로 좁힌다.== shadcn의 `registry.json`(shadcn의 "registry item specification"을 따르는 파일)은 컴포넌트·블록·디자인 토큰을 의존관계 그래프(`registryDependencies`)와 함께 구조화된 JSON으로 기술한다. Vercel의 공식 설명에 따르면 "레지스트리는 디자인 시스템에서 AI 모델로 컨텍스트를 전달하도록 설계된 배포 스펙"이다.

이 스펙을 실제로 에이전트에 연결하는 것이 shadcn의 공식 MCP 서버다. Claude Code, Cursor, Copilot, Windsurf 등 MCP를 지원하는 어떤 에이전트든 자연어로 "공개 레지스트리, 사내 프라이빗 라이브러리, 서드파티 소스"를 넘나들며 컴포넌트를 검색·설치할 수 있다. v0 역시 자체 "design systems" 문서에서 같은 개념을 설명한다.

Vercel의 공식 블로그(2025-08-22)는 이 접근의 동기를 직접적으로 서술한다 — "시각 도구에서 디자인 의도를 역공학하는" 대신 레지스트리로 컨텍스트를 전달한다는 것이다. ==이는 이 위키 카테고리 전체가 다루는 문제의식(Figma 노드 트리를 LLM이 역해석하게 만드는 대신 무엇을 쓸 것인가)에 벤더가 스스로 이름을 붙인, 가장 직접적인 1차 근거다.== 다만 이 접근의 한계도 명확하다 — 레지스트리에 없는 완전히 새로운 시각적 디자인은 애초에 표현할 수 없으므로, 스크린샷 기반 생성이나 텍스트 스펙과 상호 배타적이라기보다 보완적인 관계에 가깝다.

## 레퍼런스

- [v0 (Vercel), Design Systems](https://v0.app/docs/design-systems) — 1차. "레지스트리는 디자인 시스템에서 AI 모델로 컨텍스트를 전달하도록 설계된 배포 스펙"이라고 정의.
- [Vercel, AI-powered prototyping with design systems](https://vercel.com/blog/ai-powered-prototyping-with-design-systems) (2025-08-22) — 1차. "시각 도구에서 디자인 의도를 역공학하는 것"에 대한 명시적 대안으로 레지스트리 기반 생성을 제시 — 이 카테고리 문제의식의 벤더측 원문.
- [shadcn/ui, MCP Server](https://ui.shadcn.com/docs/mcp) — 1차. shadcn 공식 MCP 서버 문서. Claude Code·Cursor·Copilot·Windsurf 등에서 자연어로 컴포넌트를 브라우징·검색·설치하는 방법과, 공개/프라이빗/서드파티 레지스트리를 넘나드는 구조를 설명.

## 연결

- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — 이 카드가 속한 카테고리.
- [이식 가능한 텍스트 디자인 스펙](/wiki/design-to-code/design-token-dsl-handoff/) — 둘 다 구조화된 텍스트를 에이전트에 넘기지만, DESIGN.md는 스타일 토큰을, registry는 실제 컴포넌트 자체를 넘긴다.
- [코드/캔버스를 디자인 소스로 쓰는 도구](/wiki/design-to-code/code-as-design-source/) — registry가 "설치 가능한 표준 컴포넌트 집합"을 다룬다면, 이쪽은 "이미 존재하는 프로젝트의 실제 소스코드 전체"를 다룬다는 점에서 스코프가 다르다.
