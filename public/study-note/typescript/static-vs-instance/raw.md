
> 한 줄: 기준은 하나다 — **그 동작이 객체별 상태와 정체성(`this`)을 필요로 하는가.** 필요하면 인스턴스 메서드, 필요하지 않고 클래스 자체에 속한 연산이면 static, 클래스와 특별한 관계도 없으면 그냥 module-level 함수다.

## 큰 그림

인스턴스 메서드에는 **보이지 않는 첫 번째 인자 `this`** 가 있다고 보면 된다.

```ts
account.withdraw(100);
// 개념적으로는
withdraw(account, 100);
```

`withdraw()`가 어느 계좌의 `balance`를 읽고 바꿔야 하는지 알려주는 것이 `account`, 즉 `this`다. static 메서드는 그 자리를 받지 않는다.

```ts
Math.max(10, 20);
AssistModule.register(config);
```

`Math`·`AssistModule`은 **타입·클래스 이름에 소속된 함수**일 뿐, 특정 `Math` 객체나 `AssistModule` 객체의 상태를 읽지 않는다. 그래서 선택은 문법 취향이 아니라 **"이 동작에 주인이 있는가"** 라는 의미 판단이다.

## 핵심

식당에 비유하면, 인스턴스 메서드는 **한 테이블의 주문서**다. "물 더 주세요"는 반드시 어느 테이블인지가 붙어야 뜻이 생긴다. static 메서드는 **가게 앞에 붙은 안내판**이다. "영업시간 11–22시", "예약은 이 번호로" — 특정 테이블에 속하지 않고 가게 자체에 속한다. 안내판을 읽으려고 테이블에 앉을 필요는 없다.

메커니즘은 JavaScript 객체 모델에서 확인된다.

```text
BankAccount 클래스(실제로는 constructor 객체)
├─ static open()                 ← 클래스에 붙은 함수
└─ prototype
   └─ withdraw()                 ← 인스턴스들이 공유하는 함수

accountA                         accountB
├─ balance: 100                  ├─ balance: 500
└─ prototype 연결 ───────────────┴─▶ BankAccount.prototype
```

여기서 중요한 것은 **인스턴스 메서드 코드가 객체마다 복사되지 않는다**는 점이다. 일반적인 class 메서드는 prototype에 한 번 있고 모든 인스턴스가 공유한다. 인스턴스마다 생기는 것은 주로 `balance` 같은 상태다. 따라서 static의 진짜 이득은 **메서드 메모리 절약이 아니라, 불필요한 객체 상태와 수명주기를 만들지 않고 의도를 드러내는 것**이다.

## 깊이

**static이 실제로 주는 이득 네 가지(필수).**

1. **의미 없는 인스턴스를 만들지 않는다.** `new Math()` 뒤에 `math.max()`를 호출해도 `math`가 보관할 상태가 없다면 그 객체는 아무 의미가 없다.
2. **이 연산은 객체 상태에 의존하지 않는다고 표현한다.** static 메서드에서는 인스턴스 `this`를 쓸 수 없으므로, 호출자는 객체별 상태를 바꾸는 동작이 아님을 시그니처만 보고 안다.
3. **객체가 생기기 전의 생성·조립 API를 제공한다.** named factory가 대표적이다 — `User.fromJson(json)`, `Promise.resolve(value)`. 아직 인스턴스가 없으므로 클래스에서 출발한다.
4. **관련 함수를 개념적 이름 아래 묶는다.** `Math.max()`, `Number.isInteger()`처럼 어떤 타입과 강하게 관련된 연산임을 이름이 드러낸다.

단, TypeScript에서 상태 없는 함수를 전부 static class에 넣을 필요는 없다. 클래스와 특별히 결합되지 않은 계산은 module-level 함수가 더 단순하다.

```ts
export function readCompletionConfig(env: NodeJS.ProcessEnv) {}
```

**"객체 생성 전 조립 API"가 무슨 뜻인가(필수).** "객체가 생기기 전"은 클래스조차 없다는 뜻이 아니라, **우리가 쓰려는 도메인 객체나 서비스 인스턴스가 아직 만들어지지 않았다**는 뜻이다. 그 인스턴스를 어떻게 만들지부터 정해야 하니, 이미 존재하는 인스턴스의 메서드에 그 일을 맡길 수 없다. **집을 짓기 전에 설계도가 먼저 필요하다.**

```text
설정 입력
  ↓
생성·조립 API가 설계도 작성
  ↓
설계도를 바탕으로 객체 생성
  ↓
완성된 객체의 인스턴스 메서드 사용
```

완성된 집에게 "너를 어떻게 지어야 하는지 알려줘"라고 물을 수 없다. 그 질문을 하려면 집이 이미 있어야 해서 순서가 순환한다.

**경우 1 — named factory(필수).** 생성 규칙이 여러 개인 객체를 보자.

```ts
class User {
  private constructor(readonly id: string, readonly name: string) {}

  static createNew(name: string): User {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error('name is required');
    return new User(crypto.randomUUID(), normalizedName);
  }

  static restore(row: UserRow): User {
    return new User(row.id, row.name);
  }
}
```

인스턴스 메서드로 만들면 순서가 뒤집힌다.

```ts
const user = new User(/* 무엇을 넣어야 하지? */);
const realUser = user.createNew('Kim');   // 새 User를 만들려고 의미 없는 임시 User가 먼저 필요
```

static factory의 값어치는 여기서 나온다 — `createNew`/`restore`/`fromJson`처럼 **생성 목적을 이름으로 구분**하고, **검증·정규화를 한곳에 모아** 반쪽짜리 객체 생성을 막고, 필요하면 정확한 class 인스턴스 대신 기존 객체·subtype·`Result`를 반환하고, 생성자와 내부 표현을 감춰 안정적인 생성 API만 공개한다. 반대로 생성 방식이 단순하고 유일하다면 `new User(...)`가 더 직접적이다.

**경우 2 — DI container에 넘길 설계도(필수).** NestJS의 `AssistModule.register()`는 factory와 비슷하지만 `AssistModule` 인스턴스를 반환하지 않는다. Nest가 나중에 객체들을 만들 수 있도록 **설계도인 `DynamicModule`을 반환**한다.

```ts
const completionConfig = readCompletionConfig(process.env);

@Module({ imports: [AssistModule.register(completionConfig)] })
export class AppModule {}
```

```text
1. process.env를 CompletionConfig로 변환
2. AssistModule.register(config) 호출
3. { module, controllers, providers } 설계도 반환
4. Nest가 설계도를 읽어 DI Container 구성
5. Nest가 Module·Controller·Service·Adapter 인스턴스 생성
6. 요청 처리 시작
```

`register()`를 인스턴스 메서드로 만들면 `new AssistModule()`로 **가짜 Module을 수동 생성**한 뒤 거기에 물어야 한다. 그 임시 객체는 Nest가 관리하는 인스턴스가 아니고, 상태도 없고 이후 쓰이지도 않는다 — 존재 이유가 없다. static으로 두면 중간 객체 없이 곧바로 설계도를 얻는다. 이득은 `new` 한 글자를 줄이는 게 아니라, **설계도 생성과 실제 인스턴스 생성을 분리**하고(구성 계산은 `register()`, lifecycle·의존성은 Nest), **DI container를 수동 생성으로 우회하지 않고**, bootstrap 입력을 호출부에서 보이게 하고, 같은 Module class로 테스트용·운영용 다른 구성을 만들 수 있게 하는 것이다.

**static이라는 키워드에서 이득이 다 나오는 건 아니다(곁가지).** 일반 함수도 인스턴스 없이 같은 일을 한다.

```ts
function createAssistModule(config: CompletionConfig): DynamicModule {
  return { module: AssistModule, providers: [...createCompletionProviders(config), AssistService] };
}
```

Nest에서 static을 쓰는 이유는 `AssistModule.register(config)`가 **더 발견하기 쉽고 관례에 맞기 때문**이다 — 이름만 봐도 "AssistModule을 이 설정으로 등록한다"는 관계가 드러난다. 클래스와 특별한 관계가 없는 계산이라면 `Utils` 같은 static class보다 일반 함수가 낫다.

**판단 순서(필수).**

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

1–3번의 실제 예가 Adapter다. `new HttpCompletionAdapter({ baseUrl })`는 생성 시 받은 `baseUrl`을 계속 보관하고(1·2번), Echo와 HTTP가 같은 `CompletionPort`를 구현하므로 다른 인스턴스로 교체된다(3번). 그래서 `complete()`는 인스턴스 메서드가 자연스럽다.

**가깝지만 아닌 것 — static ≠ singleton(필수).**

```text
static     = 인스턴스 없이 호출한다        (문법·소속의 문제)
singleton  = 인스턴스가 정확히 하나 존재한다 (수명·개수의 문제)
```

두 축이 다르므로 교차한다. singleton 객체는 인스턴스 메서드를 가질 수 있고, static 함수는 호출마다 다른 객체를 반환할 수 있다. `AssistModule.register()`는 static이지만 매번 새로운 `DynamicModule` 객체를 반환한다. 반대로 Nest의 기본 scope Provider는 실제 인스턴스이면서 application context 안에서 하나를 공유하므로 singleton이다.

## 용어 풀이

- **static 메서드(정적 메서드)** — 인스턴스가 아니라 클래스(constructor 객체)에 붙은 함수. 깨짐: "메모리를 아낀다"로 이해하면 근거가 무너진다 — 인스턴스 메서드도 prototype에 하나만 존재한다.
- **prototype(프로토타입)** — 같은 클래스의 인스턴스들이 메서드를 공유하는 객체. 깨짐: 메서드가 인스턴스마다 복사된다는 오해의 출처.
- **암묵적 `this`(implicit receiver)** — 인스턴스 메서드가 받는 보이지 않는 첫 인자. 깨짐: 화살표 함수·콜백으로 떼어 넘기면 이 결합이 끊어진다.
- **named factory(이름 있는 팩토리)** — 생성 목적을 이름으로 구분하는 static 생성 함수(`User.restore`). 깨짐: 생성 규칙이 하나뿐이면 `new`보다 이득이 없다.
- **설계도 객체(`DynamicModule`)** — 무엇을 어떻게 만들지 기술한 데이터. 실제 객체가 아니다. 깨짐: 설계도 반환과 인스턴스 반환을 같은 것으로 보면 static일 이유가 사라진다.
- **singleton(단일 인스턴스)** — 인스턴스가 정확히 하나 유지되는 수명 규칙. 깨짐: static과 동일시.

## 확인 질문

1. "static은 인스턴스 메서드보다 메모리를 아낀다"는 설명은 어디가 틀렸나? <details><summary>답</summary>일반 class의 인스턴스 메서드는 prototype에 한 번만 존재하고 모든 인스턴스가 공유하므로, 메서드 자체가 객체 수만큼 복사되지 않는다. 인스턴스마다 늘어나는 건 상태(필드)다. static의 이득은 메모리가 아니라 의미 — 보관할 상태가 없는 객체를 만들지 않고, 상태 비의존을 시그니처로 표현하는 것이다.</details>
2. `AssistModule.register()`가 static인데 singleton은 아니라고 말할 수 있는 근거는? <details><summary>답</summary>두 개념의 축이 다르다. static은 호출 방식(인스턴스 없이 클래스에서 호출), singleton은 수명·개수(인스턴스가 정확히 하나)다. `register()`는 호출마다 새로운 `DynamicModule` 객체를 반환하므로 단일 인스턴스 보장이 없다. 반대로 Nest 기본 scope Provider는 인스턴스지만 context 안에서 하나를 공유하는 singleton이다.</details>
3. (본문 밖) 테스트에서 시간을 고정하려고 `Clock.now()`를 static으로 뒀는데 fake로 교체할 방법이 없다. 판단 순서의 어느 단계를 건너뛴 결과이고 어떻게 고치나? <details><summary>답</summary>3번(다형성·DI·fake 교체가 필요한가)을 건너뛰었다. 교체 가능성이 요구되는 동작은 static 진입점이 아니라 인터페이스(`ClockPort`)와 그 구현 인스턴스로 두고 주입해야 한다 — static은 호출부에 클래스 이름이 하드코딩되므로 대체 지점이 남지 않는다. `Clock.now()`가 편해 보인 건 상태가 없어 4·5번에 걸린다고 착각했기 때문인데, 교체 요구가 있으면 상태 유무보다 그 요구가 먼저다.</details>

## 근거

- 실측: `apps/api/src/assist/assist.module.ts`의 `static register(config)`가 `{ module, controllers, providers }` 형태의 `DynamicModule`을 반환하고, `AppModule`의 `imports`에서 호출된다. 같은 파일 계열의 `readCompletionConfig(process.env)`는 클래스에 묶이지 않아 module-level 함수로 둠.
- 실측: `HttpCompletionAdapter`/`EchoCompletionAdapter`가 같은 `CompletionPort`를 구현하고 생성 시 `baseUrl`을 보관 — 인스턴스가 필요한 조건(설정 보관 + 교체 가능성)의 실제 사례.
- 1차 출처(링크만 기록, 개별 확인 안 됨): MDN *Classes — static / prototype*(static 멤버는 constructor 객체에, 메서드는 prototype에 위치), NestJS *Dynamic modules* 문서(`register()`가 `DynamicModule`을 반환하는 관례).

## 관련 개념

- 관련: [NestJS 동적 모듈](/study-note/nestjs/dynamic-module/) — `static register()`가 반환하는 설계도(`DynamicModule`)의 규약을 다룬다.
- 관련: [의존성 주입](/study-note/nestjs/dependency-injection/) — 판단 순서 3번(다형성·교체 필요)이 인스턴스를 요구하는 이유이자, 설계도를 먼저 요구하는 쪽의 정체다.
