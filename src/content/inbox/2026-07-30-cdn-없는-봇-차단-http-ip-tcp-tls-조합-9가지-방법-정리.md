---
title: 'CDN 없는 봇 차단: HTTP·IP·TCP·TLS 조합 9가지 방법 정리'
pubDate: '2026-07-30T10:21:34+09:00'
description: 'CDN 없이 HTTP 프로토콜, IP 대역, TCP 특성, TLS 지문을 조합해 부실한 봇을 차단하는 9가지 방법을 계층별로 정리한 실무 가이드.'
summary: 'Nginx와 nftables만으로 구현 가능한 봇 차단 기법을 L7→L4→콘텐츠 계층으로 분류하고, 각 방법의 오탐 위험과 적용 전 로그 분석의 중요성을 짚는다.'
lang: ko
tags:
  - 'security'
  - 'nginx'
  - 'networking'
  - 'bots'
canonical: 'https://news.hada.io/topic?id=31950&utm_source=discord&utm_medium=bot&utm_campaign=5809'
lintHash: '19a48f810f81'
polishHash: '19a48f810f81'
---

## TL;DR
- CDN 없이 HTTP 버전·IP 대역·헤더·TCP 파라미터·TLS 지문·Brotli를 계층적으로 조합하면 부실한 봇 대부분을 걸러낼 수 있으나, **수익 환경에서는 쓰지 말 것**(저자 주장) — ==정상 사용자·검색엔진·VPN 사용자가 함께 차단될 수 있기 때문이다.==

## 큰 그림
```
                      ┌─ 봇 차단 스택 (아래로 갈수록 정교) ─┐
                      │                                      │
  L7 (HTTP/앱)        │  ①HTTP/1.1차단  ④헤더·UA·메서드     │
                      │  ⑥RTA/X-Robots  ⑨스캐너 자기식별    │
                      ├──────────────────────────────────────┤
  L4 (네트워크/IP)    │  ②DC·AS·CIDR 블랙홀  ③국가·Tor 목록 │
                      │  ⑤nftables TCP 윈도·MSS·TTL          │
                      ├──────────────────────────────────────┤
  L7+암호 (지문)      │  ⑦JA4 TLS 지문                       │
                      ├──────────────────────────────────────┤
  콘텐츠              │  ⑧Brotli 전용 응답 (파싱 불가 유도)  │
                      └──────────────────────────────────────┘
           * 모든 단계 전에 1~3년 접근 로그 분석 필수
```

## 핵심
- 저자는 "정교한 자동화 전체"가 아니라 **"구현·설정이 부실한 봇 대부분"**을 값싸게 걸러내는 것에 목표를 둔다. 즉 방어선을 한 번에 높이는 게 아니라, **L7의 약한 신호(HTTP 버전, UA) → IP/네트워크 → TLS 지문 → 콘텐츠 해석 난이도** 순으로 점진적으로 쌓는 설계다.
- 각 방법은 독립적이지 않고 **서로의 오탐을 보완**한다. 예를 들어 HTTP/1.1만 차단하면 GoogleBot도 사라지므로, 이를 IP 대역 차단·TLS 지문과 함께 봐야 정상 검색엔진과 악성 봇을 구분할 수 있다.
- 전제 조건은 동일하다: **1~3년치 접근 로그를 먼저 분석**하지 않으면 VPN·학교·도서관·특정 언어 사용자·LTE를 정상 사용자째로 잘라낸다. ==저자는 이 전제를 "선택이 아닌 책임"으로 규정한다.==

## 깊이
- **[① HTTP 프로토콜 차단]** 일반 브라우저는 HTTP/2를 쓰지만, 단순 봇·크롤러·OG 미리보기 생성기는 HTTP/1.1을 쓰는 경우가 많다는 차이를 이용한다. Nginx의 `$server_protocol`로 분기해 `444`(응답 없이 연결 종료)를 반환하면 서버 자원을 가장 적게 쓴다. **비유가 깨지는 지점**: GoogleBot도 HTTP/1.1이라 함께 사라지고, Bing/Facebook은 HTTP/2라 남는다 — =="HTTP 버전 = 봇 여부" 등식은 성립하지 않는다.==
- **[② IP 블랙홀 라우팅]** 의심 IP의 AS·CIDR을 BGP Tools로 조회해 `ip route add blackhole`로 떨군다. 저자는 ipset보다 **블랙홀 라우팅이 CPU 부하가 낮다**고 주장하는데, 이는 커널 경로 테이블 조회가 netfilter 훅보다 빠른 경로에 위치하기 때문이다. 주의: 같은 호스팅 업체의 내부 DNS·게이트웨이까지 블랙홀에 넣으면 서버 자신이 고립된다.
- **[⑦ JA4 TLS 지문]** ClientHello의 확장·암호 스위트 순서를 해시한 JA4는 UA처럼 쉽게 위조되지 않는다(저자 주장). 단, headless Chrome 기반 봇은 **정상 브라우저와 동일한 JA4**를 가지므로 이 방법으로도 뚫린다 — 그래서 "장기 대안"이지 "완전한 해결"은 아니다.

## 용어 풀이
- **AS / CIDR** — 네트워크 사업자 단위(AS)와 그 IP 주소 블록 표기(CIDR). *비유*: AS는 "우편구역 관할 우체국", CIDR은 "그 우체국이 배달하는 동네 목록". 깨지는 지점: 한 AS 안에 CDN·호스팅·기업 고객이 섞여 있어 AS 단위 차단은 무차별 폭격이 된다.
- **블랙홀 라우팅** — 특정 목적지 패킷을 `/dev/null`로 보내는 커널 경로. *비유*: 우편함에 주소가 없는 편지를 넣으면 쓰레기통으로 바로 가는 것. 깨지는 지점: 로컬 게이트웨이 경로가 블랙홀보다 우선이므로, 자신의 호스팅사 대역을 차단하면 서버가 스스로와 통신하지 못할 수 있다.
- **JA4 (TLS 지문)** — TLS ClientHello 패킷의 특성을 해시해 클라이언트 종류를 식별하는 값. *비유*: 필체 감정. 깨지는 지점: Chromium 기반 봇은 사람과 같은 "필체"를 가진다.
- **MSS (Maximum Segment Size)** — TCP 세그먼트 하나에 실을 수 있는 최대 데이터 크기. *비유*: 트럭 한 대에 실을 화물량. LTE/VPN은 MTU가 작아 MSS가 범위를 벗어나기 쉽다.
- **`444` (Nginx)** — Nginx 전용 코드로, 응답 본문을 보내지 않고 TCP 연결만 끊는다. *비유*: 초인종 눌렀는데 문도 안 열고 인터콤도 꺼버리는 것.

## 시각 자료
| 방법 | 계층 | 차단 대상 | 오탐 위험(정상/검색엔진) | 핵심 신호 |
|---|---|---|---|---|
| ①HTTP/1.1 차단 | L7 | 단순 봇, OG fetcher | 낮음 / **중간(GoogleBot)** | `$server_protocol` |
| ②DC IP 블랙홀 | L3 | 데이터센터 발 크롤러 | 낮음 / **높음** | AS·CIDR, BGP |
| ③국가·Tor·악성 | L3 | FireHOL 목록 기반 | 중간 / 낮음 | `firehol_level2` 등 |
| ④헤더·UA·메서드 | L7 | UA 위조 안 하는 봇 | 중간(프록시·언어) / 낮음 | UA, `Sec-Fetch-Mode` |
| ⑤nftables TCP | L4 | 스캐너, zmap류 | **높음(LTE/VPN/Win)** | 윈도<12288, MSS, TTL |
| ⑥RTA / X-Robots | L7 | 준수하는 검색엔진·성인필터 봇 | 낮음 / 낮음 | 응답 헤더 |
| ⑦JA4 | L7+TLS | 고유 지문을 가진 봇 | 낮음 / 낮음 | ClientHello 해시 |
| ⑧Brotli 전용 | 콘텐츠 | `br` 해석 불가 봇 | 극히 낮음 / 낮음 | `brotli_static always` |
| ⑨스캐너 자기식별 | L7 | 초보 공격자·자동스캔 | 낮음 / — | 허니팟 경로 |

## 핵심 시사점 / 판단
- **(저자 주장)** "수익을 내는 운영 환경에는 사용하지 말 것" — 오탐이 매출로 직결되기 때문. 이는 경험에 기반한 경고이지만 정량적 근거는 원문에 없다.
- **(저자 주장)** ipset보다 블랙홀 라우팅이 CPU에 유리하다 — 커널 경로 구조상 타당하지만, 대규모 CIDR 목록에서의 FIB膨胀(경로 테이블 비대화) 영향은 원문에 없음.
- **(검증 필요·불확실)** "많은 봇이 Brotli를 해석하지 못한다" — 2026년 기준 주요 headless 브라우저는 Brotli를 지원하므로, 이 방법은 **오래된/저품질 봇에만 유효**할 가능성이 높다.
- **(검증 필요·불확실)** GoogleBot HTTP/1.1 사용 여부는 시점에 따라 달라질 수 있음 — 적용 전 최신 1차 출처(Google Search Central) 확인 필요.
- **(사실)** 444 코드는 Nginx 전용이며 표준 HTTP 상태 코드가 아님 — 다른 웹 서버(Apache, Caddy)에서는 동일하게 동작하지 않는다.

## 레퍼런스
- 원문 글 — https://nochan.net/b/Internet-Crap/20260606-How-To-Block-Some-Of-The-Bots/ · (2차) · CDN 없이 가능한 봇 차단 기법을 실무 설정과 함께 정리.
- BGP Tools — https://bgp.tools/ · (1차 도구) · IP의 AS·Prefix 조회.
- FireHOL Blocklists — https://github.com/firehol/blocklist-ipsets/ · (1차) · 악성·프록시·Tor IP 목록 모음.
- Deploying JA4 — https://blog.miloslavhomer.cz/deploying-ja4/ · (2차) · JA4 실제 배포 절차.
- FoxIO JA4 — https://github.com/FoxIO-LLC/ja4 · (1차) · JA4 라이브러리.
- RTA Label — https://www.rtalabel.org/ · (1차) · 성인 콘텐츠 라벨 표준.
- Help Attackers Self Report — https://nochan.net/b/Internet-Crap/20260524-Help-Attackers-Self-Report/ · (2차) · 스캐너가 스스로 식별하게 유도하는 허니팟 기법.

## 확인 질문
- Q1(전이): 이 글을 읽고 내 서비스에 그대로 적용할 때, **GoogleBot 차단으로 인한 검색 유입 감소**와 **봇 트래픽 감소** 중 어느 쪽이 비즈니스에 더 큰 영향을 미치는가?
- Q2(왜·어떻게): HTTP/2와 TLS 지문(JA4)을 모두 만족하는 headless Chrome 기반 AI 크롤러는 위 스택의 어느 단계에서도 걸러지지 않는데, 이 간극을 메우려면 **어떤 추가 신호(예: 행동 기반 rate limit, JS challenge)**가 필요한가?
- Q3(경계): 저자가 "수익 환경 금지"라고 한 경고는 어디까지 적용되는가? — SaaS 유료 서비스만 해당인가, 아니면 광고 수익이 있는 개인 블로그까지 포함인가?

> 출처: https://news.hada.io/topic?id=31950&utm_source=discord&utm_medium=bot&utm_campaign=5809
