---
title: 'LlamaIndex: 데이터 위에서 LLM 에이전트를 만드는 프레임워크 개요'
pubDate: '2026-07-15T10:00:00+09:00'
description: 'LlamaIndex의 RAG 5단계(로딩·인덱싱·저장·쿼리·평가)와 에이전트·워크플로우 구조, 핵심 빌딩 블록을 정리한 학습 노트'
summary: 'LlamaIndex를 "내 데이터를 LLM에 연결하는 컨텍스트 증강 프레임워크"로 파악하고, RAG 파이프라인 단계와 에이전트/워크플로우 확장, 주요 컴포넌트를 전체 맵으로 이해한다.'
lang: ko
tags:
  - 'ai'
  - 'llm'
  - 'rag'
  - 'llamaindex'
  - 'agent'
canonical: 'https://developers.llamaindex.ai/python/framework/'
polishHash: 'acc41e99ba2e'
lintHash: 'acc41e99ba2e'
---

> 한 줄 명제: LlamaIndex는 공개 데이터로만 학습된 LLM에 내 사설·도메인 데이터를 연결하는 "컨텍스트 증강(context augmentation)" 프레임워크로, 데이터 로딩→인덱싱→저장→쿼리로 이어지는 RAG 파이프라인 위에 도구를 쓰는 에이전트와 이벤트 기반 워크플로우까지 얹어 데이터 위에서 동작하는 LLM 애플리케이션을 만든다.

## 큰 그림

```text
             LlamaIndex: LLM + 내 데이터 (Context Augmentation)
                                │
     ┌──────────────┬───────────┴────────┬──────────────┬─────────────┐
     │              │                    │              │             │
  ①로딩          ②인덱싱·임베딩       ③저장          ④쿼리         ⑤에이전트·워크플로우
  Documents      Indexes            Vector Store   Retrievers     Agents (도구+추론루프)
  Nodes          Embeddings         Storage        Routers        Workflows (이벤트 기반)
  Connectors     VectorStoreIndex   persist        Postprocessors  loop/branch/concurrent
  (LlamaHub)     PropertyGraph                     Response Synth
  LlamaParse                                       Query/Chat Engine
                                │
                     ⑥관측·평가 (Observability / Evaluation) — 전 단계 관통
```

## 핵심

LlamaIndex는 스스로를 "==데이터 위에서 LLM과 워크플로우로 LLM 기반 에이전트를 만드는 대표 프레임워크=="로 정의한다. 출발점의 문제의식은 명확하다 — LLM은 공개 학습 데이터에서 나온 방대한 일반 지식을 갖지만, 회사 내부 문서나 개인 데이터 같은 **도메인 특화·사설 정보는 알지 못한다**. LlamaIndex는 이 간극을 **컨텍스트 증강(context augmentation)**, 즉 내 데이터를 LLM이 쓸 수 있게 만들어 메우는 것을 핵심 임무로 삼는다.

가장 많이 문서화된 응용은 **RAG(Retrieval-Augmented Generation)**이며, 공식 문서는 이를 다섯 단계로 나눈다: ==로딩(Loading) → 인덱싱(Indexing) → 저장(Storing) → 쿼리(Querying) → 평가(Evaluation)==. 데이터의 기본 단위는 **Document**(원본 데이터 컨테이너)와 이를 잘게 나눈 **Node**(chunk)다. Node를 임베딩해 **Index**로 구조화하고, 질의 시 **Retriever**가 관련 Node를 꺼내오면 **Response Synthesizer**가 LLM으로 답을 만든다. 이 흐름을 감싼 것이 **Query Engine**(단발 질의응답)과 **Chat Engine**(멀티턴 대화)이다.

RAG 위에 두 가지 확장 축이 있다. **Agent**는 "LLM을 도구·메모리와 결합해 다음에 어떤 도구를 쓸지 결정하는 추론 루프 안에서 반자율적으로 작업을 수행하는 소프트웨어"다. **Workflows**는 looping·branching·concurrent 실행을 지원하는 **이벤트 기반(event-driven)** 오케스트레이션 계층으로, 에이전트·커넥터·도구를 엮는 고급 agentic 앱의 토대다. 2026년 기준 Workflows는 `llama-index-workflows`라는 독립 패키지(1.0)로 분리되어 LlamaIndex 밖에서도 범용 오케스트레이터로 쓸 수 있다.

검증 시점(2026-07-15): 최신 릴리스는 **llama-index 0.14.23** (2026-06-24). 공식 문서는 기존 `docs.llamaindex.ai`에서 `developers.llamaindex.ai`로 이전되었다.

## 깊이

### ① 로딩 — Documents, Nodes, Connectors(LlamaHub), LlamaParse
⭐ **Document**는 PDF·API·DB 등 원본에서 가져온 데이터의 컨테이너이고, **Node**는 Document를 청킹한 최소 단위(텍스트 조각 + 메타데이터)다. 검색·임베딩은 Node 단위로 이루어진다.

⭐ **Connector(Reader)**는 다양한 소스에서 데이터를 뽑아 Document로 만드는 어댑터다. **LlamaHub**에는 이런 커넥터와 통합 패키지가 300개 넘게 있으며, 필요한 것만 골라 설치한다.

📎 **LlamaParse**는 LlamaCloud에서 제공하는 VLM(비전 언어 모델) 기반 문서 파서로, 표·레이아웃이 복잡한 PDF를 LLM이 다루기 좋은 형태로 파싱한다. 최근 LlamaIndex는 스스로를 "document agent and OCR platform"으로 재포지셔닝하는 흐름을 보인다.

### ② 인덱싱·임베딩 — Indexes, Embeddings, VectorStoreIndex, PropertyGraph
⭐ **Index**는 Node들을 LLM이 질의하기 좋은 중간 표현으로 구조화한다. 가장 흔한 것이 각 Node를 벡터 임베딩으로 저장하는 **VectorStoreIndex**이고, 엔티티·관계를 그래프로 담는 **PropertyGraphIndex**도 있다.

📎 **Embedding**은 텍스트를 수치 벡터로 바꿔 의미 유사도 검색을 가능하게 한다. 어떤 임베딩 모델·LLM을 쓸지는 **Settings**라는 전역 설정 객체로 중앙 관리한다(예전 ServiceContext의 후속).

### ③ 저장 — Storing, Vector Store, persist
⭐ 인덱싱한 데이터와 전처리 요약은 매번 다시 만들지 않도록 **저장**한다. 벡터는 주로 Qdrant·Chroma·pgvector 같은 **Vector Store**에, 문서/인덱스 메타데이터는 storage context로 영속화한다.

📎 저장이 별도 단계인 이유는 임베딩 생성이 비싸기 때문이다 — 한 번 인덱싱한 뒤 persist해 두면 재기동 시 로드만 하면 된다.

### ④ 쿼리 — Retrievers, Routers, Node Postprocessors, Response Synthesizers, Query/Chat Engine
⭐ **Retriever**는 질의에 대해 Index에서 관련 Node를 꺼내는 전략(벡터 유사도, 키워드, 하이브리드 등)을 정의한다. **Router**는 여러 Retriever/도구 중 어디로 보낼지 라우팅한다.

⭐ **Node Postprocessor**는 검색된 Node를 재정렬·필터링(rerank, 유사도 컷오프 등)해 품질을 높이고, **Response Synthesizer**가 최종 Node들과 질의를 LLM에 넣어 답을 합성한다.

📎 **Query Engine**은 "자연어 질문 → (참조 컨텍스트와 함께) 응답"의 end-to-end 흐름이고, **Chat Engine**은 단발이 아닌 여러 번의 주고받음(멀티턴 대화)을 다룬다.

### ⑤ 에이전트·워크플로우 — Agents, Workflows(1.0)
⭐ **Agent**는 도구(retrieval·행동)를 쥔 LLM이 추론 루프를 돌며 다음 행동을 스스로 결정한다. RAG가 "검색 후 답변"이라면, 에이전트는 "필요하면 도구를 여러 번 호출하며 다단계로 문제를 푼다".

⭐ **Workflows**는 이벤트를 step 사이로 흘려보내는 이벤트 기반 추상화로, 분기·반복·동시 실행을 명시적으로 표현한다. 1.0에서 `llama-index-workflows` 독립 패키지로 분리됐고, 기존 import 경로로도 re-export되어 하위 호환된다.

### ⑥ 관측·평가 — Observability / Evaluation
📎 LLM 앱은 내부 동작이 불투명하므로 **Tracing/Observability**로 안을 들여다보는 것이 특히 중요하다. **Evaluation**은 변경이 정확도·성능·비용·명료성을 실제로 개선했는지 판단하는 관통 관심사다.

## LangChain과의 비교

두 프레임워크는 목적이 겹치지만 **무게중심(center of gravity)이 다르다**. ==LlamaIndex는 "데이터 인덱싱·검색(RAG)"에서 출발해 에이전트를 얹었고, LangChain은 "에이전트 오케스트레이션"에서 출발해 검색을 붙인다.== 검증 시점(2026-07-15) 공식 문서 기준으로 정리한다.

| 축 | LlamaIndex | LangChain |
|---|---|---|
| **무게중심** | 데이터 파이프라인·RAG (1차 관심) | 에이전트 오케스트레이션 (1차 관심) |
| **핵심 추상** | 로딩→인덱싱→저장→쿼리 파이프라인 (Documents/Nodes/Index/Retriever/Query Engine) | `create_agent` 하니스 + 표준 모델 인터페이스 (chains/tools/prompt/middleware) |
| **에이전트** | Agents + **Workflows**(이벤트 기반, `llama-index-workflows` 독립 패키지) — 상대적으로 2차 관심 | `create_agent`·**LangGraph**·**Deep Agents** — durable 실행, human-in-the-loop, persistence를 전면에 둠 |
| **RAG 기본기** | 청킹·메타데이터 필터·하이브리드·rerank·query routing을 sane default로 기본 제공 | 컴포넌트는 있으나 직접 조립하는 부담이 상대적으로 큼 |
| **문서 파싱** | **LlamaParse/LlamaCloud**(VLM OCR) — "document agent and OCR platform" 재포지셔닝의 강점 축 | 자체 파싱보다 외부 로더·통합에 의존 |
| **관측·평가** | Observability/Evaluation 모듈 | **LangSmith**(트레이싱·디버깅·평가 플랫폼; LangSmith Engine이 이슈 탐지·수정 제안) |
| **패키지 구조** | `llama-index`(starter) / `llama-index-core` / 300+ 통합 / `llama-index-workflows` | `langchain-core` / `langchain` / `langgraph` / `langsmith` / 통합 패키지 |

**언제 무엇을** — 제품의 "가장 어려운 문제"가 어디 있는지로 가른다.

- **지저분한 문서 중심 검색**(문서 Q&A, 지식베이스, 사내 검색)이 핵심이고, 청킹·하이브리드·rerank를 기본값으로 빠르게 세우고 싶다 → **LlamaIndex**.
- **상태를 갖는 다단계 에이전트**(도구 반복 호출, human-in-the-loop, 분기·중단·재개, 넓은 도구 통합)가 핵심이다 → **LangChain(LangGraph)**.

**함께 쓰는 패턴**(2026 실무에서 흔한 기본값, 단 아래 근거는 2차/블로그 합의라 확정 아님): 검색 계층은 LlamaIndex(청킹·검색·합성·citation, 필요 시 LlamaParse로 깨끗한 컨텍스트 확보), 에이전트 오케스트레이션 계층은 LangGraph로 두고 — LlamaIndex의 Query Engine을 LangGraph 에이전트의 도구로 물려 결합한다. "둘 중 하나"가 아니라 "층위가 다른 상보재"로 보는 관점이 실무 합의에 가깝다.

> 주의: 두 프레임워크의 무게중심·"둘 다 쓴다" 결론은 벤더 문서(1차)가 아니라 비교 블로그(2차)의 합의에서 나온 것이다. "LlamaIndex가 검색 40% 빠르다" 같은 수치는 출처가 블로그뿐이라 **검증되지 않은 2차 주장**으로 취급하고 본문에 사실로 싣지 않았다.

## 비유

**LlamaIndex를 "개인 비서를 위한 사내 자료실 시스템"에 비유하면**: LLM은 세상 지식은 많지만 우리 회사 사정은 모르는 신입 비서다. Connector는 여기저기 흩어진 문서를 자료실로 실어 나르는 수레(로딩), 사서가 문서를 챕터 카드로 쪼개 색인을 만드는 것이 Node·Index(인덱싱), 색인을 서고에 꽂아두는 것이 저장이다. 비서가 질문을 받으면 Retriever가 관련 카드를 찾고 Response Synthesizer가 그 카드로 답을 정리한다(쿼리). Agent는 "카드만 찾는" 데 그치지 않고 계산기·이메일 같은 도구를 스스로 꺼내 여러 단계로 일을 처리하는 유능한 비서다.

**깨지는 지점**: 자료실 사서는 카드의 '의미'를 이해하지 않는다 — 벡터 간 수학적 거리만 잰다. 또 비유 속 비서는 사람이지만, 에이전트의 "판단"은 확률적 토큰 생성이라 도구 선택이 틀릴 수 있다. 그래서 Observability·Evaluation이라는, 비유에는 없는 별도 감시 장치가 반드시 필요하다.

## 곁가지

- **LangChain 비교 심화**: 무게중심·핵심 추상·에이전트·RAG 기본기·함께 쓰기 패턴은 위 「LangChain과의 비교」 절에 정리 → 프로덕션에서 "LlamaIndex 검색 + LangGraph 에이전트" 결합 설계를 실제로 짤 때 각 프레임워크의 통합 지점을 재확인
- **Workflows 심화**: 이벤트 기반 step 설계, 서버로 배포(`workflows/deployment`)까지 다뤄야 할 때 → Workflows 1.0 공식 문서 참조
- **PropertyGraphIndex 심화**: 벡터 검색만으로 부족한 엔티티·관계 질의(GraphRAG류)가 필요할 때 → Property Graph 문서 참조
- **LlamaParse/LlamaCloud 심화**: 복잡한 표·스캔 PDF의 파싱 품질이 검색 정확도를 좌우할 때 → LlamaParse 문서 참조
- **평가 심화**: retrieval 정확도 vs 생성 품질을 분리 측정하는 지표 설계가 필요할 때 → Evaluation 모듈 참조

## 연결

- **Qdrant/벡터 검색 엔진**: LlamaIndex의 ③저장·④쿼리는 Qdrant 같은 Vector Store를 백엔드로 쓴다. Qdrant가 "벡터를 어떻게 저장·검색하는가"(HNSW, quantization, hybrid)를 책임진다면, LlamaIndex는 "그 위에서 문서를 어떻게 로딩·청킹·합성하는가"의 상위 오케스트레이션을 맡는다 — 층위가 다른 상보 관계다.
- **RAG ↔ 에이전트**: RAG는 "검색→합성"의 단방향 파이프라인, 에이전트는 "도구를 반복 호출하는 추론 루프". LlamaIndex는 Query Engine 자체를 에이전트의 도구로 감싸 RAG를 에이전트의 한 능력으로 흡수한다.
- **Workflows ↔ 범용 오케스트레이터**: Workflows 1.0이 독립 패키지가 되면서, LangGraph 같은 이벤트/그래프 기반 오케스트레이션 프레임워크와 같은 문제 공간(분기·반복·동시성)을 겨냥하게 됐다.
- **Settings ↔ 경계 객체 원칙**: LLM·임베딩 모델 선택을 Settings에 가두는 것은 "변하기 쉬운 provider 지식을 경계 한 곳에 모은다"는 원칙의 구현 — 소비 코드(Query Engine)는 어떤 모델인지 몰라도 된다.

## 레퍼런스

- [LlamaIndex Framework (Python)](https://developers.llamaindex.ai/python/framework/) — 프레임워크 정의와 상위 개념 랜딩 페이지 (1차)
- [Building an LLM application — Understanding](https://developers.llamaindex.ai/python/framework/understanding/) — 로딩·인덱싱·저장·쿼리·에이전트·워크플로우 단계 개요 (1차)
- [High-Level Concepts](https://developers.llamaindex.ai/python/framework/getting_started/concepts/) — Query Engine·Chat Engine·Agent 등 핵심 개념 정의 (1차)
- [Installation and Setup](https://developers.llamaindex.ai/python/framework/getting_started/installation/) — `llama-index` starter vs `llama-index-core` + 통합 패키지 설치 경로 (1차)
- [Announcing Workflows 1.0](https://www.llamaindex.ai/blog/announcing-workflows-1-0-a-lightweight-framework-for-agentic-systems) — Workflows 독립 패키지 분리 발표 (1차, 벤더 블로그)
- [llama-index · PyPI](https://pypi.org/project/llama-index/) — 최신 버전 0.14.23 (2026-06-24 릴리스) 확인 (1차)
- [run-llama/llama_index (GitHub)](https://github.com/run-llama/llama_index) — 소스 저장소, "document agent and OCR platform" 재포지셔닝 확인 (1차)
- [LangChain Overview](https://docs.langchain.com/oss/python/langchain/overview) — `create_agent`·LangGraph·Deep Agents·LangSmith 구성과 에이전트 우선 포지셔닝 (1차, 비교 대상)
- [LangChain vs LlamaIndex 2026 비교 글 모음](https://aimultiple.com/rag-frameworks) — 무게중심 차이·"둘 다 쓰기" 실무 합의의 출처 (2차, 애그리게이터) — 수치 주장은 미검증

---
## 인출 질문

1. LlamaIndex가 말하는 "컨텍스트 증강(context augmentation)"이 풀려는 근본 문제는 무엇이며, RAG의 다섯 단계(로딩·인덱싱·저장·쿼리·평가)가 각각 그 문제 해결에서 맡는 역할을 설명하라.
2. Document와 Node의 차이는 무엇이고, 쿼리 단계에서 Retriever → Node Postprocessor → Response Synthesizer로 이어지는 흐름이 왜 이 순서인지 서술하라.
3. RAG와 Agent는 어떻게 다르며, Workflows가 "이벤트 기반"이라는 점이 분기·반복·동시 실행에서 어떤 이점을 주는지 설명하라.

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
