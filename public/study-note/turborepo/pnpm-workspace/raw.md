
> 한 줄: `packages:` glob은 workspace에 포함할 프로젝트의 **탐색 범위**를 정하고(루트는 항상 포함), `-r`은 그 집합을 **재귀 순회하며 명령을 적용하는 모드**다.

## 큰 그림

```text
pnpm-workspace.yaml (packages: glob)
        │  탐색
        ▼
   멤버 집합 (+ 루트는 항상 포함)
        │  -r 재귀 순회
        ▼
   명령별 root 정책 · --filter
        │
        ▼
   최종 실행 대상
```

세 단계가 순서대로 대상을 좁힌다: glob이 집합을 만들고 → `-r`이 그 집합에 명령을 반복 적용하며 →
명령별 root 규칙과 `--filter`가 최종 대상을 정한다.

## 핵심

한 지붕 아래 여러 세대가 사는 건물을 떠올리면 된다. `packages:` glob은 "어느 호실을 세대로 볼지"
정하는 규칙이고, 루트는 그와 무관하게 늘 있는 **관리사무소**다. 세대가 workspace 멤버가 되면
관리사무소(루트)에서 한 번에 설치(`pnpm install`)·재귀 실행(`pnpm -r run`)·`--filter`로 다룰 수
있다 — 세대마다 따로 명령을 돌리지 않기 위한 장치다.

## 깊이

**멤버십과 dependency는 다른 층이다(가깝지만 아닌 것).** workspace 멤버십은 *포함 여부*이고,
package dependency는 패키지 사이의 *방향 있는 관계*다. glob에 잡혀 멤버가 되는 것만으로는 패키지
간 의존성이 생기지 않는다 — 의존은 각 `package.json`의 dependency 선언이 따로 만든다. 이 구분이
task 실행 순서로 이어진다([관련 개념](#관련-개념) 참조).

**`-r`은 "멤버 전체"가 아니라 재귀 순회 모드다(흔한 오해).** "전체에 실행"으로 읽기 쉽지만,
실제로는 발견된 package 디렉터리를 재귀적으로 돌며 명령을 적용할 뿐이고, 루트 포함 여부는
**명령마다 다르다.**

- `pnpm list -r` — 루트를 **포함**해 프로젝트와 의존성을 보여준다(`--depth`로 표시 깊이 조절).
- `pnpm -r run` — 기본적으로 루트를 **제외**한다. 루트도 넣으려면 `--include-workspace-root`.
- `--filter` — 재귀 대상 중 이름·경로·관계로 부분집합을 고른다.

**실측** — `pnpm list -r --depth -1`은 root·agent·core를 보여줬고, `pnpm -r run typecheck`는
agent·core만 실행했다.

## 용어 풀이

- **작업공간(workspace)** — 여러 package를 한 설치·실행 단위로 묶은 것. 깨짐: 멤버십이 곧 의존이라고
  착각하면 실행 순서를 잘못 예측한다.
- **재귀 실행(`-r`, recursive)** — 멤버 집합을 순회하며 명령을 반복 적용. 깨짐: 루트 포함을 명령
  종류와 무관하게 같다고 보면 틀린다.
- **필터(`--filter`)** — 재귀 대상의 부분집합 선택자. 깨짐: 필터는 대상을 *좁힐* 뿐 없던 멤버를
  만들지 않는다.

## 확인 질문

1. `packages:` glob이 `apps/*`만 잡고 루트를 포함하지 않으면, 루트 `package.json`은 workspace에서
   빠지나? <details><summary>답</summary>아니다. 루트는 glob과 무관하게 항상 workspace에 포함된다.</details>
2. `pnpm -r run build`가 루트의 `build` 스크립트를 실행하지 않는 이유는? <details><summary>답</summary>`run`은 기본적으로 루트를 제외하기 때문. 포함하려면 `--include-workspace-root`.</details>
3. (본문 밖) 두 package가 각각 workspace 멤버지만 서로 `package.json`에 의존을 선언하지 않았다면,
   한쪽 소스를 고쳐도 다른 쪽 빌드가 자동 재실행되지 않는 이유는? <details><summary>답</summary>멤버십은 포함 여부일 뿐 의존 간선을 만들지 않는다. 재실행은 package dependency와 `dependsOn`이 결합해 만든 task edge에서 나온다.</details>

## 근거

- 출처: turborepo-monorepo-starter 실습(스코프 `@lab/*`).
- `pnpm-workspace.yaml:1-3` — glob 선언.
- 실행 관찰: `pnpm list -r --depth -1`(root·agent·core), `pnpm -r run typecheck`(agent·core).

## 관련 개념

- 뒤: [Turborepo Task Graph 구성과 실행 제어](/study-note/turborepo/task-graph/) — workspace가 만든
  패키지 그래프 위에서 task graph가 `dependsOn`으로 확장된다.
