---
title: 프론트엔드 개발 워크플로우 설계 및 표준화
pubDate: '2026-07-04'
description: "AI 에이전트 기능 구현의 비결정성·재현성 문제를 Requirements→Design→Task→Implementation→Review 5단계 문서 워크플로우로 표준화한 기록"
draft: true
tags: [ai, workflow, sdd, frontend]
summary: "AI 에이전트 기능 구현의 비결정성·컨텍스트 한계·재현성 문제를 Requirements→Design→Task→Implementation→Review 5단계 문서 기반 워크플로우로 표준화한 기록 — 문서를 인터페이스로 삼는 Spec-Driven Development 관점에서."
lang: ko
lintHash: '29b0162962bc'
---

# TL;DR

- AI 에이전트로 기능을 구현할 때 **비결정성·컨텍스트 한계·재현성 부족** 문제를 풀기 위해, 기능 구현을 `Requirements → Design → Task → Implementation → Review` **5단계 문서 기반 워크플로우**로 표준화했다.
- 핵심은 **문서를 인터페이스로 삼는 것**(Document as Interface). 각 단계의 산출물(`.md`)이 다음 단계의 입력이자 진실의 원천(SSOT)이 된다 — 이는 **Spec-Driven Development(SDD)** 와 같은 뿌리다.
- Claude Skill로 패키징해 `status.yaml` + CLI로 **작업 재개**를 보장하고, Step 4는 **Agent Team 병렬 구현**으로 확장했다.
- 실제 프로젝트(한샘 인테리어 플래너)에서 **83개 태스크**에 적용해 납기 단축을 검증한 뒤, 사내 공통 Skill로 추출해 4종 AI 에이전트에서 동일 절차로 재사용 가능하게 했다.

# 문제: AI 코딩은 왜 "그냥 시키면" 안 되는가

에이전트에게 큰 기능을 한 번에 맡기면 세 가지가 무너진다.

- **비결정성** — 같은 요청도 실행마다 결과가 다르다.
- **컨텍스트 한계** — 요구사항·설계·구현을 한 세션에 밀어넣으면 뒤로 갈수록 앞을 잊는다.
- **재현성·인수인계 부재** — "왜 이렇게 만들었는지"가 대화에 흩어져 남지 않는다.

해법은 사람이 큰 일을 다루는 방식과 같다. **작게 나누고, 각 단계의 결정을 문서로 고정하고, 단계마다 검증한다.**

# 5단계 워크플로우

| Step | 역할 | 입력 → 출력 |
| --- | --- | --- |
| 1 | Requirements Analyst | `00-user-prompt` → `10-plan` |
| 2 | System Designer | `10-plan` → `20-system-design` |
| 3 | Task Analyzer | `10+20` → `30-task` + `todos/` |
| 4 | Coordinator (Team Lead) | `todos/*` → `40-implementation` |
| 5 | Reviewer | `40-impl` → `50-review` |

## 4대 원칙

1. **Context Isolation** — 각 Step은 새 컨텍스트에서 실행해 이전 대화의 잡음을 차단한다.
2. **Human in the Loop** — 단계 사이에 승인 게이트를 둔다.
3. **Document as Interface** — Step 간 통신은 오직 `.md` 문서로 한다.
4. **Git as History** — 각 Step 완료 시 커밋으로 체크포인트를 남긴다.

## 운영 장치

- `status.yaml`을 SSOT로 태스크·단계별 상태와 타임스탬프를 추적한다.
- `task.sh`(init / status / list) CLI와 `resume-guide`로 **어느 세션에서나 작업을 이어받는다**.
- Step 4는 의존성 그래프 기반으로 Task Worker를 병렬 스폰(TDD 강제)하는 **Agent Team** 구조로 확장했다.

# Spec-Driven Development(SDD)와의 관계

> 여기가 이 글의 핵심 논의 지점 — 함께 다듬을 부분.

SDD는 코드보다 **명세(spec)를 먼저** 확정하고, 그 명세를 진실의 원천으로 삼아 구현을 파생시키는 접근이다. 이 워크플로우는 SDD의 실전 구현으로 볼 수 있다.

- **명세가 곧 인터페이스** — `10-plan`(요구사항 명세), `20-system-design`(설계 명세), `30-task`(작업 명세)가 순차적으로 spec을 정제한다. 구현(Step 4)은 이 spec에서 파생된다.
- **spec ↔ 테스트 연결** — Step 1의 Given-When-Then 시나리오가 설계·태스크·TDD 구현·리뷰까지 그대로 이어져, 명세가 검증 기준이 된다.
- **결정의 영속화** — 대화가 아니라 문서에 결정이 남아, SDD가 지향하는 "재현 가능하고 감사 가능한" 개발에 부합한다.

논의해볼 축(초안):

- 기존 SDD 도구/흐름(예: spec-first 프레임워크)과 이 하네스의 **공통점과 차이**는?
- 어디까지 spec을 앞세우고, 어디서부터 에이전트의 재량을 허용할 것인가(over-specification의 비용)?
- spec drift(문서와 코드의 불일치)를 어떻게 막을 것인가 — Git checkpoint·리뷰 단계의 역할.

# 결과

- 한샘 인테리어 플래너에서 **83개 Jira 태스크**를 이 워크플로우로 처리, 약 62% 일정 단축·AI 협업 비율 86.8%를 기록.
- 사내 공통 Skill(`feature-workflow`)로 추출해 Claude Code / Cursor / GitHub Copilot / Antigravity에서 동일 절차로 재사용.

# 트레이드오프

_작성 예정_ — 단계·문서 오버헤드 vs 재현성/품질, 소규모 변경에는 과할 수 있는 점, Human in the Loop의 병목 등.
