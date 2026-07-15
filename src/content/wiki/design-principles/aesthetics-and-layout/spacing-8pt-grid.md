---
type: Reference
title: Spacing 시스템 (8pt 그리드 · spacing 토큰)
pubDate: '2026-07-10T16:11:30+09:00'
resource: https://m1.material.io/layout/metrics-keylines.html
description: 좋은 웹 디자인의 핵심 골격인 spacing 시스템 — 8pt(8dp) 그리드와 4px 스텝 spacing 토큰이 왜 표준이 됐는지, Material·Carbon·Polaris·Atlassian·Tailwind의 실제 스케일 비교
lang: ko
tags: ['spacing', '8pt-grid', 'design-tokens', 'whitespace', 'web-design', 'material-design']
summary: "spacing은 좋은 웹 디자인에서 가장 과소평가되면서 가장 결정적인 골격이다. 현대 디자인 시스템은 간격을 임의로 두지 않고 고정 스케일(대개 4px 기준, 8px 격자)의 토큰으로 관리한다: Material 8dp/4dp, Carbon 13스텝(2·4·8·…·160px), Polaris(4px 기준), Atlassian(8px 기준), Tailwind(4px 기준). 8을 쓰는 이유는 대부분의 화면 밀도가 8로 나눠떨어지고 @2x·@3x에서도 정수로 유지돼 결정을 줄이기 때문 — 단 이 '나눗셈' 근거는 주로 2차 출처다. spacing은 미감(리듬)이자 사용성(Gestalt 근접성으로 정보 구조 전달)이다."
lintHash: '3cf85256b9f4'
polishHash: '3cf85256b9f4'
---

> 한 줄 명제: 간격을 임의로 두지 말고 하나의 스케일(4px 기준·8px 격자)로 토큰화하라 — 8은 화면 밀도로 잘 나눠떨어지고, 간격은 미감(리듬)이자 사용성(그룹핑)이다.

## 핵심

spacing(여백·간격)은 좋은 웹 디자인에서 **가장 눈에 안 띄면서 가장 결정적인 골격**이다. 초보와 숙련의 차이가 색이나 폰트보다 간격에서 갈린다. 핵심 원칙은 하나다: ==간격을 매번 임의로 정하지 말고, **고정된 스케일의 토큰**으로 관리하라.== 그러면 (1) 일관된 시각 리듬이 생기고, (2) 매번 "몇 px?"를 고민하는 결정 비용이 사라지며, (3) [Gestalt 근접성](/wiki/design-principles/usability/gestalt-principles/)을 수치로 통제할 수 있다(그룹 내부는 좁게, 그룹 사이는 넓게).

**왜 8인가.** ==대다수 현행 디자인 시스템이 독립적으로 **4/8** 기반 스텝에 수렴==한다(Tailwind·Polaris는 4px 기준, Atlassian·Carbon은 8px 기준, Material은 8dp 격자+4dp 미세격자). 어느 한 벤더의 규범이 아니라 여러 시스템이 같은 곳에 도달했다는 점이 근거의 무게다. 흔히 드는 이유는 **나눗셈 논리** — 인기 있는 화면 해상도·밀도 대부분이 8로 나눠떨어지고, @1x를 @2x·@3x로 키워도 8의 배수는 정수 픽셀로 유지돼 프랙셔널 픽셀(흐릿한 경계)이 안 생긴다. 8은 2·4로도 나뉘어 하위 스텝(4, 2)을 준다.

**Gotcha(출처 정직성)**: ==8pt 그리드는 단일 1차 논문·스펙이 없다.== 공식 시스템(Material·Carbon)은 "8dp/8의 배수" 규칙 자체는 규범으로 말하지만, "화면이 8로 나눠떨어져서"라는 **나눗셈 근거는 주로 2차 출처**(Elliot Dahl 2016, spec.fm)에서 정리됐다. 공식 문서는 그 근거를 "일관성"으로 프레이밍한다. 즉 규칙은 1차, 대중적 정당화는 2차다.

**실제 스케일 비교**(모두 각 시스템 공식 문서/토큰 소스에서 확인). 기준 단위와 명명은 다르지만 **4px 스텝 + 8px 격자**로 수렴한다:

```text
Material   8dp 격자 + 4dp 미세격자 (컴포넌트=8, 타입·아이콘=4)
Tailwind   1 unit = 0.25rem = 4px   (2=8, 4=16, 6=24, 8=32 …)
Atlassian  base 8px                 (space.100=8, .200=16, .300=24 …)
Polaris    base 4px                 (space-100=4, -200=8, -400=16 …)
Carbon     mini-unit 8px, 13스텝     (2·4·8·12·16·24·32·40·48·64·80·96·160)
```

Carbon의 13스텝(px): 2 · 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 160. Carbon은 이 스케일이 "2·4·8의 배수로 2x 그리드·타입 스케일과 맞물린다"고 명시한다. ==공통점: 작은 값은 4의 배수(2px는 예외적 헤어라인), 커질수록 8·16의 배수로 성기게 벌어진다.==

**간격은 미감이자 사용성.** 이 카드가 미감 축에 있지만 사용성 축과 직접 맞물린다:

- **정보 구조 전달** — 근접성(Gestalt): 라벨-입력칸을 붙이고 섹션 사이를 벌리면, 텍스트 한 줄 없이 "무엇이 한 묶음인가"가 전달된다. spacing 토큰의 intra/inter 구분이 이 수치화다.
- **가독성** — 본문 줄 길이 45–90자(Butterick), WCAG 1.4.8은 80자(CJK 40자) 이하 + 행간 1.5·문단 간격 1.5×를 AAA로 규정. 여백은 읽기 부하를 낮춘다.
- **밀도(density)** — 같은 spacing도 맥락 따라 조정한다. 예컨대 한 시스템(Material)은 default/comfortable/compact 밀도를 두고 한 스텝마다 컴포넌트 높이를 줄이되 ==터치 타깃은 밀도와 무관하게 최소치를 유지==한다(→ [touch-target-size](/wiki/design-principles/usability/touch-target-size/)). 데이터 집약 UI는 compact, 집중 입력은 넉넉하게 — spacing에도 트레이드오프가 있다.

## 레퍼런스

- [Tailwind CSS — Spacing](https://tailwindcss.com/docs/customizing-spacing) — 1차. 1 unit = 0.25rem = 4px, 비례 스케일. (v4는 `--spacing` 단일 기준으로 동적 생성.)
- [IBM Carbon — Spacing](https://carbondesignsystem.com/elements/spacing/overview/) — 1차. 13스텝 스케일(값은 `@carbon/layout` 소스로 확인), "2·4·8의 배수로 2x 그리드와 맞물림".
- [Shopify Polaris — Space tokens](https://polaris-react.shopify.com/tokens/space) · [Atlassian — Spacing](https://atlassian.design/foundations/spacing) — 1차. 각각 4px·8px 기준 토큰 스케일(같은 수렴, 다른 기준 단위).
- [Material Design — Metrics & keylines](https://m1.material.io/layout/metrics-keylines.html) — 1차(단, 이 정적 페이지는 2014 M1 레거시). 8dp 격자를 규범화한 여러 시스템 중 하나의 사례.
- [Elliot Dahl, Intro to the 8-Point Grid System (2016)](https://medium.com/built-to-adapt/intro-to-the-8-point-grid-system-d2573cde8632) · [spec.fm — The 8-Point Grid](https://spec.fm/specifics/8-pt-grid) — 2차. "화면이 8로 나눠떨어짐 / @2x·@3x 정수 유지" 나눗셈 근거의 대중적 출처. hard grid vs soft grid.
- [W3C — WCAG 2.1 SC 1.4.8 Visual Presentation](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html) — 1차/규범. 80자(CJK 40) 이하, 행간 1.5·문단 간격 1.5×(AAA). [Butterick — Line length](https://practicaltypography.com/line-length.html) — 2차. 45–90자.
- [Una Kravets, Using Material Density on the Web (Google Design, 2019)](https://m3.material.io/blog/material-density-web) — 1차. default/comfortable/compact, −4px/스텝, 타깃 48px 하한 유지.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 타입 스케일·베이스라인·그리드를 하나의 격자로 통합하는 정점.
- [gestalt-principles](/wiki/design-principles/usability/gestalt-principles/) — 근접성의 수치화. **두 축(미감·사용성)을 잇는 핵심 연결.**
- [baseline-grid-vertical-rhythm](/wiki/design-principles/aesthetics-and-layout/baseline-grid-vertical-rhythm/) — 수직 간격이 4/8px 리듬 단위와 만남.
- [layout-grid](/wiki/design-principles/aesthetics-and-layout/layout-grid/) — 거터·마진이 spacing 격자와 공유됨.
- [touch-target-size](/wiki/design-principles/usability/touch-target-size/) — 타깃 간 8dp 간격, 밀도와 무관한 48px 하한.
- [Material Design](/wiki/design-principles/material-design/) — 8dp/4dp 그리드의 기관 기원.
