---
title: 'Astro Islands 간 상태 공유: Nano Stores 활용'
pubDate: '2026-07-07T01:34:35+09:00'
description: 'Astro의 Islands 아키텍처에서 Nano Stores를 사용해 프레임워크 간 클라이언트 상태를 공유하는 방법과 API 사용법'
summary: 'Astro의 Islands 아키텍처에서 React, Vue, Svelte 등 서로 다른 프레임워크 컴포넌트 간 상태를 공유하려면 Nano Stores를 사용한다. atom과 map API로 경량 프레임워크 독립 상태 관리를 구현할 수 있다.'
lang: ko
tags:
  - 'frontend'
  - 'astro'
  - 'nanostores'
  - 'state-management'
  - 'islands-architecture'
canonical: 'https://docs.astro.build/en/recipes/sharing-state-islands/'
lintHash: '20080f8a3231'
polishHash: '20080f8a3231'
---

> 한 줄 명제: Astro Islands 아키텍처에서는 React/Vue의 Context 같은 프레임워크 전용 상태 전파 수단을 쓸 수 없으므로, Nano Stores라는 프레임워크 독립적인 경량 상태 저장소를 통해 클라이언트 측 Island 간 상태를 공유한다.

## 큰 그림

```text
Astro Islands 간 상태 공유 (Nano Stores)
├── 문제: Islands 간 상태 격리
│   └── partial hydration 환경에서 framework context 사용 불가
├── 해법: Nano Stores 채택 이유
│   └── <1KB, zero dependency, framework-agnostic
├── 설치: 프레임워크별 helper 패키지
│   └── @nanostores/react / preact / solid / vue (Svelte는 불필요)
├── 핵심 API: atom vs map
│   ├── atom — 단일 원시값 toggle, 카운터 등
│   └── map  — 객체 형태, .setKey()로 개별 키 업데이트
├── 사용 패턴: 읽기/쓰기 구분
│   ├── UI 렌더링 → useStore hook 필요 (re-render 트리거)
│   └── 이벤트 핸들러 내부 → .get() 직접 호출 (렌더링 무관)
└── 제한사항: 서버 컴포넌트에서는 사용 불가
    └── .astro frontmatter, non-hydrated 컴포넌트에서 write/read/subscribe 제한
```

## 핵심

Astro의 Islands 아키텍처에서 컴포넌트는 각각 독립적으로 하이드레이션된다. React의 Context나 Vue의 provide/inject 같은 프레임워크 전용 상태 전파 메커니즘은 Astro 환경에서 동작하지 않는다. 왜냐하면 각 Island가 서로 다른 렌더러로 구동되며, 공통의 상위 provider tree를 공유하지 않기 때문이다. Astro 공식 문서가 권장하는 해법은 Nano Stores다. Nano Stores는 ==1KB 미만의 경량 라이브러리로, 의존성이 없으며 모든 UI 프레임워크에서 동일한 API로 상태를 읽고 쓸 수 있==다.

Nano Stores는 두 가지 기본 타입을 제공한다. `atom`은 단일 값(불리언, 숫자, 문자열 등)을 저장할 때 사용하고, `map`은 객체 형태 상태를 저장할 때 사용하며 `.setKey()` 메서드로 특정 키만 효율적으로 업데이트할 수 있다. 프레임워크별 helper 패키지를 설치하면 `useStore` hook을 통해 컴포넌트 렌더링과 상태 변경을 연동할 수 있다. Svelte는 helper 없이 기본 Svelte store 문법(`$` 접두사)을 그대로 사용할 수 있다.

원문의 이커머스 장바구니 예제를 통해 atom과 map을 함께 사용하는 패턴을 보인다.

(원문 예제 — 파이프라인 미검증)
```js
// src/cartStore.js
import { atom, map } from 'nanostores';

export const isCartOpen = atom(false);

export const cartItems = map({});
```

(원문 예제 — 파이프라인 미검증)
```jsx
// src/components/CartFlyoutToggle.jsx (React 기준)
import { useStore } from '@nanostores/react';
import { isCartOpen } from '../cartStore';

export default function CartButton() {
  const $isCartOpen = useStore(isCartOpen);
  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
  )
}
```

(원문 예제 — 파이프라인 미검증)
```jsx
// src/components/AddToCartForm.jsx (React 기준)
import { addCartItem, isCartOpen } from '../cartStore';

export default function AddToCartForm({ children }) {
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'Astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }

  return (
    <form onSubmit={addToCart}>
      {children}
    </form>
  )
}
```

`addCartItem` 헬퍼는 store 파일 내부에서 정의되며, 이벤트 핸들러 안에서 `useStore` 대신 `.get()`을 직접 호출하는 점이 중요하다. `useStore`는 컴포넌트 리렌더를 트리거할 목적으로 설계되어 있고, 이벤트 처리 로직에서는 값만 읽으면 되기 때문이다.

## 깊이

[문제: Islands 간 상태 격리] ⭐
Astro는 페이지를 정적으로 렌더링하고, `client:load` 등의 디렉티브가 붙은 컴포넌트만 브라우저에서 하이드레이션한다. 각 Island는 독립적인 컴포넌트 트리를 가지므로, React Context 같은 상위 트리 기반 상태 공유가 불가능하다. 대안으로 제시되는 Svelte 내장 store, Solid signals 외부 export, Vue reactivity API, CustomEvent 등은 모두 특정 프레임워크에 종속적이거나 프레임워크 간 통신이 어렵다.

[해법: Nano Stores 채택 이유] 📎
Nano Stores가 선택된 이유는 번들 크기(1KB 미만)와 프레임워크 독립성이다. 원문은 Svelte stores, Solid signals, CustomEvent를 대안으로 언급하지만, "여러 프레임워크를 섞어 쓸 때 일관된 API를 제공한다"는 점에서 Nano Stores를 우선 권장한다. Svelte만 사용하는 프로젝트라면 내장 store로도 충분하다.

[설치: 프레임워크별 helper 패키지] 📎
각 프레임워크에 맞는 helper 패키지를 함께 설치해야 `useStore`를 사용할 수 있다. Svelte는 helper가 필요 없으며, `nanostores`만 설치하면 된다. 버전 명시 없음.

[핵심 API: atom vs map] ⭐
`atom(value)`는 단일 값을 감싸며 `.set(newValue)`로 전체 교체한다. `map(object)`는 객체 저장소로, `.setKey(key, value)`로 특정 필드만 업데이트할 수 있어 불필요한 리렌더를 줄인다. 이커머스 예제에서 `isCartOpen`은 atom, `cartItems`는 map으로 설계된 이유다.

[사용 패턴: 읽기/쓰기 구분] ⭐
컴포넌트 템플릿에서 상태 값을 읽어 UI에 반영할 때는 반드시 `useStore` hook을 사용해야 리렌더가 발생한다. 반면 폼 제출 핸들러, 클릭 이벤트 같은imperative 로직에서는 `.get()`으로 값을 읽거나 `.set()`, `.setKey()`로 값을 쓰는 것이 올바르다. 원문의 FAQ에서 이 차이를 명시하고 있으며, `.get()`을 이벤트 핸들러에서 쓰는 이유는 리렌더가 필요 없기 때문이다.

[제한사항: 서버 컴포넌트에서는 사용 불가] ⭐
`.astro` 파일의 frontmatter나 하이드레이션되지 않은 컴포넌트에서 Nano Stores를 쓰는 것은 세 가지 제한이 있다. 첫째, 서버에서 store에 write해도 클라이언트 컴포넌트에는 반영되지 않는다. 둘째, Nano Store 인스턴스를 props로 전달할 수 없다. 셋째, `.astro` 컴포넌트는 리렌더되지 않으므로 subscribe 자체가 의미가 없다. Nano Stores는 클라이언트 측 반응성을 목적으로 설계되었다.

## 레퍼런스

- https://docs.astro.build/en/recipes/sharing-state-islands/ — Astro 공식 레시피: Nano Stores로 Islands 간 상태 공유 방법, atom/map API 사용 예제 포함 (1차, 버전 명시 없음)
- https://github.com/nanostores/nanostores — Nano Stores 공식 저장소: atom, map, lazy stores API 레퍼런스 (1차)
- https://github.com/withastro/astro/tree/main/examples/with-nanostores — 완성된 이커머스 예제 코드 (1차)
