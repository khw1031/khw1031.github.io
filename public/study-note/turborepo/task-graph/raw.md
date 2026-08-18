
> 한 줄: Task Graph는 Package Graph를 `dependsOn`으로 확장한 **실행 계획**이고, `--dry=json`으로 실행 전 관찰하며, `concurrency`는 순서가 아니라 **동시 실행 슬롯 상한**이다.

## 큰 그림

```text
Package Graph (package 간 의존)
        │  turbo.json의 dependsOn과 결합
        ▼
Task Graph (task 간 의존 = task edge)
        │  스케줄
        ▼
실행 순서(dependsOn) · 동시 실행 수(concurrency)
```

package 간 의존은 저절로 task 순서가 되지 않는다. `dependsOn`과 결합해야 task edge가 생기고,
그 위에서 순서(dependsOn)와 동시성(concurrency)은 **서로 다른 층**으로 작동한다.

## 핵심

요리 순서도로 보면 된다. "core를 먼저 만들어야 agent를 만들 수 있다"는 **재료 의존**이
`dependsOn`이고, "불口를 몇 개까지 동시에 쓰나"가 `concurrency`다. `--dry=json`은 실제로 요리하지
않고 **순서표만 뽑아 보는 것** — 순서표가 그럴듯해도 실제 조리가 성공한다는 보장은 아니다.

## 깊이

**`--dry=json`은 계획이지 실행 결과가 아니다(흔한 오해).** 실제 script를 돌리지 않고 Turborepo가
계산한 실행 계획을 JSON으로 낸다. 봐야 할 것: 대상 package·task, task 간 dependency·dependent 관계,
command·입력·hash·cache 상태. 계획이 출력됐다고 `tsc` 실행이나 `dist` 생성이 보장되지는 않는다.

**task edge는 두 가지가 결합할 때 생긴다.** `@lab/agent#build -> @lab/core#build`는 agent의 build가
core의 build에 의존한다는 뜻이고(화살표=의존 방향, 실행은 core→agent), 이 edge는 `package.json`의
package dependency와 `turbo.json`의 `dependsOn: ["^build"]`가 **함께 있을 때만** 만들어진다.
`dependsOn`이 없으면 package edge가 남아 있어도 task edge는 안 생긴다.

**`dependsOn` 표현 비교(가깝지만 아닌 것)** — `test: ["build"]`=같은 package의 build,
`build: ["^build"]`=의존 package들의 build, `test: ["utils#build"]`=지정 package의 build, `[]`=선행
task 없음(`[]`이어도 `package.json`의 dependency 자체는 남는다).

**`concurrency`와 `dependsOn`은 별개 층이다.** `concurrency=1`은 동시에 실행할 task 수를 하나로 제한해
결과적으로 순차 실행이 된다 — "지금 실행 가능한 task" 중 **동시에 쓸 슬롯 수의 상한**일 뿐이다.
`core#build`가 `agent#build`보다 먼저 실행되는 것은 concurrency가 아니라 dependency+`dependsOn`이 정한
순서다.

**실측** — `turbo run build --dry=json`에서 `@lab/agent#build`의 dependency가 `@lab/core#build`로
출력됐고, `--concurrency=1 --force`로 core·agent의 네 task가 하나씩 실행됐다.

## 용어 풀이

- **Package Graph(패키지 그래프)** — `package.json` 의존으로 만든 package 간 간선. 깨짐: 이것만으로는
  실행 순서가 안 정해진다.
- **Task Graph(태스크 그래프)** — task 간 간선(task edge). 깨짐: package edge와 1:1이 아니다 —
  `dependsOn`이 있어야 생긴다.
- **`dependsOn`** — task의 선행 task 선언. `^`는 "의존 package들의"라는 뜻. 깨짐: 없으면 순서가
  보장되지 않는다.
- **dry-run(`--dry`)** — 실행 없이 계획만 산출. 깨짐: 계획 성공 ≠ 실행 성공.
- **concurrency(동시성)** — 동시 실행 슬롯 상한. 깨짐: 선후관계로 오해하면 순서 원인을 잘못 짚는다.

## 확인 질문

1. `turbo run build --dry=json`이 성공적으로 출력됐으면 실제 `tsc` 빌드도 성공한 것인가? <details><summary>답</summary>아니다. dry-run이 검증하는 것은 계획뿐이고 실행 결과는 아니다.</details>
2. `package.json`에 `@lab/agent → @lab/core` 의존이 있는데 `turbo.json`에 `dependsOn`이 없으면 두 build
   사이에 task edge가 생기나? <details><summary>답</summary>아니다. package dependency와 `dependsOn`이 결합해야 task edge가 생긴다.</details>
3. (본문 밖) `concurrency=4`인데 core#build만 먼저 돌고 agent#build가 기다린다면, 그 이유는
   concurrency인가? <details><summary>답</summary>아니다. 슬롯은 4개로 여유가 있으므로 대기의 원인은 `dependsOn`이 정한 선후관계다.</details>

## 근거

- `turbo.json:4-6` — `dependsOn` 선언.
- 실행 관찰: `turbo run build --dry=json`(agent#build → core#build), `turbo run build typecheck --concurrency=1 --force`(네 task 순차).

## 관련 개념

- 앞: [pnpm workspace 구성과 재귀 실행 규칙](/study-note/turborepo/pnpm-workspace/) — task graph는
  workspace가 만든 패키지 그래프 위에서 확장된다.
