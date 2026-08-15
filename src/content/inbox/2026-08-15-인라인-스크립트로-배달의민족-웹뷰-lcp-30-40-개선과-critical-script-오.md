---
title: '인라인 스크립트로 배달의민족 웹뷰 LCP 30~40% 개선과 critical-script 오픈소스'
pubDate: '2026-08-15T22:44:51+09:00'
description: 'HTML 인라인 스크립트로 API 프리페칭을 병렬화해 배달의민족 웹뷰 LCP를 30~40% 개선하고 Vite 플러그인 critical-script로 오픈소스화한 사례'
summary: '배달의민족 커머스 웹뷰에서 HTML 인라인 스크립트로 API 요청을 JS 번들 다운로드와 병렬화해 LCP 30~40%를 개선했다. 관리 문제를 해결하기 위해 ?as-critical-script import suffix 기반 Vite 플러그인을 만들어 우아한형제들 GitHub에 오픈소스로 공개했다.'
lang: ko
tags:
  - 'performance'
  - 'optimization'
  - 'frontend'
  - 'core-web-vitals'
canonical: 'https://www.linkedin.com/posts/%EC%9A%A9%ED%98%81-%EC%B6%94-00a4611b1_html-%EC%9D%B8%EB%9D%BC%EC%9D%B8-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%98%EC%97%AC-%EB%B0%B0%EB%8B%AC%EC%9D%98%EB%AF%BC%EC%A1%B1-%EC%A3%BC%EC%9A%94-%EC%9B%B9%EB%B7%B0-%EB%A1%9C%EB%94%A9-%EC%84%B1%EB%8A%A5lcp-share-7493926651261542400-svMU/?utm_source=social_share_send&utm_medium=ios_app&rcm=ACoAAB15JU0Bh0ozoFHKUp6BqJa4W5v2yqNn5k8&utm_campaign=share_via'
lintHash: 'fcaffaa6477c'
---

## TL;DR
- HTML에 인라인 스크립트를 심어 API 호출을 JS 번들 다운로드와 병렬화하면 웹뷰 LCP가 30~40% 개선되며, 이를 Vite 플러그인 `critical-script`로 오픈소스화했다.

## 큰 그림
```
[기존 로딩 흐름 — 직렬 병목]
HTML 수신 → JS 번들 DL → JS 실행 → API 호출 → 렌더링
                                    ↑ 여기까지 화면 없음

[개선 후 — 병렬화]
HTML 수신 ─┬→ 인라인 스크립트 즉시 실행 → API 프리페칭 시작
           └→ JS 번들 DL (동시 진행)
                    ↓ 번들 실행 시 API 응답 이미 대기 → 즉시 렌더링

[도구화]
TS 모듈 + ?as-critical-script suffix
  → Vite 플러그인이 인라인 번들링
  → React 프리렌더링 시 <script> 주입
```

## 핵심
일반적 SPA는 HTML→번들→API가 순차적으로 이어져, API 응답이 도착할 때까지 화면이 비어 있다. 저자는 "HTML을 받자마자 인라인 스크립트로 API를 쏘면 번들 다운로드와 통신이 겹친다"는 착안을 배달의민족 커머스 웹뷰에 적용했고, 그 결과 LCP 30~40% 개선을 보고한다(저자 주장). 부수 효과로, 메인 번들 실행 전에 네이티브 브릿지를 호출해 인셋 값을 가져와 스켈레톤 UI에 적용하면 CLS 없이 자연스러운 초기 화면을 보여줄 수 있었다. 그러나 인라인 스크립트를 별도 패키지에서 관리하던 기존 방식(webpack raw-loader로 문자열 주입)이 유지보수 병목이 되었고, 이를 `?as-critical-script` import suffix + Vite 플러그인으로 해결해 비즈니스 로직 옆에 코드를 두는 구조로 바꿨다.

## 깊이
- **[병렬화 원리]** 브라우저는 HTML 파싱 중 `<script>`를 만나면 즉시 실행한다. 이 시점에 `fetch()`를 날리면, 아직 다운로드 중인 메인 번들과 네트워크 대역·시간을 공유한다. 번들 실행 시점에 Promise가 이미 resolved 또는 pending이므로 렌더링 대기 시간이 줄어든다. 비유하자면, 요리사(JS 번들)가 도착하기 전에 재료(API 응답)를 미리 시켜두는 것과 같다. 비유가 깨지는 지점: API 응답이 번들보다 늦으면 이점이 사라지고, 인증·쿠키 의존 API는 인라인 시점에 호출이 불가능할 수 있다.
- **[관리 문제 → 도구화]** 기존엔 TS 파일을 별도 패키지에 작성 → 빌드 → webpack raw-loader로 HTML에 문자열 주입. 앱 코드와 인라인 스크립트가 물리적으로 분리되어 동기화가 어려웠다. 새 방식은 `import CriticalScript from './home.critical?as-critical-script'`처럼 import suffix로 선언하면 Vite 플러그인이 해당 모듈만 작은 인라인 번들로 만들고, React 프리렌더링 단계에서 `<script>` 태그로 삽입한다.
- **[CLS 부수 효과]** 네이티브 브릿지(웹뷰 앱과 JS 간 통신 채널)를 인라인 스크립트에서 먼저 호출해 safe-area inset 등을 확보하면, 스켈레톤 레이아웃이 나중에 밀리지 않는다.

## 용어 풀이
- **LCP (Largest Contentful Paint)** — 화면에서 가장 큰 콘텐츠가 보이는 시점. "음식이 테이블에 놓이는 순간"에 비유. 단, LCP만 빠르고 조작 불가면 체감이 다를 수 있다.
- **인라인 스크립트** — HTML 안에 직접 적힌 `<script>`. 외부 파일 다운로드 없이 HTML 파싱 즉시 실행된다. 비유: 별도 조리 도구 없이 맨손으로 바로 시작하는 것. 깨지는 지점: 캐싱이 안 되고 HTML이 커지면 TTFB에 영향.
- **네이티브 브릿지** — 웹뷰 내 JS가 네이티브 앱 기능을 호출하는 통로. "웹과 앱 사이 인터컴"에 비유.
- **CLS (Cumulative Layout Shift)** — 레이아웃이 뒤늦게 움직이는 정도. 인셋 미적용 시 스켈레톤이 밀리면 발생.

## 시각 자료
| 단계 | 기존(직렬) | 개선(병렬) |
|------|-----------|-----------|
| HTML 수신 | ✓ | ✓ + 인라인 스크립트 즉시 실행 |
| JS 번들 DL | 순차 대기 | API 호출과 동시 |
| API 호출 | 번들 실행 후 | HTML 수신 직후 시작 |
| 렌더링 | API 응답 후 | 번들 실행 시 응답 대기 중 |

## 핵심 시사점 / 판단
- (저자 주장) 배달의민족 커머스 웹뷰 LCP 30~40% 개선. 측정 조건·페이지 수·기간 등 세부 수치 원문에 없음.
- (저자 주장) `critical-script` Vite 플러그인을 우아한형제들 공식 GitHub에 오픈소스 공개.
- (사실 확인 가능) 댓글에서 당근마켓도 유사 시도(stackflow API pipelining)를 했다고 언급 → 패턴 자체의 재현 가능성 시사.
- (검증 필요·불확실) 30~40% 수치의 측정 환경(디바이스·네트워크·표본) 원문에 없음. 특정 웹뷰 환경에 국한될 수 있음.

## 레퍼런스
- 추용혁 LinkedIn 포스트 — https://www.linkedin.com/posts/용혁-추-00a4611b1_html-인라인-스크립트를-활용하여-배달의민족-주요-웹뷰-로딩-성능lcp-share-7493926651261542400-svMU/ · (2차/저자 본인) · 인라인 스크립트 병렬화 아이디어·결과·오픈소스 공개 공지.
- stackflow API pipelining 문서 — https://stackflow.so/docs/advanced/api-pipelining · (1차/당근) · 댓글에서 언급된 유사 패턴 문서.
- critical-script GitHub — 원문에 직접 URL 없음(lnkd.in 단축 링크만 존재). · (2차) · 원문에 없음(저장소 주소 미기재).

## 확인 질문
- Q1(전이): SPA가 아닌 MPA나 SSR 환경에서도 인라인 스크립트 병렬화가 동일한 LCP 이점을 주는가?
- Q2(왜·어떻게): 인라인 스크립트에서 호출한 API 응답을 메인 번들이 어떻게 소비하는지(공유 메커니즘) 원문에 설명이 없는 이유는?
- Q3(경계): 인증 토큰이 네이티브 앱에서 주입되는 웹뷰가 아닌 일반 브라우저에서는 이 패턴이 그대로 적용 가능한가?

> 출처: https://www.linkedin.com/posts/%EC%9A%A9%ED%98%81-%EC%B6%94-00a4611b1_html-%EC%9D%B8%EB%9D%BC%EC%9D%B8-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%98%EC%97%AC-%EB%B0%B0%EB%8B%AC%EC%9D%98%EB%AF%BC%EC%A1%B1-%EC%A3%BC%EC%9A%94-%EC%9B%B9%EB%B7%B0-%EB%A1%9C%EB%94%A9-%EC%84%B1%EB%8A%A5lcp-share-7493926651261542400-svMU/?utm_source=social_share_send&utm_medium=ios_app&rcm=ACoAAB15JU0Bh0ozoFHKUp6BqJa4W5v2yqNn5k8&utm_campaign=share_via
