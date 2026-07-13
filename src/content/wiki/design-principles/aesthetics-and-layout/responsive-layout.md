---
type: Reference
title: 반응형·적응형 레이아웃 (Responsive Layout)
pubDate: '2026-07-10T20:28:20+09:00'
resource: https://alistapart.com/article/responsive-web-design/
description: 그리드가 뷰포트에 적응하는 차원 — 유동 그리드·유연한 이미지·미디어 쿼리(Marcotte), 모바일 퍼스트, Grid vs Flexbox, 컨테이너 쿼리, intrinsic web design
lang: ko
tags: ['responsive-design', 'media-queries', 'container-queries', 'css-grid', 'flexbox', 'mobile-first']
summary: "layout-grid가 그리드의 계보라면, 이 카드는 그 그리드가 화면 크기에 어떻게 적응하는가다. Ethan Marcotte(2010)가 반응형 웹 디자인을 정의한 세 재료: 유동 그리드·유연한 이미지·미디어 쿼리. Wroblewski의 모바일 퍼스트는 작은 화면부터 설계하고 min-width로 향상한다. CSS Grid(2D)와 Flexbox(1D)는 배타가 아니라 조합한다. 컨테이너 쿼리(@container)는 뷰포트가 아니라 '컴포넌트가 놓인 공간'에 반응하는 전환이다(size 쿼리 2024 Baseline). Jen Simmons의 intrinsic web design은 minmax()·auto-fit·fr로 브레이크포인트 없이 적응한다."
lintHash: '89b877cf2395'
---

> 한 줄 명제: 그리드가 화면에 맞춰 적응하게 하라 — 유동 그리드·유연한 이미지·미디어 쿼리로 시작해, 모바일 퍼스트로 쌓고, 이제는 컨테이너 쿼리로 "컴포넌트가 놓인 공간"에 반응한다.

## 핵심

[layout-grid](/wiki/design-principles/aesthetics-and-layout/layout-grid/)가 그리드의 *계보*(스위스→CSS Grid)라면, 이 카드는 ==그 그리드가 **뷰포트에 어떻게 적응하는가**== — 반응형/적응형의 차원이다.

**반응형 웹 디자인의 세 재료.** Ethan Marcotte가 2010년 A List Apart에서 용어를 만들며 명시했다: =="유동 그리드(fluid grids), 유연한 이미지(flexible images), 미디어 쿼리(media queries) — 이 셋이 반응형의 기술 재료이며, 더해 다른 사고방식이 필요하다."==

- **유동 그리드** — 컬럼을 고정 px가 아니라 비례 단위로.
- **유연한 이미지** — 미디어가 컨테이너 안에서 스케일.
- **미디어 쿼리** — 뷰포트 특성에 따라 조건부로 레이아웃 변경. 관용구 `@media (min-width: 600px) { … }`(`min-width`=`>=`). CSS Media Queries L4는 범위 문법 `@media (400px <= width <= 1000px)`도 추가.

**모바일 퍼스트.** Luke Wroblewski 《Mobile First》(2011): ==작은 화면을 먼저 설계==하면 콘텐츠·액션의 우선순위가 강제된다. 운영상 ==`min-width`로 위로 향상(progressive enhancement)==하는 것이 `max-width`로 아래를 땜질하는 것보다 낫다.

**Grid vs Flexbox — 배타가 아니라 조합.** W3C 스펙 기준: ==Flexbox는 **1차원**(행 *또는* 열), CSS Grid는 **2차원**(행 *과* 열 동시).== MDN 판단 규칙: 한 축만 제어하면 Flexbox, 두 축이면 Grid. 둘은 Box Alignment 속성을 공유하고 서로 중첩되므로 함께 쓴다(단 두 스펙 모두 아직 CR 드래프트).

**컨테이너 쿼리 — 뷰포트에서 공간으로.** ==미디어 쿼리가 "뷰포트"를 검사한다면, 컨테이너 쿼리(`@container`)는 "요소가 실제로 놓인 컨테이너의 크기"에 반응==한다 — 뷰포트-only 반응형을 넘어서는 전환이다. `container-type: inline-size`로 컨테이너를 정하고 `@container (min-width: 400px) { … }`로 질의(단위 `cqw/cqi` 등). ==size 쿼리는 2024 Baseline==, style 쿼리(커스텀 프로퍼티 질의)는 더 새롭다. 컴포넌트가 사이드바에 있든 본문에 있든 스스로 적응하므로 디자인 시스템에 특히 강력하다.

**Intrinsic web design.** Jen Simmons(2018)의 개념 — 고정 그리드+브레이크포인트를 넘어 현대 CSS(`fr`·`minmax()`·`repeat(auto-fit, …)`·`min/max/clamp()`)로 적응한다. 정수 관용구: ==`grid-template-columns: repeat(auto-fit, minmax(30ch, 1fr))`== — 브레이크포인트 없이 들어갈 만큼 컬럼을 만들고 각각 하한과 공평한 몫 사이로([fluid-typography](/wiki/design-principles/aesthetics-and-layout/fluid-typography/)의 clamp와 같은 계열).

**디자인 시스템 사례.** Material 3은 폭 기반 5단계 — Compact(<600) / Medium(600–839) / Expanded(840–1199) / Large(1200–1599) / Extra-large(≥1600 dp) — 로 ==임의 픽셀 대신 의미 있는 소수의 브레이크포인트==를 두고, 그에 따라 bottom nav→navigation rail, 1→2→3 pane으로 적응한다.

**Gotcha**: Grid/Flexbox 스펙은 아직 W3C **Recommendation이 아니라 CR 드래프트**. 컨테이너 style 쿼리는 아직 Baseline 아님. Material 브레이크포인트 dp는 SPA라 스니펫 확인. Apple은 named 브레이크포인트가 아니라 축별 size class(regular/compact)를 쓴다(이번 미확인).

## 레퍼런스

- [Ethan Marcotte, Responsive Web Design (A List Apart, 2010-05-25)](https://alistapart.com/article/responsive-web-design/) — 1차(용어 창시). 세 재료: 유동 그리드·유연한 이미지·미디어 쿼리. 책 [*Responsive Web Design*](https://abookapart.com/products/responsive-web-design.html)(A Book Apart, 2011, ISBN 978-0-984442-57-7).
- [Luke Wroblewski, *Mobile First* (A Book Apart, 2011)](https://abookapart.com/products/mobile-first) — 1차(ISBN 978-1-937557-02-7). 작은 화면 먼저·min-width 향상.
- [W3C — Media Queries L4](https://www.w3.org/TR/mediaqueries-4/)·[L5](https://www.w3.org/TR/mediaqueries-5/) · [MDN Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) — 1차/규범. 브레이크포인트·범위 문법.
- [W3C — CSS Grid Layout L1](https://www.w3.org/TR/css-grid-1/) · [CSS Flexbox L1](https://www.w3.org/TR/css-flexbox-1/) · [MDN Grid↔other methods](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Relationship_of_grid_layout_with_other_layout_methods) — 1차. 2D vs 1D, 조합(둘 다 CR 드래프트).
- [W3C — CSS Containment L3](https://www.w3.org/TR/css-contain-3/) · [MDN Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) — 1차. `@container`·`container-type`(size 쿼리 2024 Baseline).
- [Jen Simmons, Intrinsic Web Design (2018)](https://noti.st/jensimmons/h0XWcf) — 2차(개념). minmax()·auto-fit·fr로 브레이크포인트 없는 적응.
- [Material 3 — Breakpoints](https://m3.material.io/foundations/layout/breakpoints/overview) — 1차(SPA, dp 스니펫). 5단계 window size class.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 그리드 계열(계보→적응)의 적응 차원.
- [layout-grid](/wiki/design-principles/aesthetics-and-layout/layout-grid/) — 이 카드가 확장하는 그리드의 계보·구조.
- [fluid-typography](/wiki/design-principles/aesthetics-and-layout/fluid-typography/) — clamp()·뷰포트 단위로 크기를 잇는 형제 기법.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 브레이크포인트별 spacing·density 조정.
- [navigation-and-ia](/wiki/design-principles/usability/navigation-and-ia/) — 내비게이션이 화면 크기에 따라 적응(노출↔숨김).
