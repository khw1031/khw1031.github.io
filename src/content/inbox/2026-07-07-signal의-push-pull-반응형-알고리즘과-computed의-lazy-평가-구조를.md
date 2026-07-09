---
title: 'Signal의 push-pull 반응형 알고리즘과 computed의 lazy 평가 구조를 해부한 학습용 리포트'
pubDate: '2026-07-07'
description: 'Signal의 push-pull 기반 반응형 알고리즘 내부 구조와 computed의 lazy 평가 매커니즘을 자세히 설명한다'
summary: 'Signal이 push(알림 전파)와 pull(지연 재평가)을 결합해 의존성 그래프에서 불필요한 계산을 줄이는 fine-grained reactivity 구조를, 알고리즘 흐름과 구현 원리 단계로 정리했다.'
lang: ko
tags:
  - 'frontend'
  - 'signals'
  - 'reactivity'
canonical: 'https://willybrauner.com/journal/signal-the-push-pull-based-algorithm'
lintHash: '13b51028b662'
polishHash: '13b51028b662'
---

## TL;DR
- Signal은 push(변경 즉시 알림 발송)와 pull(읽을 때만 lazy 재평가)을 결합하여, 의존성 그래프 전체가 아닌 변경 영향권만 계산하는 fine-grained reactivity 시스템이다.

## 큰 그림
```
                    ┌────────────────────────────────────┐
                    │     Reactive Graph (의존성 세계)      │
                    │  규칙 정의: y = f(x), z = g(y) 등   │
                    └──────────────┬─────────────────────┘
                                   │ set() 호출
                                   ▼
                    ┌──────────────────────────────┐
                    │  Signal (push / eager)       │
                    │  → 모든 subscriber에게       │
                    │    "내 상태가 바뀌었다"       │
                    │    알림 발송 (값 아님!)        │
                    └──────────┬───────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │Computed A│    │Computed B│    │Computed C│
        │dirty=true│    │dirty=true│    │(영향 없음)│
        │invalidated│   │invalidated│   │          │
        └────┬─────┘    └────┬─────┘    └──────────┘
             │               │
      read? ▲          read? ▲
             │               │
        ┌────┴────┐    ┌────┴────┐
        │ 재계산  │    │ 재계산  │
        │ (pull)  │    │ (pull)  │
        │ 캐시 갱신│    │ 캐시 갱신│
        └─────────┘    └─────────┘

의존성 자동 추적 흐름:
  1. computed 실행 시작 → Global STACK에 push
  2. 내부에서 signal 읽기 → 읽힌 signal이 STACK top(현재 computed)을
     자신의 subscriber로 등록
  3. computed 실행 종료 → STACK에서 pop
  4. → 의존성 링크 자동 완성 (개발자가 배열로 명시할 필요 없음)
```

## 핵심
Signal 기반 반응형 시스템은 하나의 의존성 그래프로 작동한다. 개발자가 `y = f(x)` 같은 규칙을 정의하면, 프로그램은 이 관계를 고정된 세계의 법칙으로 삼고 실행 시간 내내 유지한다. 여기서 핵심은 변경 전파가 두 단계로 나뉜다는 점이다. Signal이 `set()`으로 값을 바꾸면, 이는 즉각적으로 자신의 모든 subscriber에게 "내가 변경되었다"는 알림만 **push**한다. ==이때 실제 값이 전송되는 것이 아니라 캐시 무효화 신호가 전달되는 것이 핵심이다.== 알림을 받은 computed는 즉시 재계산하지 않고 `dirty = true`로 자신을 무효화 표시만 한 채 대기한다. 그러다가 누군가 해당 computed의 `value`를 **read**하는 시점에야 비로소 자신의 의존성을 따라 올라가며 재계산을 수행하는 **pull**이 발생한다. ==이 두 메커니즘이 결합되어, 변경의 영향권에만 정확히 계산이 집중되는 fine-grained reactivity가 구현된다.==

## 깊이
- **[Signal-Push] 알림은 값이 아닌 "변경 사실"이다**  
  Signal의 setter가 호출되면 모든 subscriber에게 notification이 dispatch된다. 이때 실제 상태 값이 전달되지 않는 이유는, push 단계가 오직 캐시 무효화 트리거 역할만 하기 때문이다. 값은 pull 단계( computed의 read 시점)에야 비로소 전달·계산된다. 이렇게 분리함으로써 불필요한 intermediate 계산이 완전히 제거된다.

- **[Computed-Pull] dirty flag를 통한 lazy 평가**  
  computed는 의존성 signal이 변경될 때마다 `dirty` 플래그를 `true`로 전환한다. 그러나 이는 "다시 계산해야 한다"는 표시일 뿐, 실제 계산이 일어나지는 않는다. 실제 재계산은 오직 `computed.value`가 읽힐 때만 발생하며, `dirty === false`라면 이전 캐시 결과를 그대로 반환한다. 이 lazy 전략이 React의 `useMemo` 의존성 배열을 수동으로 관리해야 하는 문제와 본질적으로 다른 지점이다.

- **[Auto-tracking] 전역 STACK 기반 의존성 연결**  
  computed 실행 중 전역 `STACK`에 자신을 push해 두고, 실행 도중 접근하는 모든 signal/computed가 STACK의 top(즉, 현재 실행 중인 computed)을 자신의 subscriber로 등록한다. 실행이 끝나면 STACK에서 pop하여 링크를 완성한다. 이 매커니즘 덕분에 개발자는 React의 dependency array처럼 의존성을 명시적으로 나열할 필요가 없다.

## 용어 풀이
- **Signal** — 반응형 값의 추상화 원시 단위 / '건물 화재 사이렌' / 사이렌은 "화재가 났다"는 알림만 보내고 소화전이나 소화기는 직접 제공하지 않음. Signal도 알림만 보내고 실제 값 전송은 pull 단계에서 일어남.
- **Computed** — 의존성에 기반해 값을 파생시키는 lazy 함수 / '요청 시 작동하는 계산기' / 계산기는 전원이 켜져 있어도 버튼을 누르기 전까지 계산을 시작하지 않음. dirty는 "버튼을 눌러야 한다"는 표시일 뿐.
- **Push-based (eager)** — 변경 발생 즉시 하위 구독자에게 알림 전파 / '라디오 방송 송출' / 방송국은 수신자가 듣고 있는지 확인하지 않고 송출함. 불필요한 알림이 발생할 수 있음.
- **Pull-based (lazy)** — 값이 읽힐 때 dirty 여부를 확인한 후 재계산 / '택배 기사 방문' / 기사가 문 앞에 왔을 때만 물건을 전달하며, 아무도 없으면 다음 기회에 미룸.
- **Dirty flag** — 캐시가 더 이상 유효하지 않음을 표시하는 불리언 상태 / '재검사 스티커' / 스티커가 붙었다고 실제 결함이 있다는 뜻이 아니며, 단지 "다시 확인해야 한다"는 신호일 뿐.
- **Fine-grained reactivity** — 변경 영향권에만 정밀하게 반응이 전파되는 구조 / '정밀 타겟 레이저' / 전체 면적을 태우는 화염방사기가 아닌, 변경된 지점만 정확히 타격. 단, 그래프가 매우 복잡해지면 추적 오버헤드가 증가할 수 있음.

## 시각 자료
**Push vs Pull 비교 매핑**

| 구분 | 방향 | 트리거 시점 | 비용 발생 지점 | 특징 |
|---|---|---|---|---|
| Push (Signal) | 하향 전파 | `set()` 호출 즉시 | 알림 발송 (O(구독자 수)) | eager, 캐시 무효화 전용 |
| Pull (Computed) | 상향 재평가 | `value` read 시 | 실제 계산 (O(의존성 깊이)) | lazy, dirty일 때만 실행 |
| Auto-tracking | 양방향 링크 | computed 실행 중 | STACK push/pop (O(1)) | 의존성 명시 불필요 |

**알림 흐름 순서도**
```
signal.set(newValue)
  │
  ├─▶ subscriber₁ (computed) → dirty = true
  ├─▶ subscriber₂ (computed) → dirty = true
  └─▶ subscriber₃ (effect)   → 즉시 실행 (effect는 push 즉시 작동)

computed₁.read()
  │
  ├─ dirty === true? → 예 → _internalCompute() 실행 → 캐시 갱신 → dirty = false
  └─ dirty === true? → 아니오 → 캐시 반환
```

## 핵심 시사점 / 판단
- **(저자 주장)** Solid, Vue, Preact, Angular, Svelte 등 주요 프레임워크는 API 표면은 다르지만 같은底层(push-pull) 로직을 공유한다. — 같은 로직을 공유한다로 이해하되, 프레임워크 간 구현 최적화(예: batching, scheduling) 차이는 원문에 명시되지 않음.
- **(저자 주장)** computed의 auto-tracking은 React의 dependency array 수동 관리 문제보다 개발자 경험 측면에서 우월하다. — 주관적 판단이며, 디버깅 난이도나 런타임 오버헤드 비교는 원문에 없음.
- **(검증 필요·불확실)** TC39 proposal-signals가 현재 Stage 1이며 "soon" JavaScript에 네이티브 통합될 수 있다는 전망 — Stage 1은 초기 제안 단계로, 표준 채택까지 수년이 걸리거나 포기될 수 있음. 최신 TC39 진행 상황을 별도로 확인 필요.
- **(사실)** Reactive Programming은 1970년대에 등장한 패러다임이며, JavaScript 생태계에는 Knockout.js(2010)와 RxJS(2012)가 초기 구현체임. — Wikipedia 및 라이브러리 이력과 일치.
- **(사실)** Push 단계는 state 값이 아닌 cache invalidation notification만 전송하며, Pull 단계에서야 실제 재계산이 발생한다. — 원문의 아키텍처 설명과 일치.

## 레퍼런스
- Signals, the push-pull based algorithm (Willy Brauner) — https://willybrauner.com/journal/signal-the-push-pull-based-algorithm · (2차) · push-pull 알고리즘의 구현 단계를 시각적 인터랙티브 모듈과 함께 해설한 원문 기고
- Push-pull functional reactive programming (Conal Elliott) — http://conal.net/papers/push-pull-frp/ · (1차) · push-pull FRP 개념을 학문적으로 정식화한 원전 논문
- TC39 proposal-signals — https://github.com/tc39/proposal-signals · (1차) · JavaScript 네이티브 Signal 표준화를 논의 중인 공식 명세 (현재 Stage 1)
- The evolution of signals in JavaScript (Ryan Carniato) — https://dev.to/this-is-learning/the-evolution-of-signals-in-javascript-8ob · (2차) · Signal 개념의 진화 과정을 SolidJS 창시자 관점에서 정리
- How signals work (Con Tejas Code) — https://podcasts.apple.com/fr/podcast/contejas-code/id1731855333 · (2차) · Kristen Maevyn과 Daniel Ehrenberg가 Signal 내부 구조를 설명한 팟캐스트
- alien-signals (StackBlitz) — https://github.com/stackblitz/alien-signals · (1차) · 고성능 Signal 구현체로 알고리즘 학습용 참고 라이브러리

## 확인 질문
- Q1(전이): 만약 computed가 dirty 상태에서 한 번도 read되지 않고 signal이 다시 set()되면, dirty flag는 초기화되는가 아니면 누적되는가? (캐시 무효화의 누적·중복 처리 전략을 추론해보라.)
- Q2(왜·어떻게): React의 `useMemo` dependency array를 수동으로 관리할 때 발생하는 실수(누락·과다 포함)를 Signal의 auto-tracking이 STACK 매커니즘으로 어떻게 자동 해결하는지, 실행 흐름 단위로 설명하라.
- Q3(경계): Push-pull 알고리즘이 의존성 그래프의 깊이(depth)가 100을 넘어가는 상황에서 발생할 수 있는 스택 오버플로우 또는 재계산 지연 문제는 어떻게 완화할 수 있는가? (원문에 없음 — 알고리즘 경계를 스스로 탐색하라.)

> 출처: https://willybrauner.com/journal/signal-the-push-pull-based-algorithm
