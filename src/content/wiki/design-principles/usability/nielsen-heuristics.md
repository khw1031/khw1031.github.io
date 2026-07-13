---
type: Reference
title: Nielsen의 10대 사용성 휴리스틱
pubDate: '2026-07-10T16:10:35+09:00'
resource: https://www.nngroup.com/articles/ten-usability-heuristics/
description: Jakob Nielsen이 실사용성 문제를 귀납해 1994년 정리한, 인터페이스 사용성 평가의 표준 10대 원칙
lang: ko
tags: ['usability', 'heuristics', 'nielsen', 'ux-evaluation']
summary: "Jakob Nielsen이 1990~1994년 실제 사용성 문제 수백 개를 귀납해 정리한 10개의 일반 원칙. 정밀한 가이드라인이 아니라 넓은 경험 법칙(heuristics)이라, 어떤 인터페이스든 빠르게 점검하는 체크리스트로 쓰인다. NN/g는 이 10개가 1994년 이후 변하지 않았다고 명시한다 — 구체 기술이 아니라 인간-시스템 상호작용의 안정적 성질을 담기 때문."
lintHash: '367d878ccc46'
---

> 한 줄 명제: 좋은 인터페이스가 반복적으로 지키는 10가지 — 시스템 상태를 보이고, 현실의 말을 쓰고, 되돌릴 수 있게 하고, 일관되게, 에러를 막고, 기억이 아니라 인식에 기대게 하라.

## 핵심

10대 휴리스틱은 Jakob Nielsen이 Nielsen & Molich(1990)와 Nielsen(1994)을 거쳐 **실제 사용성 문제 수백 개를 분석·귀납해** 정리한 일반 원칙이다. "휴리스틱"이라 부르는 이유는 정밀한 명세가 아니라 ==넓은 경험 법칙==이기 때문 — 그래서 어떤 화면이든 빠르게 훑는 평가 체크리스트로 쓸 수 있다. NN/g는 이 목록이 1994년 이후 **변하지 않았다**고 밝히는데, 특정 기술이 아니라 인간-시스템 상호작용의 안정적 성질을 담기 때문이다.

10개(공식 명칭):

1. **Visibility of system status** — 시스템 상태의 가시성. 적절한 피드백으로 지금 무슨 일이 일어나는지 알린다(로딩·진행·성공).
2. **Match between the system and the real world** — 시스템과 현실의 일치. 사용자의 언어·개념·관습을 따른다.
3. **User control and freedom** — 사용자 제어와 자유. 실수에서 빠져나갈 비상구(취소/undo).
4. **Consistency and standards** — 일관성과 표준. 같은 것은 같게, 플랫폼 관습을 따른다(→ [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/)).
5. **Error prevention** — 에러 예방. 에러 메시지보다 애초에 에러가 안 나게.
6. **Recognition rather than recall** — 기억이 아니라 인식. 사용자가 외우게 하지 말고 보이게 한다.
7. **Flexibility and efficiency of use** — 유연성과 효율. 초보와 숙련자 모두를 위한 가속기(단축키 등).
8. **Aesthetic and minimalist design** — 심미적·미니멀 디자인. 무관한 정보는 뺀다(→ [미학-사용성 효과](/wiki/design-principles/usability/aesthetic-usability-effect/)와 연결).
9. **Help users recognize, diagnose, and recover from errors** — 에러 인식·진단·복구 지원. 평문으로 문제와 해결책을 제시.
10. **Help and documentation** — 도움말과 문서. 없어도 되면 최선이나, 필요하면 찾기 쉽게.

이 목록은 **평가용**이지 생성 공식이 아니다 — 위반 지점을 빠르게 찾는 데 강하고, "어떻게 만들지"는 Fitts·Gestalt·타입 스케일 같은 다른 카드가 채운다.

## 레퍼런스

- [Nielsen Norman Group — 10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) — 1차/공식. Nielsen 본인 저술, 최초 1994-04-24, 목록은 이후 불변(최종 갱신 2024-01-30). 10개 명칭의 정본. (확인 2026-07-10)
- [Nielsen & Molich (1990), Heuristic evaluation of user interfaces (CHI '90)](https://dl.acm.org/doi/10.1145/97243.97281) — 1차. 휴리스틱 평가의 원 논문(초기 세트).

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. 이 카드는 "귀납 정리" 계열의 대표.
- [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/) — 휴리스틱 4(일관성·표준)의 이론적 뿌리.
- [미학-사용성 효과](/wiki/design-principles/usability/aesthetic-usability-effect/) — 휴리스틱 8(심미·미니멀)이 사용성 인식에 미치는 영향의 근거.
- [Material Design](/wiki/design-principles/material-design/) — 일관성·피드백·에러 예방을 시스템 규범으로 구현한 사례.
