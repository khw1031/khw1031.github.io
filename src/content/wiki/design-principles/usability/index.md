---
type: Category
title: Usability — 측정 가능한 사용성의 법칙
pubDate: '2026-07-10T16:10:30+09:00'
description: 취향이 아니라 인간 인지의 제약에서 나오는, 근거를 댈 수 있는 사용성 법칙과 휴리스틱 모음 — Nielsen 10대 휴리스틱, Fitts·Hick 법칙, Gestalt, Jakob의 법칙, 미학-사용성 효과, 타깃 크기
lang: ko
tags: ['usability', 'ux-laws', 'heuristics', 'cognition', 'accessibility']
summary: "사용성은 좋은 디자인 중 근거화가 가능한 부분이다 — 과업 성공률·시간·에러율로 측정되고, 상당수는 원 논문이 있는 인지·지각 법칙에서 나온다. 이 하위 허브는 귀납적으로 정리된 Nielsen의 10대 휴리스틱, 운동·결정 시간의 법칙(Fitts 1954·Hick 1952), 지각적 그루핑(Gestalt), 관습 준수(Jakob), 미감이 사용성 인식에 미치는 영향(미학-사용성 효과), 그리고 이를 물리 수치로 구체화한 타깃 최소 크기를 모은다."
lintHash: '4e7bcca74855'
polishHash: '4e7bcca74855'
---

> 한 줄 명제: 사용성은 "예뻐서"가 아니라 인간의 눈·손·두뇌가 그렇게 생겨먹어서 통하는 것들이다 — 그래서 측정되고 근거를 댈 수 있다.

## 큰 그림

```text
usability (측정 가능한 사용성)
├─ 상위 이론 (나머지를 정렬)
│   └─ gulf-of-execution-evaluation  Norman 두 간극 — 의도↔시스템 간극 좁히기
├─ 휴리스틱 (귀납 정리)
│   └─ nielsen-heuristics       실사용 문제 수백 개에서 귀납한 10대 원칙 (1994, 불변)
├─ 인지·운동 법칙 (원 논문)
│   ├─ fitts-law                MT = a + b·log₂(2D/W) — 크고 가까운 타깃이 빠르다
│   └─ hicks-law                RT = a + b·log₂(n+1) — 선택지가 늘면 결정이 느려진다
├─ 지각 법칙
│   └─ gestalt-principles       근접·유사·폐쇄·연속·공동영역·전경배경 (proximity = spacing 근거)
├─ 인지 부하
│   └─ cognitive-load-and-density  작업기억 ~4청크 · 외재 부하 줄이기 · progressive disclosure
├─ 관습
│   └─ jakobs-law               "사용자는 다른 사이트에서 더 오래 보낸다" → 관습을 따르라
├─ 피드백·모션
│   └─ motion-and-microinteractions  의미 전달 · 마이크로인터랙션 · prefers-reduced-motion
├─ 입력·요소
│   ├─ forms-and-inputs         폼·검증·레이블 (WCAG 3.3.x · placeholder 안티패턴)
│   └─ icon-systems             아이콘=인식(관습 시) · 레이블 필요 · 접근 가능한 이름
├─ 구조·언어
│   ├─ navigation-and-ia        정보 구조 4시스템 · 카드소팅/트리테스트 · wayfinding
│   └─ ux-writing-microcopy     버튼·에러 문구 · plain language · 사용자를 탓하지 마라
├─ 미감↔사용성 다리
│   └─ aesthetic-usability      예쁜 것을 더 쓰기 쉽다고 지각한다 (1995·2000)
└─ 물리 수치
    └─ touch-target-size        44pt(Apple) · 48dp(Material) · WCAG 44/24 CSS px
```

## 핵심

사용성 원칙은 크게 네 종류의 근거에서 나온다. 첫째, **귀납적 휴리스틱** — Jakob Nielsen이 실사용성 문제 수백 개를 분석해 정리한 [10대 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/)이 대표. 둘째, **원 논문이 있는 인지·운동 법칙** — [Fitts의 법칙](/wiki/design-principles/usability/fitts-law/)(타깃까지 시간은 거리/크기의 함수)과 [Hick의 법칙](/wiki/design-principles/usability/hicks-law/)(결정 시간은 선택지 수의 로그). 셋째, **지각 법칙** — [Gestalt 그루핑 원리](/wiki/design-principles/usability/gestalt-principles/)는 사람이 요소를 개별이 아니라 그룹으로 본다는 것을 보이며, 그 중 근접성(proximity)은 spacing이 왜 정보 구조를 말없이 전달하는지의 근거다. 넷째, **관습** — [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/)은 사용자가 이미 학습한 멘탈 모델을 재사용하라고 말한다.

이 축은 미감과 무관해 보이지만 실제로는 다리가 있다. ==[미학-사용성 효과](/wiki/design-principles/usability/aesthetic-usability-effect/)는 사람들이 예쁜 인터페이스를 실제로 "더 쓰기 쉽다"고 지각하고 작은 결함에 관대해진다는 것을 실험으로 보였다== — 미감이 사용성 인식에 직접 영향을 준다는 증거다. 마지막으로 [타깃 최소 크기](/wiki/design-principles/usability/touch-target-size/) 카드는 이 법칙들(특히 Fitts)이 어떻게 44pt·48dp·WCAG 24/44 CSS px 같은 **검증 가능한 물리 수치**로 굳어졌는지를 다룬다.

## 곁가지

- **Postel의 법칙·에러 관용(error tolerance)** — Nielsen 휴리스틱 5·9(에러 예방·복구)와 겹친다. 지금은 forms-and-inputs가 부분 대리. 별도 근거가 필요해지면 분리.
- **온보딩·빈 상태(empty states)** — 첫 사용 안내·빈 화면 설계. ux-writing·progressive disclosure가 부분 대리. 독립 근거가 필요해지면 카드로.
- **신뢰·설득(trust & persuasion)** — 사회적 증거·기본값·다크 패턴 회피(윤리). 별도 근거가 필요해지면 카드로.

*(승격 완료: Norman 통합 프레임 → [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/); Miller 7±2·작업기억 → [cognitive-load-and-density](/wiki/design-principles/usability/cognitive-load-and-density/); 폼·입력 → [forms-and-inputs](/wiki/design-principles/usability/forms-and-inputs/); 아이콘 → [icon-systems](/wiki/design-principles/usability/icon-systems/); 탐색·정보 구조 → [navigation-and-ia](/wiki/design-principles/usability/navigation-and-ia/); UX 라이팅 → [ux-writing-microcopy](/wiki/design-principles/usability/ux-writing-microcopy/).)*

## 레퍼런스

- [Nielsen Norman Group — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — 1차/공식. 이 하위 허브의 대표 근거(1994).
- [Laws of UX](https://lawsofux.com/) — 2차. Fitts·Hick·Jakob 등을 UX 실무 언어로 묶은 aggregator. 원 논문 확인 후 보조로만.

## 연결

- [Design Principles](/wiki/design-principles/) — 상위 허브(두 축 중 사용성 축).
- [DESIGN.md](/wiki/design-principles/design-md/) — 이 허브의 원리들이 채우는 산출물 포맷의 **Components**(폼·아이콘·모션)와 **Do's and Don'ts**(휴리스틱·간극·법칙) 섹션.
- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 다른 한 축. gestalt-principles ↔ spacing-8pt-grid가 두 축을 잇는 대표 연결.
- [Material Design](/wiki/design-principles/material-design/) — 이 법칙들(48dp 타깃, 접근성, 일관성)을 실제로 구현한 한 시스템 사례.
