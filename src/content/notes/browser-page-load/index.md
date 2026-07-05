---
title: Browser Page Load Flow
pubDate: '2026-07-01'
description: 브라우저가 페이지를 요청하고 렌더링하고 입력에 반응하기까지의 흐름
summary: "URL 입력부터 navigation·connection·요청·HTML 파싱·렌더링·JS 실행·입력 처리까지 브라우저 로딩 파이프라인을 단계별 비용 모델로 정리하고, 각 구간에 붙는 성능 지표(TTFB·FCP·LCP·CLS·TBT·INP)와 프론트엔드 개선 체크를 연결한 노트."
lang: ko
tags: ['web-performance', 'browser', 'core-web-vitals', 'frontend']
lintHash: 'e9fdf19f26e0'
---

> 10년차 프론트엔드 개발자는 브라우저 흐름을 "네트워크 → 파싱 → 리소스 발견 → 렌더링 → JavaScript 실행 → 입력 처리"의 비용 모델로 설명할 수 있어야 한다.

## 1. 전체 흐름

브라우저는 URL 하나를 화면과 상호작용 가능한 문서로 만들기 위해 여러 파이프라인을 동시에 움직인다.

```text
navigation
-> DNS / TCP / TLS
-> request / response
-> HTML streaming parse
-> resource discovery
-> DOM / CSSOM
-> style / layout / paint / composite
-> JavaScript execution / hydration
-> user interaction / event loop
```

성능 지표는 이 흐름의 특정 구간에 붙는다.

| 구간 | 관련 metric | 사용자가 느끼는 문제 |
|---|---|---|
| 서버 첫 응답 | TTFB | 페이지 시작 자체가 늦음 |
| 첫 paint | FCP | 빈 화면이 오래 지속됨 |
| 주요 콘텐츠 paint | LCP | 핵심 이미지/콘텐츠가 늦게 보임 |
| layout 안정성 | CLS | 보이던 요소가 밀림 |
| main thread 여유 | TBT | 로딩 중 입력이 먹통처럼 느껴짐 |
| 입력 처리 | INP | 클릭/탭 후 반응이 늦음 |

## 2. Navigation과 connection setup

브라우저는 URL을 해석한 뒤 DNS 조회, TCP 연결, TLS handshake를 거쳐 서버나 CDN에 요청을 보낸다. 이 구간은 사용자가 화면을 보기 전의 네트워크 준비 단계이며, TTFB와 LCP의 앞부분을 밀어낼 수 있다.

세부 노트:

- [DNS Resolution](/notes/dns-resolution/): 도메인 이름을 IP 주소로 바꾸는 분산 조회 과정.
- [TCP Connection](/notes/tcp-connection/): 클라이언트와 서버 사이에 신뢰 가능한 byte stream을 만드는 과정.
- [TLS Handshake](/notes/tls-handshake/): 서버 인증, 암호화 키 합의, HTTP 버전 협상을 수행하는 과정.

```text
URL 입력
-> DNS: khw1031.github.io가 어떤 IP인지 찾음
-> TCP: 해당 IP:443과 연결을 만듦
-> TLS: 서버가 진짜인지 확인하고 암호화 채널을 만듦
-> HTTP: 암호화된 연결 위로 요청/응답을 주고받음
```

HTTP/2는 하나의 TCP 연결 위에서 여러 요청을 multiplexing하고, HTTP/3는 QUIC 위에서 TLS 1.3을 통합해 connection setup과 packet loss 영향을 다르게 처리한다.

시니어가 알아야 할 점:

- 같은 도메인의 연결 재사용 여부가 리소스 요청 비용에 영향을 준다.
- CDN cache hit/miss는 프론트엔드 성능 지표에도 직접 반영된다.
- redirect chain은 TTFB와 LCP를 밀어낸다.
- `preconnect`는 필요한 origin에만 써야 한다. 남용하면 오히려 연결 비용을 앞당겨 낭비한다.

개발 관련 체크:

- 불필요한 redirect를 제거한다.
- critical asset이 다른 origin에 있다면 `preconnect`를 검토한다.
- CDN cache-control, stale-while-revalidate, immutable asset 전략을 백엔드/CDN과 맞춘다.
- 프론트엔드 라우팅만 보지 말고 document request의 waterfall을 먼저 본다.

## 3. Request, server response, TTFB

TTFB는 브라우저가 요청을 보낸 뒤 첫 응답 바이트를 받기까지의 시간이다. SSR, middleware, 인증, API waterfall, cache miss가 모두 TTFB를 키울 수 있다.

시니어가 알아야 할 점:

- TTFB는 백엔드만의 문제가 아니다. SSR 프레임워크에서 프론트엔드 코드가 HTML 응답 생성을 막을 수 있다.
- 개인화 데이터, 추천 데이터, A/B 테스트 로직은 document response를 막지 않도록 분리해야 한다.
- streaming SSR은 첫 바이트를 빨리 보낼 수 있지만, critical content가 늦게 stream되면 LCP가 여전히 나쁠 수 있다.
- Edge rendering은 가까운 위치에서 응답할 수 있지만 데이터 원본이 멀면 origin round trip이 병목이 된다.

개발 관련 체크:

- initial HTML에 꼭 필요한 데이터와 나중에 받아도 되는 데이터를 분리한다.
- SSR 단계에서 중복 API 호출과 waterfall을 제거한다.
- document request의 cacheability를 명확히 설계한다.
- TTFB가 느린 페이지는 Lighthouse보다 Network waterfall과 server timing을 먼저 본다.

## 4. HTML streaming parse와 preload scanner

브라우저는 HTML 전체가 도착하기 전에 streaming으로 파싱을 시작한다. 이때 preload scanner가 HTML 안의 CSS, JS, 이미지 같은 리소스를 먼저 발견해 병렬 요청을 시작할 수 있다.

시니어가 알아야 할 점:

- HTML에 직접 드러난 `<img>`, `<link rel="stylesheet">`, `<script>`는 일찍 발견될 수 있다.
- CSS 안의 `background-image`는 CSS 다운로드와 파싱 이후에야 드러나는 경우가 많아 LCP 이미지로 불리할 수 있다.
- JavaScript가 실행된 뒤 생성되는 이미지나 컴포넌트는 리소스 발견 자체가 늦어진다.
- `preload`는 브라우저의 우선순위 판단을 바꾸는 강한 힌트라 critical resource에만 써야 한다.

개발 관련 체크:

- LCP 후보 이미지는 가능하면 HTML의 `<img>`로 노출한다.
- hero 이미지에는 `fetchpriority="high"`와 `loading="eager"`를 검토한다.
- CSS background로만 노출되는 중요 이미지는 preload 필요성을 검토한다.
- JS 실행 후에야 critical content가 생기는 구조를 줄인다.

## 5. DOM, CSSOM, render-blocking resource

브라우저는 HTML로 DOM을 만들고 CSS로 CSSOM을 만든 뒤 render tree를 구성한다. CSS는 기본적으로 렌더링을 막고, 일부 JavaScript는 HTML 파싱을 막는다.

시니어가 알아야 할 점:

- CSS는 layout과 paint에 필요하므로 critical CSS가 늦으면 FCP와 LCP가 늦어진다.
- parser-blocking script는 HTML 파싱을 중단시킨다.
- `defer` script는 HTML 파싱을 막지 않고 DOMContentLoaded 전에 순서대로 실행된다.
- `async` script는 다운로드 후 즉시 실행되어 순서가 보장되지 않는다.
- module script는 기본적으로 defer처럼 동작한다.

개발 관련 체크:

- 초기 화면에 필요한 CSS와 나중 화면 CSS를 분리한다.
- third-party script는 가능하면 async/defer/lazy 전략을 둔다.
- 디자인 시스템 CSS가 전체 페이지의 render-blocking 비용이 되지 않는지 본다.
- CSS-in-JS를 쓴다면 runtime style injection이 FCP/LCP에 미치는 비용을 확인한다.

## 6. Style, layout, paint, composite

브라우저는 style 계산, layout, paint, composite 단계를 거쳐 픽셀을 화면에 올린다. 레이아웃을 바꾸는 속성과 합성만 바꾸는 속성은 비용이 다르다.

시니어가 알아야 할 점:

- `width`, `height`, `top`, `left` 변경은 layout을 다시 유발할 수 있다.
- `transform`, `opacity`는 대체로 composite 단계에서 처리되어 애니메이션에 유리하다.
- DOM 크기가 크고 selector가 복잡하면 style 계산 비용이 커진다.
- layout read 뒤 layout write를 반복하면 forced synchronous layout이 발생할 수 있다.

개발 관련 체크:

- 애니메이션은 가능하면 `transform`과 `opacity` 중심으로 만든다.
- 큰 리스트는 virtualization을 적용한다.
- layout 측정과 DOM 변경을 한 프레임 안에서 섞지 않는다.
- DevTools Performance에서 Layout, Recalculate Style, Paint 비용을 따로 본다.

## 7. Image, font, media loading

이미지와 폰트는 LCP, CLS, FCP에 직접 영향을 준다. 브라우저는 viewport, preload, priority, cache 상태를 기준으로 다운로드 우선순위를 정한다.

시니어가 알아야 할 점:

- 이미지 크기를 예약하지 않으면 로딩 뒤 layout shift가 발생한다.
- 웹폰트는 텍스트 표시를 막거나 폰트 교체로 레이아웃 변화를 만들 수 있다.
- responsive image는 실제 viewport보다 큰 이미지를 내려받지 않게 하는 핵심 도구다.
- lazy loading은 below-the-fold에는 좋지만 LCP 이미지에 쓰면 해롭다.

개발 관련 체크:

- 모든 이미지에 `width`/`height` 또는 CSS `aspect-ratio`를 둔다.
- LCP 이미지는 lazy loading하지 않는다.
- `srcset`/`sizes`로 viewport별 적정 이미지를 제공한다.
- `font-display`와 preload를 폰트 중요도에 맞춰 조정한다.

## 8. JavaScript download, parse, compile, execute

JavaScript 비용은 다운로드 크기만이 아니다. 브라우저는 JS를 파싱하고 컴파일하고 실행해야 하며, 실행 중에는 main thread를 점유한다.

시니어가 알아야 할 점:

- 큰 bundle은 network 비용뿐 아니라 parse/compile/evaluate 비용도 만든다.
- ESM 구조는 tree shaking에 유리하지만 side effect가 많으면 제거가 어렵다.
- barrel export는 편하지만 불필요한 모듈 평가를 유발할 수 있다.
- hydration은 HTML을 다시 상호작용 가능한 컴포넌트로 연결하는 비용이다.
- [Web Worker](/notes/web-worker/)는 DOM과 분리된 별도 실행 컨텍스트에서 CPU 작업을 처리해 main thread blocking을 줄일 수 있다.

개발 관련 체크:

- route-level code splitting과 dynamic import를 적용한다.
- 초기 렌더에 필요 없는 컴포넌트는 lazy load한다.
- package export, sideEffects, barrel export 구조를 점검한다.
- hydration 범위를 줄이고 island/partial hydration 전략을 검토한다.
- bundle analyzer로 transfer size와 parsed/evaluated module을 같이 본다.

## 9. Event loop, long task, TBT

브라우저 main thread는 JavaScript 실행, style, layout, paint, 이벤트 처리를 함께 맡는다. 긴 task가 main thread를 점유하면 사용자의 입력이 대기한다.

시니어가 알아야 할 점:

- long task는 main thread를 50ms 이상 점유하는 작업이다.
- TBT는 Lighthouse lab 환경에서 FCP 이후 main thread blocking을 진단하는 지표다.
- 하나의 거대한 동기 작업보다 여러 작은 작업으로 나누는 편이 입력 응답성에 유리하다.
- microtask가 과도하게 이어지면 다음 paint나 input 처리 기회를 늦출 수 있다.

개발 관련 체크:

- 큰 계산은 [Web Worker](/notes/web-worker/)로 보낸다.
- 긴 loop는 chunking하거나 scheduling한다.
- 이벤트 핸들러 안에서 비싼 계산과 대량 DOM 변경을 피한다.
- third-party script가 long task를 만드는지 Performance panel에서 확인한다.

## 10. User interaction, INP

INP는 사용자의 클릭, 탭, 키 입력부터 브라우저가 다음 프레임을 그릴 수 있을 때까지의 시간이다. 입력 지연, 이벤트 처리 시간, presentation delay가 모두 포함된다.

시니어가 알아야 할 점:

- INP는 field metric이라 실제 사용자 기기와 사용 흐름의 영향을 받는다.
- 좋은 lab 점수가 좋은 INP를 보장하지 않는다.
- 로딩 중 상호작용은 특히 느릴 수 있으므로 "로드 완료 후 클릭"만 테스트하면 병목을 놓친다.
- React/Vue 같은 프레임워크에서는 상태 변경 후 re-render 범위가 INP에 크게 작용한다.

개발 관련 체크:

- 흔한 사용자 플로우를 느린 기기 조건에서 직접 조작하며 프로파일링한다.
- 입력 직후 필요한 state update와 나중에 해도 되는 작업을 분리한다.
- 리스트 필터링, 검색, 정렬은 debounce, transition, Worker, virtualization을 검토한다.
- optimistic UI로 사용자의 즉각 피드백을 먼저 제공한다.

## 11. SPA navigation과 bfcache

초기 document load 이후의 SPA route transition은 Lighthouse 단발 측정에 잘 잡히지 않는다. 사용자는 첫 로딩보다 이후 이동에서 더 많은 시간을 보낼 수 있다.

시니어가 알아야 할 점:

- client-side routing은 document request를 줄이지만 JS와 data fetching 비용을 남긴다.
- route 전환마다 data waterfall, layout shift, suspense fallback이 발생할 수 있다.
- bfcache는 이전 페이지를 빠르게 복원하지만 unload handler, 특정 API 사용 등이 복원을 막을 수 있다.
- soft navigation 성능은 별도로 RUM 계측해야 한다.

개발 관련 체크:

- route별 data prefetch 정책을 둔다.
- route transition skeleton의 크기를 실제 콘텐츠와 맞춘다.
- back/forward 복원이 깨지는 API 사용을 점검한다.
- RUM 이벤트에 route name, device, network, interaction target을 함께 보낸다.

## 12. 실무 디버깅 순서

성능 문제는 점수부터 보지 말고 어느 구간에서 시간이 쓰였는지 먼저 나눈다.

```text
1. Network waterfall로 document request와 critical resource 확인
2. LCP element와 LCP breakdown 확인
3. Coverage / bundle analyzer로 초기 JS와 CSS 비용 확인
4. Performance panel로 long task, layout, paint 확인
5. Lighthouse는 재현 가능한 lab 회귀 감지에 사용
6. CrUX/RUM은 실제 사용자 추세 확인에 사용
```

인터뷰용 답변:

> 브라우저 흐름을 네트워크, 리소스 발견, 렌더링, JavaScript 실행, 입력 처리로 나눠 봅니다. LCP가 느리면 LCP element와 리소스 발견/다운로드/렌더링 지연을 보고, TBT나 INP가 나쁘면 main thread long task와 hydration, 이벤트 핸들러, re-render 범위를 봅니다. CLS는 이미지나 동적 영역의 공간 예약 문제로 접근합니다. 그래서 성능 개선은 Lighthouse 점수 조정이 아니라 브라우저 파이프라인의 병목을 단계별로 줄이는 작업이라고 설명할 수 있습니다.

## 13. 참고

- [Core Web Vitals — web.dev](https://web.dev/articles/vitals)
- [Largest Contentful Paint — web.dev](https://web.dev/articles/lcp)
- [Interaction to Next Paint — web.dev](https://web.dev/articles/inp)
- [Cumulative Layout Shift — web.dev](https://web.dev/articles/cls)
- [Total Blocking Time — Chrome for Developers](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)
