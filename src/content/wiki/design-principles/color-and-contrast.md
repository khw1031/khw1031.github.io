---
type: Reference
title: Color & Contrast — 팔레트(미감)와 대비(접근성)
pubDate: '2026-07-10T16:30:10+09:00'
resource: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
description: 색은 미감(체계적 톤 팔레트)이자 사용성(WCAG 명도 대비)이다 — Material·Carbon·Tailwind의 톤 스케일과 WCAG 4.5:1/3:1/7:1 대비 기준, 그리고 둘의 결합
lang: ko
tags: ['color', 'contrast', 'wcag', 'accessibility', 'design-tokens', 'palette']
summary: "색은 두 축을 가로지른다. 미감 쪽에서는 체계적 톤 팔레트가 표준이다 — Material M3의 시드→6개 톤 팔레트(0~100), M2의 50~900(500=기준), Carbon 10~100, Tailwind 50~950. 사용성 쪽에서는 WCAG 명도 대비가 하한을 정한다 — 1.4.3(AA) 본문 4.5:1·큰 텍스트 3:1, 1.4.6(AAA) 7:1/4.5:1, 1.4.11(AA) 비텍스트 3:1. 대비비는 (L1+0.05)/(L2+0.05)로 1:1~21:1. 좋은 색 설계 = 톤 스케일의 어떤 짝을 골라도 대비 기준을 만족하도록 팔레트를 구성하는 것. Material You가 그 대표 구현."
lintHash: '2829d63551bd'
---

> 한 줄 명제: 색은 미감(어떤 톤이 조화로운가)이자 사용성(어떤 짝이 읽히는가)이다 — 체계적 톤 팔레트를 만들되, 어떤 조합을 골라도 WCAG 대비 기준을 넘도록 설계하라.

## 핵심

색은 이 카테고리의 두 축을 정통으로 가로지르기 때문에 [material-design](/wiki/design-principles/material-design/)처럼 top-level 브리지 카드로 둔다. 한쪽은 **팔레트(미감)**, 다른 쪽은 **대비(접근성·사용성)** 이고, 좋은 색 설계는 이 둘을 한 시스템에서 만족시킨다.

**미감 = 체계적 톤 팔레트.** 현대 디자인 시스템은 색을 임의로 고르지 않고 ==하나의 색상(hue)을 밝기 단계(tone/grade)로 체계화한 스케일==로 관리한다([spacing 토큰](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)과 같은 토큰 사고):

```text
Radix     각 hue 12단계 = 역할별 (1~2 배경 · 3~5 컴포넌트 · 6~8 경계 · 9~10 솔리드 · 11~12 텍스트)
          같은 스텝 번호 = 어느 hue든 같은 역할 → 컴포넌트가 "step 3/6/11"을 참조
Tailwind  50·100·…·900·950 (11단계, v4는 OKLCH로 지각 균일)
Carbon    각 hue 10~100 (10단계, 흑·백은 별도)
Material  M3 시드 색 → 6 톤 팔레트, 각 톤 0(검정)~100(흰색) (한 사례)
shadcn/ui background/foreground·primary·muted… 시맨틱 쌍을 CSS 변수로 (:root/.dark)
```

세 가지 다른 멘탈 모델이 공존한다 — ==Radix의 12단계 **역할별** 스케일, Tailwind의 50–950 **밝기 램프**(OKLCH), Carbon의 10–100 **grade**==. Material의 톤 팔레트는 그중 한 사례일 뿐이며, 어느 벤더도 유일 정답은 아니다.

톤을 **의미 역할(semantic role)** 에 매핑하는 것이 핵심이다 — M3의 "Primary / On Primary / Surface" 같은 역할 토큰은 값이 아니라 톤을 가리켜, 테마(라이트/다크)를 바꿔도 대비가 유지된다.

**사용성 = WCAG 명도 대비.** 팔레트가 아무리 예뻐도 읽히지 않으면 실패다. W3C WCAG가 검증 가능한 하한을 정한다:

- **SC 1.4.3 Contrast (Minimum), AA** — 본문 텍스트 **4.5:1**, 큰 텍스트 **3:1**. "큰 텍스트" = 18pt(≈24px) 이상 또는 14pt bold(≈18.66px) 이상.
- **SC 1.4.6 Contrast (Enhanced), AAA** — 본문 **7:1**, 큰 텍스트 **4.5:1**.
- **SC 1.4.11 Non-text Contrast, AA**(WCAG 2.1 신설) — UI 컴포넌트·의미 있는 그래픽 요소 **3:1**(비활성 컴포넌트·로고 등은 예외).

대비비는 ==`(L1+0.05)/(L2+0.05)`==(L=상대 휘도, 밝은 쪽 L1)로 계산돼 **1:1(동일)~21:1(흑백)** 범위다. 상대 휘도는 `L = 0.2126R + 0.7152G + 0.0722B`(각 채널을 sRGB 선형화 후). ==대비비는 임계값이라 반올림 금지 — 4.499:1은 4.5:1을 통과하지 못한다.==

**두 축의 결합.** 좋은 색 설계는 ==톤 스케일에서 어떤 짝을 골라도 대비 기준을 넘도록 팔레트를 구성==하는 것이다. Radix가 "스텝 11·12는 텍스트, 12는 밝은 배경에서 접근 가능한 대비 보장"으로 스케일 자체에 대비를 굳히는 것이 한 방식이고, Material You(M3 동적 색)가 또 하나의 사례 — 사용자 배경에서 시드 색을 뽑아 톤을 생성하되 함께 쓰이는 두 톤이 어떤 시작 색에서도 접근 가능한 대비를 보장하도록 짝지어진다(→ [material-design](/wiki/design-principles/material-design/)). 공통 원리는 벤더와 무관하다: ==대비를 런타임 조합에 맡기지 말고 스케일 설계 단계에서 보장하라.==

**Gotcha / 버전**: (1) sRGB 선형화 임계값은 현재 **0.04045**다 — 2021-05 이전 문서의 `0.03928`을 보면 최신값과 헷갈리지 말 것. (2) 1.4.3/1.4.6은 WCAG 2.0부터, **1.4.11은 2.1 신설**, 셋 다 2.2로 그대로 계승. (3) **APCA**(지각 균일 Lc 대비, WCAG 3 후보)는 흥미롭지만 **아직 요구사항이 아니다** — 2023년경 WCAG 3 초안에서 합의 부족으로 빠졌고 WCAG 3 자체가 초기 Working Draft(~2028+ 예상)다. 오늘 법적·집행 기준은 여전히 WCAG 2.x 대비비.

## 레퍼런스

- [W3C — Understanding SC 1.4.3 Contrast (Minimum), AA](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) — 1차/규범. 4.5:1/3:1, "큰 텍스트" 18pt·14pt bold 정의.
- [W3C — Understanding SC 1.4.6 Contrast (Enhanced), AAA](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html) · [SC 1.4.11 Non-text Contrast, AA](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) — 1차/규범. 7:1/4.5:1, 비텍스트 3:1.
- [W3C — Technique G17 (대비비·상대 휘도 공식)](https://www.w3.org/WAI/WCAG21/Techniques/general/G17) — 1차. `(L1+0.05)/(L2+0.05)`, 휘도 계수, 임계값 0.04045(구 0.03928).
- [WebAIM — Contrast and Color Accessibility](https://webaim.org/articles/contrast/) — 2차. 큰 텍스트 px 환산(24px / 18.66px bold), 실무 요약.
- [Radix Colors — Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) — 1차. 12단계 역할별 스케일(배경→경계→텍스트). 현행 웹의 대표 색 모델.
- [Tailwind CSS — Colors](https://tailwindcss.com/docs/colors) · [IBM Carbon — Color](https://carbondesignsystem.com/elements/color/overview/) — 1차. 50~950(OKLCH) / 10~100 grade 스케일.
- [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming) — 1차. 시맨틱 색 변수 쌍(background/foreground…)으로 테마(현행 웹 관행).
- [Material 3 — Color system](https://m3.material.io/styles/color/system/overview) — 1차(SPA, 스니펫). 시드→6 톤 팔레트(한 사례).
- [W3C — WCAG 3.0 (Working Draft)](https://www.w3.org/TR/wcag-3.0/) — 1차. APCA를 탐색한 차기 표준의 초기 상태(요구사항 아님).

## 연결

- [Design Principles](/wiki/design-principles/) — 이 카드가 브리지로 붙는 상위 허브(두 축).
- [material-design](/wiki/design-principles/material-design/) — Material You 동적 색이 팔레트↔대비 결합의 대표 구현.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 색 톤 스케일과 같은 "토큰 스케일" 사고의 형제.
- [touch-target-size](/wiki/design-principles/usability/touch-target-size/) · [readability-measure](/wiki/design-principles/aesthetics-and-layout/readability-measure/) — 함께 본문·컨트롤 판독성을 정하는 WCAG 접근성 축의 이웃.
- [aesthetic-usability-effect](/wiki/design-principles/usability/aesthetic-usability-effect/) — 색의 미감이 사용성 인식에 미치는 영향의 실증.
