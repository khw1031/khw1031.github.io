# Concepts

## Core Web Vitals

- LCP: viewport 안에서 가장 큰 콘텐츠가 렌더링되는 시점.
- CLS: 예상치 못한 레이아웃 이동의 누적 점수.
- INP: 사용자 입력에 대한 응답성을 평가하는 field metric. 기존 글의 TBT는 lab 환경에서 main thread blocking을 추정하는 데 유용.

## LCP Breakdown

- TTFB: 서버 응답 시작까지의 시간.
- Resource load delay: LCP 리소스가 발견되어 요청되기까지의 지연.
- Resource load duration: 리소스 다운로드 시간.
- Element render delay: 리소스가 준비된 뒤 화면에 그려지기까지의 지연.

## Browser Resource Loading

- `<img>`는 preload scanner가 더 빨리 발견할 수 있다.
- CSS `background-image`는 CSSOM 해석과 스타일 적용 이후에야 중요 리소스로 드러나는 경우가 많다.
- `preload`는 반드시 필요한 critical resource에만 사용해야 한다.

## JavaScript Execution

- Long task는 main thread를 50ms 이상 점유하는 작업.
- TBT는 FCP 이후 TTI 전까지 long task의 50ms 초과분 합계.
- Script Evaluation 비용은 번들 크기뿐 아니라 모듈 초기화, side effect, hydration 범위와 연결된다.

## Bundling

- ESM은 정적 import/export 구조 덕분에 tree shaking에 유리하다.
- barrel export는 편하지만 불필요한 모듈 평가를 유발할 수 있다.
- package `exports`는 소비자가 접근 가능한 entry point를 명시해 import 경로와 public API를 통제한다.
