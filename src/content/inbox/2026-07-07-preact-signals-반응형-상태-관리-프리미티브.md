---
title: 'Preact Signals — 반응형 상태 관리 프리미티브'
pubDate: '2026-07-07T01:20:29+09:00'
description: 'Preact Signals의 신호(signal)·파생(computed)·사이드이펙트(effect) API로 반응형 상태를 관리한다'
summary: 'Preact Signals가 제공하는 reactive primitives(signal, computed, effect, batch, model)를 통해 컴포넌트 렌더링 최적화와 상태 관리를 구현하는 방법'
lang: ko
tags:
  - 'preact'
  - 'signal'
  - 'reactive-state'
canonical: 'https://preactjs.com/guide/v10/signals/'
lintHash: '3d801fdba771'
polishHash: '3d801fdba771'
---

> 한 줄 명제: Preact Signals는 값의 변화를 자동으로 추적하여 UI를 최소 비용으로 갱신하는 반응형 프리미티브로, 신호의 정체성(identity) 유지와 지연 평가(lazy evaluation)가 핵심 작동 원리이다.

## 큰 그림

```text
Preact Signals = 값의 변화를 자동으로 추적하고 UI에 효율적으로 반영하는 반응형 프리미티브
├── signal: 상태의 원천 — .value로 읽고 쓰며 정체성(identity) 유지
├── computed: 파생 상태 — 읽기 전용, 의존 신호 변경 시 자동 재계산
├── effect: 사이드이펙트 — 신호 변경에 반응하여 임의 코드 실행
├── batch/untracked: 업데이트 제어 — 다중 갱신 통합 및 구독 배제
├── Model: 구조화된 상태 컨테이너 — 캡슐화·자동 정리·자동 배치
├── 렌더링 최적화 — VDOM diffing 없이 신호를 JSX에 직접 전달
└── 유틸리티 — Show/For 컴포넌트, useLiveSignal, useSignalRef
```

## 핵심

Signals는 `.value` 프로퍼티에 상태를 담는 객체로, 신호 자체의 참조는 변하지 않고 값만 갱신된다. 이 정체성 유지 덕분에 Preact는 신호를 props나 context로 전달할 때 참조만 복사하고, 실제로 `.value`에 접근하는 컴포넌트만 재렌더링한다. 컴포넌트 내부에서 `.value`를 읽으면 ==Preact가 자동으로 해당 신호의 변경을 구독하고, 값이 바뀔 때만 해당 컴포넌트를 갱신한다.==

`computed(fn)`은 다른 신호들을 읽어 파생된 값을 만드는 읽기 전용 신호로, 의존 신호가 바뀌면 자동으로 재계산된다. `effect(fn)`은 컴포넌트 밖에서 신호 변경에 반응해 임의의 코드(로그, localStorage 저장, WebSocket 연결 등)를 실행할 때 쓰며, cleanup 함수를 반환하면 다음 실행 전에 이전 사이드이펙트를 정리할 수 있다. 신호는 기본적으로 게으르다(lazy) — `computed`는 누군가 `.value`를 읽기 전까지 재계산하지 않는다.

`batch(fn)`은 여러 신호 갱신을 한 번의 커밋으로 묶고, `untracked(fn)`과 `.peek()`은 신호를 구독하지 않고 현재 값만 읽을 때 쓴다. `createModel(factory)`는 신호·computed·effect·action을 하나의 단위로 묶어 캡슐화하며, 모델이 dispose될 때 내부 effect가 자동으로 정리되고 메서드 호출은 자동으로 batch 처리된다.

JSX에서 신호 객체를 `.value` 없이 그대로 전달하면 Virtual DOM diffing을 건너뛰고 DOM 텍스트 노드에 직접 바인딩하는 최적화가 적용된다.

```
(원문 예제 — 파이프라인 미검증)
import { signal } from '@preact/signals';

const count = signal(0);

function Counter() {
	const value = count.value;

	const increment = () => {
		count.value++;
	};

	return (
		<div>
			<p>Count: {value}</p>
			<button onClick={increment}>click me</button>
		</div>
	);
}
```

```
(원문 예제 — 파이프라인 미검증)
import { signal, computed, effect } from '@preact/signals';

const name = signal('Jane');
const surname = signal('Doe');
const fullName = computed(() => `${name.value} ${surname.value}`);

// Logs name every time it changes:
effect(() => console.log(fullName.value));
// Logs: "Jane Doe"

// Updating `name` updates `fullName`, which triggers the effect again:
name.value = 'John';
// Logs: "John Doe"
```

```
(원문 예제 — 파이프라인 미검증)
import { signal, computed, createModel } from '@preact/signals';

const CounterModel = createModel((initialCount = 0) => {
	const count = signal(initialCount);
	const doubled = computed(() => count.value * 2);

	return {
		count,
		doubled,
		increment() {
			count.value++;
		},
		decrement() {
			count.value--;
		}
	};
});

const counter = new CounterModel(5);
counter.increment();
console.log(counter.count.value); // 6
```

```
(원문 예제 — 파이프라인 미검증)
const count = signal(0);

function Unoptimized() {
	// Re-renders the component when `count` changes:
	return <p>{count.value}</p>;
}

function Optimized() {
	// Text automatically updates without re-rendering the component:
	return <p>{count}</p>;
}
```

## 깊이

[signal: 상태의 원천] ⭐
`signal(initialValue)`는 신호를 생성하고 `.value`로 읽고 쓴다. 동일 값을 재할당하면 갱신이 발생하지 않는다(값 동등성 체크). 컴포넌트 밖에서 만든 신호는 props/context로 전달해도 참조가 복사되므로 상위 컴포넌트가 재렌더링되지 않는다. 컴포넌트 안에서 신호를 만들 때는 `useSignal(initialValue)`를 쓰는데, 이는 `useMemo(() => signal(value), [])`의 얇은 래퍼로 매 렌더링마다 새 신호가 만들어지지 않게 한다.

[computed: 파생 상태] ⭐
`computed(fn)`이 반환하는 신호는 읽기 전용이다. 콜백 안에서 접근한 신호가 바뀔 때만 재계산되며, 아무도 `.value`를 읽지 않으면 게으르게 대기한다. 파생 상태를 최대한 computed로 만들면 single source of truth가 유지되고 디버깅이 쉬워진다. 컴포넌트 내에서는 `useComputed(fn)`을 쓴다.

[effect: 사이드이펙트] ⭐
`effect(fn)`은 컴포넌트 외부에서 신호 변경에 반응할 때 쓴다. computed와 달리 신호를 반환하지 않으며, 변화 시퀀스의 종단점이다. cleanup 함수를 반환하면 다음 실행 전 호출되고, 반환된 dispose 함수를 호출하면 구독을 해제할 수 있다. 메모리 누수 방지를 위해 effect는 반드시 정리해야 한다. 컴포넌트 내에서는 `useSignalEffect(fn)`을 쓴다.

[batch/untracked: 업데이트 제어] 📎
`batch(fn)`은 콜백 내의 다중 신호 갱신을 하나의 커밋으로 묶는다. 배치 안에서 수정된 신호에 접근하면 즉시 갱신된 값을 얻지만, 다른 무효화된 computed 신호는 콜백이 끝날 때까지 실제 재계산이 미뤄진다. 배치는 중첩 가능하며 바깥쪽 콜백이 완료되어야 플러시된다. `untracked(fn)`은 콜백 내에서 신호에 접근해도 구독하지 않게 하며, `.peek()`은 개별 신호의 현재 값을 구독 없이 읽을 때 쓴다. 두 기능은 드문 경우에만 써야 한다.

[Model: 구조화된 상태 컨테이너] 📎
`createModel(factory)`는 신호, computed, effect, action을 한 단위로 묶는다. 팩토리 메서드의 반환 객체에 담긴 모든 메서드는 자동으로 `action()`으로 감싸져 batch + untracked 컨텍스트에서 실행된다. 모델 생성 중 만들어진 effect는 `Symbol.dispose()` 호출 시 자동으로 정리되며, 중첩 모델도 부모가 dispose되면 함께 정리된다. TypeScript에서는 `tsconfig.json`의 `lib`에 `"ESNext.Disposable"`을 추가해야 `Symbol.dispose`가 타입 안전하다. `ReadonlySignal<T>`를 써서 외부에서 직접 `.value`를 수정하지 못하게 하는 패턴을 권장한다. 컴포넌트에서 모델을 쓸 때는 `useModel(modelOrFactory)`가 인스턴스 생성·유지·unmount 시 자동 dispose를 담당한다.

[렌더링 최적화] ⭐
JSX 텍스트 위치에 신호 객체를 `.value` 없이 전달하면 Preact는 Virtual DOM diffing을 건너뛰고 해당 DOM 노드의 텍스트를 직접 갱신한다. 이것이 Signals가 제공하는 가장 핵심적인 성능 이점이다. DOM 엘리먼트의 prop으로 신호를 전달할 때도 유사한 최적화가 적용된다.

[유틸리티] 📎
`@preact/signals/utils`(v2.1.0+)에서 `Show`는 신호 기반 조건부 렌더링, `For`는 신호 배열의 아이템을 자동 캐싱하며 렌더링하는 컴포넌트를 제공한다. `useLiveSignal`은 외부 신호와 동기화되는 로컬 신호를 만들고, `useSignalRef`는 `.current` 프로퍼티를 가진 ref 스타일 신호를 생성한다.

## 비유

**다리:** 신호를 '변화를 알려주는 벨이 달린 상자'로 생각하라. 상자(신호) 자체는 고정되어 있고, 내용물(.value)이 바뀌면 벨이 울려서 지켜보는 사람(구독자)에게 알린다. 상자를 다른 방(props/context)으로 옮겨도 상자 자체는 그대로이므로 옮기는 사람은 변화에 반응하지 않고, 내용물을 직접 들여다본 사람만 벨을 듣는다.

**깨지는 지점:** 이 비유는 신호가 '수동적 알림'만 한다고 암시하지만, 실제로 computed는 게으르게(lazy) 작동해서 아무도 `.value`를 읽지 않으면 벨조차 울리지 않는다. 또한 batch는 여러 벨 소리를 하나의 알림으로 합치는데, 상자 비유로는 이 '합치기' 동작을 자연스럽게 표현할 수 없다.

## 곁가지

- Signals 내부 디펜던시 추적 심화: 신호 그래프의 DAG 구조와 fine-grained reactivity가 필요해질 때
- Signals vs useState/useReducer 비교 심화: Preact와 React 생태계 간 상태 관리 전략을 선택해야 할 때
- Model + TypeScript 패턴 심화: 대규모 앱에서 타입 안전 모델 아키텍처를 설계해야 할 때

## 연결

- Preact Context: 전역 상태를 props drilling 없이 컴포넌트 트리에 주입하는 표준 수단으로 Signals와 결합
- Virtual DOM diffing: Signals의 JSX 직접 바인딩 최적화가 VDOM 오버헤드를 우회하는 지점
- Reactivity 시스템 전반: Vue reactivity, Solid signals, MobX와 개념적 공통점(observable → subscriber 패턴)과 차이점 비교

## 레퍼런스

- [Preact Guide — Signals](https://preactjs.com/guide/v10/signals/) (1차) — Preact Signals의 설치부터 signal/computed/effect/batch/Model까지 전체 API와 사용 패턴을 다룬 공식 가이드. 기준 버전: Preact v10, @preact/signals 기준 버전 명시 없음.
- [@preact/signals-core (GitHub)](https://github.com/preactjs/signals) (1차) — Preact 독립 신호 라이브러리의 핵심 구현 저장소.
- [@preact/signals-react (GitHub)](https://github.com/preactjs/signals/tree/main/packages/react) (1차) — React용 Signals 어댑터 저장소.
- [Signals Debug (GitHub)](https://github.com/preactjs/signals/blob/main/packages/debug) (2차) — 신호 갱신·effect 실행·computed 재계산을 콘솔에 출력하는 디버깅 도구.
- [Signals DevTools (GitHub)](https://github.com/preactjs/signals/blob/main/packages/devtools-ui) (2차) — Signals를 시각적으로 디버깅하는 DevTools UI.

---
## 인출 질문

1. 신호를 props로 전달해도 상위 컴포넌트가 재렌더링되지 않는 이유를 정체성(identity) 관점에서 한 문장으로 설명하라.
2. `batch()` 안에서 수정된 신호에 접근한 computed와 그렇지 않은 computed의 갱신 시점은 어떻게 다른가?
3. effect가 메모리 누수를 일으킬 수 있는 상황과 이를 방지하는 방법을 서술하라.

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
