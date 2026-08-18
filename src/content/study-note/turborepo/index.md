---
title: "Turborepo 모노레포 개념 정리"
description: "pnpm workspace 구성부터 task graph 실행, 로컬·remote 캐싱, turbo.json 상속, Docker 멀티스테이지 빌드, 패키지 경계 검사와 내부 package 소비 방식까지 다루는 학습 노트 허브."
---

Turborepo 기반 모노레포를 다루며 정리한 개념 노트 모음이다. 크게 네 갈래로 읽으면 된다.

- **구성** — pnpm workspace로 프로젝트를 하나의 단위로 묶고(`pnpm workspace`), `turbo.json`을 상속으로
  설정한다(`turbo.json 구성과 상속`).
- **실행** — task graph가 실행 순서를 정하고(`Task Graph`), `--filter`로 실행 범위를 좁힌다(`filter`).
- **캐싱** — task hash로 로컬 캐시가 재빌드를 줄이고(`로컬 캐싱`), 같은 키로 원격에서 공유한다(`Remote Cache`).
- **배포** — `turbo prune --docker` 산출물을 멀티스테이지로 빌드하며(`Docker 멀티스테이지`), 그 과정의
  pnpm 설치 조건을 따로 정리했다(`--frozen-lockfile`).

대략 구성 → 실행 → 캐싱 → 배포 순으로 읽으면 개념이 앞에서 뒤로 쌓인다. 이 네 갈래가 각각 무엇을
담당하는지 먼저 한눈에 보려면 `주요 기능 지도와 학습 순서`부터 읽으면 된다 — 패키지 매니저와 Turbo의
역할 분리, `run`·`--filter`·`prune`·`boundaries`의 층 구분을 지도로 깔아 준다.

네 갈래에 얹히는 두 축이 더 있다. **경계**는 패키지 사이에 허용할 의존 방향을 정적으로 검사하는
`boundaries`이고(실행·캐시와 독립적이라 어느 시점에 읽어도 된다), **소비 방식**은 내부 package를
소스로 쓸지 산출물로 쓸지가 task graph의 `^build` barrier까지 정하는 문제다. 후자는 구성·실행을
먼저 본 뒤에 읽으면 왜 그 세 줄이 취향이 아닌지가 잡힌다.

이 노트들은 서로 다른 두 실습(`turborepo-monorepo-starter` · `turborepo-platform-lab`)에서 나왔다.
개념은 도구 공통이라 한자리에 모았지만, 근거의 파일 경로·패키지 스코프(`@lab/*` vs `@platform/*`)는
실습마다 다르므로 각 노트의 `근거`에 출처를 명시해 두었다.

각 노트는 앞/뒤 링크로 서로 이어져 있어 관심 지점부터 따라가도 된다. 아래 목차 참고.
