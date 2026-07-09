---
title: 'pi-subagents: Pi 에이전트 비동기 서브에이전트 위임 확장'
pubDate: '2026-07-05'
description: 'Pi 코딩 에이전트에 서브에이전트 위임, 병렬·체인 실행, 세션 공유 기능을 추가하는 확장 구조 해설'
summary: 'pi-subagents는 Pi 에이전트가 작업을 전문 자식 세션에 위임할 수 있게 하는 확장으로, 단일·병렬·체인·백그라운드 실행 모드와 Acceptance Gate, supervisor 통신, worktree 격리 등을 제공한다. 설치 후 자연어로 위임하는 것만으로 바로 사용할 수 있으며, 체인 파일과 프롬프트 템플릿으로 반복 워크플로를 저장·재실행할 수 있다.'
lang: ko
tags:
  - 'agentic-coding'
  - 'workflow'
  - 'developer-productivity'
  - 'open-source'
canonical: 'https://github.com/nicobailon/pi-subagents'
lintHash: 'c9d0be585f09'
polishHash: 'c9d0be585f09'
---

## TL;DR
- ==pi-subagents는 Pi 코딩 에이전트가 전문화된 자식 세션(서브에이전트)에게 작업을 위임·병렬화·체인화할 수 있게 하는 확장이다.==

## 큰 그림

```
                        ┌─────────────────────────────────────────┐
                        │            Pi Parent Session            │
                        │  (사용자 대화 + 오케스트레이션)          │
                        └──────────────┬──────────────────────────┘
                                       │ subagent tool / slash cmd
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              ┌──────────┐     ┌──────────┐       ┌──────────┐
              │  Single   │     │ Parallel │       │  Chain   │
              │   Run     │     │   Run    │       │   Run    │
              └─────┬─────┘     └────┬─────┘       └────┬─────┘
                    │          ┌─────┴─────┐       ┌────┴────┐
                    ▼          ▼           ▼       ▼         ▼
               [Child Pi]  [Child A]  [Child B] [Step1]→[Step2]→...
                    │          │           │         │        │
                    └──────────┴───────────┴─────────┴────────┘
                                       │
                          ┌────────────┴────────────┐
                          ▼                         ▼
                  ┌──────────────┐         ┌───────────────┐
                  │  Foreground  │         │  Background   │
                  │  (스트리밍)  │         │  (비동기+wait)│
                  └──────────────┘         └───────────────┘
                          │                         │
                          └────────┬────────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │   Artifacts / Observability   │
                    │  status.json · events.jsonl   │
                    │  output-<n>.log · results     │
                    └──────────────────────────────┘

  ┌─ 내장 에이전트 ─────────────────────────────────────────┐
  │ scout → researcher → planner → worker → reviewer        │
  │ context-builder    oracle      delegate                  │
  └──────────────────────────────────────────────────────────┘

  ┌─ 교차 관심사 ───────────────────────────────────────────┐
  │ Model 관리 │ Acceptance Gate │ Worktree │ Supervisor     │
  │ Skills     │ Chain Files     │ Profiles │ Permission Sys │
  └──────────────────────────────────────────────────────────┘
```

## 핵심

pi-subagents는 Pi 에이전트(부모 세션)가 **전문 자식 Pi 세션**을 생성하여 작업을 위임하는 확장이다. 사용자는 별도의 설정 없이 자연어("Use reviewer to review this diff")만으로 위임을 시작할 수 있고, Pi가 내부적으로 `subagent` tool 호출 여부를 판단한다(**저자 주장**: 설정 없이 바로 사용 가능).

실행 모드는 크게 **Single**(단일 에이전트), **Parallel**(동시 다수), **Chain**(순차+병렬 조합) 세 가지이며, 각각 foreground(실시간 스트리밍) 또는 background(비동기, `--bg`)로 실행할 수 있다. Background 실행 시 `wait` tool로 완료를 기다리며, 완료 시 알림과 아티팩트가 생성된다.

내장 에이전트는 역할별로 분리되어 있다: 코드 정찰(`scout`), 외부 조사(`researcher`), 계획 수립(`planner`), 구현(`worker`), 리뷰(`reviewer`), 맥락 구축(`context-builder`), 방향 검토(`oracle`), 일반 위임(`delegate`). 각 에이전트는 독립된 시스템 프롬프트와 도구 허용 목록을 가지며, ==기본적으로 부모의 전체 프롬프트를 상속하지 않는다==(**의도적으로 좁게 설계**).

자식 에이전트는 기본적으로 `subagent` tool을 받지 못해 **재귀적 위임이 차단**되며, 명시적으로 `tools: subagent`를 선언한 에이전트만 `maxSubagentDepth` 제한 내에서 팬아웃(fan-out)할 수 있다. 이 child-safety 경계는 fork된 자식 컨텍스트에서도 부모 전용 아티팩트를 필터링하여 강제된다.

## 깊이

### [실행 모드] Single / Parallel / Chain의 차이와 연결

- **Single**: 하나의 에이전트에 하나의 작업. `/run scout "scan code"` 또는 `subagent({ agent: "scout", task: "..." })`.
- **Parallel**: 여러 에이전트를 동시에. `/parallel scanner "security" -> reviewer "style"`. `concurrency`로 동시 실행 수 제한(기본 4, 전역 기본 20).
- **Chain**: 순차 실행 + 인라인 병렬 그룹. `/chain scout "scan" -> (reviewer "A" | reviewer "B") -> writer "fix"`. `{previous}` 변수로 이전 단계 출력을 자동 전달.
- **Dynamic Fanout**(`.chain.json` 전용): 이전 단계의 **구조화된 출력**(JSON 배열)을 기반으로 동적으로 병렬 자식을 생성. `expand`→`parallel`→`collect` 패턴. 산문(prose) 출력은 절대 파싱하지 않음.

### [Model 관리] Fuzzy Matching과 우선순위 체인

모델 ID는 퍼지 매칭으로 해석된다: `anthropic/claude-sonnet-4`, `anthropic:claude-sonnet-4`, `anthropic.claude-sonnet-4` 모두 동일 모델로 해석. 대소문자·날짜 접미사 차이도 흡수. 단, **provider가 명시된 쿼리는 절대 다른 provider로 조용히 전환되지 않음**.

우선순위(높은→낮은):
```
Per-run override (tool call model=...) 
  > agentOverrides.<name>.model (settings)
    > Agent frontmatter model
      > subagents.defaultModel
        > Parent session default model
```

`fallbackModels`는 provider/model 실패(쿼터, 인증, 타임아웃) 시에만 발동하며, 일반적인 작업 실패에는 발동하지 않는다.

`modelScope`로 예산/컴플라이언스 범위 강제 가능: `allow` glob 패턴에 맞지 않는 모델은 거부(명시적 전달 시) 또는 경고(상속 시).

### [Acceptance Gate] 실행 결과 검증의 6단계

모든 실행은 유효 acceptance policy를 해석한다. 단계는 **낮은→높은** 순:

```
auto → none → attested → checked → verified → reviewed
```

| 단계 | Provenance | 설명 |
|------|-----------|------|
| `auto` | (추론) | 기본값. 읽기 전용 작업은 attested, 쓰기 작업은 checked, 비동기/위험 작업은 reviewed로 자동 추론 |
| `none` | (비활성화) | `{ level: "none", reason: "..." }`으로 명시적 비활성화 |
| `attested` | 자식 보고 | 자식이 구조화된 `acceptance-report` JSON 블록을 반환 |
| `checked` | 구조적 검사 | 런타임 구조 검사 통과(필수 evidence 존재, staged 파일 없음 등) |
| `verified` | 자동 테스트 | 설정된 런타임 검증 명령(예: `npm test`) 통과. **자식이 보고한 명령 성공은 인정되지 않음** |
| `reviewed` | 독립 리뷰어 | 독립 리뷰어 에이전트의 결과 존재. **최상위 단계** |

`rejected`는 어느 단계에서든 실패 시 할당된다.

### [Supervisor 통신] contact_supervisor의 세 가지 reason

자식 에이전트는 `contact_supervisor` tool로 부모 세션과 통신할 수 있다(**원문에 명시된** 세 가지 reason):

| reason | 용도 |
|--------|------|
| `need_decision` | 차단 결정 또는 명확화가 필요할 때 |
| `interview_request` | 구조화된 입력이 필요할 때 |
| `progress_update` | 계획을 변경하는 발견이 있었을 때 짧은 비차단 업데이트 |

부모는 `subagent_supervisor({ action: "reply" })`로 응답하거나 `subagent_supervisor({ action: "pending" })`으로 대기 요청을 확인한다. 메시지는 **자식을 생성한 정확한 Pi 세션 ID**로 범위가 제한된다.

### [Worktree 격리] 병렬 쓰기 충돌 방지

`worktree: true`는 각 병렬 자식에게 `HEAD`에서 분기된 **독립 git worktree**를 할당한다. 조건: git 리포 내부, clean working tree, `node_modules/`는 심볼릭 링크. 완료 후 per-agent diff 통계와 patch 파일이 생성되며, worktree와 임시 브랜치는 `finally` 블록에서 정리된다.

### [Chain Files] 저장된 워크플로

- **`.chain.md`**: 단순 순차 체인. `## agent-name` 섹션별로 단계를 정의.
- **`.chain.json`**: 동적 팬아웃 지원. `expand`/`collect`로 구조화된 출력 기반 병렬 확장.

우선순위: Project > User > Package.同名 충돌 시 `.chain.json` > `.chain.md`.

변수: `{task}`(원본 작업), `{previous}`(이전 단계 출력), `{outputs.name}`(`as`로 명명된 단계 결과), `{chain_dir}`(아티팩트 디렉토리).

### [Observability] 라이프사이클 아티팩트

비동기 실행은 머신 판독 가능한 아티팩트를 생성한다:
```
async-subagent-runs/<id>/
├── status.json        # 위젯 + status 출력
├── events.jsonl       # 라이프사이클 전환 이벤트
├── output-<n>.log     # 사람이 읽을 수 있는 라이브 로그
└── subagent-log-<id>.md
```

`events.jsonl`은 `subagent.run.started`, `subagent.step.completed`/`failed`/`paused` 등의 이벤트를 기록. 소비자는 터미널 출력을 스크래핑하지 말고 이 JSON 파일을 읽어야 한다.

## 용어 풀이

- **Subagent** — 쉬운 말: 부모 에이전트가 일을 맡기는 자식 에이전트 세션. 비유: 팀장이 팀원에게 작업을 배정하듯. 비유가 깨지는 지점: 자식은 독립 프로세스로 실행되며 부모의 전체 맥락을 자동 상속하지 않는다(의도적 격리).

- **Fork vs Fresh context** — 쉬운 말: `fork`는 부모 세션의 현재 상태를 복제하여 시작, `fresh`는 백지 상태에서 시작. 비유: `fork`는 회의록을 복사해서 새 회의에 가져가는 것, `fresh`는 빈 노트로 새 회의 시작. 비유가 깨지는 지점: fork 시 Anthropic의 서명된 `thinking`/`redacted_thinking` 블록은 서명 무효화를 방지하기 위해 제거된다.

- **Acceptance Gate** — 쉬운 말: 자식 에이전트의 작업 결과를 검증하는 품질 관문. 비유: 건물 검수 — 자기 보고(attested)부터 독립 검사관 검토(reviewed)까지 단계적. 비유가 깨지는 지점: `verified` 단계에서 자식이 스스로 보고한 테스트 성공은 인정되지 않으며, 반드시 런타임이 직접 명령을 실행해 확인한다.

- **Worktree** — 쉬운 말: git의 독립 작업 사본. 비유: 같은 건물의 다른 층에서 각자 리모델링하여 충돌 방지. 비유가 깨지는 지점: `node_modules/`는 복사가 아닌 심볼릭 링크로 공유되며, clean working tree가 아니면 실패한다.

- **Dynamic Fanout** — 쉬운 말: 이전 단계의 구조화된 결과(JSON 배열)를 기반으로 자동으로 병렬 자식을 생성. 비유: 검사 목록의 각 항목마다 검사원을 자동으로 배정. 비유가 깨지는 지점: 산문 출력은 절대 파싱되지 않으며, `maxItems` 초과 시 실패한다.

- **Intercom / contact_supervisor** — 쉬운 말: 자식이 부모에게 질문하거나 진행 상황을 알리는 통신 채널. 비유: 무전기. 비유가 깨지는 지점: 메시지는 생성된 정확한 세션 ID로 범위가 제한되어, 같은 리포의 다른 Pi 세션은 수신하지 못한다.

## 시각 자료

### 내장 에이전트 역할 매핑

| 에이전트 | 역할 | 편집 여부 | 언제 사용하는가 |
|----------|------|-----------|----------------|
| `scout` | 코드 정찰 | 읽기 전용 | 코드 이해 전, 파일·진입점·데이터 흐름 파악 |
| `researcher` | 외부 조사 | 읽기 전용 | 공식 문서·스펙·벤치마크 조사 (pi-web-access 필요) |
| `planner` | 계획 수립 | 읽기 전용 | 큰 변경 전 구현 계획 작성 |
| `worker` | 구현 | 쓰기 | 승인된 계획 실행, 파일 편집 |
| `reviewer` | 코드 리뷰 | 쓰기(소폭 수정) | 구현 후 작업/계획 대비 검토 |
| `context-builder` | 맥락 구축 | 쓰기 | 계획 전 강한 설정 패스 (`context.md`, `meta-prompt.md`) |
| `oracle` | 방향 검토 | 읽기 전용 | 가정 도전, 드리프트 포착, 안전 추천 |
| `delegate` | 일반 위임 | 부모와 유사 | 부모 세션에 가까운 행동이 필요할 때 |

### Slash Command 요약

| 명령 | 용도 |
|------|------|
| `/run <agent> [task]` | 단일 에이전트 실행 |
| `/chain a -> b -> c` | 순차 체인 |
| `/parallel a -> b` | 병렬 실행 |
| `/run-chain <name> -- <task>` | 저장된 체인 실행 |
| `/subagents-doctor` | 설정 진단 |
| `/subagents-models [agent]` | 런타임 모델 매핑 확인 |
| `/subagents-fleet` | 활성 실행 플릿 보기 |
| `/subagent-cost` | 토큰 사용량·비용 |

### Permission System 이중 레이어

```
┌─────────────────────────────────────────────┐
│  Layer 1: Visibility (pi-subagents)         │
│  "세션 시작 전 어떤 tool이 등록되는가"       │
│  frontmatter: tools: read,bash,write        │
├─────────────────────────────────────────────┤
│  Layer 2: Policy (pi-permission-system)     │
│  "런타임에 각 tool 호출을 허용/질문/거부"   │
│  frontmatter: permission: { bash: ask }     │
└─────────────────────────────────────────────┘
두 레이어는 독립적으로 합성된다.
```

## 핵심 시사점 / 판단

- **(저자 주장)** 설정 없이 자연어만으로 서브에이전트 위임이 바로 가능하다. 설치 직후 "Use reviewer to review this diff"로 사용 가능.
- **(저자 주장)** 내장 에이전트는 의도적으로 좁게 설계되어 부모의 전체 프롬프트를 상속하지 않는다. 이는 컨텍스트 오염을 방지하지만, 부모의 프로젝트 지시를 보려면 `inheritProjectContext: true`를 명시해야 한다.
- **(저자 주장)** `oracle` → `worker` 패턴(방향 진단 후 승인된 실행)이 권장 오케스트레이션이다. 이는 결정의 질을 높이지만 지연 시간을 증가시킨다.
- **(검증 필요·불확실)** `maxSubagentSpawnsPerSession` 기본값 40이 실제 대규모 프로젝트에서 충분한지, `globalConcurrencyLimit` 20이 API 비용과 균형이 맞는지는 프로젝트 규모와 모델 제공자에 따라 다를 것이다.
- **(검증 필요·불확실)** Dynamic Fanout의 `maxItems` 제한(예시: 12)이 실무에서 적절한 상한인지, 구조화된 출력 실패 시 복구 전략이 충분한지는 원문에서 명시하지 않는다.
- **(사실)** `contact_supervisor`의 reason은 `need_decision`, `interview_request`, `progress_update` 세 가지이며, `pi-intercom` 없이 네이티브로 동작한다(원문 명시).
- **(사실)** Acceptance Gate의 완전한 단계 순서는 `auto → none → attested → checked → verified → reviewed`이며, `reviewed`가 최상위 단계이다(원문 명시).

## 레퍼런스

- GitHub - nicobailon/pi-subagents — https://github.com/nicobailon/pi-subagents · (2차, 프로젝트 README) · Pi 에이전트에 비동기 서브에이전트 위임·아티팩트·세션 공유 기능을 추가하는 확장의 전체 문서.
- pi-web-access (의존성) — https://github.com/nicobailon/pi-web-access · (2차) · `researcher` 내장 에이전트의 웹 검색·콘텐츠 가져오기 기능에 필요.
- pi-mcp-adapter (의존성) — https://github.com/nicobailon/pi-mcp-adapter · (2차) · 에이전트 frontmatter에서 `mcp:` 직접 도구 선택에 필요.
- pi-permission-system (선택 통합) — https://github.com/gotgenes/pi-packages/tree/main/packages/pi-permission-system · (2차) · tool 호출에 대한 allow/ask/deny 정책 레이어 추가.

## 확인 질문

- Q1(전이): 이 확장의 서브에이전트 위임 패턴을 다른 코딩 에이전트 프레임워크(Cursor, Aider 등)에 적용한다면, 어떤 child-safety 경계와 Acceptance Gate가 필요할까?
- Q2(왜·어떻게): 왜 `fork` 컨텍스트에서 Anthropic의 서명된 thinking 블록을 제거해야 하며, 이것이 다른 LLM provider에서도 발생하는 문제인가?
- Q3(경계): Dynamic Fanout이 구조화된 출력에만 의존하고 산문을 파싱하지 않는 제약은, LLM의 출력 불안정성(structured_output 미준수) 상황에서 어떤 실패 모드를 만드는가?

> 출처: https://github.com/nicobailon/pi-subagents
