---
type: Reference
title: 시각 위계 (Visual Hierarchy)와 Pre-attentive 처리
pubDate: '2026-07-10T16:45:20+09:00'
resource: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
description: 크기·색·대비·위치로 눈이 볼 순서를 만드는 시각 위계 — 의식적 읽기 이전(pre-attentive)에 병렬 처리되는 지각 특성에 기댄다
lang: ko
tags: ['visual-hierarchy', 'pre-attentive', 'focal-point', 'contrast', 'typography', 'perception']
summary: "시각 위계는 요소를 배치해 '눈이 의도된 중요도 순서로 소비하도록' 유도하는 것이다. 근거는 pre-attentive 처리 — Treisman & Gelade(1980)의 특징 통합 이론에 따르면 색·형태·위치 같은 개별 특징은 초기·자동·병렬로(시각화 전통에서 ≤200~250ms) 등록되고, 그 뒤 초점 주의가 특징을 결합한다. 그래서 크기·대비·색·위치가 읽기 전에 '어디를 먼저 볼지'를 정한다. 핵심 도구는 대비이며(강조는 상대적 — 다 강조하면 아무것도 강조 안 됨), Gestalt와 같은 지각 기반을 공유한다."
lintHash: '9a8da88bffba'
---

> 한 줄 명제: 눈은 읽기 전에 이미 어디를 볼지 정한다 — 크기·대비·색·위치로 초점과 순서를 만들되, 다 강조하면 아무것도 강조되지 않는다.

## 핵심

시각 위계는 ==요소를 배치해 "눈이 의도된 중요도 순서로 각 요소를 소비하도록" 유도==하는 것이다(NN/g 정의). 이 카드가 미감·레이아웃 축에 있지만, 그 작동 근거는 지각 심리학이라 [Gestalt](/wiki/design-principles/usability/gestalt-principles/)와 형제다.

**Pre-attentive 처리.** 근거는 Anne Treisman & Garry Gelade(1980)의 특징 통합 이론(feature-integration theory)이다. ==색·형태·방향·위치 같은 개별 특징은 시각 초기 단계에서 자동·병렬로 시야 전체에 등록==되고, 객체 식별(특징들의 결합)은 그 뒤 **초점 주의**가 필요한 별도 단계에서 일어난다. 시각화 전통(Ware·Healey)은 이 병렬 단계를 ==대략 200~250ms 이하("한 번 볼" 시간)==로 조작화하며, 이 특성들은 **pop-out**(방해 자극 수와 무관하게 탐지) 한다. Colin Ware는 pre-attentive 특성을 **형태(form)·색(color)·운동(motion)·공간 위치(spatial position)** 네 범주로 묶는다.

즉 ==크기·대비·색·위치는 사용자가 "읽기" 전에 이미 무엇을 먼저 볼지 정한다.== 이것이 위계의 물리적 근거다.

**위계를 만드는 레버**(NN/g·IxDF):

- **크기(scale)** — 클수록 중요. NN/g는 ==크기 단계를 3개 이하==로 권한다.
- **색·대비(color & contrast)** — 밝고 채도 높은 색, 굵은 굵기가 눈을 끈다. ==대비가 위계의 핵심 도구==다.
- **위치(position)** — 상단·좌측이 먼저 스캔된다. NN/g의 아이트래킹(232명)에서 나온 ==F-패턴("두 개의 수평 줄 + 왼쪽 세로 줄")==, 그리고 Z-패턴·layer-cake가 읽기 동선을 설명한다.
- **간격·그루핑(proximity/common region)** — [Gestalt 근접성](/wiki/design-principles/usability/gestalt-principles/)·[spacing](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)으로 묶어 위계를 보조.
- **타이포 위계** — 크기·굵기·색으로 [타입 스케일](/wiki/design-principles/aesthetics-and-layout/typographic-scale/)이 읽는 순서를 만든다.

**핵심 원칙: 강조는 상대적이다.** =="다 강조하면 아무것도 강조되지 않는다"== — 초점은 이웃과의 차이에서만 생긴다. 그래서 크기·대비·색의 종류를 의도적으로 제한한다(NN/g: 크기 ≤3, 주 색 2 + 보조 2).

**Gestalt와의 관계.** 둘 다 의식적 읽기 이전의 같은 지각 기반에서 작동한다. ==Gestalt는 "무엇이 함께 묶이는가"를, 시각 위계는 "무엇이 가장 중요한가·어떤 순서인가"를 답한다== — 그래서 함께 설계해야 한다.

**Gotcha**: "≤200ms" 수치는 시각화 전통(Ware/Healey)의 조작화이지 Treisman 1980 원문 표현이 아니다 — 병렬-vs-직렬 메커니즘이 Treisman의 기여이고 밀리초 임계는 후대 것. "다 강조하면…" 격언은 특정 1차 출처 없는 디자인 통념이다. 대비를 *강조*에 쓰는 것과 [WCAG 명도 대비](/wiki/design-principles/color-and-contrast/)(판독성)는 다른 목표다 — WCAG를 만족해도 위계는 평평할 수 있다.

## 레퍼런스

- [Treisman, A. & Gelade, G. (1980), A feature-integration theory of attention — *Cognitive Psychology* 12(1), 97–136](https://doi.org/10.1016/0010-0285(80)90005-5) — 1차. pre-attentive 병렬 등록 vs 초점 주의 결합의 원 논문.
- Colin Ware, *Information Visualization: Perception for Design* (3e 2012 / 4e 2019) — 1차(정본, ISBN 978-0-12-381464-7 / 978-0-12-812875-6). pre-attentive 특성 4범주(형태·색·운동·위치).
- [Healey, Perception in Visualization (NC State)](https://www.csc2.ncsu.edu/faculty/healey/PP/) — 2차(학술). pre-attentive ≤200~250ms, pop-out.
- [NN/g — Visual Hierarchy in UX: Definition (2021)](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) — 2차. 정의와 레버(크기≤3·대비·그루핑).
- [NN/g — F-Shaped Pattern of Reading (Nielsen 2006)](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/) — 2차(자체 아이트래킹, 232명). 읽기 동선 F-패턴.
- [IxDF — What is Visual Hierarchy?](https://www.interaction-design.org/literature/topics/visual-hierarchy) — 2차. 8요소(크기·색·대비·정렬·반복·근접·여백·스타일).

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 시각 조직의 "무엇이 먼저인가" 축.
- [gestalt-principles](/wiki/design-principles/usability/gestalt-principles/) — 같은 pre-attentive 기반의 형제("무엇이 묶이는가").
- [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/) · [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 위계를 만드는 크기·간격 도구.
- [color-and-contrast](/wiki/design-principles/color-and-contrast/) — 대비를 강조(위계)에 쓰는 것 vs 판독성(WCAG)의 구분.
- [cognitive-load-and-density](/wiki/design-principles/usability/cognitive-load-and-density/) — 위계는 주의 부하를 낮추는 수단.
