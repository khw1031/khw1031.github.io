---
type: Reference
title: 인지 부하와 정보 밀도
pubDate: '2026-07-10T16:45:00+09:00'
resource: https://doi.org/10.1037/h0043158
description: 작업기억은 좁다(대중적 7±2, 실제 ~4 청크) — 이해에 기여하지 않는 부하(extraneous load)를 줄이는 것이 좋은 UI의 원리. Miller·Cowan·Sweller·progressive disclosure·Tufte
lang: ko
tags: ['cognitive-load', 'working-memory', 'progressive-disclosure', 'information-density', 'usability']
summary: "작업기억은 심하게 제한적이다 — Miller(1956)의 유명한 7±2는 사실 절반은 수사였고 핵심은 '청킹'이며, 통제된 조건의 실제 순수 용량은 Cowan(2001)의 ~4 청크에 가깝다. Sweller의 인지 부하 이론은 이해(스키마 구축)에 기여하지 않는 외재 부하(extraneous load)가 성능·학습을 해친다고 본다. 그래서 좋은 UI는 비핵심 복잡도를 뒤로 미루고(progressive disclosure, NN/g) 비데이터 잉크를 걷어낸다(Tufte data-ink). 밀도는 맥락 의존이다."
lintHash: '177bd80e0499'
polishHash: '177bd80e0499'
---

> 한 줄 명제: 사람이 한 번에 머릿속에 붙들 수 있는 건 몇 덩어리뿐(~4 청크)이다 — 이해에 기여하지 않는 부하를 줄이고, 비핵심은 뒤로 미뤄라.

## 핵심

좋은 UI의 큰 축 하나는 ==사용자가 머릿속에 붙들어야 하는 양을 줄이는 것==이다. 근거는 작업기억의 좁음이다.

**7±2의 진실.** George Miller(1956, "The Magical Number Seven")는 흔히 "작업기억은 7±2개"로 인용되지만, 정작 Miller 본인은 ==그 "7"을 상당 부분 수사적으로== 썼다("하나의 정수에 시달린다"). 그는 두 개의 다른 한계를 보고했다 — 단일 차원 절대 판단 ~2–3비트(≈4–8범주)와 즉시 기억 폭 ~7항목 — 이 둘이 우연히 7 근처인 것뿐이라고 했다. ==정작 핵심은 "청킹(chunking)"==이다: 기억 폭은 비트가 아니라 **의미 있는 덩어리(청크)** 로 제한되며, 무엇이 한 청크인지는 학습자의 사전 지식에 달렸다.

**실제 용량은 ~4.** 청킹·리허설을 통제하면 순수 작업기억 용량은 Nelson Cowan(2001, "The magical number 4")의 추정처럼 ==~4 청크(3~5)에 가깝다.== 그러니 "7±2"는 대중적으로 과장된 수치이고, 설계 판단은 더 보수적인 ~4를 기준으로 삼는 게 안전하다.

**어떤 부하를 줄일 것인가.** John Sweller의 인지 부하 이론(CLT, 1988 origin)은 작업기억이 제한적이라 ==이해(스키마 구축)에 기여하지 않는 부하가 성능·학습을 해친다==고 본다. 후속 연구가 부하를 세 종류로 나눴다(1994·1998):

- **내재 부하(intrinsic)** — 내용 자체의 복잡도(요소 간 상호작용). 학습자 사전 지식에 상대적.
- **외재 부하(extraneous)** — *어떻게 보여주는가*가 만드는 부하. ==UI 디자인이 가장 직접 줄일 수 있는 것== — 산만함·혼란·불필요한 스텝.
- **본유 부하(germane)** — 이해·스키마 구축에 생산적으로 쓰이는 노력.

**UI의 완화책.**

1. **Progressive disclosure(점진적 공개)** — NN/g(Nielsen 2006): ==고급·희소 기능을 2차 화면으로 미뤄== 처음엔 핵심만 보인다. "강력함 vs 단순함" 딜레마를 풀고, 초보의 주의 우선순위를 돕고 숙련자의 스캔 시간도 아낀다. [Hick의 법칙](/wiki/design-principles/usability/hicks-law/)(선택지 수↔결정 시간)의 완화와 같은 방향이다.
2. **정보 밀도 관리** — Tufte의 data-ink ratio: ==비데이터 잉크·chartjunk를 걷어내고 신호를 남긴다.== 컨트롤뿐 아니라 시각 인코딩에도 "덜어내기"가 적용된다.

**트레이드오프**: 밀도는 맥락 의존이다 — 명상 앱과 트레이딩 대시보드의 정답은 반대다([spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/)의 density 논의와 연결). "무조건 적게"가 아니라, 외재 부하는 줄이되 과업에 필요한 내재 정보는 유지한다.

## 레퍼런스

- [Miller, G. A. (1956), The Magical Number Seven ± Two — *Psychological Review* 63(2), 81–97](https://doi.org/10.1037/h0043158) — 1차. 7±2의 원 논문(저자 스스로 수사적), 핵심은 청킹. ([PDF](https://labs.la.utexas.edu/gilden/files/2016/04/MagicNumberSeven-Miller1956.pdf))
- [Cowan, N. (2001), The magical number 4 in short-term memory — *BBS* 24(1), 87–114](https://doi.org/10.1017/S0140525X01003922) — 1차. 통제 조건 순수 용량 ~4 청크(대중적 7±2 하향 수정).
- [Sweller, J. (1988), Cognitive load during problem solving — *Cognitive Science* 12(2), 257–285](https://doi.org/10.1207/s15516709cog1202_4) — 1차. CLT의 기원. (부하 3분류는 [Sweller 1994](https://doi.org/10.1016/0959-4752(94)90003-5)·[Sweller/van Merriënboer/Paas 1998](https://doi.org/10.1023/A:1022193728205)에서.)
- [Nielsen, J. (2006), Progressive Disclosure — NN/g](https://www.nngroup.com/articles/progressive-disclosure/) — 2차(권위 있는 실무 정본). 비핵심 기능을 2차 화면으로.
- [Tufte, E. R., *The Visual Display of Quantitative Information* (2nd ed., 2001)](https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/) — 1차(정본, ISBN 978-0-9613921-4-7). data-ink ratio 최대화.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. 작업기억 한계 계열.
- [Hick의 법칙](/wiki/design-principles/usability/hicks-law/) — 선택 과부하(choice overload)의 짝. 둘 다 "줄여라".
- [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/) — 부하 줄이기 = 실행·평가 간극을 좁히는 상위 이론의 실행.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 밀도(density) 조정과 직접 연결.
- [visual-hierarchy](/wiki/design-principles/aesthetics-and-layout/visual-hierarchy/) — 위계로 주의 부하를 낮추는 시각적 수단.
