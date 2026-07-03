---
title: Web Worker
pubDate: '2026-07-01'
description: Web Worker의 동작 원리, 사용 시나리오, 코드 패턴, 적용 기준
---

> Web Worker는 JavaScript를 "더 빠르게" 만드는 기능이 아니라, main thread에서 오래 걸리는 일을 분리해 UI 입력과 렌더링이 막히지 않게 하는 기능이다.

## 1. Web Worker가 해결하는 문제

브라우저 main thread는 JavaScript 실행, style 계산, layout, paint, 이벤트 처리를 함께 맡는다. 큰 계산이 main thread를 오래 점유하면 사용자의 클릭, 탭, 키 입력이 대기하고 INP와 TBT가 나빠진다.

Web Worker는 일부 JavaScript를 별도 worker thread에서 실행한다.

```text
main thread
  - DOM
  - event handling
  - rendering coordination
  - UI state update

worker thread
  - parsing
  - computation
  - indexing
  - transform
  - WebAssembly execution
```

핵심은 UI를 직접 그리는 thread와 무거운 계산을 수행하는 thread를 분리하는 것이다.

## 2. 동작 원리

main thread는 `new Worker()`로 worker script를 시작한다. worker는 main thread와 별도의 global scope에서 실행된다.

```text
main thread
-> Worker 생성
-> postMessage(data)

worker thread
-> message 이벤트 수신
-> 계산 수행
-> postMessage(result)

main thread
-> message 이벤트로 결과 수신
-> DOM/UI 업데이트
```

worker는 DOM에 직접 접근할 수 없다. `document`, DOM node, React state setter 같은 UI 객체를 worker에서 직접 다룰 수 없다. 대신 메시지로 데이터를 주고받고, 최종 UI 반영은 main thread에서 한다.

## 3. 메시지 통신

가장 기본적인 통신 방식은 `postMessage`와 `message` 이벤트다.

```js
// main.js
const worker = new Worker('/worker.js');

worker.postMessage({ type: 'sum', numbers: [1, 2, 3] });

worker.addEventListener('message', (event) => {
  console.log(event.data); // { type: 'sum:result', value: 6 }
});
```

```js
// worker.js
self.addEventListener('message', (event) => {
  if (event.data.type !== 'sum') return;

  const value = event.data.numbers.reduce((acc, n) => acc + n, 0);
  self.postMessage({ type: 'sum:result', value });
});
```

데이터는 기본적으로 structured clone algorithm으로 복사된다. 객체, 배열, Map, Set, ArrayBuffer 같은 값을 보낼 수 있지만 함수, DOM node, class instance의 prototype 의미는 기대대로 유지되지 않을 수 있다.

## 4. Transferable

큰 binary 데이터를 worker로 보낼 때 복사 비용이 크면 worker를 쓰는 이점이 줄어든다. `ArrayBuffer`, `MessagePort`, `OffscreenCanvas` 같은 일부 객체는 복사하지 않고 소유권을 넘길 수 있다.

```js
// main.js
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage({ type: 'process', buffer }, [buffer]);

console.log(buffer.byteLength); // 0, 소유권이 worker로 이동
```

```js
// worker.js
self.addEventListener('message', (event) => {
  const { buffer } = event.data;
  const view = new Uint8Array(buffer);

  // binary 처리
  self.postMessage({ type: 'done', buffer }, [buffer]);
});
```

Transferable은 대용량 이미지, 오디오, 바이너리 파싱, WASM 입력 데이터처럼 복사 비용이 큰 경우에 중요하다.

## 5. Module Worker와 번들러 패턴

현대 프론트엔드에서는 module worker를 쓰는 편이 관리하기 쉽다.

```js
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});
```

Vite, Rollup, Webpack 같은 번들러는 `new URL('./worker.js', import.meta.url)` 패턴을 기준으로 worker 파일을 별도 chunk로 처리할 수 있다.

TypeScript worker 예시는 다음처럼 구성할 수 있다.

```ts
// search.worker.ts
type Request =
  | { id: string; type: 'build-index'; documents: string[] }
  | { id: string; type: 'query'; keyword: string };

type Response =
  | { id: string; type: 'build-index:done' }
  | { id: string; type: 'query:result'; hits: number[] };

self.addEventListener('message', (event: MessageEvent<Request>) => {
  const message = event.data;

  if (message.type === 'build-index') {
    // index 생성
    self.postMessage({ id: message.id, type: 'build-index:done' } satisfies Response);
  }

  if (message.type === 'query') {
    // 검색 수행
    self.postMessage({
      id: message.id,
      type: 'query:result',
      hits: [],
    } satisfies Response);
  }
});
```

```ts
// main.ts
const worker = new Worker(new URL('./search.worker.ts', import.meta.url), {
  type: 'module',
});

worker.postMessage({
  id: crypto.randomUUID(),
  type: 'query',
  keyword: 'performance',
});
```

## 6. Promise wrapper 패턴

실무에서는 요청과 응답을 `id`로 묶어 Promise처럼 감싸면 다루기 쉽다.

```ts
type WorkerRequest = {
  id: string;
  type: 'parse-json';
  text: string;
};

type WorkerResponse = {
  id: string;
  type: 'parse-json:result';
  value: unknown;
};

const worker = new Worker(new URL('./parser.worker.ts', import.meta.url), {
  type: 'module',
});

const pending = new Map<string, (value: unknown) => void>();

worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
  const resolve = pending.get(event.data.id);
  if (!resolve) return;

  pending.delete(event.data.id);
  resolve(event.data.value);
});

function parseJsonInWorker(text: string): Promise<unknown> {
  const id = crypto.randomUUID();

  return new Promise((resolve) => {
    pending.set(id, resolve);
    worker.postMessage({ id, type: 'parse-json', text } satisfies WorkerRequest);
  });
}
```

```ts
// parser.worker.ts
self.addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
  const { id, text } = event.data;
  const value = JSON.parse(text);
  self.postMessage({ id, type: 'parse-json:result', value } satisfies WorkerResponse);
});
```

에러, timeout, cancel까지 넣으면 production에서 더 안전하다.

## 7. 사용 시나리오

Web Worker가 잘 맞는 작업은 CPU 시간이 길고 DOM 접근이 필요 없는 작업이다.

| 시나리오 | 이유 |
|---|---|
| 대용량 JSON/CSV 파싱 | main thread long task를 줄일 수 있음 |
| 클라이언트 검색 index 생성 | 초기화와 검색 계산을 UI와 분리 |
| 이미지 resize/filter 처리 | binary 처리와 픽셀 계산이 무거움 |
| 압축/압축 해제 | CPU bound 작업 |
| diff, syntax highlighting, markdown parsing | 입력이나 렌더링을 막지 않게 분리 |
| WASM 기반 연산 | 무거운 계산을 worker에서 수행 |
| 머신러닝 inference | UI thread를 막지 않도록 분리 |

성능 지표 관점에서는 TBT와 INP 개선 가능성이 크다. 특히 클릭 직후 필터링, 정렬, 대량 계산이 도는 UI에서는 체감 차이가 크다.

## 8. 언제 쓰면 좋은가

다음 조건이 겹치면 worker를 검토한다.

- Performance panel에서 50ms 이상 long task가 반복된다.
- 입력 직후 CPU 작업 때문에 다음 paint가 늦어진다.
- 작업이 DOM 없이 순수 데이터로 표현 가능하다.
- 입력 데이터와 출력 데이터의 크기가 메시지 전달 비용보다 충분히 큰 계산 비용을 가진다.
- 같은 계산을 여러 번 재사용하거나 index처럼 사전 계산할 수 있다.

판단 기준은 단순하다. worker로 보내는 비용보다 main thread를 비워 얻는 이득이 커야 한다.

## 9. 언제 쓰지 않는가

Web Worker가 항상 좋은 것은 아니다.

- DOM 조작이 필요한 작업에는 직접 쓸 수 없다.
- 아주 작은 계산은 worker 생성과 메시지 비용이 더 클 수 있다.
- 네트워크 요청처럼 이미 비동기인 작업은 worker만으로 큰 이득이 없을 수 있다.
- 대용량 객체를 자주 복사하면 structured clone 비용이 병목이 될 수 있다.
- UI state와 강하게 결합된 로직은 메시지 프로토콜이 복잡해질 수 있다.

특히 React component render가 느린 문제를 worker로 해결하려고 하면 방향이 틀릴 수 있다. worker는 render 자체를 대신해주지 않는다. render 비용은 component 분리, memoization, virtualization, state 범위 축소로 먼저 본다.

## 10. Worker 종류

| 종류 | 설명 | 대표 용도 |
|---|---|---|
| Dedicated Worker | 한 페이지나 스크립트가 전용으로 쓰는 worker | 일반 CPU offload |
| Shared Worker | 같은 origin의 여러 browsing context가 공유 | 여러 탭 간 공유 작업 |
| Service Worker | 네트워크 proxy와 cache lifecycle을 담당 | offline, cache, push |
| Worklet | 렌더링/오디오 등 특정 파이프라인에 붙는 경량 worker 계열 | Paint, Audio, Animation |

이 노트에서 말하는 일반적인 Web Worker는 보통 Dedicated Worker다. Service Worker는 이름은 worker지만 목적이 다르다. CPU offload보다 request interception, cache, offline 전략이 핵심이다.

## 11. SharedArrayBuffer와 Atomics

고성능 병렬 처리가 필요하면 `SharedArrayBuffer`와 `Atomics`로 메모리를 공유할 수 있다. 이 방식은 복사나 transfer 없이 여러 worker가 같은 buffer를 볼 수 있다.

다만 보안 이유로 cross-origin isolation이 필요하다.

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

대부분의 일반 웹앱에서는 먼저 `postMessage`와 Transferable로 충분한지 확인하는 편이 낫다.

## 12. 프론트엔드 설계 체크

Worker를 도입할 때는 API 경계를 먼저 설계한다.

```text
UI event
-> main thread validates input
-> worker receives pure data command
-> worker computes result
-> main thread applies UI update
```

체크리스트:

- worker가 받을 command type을 명확히 정의한다.
- request id로 응답 순서를 추적한다.
- error response를 프로토콜에 포함한다.
- timeout과 cancel 정책을 둔다.
- 큰 binary는 Transferable 사용을 검토한다.
- worker lifecycle을 관리한다. 필요 없으면 `worker.terminate()`를 호출한다.
- worker chunk가 초기 로딩 bundle에 들어가지 않는지 확인한다.

## 13. 성능 측정 방법

Worker 도입 전후로 다음을 비교한다.

- Performance panel의 long task 개수와 duration.
- Lighthouse TBT.
- 실제 사용자 INP 또는 interaction latency.
- worker script 다운로드 비용.
- `postMessage` 데이터 복사/transfer 비용.
- memory 사용량.

worker로 옮긴 계산이 빨라졌는지보다 main thread가 입력과 paint를 처리할 여유를 얻었는지가 더 중요하다.

## 14. 인터뷰용 답변

> Web Worker는 무거운 JavaScript 계산을 main thread 밖에서 실행하기 위한 브라우저 기능입니다. worker는 DOM에 직접 접근할 수 없고, main thread와 `postMessage`로 데이터를 주고받습니다. 대용량 파싱, 검색 index 생성, 이미지 처리, WASM 연산처럼 CPU bound이고 DOM 의존이 없는 작업에 적합합니다. 다만 작은 작업이나 UI state와 강하게 결합된 작업은 메시지 비용과 복잡도가 더 커질 수 있어, Performance panel에서 long task와 INP/TBT 병목을 확인한 뒤 적용하는 것이 좋습니다.

## 15. 참고

- [Web Workers API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Using Web Workers — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Structured clone algorithm — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
- [OffscreenCanvas — MDN](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
