---
type: Reference
title: Material Design — 한 디자인 시스템 사례
pubDate: '2026-07-10T16:10:25+09:00'
resource: https://m3.material.io/
description: Google의 Material Design(M1~M3)을 이 라이브러리의 원리들이 한 시스템으로 어떻게 구현되는지 보여주는 '사례'로 정리 — 8dp 그리드·12컬럼·48dp 타깃·타입 스케일·동적 색. Apple·Carbon·Tailwind와 나란한 예시
lang: ko
tags: ['material-design', 'design-system', '8dp-grid', 'material-you', 'accessibility', 'example']
summary: "Material Design은 이 카테고리의 앵커가 아니라, 이 라이브러리가 다루는 원리(타이포·spacing·elevation·색·접근성)가 한 시스템으로 어떻게 구현되는지 보여주는 '한 사례'다 — Apple HIG·IBM Carbon·Tailwind와 나란한. 인쇄 기반 요소를 시각 기반으로 삼고, 8dp/4dp 그리드·12컬럼 반응형·48×48dp 타깃·4.5:1 대비로 규범화하며, M3(Material You)의 동적 색은 개인 표현이 접근 가능한 대비를 깨지 않게 설계됐다. 이런 시스템의 토큰·의도를 코딩 에이전트에 넘기는 산출물 포맷이 앵커인 DESIGN.md다."
lintHash: '2e79f28a5341'
---

> 한 줄 명제: Material Design은 이 라이브러리의 원리들이 한 시스템으로 실제 구현된 **사례**다(앵커가 아니라 예시) — Apple·Carbon·Tailwind처럼, DESIGN.md로 인코딩할 수 있는 여러 디자인 시스템 중 하나.

## 핵심

Material Design은 Google이 2014년(Google I/O, Android 5.0와 함께) 발표한 종합 디자인 시스템이다. 이 카드는 Material을 이 카테고리의 앵커가 아니라 ==이 라이브러리가 다루는 원리(타이포·spacing·elevation·색·접근성)가 한 시스템에서 어떻게 구현되는지 보여주는 **사례**==로 둔다 — [Apple HIG](/wiki/design-principles/usability/touch-target-size/)·[IBM Carbon·Tailwind](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)와 나란한 예시다. (이 카테고리의 실제 앵커는 그런 시스템을 에이전트에 넘기는 산출물 포맷 [DESIGN.md](/wiki/design-principles/design-md/)다.)

Material이 잘 문서화된 사례인 이유는, 좋은 디자인의 미감·사용성 두 측면을 한 스펙에 명시적으로 종합하기 때문이다. 창립 목표문: =="고전적인 좋은 디자인 원칙을 기술·과학의 혁신·가능성과 종합한다"==, 그리고 그 시각 기반을 =="타이포그래피, 그리드, 공간, 스케일, 색, 이미지 — 인쇄 기반 디자인의 기초 요소들"==이라 명시한다([aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/)의 출판→웹 계보와 그대로 겹친다). 세 기초 원칙은 *Material is the metaphor*·*Bold, graphic, intentional*·*Motion provides meaning*.

**사용성을 검증 가능한 수치로 규범화한 예:**

- **8dp 정사각 베이스라인 그리드**, 타이포·아이콘은 **4dp 그리드**(→ [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)).
- **12컬럼 반응형 그리드**. M2 브레이크포인트(dp): 0·360·400·480·600·720·840·960·1024·1280·1440·1600·1920. 컬럼 4/8/12. 마진·거터 8·16·24·40dp. (M3는 window size classes로 재편 → [responsive-layout](/wiki/design-principles/aesthetics-and-layout/responsive-layout/).)
- **터치 타깃 최소 48×48dp**(≈9mm), 타깃 간 8dp 이상(→ [touch-target-size](/wiki/design-principles/usability/touch-target-size/)).
- 텍스트 대비 **최소 4.5:1**(AA), 큰 텍스트 3:1(→ [color-and-contrast](/wiki/design-principles/color-and-contrast/)).

**미감·사용성 결합의 예 — 동적 색.** M3(2021, "Material You")는 사용자 배경에서 색을 추출해 60여 톤 팔레트를 생성하되, ==함께 쓰이는 두 톤은 어떤 시작 색에서도 접근 가능한 대비를 보장==하도록 짝지어진다 — 개인 표현(미감)이 접근성(사용성)을 깨지 않게 한 설계(→ [aesthetic-usability-effect](/wiki/design-principles/usability/aesthetic-usability-effect/)).

**타입 스케일.** M2는 12·14·16·20·34 기반에 Display/Headline/Title/Subheading/Body/Caption/Button 역할, 서체 Roboto/Noto. M3는 Display/Headline/Title/Body/Label × Large/Medium/Small로 재편(→ [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/)).

**Gotcha / 확인 한계**: "2014 / Google I/O"는 널리 확립됐으나 공식 페이지에서 연도를 1차 렌더 확인하진 못함. M2/M3 사이트는 SPA라 위 수치는 정적 M1 스펙 + 공식 도메인 스니펫으로 교차 확인. M3 타입 스케일 정확 sp·elevation dp는 1차 미확정이라 인용하지 않음.

## 레퍼런스

- [Material Design — Introduction (M1)](https://m1.material.io/material-design/introduction.html) — 1차. "좋은 디자인 원칙 + 기술 종합", "인쇄 기반 요소가 시각 처리를 이끈다".
- [Material Design — Metrics & keylines (M1)](https://m1.material.io/layout/metrics-keylines.html) — 1차. 8dp/4dp 그리드, 48×48dp 타깃. M2 [spacing-methods](https://m2.material.io/design/layout/spacing-methods.html)(SPA)가 계승.
- [Material Design — Responsive UI (M1)](https://m1.material.io/layout/responsive-ui.html) — 1차. 12컬럼·브레이크포인트·거터.
- [Material Design — Accessibility (M1)](https://m1.material.io/usability/accessibility.html) — 1차. 48×48dp(≈9mm), 4.5:1/3:1.
- [Google, Android 12 Beta (Material You)](https://blog.google/products/android/android-12-beta/) — 1차. 2021-05-18. 배경에서 색 추출.
- [Google Design — Colors Change](https://design.google/library/colors-change) — 1차. 한 색 → 60톤, "어떤 색에서도 접근 가능한 대비 보장".

## 연결

- [DESIGN.md](/wiki/design-principles/design-md/) — 이 카테고리의 앵커(산출물 포맷). Material은 DESIGN.md로 인코딩할 수 있는 여러 시스템 중 하나의 사례.
- [Design Principles](/wiki/design-principles/) — 상위 허브. Material은 여기 원리들의 통합 구현 예.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) · [color-and-contrast](/wiki/design-principles/color-and-contrast/) · [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/) · [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/) — Material이 구현한 각 원리(다른 시스템 사례와 비교).
- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — Material 같은 시스템을 코드로 옮기는 인접 카테고리.
