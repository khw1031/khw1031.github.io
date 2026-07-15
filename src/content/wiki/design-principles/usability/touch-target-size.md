---
type: Reference
title: 터치 타깃 최소 크기
pubDate: '2026-07-10T16:11:05+09:00'
resource: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
description: 손가락·포인터로 정확히 누를 수 있는 최소 타깃 크기 규범 — Apple 44pt, Material 48dp, WCAG 2.1(44×44 CSS px, AAA)·2.2(24×24 CSS px, AA)
lang: ko
tags: ['touch-target', 'accessibility', 'wcag', 'usability', 'mobile']
summary: "Fitts의 법칙이 물리 수치 규범으로 굳은 결과. 플랫폼별로 값이 다르다: Apple HIG 44×44 pt, Google Material 48×48 dp(≈9mm)에 타깃 간 8dp 이상. 웹 표준은 두 기준이 병존한다 — WCAG 2.1 SC 2.5.5(44×44 CSS px, Level AAA)와 WCAG 2.2 SC 2.5.8(24×24 CSS px, Level AA + 간격 예외). 24와 44는 대체가 아니라 별개 기준이다. 작은 타깃은 오조준 에러를 늘리므로 크기와 함께 '간격'이 규범에 포함된다."
lintHash: 'bcb26e811229'
polishHash: 'bcb26e811229'
---

> 한 줄 명제: 손가락은 정밀하지 않다 — Apple 44pt, Material 48dp, WCAG 2.2 최소 24 / 2.1 권장 44 CSS px. 크기만큼 타깃 사이 간격도 규범이다.

## 핵심

터치/포인터 타깃의 최소 크기는 [Fitts의 법칙](/wiki/design-principles/usability/fitts-law/)(작은 타깃 = 느리고 에러 많음)이 **검증 가능한 물리 수치**로 굳은 접근성 규범이다. 플랫폼마다 값이 다르니 정확히 구분해서 쓴다:

- **Apple Human Interface Guidelines** — 컨트롤 **최소 44 × 44 pt**. "손가락으로 정확히 누를 수 있게."
- **Google Material Design** — 터치 타깃 **최소 48 × 48 dp**(물리 ≈ 9mm, 화면 무관), 타깃 간 **8dp 이상** 간격 권장. 48dp 안에 24dp 아이콘을 담는 식.
- **W3C WCAG 2.1 — SC 2.5.5 Target Size (Level AAA)** — 포인터 타깃 **최소 44 × 44 CSS px**. 예외: Equivalent(같은 기능의 ≥44 컨트롤이 별도로 있음), Inline(문장 안 링크), User Agent Control, Essential.
- **W3C WCAG 2.2 — SC 2.5.8 Target Size (Minimum) (Level AA)** — **최소 24 × 24 CSS px**. 핵심 예외는 **Spacing**: 작더라도 각 타깃 중심의 지름 24 CSS px 원이 다른 타깃의 원과 겹치지 않으면 허용.

==중요한 구분: WCAG 24(2.2, AA)와 44(2.1, AAA)는 **대체 관계가 아니라 별개 기준**이다.== 2.2가 더 현실적인 하한(24)을 AA로 새로 넣은 것이고, 44는 여전히 AAA 권장으로 남아 있다. 법적 준수(대개 AA)를 노린다면 24 + 간격 규칙이 하한, 실사용 편의를 노린다면 Apple 44 / Material 48이 실무 기준이다.

**크기만큼 중요한 간격.** Fitts의 속도-정확도 트레이드오프 때문에 작은 타깃은 오조준을 늘린다. 그래서 규범들이 크기와 함께 **간격**을 넣는다(Material 8dp, WCAG 2.2의 24px 원 비교차 규칙). 이는 [Gestalt 근접성](/wiki/design-principles/usability/gestalt-principles/)·[spacing 시스템](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)과 직접 맞물린다.

## 레퍼런스

- [W3C — Understanding SC 2.5.8: Target Size (Minimum) (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — 1차/규범. 24×24 CSS px, Level AA, 간격 예외. WCAG 2.2는 2023-10-05 W3C Recommendation.
- [W3C — Understanding SC 2.5.5: Target Size (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) — 1차/규범. 44×44 CSS px, Level AAA.
- [Apple — UI Design Do's and Don'ts](https://developer.apple.com/design/tips/) — 1차. "44×44 pt 이상." (HIG [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)도 동일.)
- [Material Design — Accessibility (M1)](https://m1.material.io/usability/accessibility.html) — 1차. 48×48dp(≈9mm), 타깃 간 8dp.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. Fitts가 물리 규범으로 굳은 결과.
- [Fitts의 법칙](/wiki/design-principles/usability/fitts-law/) — 이 수치들의 이론적 근거.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 타깃 간 간격(8dp)이 spacing 스케일과 만나는 지점.
- [Material Design](/wiki/design-principles/material-design/) — 48dp를 시스템 규범으로 못박은 사례.
- [apple-hig](/wiki/design-principles/apple-hig/) — 44pt 최소 타깃의 구현 사례(플랫폼별 값 비교).
