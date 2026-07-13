---
type: Reference
title: 디자인 시스템 랜드스케이프 — 현재 구현된 사례들
pubDate: '2026-07-10T21:15:20+09:00'
resource: https://www.designsystems.com/
description: 현재 배포 중인 주요 디자인 시스템들의 비교 카탈로그 — Apple·Material·Astryx·Fluent·Carbon·Radix·Tailwind·shadcn·Adobe·Salesforce·Ant·Uber·Spotify. 무엇이 벤더 무관하게 수렴하고 무엇이 갈리는지
lang: ko
tags: ['design-systems', 'landscape', 'design-tokens', 'mcp', 'comparison']
summary: "이 라이브러리의 원리가 어느 한 벤더(Material)의 소유물이 아님을 보이는 비교 카탈로그. 다섯 이상 독립 조직의 현행 시스템을 놓고 보면 수렴이 뚜렷하다 — (1) 토큰화, (2) 시맨틱/파생 레이어, (3) 접근성 1급, (4) 단일 원본에서 멀티플랫폼, 그리고 (5) 가장 최근 축: 에이전트에 노출(Adobe spectrum-design-data-mcp·Spotify Encore MCP·Meta Astryx MCP). 갈리는 것은 전달 메커니즘·기준 단위·색 스케일 모양·파생 철학·컴포넌트 철학 — 즉 구현 표면은 교체 가능하고 원리는 아니다. 이것이 이 카테고리가 한 벤더가 아니라 이식 가능한 포맷 DESIGN.md에 앵커하는 이유다."
lintHash: 'f6d4cac7cac4'
---

> 한 줄 명제: 다섯 이상 독립 조직의 현행 디자인 시스템이 같은 원리(토큰·시맨틱·접근성·단일원본 멀티플랫폼·에이전트 노출)에 독립적으로 수렴한다 — 구현 표면(단위·스케일·API)만 다를 뿐. 그래서 원리는 벤더의 소유물이 아니다.

## 핵심

이 카드는 이 라이브러리의 논지 — ==좋은 디자인 원리는 어느 한 벤더의 IP가 아니라 여러 시스템에서 독립적으로 창발한다== — 를 실측으로 뒷받침한다. 깊은 사례는 별도 카드가 있고([Apple HIG](/wiki/design-principles/apple-hig/)·[Material](/wiki/design-principles/material-design/)·[Astryx](/wiki/design-principles/meta-astryx/)), 여기서는 현행 랜드스케이프를 유형별로 카탈로그한다:

**종합 벤더 시스템**
- **Apple HIG** — 플랫폼 네이티브, 적응형 size class, materials/vibrancy, hex 없는 시맨틱 색(→ 카드).
- **Google Material** — 시각 언어 스펙 + dp 그리드, M3 톤 엘리베이션·동적 색(→ 카드).
- **Microsoft Fluent 2** — global→alias 2층 토큰, 라이트/다크/고대비/branded 테마.
- **IBM Carbon** — 10~100 색 grade, 4테마(White/g10/g90/g100), 2x 그리드, productive/expressive 모션.

**토큰 우선 · 헤드리스 · 코드**
- **Radix** — 12단계 **역할별** 색 스케일(배경→경계→텍스트), 헤드리스 프리미티브.
- **Tailwind v4** — 50~950 OKLCH, 유틸리티 클래스, `--spacing` 단일 기준.
- **shadcn/ui** — copy-in 소스, Radix+Tailwind+CSS 변수 시맨틱 쌍(현행 웹 관행).
- **Meta Astryx** — 코드 기반, `.doc.mjs` 원본 → CLI·문서·**MCP**(→ 카드).

**엔터프라이즈**
- **Adobe Spectrum 2**(2023-12) — 플랫폼별 variant + platform-scale, 적응형 접근 색. 토큰 repo에 `@adobe/spectrum-design-data-mcp` 포함.
- **Salesforce SLDS 2**(Spring '25) — 디자인 토큰 → **CSS 스타일링 훅**(커스텀 프로퍼티), Cosmos 테마.
- **Ant Design v5** — 4 가치(자연·확정성·의미감·생장성), ==Seed → Map → Alias 3층 토큰 파생==, CSS-in-JS.
- **Uber Base / Base Web** — 런타임 theme 객체 + Styletron 원자적 CSS, 리서치 주도 `overrides` API.
- **Spotify Encore** — Foundation 원시 토큰에서 플랫폼 서브시스템으로 방사, 시맨틱 토큰으로 리브랜드 대응(과거 하드코딩 그린 교체에 6개월+), **Encore MCP 서버**로 문서를 에이전트에 노출.

## 수렴 vs 발산 (핵심 관찰)

독립적인 다섯+ 조직이 ==**수렴**==하는 지점:

1. **토큰화** — 모두 디자인 결정을 이름 붙은 토큰/변수로 표현.
2. **시맨틱/파생 레이어** — Ant는 Seed→Map→Alias 파생, SLDS 2는 시맨틱 UI 색 훅, Spotify는 비시맨틱→시맨틱 이주, Adobe는 적응 색 생성.
3. **접근성 1급** — WCAG·대비·키보드·스크린리더·CVD가 공통 목표.
4. **단일 원본 → 멀티플랫폼** — Spectrum platform-scale, Encore 티어 서브시스템, Base 단일 theme 진입점.
5. ==**에이전트 노출(가장 최근 축, 2024~26)**== — Adobe `spectrum-design-data-mcp`, Spotify Encore MCP, Meta Astryx MCP가 모두 토큰·문서를 **MCP로 AI 에이전트에 직접 노출**한다. ==이 다섯 번째 수렴이 이 카테고리가 [DESIGN.md](/wiki/design-principles/design-md/)(이식 가능한 에이전트 핸드오프 포맷)에 앵커하는 이유를 정당화한다.==

반대로 ==**발산**==하는 것은 정확히 "교체 가능해야 한다"고 원리가 말하는 구현 표면이다: **전달 메커니즘**(JSON/CSS-in-JS 토큰 vs 순수 CSS 변수 vs 런타임 JS theme), **기준 단위**(4px vs 8px), **색 스케일 모양**(Radix 12 역할 vs Tailwind 50–950 램프 vs Carbon 10–100 grade), **파생 철학**(Ant 알고리즘 생성 vs Adobe 수작업 적응 vs SLDS 평면 훅), **컴포넌트 철학**(Base `overrides` 탈출구 vs Ant 절제/확정성 vs Adobe 플랫폼 네이티브 variant).

==같은 원리가 독립적으로 반복되면서 모든 구체 단위·스케일·API는 다르다== — 이것이 원리는 벤더 무관하고 창발적이며, 특정 토큰 값·API는 원리가 아니라 구현 세부라는 증거다.

**Gotcha / 확인 한계**: 다수 벤더 문서 페이지가 SPA라 정확한 토큰 값(Adobe platform-scale 배수, SLDS 색 스텝 등)은 미확인. Spotify 1차 아티클은 TLS 인증서 오류로 못 열어 Encore 사실은 2차(Figma 블로그) 경유. Meta의 Facebook/IG/WhatsApp 사내 DS(FDS/IGDS 등)는 공개 문서가 없어 미검증 2차. Meta는 범용 공개 웹 DS가 없다 — Astryx(공개)와 Horizon XR DS가 공개 사례다.

## 레퍼런스

- [Adobe — Spectrum 2](https://s2.spectrum.adobe.com/) · [spectrum-design-data (tokens+MCP)](https://github.com/adobe/spectrum-tokens) — 1차. 플랫폼 variant, `@adobe/spectrum-design-data-mcp`.
- [Salesforce — Lightning Design System 2](https://www.lightningdesignsystem.com/) · [LWC SLDS1/2 문서](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-slds1-slds2.html) — 1차. 디자인 토큰 → CSS 스타일링 훅.
- [Ant Design — 디자인 가치](https://ant.design/docs/spec/values) · [테마 커스터마이즈(토큰)](https://ant.design/docs/react/customize-theme/) — 1차. 4 가치, Seed→Map→Alias.
- [Uber — Base Web](https://baseweb.design/) · [Introducing Base Web](https://www.uber.com/blog/introducing-base-web/) — 1차. Styletron 원자적 CSS, overrides API.
- [Figma Blog — How Spotify's design system goes beyond platforms](https://www.figma.com/blog/creating-coherence-how-spotifys-design-system-goes-beyond-platforms/) — 2차(Spotify 1차 아티클 인증서 오류 대체). Encore 티어·시맨틱 토큰·MCP.
- [Microsoft Fluent 2](https://fluent2.microsoft.design/design-tokens) · [IBM Carbon](https://carbondesignsystem.com/) · [Radix](https://www.radix-ui.com/) · [Tailwind](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/) — 1차. 각 시스템 공식 문서.

## 연결

- [Design Principles](/wiki/design-principles/) — 상위 허브. 이 카드는 "원리는 벤더 무관"이라는 논지의 실측 근거.
- [DESIGN.md](/wiki/design-principles/design-md/) — 다섯 번째 수렴(에이전트 노출·MCP)이 이 앵커를 정당화한다.
- [Apple HIG](/wiki/design-principles/apple-hig/) · [Material Design](/wiki/design-principles/material-design/) · [Meta Astryx](/wiki/design-principles/meta-astryx/) — 이 카탈로그의 깊은 사례 카드.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) · [color-and-contrast](/wiki/design-principles/color-and-contrast/) — 기준 단위·색 스케일이 벤더마다 갈리는 지점의 각론.
- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — 에이전트 노출(MCP) 메커니즘을 다루는 인접 카테고리.
