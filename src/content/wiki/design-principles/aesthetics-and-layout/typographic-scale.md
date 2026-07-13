---
type: Reference
title: Typographic Scale (모듈러 스케일)
pubDate: '2026-07-10T16:11:15+09:00'
resource: https://alistapart.com/article/more-meaningful-typography/
description: 활자 주조소의 표준 점 크기에서 나온 '조화 비율' 활자 스케일이 웹의 모듈러 스케일(1.25·1.333·1.618 등)로 이어진 계보
lang: ko
tags: ['typographic-scale', 'modular-scale', 'typography', 'bringhurst', 'web-design']
summary: "16세기 활자 주조소가 주조한 표준 점 크기(6·7·8·…·72pt)는 임의가 아니라 조화로운 비율의 집합이었다. Robert Bringhurst는 이를 '음악 음계에 비유되는 미리 정해진 조화 비율'로 정식화했다. Tim Brown(A List Apart, 2011)이 이를 웹으로 옮겨 '모듈러 스케일' — 기준 크기 × 비율(황금비 1.618, 완전4도 1.333, 장3도 1.25 등)로 크기를 생성 — 을 대중화했다. 크기를 임의로 고르지 않고 비율로 관계 지으면 위계가 조화롭게 들린다. 단 스케일은 규칙이 아니라 도구다."
lintHash: 'a93fbdbf483b'
---

> 한 줄 명제: 글자 크기를 임의로 고르지 말고 하나의 비율로 관계 지어라 — 활자 주조소의 점 크기가 음악 음계 같은 조화 비율이었고, 웹의 모듈러 스케일이 그 후예다.

## 핵심

타이포그래픽 스케일은 ==글자 크기들을 임의가 아니라 하나의 **조화로운 비율**로 관계 짓는 집합==이다. 뿌리는 인쇄다. 16세기 활자 주조소는 6·7·8·9·10·11·12·14·16·18·21·24·36·48·60·72 같은 표준 점 크기를 주조했고, 이 목록은 지금도 소프트웨어 크기 메뉴에 박혀 있다. Robert Bringhurst는 《The Elements of Typographic Style》에서 이를 =="음악 음계에 비유되는, 미리 정해진 조화 비율의 집합"==으로 정식화했다 — 크기들이 임의가 아니라 화성처럼 서로 관계한다는 것.

Tim Brown이 2011년 A List Apart "More Meaningful Typography"에서 이 개념을 웹으로 옮겨 **모듈러 스케일**을 대중화했다. 방법은 단순하다: **기준 크기(base)** 하나와 **비율(ratio)** 하나를 정하고, 위로는 곱하고 아래로는 나눠 크기 집합을 만든다. 예로 base 10, 황금비 1.618이면 10 → 16.18 → 26.18 …, 10 ÷ 1.618 = 6.18. 웹이 음악 음정에서 가져온 표준 비율:

```text
Minor Third      1.200
Major Third      1.250
Perfect Fourth   1.333
Aug. Fourth      1.414
Perfect Fifth    1.500
Golden Ratio     1.618
```

비율이 클수록 위계 대비가 극적이고(디스플레이·랜딩), 작을수록 촘촘하고 정보 밀도가 높다(대시보드·본문 중심). 이 스케일은 [Material의 타입 스케일](/wiki/design-principles/material-design/)(Display~Label 역할)과 [베이스라인 그리드](/wiki/design-principles/aesthetics-and-layout/baseline-grid-vertical-rhythm/)(각 크기의 line-height를 리듬 단위로 정렬)와 함께 작동한다.

**트레이드오프**: ==스케일은 규칙이 아니라 도구다.== Brown 본인이 "수학은 경험 있는 디자이너의 눈을 대신하지 못한다 — 힌트와 제약을 줄 뿐"이라 했다. 순수 비율이 만든 값이 실무에서 어색하면(예: 소수점 px) 반올림하거나 두 스케일을 교직(double-stranded)해 쓸 수 있는 값을 늘린다.

## 레퍼런스

- [Tim Brown, More Meaningful Typography (A List Apart, 2011)](https://alistapart.com/article/more-meaningful-typography/) — 2차(정본 웹 글). 모듈러 스케일을 웹에 도입. Bringhurst "조화 비율" 인용, base×ratio 계산법, "스케일은 도구지 규칙이 아니다".
- Robert Bringhurst, *The Elements of Typographic Style* (§3.3 The Typographic Scale) — 1차(정본 서적, ISBN 978-0881792126, v4.0 2012). 주조소 점 크기와 "음악 음계 같은 조화 비율". ([판본 확인용 위키](https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style), 2차)
- [type-scale.com (Jeremy Church)](https://type-scale.com/) — 2차(도구). 음정 이름 비율(1.2~1.618)로 스케일을 즉시 미리보기·CSS 복사.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 출판→웹 계보의 첫 갈래.
- [baseline-grid-vertical-rhythm](/wiki/design-principles/aesthetics-and-layout/baseline-grid-vertical-rhythm/) — 스케일의 각 크기를 수직 리듬에 정렬.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 크기·간격이 하나의 격자로 통합되는 지점.
- [Material Design](/wiki/design-principles/material-design/) — 타입 스케일을 역할(Display~Label)로 시스템화.
