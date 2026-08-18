
<!-- q id=20260809-000308 cat="architecture" -->
### CS 용어로 다시 domain, 비즈니스 로직 등 현재 아키텍처를 설명해주고, 필요하면 내가 비유를 요청할게 다시 설명해줘.

## 현재 아키텍처 — 용어로

### 형태

**패키지 단위로 계층을 나눈 아키텍처**다. 한 프로젝트 안의 폴더 구분이 아니라, **독립 배포 단위(package)** 자체를 계층으로 삼았다. 계층 위반이 컨벤션 위반이 아니라 **모듈 해석 실패**가 되는 이유가 이것이다.

목표 형태는 **헥사고날(포트-어댑터)**이고, 지금은 그중 **의존 규칙(dependency rule)**만 세워진 상태다. 포트·어댑터 자체는 M02 ‹`PROJECT.md:42-44`, `milestones/01:110`›.

### 계층별 배치

| 계층 | package | tag | 담는 것 |
| --- | --- | --- | --- |
| **도메인 계층** | `@platform/core` | `domain` | 불변식과 비즈니스 규칙. 순수 함수 `evaluateHealth`, 내부 상수 |
| **공유 계약** | `@platform/contracts` | `shared` | 프로세스 경계를 넘는 데이터 스키마(DTO)와 그 식별자 |
| **애플리케이션·전송 계층** | `@platform/api` | `app` | DI 컨테이너, HTTP 라우팅, 도메인→DTO 매핑 |
| **프레젠테이션 계층** | `@platform/web` | `app` | 렌더링. 상태 판단 없음 |
| **빌드 설정** | `@platform/tsconfig` | `config` | 컴파일러 정책. 런타임 코드 없음 |

### 의존 규칙

**규칙 자체**는 tag 간 denylist로만 선언돼 있다 ‹`turbo.json:15-27`›.

```
domain  deny → [app, shared]
shared  deny → [app]
app     (규칙 없음)
```

읽는 법: **화살표는 안쪽으로만 간다.** `app`은 무엇이든 의존할 수 있고, `domain`은 아무것도 의존할 수 없다. `shared`는 그 사이 — `domain`은 의존할 수 있게 열려 있지만 실제로는 아무 의존도 없다.

**규칙의 실현**은 각 `package.json`의 `dependencies`에 있다.

- `core` → 없음 (도메인이 아무것도 모른다)
- `contracts` → 없음
- `api` → `core`, `contracts` (양쪽을 아는 유일한 지점)
- `web` → `contracts`만 (도메인 비의존)

`api`가 두 계층을 다 아는 것이 우연이 아니라 **설계상 유일한 매핑 지점**이다. `HealthService.check()`가 도메인 반환값을 DTO로 옮기고, 그 외 어디에도 도메인 타입이 나가지 않는다.

### 캡슐화의 두 층위

같은 "정보은닉"이 서로 다른 두 메커니즘으로 걸려 있다.

1. **package 간 경계** — `exports` 필드가 public surface를 정의한다. `core`는 `"."` 하나만 열고, `dist/internal/*`는 파일이 실재해도 해석 불가다. **모듈 해석기(resolver) 층위의 강제**다.
2. **package 내부 응집** — `index.ts`가 배럴로서 무엇을 재수출할지 고른다. `evaluateHealth`와 `HealthLevel`만 나가고 `DEGRADED_LATENCY_MS`는 안 나간다. **컴파일러 층위의 선택**이다.

둘 다 있어야 한다. `exports`만 있고 `index.ts`가 전부 재수출하면 표면이 넓어지고, 반대면 경로를 우회당한다.

### 도메인 타입과 계약 타입의 분리

`HealthLevel`(`'ok' | 'degraded'`)과 `HealthResponse.status`(`'ok' | 'degraded'`)는 **구조적으로 동일하지만 별개 선언**이다 ‹`contracts/src/health.ts` 주석›.

의도: 도메인 모델의 변경이 **자동으로 API breaking change가 되지 않도록** 결합을 끊어 둔 것. 지금은 중복으로 보이지만, 두 축이 다른 속도로 변할 때 이 분리가 값을 낸다. 매핑 비용은 `api`의 한 지점이 흡수한다.

### 강제 메커니즘

제약이 **선언과 검증 두 곳에 나뉘어 있지 않고, 선언 한 곳 + 검증 명령 두 개** 구조다.

- **선언(단일 원본)**: `turbo.json`의 `boundaries.tags` + 각 package의 `tags`
- **검증 1 — `turbo boundaries`**: package 외부 파일 import / 미선언 의존 / tag denylist 위반
- **검증 2 — `turbo run typecheck`**: `exports` 밖 접근 (boundaries는 이걸 못 본다)

같은 규칙을 ESLint 등 다른 도구 설정에 복제하지 않는 것이 명시적 제약이다 ‹`milestones/01:127-128`, `101-106`›. 강제 **지점**은 늘리되 **원본**은 늘리지 않는다.

### 아직 세워지지 않은 부분

검사는 존재하지만 **자동으로 실행되는 지점이 없다**. pre-push 훅(평가 12)과 watch 루프(평가 13)가 미구현이고, `.run/state.json`은 M01 `in-progress`다.

<small style="opacity:0.55">‹00:03 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01(package 경계와 정보은닉) 구현을 `/lbl`로 정독하던 중. 앞서 같은 구조를 식당 비유로 설명받은 뒤, 비유를 걷어내고 표준 CS/아키텍처 용어로 다시 달라고 요청한 항목.</small>

<!-- /q -->

<!-- q id=20260809-001125 cat="architecture" -->
### DI 컨테이너가 뭐지? 이걸 모르는건 어떤 배경 지식이 없어서 일까? 간단히 설명해줘

**한 줄**
DI 컨테이너는 **객체를 누가 `new` 할지를 대신 맡아 주는 런타임 레지스트리**다 — 클래스가 "나는 이런 게 필요하다"고 생성자에 타입으로 적어 두면, 컨테이너가 그걸 읽고 알아서 만들어 넣어 준다.

**실측·구체 — 이 레포에 그대로 있다**

```ts
// apps/api/src/health/health.controller.ts
@Controller()
export class HealthController {
  constructor(private readonly health: HealthService) {}   // ← "필요하다"고 적기만 함
}

// apps/api/src/health/health.module.ts
@Module({
  controllers: [HealthController],
  providers: [HealthService],                              // ← "만들 줄 안다"고 등록
})
export class HealthModule {}

// apps/api/src/main.ts
const app = await NestFactory.create(AppModule);           // ← 여기서 컨테이너가 실제로 조립
```

`new HealthService()`를 **아무도 직접 부르지 않는다.** `NestFactory.create()`가 모듈에 등록된 provider 목록을 보고, 생성자가 요구하는 타입을 맞춰서 인스턴스를 만들어 꽂는다. 여기서 Nest가 컨테이너다.

**쉽게**

원래대로면 컨트롤러가 이렇게 살아야 한다.

```ts
const controller = new HealthController(new HealthService());
```

의존이 3단계만 깊어져도 이 `new` 사슬을 손으로 다 적어야 하고, 테스트에서 가짜 객체로 바꾸려면 그 사슬을 또 다시 적어야 한다. DI 컨테이너는 **이 조립 코드를 통째로 없앤다.** 부품 목록만 등록해 두면 조립은 컨테이너가 한다.

**왜 타입만 적었는데 알아보나 — 여기가 진짜 핵심**

TypeScript 타입은 컴파일하면 지워진다. 그런데 `emitDecoratorMetadata`를 켜면 컴파일러가 데코레이터 붙은 클래스에 한해 **생성자 파라미터 타입 목록을 `design:paramtypes`라는 런타임 메타데이터로 남긴다.** Nest는 실행 중에 이걸 `reflect-metadata`로 읽어서 "아, 이 자리엔 `HealthService`가 필요하구나"를 안다.

그래서 이 레포에 그 설정들이 있는 것이다 — `apps/api/tsconfig.json`의 `experimentalDecorators`·`emitDecoratorMetadata`, `main.ts` 첫 줄의 `import 'reflect-metadata'`. **그리고 `vitest.config.mts`가 변환기를 esbuild → SWC로 바꾼 이유도 정확히 이것**이다. esbuild는 이 메타데이터를 emit하지 않아서, 그대로 두면 테스트에서 DI가 해석되지 않는다.

**이걸 모르는 건 어떤 배경 지식이 없어서인가**

빠진 건 "DI 컨테이너"라는 단어가 아니라 그 아래 세 겹이다.

1. **객체 생성 책임을 누가 갖는가**라는 문제의식 — 프론트엔드/스크립트 위주로 코딩하면 `new`를 손으로 쓰거나 함수만 import하면 끝나서, "생성을 남에게 넘긴다"는 발상 자체가 생길 일이 없다. Java Spring·C# 계열에서는 첫날 배우는 문제다.
2. **IoC(제어의 역전)** — DI는 IoC의 한 형태다. "내가 라이브러리를 부른다"가 아니라 "프레임워크가 내 코드를 부른다"로 뒤집히는 구조. 컨테이너는 이 역전을 객체 생성에 적용한 것뿐이다.
3. **런타임 리플렉션과 메타데이터** — "타입은 컴파일 후 사라진다"는 TS 상식과 "타입 보고 주입한다"가 모순처럼 보이는데, 그 사이를 메꾸는 게 `design:paramtypes`다. 이 조각이 없으면 DI가 마법처럼 느껴진다.

**가깝지만 아닌 것**

**의존성 주입(DI) 패턴 ≠ DI 컨테이너.** 생성자로 의존을 받는 것까지가 DI 패턴이고, 이건 컨테이너 없이도 한다(`new HealthController(new HealthService())`도 엄연히 DI다). 컨테이너는 그 **조립을 자동화하는 도구**일 뿐이다. 그래서 "DI를 쓴다"와 "DI 컨테이너를 쓴다"는 다른 말이다 — 작은 프로젝트에서 컨테이너 없이 손으로 조립하는 선택은 충분히 정상이다.

**이 레포에서 왜 확인까지 했나**

`apps/api/src/health/health.test.ts`가 `@nestjs/testing`으로 앱을 실제로 띄운다. 스펙에 "DI가 실제로 해석되는 것까지 확인된다"고 적힌 이유가 이것이다 ‹`milestones/01:198-199`› — 컨트롤러가 `HealthService`를 실제로 받아 냈다면, 위 메타데이터 사슬(tsconfig → SWC → reflect-metadata)이 전부 살아 있다는 뜻이다.

<small style="opacity:0.55">‹00:11 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중. 직전 항목(20260809-000308)에서 `@platform/api`를 "DI 컨테이너, HTTP 라우팅, 도메인→DTO 매핑" 계층으로 설명한 데서 이어진 용어 질문.</small>

<!-- /q -->

<!-- q id=20260809-002036 cat="architecture" -->
### 그럼 DI 컨테이너 코드 설명에서 도메인은 어떻게 연계되지?

## 도메인은 DI 컨테이너 안에 **없다**

이게 핵심이다. 지금 컨테이너가 아는 객체는 둘뿐이다.

```
NestFactory.create(AppModule)
  └─ AppModule
      └─ HealthModule
          ├─ providers:   [HealthService]     ← 컨테이너가 만든다
          └─ controllers: [HealthController]  ← 컨테이너가 만들고, 위를 주입한다
```

`@platform/core`는 이 그래프에 등장하지 않는다. 연결은 **평범한 모듈 import 한 줄**이다.

```ts
// apps/api/src/health/health.service.ts
import { evaluateHealth } from '@platform/core';   // ← DI가 아니라 그냥 import

@Injectable()
export class HealthService {
  check(latencyMs: number): HealthResponse {
    return { status: evaluateHealth(latencyMs), service: '@platform/api' };
  }
}
```

`HealthService`는 **생성자가 아예 없다.** 주입받는 게 하나도 없다는 뜻이다. 도메인 함수는 주입 대상이 아니라 그냥 호출 대상이다.

### 왜 도메인은 컨테이너에 안 넣나

세 가지가 겹친다.

1. **주입할 이유가 없다.** DI가 값을 내는 건 "이 자리에 들어올 구현이 **바뀔 수 있을 때**"다. `evaluateHealth`는 상태 없는 순수 함수라 인스턴스가 하나일 필요도, 테스트에서 갈아 끼울 필요도 없다.
2. **넣으려면 도메인이 프레임워크를 알아야 한다.** `@Injectable()`을 붙이려면 `core`가 `@nestjs/common`을 import해야 하고, 그 순간 "도메인은 바깥을 모른다" ‹`PROJECT.md:41-44`›가 깨진다. 도메인이 전송 프레임워크에 묶이면 나중에 CLI·큐·다른 서버에서 재사용할 수 없다.
3. **경계 방향과도 맞다.** `api`(바깥) → `core`(안)로 화살표가 가는데, DI 등록은 `core`가 Nest를 향해 화살표를 되쏘는 모양이 된다.

여기서 알아 둘 사실 하나: **그 위반은 `turbo boundaries`가 못 잡는다.** tag 규칙은 workspace package 사이에만 적용되고, `@nestjs/common`은 외부 npm이라 tag가 없다. 즉 "도메인이 프레임워크를 import하지 않는다"는 현재 **사람이 지키는 규칙**이다.

### 그럼 DI는 언제 도메인과 만나나 — M02

지금은 안 만나지만, **포트-어댑터가 들어오는 순간 만난다** ‹`PROJECT.md:42-44`›.

```
core          : interface LlmPort { complete(...): Promise<string> }   ← 포트 소유
adapters/xxx  : class AnthropicAdapter implements LlmPort              ← 어댑터 구현
api           : providers: [{ provide: LLM_PORT, useClass: AnthropicAdapter }]
```

이때 `HealthService` 같은 애플리케이션 서비스가 생성자로 `@Inject(LLM_PORT) port: LlmPort`를 받는다. **도메인이 정한 인터페이스에, 컨테이너가 바깥 구현을 꽂는다** — 이게 의존성 역전(DIP)이고, DI 컨테이너의 원래 용도다.

주의할 지점: 인터페이스는 TS 타입이라 컴파일하면 사라진다. 그래서 `design:paramtypes`로는 못 찾고 **문자열/심볼 토큰(`LLM_PORT`)과 `@Inject()`가 필요**하다. 지금 `HealthController`가 클래스 타입만으로 주입받는 것과 다른 방식이 된다.

### 한 문장

**지금 구조에서 도메인과 DI는 만나지 않는다 — 도메인은 "무엇이 참인가"를 결정하는 순수 함수라 조립이 필요 없고, DI는 "무엇을 꽂을 것인가"가 열려 있는 자리에서만 일한다.** 그 자리가 M02에서 포트로 생긴다.

<small style="opacity:0.55">‹00:20 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중. 직전 항목(20260809-001125)의 DI 컨테이너 설명에 이어, `@platform/core` 도메인이 그 그래프의 어디에 붙는지 되물은 후속 질문.</small>

<!-- /q -->

<!-- q id=20260809-003011 cat="typescript" -->
### node16/bundler의 차이가 뭐지?

**한 줄**
**누가 이 import를 실제로 해석하느냐**의 차이다 — `node16`은 "런타임에 Node가 직접 찾는다"를 가정해 Node의 규칙을 그대로 흉내 내고, `bundler`는 "번들러가 대신 찾아 준다"를 가정해 그 규칙을 느슨하게 푼다.

**핵심 차이**

| | `node16` (=`nodenext`) | `bundler` |
| --- | --- | --- |
| 상대 import 확장자 | **필수** — `import './health.js'` | 생략 가능 — `import './HealthBadge'` |
| `package.json` `exports` | 존중 ✅ | 존중 ✅ |
| `imports`(`#private`) | 존중 ✅ | 존중 ✅ |
| ESM/CJS 구분 | **엄격** — `type` 필드로 파일마다 판정, 잘못된 조합은 에러 | 신경 안 씀 |
| 조건부 exports | `import`/`require`/`node` 조건을 실제 문맥대로 고름 | `import` 조건 위주로 느슨하게 |
| 쓸 수 있는 `module` | `node16`/`nodenext` | `esnext`/`preserve`만 (emit 불가에 가까움) |

**둘의 공통점이 이 레포에선 더 중요하다**: **둘 다 `exports`를 존중한다.** 옛 `node`(node10)만 무시한다. 그래서 web이 `bundler`를 써도 `@platform/core/dist/internal/...` 접근은 똑같이 막힌다 — M01의 정보은닉 검사가 두 앱 모두에서 성립하는 이유다.

**실측·구체 — 이 레포의 배분**

```jsonc
// packages/tsconfig/node.json  → core, contracts, api
{ "module": "node16", "moduleResolution": "node16" }

// packages/tsconfig/react.json → web
{ "module": "preserve", "moduleResolution": "bundler", "noEmit": true }
```

배분 근거가 명확하다.

- **api·core·contracts는 `node16`**: 이들의 `dist`는 **Node가 직접 실행한다**(`node apps/api/dist/main.js`). 타입검사기가 가정한 해석 방식과 런타임 해석 방식이 어긋나면, 컴파일은 통과하는데 실행이 `ERR_MODULE_NOT_FOUND`로 죽는다. `type: "commonjs"`도 여기 맞물린다.
- **web은 `bundler`**: `dist`에 나가는 건 Vite가 번들한 결과물이라 **Node의 해석 규칙이 적용될 일이 없다.** `import { App } from './App'`처럼 확장자 없이 쓰고, 나중에 CSS·에셋 import도 그대로 쓸 수 있다. `noEmit: true`인 것도 emit 책임이 Vite에 있기 때문이다.

**왜 그렇게 되는가**

`node16`이 확장자를 강요하는 건 TypeScript의 취향이 아니라 **Node ESM의 실제 규칙**이다. Node는 ESM에서 `./App`을 `./App.js`로 자동 보정해 주지 않는다(CJS의 `require`는 해 준다). `node16`은 "네가 쓴 그대로 Node가 찾는다"를 모델링하므로 이 규칙을 컴파일 타임에 그대로 들이민다.

`bundler`는 정반대 전제다. Vite/webpack/esbuild는 확장자 보정, `index` 자동 탐색, alias 해석을 전부 해 준다. 그러니 타입검사기가 Node 규칙을 강요하면 **번들러에선 멀쩡히 도는 코드에 빨간 줄이 뜬다.** `bundler`는 그 간극을 없애려고 2022년에 추가된 모드다.

**흔히 잘못 이해하는 지점**

"`bundler`가 더 최신이고 관대하니까 다 그걸 쓰면 되지 않나" — 아니다. **`bundler`는 emit과 함께 쓸 수 없는 쪽에 가깝다.** `module`을 `esnext`/`preserve`로 강제하므로, 그 결과물을 그대로 Node에 던지면 CJS/ESM 판정이 어긋나 깨진다. `bundler`는 "뒤에 번들러가 반드시 있다"는 약속을 전제로만 안전한 설정이다.

**가깝지만 아닌 것**

`node16` vs `nodenext`는 사실상 같은 동작이고, 차이는 **버전 고정 여부**다. `node16`은 Node 16 시점 규칙에 고정, `nodenext`는 TS가 아는 최신 Node 규칙을 따라간다(그래서 TS 업그레이드 시 동작이 바뀔 수 있다). 이 레포가 `node16`을 고른 건 재현성 쪽이다.

`node`(node10)는 완전히 다른 물건이다 — `exports`를 **무시**하고 파일 경로를 그대로 따라간다. TS 7이 이걸 하드 에러로 막았고 ‹`milestones/01:39-40`›, 막았기 때문에 이 레포의 정보은닉 검사가 성립한다.

<small style="opacity:0.55">‹00:30 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중 3번 가지(TS6 빌드 / TS7 타입검사 분리)에서 나온 질문. `packages/tsconfig/node.json`·`react.json`의 moduleResolution 배분을 설명한 데서 이어짐.</small>

<!-- /q -->

<!-- q id=20260809-003741 cat="typescript" -->
### (node16/bundler) 아직 이해가 잘 안가는데 쉽게 설명해줘.

**한 줄로 다시**

`import` 한 줄을 **실제 파일로 바꿔 주는 사람이 누구냐**의 차이다. Node면 `node16`, 번들러면 `bundler`.

---

**먼저 이걸 잡아야 한다: TypeScript는 코드를 실행하지 않는다.**

`import { App } from './App'` 이라고 쓰면, 이건 그냥 **주소**다. 언젠가 누군가는 이 주소를 보고 진짜 파일을 찾아와야 한다. TypeScript는 그 일을 **안 한다.** 대신 이렇게만 한다.

> "나중에 이 주소를 찾을 사람이 있을 텐데, 그 사람 규칙대로 미리 검사해 줄게. 근데 그게 누구야?"

`moduleResolution`이 바로 그 대답이다. **"누구 흉내를 낼래?"**

---

**후보는 둘이다.**

**Node — 깐깐한 쪽**

Node는 실행 중에 파일을 찾는다. 그리고 봐주는 게 없다.

```ts
import { evaluateHealth } from './health';      // ❌ Node: 그런 파일 없는데?
import { evaluateHealth } from './health.js';   // ✅ Node: 찾았다
```

확장자를 안 적으면 못 찾는다. 알아서 `.js`를 붙여 주지 않는다.

**번들러(Vite) — 친절한 쪽**

번들러는 실행 전에 미리 파일을 다 모아서 하나로 합친다. 그 과정에서 알아서 다 해 준다.

```ts
import { App } from './App';       // ✅ Vite: .tsx 붙여서 찾아 줄게
import styles from './app.css';    // ✅ Vite: CSS도 처리해 줄게
```

---

**그래서 잘못 고르면 어떻게 되나**

이게 핵심이다. **컴파일은 통과하는데 실행이 죽는다.**

api에 `bundler`를 썼다고 해 보자. TypeScript는 "번들러가 알아서 찾아 줄 거니까 확장자 없어도 OK" 하고 통과시킨다. 그런데 api는 번들러를 안 쓴다 — `node apps/api/dist/main.js`로 **Node가 직접 실행한다.** Node는 봐주지 않으니 실행하자마자 "파일 없음" 에러로 죽는다.

**타입검사는 초록불인데 앱은 안 뜨는 상황.** 이걸 막으려고 배분을 나눈 것이다.

| package | 최종적으로 누가 파일을 찾나 | 그래서 설정 |
| --- | --- | --- |
| `api`, `core`, `contracts` | **Node**가 직접 (`node dist/main.js`) | `node16` |
| `web` | **Vite**가 미리 다 합쳐 놓음 | `bundler` |

**"누가 찾느냐"에 맞춰 고르는 것**, 그게 전부다.

---

**그럼 `exports`(정보은닉)는 어느 쪽에서 통하나 — 둘 다 통한다**

이게 이 레포에서 중요한 부분이다.

`node16`도 `bundler`도 **`package.json`의 `exports`를 존중한다.** 그래서 web이 `bundler`를 쓰든 api가 `node16`을 쓰든, `@platform/core/dist/internal/thresholds` 같은 뒷문 접근은 **양쪽 다 막힌다.**

문제는 옛날 설정인 `node`(=node10) 하나뿐이다. 이건 `exports`를 **아예 안 본다.** 파일이 디스크에 있으면 그냥 가져온다. 즉 M01의 정보은닉 검사가 **통째로 무력화된다.**

그래서 TS 7이 `node`를 하드 에러로 막아 준 게 이 레포엔 오히려 다행이었다 — **"실수로 뒷문을 열어 두는 선택지" 자체가 사라진 것**이다 ‹`milestones/01:39-42`›.

---

**한 문장으로 정리**

`node16`과 `bundler`는 **"import 주소를 누가 해석하느냐"**의 차이일 뿐이고, **정보은닉(`exports`) 관점에서는 둘이 똑같이 안전하다.** 위험한 건 오직 옛 `node` 하나다.

**확인 질문**: `core`가 `node16`인데, `web`이 `import { HEALTH_PATH } from '@platform/contracts'`를 확장자 없이 쓰는 건 왜 문제가 안 될까?

<small style="opacity:0.55">‹00:37 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중. 직전 항목(20260809-003011)의 node16/bundler 비교가 이해되지 않아 쉬운 설명을 다시 요청한 후속.</small>

<!-- /q -->

<!-- q id=20260809-004508 cat="monorepo" -->
### 실제 레포 안에서 수행할 때는 .ts, .tsx 자체로 해석해서 typecheck, test를 수행하고 build 시에서 ^build 가 선행되는 방식도 있지 않아?

**한 줄**
있다 — 그게 Turborepo가 **Just-in-Time Package**라고 부르는 방식이고, 지금 이 레포가 쓰는 건 그 반대인 **Compiled Package**다. 그리고 이 레포가 후자를 고를 수밖에 없었던 이유는 딱 하나, **`apps/api`가 `node dist/main.js`로 실행되기 때문**이다.

**두 방식의 모양**

```jsonc
// (A) Compiled Package — 지금 이 레포
"exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } }

// (B) Just-in-Time Package — 질문이 말한 방식
"exports": { ".": "./src/index.ts" }
```

(B)로 가면 `turbo.json`이 이렇게 바뀐다.

```jsonc
"build":     { "dependsOn": ["^build"], "outputs": ["dist/**"] },
"typecheck": { },   // ← ^build 불필요. .ts를 직접 읽는다
"test":      { }    // ← 마찬가지
```

`typecheck`가 `@platform/core`의 `src/index.ts`를 **소스 그대로** 해석하니 `dist`가 있을 필요가 없다. 그래서 barrier가 사라지고 typecheck·test가 build를 안 기다린 채 병렬로 돈다.

**(B)의 장점 — 실제로 크다**

1. **라이브러리에 빌드 단계가 없어진다.** `core`·`contracts`의 `build` task 자체가 사라진다
2. **stale `dist` 문제가 원천 제거된다.** 소스를 고쳤는데 빌드를 안 해서 옛 타입이 보이는 상황이 안 생긴다
3. **에디터가 정의로 점프하면 `.d.ts`가 아니라 진짜 소스로 간다**
4. **task graph가 얕아진다** — 4번 가지에서 본 "typecheck가 남의 build를 기다린다"는 직렬 구간이 없어진다

**그런데 이 레포에선 (B)가 안 된다 — 이유는 api다**

관건은 **"`@platform/core`의 TypeScript를 누가 컴파일해 주느냐"**다. (B)는 **소비자가 TS를 처리할 수 있을 때만** 성립한다.

- **`web`은 된다.** Vite가 workspace 의존의 `.ts`도 그대로 트랜스파일한다. JIT 방식의 전형적인 소비자다.
- **`api`는 안 된다.** `nest build`(내부적으로 `tsc`)는 **`apps/api/src`만 컴파일한다.** `@platform/core`의 `.ts`는 컴파일해 주지 않는다 — `rootDir: "src"`라서 그 밖의 파일을 emit하려 하면 에러가 나고, 어찌어찌 통과해도 `dist/main.js`가 실행 시점에 찾을 `.js`가 존재하지 않는다.
- 즉 **`node apps/api/dist/main.js`(평가 9)가 도는 순간, `core`는 `.js`를 내놓아야 한다.**

api를 (B)로 만들려면 선택지가 둘인데 둘 다 값이 크다.

- `nest build --webpack`으로 **번들링**해서 의존까지 하나로 말아 넣기 — 서버를 번들링하는 부담이 생긴다
- `tsx`/`ts-node` 같은 런타임 트랜스파일러로 실행 — 프로덕션 실행 모델이 바뀐다

**하이브리드도 있다 (배경)**

`publishConfig`로 **개발 중엔 소스, 배포 시엔 `dist`**를 가리키게 하는 방식이 있다. 개발 편의와 배포 안정성을 둘 다 취하지만, **"지금 어느 쪽이 보이는가"가 상황에 따라 달라진다.** M01의 목표가 "경계가 실행 가능한 실패로 드러난다"인데, 해석 대상이 컨텍스트마다 바뀌면 그 증명이 흔들린다 — 선행 추상화 금지 원칙 ‹`PROJECT.md:28-29`›에도 걸린다.

**정보은닉 관점에선 둘 다 동등하다**

이건 짚고 갈 만하다. (B)로 가도 `exports`가 `"." → ./src/index.ts` 하나만 열면 `@platform/core/src/internal/thresholds`는 **똑같이 막힌다.** 즉 M01의 핵심 주장(평가 5)은 두 방식 모두에서 성립한다. **갈리는 건 은닉이 아니라 실행 모델이다.**

**정리 — 고르는 기준 한 줄**

| 소비자가 TS를 컴파일할 수 있나 | 방식 |
| --- | --- |
| 예 (Vite/Next/webpack이 받는다) | **Just-in-Time** — `exports` → `src` |
| 아니오 (Node가 직접 실행한다) | **Compiled** — `exports` → `dist` |

이 레포는 소비자에 **Node가 직접 실행하는 `api`**가 있으므로 Compiled가 된 것이고, 그 결정의 파생이 `typecheck`·`test`의 `dependsOn: ["^build"]`다. **`^build` 세 줄은 취향이 아니라 실행 모델이 강제한 결과다.**

*(주: (B)로 바꿨을 때 `nest build`가 정확히 어떤 에러를 내는지는 이 세션에서 실행해 확인하지 않았다. 위 설명은 `apps/api/tsconfig.json`의 `rootDir: "src"`와 `node dist/main.js` 실행 방식에서 따라 나오는 추론이다.)*

<small style="opacity:0.55">‹00:45 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중 4번 가지(task graph와 캐시, `dependsOn: ["^build"]`)를 읽고 나온 대안 설계 질문.</small>

<!-- /q -->

<!-- q id=20260809-004946 cat="monorepo" -->
### publishConfig를 활용하면 단점이 있나? 이 방식에 대해서 쉽게 설명해줘. 프로젝트에 적용할 마일스톤 생성할 수 있나

**한 줄**
`publishConfig`는 **개발/배포 스위치가 아니라 npm 발행 전용 치환기**다 — `pnpm publish`(또는 `pnpm pack`) 하는 순간에만 필드가 바뀐다. **이 레포는 아무것도 발행하지 않으므로 넣어도 아무 일이 일어나지 않는다.**

먼저 앞서 제가 말한 "개발 중엔 소스, 배포 시엔 dist"는 부정확했습니다. 정확히는 **"개발 중엔 소스, npm 발행물엔 dist"**입니다. Docker 이미지 빌드(M07)는 발행이 아니라서 치환이 안 걸립니다 — 결론이 달라지는 차이라 바로잡습니다.

**어떻게 동작하나**

```jsonc
// packages/core/package.json
{
  "exports": { ".": "./src/index.ts" },        // ← 레포 안에서는 이게 보인다

  "publishConfig": {
    "exports": { ".": "./dist/index.js" },     // ← pnpm publish 할 때만 이걸로 갈아 끼운다
    "types": "./dist/index.d.ts"
  }
}
```

`pnpm publish`가 tarball을 만들 때 `publishConfig` 안의 값들을 **최상위로 끌어올려 덮어쓴다.** 그래서 npm에 올라간 패키지를 남이 설치하면 `dist`를 보고, 레포 안에서 개발할 때는 `src`를 본다.

**단점**

1. **발행하지 않으면 죽은 설정이다.** 이 레포의 모든 package는 `"private": true`고 npm에 올라갈 일이 없다. `api`의 런타임 문제(`node dist/main.js`가 `core`의 `.js`를 필요로 함)는 **전혀 해결되지 않는다.** ← 이게 가장 큰 단점이자, 이 레포에 안 맞는 결정적 이유다
2. **진실이 두 개가 된다.** 개발 중 타입검사가 보는 것과 발행물이 보는 것이 다르다. `src`에서는 통과하는데 `dist`에는 그 export가 없는 상황이 성립한다 — 그리고 **레포 안에서는 절대 안 잡힌다.**
3. **검증하려면 실제로 발행/설치해 봐야 한다.** "실행 가능한 실패로 만든다"는 M01의 기조와 정반대다. 깨짐이 발행 이후에야 드러난다
4. **도구 편차가 있다.** `publishConfig` 안에서 `exports`까지 치환해 주는 건 pnpm의 확장 동작에 가깝다. npm/yarn은 지원 범위가 다르다 — 패키지 매니저를 갈아타면 조용히 안 먹을 수 있다
5. **`exports`를 두 벌 관리하게 된다.** 서브패스를 추가하면 두 곳을 다 고쳐야 하고, 한쪽만 고치는 순간 2번 문제가 된다

**언제 쓰는 게 맞나**

**진짜로 npm에 발행하는 라이브러리를 모노레포에서 개발할 때**다. 그때는 "개발자는 소스로 즉시 피드백 받고, 사용자는 컴파일된 결과물을 받는다"가 정확히 원하는 그림이다. 발행 대상이 없으면 쓸 자리가 없다.

**흔히 잘못 이해하는 지점**

`publishConfig`를 "dev/prod 분기"로 읽는 것 — 저도 앞에서 그렇게 뭉갰다. 실제 트리거는 **환경이 아니라 `publish`/`pack` 명령**이다. 배포 파이프라인이 Docker 빌드라면 이 필드는 존재하지 않는 것과 같다.

---

## 마일스톤으로 만들 수 있나

**만들 수 있다.** `PROJECT.md`에 "스택을 늘려야 할 필요가 생기면 마일스톤을 추가한다. 기존 마일스톤에 끼워 넣지 않는다" ‹`PROJECT.md:56`›라는 규칙이 이미 있어서, 절차상 제자리에 있는 요청이다.

다만 **주제를 `publishConfig`로 잡으면 마일스톤이 서지 않는다** — 발행 대상이 없어서 판정할 실행 결과가 안 나온다. 대신 이렇게 잡으면 선다.

**제안: [중급] package 소비 방식 — Just-in-Time vs Compiled**

- **답하는 질문**: 내부 package를 소스로 소비할 때와 산출물로 소비할 때, task graph·피드백 속도·런타임이 각각 어떻게 달라지는가
- **다루는 것**: `contracts`를 JIT(`exports` → `src`)로 바꿔 보고 `typecheck`에서 `^build`를 떼어 냈을 때 무엇이 통과하고 무엇이 깨지는지 실측 / `api`에서는 왜 안 되는지를 **실제 에러로** 확인 / `publishConfig` 방식은 왜 이 레포에 적용점이 없는지 확인
- **판정 기준 예시**: JIT 전환 후 `turbo run typecheck` 종료 코드 0 + `^build` 제거로 task graph가 얕아짐을 `--graph`로 확인 / `api`를 JIT로 바꾸면 `node dist/main.js`가 실패하고, 되돌리면 통과
- **위치**: M06(증분 빌드와 최종 artifact) 앞 또는 뒤. 선행은 M01

**확인 질문**: 이 방향으로 `milestones/`에 스펙을 만들까요? 만든다면 번호를 어디에 끼울지(기존 M06~M09를 밀지, 뒤에 M10으로 붙일지)도 정해야 합니다.

<small style="opacity:0.55">‹00:49 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중. 직전 항목(20260809-004508)에서 JIT vs Compiled package를 다루며 하이브리드로 언급한 `publishConfig`에 대한 후속 질문. 답변에서 앞선 "개발/배포 스위치" 설명을 "npm 발행 전용 치환"으로 정정함.</small>

<!-- /q -->

<!-- q id=20260809-005616 cat="architecture" -->
### web도 port&adapter 등 정보은닉, 포트와 어댑터, 단일 책임이 적용될 수 있을 것 같은데, packages/ 하위에 함께 위치하는게 일반적인 선택인가? 그리고 zod 같은 툴들도 활용할 수 있을텐데

## 1. web에도 포트-어댑터가 선다 — 지금 코드에 그 자리가 비어 있다

원칙 자체는 런타임 무관이다. 지금 `App.tsx`를 보면 자리가 보인다.

```tsx
// apps/web/src/App.tsx — 컴포넌트가 fetch를 직접 안다
fetch(HEALTH_PATH).then((res) => res.json() as Promise<HealthResponse>)
```

포트-어댑터로 가르면 이렇게 된다.

```ts
// port — "무엇이 필요한가"만 선언. fetch도 axios도 모른다
export interface HealthGateway { load(): Promise<HealthResponse> }

// adapter — 바깥 기술
export class HttpHealthGateway implements HealthGateway { /* fetch */ }
export class FakeHealthGateway implements HealthGateway { /* 테스트용 */ }
```

**web의 "바깥 기술"이 무엇인지가 서버와 다를 뿐이다** — HTTP, `localStorage`, 라우터, 브라우저 API. 컴포넌트가 이것들을 직접 알면 테스트할 때마다 브라우저를 흉내 내야 한다. 지금 `HealthBadge`가 테스트하기 쉬운 이유도 같은 원리다 — **받아서 그리기만 하고 아무것도 가져오지 않는다.**

## 2. `packages/` 하위에 함께 두는 게 일반적인가 — 그렇다, 다만 이름이 일을 한다

**flat이 가장 흔하다.** `pnpm-workspace.yaml`이 `packages/*`라서 그렇기도 하고, 무엇보다 **경계를 만드는 건 폴더가 아니라 package 이름과 tag**이기 때문이다.

규모가 커지면 두 갈래로 갈린다.

```
(A) flat + 이름 규약                    (B) 도메인별 중첩
packages/                               packages/
  billing-core/                           billing/
  billing-web/                              core/
  billing-api/                              web/
  catalog-core/                             api/
  ui/                                     catalog/
                                            core/
```

(B)를 쓰려면 workspace glob을 `packages/*/*`로 바꾸면 되고 pnpm·turbo 둘 다 지원한다. **선택 기준은 강제력이 아니라 가시성**이다 — `turbo boundaries`는 어느 쪽이든 tag만 본다. 디렉토리 구조는 **사람과 에이전트가 맥락을 잡는 속도**에만 영향을 준다.

**주의할 함정 하나: web의 도메인은 api의 도메인과 같은 것이 아니다.**

진짜 비즈니스 규칙은 서버가 소유한다 — 신뢰 경계가 거기 있으니까. 클라이언트가 같은 규칙을 복제하면 **진실이 두 벌**이 되고, 어긋나는 순간 어느 쪽이 맞는지 알 수 없다. web 쪽 "도메인"이라고 부를 만한 건 대개 다른 것이다.

- **뷰 상태 규칙** — 어떤 조건에서 어떤 화면이 되는가
- **입력 검증** — 서버 검증의 *복제*가 아니라 UX용 선제 피드백
- **표시 규칙** — 포맷팅, 정렬, 그룹핑

**정말 공유해야 하는 건 규칙이 아니라 계약이다.** 그리고 그게 다음 질문으로 이어진다.

## 3. zod — 지금 `contracts`의 정확한 빈틈을 메운다

현재 `@platform/contracts`는 **타입만** 갖고 있다. 타입은 컴파일하면 사라진다. 그래서 이 줄이 사실은 거짓말이다.

```tsx
res.json() as Promise<HealthResponse>   // ← 서버가 뭘 주든 "맞다"고 믿는다
```

서버가 필드를 바꿔도, 500 HTML을 뱉어도, 타입검사는 초록불이고 런타임에 `undefined`가 화면에 그려진다. **경계를 넘는 데이터를 실제로 검사하는 코드가 한 줄도 없다.**

zod를 넣으면 스키마 하나가 **타입과 런타임 검증의 단일 원본**이 된다.

```ts
// packages/contracts/src/health.ts
export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;   // ← 타입은 파생물
```

이건 이 프로젝트가 이미 지키는 사고와 같다 — **"의존 규칙의 원본은 `turbo.json` 하나"** ‹`milestones/01:127`›와 정확히 같은 형태로, **"계약의 원본은 스키마 하나"**가 된다. 타입과 검증이 따로 살면 반드시 어긋난다.

**트레이드오프도 분명하다.**

1. **`contracts`(tag `shared`)가 런타임 의존을 갖게 된다.** 지금은 컴파일하면 `HEALTH_PATH` 상수 하나만 남는 무게 없는 package인데, zod가 들어오면 **web 번들에 실려 나간다**
2. **web과 api가 zod 버전에 함께 묶인다.** 계약 package가 버전 결합 지점이 된다
3. **도메인에는 넣으면 안 된다.** `@platform/core`가 zod를 import하는 순간 "도메인은 바깥을 모른다"가 깨진다 — DI 컨테이너를 도메인에 넣지 않는 것과 같은 이유다. **검증은 경계에서 하고, 도메인은 이미 검증된 값을 받는다**

**흔한 절충**: 계약 package는 스키마를 소유하되, **파싱은 어댑터가 한다.** web에서는 `HttpHealthGateway`가 `HealthResponseSchema.parse()`를 부르고, api에서는 NestJS의 pipe가 입력에서 부른다. 그러면 스키마는 하나인데 **강제 지점이 양쪽 경계에 각각 선다** — M01이 "원본은 늘리지 않고 강제 지점만 늘린다"고 한 것과 같은 모양이다.

## 4. 마일스톤 관점

| 관심사 | 자리 |
| --- | --- |
| web의 포트-어댑터 | **M02**가 "포트와 어댑터"를 다루지만 개념·선행만 잡혀 있고, web 적용 여부는 진입 조사에서 확정 |
| 계약 package의 본격 사용 | **M03** — `milestones/01:111`이 명시적으로 M03으로 미뤄 뒀다 |
| 런타임 검증(zod) | **어느 마일스톤에도 이름으로 없다** |

zod는 스택 추가에 해당하므로 `PROJECT.md:56`("스택을 늘려야 할 필요가 생기면 마일스톤을 추가한다")이 적용되는 항목이다. 다만 **M03의 "계약 package 본격 사용" 안에 자연스럽게 들어갈 수도 있어서**, 별도 마일스톤이 필요한지는 M03 진입 조사에서 판단하는 게 순서에 맞다.

**확인 질문**: `contracts`가 런타임 의존(zod)을 갖게 되면 `shared` tag의 성격이 "무게 없는 타입 전달자"에서 "런타임 코드를 가진 공유 라이브러리"로 바뀝니다. 이 변화를 tag 이름이나 규칙으로 드러낼 필요가 있을까요, 아니면 `shared` 하나로 충분할까요?

<small style="opacity:0.55">‹00:56 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중. 앞선 web 다중 서비스·FSD/MFA 논의에 이어, web 쪽에도 포트-어댑터를 적용할 때의 배치 관행과 zod 도입 지점을 물은 질문.</small>

<!-- /q -->

<!-- q id=20260809-010029 cat="architecture" -->
### 런타임 검증 라이브러리 자체도 adapter로 봐야하고 도메인의 경우 불변이어야 할 것 같은데, port를 구성해야 하는거 아닌가? 확인 질문에 답하자면 구조에 따라서 다를 것 같은데?

## 절반 맞고, 절반은 한 겹 아래에서 갈린다

**맞는 부분**: zod는 바깥 기술이고, 도메인이 그걸 알면 안 된다. 그건 확실하다.

**갈리는 부분**: 그래서 **port가 필요한가**. 대부분의 경우 필요 없고, 그 이유가 이 문제의 핵심이다.

### 검증은 하나가 아니라 둘이다

| | 무엇 | 누가 하나 | 이 레포의 현재 |
| --- | --- | --- | --- |
| **(a) 구조 파싱** | `unknown` → 알려진 shape. "이게 정말 `{status, service}`인가" | **경계(어댑터)** | 없음 — `as`로 캐스팅만 |
| **(b) 도메인 불변식** | "latencyMs는 음수·NaN일 수 없다" | **도메인 자신** | **이미 있다** |

(b)는 이미 구현돼 있다. 라이브러리 없이.

```ts
// packages/core/src/health.ts
if (!Number.isFinite(latencyMs) || latencyMs < 0) {
  throw new RangeError(`latencyMs must be a non-negative finite number: ${latencyMs}`);
}
```

**이게 정답 형태다.** 도메인 불변식은 도메인이 순수 TypeScript로 직접 지킨다 — zod도, port도, 어댑터도 필요 없다. 불변식을 남에게 맡기는 순간 도메인이 자기 규칙의 주인이 아니게 된다.

zod가 필요한 건 (a)뿐이고, **(a)는 도메인이 하는 일이 아니다.**

### 그래서 port가 왜 대부분 불필요한가 — "Parse, don't validate"

port가 정당한 건 **도메인이 그 능력을 호출할 때**다. `LlmPort`는 도메인이 "이 프롬프트에 답을 줘"라고 **부르기 때문에** port다.

그런데 검증은 도메인이 부르지 않는다. **경계에서 이미 끝나고 들어온다.**

```
바깥 데이터(unknown)
      ↓  어댑터가 zod로 파싱      ← 여기서 끝
검증된 값
      ↓  도메인 호출
도메인은 "이미 유효한 값"만 받는다  ← 검증할 일이 없다
```

도메인에 `ValidationPort`를 만들면 **도메인이 "나는 아직 검증 안 된 값을 받을 수도 있다"고 인정하는 셈**이 된다. 그럼 도메인 함수마다 "검증했나?"를 신경 써야 하고, 불변식의 책임이 흐려진다.

### 그럼 "검증됐다"는 사실은 어떻게 도메인에 전달하나 — 타입으로

port 없이 의존을 역전시키는 방법이 있다. **도메인이 타입을 소유하고, 경계가 그 타입을 만든다.**

```ts
// packages/core — 도메인이 소유. zod를 모른다
export type LatencyMs = number & { readonly __brand: 'LatencyMs' };

// 어댑터 — zod로 파싱하고 도메인 타입으로 좁힌다
const parsed = LatencySchema.parse(raw);       // zod는 여기서만 산다
const latency = parsed as LatencyMs;
```

이러면 세 가지가 동시에 성립한다.

1. 도메인은 zod를 모른다 — **의존 방향 유지**
2. "검증되지 않은 `number`"는 도메인 함수에 **타입 수준에서 못 들어간다**
3. zod를 valibot으로 바꿔도 **도메인 코드가 한 줄도 안 바뀐다** — port가 하려던 일을 타입이 대신한다

**추상화 하나를 안 만들고 같은 값을 얻는다.** port는 런타임 다형성이 필요할 때 쓰는 도구인데, 검증에는 런타임 다형성이 필요 없다 — 구현이 하나뿐이고 교체는 컴파일 타임에 끝난다.

### "도메인은 불변이어야 한다"는 직관 — 안정 의존 원칙

이 직관에는 이름이 있다. **Stable Dependencies Principle**: 불안정한 것이 안정된 것에 의존해야지, 반대면 안 된다.

- 도메인 규칙은 **가장 안정적**이다. 비즈니스가 바뀔 때만 바뀐다
- zod는 상대적으로 **불안정**하다. 메이저 버전이 오르고 API가 바뀐다

도메인이 zod를 import하면 **안정된 것이 불안정한 것에 매달린 상태**가 된다. 이게 "도메인은 바깥을 모른다"가 실제로 방어하는 것이고, 방금 그 직관이 정확히 그것이다.

(값의 immutability — `readonly`, 반환 객체를 얼리기 — 도 별개로 유효하지만, 여기서 걸리는 건 그쪽이 아니라 **의존의 안정성** 쪽이다.)

### 확인 질문 답변 — "구조에 따라 다르다"에 동의, 다만 기준을 하나로 좁힐 수 있다

동의합니다. 그리고 그 "구조"를 판단하는 기준은 하나로 줄어듭니다.

**tag는 이름표가 아니라 denylist의 키다.** `turbo.json`에서 tag가 하는 일은 오직 "누가 누구를 의존하면 안 되는가"를 쓰는 것뿐이다. 그러니 기준은 이것 하나다.

> **금지하고 싶은 새 의존이 생겼는가?**

- 생기지 않았다 → tag를 늘리는 건 **비용만 늘린다.** 읽을 게 늘고 강제되는 건 없다
- 생겼다 → 그때 tag를 만든다

`contracts`가 zod를 갖게 됐을 때 실제로 생길 법한 금지 규칙은 이런 것들이다.

- "web 번들에 실리는 package는 무거운 런타임 의존을 갖지 않는다" → `browser-safe` 같은 tag
- "서버 전용 계약은 web이 의존하지 않는다" → `contracts`를 `contracts-shared` / `contracts-server`로 분할

**둘 다 지금은 존재하지 않는 문제다.** 그러니 `shared` 하나로 충분하고, M03에서 서비스가 늘어 계약이 갈릴 때 다시 보는 게 이 프로젝트의 "선행 추상화를 하지 않는다" ‹`PROJECT.md:28-29`›와도 맞습니다.

**마일스톤 결정에 주는 함의**: zod 도입은 별도 마일스톤보다 **M03(계약 package 본격 사용)의 한 항목**이 자연스럽습니다 — 계약이 여러 서비스로 갈리는 시점이 곧 "타입만으로 부족해지는" 시점이니까요.

<small style="opacity:0.55">‹01:00 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M01 구현을 `/lbl`로 정독하던 중. 직전 항목(20260809-005616)의 zod 논의에 대해, 검증 라이브러리도 어댑터로 보고 도메인이 port를 소유해야 하지 않느냐고 되물은 반박성 질문 + `shared` tag 확인 질문에 대한 사용자 답변("구조에 따라 다르다").</small>

<!-- /q -->
