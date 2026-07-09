---
title: DNS Resolution
pubDate: '2026-07-01'
description: 브라우저가 도메인 이름을 IP 주소로 바꾸는 DNS 조회 과정
summary: "도메인 이름을 IP로 바꾸는 DNS 조회를 브라우저/OS 캐시 → recursive resolver → root → TLD → authoritative 계층으로 정리하고, 전송 방식(UDP/TCP/DoH/DoT/DoQ), record 종류, dns-prefetch·preconnect 등 프론트엔드 성능 접점을 다룬 노트."
lang: ko
tags: ['dns', 'network', 'web-performance', 'frontend']
lintHash: 'c3219325227e'
polishHash: 'c3219325227e'
---

> DNS는 한 서버가 들고 있는 전화번호부가 아니라, ==root → TLD → authoritative nameserver로 이어지는 분산 계층형 조회 시스템이다==.

## 1. DNS가 하는 일

DNS는 사람이 읽는 도메인 이름을 네트워크가 사용할 수 있는 주소와 부가 정보로 바꾼다.

```text
www.example.com
-> A record: 93.184.216.34
-> AAAA record: 2606:2800:220:1:248:1893:25c8:1946
```

브라우저는 HTTP 요청을 보내기 전에 대상 host의 IP 주소를 알아야 한다. 이 조회가 늦어지면 document request가 늦고, 그 뒤 TTFB, FCP, LCP도 함께 밀린다.

## 2. DNS는 어디에 위치하나

DNS는 한 곳에 있지 않다. 클라이언트, 로컬 네트워크, ISP, public resolver, root, TLD, authoritative nameserver가 역할을 나눠 가진다.

```text
browser cache
-> OS cache / hosts file
-> recursive resolver
-> root nameserver
-> TLD nameserver
-> authoritative nameserver
```

`browser cache`는 브라우저 프로세스 안의 DNS 캐시다. 같은 탭이나 같은 브라우저 세션에서 이미 조회한 host를 재사용할 수 있다.

`OS cache`는 운영체제 레벨의 이름 해석 캐시다. `/etc/hosts` 같은 정적 매핑도 이 단계에서 영향을 줄 수 있다.

`recursive resolver`는 사용자의 기기가 직접 물어보는 DNS 서버다. 보통 ISP DNS, 회사 내부 DNS, 공유기 DNS proxy, 또는 Google Public DNS, Cloudflare DNS 같은 public resolver가 여기에 해당한다.

`root nameserver`는 `.com`, `.net`, `.kr` 같은 TLD nameserver가 어디 있는지 알려준다.

`TLD nameserver`는 `example.com` 같은 도메인의 authoritative nameserver가 어디 있는지 알려준다.

`authoritative nameserver`는 해당 도메인의 최종 DNS record를 가진 서버다. 도메인 소유자나 DNS hosting provider가 관리한다.

## 3. DNS 조회 흐름

브라우저가 `https://www.example.com/`에 접근하면 보통 이런 순서로 진행된다.

```text
1. 브라우저 캐시 확인
2. OS cache / hosts 확인
3. recursive resolver에 질의
4. resolver가 root에 .com 위치 질의
5. resolver가 .com TLD에 example.com nameserver 질의
6. resolver가 authoritative nameserver에 www.example.com A/AAAA 질의
7. resolver가 결과를 클라이언트에 반환
8. 브라우저가 IP로 TCP/TLS 연결 시작
```

실무에서는 매번 4~6번이 일어나지 않는다. DNS는 TTL 기반 캐시가 많아서 recursive resolver가 이미 답을 갖고 있으면 즉시 반환한다.

## 4. 어떤 방식으로 통신되나

전통적인 DNS는 UDP 53번 포트를 사용한다. 요청과 응답이 작고 빠르기 때문이다.

```text
client -> resolver: UDP/53 query
resolver -> client: UDP/53 response
```

응답이 크거나 UDP 응답이 잘렸거나, zone transfer 같은 특수한 경우에는 TCP 53번 포트를 사용한다.

암호화된 DNS도 있다.

| 방식 | 전송 | 특징 |
|---|---|---|
| DNS over UDP | UDP/53 | 전통적 방식, 빠르지만 암호화 없음 |
| DNS over TCP | TCP/53 | 큰 응답이나 재시도에 사용 |
| DoT | TCP/TLS/853 | DNS 질의를 TLS로 암호화 |
| DoH | HTTPS/443 | DNS 질의를 HTTPS 요청처럼 전송 |
| DoQ | QUIC | DNS 질의를 QUIC 위에서 전송 |

DoH나 DoT를 쓰면 네트워크 중간에서 DNS 질의 내용을 보기 어렵다. 다만 선택한 resolver는 여전히 질의 내용을 처리한다.

## 5. DNS record와 프론트엔드 영향

프론트엔드 개발자가 자주 만나는 record는 다음이다.

| Record | 의미 | 프론트엔드 영향 |
|---|---|---|
| A | IPv4 주소 | 서버/CDN endpoint 연결 |
| AAAA | IPv6 주소 | IPv6 환경 연결 |
| CNAME | 다른 host로 alias | CDN, SaaS 연결에 자주 사용 |
| TXT | 텍스트 검증 정보 | 도메인 검증, SPF/DKIM 등에 사용 |
| CAA | 인증서 발급 CA 제한 | TLS 인증서 운영과 연결 |

CNAME chain이 길면 authoritative lookup이 늘어날 수 있다. CDN을 붙인 도메인은 보통 CNAME으로 CDN provider의 edge host를 가리킨다.

## 6. 성능과 연결되는 지점

DNS lookup은 navigation timing에서 `domainLookupStart`와 `domainLookupEnd` 사이로 볼 수 있다. 이미 캐시된 경우 두 값이 같거나 매우 짧게 보일 수 있다.

프론트엔드 성능에 영향을 주는 패턴:

- third-party origin이 많으면 DNS lookup과 connection setup이 origin 수만큼 늘어난다.
- critical asset이 다른 origin에 있으면 document request 이후 다시 DNS/TCP/TLS 비용이 생긴다.
- DNS TTL이 너무 짧으면 resolver cache hit가 줄어들 수 있다.
- DNS TTL이 너무 길면 장애 대응이나 CDN migration 반영이 늦어진다.
- 사용자의 resolver 위치와 품질도 lookup time에 영향을 준다.

## 7. 개발자가 쓸 수 있는 힌트

`dns-prefetch`는 특정 origin의 DNS 조회를 미리 시작하라는 힌트다.

```html
<link rel="dns-prefetch" href="//cdn.example.com" />
```

`preconnect`는 DNS뿐 아니라 TCP/TLS 연결까지 미리 준비하라는 더 강한 힌트다.

```html
<link rel="preconnect" href="https://cdn.example.com" />
```

critical resource가 곧 필요하다면 `preconnect`가 유리할 수 있고, 나중에 필요할 수도 있는 origin이면 `dns-prefetch`가 더 가볍다. 둘 다 남용하면 브라우저가 불필요한 연결 준비에 리소스를 쓴다.

## 8. 디버깅 체크

DNS 문제를 볼 때는 다음을 확인한다.

- DevTools Network timing의 DNS Lookup 구간.
- `dig`, `nslookup`으로 A/AAAA/CNAME chain 확인.
- public resolver와 사내/ISP resolver 결과 차이.
- TTL과 cache 반영 시간.
- IPv6 AAAA record가 있을 때 실제 IPv6 연결 품질.
- CDN 설정 변경 후 authoritative record가 기대대로 바뀌었는지.

## 9. 인터뷰용 답변

> DNS는 브라우저가 HTTP 요청을 보내기 전에 도메인 이름을 IP 주소로 바꾸는 과정입니다. 브라우저와 OS 캐시를 먼저 보고, 없으면 recursive resolver가 root, TLD, authoritative nameserver를 따라가며 record를 찾습니다. 전통적으로는 UDP 53번 포트를 쓰고, 큰 응답이나 재시도에는 TCP를 쓰며, 요즘은 DoH나 DoT처럼 암호화된 DNS도 사용됩니다. 프론트엔드에서는 third-party origin 수, CNAME chain, DNS cache, `dns-prefetch`와 `preconnect` 사용이 성능에 영향을 줍니다.

## 10. 참고

- [RFC 1034: Domain Names - Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034)
- [RFC 1035: Domain Names - Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035)
- [RFC 8484: DNS Queries over HTTPS](https://www.rfc-editor.org/rfc/rfc8484)
- [RFC 7858: DNS over TLS](https://www.rfc-editor.org/rfc/rfc7858)
