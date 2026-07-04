---
title: Web Performance
pubDate: '2026-07-01'
description: 공부 내용을 개인적으로 정리하는 비공개 노트
summary: "웹 성능을 지표(Core Web Vitals) ↔ 필드 데이터(CrUX·RUM) ↔ 랩 데이터(Lighthouse) 세 층위로 분리해 정리하고, LCP/INP/CLS/TTFB 해석, 2025 한샘몰 개선 수치, 측정 도구의 트레이드오프와 실무 조합을 다룬 노트."
lang: ko
tags: ['web-performance', 'core-web-vitals', 'rum', 'lighthouse']
---

> 웹 성능 "표준"은 한 도구가 아니라 **지표 ↔ 필드 데이터 ↔ 랩 데이터** 세 층위로 나뉜다. Lighthouse는 그 중 랩 측정 도구일 뿐이다.

## 1. 세 층위로 먼저 분리

| 층위 | 내용 | 대표 |
|---|---|---|
| 성능 지표(metrics) | LCP·CLS·INP·FCP·TTFB. W3C Web Performance WG + Google이 정의한 스펙. **진짜 "표준"** | Core Web Vitals |
| 필드 데이터(field/RUM) | 실사용자 실측. UX와 직결 | CrUX, `web-vitals`, 상용 RUM |
| 랩 데이터(lab/synthetic) | 통제된 환경의 합성 측정 | Lighthouse, WebPageTest |

핵심: Lighthouse는 1번 지표를 3번 방식으로 측정하는 *도구*다. 지표 자체가 표준이지 Lighthouse가 표준은 아니다.

## 2. 성능 지표 — Core Web Vitals

성능 지표는 "사용자가 빠르게 보고, 안정적으로 보고, 즉시 조작할 수 있는가"를 숫자로 나눈 것이다. 현재 Core Web Vitals는 LCP, CLS, INP 3개다.

| 지표 | 의미 | 임계값(Good) | 성격 |
|---|---|---:|---|
| LCP | Largest Contentful Paint, viewport 안의 가장 큰 주요 콘텐츠가 렌더링된 시점 | ≤ 2.5s | Core Web Vital |
| CLS | Cumulative Layout Shift, 예상치 못한 레이아웃 이동의 누적 점수 | ≤ 0.1 | Core Web Vital |
| INP | Interaction to Next Paint, 클릭·탭·키 입력 후 다음 paint까지의 반응 시간 | ≤ 200ms | Core Web Vital |
| FCP | First Contentful Paint, 첫 콘텐츠가 화면에 보인 시점 | ≤ 1.8s | 보조 지표 |
| TTFB | Time to First Byte, 요청 후 첫 응답 바이트까지의 시간 | ≤ 800ms | 보조 지표 |

핵심은 Core Web Vitals를 75번째 백분위수(P75) 기준으로 본다는 점이다. 평균 하나만 보면 느린 사용자군의 경험이 가려질 수 있다.

### LCP

LCP는 사용자가 "이 페이지가 열렸다"고 느끼는 대표 콘텐츠의 노출 시점이다. 커머스에서는 보통 메인 배너, 상품 이미지, 큰 제목 영역이 LCP 후보가 된다.

LCP는 하나의 숫자지만 원인은 보통 네 단계로 나눠 본다.

```text
TTFB
-> Resource load delay
-> Resource load duration
-> Element render delay
```

`TTFB`는 서버 응답 시작까지 걸린 시간이다. 서버, CDN, 캐시, 네트워크 영향을 받는다.

`Resource load delay`는 LCP 리소스가 발견되어 요청되기까지의 지연이다. `<img>`는 HTML preload scanner가 빠르게 발견할 수 있지만, CSS `background-image`는 CSSOM 해석과 스타일 적용 뒤에 중요 리소스로 드러나는 경우가 많다.

`Resource load duration`은 이미지나 폰트 같은 리소스 자체를 다운로드하는 시간이다. 파일 크기, 포맷, CDN, 캐시 상태가 영향을 준다.

`Element render delay`는 리소스가 준비된 뒤 실제 화면에 그려지기까지의 지연이다. CSS, JavaScript 실행, hydration, main thread blocking이 영향을 준다.

따라서 "LCP를 줄였다"는 말은 단순 이미지 압축보다 넓다. 어떤 단계가 병목인지 나누고, 발견 지연·다운로드·렌더링 지연을 각각 줄였는지가 중요하다.

### INP와 TBT

INP는 실제 사용자가 클릭, 탭, 키 입력을 했을 때 화면이 다음 프레임으로 반응하기까지의 시간이다. Core Web Vitals의 응답성 지표이며 field data로 보는 것이 본질이다.

TBT는 Lighthouse가 lab 환경에서 측정하는 main thread blocking 지표다. 긴 JavaScript 실행이나 hydration이 입력 처리를 막을 가능성을 진단하는 데 유용하지만, Core Web Vital은 아니다.

인터뷰에서는 이렇게 구분해서 말하는 편이 안전하다.

> Core Web Vitals 중 응답성 지표는 INP이고, 프로젝트에서는 Lighthouse lab 환경에서 TBT를 보조 지표로 사용해 main thread blocking을 진단했습니다.

### CLS

CLS는 화면의 기존 요소가 예상치 못하게 움직이는 정도다. 이미지 크기를 미리 예약하지 않거나, 광고·배너·동적 영역이 늦게 삽입되면 CLS가 커진다.

CLS는 "빠르게 보이는가"가 아니라 "보이는 동안 안정적인가"를 보는 지표다. 사용자가 버튼을 누르려는 순간 레이아웃이 밀려 다른 요소를 누르게 되는 문제가 대표적이다.

### FCP와 TTFB

FCP는 빈 화면이 끝나는 시점에 가깝다. 첫 텍스트나 이미지가 보이면 FCP가 찍힌다.

TTFB는 브라우저가 서버의 첫 응답을 받기까지의 시간이다. TTFB가 느리면 HTML 도착이 늦고, 그 뒤 CSS·JS·이미지 발견도 연쇄적으로 늦어진다. 그래서 TTFB는 LCP 원인 분석의 첫 구간이다.

### 브라우저 흐름과 프론트엔드 개선 연결

각 metric은 브라우저 로딩 파이프라인의 서로 다른 병목을 숫자로 드러낸다.

```text
요청 시작
-> DNS/TCP/TLS/CDN/server
-> HTML 수신
-> HTML 파싱
-> CSS/JS/이미지 발견
-> CSSOM/DOM 생성
-> render tree 생성
-> layout
-> paint
-> JavaScript 실행 / hydration
-> 사용자 입력 처리
```

| Metric | 브라우저 단계 | 프론트엔드에서 보는 병목 | 대표 개선 |
|---|---|---|---|
| TTFB | 요청부터 첫 응답 바이트까지 | SSR/API waterfall, 캐시 미스, edge/cache 부재 | SSG/ISR/cache, critical data 분리, HTML 응답을 막는 로직 축소 |
| FCP | 첫 콘텐츠 paint | 빈 HTML, render-blocking CSS/JS, 웹폰트 지연 | SSR/SSG, critical CSS, `defer`/module script, `font-display` |
| LCP | 주요 콘텐츠 paint | LCP 리소스 발견 지연, 큰 이미지, hydration 지연 | `<img>`, `fetchpriority`, preload, 이미지 포맷/크기 최적화, 초기 JS 축소 |
| CLS | layout 이후 위치 안정성 | 이미지/광고/동적 영역 크기 미예약 | `width`/`height`, `aspect-ratio`, placeholder, skeleton 높이 예약 |
| INP | 사용자 입력부터 다음 paint까지 | 이벤트 핸들러 지연, 긴 task, 무거운 re-render | task 쪼개기, handler 경량화, virtualization, Worker, hydration 범위 축소 |
| TBT | FCP 이후 main thread blocking | 번들 평가, hydration, third-party script | code splitting, dynamic import, tree shaking, barrel export 정리 |

따라서 성능 개선은 "점수 올리기"보다 "어느 브라우저 단계가 막히는지 찾고 그 단계의 비용을 줄이는 일"에 가깝다. 브라우저 로딩 흐름 자체는 [Browser Page Load Flow](/notes/browser-page-load-flow/)에 따로 정리한다.

## 3. 프로젝트 metrics 해석 — 2025 한샘몰 성능 개선

현재 evidence 기준으로 확인된 수치는 다음과 같다.

| Metric | Before | After | 해석 |
|---|---:|---:|---|
| LCP | 6s | 1.6s | 주요 콘텐츠 노출 시간을 Core Web Vitals good 기준 안으로 개선 |
| TBT | 1200ms | 380ms | Lighthouse lab 기준 main thread blocking 감소 |
| 디자인시스템/전시 컴포넌트 번들 | - | 40%+ 감소 | 런타임 JS 비용과 모듈 평가 비용 감소 가능성 |
| 빌드 시간 | - | 최대 70% 단축 | 개발·배포 피드백 루프 개선 |
| PSI 모니터링 | - | 1시간 간격 | 단발 점수가 아니라 일간/주간 추세로 관리 |

이 사례의 메시지는 "Lighthouse 점수를 한 번 올렸다"가 아니다. 더 정확한 표현은 "PSI API 기반 반복 측정 체계를 만들고, LCP와 TBT 병목을 나눠 제거했다"이다.

공개 글이나 이력서에 쓰기 전에 확인할 항목:

- PSI API `strategy`가 mobile인지 desktop인지.
- Lighthouse 버전과 측정 기간.
- 수치가 평균, 중앙값, P75 중 무엇인지.
- 배포 전후 비교 기간과 샘플 수.
- 번들 크기가 raw, gzip, brotli 중 무엇인지.
- 빌드 시간의 비교 기준이 로컬인지 CI인지.

인터뷰용 핵심 답변:

> 성능 개선에서는 단일 Lighthouse 점수보다 metric을 나눠 봤습니다. 사용자 관점에서는 LCP로 주요 콘텐츠 노출 시간을 보고, 응답성 병목은 Lighthouse의 TBT로 main thread blocking을 추적했습니다. 또 번들 크기와 빌드 시간은 각각 런타임 성능과 개발 생산성에 영향을 주는 보조 지표로 관리했습니다. PSI API를 주기적으로 호출해 단발 점수의 흔들림보다 일간/주간 추세를 기준으로 개선 여부를 판단했습니다.

## 4. 랩 데이터 측정 — Lighthouse

**위치**: 랩 기반 진단·회귀 도구. 이 자리에서는 사실상 de facto standard.

**통합 지점**: Chrome DevTools, PageSpeed Insights(상단 lab 섹션), Lighthouse CI.

**한계**:
- 시뮬레이션 스로틀링(mid-tier 모바일 + simulated 4G) → 실사용자 기기/네트워크 편차 미반영
- 점수 불안정: 측정마다 ±5~10 편차 흔함. 1점 단위 비교 무의미 → 회귀 감지엔 P75 + 반복 측정
- `simulate` vs `devtools` 모드, CPU 스코어링 등 가정이 개입 → 특정 환경에선 랩과 필드가 엇갈림
- 단일 페이지·단회 측정 → SPA 라우팅 전환, 인증 후 상태, 서드파티 시간 변동 못 잡음

**보조 도구**: WebPageTest(진단 깊이·워터폴), Lighthouse CI(PR 회귀 방어).

## 5. 필드 데이터 측정 — RUM

실사용자 경험을 논할 땐 이쪽이 본질. 스펙트럼 4단계.

### (1) 공개 데이터셋 — CrUX
Chrome 정보제공 동의 사용자 실측을 Google이 집계한 공개 데이터셋. 검색 순위 페이지 경험 신호의 근거도 이것.
- 노출: PageSpeed Insights 하단 필드 섹션, Search Console Core Web Vitals 보고서, CrUX Dashboard(BigQuery), CrUX API
- 한계: 월 단위 집계라 **느림**(이번 주 회귀 못 잡음), 오리진 단위 집계라 정확 URL 단위엔 취약

### (2) DIY RUM — `web-vitals` 라이브러리
Google의 [`web-vitals`](https://github.com/GoogleChrome/web-vitals) npm 패키지. 스크립트 한 줄이면 실사용자 세션에서 LCP/CLS/INP/FCP/TTFB를 잡아 콜백으로 줌. 자체 엔드포인트나 GA4로 beacon 전송하면 자기만의 RUM.
- 장점: 무료, 자기 도메인 한정 정밀, URL·디바이스·네트워크별 분해 가능
- 단점: 수집·저장·시각화 인프라 직접 구축
- 집계: P75·P95 백분위수(평균은 무의미)

### (3) 상용 RUM 플랫폼
수집→저장→대시보드까지 다 해줌.
- SpeedCurve, Akamai mPulse, Datadog RUM, New Relic Browser, Sentry Performance, Dynatrace, Rigor
- LCP/CLS/INP 외에 세션 재생, 서드파티 영향, 라우팅별 분해

### (4) 호스팅/CDN 내장
- Vercel Speed Insights, Cloudflare Web Analytics, Netlify Analytics
- 보통 `web-vitals` 기반 자동 계측, but 제공자 종속성 발생

## 6. 트레이드오프와 실무 조합

> **필드 데이터**는 진짜 사용자 경험을 보여주지만 집계가 느리고 거칠고, **랩 데이터**는 빠르고 재현 가능하지만 가짜 환경이다.

| 목적 | 도구 | 질문 |
|---|---|---|
| PR 단위 회귀 방어 | Lighthouse / WebPageTest | "방금 바꼈는데 느려졌나?" |
| 실사용자 체감 트렌드 | CrUX / RUM | "실사용자가 겪는 성능이 개선/악화 중?" |
| 고트래픽 페이지 감시 | RUM P75 | "트래픽 많은 페이지가 임계치 밑에 있나?" |

**권고**: Lighthouse만 쓰면 "랩 점수 좋은데 실사용자는 느리다"는 흔한 함정. 적어도 `web-vitals` 기반 자체 RUM 하나는 같이 둘 것.

## 7. 참고

- [Core Web Vitals — web.dev](https://web.dev/articles/vitals)
- [Largest Contentful Paint — web.dev](https://web.dev/articles/lcp)
- [Interaction to Next Paint — web.dev](https://web.dev/articles/inp)
- [Cumulative Layout Shift — web.dev](https://web.dev/articles/cls)
- [Total Blocking Time — Chrome for Developers](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)
- [`web-vitals` 라이브러리 — GitHub](https://github.com/GoogleChrome/web-vitals)
- [Chrome UX Report — developer.chrome.com](https://developer.chrome.com/docs/crux)
- [Lighthouse — developer.chrome.com](https://developer.chrome.com/docs/lighthouse)
- [Measure / Diagnose performance — web.dev](https://web.dev/learn/performance-measure)
