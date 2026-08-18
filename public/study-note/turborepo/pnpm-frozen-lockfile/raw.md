
> 한 줄: `--frozen-lockfile`은 lockfile이 "이전과 다르다"고 실패하지 않는다 — 실패 조건은 **지금 디렉터리의 `package.json`과 `pnpm-lock.yaml`이 서로 정합하지 않을 때**뿐이다.

## 핵심

`--frozen-lockfile`은 "지금의 **선언**(`package.json`)과 **잠금**(`pnpm-lock.yaml`)이 아귀가 맞나"만
검사하는 관문이다. lockfile 내용이 예전 빌드와 달라도 아귀만 맞으면 통과한다. "달라졌으니 실패"가
아니라 "안 맞으니 실패"다.

## 깊이

**검사 흐름.** install 시점의 `package.json` 선언 → lockfile이 그 선언과 맞는지 확인 → 맞으면 lockfile
그대로 설치, 안 맞으면 중단(`ERR_PNPM_OUTDATED_LOCKFILE`). CI·Docker 빌드에서 lockfile을 그 자리에서
몰래 고쳐 넘어가거나, 어긋난 상태를 조용히 통과시키지 않기 위한 장치다.

**가깝지만 아닌 것 — "lockfile이 바뀜" vs "package.json과 안 맞음".** `turbo prune`이 만든 pruned
lockfile은 **같은 시점의 `package.json`들에서 파생된 정합성 있는 서브셋**이다. 그래서 원본 lockfile과
내용이 달라도(추려졌어도) 대상 `package.json`과는 아귀가 맞아 install이 정상 성공한다.

## 용어 풀이

- **`--frozen-lockfile`** — lockfile을 고치지 않고 정합성만 검사해 설치. 깨짐: "내용이 바뀌면 실패"로 오해.
- **`ERR_PNPM_OUTDATED_LOCKFILE`** — `package.json` 선언과 lockfile이 안 맞을 때의 중단 신호.
- **pruned lockfile** — `turbo prune`이 대상 의존만 남긴 lockfile 서브셋. 깨짐: 원본과 달라 install이
  깨질 것으로 오해.

## 확인 질문

1. lockfile이 이전 빌드와 내용이 달라졌다는 것만으로 `--frozen-lockfile` install이 실패하나? <details><summary>답</summary>아니다. 실패는 현재 `package.json`과 lockfile이 서로 정합하지 않을 때뿐이다.</details>
2. `turbo prune`의 pruned lockfile은 원본과 다른데 왜 install이 성공하나? <details><summary>답</summary>같은 시점의 `package.json`들에서 파생된 정합 서브셋이라 대상 선언과 아귀가 맞기 때문.</details>
3. (본문 밖) 누가 `package.json`에 의존을 추가하고 lockfile을 갱신하지 않은 채 CI를 돌리면? <details><summary>답</summary>선언과 lockfile이 안 맞아 `ERR_PNPM_OUTDATED_LOCKFILE`로 중단된다 — 그게 이 옵션의 목적이다.</details>

## 근거

- 실습 M7/T1 정정(예상 `fail` → 검색으로 `fail-corrected`), `.dig/log.jsonl`.

## 관련 개념

- 관련: [Turborepo Docker 멀티스테이지 빌드](/study-note/turborepo/docker-multistage/) — builder 스테이지의 `pnpm install --frozen-lockfile`이 pruned lockfile로도 성공하는 근거.
- 앞: [pnpm workspace 구성과 재귀 실행 규칙](/study-note/turborepo/pnpm-workspace/) — lockfile은 workspace 전체를 잠근다.
