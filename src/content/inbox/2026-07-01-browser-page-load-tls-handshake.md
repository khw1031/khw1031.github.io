---
title: TLS Handshake
pubDate: '2026-07-01'
description: HTTPS에서 서버 인증과 암호화 채널을 만드는 TLS handshake 과정
summary: "HTTPS의 TLS handshake를 서버 인증·키 합의·cipher 선택·ALPN 협상 관점에서 정리 — TLS 1.3 흐름, 인증서 검증, SNI/ALPN, session resumption·0-RTT, HTTP/2·3와 QUIC, 프론트엔드 성능·운영 체크를 다룬 노트."
lang: ko
tags: ['tls', 'https', 'network', 'web-performance']
lintHash: '625d5bab44e8'
polishHash: '625d5bab44e8'
---

> TLS handshake는 "암호화 시작"만이 아니라 ==서버 인증, 키 합의, 암호 스위트 선택, ALPN 기반 HTTP 버전 협상을 함께 수행하는 과정이다==.

## 1. TLS가 하는 일

TLS는 TCP 연결 위에서 암호화된 통신 채널을 만든다. HTTPS는 HTTP를 TLS 위에서 주고받는 방식이다.

TLS가 제공하는 것:

- 서버 인증: 접속한 서버가 해당 도메인의 서버인지 확인.
- 기밀성: 중간자가 내용을 읽기 어렵게 암호화.
- 무결성: 전송 중 데이터가 변조됐는지 확인.
- 키 합의: 클라이언트와 서버가 세션 키를 안전하게 만든다.

## 2. TLS 1.3 handshake 흐름

일반적인 TLS 1.3 handshake는 대략 다음 흐름이다.

```text
client -> server: ClientHello
server -> client: ServerHello
server -> client: EncryptedExtensions
server -> client: Certificate
server -> client: CertificateVerify
server -> client: Finished
client -> server: Finished
```

`ClientHello`에는 클라이언트가 지원하는 TLS 버전, cipher suite, key share, SNI, ALPN 등이 들어간다.

`ServerHello`에는 서버가 선택한 TLS 버전, cipher suite, key share가 들어간다.

`Certificate`에는 서버 인증서와 중간 인증서 체인이 들어간다.

`CertificateVerify`는 서버가 인증서의 private key를 실제로 가지고 있음을 증명한다.

`Finished`는 지금까지의 handshake가 변조되지 않았음을 확인한다. 이후 HTTP request/response는 합의된 키로 암호화되어 전송된다.

TLS 1.3의 full handshake는 보통 1 RTT가 필요하다. TCP handshake까지 합치면 HTTPS 첫 연결에는 TCP 1 RTT + TLS 1 RTT가 들어간다.

## 3. 인증서 검증

브라우저는 서버가 보낸 인증서를 다음 기준으로 검증한다.

- 인증서의 Subject Alternative Name이 접속한 host와 일치하는가.
- 인증서가 만료되지 않았는가.
- 신뢰 가능한 CA에서 이어지는 chain인가.
- 중간 인증서 체인이 올바른가.
- 인증서가 취소되지 않았는지 확인 가능한가.

이 중 하나라도 실패하면 브라우저는 경고 화면을 보여주거나 연결을 막는다. 프론트엔드 입장에서는 mixed content, 잘못된 CDN 인증서, 만료된 인증서가 페이지 전체 장애가 될 수 있다.

## 4. SNI와 ALPN

`SNI`는 Server Name Indication이다. 같은 IP에서 여러 HTTPS 도메인을 서비스할 때, 클라이언트가 어떤 host에 접속하려는지 TLS handshake 초기에 알려준다.

```text
ClientHello: server_name = www.example.com
```

서버는 SNI를 보고 해당 도메인의 인증서를 선택한다.

`ALPN`은 Application-Layer Protocol Negotiation이다. 클라이언트와 서버가 TLS handshake 안에서 HTTP/1.1, HTTP/2 같은 애플리케이션 프로토콜을 협상한다.

```text
ClientHello: h2, http/1.1 지원
ServerHello/EncryptedExtensions: h2 선택
```

HTTP/2가 켜져 있는지, HTTP/1.1로 떨어지는지는 ALPN 결과와 서버/CDN 설정에 영향을 받는다.

## 5. TLS session resumption과 0-RTT

TLS는 이전에 연결한 서버와 다시 연결할 때 session resumption으로 handshake 비용을 줄일 수 있다.

TLS 1.3에는 0-RTT early data도 있다. 클라이언트가 이전 세션 정보를 이용해 handshake 완료 전에 일부 데이터를 보낼 수 있다. 다만 replay risk가 있어서 모든 요청에 안전하지 않고, 서버와 브라우저 지원 및 정책에 따라 제한된다.

프론트엔드 관점에서는 "재방문은 첫 방문보다 빠를 수 있다"는 차이를 이해해야 한다. Lighthouse나 로컬 테스트에서 cold/warm 상태를 섞으면 결과가 흔들린다.

## 6. HTTP/2, HTTP/3와 TLS

HTTP/1.1과 HTTP/2는 보통 TCP 위의 TLS를 사용한다.

```text
TCP
-> TLS
-> HTTP/1.1 or HTTP/2
```

HTTP/3는 TCP를 쓰지 않고 QUIC 위에서 동작한다. QUIC은 TLS 1.3 handshake를 transport handshake에 통합한다.

```text
UDP
-> QUIC + TLS 1.3
-> HTTP/3
```

그래서 HTTP/3는 첫 연결과 재연결의 비용 구조가 HTTP/2와 다르다.

## 7. 성능과 연결되는 지점

TLS 시간은 Navigation Timing에서 `secureConnectionStart`부터 `connectEnd`까지의 일부로 볼 수 있다. DevTools Network timing에서는 SSL 또는 TLS 구간으로 표시된다.

성능에 영향을 주는 패턴:

- 새 origin마다 TLS handshake가 필요하다.
- 인증서 chain이 크거나 중간 인증서 설정이 잘못되면 handshake 비용과 실패 가능성이 커진다.
- session resumption이 잘 되면 재방문 연결 비용이 줄어든다.
- HTTP/2 ALPN 협상이 실패하면 multiplexing 이점을 잃을 수 있다.
- third-party script가 많은 페이지는 각 origin의 TLS 비용도 함께 부담한다.

## 8. 개발자가 보는 체크포인트

- 모든 asset이 HTTPS로 제공되는지 확인한다.
- mixed content가 없는지 확인한다.
- CDN 인증서가 도메인과 일치하는지 확인한다.
- HTTP/2 또는 HTTP/3가 실제로 활성화되어 있는지 확인한다.
- critical origin에만 `preconnect`를 사용한다.
- certificate chain과 만료일을 운영 모니터링에 포함한다.

`preconnect`는 TLS handshake까지 미리 진행할 수 있다.

```html
<link rel="preconnect" href="https://cdn.example.com" crossorigin />
```

폰트처럼 CORS가 필요한 리소스 origin에는 `crossorigin`이 필요할 수 있다.

## 9. 디버깅 체크

- DevTools Security 패널에서 인증서와 프로토콜 확인.
- Network timing에서 SSL/TLS 시간이 큰 요청 확인.
- `curl -v`로 ALPN 결과와 인증서 chain 확인.
- CDN 설정에서 HTTP/2, HTTP/3, TLS version 확인.
- 인증서 만료, SAN 누락, 중간 인증서 누락 확인.
- cold cache와 warm cache를 나눠 측정.

## 10. 인터뷰용 답변

> TLS handshake는 TCP 연결 위에서 서버를 인증하고 암호화 키를 합의하는 과정입니다. 클라이언트는 ClientHello로 지원하는 TLS 버전, cipher suite, SNI, ALPN, key share를 보내고, 서버는 인증서와 선택한 파라미터를 돌려줍니다. 브라우저는 인증서 체인과 도메인 일치 여부를 검증한 뒤 세션 키로 암호화된 HTTP 통신을 시작합니다. 프론트엔드에서는 새 origin마다 TLS 비용이 생기므로 critical origin 수를 줄이고, 필요한 경우 `preconnect`를 제한적으로 사용하며, HTTP/2/3 협상과 인증서 운영 상태를 확인해야 합니다.

## 11. 참고

- [RFC 8446: The Transport Layer Security Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446)
- [RFC 6066: TLS Extensions - Server Name Indication](https://www.rfc-editor.org/rfc/rfc6066)
- [RFC 7301: TLS Application-Layer Protocol Negotiation Extension](https://www.rfc-editor.org/rfc/rfc7301)
- [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000)
