---
type: Reference
title: 가독성과 Measure (줄 길이)
pubDate: '2026-07-10T16:30:00+09:00'
resource: https://practicaltypography.com/line-length.html
description: 본문 가독성의 핵심 변수인 measure(한 줄 길이)와 행간 — 인쇄 전통의 45~90자 규칙이 웹 본문 설계로 이어진 계보
lang: ko
tags: ['readability', 'measure', 'line-length', 'typography', 'accessibility']
summary: "measure(한 줄에 담기는 글자 수)는 본문 가독성을 좌우하는 인쇄 전통의 핵심 변수다. 너무 길면 다음 줄 첫머리를 놓치고, 너무 짧으면 눈이 자주 되돌아 리듬이 깨진다. Butterick의 Practical Typography는 평균 45~90자(공백 포함)를 권한다. 웹 표준 WCAG 2.1 SC 1.4.8(AAA)은 본문 폭 80자(CJK 40자) 이하 + 행간 1.5·문단 간격 1.5×를 규정한다. CSS에서는 ch 단위(0의 폭)로 measure를 직접 제어한다."
lintHash: 'f15b38261f9a'
polishHash: 'f15b38261f9a'
---

> 한 줄 명제: 한 줄이 너무 길면 다음 줄을 놓치고 너무 짧으면 눈이 자주 되돌아온다 — 본문은 45~90자(웹 표준은 80자 이하)가 편안하다.

## 핵심

**Measure**는 한 줄에 담기는 글자 수(줄 길이)를 가리키는 인쇄 용어로, ==본문 가독성을 좌우하는 가장 큰 변수 중 하나==다. 원리는 눈의 움직임이다: 줄이 너무 길면 한 줄을 다 읽고 다음 줄 첫머리로 되돌아올 때 자리를 놓치기 쉽고(doubling/skipping), 너무 짧으면 눈이 너무 자주 줄바꿈해 읽기 리듬이 끊긴다. 그래서 좋은 본문은 폭이 넓다고 100% 채우지 않고 **measure를 의도적으로 제한**한다.

권장 범위:

- **Butterick, *Practical Typography*** — 평균 **45~90자**(공백 포함). 대안적 "알파벳 테스트": 한 줄에 알파벳 2~3벌(≈52~78자).
- **W3C WCAG 2.1 SC 1.4.8 Visual Presentation (Level AAA)** — 본문 폭 **80자(CJK는 40자) 이하**, ==문단 내 행간(leading) 최소 1.5, 문단 간격은 행간의 1.5배== 이상.

이 값들은 [타입 스케일](/wiki/design-principles/aesthetics-and-layout/typographic-scale/)·[수직 리듬](/wiki/design-principles/aesthetics-and-layout/baseline-grid-vertical-rhythm/)과 함께 본문 조판을 완성한다 — 크기(스케일)·수직 간격(리듬)·가로 폭(measure)의 삼각형이다. measure는 [Gestalt 근접성](/wiki/design-principles/usability/gestalt-principles/)이 아니라 **읽기 동선**의 문제라 별도 카드로 둘 값어치가 있다.

**웹 구현.** CSS에서 measure를 직접 제어하는 관용구는 폰트 폭에 비례하는 `ch` 단위(문자 "0"의 폭)다:

```css
.prose { max-width: 66ch; }   /* 약 66자 폭 — 45~90 범위의 편안한 중앙값 */
```

`ch`는 폰트마다 실제 글자 폭이 달라 정확히 "66자"는 아니지만, 폭을 폰트에 연동해 잡는 실용적 방법이다. 반응형에서는 `clamp()`로 뷰포트에 따라 measure를 조절할 수도 있다(→ [fluid-typography](/wiki/design-principles/aesthetics-and-layout/fluid-typography/)).

**트레이드오프**: 45~90은 라틴 본문 기준이다. CJK(한중일)는 글자당 정보 밀도가 높아 WCAG도 40자로 절반을 잡는다 — measure 규칙은 스크립트별로 재보정해야 하며 서구 값을 그대로 쓰면 한국어 본문이 지나치게 길어진다.

## 레퍼런스

- [Matthew Butterick, *Practical Typography* — Line length](https://practicaltypography.com/line-length.html) — 2차(널리 인용되는 실무 정본). 평균 45~90자, 알파벳 2~3벌 테스트.
- [W3C — Understanding SC 1.4.8: Visual Presentation (WCAG 2.1, AAA)](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html) — 1차/규범. 80자(CJK 40) 이하, 행간 1.5·문단 간격 1.5×.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 본문 조판의 가로축(measure).
- [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/) · [baseline-grid-vertical-rhythm](/wiki/design-principles/aesthetics-and-layout/baseline-grid-vertical-rhythm/) — 크기·수직 리듬과 함께 조판 삼각형을 이룸.
- [fluid-typography](/wiki/design-principles/aesthetics-and-layout/fluid-typography/) — 뷰포트에 따라 measure·크기를 잇는 반응형 기법.
- [color-and-contrast](/wiki/design-principles/color-and-contrast/) — measure와 함께 본문 판독성을 좌우하는 다른 축(대비).
