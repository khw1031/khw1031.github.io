---
title: 'JavaScript Signals 표준 제안 학습 노트'
pubDate: '2026-07-07'
description: 'TC39 Stage 1 신호 기반 반응형 프로그래밍 API의 그래프 구조와 lazy 평가 전략을 구조적으로 정리한 학습 노트'
summary: 'JavaScript Signals는 반응형 상태 관리를 위해 그래프 기반 자동 의존성 추적과 지연 평가를 제공하는 TC39 Stage 1 표준 제안이다. 프레임워크 간 상호운용성을 위해 핵심 그래프 의미론에 집중한다.'
lang: ko
tags:
  - 'signals'
  - 'reactivity'
  - 'tc39'
  - 'javascript'
canonical: 'https://github.com/tc39/proposal-signals'
lintHash: 'bd551939bf9c'
---

> 한 줄 명제: JavaScript Signals는 반응형 상태 관리를 위해 자동 의존성 추적·지연 평가·glitch-free 전파를 그래프 기반 원시 타입으로 제공하는 TC39 표준 제안이다.

## 큰 그림

```text
Signal 표준 제안
│
├─ ① 반응형 상태 관리의 필요성 ── pub/sub 한계 → Signal으로 해결
│
├─ ② Signal 그래프의 3대 구성 요소 ── State / Computed / Watcher
│
├─ ③ 평가 전략과 상태 머신 ── lazy, memoization, glitch-free, 상태 전이
│
├─ ④ 안전성 제약과 동기 실행 모델 ── frozen, notify 읽기/쓰기 금지, untrack
│
├─ ⑤ 표준화 동기와 프레임워크 기반 설계 ── interop, DevTools, 메모리 관리
│
└─ ⑥ API와 알고리즘 명세 ── hidden global state, recalculate 알고리즘
```

## 핵심

JavaScript 애플리케이션의 UI 상태 관리는 단순 값 저장뿐 아니라 파생 상태의 계산·무효화·동기화·뷰 레이어 푸시를 효율적으로 처리해야 한다. 기존 pub/sub 패턴은 구독자 간 직접적인 의존 관계를 개발자가 일일이 관리해야 하고, 중간 계산이 불필요하게 재실행되며, 구독 해지 누락 시 메모리 누수가 발생한다. Signals는 이러한 문제를 해결하기 위해 셀(cell) 단위의 반응형 원시 타입을 언어 레벨에서 제공한다.

Signal 그래프는 세 가지 구성 요소로 이루어진다. `Signal.State`는 개발자가 명시적으로 `.set()`으로 값을 바꾸는 읽기-쓰기 셀이다. `Signal.Computed`는 다른 Signal들을 읽는 콜백을 받아 파생 값을 계산하는 셀로, 자동으로 의존성을 추적한다. `Signal.subtle.Watcher`는 그래프의 변화를 감지해 `notify` 콜백을 실행하는 관찰자로, 프레임워크가 이 위에서 effect를 구현한다. 이 세 요소의 분리는 응용 개발자(API의 `State`/`Computed`만 사용)와 프레임워크 개발자(`Watcher`까지 사용)의 관심사를 나눈다.

Computed Signal은 pull-based(요청 시점 평가)로 동작한다. 의존 State가 바뀌더라도 Computed는 즉시 재계산하지 않고, `.get()`이 호출될 때만 자신의 상태를 확인하고 필요하면 재계산한다. 이때 값은 캐시되므로 의존이 실제로 변하지 않았다면 콜백이 다시 실행되지 않는다. `.set()`이 호출되면 그래프의 sink들에 대해 topological 순서로 "더티 마킹"이 전파되어, 중복 계산이나 중간 상태 노출(glitch)이 발생하지 않는다. 이 구조를 glitch-free라고 한다.

실행의 soundness를 위해 `frozen` 전역 상태가 관리된다. `Watcher`의 `notify` 콜백은 `.set()` 처리 도중 동기적으로 호출되는데, 이때 그래프가 일관되지 않은 중간 상태에 있을 수 있으므로 `notify` 내부에서 어떤 Signal도 읽거나 쓰는 것이 금지된다. 이 제한을 우회하려면 `queueMicrotask` 등으로 작업을 지연시켜야 한다. `Signal.subtle.untrack`은 의존성 추적을 일시 해제하지만 `frozen` 상태에서는 작동하지 않는다.

이 제안은 프레임워크의 재정의 기반(basis)으로 설계되었으며, effect 스케줄링·소유권·제거는 프레임워크 영역으로 남겼다. `effect()` 함수 자체가 API에 포함되지 않은 이유다. Async와 Transactions는 현재 생략되었으며, 버전 의존 내용은 TC39 Stage 1 기준으로 작성되었다(버전 명시 없음).

```js
(원문 예제 — 파이프라인 미검증)
const counter = new Signal.State(0);
const isEven = new Signal.Computed(() => (counter.get() & 1) == 0);
const parity = new Signal.Computed(() => isEven.get() ? "even" : "odd");

// A library or framework defines effects based on other Signal primitives
declare function effect(cb: () => void): (() => void);

effect(() => element.innerText = parity.get());

// Simulate external updates to counter...
setInterval(() => counter.set(counter.get() + 1), 1000);
```

## 깊이

**[② Signal 그래프의 3대 구성 요소] ⭐**
State는 단일 객체로 get/set을 모두 지원하며, Computed는 콜백 실행 시 읽은 Signal들을 `sources` 집합에 자동 기록한다. Watcher는 `watch(...signals)`로 감시 대상을 등록하고, 의존 Signal이 `.set()`되면 `notify`가 트리거된다. Computed의 `sources`는 순서가 보존되며, 각 실행마다 동적으로 갱신된다 — 즉 if-else 분기에 따라 의존 집합이 달라질 수 있다.

**[② Signal 그래프의 3대 구성 요소] 📎**
`SignalOptions`의 `equals`는 `Object.is`를 기본으로 하며, 커스텀 비교 함수를 등록하면 값이 실제로 변한 경우에만 하위 Computed를 dirty로 마킹할 수 있다. `[Signal.subtle.watched]`/`[Signal.subtle.unwatched]` 심볼 콜백은 Signal이 Watcher에 처음 등록되거나 마지막 등록이 해제될 때 호출된다. 원문에 실행 예제 없음.

**[③ 평가 전략과 상태 머신] ⭐**
Computed의 상태는 `~dirty~`(값이 없거나 확실하게 낡음) → `~computing~`(콜백 실행 중) → `~clean~`(값이 유효함)로 전이한다. 간접 의존이 변하면 `~checked~` 상태가 되며, 이는 "소스가 변했지만 직접 소스를 확인하기 전까지 staleness를 알 수 없음"을 의미한다. `.get()`이 호출되면 가장 깊고 왼쪽에 있는 dirty Computed부터 재계산하며, `.set()`은 dirty 마킹을 전파하지만 실제 재계산은 `.get()` 시점까지 지연된다. 이 구조가 batched computation의 착시를 만든다 — 실제로는 batch가 아니라 lazy pull이다.

**[③ 평가 전략과 상태 머신] 📎**
상태 전이 테이블 6가지 중 전환 1(`~checked~` → `~dirty~`)은 즉시 소스 Computed가 재계산되어 값이 바뀐 경우 발생하고, 전환 3(`~clean~` → `~checked~`)은 재귀적이지만 즉각적이지 않은 State 소스가 `.set()`된 경우 발생한다. 원문에 실행 예제 없음.

**[④ 안전성 제약과 동기 실행 모델] ⭐**
`notify` 콜백 내에서 Signal 읽기/쓰기가 금지되는 이유는 **`notify`가 `.set()` 처리 도중에 동기적으로 호출되어 그래프가 일관되지 않은 중간 상태(반가공 상태)에 있기 때문**이다. 이 시점에서 Signal을 읽거나 쓰면 그래프가 불완전한 상태에서 다른 실행 흐름의 로직을 가로막을 수 있다. 따라서 `frozen` 플래그가 true로 설정되며, `State.get()`, `State.set()`, `Computed.get()`, `Watcher.watch()`, `Watcher.unwatch()` 모두 `frozen` 체크에서 예외를 던진다. `untrack`조차 `frozen` 상태를 해제하지 않으므로 이 제한을 우회할 수 없다. 작업은 `queueMicrotask` 등으로 지연시켜야 한다.

**[④ 안전성 제약과 동기 실행 모델] ⭐**
`Signal.subtle.untrack(cb)`는 `computing` 전역 상태를 일시적으로 null로 설정해 의존성 추적을 끄지만, 콜백이 실행되는 동안 `frozen` 상태는 그대로 유지된다. 이 API는 "unsafe"로 명명되어 있으며, untracked 접근이 계산 결과를 바꾸지 않을 때만 사용해야 한다. 그렇지 않으면 의존이 변해도 업데이트되지 않는 Computed가 만들어진다.

**[④ 안전성 제약과 동기 실행 모델] 📎**
Computed 콜백 내에서 다른 Signal에 `.set()`하는 것은 금지되지 않으며, 이는 React의 `setState` in `useEffect`와 유사한 안티패턴을 Signals에서도 재현할 수 있음을 의미한다. 이 설계는 프레임워크 통합의 유연성을 위해 의도적으로 허용되었다.

**[⑤ 표준화 동기와 프레임워크 기반 설계] ⭐**
기존 프레임워크들은 각각 독립적인 auto-tracking 메커니즘을 가져서, 모델과 컴포넌트를 프레임워크 간에 공유하기 어려웠다. 이 제안은 신호 그래프의 의미론을 표준화하여 렌더링 기술과 반응형 모델을 완전히 분리한다. `effect()`를 API에 포함하지 않은 이유는 스케줄링이 프레임워크의 렌더링 사이클과 밀접하게 연결되어 있어, 엔진 레벨에서 강제된 Promise-style 스케줄링이 프레임워크의 유연성을 해치기 때문이다.

**[⑤ 표준화 동기와 프레임워크 기반 설계] 📎**
네이티브 C++ 구현이 JS polyfill보다 상수 배(performance) 효율적일 것으로 기대되지만, 알고리즘 자체는 polyfill과 동일하다. DevTools 측면에서는 Signal 간 참조 그래프와 계산 체인의 콜스택 추적이 가능해질 전망이다. Watcher는 감시 중인 Signal들을 살아있게 유지하므로 `unwatch()`로 명시적 정리가 필요하다. 그렇지 않으면 메모리 누수가 발생한다.

**[⑥ API와 알고리즘 명세] 📎**
hidden global state는 세 가지다: `computing`(현재 재평가 중인 Computed), `frozen`(그래프 수정 금지 여부), `generation`(순환 방지용 증가 정수). "recalculate dirty computed Signal" 알고리즘은 sources 집합을クリア하고 콜백을 실행한 후, 반환값을 "set Signal value" 알고리즘에 전달해 dirty/clean을 결정한다. `equals`에서 예외가 발생하면 예외가 값으로 캐시되고, 콜백이 false를 반환한 것처럼 처리된다. 원문에 실행 예제 없음.

## 비유

**다리 1 — Computed Signal은 스프레드시트 셀이다.** 다른 셀(의존 Signal)을 참조하는 수식을 담고, 참조 셀이 바뀌면 자동으로 재계산된다.
**깨지는 지점:** 스프레드시트는 모든 변경 시 즉시 재계산하는 push 모델인 경우가 많지만, Computed는 `.get()` 호출 시점까지 평가를 지연하는 pull 모델이다. 또한 스프레드시트에는 glitch-free 보장이 기본적으로 고려되지 않는다.

**다리 2 — Watcher의 `notify`는 공장의 '변경 알림 벨'이다.** 원자재가 도착하면 벨이 울리지만, 벨이 울리는 동안에는 생산라인을 멈추고 새 원자재를 바로 투입할 수 없다 — 먼저 라인의 현재 상태를 정리해야 한다.
**깨지는 지점:** 실제 공장과 달리 Signal 그래프의 `notify`는 마이크로초 단위로 동기 실행되며, "라인 정리"에 해당하는 작업이 개발자 몫이 아니라 `frozen` 메커니즘이 자동으로 처리한다. 또한 벨이 울린 후 개발자가 `queueMicrotask`로 작업을 스케줄해야 한다는 점이 공장의 자동화와 다르다.

## 곁가지

- Signal 알고리즘 심화: 상태 전이도 6가지를 구현 레벨에서 추적해야 할 때
- Watcher 기반 effect 스케줄링 심화: 프레임워크 렌더링 사이클과 통합할 때
- Signal과 Proxy 조합 심화: 중첩 반응형 데이터 구조(reactive store)를 설계할 때
- untrack unsafe 패턴 심화: 외부 Observable을 Signal로 감쌀 때
- SSR과 Signal 직렬화 심화: 서버에서 Signal 그래프를 하이드레이션할 때

## 연결

- **Reactive Programming**: Signals는 reactive programming의 glitch-free, pull-based 구현체로, RxJS 등의 Observable(push/stream 기반)과 문제 영역이 다르다.
- **Proxy**: Proxy는 객체 연산을 가로채고, Signal은 셀 간 의존성 그래프를 조정한다. 둘은 조합되어 nested reactive store를 구성할 수 있다.
- **TC39 TC39 프로세스**: Stage 1 제안으로, Promises/A+가 ES2015 Promise로 표준화된 것처럼 polyfill·프레임워크 통합 검증 후 Stage 2+로 진행될 예정이다.

## 레퍼런스

- [TC39 proposal-signals (1차)](https://github.com/tc39/proposal-signals) — JavaScript Signals 표준 제안서 원문. Stage 1 기준 API 스케치, 알고리즘, FAQ를 포함. 버전 명시 없음.
- [Signal Polyfill (2차)](https://github.com/proposal-signals/signal-polyfill) — 제안서의 polyfill 구현. 기본 테스트 포함, 프레임워크 통합 실험용. 버전 명시 없음.
- [What is Reactivity? (2차)](https://www.pzuraq.com/blog/what-is-reactivity) — 반응형 프로그래밍의 정의와 declarative 업데이트 모델 설명. 배경 읽기 자료.

---
## 인출 질문

1. Signal 그래프에서 Computed의 상태가 `~clean~` → `~checked~` → `~clean~`으로 전이하는 조건과, 이 전이가 lazy 평가와 어떻게 연결되는지 설명하라.
2. Watcher의 `notify` 콜백 안에서 Signal 읽기/쓰기가 금지되는 **이유**는 무엇이며, 이 제한을 우회하는 정당한 방법은 무엇인가?

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
