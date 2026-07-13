---
type: Reference
title: 엘리베이션과 깊이 (z축·그림자)
pubDate: '2026-07-10T16:45:30+09:00'
updatedDate: '2026-07-10T20:55:00+09:00'
resource: https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow
description: DESIGN.md의 Elevation & Depth 섹션 근거 — z축 위계를 그림자·색·머티리얼로 표현. 빛-위에서-온다 지각, CSS box-shadow·drop-shadow·z-index, 그리고 현행 다벤더 그림자 스케일
lang: ko
tags: ['elevation', 'depth', 'shadow', 'z-index', 'layering', 'design-tokens']
summary: "깊이는 z축으로 표면 간 위계를 표현하는 것이다. 지각 근거는 Ramachandran(1988)의 '빛은 위에서 온다' 가정 — 위에서 진 그림자는 '올라옴', 반대는 '들어감'으로 읽힌다. 웹 프리미티브는 box-shadow(사각 박스), filter:drop-shadow(알파 윤곽), z-index/stacking context(opacity·transform·filter가 조용히 새 컨텍스트 생성). 현행 디자인 시스템은 무거운 스키어모픽 그림자 대신 낮은 불투명도의 다층 그림자(Tailwind ≤0.1, Fluent key+ambient, Radix 알파+1px 링)나 색 기반 레이어링(Carbon layer 토큰, Material 3 톤 엘리베이션, Apple 반투명 머티리얼)로 이동했다. 단 완전 플랫은 클릭 단서를 없애 역효과(NN/g)."
lintHash: 'b3a2bfb78f99'
---

> 한 줄 명제: 깊이는 "빛은 위에서 온다"는 지각을 이용해 z축 위계를 만드는 것 — 현행 흐름은 무거운 그림자가 아니라 낮은 불투명도 다층 그림자 + 색/머티리얼 기반 레이어링이다.

## 핵심

엘리베이션은 ==z축을 따라 표면들이 서로 다른 높이에 놓여 위계·관계를 표현==하는 것이다. 어느 카드가 앞이고 무엇이 바탕인지, 무엇이 눌러지는지를 깊이로 전달한다. DESIGN.md의 **Elevation & Depth** 섹션 근거다.

**왜 그림자가 깊이로 읽히나 (지각, evergreen).** Ramachandran(1988, *Nature* "Perception of shape from shading")은 ==시각계가 "빛은 위에서 온다"는 사전 가정(light-from-above prior)==을 가진다고 보였다 — 진화적으로 태양이 머리 위 하나였기에. 그래서 위에서 진 그림자는 "올라온(convex)" 것으로, 안쪽/반전 그림자는 "들어간(concave)" 것으로 지각된다. 이것이 top-lit 그림자가 "떠 있다"로 읽히는 이유다.

**웹 프리미티브 (evergreen, W3C/MDN).**

- ==`box-shadow`== — `offset-x offset-y blur spread color`, `inset`으로 내부 그림자. ==쉼표로 여러 그림자를 겹치면 먼저 쓴 것이 위==. 레이아웃 크기에 영향 없음(순수 시각).
- ==`filter: drop-shadow()`== — box-shadow와 달리 ==사각 박스가 아니라 요소의 **알파 윤곽**(투명 부분 포함 실제 모양)에 그림자==. `spread`·`inset` 없음. 비사각 아이콘·PNG에 적합.
- ==`z-index` / stacking context== — 같은 컨텍스트 안에서 정수가 클수록 앞. **Gotcha**: `opacity<1`·`transform`·`filter`·`will-change` 등이 조용히 새 stacking context를 만들어, 자식은 부모 슬롯을 벗어나지 못한다("버전 번호" 모델). (참고: "레이어드 섀도우" 전용 스펙은 없다 — box-shadow L3의 다중 그림자 기능일 뿐.)

**현행 다벤더 그림자·레이어링 스케일 (de-Material의 핵심 — 모두 낮은 불투명도·다층).**

- **Tailwind v4** — `shadow-xs`~`shadow-2xl`. ==대부분 **두 개의 그림자를 겹치고 알파 ≤0.1**==(2xl만 0.25). v4에서 라벨이 한 칸씩 밀렸다(구 `shadow-sm`→`shadow-xs`).
- **Radix Themes** — 6단계(`--shadow-1`~`-6`). ==알파 색 변수(`--gray-aN`·`--black-aN`) 기반이라 라이트/다크 자동 적응==, 매 단계 `0 0 0 1px` **1px 링 + 블러**를 겹치는 독특한 기법.
- **Microsoft Fluent 2** — ==key(선명·방향) + ambient(부드러운·확산) 그림자 쌍==. 이름의 숫자 = 블러 px(shadow2~shadow64). ==다크 모드는 불투명도를 14%→28%로 올린다.== 유색 표면용 휘도 공식까지 제공.
- **IBM Carbon** — ==깊이를 그림자가 아니라 **색 레이어 토큰**(`layer-01/02/03`)으로 표현==하고, 그림자는 메뉴·드롭다운 같은 일시적 오버레이에만.
- **GitHub Primer** — small/medium/large 기능 토큰(작을수록 살짝 올라옴, 클수록 확산·"드물게").

**색/머티리얼 기반 깊이 (그림자 없이).**

- **Apple** — dp 그림자 대신 ==반투명·블러 "머티리얼" + vibrancy==로 전경/배경 층을 분리(2025 WWDC의 "Liquid Glass"가 최신 방향).
- **Material 3**(한 사례) — ==톤 엘리베이션: 높을수록 **주색(primary) 슬롯의 톤 오버레이(surface tint)** 를 입힌다==. `Surface`가 `tonalElevation`·`shadowElevation`을 분리 노출 — 깊이를 그림자와 분리.

**트렌드(현행, 근거 있음).** ==무거운 스키어모픽 그림자는 지났고, 낮은 불투명도 다층 그림자 + 색/톤 기반 레이어링이 현재 기본==이다(위 스케일들이 증거 — 다 알파를 낮게 잡는다). 단 반대 극단도 근거가 있다: NN/g 아이트래킹(2017)은 ==약한 단서의 플랫 UI가 시선 시간 22%·고정 25%를 늘렸다== — 3D 효과는 가장 강한 클릭 가능성 단서 중 하나다. "플랫이 적이 아니라 단서 없음이 적"이며, 깊이는 정제된 반투명·미세 레이어링으로 돌아오는 중이다.

**Gotcha**: M3 elevation 페이지·Apple HIG·Primer의 정확한 수치는 SPA/미확인이라 인용하지 않았다(개념·API는 확인). 이 카드는 특정 벤더가 아니라 지각 원리 + 웹 프리미티브 + 다벤더 패턴으로 근거한다.

## 레퍼런스

- [Ramachandran, V.S. (1988), Perception of shape from shading — *Nature* 331, 163–166](https://www.nature.com/articles/331163a0) — 1차(peer-review). "빛은 위에서 온다" 사전 가정. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/3340162/))
- [MDN — box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) · [filter: drop-shadow()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) · [Stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context) — 1차/evergreen(W3C CSS Backgrounds L3·Filter Effects L1·Positioned Layout).
- [Tailwind CSS — box-shadow](https://tailwindcss.com/docs/box-shadow) · [Radix Themes — Shadows](https://www.radix-ui.com/themes/docs/theme/shadows) · [Microsoft Fluent 2 — Elevation](https://fluent2.microsoft.design/elevation) · [IBM Carbon — Color/Layer 토큰](https://carbondesignsystem.com/elements/color/tokens/) · [GitHub Primer — box-shadow](https://primer.style/product/css-utilities/box-shadow/) — 1차(각 시스템). 현행 다벤더 그림자·레이어링 스케일.
- [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials) — 1차(SPA). 반투명·vibrancy 깊이. [Material 3 — Tone-based surface color](https://m3.material.io/blog/tone-based-surface-color-m3) — 1차. 톤 엘리베이션(한 사례).
- [NN/g — Flat UI Elements Attract Less Attention (2017)](https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/) — 2차. 약한 단서 시선 +22%·고정 +25%, 깊이=클릭 단서.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브.
- [DESIGN.md](/wiki/design-principles/design-md/) — 이 카드는 DESIGN.md의 **Elevation & Depth** 섹션 근거.
- [color-and-contrast](/wiki/design-principles/color-and-contrast/) — 색 기반 레이어링(Carbon·M3 톤)이 색과 만나는 지점.
- [shape-and-corner-radius](/wiki/design-principles/aesthetics-and-layout/shape-and-corner-radius/) · [visual-hierarchy](/wiki/design-principles/aesthetics-and-layout/visual-hierarchy/) — 형태·깊이가 함께 위계를 만듦.
- [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/) — 올라와 보임 = "눌릴 수 있음"의 어포던스 신호.
- [material-design](/wiki/design-principles/material-design/) — 톤 엘리베이션을 쓰는 한 시스템 사례(여러 벤더 중 하나).
