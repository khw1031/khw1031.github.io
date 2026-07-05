---
title: DNS Serving Stale Data
pubDate: '2026-07-01'
description: RFC 8767이 정의한 recursive resolver의 stale cache serve 동작과 resilience 효과
summary: "RFC 8767이 정의한, authoritative 장애 시 만료된 캐시를 stale 상태로 serve해 가용성을 높이는 recursive resolver 동작 — 트리거 조건, HTTP stale-while-revalidate와의 차이, 정확성·보안 위험, 주요 resolver 구현을 정리한 노트."
lang: ko
tags: ['dns', 'rfc-8767', 'caching', 'network']
lintHash: '1f44e79f5ba0'
---

> RFC 8767는 recursive resolver가 authoritative server에 닿지 못할 때 만료된 캐시를 "stale" 상태로라도 serve해 장애 회복력을 높이는 동작을 표준화한다. 캐시를 "TTL 지나면 버린다"는 단순 모델을 넘어서는 부분이다.

## 1. RFC 8767가 풀려는 문제

DNS recursive resolver는 authoritative server에서 받은 응답을 TTL 동안 캐시한다. TTL이 지나면 전통적으로는 캐시를 버리고 다시 질의해야 한다.

문제는 이 시점에 authoritative server가 응답하지 않을 때 생긴다.

```text
TTL 만료
-> resolver가 authoritative에 재질의
-> timeout / refused / SERVFAIL
-> 클라이언트에게 실패 반환
```

이 상황에서 TTL 직전까지는 잘 동작하던 도메인이 갑자기 "없다"거나 "연결 불가"가 된다. authoritative 쪽 일시 장애인데 사용자 경험은 전체 실패로 나타난다.

RFC 8767의 핵심 제안: **TTL이 만료된 캐시 엔트리라도, refresh에 실패했을 때는 남겨두고 serve할 수 있게 하자.** stale한 데이터가 없는 것보다 낫다는 전제다.

## 2. 정식 명칭과 지위

- 제목: *Serving Stale Data to Improve DNS Resiliency*
- RFC 번호: 8767
- 발행: 2020-03
- 카테고리: **Informational** (Standards Track이 아님). 구현체가 이미 현장에서 쓰던 동작을 문서화한 성격이다.
- 저자: D. Lawrence, M. Klein, T. Chung, G. Huston (Comcast, APNIC 등)

Standards Track이 아니므로 "반드시 따라야 하는 규격"이라기보다 "이미 널리 쓰이는 resilience 동작을 정의하고 권장하는 문서"로 읽는 게 맞다.

## 3. 정상 동작과 stale 동작의 차이

TTL과 캐시 상태를 기준으로 구분한다.

```text
fresh:     TTL > 0  -> 캐시 그대로 serve
refresh:   TTL <= 0 -> authoritative에 재질의 시도
  성공:    새 응답으로 캐시 갱신, serve
  실패:    stale(entry expired)를 serve + 백그라운드 refresh 재시도
```

핵심은 refresh **실패 시점**이다. 성공하면 그냥 새 데이터로 갱신하고 끝이지만, 실패하면 만료된 캐시를 응급 약품처럼 꺼내 쓴다. 이때 클라이언트는 응답을 받고, resolver는 동시에 authoritative에 대한 재시도를 백그라운드에서 계속한다.

## 4. stale serve를 트리거하는 응답

모든 실패를 stale로 처리하는 것은 아니다. RFC는 다음 응답을 refresh 실패로 보고 stale serve를 고려하도록 정의한다.

| Authoritative 응답 | stale serve 대상 |
|---|---|
| timeout | O |
| REFUSED | O |
| SERVFAIL | O |
| NXDOMAIN | 구현에 따라 다름 (보통 제외) |
| 정상 응답(NOERROR) | X (그냥 갱신) |

NXDOMAIN(도메인 없음)은 stale serve에서 조심스럽게 다룬다. 도메인이 실제로 사라졌을 수도 있어서, 과거의 "있었다"는 데이터를 serve하면 보안·운영상 부작용이 생길 수 있기 때문이다. 구현체마다 정책이 다르다.

## 5. stale-while-revalidate와의 관계

이 동작은 HTTP의 `stale-while-revalidate` 캐시 전략과 구조가 같다.

| 개념 | HTTP cache | RFC 8767 DNS cache |
|---|---|---|
| fresh serve | max-age 내 | TTL 내 |
| stale + 재검증 | stale-while-revalidate | expired + background refresh |
| 트리거 | 캐시 만료 | refresh 실패 |

차이점: HTTP는 캐시가 만료됐을 때 *선택적으로* stale를 쓰지만, RFC 8767는 **upstream 실패**를 트리거로 삼는다. 정상적으로 갱신 가능하면 stale를 쓸 이유가 없기 때문이다. 그래서 "항상 stale-while-revalidate"가 아니라 "장애 때만 stale fallback"이라는 점이 핵심이다.

## 6. 파라미터와 제약

무한히 stale를 serve하면 만료된 데이터가 인터넷 변화를 영원히 반영 못 하는 상태가 된다. RFC는 다음 제약을 둔다.

| 항목 | 의미 | 비고 |
|---|---|---|
| `stale-answer-timeout` | stale serve를 시도하며 기다릴 최대 시간 | 구현 권장값 존재 |
| max stale TTL | 만료 후 얼마나 오래 stale로 serve할 수 있는지 | 무한 serve 방지 |
| 백그라운드 refresh 의무 | stale를 주는 동시에 계속 갱신 시도 | 갱신 성공하면 fresh로 전환 |

`stale-answer-timeout`은 클라이언트가 너무 오래 대기하지 않도록 상한을 두는 값이다. stale 응답조차 즉시 주지 못할 만큼 백그라운드 refresh가 느려지면, 이 시간이 지나면 실패를 반환한다.

## 7. 보안과 정확성 위험

stale data가 주는 resilience 이면에는 정확성 손실 위험이 있다.

- **주소 migration**: CDN 교체, IP 재할당 후 authoritative가 새 주소를 주는데, stale는 옛날 주소를 계속 serve. 장애 기간에 옛날 주소로 트래픽이 몰릴 수 있다.
- **DNS rollover**: DNSSEC KSK/ZSK rollover, 키 교체 주기에 stale record가 옛 키나 서명을 주면 검증 실패 가능.
- **의도된 제거**: 도메인을 의도적으로 뺐거나 차단한 경우, stale가 계속 살려둬서 정책 반영이 늦어짐.
- **무한 갱신 실패**: authoritative가 장기 장애면 stale가 max stale TTL까지 계속 serve되고, 그 뒤에는 결국 실패로 전환. 이 시점을 너무 늦게 잡으면 오래된 데이터가 인터넷에 퍼진다.

RFC는 이런 위험을 인정하면서도, "데이터가 없는 것보다 stale가 낫다"는 판단으로 resilience를 우선한다. 단 갱신 시도를 계속 의무화하고 max stale TTL로 시한을 둔다.

## 8. 실제 구현

주요 recursive resolver 구현체는 이미 RFC 8767 동작을 지원한다.

| 구현 | 설정 | 비고 |
|---|---|---|
| BIND 9.12+ | `stale-answer-ttl`, `serve-stale` | `named.conf`에서 활성화 |
| Unbound | `cache-max-stale-ttl`, `serve-expired` | 기본값으로 꺼져 있고 명시 켜야 함 |
| Knot Resolver | `serve_stale` 모듈 | 모듈 단위로 동작 |
| PowerDNS Recursor | `serve-stale` 관련 옵션 | 운영 정책과 함께 설정 |

공통점: 보통 **기본 비활성화**이거나 TTL 한계를 보수적으로 잡는다. 무분별한 stale serve가 오히려 운영을 헷갈리게 할 수 있기 때문이다. 운영자는 stale serve 효과와 max stale TTL을 함께 튜닝한다.

## 9. 측정된 효과

RFC에는 운영자 측정 데이터가 포함되어 있다.

- Comcast, APNIC 등 대규모 resolver 운영 데이터에서 authoritative 장애 시 실패율이 의미 있게 감소.
- 만료 직후 짧은 시간의 stale serve만으로도 사용자가 "DNS가 안 된다"고 인지하는 비율이 크게 줄었다.

즉 "완벽한 정확성"과 "장애 시 가용성" 사이에서 가용성을 택한 설계이며, 실제 대규모 트래픽에서 효과가 확인됐다.

## 10. 프론트엔드 개발자가 알아야 할 점

RFC 8767 자체는 recursive resolver 영역이라 브라우저가 직접 통제하진 않는다. 그래도 다음 시점에 영향을 이해해야 한다.

- **DNS 장애 대응 해석**: 모니터링에서 특정 도메인이 일시 실패했다가 복구되는 패턴은, upstream resolver의 stale serve 동작일 수 있다. authoritative 장애였지만 사용자는 정상으로 느낀다.
- **CDN migration 반영 지연**: 새 IP로 DNS를 바꿨는데 일부 사용자가 오래 옛날 edge로 연결된다면, resolver의 stale serve + 긴 max stale TTL이 원인일 수 있다. TTL을 짧게 설정해도 stale가 TTL을 무시하고 serve할 수 있기 때문이다.
- **DNSSEC rollover 시 검증 실패**: stale가 옛 서명을 줄 때 발생. 운영 담당자와 함께 확인.
- **실패 원인 추적**: `dig`로는 정상 응답이 나오지만 일부 사용자가 옛 주소로 연결된다면, 사용자가 쓰는 resolver의 stale serve 정책을 의심할 수 있다. `dig`는 특정 resolver를 직접 치므로 해당 resolver의 캐시 상태만 본다.

## 11. 인터뷰용 답변

> DNS recursive resolver는 TTL이 지나면 캐시를 갱신하러 authoritative에 재질의합니다. 이때 authoritative가 timeout, REFUSED, SERVFAIL로 실패하면, RFC 8767에 따라 만료된 캐시를 stale 상태로라도 serve하고 백그라운드에서 갱신을 계속 시도합니다. HTTP의 stale-while-revalidate와 구조가 비슷하지만, DNS는 upstream 장애를 트리거로 한다는 점이 다릅니다. 장점은 DNS 장애 시 사용자 경험이 크게 무너지지 않는 것이고, 단점은 주소 migration이나 DNSSEC rollover 같은 변경 반영이 늦어질 수 있다는 것입니다. 주요 resolver는 BIND, Unbound, Knot, PowerDNS Recursor 등이 이 동작을 지원하며, 보통 기본 비활성화이거나 max stale TTL로 시한을 둡니다.

## 12. 참고

- [RFC 8767: Serving Stale Data to Improve DNS Resiliency](https://www.rfc-editor.org/rfc/rfc8767)
- [RFC 1034: Domain Names - Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034)
- [RFC 2181: Clarifications to the DNS Specification (TTL 해석)](https://www.rfc-editor.org/rfc/rfc2181)
- [RFC 8198: DNS Query Name Minimisation to Improve Privacy](https://www.rfc-editor.org/rfc/rfc8198)
- [BIND 9 Configuration Reference: serve-stale](https://bind9.readthedocs.io/)
- [Unbound configuration: serve-expired](https://nlnetlabs.nl/documentation/unbound/unbound.conf/)
