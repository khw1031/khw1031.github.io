---
type: Reference
title: Hick의 법칙 (Hick–Hyman)
pubDate: '2026-07-10T16:10:45+09:00'
resource: https://doi.org/10.1080/17470215208416600
description: 결정 시간은 선택지의 수(정보량)에 로그로 비례한다는 Hick(1952)·Hyman(1953)의 법칙 — 선택지를 줄이면 결정이 빨라진다
lang: ko
tags: ['hicks-law', 'usability', 'decision-time', 'cognitive-load', 'hci']
summary: "W. E. Hick(1952)과 Ray Hyman(1953)이 독립적으로 보인, 결정·반응 시간이 선택지 집합이 담은 정보량(비트)에 선형으로 — 즉 선택지 수의 로그에 — 비례한다는 법칙: RT = a + b·log₂(n+1). UI 함의는 선택지를 줄이고·계층화하고·기본값을 제공하라는 것. 단, 무조건 적게가 아니라 정보 구조·친숙도와 함께 판단해야 한다."
lintHash: '1449c1b3a95e'
polishHash: '1449c1b3a95e'
---

> 한 줄 명제: 선택지가 늘면 결정 시간은 로그로 늘어난다 — 그러니 줄이고, 묶고, 기본값을 줘라.

## 핵심

Hick–Hyman 법칙은 W. E. Hick(1952, 《Quarterly Journal of Experimental Psychology》)과 Ray Hyman(1953, 《Journal of Experimental Psychology》)이 독립적으로 정립했다. 핵심은 ==사람이 여러 선택지 중 하나를 고르는 결정·반응 시간(RT)이 선택지 집합이 담은 **정보량(비트)** 에 선형으로 비례==한다는 것 — 선택지 수 n으로 바꾸면 로그 관계다:

```text
RT = a + b · log₂(n + 1)
```

a = 기본 처리 시간, b = 비트당 기울기, "+1"은 "반응할지 말지"의 불확실성을 반영한다. 두 사람이 각각 "자극이 전달하는 정보량이 늘수록 RT가 선형 증가"함을 보여 **Hick–Hyman 법칙**으로 불린다.

UI 함의:

- **선택지를 줄여라** — 메뉴·옵션·CTA가 많을수록 결정이 느려진다. 핵심만 남기고 나머지는 접는다.
- **계층화하라** — 평평한 30개보다 6개 그룹 × 5개가 각 결정 단계의 n을 낮춘다(→ [Gestalt 그루핑](/wiki/design-principles/usability/gestalt-principles/)과 spacing으로 묶기).
- **기본값·추천을 제공하라** — 좋은 기본값은 결정 자체를 없앤다.

**주의(트레이드오프)**: 로그이므로 선택지 하나 늘어난다고 시간이 폭증하진 않는다. 또 항목이 **친숙하거나 잘 정렬돼 스캔 가능**하면 순수 Hick보다 빨라진다(사용자가 순차 검토가 아니라 시각 탐색을 한다). 그래서 "무조건 적게"가 아니라 [Nielsen 휴리스틱 8](/wiki/design-principles/usability/nielsen-heuristics/)(미니멀)·정보 구조·친숙도와 함께 판단해야 한다.

**Gotcha**: 위 `+1` 형태는 표준 교과서 환원형이다. lawsofux 등 2차 페이지는 공식을 싣지 않으며 원 1952/1953 논문을 직접 인용하지도 않는다 — 공식 인용 시 출처 형태를 밝히는 게 안전하다.

## 레퍼런스

- [Hick, W. E. (1952), On the rate of gain of information — *Q. J. Exp. Psychol.* 4(1), 11–26](https://doi.org/10.1080/17470215208416600) — 1차. 원 논문. ([공개 PDF](https://www2.psychology.uiowa.edu/faculty/mordkoff/InfoProc/pdfs/Hick%201952.pdf))
- [Hyman, R. (1953), Stimulus information as a determinant of reaction time — *J. Exp. Psychol.* 45(3), 188–196](https://doi.org/10.1037/h0056940) — 1차. 법칙의 다른 한 축.
- [Laws of UX — Hick's Law](https://lawsofux.com/hicks-law/) — 2차. "선택지 수·복잡도가 늘면 결정 시간이 는다"는 UX 요약(공식 없음).

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. Fitts와 짝을 이루는 로그 법칙.
- [Fitts의 법칙](/wiki/design-principles/usability/fitts-law/) — 운동 시간의 법칙(vs 결정 시간).
- [Gestalt 원리](/wiki/design-principles/usability/gestalt-principles/) — 선택지를 그룹으로 묶어 각 결정 단계의 n을 낮추는 지각적 근거.
- [Nielsen 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/) — 미니멀리즘·인식 우선과 직접 연결.
