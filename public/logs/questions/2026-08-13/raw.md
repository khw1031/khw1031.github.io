
<!-- q id=20260813-230205 cat="software-design" -->
### 독립된 작은 문제로 분할하는 게 유지보수성에 왜 도움이 될까? 그리고 바이브 코딩에 있어서 이게 왜 중요할까?

#### 한 줄

문제를 **독립적으로 변경하고 검증할 수 있는 작은 단위**로 나누면 한 변경의 영향 범위가 제한되기 때문에 유지보수가 쉬워진다. 바이브 코딩에서는 AI가 한 번에 추론해야 할 맥락과 가정도 함께 줄어들어, 생성 오류를 발견하고 되돌리기 쉬워진다.

#### 유지보수성에 도움이 되는 이유

유지보수의 어려움은 보통 코드의 양보다 **한 부분을 바꿨을 때 어디까지 함께 바뀌는지 알기 어렵다는 데서** 생긴다. 독립된 단위는 이 변경 범위를 경계 안에 가둔다.

예를 들어 주문 기능을 다음처럼 나눈다고 하자.

```text
가격 계산: 장바구니와 할인 정책 → 최종 금액
주문 저장: 주문 객체 → 저장 결과
결제 실행: 결제 요청 → 승인 또는 실패
화면 표시: 주문 결과 → 사용자에게 보여 줄 정보
```

각 단위의 입력·출력과 책임이 명확하면 할인 정책이 바뀔 때 가격 계산만 수정하면 된다. 가격 계산을 독립적으로 테스트할 수 있고, 문제가 생겨도 어느 경계에서 잘못됐는지 좁혀 볼 수 있다. 결제 업체를 바꾸더라도 화면이나 할인 규칙은 결제 업체의 응답 형식을 몰라도 된다.

따라서 분할은 다음 네 가지를 가능하게 한다.

1. **변경 전파 제한:** 한 구현의 변경이 무관한 코드까지 번지지 않는다.
2. **국소적 이해:** 전체 시스템을 머리에 올리지 않고도 한 부분을 고칠 수 있다.
3. **독립적 검증:** 작은 입력과 기대 출력으로 테스트할 수 있다.
4. **부분 교체와 복구:** 실패한 단위만 교체하거나 이전 상태로 되돌릴 수 있다.

#### 바이브 코딩에서 더 중요한 이유

LLM은 명세를 엄밀하게 실행하는 컴파일러가 아니라, 주어진 맥락에서 빈칸을 확률적으로 메우는 생성기다. “주문 기능 전체를 만들어 줘”처럼 범위가 크면 AI는 데이터 구조, 오류 처리, 상태 관리, 외부 API 형식까지 많은 결정을 동시에 추측한다. 이 추측들은 서로 의존하므로 초반의 작은 오해가 뒤 코드의 전제가 된다.

반대로 한 번에 하나의 독립된 문제와 판정 기준을 주면 작업이 다음처럼 바뀐다.

```text
요청: 할인 정책에 따라 최종 금액을 계산한다
계약: Cart와 DiscountPolicy를 받고 Money를 반환한다
판정: 정상 할인, 중복 할인, 최소 금액 경계 테스트를 통과한다
수정 범위: 가격 계산 모듈과 해당 테스트
```

이 범위에서는 AI가 추측할 것이 적고, 사람도 결과 전체를 검토할 수 있다. 실패해도 원인을 해당 단위에서 찾을 수 있으며, 잘못 생성된 변경만 버리기도 쉽다. 즉, 작은 독립 문제는 AI의 성능을 마법처럼 높이는 기법이라기보다 **AI가 틀릴 수 있다는 전제 아래 오류의 발생 범위와 검증 비용을 제한하는 운영 방식**이다.

#### 단, 작게 나누는 것만으로는 부족하다

함수를 많이 만들었다고 독립성이 생기지는 않는다. 여러 함수가 같은 전역 상태를 몰래 바꾸거나, 한 변경에 여러 파일을 항상 함께 고쳐야 한다면 이름만 나뉜 것이다. 반대로 지나치게 잘게 나누면 파일 탐색과 연결부가 늘어 이해가 더 어려워질 수 있다.

좋은 분할의 기준은 크기 자체가 아니라 다음 질문이다.

> 이 단위의 내부 구현이 바뀌어도 소비자는 작은 계약만 알면 되는가? 그리고 이 단위 하나만 따로 검증할 수 있는가?

둘 다 그렇다면 유지보수와 바이브 코딩에 유효한 분할에 가깝다.

<small style="opacity:0.55">‹23:02 KST› 맥락: khw1031.github.io의 `src/content/notes/vibe-coding-and-agents.md` 독서 기록을 읽으며 독립적인 문제 분할과 바이브 코딩의 관계를 질문함.</small>

<!-- /q -->

<!-- q id=20260813-235321 cat="software-design" -->
### 1. 예시에서 내 코드 로직이 도메인 로직이라고 보면 될까? 2. 단순히 pay, requestPayment 같이 메서드 명이 다른 경우보다는 더 좋은 케이스가 있지 않나? 3. 백엔드 API 스키마와 클라이언트에서 요구하는 스키마가 다른 경우 이를 맞춰주기 위해 BFF를 구성하는 것도 일종의 어댑터라고 볼 수 있나.

세 질문은 하나로 이어집니다. **Adapter의 본질은 메서드 이름을 바꾸는 것이 아니라, 소비자가 외부 시스템의 표현과 규약을 모르도록 경계에서 차이를 흡수하는 것**입니다.

#### 1. 내 코드가 모두 도메인 로직인 것은 아니다

앞선 예시를 더 정확히 나누면 다음과 같습니다.

- `checkout`: 결제라는 작업 순서를 조율하는 **애플리케이션 로직 또는 유스케이스**
- `PaymentService`: 애플리케이션이 결제 기능에 요구하는 **계약 또는 Port**
- `PaymentAdapter`: 그 계약을 외부 결제사 규격으로 번역하는 **인프라 경계**
- `ExternalPaymentClient`: 외부 SDK 또는 API 클라이언트

도메인 로직은 보통 “결제 금액은 주문 잔액을 넘을 수 없다”, “이미 취소된 주문은 결제할 수 없다”처럼 **사업 규칙 자체를 결정하는 코드**입니다.

```ts
class Order {
  constructor(
    private status: "pending" | "paid" | "cancelled",
    readonly totalAmount: number,
  ) {}

  ensurePayable(): void {
    if (this.status !== "pending") {
      throw new Error("결제 가능한 주문이 아닙니다.");
    }
  }
}
```

반면 `checkout`이 `order.ensurePayable()`을 호출하고 결제 결과를 저장하는 코드는 도메인 규칙을 **조율하는 애플리케이션 로직**에 가깝습니다. 따라서 “내 코드 대 외부 코드”와 “도메인 로직 대 인프라 로직”은 같은 구분이 아닙니다.

#### 2. 이름만 다른 예시는 Adapter의 필요성을 충분히 보여 주지 못한다

맞습니다. `pay()`를 `requestPayment()`로 바꾸기만 한다면 Adapter를 설명하기 위한 최소 예시는 되지만, 실제로는 단순 wrapper에 가깝습니다. Adapter의 가치가 더 잘 드러나는 경우는 다음처럼 여러 차이가 함께 있을 때입니다.

- 요청 필드와 자료형이 다름
- 통화나 날짜의 표현이 다름
- 외부 상태 코드를 내부의 의미 있는 결과로 바꿔야 함
- 외부 오류를 내부 오류 체계로 바꿔야 함
- 외부 API 호출 순서나 인증 방식이 내부 계약과 다름

예를 들어 애플리케이션은 다음 계약만 알고 싶다고 합시다.

```ts
type PaymentResult =
  | { status: "approved"; transactionId: string }
  | { status: "pending"; redirectUrl: string }
  | { status: "declined"; reason: "insufficient_funds" | "unknown" };

interface PaymentPort {
  pay(input: {
    orderId: string;
    amount: number;
    currency: "KRW";
  }): Promise<PaymentResult>;
}
```

그런데 오래된 결제사는 다음처럼 전혀 다른 규격을 사용한다고 합시다.

```ts
type LegacyPgResponse = {
  tx_no: string;
  result_code: "0000" | "1001" | "2001";
  redirect_url?: string;
};

class LegacyPgClient {
  request(input: {
    merchant_uid: string;
    total_amount: string;
    currency_code: "410";
  }): Promise<LegacyPgResponse> {
    // 외부 결제사 호출
    throw new Error("example");
  }
}
```

Adapter는 단순히 메서드 이름만 바꾸지 않고 양쪽의 표현과 상태 의미를 번역합니다.

```ts
class LegacyPgAdapter implements PaymentPort {
  constructor(private readonly client: LegacyPgClient) {}

  async pay(input: {
    orderId: string;
    amount: number;
    currency: "KRW";
  }): Promise<PaymentResult> {
    const response = await this.client.request({
      merchant_uid: input.orderId,
      total_amount: String(input.amount),
      currency_code: "410",
    });

    switch (response.result_code) {
      case "0000":
        return {
          status: "approved",
          transactionId: response.tx_no,
        };

      case "1001":
        if (!response.redirect_url) {
          throw new Error("결제사의 응답 형식이 올바르지 않습니다.");
        }

        return {
          status: "pending",
          redirectUrl: response.redirect_url,
        };

      case "2001":
        return {
          status: "declined",
          reason: "insufficient_funds",
        };
    }
  }
}
```

이제 소비자는 `merchant_uid`, 통화 코드 `410`, `result_code` 같은 결제사 지식을 전혀 모릅니다. 결제사가 필드명이나 상태 코드를 바꾸더라도 주로 Adapter만 수정하면 됩니다.

다만 Adapter는 **같은 의미의 다른 표현**을 바꾸는 경계입니다. 외부 결제사가 더 이상 애플리케이션에 필요한 의미를 제공하지 않는다면 Adapter가 임의로 꾸며 내서는 안 됩니다. 예를 들어 외부 시스템에 `pending` 상태가 있는데 내부 계약이 성공과 실패만 허용한다면, 정보를 억지로 버리기보다 내부 계약을 다시 설계해야 할 수 있습니다.

#### 3. BFF도 Adapter 역할을 할 수 있다

백엔드의 범용 스키마를 특정 웹이나 모바일 클라이언트에 필요한 스키마로 변환하는 BFF는 **아키텍처 수준에서 Adapter 역할을 한다고 볼 수 있습니다.** 예를 들어 여러 백엔드 응답을 모아 다음처럼 화면 전용 응답을 만드는 경우입니다.

```ts
type OrderSummaryView = {
  orderNumber: string;
  totalText: string;
  canCancel: boolean;
};

function toOrderSummaryView(order: BackendOrder): OrderSummaryView {
  return {
    orderNumber: order.order_id,
    totalText: `${order.total_amount.toLocaleString("ko-KR")}원`,
    canCancel: order.status === "PAYMENT_COMPLETED",
  };
}
```

다만 **BFF와 Adapter는 동의어가 아닙니다.**

- Adapter는 서로 맞지 않는 계약을 변환하는 **역할 또는 설계 패턴**입니다.
- BFF는 특정 frontend를 위해 별도로 둔 **서비스 경계와 배포 단위**입니다.

BFF 안에는 스키마 변환 Adapter뿐 아니라 여러 API를 합치는 유스케이스, 인증, 캐시, 오류 처리도 들어갈 수 있습니다. 반대로 백엔드 응답을 그대로 전달하는 단순 proxy라면 BFF라고 부를 수는 있어도 Adapter로서 하는 일은 거의 없습니다.

따라서 가장 정확한 표현은 다음과 같습니다.

> **BFF는 클라이언트와 백엔드 사이의 Adapter 역할을 수행할 수 있으며, 보통 그 안에 하나 이상의 Adapter와 애플리케이션 조율 로직을 함께 가진다.**

<small style="opacity:0.55">‹23:53 KST› 맥락: khw1031.github.io 저장소에서 Design Pattern의 Adapter 패턴을 TypeScript 결제 예시로 설명한 뒤, 도메인 로직·현실적인 변환 사례·BFF와의 관계를 이어서 질문함.</small>

<!-- /q -->
