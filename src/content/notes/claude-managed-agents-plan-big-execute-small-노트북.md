---
title: 'Claude Managed Agents: Plan Big, Execute Small 노트북'
pubDate: '2026-07-08'
description: 'Anthropic claude-cookbooks 저장소의 managed agents 패턴 노트북으로, 큰 계획과 작은 실행 분리를 다룬다.'
summary: 'anthropics/claude-cookbooks 저장소의 CMA_plan_big_execute_small.ipynb 노트북 위치와 존재만 확인된 상태이며, 본문의 기술 내용은 원본 미확보로 직접 읽은 후 작성해야 한다.'
lang: ko
tags:
  - 'llm'
  - 'ai'
  - 'agentic-coding'
canonical: 'https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_plan_big_execute_small.ipynb'
lintHash: 'b1240fede73a'
---

> 한 줄 명제: 큰 단위로 계획하고 작은 단위로 실행하는 managed agent 패턴을 다루는 Anthropic cookbook 노트북이다.

## 큰 그림

```text
CMA_plan_big_execute_small.ipynb
├── 저장소 위치 및 존재 확인
├── 노트북 셀 본문 ── 원본 미확보
├── 코드 예제       ── 원본 미확보
├── 아키텍처 설명   ── 원본 미확보
└── 사용 API/패턴   ── 원본 미확보
```

## 핵심

이 노트북은 Anthropic 공식 cookbook 저장소(`anthropics/claude-cookbooks`)의 `managed_agents` 디렉터리 아래 `main` 브랜치에 존재한다. 파일명 `CMA_plan_big_execute_small.ipynb`에서 "Plan Big, Execute Small" 패턴을 다루는 managed agent 관련 노트북임을 알 수 있으나, Jina 추출 결과 GitHub 페이지의 내비게이션 크롬(메뉴, 링크, Sign-in 버튼)만 수집되었고 노트북 셀 본문은 전혀 확보되지 않았다.

따라서 이 노트북의 실제 기술 내용(아키텍처, 코드, API 사용법, 설명 등)은 현재 소스에서 확인 불가능하다.

<!-- 원본 미확보 — 직접 읽은 후 작성 -->
핵심 개념, 동작 원리, 최소 예제 코드는 노트북 본문을 직접 확인한 뒤 이 섹션에 작성해야 한다.

## 깊이

<!-- 원본 미확보 — 직접 읽은 후 작성 -->
각 가지의 레시피·gotcha·실코드는 노트북 셀 본문을 직접 확인한 뒤 작성해야 한다.

- `[저장소 구조]` 📎 저장소 경로 `managed_agents/` 디렉터리에는 이 노트북 외에 다른 managed agent 관련 노트북이 있을 수 있다. 직접 확인 필요.
- `[파일명 추정]` 📎 `CMA_plan_big_execute_small` 파일명에서 "plan big"(상위 수준 계획)과 "execute small"(하위 수준 실행)의 분리 패턴을 다룰 것으로 추정되나, 원문 확인 전까지 기술적 세부사항은 기재하지 않는다.

## 비유

<!-- 원본 미확보 — 직접 읽은 후 작성 -->
노트북 본문의 실제 개념을 확인한 뒤 비유와 깨지는 지점을 쌍으로 작성해야 한다. 현재 소스로는 비유를 구성할 근거가 없다.

## 곁가지

- Managed Agents 심화: `anthropics/claude-cookbooks` 저장소의 `managed_agents/` 디렉터리 내 다른 노트북을 직접 읽을 필요가 생길 때
- Claude Agent SDK 심화: 노트북에서 사용하는 SDK/API를 실제 프로젝트에 적용해야 할 때

## 연결

- Anthropic Claude API: 이 노트북이 Claude API를 호출하여 managed agent를 구현할 것으로 추정되나, 구체적 연결 지점은 원문 확인 후 작성
- Agentic patterns: "plan big, execute small"은 일반적인 agent 설계 패턴이나, 이 노트북의 구체적 구현 방식은 원문 확인 후 연결

## 레퍼런스

- [원본 노트북 — GitHub](https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_plan_big_execute_small.ipynb): `anthropics/claude-cookbooks` 저장소 `main` 브랜치의 `managed_agents/CMA_plan_big_execute_small.ipynb` 파일 페이지. Jina 추출 시 노트북 셀 본문 미확보, GitHub UI 크롬만 수집됨. (1차) — 버전 명시 없음(원문에 버전 정보 없음)
- [claude-cookbooks 저장소 루트](https://github.com/anthropics/claude-cookbooks): Anthropic 공식 cookbook 저장소. managed agent 관련 다른 노트북 존재 여부 확인 가능. (1차) — 버전 명시 없음

---
## 인출 질문

1. 이 노트북의 저장소 경로와 파일명은 무엇이며, 현재 소스에서 확인 가능한 정보와 확인 불가능한 정보는 각각 무엇인가?
2. "Plan Big, Execute Small"이라는 파일명에서 추정할 수 있는 패턴의 방향성은 무엇이며, 그것을 검증하려면 어떤 추가 조치가 필요한가?

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
