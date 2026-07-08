---
title: 'Anthropic Advisor Tool — 저비용 executor와 고지능 advisor의 2단 추론 아키텍처'
pubDate: '2026-07-08'
description: 'Anthropic Advisor Tool의 작동 원리, 모델 호환 규칙, 비용 구조, 프롬프팅 전략을 정리한 학습 리포트.'
summary: '빠른 executor 모델이 고지능 advisor 모델에게 생성 도중 전략적 조언을 구하는 Advisor Tool의 구조와 비용 절감 메커니즘, 프롬프팅 핵심을 한 장에 담았다.'
lang: ko
tags:
  - 'llm'
  - 'ai'
  - 'agentic-coding'
  - 'prompting'
  - 'api'
canonical: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool'
lintHash: 'fe6501191953'
---

## TL;DR
- Anthropic의 Advisor Tool(베타)은 저렴한 executor 모델이 고지능 advisor 모델에게 생성 중간에 전략적 조언을 요청하는 "2단 추론" 패턴으로, 장기 에이전트 작업에서 advisor 단독 사용에 가까운 품질을 executor 요금으로 대부분 생성하면서 비용을 절감한다(저자 주장).

## 큰 그림

```
┌─────────────────────────────────────────────────────────────────┐
│                    Advisor Tool 전체 구조                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /v1/messages 요청 (1회)                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Executor (저비용·빠름: Haiku/Sonnet/Opus 하위)          │   │
│  │                                                          │   │
│  │  ① 생성 진행 → "advisor 필요" 판단                       │   │
│  │       │                                                  │   │
│  │       ▼                                                  │   │
│  │  server_tool_use { name:"advisor", input:{} }            │   │
│  │       │                                                  │   │
│  │       │  ┌─────────────────────────────────────────┐     │   │
│  │       └─▶│  Advisor (고지능: Opus 4.8 등)          │     │   │
│  │          │  - 전체 transcript를 quoted context로 수신│     │   │
│  │          │  - 자체 system prompt로 별도 추론        │     │   │
│  │          │  - thinking 블록은 삭제 후 text만 반환   │     │   │
│  │          └────────────────┬────────────────────────┘     │   │
│  │       ◀──────────────────┘                               │   │
│  │  advisor_tool_result { text: "조언 내용" }                │   │
│  │       │                                                  │   │
│  │       ▼                                                  │   │
│  │  ③ 조언을 반영하여 생성 재개                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────── 모델 호환 규칙 요약 ────────────────┐            │
│  │ Executor ≤ Advisor (능력 동등 이상)              │            │
│  │ • Haiku 4.5  → Sonnet 4.6 이상 전 모델 가능      │            │
│  │ • Sonnet 4.6 → Opus 4.6 / Sonnet 4.6 (자기자신) │            │
│  │ • Sonnet 5   → Opus 4.7+ (Sonnet 4.6은 불가)    │            │
│  │ • Fable 5 / Mythos 5 → 자기자신만 가능           │            │
│  │ ※无效 조합 → 400 invalid_request_error           │            │
│  └──────────────────────────────────────────────────┘            │
│                                                                 │
│  ┌──── 플랫폼 가용성 ────┐                                      │
│  │ ✓ Claude API (beta)   │                                      │
│  │ ✓ Claude Platform/AWS │                                      │
│  │ ✗ Bedrock/Vertex/     │                                      │
│  │   Microsoft Foundry   │                                      │
│  └───────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

## 핵심
- Advisor Tool은 단일 API 요청 안에서 executor가 생성 중 특정 시점에 advisor를 호출하면, 서버가 자동으로 전체 대화 기록을 advisor에게 전달하여 별도 추론을 수행하고 그 결과 텍스트를 executor에게 다시 주입한다. 개발자는 추가 라운드트립 없이 한 번의 `/v1/messages` 호출로 이 모든 흐름을 얻는다(사실 — 문서 기준).
- 이 패턴의 경제적 논리는 "대부분의 토큰 생성은 executor의 저렴한 요금으로 수행하고, 계획·수정 같은 고품질 판단만 advisor의 높은 요금으로 수행한다"는 것이다. 문서에 따르면 advisor 출력은 전형적으로 400~700 텍스트 토큰(사고 포함 총 1,400~1,800 토큰) 수준이므로, 최종 출력 전체를 advisor가 만드는 것보다 비용이 낮다(저자 주장 — 수치 근거 제시).
- Advisor 호출 타이밍은 executor 모델이 스스로 판단하지만, Anthropic은 코딩 에이전트 작업에서 "초기 설계 단계 1회 + 완료 직전 1회 + 난관 시 추가 호출" 패턴을 권장하며 이를 유도하는 system prompt 예시를 제공한다(저자 주장).
- 비용 제어는 세 층위에서 이루어진다: ①요청 단위 `max_uses` 캡, ②호출 단위 `max_tokens` 캡(최소 1024), ③대화 단위 클라이언트 측 카운팅 후 도구 제거. 대화 단위 제거 시 `advisor_tool_result` 블록도 함께 제거해야 400 오류를 피할 수 있다(사실 — API 스펙).
- 과금은 `usage.iterations[]` 배열에서 `type: "advisor_message"` 항목이 advisor 모델 요금으로, `type: "message"` 항목이 executor 모델 요금으로 각각 청구되며, 최상위 `usage` 필드는 executor 토큰만 집계한다(사실).

## 깊이
- **[작동 흐름 — server_tool_use]** executor가 advisor 호출을 결정하면 `server_tool_use` 블록의 `input`은 항상 빈 객체이다. executor는 "언제" 호출할지만 신호하고, 서버가 전체 transcript(system prompt, 도구 정의, 이전 턴, 현재 턴의 중간 출력까지)를 advisor에게 자동으로 구성해준다. 즉 executor가 의도적으로 맥락을 선별할 수 없다(사실).
- **[결과 변형 — 암호화]** Fable 5와 Mythos 5 advisor는 `advisor_redacted_result`를 반환하는데, 이는 인간이 읽을 수 없는 `encrypted_content` blob이다. 다음 턴에 서버가 이를 복호화해 executor 프롬프트에 주입한다. 따라서 클라이언트는 이 blob을 그대로 라운드트립해야 하며, 대화 중 advisor 모델을 교체할 경우 두 가지 결과 형태를 모두 처리할 수 있도록 분기해야 한다(사실).
- **[에러 처리]** advisor 호출 실패 시 요청 전체가 실패하지 않고, executor가 `advisor_tool_result_error`를 본 뒤 조언 없이 계속 진행한다. 에러 코드로는 `max_uses_exceeded`, `too_many_requests`, `overloaded`, `prompt_too_long`, `execution_time_exceeded`, `unavailable`이 있다. 주의할 점은 advisor의 rate limit은 advisor 모델 자체의 버킷에서 차감되므로, advisor가 rate limit에 걸리면 도구 결과 내부에 에러로 나타나지만 executor 자체가 rate limit에 걸리면 HTTP 429로 전체 요청이 실패한다(사실).
- **[Nudge 전략]** Haiku executor가 advisor를 호출하지 않을 경우, 2번째 assistant 턴 이전에 짧은 리마인더 user 메시지를 추가하면 Anthropic 내부 테스트에서 과제 통과율이 약 7%p 상승했다(저자 주장 — 내부 벤치마크). 그러나 Opus executor에 nudge를 적용하면 오히려 통과율이 약간 하락했고(저자 주장), Sonnet에서는 측정 가능한 효과가 없었다(저자 주장). 또한 nudge가 과도한 호출을 유발해 간단한 작업에도 불필요한 조언을 구할 수 있어 `NUDGE_TURN` 값을 조절하거나 작업 복잡도 신호로 게이트해야 한다(저자 주장).
- **[Caching — 2중 구조]** Executor 측은 `advisor_tool_result` 블록 이후에 `cache_control` 중단점을 두면 캐시 히트가 가능하다. Advisor 측은 도구 정의에 `caching: {"type":"ephemeral", "ttl":"5m"|"1h"}`를 설정하면 advisor의 프롬프트 접두사가 매 호출마다 안정적으로 재사용되어 비용이 절감된다. 단, 3회 이상의 advisor 호출이 있어야 손익분기점을 넘으며(저자 주장), `clear_thinking` 설정에서 `keep`이 `"all"`이 아니면 advisor의 quoted transcript가 매 턴 밀려 캐시 미스를 유발한다(사실).
- **[max_tokens 캡 효과]** Anthropic 내부 하드 추론 벤치마크(n=40)에서 `max_tokens: 2048` 설정은 advisor 평균 출력을 약 7배 줄이면서 절단률은 거의 0%, 품질 저하는 감지 불가 수준이었다(저자 주장). 1024로 낮추면 약 10배 감소하나 ~10% 호출에서 절단 발생. 소프트 제어(프롬프트에 "80단어 이내" 요청)와 하드 제어(`max_tokens`)를 상황에 따라 선택 또는 병용한다(저자 주장).

## 용어 풀이
- **executor model** — 실제 사용자 작업을 수행하며 토큰을 생성하는 "작업자" 모델. / 비유: 현장 엔지니어. / 비유가 깨지는 지점: 엔지니어와 달리 executor는 스스로 advisor 호출 시점을 결정하는 자율성을 가진다.
- **advisor model** — executor의 전체 대화 기록을 보고 전략적 조언을 제공하는 "자문가" 모델. / 비유: 수석 아키텍트가 설계 검토를 하는 것. / 비유가 깨지는 지점: 실제 수석 아키텍트는 지속적으로 관여하지만 advisor는 executor가 호출할 때만 반응한다.
- **server_tool_use** — Anthropic 서버가 실행하는 도구 호출을 나타내는 블록 타입. / 비유: 레스토랑에서 웨이터가 주방에 직접 전달하는 주문. / 비유가 깨지는 지점: 고객(executor)이 주문 내용(input)을 지정하지 않고 "부탁해"라는 신호만 보낸다.
- **advisor_redacted_result** — Fable 5·Mythos 5가 반환하는 암호화된 조언 blob. / 비유: 봉인된 편지 — 받는 사람은 내용물을 볼 수 없지만 다음 턴에 서버가 열어준다. / 비유가 깨지는 지점: 실제 봉인 편지와 달리 클라이언트는 이 blob을 절대 읽을 수 없으며 오직 서버만 복호화한다.
- **pause_turn** — advisor 호출이 완료되지 않은 상태에서 응답이 중단된 것을 나타내는 stop_reason. / 비유: 전화 통화 중 "잠시만요, 다른 사람 확인 좀 받을게요" 상태. / 비유가 깨지는 지점: 실제 전화와 달리 클라이언트가 추가 user 메시지 없이 이전 assistant 메시지를 그대로 재전송하면 재개된다.
- **prompt caching (ephemeral)** — advisor의 대화 기록 프롬프트를 일정 TTL 동안 캐시해 재호출 시 입력 토큰 비용을 줄이는 기능. / 비유: 매번 전체 서류를 복사하지 않고 이전 복사본에 추가 페이지만 붙이는 것. / 비유가 깨지는 지점: `clear_thinking` 설정이 기본값이라도 이전 모델에서는 thinking 턴을 유지하지 않아 캐시가 깨질 수 있다.

## 시각 자료

```
┌──── Advisor 호출 비용 흐름 ────┐
│                                │
│  Executor (저가)               │
│  ┌────────────────────────┐    │
│  │ 토큰 생성 (대부분)      │──┐ │
│  │ (executor 요금 적용)    │  │ │
│  └────────────────────────┘  │ │
│                              ▼ │
│  Advisor (고가)                │
│  ┌────────────────────────┐    │
│  │ 400~700 text tokens     │    │
│  │ + thinking (~1,100)     │──┘ │
│  │ (advisor 요금 적용)      │    │
│  └────────────────────────┘     │
│                                 │
│  비용 절감 포인트:               │
│  전체 출력을 advisor가 하지 않고 │
│  advisor는 "계획"만,            │
│  executor가 "실행" 전체 담당     │
└─────────────────────────────────┘
```

| 제어 방식 | 수단 | 효과 | 한계 |
|---|---|---|---|
| 요청 단위 캡 | `max_uses` | N회 초과 시 에러 반환 후 계속 | 대화 전체 제어 불가 |
| 호출 단위 캡 | `max_tokens` (≥1024) | 출력 상한, advisor가 스스로 조정 | 너무 낮으면(~1024) ~10% 절단 |
| 대화 단위 캡 | 클라이언트 카운팅 | 예산 도달 시 도구+결과 블록 제거 | 구현 복잡도 증가 |
| 소프트 제어 | user msg에 "80단어 이내" | 호출 빈도↑, 개별 길이↓ → 순 비용↓ | 보장 없음, 간혹 초과 |
| Effort 조합 | Sonnet medium effort + Opus advisor | 기본 effort Sonnet과 유사 지능(저자 주장) | 작업 의존적 |

## 핵심 시사점 / 판단
- **(저자 주장)** Advisor Tool은 "대부분의 턴은 기계적이지만 좋은 계획이 결정적인" 장기 에이전트 작업(코딩 에이전트, computer use, 다단계 리서치 파이프라인)에 최적화되어 있다. 단일 턴 Q&A나 모든 턴이 고지능을 요구하는 작업에는 적합하지 않다.
- **(저자 주장)** Sonnet executor + Opus advisor 조합은 Sonnet 단독 사용 대비 품질 상승을 비슷한 또는 더 낮은 총 비용으로 달성할 수 있다.
- **(저자 주장)** Haiku executor + Opus advisor는 Haiku 단독보다 비용은 높지만 executor를 대형 모델로 교체하는 것보다 저렴하다.
- **(검증 필요·불확실)** 문서의 벤치마크 수치(내부 코딩 벤치마크 통과율 +7.5%p, 하드 추론 n=40 등)는 Anthropic 내부 테스트 결과로, 외부 독립 검증이 없으며 표본 크기가 작은 경우도 있다. 실제 워크로드에서의 효과는 별도 평가가 필요하다.
- **(사실)** Advisor Tool은 현재 베타 상태(betas 헤더 `advisor-tool-2026-03-01` 필요)이며, Claude API와 Claude Platform on AWS에서만 사용 가능하고 Bedrock·Google Cloud·Microsoft Foundry에서는 미지원이다.
- **(검증 필요·불확실)** Fable 5와 Mythos 5는 문서에 등장하지만 Anthropic 공식 모델 목록에서 널리 알려진 모델은 아니며, 이들의 정확한 성능 위치는 원문만으로는 확인하기 어렵다.

## 레퍼런스
- Advisor tool - Claude Platform Docs — https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool · (1차) · Anthropic 공식 문서로 Advisor Tool의 API 스펙, 작동 원리, 프롬프팅 가이드를 포함.
- Server tools — https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools · (1차) · advisor가 속한 server_tool_use 메커니즘과 pause_turn 동작 설명.
- Tool reference — https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference · (1차) · 도구 정의의 일반 속성(cache_control, allowed_callers 등) 참고.
- Effort — https://platform.claude.com/docs/en/build-with-claude/effort · (1차) · executor effort 설정과 advisor 조합 시 비용-품질 트레이드오프.
- Memory tool — https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool · (1차) · advisor와 함께 조합 가능한 서버 도구 중 하나.

## 확인 질문
- **Q1 (전이)**: Advisor Tool의 "2단 추론" 패턴(저비용 executor + 고지능 advisor)을 다른 LLM 공급자(OpenAI, Google)의 라우팅/모델 체이닝 전략과 비교하면 어떤 구조적 차이(예: 서버 내부 서브추론 vs. 클라이언트 오케스트레이션)가 있는가?
- **Q2 (왜·어떻게)**: Fable 5와 Mythos 5 advisor가 `advisor_redacted_result`(암호화 blob)를 반환하는 이유는 무엇인가? 모델 보호, 프롬프트 유출 방지, 아니면 다른 정책적 이유가 있는가?
- **Q3 (경계)**: 문서의 벤치마크 수치(내부 코딩 벤치마크, n=40 하드 추론 테스트)가 특정 작업 유형에 국한된 결과라면, 우리 워크로드(예: 도메인 특화 에이전트, 비코딩 작업)에서도 유사한 비용-품질 트레이드오프가 성립할 것인지 어떻게 검증할 수 있는가?

> 출처: https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool
