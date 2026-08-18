
<!-- q id=20260815-000928 cat="software-architecture" -->
### 3번은 이해가 안됨.

### 한 줄

현재 `AssistService`가 **업무 흐름 실행**뿐 아니라 **구체적인 Adapter 생성**까지 맡고 있어서, Adapter를 바꾸면 Service 코드도 함께 바뀝니다. M14에서는 생성 책임을 Module 같은 조립 지점으로 옮겨 Service가 `CompletionPort`만 사용하게 만들려는 것입니다.

### 실제로 무슨 일이 생겼나

지금 코드는 설정이 필요 없는 Echo 구현을 직접 만듭니다.

```ts
private readonly completion = new EchoCompletionAdapter();
```

그래서 단순히 HTTP 구현으로 이름만 바꾸면 다음처럼 됩니다.

```ts
private readonly completion = new HttpCompletionAdapter();
```

하지만 HTTP 구현은 접속할 주소가 필요합니다.

```ts
new HttpCompletionAdapter({
  baseUrl: '...',
});
```

실험에서 인자 없이 교체했을 때 TypeScript가 실제로 다음 오류를 냈습니다.

```text
TS2554: Expected 1 arguments, but got 0.
```

즉 Adapter를 교체하려면 `AssistService`가 이제 다음까지 알아야 합니다.

- HTTP 구현에는 `baseUrl`이 필요하다는 사실
- 그 설정을 어디서 가져오는지
- Echo와 HTTP 중 무엇을 선택할지

그런데 `AssistService`의 본래 책임은 요청을 Core 입력으로 옮기고 use case를 실행하는 것입니다. 어떤 외부 구현을 만들고 설정할지는 애플리케이션을 조립하는 위치의 책임에 가깝습니다.

### M14에서 달라질 모양

개념적으로 Service는 생성하지 않고 이미 만들어진 포트를 받습니다.

```ts
constructor(private readonly completion: CompletionPort) {}
```

그리고 Module 같은 조립 지점이 구체 구현을 만듭니다.

```ts
new HttpCompletionAdapter({ baseUrl });
```

그러면 Echo에서 HTTP로 바꿀 때 조립 코드만 바뀌고, `AssistService`의 업무 흐름은 그대로 남습니다.

여기서 말한 **변경 비용**은 실행 속도나 돈이 아니라, “Adapter 하나를 바꿀 때 함께 수정해야 하는 코드와 책임의 범위”입니다. 또한 `new`가 언제나 나쁘다는 뜻도 아닙니다. 이번에는 교체 가능한 외부 기술을 Application Service가 직접 생성하고 있어서 그 결합을 일부러 드러낸 것입니다.

<small style="opacity:0.55">‹00:09 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab`의 M02 Port와 Adapter 마일스톤 자동 판정 후 사람 확인 3번을 검토하던 중.</small>

<!-- /q -->

<!-- q id=20260815-001606 cat="software-architecture" -->
### 현재 구조가 packages 하위에 adpater 들 core, contracts 등을 1계층으로 쭉 나열하는데, apps/a-api, b-api, c-api 가 공통적으로 사용하는 packages를 packages에 정의할 수도 있고, 각 apps 별로 각각의 pacakges 워크스페이스를 가질 수도 있을 것 같은데 이런 구조는 없나? 그리고 a-api만 있는 상황에서 특정 도메인를 위한 모듈화도 가능할 것 같은데, 예를 들어 api 안에 a 모듈, b 모듈이 있고, 각 모듈은 packages 안에서 공통적으로 사용하는 것이 있을 수도 있고, 서비스 별로 adapter가 다를 가능성도 있을텐데, 이런 경우에도 현재 apdater-echo, adapter-http 처럼 하나의 계층에 모두 쌓게 되면 패키지 개수가 엄청나게 늘어날 것 같은데 구조화가 필요하지 않나?

### 한 줄

그런 구조가 있으며, 규모가 커지면 **전역 계층별 나열보다 서비스·도메인 같은 소유 경계로 먼저 묶고 그 안에서 계층을 나누는 편이 낫습니다.** 다만 모든 모듈과 Adapter를 workspace package로 만들 필요는 없습니다.

현재 실습의 평평한 구조는 Port와 Adapter의 의존 방향을 적은 수의 package로 선명하게 보기 위한 학습용 기준선입니다.

```text
packages/
  core/
  contracts/
  adapter-echo/
  adapter-http/
```

헥사고날 아키텍처가 요구하는 것은 이 디렉터리 모양이 아니라 다음 의존 방향입니다.

```text
Adapter ──의존──> Core가 소유한 Port
Core    ──의존하지 않음──> Adapter
```

따라서 폴더를 중첩하거나 Adapter를 같은 package에 묶더라도 이 방향만 지키면 됩니다.

### 단일 API라면 먼저 모듈형 모놀리스로 시작할 수 있다

`a-api` 하나뿐이고 각 도메인이 아직 별도 배포·소유 단위가 아니라면 package로 잘게 쪼개기 전에 애플리케이션 내부 모듈로 나누는 것이 자연스럽습니다.

```text
apps/
  a-api/
    src/
      modules/
        orders/
          domain/
          application/
          adapters/
          presentation/
        billing/
          domain/
          application/
          adapters/
          presentation/
      shared/
```

여기서 `orders/adapters`와 `billing/adapters`는 서로 다른 기술을 사용해도 됩니다. Adapter 하나당 workspace package 하나를 만들 필요는 없습니다. 같은 도메인에 속하고 함께 변경되는 Adapter들을 `orders` 모듈 내부에 둘 수 있습니다.

### 여러 API와 독립 경계가 생기면 소유자별 package로 승격한다

`a-api`, `b-api`, `c-api`가 생기면 다음처럼 공용 package와 서비스 전용 package를 구분할 수 있습니다.

```text
apps/
  a-api/
  b-api/
  c-api/

packages/
  shared/
    observability/
    test-utils/
  a-api/
    orders-core/
    orders-contracts/
    orders-infrastructure/
  b-api/
    catalog-core/
    catalog-infrastructure/
```

`pnpm-workspace.yaml`도 중첩된 경로를 workspace로 잡을 수 있습니다.

```yaml
packages:
  - apps/*
  - packages/shared/*
  - packages/a-api/*
  - packages/b-api/*
  - packages/c-api/*
```

또는 서비스 관련 코드를 한곳에 모으고 싶다면 다음 형태도 가능합니다.

```text
services/
  a-api/
    app/
    packages/
      orders-core/
      orders-infrastructure/
  b-api/
    app/
    packages/
packages/
  shared/
```

다만 `apps/a-api` 자체가 하나의 workspace package라면 그 내부에 다른 workspace package를 중첩하기보다는, 위처럼 공통 부모 아래 형제 package로 두는 편이 도구와 package 경계를 이해하기 쉽습니다.

### 무엇을 package로 만들지 정하는 기준

| 코드의 성격 | 권장 위치 |
| --- | --- |
| 한 도메인 모듈에서만 사용 | 해당 모듈의 폴더 |
| 같은 API의 여러 모듈이 사용하지만 외부에서는 사용하지 않음 | `apps/a-api/src/shared` 또는 서비스 전용 package |
| 여러 API가 정말 같은 의미로 사용 | `packages/shared/*` |
| 한 API만 쓰지만 의존 방향을 강하게 강제하거나 별도 소유·테스트가 필요 | `packages/a-api/*` |
| 특정 서비스만 사용하는 Adapter | 해당 서비스 모듈의 `adapters/` 또는 서비스 전용 infrastructure package |
| 여러 서비스가 같은 Port와 동작으로 재사용하는 Adapter | 공용 Adapter package |

다음 중 하나가 실제로 필요할 때 폴더를 workspace package로 승격하면 됩니다.

- 둘 이상의 소비자가 재사용한다.
- 잘못된 import를 도구로 차단해야 할 만큼 경계가 중요하다.
- 독립적인 담당 팀·변경 주기·테스트·의존성을 가진다.
- 무거운 기술 의존성을 다른 영역에서 격리해야 한다.

그렇지 않다면 package보다 일반 모듈 폴더가 비용이 적습니다.

### 현재 이름도 규모가 커지면 바뀌어야 한다

`core`, `adapter-http` 같은 전역 이름은 작은 실습에서는 명확하지만 실제 시스템이 커지면 무엇의 Core이고 무엇을 위한 HTTP Adapter인지 모호해집니다. 그때는 다음처럼 업무 능력과 소유 범위를 이름에 포함하는 편이 낫습니다.

```text
orders-core
orders-payment-adapter
catalog-search-adapter
assistant-completion-http-adapter
```

핵심은 **package 개수를 최소화하는 것**도, **모든 경계를 package로 만드는 것**도 아닙니다. 함께 변경되는 코드는 가까이 두고, 독립적으로 보호할 필요가 생긴 경계만 package로 올리는 것입니다. 현재 실습의 `adapter-echo`, `adapter-http`는 “Adapter마다 package가 필수”라는 규칙이 아니라, 두 구현을 실제 package 경계로 갈아 끼우며 의존 역전을 관찰하기 위한 의도적인 확대 표현입니다.

<small style="opacity:0.55">‹00:16 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab`의 M02 Port와 Adapter 구조를 검토하며, 실습의 평평한 packages 배치를 다중 API·다중 도메인 규모로 확장하는 방법을 질문함.</small>

<!-- /q -->

<!-- q id=20260815-002036 cat="software-architecture" -->
### 그리고 한 가지더 FE와 BE의 packages가 한 공간에 섞이게 되는데 FE도 여러 packages가 생길 수 있는데 이는 사람이나 Agent 모두에게 경계 구분이 힘들어 지게 만드는게 아닌가.

### 한 줄

맞습니다. FE·BE package가 많아졌는데도 `packages/` 한 계층에 평평하게 섞어 두면 사람과 Agent 모두 이름을 매번 해석해야 하므로 탐색 비용과 실수 가능성이 커집니다. 이때는 **폴더로 큰 실행 경계를 보여주고, 의존 규칙으로 그 경계를 강제하는 구조**가 좋습니다.

현재 실습처럼 package가 네댓 개일 때는 다음 구조가 오히려 전체 의존 관계를 한눈에 보여줍니다.

```text
packages/
  core/
  contracts/
  adapter-echo/
  adapter-http/
```

하지만 실제 프로젝트에서 FE·BE package가 늘어나면 다음처럼 나누는 편이 찾기 쉽습니다.

```text
apps/
  api/
  web/

packages/
  backend/
    assistant-core/
    assistant-adapter-echo/
    assistant-adapter-http/
  frontend/
    design-system/
    assistant-feature/
    api-client/
  contracts/
    assistant/
  tooling/
    tsconfig/
    eslint-config/
```

이 구조에서는 디렉터리에 들어가는 순간 실행 환경이 드러납니다.

- `backend/*`: 서버 런타임에서만 사용하는 코드
- `frontend/*`: 브라우저와 UI를 위한 코드
- `contracts/*`: 양쪽이 의존할 수 있는 중립적인 요청·응답 계약
- `tooling/*`: 제품 코드가 아니라 빌드·검사 설정

하나의 root workspace를 유지하면서 `pnpm-workspace.yaml`의 glob만 중첩 경로까지 포함하면 됩니다.

```yaml
packages:
  - apps/*
  - packages/*/*
```

FE와 BE를 나누기 위해 별도 lockfile을 가진 독립 workspace까지 만들 필요는 보통 없습니다. 설치·버전 정합성과 변경 영향 계산이라는 monorepo의 이점을 유지하면서 폴더만 명확히 그룹화할 수 있습니다. 정말로 릴리스 주기·도구 체인·접근 권한까지 독립적일 때 별도 workspace나 저장소 분리를 고려하면 됩니다.

### 폴더만 나눈다고 경계가 생기는 것은 아니다

폴더 구조는 사람과 Agent에게 “어디를 봐야 하는가”를 알려주는 **지도**입니다. 하지만 잘못된 import 자체를 막지는 못합니다. 실제 경계에는 다음 장치가 함께 필요합니다.

```text
폴더 구조       → 탐색 범위를 알려준다
package 이름    → 소유자와 용도를 알려준다
exports         → 외부에 공개할 표면을 제한한다
boundary 검사   → 금지된 의존을 실패시킨다
AGENTS.md       → 그 하위에서 작업할 Agent의 규칙을 알려준다
```

예를 들어 package에 개념적으로 다음과 같은 태그를 붙일 수 있습니다.

```text
runtime:browser
runtime:node
scope:assistant
layer:adapter
```

그리고 다음 규칙을 자동 검사합니다.

```text
frontend  ─X→ backend 구현
backend   ─X→ frontend 구현
frontend  ──→ contracts 허용
backend   ──→ contracts 허용
```

이렇게 해야 Agent가 경로를 잘못 골라도 CI나 로컬 검사에서 바로 실패합니다. `packages/frontend/AGENTS.md`와 `packages/backend/AGENTS.md`에 각 영역의 명령·금지 의존·테스트 방법을 따로 두면 Agent가 불필요한 반대편 코드를 읽는 일도 줄일 수 있습니다.

### 항상 FE/BE를 최상위 기준으로 삼아야 하는 것은 아니다

조직이 FE팀과 BE팀으로 나뉘어 있다면 위의 `frontend/`, `backend/` 우선 구조가 자연스럽습니다. 반대로 한 제품팀이 주문 기능의 FE와 BE를 함께 소유한다면 도메인을 먼저 묶는 편이 더 찾기 쉬울 수 있습니다.

```text
packages/
  orders/
    frontend/
    backend/
    contracts/
  billing/
    frontend/
    backend/
    contracts/
```

즉 최상위 폴더에는 **가장 안정적인 소유·변경 경계**를 둡니다. FE/BE와 도메인이라는 두 축을 모두 표현해야 한다면, 한 축은 폴더에 두고 다른 축은 package 이름과 태그로 표현하면 됩니다.

현재 실습에서는 평평한 구조가 학습 대상을 확대해 보여주므로 적절하지만, 실제 규모로 확장할 때까지 그대로 유지해야 하는 설계는 아닙니다. package가 늘어 어느 영역의 것인지 이름만 보고 즉시 알 수 없게 되는 시점이 바로 `backend/`, `frontend/`, `contracts/`, `tooling/` 또는 도메인별 그룹을 도입할 신호입니다.

<small style="opacity:0.55">‹00:20 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab`의 M02 구조를 다중 API·도메인으로 확장하는 논의에서, FE와 BE package가 같은 평면에 섞일 때 사람·Agent의 경계 인식 문제를 추가 질문함.</small>

<!-- /q -->

<!-- q id=20260815-220119 cat="NestJS" -->
### AssistModule.register(process.env) — app.module.ts의 위 코드는 원래는 자동으로 register가 되는건데 process.env를 넘기기 위해 함수 실행을 하는건가?

네, 거의 맞습니다. 정확히는 **`AssistModule`이 자동으로 `.register()`되는 것은 아니고**, Nest가 `imports`에 들어온 모듈을 자동으로 등록합니다.

일반적인 정적 모듈은 다음처럼 클래스 자체를 넘깁니다.

```ts
imports: [AssistModule]
```

Nest는 `AssistModule`의 `@Module({...})` 메타데이터를 읽어 Controller와 Provider를 등록합니다. 이때 `register()`라는 함수는 필요하지 않습니다.

현재 코드는 환경에 따라 서로 다른 Provider 구성을 만들어야 하므로 먼저 일반 JavaScript 함수인 `register()`를 호출합니다.

```ts
imports: [AssistModule.register(process.env)]
```

이 함수의 반환값은 다음과 같은 `DynamicModule` 객체입니다.

```ts
{
  module: AssistModule,
  controllers: [AssistController],
  providers: [/* process.env에 따라 달라진 Provider들 */],
}
```

Nest는 `AssistModule` 클래스가 아니라 이 반환 객체를 받아 등록합니다. 따라서 질문처럼 `process.env`를 모듈 구성 단계에 전달하기 위해 함수 형태를 사용한 것이 맞습니다. 테스트에서는 실제 환경 변수 대신 `{ COMPLETION_ADAPTER: 'echo' }` 같은 가짜 환경을 넘길 수도 있습니다.

실행 시점은 두 단계로 나뉩니다.

```text
AppModule 파일 평가
  → AssistModule.register(process.env) 실행
  → startup/request용 Provider 목록 결정

Nest bootstrap
  → 결정된 Provider의 useFactory 실행
  → 실제 CompletionPort 객체 생성
```

즉 `register()`는 **어떤 객체 그래프를 등록할지 정하고**, `useFactory`는 그 그래프 안에서 **실제 객체를 생성**합니다.

참고로 `register`라는 이름 자체는 Nest의 특별한 예약어가 아니라 관례입니다. `forRoot`, `configure` 같은 다른 이름이어도 `DynamicModule`을 반환하면 동작합니다.

<small style="opacity:0.55">‹22:01 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M15 구현 검토 중 `apps/api/src/app.module.ts`의 `AssistModule.register(process.env)`와 Dynamic Module·Factory 실행 시점을 질문함.</small>

<!-- /q -->

<!-- q id=20260815-221119 cat="NestJS" -->
### 현재 코드는 환경에 따라 서로 다른 Provider 구성을 만들어야 하므로 먼저 일반 JavaScript 함수인 register()를 호출한다. env를 매개변수로 받는 이유는 뭐지? AssistModule 클래스에서 process.env로 접근 가능하지 않나?

맞습니다. `AssistModule` 안에서도 `process.env`에 접근할 수 있습니다. `env`를 매개변수로 받은 이유는 **접근할 수 없어서가 아니라 전역 의존성을 숨기지 않기 위해서**입니다.

다음 코드도 기술적으로 정상 동작합니다.

```ts
export class AssistModule {
  static register(): DynamicModule {
    return {
      module: AssistModule,
      providers: createCompletionProviders(process.env),
    };
  }
}

// 사용하는 쪽
imports: [AssistModule.register()]
```

하지만 이 모양에서는 `AssistModule.register()`만 보고는 이 모듈이 환경 변수에 의존한다는 사실을 알 수 없습니다. 테스트도 환경을 바꾸려면 전역 `process.env`를 수정하고 원복해야 해서, 병렬 테스트끼리 영향을 줄 수 있습니다.

현재처럼 밖에서 전달하면 의존성이 호출부에 드러납니다.

```ts
imports: [AssistModule.register(process.env)]
```

```ts
static register(env: NodeJS.ProcessEnv): DynamicModule {
  return {
    module: AssistModule,
    providers: createCompletionProviders(env),
  };
}
```

이렇게 하면 다음이 가능합니다.

- `AppModule`이라는 Composition Root가 설정의 출처를 결정한다.
- 테스트가 전역 상태를 건드리지 않고 `AssistModule.register({ COMPLETION_ADAPTER: 'echo' })`처럼 독립된 입력을 넘긴다.
- 같은 프로세스에서 서로 다른 설정의 TestingModule을 동시에 만들 수 있다.
- `createCompletionProviders(env)`를 입력과 출력이 드러나는 함수로 검사할 수 있다.

쉽게 말하면 `AssistModule`이 냉장고에서 몰래 재료를 꺼내게 하지 않고, 조립하는 쪽이 필요한 재료를 손에 쥐여 주는 것입니다.

다만 현재 코드에는 한계도 있습니다. `process.env` 객체 자체를 그대로 전달하므로 완전히 고정된 설정 스냅샷은 아닙니다. 더 엄격한 실제 프로젝트라면 바깥에서 필요한 값만 읽고 검증한 뒤 좁은 타입으로 전달하는 편이 낫습니다.

```ts
const config = readCompletionConfig(process.env);

imports: [AssistModule.register(config)]
```

```ts
interface CompletionConfig {
  readonly lifecycle: 'startup' | 'request';
  readonly adapter: 'echo' | 'http';
  readonly httpBaseUrl?: string;
}
```

그러면 `AssistModule`은 `process.env`가 존재하는지도 모르고, 검증이 끝난 자기 설정만 받습니다. 정리하면 **현재 매개변수 전달은 전역 접근을 명시적 의존성으로 바꾸는 단계이고, 좁고 불변인 설정 객체를 전달하는 것이 더 완성된 형태**입니다.

<small style="opacity:0.55">‹22:11 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M15 검토 중 `AssistModule.register(process.env)`에서 환경을 직접 읽지 않고 인자로 전달한 설계 이유와 한계를 후속 질문함.</small>

<!-- /q -->

<!-- q id=20260815-231928 cat="TypeScript/NestJS" -->
### apps/api/src/assist/completion.config.ts — Object.freeze를 쓰는 이유가 뭐지? env.COMPLETION_SELECTION_LIFECYCLE는 어떤 역할이지?

`Object.freeze()`는 **한 번 확정한 설정이 실행 중에 바뀌지 않도록 런타임에서도 막기 위해** 사용합니다.

`CompletionConfig`에 이미 `Readonly`가 있지만 이것은 TypeScript 검사에만 존재합니다.

```ts
type Config = Readonly<{ adapter: 'echo' | 'http' }>;
```

컴파일 후에는 `Readonly`가 사라지므로 JavaScript 코드, `any` 변환, 다른 참조를 통한 변경까지 막지는 못합니다. `Object.freeze()`는 실제 JavaScript 객체의 속성 변경·추가·삭제를 막습니다. strict mode에서 변경을 시도하면 `TypeError`가 발생합니다.

```ts
const config = Object.freeze({
  lifecycle: 'startup',
  adapter: 'echo',
});

config.adapter = 'http'; // 변경되지 않음
```

여기서 두 효과를 구분해야 합니다.

- `process.env`에서 **새 객체를 만드는 것**: 원본 env가 나중에 바뀌어도 설정이 따라 바뀌지 않는 스냅샷 격리
- 새 객체에 **`Object.freeze()`를 적용하는 것**: 만들어진 설정 객체 자체를 다른 코드가 바꾸지 못하게 하는 런타임 불변성

`Object.freeze()`는 얕은 동결이지만 현재 설정 값은 문자열뿐이므로 이 객체에는 충분합니다. 중첩 객체가 생긴다면 내부 객체까지 자동으로 동결하지는 않습니다.

`COMPLETION_SELECTION_LIFECYCLE`은 **어떤 Adapter를 쓸지가 아니라 Adapter를 언제 선택할지** 정하는 이 프로젝트의 환경 변수입니다. NestJS가 기본 제공하는 이름은 아닙니다.

값이 없거나 `startup`이면 프로세스 시작 시 한 번 선택합니다.

```text
COMPLETION_SELECTION_LIFECYCLE=startup
COMPLETION_ADAPTER=echo | http

bootstrap 때 Echo 또는 HTTP 선택
→ 이후 모든 요청이 같은 CompletionPort 사용
→ x-completion-adapter 요청 헤더는 선택에 영향 없음
```

값이 `request`이면 실행 중인 같은 앱에서도 요청마다 선택합니다.

```text
COMPLETION_SELECTION_LIFECYCLE=request

각 HTTP 요청
→ request-scoped CompletionRouter 생성
→ x-completion-adapter: echo | http 해석
→ 해당 singleton Adapter에 위임
```

그래서 세 입력의 책임은 다음처럼 갈립니다.

- `COMPLETION_SELECTION_LIFECYCLE`: **언제** 선택하는가 — 시작 시 또는 요청마다
- `COMPLETION_ADAPTER`: startup 모드에서 **무엇을** 선택하는가
- `x-completion-adapter`: request 모드에서 이번 요청은 **무엇을** 선택하는가

`request` 모드에서는 `COMPLETION_ADAPTER`를 읽지 않습니다. 대신 어느 요청이든 HTTP를 선택할 수 있으므로 `COMPLETION_HTTP_BASE_URL`은 시작할 때 미리 검증합니다.

마지막으로 이 변수는 Nest provider의 객체 수명과 연결되지만 같은 개념은 아닙니다. `startup`이면 singleton Port provider graph를 만들고, `request`이면 request-scoped Router graph를 만들도록 우리가 `createCompletionProviders(config)`에 정책을 작성한 것입니다.

<small style="opacity:0.55">‹23:19 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M15 검토 중 `apps/api/src/assist/completion.config.ts`의 frozen 설정 스냅샷과 startup/request 구현 선택 정책을 질문함.</small>

<!-- /q -->

<!-- q id=20260815-233142 cat="NestJS/Architecture" -->
### apps/api/src/assist/assist.controller.ts — 여기서 아래 코드의 분기 처리 말고 더 나은 방식도 있나?

있습니다. 다만 **현재처럼 오류가 3개뿐이고 이 컨트롤러에서만 변환한다면 지금 코드도 충분히 좋은 기준선**입니다. 도메인·조립 오류가 어떤 HTTP 상태로 바뀌는지 한눈에 보이고, 알 수 없는 오류는 다시 던져 500 처리를 유지한다는 장점이 있습니다.

분기가 여러 메서드나 컨트롤러에서 반복되기 시작하면 NestJS의 **Exception Filter**로 옮기는 것이 가장 자연스럽습니다. 컨트롤러는 성공 흐름만 남기고, `Assist` 경계의 오류 번역을 필터 한곳에 모읍니다.

```ts
@Controller()
@UseFilters(AssistExceptionFilter)
export class AssistController {
  @Post(ASSIST_PATH)
  post(@Body() request: AssistRequest): Promise<AssistResponse> {
    return this.assistService.assist(request ?? { prompt: '' });
  }
}
```

```ts
@Catch(
  PromptPolicyError,
  CompletionUnavailableError,
  CompletionSelectionError,
)
export class AssistExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(error: Error, host: ArgumentsHost): void {
    const status =
      error instanceof CompletionUnavailableError
        ? HttpStatus.SERVICE_UNAVAILABLE
        : HttpStatus.BAD_REQUEST;

    this.adapterHost.httpAdapter.reply(
      host.switchToHttp().getResponse(),
      { statusCode: status, message: error.message },
      status,
    );
  }
}
```

`@Catch()`는 여러 오류 타입을 한 필터에 지정할 수 있고, 필터는 메서드·컨트롤러·전역 범위로 적용할 수 있습니다. 이 경우에는 전역 필터보다 **Assist 컨트롤러 범위**가 적절합니다. 다른 기능이 우연히 같은 오류 클래스를 사용하더라도 반드시 같은 HTTP 계약을 가져야 하는 것은 아니기 때문입니다. Nest 공식 문서도 이 범위들과 클래스 기반 등록을 지원합니다. [NestJS Exception filters](https://docs.nestjs.com/exception-filters)

중요한 점은 Exception Filter가 **분류 자체를 마법처럼 없애지는 않는다**는 것입니다. 오류와 HTTP 상태의 대응 관계는 어딘가에는 반드시 있어야 합니다. 필터가 개선하는 것은 그 분기를 컨트롤러의 정상 흐름에서 분리하고, 반복 없이 한 경계에 모으는 것입니다.

다른 선택지도 있습니다.

- 작은 `toHttpException(error)` 함수로 추출: 파일을 추가할 정도는 아니지만 컨트롤러를 짧게 만들고 싶을 때 적합합니다. 다만 `try/catch`는 그대로 남습니다.
- `Result` 또는 판별 가능한 유니온을 반환: `throw` 대신 `{ ok: false, code: 'PROMPT_POLICY' }`처럼 예상 가능한 실패를 값으로 표현해 컴파일러의 누락 검사를 받고 싶을 때 적합합니다. 대신 Core와 Application의 반환 계약을 크게 바꾸므로 현재 단계에는 과합니다.
- 오류 클래스가 직접 `BadRequestException`을 상속: 코드는 짧아지지만 Core가 NestJS와 HTTP를 알게 되어 현재의 안쪽/바깥쪽 경계를 무너뜨리므로 피하는 편이 좋습니다.

따라서 이 프로젝트에서는 **지금은 현재 분기를 유지하고**, 동일한 변환이 다른 엔드포인트에도 반복되거나 오류 종류가 더 늘어날 때 `AssistExceptionFilter`로 추출하는 순서가 좋습니다. 두 400 분기를 `||`로 합치는 것은 문장 수만 줄일 뿐 구조적인 개선은 아닙니다. 또한 마지막 `throw error`는 유지해야 예상하지 못한 버그를 잘못된 400 응답으로 숨기지 않습니다.

<small style="opacity:0.55">‹23:31 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab` M15 검토 중 `apps/api/src/assist/assist.controller.ts`의 도메인·조립 오류를 HTTP 상태로 번역하는 분기 확장 방식을 질문함.</small>

<!-- /q -->
