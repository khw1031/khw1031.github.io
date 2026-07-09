---
title: 'Svelte의 LLM 문서 제공(llms.txt) 지원 현황 정리'
pubDate: '2026-07-08'
description: 'Svelte 공식 문서가 LLM 애플리케이션을 위해 llms.txt 컨벤션을 지원하며, 컨텍스트 크기에 따른 압축 버전을 제공한다.'
summary: 'Svelte가 LLM 및 AI 애플리케이션을 위해 llms.txt 표준 컨벤션을 도입했다. 전체·중간·소형 컨텍스트 윈도우별로 압축 문서를 제공하고, Svelte/SvelteKit/CLI 단위에서도 개별 문서를 배포한다.'
lang: ko
tags:
  - 'llm'
  - 'documentation-convention'
  - 'svelte'
  - 'ai-tooling'
canonical: 'https://svelte.dev/docs/llms'
lintHash: '39520e93b902'
polishHash: '39520e93b902'
---

## TL;DR
- Svelte가 LLM 도구용 llms.txt 컨벤션을 공식 지원하며, 컨텍스트 윈도우 크기에 맞춘 3단계 압축 문서와 패키지별 문서를 제공한다.

## 큰 그림
```
svelte.dev/docs/llms
│
├── [루트 레벨] llms.txt 컨벤션 지원 선언
│   │
│   ├── /llms.txt          → 가용 파일 목록(색인)
│   ├── /llms-full.txt     → Svelte+SvelteKit+CLI 전체 문서 (비압축)
│   ├── /llms-medium.txt   → 중간 크기 컨텍스트 윈도우용 (압축)
│   └── /llms-small.txt    → 작은 컨텍스트 윈도우용 (고압축)
│
└── [패키지 레벨] 개별 패키지별 문서
    ├── /docs/svelte/     → llms.txt + llms-small.txt
    ├── /docs/kit/        → llms.txt + llms-small.txt
    └── /docs/cli/        → llms.txt
```

## 핵심
- **llmstxt.org**에서 제안하는 llms.txt 표준이 LLM이 문서를 구조적으로 읽기 위한 관례로 자리 잡고 있다. (사실) ==Svelte는 이 관례를 공식 지원하며, 단일 전체 문서뿐만 아니라 LLM의 컨텍스트 윈도우 제한을 고려한 3단계(전체·중간·소형) 압축 파일을 동시에 제공한다.== (저자 주장) 이를 통해 토큰 수가 제한된 모델도 Svelte 생태계 문서를 효율적으로 참조할 수 있게 된다.
- 루트 레벨의 색인(`/llms.txt`)이 가용 파일을 나열하고, 각 패키지의 `/docs/<패키지>/llms.txt`는 해당 패키지의 스코프 문서로 분할되어 있다. 즉 **전체 조망 → 패키지 단위 탐색**이라는 두 층위의 접근을 모두 지원한다.

## 깊이
- [루트-파일 구조] `/llms-full.txt`는 Svelte 프레임워크, SvelteKit 메타프레임워크, CLI 도구 문서를 모두 합친 완전판이다. 반면 `/llms-medium.txt`와 `/llms-small.txt`는 컨텍스트 제약 모델용 압축본이다.
  - **압축 기준(알고리즘·토큰 수·바이트)**: 원문에 명시 안됨 — "중간/작은"이라는 표현만 있고, 어떤 기준으로 용량을 줄였는지는 기술되지 않음.
  - **패키지별 제공 현황**: Svelte와 SvelteKit 패키지는 `llms.txt`(색인)와 `llms-small.txt`(고압축)를 함께 제공. CLI 패키지는 `llms.txt`만 제공. 원문에 없음 — CLI용 medium/small 파일이 의도적으로 제외되었는지, 아니면 미제공인지는 명시되지 않음.
- [llms.txt 컨벤션] `llmstxt.org`는 LLM이 문서 크롤링 시 표준화된 진입점을 얻도록 하는 커뮤니티 제안이다. (사실) Svelte가 이를 채택한 것은 AI 기반 개발 도구(agentic-coding)가 문서 소비의 주요 소비자가 되었다는 흐름과 일치한다. (저자 주장·추론)

## 용어 풀이
- **llms.txt** — 웹사이트의 LLM용 문서 색인 파일. 비유: `robots.txt`가 크롤러에게 "여기 있다/없다"를 알리듯, `llms.txt`는 LLM에게 "문서가 여기에 모여 있다"고 안내하는 표지판. 비유가 깨지는 지점: `robots.txt`는 접근 제어(허용/차단)가 주 기능이지만, `llms.txt`는 접근 제어 없이 **가용 문서 목록과 위치**를 알려주는 색인에 가깝다.
- **Context Window(컨텍스트 윈도우)** — LLM이 한 번의 프롬프트에서 처리할 수 있는 토큰의 최대량. 비유: 사람이 한 번에 펼쳐 읽을 수 있는 책 페이지 수. 페이지가 많으면 중요한 부분만 발췌(compressed)해서 읽듯, medium/small 파일은 문서를 추려낸 버전이다.

## 시각 자료
| 파일 경로 | 용도 | 내용 범위 | 비고 |
|---|---|---|---|
| `/llms.txt` | 색인 | 가용 파일 목록 | — |
| `/llms-full.txt` | 전체 문서 | Svelte + SvelteKit + CLI | 비압축 원문 |
| `/llms-medium.txt` | 중간 압축 | — | **압축 기준 원문에 명시 안됨** |
| `/llms-small.txt` | 고압축 | — | **압축 기준 원문에 명시 안됨** |
| `/docs/svelte/llms.txt` | 패키지 색인 | Svelte 문서 | `llms-small.txt` 동반 |
| `/docs/svelte/llms-small.txt` | 패키지 고압축 | Svelte 문서 | — |
| `/docs/kit/llms.txt` | 패키지 색인 | SvelteKit 문서 | `llms-small.txt` 동반 |
| `/docs/kit/llms-small.txt` | 패키지 고압축 | SvelteKit 문서 | — |
| `/docs/cli/llms.txt` | 패키지 색인 | CLI 문서 | medium/small 파일 제공 여부 원문에 없음 |

## 핵심 시사점 / 판단
- **(저자 주장)** Svelte는 LLM을 일급 문서 소비자로 인식하고, 컨텍스트 크기별 최적화 파일을 선제적으로 제공한다.
- **(검증 필요·불확실)** 압축 알고리즘·기준(토큰 수? 바이트 수? 추출 규칙?)이 공개되지 않아, 실제 압축 품질과 누락 정보의 영향도를 확인하기 어렵다.
- **(사실)** `llmstxt.org` 컨벤션은 커뮤니티 표준이며, Svelte 외에 여러 프레임워크가 채택 중임 — 이 리포트 원문 범위를 벗어남(원문에 없음).

## 레퍼런스
- Docs for LLMs — https://svelte.dev/docs/llms · (1차) · Svelte 공식 문서가 LLM용 llms.txt 컨벤션 지원 현황을 안내함.
- llms.txt Convention — https://llmstxt.org/ · (2차) · LLM 문서 표준 색인 파일에 대한 커뮤니티 제안.

## 확인 질문
- **Q1(전이)**: 현재 Svelte의 llms-medium/small 파일 압축 기준이 공개된다면, 어떤 모델(토큰 한계)이 어떤 파일을 선택해야 하는지 판단 기준이 될까?
- **Q2(왜·어떻게)**: CLI 패키지에 medium/small 파일이 제공되지 않는 이유는 무엇이며, 이 차이가 agentic-coding 워크플로우에 어떤 영향을 미칠까?
- **Q3(경계)**: llms.txt 컨벤션이 표준화되었을 때, 버전별 문서(v4/v5)나 변경 로그(changelog)도 함께 제공해야 하는가?

> 출처: https://svelte.dev/docs/llms
