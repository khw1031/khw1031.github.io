---
title: 'claude-peers — 로컬 Claude Code 멀티세션 연결 MCP 서버'
pubDate: '2026-07-23T08:52:19+09:00'
description: 'claude-peers는 로컬에서 여러 Claude Code 세션을 MCP로 연결해 상호 조율하게 하는 브로커 기반 서버다.'
summary: '로컬 SQLite 브로커 위에서 다수 Claude Code 세션이 폴링 기반 메시지를 교환하는 claude-peers의 구조를 한 장의 지도와 함께 파악할 수 있다.'
lang: ko
tags:
  - 'mcp'
  - 'ai'
  - 'agentic-coding'
canonical: 'https://www.threads.com/@ryugw109/post/DbFidD5GjMj?xmt=AQG0ny9mymx_ENzldo52ToyXgDgkrUIhAZ5ZFT7W_Ve9uWLygwBOc8scUykKqAsjCFDSSMtk&slof=1'
lintHash: '852c0aa2f4fc'
---

## TL;DR
- claude-peers는 같은 컴퓨터의 여러 Claude Code 세션을 localhost 브로커로 묶어, 세션 간 직접 메시지 교환과 작업 조율을 가능하게 하는 MCP 서버다.

## 큰 그림
```
┌─────────────────── localhost (port 7899) ───────────────────┐
│                                                              │
│  ┌─────────────┐                                            │
│  │ SQLite      │ ◄── 첫 세션 시작 시 자동 기동               │
│  │ Broker      │                                            │
│  └──────┬──────┘                                            │
│         │ 1초 간격 폴링                                      │
│    ┌────┼────────────┐                                      │
│    ▼    ▼            ▼                                      │
│ ┌────┐ ┌────┐    ┌────┐                                    │
│ │S-1 │ │S-2 │ …  │S-N │  ← 각 Claude Code 세션              │
│ │MCP │ │MCP │    │MCP │    (MCP 서버로 브로커에 등록)        │
│ └────┘ └────┘    └────┘                                    │
│                                                              │
│  ※ 트래픽은 localhost 밖으로 나가지 않음                      │
└──────────────────────────────────────────────────────────────┘
```

## 핵심
- 여러 Claude Code 인스턴스는 기본적으로 서로의 존재를 모른다. 각 세션이 독립적으로 동작하기 때문에 같은 프로젝트에서 병렬 작업 시 중복이나 충돌이 발생할 수 있다. claude-peers는 이 문제를 **MCP(Model Context Protocol) 서버**라는 표준 인터페이스로 해결한다.
- 동작 흐름은 다음과 같다: 첫 세션이 시작되면 localhost 7899 포트에 SQLite 기반 중앙 브로커가 자동으로 기동한다. 이후 각 세션은 자신이 가진 MCP 서버를 통해 브로커에 등록되고, 1초마다 폴링하여 다른 세션의 메시지를 확인한다. 응답이 없는 세션은 브로커가 자동으로 정리한다.
- 이 구조의 핵심 제약은 **트래픽이 localhost를 벗어나지 않는다**는 점이다. 외부 네트워크 없이 같은 컴퓨터 안에서만 세션 간 통신이 이루어진다.

## 깊이
- **[중앙 브로커 방식]** P2P가 아닌 스타 토폴로지를 선택한 이유(저자 주장): 세션 수만큼 연결이 늘어나는 P2P와 달리, 브로커 하나만 관리하면 되므로 구현과 디버깅이 단순하다. 단, 브로커가 단일 장애점이 될 수 있다.
- **[SQLite 기반]** 메시지 큐로 Redis나 RabbitMQ가 아닌 SQLite를 사용한 점(저자 주장): 별도 인프라 설치 없이 파일 하나로 동작해, 로컬 개발 환경에 최적화된다. 동시写入 부하가 낮을 때 유효한 선택이다.
- **[1초 폴링]** 실시간성이 중요한 시나리오에는 부적합할 수 있다(불확실 — 원문에 지연 시간 관련 측정치 없음).

## 용어 풀이
- **MCP (Model Context Protocol)** — AI 에이전트가 외부 도구·데이터와 대화하는 표준 규격 / 비유: "AI용 USB 포트" / 비유가 깨지는 지점: USB는 물리적 연결이지만 MCP는 프로토콜(약속)이라 구현체마다 지원 범위가 다르다.
- **브로커** — 메시지를 중개하는 중앙 서버 / 비유: "우체국" — 보내는 사람과 받는 사람을 직접 만나지 않게 해줌 / 비유가 깨지는 지점: 우체국은 영구 기관이지만 이 브로커는 첫 세션과 함께 태어나고 세션이 없으면 사라진다.
- **폴링** — 정해진 간격으로 "새 소식 있나?"고 반복 확인하는 방식 / 비유: "5분마다 우편함 확인" / 비유가 깨지는 지점: 실시간 푸시와 달리 최대 1초(폴링 간격)만큼 메시지 수신이 늦어질 수 있다.

## 시각 자료
| 구성 요소 | 역할 | 기술 스택 |
|-----------|------|-----------|
| Broker | 세션 등록·메시지 중계·정리 | SQLite, localhost:7899 |
| MCP Server (세션별) | 세션을 브로커에 연결하는 어댑터 | MCP 프로토콜 |
| Polling Loop | 1초 간격 메시지 확인 | — |

## 핵심 시사점 / 판단
- **(저자 주장)** 로컬 멀티세션 조율이 가능해지면, 복잡한 프로젝트를 세션별로 분할해 병렬 처리하는 워크플로우가 실현된다.
- **(저자 주장)** 트래픽이 localhost를 벗어나지 않아 보안 부담이 적다.
- **(검증 필요·불확실)** 다수 세션 동시 작업 시 SQLite 쓰기 잠금이 병목이 될 수 있는지, 실제 작업 조율 정확도는 어느 정도인지 원문에 측정 데이터 없음.

## 레퍼런스
- Threads 원문 — https://www.threads.com/@ryugw109/post/DbFidD5GjMj · (2차) · claude-peers 소개 및 구조 요약 스레드.
- PyTorch Korea 토론 — https://discuss.pytorch.kr/t/claude-peers-claude-code-mcp/10755 · (2차) · 한국어 커뮤니티 논의 및 추가 맥락.

## 확인 질문
- Q1(전이): 이 브로커 패턴을 Claude Code 외 다른 AI 코딩 에이전트(예: Cursor, Copilot) 세션 간 통신에도 적용할 수 있을까?
- Q2(왜·어떻게): 왜 WebSocket이나 SSE 같은 실시간 푸시가 아닌 1초 폴링을 선택했을까? 구현 단순성 vs 실시간성 트레이드오프는?
- Q3(경계): localhost 제약 때문에 원격 팀원의 세션과는 연결할 수 없는데, 멀티머신 확장이 필요하면 어떤 아키텍처 변경이 필요한가?

> 출처: https://www.threads.com/@ryugw109/post/DbFidD5GjMj?xmt=AQG0ny9mymx_ENzldo52ToyXgDgkrUIhAZ5ZFT7W_Ve9uWLygwBOc8scUykKqAsjCFDSSMtk&slof=1
