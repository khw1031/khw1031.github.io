---
title: "경계 검증과 도메인 불변식의 역할 분리 규칙"
description: "구조 파싱(unknown→shape)은 경계·어댑터가 zod로, 도메인 불변식은 도메인이 순수 TypeScript로 지키는 이유. ValidationPort가 대부분 불필요한 근거, branded type으로 '검증됨'을 전달하는 방법, 안정 의존 원칙과 zod 도입의 트레이드오프."
---

> 한 줄: 검증은 하나가 아니라 둘이다 — **구조 파싱**은 경계(어댑터)가 zod로 끝내고, **도메인 불변식**은 도메인이 순수 TypeScript로 직접 지킨다. 그래서 도메인에는 `ValidationPort`가 필요하지 않다.

## 큰 그림

```text
바깥 데이터(unknown)
      ↓  어댑터가 zod로 파싱      ← (a) 구조 파싱, 여기서 끝난다
검증된 값
      ↓  도메인 호출
도메인은 "이미 유효한 값"만 받는다  ← (b) 불변식은 도메인이 스스로 지킨다
```

## 핵심

공항의 두 검사에 비유할 수 있다. **탑승 수속 카운터**는 "이 종이가 정말 항공권인가"를 본다 —
형식이 맞는지, 알아볼 수 있는 문서인지. **탑승구**는 "이 승객이 이 비행기를 탈 자격이 있는가"를
본다. 카운터를 통과했다고 자격 검사가 면제되지 않고, 자격 검사가 종이 형식을 다시 읽지도 않는다.
두 검사는 같은 "검증"이라는 말을 쓸 뿐 서로 다른 일이다.

| | 무엇을 보나 | 누가 하나 |
| --- | --- | --- |
| **(a) 구조 파싱** | `unknown` → 알려진 shape. "이게 정말 `{status, service}`인가" | **경계(어댑터)** |
| **(b) 도메인 불변식** | "`latencyMs`는 음수·NaN일 수 없다" | **도메인 자신** |

(b)는 라이브러리 없이 이미 쓸 수 있다.

```ts
// packages/core/src/health.ts — 도메인이 자기 규칙을 순수 TypeScript로 지킨다
if (!Number.isFinite(latencyMs) || latencyMs < 0) {
  throw new RangeError(`latencyMs must be a non-negative finite number: ${latencyMs}`);
}
```

**이게 정답 형태다.** 도메인 불변식은 zod도, port도, 어댑터도 필요 없다 — 불변식을 남에게 맡기는
순간 도메인이 자기 규칙의 주인이 아니게 된다. zod가 필요한 것은 (a)뿐이고, (a)는 도메인이 하는
일이 아니다.

반대 극단이 이 한 줄이다.

```tsx
res.json() as Promise<HealthResponse>   // ← 서버가 뭘 주든 "맞다"고 믿는다
```

타입은 컴파일하면 사라지므로 이 줄은 사실상 거짓말이다. 서버가 필드를 바꿔도, 500 HTML을 뱉어도
타입 검사는 초록불이고 런타임에 `undefined`가 화면에 그려진다. **경계를 넘는 데이터를 실제로
검사하는 코드가 한 줄도 없는 상태**다.

## 깊이

**왜 port가 대부분 불필요한가 — "Parse, don't validate"(필수).** port가 정당한 것은 **도메인이 그
능력을 호출할 때**다. `LlmPort`는 도메인이 "이 프롬프트에 답을 줘"라고 **부르기 때문에** port다.
그런데 검증은 도메인이 부르지 않는다 — **경계에서 이미 끝나고 들어온다.** 도메인에
`ValidationPort`를 만들면 도메인이 "나는 아직 검증 안 된 값을 받을 수도 있다"고 인정하는 셈이 되고,
그러면 도메인 함수마다 "검증했나?"를 신경 써야 해서 불변식의 책임이 흐려진다.

**그럼 "검증됐다"는 사실은 어떻게 전달하나 — 타입으로(필수).** port 없이 의존을 역전시키는 방법이
있다. **도메인이 타입을 소유하고, 경계가 그 타입을 만든다.**

```ts
// packages/core — 도메인이 소유. zod를 모른다
export type LatencyMs = number & { readonly __brand: 'LatencyMs' };

// 어댑터 — zod로 파싱하고 도메인 타입으로 좁힌다
const parsed = LatencySchema.parse(raw);       // zod는 여기서만 산다
const latency = parsed as LatencyMs;
```

세 가지가 동시에 성립한다.

1. 도메인은 zod를 모른다 — **의존 방향 유지**
2. "검증되지 않은 `number`"는 도메인 함수에 **타입 수준에서 못 들어간다**
3. zod를 valibot으로 바꿔도 **도메인 코드가 한 줄도 안 바뀐다** — port가 하려던 일을 타입이 한다

**추상화 하나를 안 만들고 같은 값을 얻는다.** port는 런타임 다형성이 필요할 때 쓰는 도구인데,
검증에는 런타임 다형성이 필요 없다 — 구현이 하나뿐이고 교체는 컴파일 타임에 끝난다.

**"도메인은 불변이어야 한다"는 직관의 이름 — 안정 의존 원칙(필수).** **Stable Dependencies
Principle**: 불안정한 것이 안정된 것에 의존해야지, 반대면 안 된다.

- 도메인 규칙은 **가장 안정적**이다. 비즈니스가 바뀔 때만 바뀐다
- zod는 상대적으로 **불안정**하다. 메이저 버전이 오르고 API가 바뀐다

도메인이 zod를 import하면 **안정된 것이 불안정한 것에 매달린 상태**가 된다. 이것이 "도메인은 바깥을
모른다"가 실제로 방어하는 것이다. (값의 immutability — `readonly`, 반환 객체 동결 — 도 별개로
유효하지만, 여기서 걸리는 것은 그쪽이 아니라 **의존의 안정성** 쪽이다.)

**zod의 진짜 이득 — 계약의 원본이 하나가 된다(필수).** 스키마 하나가 **타입과 런타임 검증의 단일
원본**이 되고 타입은 파생물이 된다.

```ts
// packages/contracts/src/health.ts
export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;   // ← 타입은 파생물
```

타입과 검증이 따로 살면 반드시 어긋난다. "의존 규칙의 원본은 `turbo.json` 하나"와 정확히 같은
형태로 "계약의 원본은 스키마 하나"가 된다.

**트레이드오프(전문가).**

1. **계약 package가 런타임 의존을 갖게 된다.** 컴파일하면 상수 하나만 남는 무게 없는 package였는데,
   zod가 들어오면 **web 번들에 실려 나간다**.
2. **web과 api가 zod 버전에 함께 묶인다.** 계약 package가 버전 결합 지점이 된다.
3. **도메인에는 넣지 않는다.** 도메인 package가 zod를 import하는 순간 "도메인은 바깥을 모른다"가
   깨진다 — DI 컨테이너를 도메인에 넣지 않는 것과 같은 이유다.

**흔한 절충: 스키마는 계약 package가 소유하고, 파싱은 어댑터가 한다(전문가).** web에서는
`HttpHealthGateway`가 `HealthResponseSchema.parse()`를 부르고, api에서는 NestJS pipe가 입력에서
부른다. **원본은 하나인데 강제 지점만 양쪽 경계에 각각 서는** 모양이다.

**web에도 같은 경계가 선다(곁가지).** 원칙은 런타임 무관이다. 컴포넌트가 `fetch`를 직접 알면
테스트마다 브라우저를 대신할 가짜를 세워야 한다. web의 "바깥 기술"이 HTTP·`localStorage`·라우터·브라우저
API라는 점만 서버와 다르다.

```ts
// port — "무엇이 필요한가"만 선언. fetch도 axios도 모른다
export interface HealthGateway { load(): Promise<HealthResponse> }

// adapter — 바깥 기술
export class HttpHealthGateway implements HealthGateway { /* fetch */ }
export class FakeHealthGateway implements HealthGateway { /* 테스트용 */ }
```

**함정: web의 "도메인"은 api의 도메인이 아니다(곁가지).** 진짜 사업 규칙은 서버가 소유한다 — 신뢰
경계가 거기 있다. 클라이언트가 같은 규칙을 복제하면 **진실이 두 벌**이 되고, 어긋나는 순간 어느
쪽이 맞는지 알 수 없다. web에서 "도메인"이라 부를 만한 것은 대개 뷰 상태 규칙, UX용 선제 입력
피드백(서버 검증의 *복제*가 아니다), 표시 규칙이다. **공유해야 하는 것은 규칙이 아니라 계약이다.**

## 용어 풀이

- **구조 파싱(structural parsing)** — `unknown`을 알려진 shape으로 좁히는 검사. 깨짐: 도메인
  불변식 검사와 한 덩어리로 취급하면 도메인이 검증 라이브러리에 묶인다.
- **불변식(invariant)** — 그 타입·객체가 존재하는 동안 항상 참이어야 하는 조건. 깨짐: 경계에서만
  검사하고 도메인 안에서 안 지키면, 다른 진입 경로가 생기는 순간 무너진다.
- **Parse, don't validate** — 검사 후 `boolean`을 돌려주는 대신 **검증된 타입의 값을 만들어** 반환
  하라는 원칙. 깨짐: 파싱 결과를 원래의 넓은 타입으로 되돌려 넘기면 이득이 사라진다.
- **branded type(브랜드 타입)** — `number & { readonly __brand: 'LatencyMs' }`처럼 구조적 타입에
  표식을 붙여 구별 가능하게 만든 타입. 깨짐: 아무 곳에서나 `as`로 캐스팅하면 표식이 보증하는 게
  없어진다 — 생성 지점을 경계로 제한해야 의미가 있다.
- **안정 의존 원칙(Stable Dependencies Principle)** — 불안정한 것이 안정된 것에 의존해야 한다.
  깨짐: "안정"을 코드 수정 빈도가 아니라 완성도로 오해.
- **포트(Port)** — 안쪽이 외부에 요구하는 계약. 깨짐: 교체가 컴파일 타임에 끝나는 관심사에도 port를
  만들면 런타임 다형성 비용만 남는다.

## 확인 질문

1. 도메인에 `ValidationPort`를 두면 무엇이 무너지나? <details><summary>답</summary>도메인이 "나는 검증 안 된 값을 받을 수도 있다"고 인정하는 셈이 되어, 함수마다 "검증했나?"를 신경 써야 하고 불변식의 책임 소재가 흐려진다. 게다가 검증은 도메인이 호출하는 능력이 아니라 경계에서 끝나고 들어오는 것이라 port의 전제 자체가 성립하지 않는다.</details>
2. zod를 valibot으로 교체할 때 도메인 코드가 안 바뀌게 하려면 무엇을 지켜야 하나? <details><summary>답</summary>도메인이 branded type을 소유하고 zod를 import하지 않으며, 파싱·캐스팅은 어댑터에서만 일어나야 한다. 그러면 교체 범위가 어댑터와 스키마 정의로 한정된다.</details>
3. (본문 밖) 프런트엔드 폼에서 "비밀번호는 8자 이상"을 zod로 검사하고 서버에서도 같은 검사를 한다.
   진실이 두 벌인 문제인가? <details><summary>답</summary>규칙의 소유자는 서버(신뢰 경계)여야 하므로 서버 검사는 필수다. 프런트의 검사는 같은 규칙의 *복제*로 두면 어긋날 위험이 있으므로, 공유할 것은 규칙 구현이 아니라 계약 — 즉 계약 package의 같은 스키마를 양쪽이 import해 강제 지점만 둘로 늘리는 형태가 맞다. 프런트가 자기 문자열 상수로 별도 구현하면 두 벌이 된다.</details>

## 근거

- 실측: `packages/core/src/health.ts`의 `Number.isFinite(latencyMs) || latencyMs < 0` 검사 —
  라이브러리 없이 도메인이 불변식을 지키는 형태가 이미 코드에 있었다.
- 실측: `apps/web/src/App.tsx`의 `res.json() as Promise<HealthResponse>` — 경계 검증이 없는 상태의
  실제 증거. 당시 `@platform/contracts`는 타입만 갖고 있었다.
- 원칙 출처: Alexis King, "Parse, don't validate"(1차, 원문 블로그) / Robert C. Martin의 패키지
  설계 원칙 중 Stable Dependencies Principle(2차, 원칙 이름 수준의 참조).
- 논의 맥락: 2026-08-09 질문 로그 — "검증 라이브러리도 어댑터로 보고 도메인이 port를 소유해야
  하지 않느냐"는 반론에서 (a)/(b) 구분과 branded type 대안이 정리됐다.

## 관련 개념

- 앞: [Domain·Application·Port·Adapter의 책임 구분 기준과 관계 지도](/study-note/software-architecture/domain-application-adapter/) — 무엇이 도메인이고 무엇이 어댑터인지가 먼저 서야 이 분리를 판단할 수 있다.
- 앞: [Hexagonal 아키텍처의 Core·Port·Adapter 구성](/study-note/software-architecture/hexagonal-core-port-adapter/) — port가 언제 정당한지가 이 판단의 전제다.
- 관련: [경계와 모듈성](/study-note/software-architecture/boundaries-and-modularity/) — 검증을 어디서 끝낼지는 경계를 어디에 그었는지의 결과다.
