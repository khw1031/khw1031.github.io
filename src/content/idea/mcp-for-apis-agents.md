---
title: 'APIs·Agents를 위한 MCP: 제품 후보 맵'
pubDate: '2026-07-09'
description: "'API를 감싸는 MCP'라는 테마에서 만들 수 있는 제품 후보를 발산하고 사업성 렌즈로 수렴한 맵"
summary: 'OpenAPI→MCP 자동 생성이 「단순 래퍼」를 이미 상품화했으므로, MCP 제품의 가치는 API가 주지 않는 데이터·판단·번들에 있다. Threads 바이럴 생성기를 포함한 6개 후보를 Double Diamond로 발산하고 Lean Canvas·JTBD로 수렴해 방어 가능성이 높은 방향을 골랐다.'
lang: ko
tags: [mcp, ai-agents, product-idea, apify, threads]
---

> 한 줄 명제: MCP의 돈은 "API를 감싸는 일"이 아니라 **API가 주지 않는 데이터·판단·번들**에 있다 — 래퍼는 이미 자동 생성으로 상품화됐다.

## 핵심

MCP(Model Context Protocol)는 LLM 애플리케이션과 외부 데이터·도구를 잇는 개방형 프로토콜이다. 호스트·클라이언트·서버 구조에서 서버가 **Tools/Resources/Prompts**를 노출하고, 에이전트가 그걸 호출한다. "API, Agent를 위한 MCP"라는 이 아이디어의 원래 직관 — *유용한 API를 에이전트가 쓰게 MCP로 감싼다* — 은 방향은 맞지만, 그 자체로는 이미 레드오션이다.

왜냐하면 **OpenAPI 문서만 있으면 MCP 서버를 자동 생성**해 주는 도구(Speakeasy, Stainless)가 이미 프로덕션에서 수십 개를 찍어내고 있고, Apify 같은 플랫폼은 수천 개의 스크레이퍼를 "동적 도구 발견"으로 에이전트에 통째로 노출한다. 즉 "API → MCP 변환"은 이미 커머디티다. 여기서 새로 뛰어들어 이길 곳은 변환 파이프라인이 아니라, **깨끗한 API가 없어서 자동 변환이 안 되는 데이터**, 혹은 **도구가 넘쳐서 생기는 신뢰·큐레이션·과금 문제**다.

이 노트는 그 축(=가치가 어디로 이동했나)을 기준으로 제품 후보를 펼치고, "사업/수익 가능성"이라는 목적에 맞춰 방어 가능성과 수익 모델로 좁힌다. 사용자가 던진 Threads 바이럴 생성기는 이 지도 위에서 "데이터가 해자인 버티컬 번들"의 한 인스턴스로 위치한다.

## 방법론

- **Double Diamond (발산→수렴)** — 테마가 넓고 "어떤 게 있을까"가 열려 있어, 먼저 후보를 넓게 벌리고(발산) 한 축으로 좁힌다(수렴). 발산은 아이디어 개수가 아니라 *가치 위치*가 서로 다른 후보를 모으는 데 목적이 있다.
- **Lean Canvas + JTBD (수렴 렌즈)** — 목적이 "사업/수익 가능성 탐색"이므로, 각 후보를 문제 긴급도(JTBD)·경쟁/방어력·데이터/법적 리스크·수익 모델·구축 난이도로 평가한다.
- **Pre-mortem** — 최종 후보(Threads 시드)에 대해 "1년 뒤 실패했다"를 가정해 실패 원인을 역산한다.

## 전개

### 1) 발산 — "MCP-for-X" 후보 6개 (가치 위치가 서로 다름)

1. **Threads 바이럴 패턴 → 글 생성 MCP** *(사용자 시드)* — 공개 Threads 글을 수집(Apify)해 바이럴 패턴을 추출하고, 에이전트가 `analyze_pattern` / `generate_post`로 호출. 가치 = 패턴 IP + 데이터.
2. **니치 데이터 MCP** — 깨끗한 API가 없어 자동 변환이 안 되는 소스(예: 국내 공공데이터·법령·특정 커뮤니티)를 정규화해 도구로 노출. 가치 = 데이터 확보·정규화.
3. **MCP 신뢰·평가 레이어** — 레지스트리에 5만 개+ 서버가 쌓이며 "어느 도구가 실제로 되는가"가 아픔. 도구를 테스트·모니터링·랭킹하는 메타 서비스. 가치 = 큐레이션·신뢰.
4. **버티컬 에이전트 툴킷** — 한 직무(job)에 필요한 MCP 묶음(예: "그로스 마케터 팩": Threads+X+analytics+writer)을 큐레이션. 가치 = 번들·워크플로. Threads 시드는 이것의 부분집합.
5. **MCP 과금·미터링 게이트웨이** — 도구 호출당 수익화(per-call/outcome)가 아직 미성숙. 결제·미터링 인프라. 가치 = 인프라.
6. **API→관리형 MCP 호스팅** — "내 API를 MCP로 만들어 운영" 대행. **커머디티 지대(Speakeasy/Stainless/Apify 영역)** — 신규 진입 비권장.

### 2) 수렴 — 사업성 평가

| 후보 | 문제 긴급도(JTBD) | 경쟁/방어력 | 데이터·법적 리스크 | 수익 모델 | 구축 난이도 |
| --- | --- | --- | --- | --- | --- |
| 1 Threads 생성기 | 중(글쓰기 수요 큼) | 중(패턴 IP가 해자, 플랫폼 의존) | 중~고(스크레이핑 ToS/GDPR) | per-call / SaaS | 낮~중 |
| 2 니치 데이터 | 중~고(대체재 없음) | 고(데이터 확보가 해자) | 소스별 상이 | per-call | 중 |
| 3 신뢰·평가 | 고(5만+ 도구, 품질 미지) | 중(선점·데이터 축적) | 낮 | SaaS/리스팅 | 중~고 |
| 4 버티컬 툴킷 | 중~고(즉시 쓰는 묶음) | 중(큐레이션·브랜드) | 구성요소 상속 | 구독 | 중 |
| 5 과금 게이트웨이 | 고(수익화 공백) | 중(Stripe MPP 등과 경쟁) | 낮 | take-rate | 고 |
| 6 관리형 호스팅 | 중 | **저(커머디티)** | 낮 | 구독 | 중 |

**수렴 결론:** 방어력의 원천은 세 갈래다 — ①**데이터**(후보 1·2), ②**큐레이션·신뢰**(3·4), ③**인프라 선점**(5). 솔로/사이드로 사업성을 노린다면 **데이터가 해자인 버티컬(1·2·4)** 이 진입장벽과 구축 난이도의 균형이 가장 좋다. Threads 시드(1)는 그 자체로 유효하되, 차별화는 "MCP로 감쌌다"가 아니라 **패턴 분석 IP와 큐레이션**에서 나와야 한다.

### 3) Threads 시드 — 미니 Lean Canvas + Pre-mortem

- **문제/JTBD**: "짧은 시간에 반응 나오는 Threads 글을 쓰고 싶다"는 크리에이터·마케터의 진전. 대안 = 감(感), 수동 벤치마킹.
- **해법**: 공개 바이럴 글을 수집→패턴화→에이전트가 초안 생성. MCP 도구로 노출해 다른 에이전트/워크플로에 끼워 팜.
- **데이터**: Meta 공식 Threads API는 **본인 계정 게시/조회·인사이트** 중심이라 *경쟁자 바이럴 글 수집엔 부적합*. 따라서 공개 데이터 스크레이핑(Apify Threads Scraper)에 의존. 로그아웃 공개 데이터 스크레이핑은 Bright Data v. Meta(2024) 판례가 우호적이나 ToS/GDPR 리스크는 남는다.
- **수익**: 도구 호출당 과금(per-call) 또는 SaaS. MCP 마켓(Apify/MCPize)·결제 게이트웨이(Stripe MPP)로 수익화 경로 존재.
- **Pre-mortem(1년 뒤 실패했다면)**: ① 생성 글이 뻔해서(=패턴이 표면적) 재구독 안 됨 → 패턴 IP 깊이가 핵심. ② 플랫폼 의존(스크레이퍼 차단/ToS 변경/알고리즘 변화)로 데이터 끊김. ③ "AI 글쓰기"의 레드오션 속 차별화 실패. ④ 바이럴 조장이 스팸/정책 위반으로 비화.

## 근거

_확인일 2026-07-09. 벤더 공식 페이지는 1차, 요약·집계는 2차로 표시. MCP 버전은 사양서에 명시된 리비전 기준._

- **MCP 사양 (2025-11-25 리비전)** — 1차/공식(직접 열람). MCP를 "LLM 앱과 외부 데이터·도구를 잇는 개방형 프로토콜"로 정의, 호스트/클라이언트/서버·Tools/Resources/Prompts 구조 규정. [modelcontextprotocol.io/specification/2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- **MCP 2026-07-28 릴리스 후보** — 1차/공식 블로그. 프로토콜 코어의 **stateless 전환**, Extensions·Tasks·MCP Apps 도입(수평 확장 시 sticky routing 불필요) — 서버 배포·과금 설계에 영향. [blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
- **Apify MCP 서버** — 1차/공식 문서·정본 repo. 수천 개 스크레이퍼를 "동적 도구 발견"으로 에이전트에 노출, 미인증 도구 외에는 API 토큰 필요. "데이터 소스를 MCP로"의 대표 사례. [docs.apify.com/platform/integrations/mcp](https://docs.apify.com/platform/integrations/mcp) · [github.com/apify/apify-mcp-server](https://github.com/apify/apify-mcp-server)
- **OpenAPI→MCP 자동 생성 (Speakeasy·Stainless)** — 1차/벤더 공식. OpenAPI 문서로 MCP 서버를 자동 생성(각 엔드포인트를 도구로), 프로덕션 수십 개 운영·5분 무료 생성 주장 → "API 래핑"의 커머디티화 근거. [speakeasy.com/blog/generate-mcp-from-openapi](https://www.speakeasy.com/blog/generate-mcp-from-openapi) · [stainless.com/docs/mcp](https://www.stainless.com/docs/mcp/)
- **MCP 레지스트리·수익화** — 2차/집계(직접 카운트 미검증). Glama 약 3.7만·PulseMCP 1.1만+·Smithery 등 디렉토리 존재, per-call/구독/freemium/outcome 과금 모델, Stripe MPP(2026-03)·Moesif(WSO2) 언급. 시장 규모·수익 경로의 방증. [truefoundry.com/blog/best-mcp-registries](https://www.truefoundry.com/blog/best-mcp-registries) · [godberrystudios.com/posts/how-to-monetize-mcp-servers-2026](https://godberrystudios.com/posts/how-to-monetize-mcp-servers-2026/)
- **Threads API (Meta)** — 1차/공식. Graph API 기반, **본인 계정 게시·조회·답글·인사이트** 중심이며 무제한 스크레이핑/광범위 공개 데이터 수집은 비대상 → 경쟁자 바이럴 데이터엔 부적합. [developers.facebook.com/docs/threads](https://developers.facebook.com/docs/threads)
- **Threads 스크레이핑 실현가능성·법적 판례** — 2차/보도(원 판결문 미열람). Apify Threads Scraper는 공개 데이터만 수집(로그인 우회 없음) 주장; Bright Data v. Meta(2024, N.D. Cal, Chen 판사)에서 "로그아웃 공개 데이터 스크레이핑은 Meta 약관이 금지하지 않는다"는 판단 보도. ToS/GDPR 준수 책임은 이용자에게. [apify.com/automation-lab/threads-scraper](https://apify.com/automation-lab/threads-scraper) · [blog.apify.com/is-web-scraping-legal](https://blog.apify.com/is-web-scraping-legal/)

## 다음 액션

1. **가치 위치 결정**: 데이터형(1·2) / 큐레이션형(3·4) / 인프라형(5) 중 하나로 확정한다. (권장: 데이터형 버티컬)
2. **최소 검증 실험(Threads 시드 기준)**: Apify Threads Scraper로 특정 니치 100~300개 글을 수집해 "바이럴 패턴"이 표면 지표(길이·훅·이모지) 이상으로 존재하는지부터 검증한다 — 없으면 아이디어 1은 접는다.
3. **수익 경로 프로토타입**: 도구 1개(`generate_post`)를 MCP 서버로 노출하고 per-call 과금(Apify/MCPize 또는 Stripe MPP)까지의 배선을 최소로 확인한다.
4. **법적 가드레일**: 스크레이핑 대상·용도·보관을 ToS/GDPR 관점에서 한 페이지로 정리(공개 데이터 한정, 재판매 금지).

## 열린 질문 / 내 관점

- **가장 불확실한 것**: "바이럴 패턴"에 재현 가능한 신호가 있는가(=아이디어 1의 존폐를 가름). 확신 낮음 — 실험 2가 먼저다.
- **내 관점**: 이 테마에서 신규 진입자의 승부처는 프로토콜/래핑이 아니라 **데이터 접근권과 큐레이션**이다. 그래서 "API를 위한 MCP"보다 "**에이전트가 목말라하는, 깨끗한 API가 없는 데이터**를 위한 MCP"로 문장을 다시 쓰는 게 맞다. Threads 시드는 그 좋은 첫 실험 대상이되, 패턴 IP가 얕으면 빠르게 니치 데이터(후보 2)로 피벗할 것.
- **미검증 가정**: 레지스트리 카운트·판례 세부는 2차 출처다. 사업화 단계로 가면 원 판결문과 Meta 최신 개발자 약관을 1차로 재확인해야 한다.
