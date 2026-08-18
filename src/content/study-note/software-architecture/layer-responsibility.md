---
title: "요청 경로에서 Controller·Application Service·Core의 책임 배분과 오류 번역"
description: "HTTP 요청 하나가 Core를 지나 응답이 되기까지 각 층이 무엇을 소유하는가 — 모양이 같은 요청 타입과 입력 타입을 별개 경계로 두는 이유, 도메인 오류를 HTTP status로 번역하는 규칙, 얇은 Service 래퍼의 역할과 남용, Adapter 생성 책임을 Composition Root로 옮기는 이유."
---

> 한 줄: 각 층은 **바뀌어야 하는 이유**로 갈린다 — Controller는 "이 결과와 오류를 HTTP로 어떻게 표현할까", Application Service는 "외부 요청을 어떤 내부 작업으로 조정할까", Core는 "이 입력을 받아들일 수 있으며 어떤 결과를 만들까"만 답한다.

## 큰 그림

```text
HTTP JSON
{"prompt":"  ping  "}
    ↓ Controller: HTTP 요청을 Application 호출로 번역
AssistRequest { prompt: "  ping  " }
    ↓ Application Service: HTTP 타입 → Core 타입
AssistInput { prompt: "  ping  " }
    ↓ Core: 정규화와 정책 판단
"ping"
    ↓ Core use case
AssistOutput { text: "accepted: ping" }
    ↓ Application Service: Core 타입 → HTTP 타입
AssistResponse { text: "accepted: ping" }
    ↓ Controller/Nest
HTTP 201 JSON
```

이 그림에서 눈여겨볼 것은 층의 개수가 아니라 **같은 값이 경계를 넘을 때마다 타입 이름이 바뀐다는
점**이다.

## 핵심

호텔 프런트를 생각하면 층이 보인다. **프런트 직원**은 손님의 말을 내부 업무 요청서로 옮기고, 처리
결과를 손님이 알아듣는 말로 되돌려 준다. **업무 담당자**는 요청서를 받아 어떤 부서에 어떤 순서로
넘길지 정한다. **규정집**은 그 요청을 받아들일 수 있는지만 판정한다. 규정집은 손님이 한국어를 쓰는지
영어를 쓰는지 모르고, 프런트 직원은 규정의 근거를 알 필요가 없다.

층별로 한 문장씩 쓰면 이렇게 된다.

- **Controller**: "이 내부 결과와 오류를 HTTP로 어떻게 표현할까?"
- **Application Service**: "외부 요청을 어떤 내부 작업으로 조정하고 결과를 어떻게 내보낼까?"
- **Core**: "이 prompt를 받아들일 수 있으며 어떤 결과를 만들까?"

최소 예시에서 Controller가 하는 일은 **번역 두 번**이다 — 들어올 때 요청을 Application 호출로,
나갈 때 도메인 오류를 HTTP status로.

```ts
@Post()
assist(@Body() request?: AssistRequest): AssistResponse {
  try {
    return this.assistService.assist(request ?? { prompt: '' });
  } catch (error) {
    if (error instanceof PromptPolicyError) throw new BadRequestException(error.message);
    throw error;   // 알 수 없는 오류는 그대로 → Nest가 500
  }
}
```

`request ?? { prompt: '' }`의 `??`는 body 자체가 없을 때 JavaScript의 `TypeError`로 500이 나지
않고 Core의 prompt 정책을 거쳐 의도한 400으로 번역되게 한다. `{}`처럼 객체는 있지만 `prompt`만
없는 경우에는 대체하지 않으며, Core의 문자열 검사에서 정책 오류가 된다.

## 깊이

**모양이 같은 두 타입을 왜 별개 경계로 두나(필수).** `AssistRequest`와 `AssistInput`은 지금
`{ prompt: string }`으로 **우연히** 모양이 같지만, 서로 다른 주인이 서로 다른 이유로 바꾸는
타입이다.

- `AssistRequest`: 외부 호출자가 지켜야 하는 HTTP 계약
- `AssistInput`: Core use case가 일을 수행하기 위해 요구하는 입력

HTTP 요청에 추적용 `requestId`가 추가돼도 Core에는 필요 없을 수 있다. 반대로 Core가 `actorId`를
요구하게 되면 Application Service가 인증 정보에서 채워 넣을 수 있고, 외부 JSON에 노출할 필요는
없다. 출력 쪽도 같다 — `AssistOutput`은 내부 결과이고 `AssistResponse`는 외부에 대한 공개 약속이다.
지금은 양쪽 모두 `{ text: string }`이라 복사 한 줄뿐이지만, Core 출력에 내부 진단값이 추가되거나
HTTP 응답 필드가 `answer`로 바뀌면 Service가 그 차이를 흡수한다.

**한계: 컴파일러는 이 경계를 강제하지 않는다(필수).** TypeScript는 구조적 타입 시스템이므로 모양이
같으면 둘을 서로 대입할 수 있다. 즉 지금 두 경계를 유지하는 것은 **타입의 소유 위치와
`{ prompt: request.prompt }`라는 명시적 매핑**이고, 컴파일러의 강제가 아니다. 더 강한 구분이
필요하면 branded type 같은 방법이 있지만, 작은 기준선 단계에는 과하다.

**오류 번역: 무엇을 400으로 바꾸고 무엇을 다시 던지나(필수).** `BadRequestException`은 Nest가
HTTP **400 Bad Request**로 바꾸는 예외다. "클라이언트 프로그램에서 예외가 났다"는 뜻이 아니라,
**서버가 받은 요청을 현재 형태로는 받아들일 수 없고 호출자가 요청을 고쳐야 한다**는 HTTP 분류다.

```text
PromptPolicyError
→ 요청 값이 정책 위반
→ Controller가 BadRequestException으로 번역
→ HTTP 400

알 수 없는 Error
→ 코드 버그·서버 장애·예상하지 못한 실패일 수 있음
→ 그대로 다시 던짐
→ Nest가 HTTP 500으로 처리
```

정책 오류만 400으로 바꾸는 이유는 공백 prompt나 길이 초과가 **호출자가 고칠 수 있는, 이미 알려진**
입력 오류이기 때문이다. 모든 오류를 400으로 잡으면 서버 버그까지 클라이언트 탓으로 표시하고 장애를
숨긴다. 오류 종류가 늘면 Controller 또는 별도 exception mapper가 `404`, `409`, `503`에 명시적으로
대응시킨다. **Core는 HTTP status를 모르고 자기 언어인 `PromptPolicyError`만 말하며, HTTP로 번역하는
책임은 바깥 층에 남는다.**

**얇은 Service 래퍼 — 역할과 남용(필수).** 현재 동작만 보면 `AssistService.assist()`는 Core의
`assist()`를 한 번 더 감싼 얇은 래퍼다. 그 역할은 둘이다.

1. Controller가 Core 타입과 호출 방법을 직접 알지 않게 한다.
2. HTTP DTO ↔ Core 입출력 매핑과 향후 여러 작업의 조정을 한곳에 둔다.

다만 이것을 보편 법칙으로 읽으면 안 된다. **영구적으로 매핑도 조정도 없는 아주 작은 애플리케이션이면
Controller가 Core 함수를 직접 호출하는 편이 더 단순하다.** 얇은 경계를 의도적으로 남기는 것은 이후
구조와 비교할 목적이 있을 때다.

**같은 이름이 겹칠 때(곁가지).** `constructor(private readonly assist: AssistService) {}`는
`this.assist` 필드를 동시에 만들기 때문에 `this.assist.assist(request)`가 문법적으로는 정상이다.
앞의 `assist`는 객체, 뒤의 `assist`는 메서드다. 동작이 완전히 같으므로 읽기 쉬운 쪽을 택한다.

```ts
constructor(private readonly assistService: AssistService) {}
return this.assistService.assist(request);
```

**Application Service가 Adapter를 생성하면 결합이 생긴다(전문가).** Service가 업무 흐름 실행뿐
아니라 **구체적인 Adapter 생성**까지 맡으면, Adapter를 바꿀 때 Service 코드도 함께 바뀐다.

```ts
private readonly completion = new EchoCompletionAdapter();
```

설정이 필요 없는 Echo 구현이라 이 줄은 문제없어 보인다. 그런데 HTTP 구현으로 이름만 바꾸면 실제로
컴파일이 깨진다 — HTTP 구현은 접속 주소가 필요하기 때문이다.

```text
TS2554: Expected 1 arguments, but got 0.
```

즉 Adapter를 교체하려면 `AssistService`가 (1) HTTP 구현에는 `baseUrl`이 필요하다는 사실, (2) 그
설정을 어디서 가져오는지, (3) Echo와 HTTP 중 무엇을 고를지까지 알아야 한다. 그러나 Service의 본래
책임은 요청을 Core 입력으로 옮기고 use case를 실행하는 것이다. **어떤 외부 구현을 만들고 설정할지는
애플리케이션을 조립하는 위치(Composition Root)의 책임**이다.

```ts
// Service는 만들지 않고 이미 만들어진 포트를 받는다
constructor(private readonly completion: CompletionPort) {}

// Module 같은 조립 지점이 구체 구현을 만든다
new HttpCompletionAdapter({ baseUrl });
```

그러면 Echo → HTTP 교체 때 조립 코드만 바뀌고 업무 흐름은 그대로 남는다. 여기서 말하는 **변경
비용**은 실행 속도나 돈이 아니라 "Adapter 하나를 바꿀 때 함께 수정해야 하는 코드와 책임의 범위"다.
그리고 **`new`가 언제나 나쁘다는 뜻이 아니다** — 교체 가능한 외부 기술을 Application Service가
직접 생성하고 있다는 점이 문제다.

## 용어 풀이

- **Controller(인바운드 어댑터)** — 전송 규약(HTTP)과 내부 호출 사이를 번역하는 층. 깨짐: 여기에
  사업 규칙이 들어가면 배치·다른 진입점에서 같은 규칙이 복제된다.
- **Application Service** — 유스케이스 실행 순서·트랜잭션·DTO 매핑을 조율한다. 깨짐: 조립(생성)
  책임까지 맡으면 구체 구현과 결합한다.
- **DTO(Data Transfer Object)** — 경계를 넘기 위한 데이터 모양. 깨짐: Core 타입을 그대로 외부에
  노출하면 내부 구조 변경이 곧 API 변경이 된다.
- **구조적 타입 시스템(structural typing)** — 이름이 아니라 모양이 같으면 호환된다고 보는 타입
  체계. 깨짐: 서로 다른 경계를 "같은 모양"만으로 안전하다고 믿는 것.
- **branded type(브랜드 타입)** — 구조적 타입에 표식을 붙여 구별 가능하게 만드는 기법. 깨짐: 작은
  단계에서 도입하면 얻는 것 없이 표기 비용만 늘어난다.
- **Composition Root(조립 지점)** — 구체 구현을 생성하고 주입하는 애플리케이션의 한 지점(Nest면
  Module). 깨짐: 여러 곳에 흩어지면 "어떤 구현이 쓰이는가"를 코드에서 추적할 수 없다.
- **`PromptPolicyError`** — Core가 자기 언어로 던지는 정책 위반 오류. 깨짐: Core가 HTTP status를
  직접 알게 만드는 순간 전송 규약이 안쪽으로 새어 든다.

## 확인 질문

1. `AssistRequest`와 `AssistInput`이 `{ prompt: string }`으로 같은데도 두 타입을 유지하는 근거는
   무엇이고, 그 근거의 한계는 무엇인가? <details><summary>답</summary>근거는 주인과 변경 이유가 다르다는 것 — HTTP 계약은 호출자가, Core 입력은 use case가 소유한다. 한계는 TypeScript가 구조적 타입 시스템이라 모양이 같으면 서로 대입되므로 컴파일러가 경계를 강제하지 않는다는 점이다. 지금은 타입의 소유 위치와 명시적 매핑이 설계 의도를 나타내고 있을 뿐이다.</details>
2. 알 수 없는 `Error`를 Controller에서 `BadRequestException`으로 바꾸면 무엇이 나빠지나?
   <details><summary>답</summary>서버 버그·장애가 400으로 표시되어 클라이언트 탓처럼 보이고, 500으로 드러나야 할 장애가 숨는다. 400은 "호출자가 요청을 고치면 된다"는 분류이므로 이미 알려진 정책 오류에만 써야 한다.</details>
3. (본문 밖) 주문 취소 API에서 Core가 `OrderNotFoundError`와 `OrderAlreadyShippedError`를 던지게
   됐다. Controller와 Core는 각각 무엇을 알아야 하나? <details><summary>답</summary>Core는 두 오류를 자기 언어로 던지는 것까지만 알고 HTTP status는 모른다. Controller(또는 exception mapper)가 `OrderNotFoundError → 404`, `OrderAlreadyShippedError → 409`로 명시적으로 번역하고, 그 외 오류는 다시 던져 500으로 남긴다. 오류 종류가 늘어날수록 이 매핑을 Controller에 흩뿌리지 말고 한 곳(exception filter)으로 모으는 편이 낫다.</details>

## 근거

- 실측: `packages/core/src/assist.ts`, `apps/api/src/assist/assist.service.ts`,
  `apps/api/src/assist/assist.controller.ts` — 데이터 흐름과 타입 경계, `PromptPolicyError` → 400
  번역은 이 세 파일에서 직접 확인한 것이다.
- 실측: Adapter를 인자 없이 교체했을 때 TypeScript가 낸 `TS2554: Expected 1 arguments, but got 0.`
  — Application Service가 생성 책임을 갖고 있을 때 결합이 드러나는 지점.
- 논의 맥락: 2026-08-14·08-15 질문 로그 — 레이어 책임과 오류 번역, 그리고 조립 책임을 Module로
  옮기는 이유를 정리한 항목.

## 관련 개념

- 앞: [Hexagonal 아키텍처의 Core·Port·Adapter 구성](/study-note/software-architecture/hexagonal-core-port-adapter/) — Service가 Port만 받는 형태가 왜 기본인지의 근거.
- 앞: [자주 쓰는 아키텍처 패턴 지도](/study-note/software-architecture/common-patterns-map/) — 층 이름들이 어떤 패턴 계열에서 왔는지.
- 관련: [NestJS Exception Filter](/study-note/nestjs/exception-filter/) — 오류 → HTTP 번역을 Controller 밖으로 모으는 장치.
- 관련: [NestJS Dynamic Module](/study-note/nestjs/dynamic-module/) — 설정이 필요한 Adapter를 조립 지점에서 만드는 구체적 수단.
