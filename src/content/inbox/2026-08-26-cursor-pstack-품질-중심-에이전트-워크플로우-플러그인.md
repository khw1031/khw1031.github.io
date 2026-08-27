---
title: 'Cursor pstack: 품질 중심 에이전트 워크플로우 플러그인'
pubDate: '2026-08-26T22:10:00+09:00'
noteId: AGENT-2608-032
description: 'Cursor 마켓플레이스에 공개된 pstack 플러그인의 구조 — 원칙 기반 skill 라우팅과 서브에이전트 병렬화로 코드 품질을 높이는 방식 조사'
summary: 'React Core 팀 멤버 poteto가 공개한 Cursor 플러그인 pstack은 /poteto-mode가 22개 playbook 중 하나로 요청을 라우팅하고, 21개 원칙을 기반으로 investigation·review·automation skill을 필요할 때만 호출하는 구조다. 목표는 무분별한 서브에이전트 증식이 아니라 불확실성·위험도가 임계점을 넘을 때만 병렬화하는 것이다.'
lang: ko
tags:
  - 'cursor'
  - 'pstack'
  - 'agent-workflow'
  - 'subagent'
  - 'skill-design'
canonical: 'https://cursor.com/marketplace/cursor/pstack'
lintHash: '98164e9835cf'
---

## 핵심

pstack은 Cursor AI 코드 에디터용 플러그인으로, React Core 팀 멤버인 poteto(lauren)가 만들어 Cursor 마켓플레이스에 공개했다. 슬로건은 "양보다 질" — "throughput without quality is not a goal"이라는 원칙 아래, 여러 에이전트를 동시에 돌리는 "fearless parallelism"을 병행 실행 자체가 아니라 엄격한 검증 절차로 뒷받침하겠다는 접근이다.

## 구조

```text
[/poteto-mode] (진입점)
  요청을 읽고 22개 playbook(버그 수정·기능 구현·성능 최적화·리팩토링·배포 등) 중 하나로 라우팅
        │
        ▼
[25개+ slash-command skill]
  조사·설계: /how, /why, /architect, /arena, /swarm
  리뷰·품질: /interrogate, /tdd, /unslop
  학습·기록: /recall, /reflect, /teach
  안전·테스트: /blast-radius, /create-verification-skill
        │
        ▼
[Subagent]
  poteto-agent  — pstack 방법론 전체를 적용해 실행
  comment-sicko — 불필요한 주석을 찾아 제거하는 리뷰어
        │
        ▼
[Automation Pack]
  benny — Slack 이슈 리포트 triage → 재현 → UI 증거 확보 → 수정 (기본은 dormant)
```

원칙은 4개 범주 21개로 구성된다.

| 범주 | 내용 |
| --- | --- |
| Core | 게으름(불필요한 작업 생략), 근본 사고, subtraction-first(빼기 우선), 결과 지향 |
| Architecture | 도메인 모델링, 경계 원칙, 타입 시스템 엄격성 |
| Verification | 증명 요구, 근본 원인 추적, 순서 관리 |
| Delegation | 서브에이전트 라우팅 기준, 사람 개입 회피 최소화 |

설정은 `/setup-pstack`으로 code·judgment·review 역할별 모델을 지정하고, `/automate-me`는 사용자의 사용 패턴을 관찰해 개인화된 워크플로우를 생성한다. 라이선스는 MIT.

## 시사점

`/poteto-mode` → playbook → skill의 라우팅 구조와, 21개 원칙을 "언제 서브에이전트를 늘릴지"에 대한 명시적 게이트로 쓰는 방식은 이전에 조사한 [Codex·Claude Code 적응형 모델 오케스트레이션](/inbox/2026-08-26-codex-claude-code-적응형-모델-오케스트레이션-구조/) 구조의 실제 구현 사례로 볼 수 있다 — 특히 "작은 작업에는 subagent를 만들지 않는다"는 실패 방지 규칙과 pstack의 subtraction-first 원칙이 맞닿아 있다.

## 레퍼런스

- pstack 마켓플레이스 페이지 — https://cursor.com/marketplace/cursor/pstack
- pstack 플러그인 소스 — https://github.com/cursor/plugins/tree/main/pstack
- poteto의 Cursor 사용기 — https://x.com/poteto/article/2058975157503570132

## 확인 질문

- Q1: `/poteto-mode`의 22개 playbook 판정 로직은 규칙 기반인지, 별도 분류 모델을 호출하는지?
- Q2: benny 자동화 팩이 "dormant 기본값"인 이유 — Slack 접근 권한·오탐 위험 중 무엇이 더 큰 제약인가?
- Q3: comment-sicko가 주석 삭제와 보존을 가르는 기준(문서화 주석 vs 설명 주석)은 무엇인가?
