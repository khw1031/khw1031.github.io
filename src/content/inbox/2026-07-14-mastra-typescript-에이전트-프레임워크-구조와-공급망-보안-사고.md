---
title: 'Mastra: TypeScript 에이전트 프레임워크의 Agent·Workflow·Memory·RAG 구조'
pubDate: '2026-07-14T20:39:12+09:00'
description: 'Agent·Workflow·Memory·RAG를 통합한 TypeScript 에이전트 프레임워크 Mastra의 구조와 2026년 6월 npm 공급망 공격 전말.'
summary: 'Mastra는 Agent·Workflow·Memory·RAG를 하나의 TypeScript 프레임워크로 묶어 프로덕션급 AI 에이전트를 만들 수 있게 하며 빠르게 성장했다. 다만 2026년 6월 메인테이너 피싱발 npm 공급망 공격을 겪었고, 팀의 대응과 공개 포스트모템까지 함께 확인할 가치가 있다.'
lang: ko
tags:
  - 'ai'
  - 'llm'
  - 'typescript'
  - 'open-source'
  - 'workflow'
canonical: 'https://mastra.ai/docs'
lintHash: '4a022a486dd0'
polishHash: '4a022a486dd0'
---

## TL;DR
- ==Mastra는 TypeScript 네이티브로 Agent·Workflow·Memory·RAG·Tool을 한 프레임워크에 통합한 AI 에이전트 빌딩 도구==로, "Rails for AI agents"를 표방한다.
- 2026년 4월 Spark Capital 주도 $22M 시리즈 A(누적 $35M)를 유치했고, GitHub 26,000+ 스타·주간 30만+ npm 다운로드로 Replit·PayPal·Brex 등에 채택되었다(회사명은 법인 Kepler Software, Inc.).
- **(채택 전 리스크 확인, 2026-07-14 확인 시점)** 2026년 6월 16~17일 메인테이너 계정이 피싱으로 탈취되어 140여 개 `@mastra/*` 패키지에 악성 postinstall 스크립트가 배포되는 npm 공급망 공격을 겪었다(마이크로소프트는 북한 배후 Sapphire Sleet로 귀속). 팀은 약 12시간 내 전량 대응하고 원인·타임라인을 공개했다 — inbox 승격 시 이 항목은 최신 상태로 재확인 필요.

## 큰 그림
```
Mastra (TypeScript AI 프레임워크, Kepler Software Inc., 2024.08~)
│
├─ Core primitives
│   ├─ Agent    — LLM + tools로 개방형(open-ended) 작업 수행 (.generate()/.stream())
│   ├─ Tool     — createTool(): id + Zod 입력 스키마 + execute()
│   ├─ Workflow — createStep().then().commit(): 결정적 다단계 제어 흐름
│   └─ Memory   — 메시지 히스토리 · semantic recall · working/observational memory
│
├─ Capabilities
│   ├─ RAG        — chunking → embedding → vector DB(pgvector/Pinecone/Qdrant/Mongo) → retrieval
│   ├─ Voice      — STT/TTS/실시간 음성
│   ├─ Workspaces — 파일시스템 · 샌드박스 · 스킬 검색/색인
│   └─ Channels   — Slack/Teams/Discord/Telegram/WhatsApp 연동
│
├─ Production
│   ├─ Server        — Express/Hono/NestJS 어댑터, 미들웨어, PubSub
│   ├─ Studio        — 에이전트 빌더 · 평가 · 로그 · 추적 (클라우드/셀프호스팅)
│   ├─ Evals         — 내장 스코어러 + 데이터셋 실험 + CI 통합
│   ├─ Observability — OpenTelemetry/Datadog 연동
│   └─ Deployment    — Vercel/Cloudflare Workers/Netlify/AWS 등 서버리스 우선
│
└─ Model Router — "provider/model" 문자열로 LLM 지정 (예: openai/gpt-5.5)
```

## 핵심
- ==Agent는 "단계가 미리 알려지지 않은 개방형 작업"에, Workflow는 "명확한 제어 흐름이 있는 사전 정의된 멀티스텝 프로세스"에 쓰도록 문서가 명시적으로 경계를 나눈다== — LLM 추론에 맡길지, 개발자가 순서를 통제할지의 선택 기준이다.
- Workflow는 Agent의 상위 개념으로 설계되어 있다: step 안에서 등록된 agent를 호출하거나 tool을 직접 실행할 수 있고, 반대로 workflow 자체를 agent의 한 step으로 내장할 수도 있다(양방향 합성).
- Memory는 메시지 히스토리 외에 **working memory**(이름·선호·목표 같은 지속 구조화 데이터)와 **observational memory**(배경 에이전트가 긴 대화를 압축 로그로 변환)를 구분해, 순수 벡터 검색(semantic recall)과는 다른 축의 컨텍스트 관리를 제공한다.
- RAG는 recursive/sliding-window chunking과 pgvector·Pinecone·Qdrant·MongoDB 등 여러 vector DB를 지원한다고 문서가 밝히지만, 공식 RAG 개요 페이지에는 GraphRAG 언급이 없다(별도 페이지에서만 다룰 가능성, 미확인).
- Model Router가 `provider/model` 문자열(`openai/gpt-5.5` 등)로 모델을 지정하게 해, provider별 SDK 세부 파라미터를 상위 Agent 코드에서 감춘다 — 코드베이스의 "경계 객체" 패턴과 같은 방향.
- ==2026년 6월 사고는 프레임워크 설계 결함이 아니라 **메인테이너 개인 계정의 소셜 피싱**(LinkedIn을 통한 접근)이 원인이었다고 팀이 공식 인정했다.== 사고 후 NPM 토큰 MFA 우회를 전면 제거하는 등 재발 방지 조치를 취했다.

## 깊이
- **[Agent]** — `new Agent({ id, name, instructions, model })`으로 정의하고 Mastra 인스턴스에 등록하면 앱 전역에서 쓸 수 있다. `.generate()`는 도구 호출·단계가 모두 끝난 뒤 `text`/`toolCalls`/`toolResults`를 포함한 완결된 결과를 반환하고, `.stream()`은 `textStream`으로 토큰 단위 증분 출력을 준다. 멀티에이전트는 "다른 agent를 tool로 등록"하는 네트워크 방식과, 여러 전문 에이전트를 조율하는 Supervisor Agent 패턴 두 갈래로 문서화되어 있다.
- **[Workflow]** — `createStep({ id, inputSchema, outputSchema, execute })`로 개별 단계를 정의하고 `.then()`으로 체이닝, `.commit()`으로 확정한다. 실행 상태는 `success`/`failed`/`suspended`/`tripwire`/`paused` 중 하나이며, **suspend/resume**(중단 후 재개)과 **time travel**(완료된 실행의 특정 단계만 재시뮬레이션)이 1급 기능으로 지원된다. `.start()`는 최종 결과만, `.stream()`은 실행 중 이벤트를 실시간으로 내보낸다.
- **[Memory]** — `resource`(사용자/엔티티 식별자)와 `thread`(대화 세션 ID) 두 축으로 메시지를 관리한다. quickstart는 저장소 예시로 `@mastra/libsql`을 쓰지만, "하나 이상의 구성된 storage provider"에 저장된다고만 명시해 다른 백엔드로 교체 가능함을 시사한다(구체 목록은 별도 storage 문서, 이번 조사에서 미열람).
- **[license·회사]** — GitHub 저장소 라이선스는 GitHub API 상 `NOASSERTION`으로 뜨지만, `LICENSE.md` 원문을 직접 읽으면 "`ee/` 디렉터리 하위 전부는 별도 Enterprise License, 그 외 전부는 Apache License 2.0"이라는 이중 구조가 명확하다. 저작권 표기 법인명은 **Kepler Software, Inc.**(2025)로, "Mastra"는 프로덕트명이다.
- **[npm 공급망 공격 타임라인]** — 2026-06-16 19:05 KST경 `easy-day-js@1.11.21`(정상 dayjs 복제, 페이로드 없음) 공개 → 6-17 새벽 `1.11.22`에 난독화된 `setup.cjs` postinstall 훅 추가 → 같은 시각 탈취된 메인테이너 계정으로 `@mastra/core`·`memory`·`loggers`·`deployer`·`client-js` 등 116개(팀 공식 수치, 매체별로 140~145개로 다르게 보도) 패키지가 `easy-day-js: ^1.11.21`을 의존성으로 포함해 재배포. 팀은 발견 후 약 12시간 내 전량 unpublish/deprecate하고, 새 안전 버전을 배포했으며, npm 계정 MFA 우회(token bypass)를 제거했다.
- **[공식 원인 설명]** — 팀의 공개 포스트모템(GitHub #18061)에 따르면, 현직 직원인 메인테이너가 다른 유명 TypeScript 오픈소스 메인테이너들과 동일한 수법(탈취된 LinkedIn 계정의 접근 → 통화 중 의심스러운 링크 클릭)으로 개인 머신이 손상되었다. Microsoft는 이 공격의 인프라·수법이 북한 국가 배후 행위자 **Sapphire Sleet**의 기존 활동과 일치한다고 결론지었다(암호화폐 지갑 자격증명 탈취 목적, 가짜 IE8 User-Agent 등 TTP 일치).

## 용어 풀이
- **Agent vs Workflow** — Agent는 LLM이 스스로 도구 사용 순서를 정하는 개방형 실행, Workflow는 개발자가 단계·순서·데이터 흐름을 미리 고정하는 결정적 실행. / 비유: Agent는 "목적지만 알려주고 알아서 찾아가는 택시 기사", Workflow는 "정해진 노선을 도는 버스". / 비유가 깨지는 점: 실제로는 Workflow의 한 정류장(step)에 Agent를 태울 수 있어 완전히 분리되지 않는다.
- **Semantic Recall vs Working Memory vs Observational Memory** — 순서대로 "의미 기반 과거 메시지 검색", "이름·선호 같은 지속 구조화 사실 저장", "긴 대화를 압축 로그로 요약해 컨텍스트 창을 절약". 세 축은 서로 대체재가 아니라 보완재다.
- **Model Router** — `"openai/gpt-5.5"`처럼 provider/model을 문자열 하나로 지정해, provider별 SDK 파라미터 차이를 Agent 코드에서 숨기는 어댑터 계층.
- **Sapphire Sleet** — Microsoft가 명명한 북한 연계 국가 배후 해킹 그룹으로, 개발자·오픈소스 메인테이너 대상 소셜 피싱을 통해 암호화폐·자격증명을 노려온 것으로 2020년부터 추적되어 왔다(Microsoft 공식 블로그 표현).

## 시각 자료
| 축 | Mastra의 선택 | 비교 대상(2차 출처 요약) |
|---|---|---|
| 언어/런타임 | TypeScript, Node.js 22.18.0+ | LangChain은 Python 우선, JS 포트는 후행 |
| 오케스트레이션 | Agent + Workflow(결정적 제어) 내장 | Vercel AI SDK는 오케스트레이션 없는 스트리밍 UI 레이어 |
| 메모리 | Semantic recall + working + observational memory 내장 | 다수 프레임워크는 메모리 구현을 사용자에게 위임("manual") |
| 배포 | Vercel/Cloudflare Workers/Netlify 서버리스 우선, Express/Hono/Fastify 셀프호스팅 | — |
| 라이선스 | Apache-2.0(핵심) + `ee/` 하위 Enterprise License | — |

## 핵심 시사점 / 판단
- **(원문 확인)** Mastra의 핵심 차별점은 "Agent/Workflow/Memory/RAG를 별도 라이브러리 조합 없이 한 프레임워크로 묶었다"는 통합성이며, 이는 공식 문서 구조(Core Agents/Workflows/Memory가 나란히 1급 문서로 존재) 자체가 뒷받침한다.
- **(2차 출처·판단 필요)** "LangGraph TS 대비 동일 에이전트를 41시간→18시간에 재구현했다"는 식의 생산성 비교 수치는 서드파티 벤치마크로, 원문 방법론이 공개되지 않아 그대로 신뢰하기보다는 참고 정도로 취급해야 한다.
- **(1차 확인·경계, 2026-07-14 시점 — 승격 시 최신 상태 재확인)** 2026년 6월 공급망 사고는 코드 결함이 아니라 **사람(메인테이너) 대상 소셜 엔지니어링**이 원인이었다는 점에서, "오픈소스 프레임워크 채택 리스크"가 코드 감사만으로는 막히지 않는다는 일반 교훈을 준다. 채택 시 `--ignore-scripts` 기본화, lockfile 고정, 의존성 업데이트 봇의 자동 병합 지양 같은 방어가 프레임워크 선택과 별개로 필요하다.
- **(경계)** 사고 자체는 팀이 투명하게 공개(GitHub #18061)하고 12시간 내 대응했다는 점에서 오히려 사후 대응 신뢰도의 근거로 볼 여지도 있으나, "이미 한 번 개인 계정이 뚫렸다"는 사실 자체는 향후 채택 판단에서 별개로 가중치를 둘 사안이다.

## 레퍼런스
- Mastra 공식 문서(Docs) — https://mastra.ai/docs · (1차) · 이번 조사의 출발점, 설치·에이전트 기초.
- Mastra 문서 전체 인덱스(llms.txt) — https://mastra.ai/llms.txt · (1차) · 전 섹션 구조 확인.
- Workflows 개요 — https://mastra.ai/docs/workflows/overview · (1차) · step/suspend-resume/time travel.
- Memory 개요 — https://mastra.ai/docs/memory/overview · (1차) · semantic recall/working/observational memory.
- RAG 개요 — https://mastra.ai/docs/rag/overview · (1차) · chunking/vector DB/retrieval.
- Agents 개요 — https://mastra.ai/docs/agents/overview · (1차) · generate/stream, multi-agent 패턴.
- GitHub - mastra-ai/mastra — https://github.com/mastra-ai/mastra · (1차) · 소스, 스타 26,000+(확인일 기준), pushed 2026-07-14.
- LICENSE.md — https://github.com/mastra-ai/mastra/blob/main/LICENSE.md · (1차) · Apache-2.0 + `ee/` 이중 라이선스 원문.
- Mastra Blog: 시리즈 A 발표 — https://mastra.ai/blog/series-a · (1차) · $22M 시리즈 A(누적 $35M), Studio/Server/Memory Gateway 공개.
- Microsoft Security Blog: Mastra npm 공급망 침해 분석 — https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/ · (1차, MS 공식) · 공격 기법·Sapphire Sleet 귀속 근거.
- GitHub Issue #18048(최초 신고) — https://github.com/mastra-ai/mastra/issues/18048 · (1차) · 커뮤니티의 실시간 발견·검증 스레드.
- GitHub Issue #18061(공식 사고 보고서) — https://github.com/mastra-ai/mastra/issues/18061 · (1차) · Mastra 팀의 원인·타임라인·조치 공개 포스트모템.

## 확인 질문
- Q1(전이): Workflow-as-Step / Agent-as-Tool의 양방향 합성이 실제로 LangGraph의 subgraph 패턴과 표현력이 동등한가, 아니면 동적 분기·조건부 재귀 같은 특정 제어 흐름에서 한계가 있는가?
- Q2(왜·어떻게): Observational Memory가 몇 토큰 시점에 압축을 트리거하는지, 압축 알고리즘이 무엇인지 공식 문서(이번에 열람한 Memory 개요)에는 구체 수치가 없었다 — 별도 레퍼런스 문서에 있는지 확인 필요.
- Q3(경계): 이번 npm 공급망 공격 이후 Mastra가 "토큰 MFA 우회 제거"로 대응했다는데, 이것이 재발 방지에 구조적으로 충분한가, 아니면 여전히 개별 메인테이너의 소셜 엔지니어링 내성에 의존하는 잔여 리스크가 남는가?

> 출처: https://mastra.ai/docs
