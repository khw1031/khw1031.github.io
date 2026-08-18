
<!-- q id=20260816-002124 cat="TypeScript/NestJS" -->
### static register(config: CompletionConfig): DynamicModule — static은 NestJS의 규약인가, singleton인 건가? DynamicModule은 무엇인가?

결론부터 말하면, **`static`은 NestJS 규약도 singleton 선언도 아닙니다.** JavaScript/TypeScript의 클래스 문법이며, 객체를 만들지 않고 클래스에서 바로 호출할 수 있는 메서드라는 뜻입니다. `DynamicModule`은 **설정에 따라 만들어진 Nest Module 구성표 객체**입니다.

먼저 문장을 조각내면 다음과 같습니다.

```ts
static register(config: CompletionConfig): DynamicModule
│      │        │                         │
│      │        │                         └─ 반환값의 TypeScript 타입
│      │        └─ 입력 매개변수와 그 타입
│      └─ 메서드 이름
└─ 인스턴스가 아니라 클래스에 소속된 메서드
```

## `static`은 무엇인가?

`static`이 없으면 먼저 객체를 만들어야 합니다.

```ts
class Example {
  register() {}
}

const example = new Example();
example.register();
```

`static`이 있으면 클래스에서 바로 호출합니다.

```ts
class Example {
  static register() {}
}

Example.register();
```

현재 코드도 Nest가 `AssistModule` 인스턴스를 만들어 주기를 기다리지 않고 다음처럼 앱을 조립하는 시점에 호출해야 하므로 `static`입니다.

```ts
imports: [AssistModule.register(completionConfig)]
```

`register`라는 이름은 NestJS의 **관례**지만 강제 규약은 아닙니다. `configure`, `create` 같은 이름으로 정의하고 직접 호출해도 동작합니다. Nest 공식 문서는 일반적으로 `register()` 또는 `forRoot()`라는 이름을 사용하라고 설명합니다. [NestJS Dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules)

## `static`과 singleton은 어떻게 다른가?

`static`은 **함수를 어디서 호출하는가**에 관한 문법이고, singleton은 **객체가 몇 개 만들어지는가**에 관한 수명주기입니다.

`static register()`도 호출할 때마다 새로운 일반 객체를 반환할 수 있습니다.

```ts
const first = AssistModule.register(config);
const second = AssistModule.register(config);

first === second; // false
```

현재 Provider가 singleton인지 결정하는 것은 `static`이 아니라 Nest Provider의 `scope`입니다.

- startup 모드의 `COMPLETION_PORT`: `scope`를 지정하지 않았으므로 기본 `DEFAULT` scope, 즉 application context에서 공유되는 singleton
- request 모드의 `COMPLETION_PORT`: `Scope.REQUEST`이므로 HTTP 요청마다 별도 생성
- Echo/HTTP Adapter: 별도 `scope`가 없으므로 singleton

따라서 `register()`는 앱 시작 시 **어떤 Provider 설계도를 등록할지** 결정할 뿐, 객체의 수명을 직접 결정하지 않습니다.

## `DynamicModule`은 무엇인가?

일반적인 정적 Module은 구성표를 `@Module()` 안에 고정합니다.

```ts
@Module({
  controllers: [AssistController],
  providers: [AssistService],
})
export class AssistModule {}
```

사용할 때는 클래스 자체를 imports에 넣습니다.

```ts
imports: [AssistModule]
```

반면 Dynamic Module은 설정을 받은 함수가 Module 구성표를 반환합니다.

```ts
imports: [AssistModule.register(config)]
```

현재 `register()`의 실제 반환값은 다음 모양입니다.

```ts
{
  module: AssistModule,
  controllers: [AssistController],
  providers: [
    ...createCompletionProviders(config),
    AssistService,
  ],
}
```

이 객체는 `@Module({...})` 안에 넣던 `controllers`, `providers`, `imports`, `exports` 같은 정보를 가질 수 있고, 추가로 **어느 Module의 구성인지 알려주는 `module` 속성**을 반드시 가집니다. 현재 설치된 Nest 11.1.28의 타입도 `DynamicModule extends ModuleMetadata`로 정의하며 `module`만 필수로 요구합니다.

즉 둘은 같은 종류의 설계도입니다.

```text
정적 Module
@Module({ providers: 고정된 목록 })
              ↓
Nest가 객체 그래프 생성

Dynamic Module
register(config) → { module, providers: 설정에 따른 목록 }
                              ↓
                    Nest가 객체 그래프 생성
```

여기서 “Dynamic”은 요청마다 Module을 새로 만든다는 뜻이 아닙니다. **앱을 bootstrap하면서 설정에 따라 Module 구성표를 동적으로 만든다**는 뜻입니다. request 모드에서도 `register()` 자체는 시작할 때 호출되고, 그 반환값 안에 `Scope.REQUEST` Provider가 등록되기 때문에 이후 해당 Provider만 요청마다 생성됩니다.

현재 코드를 한 문장으로 읽으면 다음과 같습니다.

> `AssistModule.register(config)`는 객체 생성 없이 호출하는 클래스 함수이며, 받은 설정에 맞는 Nest Module 설계도(`DynamicModule`)를 반환한다. 그 설계도를 읽은 Nest가 Provider scope에 따라 실제 객체들을 생성한다.

<small style="opacity:0.55">‹00:21 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab/apps/api/src/assist/assist.module.ts`의 M15 동적 Module 변경을 검토하며 `static register`와 `DynamicModule`의 의미를 질문함.</small>

<!-- /q -->

<!-- q id=20260816-002501 cat="Computer Science/TypeScript" -->
### static이 가지는 장점이 뭐지? CS적으로, 그리고 어떤 경우에 인스턴스를 생성하고 어떤 경우에 static 메서드를 사용하는가?

핵심 기준은 **그 동작이 객체마다 다른 상태와 정체성을 필요로 하는가**입니다. 필요하면 인스턴스 메서드, 필요하지 않고 클래스 자체에 속한 연산이면 static 메서드가 맞습니다.

## CS 관점에서의 차이

인스턴스 메서드에는 보이지 않는 첫 번째 인자인 `this`가 있다고 생각할 수 있습니다.

```ts
account.withdraw(100);
```

개념적으로는 다음과 비슷합니다.

```ts
withdraw(account, 100);
```

`withdraw()`가 어느 계좌의 `balance`를 읽고 변경해야 하는지 `account`, 즉 `this`가 알려줍니다.

반면 static 메서드는 특정 객체를 받지 않습니다.

```ts
Math.max(10, 20);
AssistModule.register(config);
```

`Math`나 `AssistModule`이라는 **타입·클래스 이름에 소속된 함수**일 뿐, 특정 `Math` 객체나 `AssistModule` 객체의 상태를 읽지 않습니다.

JavaScript 객체 모델을 단순화하면 다음과 같습니다.

```text
BankAccount 클래스(실제로는 constructor 객체)
├─ static open()                 ← 클래스에 붙은 함수
└─ prototype
   └─ withdraw()                 ← 인스턴스들이 공유하는 함수

accountA                         accountB
├─ balance: 100                  ├─ balance: 500
└─ prototype 연결 ───────────────┴─▶ BankAccount.prototype
```

여기서 중요한 점은 **인스턴스 메서드 코드가 객체마다 복사되는 것은 아니라는 것**입니다. 일반적인 JavaScript class 메서드는 prototype에 한 번 있고 모든 인스턴스가 공유합니다. 인스턴스마다 생기는 것은 주로 `balance` 같은 상태입니다. 따라서 static의 주된 장점은 메서드 메모리를 아끼는 것이 아니라 **불필요한 객체 상태와 수명주기를 만들지 않고 의도를 명확히 하는 것**입니다.

## static이 주는 장점

1. **의미 없는 인스턴스를 만들지 않는다.**

   `new Math()`를 만든 뒤 `math.max()`를 호출해도 `math`가 보관할 상태가 없다면 그 객체는 아무 의미가 없습니다.

2. **이 연산은 객체 상태에 의존하지 않는다고 표현한다.**

   static 메서드에서는 인스턴스 `this`를 사용할 수 없으므로, 호출자는 객체별 상태를 변경하는 동작이 아님을 알 수 있습니다.

3. **객체가 생기기 전의 생성·조립 API를 제공할 수 있다.**

   named factory가 대표적입니다.

   ```ts
   const user = User.fromJson(json);
   const promise = Promise.resolve(value);
   ```

   아직 `User`나 `Promise` 인스턴스가 없기 때문에 클래스에서 출발합니다.

4. **관련 함수를 개념적인 이름 아래 묶는다.**

   `Math.max()`, `Number.isInteger()`처럼 어떤 타입과 강하게 관련된 연산임을 나타냅니다.

다만 TypeScript에서는 상태 없는 함수라고 해서 모두 static class에 넣을 필요는 없습니다. 클래스와 특별히 결합되지 않은 일반 계산은 다음처럼 module-level 함수가 더 단순합니다.

```ts
export function readCompletionConfig(env: NodeJS.ProcessEnv) {}
```

현재 코드도 `readCompletionConfig()`는 특정 인스턴스나 클래스의 private 상태가 필요 없으므로 일반 함수로 두었습니다.

## 언제 인스턴스를 생성하는가?

다음 중 하나라도 해당하면 보통 인스턴스가 맞습니다.

- 객체마다 값이 다르다: `account.balance`, `user.id`
- 생성 시 설정이나 의존성을 받아 계속 보관한다.
- 열고 닫아야 하는 resource나 명확한 lifecycle이 있다.
- 같은 인터페이스의 여러 구현을 바꿔 끼워야 한다.
- 테스트에서 fake/mock 인스턴스로 대체해야 한다.
- 호출 결과가 이전 호출로 변경된 객체 상태에 영향을 받는다.

현재 프로젝트의 Adapter가 예입니다.

```ts
const adapter = new HttpCompletionAdapter({ baseUrl });
await adapter.complete(request);
```

`adapter`는 생성할 때 받은 `baseUrl`을 보관합니다. Echo와 HTTP가 같은 `CompletionPort`를 구현하므로 Nest가 다른 인스턴스로 교체할 수도 있습니다. 따라서 `complete()`는 인스턴스 메서드가 자연스럽습니다.

## 언제 static 메서드를 사용하는가?

- 특정 인스턴스의 필드를 읽거나 변경하지 않는다.
- 객체를 만들기 위한 factory 또는 parser다.
- 앱 bootstrap처럼 인스턴스가 만들어지기 전에 호출해야 한다.
- 클래스 자체의 설정·등록 API다.
- 그 타입과 강하게 관련돼 있어 일반 함수보다 클래스 이름 아래 있는 편이 의도를 잘 표현한다.

현재 `AssistModule.register()`가 여기에 해당합니다.

```ts
AssistModule.register(config)
```

이 함수는 `AssistModule` 인스턴스의 상태를 사용하지 않습니다. 입력받은 `config`로 다음과 같은 **Module 설계도 객체**를 계산해 반환할 뿐입니다.

```ts
{
  module: AssistModule,
  controllers: [AssistController],
  providers: [...createCompletionProviders(config), AssistService],
}
```

그리고 이 설계도는 Nest가 `AssistModule`과 Provider 인스턴스를 만들기 **전에** 필요합니다. 인스턴스를 어떻게 만들지 설명하려고 인스턴스가 먼저 필요하다면 순서가 뒤집히므로 static 진입점이 자연스럽습니다.

## 판단 순서

실무에서는 다음 순서로 판단하면 됩니다.

```text
1. 이 함수가 객체별 상태(this)를 사용하는가?
   └─ 예 → 인스턴스 메서드

2. 같은 타입의 여러 객체가 서로 다른 설정·정체성을 가져야 하는가?
   └─ 예 → 인스턴스 생성

3. 다형성·DI·fake 교체가 필요한 동작인가?
   └─ 예 → 인터페이스를 구현한 인스턴스

4. 객체 생성 전 호출하는 factory·등록 API인가?
   └─ 예 → static 메서드

5. 클래스와 특별한 관계도 없는 상태 없는 계산인가?
   └─ 예 → 일반 module-level 함수
```

마지막으로 static은 singleton과 다릅니다.

```text
static     = 인스턴스 없이 호출한다
singleton  = 인스턴스가 정확히 하나 존재한다
```

singleton 객체는 인스턴스 메서드를 가질 수 있고, static 함수는 호출할 때마다 서로 다른 객체를 반환할 수도 있습니다. 현재 `AssistModule.register()`는 static이지만 매번 새로운 `DynamicModule` 객체를 반환합니다. 반대로 Nest의 기본 scope Provider는 실제 인스턴스이며 application context 안에서 하나를 공유하기 때문에 singleton입니다.

<small style="opacity:0.55">‹00:25 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab/apps/api/src/assist/assist.module.ts`의 `static register()`를 검토한 뒤 static과 인스턴스 선택 기준을 CS 객체 모델 관점에서 질문함.</small>

<!-- /q -->

<!-- q id=20260816-231102 cat="Computer Science/TypeScript" -->
### 객체가 생기기 전의 생성·조립 API를 제공할 수 있다는 것은 어떤 경우이고, 왜 장점인가?

여기서 “객체가 생기기 전”이란 **클래스 자체도 아직 없다는 뜻이 아니라, 우리가 사용하려는 도메인 객체나 서비스 인스턴스가 아직 생성되지 않았다는 뜻**입니다. 그 인스턴스를 만들 방법부터 결정해야 하므로, 이미 존재하는 인스턴스의 메서드에는 그 일을 맡길 수 없습니다.

쉽게 말하면 **집을 짓기 전에 설계도가 먼저 필요하다**는 이야기입니다.

```text
설정 입력
  ↓
생성·조립 API가 설계도 작성
  ↓
설계도를 바탕으로 객체 생성
  ↓
완성된 객체의 인스턴스 메서드 사용
```

완성된 집에게 “너를 어떻게 지어야 하는지 알려줘”라고 물을 수는 없습니다. 그 질문을 하려면 이미 집이 있어야 해서 순서가 순환하기 때문입니다.

## 경우 1: 객체를 만드는 Factory

여러 생성 규칙이 있는 객체를 생각해 볼 수 있습니다.

```ts
class User {
  private constructor(
    readonly id: string,
    readonly name: string,
  ) {}

  static createNew(name: string): User {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error('name is required');
    }

    return new User(crypto.randomUUID(), normalizedName);
  }

  static restore(row: UserRow): User {
    return new User(row.id, row.name);
  }
}
```

호출할 때는 아직 `User` 인스턴스가 없습니다.

```ts
const newUser = User.createNew('Kim');
const savedUser = User.restore(row);
```

이를 인스턴스 메서드로 만들면 이상한 순서가 됩니다.

```ts
const user = new User(/* 무엇을 넣어야 하지? */);
const realUser = user.createNew('Kim');
```

새 `User`를 만들기 위해 의미 없는 임시 `User`를 먼저 만들어야 합니다.

static factory의 장점은 다음과 같습니다.

- `createNew`, `restore`, `fromJson`처럼 생성 목적을 이름으로 구분할 수 있습니다.
- 검증과 정규화를 한곳에 모아 유효하지 않은 반쪽짜리 객체 생성을 막습니다.
- 필요하면 정확한 class 인스턴스 외에도 기존 객체, subtype, `Result`를 반환할 수 있습니다.
- 생성자와 내부 표현을 감추고 외부에는 안정적인 생성 API만 공개할 수 있습니다.

단순하고 유일한 생성 방식이라면 `new User(...)`가 더 직접적입니다. static factory는 생성 규칙이 여러 개이거나 이름·검증·반환 전략이 필요할 때 가치가 생깁니다.

## 경우 2: DI Container의 객체 그래프 조립

현재 `AssistModule.register()`는 객체 factory와 비슷하지만, `AssistModule` 인스턴스를 직접 반환하지는 않습니다. Nest가 나중에 객체들을 만들 수 있도록 **설계도인 `DynamicModule`을 반환**합니다.

```ts
const completionConfig = readCompletionConfig(process.env);

@Module({
  imports: [AssistModule.register(completionConfig)],
})
export class AppModule {}
```

실행 순서는 다음과 같습니다.

```text
1. process.env를 CompletionConfig로 변환
2. AssistModule.register(config) 호출
3. { module, controllers, providers } 설계도 반환
4. Nest가 설계도를 읽어 DI Container 구성
5. Nest가 AssistModule, Controller, Service, Adapter 인스턴스 생성
6. 요청 처리 시작
```

`register()`를 인스턴스 메서드로 만들면 다음 코드가 필요합니다.

```ts
const temporaryModule = new AssistModule();
temporaryModule.register(config);
```

그런데 이 `temporaryModule`은 Nest가 관리하는 Module 인스턴스가 아닙니다. Nest에게 실제 Module을 어떻게 조립할지 알려주기 위해 가짜 Module을 먼저 수동 생성한 셈입니다. 아무 상태도 없고 이후 사용되지 않으므로 존재 이유가 없습니다.

static 메서드로 두면 이 불필요한 중간 객체 없이 곧바로 설계도를 얻습니다.

```ts
AssistModule.register(config);
```

여기서 장점은 단순히 `new`라는 글자를 하나 줄이는 것이 아닙니다.

- **설계도 생성과 실제 인스턴스 생성을 분리합니다.** `register()`는 구성을 계산하고, Nest는 lifecycle과 의존성을 관리하며 실제 객체를 만듭니다.
- **수동 생성으로 DI Container를 우회하지 않습니다.** Controller와 Service를 언제 몇 개 만들지는 Nest가 결정합니다.
- **bootstrap 입력이 명시적입니다.** 어떤 설정으로 객체 그래프가 만들어졌는지 호출부에서 볼 수 있습니다.
- **서로 다른 구성을 만들 수 있습니다.** 같은 Module class를 두고 테스트나 실행 환경에 맞는 다른 `DynamicModule` 설계도를 얻을 수 있습니다.

## static만 가능한 것은 아니다

중요한 점은 이 장점이 `static`이라는 키워드에서 전부 나오는 것은 아니라는 것입니다. 일반 함수도 인스턴스 없이 같은 일을 할 수 있습니다.

```ts
function createAssistModule(config: CompletionConfig): DynamicModule {
  return {
    module: AssistModule,
    providers: [...createCompletionProviders(config), AssistService],
  };
}
```

Nest에서는 다음 모양이 더 발견하기 쉽고 관례에 맞기 때문에 static 메서드를 사용합니다.

```ts
AssistModule.register(config)
```

이름만 봐도 “AssistModule을 이 설정으로 등록한다”는 관계가 드러납니다. 반면 클래스와 특별한 관계가 없는 계산이라면 `Utils` 같은 static class를 만들기보다 일반 함수가 낫습니다.

정리하면 다음과 같습니다.

> 객체를 만들기 위한 규칙이나 객체 그래프의 설계도는 그 객체보다 먼저 존재해야 한다. 이를 static factory·등록 메서드로 제공하면 의미 없는 임시 객체 없이 생성 규칙을 한곳에 모으고, 실제 객체의 생성과 lifecycle은 생성자나 DI Container에 맡길 수 있다.

<small style="opacity:0.55">‹23:11 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab/apps/api/src/assist/assist.module.ts`의 static `register()`를 검토하며 “인스턴스 생성 전 조립 API”라는 장점의 실제 의미를 후속 질문함.</small>

<!-- /q -->

<!-- q id=20260816-233719 cat="NestJS/Software Architecture" -->
### 아직도 이해를 못하겠다. 포기할까? provider가 무엇이고 Nest 특유의 방식인가? adapter, port, service는 어떤 관계인가?

포기할 필요 없습니다. 지금 보고 있는 M15 코드는 초보 개념 하나가 아니라 **Port/Adapter, 의존성 주입, Nest Provider, 객체 수명주기**가 한 파일에 겹친 코드입니다. 각각을 따로 이해하기 전에 합쳐진 결과부터 보면 당연히 어렵습니다.

지금은 request scope와 Router를 잠시 잊고, 아래 세 줄만 보겠습니다.

```ts
const completion = new EchoCompletionAdapter();
const service = new AssistService(completion);
const controller = new AssistController(service);
```

이 세 줄이 현재 구조의 본체입니다.

```text
HTTP 요청
   ↓
Controller
   ↓
Service
   ↓
CompletionPort 역할을 하는 Adapter
```

Nest Provider는 이 `new` 작업을 Nest가 대신 하게 만드는 방법일 뿐입니다.

## 먼저 Provider가 무엇인가?

현재 코드에서 Provider는 쉽게 말해 **“Nest야, 누군가 이 이름의 객체를 요청하면 이 방법으로 만들어서 줘”라는 등록 정보**입니다.

```ts
{
  provide: COMPLETION_PORT,
  useFactory: () => new EchoCompletionAdapter(),
}
```

그대로 읽으면 다음 뜻입니다.

```text
누군가 COMPLETION_PORT를 요청하면
        ↓
useFactory를 실행해서
        ↓
EchoCompletionAdapter 객체를 제공해라
```

일반 JavaScript로 비슷하게 표현하면 객체 생성 함수들을 Map에 등록한 것과 같습니다.

```ts
const registry = new Map();

registry.set(
  COMPLETION_PORT,
  () => new EchoCompletionAdapter(),
);

const completion = registry.get(COMPLETION_PORT)();
```

Nest는 이 registry보다 훨씬 많은 일을 합니다. 필요한 객체의 생성 순서를 계산하고, 생성자에 넣어 주고, singleton이나 request scope 같은 수명도 관리합니다.

Nest 문서에서 Provider는 Service, Repository, Factory, Helper처럼 **Nest가 만들고 다른 객체에 주입할 수 있는 대상 전체**를 가리킵니다. [NestJS Providers](https://docs.nestjs.com/providers)

`Provider`라는 API와 등록 문법은 Nest 특유의 방식이 맞습니다. 하지만 기반 개념인 **Dependency Injection Container가 객체를 대신 만들고 연결한다**는 방식은 Nest만의 것이 아닙니다. Spring의 Bean, Angular의 Provider, ASP.NET Core의 Service 등록도 같은 계열입니다.

## Service와 Provider는 다른가?

둘은 분류 기준이 다릅니다.

- **Service**: 이 객체가 애플리케이션에서 무슨 일을 하는가
- **Provider**: 이 객체를 Nest가 생성·주입 대상으로 관리하는가

현재 `AssistService`는 두 가지에 모두 해당합니다.

```text
업무 역할로 보면       → Application Service
Nest의 관리 대상으로 보면 → Provider
```

모든 Provider가 Service인 것은 아닙니다. Adapter, 설정 객체, Factory도 Nest에 등록하면 Provider가 될 수 있습니다.

```text
Provider라는 큰 분류
├─ AssistService
├─ EchoCompletionAdapter
├─ HttpCompletionAdapter
├─ CompletionRouter
└─ 설정값이나 Factory 결과
```

## Port는 무엇인가?

Port는 **Service가 바깥 기술에 요구하는 능력의 규격**입니다.

현재 Core에는 대략 다음 계약이 있습니다.

```ts
interface CompletionPort {
  complete(request: CompletionRequest): Promise<CompletionResult>;
}
```

쉽게 말하면 다음 요구사항입니다.

> “누가 수행하는지는 모르겠지만, `complete()`를 호출하면 생성 결과를 돌려줘야 한다.”

Port는 실제 일을 하지 않습니다. TypeScript interface이므로 설계 규격에 가깝습니다.

USB 규격을 떠올리면 됩니다.

```text
USB Port 규격
└─ 이 모양과 신호 규칙을 지켜라

CompletionPort 규격
└─ complete(request)를 제공해라
```

## Adapter는 무엇인가?

Adapter는 그 Port 규격을 지키면서 **실제 일을 수행하는 구현체**입니다.

```ts
class EchoCompletionAdapter implements CompletionPort {
  complete(request) {
    // 로컬에서 echo 결과 생성
  }
}
```

```ts
class HttpCompletionAdapter implements CompletionPort {
  complete(request) {
    // 외부 HTTP 서버에 요청
  }
}
```

둘은 내부 구현이 다르지만 Service 입장에서는 둘 다 똑같이 보입니다.

```text
CompletionPort
├─ EchoCompletionAdapter가 구현
└─ HttpCompletionAdapter가 구현
```

그래서 `AssistService`는 다음처럼 Adapter 이름을 몰라도 됩니다.

```ts
class AssistService {
  constructor(
    private readonly completion: CompletionPort,
  ) {}

  assist(request) {
    return runAssist(request, this.completion);
  }
}
```

## 이 용어들의 관계

현재 코드에 정확히 대입하면 다음과 같습니다.

| 용어 | 현재 코드 | 맡은 일 |
| --- | --- | --- |
| Controller | `AssistController` | HTTP 요청을 받고 응답을 보냄 |
| Service | `AssistService` | HTTP 입력을 Core use case에 전달하고 결과를 응답 형태로 옮김 |
| Port | `CompletionPort` | “completion을 수행할 수 있어야 한다”는 규격 |
| Adapter | `EchoCompletionAdapter`, `HttpCompletionAdapter` | Port 규격에 맞춰 실제 completion 수행 |
| Provider 등록 | `{ provide, useFactory, inject }` | Nest에게 어떤 객체를 어떻게 만들고 연결할지 알려줌 |
| DI Container | Nest runtime | Provider 등록을 읽고 실제 객체를 생성·주입함 |

여기에는 서로 다른 두 종류의 용어가 섞여 있습니다.

```text
Nest 프레임워크 용어
Controller, Module, Provider, Scope

아키텍처 용어
Application Service, Port, Adapter
```

`AssistService`나 Adapter가 Nest에 등록되면 아키텍처 역할을 가지면서 동시에 Nest Provider가 됩니다. 이 두 분류가 겹치기 때문에 처음 보면 같은 단계의 용어처럼 느껴지는 것입니다.

## Nest 없이 먼저 보면

Echo를 사용하는 가장 단순한 프로그램은 이것뿐입니다.

```ts
const echo = new EchoCompletionAdapter();
const service = new AssistService(echo);

await service.assist({ prompt: 'hello' });
```

HTTP Adapter로 바꾸고 싶으면 객체 하나만 바꿉니다.

```ts
const http = new HttpCompletionAdapter({
  baseUrl: 'http://localhost:4000',
});

const service = new AssistService(http);
```

여기까지가 Port/Adapter와 수동 의존성 주입입니다.

Nest Provider는 위 코드를 설정 형태로 바꾼 것입니다.

```ts
{
  provide: COMPLETION_PORT,
  useFactory: () => new EchoCompletionAdapter(),
}
```

그리고 Nest가 내부적으로 다음 작업을 대신합니다.

```ts
const completion = new EchoCompletionAdapter();
const service = new AssistService(completion);
const controller = new AssistController(service);
```

## 지금 기억할 것

지금은 네 문장만 기억하면 충분합니다.

1. **Service는 어떤 업무 흐름을 진행한다.**
2. **Port는 Service가 필요로 하는 능력의 규격이다.**
3. **Adapter는 그 규격에 맞춰 실제 기술로 일을 수행한다.**
4. **Provider 등록은 어떤 Adapter 객체를 Service에 넣을지 Nest에게 알려준다.**

```text
Service: “completion 능력이 필요해.”
Port: “그 능력은 complete() 모양이어야 해.”
Adapter: “내가 Echo 또는 HTTP 기술로 실제 수행할게.”
Provider: “Nest야, 이번 실행에서는 이 Adapter를 넣어줘.”
```

`completion.binding.ts`가 어려웠던 이유는 이 네 관계를 배운 뒤에 봐야 할 **startup/request 두 조립 방식까지 한꺼번에 담고 있기 때문**입니다. 먼저 수동 세 줄을 확실히 잡고, 그다음 고정 Provider 한 개, 마지막에 request Router 순서로 보면 됩니다. 이해 속도의 문제가 아니라 설명 순서의 문제입니다.

<small style="opacity:0.55">‹23:37 KST› 맥락: `/Users/hynu/learn/turborepo-platform-lab/apps/api/src/assist/completion.binding.ts`를 검토하다 Nest Provider와 Port·Adapter·Service 용어가 한 파일에 겹쳐 관계를 이해하기 어려워진 상황.</small>

<!-- /q -->
