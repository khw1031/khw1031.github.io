---
title: 'Claude Fable 5 프롬프팅 가이드 — 자율·장기 작업 중심 패턴'
pubDate: '2026-07-05T03:11:28+09:00'
description: 'Claude Fable 5의 effort 제어, 서브에이전트, 메모리 시스템 등 장기 자율 작업 프롬프팅 패턴을 정리한 학습용 리포트.'
summary: 'Claude Fable 5가 이전 모델과 어떻게 다른지, 장기간 복잡한 작업을 안정적으로 수행하기 위한 핵심 프롬프팅 전략( effort, 지시_following, 비동기 서브에이전트, 메모리)을 한눈에 파악할 수 있습니다.'
lang: ko
tags:
  - 'llm'
  - 'prompting'
  - 'agentic-coding'
  - 'workflow'
  - 'reasoning'
canonical: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5'
lintHash: '7495c67b4a01'
polishHash: '7495c67b4a01'
---

## TL;DR
- Claude Fable 5는 시간 단위~주 단위의 복잡한 자율 작업에 특화되어 있으며, ==**effort 레벨 조정 · 간결한 지시 · 비동기 서브에이전트 · 외부 메모리 시스템**== 네 가지가 핵심 프롬프팅 축이다.

## 큰 그림

```
Claude Fable 5 프롬프팅 패턴 (전체 지도)
│
├─ 1. 능력 변화 (Capability Shift)
│   ├─ 장기 자율성(Long-horizon autonomy)
│   ├─ 첫 시도 정확도(First-shot correctness)
│   ├─ 비전(Vision) 고도화
│   └─ 코드 리뷰·디버깅 회상력↑
│
├─ 2. 프롬프트 축 (Prompting Axes) ← 능력 변화를 끌어내기 위한 제어
│   ├─ Effort 레벨 ── intelligence↔latency↔cost trade-off의 주 제어봉
│   ├─ Instruction Following ── 짧고 명확한 지시 > 열거형 지시
│   ├─ Long-run Guard ── 진행 입증(Grounding) + 경계 명시
│   └─ Reason giving ── 요청의 '이유'를 함께 전달
│
├─ 3. 구조(Scaffolding) 축 ── 프롬프트 바깥의 아키텍처
│   ├─ Parallel Subagents ── 비동기·장기 서브에이전트 선호
│   ├─ Memory System ── Markdown 파일 등으로 학습 기록 축적
│   ├─ Send-to-User Tool ── 턴 종료 없이 사용자에게 메시지 전달
│   └─ Self-verification ── 별도 컨텍스트 검증 에이전트 운용
│
└─ 4. 안전·폴백 (Safety & Fallback)
    ├─ 안전 분류기(offensive cyber, bio, reasoning extraction)
    ├─ stop_reason: "refusal" → Opus 4.8 폴백
    └─ 오탐(False Positive) 가능성 ← 선의의 보안·생명과학 작업도 차단될 수 있음
```

## 핵심

Claude Fable 5는 Anthropic의 **주장에 따르면** 이전 모델(Claude Opus 4.8)이 다루기 어렵던 '시간·일·주 단위'의 end-to-end 작업을 수행할 수 있도록 설계되었다. 이 모델을 제대로 활용하려면 프롬프트를 단순히 '더 자세하게' 쓰는 방향이 아니라, **모델이 스스로 판단할 여지를 주면서도(control via effort) 필요한 경계만 명확히 그리는(direction via brief instructions)** 방향으로 재설계해야 한다.

Effort 레벨은 이 모델에서 intelligence, latency, cost 세 가지 축을 동시에 제어하는 **주 제어봉(primary control)** 으로 동작한다. 높은 effort는 정교한 검증과 추론을 만들지만, 단순 작업에서는 과도한 맥락 수집이나 불필요한 리팩토링을 유발할 수 있어 작업 난이도에 맞는 조절이 필요하다.

지시 따르기(Instruction following) 능력이 크게 향상되어, 이전 모델처럼 금지 행위를 하나씩 나열하지 않아도 **짧은 한 문장의 지시**(예: "간결하게 작성하라")로 대부분의 스타일을 제어할 수 있다고 원문은 **주장**한다. 이는 기존 프롬프트가 과도하게 상세할 경우 오히려 품질을 저하시킬 수 있음을 의미한다.

장기 자율 실행에서는 모델이 실제 도구 호출 결과와 무관하게 '진행 중이다'라는 상태를 **날조(fabricate)** 할 위험이 있으므로, 도구 결과를 기준으로 진행을 스스로 감사(audit)하도록 지시해야 한다. 동시에 명시적 경계(하지 말아야 할 일)를 정의하지 않으면 요청하지 않은 이메일 초안이나 git 백업 같은 부작용이 발생할 수 있다.

## 깊이

- **[Effort 레벨 — trade-off 제어]** 원문은 effort를 'intelligence-latency-cost trade-off의 primary control'로 정의한다. `high`를 기본값으로, 가장 까다로운 작업에는 `xhigh`를, 반복 작업에는 `medium`/`low`를 권장한다. 주목할 점은 **낮은 effort 설정에서도 이전 모델의 `xhigh` 성능을 초과하는 경우가 많다**는 **주장**이다. → 작업이 완료되는데 시간이 과도하게 걸린다면 effort를 낮춰보는 것이 합리적 선택지다.

- **[Instruction Following — 간결함의 효과]** 원문은 "짧은 간결성 지시(brevity instruction)가 각 패턴을 열거하는 것만큼 효과적"이라고 **주장**한다. 예시로 제시된 프롬프트는 "Be concise. No narration of obvious steps." 정도로 단순하다. 이는 모델의 지시 이해력이 향상되어 **메타 지시(스타일에 대한 지시) 하나로 여러 구체적 행동을 통제**할 수 있음을 시사한다.

- **[프롬프팅 — 진행 입증(Ground progress claims)]** 장기 자율 실행에서 Anthropic의 테스트 결과, "실제 도구 결과를 기준으로 진행 상황을 감사하라"는 지시가 ==**진행 상태 보고 날조를 거의 제거했다**==고 원문은 **주장**한다. 이는 LLM의 환각(hallucination)이 장기 작업에서 특히 위험할 수 있으며, 외부 도구 결과를 '앵커'로 활용하는 것이 효과적인 방어책임을 보여준다.

- **[서브에이전트 — 비동기·장기 운용]** Claude Fable 5는 이전 모델보다 병렬 서브에이전트를 더 적극적으로 생성하며, **비동기 통신**을 선호한다고 원문은 설명한다. 또한 **장기 서브에이전트(long-lived subagents)** 는 하위 작업 간 컨텍스트를 유지하여 cache read를 통해 시간과 비용을 절감하고, 가장 느린 서브에이전트에 의한 병목을 피할 수 있다고 **주장**한다. → 오케스트레이터는 각 서브에이전트의 반환을 blocking하며 기다리기보다 비동기로 통신하는 구조가 권장된다.

- **[메모리 시스템 — 외부 기록]** 모델은 자체적으로 과거 세션을 기억하지 못하므로, Markdown 파일 등 **외부 메모리 저장소**를 제공하고 여기에 쓰도록 지시해야 한다고 원문은 권장한다. 기존 세션 기록을 바탕으로 메모리 시스템을 부트스트랩하는 것도 가능하다. → 이는 모델의 컨텍스트 윈도우 한계를 **구조적으로 보완**하는 패턴이다.

- **[안전 분류기 — 오탐 가능성]** Claude Fable 5는 offensive cybersecurity, 생명과학, reasoning 추출을 겨냥한 안전 분류기를 실행한다. 원문은 **"선의의 사이버보안 작업과 유익한 생명과학 작업도 이 안전장치를 트리거할 수 있다"** 고 명시적으로 경고한다. → 단순히 '위험한 요청만 차단'되는 것이 아니라 **False Positive가 발생**할 수 있어, 서버/클라이언트 측 폴백(Claude Opus 4.8) 설정이 실질적으로 필요하다.

- **[희귀 현상 — 조기 종료]** 장기 세션 깊은 곳에서 모델이 도구 호출 없이 텍스트로만 의도를表明("I'll now run X")하거나, 이미 충분한 정보가 있음에도 권한을 요청하며 멈출 수 있다고 원문은 기술한다. "continue" 지시로 해결 가능하며, 체크포인트 지시와 결합하여 언제 멈춤이 적절한지 정의하는 것이 권장된다.

## 용어 풀이

- **Effort** — 모델이 문제에 투입하는 '사고의 깊이'를 제어하는 파라미터 / 낮은 effort는 빠른 직답, 높은 effort는 심층 검증. / 비유가 깨지는 지점: effort는 단순한 '속도 조절'이 아니라 모델이 생성하는 토큰 수와 추론 경로 자체를 바꾸므로, cost와 latency가 비선형적으로 변할 수 있다.

- **Subagent** — 오케스트레이터 에이전트가 위임한 하위 작업을 수행하는 독립 실행 단위 / 원문은 '비동기 통신'과 '장기 생존(long-lived)'을 강조. / 비유가 깨지는 지점: 일반 함수 호출과 달리 서브에이전트는 자체 컨텍스트를 가지며, cache read를 통해 상태를 유지할 수 있어 단순한 '병렬 처리'보다 복잡한 패턴이다.

- **Adaptive thinking** — Claude Fable 5에 도입된 사고 모드 / 원문에 따르면 extended thinking budget을 사용하지 않고, thinking 출력이 요약 형태로만 제공된다. / 비유가 깨지는 지점: '생각'이라는 용어가 붙었지만 실제로는 API 파라미터로 제어되는 내부 추론 단계이며, 사용자가 직접 내용을 보려면 structured thinking blocks을 읽어야 한다.

- **Send-to-user tool** — 에이전트가 턴을 종료하지 않고 사용자에게 정확히 그대로 전달할 메시지를 생성하는 도구 / 진행 상황 숫자, 생성된 코드 스니펫, 사용자 질문에 대한 직접 답변 등에 사용. / 비유가 깨지는 지점: 이 도구는 '로깅'이 아니라 **UI 렌더링을 위한 정확한 메시지 전달**이 목적이므로, 내부 reasoning이나 narration에 사용하면 본래 목적을 훼손한다.

## 시각 자료

### Effort 레벨 선택 매트릭스 (원문 기반 재구성)

```
작업 난이도 ↓ / Effort →   low    medium   high    xhigh
────────────────────────────────────────────────────────
단순·반복 작업              ✓      ✓       △       ×
일반 개발·분석              ×      △       ✓       △
복잡한 시스템 설계            ×      ×       ✓       ✓
가장 까다로운 워크로드       ×      ×       △       ✓

✓ = 권장  △ = 가능  × = 비권장
(원문의 지침을 표로 재구성, 구체적 수치는 원문에 없음)
```

### 안전 분류기 흐름 (False Positive 포함)

```
사용자 요청
    │
    ▼
[안전 분류기 검사]
    │
    ├─ offensive cybersecurity 기술
    ├─ 생물학·생명과학 내용
    └─ 모델 사고(reasoning) 추출 시도
    │
    ▼
차단(trigger) ─────────────────────┐
    │                              │
    ▼                              ▼
stop_reason: "refusal"    ⚠ 오탐(False Positive) 가능
    │                     "선의의 보안·생명과학 작업도 차단될 수 있음"
    ▼                              │
Claude Opus 4.8 폴백 ◄─────────────┘
(서버/클라이언트 측 설정 필요)
```

## 핵심 시사점 / 판단

- **(저자 주장)** Claude Fable 5는 '어려운 문제'에 투입할 때 가장 큰 가치를 발휘하며, 단순 작업으로만 테스트하면 능력을 과소평가하게 된다.
- **(저자 주장)** 기존 모델용으로 작성된 과도하게 상세한 프롬프트·스킬은 Fable 5에서 오히려 품질을 저하시킬 수 있으므로 리팩토링이 필요하다.
- **(저자 주장)** 모델에게 내부 reasoning을 응답 텍스트로 재현하도록 지시하면 `reasoning_extraction` refusal이 트리거될 수 있어, 기존 프롬프트 감사(audit)가 필요하다.
- **(검증 필요·불확실)** "낮은 effort가 이전 모델 xhigh를 초과한다"는 주장은 Anthropic 내부 테스트 기반이며, 독립적 벤치마크로 확인되지 않음.
- **(검증 필요·불확실)** "진행 입증 지시가 날조를 거의 제거했다"는 주장도 Anthropic 테스트 결과로, 외부 재현 데이터는 원문에 제시되지 않음.
- **(원문에 없음)** Claude Mythos 5에 대한 구체적 프롬프팅 패턴은 이 문서에서 별도로 다루지 않음(제목에만 포함).

## 레퍼런스

- Introducing Claude Fable 5 and Claude Mythos 5 — https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5 · (1차) · 모델 능력·API 변경·가격·가용성에 대한 공식 소개 문서.
- Prompting best practices — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices · (1차) · 모든 Claude 모델에 공통 적용되는 프롬프팅 기법 모음.
- Refusals and fallback — https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback · (1차) · refusal 발생 시 Opus 4.8로의 서버/클라이언트 측 폴백 설정 방법.
- Effort — https://platform.claude.com/docs/en/build-with-claude/effort · (1차) · effort 파라미터의 개념과 사용법 공식 문서.
- Adaptive thinking — https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking · (1차) · 요약형 thinking 출력과 structured thinking blocks 읽기 방법.

## 확인 질문

- **Q1(전이)**: Claude Fable 5용으로 작성한 '간결한 지시' 패턴은 다른 LLM(예: GPT 계열, Gemini)에서도 동일하게 효과적일까, 아니면 모델별 지시 따라가기 능력 차이에 따라 재조정해야 할까?
- **Q2(왜·어떻게)**: 장기 실행에서 모델이 진행 상황을 날조하는 현상은 왜 발생하는가 — 컨텍스트 윈도우 압박, attention 분산, 아니면 학습 데이터 편향 중 어떤 메커니즘이 주요 원인인가?
- **Q3(경계)**: 안전 분류기의 오탐(False Positive)이 실제 프로덕션에서 어느 빈도로 발생하는지, 그리고 '선의의 보안 작업'이 반복 차단될 때 개발자 경험(DX) 저하를 어떻게 측정하고 완화할 수 있는가?

> 출처: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5
