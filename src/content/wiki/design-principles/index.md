---
type: Category
title: Design Principles — DESIGN.md를 채울 좋은 UI/UX의 근거
pubDate: '2026-07-10T16:10:20+09:00'
updatedDate: '2026-07-10T20:40:00+09:00'
description: 좋은 웹·앱 UI/UX를 사용성(측정 가능)과 미감(규칙성 있는)으로 나눠 1차 출처로 정리하되, 산출물 프레임을 DESIGN.md(에이전트에 시각 아이덴티티를 넘기는 포맷)로 삼아 그 섹션(Colors·Typography·Layout·Elevation·Shapes·Components·Do's&Don'ts)에 매핑한 카테고리
lang: ko
tags: ['design-principles', 'ui-ux', 'usability', 'typography', 'design-md', 'web-design']
summary: "이 카테고리의 산출물 프레임은 DESIGN.md — 코딩 에이전트에게 시각 아이덴티티를 넘기는 포맷(YAML 토큰 + 마크다운 산문)이다. '좋은 UI/UX가 무엇인가'를 사용성(취향이 아니라 인지 법칙으로 측정·근거화 가능; Fitts·Hick·Nielsen·WCAG·Gestalt)과 미감(처리 유창성이라는 규칙성; 출판→웹의 typographic scale·baseline·grid·8pt spacing 계보)의 두 축으로 1차 출처로 정리하고, 그 원리들을 DESIGN.md의 섹션(Overview·Colors·Typography·Layout·Elevation&Depth·Shapes·Components·Do's and Don'ts)에 매핑한다. Material Design 등은 앵커가 아니라 이 원리들이 한 시스템으로 구현된 '사례'다."
lintHash: '2094038f31f2'
polishHash: '2094038f31f2'
---

> 한 줄 명제: 좋은 UI/UX는 취향으로 끝나지 않는다 — 사용성은 인지 법칙으로 측정·근거화되고, 미감도 "쉽게 처리되는 것을 아름답다고 느낀다"는 규칙성을 가진다. 이 카테고리는 그 근거를 모아, **DESIGN.md(에이전트에 시각 아이덴티티를 넘기는 포맷)의 각 섹션을 무슨 근거로 채울지**의 라이브러리로 조직한다.

## 큰 그림

```text
design-principles (좋은 UI/UX의 근거 · 산출물 프레임: DESIGN.md)
├─ design-md              ← 앵커: 산출물 포맷 (토큰 + 산문으로 에이전트에 디자인 전달)
├─ color-and-contrast     ← 브리지: 색=미감(톤 팔레트) + 대비=사용성(WCAG)
├─ [구현 사례] 원리가 실제 시스템으로 구현된 예
│   ├─ material-design         Google — 시각 언어 스펙 + dp 그리드
│   ├─ apple-hig               Apple — 플랫폼 네이티브·Liquid Glass·size class
│   ├─ meta-astryx             Meta — 코드 기반·MCP (DESIGN.md의 형제)
│   └─ design-systems-landscape  Adobe·Salesforce·Ant·Uber·Spotify… 비교 카탈로그
├─ usability/             ← 사용성 축 (측정 가능) — DESIGN.md의 Components · Do's&Don'ts 근거
│   ├─ gulf-of-execution-evaluation  Norman 두 간극 — 나머지를 꿰는 상위 이론
│   ├─ nielsen-heuristics       10대 사용성 휴리스틱 (1994, 불변)
│   ├─ fitts-law · hicks-law    타깃 크기·거리 / 선택지 수 ↔ 시간
│   ├─ jakobs-law               관습·멘탈 모델 재사용
│   ├─ gestalt-principles       지각적 그루핑 (proximity = spacing 근거)
│   ├─ cognitive-load-and-density  작업기억 ~4청크 · progressive disclosure
│   ├─ motion-and-microinteractions  모션=의미 · 접근성
│   ├─ forms-and-inputs · icon-systems  폼·검증 / 아이콘=인식·접근 가능한 이름
│   ├─ navigation-and-ia · ux-writing-microcopy  정보 구조 / 문구·plain language
│   ├─ aesthetic-usability      미감 ↔ 사용성 인식의 다리
│   └─ touch-target-size        타깃 최소 크기 (Fitts + WCAG)
└─ aesthetics-and-layout/  ← 미감 + 출판→웹 계보 — DESIGN.md의 Colors·Typography·Layout·Elevation·Shapes 근거
    ├─ typographic-scale · readability-measure · baseline-grid · fluid-typography  (Typography)
    ├─ layout-grid · spacing-8pt-grid · responsive-layout  (Layout)
    ├─ visual-hierarchy         크기·대비·위치로 초점·순서 (pre-attentive)
    ├─ elevation-and-depth      z축 그림자·톤으로 깊이 (Elevation & Depth)
    ├─ shape-and-corner-radius  경계 반경·연속 곡률 (Shapes)
    └─ dark-mode-and-theming    시맨틱 토큰으로 테마 전환
```

## 핵심

"좋은 웹·앱 디자인이 뭐냐"는 질문의 함정은 **미감이 주관적이라는 이유로 논의를 통째로 취향의 영역으로 밀어버리는 것**이다. 그러나 좋은 디자인을 하나로 뭉치지 않고 **사용성(usability)** 과 **미감(aesthetics)** 으로 갈라 보면 그림이 달라진다. ==사용성은 취향이 아니라 인간 인지의 문제라서 과업 성공률·소요 시간·에러율로 측정되고 근거를 댈 수 있다.== 미감조차 완전히 자의적이지 않다 — 뇌가 쉽게 처리하는 자극을 긍정적으로 오해한다는 처리 유창성(processing fluency) 때문에, 문화·시대를 넘어 반복 선호되는 형식 규칙(명확한 위계, 정렬, 일관된 간격, 여백, 대비)이 존재한다.

이 카테고리는 그래서 두 하위 허브로 갈린다. **[usability](/wiki/design-principles/usability/)** 는 검증된 법칙·휴리스틱(Nielsen 10대, Fitts·Hick, Gestalt, Jakob, 미학-사용성 효과)을, **[aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/)** 은 **출판→웹 계보**(활자 주조소 점 크기→모듈러 스케일, 인쇄 베이스라인→수직 리듬, 스위스 그리드→CSS Grid, 그 정점의 8pt spacing)를 담는다.

그런데 ==이 라이브러리의 산출물 프레임은 특정 디자인 시스템이 아니라 **[DESIGN.md](/wiki/design-principles/design-md/)**== — 코딩 에이전트에게 시각 아이덴티티를 넘기는 포맷(YAML 토큰 + 마크다운 산문)이다. DESIGN.md의 고정된 섹션 순서가 이 라이브러리의 조직 렌즈가 된다: 각 원리 카드는 "DESIGN.md의 어느 산문 섹션을, 무슨 1차 근거로 채울 것인가"에 답한다.

그 원리들이 실제로 어떻게 구현되는지는 **구현 사례** 카드가 보인다 — [Material Design](/wiki/design-principles/material-design/)(Google)·[Apple HIG](/wiki/design-principles/apple-hig/)·[Meta Astryx](/wiki/design-principles/meta-astryx/), 그리고 [랜드스케이프 카탈로그](/wiki/design-principles/design-systems-landscape/)(Adobe·Salesforce·Ant·Uber·Spotify…). 이들은 앵커가 아니라 ==원리가 한 시스템으로 구현된 '사례'==다. 주목할 흐름: ==Astryx·Adobe·Spotify가 모두 토큰·문서를 **MCP로 에이전트에 노출**==하기 시작했다 — 이 수렴이 왜 이 카테고리가 이식 가능한 에이전트 포맷 DESIGN.md에 앵커하는지를 정당화한다(DESIGN.md=핸드오프 파일, Astryx=에이전트가 열람하는 MCP 서고).

## DESIGN.md 섹션 매핑

DESIGN.md의 산문 섹션 ↔ 이 라이브러리의 근거 카드:

| DESIGN.md 섹션 | 무엇을 담나 | 근거 카드 |
|---|---|---|
| **Overview** | 디자인 의도·성격 | (컨셉 — 산문으로 직접 작성) |
| **Colors** | 팔레트·역할·대비 | [color-and-contrast](/wiki/design-principles/color-and-contrast/) · [dark-mode-and-theming](/wiki/design-principles/aesthetics-and-layout/dark-mode-and-theming/) |
| **Typography** | 서체·스케일·리듬·가독성 | [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/) · [readability-measure](/wiki/design-principles/aesthetics-and-layout/readability-measure/) · [baseline-grid-vertical-rhythm](/wiki/design-principles/aesthetics-and-layout/baseline-grid-vertical-rhythm/) · [fluid-typography](/wiki/design-principles/aesthetics-and-layout/fluid-typography/) |
| **Layout** | 그리드·간격·반응형 | [layout-grid](/wiki/design-principles/aesthetics-and-layout/layout-grid/) · [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) · [responsive-layout](/wiki/design-principles/aesthetics-and-layout/responsive-layout/) |
| **Elevation & Depth** | z축·그림자·톤 | [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/) |
| **Shapes** | 경계 반경·곡률 | [shape-and-corner-radius](/wiki/design-principles/aesthetics-and-layout/shape-and-corner-radius/) |
| **Components** | 컴포넌트 패턴 | [forms-and-inputs](/wiki/design-principles/usability/forms-and-inputs/) · [icon-systems](/wiki/design-principles/usability/icon-systems/) · [motion-and-microinteractions](/wiki/design-principles/usability/motion-and-microinteractions/) |
| **Do's and Don'ts** | 준수·금지 규칙 | [usability](/wiki/design-principles/usability/) 전반 — [nielsen-heuristics](/wiki/design-principles/usability/nielsen-heuristics/) · [gulf](/wiki/design-principles/usability/gulf-of-execution-evaluation/) · [visual-hierarchy](/wiki/design-principles/aesthetics-and-layout/visual-hierarchy/) · [ux-writing-microcopy](/wiki/design-principles/usability/ux-writing-microcopy/) |

가로지르는 근거([gestalt-principles](/wiki/design-principles/usability/gestalt-principles/)·[fitts-law](/wiki/design-principles/usability/fitts-law/)·[hicks-law](/wiki/design-principles/usability/hicks-law/)·[jakobs-law](/wiki/design-principles/usability/jakobs-law/)·[cognitive-load-and-density](/wiki/design-principles/usability/cognitive-load-and-density/)·[touch-target-size](/wiki/design-principles/usability/touch-target-size/))는 여러 섹션에 동시에 적용된다.

## 곁가지

- **온보딩·빈 상태(empty states)** — 첫 사용 안내·빈 화면. ux-writing·progressive disclosure가 부분 대리.
- **신뢰·설득·다크 패턴 회피(ethics)** — 사회적 증거·기본값의 윤리적 사용.
- **반응형 이미지·미디어** — `srcset`·`<picture>`·aspect-ratio. responsive-layout이 "유연한 이미지"로 부분 언급.
- **데이터 시각화(dataviz)** — 차트·대시보드. 별도 카테고리로 클 수도.

## 레퍼런스

- [google-labs-code/design.md — GitHub](https://github.com/google-labs-code/design.md) — 1차. 이 카테고리의 산출물 프레임인 DESIGN.md 포맷의 원 저장소(alpha v0.3.0). 상세는 [design-md 카드](/wiki/design-principles/design-md/).
- [Nielsen Norman Group — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — 1차/공식. 사용성 축의 대표 근거(1994, 목록 불변).

## 연결

- [DESIGN.md](/wiki/design-principles/design-md/) — 이 카테고리의 앵커(산출물 포맷)이자 섹션 조직 렌즈.
- [사용성 (usability)](/wiki/design-principles/usability/) · [미감과 레이아웃 (aesthetics-and-layout)](/wiki/design-principles/aesthetics-and-layout/) — 두 축의 하위 허브.
- [color-and-contrast](/wiki/design-principles/color-and-contrast/) — 두 축을 가로지르는 브리지 카드.
- **구현 사례:** [material-design](/wiki/design-principles/material-design/) · [apple-hig](/wiki/design-principles/apple-hig/) · [meta-astryx](/wiki/design-principles/meta-astryx/) · [design-systems-landscape](/wiki/design-principles/design-systems-landscape/) — 원리가 실제 배포 시스템으로 구현된 예.
- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — DESIGN.md가 속하는 인접 카테고리. 이 카테고리가 "무슨 좋은 디자인을 담을까(규범)"라면 저쪽은 "어떻게 코드로 넘길까(메커니즘)".
