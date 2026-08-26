
> 한 줄: `moduleResolution`은 **import 주소를 최종적으로 누가 실제 파일로 바꾸나**를 타입검사기에게 알려주는 설정이며 — Node가 직접 실행하면 `node16`, 번들러가 대신 찾아주면 `bundler`, 정보 은닉을 무너뜨리는 건 옛 `node`(node10) 하나뿐이다.

## 큰 그림

TypeScript는 코드를 실행하지 않는다. `import { App } from './App'`은 그저 **주소**이고, 언젠가 이 주소를 보고 진짜 파일을 찾아오는 건 다른 누군가다. `moduleResolution`은 "그 누군가가 누구냐"에 대한 대답이다.

```text
import './health'   ← 주소(문자열)
       │
       │  누가 이걸 실제 파일로 바꾸나?
       ├─────────────► Node (런타임에 직접 찾음)   → moduleResolution: node16
       └─────────────► 번들러 Vite/webpack/esbuild → moduleResolution: bundler

TypeScript는 찾지 않는다. "찾을 사람의 규칙대로" 미리 검사만 한다.
```

즉 이 설정을 고르는 일은 취향 선택이 아니라 **최종 해석자를 사실대로 신고하는 일**이다. 신고가 틀리면 타입검사는 초록불인데 앱이 안 뜬다.

## 핵심

세관 신고서에 비유할 수 있다. 물건(주소)을 최종적으로 받는 쪽이 깐깐한 나라인지 너그러운 나라인지 미리 적어 두면, 세관(타입검사기)이 그 나라 규칙으로 미리 걸러 준다. 받는 나라를 잘못 적으면 세관은 통과시키고 도착지에서 반송된다.

깐깐한 쪽(Node)과 너그러운 쪽(번들러)의 차이는 확장자 하나에서 가장 잘 드러난다.

```ts
// Node가 최종 해석자일 때 (moduleResolution: node16)
import { evaluateHealth } from './health';      // ❌ Node ESM: 그런 파일 없음
import { evaluateHealth } from './health.js';   // ✅

// 번들러가 최종 해석자일 때 (moduleResolution: bundler)
import { App } from './App';       // ✅ Vite가 .tsx를 붙여서 찾아 준다
import styles from './app.css';    // ✅ CSS도 번들러가 처리한다
```

Node는 ESM에서 `./health`를 `./health.js`로 자동 보정해 주지 않는다(CJS의 `require`는 해 준다). `node16`이 확장자를 강요하는 건 TypeScript의 취향이 아니라 **Node ESM의 실제 규칙을 그대로 들이미는 것**이다. 반대로 번들러는 확장자 보정·`index` 자동 탐색·alias 해석을 다 해 주므로, 여기에 Node 규칙을 강요하면 **번들러에선 멀쩡히 도는 코드에 빨간 줄이 뜬다.** `bundler` 모드는 그 간극을 없애려고 나중에 추가된 모드다.

## 깊이

**세 모드 비교(필수).**

| | `node16` (=`nodenext`) | `bundler` | `node` (=node10, 옛 설정) |
| --- | --- | --- | --- |
| 상대 import 확장자 | **필수** — `import './health.js'` | 생략 가능 — `import './HealthBadge'` | 생략 가능 |
| `package.json` `exports` | 존중 | 존중 | **무시** |
| `imports`(`#private`) | 존중 | 존중 | 무시 |
| ESM/CJS 구분 | **엄격** — `type` 필드로 파일마다 판정, 잘못된 조합은 에러 | 신경 쓰지 않음 | 사실상 CJS 가정 |
| 조건부 `exports` | `import`/`require`/`node` 조건을 실제 문맥대로 고름 | `import` 조건 위주로 느슨하게 | 조건 자체를 안 봄 |
| 함께 쓸 수 있는 `module` | `node16`/`nodenext` | `esnext`/`preserve`만 (emit 불가에 가까움) | 제약 느슨 |

**공통점이 차이보다 중요할 때가 있다(필수).** `node16`과 `bundler`는 **둘 다 `exports`를 존중한다.** 그래서 어떤 앱이 `bundler`를 쓰더라도 `@platform/core/dist/internal/thresholds` 같은 뒷문 접근은 양쪽에서 똑같이 막힌다 — 패키지 정보 은닉 검사가 두 앱 모두에서 성립하는 이유다. 이 관점에서 위험한 건 오직 `node`(node10)이다. node10은 `exports`를 아예 보지 않고 디스크에 파일이 있으면 그냥 가져오므로, 정보 은닉 설계를 **통째로 무력화**한다. TypeScript 7이 node10을 하드 에러로 막은 건 "실수로 뒷문을 열어 두는 선택지" 자체를 없앤 것이다.

**배분은 "누가 찾느냐"만 보고 결정한다(필수).** 모노레포에서 패키지별로 다르게 주는 근거는 하나다.

```jsonc
// packages/tsconfig/node.json  → core, contracts, api
{ "module": "node16", "moduleResolution": "node16" }

// packages/tsconfig/react.json → web
{ "module": "preserve", "moduleResolution": "bundler", "noEmit": true }
```

| package | 최종적으로 누가 파일을 찾나 | 그래서 설정 |
| --- | --- | --- |
| `api`, `core`, `contracts` | **Node**가 직접 (`node apps/api/dist/main.js`) | `node16` |
| `web` | **Vite**가 미리 다 합쳐 놓음 | `bundler` (+ `noEmit: true`) |

api·core·contracts의 `dist`는 Node가 직접 실행하므로 타입검사기의 가정과 런타임 해석이 어긋나면 안 된다(`type: "commonjs"` 지정도 여기에 맞물린다). web의 `dist`는 Vite가 번들한 결과물이라 Node의 해석 규칙이 적용될 일이 없고, emit 책임도 Vite에 있으므로 `noEmit: true`가 자연스럽다.

**실패 모드 — 컴파일은 통과하는데 런타임이 죽는다(필수).** api에 `bundler`를 줬다고 하자. TypeScript는 "번들러가 알아서 찾아 줄 테니 확장자 없어도 OK" 하고 통과시킨다. 그런데 api는 번들러를 쓰지 않고 `node dist/main.js`로 실행된다. Node는 봐주지 않으므로 실행 즉시 `ERR_MODULE_NOT_FOUND`로 죽는다. **타입검사 초록불 + 앱 안 뜸**이 이 설정을 잘못 골랐을 때의 전형적인 증상이다.

**흔한 오해 — "`bundler`가 최신이고 관대하니 전부 그걸 쓰면 되지 않나"(곁가지).** 아니다. `bundler`는 **emit과 함께 쓸 수 없는 쪽에 가깝다.** `module`을 `esnext`/`preserve`로 강제하므로 그 결과물을 그대로 Node에 던지면 CJS/ESM 판정이 어긋나 깨진다. `bundler`는 "뒤에 번들러가 반드시 있다"는 약속을 전제로만 안전하다.

**가깝지만 아닌 것 — `node16` vs `nodenext`(곁가지).** 동작은 사실상 같고 차이는 **버전 고정 여부**다. `node16`은 Node 16 시점 규칙에 고정되고, `nodenext`는 TypeScript가 아는 최신 Node 규칙을 따라간다(그래서 TypeScript를 올리면 동작이 바뀔 수 있다). 재현성을 우선하면 `node16`, 최신 규칙 추적을 우선하면 `nodenext`를 고른다.

## 용어 풀이

- **모듈 해석(module resolution)** — import 주소 문자열을 디스크의 실제 파일로 바꾸는 절차. 깨짐: TypeScript가 이 절차를 수행한다고 오해하면 설정의 의미가 사라진다 — TypeScript는 **해석자를 흉내 내 검사만** 한다.
- **`moduleResolution`** — 어느 해석자의 규칙으로 검사할지 고르는 컴파일러 옵션. 깨짐: emit 형식을 정하는 `module`과 혼동. 둘은 짝이 맞아야 하는 별개 옵션이다.
- **`exports` 필드(export map)** — `package.json`에서 외부에 공개할 진입점만 선언하는 필드. 깨짐: node10 해석에서는 무시되므로 "선언했으니 막혔다"는 보장이 해석 모드에 달려 있다.
- **조건부 exports(conditional exports)** — `import`/`require`/`node` 같은 조건별로 다른 파일을 내보내는 `exports` 형태. 깨짐: `bundler`는 조건을 느슨하게(주로 `import`) 고르므로 런타임 문맥과 다를 수 있다.
- **`ERR_MODULE_NOT_FOUND`** — Node ESM이 주소를 실제 파일로 못 바꿨을 때의 런타임 에러. 깨짐: 타입 에러가 아니라 실행 에러라서 CI의 typecheck 단계로는 잡히지 않는다.

## 확인 질문

1. `core`가 `node16`인데, `web`이 `import { HEALTH_PATH } from '@platform/contracts'`를 확장자 없이 쓰는 건 왜 문제가 되지 않나? <details><summary>답</summary>확장자 규칙은 그 파일을 해석하는 쪽의 설정을 따른다. `web`의 해석자는 Vite이고 설정은 `bundler`이므로 확장자를 생략해도 된다. 게다가 패키지 진입점 import는 `exports` 맵이 해석하므로 상대 경로 확장자 규칙과 무관하다. `core`의 `node16`은 `core` 내부 상대 import에만 적용된다.</details>
2. 타입검사(`tsc --noEmit`)는 통과하는데 `node dist/main.js`가 `ERR_MODULE_NOT_FOUND`로 죽는다면 가장 먼저 볼 곳은? <details><summary>답</summary>그 패키지의 `moduleResolution`. Node가 최종 실행자인데 `bundler`로 검사했을 가능성이 높다 — `node16`으로 바꾸면 상대 import 확장자 누락이 컴파일 타임에 잡힌다.</details>
3. (본문 밖) 어떤 패키지의 `dist`를 api는 `node`로 직접 실행하고 web은 Vite로 번들해 함께 쓴다면, 그 패키지에는 어느 모드를 줘야 하나? <details><summary>답</summary>더 깐깐한 쪽인 `node16`. 번들러는 Node 규칙을 만족하는 코드도 문제없이 처리하지만(확장자가 붙어 있어도 그대로 찾는다) 그 반대는 성립하지 않는다. 두 소비자가 섞이면 제약이 강한 해석자를 기준으로 맞추는 것이 안전하다.</details>

## 근거

- 실측: `packages/tsconfig/node.json`(`module`·`moduleResolution` 모두 `node16`) → core·contracts·api, `packages/tsconfig/react.json`(`moduleResolution: "bundler"`, `module: "preserve"`, `noEmit: true`) → web. api 실행 형태는 `node apps/api/dist/main.js`.
- 실측: TypeScript 7이 `moduleResolution: "node"`(node10)를 하드 에러로 막았고, 그 덕에 패키지 정보 은닉 검사가 성립함 — `milestones/01:39-42`.
- 1차 출처(링크만 기록, 개별 확인 안 됨): TypeScript Handbook의 *Modules — Theory / Reference*(`moduleResolution` 모드별 규칙), Node.js *ESM* 문서(확장자 자동 보정 없음, `exports` 해석 규칙).

## 관련 개념

- 뒤: [패키지 소비 방식](/study-note/turborepo/package-consumption/) — `dist`를 소비하나 소스를 직접 소비하나가 곧 "누가 해석하나"를 정하고, 그것이 이 설정의 입력이 된다.
- 관련: [turbo.json 구성과 상속](/study-note/turborepo/config-inheritance/) — 공용 tsconfig를 패키지별로 상속·덮어쓰는 것과 같은 구조로 해석 모드가 배분된다.
