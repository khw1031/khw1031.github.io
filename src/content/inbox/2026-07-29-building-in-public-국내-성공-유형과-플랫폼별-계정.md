---
title: Building in Public — 국내 성공 유형과 플랫폼별 계정 지형
pubDate: '2026-07-29T15:52:03+09:00'
description: BiP의 기원·작동 메커니즘을 정리하고, 국내에서 과정 자체를 공개하는 계정을 Instagram·Threads·X 단위로 확인한 캡처.
summary: 'Building in Public의 기원(Buffer 2013)과 작동 메커니즘을 정리하고, 국내 과정 공개형 활동이 Threads에 집중되어 있으며 X는 소수 고신뢰 개인, Instagram은 사실상 부재라는 플랫폼별 지형과 실제 계정·원문을 확인한 인박스 캡처'
lang: ko
tags: [building-in-public, 인디해커, 퍼스널브랜딩, 국내사례, threads]
polishHash: '9fd28043b8cc'
lintHash: '9fd28043b8cc'
---

## 아이디어

Building in Public(BiP)은 **제품이 완성되기 전에 만드는 과정 자체를 공개해, 출시 시점에 이미 관객이
존재하게 만드는 유통 전략**이다. 기원은 2013년 Buffer의 Open Startup — 트래픽·매출·급여까지 공개했고,
2014년 Baremetrics(Josh Pigford)가 이어받았다. 해시태그 `#buildinpublic`은 BetaList·WIP를 만든
Marc Köhlbrugge가 대중화했다. 메커니즘은 셋이다: ① 과정 공개가 제품이 아니라 **사람에 대한 신뢰**를
선적립한다, ② 관객이 무료 피드백·책임 장치가 된다, ③ 축적된 글이 검색 유입·백링크로 남는다.
반대급부도 분명하다 — 복제 위험, 정체성이 프로젝트에 묶임, "인디해커를 위한 제품"만 만들게 되는
관객 편향.

국내를 **Instagram·Threads·X 세 플랫폼으로 좁혀 과정 공개형 계정을 직접 확인한 결과**, 지형이 균등하지
않다. ==Threads가 국내 BiP의 실질적 본거지이고, X는 소수의 고신뢰 개인이 쓰며, Instagram은 사실상
부재다.== 그리고 국내에서 통용되는 지표가 해외와 다르다 — ==해외 BiP의 통화가 MRR 스크린샷이라면,
국내 Threads의 통화는 "개수 × 기간"이다.== "8개월에 28개 앱", "사이드프로젝트 40개", "퇴근 후 8개월",
"하루 1억 토큰" 같은 **활동량 지표**가 앞에 오고 매출은 부차적이거나 남의 사례 인용으로 등장한다.

용어 자체도 수입되지 않았다. X 한국어권에서 `빌드인퍼블릭`·`buildinpublic` 검색은 유의미한 결과가
0건이었다. 국내 실천자들은 BiP라는 이름 없이 "개발 일지", "회고", "만들고 있습니다"로 같은 행동을 한다.

해외 쪽 구조(개인 사이트 정본화 · 초기 이용자 모집 · 방법론 유료화)는
[별도 캡처](/inbox/2026-07-29-building-in-public-해외-개인플랫폼-초기유저-유료화/)에 정리했다.

## 플랫폼별 지형

### Threads — 국내 BiP의 실질적 본거지

**과정 공개형 (자기 작업을 진행 중에 공개)**

| 계정 | 공개 방식 | 확인된 내용 |
| --- | --- | --- |
| `@jiwonnnnieee` | 일지형 | 캐나다 풀타임 개발자, 퇴근 후 8개월 개발. "3주 업데이트한 기능 심사 중, 1~2일 걸릴 것 · 오늘도 7시간 개발 · 이제 2시간 걸을 것" — 진행 상태·소요 시간·감정·앱스토어 심사까지 그대로 공개. 국내에서 가장 전형적인 BiP 일지 |
| `@steady__study.dev` | 압축 타임라인형 | AI 코딩 환경을 플러그인→하네스로 발전시킨 경로를 몇 줄로 압축. "7-8개 세션에서 4개 제품 병렬 개발하며 뽕에 취함, 근데 에이전트의 노예가 된 기분", "병렬은 0.9까지의 쓰루풋만 높인다"는 **실패·전환까지** 공개하고 제품(Ceal)으로 초점 이동 |
| `@dong_hun_leee` | 회고 + 도구 공개형 | 사이드 프로젝트 30개→40개 진행. "1년동안 열심히 만들었지만 한명도 사용하지 않았던 서비스"도 함께 공개. 툴 스택 ver.2를 기획·MMVP·디자인·개발 단계별로 전부 공개 |
| `@yozum.vibe` | 기술 과정 심층형 | RAR 포맷 리버싱 — "처음 2주는 코드를 한 줄도 안 썼다", Claude로 포맷 문서화 후 갭 문서 유지, DOS/Windows 바이너리를 Ghidra로 hex dump. 결과가 아니라 방법론을 공개 |
| `@unclejobs.ai` (엉클코드) | 선공개 데모형 | 만들고 있는 CLI 제품의 데모 영상을 출시 전에 먼저 공개("바이브쇼츠, 곧 올지도 모르겠어요") |
| `@programmingzombie` | 출시 기록형 | "바이브코딩 100% iOS 앱도 출시 제출" — 심사 제출 시점을 기록 |
| `@seonghoonlee_` | 지표 공개형 | 유튜브 구독자 7,000명 돌파·평균 조회수 3~4천·댓글 반응(비판 포함)까지 공개하고 플랫폼별 피드백 질을 비교 |
| `@curator.danbi` | 실물 공개형 | 3.8만 유튜브 구독자에 맞춘 기능을 바이브코딩으로 개발하고 실서비스 URL을 그대로 노출 |

**커뮤니티·중계·교육형 (본인 빌드가 아닌 경우 포함)**

- `@syde.kr` — SYDE 사이드프로젝트 커뮤니티. 1,400+ 메이커, `inSYDE` 팟캐스트, 월간 `SYDE Pick` 선정,
  프로젝트 쇼케이스+업보트. ==국내 BiP의 사실상 인프라 계층.==
- `@andytechcan` — 1인 개발자 SaaS 사례를 **1년간 50여 개 소개**한 큐레이션 계정. 본인 빌드가 아니라
  타인 사례 중계이므로 BiP가 아니라 중계형으로 분류해야 한다.
- `@youtubejocoding` (조코딩) — 교육자-빌더. 'Product Builder' 채용을 Threads에서 공개 운영.
- `@simon.dsgn` — 바이브코딩 앱 제작 책 출간 + 마케팅·디자인·운영 무료 특강 일정 공개.
- `@querydaily.official` — BiP 논지 자체를 설파. "200자짜리 트러블슈팅 메모, 하루 한 줄 코드 리뷰
  일지가 1년 쌓이면 디스커버리 채널이 됩니다."
- `@devdesign.kr` (비노 · 개발자의디자인) — 개발자향 디자인 콘텐츠.

### X — 소수·고신뢰형

- **`@appledelhi` (송재경, Jake Song)** — 리니지·아키에이지 창시자. **2013년 이후 13년간 침묵하다
  2026년 7월 복귀해 과정을 공개하기 시작했다.** 국내 X BiP 최대 사례.
  - 2026-07-20: "회사를 그만두고 쉬다가 집에서 이런거 만들고 있습니다 — 브라우저에서 돌아가는
    오픈소스 일인 개발(+AI) MMO" + GitHub 링크. **조회 89.6만, 좋아요 3,081, 북마크 2,547.**
  - 2026-07-22: "LLM으로 게임 접속할 수 있게 agent-client를 배포했습니다" (조회 3.8만) — 릴리스 단위 후속 공개.
  - 2026-07-25: Opus 5 사용 후기까지 공개("코딩은 잘하지만 멍청한 기획자 델고 일하는 느낌").
  - **리스크 실례**: 2026-07-26 "제 X 계정이 해킹되어 오늘 새벽 코인 CA가 포함된 글이 무단
    게시됐습니다." ==계정이 자산이 되는 순간 탈취 표적이 된다== — BiP 리스크의 구체적 사례.
- `@Sidekick_kr` — Sidekick 한국 커뮤니티. 신규 기능(게스트 마이크) 출시를 스레드로 공개. 개인이 아닌 **제품 계정**형.
- `@GameDevLeone` (레오네) — AI 게임 개발 활동 공유.

### Instagram — 과정 공개형은 사실상 없음

- `@adbr.dev` (안드보라 · 개발자 다보) — 8년차 개발자, 팔로워 1,884. 게시물이 **카드뉴스 캐러셀 위주**로
  개발 과정 로그가 아니라 정체성·브랜딩 콘텐츠다. 2025년 4월 "개발자 다보 잠시 중단" 공지 후 스트리밍
  으로 전환. Threads 계정을 병행 운영한다.
- `@programmers_official`, 부트캠프 계정 등은 기업·교육 계정으로 BiP가 아니다.
- **구조적 이유**: Threads가 Instagram 연동 텍스트 앱이라 ==텍스트 일지는 전부 Threads로 흘러간다.==
  Instagram의 카드뉴스·릴스 포맷은 "진행 중인 과정"보다 "완성된 교훈"에 적합해 BiP와 맞지 않는다.
  같은 사람이 두 플랫폼을 쓸 때 Instagram에는 결론을, Threads에는 과정을 올린다.

### 형식 관찰 — 국내 과정 공유의 5가지 문법

1. **일지형** — 오늘 몇 시간 개발, 심사 대기 중, 힘들었다(감정 포함). `@jiwonnnnieee`
2. **압축 타임라인형** — 여기까지 온 경로를 몇 줄로 압축 + 깨달음. `@steady__study.dev`
3. **도구 스택 공개형** — 무엇으로 만들었는지 목록. `@dong_hun_leee`
4. **수량 지표형** — 개수 × 기간을 앞세운다(30개/40개/28개 앱, 8개월). 매출은 뒤에 오거나 없다.
5. **선공개 데모형** — 만들고 있는 것의 영상을 출시 전에. `@unclejobs.ai`

그리고 **하이아웃풋빌더 챌린지**는 BiP를 운영 규칙으로 명문화했다: ==스레드에 매일 최소 300자 필수,
인스타그램·링크드인·블로그는 선택.== 참가자가 마케터·영어강사·문화기획자·심리분석가 등 **비개발자
다수**라는 점이 중요하다 — 국내 BiP의 유입 경로는 개발자가 아니라 바이브코딩으로 들어온 비개발자다.

## 더 해볼 질문

- 국내 통화가 MRR이 아니라 "개수 × 기간"인 이유는? 매출 공개의 세무·겸업 리스크 회피인가, 아니면
  실제로 공개할 매출이 없어서 활동량으로 대체하는 것인가. `@andytechcan`이 매출은 **남의 사례**로만
  다루는 패턴이 힌트일 수 있다.
- Threads의 500자 제한과 해시태그 부재가 BiP 형식을 어떻게 규정하는가? 긴 회고는 브런치·Velog로
  가고 Threads에는 압축본만 남는 분업이 실제로 일어나는지 확인.
- 일지형(`@jiwonnnnieee`)과 압축형(`@steady__study.dev`) 중 관객 축적에 유리한 쪽은? 전자는 매일
  쌓이지만 개별 글이 약하고, 후자는 드물지만 도달이 크다. 측정 가능한 형태로 비교할 방법.
- 송재경 사례는 **이미 있는 명성을 BiP에 투입한 것**이다. 명성이 없는 상태에서 X를 고르는 것은
  합리적인가 — 국내에서 X는 이미 관객이 있는 사람의 채널이고 Threads가 관객을 만드는 채널인가?
- 계정 탈취 리스크(송재경 2026-07-26)를 감안한 BiP 운영 수칙은? 2FA 외에 공개 자산과 계정을 분리하는
  구조(자체 사이트를 정본으로, SNS는 유입로)가 필요한 것 아닌가 — **이 블로그 구조가 이미 그 답에 가깝다.**
- 비개발자 유입이 주류라면 개발자의 차별점은 무엇인가? `@yozum.vibe`의 리버싱 과정처럼 **바이브코딩으로
  대체 불가능한 깊이**를 공개하는 것이 개발자 BiP의 자리인가?
- 이 블로그에 적용한다면: 매출이 없는 상태에서 공개할 수 있는 지표(스킬 개발 로그, 학습 맵 성장,
  노트 수)가 국내 문법의 "개수 × 기간"과 맞는가? 맞다면 오히려 유리한 조건이다.

## 레퍼런스·서비스

확인일: **2026-07-29**. Threads 게시물 원문은 `threads-fetch`로, X 게시물은 `twitter-cli`로 직접
확인했다(아래 ★ 표시). 나머지는 검색 결과 기반이며 팔로워·매출 수치는 **자기신고이고 교차검증하지
않았다**. 빠른 스캔 수준이므로 깊은 1차 검증은 하지 않았다.

**기원·1차 성격**

- [Buffer Open](https://buffer.com/open) — 2013년부터 재무·급여·지표를 공개해 온 자체 페이지. BiP의 기원. **1차**
- [Marc Köhlbrugge — #buildinpublic](https://marc.io/buildinpublic) — 해시태그를 대중화한 본인의 정리.
  BetaList·WIP 제작자. **1차**
- [Bannerbear Open](https://www.bannerbear.com/open/) — Open Startup 지표를 지금도 공개 중인 실물. **1차**
- [Buffer — The Transparency Movement](https://buffer.com/resources/transparency-movement/) — Buffer의 자기
  회고. Baremetrics가 여기서 영감을 받은 연결이 있다. **1차/2차 혼합**

**국내 — Threads 과정 공개형 (원문 확인)**

- ★ [`@jiwonnnnieee` — 내가 꾸준히 할 수 있었던 이유, 유저들](https://www.threads.com/@jiwonnnnieee/post/DYfxAOxkSNU)
  — 퇴근 후 8개월, 심사 대기, 오늘 7시간 개발. 일지형의 전형. **1차(본인 게시물)**
- ★ [`@steady__study.dev` — AI 타임라인을 압축해봤습니다](https://www.threads.com/@steady__study.dev/post/DbHNDt7E2RO)
  — 하네스 구축부터 병렬 개발의 한계 깨달음, 제품 전환까지. **1차(본인 게시물)**
- ★ [`@dong_hun_leee` — 사이드 프로젝트 30개 만들어 본 개발자가 느낀점](https://www.threads.com/@dong_hun_leee/post/C_Hcs4Tv7rz)
  — 실패 사례를 함께 공개. **1차(본인 게시물)**
- [`@dong_hun_leee` — 사이드 프로젝트 40개 만든 개발자의 툴 정리 ver.2](https://www.threads.com/@dong_hun_leee/post/DMl3JhYSruk)
  — 기획·MMVP·디자인·개발 단계별 도구 전체 공개. **1차**
- ★ [`@andytechcan` — 1인 개발자의 SaaS 2탄](https://www.threads.com/@andytechcan/post/DUg7b_mgUn7)
  — 8개월 28개 앱·월매출 1만불·Flutter+Cursor+Fastlane 스택. **타인 사례 중계**임을 본문이 명시
  ("지난 1년간 50여개 이상 소개"). **1차(게시물) / 내용은 2차**
- [`@yozum.vibe` — RAR 포맷 리버싱 과정](https://www.threads.com/@yozum.vibe/post/DYTnH2TCcBw) — 2주간 코드
  0줄, 갭 문서, Ghidra hex dump. 기술 과정 심층 공개. **1차**
- [`@unclejobs.ai` — 만들고 있는 CLI 제품 데모](https://www.threads.com/@unclejobs.ai/post/DXTxldyif1h) — 출시 전 선공개. **1차**
- [`@programmingzombie` — 바이브코딩 100% iOS 앱 출시 제출](https://www.threads.com/@programmingzombie/post/DMPrbwOz705) **1차**
- [`@seonghoonlee_` — 유튜브 구독자 7000명, 조회수·댓글 반응 공개](https://www.threads.com/@seonghoonlee_/post/DL6KDxNSRn7) **1차**
- [`@curator.danbi` — 3.8만 구독자 맞춤 기능 바이브코딩 개발](https://www.threads.com/@curator.danbi/post/DUcSDjJgXrm) **1차**

**국내 — Threads 커뮤니티·중계·교육형**

- [`@syde.kr` — SYDE 사이드프로젝트 커뮤니티](https://www.threads.com/@syde.kr) — 1,400+ 메이커, inSYDE
  팟캐스트, SYDE Pick 월간 선정. 규모는 커뮤니티 자체 소개 기준. **1차(계정)**
- [SYDE Pick 게시물 예시](https://www.threads.com/@syde.kr/post/DZIHF5QCTV9) — 월간 프로젝트 선정 운영 방식. **1차**
- [`@youtubejocoding` — Product Builder 공개 모집](https://www.threads.com/@youtubejocoding/post/DRRcywhkQ6j) **1차**
- [`@simon.dsgn` — 바이브코딩 수익화 무료 특강 3회 일정](https://www.threads.com/@simon.dsgn/post/DagvT1fEr1q) **1차**
- [`@querydaily.official` — 기록이 디스커버리 채널이 된다](https://www.threads.com/@querydaily.official/post/DXbkZj_D1lT)
  — BiP 논지를 국내 개발자 맥락으로 번역한 글. **1차**
- [`@devdesign.kr` — 비노 · 개발자의디자인](https://www.threads.com/@devdesign.kr) **1차(계정)**

**국내 — X**

- ★ [`@appledelhi` (송재경) — 오픈소스 일인 개발(+AI) MMO 공개](https://x.com/appledelhi/status/2079022142663094356)
  — 2026-07-20, 조회 89.6만·좋아요 3,081·북마크 2,547. 13년 침묵 후 복귀작. **1차(본인 게시물)**
- [OpenMMO 저장소](https://github.com/Julian-adv/OpenMMO) — 위 게시물이 링크한 실제 코드베이스. **1차**
- ★ `@appledelhi` 후속 — agent-client 배포(2026-07-22, 조회 3.8만), Opus 5 사용 후기(07-25), **계정 해킹
  공지(07-26)**. `twitter-cli user-posts`로 확인. **1차**
- [`@Sidekick_kr` — Sidekick 한국 커뮤니티](https://x.com/Sidekick_kr) — 기능 출시 공개형 제품 계정. **1차(계정)**

**국내 — Instagram (부재 근거)**

- [`@adbr.dev` — 안드보라 · 개발자 다보](https://www.instagram.com/adbr.dev/) — 팔로워 1,884, 카드뉴스
  캐러셀 위주. 개발 과정 로그가 아님. **1차(계정)**
- [안드보라, 개발자 다보 잠시 중단 (Medium, 2025-04)](https://medium.com/@dabo.adbr/%EC%95%88%EB%93%9C%EB%B3%B4%EB%9D%BC-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EB%8B%A4%EB%B3%B4-%EC%9E%A0%EC%8B%9C-%EC%A4%91%EB%8B%A8-03cf0bb93306)
  — 활동 중단·전환 공지. 국내 개발자 브랜딩 계정의 지속성 문제 사례. **1차(본인 글)**

**국내 — BiP를 규칙화한 프로그램**

- [하이아웃풋빌더 챌린지 1기](https://blog.highoutputclub.com/highoutputbuilder-challenge-1st/) — **스레드 매일
  최소 300자 필수**, 인스타·링크드인·블로그 선택. 참가자는 마케터·영어강사·문화기획자·심리분석가 등
  비개발자 다수. 국내 BiP를 운영 규칙으로 명문화한 유일한 확인 사례. **1차(주최측 문서)**

**국내 — 플랫폼·커뮤니티 (배경)**

- [디스콰이엇 (disquiet.io)](https://disquiet.io/) — 메이커 소셜 네트워크. 프로덕트 등록 + 메이커로그.
  2025-10-29 릴레잇 인수 보도(1차 미확인). **1차(서비스)**
- [이오플래닛 (eopla.net)](https://eopla.net/) — EO의 창업가 매거진. 1인 개발자 사례 중계 최대 채널. **1차(서비스)**
- [안스LAB — 사이드프로젝트 플랫폼 모음](https://ahnslab.com/sideproject-platform-list/) — 비사이드·렛플·HOLA
  등. 단 이들은 **팀 모집** 플랫폼으로 과정 공개(BiP)와 다른 범주다. **2차**

**해외 대조군**

- [Failory — How to Build in Public (+20 Examples)](https://www.failory.com/blog/building-in-public) — 사례 20건 유형별 정리. **2차**
- [DirectoryGems — TrustMRR 케이스](https://www.directorygems.com/case-study/trustmrr-com) — Pieter Levels의
  "가짜 MRR 스크린샷" 지적(조회 51.8만) 48시간 뒤 Marc Lou가 read-only 빌링 키 검증 서비스를 낸 사례.
  국내에 MRR 통화가 없다는 관찰과 대조하면 선명하다. **2차**
- [The golden era of being an open startup is gone](https://testimonial.to/resources/the-golden-era-of-being-an-open-startup-is-gone) — 반대 논지. **2차**

**방법상 한계**

- `twitter-cli`의 `search` 엔드포인트가 HTTP 404를 반환해 **X 한국어권 키워드 스윕은 하지 못했다**
  (`tweet`·`user-posts`는 정상). X 사례는 웹 검색으로 발견한 계정을 개별 확인한 것이라 누락이 있을 수 있다.
- Threads는 계정 프로필 단위 팔로워·게시 빈도를 수집하지 못했다(공개 페이지 payload 제한). 계정별
  **지속성 판단이 게시물 표본 기준**이라는 한계가 있다.
- Instagram "부재"는 검색·계정 표본 기준의 결론이다. 해시태그 내부 탐색은 하지 않았으므로 소규모
  일지 계정이 존재할 가능성은 남아 있다.
