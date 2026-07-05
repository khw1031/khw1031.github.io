---
title: 'AI 코딩 에이전트를 위한 마케팅 스킬 모음: marketingskills 프로젝트 분석'
pubDate: '2026-07-05'
description: 'Claude Code 등 AI 에이전트에 마케팅 전문 워크플로를 주입하는 오픈소스 스킬 모음 프로젝트의 구조와 활용법.'
summary: 'marketingskills는 45개 이상의 마케팅 전문 markdown 스킬을 AI 코딩 에이전트에 삽입하여 CRO·SEO·카피라이팅 등의 작업을 체계화하는 오픈소스 프로젝트다. 이 리포트는 스킬 간 의존 구조와 설치 방식, 핵심 카테고리 체계를 정리한다.'
lang: ko
tags:
  - 'open-source'
  - 'agentic-coding'
  - 'workflow'
  - 'marketing'
canonical: 'https://github.com/coreyhaines31/marketingskills'
lintHash: '89c68fea0d70'
---

## TL;DR
- markdown 파일로 정의된 45개 이상의 마케팅 전문 스킬을 AI 코딩 에이전트(Claude Code, Cursor 등)에 주입하면, 마케팅 작업 시 자동으로 해당 프레임워크와 모범 사례를 적용할 수 있다.

## 큰 그림

```
                    ┌─────────────────────────────┐
                    │     product-marketing        │
                    │  (모든 스킬의 기반 컨텍스트)    │
                    └──────────────┬──────────────┘
                                   │ 모든 스킬이 먼저 읽음
       ┌─────────┬─────────┬───────┼───────┬──────────┬──────────┐
       ▼         ▼         ▼       ▼       ▼          ▼          ▼
   ┌───────┐ ┌───────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌───────┐ ┌───────┐
   │SEO &  │ │ CRO   │ │Copy &│ │Paid &│ │Growth│ │Sales &│ │Strategy│
   │Content│ │       │ │ Copy │ │Measure│ │Retain│ │  GTM  │ │       │
   └───┬───┘ └───┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └───┬───┘ └───┬───┘
       │         │        │       │        │         │         │
       └─────────┴────┬───┴───────┴────────┴─────────┴─────────┘
                      │
            스킬 간 상호 참조 (cross-reference)
            예: copywriting ↔ cro ↔ ab-testing
                revops ↔ sales-enablement ↔ cold-email

    설치 경로 (6가지 옵션)
    ├─ npx skills add  (권장)
    ├─ Claude Code /plugin
    ├─ git clone + 수동 복사
    ├─ git submodule
    ├─ fork + 커스터마이즈
    └─ SkillKit (멀티 에이전트)
```

## 핵심

marketingskills 프로젝트는 **마케팅 업무를 markdown 파일 형태의 "스킬"로 구조화**하여 AI 코딩 에이전트에 주입하는 오픈소스 모음집이다. 저자 Corey Haines의 **주장**에 따르면, 에이전트가 마케팅 작업을 인식하면 자동으로 해당 프레임워크와 모범 사례를 적용하게 된다.

모든 스킬의 **기반은 `product-marketing`** 스킬이다. 이 스킬은 제품·타겟 고객·포지셔닝 정보를 담고 있으며, 다른 모든 스킬이 실행 전에 이 파일을 먼저 읽도록 설계되어 있다. 이는 각 스킬이 독립적으로 작동하는 것이 아니라 **공유 컨텍스트 위에서 상호 참조**된다는 의미다. 예를 들어 `copywriting` 스킬은 `cro`(전환 최적화) 스킬과, `revops`는 `sales-enablement` 및 `cold-email`과 서로 연결된다.

스킬은 9개 대분류(Conversion Optimization, Content & Copy, SEO & Discovery, Paid & Distribution, Measurement & Testing, Retention, Growth Engineering, Strategy & Monetization, Sales & RevOps) 아래 45개 이상으로 구성되며, [Agent Skills spec](https://agentskills.io/)을 지원하는 모든 에이전트(Claude Code, OpenAI Codex, Cursor, Windsurf 등)에서 동작한다고 **주장**된다.

## 깊이

- **[구조-product-marketing 기반]** `product-marketing`은 제품의 정체성·청중·포지셔닝을 정의한 컨텍스트 문서다. v2.0에서 파일 위치가 `.claude/`에서 `.agents/`로 이동하고 이름도 `product-marketing-context.md` → `product-marketing.md`로 단축되었다. 기존 경로·파일명도 fallback으로 지원하므로 마이그레이션 없이도 동작한다.

- **[구조-v2.0 개편]** 17개 스킬이 이름이 변경되었고, `page-cro`와 `form-cro`가 하나의 `cro`로 통합되었다. 구버전 폴더가 남아있으면 혼동될 수 있으므로 수동 삭제가 필요하다. 예: `ab-test-setup` → `ab-testing`, `paid-ads` → `ads`, `signup-flow-cro` → `signup`.

- **[활용-설치 유연성]** 6가지 설치 옵션을 제공하는데, `npx skills`(Vercel Labs 도구)가 권장되며 `.agents/skills/`에 설치 후 `.claude/skills/`로 심볼릭 링크를 생성한다. SkillKit을 쓰면 Claude Code 외에도 Cursor, Copilot 등 여러 에이전트에 동시에 설치 가능하다. **멀티 에이전트 호환성은 Agent Skills spec 표준 덕분**(저자 주장).

- **[범주-SEO의 AI 확장]** `ai-seo` 스킬은 기존 SEO와 별개로 AEO(Answer Engine Optimization), GEO(Generative Engine Optimization), LLMO(LLM Optimization)를 다룬다. 이는 검색 엔진뿐 아니라 **AI가 생성하는 답변에 인용되는 것**을 최적화 목표로 삼는다.

- **[호환-에이전트 폭]** Claude Code, OpenAI Codex, Cursor, Windsurf를 명시적으로 지원한다고 기재되어 있으나, 각 에이전트 버전별 실제 동작 여부는 **원문에 검증 데이터 없음**(불확실).

## 용어 풀이

- **Skill** — AI 에이전트에 특정 도메인 지식과 워크플로를 주입하는 markdown 파일. 비유: 에이전트에게 씌우는 "직무 매뉴얼". 비유가 깨지는 지점: 실제 매뉴얼은 사람이 읽고 해석하지만, Skill은 에이전트가 프롬프트 컨텍스트로 자동 흡수한다.

- **CRO (Conversion Rate Optimization)** — 방문자가 원하는 행동(가입·구매 등)을 할 비율을 높이는 작업. 비유: 매장에서 손님이 물건을 사도록 동선·진열을 바꾸는 것. 비유가 깨지는 지점: 웹 CRO는 데이터 기반 실험(A/B 테스트)이 필수지만, 오프라인 매장은 직관 위주로 운영되기도 한다.

- **AEO/GEO/LLMO** — 각각 Answer Engine·Generative Engine·LLM에 최적화하는 SEO 확장 개념. 비유: 구글 검색결과 1위가 아니라, ChatGPT 답변에 우리 제품이 "추천"되도록 만드는 것. 비유가 깨지는 지점: AEO는 인용 자체가 끝(종점)일 수 있어 클릭 없이 브랜드 노출만 일어나기도 한다.

- **Agent Skills spec** — agentskills.io에서 정의한 스킬 포맷 표준. 비유: USB 규격 — 규격에 맞으면 어떤 기기(에이전트)에든 꽂을 수 있다. 비유가 깨지는 지점: 실제 호환성은 에이전트 구현체에 따라 다를 수 있다.

- **product-marketing (컨텍스트 파일)** — 모든 스킬이 참조하는 제품 정보의 단일 출처(Single Source of Truth). 비유: 회사 위키의 "우리 제품 개요" 페이지. 비유가 깨지는 지점: 위키는 사람이 관리하지만, 이 파일은 마크다운으로 커밋되어 버전 관리된다.

## 시각 자료

| 카테고리 | 포함 스킬 (예시) | 핵심 역할 |
|---|---|---|
| Conversion Optimization | cro, signup, onboarding, popups, paywalls | 전환율 개선 |
| Content & Copy | copywriting, copy-editing, emails, cold-email, social, image | 콘텐츠 제작 |
| SEO & Discovery | seo-audit, ai-seo, programmatic-seo, schema, site-architecture | 발견 가능성 |
| Paid & Distribution | ads, ad-creative, social | 유료 배포 |
| Measurement & Testing | analytics, ab-testing | 측정·실험 |
| Retention | churn-prevention | 이탈 방지 |
| Growth Engineering | co-marketing, free-tools, referrals | 성장 루프 |
| Strategy & Monetization | marketing-ideas, marketing-psychology, launch, pricing | 전략·수익화 |
| Sales & RevOps | revops, sales-enablement | 영업 연계 |

**v2.0 주요 이름 변경 매핑 (일부)**

| 구(v1.x) | 신(v2.0) | 변경 유형 |
|---|---|---|
| `page-cro` + `form-cro` | `cro` | 통합 |
| `paid-ads` | `ads` | 단순화 |
| `product-marketing-context` | `product-marketing` | 단축 |
| `ab-test-setup` | `ab-testing` | 일관성 |
| `signup-flow-cro` | `signup` | 단순화 |

## 핵심 시사점 / 판단

- **(저자 주장)** 마케팅 업무도 코드처럼 구조화된 스킬로拆解하면 AI 에이전트가 일관된 품질로 수행할 수 있다.
- **(저자 주장)** `product-marketing`을 공통 기반으로 두면 스킬 간 컨텍스트 충돌 없이 협업이 가능하다.
- **(저자 주장)** Agent Skills spec 덕분에 Claude Code 외 여러 에이전트에서 동일 스킬을 재사용할 수 있다.
- **(검증 필요·불확실)** 45개 이상의 스킬이 실제 마케팅 업무에서 어느 정도 정확도와 실용성을 보이는지에 대한 정량 데이터는 원문에 없다.
- **(검증 필요·불확실)** AI가 생성한 마케팅 카피·전략의 품질이 인간 전문가 수준에 근접하는지는 별도 평가가 필요하다.
- **(원문에 없음)** 각 스킬의 실제 markdown 내부 구조·프롬프트 패턴은 README에서 공개되지 않았다.

## 레퍼런스

- marketingskills GitHub 저장소 — https://github.com/coreyhaines31/marketingskills · (1차) · Corey Haines가 제작한 AI 에이전트용 마케팅 스킬 오픈소스 모음.
- Agent Skills spec — https://agentskills.io/ · (1차) · AI 에이전트 스킬 포맷 표준 사양서.
- npx skills (Vercel Labs) — https://github.com/vercel-labs/skills · (1차) · 스킬 설치 CLI 도구.
- SkillKit — https://github.com/rohitg00/skillkit · (2차) · 멀티 에이전트 스킬 설치 도구.
- Coding for Marketers (동반 가이드) — https://codingformarketers.com/ · (2차) · 마케터向け 터미널·코딩 에이전트 입문서.
- Conversion Factory — https://conversionfactory.co/ · (2차) · Corey Haines의 전환 최적화 에이전시.

## 확인 질문

- Q1(전이): 이 스킬들을 비마케팅 도메인(예: 고객 지원, HR)에도 같은 구조로 확장할 수 있을까? Agent Skills spec이 이를 허용하는가?
- Q2(왜·어떻게): `product-marketing`이 모든 스킬의 선행 조건이라면, 제품이 아직 초기 단계(포지셔닝 미확정)일 때 스킬들이 제대로 작동하는가?
- Q3(경계): AI가 생성한 카피·SEO 전략·광고 크리에이티브의 법적·윤리적 책임은 누구에게 있는가? 스킬은 이를 가이드하는가?

> 출처: https://github.com/coreyhaines31/marketingskills
