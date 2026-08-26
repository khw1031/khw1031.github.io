
> 한 줄: 내부 package를 `exports` → `src`로 소비하면 Just-in-Time, `exports` → `dist`로 소비하면 Compiled이고, 무엇을 고를 수 있는지는 취향이 아니라 **소비자가 TypeScript를 컴파일해 주는가**가 정한다 — 그 결정의 파생이 `typecheck`·`test`의 `dependsOn: ["^build"]`다.

## 큰 그림

```text
exports가 무엇을 가리키나
  ├─ "./src/index.ts"       → Just-in-Time Package
  │     소비자가 TS를 처리 (Vite/Next/webpack)
  │     라이브러리 build 불필요 → typecheck·test에 ^build 없음 (얕은 task graph)
  │
  └─ "./dist/index.js"      → Compiled Package
        소비자가 JS만 실행 (node dist/main.js)
        라이브러리 build 필요 → typecheck·test에 ^build barrier
```

## 핵심

반찬 배달로 보면 된다. **Just-in-Time**은 손질 안 된 재료를 그대로 보내는 것이다 — 받는 쪽에 조리
도구가 있어야 성립한다. **Compiled**는 미리 조리해서 보내는 것이다 — 받는 쪽이 데우기만 하면 되지만
보내는 쪽에 조리 공정(build)이 하나 생긴다. 그래서 "어느 쪽이 더 좋은가"보다 **받는 쪽이 조리할 수
있는가**가 먼저 결정된다.

두 방식은 `exports` 한 줄로 갈린다.

```jsonc
// (A) Compiled Package
"exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } }

// (B) Just-in-Time Package
"exports": { ".": "./src/index.ts" }
```

(B)로 가면 `turbo.json`이 이렇게 얕아진다.

```jsonc
"build":     { "dependsOn": ["^build"], "outputs": ["dist/**"] },
"typecheck": { },   // ← ^build 불필요. .ts를 직접 읽는다
"test":      { }    // ← 마찬가지
```

`typecheck`가 의존 package의 `src/index.ts`를 **소스 그대로** 해석하므로 `dist`가 있을 필요가 없다.
barrier가 사라지고 typecheck·test가 build를 기다리지 않은 채 병렬로 돈다.

## 깊이

**Just-in-Time의 이득은 실제로 크다.** ① 라이브러리 package의 `build` task 자체가 사라진다.
② 소스를 고쳤는데 빌드를 안 해서 옛 타입이 보이는 **stale `dist`** 문제가 원천 제거된다. ③ 에디터가
정의로 점프할 때 `.d.ts`가 아니라 진짜 소스로 간다. ④ task graph가 얕아져 "typecheck가 남의 build를
기다리는" 직렬 구간이 없어진다.

**그런데 선택은 소비자가 정한다.** 관건은 "이 package의 TypeScript를 **누가 컴파일해 주는가**"다.
Just-in-Time은 소비자가 TS를 처리할 수 있을 때만 성립한다.

| 소비자가 TS를 컴파일할 수 있나 | 고를 수 있는 방식 |
| --- | --- |
| 예 (Vite/Next/webpack이 받는다) | **Just-in-Time** — `exports` → `src` |
| 아니오 (Node가 산출물을 직접 실행한다) | **Compiled** — `exports` → `dist` |

실습 저장소가 Compiled인 이유는 소비자 하나 때문이다. `apps/web`은 Vite가 workspace 의존의 `.ts`도
트랜스파일해 주므로 Just-in-Time의 전형적인 소비자다. 반면 `apps/api`는 `nest build`(내부적으로 `tsc`)가
**자기 `src`만** 컴파일한다 — `tsconfig.json`의 `rootDir: "src"` 때문에 그 밖의 파일을 emit하려 하면
막히고, 통과한다 해도 `node dist/main.js`가 실행 시점에 찾을 `.js`가 없다. **Node가 산출물을 직접
실행하는 소비자가 하나 있으면 그 의존 package는 `.js`를 내놓아야 한다.**

**대안은 있지만 값이 크다.** api를 Just-in-Time으로 만들려면 `nest build --webpack`으로 의존까지 **번들링**
하거나, `tsx`/`ts-node` 같은 런타임 트랜스파일러로 실행해야 한다. 전자는 서버를 번들링하는 부담을,
후자는 프로덕션 실행 모델의 변경을 부른다. 그래서 "취향으로 고른 `^build` 세 줄"이 아니라 **실행 모델이
강제한 결과**로 읽는 것이 맞다.

**정보 은닉 관점에서는 두 방식이 동등하다.** Just-in-Time으로 가도 `exports`가 `"." → ./src/index.ts`
하나만 여는 한 `@platform/core/src/internal/thresholds` 같은 내부 경로는 **똑같이 막힌다**. 은닉을
담당하는 것은 컴파일 여부가 아니라 `exports`의 공개 범위다 — 두 방식에서 **갈리는 것은 은닉이 아니라
실행 모델**이다.

**`publishConfig`는 개발/배포 스위치가 아니라 npm 발행 전용 치환기다.** `pnpm publish`(또는 `pnpm pack`)가
tarball을 만들 때 `publishConfig` 안의 값을 최상위로 끌어올려 덮어쓴다. 즉 "개발 중엔 소스, **npm
발행물엔** `dist`"이며, "개발 중엔 소스, **배포 시엔** `dist`"가 아니다 — Docker 이미지 빌드는 발행이
아니라서 치환이 걸리지 않는다.

```jsonc
// packages/core/package.json
{
  "exports": { ".": "./src/index.ts" },      // ← 저장소 안에서는 이게 보인다

  "publishConfig": {
    "exports": { ".": "./dist/index.js" },   // ← pnpm publish 할 때만 갈아 끼운다
    "types": "./dist/index.d.ts"
  }
}
```

**그래서 아무것도 발행하지 않는 저장소에서는 죽은 설정이다(곁가지).** 모든 package가 `"private": true`고
npm에 올라갈 일이 없으면 치환 트리거가 영영 오지 않으므로, `node dist/main.js`가 `.js`를 필요로 하는
런타임 문제는 **전혀 해결되지 않는다**. 그 밖의 비용도 남는다 — ① 개발 중 타입 검사가 보는 것과 발행물이
보는 것이 달라 진실이 두 개가 되고(저장소 안에서는 절대 안 잡힌다), ② 검증하려면 실제로 발행·설치해
봐야 하고, ③ `exports`까지 치환해 주는 범위는 패키지 매니저마다 달라 매니저를 갈아타면 조용히 안 먹을 수
있고, ④ `exports`를 두 벌 관리하게 되어 서브패스 추가 때 한쪽만 고치면 ①로 되돌아온다. 쓸 자리는
**진짜로 npm에 발행하는 라이브러리를 모노레포에서 개발할 때**다.

**미확인 지점.** Just-in-Time으로 바꿨을 때 `nest build`가 정확히 어떤 에러를 내는지는 실행으로 확인한
기록이 없다. 위 설명은 `rootDir: "src"`와 `node dist/main.js` 실행 방식에서 따라 나온 추론이다.

## 용어 풀이

- **Just-in-Time Package** — `exports`가 `src`의 TS를 가리켜 소비자가 컴파일하는 내부 package. 깨짐:
  Node가 산출물을 직접 실행하는 소비자가 있으면 성립하지 않는다.
- **Compiled Package** — `exports`가 `dist`의 JS·`.d.ts`를 가리켜 미리 빌드해 두는 내부 package. 깨짐:
  build를 잊으면 stale `dist`가 보인다.
- **`exports`** — package의 공개 진입점 선언. 깨짐: 컴파일 방식을 정하는 필드로 착각. 실제로는 공개
  범위(정보 은닉)와 진입 대상을 정한다.
- **`^build` barrier** — 의존 package의 build가 끝나야 내 task가 시작되는 직렬 구간. 깨짐: 설정 취향으로
  오해. Compiled 선택의 파생이다.
- **stale `dist`(낡은 산출물)** — 소스는 고쳤는데 빌드를 안 해서 옛 결과가 보이는 상태.
- **`publishConfig`** — `publish`/`pack` 시점에만 최상위 필드를 덮어쓰는 발행 전용 치환. 깨짐: 환경
  기반 dev/prod 분기로 오해.

## 확인 질문

1. `typecheck`에 `dependsOn: ["^build"]`가 붙어 있는 저장소에서 그 줄을 떼면 무엇을 먼저 확인해야 하나? <details><summary>답</summary>내부 package의 `exports`가 `src`를 가리키는지. `dist`를 가리키는 Compiled 상태에서 barrier만 떼면 typecheck가 아직 없는 `dist`를 참조해 깨진다.</details>
2. Just-in-Time으로 바꾸면 `@platform/core/src/internal/…` 같은 내부 경로가 열리나? <details><summary>답</summary>아니다. 은닉은 `exports`가 여는 범위가 정하므로, 진입점 하나만 노출하면 두 방식에서 동일하게 막힌다.</details>
3. (본문 밖) 배포가 Docker 이미지 빌드뿐인 저장소에서 `publishConfig`로 "개발은 소스, 배포는 dist"를 노리면 어떻게 되나? <details><summary>답</summary>아무 일도 일어나지 않는다. 치환 트리거는 환경이 아니라 `publish`/`pack` 명령이므로, Docker 빌드에서는 `exports`가 계속 `src`를 가리킨 채로 남는다.</details>

## 근거

- 출처: turborepo-platform-lab 실습(스코프 `@platform/*`).
- 실습 저장소 실측 — `packages/core/package.json`의 `exports`(Compiled 형태),
  `apps/api/tsconfig.json`의 `rootDir: "src"`, `apps/api`의 `node dist/main.js` 실행,
  `turbo.json`의 `typecheck`·`test`에 걸린 `dependsOn: ["^build"]`. 모든 package가 `"private": true`.
- [Internal Packages — Turborepo 공식 문서](https://turborepo.dev/docs/core-concepts/internal-packages) —
  Just-in-Time Package와 Compiled Package 구분 및 각 방식의 전제(1차 출처, 2026-08-09 확인).
- [publishConfig — pnpm 공식 문서](https://pnpm.io/package_json#publishconfig) — 발행 시점에 최상위
  필드를 덮어쓰는 동작과 `exports` 치환 범위(1차 출처, 2026-08-09 확인).
- 미확인: Just-in-Time 전환 시 `nest build`가 내는 실제 에러 메시지(실행 확인 없음).

## 관련 개념

- 앞: [turbo.json 구성과 상속](/study-note/turborepo/config-inheritance/) — `exports` 결정의 파생인
  `dependsOn`·`outputs`가 어디에 선언되는가.
- 뒤: [Turborepo Task Graph 구성과 실행 제어](/study-note/turborepo/task-graph/) — `^build` barrier가
  만드는 직렬 구간과 그것이 사라진 그래프.
- 관련: [Turborepo 로컬 캐싱과 캐시 키](/study-note/turborepo/caching/) — Compiled에서는 `dist`가 캐시
  복원 대상이 되고, Just-in-Time에서는 그 build task 자체가 없어진다.
- 관련: [모노레포 package 구조](/study-note/software-architecture/monorepo-package-structure/) —
  `exports`로 내부 경로를 닫는 정보 은닉이 왜 package 경계의 핵심인가.
