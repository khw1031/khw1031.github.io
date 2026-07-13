---
type: Reference
title: Fluid Typography (clamp · 뷰포트 단위)
pubDate: '2026-07-10T16:30:30+09:00'
resource: https://www.w3.org/TR/css-values-4/#funcdef-clamp
description: CSS clamp()와 뷰포트 단위로 타입 스케일을 화면 폭에 매끄럽게 잇는 반응형 타이포 — 브레이크포인트 없이 크기를 보간하되 사용자 확대를 깨지 않는 기법
lang: ko
tags: ['fluid-typography', 'clamp', 'viewport-units', 'responsive', 'css', 'accessibility']
summary: "고정 타입 스케일을 브레이크포인트마다 바꾸는 대신, CSS clamp(MIN, VAL, MAX)와 뷰포트 단위(vw)로 화면 폭에 따라 글자 크기를 연속 보간하는 기법. clamp는 max(MIN, min(VAL, MAX))로 해석돼 하한·상한 사이에서 선호값을 따른다. 핵심 관용구는 font-size: clamp(하한, rem항 + vw항, 상한). 단 vw만 쓰면 사용자 확대(WCAG 1.4.4 Resize Text, 200%)를 깨므로 선호값에 반드시 rem 항을 섞는다. Utopia는 이를 최소·최대 뷰포트의 두 스케일 사이 보간으로 확장한다."
lintHash: 'fb95c0dab633'
---

> 한 줄 명제: 브레이크포인트마다 글자 크기를 바꾸지 말고, clamp()와 vw로 화면 폭에 따라 연속 보간하라 — 단 vw만 쓰면 사용자 확대가 깨지니 선호값에 rem을 섞어라.

## 핵심

fluid typography는 [타입 스케일](/wiki/design-principles/aesthetics-and-layout/typographic-scale/)을 **뷰포트(화면 폭)에 매끄럽게 잇는** 반응형 기법이다. 전통적 반응형은 브레이크포인트마다 `font-size`를 계단식으로 바꿨지만, fluid는 ==화면 폭에 따라 크기를 **연속 보간**==해 계단을 없앤다. 핵심 도구가 CSS `clamp()`다.

`clamp()`는 CSS Values and Units Level 4에 정의된 비교 함수로(min·max와 한 묶음), 시그니처는 **`clamp(MIN, VAL, MAX)`** — 최소·선호·최대 세 값을 받아 ==`max(MIN, min(VAL, MAX))`로 해석==된다. 즉 선호값 VAL이 MIN보다 작으면 MIN, MAX보다 크면 MAX, 그 사이면 VAL을 쓴다. 여기에 뷰포트 단위 **`vw`**(1vw = 뷰포트 폭의 1%)를 선호값에 넣으면 폭에 따라 값이 선형으로 자란다.

canonical 관용구:

```css
/* 하한 1rem, 상한 3rem, 그 사이는 폭에 비례해 연속 증가 */
h1 { font-size: clamp(1rem, 1rem + 2vw, 3rem); }
```

**접근성 함정(중요).** ==`font-size`를 `vw`만으로 주면 크기가 뷰포트에만 묶여 사용자의 브라우저 글자 확대·줌을 무시==한다 — 이는 WCAG 2.1 SC **1.4.4 Resize Text (AA, "텍스트를 200%까지 확대해도 손실 없이")** 를 깰 수 있다. 그래서 선호값에는 ==반드시 `rem`(또는 `em`) 항을 섞는다== (`1rem + 2vw`). rem 항이 사용자 설정에 반응하는 하한을 유지해, 유동성과 확대 가능성을 함께 지킨다.

**스케일로 확장.** 개별 값이 아니라 스케일 전체를 유동화한 것이 **Utopia**(Trys Mudford·James Gilyead)다. 최소 뷰포트와 최대 뷰포트 각각에 타입/스페이스 스케일을 정의하고, 그 사이를 현재 뷰포트 폭으로 보간해 브레이크포인트 없이 각 스텝을 잇는 `clamp()` 커스텀 프로퍼티를 생성한다 — [모듈러 스케일](/wiki/design-principles/aesthetics-and-layout/typographic-scale/)의 반응형 후예다.

**Gotcha/버전**: (1) `clamp()`는 2020-07부터 주요 브라우저 Baseline "widely available". (2) CSS Values L4는 시점에 따라 W3C 스냅샷 상태가 바뀐다(페치 시점 "Working Draft, 2024-03-12") — 살아있는 정의는 CSSWG editor's draft. (3) 모바일 UI가 접혔다 펴지는 문제엔 `svh/lvh/dvh`(small/large/dynamic viewport) 단위가 있으나 `dvh`는 스크롤 중 리플로우 비용이 있다.

## 레퍼런스

- [W3C — CSS Values and Units L4, clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp) — 1차/규범. §10.2 비교 함수. `clamp(MIN,VAL,MAX)` = `max(MIN, min(VAL,MAX))`. (살아있는 정의: [CSSWG ED](https://drafts.csswg.org/css-values-4/#comp-func))
- [MDN — clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) · [MDN — length(뷰포트 단위)](https://developer.mozilla.org/en-US/docs/Web/CSS/length) — 1차/vendor-neutral. 해석 규칙, `vw`=뷰포트 폭 1%, `sv*/lv*/dv*` 변형.
- [W3C WAI — Understanding SC 1.4.4 Resize Text (WCAG 2.1, AA)](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html) — 1차/규범. "200%까지 확대해도 손실 없이." vw-only의 접근성 위험 근거.
- [CSS-Tricks — Simplified Fluid Typography (2019)](https://css-tricks.com/simplified-fluid-typography/) — 2차. `clamp(하한, rem+vw, 상한)` 관용구와 rem 항의 접근성 헤지.
- [Utopia (utopia.fyi)](https://utopia.fyi/) — 2차. 두 뷰포트 사이 보간으로 스케일 전체를 유동화(브레이크포인트 없이).

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 타입 스케일의 반응형 확장.
- [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/) — fluid가 유동화하는 대상(모듈러 스케일).
- [readability-measure](/wiki/design-principles/aesthetics-and-layout/readability-measure/) — clamp()로 measure(폭)도 뷰포트에 맞춰 조절.
- [touch-target-size](/wiki/design-principles/usability/touch-target-size/) — 크기·확대의 접근성(WCAG) 축에서 만남.
