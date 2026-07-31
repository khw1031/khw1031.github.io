---
title: 'Deep Agents: LangChain의 batteries-included 에이전트 하네스'
pubDate: '2026-07-31T11:03:58+09:00'
description: 'LangGraph 위에 구축된 LangChain의 opinionated 에이전트 하네스 Deep Agents의 구조·기능·생태계를 정리한 학습 리포트.'
summary: 'Deep Agents는 LangGraph 런타임 위에 filesystem, sub-agent, context 관리, skills 등을 기본 탑재한 ''batteries-included'' 에이전트 프레임워크다. LangChain 생태계의 계층 구조와 Deep Agents가 어느 위치에서 어떤 문제를 해결하는지 한 장에 파악할 수 있다.'
lang: ko
tags:
  - 'llm'
  - 'agentic-coding'
  - 'ai'
  - 'mcp'
  - 'workflow'
canonical: 'https://github.com/langchain-ai/deepagents'
lintHash: 'a6510de2773d'
---

## TL;DR
- Deep Agents는 LangGraph 위에 **파일시스템·서브에이전트·컨텍스트 관리·스킬**을 기본 탑재한 opinionated 에이전트 하네스로, "Claude Code가 하는 일을 범용화하려는 시도"라고 저자는 주장한다.

## 큰 그림
```
┌─────────────────────────────────────────────────────────────┐
│  Deep Agents Code (터미널 코딩 에이전트, Claude Code 유사)  │
└──────────────────────┬──────────────────────────────────────┘
                       │ 기반
┌──────────────────────▼──────────────────────────────────────┐
│  Deep Agents (opinionated harness)                          │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌─────────────┐  │
│  │Sub-agents│ │Filesystem│ │Context Mgmt│ │Skills/Memory│  │
│  └──────────┘ └──────────┘ └────────────┘ └─────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐                  │
│  │Shell     │ │Human-in  │ │Tools(커스텀│                  │
│  │access    │ │-the-loop │ │  + MCP)    │                  │
│  └──────────┘ └──────────┘ └────────────┘                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ 내부에서 사용
┌──────────────────────▼──────────────────────────────────────┐
│  LangChain create_agent (최소 하네스)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ 그래프 실행
┌──────────────────────▼──────────────────────────────────────┐
│  LangGraph (그래프 런타임: streaming·checkpoint·persist)    │
└──────────────────────┬──────────────────────────────────────┘
                       │ 관측·배포
┌──────────────────────▼──────────────────────────────────────┐
│  LangSmith (tracing / evaluation / monitoring)              │
└─────────────────────────────────────────────────────────────┘
```
하위로 내려갈수록 **저수준·범용**, 상위로 올라갈수록 **고수준·opinionated**. 어느 레이어에서든 빠져나가 커스텀 그래프를 짤 수 있고, 반대로 `CompiledStateGraph`를 Deep Agents의 sub-agent로 주입할 수도 있다고 원문은 설명한다.

## 핵심
- Deep Agents는 "에이전트 루프" 자체를 다시 구현하지 않는다. LangGraph라는 그래프 런타임 위에 **장기·다단계 작업에 적합한 기본값**을 얹은 형태다. 즉 개발자가 매번 직접 짜야 했던 파일 입출력·컨텍스트 압축·서브에이전트 위임 같은 '지루한 파이프라인'을 번들로 제공한다.
- 이 번들이 필요한 이유는 LLM의 **제한된 컨텍스트 윈도우**와 **단일 에이전트의 주의 산만** 문제를 해결하기 위해서다. 원문에 따르면 sub-agent는 격리된 컨텍스트로 작업을 위임받고, 긴 스레드는 요약되며, 도구 출력은 디스크로 오프로드된다.
- Model-agnostic 설계도 핵심이다. tool calling만 지원하면 OpenAI·Anthropic 같은 frontier API뿐 아니라 Ollama, vLLM, llama.cpp로 돌리는 로컬 모델도 동일 인터페이스로 붙일 수 있다고 주장한다.
- "Trust the LLM" 보안 모델은 중요한 설계 판단이다. 모델이 스스로를 제어하길 기대하지 않고, **도구·샌드박스 수준에서 경계를 강제**하라는 것. 이는 에이전트가 실제로는 "허용된 모든 것"을 할 수 있음을 뜻한다.

## 깊이
- **[계층 차별화]** LangChain의 `create_agent`는 최소 하네스(중간 미들웨어 없음), Deep Agents는 풀 하네스(파일·스킬·플래닝 포함). 원문은 "언제 Deep Agents를 쓸까"에 대해 *아웃오브박스로 기획·컨텍스트·위임이 필요할 때*라고 답한다. 반대로 "에이전트 루프 모양 자체가 안 맞으면" LangGraph로 직접 짜라고 하는데, 이는 프레임워크가 만능이 아님을 스스로 인정하는 대목.
- **[Deep Agents Code]** Claude Code/Cursor 같은 터미널 코딩 에이전트를 `curl` 한 줄로 설치할 수 있다고 소개하며, 어떤 LLM으로든 구동 가능함을 강조한다. 저자는 이를 "Claude Code에서 영감을 받아 일반화를 시도한 것"이라고 명시. **(저자 주장, 독립 검증 원문에 없음)**
- **[생산성 도구 조합]** LangSmith가 tracing·evaluation·monitoring을 담당하므로, Deep Agents는 실행·LangSmith는 관측이라는 역할 분리가 설계 의도.

## 용어 풀이
- **Agent harness** — 에이전트를 감싸는 '껍데기'. LLM이 도구 호출 결과를 받아 다음 행동을 결정하는 루프와 그 주변 편의장치를 합친 것. *비유: 자동차 섀시.* 깨지는 지점: LLM 자체는 포함하지 않으므로 '엔진 없는 차'에 가깝다.
- **Opinionated** — 기본값이 강하게 정해져 있어 바로 쓸 수 있지만 커스터마이징 여지는 남음. *비유: 세팅 끝난 식당 세트 메뉴.* 깨지는 지점: override 불가능한 필드는 아니므로 완전한 강제성은 아님.
- **Sub-agent** — 별도 컨텍스트 윈도우에서 돌아가는 하위 에이전트. *비유: 팀장이 외주 준 계약직.* 깨지는 지점: 컨텍스트가 격리되면 전체 문맥 공유가 제한되어 조정이 더 어려워질 수 있음(원문은 이 비용을 명시하지 않음).
- **Human-in-the-loop** — 도구 실행 전 사람이 approve/edit/reject하는 단계.

## 시각 자료
| 레이어 | 역할 | 언제 선택 |
|---|---|---|
| Deep Agents | 풀 하네스 (기본값 풍부) | 장기·다단계 작업을 바로 시작하고 싶을 때 |
| LangChain `create_agent` | 최소 하네스 | 미들웨어 없이 가볍게 만들고 싶을 때 |
| LangGraph | 그래프 런타임 | 에이전트 루프 모양 자체를 커스텀해야 할 때 |
| LangSmith | 관측·평가 | 트레이싱·모니터링이 필요한 프로덕션 |

## 핵심 시사점 / 판단
- **(저자 주장)** "batteries-included + extensible + model-agnostic"이 동시에 가능하다는 점. 실제로 override 비용이 낮은지는 프로젝트별 검증 필요.
- **(저자 주장)** Claude Code의 일반화가 목표이며, 오픈소스로 재현 가능하다는 점.
- **(검증 필요·불확실)** 로컬/오픈웨이트 모델에서의 "동일한 품질" 동작 여부 — tool calling 규격·성능 편차가 실제로 얼마나 흡수되는지 원문에 수치 근거 없음.
- **(검증 필요·불확실)** "Production-ready"라는 표현은 LangSmith 연동을 전제로 하므로, LangSmith 없이도 production-grade인지 불확실.

## 레퍼런스
- GitHub langchain-ai/deepagents — https://github.com/langchain-ai/deepagents · (1차) · 프로젝트 공식 저장소 및 README 전체.
- Deep Agents 문서 — https://docs.langchain.com/oss/python/deepagents/overview · (1차) · 개념·가이드 상세(본 리포트에서는 미확인).
- LangChain 생태계 개요 — https://docs.langchain.com/oss/python/concepts/products · (1차) · Deep Agents/LangChain/LangGraph 계층 관계.
- LangSmith — https://docs.langchain.com/langsmith/home · (1차) · 관측·평가 플랫폼.
- deepagents.js — https://github.com/langchain-ai/deepagentsjs · (1차) · JS/TS 포트.

## 확인 질문
- Q1(전이): 이 계층 구조(LangGraph → LangChain → Deep Agents) 패턴은 다른 에이전트 프레임워크(AutoGen, CrewAI 등)에도 적용 가능한가?
- Q2(왜/어떻게): "trust the LLM" 보안 모델에서 샌드박스는 구체적으로 어떤 단위(컨테이너? 프로세스?)로 강제되는가?
- Q3(경계): tool calling을 지원하지 않는 구형/소형 모델에서는 이 프레임워크가 아예 동작하지 않는가, 아니면 폴백이 있는가?

> 출처: https://github.com/langchain-ai/deepagents
