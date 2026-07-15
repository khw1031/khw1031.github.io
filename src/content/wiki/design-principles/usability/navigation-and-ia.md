---
type: Reference
title: 정보 구조(IA)와 내비게이션
pubDate: '2026-07-10T20:28:00+09:00'
resource: https://www.oreilly.com/library/view/information-architecture-4th/9781491913529/
description: 콘텐츠를 구조화·라벨링해 찾을 수 있게 만드는 정보 구조(IA)와 내비게이션 — Rosenfeld/Morville의 4대 시스템, 카드 소팅·트리 테스트, wayfinding, 숨은 내비게이션의 비용
lang: ko
tags: ['information-architecture', 'navigation', 'findability', 'card-sorting', 'usability', 'ia']
summary: "정보 구조(IA)는 콘텐츠를 조직·라벨링·탐색·검색하게 해 사람이 정보를 더 잘 찾고 관리하도록 설계하는 것이다(Rosenfeld·Morville·Arango '북극곰 책'의 4대 시스템). 구조는 디자이너가 아니라 사용자의 멘탈 모델에서 나와야 하므로 카드 소팅(생성)으로 발견하고 트리 테스트(평가)로 검증한다. 내비게이션은 global/local/contextual/supplemental로 나뉘고, breadcrumb·local nav가 'Where am I? Where can I go?'라는 wayfinding에 답한다. 숨은 내비게이션(햄버거)은 발견율을 20%+ 떨어뜨린다."
lintHash: 'ba9cad461074'
polishHash: 'ba9cad461074'
---

> 한 줄 명제: 좋은 구조는 디자이너 머리가 아니라 사용자 멘탈 모델에서 나온다 — 카드 소팅으로 발견하고, 트리 테스트로 검증하고, 내비게이션으로 "여기가 어디, 어디로 갈 수 있나"에 답하라.

## 핵심

정보 구조(IA)는 ==콘텐츠를 조직·라벨링·탐색·검색하게 설계해 사람이 정보를 더 잘 찾고 관리하도록== 하는 것이다. 정본 《Information Architecture: For the Web and Beyond》(Rosenfeld·Morville·Arango, 4판 2015, "북극곰 책")은 IA를 네 시스템으로 본다:

1. **Organization systems** — 정보를 어떻게 묶고 분류하는가(구조·스킴).
2. **Labeling systems** — 정보를 어떤 말로 표현·명명하는가(용어).
3. **Navigation systems** — 사용자가 어떻게 이동·탐색하는가.
4. **Searching systems** — 사용자가 어떻게 질의·검색하는가.

Peter Morville의 **findability(찾을 수 있음)** 가 이 모든 것의 목표다 — 콘텐츠가 얼마나 발견·탐색 가능한가.

**구조는 사용자에게서 나온다.** IA의 핵심 방법론은 ==구조를 디자이너가 상상하지 않고 사용자 멘탈 모델에서 끌어내는 것==이다:

- **카드 소팅(card sorting)** — 참가자가 라벨 카드를 자기 기준으로 묶게 해 멘탈 모델을 드러내는 *생성적* 방법. **Open**(범주 없음, 발견)·**Closed**(범주 고정, 검증)·Hybrid(NN/g는 편향 때문에 비권장).
- **트리 테스트(tree testing)** — 텍스트만의 계층에서 특정 항목을 찾게 해 제안된 구조를 검증하는 *평가적* 방법(카드 소팅의 역). ==카드 소팅이 곧바로 정답 분류를 주지는 않으므로== 트리 테스트로 검증한다.

**내비게이션 유형**(북극곰 책 분류):

- **Global** — 모든 페이지의 최상위 구조. **Local** — 현재 위치의 형제·자식. **Contextual** — 본문 속 관련 링크. **Supplemental** — 사이트맵·색인·가이드.
- ==**Wayfinding**: "여기가 어디? 어디로 갈 수 있나? 어떻게 돌아가나?"==에 답하는 것 — local nav와 **breadcrumb**(세션 히스토리가 아니라 IA 계층상 위치를 반영; 3단계 이상일 때만 유효)이 담당한다. 관습적 배치(로고=홈, 상단/좌측 nav)가 통하는 건 [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/), 구조가 올바른 멘탈 모델을 심어야 한다는 건 [Norman의 시스템 이미지](/wiki/design-principles/usability/gulf-of-execution-evaluation/)와 연결된다.

**숨은 내비게이션의 비용.** NN/g(179명, 6사이트): ==내비게이션을 햄버거 뒤에 숨기면 사용 빈도가 줄고, 발견율이 20% 이상 떨어지며, 체감 난이도가 ~21% 오른다.== 큰 화면에서는 보이는 내비게이션이, 항목이 많으면 메가 메뉴(관련 항목을 시각적으로 묶어 IA를 한눈에)가 낫다.

**Gotcha**: 4대 시스템·내비 분류는 북극곰 책 소산이나, 원문 페이지 대신 다수의 2차 요약으로 교차 확인했다 — 정확 페이지 인용이 필요하면 책 Part II로 확인. 햄버거·메가메뉴 수치는 NN/g 자체 연구(2차).

## 레퍼런스

- [Rosenfeld, Morville & Arango, *Information Architecture: For the Web and Beyond* (4판, O'Reilly 2015)](https://www.oreilly.com/library/view/information-architecture-4th/9781491913529/) — 1차(정본, ISBN 9781491911686). 4대 시스템(조직·라벨링·내비·검색).
- [Peter Morville, *Ambient Findability* (O'Reilly 2005)](https://www.oreilly.com/pub/pr/1438) — 1차(ISBN 9780596007652). findability 개념.
- [NN/g — Card Sorting (2024)](https://www.nngroup.com/articles/card-sorting-definition/) · [Tree Testing (2023)](https://www.nngroup.com/articles/tree-testing/) — 2차(권위). 멘탈 모델 발견(생성) vs 구조 검증(평가).
- [NN/g — Local Navigation](https://www.nngroup.com/articles/local-navigation/) · [Breadcrumbs (2018)](https://www.nngroup.com/articles/breadcrumbs/) — 2차. wayfinding, 계층 기반 breadcrumb(3단계+).
- [NN/g — Hamburger Menus Hurt UX](https://www.nngroup.com/articles/hamburger-menus/) · [Mega Menus Work Well (2023)](https://www.nngroup.com/articles/mega-menus-work-well/) — 2차. 숨은 내비 발견율 −20%+, 메가 메뉴 이점.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브.
- [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/) — 관습적 내비게이션 배치가 통하는 이유.
- [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/) — 구조가 올바른 멘탈 모델(시스템 이미지)을 심어야 함.
- [cognitive-load-and-density](/wiki/design-principles/usability/cognitive-load-and-density/) · [hicks-law](/wiki/design-principles/usability/hicks-law/) — 계층화로 각 단계 선택지·부하를 낮춤.
- [responsive-layout](/wiki/design-principles/aesthetics-and-layout/responsive-layout/) — 내비게이션이 화면 크기에 따라 적응(숨김 vs 노출)하는 접점.
