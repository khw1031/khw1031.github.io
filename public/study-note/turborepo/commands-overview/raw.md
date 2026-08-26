
> 한 줄: Turborepo는 패키지를 설치·관리하는 도구가 아니라 이미 있는 `package.json` script를 **의존 순서대로 실행하고 결과를 캐시하는 작업 실행기**이며, 나머지 기능(`--filter`·`prune`·`boundaries`)은 그 실행의 **범위**·**배포 입력**·**의존 규칙**을 각각 담당한다.

## 큰 그림

```text
pnpm / npm / yarn   → 패키지 설치와 workspace 의존성 관리
turbo run           → 작업 순서 결정 · 병렬 실행 · 캐시
  └ --filter        → 실행 대상을 좁힘
turbo prune         → 특정 앱 배포에 필요한 모노레포 부분만 추출
turbo boundaries    → 패키지 간 import 규칙 검사
```

패키지 매니저와 Turbo는 경쟁하지 않는다. **설치는 패키지 매니저, 실행은 Turbo**로 층이 갈리고,
Turbo 안에서도 실행(`run`)·범위(`--filter`)·배포(`prune`)·검사(`boundaries`)가 서로 다른 일을 한다.

## 핵심

공장의 작업 지시자로 보면 된다. 재료를 창고에 채워 넣는 것은 패키지 매니저이고, Turbo는 **어느 공정을
어떤 순서로, 몇 개를 동시에 돌릴지** 지시한다. 같은 재료로 같은 공정을 이미 돌린 기록이 있으면 그
결과를 꺼내 쓰고(캐시), 이번 주문에 관계없는 공정은 아예 부르지 않는다(`--filter`).

최소 예시. 같은 `build`를 대상만 바꿔 부르는 형태다.

```bash
turbo run build                              # 전체, 의존 순서대로 병렬 실행
turbo run build --filter=@platform/api       # 앱 하나만
turbo run test  --filter=[HEAD^1]            # 직전 커밋 대비 바뀐 패키지만
turbo run build --filter=...@platform/core   # core와 core에 의존하는 패키지까지
```

## 깊이

**작업 그래프와 병렬 실행 — `turbo run`.** `turbo run build`는 모든 패키지의 `build`를 무작정 동시에
돌리지 않는다. `dependsOn`과 workspace 의존을 읽어 선행 작업을 먼저 실행하고, 서로 독립적인 작업만
병렬로 돌린다. `^build`는 "내 의존 패키지들의 build를 먼저"라는 그래프 규칙이다. 순서를 만드는 것은
Turbo의 추측이 아니라 **선언된 의존 + `dependsOn`**이다.

**로컬·원격 캐시 — Turbo를 쓰는 가장 큰 이유.** task의 입력(소스·설정·lockfile·선언한 환경 변수 등)에서
해시를 만들고, 같은 입력이면 이전 산출물과 로그를 복원해 명령을 다시 실행하지 않는다. 기본 로컬 캐시는
`.turbo/cache`에 있고, Remote Cache를 붙이면 팀원·CI가 같은 결과를 재사용한다. 다른 기능은 편의지만
이 하나가 도입 근거에 가깝다.

**필터링과 변경 범위 실행 — `--filter`.** 전체 모노레포가 아니라 특정 패키지·디렉터리, 또는 Git에서 바뀐
패키지만 대상으로 작업 그래프를 실행한다. `[HEAD^1]` 같은 Git 범위 selector와 `...` microsyntax(뒤는
의존, 앞은 피의존)를 조합해 **변경 영향 범위만 검사**하는 CI 구성을 만들 수 있다.

**배포용 축소 워크스페이스 — `turbo prune`.** `turbo prune <패키지>`는 목표 앱을 빌드하는 데 필요한 내부
패키지와 최소 lockfile만 남긴 `out/` 디렉터리를 만든다. `--docker`를 붙이면 의존 선언(`out/json`)과
소스(`out/full`)를 나눠 내보내 Docker 레이어 캐시와 맞물리게 한다. 실행·캐시가 아니라 **배포 입력을
잘라내는 기능**이라는 점에서 앞의 셋과 층이 다르다.

**개발·진단 도구(곁가지).**

- `turbo watch build` — 파일 변경 시 의존 순서를 고려해 task를 다시 실행한다.
- `turbo run build --graph=graph.svg` — 실제 작업 그래프를 파일로 확인한다.
- `turbo run build --summarize` — 어떤 입력·출력·해시 때문에 캐시 hit/miss가 났는지 `.turbo/runs`에 기록한다.
- `turbo ls`, `turbo query` — Turbo가 인식한 워크스페이스 패키지와 그래프를 확인한다.

캐시가 예상과 다르게 동작할 때 추측하지 않고 볼 곳이 `--summarize`와 `--graph`다.

**학습 순서.** `turbo run` → `dependsOn` → `outputs`/캐시 → `--filter` → Remote Cache → `prune`이
가장 자연스럽다. 앞의 것이 뒤의 것의 전제가 되기 때문이다 — 작업 그래프를 모르면 캐시 키의 전파
범위를 못 읽고, 캐시를 모르면 Remote Cache가 무엇을 공유하는지 잡히지 않는다. `boundaries`는 이 사슬에
끼지 않는 **독립 검사**라 어느 시점에 배워도 된다.

## 용어 풀이

- **작업 실행기(task runner)** — 이미 있는 script를 순서·병렬·캐시 규칙에 따라 실행하는 층. 깨짐:
  패키지 매니저의 대체물로 착각하면 설치·의존 관리까지 Turbo에서 찾게 된다.
- **`turbo run`** — 작업 그래프를 만들어 task를 실행하는 중심 명령.
- **`--filter`** — 실행 대상 패키지 selector. `[HEAD^1]` 같은 Git 범위와 `...` 확장을 받는다.
- **`turbo prune`** — 대상 패키지와 그 의존만 남긴 축소 워크스페이스 산출. 깨짐: 빌드·캐시 기능으로 착각.
- **Remote Cache(원격 캐시)** — 같은 캐시 키를 팀·CI가 공유하는 저장소.
- **`--summarize`** — 실행의 입력·해시·캐시 판정을 `.turbo/runs`에 남기는 진단 옵션.

## 확인 질문

1. `turbo run build`가 모든 패키지의 build를 동시에 실행하지 않는 이유는? <details><summary>답</summary>`dependsOn`과 workspace 의존으로 작업 그래프를 만들어 선행 작업을 먼저 돌리고, 서로 독립적인 작업만 병렬로 실행하기 때문.</details>
2. `turbo prune`은 캐시·실행 기능과 무엇이 다른가? <details><summary>답</summary>실행 순서나 재사용을 다루지 않고, 목표 앱 배포에 필요한 패키지·lockfile만 남겨 **배포 입력의 크기를 줄이는** 기능이다.</details>
3. (본문 밖) CI 시간이 긴데 매번 전체 패키지를 빌드하고 캐시도 hit이 안 난다. 이 노트의 기능 중 어느 둘을 먼저 보겠나? <details><summary>답</summary>`--filter`(변경 범위만 실행, `[HEAD^1]` 같은 Git selector)와 Remote Cache(CI가 로컬 캐시를 못 물려받으므로 공유 캐시 연결). 원인 확인은 `--summarize`로 한다.</details>

## 근거

- 출처: turborepo-platform-lab 실습(스코프 `@platform/*`).
- [Running Tasks — Turborepo 공식 문서](https://turborepo.dev/docs/crafting-your-repository/running-tasks) —
  작업 그래프와 병렬 실행 규칙(1차 출처, 2026-08-14 확인).
- [Caching — Turborepo 공식 문서](https://turborepo.dev/docs/crafting-your-repository/caching) 및
  [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) — 해시 기반 재사용과 원격 공유(1차 출처, 2026-08-14 확인).
- [turbo run 레퍼런스](https://turborepo.dev/docs/reference/run) — `--filter` selector 문법(1차 출처, 2026-08-14 확인).
- [turbo prune 레퍼런스](https://turborepo.dev/docs/reference/prune) — 축소 워크스페이스 산출(1차 출처, 2026-08-14 확인).
- [Turborepo 명령어 레퍼런스](https://turborepo.dev/docs/reference) 및
  [turbo watch](https://turborepo.dev/docs/reference/watch) — 진단·개발 명령 목록(1차 출처, 2026-08-14 확인).

## 관련 개념

- 뒤: [Turborepo Task Graph 구성과 실행 제어](/study-note/turborepo/task-graph/) — `turbo run`이 만드는 실행 계획의 내부.
- 뒤: [Turborepo 로컬 캐싱과 캐시 키](/study-note/turborepo/caching/) — 입력 해시로 hit/miss가 갈리는 원리.
- 뒤: [Turborepo --filter로 실행 범위 좁히기](/study-note/turborepo/filter/) — selector와 `...` 확장 방향.
- 뒤: [Turborepo Remote Cache](/study-note/turborepo/remote-cache/) — 같은 키를 팀·CI가 공유하는 방식.
- 뒤: [Turborepo Docker 멀티스테이지 빌드](/study-note/turborepo/docker-multistage/) — `turbo prune --docker` 산출물을 쓰는 실제 배포 경로.
- 관련: [Turborepo boundaries의 태그 규칙과 검사 범위](/study-note/turborepo/boundaries/) — 실행·캐시 사슬에 끼지 않는 독립 검사.
