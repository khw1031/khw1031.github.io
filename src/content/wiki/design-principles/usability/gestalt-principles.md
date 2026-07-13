---
type: Reference
title: Gestalt 그루핑 원리
pubDate: '2026-07-10T16:10:55+09:00'
resource: https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/
description: 사람은 요소를 개별이 아니라 그룹으로 지각한다 — 근접·유사·폐쇄·연속·공동영역·전경/배경 등 Wertheimer(1923)에서 시작된 지각적 그루핑 법칙
lang: ko
tags: ['gestalt', 'perception', 'grouping', 'proximity', 'visual-design']
summary: "Max Wertheimer(1923)가 처음 제기한 perceptual grouping의 법칙들 — 근접(proximity), 유사(similarity), 공동운명(common fate), 좋은 연속(continuation), 폐쇄(closure), 대칭, 공동영역(common region) 등. 사람은 시각 요소를 낱개가 아니라 그룹으로 조직해 지각한다. UI에서 이는 '관련된 것끼리 붙이고 무관한 것을 떼는' 간격 설계(=spacing)가 왜 정보 구조를 말없이 전달하는지의 근거다. 미감이자 동시에 사용성인 지점."
lintHash: '42f405c80c66'
---

> 한 줄 명제: 사람은 요소를 낱개가 아니라 그룹으로 본다 — 그래서 무엇을 붙이고 무엇을 떼는가(간격)가 곧 정보 구조가 된다.

## 핵심

Gestalt(게슈탈트) 원리는 "전체는 부분의 합과 다르다"는 관점에서, ==사람이 시각 요소를 개별이 아니라 **그룹으로 조직해** 지각한다==는 법칙들이다. Max Wertheimer가 1923년 논문에서 perceptual grouping의 문제를 처음 제기했고, Koffka(1935)가 정리했다. 대표 원리:

- **근접(proximity)** — 가까운 것끼리 한 그룹으로 본다. **UI에서 가장 강력** — 라벨을 어느 입력칸에 붙일지, 어떤 항목이 한 묶음인지를 간격만으로 전달한다.
- **유사(similarity)** — 색·모양·크기가 비슷한 것끼리 묶어 본다(같은 스타일 = 같은 종류).
- **폐쇄(closure)** — 끊긴 형태를 완결된 것으로 채워 본다(로고·아이콘 설계).
- **좋은 연속(continuation)** — 선·정렬을 따라 흐름으로 본다(정렬된 리스트·그리드).
- **공동영역(common region)** — 같은 경계(카드·박스) 안의 것을 한 그룹으로 본다.
- **전경/배경(figure–ground)** — 무엇이 대상이고 무엇이 바탕인지 분리(모달·오버레이).

이 카드가 사용성 축에 있으면서도 미감 축과 맞물리는 이유가 바로 근접성이다. ==spacing으로 "관련된 것끼리 붙이고 무관한 것을 뗀다"는 규칙은 미감(정돈된 리듬)이자 동시에 정보 구조 전달(사용성)==이다 — [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)의 intra-group(좁게)·inter-group(넓게) 토큰 구분이 바로 이 proximity의 수치화다. [Hick의 법칙](/wiki/design-principles/usability/hicks-law/)에서 "선택지를 그룹으로 묶어라"도 이 지각 법칙에 기댄다.

**Gotcha**: 원 문헌은 Wertheimer 1923(독일어), Koffka 1935다. 아래 링크는 이를 종합·재검증한 현대 peer-review 리뷰(Wagemans et al. 2012)이며, Wertheimer 원문은 독립 페치하지 못해 그 인용은 2차 경유임을 밝힌다.

## 레퍼런스

- [Wagemans, J. et al. (2012), A Century of Gestalt Psychology in Visual Perception I — *Psychological Bulletin* 138(6), 1172–1217](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/) — 1차(peer-review 종합 리뷰). 고전 원리(근접·유사·공동운명·연속·폐쇄·대칭)와 신규 원리(공동영역·요소 연결성 등)를 정리하고 Wertheimer 1923을 창시로 명시.
- Wertheimer, M. (1923), *Untersuchungen zur Lehre von der Gestalt II*, Psychologische Forschung 4, 301–350 — 1차(원 논문, 독일어). perceptual grouping을 처음 제기. (안정적 공개 DOI 미확보 — 위 리뷰 경유 인용)
- [NN/g — The Principle of Proximity](https://www.nngroup.com/articles/gestalt-proximity/) — 2차. Gestalt를 UI 설계 언어로 옮긴 실무 해설.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. "지각 법칙" 계열.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 근접성의 수치화(그룹 내/간 간격). **두 축을 잇는 핵심 연결.**
- [Hick의 법칙](/wiki/design-principles/usability/hicks-law/) — 그룹화로 선택 부하를 낮추는 접점.
- [layout-grid](/wiki/design-principles/aesthetics-and-layout/layout-grid/) — 연속·공동영역이 그리드 정렬로 구현되는 지점.
