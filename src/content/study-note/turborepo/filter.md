---
title: "Turborepo --filter로 실행 범위 좁히기"
description: "--filter의 package selector, ... microsyntax의 dependencies/dependents 방향, dependsOn 확장과 --only, 선택 범위와 실행 순서의 분리."
---

> 한 줄: `--filter`는 실행할 **package를 고르고**, 이름 뒤/앞의 `...`로 의존/피의존까지 확장하며, 선택된 task의 `dependsOn`은 기본으로 함께 실행된다 — **선택 범위와 실행 순서는 별개 층**이다.

## 큰 그림

```text
--filter selector (+ ... 확장)
        │  package 선택
        ▼
   target package 집합
        │  dependsOn 확장 (기본), --only면 차단
        ▼
   실행 대상 task  ── 실행 순서는 dependsOn이 정함
```

## 핵심

`--filter`는 "누구를 부를지" 정하는 **명단 규칙**이고, `...`은 "그 사람의 인맥까지 부르기"다.
다만 명단이 실행 **순서**까지 정하지는 않는다 — 순서는 `dependsOn`이 따로 정한다. monorepo 전체를
매번 돌리지 않고 필요한 package와 그 관계만 고르기 위한 장치다.

## 깊이

**`--filter=<package>`가 target을 고르고 `dependsOn`이 확장한다.** 선택된 task의 `dependsOn`에 걸린
task는 기본적으로 함께 실행된다. 마지막 task dependency 확장까지 막고 싶으면 `--only`를 붙인다.

**`...`은 package graph microsyntax다.** package 이름 **뒤**의 `...`는 target의 **dependencies**를,
**앞**의 `...`는 target의 **dependents**를 선택 집합에 포함한다. 이건 어디까지나 **package 선택
범위**이고, 선택된 task들의 실제 실행 **순서**는 `dependsOn`이 정한다.

## 용어 풀이

- **`--filter`** — 실행할 package selector. 깨짐: 선택 범위를 실행 순서로 착각.
- **`...`(package graph microsyntax)** — 뒤=dependencies, 앞=dependents. 깨짐: 앞뒤 방향을 반대로 읽음.
- **`--only`** — 선택된 task의 dependency 확장을 막는다.

## 확인 질문

1. `--filter=@lab/agent...`와 `--filter=...@lab/agent`는 무엇이 다른가? <details><summary>답</summary>뒤 `...`는 agent의 dependencies(agent+core)를, 앞 `...`는 agent의 dependents(agent에 의존하는 것들)를 포함한다.</details>
2. `--filter=@lab/core`만 줬는데 `core#build`의 선행 task가 함께 도는 이유는? <details><summary>답</summary>선택된 task의 `dependsOn`이 기본으로 함께 확장 실행되기 때문. 막으려면 `--only`.</details>
3. (본문 밖) filter로 두 package를 골랐는데 A가 B보다 먼저 실행됐다. 순서를 정한 것은 filter인가? <details><summary>답</summary>아니다. filter는 선택 범위만 정하고, 순서는 package dependency와 `dependsOn`이 만든 task edge가 정한다.</details>

## 근거

- 출처: turborepo-monorepo-starter 실습(스코프 `@lab/*`).
- 실행 관찰: `--filter=@lab/core`(core만), `--filter=@lab/agent...`(agent+core), `--filter=...@lab/core`(core+agent).

## 관련 개념

- 앞: [pnpm workspace 구성과 재귀 실행 규칙](/study-note/turborepo/pnpm-workspace/) — filter는 workspace가 만든 멤버 집합에서 고른다.
- 앞: [Turborepo Task Graph 구성과 실행 제어](/study-note/turborepo/task-graph/) — 확장·순서는 `dependsOn`이 정한다.
