---
title: 'Understand Anything: 코드베이스를 인터랙티브 지식 그래프로 변환하는 도구'
pubDate: '2026-07-17T13:19:25+09:00'
description: 'Tree-sitter 정적 분석과 LLM 의미 분석을 결합해 코드·문서를 탐색 가능한 지식 그래프로 만드는 오픈소스 프로젝트 분석.'
summary: 'Understand Anything은 대규모 코드베이스를 파일·함수·클래스 단위의 노드로 구성된 지식 그래프로 변환하여 시각적 탐색과 질의를 가능하게 한다. 결정론적 파서와 LLM의 분업 구조가 핵심 설계 원리다.'
lang: ko
tags:
  - 'agentic-coding'
  - 'developer-productivity'
  - 'open-source'
  - 'knowledge-graph'
canonical: 'https://github.com/Egonex-AI/Understand-Anything'
lintHash: '786937450a7b'
---

## TL;DR
- 코드베이스를 정적 분석(Tree-sitter)과 LLM 의미 분석의 이층 파이프라인으로 처리해, 구조는 재현 가능하고 의도는 사람 말로 설명되는 인터랙티브 지식 그래프를 만든다.

## 큰 그림
```
┌─────────────────────────────────────────────────────────┐
│              Understand Anything Pipeline               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  /understand  ──►  Multi-Agent Orchestrator             │
│                       │                                 │
│         ┌─────────────┼──────────────┐                  │
│         ▼             ▼              ▼                  │
│   ┌──────────┐  ┌──────────┐  ┌────────────┐           │
│   │ scanner  │  │ file-    │  │ arch /     │           │
│   │ (files,  │→ │ analyzer │→ │ tour /     │           │
│   │  lang)   │  │ (nodes,  │  │ domain     │           │
│   └──────────┘  │  edges)  │  │ analyzer)  │           │
│         │       └────┬─────┘  └─────┬──────┘           │
│         │            │              │                   │
│    Tree-sitter    LLM(요약·     LLM(레이어·             │
│    (결정론적)      태그·의도)    도메인·투어)            │
│         │            │              │                   │
│         └────────────┼──────────────┘                   │
│                      ▼                                  │
│            .ua/knowledge-graph.json                     │
│                      │                                  │
│                      ▼                                  │
│            /understand-dashboard                        │
│            (탐색·검색·diff·chat)                        │
└─────────────────────────────────────────────────────────┘
```

## 핵심
- Understand Anything은 "20만 줄 코드베이스에 새로 합류한 개발자가 어디서부터 읽어야 할까?"라는 문제에서 출발한다. 저자는 코드를 눈으로 읽는 대신 **그래프를 탐색**하며 구조를 파악하는 접근을 제안한다.
- 파이프라인은 **Tree-sitter가 구조(imports, exports, 함수·클래스 정의, 호출 관계)를 결정론적으로 추출**하고, **LLM이 그 위에 의미(요약, 아키텍처 레이어, 비즈니스 도메인 매핑)를 입히는 이층 구조**다. 이 분업 덕분에 구조 측면은 동일 입력→동일 출력의 재현성을 갖고, 의미 측면은 파서 alone으로는 얻을 수 없는 "이 파일이 무엇을 위한 것인지"를 포착한다는 것이 저자의 핵심 주장이다.
- `/understand` 한 번으로 전체 스캔 → 그래프 생성 → `.ua/knowledge-graph.json` 저장까지 진행되며, 이후 실행은 **fingerprint 기반 변경 감지**로 증분 업데이트만 수행해 토큰 소비를 줄인다.
- 생성된 그래프는 JSON이므로 **git에 커밋해 팀원과 공유**할 수 있고, 대시보드 뷰어는 Node.js만 있으면 LLM 없이도 로컬에서 열람 가능하다.

## 깊이
- **[Tree-sitter + LLM 분업]** Tree-sitter는 C 기반 파서로 수십 개 언어의 구체적 구문 트리(CST)를 제공하는 라이브러리다. 비유하면 "건물의 설계도에서 벽·기둥·배관을 자동으로 뽑아내는 스캐너"이고, LLM은 "이 방이 거실인지 침실인지, 동선이 어떻게 되는지 설명해주는 건축가" 역할이다. 이 비유가 깨지는 지점: Tree-sitter는 구문은 정확히 잡지만 **타입 해석·런타임 동작·매크로 확장** 같은 의미론은 잡지 못한다. 또한 동적 언어(JavaScript 등)에서는 import 경로 해결이 불완전할 수 있어 `importMap` 전처리 단계가 별도로 존재한다.
- **[Multi-Agent 파이프라인]** 5개 기본 에이전트(`project-scanner`, `file-analyzer`, `architecture-analyzer`, `tour-builder`, `graph-reviewer`)가 순차·병렬로 동작한다. file-analyzer는 최대 5 동시, 배치당 20~30개 파일로 병렬 처리된다. `/understand-domain`은 `domain-analyzer`를, `/understand-knowledge`는 `article-analyzer`를 추가한다. 이는 단일 monolithic 프롬프트 대신 **전문화된 작은 에이전트를 엮어 비용·품질·속도를 절충**하는 agentic 패턴의 사례다.
- **[플랫폼 호환성 — 묶음 표]** 원문은 17개 플랫폼을 나열하나, 설치 방식 기준으로 압축하면 다음과 같다.

| 설치 방식 | 해당 플랫폼 |
|---|---|
| 네이티브 마켓플레이스 | Claude Code, Copilot CLI |
| Auto-discovery (clone) | Cursor, VS Code + Copilot |
| `install.sh` one-liner | Codex, Gemini CLI, OpenCode, Pi, Vibe CLI, Hermes, Cline, KIMI, Trae, Nanobot, Kiro 등 13종 |

대표적으로 **Claude Code**(네이티브 plugin)와 **Cursor**(auto-discovery) 두 경로만 기억하면 대부분의 사용 사례를 커버한다.

## 용어 풀이
- **Knowledge Graph** — 엔티티(노드)와 관계(엣지)로 지식을 표현하는 그래프. 비유: "위키백과 하이퍼링크를 구조화한 것". 깨지는 지점: 위키는 사람이 엣지를 만들지만 여기선 Tree-sitter+LLM이 자동 생성하므로 **노이즈 엣지**가 섞일 수 있다.
- **Tree-sitter** — GitHub이 개발한 증분 파싱 라이브러리. 언어별 grammar로 CST를 만든다. 비유: "소스코드의 엑스레이". 깨지는 지점: grammar가 없는 언어/DSL은 처리 불가.
- **Multi-Agent Pipeline** — 여러 특화 LLM 에이전트가 분업하는 아키텍처. 비유: "병원에서 전문의들이 순차 진료하는 것". 깨지는 지점: 에이전트 간 정보 손실이 발생할 수 있고, 오케스트레이션 비용(토큰·지연)이 단일 호출보다 크다.
- **Fingerprint-based change detection** — 파일 내용의 해시/시그니처로 변경 여부를 판단. 비유: "지문 대조". 깨지는 지점: 포맷팅만 바뀐 경우도 변경으로 잡힐 수 있다(구체적 전략은 원문에 없음).

## 시각 자료
**기능 매핑 표**

| 기능 | 입력 | 출력 | 비고 |
|---|---|---|---|
| `/understand` | 코드베이스 전체 | `knowledge-graph.json` | 첫 회 토큰 과소비 주의 |
| `/understand-dashboard` | 그래프 JSON | 웹 UI | 팬·줌·검색·노드 클릭 |
| `/understand-domain` | 코드베이스 | 도메인·플로·스텝 그래프 | 비즈니스 로직 뷰 |
| `/understand-knowledge` | Karpathy-pattern wiki | 위키 지식 그래프 | wikilink + LLM 엔티티 추출 |
| `/underunderstand-diff` | git diff | 영향 범위 시각화 | PR 리뷰용 |
| `/understand-chat` | 자연어 질문 | 그래프 기반 답변 | — |

## 핵심 시사점 / 판단
- **(저자 주장)** "인상적인 그래프가 아니라 가르쳐주는 그래프"가 목표 — 복잡도를 과시하지 않고 학습 순서(guided tour, 의존성 순)를 제공하는 점이 차별점.
- **(저자 주장)** 구조는 결정론적, 의미만 LLM 의존 → 재현성과 풍부함의 절충.
- **(검증 필요·불확실)** 20만 줄 규모에서의 실제 토큰 비용·정확도 벤치마크는 원문에 제시되지 않음. "significant tokens"이라는 정성적 표현만 존재.
- **(검증 필요·불확실)** `graph-reviewer`의 "referential integrity" 검증이 어느 수준(단순 참조 검사 vs LLM 기반 의미 검토)인지 명확하지 않음(`--review` 플래그로 LLM 리뷰 옵션 존재).
- **(경계)** LLM 환각이 노드 요약·도메인 매핑에 섞일 가능성. 구조 엣지는 신뢰 가능하나 의미 레이어는 교차 검증 필요.

## 레퍼런스
- Understand Anything GitHub — https://github.com/Egonex-AI/Understand-Anything · (1차) · README 원본, 기능·설치·아키텍처 공식 설명.
- Live Demo — https://understand-anything.com/demo/ · (1차) · 설치 없이 대시보드 체험 가능.
- Karpathy-pattern LLM wiki — https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f · (1차) · `/understand-knowledge`가 입력으로 기대하는 위키 포맷 예시.
- Better Stack walkthrough (YouTube) — https://www.youtube.com/watch?v=VmIUXVlt7_I · (2차) · 커뮤니티 제작 튜토리얼 영상.

## 확인 질문
- Q1(전이): Tree-sitter 기반 구조 추출 + LLM 의미 레이어 패턴은 코드 외 영역(법률 문서, 설계 명세)에도 그대로 적용될 수 있을까? 어떤 부분이 언어 의존적일까?
- Q2(왜·어떻게): 왜 단일 에이전트가 아니라 5~6개 전문 에이전트로 분할했을까? 토큰 비용 대비 품질 이득을 어떻게 측정할 수 있을까?
- Q3(경계): LLM이 생성한 "plain-English summary"와 "architectural layer assignment"가 틀렸을 때 사용자는 어떻게 감지하고 수정할 수 있는가? 피드백 루프가 존재하는가?

> 출처: https://github.com/Egonex-AI/Understand-Anything
