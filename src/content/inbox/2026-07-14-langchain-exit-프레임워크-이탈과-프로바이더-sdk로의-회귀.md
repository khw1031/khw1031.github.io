---
title: 'LangChain Exit: 무거운 프레임워크에서 프로바이더 SDK + 얇은 코드로'
pubDate: '2026-07-14T21:31:30+09:00'
description: '2026년 프로덕션 팀이 범용 LLM 프레임워크의 추상을 걷어내고 프로바이더 SDK + 얇은 자기 코드로 이동하는 흐름의 원인·구분·반론 정리.'
summary: 'LangChain/LlamaIndex 같은 범용 프레임워크의 "체인 글루 추상"을 걷어내는 이른바 LangChain Exit는 프로바이더 SDK가 그 추상을 네이티브로 흡수했기 때문에 일어난다. 다만 이는 "프레임워크 전멸"이 아니라 무거운 범용층 → 얇은 목적특화층으로의 시장 보정이며, LangChain 자신도 v1.0에서 이를 공식 인정하고 경량화로 대응했다.'
lang: ko
tags:
  - 'ai'
  - 'llm'
  - 'agent'
  - 'langchain'
  - 'framework'
polishHash: 'bd2bfee303a4'
lintHash: 'bd2bfee303a4'
---

## TL;DR
- 2026년, 프로덕션 팀들이 LangChain·LlamaIndex 같은 범용 프레임워크의 **"체인/LCEL 글루 추상"을 걷어내고 프로바이더 SDK + 자기 코드 얇은 한 겹**으로 이동하는 흐름이 관찰된다("LangChain Exit"). 업계 요약 한 문장: *"the right replacement for LangChain is not a different framework, it is the vendor SDK plus a thin layer of your own code."*
- ==근본 원인은 프로바이더 SDK가 프레임워크의 핵심 가치를 **네이티브로 흡수**한 것이다== — OpenAI Responses API(native tool calling·structured output·built-in tools), Anthropic tool use. 프레임워크는 2022~23년 "약한 모델을 스캐폴딩으로 보강" 문제를 풀었는데, 모델이 강해지며 그 문제 자체가 사라졌다.
- 단, **"프레임워크 전멸"이 아니다.** 상태·루프·멀티에이전트 오케스트레이션 필요는 남아 LangGraph·OpenAI Agents SDK·Claude Agent SDK 같은 **얇은 목적특화층**으로 이동할 뿐이다. LangChain 자신도 **v1.0(2025-10-22)에서 "추상이 너무 무거웠다"를 공식 인정**하고 Middleware로 제어권을 돌려주며 경량화로 대응했다.
- **(경계, 2026-07-14 확인 시점)** "P50 지연 12~19% 개선", "이탈률" 같은 정량 수치는 대부분 실무자 블로그의 **일화적 관찰**이다 — 방향성(추상 흡수 → raw 회귀)은 다수 출처가 일치하나, 수치를 그대로 인용하기보다 참고로 취급해야 한다.

## 큰 그림
```
LLM 앱 스택의 재편 (2026) — "무거운 범용 프레임워크"가 세 층으로 분해됨
│
├─ ① 모델 호출 층 (invocation)              ← 프로바이더 SDK가 흡수, 프레임워크 불필요
│    ├─ OpenAI: Responses API (native tool call · structured output · built-in tools)
│    ├─ Anthropic: Messages API tool use (+ prompt caching)
│    └─ TS 기본값: Vercel AI SDK (얇은 provider-agnostic primitive)
│
├─ ② 오케스트레이션 층 (state·loop·multi-agent)  ← 필요는 남음, "얇게" 다시 채택
│    ├─ 단순 → 프로바이더 SDK + 자기 코드 얇은 한 겹 ("own the loop")
│    ├─ Agents SDK → OpenAI Agents SDK / Claude Agent SDK ("SDK가 loop 소유")
│    ├─ 상태형 그래프 → LangGraph 1.0 (구 LangChain보다 저수준·경량)
│    └─ LangChain v1.0 → create_agent + Middleware (제어권 반환)
│
└─ ③ 걷어내지는 것                          ← LangChain Exit의 실제 대상
     └─ 체인/LCEL 제네릭 래퍼 · 정규화 파싱 계층 (모델·SDK가 이미 네이티브 제공)
```

## 핵심
- =="LangChain을 걷어낸다"의 정확한 대상은 **체인/LCEL 글루 추상과 정규화 파싱 계층**이지, "오케스트레이션 필요 자체"가 아니다.== 후자(상태·루프·HITL·멀티에이전트)는 복잡한 앱에서 여전히 남고, 다만 더 얇은 도구로 옮겨간다.
- 이동 경로는 복잡도에 따라 둘로 갈린다: **(단순~중간)** 프로바이더 SDK + 얇은 자기 코드가 이제 프로덕션 다수의 기본값이자 권장. **(복잡·상태형)** 바닥 코드가 아니라 LangGraph·Agents SDK 같은 얇은 오케스트레이터.
- 프로바이더 SDK가 "loop를 소유하는" 방식이 갈린다: OpenAI **Responses API**는 "네가 loop를 소유"(low-level), 그 위 **Agents SDK**가 런타임 loop를 얹는다. Anthropic도 **Client SDK = 네가 tool loop 구현 / Agent SDK = SDK가 loop 처리**로 같은 이분법을 쓴다.
- LangChain의 v1.0(2025-10-22)은 "버전업이 아니라 리셋"으로, 3년간 누적된 "추상이 무겁다·표면적이 비대하다·loop 제어권을 안 준다"는 비판을 **공식 수용**한 결과물이다 — 즉 Exit 담론과 LangChain의 자기 교정이 같은 원인에서 나왔다.
- ==따라서 이 현상의 본질은 "프레임워크 죽음"이 아니라 **무거운 범용층 → 얇은 목적특화층으로의 시장 보정**이다.== "프레임워크냐 raw냐"의 이분법 자체가 오해를 부른다.

## 깊이
- **[OpenAI: Responses API + Agents SDK]** — Responses API는 text·image 입력, stateful 상호작용(이전 response를 입력으로), web search·file search·computer use 같은 **built-in tool**, `response.output_text` 같은 헬퍼를 네이티브 제공한다. "own the loop"가 필요할 때 쓰는 저수준 인터페이스이고, Agents SDK(구 Swarm의 프로덕션 후속)가 그 위에 higher-level 런타임을 얹는다. 즉 프레임워크가 하던 "tool 정의·파싱·loop"가 SDK 계층으로 내려왔다. (developers.openai.com, 1차)
- **[Anthropic: Client SDK vs Agent SDK]** — Claude Agent SDK는 "Claude Code를 돌리는 것과 동일한 tools·agent loop·context management를 Python·TS로 프로그래밍"하게 해준다(2025-09 Claude Code SDK에서 개명). 명시적 이분법: **Client SDK는 tool loop를 직접 구현**, **Agent SDK는 Claude가 loop를 처리**(모델이 tool 결정 → SDK 실행 → 결과를 context에 주입 → 종료조건까지 반복). file 편집·bash·web search·HITL 체크포인트·subagent·MCP가 기본 제공. (code.claude.com, 1차)
- **[LangChain v1.0의 자기 교정]** — LangChain은 공식 블로그에서 "abstractions가 때로 너무 무거웠고, package surface area가 비대해졌으며, 개발자들이 raw LLM 호출로 내려가지 않고도 agent loop를 더 통제하고 싶어했다"는 3년치 피드백을 인정했다. 해법이 **create_agent의 Middleware** — 동적 프롬프트·대화 요약·선택적 tool 접근·상태 관리·guardrail을 합성 가능한(composable) 진입점으로 제어. 원래 agent 추상이 "비자명한 use case에서 개발자를 졸업시켰다(graduate off)"는 자기 진단이 핵심. LangChain·LangGraph 모두 1.0에서 2.0까지 breaking change 없음을 약속. (langchain.com/blog, docs.langchain.com, 1차)
- **[원인 메커니즘]** — 보고된 이득은 "정규화 계층 붕괴 + 네이티브 provider tool-call 프로토콜이 LangChain의 normalized 추상을 대체"에서 나온다(P50 first-token 12~19% 개선 주장). 이 수치는 특정 팀 사례라 일반화 주의. (Ravoid, 2차)
- **[TS 진영의 대응물]** — 같은 논리가 TS에서도 성립하며, 여기선 Vercel AI SDK가 ①층 기본값, Mastra·LangGraph.js가 ②층. Vercel은 "LangChain → AI SDK 마이그레이션 플레이북"을 비용·품질 관점으로 정리한 2차 자료도 유통 중이다. (digitalapplied, 2차)

## 용어 풀이
- **LCEL(LangChain Expression Language)** — `|` 파이프로 retriever·prompt·llm·parser를 체인으로 잇는 LangChain의 조립 DSL. Exit의 주 대상 = 이 "글루 추상"이 모델·SDK 네이티브 기능과 중복되고 디버깅을 가린다는 것. / 비유: 여러 부품을 끼우는 범용 어댑터인데, 부품들이 표준 규격(native tool call)을 갖추자 어댑터가 오히려 방해가 된 상황.
- **"own the loop"** — agent의 "모델 호출 → tool 실행 → 결과 주입 → 반복" 루프를 누가 소유하느냐. 저수준 API(Responses/Client SDK)는 개발자가, 고수준 SDK(Agents SDK)는 SDK가 소유. 프레임워크 이탈은 "누가 loop를 쥐느냐"의 재배치다.
- **Middleware(LangChain v1)** — create_agent에서 프롬프트·요약·tool 접근·상태·guardrail을 가로채 제어하는 합성 가능한 훅. "제어권을 안 줘서 떠났다"는 비판에 대한 LangChain의 직접적 응답.
- **Agent SDK vs Client SDK(Anthropic 용어)** — 전자는 loop·context 관리까지 SDK가 대행(배터리 포함), 후자는 최소 API만 주고 loop는 개발자 몫. 같은 이분법이 OpenAI Responses↔Agents SDK에도 대응.
- **thin layer(얇은 한 겹)** — 프레임워크 대신 "프로바이더 SDK + 프로젝트 고유의 얇은 자기 코드". 범용성을 포기하는 대신 투명성·디버깅성·성능을 얻는 교환.

## 시각 자료
| 계층 | 무거운 프레임워크 시대(~2024) | 2026 재편 후 | 근거 등급 |
|---|---|---|---|
| 모델 호출 | LangChain LLM 래퍼·출력 파서 | 프로바이더 SDK 네이티브(Responses API·tool use) | 1차(SDK 문서) |
| tool 정의 | LangChain Tool 추상 | SDK native function calling + Zod/JSON schema | 1차 |
| 구조화 출력 | LangChain output parser | `response_format=json_schema` 등 네이티브 | 1차 |
| agent loop | LangChain AgentExecutor | "own the loop"(직접) 또는 Agents SDK/LangGraph | 1차 |
| 상태·멀티에이전트 | LangChain 제네릭 | LangGraph 1.0 / Agents SDK (얇은 특화층) | 1차 |
| 정량 이득(지연·이탈) | — | "12~19% 개선" 등 개별 사례 주장 | 2차(일화적) |

## 핵심 시사점 / 판단
- **(원인 확정, 1차 근거)** 이 흐름의 1차 동인은 "프레임워크 품질 저하"가 아니라 **프로바이더 SDK의 기능 흡수**다. OpenAI Responses API·Anthropic tool use가 tool call·structured output·loop를 네이티브 제공하는 이상, 그 위 범용 정규화층은 순가치가 음(-)이 되기 쉽다.
- **(균형)** "모두가 LangChain을 버린다"는 블로그 서사는 과장이다. LangChain은 여전히 최대 채택 생태계(~134k stars)이고, v1.0으로 "무겁다" 비판을 정면으로 흡수해 **경량·제어 가능** 방향으로 재정렬했다. 실제 현상은 "죽음"이 아니라 **경량화 경쟁**이다.
- **(설계 원칙 도출)** 실무 함의는 명확하다 — **먼저 프로바이더 SDK로 raw하게 짜서 무엇이 일어나는지 보고, 오케스트레이션 필요(상태·루프·멀티에이전트)가 실제로 증명되면 그때만 얇은 도구(LangGraph/Agents SDK)를 얹는다.** "필요 증명 전 선구축 금지"의 전형적 사례.
- **(경계·근거 품질)** 이탈률·성능 개선 수치는 실무자 블로그의 일화적 관찰이라 정량 인용은 피한다. 신뢰할 수 있는 건 방향성과 그 메커니즘(네이티브 흡수)이며, 이는 1차 SDK 문서로 뒷받침된다.

## 레퍼런스
- OpenAI — Agents SDK 가이드 — https://developers.openai.com/api/docs/guides/agents · (1차) · Responses API 기반 런타임, "own the loop" 경계.
- OpenAI — Responses API 개요 — https://developers.openai.com/api/reference/responses/overview · (1차) · native tool call·structured output·built-in tools.
- Anthropic — Claude Agent SDK 개요 — https://code.claude.com/docs/en/agent-sdk/overview · (1차) · Client SDK(직접 loop) vs Agent SDK(SDK가 loop) 이분법.
- Anthropic — Tool use with Claude — https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview · (1차) · 네이티브 tool use.
- LangChain — LangChain·LangGraph 1.0 마일스톤 — https://www.langchain.com/blog/langchain-langgraph-1dot0 · (1차, 벤더) · "추상이 무거웠다" 공식 인정, Middleware 도입, 리셋 성격.
- LangChain — What's new in v1 — https://docs.langchain.com/oss/python/releases/langchain-v1 · (1차, 벤더) · create_agent·Middleware·breaking change 정책.
- LangChain — Agent Middleware — https://blog.langchain.com/agent-middleware/ · (1차, 벤더) · Middleware 설계 근거("graduate off" 진단).
- The LangChain Exit: Rewriting to Raw SDKs in 2026 — https://ravoid.com/blog/langchain-exit-raw-sdk-migration-2026 · (2차) · 이탈 서사·정량 주장(12~19% 지연 개선, 검증 불가).
- Why LLM Frameworks Are Being Replaced by Agent SDKs (MindStudio) — https://www.mindstudio.ai/blog/llm-frameworks-replaced-by-agent-sdks · (2차) · 프레임워크→Agent SDK 대체 논지.
- Building AI Agents Without Frameworks (Towards AI) — https://medium.com/@candemir13/building-ai-agents-without-frameworks-what-langchain-wont-teach-you-035a11d9d80c · (2차) · "raw로 이해 후 프레임워크 판단" 관점.
- LangChain to Vercel AI SDK Migration Playbook 2026 (Digital Applied) — https://www.digitalapplied.com/blog/langchain-to-vercel-ai-sdk-migration-playbook-cost-quality-2026 · (2차) · TS 진영 마이그레이션 관점.
- Is LangChain Worth It in 2026? (Agentailor) — https://blog.agentailor.com/posts/is-langchain-worth-it-2026 · (2차) · 실무자 균형 시각.

## 확인 질문
- Q1(경계): "프로바이더 SDK + 얇은 자기 코드"로 시작한 팀이 복잡도가 커졌을 때, 얇은 코드가 결국 사내판 미니 프레임워크로 비대해지는 재발(reinvent) 지점은 어디인가 — 그 임계 복잡도를 무엇으로 판별하나?
- Q2(전이): LangChain v1.0 Middleware가 "제어권 반환"으로 Exit 동인을 실제로 무력화했는가, 아니면 이미 SDK로 내려간 팀을 되돌리기엔 늦었는가(스위칭 비용·신뢰 문제)?
- Q3(다중 프로바이더): 프로바이더 SDK 직접 사용은 vendor lock-in을 키운다 — 멀티 프로바이더가 요건이면 얇은 provider-agnostic 층(Vercel AI SDK·LiteLLM)이 다시 필요해지는데, 그럼 "프레임워크 이탈"과 "프로바이더 무관층 필요"는 어디서 균형점을 갖나?
