---
title: "Client–Server 네트워크 경계의 실패 연쇄와 위험별 대응 정리"
description: "네트워크 호출이 결과를 모르는 상태로 끝난다는 전제에서 timeout→retry→중복→부분 실패→상태 불일치 연쇄를 따라가고, 8가지 위험별 판단 질문과 대표 해법(deadline, 선택적 retry, 멱등성, 계약 검사, 일관성 모델)을 정리한 노트."
---

> 한 줄: 네트워크 호출은 성공·실패 말고 **결과를 모르는 상태**로도 끝나기 때문에, `timeout → retry → 중복 실행 → 부분 실패 → 상태 불일치`가 한 줄기 연쇄로 이어지고 실전 해법은 이 연쇄를 통째로 통제하는 장치들이다.

## 큰 그림

함수 호출은 보통 반환 아니면 예외로 끝난다. 네트워크 호출은 여기에 **제3의 종료**가 있다 — Client가 timeout을 받았는데 Server에서는 결제가 이미 완료된 상태. 경계를 넘는 순간 생기는 이 불확실성이 아래 연쇄의 뿌리다.

```text
네트워크 지연
      │ 오래 기다릴 수 없다
      ▼
   timeout ── Client가 "결과 모름"으로 종료
      │ 다시 보낸다
      ▼
    retry
      │ 첫 요청이 이미 성공했을 수 있다
      ▼
  중복 실행
      │ 여러 자원에 걸친 흐름의 일부만 반영된다
      ▼
   부분 실패
      │ Client가 든 값과 Server의 값이 갈라진다
      ▼
  상태 불일치
```

연쇄이므로 한 칸만 막으면 다음 칸으로 새어 나간다. deadline만 조이면 retry 부하가 늘고, retry만 넣으면 중복 쓰기가 생기고, 중복을 막아도 여러 서비스에 걸친 부분 실패는 남는다.

## 핵심

경계를 **편지 보내기**로 보면 된다. 답장이 안 오면 두 경우가 구분되지 않는다 — 편지가 도착하지 않았거나, 도착해서 처리됐는데 답장이 유실됐거나. 그래서 "다시 보낸다"는 행동은 답장 유실 쪽에서 **두 번 처리**를 만든다.

이 구분 불가를 다루는 표준적인 수법은 하나뿐이다. **보내는 쪽이 의도마다 고유한 번호를 붙이고, 받는 쪽이 그 번호로 "이미 처리했음"을 기억한다.** 그러면 재전송이 안전해지고, 재전송이 안전해지면 timeout을 짧게 잡아도 되고, timeout을 짧게 잡을 수 있으면 자원이 오래 잡히지 않는다.

최소 예시 — POST 결제에 idempotency key를 두는 형태.

```http
POST /payments
Idempotency-Key: 9f2c-order-8817-attempt

{ "orderId": "8817", "amount": 42000 }
```

Server는 `(tenant, operation, key)`에 unique constraint를 걸고, 업무 변경과 key 기록을 **같은 transaction**에 넣는다. 같은 key + 같은 payload가 다시 오면 처음 결과를 그대로 반환하고, 같은 key + 다른 payload는 거절한다. 이 한 장치가 위 연쇄의 `retry → 중복 실행` 고리를 끊는다.

## 깊이

여덟 갈래를 "먼저 물어볼 질문 → 대표 해법" 짝으로 본다. 질문이 먼저인 이유는 패턴을 많이 넣는 것이 목표가 아니기 때문이다.

| 위험 | 먼저 물어볼 질문 | 대표 해법 |
| --- | --- | --- |
| 네트워크 지연 | 꼭 지금, 원격에서, 전부 받아야 하나? | 캐시, 요청 병합·병렬화, pagination, prefetch, 비동기화 |
| timeout | 얼마까지 기다리면 사용자 목적이 이미 실패인가? | 명시적 deadline, 예산 전파, 취소, 부하 테스트 |
| 일시적 실패 | 다시 하면 성공 가능성이 있고 안전한가? | 재시도 가능 오류만, backoff + jitter, 총예산, circuit breaker |
| 계약 불일치 | 어떤 변경이 어느 Client를 깨뜨리나? | OpenAPI, breaking-change CI, runtime schema 검사, consumer-driven contract |
| 중복 요청 | 같은 의도가 두 번 도착해도 결과가 한 번인가? | 자연적 멱등성, idempotency key, unique constraint |
| 인증·권한 | 누구인지와 무엇을 해도 되는지를 각각 어디서 검증하나? | TLS, 표준 IdP, 최소 권한 token, Server의 요청별 객체 권한 검사 |
| 부분 실패 | 일부만 성공했을 때 원하는 최종 상태는 무엇인가? | 한 transaction 우선, outbox, Saga, 보상, durable orchestrator |
| 상태 불일치 | 얼마나 낡아도 되고 충돌하면 누가 이기나? | freshness 정책, invalidate/refetch, ETag + `If-Match`, push |

**필수 — 지연은 합산값이다.** Server 처리 시간이 아니라 DNS·연결·TLS·왕복 횟수·queue 대기·응답 전송의 합이다. 평균은 긴 꼬리를 가리므로 경로별 p50·p95·p99와 요청 waterfall을 본다. 첫 수단은 최적화가 아니라 **호출 제거**(변경이 드문 GET은 `Cache-Control`·`ETag`·CDN)이고, 그다음이 왕복 축소, 독립 호출 병렬화, 전송량 축소, 오래 걸리는 작업의 비동기화(`202 Accepted` + operation 조회)다. 핵심 tradeoff는 최신성 대 속도 — 허용 가능한 stale 시간을 먼저 정하지 않으면 캐시 논의가 진행되지 않는다.

**필수 — timeout은 "Server가 실패했다"가 아니라 "Client가 더 기다리지 않기로 했다"다.** 그래서 timeout 직후 같은 쓰기를 다시 보내도 되는지는 완전히 별개 문제다. 모든 원격 호출에 명시적 deadline을 두고(gRPC는 기본값이 없어 무한정 기다릴 수 있다), **총예산을 하위 호출에 전파**한다 — 3초 요청에서 상위가 2초를 썼으면 하위에 다시 3초를 주지 않는다. deadline이 끝나면 Server 쪽 query·외부 호출도 실제로 취소해야 한다. 목표는 "빨리 실패"가 아니라 **사용자 목적과 자원 예산에 맞는 시점에 포기하기**다.

**필수 — retry는 성공률을 공짜로 올리는 장치가 아니라 복구 전략이다.** 두 질문에 모두 답해야 적용한다. ① 다시 하면 성공할 가능성이 있는 실패인가(권한 부족·잘못된 입력 같은 영구 `4xx`는 아니다) ② 여러 번 실행돼도 안전한 동작인가. 그리고 **한 계층에서만** 재시도한다 — 세 계층이 각각 3번이면 최악에 27번으로 불어나 retry storm이 된다. 횟수뿐 아니라 총 경과 시간·최대 간격까지 예산으로 제한하고, `Retry-After`를 존중하고, backoff에 jitter를 섞어 동시 복귀를 흩는다. 멱등하지 않은 쓰기에는 위 idempotency 장치 없이 적용하지 않는다.

**곁가지 — circuit breaker는 기본값이 아니다.** 계속 실패하는 dependency를 즉시 거절해 dependency와 호출자를 함께 보호하지만, 상태·threshold·복구 정책이라는 복잡성을 더한다. 작은 단일 Server에 자동으로 넣을 이유는 없다.

**필수 — 계약은 문서가 아니라 배포 gate여야 강제된다.** OpenAPI로 기계가 읽는 계약을 원본에 두는 것은 시작일 뿐이다. 필수 필드 추가·response field 삭제·type 축소·enum 변경 같은 breaking change를 CI에서 막고, TypeScript type은 런타임 JSON을 검증하지 않으므로 양쪽에서 runtime schema를 검사하고, Pact 계열의 consumer-driven contract test로 실제 소비 상호작용을 검증한다. 변경은 추가형(새 optional field·새 endpoint 선배포 → Client 전환 → 옛 필드 제거)을 우선하고, **versioning은 마지막 수단**이다. 사소한 필드 추가마다 `/v2`를 만들면 운영할 계약만 늘어난다.

**필수 — 인증과 권한은 다른 층에서 끝난다.** 인증은 "누구인가", 권한은 "이 사용자가 이 자원에 이 행동을 해도 되는가". 로그인 성공이 남의 주문을 볼 권리는 아니다. 전송은 TLS, 신원은 검증된 IdP와 표준 흐름(public client는 Authorization Code + PKCE; implicit·password grant는 피한다), token은 짧게·최소 권한으로 두고 scope뿐 아니라 audience까지 검증한다. 그리고 **권한 검사는 Server가 매 요청 수행**한다 — Client의 버튼 숨김은 UX이고, `order.userId === authenticatedUser.id` 같은 객체 수준 검사가 경계다. Client가 보낸 `userId`·role·price를 신뢰하고 있지 않은지 확인한다.

**필수 — 부분 실패에서 보상은 rollback이 아니다.** 주문 생성 → 재고 차감 → 결제 → 알림에서 결제까지만 성공할 수 있다. 순서는 ① 일관성이 필요한 데이터를 **한 transaction 경계**에 둘 수 있는지 먼저 본다 ② DB 변경과 event 발행의 dual write에는 transactional outbox(업무 row와 outbox row를 한 transaction에, 별도 publisher가 전달; at-least-once라 consumer도 멱등해야 한다) ③ 여러 서비스에 걸친 업무 흐름에는 Saga(인프라 실패는 forward recovery, 결제 거절 같은 업무 실패는 compensating transaction) ④ 단계가 많거나 가시성이 중요하면 durable orchestrator. `pending`·`compensating`·`failed`·`completed`를 일급 상태로 둬야 실제 부분 완료가 숨지 않는다. 이미 보낸 메일은 없앨 수 없고 결제 취소도 별도의 실패 가능한 거래이므로, **어떤 최종 상태가 사업적으로 수용 가능한가**를 먼저 정의한다.

**필수 — 상태 불일치는 두 문제가 섞인 이름이다.** freshness(최신 값을 언제 다시 받나)와 concurrency(낡은 값 기반 쓰기가 새 값을 덮어도 되나)는 해법이 다르다. freshness는 Server를 권위 있는 원본으로 두고 `staleTime`·TTL을 정하고, mutation 성공 후 관련 query를 invalidate하거나 갱신하고, 필요에 따라 focus refetch → polling → SSE/WebSocket push로 올린다. concurrency는 version이나 ETag를 조건부 요청으로 쓴다 — 받은 `ETag`를 `If-Match`로 보내고 값이 달라졌으면 `412 Precondition Failed`로 거절해 lost update를 막는다. mutation 응답에 최종 표현과 version을 함께 반환하면 별도 GET이 줄어든다. 모든 데이터를 실시간으로 맞출 필요는 없다 — 상품 설명은 수분간 stale이어도 되지만 재고·좌석·잔액은 쓰기 직전에 Server가 다시 판단해야 한다.

**실무 적용 순서(패턴 나열이 아니라 위험 순).**

1. API별로 읽기/쓰기, 멱등 여부, 권위 있는 상태의 소유자를 적는다.
2. 오류를 `재시도 가능 / 사용자 수정 필요 / 권한 실패 / 결과 불명`으로 분류한다.
3. 모든 원격 호출에 deadline과 request ID를 둔다.
4. 쓰기에 unique constraint를, 필요하면 idempotency key를 둔다.
5. OpenAPI + runtime schema 검사 + breaking-change CI를 연결한다.
6. Client cache의 stale 허용 시간과 mutation 후 invalidate 대상을 정한다.
7. dual write가 실제로 생길 때 outbox를, 여러 서비스 업무 transaction이 생길 때 Saga를 도입한다.
8. p95·p99 latency, timeout, retry 횟수, 중복 차단, circuit 상태, Saga 단계·보상 실패를 관측한다.

이 순서의 본질은 **불확실한 결과를 다시 확인할 식별자와 상태를 만들고, 자동 복구가 안전한 경우와 사람·업무 판단이 필요한 경우를 분리하는 것**이다.

## 용어 풀이

- **기한(deadline)** — 이 호출의 결과를 기다릴 절대 시각. 깨짐: 계층마다 같은 값을 새로 주면 총시간이 계층 수만큼 곱해진다. timeout(경과 시간)과 달리 하위 호출로 전파할 수 있는 것이 요점.
- **멱등성(idempotency)** — 같은 요청을 여러 번 실행해도 결과 상태가 한 번 실행한 것과 같은 성질. 깨짐: "같은 응답을 준다"와 혼동. 응답이 같아도 부수 효과가 두 번이면 멱등하지 않다.
- **멱등 키(idempotency key)** — Client가 의도마다 붙이는 고유 식별자. 깨짐: header 이름만 두고 key 범위·TTL·payload 재사용·동시 요청 동작을 계약에 안 적으면 강제되지 않는다.
- **지수 백오프와 편차(exponential backoff + jitter)** — 재시도 간격을 늘리고 무작위 편차를 섞는 것. 깨짐: jitter를 빼면 실패한 Client들이 같은 시각에 함께 돌아와 두 번째 파도를 만든다.
- **조건부 요청(conditional request)** — `If-Match`/`ETag`로 "내가 본 그 버전일 때만 써라"를 표현. 깨짐: 조회 캐싱 장치로만 보면 lost update 방지 용도를 놓친다.
- **전송 아웃박스(transactional outbox)** — 업무 변경과 발행할 event를 한 DB transaction에 함께 기록하고 별도 publisher가 전달하는 패턴. 깨짐: at-least-once라 정확히 한 번 전달로 오해하면 consumer 멱등성을 빼먹는다.
- **사가(Saga)** — 여러 서비스의 로컬 transaction을 보상 동작으로 엮은 업무 흐름. 깨짐: 분산 rollback으로 오해. 보상은 시간을 되돌리는 것이 아니라 새로 실행하는 실패 가능한 거래다.
- **소비자 주도 계약 테스트(consumer-driven contract test)** — Client가 실제 사용하는 상호작용을 기록해 Provider가 만족하는지 검증. 깨짐: schema 검증과 동일시. 쓰지 않는 필드의 변경은 여기서 통과해야 정상이다.

## 확인 질문

1. 결제 POST에 timeout이 났다. 같은 요청을 그대로 재전송해도 되는 조건은 무엇인가? <details><summary>답</summary>Server가 그 요청의 멱등성을 보장할 때만 — 즉 의도별 idempotency key + unique constraint가 있고, 업무 변경과 key 기록이 같은 transaction에 들어가며, 같은 key/같은 payload 재요청에 처음 결과를 반환하도록 계약에 명시돼 있을 때. timeout 자체는 실패를 뜻하지 않으므로 그 보장이 없으면 재전송이 아니라 결과 조회(operation 상태)를 해야 한다.</details>
2. Gateway·서비스·SDK 세 계층이 각각 최대 3회 retry를 켜 두면 무엇이 문제인가? <details><summary>답</summary>시도가 곱해져 최악에 27회가 되고, 장애 중인 dependency에 부하를 증폭시켜 retry storm을 만든다. retry는 한 계층에서만 하고, 횟수 대신 총 경과 시간·최대 간격을 포함한 예산으로 제한한다.</details>
3. (본문 밖) 팀이 "사용자 프로필 수정 화면에서 가끔 남이 쓴 값이 사라진다"고 보고했다. freshness와 concurrency 중 어느 문제이고 무엇을 먼저 넣겠나? <details><summary>답</summary>lost update이므로 concurrency 문제다. 낡은 값을 읽어 전체 객체를 덮어쓰는 경로가 있다는 뜻이므로, refetch 주기를 조이는 대신 version이나 ETag를 도입해 `If-Match`로 보내고 불일치 시 `412`로 거절해야 한다. freshness(staleTime·invalidate)는 창을 좁힐 뿐 덮어쓰기 자체를 막지 못한다.</details>

## 근거

모든 외부 자료는 2026-08-14 KST에 확인했고, 자료로만 사용했다. 버전 의존 주장은 아래 문서 기준이다.

- **1차 표준** — [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)(2022-06): 멱등 method의 정의, 조건부 요청과 `ETag`로 lost update를 막는 표준 의미.
- **1차 표준** — [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)(2022-06): freshness, cache validation, stale response 규칙.
- **1차 표준** — [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html)(2025-01): PKCE, 최소 권한, audience 제한, refresh token 보호를 포함한 현행 BCP.
- **1차 명세** — [OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html)(2025-09-19): 언어 독립적 HTTP API 계약 기술의 최신 공개 명세. 도입 버전은 generator·validator 지원 상태에 맞춰 별도 확인이 필요하다.
- **1차 공식 문서** — [gRPC Deadlines](https://grpc.io/docs/guides/deadlines/)(최종 수정 2025-07-07): 기본 deadline이 없다는 점, deadline 설정·취소·하위 호출 예산 전파.
- **1차 공식 벤더 지침** — [AWS: retry 제한](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html): backoff·jitter·상한, 단일 retry 계층, 멱등성 확인. [AWS: Circuit Breaker](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html): 적용 조건과 추가 복잡성.
- **1차 공식 벤더 지침** — [AWS: Transactional Outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)·[Saga](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html): dual write와 분산 업무 transaction의 복구 패턴 및 tradeoff.
- **1차 프로젝트 문서** — [Pact Specification](https://docs.pact.io/implementation_guides/pact_specification)(문서 최종 수정 2022-09-28): consumer-driven contract verification의 공식 명세와 구현 호환성.
- **1차 프로젝트 문서** — [TanStack Query: Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)·[Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation): Client cache freshness, background refetch, mutation 후 invalidate. `latest` 문서이므로 도입 시 설치한 major version 문서를 다시 확인해야 한다.
- **1차 작업 초안, 표준 아님** — [IETF `Idempotency-Key` draft-07](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/07/)(2025-10-15 발행, 2026-04-18 만료): 업계 관행을 정리한 archived Internet-Draft이며 현재 RFC가 아니다. header 이름을 표준으로 인용하면 안 되고, 동작은 API 계약에 직접 명시해야 한다.

## 관련 개념

- 관련: [도메인·애플리케이션·어댑터 계층 분리](/study-note/software-architecture/domain-application-adapter/) — 네트워크 경계의 불확실성은 adapter 층에서 흡수하고, 재시도 가능 여부·최종 상태 판단 같은 정책은 application·domain에 남긴다.
- 관련: [헥사고날 아키텍처의 core·port·adapter 구성](/study-note/software-architecture/hexagonal-core-port-adapter/) — deadline·retry·멱등 키는 port 뒤 adapter의 관심사이며, core가 이 세부를 알지 않게 두는 것이 이 노트의 대응들을 교체 가능하게 만든다.
