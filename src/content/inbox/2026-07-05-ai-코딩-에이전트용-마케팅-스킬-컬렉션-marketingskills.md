---
title: 'AI 코딩 에이전트용 마케팅 스킬 컬렉션 — marketingskills'
pubDate: '2026-07-05T00:22:47+09:00'
description: 'Claude Code 등 AI 코딩 에이전트에 CRO, SEO, 카피라이팅 등 마케팅 전문 스킬을 추가하는 오픈소스 markdown 컬렉션'
summary: 'marketingskills의 아키텍처, 설치법, 사용법, 카테고리 체계, v2 마이그레이션을 정리한 학습 노트로, AI 에이전트에 마케팅 스킬을 도입하는 전 과정을 파악할 수 있다.'
lang: ko
tags:
  - 'agentic-coding'
  - 'prompting'
  - 'open-source'
  - 'workflow'
canonical: 'https://github.com/coreyhaines31/marketingskills'
lintHash: '6cc0887bf3a0'
polishHash: '6cc0887bf3a0'
---

> 한 줄 명제: marketingskills는 product-marketing을 루트로 하는 markdown 스킬 트리이며, AI 코딩 에이전트가 마케팅 작업을 인식하고 전문 프레임워크를 적용하도록 만든다.

## 큰 그림

```text
marketingskills — AI 에이전트 마케팅 스킬 컬렉션 (v2.0)
├─ 아키텍처: product-marketing 루트 → 모든 스킬이 맥락 먼저 참조 → 스킬 간 상호 참조 체인
├─ 설치: CLI(npx skills) 권장 / 플러그인 / clone / submodule / fork / SkillKit — 6가지 경로
├─ 사용법: 자연어 요청 → 자동 매칭 또는 /슬래시 커맨드 직접 호출
├─ 카테고리: CRO · Content · SEO · Paid · Measurement · Retention · Growth · Strategy · Sales (9분류)
└─ 마이그레이션: v1→v2 스킬명 17개 변경 · page-cro+form-cro 통합 · 맥락 파일 경로 이동
```

## 핵심

marketingskills는 AI 코딩 에이전트(Claude Code, OpenAI Codex, Cursor, Windsurf 등)가 마케팅 업무를 수행할 때 전문 프레임워크와 베스트 프랙티스를 적용할 수 있도록 하는 markdown 파일 컬렉션이다. Agent Skills spec(agentskills.io)을 따르는 모든 에이전트와 호환되며, 각 스킬은 독립적인 markdown 파일로 프로젝트의 `.agents/skills/` 디렉토리에 설치된다. 설치 후 에이전트는 사용자가 마케팅 관련 작업을 요청하면 해당하는 스킬을 자동으로 로드하여 적용한다.

전체 아키텍처의 중심에는 `product-marketing` 스킬이 위치한다. 이 스킬은 제품·청중·포지셔닝에 대한 맥락 문서 역할을 하며, ==다른 모든 스킬이 실제 작업을 시작하기 전에 가장 먼저 참조하는 기반이 된다.== 예를 들어 `cro` 스킬이 전환 최적화 작업을 수행할 때도, `copywriting` 스킬이 홈페이지 카피를 작성할 때도, 각 스킬은 먼저 `product-marketing`의 맥락을 읽은 뒤 자신만의 전문 프레임워크를 적용한다. 스킬들은 서로 상호 참조하기도 하는데, `copywriting ↔ cro ↔ ab-testing` 체인이나 `seo-audit ↔ schema ↔ ai-seo` 체인처럼 연관된 스킬들이 협력 네트워크를 형성한다.

설치 방법은 총 6가지를 제공한다. 권장 방식은 Vercel Labs의 `npx skills` CLI를 사용하는 것이며, 이 방식은 `.agents/skills/` 디렉토리에 자동 설치하고 Claude Code 호환을 위해 `.claude/skills/`에 심볼릭 링크를 생성한다. 그 외에 Claude Code 내장 플러그인 시스템, git clone 후 수동 복사, git submodule, fork 후 커스터마이징, SkillKit을 이용한 멀티 에이전트 설치 방식을 지원한다.

사용법은 두 가지 경로가 있다. 첫 번째는 에이전트에게 자연어로 마케팅 작업을 요청하면 에이전트가 적절한 스킬을 자동으로 매칭하는 방식이다. 두 번째는 `/cro`, `/emails`, `/seo-audit` 같은 슬래시 커맨드로 특정 스킬을 직접 호출하는 방식이다.

전체 스킬은 9개 카테고리(전환 최적화, 콘텐츠·카피, SEO·디스커버리, 유료 광고·배포, 측정·테스트, 리텐션, 성장 엔지니어링, 전략·수익화, 세일즈·RevOps)로 분류되며 총 40개 이상의 스킬이 포함되어 있다.

v2.0에서는 17개 스킬의 이름이 변경되었고, `page-cro`와 `form-cro`가 단일 `cro` 스킬로 통합되었으며, product-marketing 맥락 파일의 저장 경로가 `.claude/`에서 `.agents/`로 이동했다.

(원문 예제 — 파이프라인 미검증)
```bash
# Install all skills
npx skills add coreyhaines31/marketingskills

# Install specific skills
npx skills add coreyhaines31/marketingskills --skill cro copywriting

# List available skills
npx skills add coreyhaines31/marketingskills --list
```

(원문 예제 — 파이프라인 미검증)
```
"Help me optimize this landing page for conversions"
→ Uses cro skill

"Write homepage copy for my SaaS"
→ Uses copywriting skill

"Set up GA4 tracking for signups"
→ Uses analytics skill

"Create a 5-email welcome sequence"
→ Uses emails skill
```

(원문 예제 — 파이프라인 미검증)
```
/cro
/emails
/seo-audit
```

## 깊이

**[아키텍처]** ⭐
`product-marketing` 스킬은 모든 다른 스킬의 진입점에서 가장 먼저 읽히는 맥락 문서다. 각 스킬은 자신의 markdown 파일 내에 "Related Skills" 섹션을 포함하고 있어, 연관 스킬들과의 의존성 맵을 명시적으로 선언한다. 예를 들어 `customer-research` 스킬은 `copywriting`, `cro`, `competitors` 스킬에 입력을 제공하는 상류 노드 역할을 하며, `revops ↔ sales-enablement ↔ cold-email` 체인은 세일즈 파이프라인 전반을 커버한다. 이 설계 덕분에 사용자의 제품 정보를 한 번만 `product-marketing`에 입력하면 모든 스킬이 일관된 맥락으로 작동한다.

**[설치]** ⭐
권장 CLI 방식(`npx skills add`)은 `.agents/skills/` 디렉토리에 스킬을 배치하고 `.claude/skills/`에 심볼릭 링크를 만들어 Claude Code 호환성을 확보한다. Claude Code 플러그인 방식(`/plugin marketplace add`)은 Claude Code 사용자 전용 경로이며, SkillKit(`npx skillkit install`)은 Cursor·Copilot 등 복수 에이전트를 동시에 사용하는 환경에 적합하다. Git submodule 방식은 업데이트를 `git pull`로 관리하고 싶은 경우에, fork 방식은 스킬을 자체 커스터마이징하려는 경우에 사용한다. 모든 방식의 결과물은 프로젝트 루트 아래 `.agents/skills/` 디렉토리 내의 markdown 파일들이다.

**[사용법]** ⭐
에이전트에게 자연어로 요청하면 스킬이 자동으로 선택된다. "Help me optimize this landing page for conversions"라고 요청하면 `cro` 스킬이, "Set up GA4 tracking for signups"라고 요청하면 `analytics` 스킬이 활성화된다. 명시적 제어가 필요하면 `/cro`, `/emails` 등 슬래시 커맨드로 특정 스킬을 직접 호출할 수 있다. 스킬이 작동하기 위해서는 사전에 `product-marketing` 맥락 문서가 작성되어 있어야 하며, 에이전트는 이 문서를 기반으로 제품·청중·포지셔닝 정보를 참조한 뒤 각 스킬의 전문 프레임워크를 적용한다.

**[카테고리]** 📎
9개 카테고리에 40개 이상의 스킬이 분포한다. 전환 최적화(cro, signup, onboarding, popups, paywalls), 콘텐츠·카피(copywriting, copy-editing, cold-email, emails, social, image, sms, video), SEO·디스커버리(seo-audit, ai-seo, programmatic-seo, site-architecture, competitors, schema, content-strategy, aso), 유료 광고·배포(ads, ad-creative), 측정·테스트(analytics, ab-testing), 리텐션(churn-prevention), 성장 엔지니어링(referrals, free-tools, community-marketing, co-marketing, lead-magnets, marketing-loops), 전략·수익화(marketing-ideas, marketing-psychology, launch, pricing, offers, marketing-plan), 세일즈·RevOps(revops, sales-enablement, competitors, competitor-profiling, directory-submissions, prospecting, public-relations)로 나뉜다. 세부 스킬 목록은 필요시 GitHub README를 참조하면 된다.

**[마이그레이션]** ⭐
v1.x에서 v2.0으로 업그레이드할 때 수행해야 할 작업은 세 가지다. 첫째, 구 이름 폴더를 삭제해야 한다. 새 스킬이 옛 이름 폴더와 공존하기 때문에 `rm -rf`로 17개 구 폴더를 정리해야 중복을 방지할 수 있다. 둘째, 새 이름으로 재설치한다. 셋째, product-marketing 맥락 파일을 `.claude/product-marketing-context.md`에서 `.agents/product-marketing.md`로 이동한다. 원문에 따르면 스킬들은 여전히 `.claude/` 경로와 레거시 파일명을 폴백으로 확인하므로, 마이그레이션을 즉시 수행하지 않아도 기존 워크플로는 중단되지 않는다.

(원문 예제 — 파이프라인 미검증)
```bash
# From the directory where you installed the skills (e.g., .agents/skills/ or .claude/skills/)
rm -rf page-cro form-cro \
       ab-test-setup analytics-tracking aso-audit competitor-alternatives \
       email-sequence free-tool-strategy launch-strategy onboarding-cro \
       paid-ads paywall-upgrade-cro popup-cro pricing-strategy \
       product-marketing-context referral-program schema-markup \
       signup-flow-cro social-content
```

(원문 예제 — 파이프라인 미검증)
```bash
mkdir -p .agents
# v2.0 file (or pre-v2.0 file with new name)
mv .claude/product-marketing.md .agents/product-marketing.md 2>/dev/null
# pre-v2.0 file with legacy name
mv .claude/product-marketing-context.md .agents/product-marketing.md 2>/dev/null
```

## 비유

**비유**: marketingskills는 "공통 설계도를 공유하는 전문 공구 상자"다. `product-marketing`이 설계도면이고, 각 스킬(cro, copywriting, seo-audit 등)은 특정 작업에特化한 공구이며, 공구들은 서로를 참조하면서 협동 작업을 수행한다.

**깨지는 지점**: 실제 공구 상자의 공구는 설계도를 읽고 나서 작동하지 않는다 — 망치가 도면을 참조하지는 않는다. marketingskills의 각 스킬은 실행 시점에 `product-marketing` 문서를 능동적으로 파싱하여 맥락을 주입받으며, 스킬끼리 서로의 출력을 입력으로 참조하는 동적 네트워크를 형성한다는 점에서 수동적 도구와 근본적으로 다르다.

## 곁가지

- Agent Skills spec 심화: agentskills.io 표준 포맷으로 커스텀 스킬을 직접 작성할 필요가 생길 때
- CONTRIBUTING.md 심화: 새 스킬 기여 시 디렉토리 구조, Related Skills 섹션 작성 규칙, PR 가이드라인이 필요해질 때 (원문에 CONTRIBUTING.md의 구체적 내용은 포함되어 있지 않음)
- SkillKit 심화: Cursor·Copilot·Claude Code 등 멀티 에이전트 환경에서 스킬 동기화가 필요해질 때
- Coding for Marketers 심화: 터미널·코딩 에이전트 초심자 마케터를 위한 동반 가이드가 필요해질 때

## 연결

- **Agent Skills spec (agentskills.io)**: marketingskills가 따르는 스킬 포맷 표준 — 이 스펙을 구현한 모든 에이전트와 호환됨
- **Claude Code skills system**: `.claude/skills/` 심볼릭 링크를 통해 Claude Code 내장 스킬 시스템과 호환 레이어 형성
- **Vercel Labs npx skills CLI**: `npx skills add` 명령어로 스킬 설치·관리를 자동화하는 패키지 매니저
- **product-marketing 맥락 문서**: 모든 스킬의 공통 입력 — 이 문서의 품질이 전체 스킬 출력의 상한선을 결정

## 레퍼런스

- [GitHub - coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — 전체 소스, 설치 가이드, 40+ 스킬 목록 및 v2 마이그레이션 맵 포함 (1차) · 기준 버전: v2.0
- [Agent Skills spec (agentskills.io)](https://agentskills.io/) — marketingskills가 준수하는 에이전트 스킬 포맷 표준 (1차) · 버전 명시 없음
- [Vercel Labs npx skills](https://github.com/vercel-labs/skills) — 권장 설치 CLI 도구, `npx skills add` 명령어 제공 (1차) · 버전 명시 없음
- [SkillKit](https://github.com/rohitg00/skillkit) — 멀티 에이전트 스킬 설치 도구, `npx skillkit install` 명령어 제공 (1차) · 버전 명시 없음
- [Coding for Marketers](https://codingformarketers.com/?ref=marketingskills) — 터미널·코딩 에이전트 초심자 마케터를 위한 동반 가이드 (2차) · 버전 명시 없음
- [Conversion Factory](https://conversionfactory.co/?ref=marketingskills) — 저자 Corey Haines의 전환 최적화 에이전시, 프로젝트 배경 맥락 (2차)

---
## 인출 질문

1. **(맵 재생)** marketingskills의 5가지 핵심 가지를 나열하고, 각 가지가 다루는 내용을 한 문장씩 설명하라.

2. **(전이)** v1.x에서 v2.0으로 업그레이드하는 사용자가 수행해야 할 세 가지 작업을 순서대로 설명하고, product-marketing 맥락 파일의 경로·파일명 변화를 기술하라. 또한 마이그레이션을 즉시 수행하지 않아도 기존 워크플로가 중단되지 않는 이유를 설명하라.

3. **(전이)** AI 에이전트가 "Write homepage copy for my SaaS"라는 요청을 받았을 때, 어떤 스킬이 활성화되며 그 스킬이 product-marketing 문서를 어떻게 활용하는지, 그리고 해당 스킬이 상호 참조하는 다른 스킬들은 무엇인지 설명하라.

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
