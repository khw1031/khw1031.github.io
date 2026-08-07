---
title: 'Nano Stores — 프레임워크 독립적 원자적 상태 관리'
pubDate: '2026-07-07T01:27:36+09:00'
noteId: FE-2607-010
description: 'React·Vue·Svelte 등에서 동작하는 340~864바이트 제로-의존성 상태 관리 라이브러리의 구조와 사용법.'
summary: '프레임워크에 독립적인 원자적 스토어 아키텍처로, 컴포넌트에서 비즈니스 로직을 분리하고 lazy mount 패턴으로 리소스를 최적화한다.'
lang: ko
tags:
  - 'frontend'
  - 'state-management'
  - 'atomic-stores'
  - 'lazy-stores'
  - 'ssr'
canonical: 'https://github.com/nanostores/nanostores'
lintHash: '502a3213900d'
polishHash: '502a3213900d'
---

> 한 줄 명제: Nano Stores는 프레임워크에 독립적인 원자적(atom) 스토어를 단위로 상태와 로직을 관리하며, 리스너 기반 lazy mount 생명주기를 통해 실제로 사용되는 스토어만 리소스를 소비하게 한다.

## 큰 그림

```text
Nano Stores: 프레임워크 독립적 원자적 상태 관리
├── Atoms & Maps: 기본 스토어 타입과 값 조작 API
├── Lazy Mount: 리스너 기반 자동 활성화/비활성화 생명주기
├── Computed & Batched: 파생 상태와 일괄 갱신 최적화
├── Effects & Events: 다중 스토어 구독과 라이프사이클 훅
├── Framework Integration: React/Vue/Svelte 등 프레임워크별 바인딩
└── Best Practices: 컴포넌트→스토어 로직 이전과 반응 분리
```

## 핵심

Nano Stores는 340~864바이트(brotli 압축 기준) 크기의 제로-의존성 상태 관리 라이브러리로, React·React Native·Preact·Vue·Svelte·Solid·Lit·Angular·Alpine.js 및 바닐라 JS까지 동일한 스토어 인터페이스를 공유한다. 전통적인 단일 전역 스토어 대신 다수의 원자적(atom) 스토어를 조합하는 방식을 취하며, 이로 인해 tree-shaking이 자연스럽게 동작한다 — 번들러가 청크 내 컴포넌트가 실제로 참조하는 스토어만 포함시키기 때문이다.

스토어는 `atom`으로 단일 값을, `map`으로 1단계 깊이의 객체를 관리한다. 각 스토어는 `.set()`(전체 교체), `.get()`(현재 값 읽기), `.subscribe()`/`.listen()`(변경 구독) 메서드를 제공하며, `map`은 추가로 `.setKey()`로 특정 키만 변경할 수 있다. TypeScript에서는 제네릭 타입 파라미터로 값의 타입을 명시할 수 있고, `StoreValue<Store>` 헬퍼로 스토어 값 타입을 추출할 수 있다.

가장 특징적인 설계는 **lazy mount** 생명주기다. ==모든 스토어는 리스너가 하나도 없을 때 "disabled" 모드로 진입하고, 첫 리스너가 붙을 때 "mount" 모드로 전환된다.== `onMount` 콜백은 mount 진입 시 실행되고, 반환하는 함수는 disabled 진입 시(마지막 리스너 해제 후 1초 지연 후) 실행된다. 이를 통해 스토어 자체가 타이머 실행, 네트워크 연결, URL 라우팅 감시 등의 사이드 이펙트를 담당하면서도, UI에서 사용하지 않을 때는 리소스를 전혀 소비하지 않는다.

파생 상태는 `computed`로 정의하며, 의존 스토어가 변경될 때마다 즉시 재계산된다. 여러 의존을 동시에 변경할 때 불필요한 중간 계산을 막으려면 `batched`를 사용한다 — 이는 틱(tick)이 끝날 때까지 기다렸다가 한 번만 갱신한다. `batch` 함수는 여러 `.set()` 호출을 단일 트랜잭션으로 묶어, 리스너와 이펙트가 최종 값에 대해서만 한 번 실행되게 한다.

프레임워크 통합은 각각의 어댑터 패키지(`@nanostores/react`, `@nanostores/vue` 등)가 제공되며, 공통 패턴은 `useStore()` 훅(또는 동등한 composable)을 통해 스토어 값을 읽고 변경 시 리렌더링을 트리거하는 것이다. Svelte는 자체 스토어 계약을 이미 만족하므로 `$` 접두사 문법으로 바로 사용 가능하다.

```ts
// store/users.ts
import { atom } from 'nanostores'

export const $users = atom<User[]>([])

export function addUser(user: User) {
  $users.set([...$users.get(), user])
}
```
(원문 예제 — 파이프라인 미검증)

```ts
// store/admins.ts
import { computed } from 'nanostores'
import { $users } from './users.js'

export const $admins = computed($users, users => {
  // This callback will be called on every `users` changes
  return users.filter(user => user.isAdmin)
})
```
(원문 예제 — 파이프라인 미검증)

```tsx
// components/admins.tsx
import { useStore } from '@nanostores/react'
import { $admins } from '../stores/admins.ts'

export const Admins = () => {
  const admins = useStore($admins)
  return (
    <ul>
      {admins.map(user => (
        <UserItem user={user} />
      ))}
    </ul>
  )
}
```
(원문 예제 — 파이프라인 미검증)

## 깊이

### Atoms & Maps — `atom`과 `map`의 선택 기준과 타입 안정성 ⭐
`atom`은 문자열, 숫자, 배열 등 임의의 값을 단일 단위로 다룬다. 객체를 `atom`으로 저장하면 키별 변경이 금지되고 전체 객체 교체가 강제되므로, 불변성 패턴을 유지하기 쉽다. `map`은 1단계 깊이 객체 전용이며, `.setKey(key, value)`로 특정 키만 변경할 수 있고, 리스너는 변경된 키 이름을 세 번째 인자로 받는다. `undefined`를 설정하면 선택적 키가 제거된다. `listenKeys`와 `subscribeKeys`는 특정 키(또는 기본 키 — `user` 리스너가 `user.name` 변경에도 반응)만 관찰할 수 있게 하며, `subscribeKeys`는 구독 시점에서 즉시 콜백을 한 번 실행한다. `subscribe`와 달리 `listen`은 초기 호출이 없다.

### Lazy Mount — `onMount` 반환 함수의 정리 타이밍과 테스트 전략 ⭐
`onMount`는 첫 리스너 구독 시(디바운스 포함) 실행되고, 반환 함수는 마지막 리스너 해제 후 **1초 지연** 후에 실행된다. 이 지연은 리스너의 빠른 구독 해제-재구독 시(stale-unmount flickering) 리소스를 재초기화하지 않기 위한 방어 기제다. 테스트 환경에서는 `keepMount(store)`로 스토어를 강제로 활성 모드로 유지하고, `cleanStores()`로 테스트 간 상태를 정리한다. `task()`로 감싼 비동기 작업은 `await allTasks()`로 완료 대기할 수 있어, SSR이나 테스트에서 데이터 로딩이 끝난 시점을 동기적으로 기다릴 수 있다.

### Computed & Batched — `batched`의 지연 갱신과 `batch` 트랜잭션 ⭐
`computed`는 의존 스토어가 변경될 때마다 **즉시** 콜백을 실행한다. 의존 두 개를 동시에 변경하면 콜백이 두 번 실행된다. `batched`는 동일하지만 **틱 끝까지 기다렸다가** 한 번만 갱신한다. `batch(() => { ... })`는 여러 `.set()`을 하나의 트랜잭션으로 묶으며, 중첩 배치가 가능하고 가장 바깥쪽 배치 반환 시에만 리스너가 한 번 실행된다. 배치 내 `map#setKey`는 coalesce되어 `changed` 키가 `undefined`가 되며, `listenKeys` 구독자도 한 번만 실행된다.

### Effects & Events — `effect`의 클린업 패턴과 `onSet` 검증 훅 📎
`effect`는 여러 atom을 동시에 구독하며, 초기 실행 시 초기값으로 콜백을 실행하고, 변경 시마다 재실행한다. 콜백이 반환하는 함수는 다음 실행 전에 정리용 클린업으로 호출된다. `effect` 자체도 클린업 함수를 반환하므로 전체 이펙트를 취소할 수 있다. 스토어 이벤트 훅 중 `onSet`은 변경 적용 전에 실행되며, `abort()`로 변경을 차단할 수 있어 유효성 검증에 유용하다. `onNotify`는 리스너 알림 전 훅이며 동일하게 `abort()` 가능하다. `payload.shared` 객체로 이벤트 리스너 간 통신이 가능하다.

### Framework Integration — Svelte의 `$` 접두사 충돌과 프레임워크별 패턴 ⭐
React/Preact/Vue/Solid/Lit/Angular/Alpine.js 모두 공식 어댑터 패키지를 제공한다. 공통 패턴은 `useStore()`(또는 동등한 훅/composable/controller)로 값 추출 + 자동 리렌더링이다. Svelte는 자체 스토어 계약을 이미 만족하므로 `$storeName` 문법으로 바로 사용 가능하며, Nano Stores가 권장하는 `$` 접두사 스타일과 충돌하므로 Svelte에서는 접두사를 피하는 것을 권장한다. Angular는 `NanostoresService`를 통해 RxJS Observable로 변환하며, `switchMap` 등으로 중첩 스토어 체이닝이 가능하다. SSR에서는 `isServer` 플래그로 초기 상태를 설정하고 `allTasks()`로 비동기 로딩 완료를 기다린 후 렌더링한다.

### Best Practices — 로직 이전과 `get()` 제한 ⭐
스토어는 값 저장뿐 아니라 타이머 추적, 서버 데이터 로딩, 라우팅 감시 등의 로직을 담당한다. 컴포넌트와 무관한 모든 로직을 스토어로 이전하면 테스트 용이성이 증가하고 프레임워크 변경(예: React Native 버전 추가)이 쉬워진다. "변경"과 "반응"을 분리해야 한다 — 값을 변경하는 액션 함수 내에서 `store.get()`으로 즉시 반응하는 대신, 별도 리스너에서 반응하도록 구성한다. 이는 지속형 스토어가 다른 브라우저 탭에서 값을 가져오는 등, 액션 함수 외부에서도 값이 변경될 수 있기 때문이다. `get()`은 테스트 환경에서만 사용하고, UI에서는 `useStore()`, `$store`, `Store#subscribe()`로 구독 기반 렌더링을 해야 최신 데이터가 보장된다.

## 레퍼런스

- https://github.com/nanostores/nanostores — Nano Stores 공식 저장소. 원자적 스토어 타입, lazy mount 생명주기, 프레임워크별 통합 가이드, 모범 사례를 포함하는 1차 문서 (버전 명시 없음)
- https://github.com/ai/size-limit — Size Limit 프로젝트. Nano Stores가 번들 크기 제어에 사용하는 도구 (2차)
- https://nextjs.org/blog/next-11-1#es-modules-support — Next.js 11.1+의 ESM external 지원 문서. Nano Stores의 ESM-only 제한에 대한 대안 설정 참조 (2차)
