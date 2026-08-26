---
title: '[READ] Goal Contract 기반 자율 Agent 지시 구조 조사 — 이해와 실무 적용 독서 기록'
pubDate: '2026-08-13T00:40:20+09:00'
noteId: AGENT-2608-022
description: 'Goal Contract 기반 자율 Agent 지시 구조 조사를 장별로 이해하고 실제 지시서와 실행 환경 설계에 적용하는 독서 기록'
summary: '자율 Agent 지시서는 실행 순서가 아니라 Human과 Agent가 합의한 Goal Contract이며, Agent는 방법을 선택하되 완료는 Eval이 판정한다.'
lang: ko
tags: ['reading', 'agent', 'goal-contract', 'eval']
---

**최상위:** 자율 Agent 지시서는 실행 순서를 적는 문서가 아니라, Human과 Agent가 함께 확정한 `Goal Contract`이며, Agent는 방법을 자율적으로 선택하되 완료는 `Eval`이 판정해야 한다.

## 전체 피라미드

- **핵심:** 자율 Agent 지시서는 실행 순서를 적는 문서가 아니라, Human과 Agent가 함께 확정한 `Goal Contract`이며, Agent는 방법을 자율적으로 선택하되 완료는 `Eval`이 판정해야 한다.
  - **근거:** 무엇을 고정할 것인가 — 1~3장은 `Goal Contract`, `Runtime Policy`, `Runtime State`를 분리하고, Human의 초기 문제·의도·제약을 `Goal Definition`을 거쳐 실행 가능한 계약으로 바꾼다.
  - **근거:** 어떻게 자율 실행할 것인가 — 4~5장에서 `Graph`는 상태 전이를 통제하고 `Loop`는 계획·실행·관찰·평가를 반복한다. 위임과 Context 관리는 과업별 지시가 아니라 재사용할 `Runtime Policy`에 둔다.
  - **근거:** 무엇으로 완료를 증명할 것인가 — 6장은 `Success Evidence`와 `Eval Criteria·Method·Tool·Evaluator·Verdict`를 구분한다. Agent의 완료 선언은 증거가 아니다.
  - **근거:** 어디까지 안전하게 맡길 것인가 — 7장은 코드의 `Architecture Invariant`와 실행 환경의 격리를 분리한다. 실행은 SSH Container 안에 두고, Git·API Secret과 OAuth·Memory Volume의 수명도 나눈다.
  - **근거:** 어떻게 실제 문서로 쓸 것인가 — 8~10장은 `Directive`를 한 줄짜리 실행 원칙으로 줄이고, 실제 과업을 Human Input과 Goal Contract 골격으로 작성한 뒤 적용 한계와 아직 실증되지 않은 부분을 확인한다.

실무에서 기억할 가장 작은 흐름은 다음과 같다.

```text
Human Input → Goal Definition → Goal Contract → Graph·Loop → Eval Verdict
```

실행 중에는 다음 세 대상을 섞지 않는다.

```text
고정할 것: Goal Contract
재사용할 것: Runtime Policy
계속 바뀌며 기록할 것: Runtime State
```

## 목차와 진행

- [ ] 1. 핵심 모델 — 세 층 ← 다음
- [ ] 2. Goal Definition — Human Input에서 공동 계약까지
- [ ] 3. Goal Contract — Graph가 받아야 할 Initial Input
- [ ] 4. Graph와 Loop — 수단은 Agent가 정하고 종료는 Eval이 정한다
- [ ] 5. Runtime Policy — Workflow·위임·Context 관리
- [ ] 6. Eval — Success Evidence와 판정 수단 분리
- [ ] 7. 코드 경계와 실행 격리
- [ ] 8. Directive의 재배치
- [ ] 9. 실제로 쓰는 Markdown 골격
- [ ] 10. 한계와 미해결 지점

## 장별 기록

(장별 정독 기록은 아직 채워지지 않음. 아래는 이 조사를 실무에 바로 적용하기 위해 확정한 재사용 Contract 템플릿이다.)

## 실무 Contract 템플릿 (확정본)

§9의 골격은 필드 라벨만 있는 Checklist였다. 여기서는 특정 과업을 채우지 않고, **각 항목에 무엇을 쓰고 무엇을 쓰지 않는지**와 **기입 규칙**을 재사용 가능한 형태로 고정한다.

### 사용 규칙 (전체 공통)

1. **한 문서, 두 부분** — 위쪽 `Human Input` 5개 항목은 Goal Definition의 입력이고, Human 승인 뒤 `Goal Contract` 부분만 Graph의 Initial Input으로 넣는다.
2. **완전성 Checklist이지 분량 지시가 아니다** — 간단한 과업은 각 항목을 한 줄로 끝낸다. 억지로 채우지 말고, 해당 없는 항목은 빈칸 대신 `해당 없음`을 명시한다.
3. **깊이만 다르게** — 입력이 충분하면 Fast Path(짧은 Contract 제안 → 즉시 승인), 문제나 성공 기준이 불명확하면 Deep Path(근거 조사·대화 후 확정)를 쓴다. 문서 형식은 같고 채우는 깊이만 다르다.
4. **계약은 실행 중 고정** — Agent는 방법을 바꿔도 되지만 Goal Contract는 임의로 바꾸지 못한다. 문제나 성공 기준을 바꿔야 하면 실행을 멈추고 Goal Definition으로 돌아간다.
5. **재사용 규칙은 참조로** — Graph·Loop·위임·Context·권한 같은 Runtime Policy는 이 문서에 복사하지 않고 이름·버전으로 참조한다.

### Part A — Human Input (Goal Definition 입력)

```markdown
# Human Input

## Initial Problem Definition
- 현재 문제:
- 문제라는 근거:
- 영향을 받는 대상:

## Goal Intent
- 원하는 변화:

## Initial Constraints
- 반드시 지킬 것:
- 하지 말아야 할 것:

## Evidence and Context
- 자료:
- 확인되지 않은 가정:

## Priorities and Risk
- 우선순위:
- 감수할 수 없는 위험:
```

| 항목 | 무엇을 쓰나 | 흔한 실수 |
| --- | --- | --- |
| Initial Problem Definition | 지금 무엇이 왜 문제인지 + 그 근거 | 해결책을 문제로 적음 ("X 라이브러리를 넣어야 한다") |
| Goal Intent | 원하는 변화의 방향 (아직 최종 Goal이 아님) | 확정 Goal처럼 못 박아 Agent의 검증 여지를 없앰 |
| Initial Constraints | 처음부터 지켜야 할 경계 | 단순 선호를 제약으로 올림 |
| Evidence and Context | 판단 근거 자료 + 확인 안 된 가정 | 가정을 사실처럼 섞음 |
| Priorities and Risk | 우선할 것 / 피할 것 — Agent가 대신 못 정하는 가치 판단 | 비워 둬서 Agent가 임의로 trade-off |

`Goal Intent`는 Agent가 근거를 확인하고 모호함·충돌·숨은 가정을 드러내야 하는 대상이다. 반대로 `Priorities and Risk`의 가치 판단은 Agent가 대신 정하지 않는다.

### Part B — Goal Contract (Graph Initial Input)

```markdown
# Goal Contract

## Problem Definition
- 합의한 문제:

## Goal
- 만들어야 할 최종 상태:

## Scope and Constraints
- 포함:
- 제외:
- 제약:

## Inputs, Evidence, and Resources
- 신뢰할 수 있는 자료·시작 상태:
- 쓸 수 있는 저장소·도구·환경:
- 확인되지 않은 가정(검증 대상, 사실로 취급 금지):

## Priorities and Trade-offs
- 충돌 시 우선순위:

## Success Evidence
- 성공하면 남아야 하는 증거:

## Evaluation Contract
- Criteria:
- Method:
- Tool:
- Evaluator:
- Order:

## Authority and Escalation
- Agent가 자율적으로 할 수 있는 일:
- 금지하거나 별도 승인이 필요한 일:
- 멈추고 보고할 조건:

## Required Invariants
- 반드시 지킬 코드·구조 조건:

## Environment and Isolation
- 접속 방식과 Host Loopback Port:
- Workspace Clone·Volume:
- 개인 설정·Memory·OAuth State Volume:
- Git Credential Secret과 권한 범위:
- AI 인증 방식: 구독 OAuth / API Key Secret
- Container에 허용할 Network:
- Container Git 사용자명 표기:
- Container가 담당할 Git 작업:
- Container 종료 뒤 보존할 State:

## Runtime Policy Reference
- 정책 이름과 버전:

## Approval
- Human 승인:
- 승인 시각:
```

가장 자주 어긋나는 항목의 확정 지침(나머지 항목의 정의는 §3 참조):

| 항목 | 반드시 지킬 형식 | 좋은 예 | 나쁜 예 |
| --- | --- | --- | --- |
| Goal | 검증 가능한 **최종 상태** 한 문장, 수단 금지 | "모든 회귀 Test가 통과한 상태에서 완료가 Eval Event로 기록된다" | "Eval Gate를 구현한다" (수단·과정) |
| Success Evidence | 관찰 가능한 산출물·상태만 | "green CI Log, 변경된 파일 목록, 재현 명령" | "코드가 깔끔해짐" (관찰 불가) |
| Criteria | 통과·불통과를 가르는 임계값 포함 | "회귀 Test 100% pass, p95 200ms 이하" | "성능이 좋아짐" |
| Method | 어떤 절차로 확인하는지 | "고정 Dataset 3회 실행, 최댓값 비교" | "확인한다" |
| Evaluator | 누가 판정하는지 (생성 Agent 자기 선언 금지) | "결정론적 Test Runner + 별도 Context Grader" | "Agent가 스스로 판단" |
| Order | 검사 순서 — 싼 결정론 → 측정 → Grader → Human | "① Test ② Benchmark ③ Grader ④ Human Review" | 순서 없음 |
| 멈추고 보고할 조건 | 의도된 중단 조건을 구체적으로 | "계약 충돌, Eval 불가, 예산 소진, 되돌릴 수 없는 행동" | "문제 생기면 멈춤" |
| Inputs, Evidence, Resources | 사실·자원과 미확인 가정을 분리 | "가정: 현재 회귀 Test 커버리지를 신뢰할 수 있다 — 검증 대상" | 가정을 사실처럼 나열 |
| Priorities and Trade-offs | 충돌 시 tie-breaker를 실행 규칙으로 | "정확성 > 속도 > 비용" | "상황 봐서 판단" |

`Inputs, Evidence, and Resources`는 Agent가 실행 중 근거로 삼을 사실·자원과, 사실로 취급하면 안 되는 미확인 가정을 함께 넘긴다. `확인되지 않은 가정`은 근거이면서 동시에 검증 대상이라는 점에서 특수하다 — 이 줄이 없으면 Agent가 확정 사실과 가정을 구분하지 못한 채 진행한다.

`Priorities and Trade-offs`는 Input의 `Priorities and Risk`와 같은 재료를 다루지만 단계가 다르다. Input은 각자의 주관적 입력이고, 여기서는 합의된 단일 tie-breaker다. 감수할 수 없는 위험 자체는 `Authority and Escalation`의 금지·멈춤 조건에 두고, 이 항목에는 목표·제약이 충돌할 때의 우선순위 규칙만 남긴다.

`Environment and Isolation`은 코딩 Agent를 Docker + SSH로 격리 실행할 때만 채운다(§7). 그 밖의 과업에서는 `해당 없음`이라 쓰거나 필요한 두세 줄만 남긴다.

### Fast Path 최소본

과업이 간단하고 명확하면 다음 축약본으로 충분하다. 승인 후 이 블록만 Initial Input으로 쓴다.

```markdown
# Goal Contract (Fast)

- Goal: (검증 가능한 최종 상태 한 문장)
- Scope: 포함 / 제외
- Success Evidence: (관찰 가능한 산출물)
- Eval: Criteria · Tool · Evaluator (순서가 중요하면 Order 추가)
- Stop: (멈추고 보고할 조건)
- Policy: (Runtime Policy 이름·버전)
- Approval: (Human 승인 · 시각)
```

Fast Path에서 생략한 항목은 "불필요"가 아니라 "이 과업에서는 위험·성공에 영향이 없다"는 판단의 결과다. 판단이 서지 않으면 Deep Path 전체 골격으로 되돌아간다.

---

<div class="refs">

## 레퍼런스

- [Goal Contract 기반 자율 Agent 지시 구조 조사](/inbox/2026-08-12-goal-contract-기반-자율-agent-지시-구조-조사/) · 목차: 문서가 제공한 1~9장 Heading을 사용하고 `한계와 미해결 지점`을 10번째 진행 항목으로 배열함. TL;DR과 조사 질문은 전체 피라미드에 통합했으며 관련 저장소 문서와 참고문헌 목록은 장별 진행에서 제외함.

</div>
