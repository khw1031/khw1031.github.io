---
type: Reference
title: 실행의 간극 · 평가의 간극 (Norman)
pubDate: '2026-07-10T16:30:20+09:00'
resource: https://jnd.org/books/the-design-of-everyday-things-revised-and-expanded-edition/
description: Don Norman의 두 간극 — 사용자 의도와 시스템 사이의 실행/평가 간극을 어포던스·시그니파이어·매핑·피드백·개념 모델로 좁히는, 이 카테고리 전체를 꿰는 상위 이론
lang: ko
tags: ['norman', 'gulf-of-execution', 'gulf-of-evaluation', 'affordance', 'signifier', 'mental-model']
summary: "Don Norman(User Centered System Design 1986, The Design of Everyday Things 2013)의 통합 프레임. 사람이 무언가를 쓸 때 두 간극에 부딪힌다 — 실행의 간극(어떻게 조작하지?)과 평가의 간극(무슨 일이 일어났지?). 7단계 행동 주기 중 실행 3단계(plan·specify·perform)가 앞의 간극을, 평가 3단계(perceive·interpret·compare)가 뒤의 간극을 건넌다. 디자이너는 실행의 간극을 시그니파이어·제약·매핑·개념 모델로, 평가의 간극을 피드백·개념 모델로 좁힌다. 이 카테고리의 사용성 법칙들이 왜 통하는지 설명하는 상위 이론."
lintHash: '11e501f400e8'
polishHash: '11e501f400e8'
---

> 한 줄 명제: 좋은 디자인 = 사용자 의도와 시스템 사이의 두 간극을 좁히는 것 — "어떻게 하지?"(실행)는 시그니파이어·매핑으로, "먹혔나?"(평가)는 피드백으로.

## 핵심

Don Norman의 두 간극은 이 카테고리 전체를 꿰는 상위 이론이라 usability 하위 허브의 통합 카드로 둔다. 개념은 1986년 《User Centered System Design》(Norman & Draper 편)에서 나왔고, 《The Design of Everyday Things》 개정판(2013)에서 가장 완성된 형태로 서술됐다. 핵심 문장(2013, Ch.2): =="사람이 무언가를 쓸 때 두 간극에 부딪힌다 — 어떻게 작동하는지 알아내려는 **실행의 간극(Gulf of Execution)**, 그리고 무슨 일이 일어났는지 알아내려는 **평가의 간극(Gulf of Evaluation)**."==

- **실행의 간극** — "내가 하고 싶은 것"과 "시스템이 허용하는 조작" 사이의 거리. *이걸 어떻게 하지?*
- **평가의 간극** — 시스템의 현재 상태를 해석해 "내 의도·기대가 충족됐는지" 판단하는 데 드는 노력. Norman: ==간극은 "장치가 자신의 상태를 얻기 쉽고·해석하기 쉬우며·사용자가 시스템을 생각하는 방식과 맞는 형태로 제공할 때" 작아진다.==

**7단계 행동 주기.** 두 간극은 Norman의 7단계(2013)에 얹힌다: ① Goal → ② Plan → ③ Specify → ④ Perform → ⑤ Perceive → ⑥ Interpret → ⑦ Compare. =="목표 하나, 실행 셋, 평가 셋"== — 실행 3단계(plan·specify·perform)가 실행의 간극을, 평가 3단계(perceive·interpret·compare)가 평가의 간극을 건넌다.

**디자이너가 간극을 좁히는 도구**(2013, p.39): =="우리는 실행의 간극을 **시그니파이어·제약·매핑·개념 모델**로 건너고, 평가의 간극을 **피드백·개념 모델**로 건넌다."== 이 어휘가 곧 좋은 UI의 재료다:

- **어포던스(affordance)** — 사물의 속성과 행위자의 능력 사이의 *관계*(속성이 아니라 관계). 무슨 행동이 **가능한지**를 정한다.
- **시그니파이어(signifier)** — 2013판의 핵심 개정. ==어포던스가 무엇이 가능한지를 정한다면, 시그니파이어는 행동이 **어디서** 일어나야 하는지를 알린다.== (초판의 "affordance" 오용을 바로잡으려 도입.)
- **매핑(mapping)** — 컨트롤과 결과의 대응. 자연스러운 매핑(위 올리려면 컨트롤을 위로)이 즉각적 이해를 준다.
- **피드백** — 행동 결과의 전달. "즉각적이고 정보적이어야" 하며, ==나쁜 피드백은 없느니만 못하다==(과잉 알람도 해롭다).
- **개념 모델 / 시스템 이미지** — 디자이너는 사용자와 직접 대화할 수 없으므로 ==의사소통의 짐 전부가 "시스템 이미지"(제품·문서·시그니파이어가 드러내는 것)에 있다.== 사용자의 멘탈 모델은 이 시스템 이미지에서 형성된다(→ [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/)의 관습이 멘탈 모델을 미리 채우는 이유).

**왜 상위 이론인가.** 이 카테고리의 개별 법칙들이 두 간극을 좁히는 구체적 수단으로 정렬된다: [Nielsen 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/)의 "시스템 상태 가시성"·"에러 복구"는 평가의 간극을, "현실과의 일치"·"인식 우선"은 실행의 간극을 좁힌다. [Fitts](/wiki/design-principles/usability/fitts-law/)·[Hick](/wiki/design-principles/usability/hicks-law/)은 실행 단계의 물리·인지 비용을, [Gestalt](/wiki/design-principles/usability/gestalt-principles/)는 지각·해석 단계를 돕는다.

**Gotcha(판본)**: 흔히 인용되는 "의도와 시스템이 허용하는 것의 차이"·"p.51" 문구는 1988 초판(원제 *The Psychology of Everyday Things*) 표현이다. 2013 개정판은 간극을 p.38–39, 7단계를 p.40–41로 재배치·재서술했다 — 페이지와 판본을 맞춰 인용해야 한다. 1986 최초 정의의 verbatim은 확인하지 못해(2차 경유) 원문 인용은 2013판 기준.

## 레퍼런스

- [Norman, D. A. (2013), *The Design of Everyday Things: Revised and Expanded Edition*, Basic Books](https://jnd.org/books/the-design-of-everyday-things-revised-and-expanded-edition/) — 1차(정본, ISBN 978-0-465-05065-9). 두 간극(Ch.2, p.38–39), 7단계(p.40–41), 어포던스·시그니파이어·피드백(Ch.1) verbatim. 원 1988판 = *The Psychology of Everyday Things*.
- [Norman, D. A. & Draper, S. W. (eds.) (1986), *User Centered System Design*, LEA/Routledge](https://www.routledge.com/User-Centered-System-Design-New-Perspectives-on-Human-computer-Interaction/Norman-Draper/p/book/9780898598728) — 1차(개념 기원, ISBN 9780898598728). 두 간극과 "user-centered design"의 출발점(1986 verbatim은 2차 경유).
- [NN/g — The Two UX Gulfs: Evaluation and Execution (2018)](https://www.nngroup.com/articles/two-ux-gulfs-evaluation-execution/) — 2차(Norman 공동창립 NN/g). 두 간극의 실무 해설.
- [IxDF — Gulf of Evaluation and Gulf of Execution](https://ixdf.org/literature/book/the-glossary-of-human-computer-interaction/gulf-of-evaluation-and-gulf-of-execution) — 2차. 1986 기원·1988 대중화 정리(단, p.51 인용은 1988판 문구).

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. 이 카드가 나머지 법칙들을 정렬하는 상위 이론.
- [Nielsen 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/) — 가시성·복구(평가) / 일치·인식(실행)이 두 간극에 매핑.
- [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/) — 관습이 "시스템 이미지"를 미리 채워 멘탈 모델 형성을 돕는 지점.
- [Fitts](/wiki/design-principles/usability/fitts-law/) · [Hick](/wiki/design-principles/usability/hicks-law/) · [Gestalt](/wiki/design-principles/usability/gestalt-principles/) — 실행·평가 단계의 물리·인지·지각 비용을 좁히는 각론.
- [Material Design](/wiki/design-principles/material-design/) — 피드백·매핑·일관성을 시스템으로 구현("Motion provides meaning" = 평가의 간극 좁히기).
