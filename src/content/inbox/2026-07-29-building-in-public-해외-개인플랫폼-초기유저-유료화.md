---
title: Building in Public 해외 사례 — 개인 사이트·초기 이용자 모집·방법론 유료화
pubDate: '2026-07-29T16:11:15+09:00'
description: 해외 BiP를 개인 플랫폼 연계·초기 이용자 획득·유료화 세 축으로 조사한 캡처. 메타 레이어가 원본 제품보다 더 번다는 관찰이 핵심.
summary: '해외 Building in Public을 개인 사이트를 정본 허브로 쓰는 구조, 과정 공개를 초기 이용자 획득 채널로 쓰는 방식, 그리고 BiP 방법론 자체를 유료 제품으로 파는 메타 레이어 세 축으로 조사하고, Marc Lou의 제품별 매출에서 방법론 판매가 원본 제품을 앞지른다는 관찰과 Bannerbear·WIP의 후퇴 사례까지 확인한 인박스 캡처'
lang: ko
tags: [building-in-public, 인디해커, 개인사이트, 초기이용자, 유료화, 해외사례]
---

## 아이디어

국내 지형은 [별도 캡처](/inbox/2026-07-29-building-in-public-국내-성공-유형과-플랫폼별-계정/)에 정리했다. 이 노트는
해외를 **개인 플랫폼 연계 · 초기 이용자 모집 · 방법론 유료화** 세 축으로 본다.

해외 BiP는 단일 행위가 아니라 **세 층으로 쌓인 구조**다. ① 개인 사이트가 정본(canonical)이고 소셜은
유입로다. ② 과정 공개 자체가 광고비 0원의 초기 이용자 획득 채널로 작동한다. ③ 그 방법론을 도구·책·
코스로 되팔는 메타 레이어가 얹힌다. 가장 중요한 관찰은 3층에 있다 — ==Marc Lou의 제품별 공개 매출을
보면 방법론을 파는 제품이 원본 제품을 압도한다.== 원조 boilerplate인 ShipFast가 월 $4.5k인데, "검증된
매출 DB" TrustMRR이 $41k, "30일 내 출시 챌린지" Ship or Die가 $33.1k다. **BiP로 제품을 팔다가, BiP
자체를 파는 쪽이 본업이 된 것이다.**

동시에 **후퇴 사례도 명확하다.** Bannerbear의 `/open` 페이지는 현재 "Bannerbear ~~is~~ was an open
startup with public metrics, we now only share selected metrics"라고 적혀 있다. WIP는 유료 커뮤니티를
포기했다. 전면 공개는 유지 비용이 있고, BiP 커뮤니티의 유료화는 성장 상한을 만든다.

## 축 1 — 개인 플랫폼 연계: 사이트는 정본, 소셜은 도달

| 사례 | 사이트 구조 | 공개하는 것 |
| --- | --- | --- |
| `levels.io` (Pieter Levels) | home / **stats** / projects / tags / rss / long-form rss + `pieter.com` + `levels.vc` | stats 페이지에 매출·트래픽. Photo AI 월 매출 $105k·이윤 $80k(단일 `index.php`), 연 40억 요청에 호스팅 월 $244, 최고 기록 월 매출 $420k. 뉴스레터 구독자 14,365 |
| `marclou.com` (Marc Lou) | 약 **40개 프로젝트** 목록 + 제품별 월 매출 | 총 월 $114.4k. 뉴스레터 'Just Ship It' 42,851명. **중단 제품**(VirallyBot, 최고 $4K MRR, COVID로 중단)과 **인수 제품**(MakeLanding $35K)까지 표기 |
| `swyx.io` (swyx) | 블로그 중심 + 에세이 정본 | 2018년 「Learn in Public」이 BiP의 학습판 원형. "learning exhaust"를 만들라, ==Slack·Discord 같은 폐쇄 공간을 피하고 인덱싱되는 곳에 쓰라==, 지표(claps·likes) 대신 "3개월 전 자신과의 대화"를 가치로 삼으라 |
| `bannerbear.com/open` (Jon Yongfook) | 제품 사이트 안의 `/open` + 마일스톤 시리즈(`/journey-to-10k-mrr/`, `/journey-to-1-million-arr/`) | 현재는 Signups·New Customers·Conversion Rate 3개만. 푸터 'Other' 섹션 하단 배치 |
| `plausible.io/plausible.io` (Plausible) | **자기 제품으로 자기 지표를 공개** | 애널리틱스 제품이 자기 대시보드를 공개 — 도그푸딩이 곧 증거가 되는 구조 |

핵심 관찰 셋:

1. ==개인 사이트의 역할은 콘텐츠 보관이 아니라 검증 가능한 정본 확보다.== 소셜은 도달을 만들고
   사이트는 신뢰를 만든다. levels.io는 X 포스트를 **자기 사이트로 크로스포스팅해 아카이브**한다 —
   소셜이 원본이 아니라 사이트가 원본이다.
2. **실패를 목록에서 지우지 않는다.** marclou.com은 중단·인수 제품을 그대로 남긴다. 이게 "40개 중
   5개가 번다"는 실제 분포를 보여주고, 역설적으로 성공 수치의 신뢰도를 올린다.
3. **매출 공개는 사이트의 별도 1급 페이지**다(`/stats`, `/open`). 소셜 게시물처럼 흘러가지 않게
   고정 URL을 준다.

## 축 2 — 초기 이용자 모집: 과정 공개가 채널이다

### Plausible Analytics — 1차 수치가 있는 유일한 사례

자기 블로그에 채널·시점·수치를 함께 공개했다. 광고·어필리에이트·유료 추천에 **한 푼도 쓰지 않았다**고 명시한다.

| 시점 | 사건 | 결과 |
| --- | --- | --- |
| 2019 초 | **Indie Hackers에서 공개 베타** 시작 | 초기 유입 = 자기 블로그 + Indie Hackers + 공동창업자 트위터 |
| 2019-05 | — | MRR **$64** |
| 2019-07 | Hacker News 첫 진출 (〈You probably don't need a single-page application〉) | 하루 **2,500명**, MRR $118 |
| 2019-09 | 전체 코드 공개 (MIT) | 오픈소스가 프라이버시 시장의 신뢰 장치로 작동 |
| 2020-04 | HN 〈Why you should stop using Google Analytics〉 | 하루 **25,000명**, MRR **+$607** |
| 2020-05 | OpenSource.com 언급 | 하루 **94명 신규 가입**(당시 최고 기록) |
| 2020-05 → 2022-06 | — | $1,055 MRR → $500k ARR(2021-10) → **$1M ARR**(2022-06) |
| 2020-10 | 라이선스 MIT → AGPL 변경 | 대기업 무단 활용 방지 |

읽어낼 것: ==초기 이용자는 "BiP 커뮤니티"에서 오고, 스케일은 "의견 있는 콘텐츠"가 만든다.==
Indie Hackers는 처음 수십 명을, HN에 올라간 **주장 있는 글**은 하루 2.5만 명을 데려왔다. 제품 홍보글이
아니라 논쟁적 기술 주장이 채널이었다.

### Pieter Levels — 「12 startups in 12 months」 (2014-03)

- **목적이 마케팅이 아니었다.** 본인의 두 문제를 풀기 위한 장치였다 — 완벽주의로 프로젝트가 "완료"되지
  않는 문제, 그리고 출시 공포.
- 규칙: 매달 스타트업 1개 출시. **아이디어 선택 → 개발 → 언론 출시까지가 한 단위.** "작은 개인 초고속
  인큐베이터"라고 표현.
- 결과: The Next Web·Tech in Asia 등이 다루고 수천 명이 이메일·팔로우 → ==의도하지 않은 마케팅 성공.==
- 그리고 **대부분 실패했다.** 12개 중 Nomad List만 남았다(당시 월 $15,000~25,000 멤버십 매출).

읽어낼 것: 공개 선언은 제품 마케팅이 아니라 **자기 강제 장치**로 출발했고, 관객은 부산물이었다.
"12개월 12개" 같은 ==세는 단위가 있는 공개 약속==이 관객에게 추적 가능한 서사를 준다.

### 발견·배포 플랫폼

- **BetaList** — 초기 단계 스타트업 발견 플랫폼("before they make it big"). 직접 제출, 트렌딩 노출,
  **일일 신규 스타트업 다이제스트 뉴스레터**, 카테고리 브라우징. `BOOSTED` 유료 상위 노출 옵션 존재
  (가격 미표기). 만든 사람이 `#buildinpublic` 해시태그를 대중화한 Marc Köhlbrugge다 — **발견 플랫폼과
  BiP 문화가 같은 사람에게서 나왔다.**
- **Product Hunt / Hacker News / Indie Hackers / Reddit** — 2026년 들어 "PH 원샷 스파이크보다 지속적
  커뮤니티 존재가 전환이 높다"는 주장이 널리 퍼졌다. ==단 근거를 확인한 결과 2차 집계이고 개별 출처
  링크가 없다.== 방향성만 참고하고 수치는 인용하지 말 것(아래 레퍼런스에 한계 명시).

## 축 3 — 방법론 유료화: 메타 레이어

| 사례 | 파는 것 | 확인된 가격·규모 |
| --- | --- | --- |
| **Indie Page** (Marc Lou) | ==개인 BiP 페이지 자체가 제품.== 제품 목록·창업 서사·트래픽 애널리틱스·이메일 수집·28테마/9폰트·커스텀 도메인·SEO. **프리미엄**: Stripe/LemonSqueezy 연동 매출 공개 + `Revenue Verified` 배지 + 리더보드 | **1년 $25**(정가 $55) / **평생 $45**(정가 $75). 사용자 **22,997명** |
| **TrustMRR** (Marc Lou) | 검증된 매출 DB. Stripe·RevenueCat·Superwall·Creem 연동, 매시간 갱신 | 월 방문 **200K**. 리더보드 최상위 Stan $3.5M MRR. **Marc Lou 매출 $41k/월 = 그의 최대 제품** |
| **ShipFast / CodeFast / Ship or Die / DataFast** (Marc Lou) | 방법론을 boilerplate·코스·30일 챌린지로 패키징 | Ship or Die $33.1k, DataFast $26k, CodeFast $8.1k, **ShipFast $4.5k**(원조인데 가장 작다) |
| **WIP** (Marc Köhlbrugge) | todo·streak 기반 메이커 커뮤니티. ==미완료 항목은 등록 불가 — 완료된 것만.== 기본 공개+검색 인덱싱, Protected 옵션. 스트릭은 프로필 시간대 자정 리셋, 월 1회 무료 Streak Freeze | **2022-09-22 유료 → 초대제+무료 전환**(사유: 월 신규 가입 3명, 월매출 ~$2,000로 운영·개발 감당 불가). Pro 유료 병존, 현재 가격은 2차 정보($199/년) — 미확인 |
| **swyx — Coding Career Handbook** | 450+쪽. 「Learn in Public」 에세이 포함 | 프리세일 $4k → Dan Abramov 트윗으로 2배 → 최종 **프리세일 $11k** |
| **Arvid Kahl — The Bootstrapped Founder** | FeedbackPanda를 2년 만에 매각(2019) 후 **가르치는 쪽으로 전환**. Zero to Sold(Product Hunt 1위), The Embedded Entrepreneur, 'Find your Following' 트위터 코스, 뉴스레터·팟캐스트·유튜브 | ==The Embedded Entrepreneur는 초고를 트위터에 공개하며 집필==하고 독자 피드백을 출간 전에 받았다 — 책 자체를 BiP로 만든 사례 |

유료화가 **두 갈래**로 갈린다:

- **(a) 관객에게 도구를 판다** — Indie Page, ShipFast, TrustMRR. 자기 관객이 곧 타깃이라 전환이 빠르다.
- **(b) 관객에게 방법을 판다** — 책·코스(swyx, Arvid Kahl). 도달이 넓지만 반복 매출이 약하다.

==그리고 (a)는 BiP의 고질적 함정과 구조가 같다 — "인디해커를 위한 제품"만 만들게 되는 관객 편향.==
Marc Lou의 상위 5개 제품이 전부 인디해커향이라는 사실이 이 함정의 성공 사례이자 한계다. 대중 시장으로
확장할 경로가 이 구조에는 없다.

## 축 4 — 후퇴·실패 신호 (균형)

- **Bannerbear의 개방 후퇴** — `/open` 페이지 현재 문구가 "was an open startup ... we now only share
  selected metrics"다. 전면 공개 → 선별 3개 지표로 축소했고 배치도 푸터 하단이다. ==한 번 열면 계속
  열어야 하는 유지 비용이 실재한다.==
- **WIP의 유료 실패** — 유료 장벽이 월 신규 3명으로 성장을 눌렀다. BiP 커뮤니티는 **참여자 수가 곧
  가치**라서 유료화와 상충한다.
- **Pieter Levels의 실패율** — 12개 중 1개. 공개는 성공률을 올리지 않고 **시도 횟수를 올린다.**
- **가짜 MRR 문제** — 신뢰가 통화인 판에서 위조가 늘자 그 틈이 곧 제품(TrustMRR)이 됐다. 검증 계층이
  필요해졌다는 것 자체가 순수 자기신고 BiP의 신뢰가 소진됐다는 신호다.

## 더 해볼 질문

- 메타 레이어(방법론 판매)가 원본을 앞지르는 것은 **건강한 진화인가 폰지적 구조인가?** 관객이 다시
  관객을 위한 제품을 만드는 순환에서 최종 사용자는 누구인가. Marc Lou의 상위 5개가 전부 인디해커향인
  것을 성공으로 볼지 경고로 볼지.
- 매출이 없는 상태에서 `/stats`·`/open`에 해당하는 페이지를 만들 수 있는가? 이 블로그라면 공개 가능한
  지표는 스킬·노트·학습 맵의 **개수 × 기간**이다 — 국내 문법(개수 지표)과 우연히 맞는다.
- Plausible 경로("BiP 커뮤니티로 첫 수십 명 → 주장 있는 글로 2.5만 명")를 개발 도구가 아닌 도메인에서도
  재현할 수 있는가? HN 도달을 만든 것은 제품이 아니라 **논쟁적 기술 주장**이었다.
- 「Learn in Public」과 Build in Public을 이 블로그에서 어떻게 배치하는가? notes(개인 학습)는 전자,
  posts·idea는 후자에 가깝다. ==현재 컬렉션 구조가 이미 두 층을 분리하고 있다== — 의도적으로 정렬할 값어치가 있나?
- 개방 후퇴(Bannerbear)를 피하려면 처음부터 **무엇을 공개하지 않을지** 정해야 한다. 공개 범위를 좁게
  시작해 늘리는 편이 넓게 시작해 줄이는 것보다 나은가?
- 검증 계층(TrustMRR류)이 국내 결제 인프라(토스페이먼츠·포트원)에서 성립하는가 — 국내향 빈자리인가,
  아니면 국내 통화가 애초에 MRR이 아니라서 수요가 없는가?
- WIP의 "미완료는 등록 불가, 완료만" 규칙은 BiP 도구 설계의 핵심 제약처럼 보인다. 계획 공개가 아니라
  **완료 공개**만 허용하는 것이 왜 작동하는가?

## 레퍼런스·서비스

확인일: **2026-07-29**. ★는 해당 주체의 자체 페이지·글을 직접 열어 확인한 것(1차). 매출·팔로워 수치는
대부분 **자기신고**이며 TrustMRR 연동분을 제외하면 교차검증하지 않았다. 빠른 스캔 수준이라 깊은
1차 검증은 하지 않았다.

**축 1 — 개인 사이트·정본 구조**

- ★ [levels.io](https://levels.io/) — home/stats/projects 구조, Photo AI 월 $105k·이윤 $80k, 연 40억 요청에
  호스팅 월 $244, 최고 월 $420k, 구독자 14,365. X 포스트를 사이트로 통합. **1차**
- ★ [marclou.com](https://marclou.com/) — 약 40개 프로젝트 + 제품별 월 매출, 총 $114.4k/월, 뉴스레터
  42,851명. 중단·인수 제품까지 표기. **1차**
- ★ [swyx — Learn In Public](https://swyx.io/learn-in-public) — 2018년 에세이. "learning exhaust", 폐쇄
  공간 회피, "3개월 전 자신과의 대화". BiP의 학습판 원형. **1차**
- ★ [Bannerbear — Open Startup](https://www.bannerbear.com/open/) — 현재 선별 3개 지표만 공개. 후퇴 문구
  원문 확인. **1차**
- [Plausible — About](https://plausible.io/about) — 자체 자금·수익성, 외부 투자 없음, 구독 매출이 유일한
  수입원. **1차**
- [Buffer Open](https://buffer.com/open) — 2013년부터의 원형. **1차**
- [Marc Köhlbrugge — marc.io](https://marc.io/) — BetaList·WIP·Startup Jobs 제작자 개인 허브. **1차**

**축 2 — 초기 이용자 모집**

- ★ [Plausible — How we built a $1M ARR open source SaaS](https://plausible.io/blog/open-source-saas)
  — 채널·시점·MRR을 함께 공개. 이 노트의 축 2 수치 전체 출처. **1차**
- ★ [Pieter Levels — I'm Launching 12 Startups in 12 Months](https://levels.io/12-startups-12-months)
  — 2014-03-01. 규칙과 동기(완성 불능·출시 공포) 원문. **1차**
- [levels.io — 12 Startups in 12 Months 태그](https://levels.io/tag/12-startups-in-12-months/) — 프로젝트별
  사후 분석 글 모음. **1차**
- ★ [BetaList](https://betalist.com/) — 초기 스타트업 발견 플랫폼, 일일 다이제스트, `BOOSTED` 유료 노출. **1차**
- [Disrupt — 12 Startups in 12 months w/ Pieter Levels](https://disruptmagazine.com/12-startups-in-12-months-w-digital-nomad-pieter-levels/)
  — 언론 보도가 유입을 만든 경로. **2차**
- [Starter Story — How Pieter Levels Makes $3.2M/Year](https://www.starterstory.com/stories/nomad-list-breakdown)
  — 수치는 자기신고 인용. **2차**
- ⚠ [Product Hunt Is Dead for Indie Hackers (luka.to)](https://luka.to/blog/product-hunt-dead-indie-hackers-first-users-2026)
  — 채널별 전환율 표를 제시하지만 **1차 데이터가 아니다**. 본문이 "6개월간 25개 이상 Reddit 스레드·15개
  Indie Hackers 게시물 검토"라 밝히면서 **개별 출처 링크를 주지 않는다.** 방향성만 참고. **2차(집계)**
- ⚠ [Indie Hackers Launch Strategy (awesome-directories.com)](https://awesome-directories.com/blog/indie-hackers-launch-strategy-guide-2025/)
  — Plausible의 PH 전환 1.38% 대 Indie Hackers 24% 비교를 제시하지만 Plausible 자체 글에서 이 대조를
  확인하지 못했다. **인용하지 말 것.** **2차(미검증)**

**축 3 — 방법론 유료화**

- ★ [Indie Page](https://indiepa.ge/) — 1년 $25 / 평생 $45, 사용자 22,997명. 프리미엄에 매출 공개 +
  Revenue Verified 배지 + 리더보드. **1차**
- ★ [TrustMRR](https://trustmrr.com/) — Stripe·RevenueCat·Superwall·Creem 연동 검증, 매시간 갱신,
  월 방문 200K. **1차**
- ★ [WIP — Help](https://wip.co/help) — todo/streak 규칙, "완료된 것만", 기본 공개+인덱싱, Protected 옵션. **1차**
- ★ [WIP is now invite-only (and free\*)](https://wip.co/posts/wip-is-now-invite-only-and-free-c9wkua)
  — 2022-09-22 전환 공지. 월 신규 3명·월매출 ~$2,000이라는 사유를 본인이 밝힌 글. **1차**
- [The Bootstrapped Founder (Arvid Kahl)](https://thebootstrappedfounder.com/) — Zero to Sold,
  The Embedded Entrepreneur, Find your Following 코스, 뉴스레터·팟캐스트. **1차**
- [learninpublic.org — The Coding Career Handbook](https://learninpublic.org/) — swyx의 유료 책. **1차**
- [swyx — Launching the Coding Career Handbook](https://swyx.io/launching-coding-career) — 프리세일 $11k
  경위(Dan Abramov 트윗 효과 포함). **1차**
- [Startup Series — How Marc Lou Monetised MRR Bragging](https://startupseries.io/how-indie-hacker-marc-lou-monetised-mrr-bragging/)
  — "관객에게 도구를 파는" 구조 분석. **2차**
- [Startupik — Marc Lou: Building Startups in Public](https://startupik.com/marc-lou-building-startups-in-public-and-the-rise-of-indie-founders/) **2차**

**축 4 — 후퇴·비판**

- ★ Bannerbear `/open`의 "was an open startup" 문구 (위 링크와 동일). **1차**
- [The golden era of being an open startup is gone](https://testimonial.to/resources/the-golden-era-of-being-an-open-startup-is-gone) **2차**
- [DirectoryGems — TrustMRR 케이스](https://www.directorygems.com/case-study/trustmrr-com) — Pieter Levels의
  가짜 MRR 지적(조회 51.8만) 48시간 뒤 TrustMRR 출시. **2차**
- [My Experience with WIP.co: A Maker Community That's Missing the "Community"](https://ilikekillnerds.com/2024/12/15/my-experience-with-wip-co-a-maker-community-thats-missing-the-community/)
  — 유료 BiP 커뮤니티에 대한 부정적 사용 후기. **2차(개인 경험)**

**방법상 한계**

- WIP의 **현재** 유료 가격을 1차로 확인하지 못했다(`/help`에 미표기, $199/년은 2차 정보).
- Marc Lou·Pieter Levels의 매출은 **자기 사이트 자기신고**다. TrustMRR 연동 수치만 결제 제공자 검증을
  거친다고 주장되며, 그 주장 자체는 검증하지 않았다.
- BetaList의 뉴스레터 구독자 규모와 `BOOSTED` 가격은 공개 페이지에 없었다.
- 초기 이용자 모집 축은 **Plausible 하나만 1차 수치를 가진다.** 나머지 채널 비교 수치는 전부 2차
  집계이고 출처 링크가 없어 이 노트에 옮기지 않았다.
