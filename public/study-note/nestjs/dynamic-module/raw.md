
> 한 줄: Dynamic Module은 **bootstrap 시점에 설정을 읽어 Module 구성표를 만들어 반환하는 것**이며, `static register(config)`의 `static`은 Nest 규약도 singleton 선언도 아닌 그냥 클래스 문법이다.

## 큰 그림

정적 Module과 Dynamic Module은 **같은 종류의 설계도**를 만드는 두 방법이다. 다른 것은 그 설계도가 언제 확정되는가뿐이다.

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

실행은 두 단계로 나뉜다. 이 분리를 놓치면 "언제 무엇이 만들어지는지"가 계속 흐려진다.

```text
AppModule 파일 평가
  → AssistModule.register(config) 실행
  → 등록할 Provider 목록 결정          ← 설계도 결정 단계

Nest bootstrap
  → 결정된 Provider의 useFactory 실행
  → 실제 CompletionPort 객체 생성      ← 객체 생성 단계
```

## 핵심

가구 조립에 비유하면, 정적 Module은 **이미 인쇄된 조립 설명서**다. 상자를 열면 늘 같은 부품 목록이 적혀 있다. Dynamic Module은 **주문서를 보고 그 자리에서 설명서를 인쇄하는 것**이다. "왼손잡이용"이라고 적어 보내면 그에 맞는 부품 목록이 인쇄된다. 어느 쪽이든 실제 조립은 그 설명서를 읽은 공장(Nest)이 한다.

정적 쪽은 클래스 자체를 넘긴다.

```ts
@Module({
  controllers: [AssistController],
  providers: [AssistService],
})
export class AssistModule {}

// 사용
imports: [AssistModule]
```

Dynamic 쪽은 설정을 받은 함수를 호출하고, 그 **반환 객체**를 넘긴다.

```ts
imports: [AssistModule.register(config)]
```

반환값의 실제 모양은 이렇다.

```ts
{
  module: AssistModule,                       // ← 어느 Module의 구성인지 (필수)
  controllers: [AssistController],
  providers: [
    ...createCompletionProviders(config),     // ← 설정에 따라 달라지는 부분
    AssistService,
  ],
}
```

`@Module({...})`에 넣던 `controllers`·`providers`·`imports`·`exports`를 그대로 가질 수 있고, 여기에 **`module` 속성이 반드시 추가된다**. Nest 11 타입 정의도 `DynamicModule extends ModuleMetadata`로 두고 `module`만 필수로 요구한다. Nest는 `AssistModule` 클래스가 아니라 이 반환 객체를 받아 등록한다.

## 깊이

**"Dynamic"은 요청마다가 아니다(핵심 오해).** 앱을 bootstrap하면서 설정에 따라 구성표를 동적으로 만든다는 뜻이다. request 모드에서도 `register()` 자체는 시작할 때 한 번 호출되고, 그 반환값 안에 `Scope.REQUEST` Provider가 들어 있어서 **그 Provider만** 요청마다 생성된다. 구성표는 한 번, 객체는 scope에 따라 여러 번이다.

**`static`은 Nest 규약이 아니다.** `static`이 붙으면 인스턴스를 만들지 않고 클래스에서 바로 호출한다는 JS/TS 문법일 뿐이다.

```ts
class Example { register() {} }
new Example().register();     // static 없으면 객체가 먼저 필요

class Example2 { static register() {} }
Example2.register();          // static이면 클래스에서 바로
```

앱을 조립하는 시점에 `imports: [AssistModule.register(config)]`로 호출해야 하므로 — 즉 Nest가 `AssistModule` 인스턴스를 만들어 주기를 기다릴 수 없으므로 — `static`이다. `register`라는 **이름도 예약어가 아니라 관례**다. `configure`, `create` 같은 이름으로 정의하고 직접 호출해도 `DynamicModule`을 반환하면 동작한다. Nest 문서가 관례로 제시하는 이름은 `register()`와 `forRoot()`다.

**static ≠ singleton(가깝지만 아닌 것).** `static`은 **함수를 어디서 호출하는가**에 관한 문법이고, singleton은 **객체가 몇 개 만들어지는가**에 관한 수명주기다. `static register()`는 호출할 때마다 새 객체를 반환할 수 있다.

```ts
const first = AssistModule.register(config);
const second = AssistModule.register(config);
first === second; // false
```

수명을 정하는 것은 Provider의 `scope`다. `scope`를 지정하지 않으면 기본 `DEFAULT`, 즉 application context에서 공유되는 singleton이고, `Scope.REQUEST`면 HTTP 요청마다 생성된다. 따라서 `register()`는 **어떤 Provider 설계도를 등록할지**만 결정하고 객체 수명은 결정하지 않는다.

**설정을 매개변수로 받는 이유는 접근 불가가 아니라 은닉 회피다.** `AssistModule` 안에서도 `process.env`에 접근할 수 있고, 아래 코드도 기술적으로 정상 동작한다.

```ts
static register(): DynamicModule {
  return { module: AssistModule, providers: createCompletionProviders(process.env) };
}
```

하지만 이 모양에서는 `AssistModule.register()`만 보고 이 모듈이 환경 변수에 의존한다는 사실을 알 수 없다. 테스트도 전역 `process.env`를 수정하고 원복해야 해서 병렬 테스트끼리 간섭한다. 밖에서 전달하면 의존성이 호출부에 드러나고 네 가지가 열린다.

- `AppModule`이라는 Composition Root가 설정의 출처를 결정한다.
- 테스트가 전역 상태를 건드리지 않고 `AssistModule.register({ COMPLETION_ADAPTER: 'echo' })`처럼 독립된 입력을 넘긴다.
- 같은 프로세스에서 서로 다른 설정의 TestingModule을 동시에 만들 수 있다.
- `createCompletionProviders(env)`를 입력·출력이 드러나는 함수로 검사할 수 있다.

쉽게 말하면 모듈이 냉장고에서 몰래 재료를 꺼내게 하지 않고, 조립하는 쪽이 재료를 손에 쥐여 주는 것이다.

**`process.env`를 그대로 넘기는 것은 중간 단계다(한계).** 전역 객체를 통째로 전달하면 완전한 설정 스냅샷이 아니다. 더 완성된 형태는 바깥에서 필요한 값만 읽어 검증한 뒤 좁은 타입으로 넘기는 것이다.

```ts
const config = readCompletionConfig(process.env);
imports: [AssistModule.register(config)]

interface CompletionConfig {
  readonly lifecycle: 'startup' | 'request';
  readonly adapter: 'echo' | 'http';
  readonly httpBaseUrl?: string;
}
```

그러면 `AssistModule`은 `process.env`가 존재하는지도 모르고 검증이 끝난 자기 설정만 받는다. 정리하면 매개변수 전달은 **전역 접근을 명시적 의존성으로 바꾸는 단계**이고, 좁고 불변인 설정 객체가 그 완성형이다.

**`Object.freeze()`는 `Readonly`가 컴파일 후 사라지기 때문에 쓴다.** `Readonly<T>`는 TypeScript 검사에만 존재하므로 JS 코드·`any` 변환·다른 참조를 통한 변경을 막지 못한다. `Object.freeze()`는 실제 객체의 속성 변경·추가·삭제를 막고, strict mode에서 변경을 시도하면 `TypeError`가 난다.

```ts
const config = Object.freeze({ lifecycle: 'startup', adapter: 'echo' });
config.adapter = 'http'; // 변경되지 않음
```

**스냅샷 격리와 동결은 다른 효과다.** ① `process.env`에서 **새 객체를 만드는 것** = 원본 env가 나중에 바뀌어도 설정이 따라 바뀌지 않는 스냅샷 격리. ② 그 객체에 **`Object.freeze()`를 적용하는 것** = 만들어진 설정을 다른 코드가 바꾸지 못하게 하는 런타임 불변성. 둘 중 하나만 하면 나머지 구멍이 남는다. 그리고 `Object.freeze()`는 **얕은 동결**이라 값이 문자열뿐인 지금은 충분하지만, 중첩 객체가 생기면 내부까지 자동으로 동결되지 않는다.

**설정이 "언제 선택하는가"까지 정할 수 있다(사례).** 이 프로젝트의 `COMPLETION_SELECTION_LIFECYCLE`은 어떤 Adapter를 쓸지가 아니라 **Adapter를 언제 선택할지** 정하는 자체 환경 변수다(Nest 기본 제공 이름이 아니다).

```text
lifecycle=startup                     lifecycle=request
bootstrap 때 Echo/HTTP 선택            요청마다 request-scoped Router 생성
→ 모든 요청이 같은 Port 사용            → x-completion-adapter 헤더 해석
→ 요청 헤더는 선택에 영향 없음          → 해당 singleton Adapter에 위임
```

세 입력의 책임이 갈린다 — `COMPLETION_SELECTION_LIFECYCLE`은 **언제** 선택하는가, `COMPLETION_ADAPTER`는 startup 모드에서 **무엇을** 선택하는가, `x-completion-adapter` 헤더는 request 모드에서 이번 요청이 **무엇을** 선택하는가. `request` 모드에서는 `COMPLETION_ADAPTER`를 읽지 않지만, 어느 요청이든 HTTP를 고를 수 있으므로 `COMPLETION_HTTP_BASE_URL`은 시작할 때 미리 검증한다. 이 변수는 Provider 수명과 연결되지만 같은 개념은 아니다 — `createCompletionProviders(config)`에 그런 정책을 **우리가 작성한** 결과다.

## 용어 풀이

- **Dynamic Module(동적 모듈)** — 설정을 받아 Module 구성표(`DynamicModule` 객체)를 반환하는 방식. / 깨짐: "요청마다 모듈이 새로 만들어진다"로 읽으면 scope와 뒤섞인다.
- **`DynamicModule`** — `ModuleMetadata`(`controllers`·`providers`·`imports`·`exports`)에 `module` 속성이 더해진 반환 타입. / 깨짐: `module`을 빼면 어느 Module의 구성인지 알 수 없어 등록되지 않는다.
- **`static` 메서드(정적 메서드)** — 인스턴스 없이 클래스에서 바로 호출하는 메서드. / 깨짐: singleton 선언으로 오해하면 수명 논의가 엉킨다.
- **scope(스코프)** — Provider 객체의 수명 범위. `DEFAULT`(공유 singleton) / `REQUEST`(요청마다) / `TRANSIENT`. / 깨짐: `static`이나 `register` 호출 횟수와 연결하면 틀린다.
- **Composition Root(조립 루트)** — 설정의 출처와 객체 그래프를 결정하는 단 한 곳(여기서는 `AppModule`). / 깨짐: 각 모듈이 스스로 env를 읽으면 루트가 사라진다.
- **`Object.freeze()`** — 객체 속성의 변경·추가·삭제를 런타임에서 막는 JS 표준 함수(얕은 동결). / 깨짐: 중첩 객체까지 불변이라고 가정.
- **스냅샷 격리(snapshot isolation)** — 원본이 바뀌어도 영향받지 않도록 값을 복사해 새 객체로 고정하는 것. / 깨짐: 동결과 같은 효과로 착각.

## 확인 질문

1. `COMPLETION_SELECTION_LIFECYCLE=request`로 띄웠을 때 `AssistModule.register()`는 요청마다 몇 번 호출되나? <details><summary>답</summary>0번 — bootstrap 때 한 번만 호출된다. 요청마다 새로 생기는 것은 반환된 구성표 안의 `Scope.REQUEST` Provider(여기서는 Router)뿐이다.</details>
2. 설정 객체를 `Readonly<CompletionConfig>` 타입으로만 선언하고 `Object.freeze()`를 생략하면 무엇을 못 막나? <details><summary>답</summary>런타임 변경 전부. `Readonly`는 컴파일 후 사라지므로 순수 JS 호출부, `any` 캐스팅, 다른 참조를 통한 대입을 막지 못한다. 컴파일 타임 실수만 걸러진다.</details>
3. (본문 밖) `AssistModule.register(config)`를 두 개의 서로 다른 config로 같은 `AppModule`의 `imports`에 함께 넣으면 어떤 문제가 예상되나? <details><summary>답</summary>두 호출은 `module` 속성이 같은 클래스를 가리키는 서로 다른 구성표를 만든다. Nest는 클래스와 동적 메타데이터를 함께 묶어 모듈 토큰을 만들므로 별개 인스턴스로 등록될 수 있지만, 그 결과 같은 `AssistController`의 라우트가 두 번 등록되고 `COMPLETION_PORT`를 요청하는 쪽은 어느 구성의 Adapter를 받는지 코드만 보고 알 수 없다. 설정별로 나누고 싶다면 토큰을 분리하거나 모듈 자체를 분리하는 것이 안전하다(정확한 토큰 동작은 Nest의 `ModuleTokenFactory`로 확인).</details>

## 근거

- 실측(`turborepo-platform-lab`, M15): `apps/api/src/app.module.ts`(`imports: [AssistModule.register(process.env)]`), `apps/api/src/assist/assist.module.ts`(`static register(config): DynamicModule`), `apps/api/src/assist/completion.config.ts`(`Object.freeze`된 설정 스냅샷, `COMPLETION_SELECTION_LIFECYCLE` 해석), `apps/api/src/assist/completion.binding.ts`(`createCompletionProviders(config)`의 startup/request 정책).
- 설치된 Nest 11.1.28의 타입 정의: `DynamicModule extends ModuleMetadata`이며 `module`만 필수.
- [NestJS Dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules) — Dynamic Module의 반환 계약과 `register()`/`forRoot()` 이름 관례. 1차. 확인 2026-08-16.

## 관련 개념

- 앞: [NestJS DI 컨테이너와 Provider](/study-note/nestjs/dependency-injection/) — Provider 등록이 무엇인지 알고 나서 "무엇을 등록할지 설정으로 정한다"가 읽힌다.
- 앞: [TypeScript static 메서드와 인스턴스 메서드의 선택 기준](/study-note/typescript/static-vs-instance/) — `static`이 무엇이고 무엇이 아닌지의 문법 배경.
- 관련: [Controller·Application Service·Core의 책임 배분과 오류 번역](/study-note/software-architecture/layer-responsibility/) — 설정의 출처를 Composition Root에 두는 판단이 계층 책임과 어떻게 맞물리는지.
