---
title: 'satteri - JavaScript 생태계를 위한 고성능 Markdown 및 MDX 처리기'
pubDate: '2026-07-30T10:09:44+09:00'
noteId: DEV-2607-012
description: 'Rust 파서와 JavaScript 플러그인을 napi-rs로 잇는 Markdown·MDX 처리기. remark/rehype 플러그인과는 호환되지 않는다.'
summary: 'satteri는 pulldown-cmark 기반 Rust 층에서 파싱하고 JS 층에서 플러그인을 실행하며 GFM·frontmatter·math·directive를 설정으로 지원한다. 다만 공식 문서가 remark/rehype 비호환을 명시하고 벤치마크 수치는 공개하지 않아, 도입은 플러그인 재작성 비용과 자체 측정을 전제로 한다.'
lang: ko
tags:
  - 'markdown'
  - 'mdx'
  - 'rust'
  - 'javascript'
  - 'performance'
canonical: 'https://news.hada.io/topic?id=31967&utm_source=jandi&utm_medium=bot&utm_campaign=5771'
polishHash: 'f5d89b329c98'
lintHash: 'f5d89b329c98'
---

## TL;DR
- satteri는 파싱을 Rust에, 확장을 JavaScript에 배치한 Markdown·MDX 처리기다. ==다만 플러그인 API가 remark/rehype와 호환되지 않아 기존 파이프라인의 드롭인 교체가 아니다.==

## 큰 그림
```
satteri 구조
│
├─ Rust 층 (pulldown-cmark 기반)
│  ├─ 파싱 · 컴파일
│  └─ 문법: CommonMark / GFM / frontmatter / math / remark-directive 컨테이너
│     └─ MDX는 별도 파서 진입점
│
├─ 경계: napi-rs 바인딩
│
├─ JavaScript·TypeScript 층
│  └─ 타입 있는 플러그인 API  ← 기존 remark/rehype 플러그인은 그대로 실행되지 않음
│
└─ 배포
   ├─ 네이티브 바이너리: macOS · Linux · Windows
   └─ WASI 폴백: 브라우저 · 엣지 런타임
```

## 핵심
- satteri가 겨누는 문제는 JavaScript 생태계 Markdown 파서의 속도다. 해법은 언어를 갈라 배치하는 것으로, 파싱과 컴파일은 Rust(pulldown-cmark)에서 하고 확장은 JavaScript에서 하며 둘을 napi-rs로 잇는다.
- ==얻는 것과 잃는 것이 같은 자리에서 나온다.== 네이티브 파서를 쓰므로 속도를 주장할 수 있지만, 그 대가로 플러그인 계층이 새로 정의된다. 공식 문서는 "기존 remark/rehype 플러그인은 수정 없이 돌아가지 않는다"고 명시한다.
- 문법 지원은 설정 가능한 형태다. GFM·frontmatter·math·remark-directive 컨테이너를 옵션으로 켜고, MDX만 별도 파서 진입점으로 분리했다.

## 깊이
- **[성능 주장의 근거]** 이름과 소개에 "고성능"을 내세우지만 GitHub README와 공식 문서 어디에도 벤치마크 수치가 없다. 대신 라이브 플레이그라운드로 직접 확인하라는 형태다. 즉 속도 우위는 현재 공개된 측정값이 아니라 구조적 근거(네이티브 파서)에 기댄 주장이다.
- **[이 저장소 기준 마이그레이션 비용]** 여기의 마크다운 파이프라인은 `remark-math`·`rehype-katex`·`rehype-mermaid`·`remark-flexible-markers`를 쓴다. 플러그인 API가 호환되지 않으므로 satteri로 옮기면 이 네 개를 satteri 플러그인으로 다시 써야 한다. 비교 대상이 "빌드 시간 단축분 vs 플러그인 네 개 재작성"으로 명확해진다.
- **[배포 형태]** 네이티브 바이너리 세 OS와 브라우저·엣지용 WASI 폴백을 함께 제공한다. 네이티브 모듈 의존은 CI 이미지와 서버리스 런타임에서 설치 실패 지점을 만들 수 있는데, 이 논의는 원문과 공식 문서 모두에 없다.

## 용어 풀이
- **pulldown-cmark** — Rust로 작성된 CommonMark 파서. satteri의 파싱 계층이 이것을 기반으로 한다.
- **napi-rs** — Rust 코드를 Node.js 애드온으로 노출하는 바인딩 프레임워크. satteri에서 Rust 층과 JS 플러그인 층을 잇는 경계다.
- **WASI** — WebAssembly가 파일·시스템 인터페이스에 접근하기 위한 표준. 네이티브 바이너리를 쓸 수 없는 브라우저·엣지 런타임에서 폴백 실행 경로가 된다.
- **remark-directive 컨테이너** — `:::name` 형태로 커스텀 블록을 표기하는 확장 문법. satteri가 설정으로 지원한다.

## 시각 자료
| 항목 | 확인된 내용 | 출처 |
|---|---|---|
| 파서 기반 | pulldown-cmark | 공식 문서(1차) |
| 문법 | GFM·frontmatter·math·remark-directive 설정 지원, MDX 별도 진입점 | 공식 문서(1차) |
| 플러그인 | napi-rs로 노출된 타입 있는 API, **remark/rehype 비호환** | 공식 문서(1차) |
| 플랫폼 | macOS·Linux·Windows 네이티브 + 브라우저·엣지 WASI 폴백 | 공식 문서(1차) |
| 패키지 | npm `satteri`, crates.io 배포 | 공식 문서(1차) |
| 라이선스 | MIT | GitHub(1차) |
| 스타 | 약 1,000 | GitHub(1차) |
| 벤치마크 | 없음 | GitHub·공식 문서 모두 미제시 |
| 안정성 단계 | alpha·experimental 표기 없음 | GitHub·공식 문서 |

## 핵심 시사점 / 판단
- **(사실)** 공식 문서가 remark/rehype 플러그인 비호환을 명시한다. 기존 remark 기반 파이프라인의 드롭인 교체로 취급하면 안 된다.
- **(검증 필요·불확실)** "고성능"의 정량 근거가 공개되어 있지 않다. 도입을 판단하려면 자체 문서 집합으로 직접 측정해야 한다.
- **(원문에 없음)** 버전·릴리스 주기, 안정성 단계, 네이티브 모듈과 WASI 폴백의 CI·서버리스 설치 실패 시나리오.
- **(2차 주장, 1차로 확인함)** GeekNews 요약이 나열한 pulldown-cmark·GFM·frontmatter·math·플랫폼 항목은 공식 문서에서 모두 확인됐다. 반면 요약에 없던 플러그인 비호환은 공식 문서에만 있다.

## 레퍼런스
- GeekNews 게시물 — https://news.hada.io/topic?id=31967 · (2차) · 캡처 경로가 된 한국어 소개. 2026-07-30 확인.
- satteri GitHub — https://github.com/bruits/satteri · (1차) · 정본 저장소. MIT 라이선스, 스타 약 1,000. 2026-07-30 확인.
- satteri 공식 문서 — https://satteri.bruits.org/docs/ · (1차) · 문법 지원·플러그인 API 비호환·플랫폼·파서 기반의 근거. 2026-07-30 확인.
- satteri 플레이그라운드 — https://satteri.bruits.org/playground · (1차) · 공개 벤치마크 대신 제공되는 실측 수단.

## 확인 질문
- Q1(전이): 이 저장소의 remark·rehype 플러그인 네 개를 satteri 플러그인으로 다시 쓰는 비용이 빌드 시간 단축분을 넘는가?
- Q2(왜·어떻게): 벤치마크가 공개되지 않은 상태에서 "고성능"을 판정하려면 어떤 문서 집합과 어떤 지표로 측정해야 하는가?
- Q3(경계): 실제 배포가 네이티브 바이너리인지 WASI 폴백인지에 따라 속도 이득이 남는가?

> 출처: https://news.hada.io/topic?id=31967&utm_source=jandi&utm_medium=bot&utm_campaign=5771
