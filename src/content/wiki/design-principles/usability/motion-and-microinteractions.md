---
type: Reference
title: 모션과 마이크로인터랙션
pubDate: '2026-07-10T16:45:10+09:00'
updatedDate: '2026-07-10T20:55:00+09:00'
resource: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
description: 모션은 장식이 아니라 사용성 도구(피드백·연속성·주의)다 — 웹 플랫폼 애니메이션 스펙(CSS Transitions/Animations·WAAPI·easing), Disney 12원칙, 마이크로인터랙션, 다벤더 duration/easing 토큰, 접근성
lang: ko
tags: ['motion', 'animation', 'microinteractions', 'accessibility', 'prefers-reduced-motion', 'easing']
summary: "모션은 의미를 전달하는 사용성 도구다 — 상태 변화를 잇고 맥락을 보존하며 주의를 모은다. 웹 플랫폼 근거는 CSS Transitions/Animations·Web Animations API·easing-function(cubic-bezier/steps/linear())·scroll-timeline(아직 Baseline 아님). 이징의 뿌리는 Disney 12원칙의 slow-in/out·anticipation이고, 마이크로인터랙션은 trigger→rules→feedback→loops/modes(Saffer). 현행 시스템은 100–300ms 대역에 수렴한다 — Carbon(productive/expressive 곡선·70–700ms), Fluent(50–500ms·curveEasyEase), Apple(의도적·간결), Material 3은 예시 하나. 접근성이 강한 제약: WCAG 2.2.2/2.3.1/2.3.3 + prefers-reduced-motion으로 전정장애·발작·산만을 배려."
lintHash: 'c7abc6b5f987'
---

> 한 줄 명제: 모션은 장식이 아니라 의미다 — 피드백·연속성·주의 유도의 도구이되 웹 플랫폼 스펙과 Disney 원칙에 뿌리를 두고, prefers-reduced-motion·WCAG로 멀미·발작·산만을 반드시 배려하라.

## 핵심

모션은 흔히 "화려함"으로 오해되지만, 좋은 UI에서는 ==의미를 전달하는 사용성 도구==다 — 부드러운 전환이 UI 변화를 잇고 맥락을 보존해 주의를 모은다. [gulf의 평가 간극](/wiki/design-principles/usability/gulf-of-execution-evaluation/)(피드백)·[Nielsen 휴리스틱 1](/wiki/design-principles/usability/nielsen-heuristics/)(시스템 상태 가시성)과 직결된다. DESIGN.md의 Components 섹션 근거이기도 하다.

**웹 플랫폼 메커니즘 (evergreen, W3C/MDN).**

- ==`transition`== — 상태 변화(hover 등)를 property·duration·timing·delay로 보간. 기본 duration 0s.
- ==`@keyframes` + `animation`== — 다단계 애니메이션(0%~100%), iteration·direction·fill-mode.
- ==Web Animations API(`Element.animate(keyframes, options)`)== — CSS Animations/Transitions의 공통 모델을 JS로. `.play()/.pause()/.reverse()`, `getAnimations()`.
- ==`easing-function`== — 키워드↔베지어: `ease-in-out`=`cubic-bezier(0.42,0,0.58,1)`, `steps()`(이산), 그리고 스프링을 근사하는 신형 ==`linear(0, 0.25 75%, 1)`==.
- `scroll-timeline`/`view-timeline` — 스크롤 위치로 진행. **아직 Baseline 아님**.

**시간을 초월한 원칙 (evergreen).** UI 이징 곡선은 Disney 《The Illusion of Life》(1981)의 12원칙 중 ==slow-in/slow-out(ease-in/out)의 후예==이고, ==anticipation==(예비 동작)은 오버슈트·wind-up의 근거다. 마이크로인터랙션은 Dan Saffer(2013)의 ==**Trigger → Rules → Feedback → Loops & Modes**== 구조 — 방아쇠·규칙·피드백·시간에 따른 지속/모드.

**실무 duration·easing (현행 다벤더 — 수렴 관찰).** ==대부분의 UI 모션은 100–300ms 대역에 있고, 진입은 감속이 긴 ease-out을 쓴다==(끝을 강조). 벤더별 토큰:

- **IBM Carbon** — 스타일 둘: ==productive(빠름)·expressive(느림·강조)==. 표준 곡선 productive `cubic-bezier(0.2,0,0.38,0.9)` / expressive `cubic-bezier(0.4,0.14,0.3,1)`. duration 6단계 70·110·150·240·400·700ms.
- **Microsoft Fluent 2** — duration 8단계 ==50–500ms==(`durationUltraFast`~`durationUltraSlow`), `curveEasyEase`=`cubic-bezier(0.33,0,0.67,1)`.
- **Apple** — 모션은 ==의도적==이어야: 방향 유지·명확한 피드백·과하지 않게, "간결·정밀"이 가볍게 느껴짐.
- **Material 3**(한 사례) — `emphasized`=`cubic-bezier(0.2,0,0,1)`, duration short1 50ms ~ long4 600ms.

**모션 라이브러리.** ==Motion(구 Framer Motion, 현재 독립)==이 사실상의 웹 표준 도구 — WAAPI·ScrollTimeline으로 네이티브 실행(최대 120fps)하고, 스프링 물리·중단 가능 키프레임·제스처는 JS(`requestAnimationFrame`)로 폴백. 위 스펙과 직접 이어진다.

**접근성 (필수, W3C).**

- **WCAG 2.2.2 Pause/Stop/Hide (A)** — 자동 시작·5초 초과 이동/깜빡임/스크롤은 정지 수단(자동 갱신은 시간 임계 없음).
- **WCAG 2.3.1 Three Flashes (A)** — 초당 3회 초과 번쩍임 금지(발작 안전).
- **WCAG 2.3.3 Animation from Interactions (AAA)** — 비필수 상호작용 모션을 비활성화 가능해야.
- ==**`prefers-reduced-motion`**== — OS "모션 줄이기" 감지(`@media (prefers-reduced-motion: reduce)`, 2020-01 Baseline). ==없애기보다 대체(크로스페이드) 권장==. 전정장애(vestibular) 사용자에게 확대/회전/패럴랙스는 멀미를 유발(Apple Reduce Motion, WebKit "Responsive Design for Motion").

**Gotcha**: scroll-timeline은 아직 Baseline 아님. Carbon·Fluent·M3 값은 SPA라 각 시스템 repo/토큰 패키지에서 확인. Material은 여러 현행 시스템 중 한 예시이며 M1/M2(2014-era)는 인용하지 않음.

## 레퍼런스

- [MDN — Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) · [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions) · [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations) · [easing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function) · [scroll-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline) — 1차/evergreen(각 W3C 모듈).
- Frank Thomas & Ollie Johnston, *The Illusion of Life: Disney Animation* (1981) — 1차(정본, ISBN 9780896596986). 12원칙(slow-in/out·anticipation).
- Dan Saffer, *Microinteractions* (O'Reilly, 2013) — 1차(정본, ISBN 9781449342685). Trigger→Rules→Feedback→Loops/Modes.
- [W3C — SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) · [2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) · [2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) · [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — 1차/규범.
- [IBM Carbon — Motion](https://carbondesignsystem.com/elements/motion/overview/) ([@carbon/motion](https://github.com/carbon-design-system/carbon/tree/main/packages/motion)) · [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion) · [Fluent 2 — Motion](https://fluent2.microsoft.design/motion) · [Material 3 — Motion tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs) — 1차(각 시스템, 현행). duration·easing 토큰.
- [Motion (구 Framer Motion)](https://motion.dev/docs) — 1차(라이브러리). WAAPI + JS 스프링 하이브리드.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. 모션 = 피드백 도구.
- [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/) — 모션 피드백이 평가의 간극을 좁힘.
- [Nielsen 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/) — 1번(시스템 상태 가시성)을 모션이 구현.
- [touch-target-size](/wiki/design-principles/usability/touch-target-size/) · [color-and-contrast](/wiki/design-principles/color-and-contrast/) — 함께 묶이는 WCAG 접근성 축의 이웃.
- [material-design](/wiki/design-principles/material-design/) — 모션 토큰을 쓰는 한 시스템 사례(여러 벤더 중 하나).
