---
type: Reference
title: Fitts의 법칙
pubDate: '2026-07-10T16:10:40+09:00'
resource: https://doi.org/10.1037/h0055392
description: 타깃을 획득하는 시간은 타깃까지의 거리와 타깃 크기의 함수라는, 1954년 Paul Fitts의 실험 법칙 — 크고 가까운 타깃이 빠르다
lang: ko
tags: ['fitts-law', 'usability', 'pointing', 'target-size', 'hci']
summary: "Paul Fitts(1954)가 인간 운동 시스템의 정보 용량을 측정해 정립한 법칙. 타깃 획득 시간 MT는 거리 D가 멀수록, 타깃 폭 W가 좁을수록 로그로 길어진다: MT = a + b·log₂(2D/W). UI 함의는 명확하다 — 중요한 컨트롤은 크게·가깝게, 화면 모서리·가장자리는 포인터가 멈추는 '무한 크기' 타깃이라 고빈도 컨트롤에 최적. 타깃 최소 크기 규범(48dp·44pt)의 이론적 근거."
lintHash: '0d1455496cd7'
polishHash: '0d1455496cd7'
---

> 한 줄 명제: 타깃까지 가는 시간은 거리와 크기의 함수다 — 중요한 것은 크게, 가깝게, 그리고 가능하면 화면 모서리(무한 크기)에.

## 핵심

Fitts의 법칙은 Paul M. Fitts가 1954년 《Journal of Experimental Psychology》에 발표한 "인간 운동 시스템의 정보 용량" 연구에서 나온 실험 법칙이다. 핵심은 ==타깃을 가리켜 도달하는 시간(MT, movement time)이 타깃까지의 거리 D가 멀수록, 타깃 폭 W가 좁을수록 로그 스케일로 길어진다==는 것:

```text
MT = a + b · log₂(2D/W)
```

여기서 D = 타깃까지 거리, W = 타깃 폭(운동 축 방향), a·b는 실험으로 얻는 상수. Fitts의 원래 "난이도 지수(index of difficulty)"는 `ID = log₂(2A/W)` 비트(A = 운동 진폭)로, 운동을 정보 전송으로 본 것이다.

UI 함의(2차 UX 문헌에서 정리된 것):

- **크고 가까운 타깃이 빠르다** — 자주·급히 쓰는 버튼(제출, 다음)은 크게, 커서/시선 가까이 둔다.
- ==화면의 **가장자리와 모서리**는 포인터가 그 경계에서 멈추므로 사실상 "무한 크기" 타깃==이다. 그래서 macOS 메뉴바(상단), Windows 시작 버튼(모서리), 풀스크린 닫기(우상단)가 그 자리에 있다.
- **속도-정확도 트레이드오프** — 타깃이 작을수록 오조준 에러율이 오른다. 이것이 [타깃 최소 크기](/wiki/design-principles/usability/touch-target-size/) 규범(Material 48dp, Apple 44pt, WCAG 24/44 CSS px)의 이론적 근거다.

**Gotcha**: 위 공식은 표준 교과서 형태(Shannon 형)다. lawsofux 같은 2차 페이지는 공식을 싣지 않고, 원 1954 논문은 `ID = log₂(2A/W)`를 쓴다 — 세부 형태가 문헌마다 조금씩 다르니 인용 시 형태를 밝히는 게 안전하다.

## 레퍼런스

- [Fitts, P. M. (1954), The information capacity of the human motor system in controlling the amplitude of movement — *J. Exp. Psychol.* 47(6), 381–391](https://doi.org/10.1037/h0055392) — 1차. 원 실험 논문. (PhilPapers 레코드: [FITTIC](https://philpapers.org/rec/FITTIC))
- [Laws of UX — Fitts's Law](https://lawsofux.com/fittss-law/) — 2차. "타깃 획득 시간은 거리와 크기의 함수"라는 UX 요약(공식 없음). 원 논문 확인 후 보조.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. "원 논문 있는 인지·운동 법칙" 계열.
- [touch-target-size](/wiki/design-principles/usability/touch-target-size/) — Fitts가 물리 수치 규범으로 굳은 결과.
- [Hick의 법칙](/wiki/design-principles/usability/hicks-law/) — 짝이 되는 법칙(운동 시간 vs 결정 시간). 둘 다 로그 관계.
- [Material Design](/wiki/design-principles/material-design/) — 48dp 타깃·타깃 간 8dp 간격으로 Fitts를 규범화.
