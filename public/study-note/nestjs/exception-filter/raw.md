
> 한 줄: 오류를 HTTP 상태로 바꾸는 대응 관계는 어디엔가 반드시 있어야 하므로, Exception Filter의 값은 분기를 없애는 것이 아니라 **정상 흐름에서 떼어 한 경계에 모으는 것**이다 — 오류가 몇 개뿐이고 한 곳에서만 변환한다면 컨트롤러 분기가 이미 충분한 기준선이다.

## 큰 그림

번역이 일어나는 자리는 하나뿐이고, 그 자리를 어디에 둘지가 선택지다.

```text
Core/Application 오류                        HTTP 응답
  PromptPolicyError            ─┐
  CompletionSelectionError     ─┼─→ [ 번역 지점 ] ─→ 400 / 503 / 500
  CompletionUnavailableError   ─┘        │
                                        ├─ (a) 컨트롤러의 try/catch 분기
  알 수 없는 오류 ───────────────────────→ ├─ (b) toHttpException(error) 함수
                                        └─ (c) Exception Filter
```

## 핵심

세관 창구에 비유하면 된다. 안쪽(도메인)은 "정책 위반", "공급자 사용 불가"라는 자기 언어로만 말하고, 바깥(HTTP)은 400·503이라는 숫자만 이해한다. 누군가는 통역을 해야 하는데, **통역사를 창구 직원에게 겸임시킬지(컨트롤러 분기) 통역 부스를 따로 둘지(Exception Filter)**가 이 노트의 질문이다. 통역 자체를 없애는 선택지는 없다.

오류가 3개이고 이 컨트롤러에서만 변환한다면 컨트롤러 안의 `try/catch` 분기가 충분히 좋은 기준선이다. 장점이 둘 있다 — 도메인·조립 오류가 어떤 HTTP 상태로 바뀌는지 한눈에 보이고, 알 수 없는 오류는 다시 던져 500 처리를 유지한다.

분기가 여러 메서드나 컨트롤러에서 **반복되기 시작하면** Exception Filter로 옮기는 것이 가장 자연스럽다. 컨트롤러는 성공 흐름만 남는다.

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

`@Catch()`는 여러 오류 타입을 한 필터에 지정할 수 있고, 필터는 메서드·컨트롤러·전역 범위로 적용할 수 있다.

## 깊이

**Filter는 분류를 없애지 않는다(가장 중요한 오해).** 오류와 HTTP 상태의 대응 관계는 어딘가에 반드시 존재한다. 위 필터 안에도 `instanceof` 분기가 그대로 남아 있다. 필터가 개선하는 것은 두 가지뿐이다 — ① 그 분기를 컨트롤러의 정상 흐름에서 **분리**하고, ② 반복 없이 **한 경계에 모으는** 것. "필터를 쓰면 분기가 사라진다"는 기대로 도입하면 파일만 하나 늘고 이득이 없다.

**범위는 전역보다 컨트롤러가 적절하다.** 다른 기능이 우연히 같은 오류 클래스를 쓰더라도 **반드시 같은 HTTP 계약을 가져야 하는 것은 아니다.** 전역 필터는 그 자유를 미리 빼앗는다. 그래서 여기서는 `@UseFilters()`를 Assist 컨트롤러에 붙여 "이 경계의 오류 번역"으로 범위를 좁힌다.

**알 수 없는 오류는 다시 던져 500을 유지한다.** 컨트롤러 분기에서든 필터에서든, 마지막 `throw error`(또는 `@Catch()`에 그 클래스를 넣지 않는 것)를 유지해야 **예상하지 못한 버그를 잘못된 400 응답으로 숨기지 않는다.** 모든 오류를 400으로 만드는 필터는 모니터링에서 장애를 지워 버린다.

**대안 셋과 트레이드오프.**

| 대안 | 적합한 상황 | 대가 |
| --- | --- | --- |
| `toHttpException(error)` 함수로 추출 | 파일을 추가할 정도는 아니지만 컨트롤러를 짧게 만들고 싶을 때 | `try/catch`는 그대로 남는다 |
| `Result` 또는 판별 가능한 유니온 반환 | `throw` 대신 `{ ok: false, code: 'PROMPT_POLICY' }`로 예상 가능한 실패를 값으로 표현해 컴파일러의 누락 검사를 받고 싶을 때 | Core와 Application의 반환 계약을 크게 바꾼다 — 초기 단계에는 과하다 |
| 오류 클래스가 `BadRequestException`을 상속 | 코드가 가장 짧아진다 | **Core가 NestJS와 HTTP를 알게 되어 안쪽/바깥쪽 경계가 무너진다 — 피한다** |

세 번째는 유혹이 크지만 방향이 반대다. 도메인 오류에 HTTP 상태를 심으면 같은 도메인을 CLI·큐·배치에서 재사용할 수 없다.

**진행 순서(사례 판단).** 이 프로젝트에서는 지금은 컨트롤러 분기를 유지하고, 같은 변환이 다른 엔드포인트에 반복되거나 오류 종류가 늘어날 때 `AssistExceptionFilter`로 추출하는 순서가 좋다. 참고로 두 개의 400 분기를 `||`로 합치는 것은 문장 수만 줄일 뿐 구조적 개선이 아니다 — 줄일 대상은 문장이 아니라 **번역 지점의 개수**다.

## 용어 풀이

- **Exception Filter(예외 필터)** — 던져진 예외를 가로채 응답으로 바꾸는 Nest 구성요소. `ExceptionFilter` 인터페이스의 `catch(error, host)`를 구현한다. / 깨짐: 미들웨어·인터셉터와 섞으면 실행 지점을 잘못 짚는다.
- **`@Catch(...)`** — 이 필터가 처리할 예외 타입 목록을 지정하는 데코레이터. 인자를 비우면 모든 예외를 잡는다. / 깨짐: 비워 두면 알 수 없는 오류까지 삼켜 500이 사라진다.
- **`@UseFilters(...)`** — 필터를 메서드·컨트롤러 범위에 붙이는 데코레이터(전역은 `app.useGlobalFilters()`). / 깨짐: 범위를 전역으로 올리면 다른 기능의 HTTP 계약까지 강제한다.
- **`ArgumentsHost`** — 실행 컨텍스트를 감싸 전송 방식별 객체를 꺼내는 추상(`switchToHttp()` 등). / 깨짐: Express 객체를 직접 가정하면 다른 HTTP adapter에서 깨진다.
- **`HttpAdapterHost`** — 현재 사용 중인 HTTP adapter(Express/Fastify)를 얻는 헬퍼. 필터가 프레임워크 API에 직접 묶이지 않게 한다.
- **판별 가능한 유니온(discriminated union)** — 공통 태그 필드로 갈라지는 타입 합집합. 실패를 값으로 표현할 때 컴파일러가 누락된 분기를 잡아 준다. / 깨짐: 태그 없이 optional 필드로만 구분하면 검사 이득이 사라진다.

## 확인 질문

1. Exception Filter를 도입했는데도 `instanceof` 분기가 남아 있다면 잘못 만든 것인가? <details><summary>답</summary>아니다. 오류↔상태 대응 관계는 어딘가에 반드시 있어야 한다. 필터의 이득은 그 분기를 정상 흐름에서 분리하고 한 곳에 모으는 것이며, 분기를 없애는 것이 아니다.</details>
2. 도메인 오류 클래스를 `BadRequestException` 상속으로 바꾸면 코드가 짧아지는데 왜 피하나? <details><summary>답</summary>Core가 NestJS와 HTTP를 알게 되어 안쪽이 바깥을 참조하는 모양이 된다. 그 도메인을 CLI·큐·다른 전송 방식에서 재사용할 수 없고, 경계 규칙이 무너진다.</details>
3. (본문 밖) 같은 `PromptPolicyError`를 배치 워커에서도 던지게 되었다. 필터를 전역으로 올려 두었다면 무슨 일이 생기나? <details><summary>답</summary>HTTP 요청이 아닌 실행 경로에까지 HTTP 응답 번역 규칙이 걸린다. `switchToHttp()`가 의미 없는 컨텍스트에서 호출되거나, 워커가 원하는 실패 표현(재시도·데드레터)이 400 응답 계약에 끌려간다. 필터를 HTTP 컨트롤러 범위로 유지하고, 워커 쪽 번역은 그 경계에서 따로 정하는 편이 맞다.</details>

## 근거

- 실측(`turborepo-platform-lab`, M15): `apps/api/src/assist/assist.controller.ts`(도메인·조립 오류를 HTTP 상태로 번역하는 `try/catch` 분기, 마지막 `throw error`로 500 유지), Core의 `PromptPolicyError`·`CompletionUnavailableError`·`CompletionSelectionError`.
- [NestJS Exception filters](https://docs.nestjs.com/exception-filters) — `@Catch()`의 다중 타입 지정, 메서드·컨트롤러·전역 적용 범위, 클래스 기반 등록. 1차. 확인 2026-08-15.

## 관련 개념

- 앞: [Controller·Application Service·Core의 책임 배분과 오류 번역](/study-note/software-architecture/layer-responsibility/) — 어느 계층이 HTTP를 알아도 되는지가 정해져야 번역 위치를 고를 수 있다.
- 관련: [Domain·Application·Port·Adapter의 책임 구분 기준](/study-note/software-architecture/domain-application-adapter/) — 오류 클래스가 어느 층에 사는지에 따라 상속 대안의 대가가 달라진다.
- 관련: [NestJS DI 컨테이너와 Provider](/study-note/nestjs/dependency-injection/) — 조립 단계에서 나는 오류(`CompletionSelectionError`)가 어디서 생기는지.
