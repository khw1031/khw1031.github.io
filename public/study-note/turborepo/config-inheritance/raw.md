
> 한 줄: package-level `turbo.json`은 `extends: ["//"]`로 root를 상속하되, **scalar는 물려받고 array는 다시 쓰면 대체**(합치지 않음)하며, 배열을 확장하려면 `$TURBO_EXTENDS$`를 **첫 원소**로 넣는다.

## 핵심

root `turbo.json`은 **기본 계약서**, package-level `turbo.json`은 그 위에 얹는 **조항 덮어쓰기**다.
스칼라 값은 그대로 물려받지만, 목록(array) 항목은 package에서 다시 쓰는 순간 부모 목록을 통째로
**교체**한다. 공통 규칙을 반복하지 않으면서 package별 차이를 두기 위한 설계다.

## 깊이

**root `outputs`는 task 단위라 package를 구분하지 않는다.** 여러 package의 결과물 경로가 다르면 root에
경로를 다 나열할 수는 있지만 그러면 **모든** package의 build task에 적용된다. package마다 경로가
다르면 **package-level `turbo.json`**에서 상속하거나 좁히는 편이 정확하다. 경로 패턴은 각 package의
`package.json` 위치 기준으로 해석된다.

**scalar 상속 vs array 대체.** `extends: ["//"]`에서 scalar field는 그대로 상속된다. 반면 `outputs`·
`dependsOn`·`env`·`inputs` 같은 array field를 package에서 다시 쓰면 기본 동작은 **대체**다. 예를 들어
Next.js app에서 `outputs: [".next/**"]`라고 쓰면 root의 `["dist/**"]`는 사라진다.

**배열을 유지한 채 확장하려면 `$TURBO_EXTENDS$`.** 상속받은 배열을 남기고 값을 더하려면
`$TURBO_EXTENDS$`를 **배열의 첫 원소로만** 넣는다. 부모 배열을 원하는 위치에 끼워 넣는 일반적인
위치 지정 표식이 아니라서, 뒤에 넣는 형태는 유효한 확장이 아니다.

## 용어 풀이

- **`extends: ["//"]`** — root(`//`) 설정을 이 package로 상속. 깨짐: array까지 자동 병합된다고 오해.
- **scalar/array field** — 단일 값 필드는 상속, 배열 필드는 재지정 시 대체. 깨짐: 둘을 같은 규칙으로 봄.
- **`$TURBO_EXTENDS$`** — 상속 배열을 유지하며 확장하는 표식. 깨짐: 첫 원소가 아닌 위치에 두면 무효.

## 확인 질문

1. root가 `outputs: ["dist/**"]`인데 package에서 `outputs: [".next/**"]`로 쓰면 최종 `outputs`는? <details><summary>답</summary>`[".next/**"]`뿐. array는 대체되므로 root의 `dist/**`는 사라진다.</details>
2. root의 `dist/**`를 유지하면서 `.next/**`도 캐시하려면? <details><summary>답</summary>`outputs: ["$TURBO_EXTENDS$", ".next/**"]`처럼 `$TURBO_EXTENDS$`를 첫 원소로 넣어 확장한다.</details>
3. (본문 밖) 여러 package가 모두 같은 `dist/**`를 쓴다면 package마다 `turbo.json`을 두는 게 이득인가? <details><summary>답</summary>대개 아니다. 경로가 동일하면 root 한 곳으로 충분하고, package-level은 경로가 **달라질 때** 좁히려고 둔다.</details>

## 근거

- 출처: turborepo-monorepo-starter 실습(스코프 `@lab/*`).
- 상속 규칙은 `apps/api/turbo.json`(NestJS app 가정) 예시로 확인. array 대체·`$TURBO_EXTENDS$` 확장 규칙.

## 관련 개념

- 관련: [Turborepo 로컬 캐싱과 캐시 키](/study-note/turborepo/caching/) — 상속·대체의 대상인 `outputs`·`inputs`가 곧 캐시 경계다.
- 앞: [Turborepo Task Graph 구성과 실행 제어](/study-note/turborepo/task-graph/) — `dependsOn`도 상속·대체 규칙을 따르는 array field다.
