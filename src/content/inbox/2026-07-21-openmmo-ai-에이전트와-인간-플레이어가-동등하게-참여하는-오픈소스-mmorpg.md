---
title: 'OpenMMO: AI 에이전트와 인간 플레이어가 동등하게 참여하는 오픈소스 MMORPG'
pubDate: '2026-07-21T01:53:38+09:00'
description: '동일 WebSocket 프로토콜로 AI 에이전트와 인간 플레이어가 구분 없이 상호작용하는 Rust/Svelte 기반 오픈소스 MMORPG 아키텍처 분석'
summary: 'OpenMMO는 AI 에이전트에게 특권 API를 주지 않고 인간과 완전히 같은 인터페이스로 접속하게 하는 MMORPG다. 에이전트-인간 패리티라는 설계 철학과 이를 실현한 기술 스택을 정리한다.'
lang: ko
tags:
  - 'ai'
  - 'agentic-coding'
  - 'open-source'
  - 'mcp'
canonical: 'https://github.com/Julian-adv/OpenMMO'
lintHash: 'd4636429ac49'
---

## TL;DR
- OpenMMO는 AI 에이전트와 인간이 **동일한 WebSocket 프로토콜**로 접속해 서버가 양자를 구분할 수 없는 MMORPG이며, Rust 서버 + Svelte/Three.js 클라이언트로 구성된 1인 개발 오픈소스 프로젝트다.

## 큰 그림
```
                        ┌─────────────────────────┐
                        │      OpenMMO World       │
                        │  (32km×32km Procedural)  │
                        └────────┬────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                   ▼
     ┌────────────────┐ ┌──────────────┐  ┌─────────────────┐
     │  Human Client   │ │ Agent Client │  │   Game Server   │
     │ Svelte+Threlte  │ │ Rust+rmcp    │◄─┤  Rust/Tokio     │
     │ WebGPU/Three.js │ │ MCP Server   │  │  WebSocket+Axum │
     └───────┬────────┘ └──────┬───────┘  └────────┬────────┘
             │                 │                    │
             └──── WebSocket (동일 프로토콜) ────────┘
                     ▲ 서버는 양자를 구분 불가
```

## 핵심
- **에이전트-인간 패리티**가 이 프로젝트의 존재 이유다. 저자 주장에 따르면 에이전트는 별도 API 없이 인간 플레이어와 정확히 같은 WebSocket 프로토콜을 사용하며, 서버는 양자를 구별할 수 없다. 즉 인간이 할 수 있는 행동은 에이전트도 할 수 있고, 그 반대도 성립한다.
- 이 패리티는 **MCP(Model Context Protocol) 서버**로 구현된 에이전트 클라이언트를 통해 실현된다. 에이전트는 rmcp 라이브러리를 사용해 MCP 서버를 띄우고, tokio-tungstenite로 WebSocket에 접속한다. 이는 LLM 기반 에이전트가 게임 세계에 "로그인"하는 구조다.
- 게임 세계는 **32km×32km 절차적 생성 월드** 위에 구축되며, 지형·하천·도로·다리가 모두 자동으로 만들어진다. Rust 기반 서버가 NetHack/D&D 스타일의 서버 권위 전투를 처리하고, 모든 판정은 서버 측에서 이루어진다.

## 깊이
- **[패리티-MCP 연결]** 에이전트 클라이언트는 단순 WebSocket 클라이언트가 아니라 MCP 서버(rmcp)를 내장한다. 이는 외부 LLM이 MCP 도구 호출을 통해 게임 행위를 수행할 수 있음을 의미한다. 다만 원문에서 어떤 LLM을 어떻게 연결하는지 구체적 프로토콜은 **원문에 없음**.
- **[기술 스택-공유 크레이트]** `shared/` 크레이트가 서버·클라이언트(WASM)·에이전트 클라이언트 세 곳에서 공유된다. 즉 게임 로직과 데이터 구조가 단일 소스에서 컴파일되어 일관성을 보장한다. 데이터는 `data-src/`에서 빌드 시 `data/`의 JSON으로 변환된다.
- **[대표 기능: 주택 시스템]** 모듈형 목조 건축, 층간 인식 드롭 아이템(2층에서 떨어뜨린 아이템은 2층에서만 획득 가능), 서버 측 원자성 중복 방지 등 게임플레이 깊이가 단순하지 않음을 보여준다.

## 용어 풀이
- **Agent-Human Parity** — 에이전트와 인간을 동등하게 취급하는 설계 원칙. 비유: "같은 창구에서 같은 양식을 쓰는 시민과 외국인." 깨지는 점: 에이전트는 인간보다 빠른 입력·지속 접속이 가능하므로 실질적 동등성과는 다를 수 있다.
- **Server-authoritative combat** — 전투 판정을 클라이언트가 아닌 서버가 수행. 비유: "심판이 있는 스포츠." 깨지는 점: 레이턴시가 높은 환경에서는 체감이 나빠질 수 있다.
- **MCP (Model Context Protocol)** — LLM이 외부 도구를 호출하는 표준 프로토콜. 비유: "AI를 위한 USB 포트." 깨지는 점: MCP 자체가 게임 행위 표현에 적합한지는 불확실.

## 시각 자료
| 구성 요소 | 기술 | 역할 |
|-----------|------|------|
| 클라이언트 | Svelte + Threlte + WebGPU | UI + 3D 렌더링 |
| 서버 | Rust + Tokio + Axum | 게임 상태 + REST API |
| 에이전트 | Rust + rmcp + tokio-tungstenite | MCP 기반 AI 클라이언트 |
| 공유 | shared/ 크레이트 → WASM | 로직 일관성 |

## 핵심 시사점 / 판단
- (저자 주장) 에이전트에게 특권 API를 주지 않으면 AI와 인간의 진정한 상호작용이 가능하다 — 흥미로운 설계 철학이나, 대규모 환경에서의 성능·치팅 영향은 **검증 필요**.
- (불확실) 에이전트 클라이언트의 MCP 서버가 실제로 어떤 LLM과 어떻게 연동되는지, 어떤 MCP 도구를 노출하는지는 원문에서 확인할 수 없다.
- (사실) 프로젝트는 오픈소스이며, [openmmo.to.nexus](https://openmmo.to.nexus:10004/)에서 Google 로그인으로 접속 가능하다.

## 레퍼런스
- OpenMMO GitHub — https://github.com/Julian-adv/OpenMMO · (1차) · Rust+Svelte 기반 에이전트-인간 패리티 MMORPG 저장소.
- MCP (Anthropic) — https://modelcontextprotocol.io · (1차) · LLM 도구 호출 표준 프로토콜.
- Suno / Google Flow Music — https://suno.com / https://labs.google/fx/tools/music-fx · (1차) · AI BGM 생성에 사용된 도구.

## 확인 질문
- Q1: MCP 기반 에이전트가 인간 플레이어와 같은 인터페이스를 쓰면, 에이전트의 반응 속도 이점을 어떻게 공정하게 관리할 것인가?
- Q2: shared 크레이트를 WASM으로 컴파일할 때 게임 로직의 어느 부분이 브라우저에서 실행되며, 서버와 클라이언트 간 권한 경계는 어떻게 나뉘는가?
- Q3: 1인 개발+vibe-coded 프로젝트에서 에이전트-인간 패리티가 실제 대규모 동시접속 환경에서도 유지되는지, 서버 부하 테스트 결과는 존재하는가?

> 출처: https://github.com/Julian-adv/OpenMMO
