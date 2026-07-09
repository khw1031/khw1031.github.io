---
title: TCP Connection
pubDate: '2026-07-01'
description: 브라우저와 서버가 신뢰 가능한 연결을 만드는 TCP handshake와 전송 흐름
summary: "HTTP가 올라타는 신뢰 가능한 byte stream을 만드는 TCP — 3-way handshake, 협상 옵션(MSS·Window Scale·SACK), 손실·재전송·혼잡 제어, HTTP/1.1~3와의 관계, preconnect 등 프론트엔드 성능 접점을 정리한 노트."
lang: ko
tags: ['tcp', 'network', 'web-performance', 'frontend']
lintHash: '755e860614af'
polishHash: '755e860614af'
---

> TCP는 HTTP 요청을 보내는 프로토콜이 아니라, ==HTTP가 올라타는 신뢰 가능한 ordered byte stream을 만드는 전송 계층 프로토콜이다==.

## 1. TCP가 하는 일

TCP는 클라이언트와 서버 사이에 연결을 만들고, 데이터를 순서대로, 손실 없이 전달하려고 한다.

TCP가 제공하는 핵심 기능:

- 연결 지향 통신.
- 순서 보장.
- 손실 감지와 재전송.
- 흐름 제어.
- 혼잡 제어.

브라우저가 `https://example.com`에 접근하면 DNS로 얻은 IP의 443 포트에 TCP 연결을 만든 뒤, 그 위에서 TLS handshake를 진행한다.

## 2. TCP 3-way handshake

TCP 연결은 보통 세 단계로 만들어진다.

```text
client -> server: SYN
server -> client: SYN-ACK
client -> server: ACK
```

`SYN`은 클라이언트가 연결을 시작하겠다는 패킷이다. 초기 sequence number와 TCP option을 보낸다.

`SYN-ACK`은 서버가 연결 요청을 수락하고 자기 초기 sequence number를 보내는 응답이다.

`ACK`는 클라이언트가 서버의 응답을 확인했다는 패킷이다. 이 시점부터 양쪽은 연결이 성립됐다고 본다.

이 과정은 최소 1 RTT를 필요로 한다. RTT가 100ms인 모바일 환경에서는 TCP 연결만으로도 최소 100ms가 추가될 수 있다.

## 3. handshake에서 협상되는 것

TCP handshake는 단순히 "연결됨"만 확인하지 않는다. 여러 option도 함께 협상한다.

| Option | 의미 |
|---|---|
| MSS | 한 TCP segment에 실을 수 있는 최대 payload 크기 |
| Window Scale | 받을 수 있는 데이터 window를 확장하는 옵션 |
| SACK | 손실된 일부 segment만 선택적으로 재전송할 수 있게 함 |
| Timestamps | RTT 측정과 PAWS 등에 사용 |

이 옵션들은 브라우저 코드에서 직접 만지지는 않지만, 네트워크 품질과 운영체제 TCP stack 성능에 영향을 준다.

## 4. TCP는 byte stream이다

TCP는 message 단위가 아니라 byte stream을 제공한다. 애플리케이션이 `write()`한 경계와 상대방이 `read()`하는 경계가 항상 일치하지 않는다.

HTTP/1.1, HTTP/2는 이 TCP byte stream 위에서 자기 메시지 형식을 정의한다. 그래서 HTTP 레벨의 request/response와 TCP segment는 같은 단위가 아니다.

## 5. 손실, 재전송, 혼잡 제어

TCP는 packet loss가 발생하면 데이터를 재전송한다. 손실이 생기면 단순히 해당 리소스만 늦어지는 것이 아니라, 연결 전체의 throughput이 줄어들 수 있다.

혼잡 제어는 네트워크가 감당 가능한 속도를 추정해 전송량을 조절한다. 연결 초반에는 slow start로 시작해 점진적으로 전송량을 늘린다.

프론트엔드 관점에서 중요한 점:

- 작은 리소스도 새 연결에서는 slow start 영향을 받는다.
- packet loss가 있으면 HTTP/2 multiplexing 중인 여러 stream이 함께 영향을 받을 수 있다.
- 모바일 네트워크는 RTT와 loss가 커서 connection setup 비용이 더 크게 보인다.

## 6. HTTP/1.1, HTTP/2, HTTP/3와 TCP

HTTP/1.1은 여러 요청을 처리하기 위해 여러 TCP 연결을 열거나 keep-alive 연결을 재사용한다.

HTTP/2는 하나의 TCP 연결 위에서 여러 요청을 동시에 multiplexing한다. 연결 수를 줄일 수 있지만, TCP packet loss가 발생하면 같은 연결 위의 stream들이 영향을 받을 수 있다.

HTTP/3는 TCP 대신 QUIC을 사용한다. QUIC은 UDP 위에서 동작하고 TLS 1.3을 통합하며, stream 단위 손실 처리를 개선한다.

## 7. 성능과 연결되는 지점

TCP 연결 시간은 DevTools Network timing의 `Initial connection` 구간이나 Navigation Timing의 `connectStart`와 `connectEnd` 사이에서 볼 수 있다. HTTPS에서는 이 구간 안에 TLS 시간이 포함되거나 `secureConnectionStart`로 따로 볼 수 있다.

성능에 영향을 주는 패턴:

- origin이 많으면 TCP 연결 수가 늘어난다.
- connection reuse가 안 되면 같은 origin에도 handshake가 반복된다.
- redirect로 origin이 바뀌면 DNS/TCP/TLS를 다시 치를 수 있다.
- critical resource가 여러 origin에 흩어져 있으면 초기 화면이 느려질 수 있다.

## 8. 개발자가 쓸 수 있는 힌트

`preconnect`는 브라우저가 특정 origin에 대해 DNS, TCP, TLS 연결을 미리 준비하도록 돕는다.

```html
<link rel="preconnect" href="https://static.example.com" />
```

단, 모든 third-party origin에 넣으면 안 된다. 실제 초기 화면에서 곧 필요한 origin에만 제한해야 한다.

개발 체크:

- critical resource를 같은 CDN origin에 모아 connection reuse를 높인다.
- 불필요한 third-party script와 pixel origin을 줄인다.
- redirect chain을 줄여 connection setup 반복을 막는다.
- HTTP/2 또는 HTTP/3 지원 여부를 CDN/server 설정에서 확인한다.

## 9. 디버깅 체크

- DevTools Network timing에서 Initial connection 시간이 큰지 확인.
- 같은 origin 요청들이 connection id를 재사용하는지 확인.
- waterfall에서 redirect 후 새 connection이 생기는지 확인.
- 모바일 throttling이나 실제 기기에서 RTT 영향을 본다.
- CDN이 HTTP/2 또는 HTTP/3로 응답하는지 확인.

## 10. 인터뷰용 답변

> TCP 연결은 HTTP 요청 전에 클라이언트와 서버가 신뢰 가능한 byte stream을 만들기 위해 수행하는 과정입니다. 클라이언트가 SYN을 보내고, 서버가 SYN-ACK으로 응답하고, 클라이언트가 ACK를 보내면 연결이 성립합니다. 이 과정은 최소 1 RTT가 필요하기 때문에 모바일처럼 RTT가 큰 환경에서는 초기 로딩에 직접 영향을 줍니다. 프론트엔드에서는 origin 수를 줄이고 connection reuse를 높이고, critical origin에는 `preconnect`를 제한적으로 사용해 비용을 줄일 수 있습니다.

## 11. 참고

- [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293)
- [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323)
