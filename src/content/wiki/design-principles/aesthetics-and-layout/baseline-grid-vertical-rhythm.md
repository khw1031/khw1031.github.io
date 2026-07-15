---
type: Reference
title: Baseline Grid & 수직 리듬 (Vertical Rhythm)
pubDate: '2026-07-10T16:11:20+09:00'
resource: https://24ways.org/2006/compose-to-a-vertical-rhythm/
description: 인쇄의 베이스라인 그리드가 웹의 수직 리듬으로 계승된 계보 — line-height를 기본 단위로 삼고 모든 수직 간격을 그 배수로 둔다
lang: ko
tags: ['baseline-grid', 'vertical-rhythm', 'typography', 'line-height', 'css']
summary: "인쇄에서 텍스트가 일정한 베이스라인에 정렬되던 규칙이 웹으로 넘어와 '수직 리듬'이 됐다. Richard Rutter(24 ways, 2006)가 그 웹 규칙을 정식화했다: line-height를 기본 리듬 단위로 정하고, 모든 수직 측정(line-height·margin·padding)을 그 단위의 배수(또는 깔끔한 약수)로 둬, 텍스트가 보이지 않는 일정 격자에 얹히게 한다. 원리는 Bringhurst의 인쇄 베이스라인 그리드이고, CSS box model이 이를 형식화한다."
lintHash: '13e28c8fc3eb'
polishHash: '13e28c8fc3eb'
---

> 한 줄 명제: line-height 하나를 리듬 단위로 정하고, 모든 수직 간격을 그 배수로 두면 텍스트가 보이지 않는 격자에 얹혀 안정된 리듬이 생긴다.

## 핵심

베이스라인 그리드는 인쇄에서 온 개념이다 — ==여러 단(column)을 가로질러 텍스트의 밑선(baseline)이 일정한 간격의 보이지 않는 수평 격자에 정렬==되어, 페이지에 조용한 질서를 준다(Bringhurst의 인쇄 원리). 웹으로 넘어오면서 이것이 **수직 리듬(vertical rhythm)** 이 됐다.

Richard Rutter가 2006년 24 ways "Compose to a Vertical Rhythm"에서 그 웹 규칙을 정식화했다. 핵심 규칙: ==**line-height를 기본 수직 단위로 삼고, 모든 수직 측정 — line-height·margin·padding — 을 그 단위의 배수(또는 깔끔한 약수)로 둔다.**== 그러면 모든 텍스트가 하나의 일정한 베이스라인 격자 위에 얹힌다.

Rutter의 워크드 예시:

```text
font-size:   12px
line-height: 1.5em = 18px   ← 18px가 리듬 단위
p margin:    1.5em (= 한 줄 높이)
h(14px):     line-height ≈ 1.286em → 여전히 18px, 격자 유지
```

Rutter는 사용자가 글자 크기를 키워도 리듬이 유지되도록 **모든 수직 측정에 em 단위**를 쓰라고 강조했다(오늘날엔 rem이 흔한 선택). 이 규칙은 [타입 스케일](/wiki/design-principles/aesthetics-and-layout/typographic-scale/)(각 크기의 line-height를 리듬에 맞춤)과 [8pt spacing 시스템](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)(수직 간격을 4/8px 배수로)과 자연스럽게 합쳐진다 — Material이 "타입은 4dp 그리드에 정렬"이라 못박는 것도 같은 원리다.

**트레이드오프/Gotcha**: 완벽한 픽셀 단위 베이스라인 정렬은 웹에서 폰트 메트릭·이미지·가변 콘텐츠 때문에 깨지기 쉽다. 실무에서는 "엄격한 베이스라인 스냅"보다 ==수직 간격을 리듬 단위(대개 4/8px 배수)의 정수배로 유지==하는 느슨한 리듬이 유지 비용 대비 효과가 좋다.

## 레퍼런스

- [Richard Rutter, Compose to a Vertical Rhythm (24 ways, 2006)](https://24ways.org/2006/compose-to-a-vertical-rhythm/) — 2차(정본 웹 글). 2006-12-12. line-height=리듬 단위, 모든 수직 측정을 그 배수로, em 단위 사용. 웹 수직 리듬의 기초 진술.
- Robert Bringhurst, *The Elements of Typographic Style* (§2 Vertical Motion / baseline grid) — 1차(정본 서적). 인쇄 베이스라인 그리드의 원 출처.
- [W3C — CSS Box Model Module Level 3](https://www.w3.org/TR/css-box-3/) — 1차/규범(W3C Recommendation, 2023). margin·padding = 수직 간격의 형식 모델. 리듬을 구현하는 CSS 토대.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 출판→웹 계보의 둘째 갈래.
- [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/) — 각 글자 크기를 리듬에 정렬해야 격자가 유지됨.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 수직 리듬 단위가 4/8px 격자와 만나는 지점.
- [Material Design](/wiki/design-principles/material-design/) — "타입은 4dp 베이스라인 그리드에 정렬".
