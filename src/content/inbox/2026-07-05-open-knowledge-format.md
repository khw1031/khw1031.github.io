---
title: Open Knowledge Format (OKF)
pubDate: '2026-07-05T14:23:53+09:00'
description: 조직 지식을 markdown + YAML frontmatter 파일 트리로 표준화해 AI 에이전트가 소비하게 하는 Google의 오픈 스펙
summary: "AI 에이전트가 쓰는 조직 내부 지식(스키마·지표 정의·조인 경로·런북)이 카탈로그·위키·코드에 분산된 fragmented context 문제를, markdown 파일 + YAML frontmatter + 마크다운 링크 그래프라는 최소 스펙(OKF v0.1)으로 표준화하려는 시도를 정리한 레퍼런스 노트."
lang: ko
tags: ['okf', 'ai-agents', 'metadata', 'data-catalog', 'markdown']
lintHash: '67472e8ee174'
polishHash: '67472e8ee174'
---

> 한 줄 명제: OKF는 "LLM이 유지보수하는 위키" 패턴을 이식 가능한 파일 포맷으로 표준화한 것이다 — 조직 지식을 플랫폼이 아니라 markdown 파일 트리에 담아, 어떤 에이전트·카탈로그·뷰어든 같은 지식을 소비하게 한다.

## 큰 그림

```text
Open Knowledge Format (OKF)
├─ 1 문제      — fragmented context: 조직 지식이 카탈로그 API·위키·코드 주석·머릿속에 분산
├─ 2 스펙      — markdown + YAML frontmatter + 파일 트리; 필수 필드는 type 하나
├─ 3 그래프    — 마크다운 링크([name](/path.md))로 개념을 잇는다; index.md로 점진 공개
├─ 4 설계 원칙 — 최소 규정 / 생산자·소비자 독립 / "포맷이지 플랫폼이 아니다"
├─ 5 생태계    — enrichment agent, HTML visualizer, 샘플 번들, GCP Knowledge Catalog 수용
└─ 6 계보      — Karpathy의 LLM-wiki, Obsidian vault, AGENTS.md/CLAUDE.md 관습
```

## 핵심

조직에서 foundation model이 실제로 필요로 하는 정보는 대부분 내부 지식이다 — 테이블 스키마, 우리 회사 기준의 지표 정의, 장애 대응 런북, 두 시스템 사이의 조인 경로 같은 것들. 문제는 이 지식이 벤더 고유 API를 가진 메타데이터 카탈로그, 위키, 코드 주석, 엔지니어의 머릿속에 흩어져 있다는 것이다. 그래서 "모든 에이전트 빌더가 같은 context-assembly 문제를 처음부터 다시 풀고, 모든 카탈로그 벤더가 같은 데이터 모델을 재발명"하는 상황이 반복된다.

OKF(v0.1, 2026-06-13 발표)는 이 문제에 대한 Google의 답으로, 지식 표현을 세 가지로 환원한다: **그냥 markdown**(어떤 에디터로도 읽고, GitHub에서 렌더되고, 검색 도구가 인덱싱), **그냥 파일**(tarball로 배포, git repo에 호스팅, 파일시스템에 마운트), **그냥 YAML frontmatter**(쿼리 가능한 구조화 필드). 개념(concept) 하나가 파일 하나이고, 필수 필드는 `type` 단 하나다. 원문의 개념 문서 예시(스펙 예시 발췌 — 실행 검증 대상 아님):

```markdown
---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `order_id` | STRING | Globally unique order identifier. |
| `customer_id` | STRING | FK to [customers](/tables/customers.md). |

# Joins

Joined with [customers](/tables/customers.md) on `customer_id`.
```

이 접근의 전제는 Karpathy가 정리한 LLM-wiki 관찰이다: 사람은 위키 유지보수에 지치지만 "LLM은 지루해하지 않고, 상호 참조 갱신을 잊지 않으며, 한 번에 15개 파일을 고칠 수 있다". 즉 에이전트가 같은 문서에서 같은 사실을 반복 검색하게 하는 대신, ==에이전트가 직접 쓰고 갱신하는 공유 markdown 라이브러리를 지식의 저장소로 삼는 패턴을 포맷으로 굳힌 것이다.==

## 깊이

### 가지 2·3 확대 — 스펙의 실제 모양

⭐ 번들은 평범한 디렉토리 트리다. 도메인(`sales/`) 아래 개념 종류별 디렉토리가 오고, 각 디렉토리의 `index.md`가 하위 개념의 개요를 제공해 에이전트가 계층을 내려가며 **점진적으로 컨텍스트를 로드**할 수 있게 한다(progressive disclosure):

```text
sales/
├── index.md
├── datasets/
│   ├── index.md
│   └── orders_db.md
├── tables/
│   ├── index.md
│   ├── orders.md
│   └── customers.md
└── metrics/
    ├── index.md
    └── weekly_active_users.md
```

⭐ 개념 간 관계는 별도 스키마가 아니라 **평범한 마크다운 링크**로 표현한다. 링크가 쌓이면 파일시스템 계층보다 풍부한 그래프가 되고, 이것이 조인 경로·의존성 같은 관계 지식의 표현 수단이다.

📎 예약 파일은 두 개다: `index.md`(계층 탐색용 개요), `log.md`(변경의 시간순 기록). 전체 스펙은 한 페이지 분량으로 conformance 기준, 크로스링크 규칙, 예약 파일명을 다룬다 — 세부는 [스펙 repo](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf)에서 직접 본다.

### 가지 4 확대 — 설계 원칙 세 가지

⭐ 이 스펙을 평가할 때 기준이 되는 선언들:

- **Minimally opinionated** — `type`만 필수. 콘텐츠 모델은 생산자가 정의한다. 스펙이 지식의 형태를 규정하지 않는다.
- **생산자·소비자 독립** — 사람이 쓰든 에이전트가 쓰든, 에이전트가 읽든 visualizer가 읽든 상관없다.
- **Format, not platform** — 특정 클라우드·DB·모델·프레임워크에 묶이지 않고, 읽고 쓰고 서빙하는 데 독점 계정이나 SDK를 요구하지 않겠다고 명시한다.

### 가지 5 확대 — 지금 실제로 있는 것

📎 발표 시점에 공개된 reference implementation: ① BigQuery 데이터셋을 순회하며 테이블/뷰마다 OKF 개념 문서를 초안 작성하고 2차 LLM 패스로 인용·스키마·조인 경로를 보강하는 **enrichment agent**, ② OKF 번들을 백엔드 없는 단일 HTML 파일의 인터랙티브 그래프 뷰로 바꾸는 **static visualizer**, ③ 샘플 번들 3종(GA4 e-commerce, Stack Overflow, Bitcoin 공공 데이터셋). GCP Knowledge Catalog도 OKF를 수용(ingest)해 자사 에이전트에 서빙하도록 업데이트되었다.

**Gotcha**: v0.1은 "finished standard가 아니라 starting point"라고 스스로 명시한다. dbt·Iceberg·semantic layer·RDF 같은 기존 메타데이터 표준과의 관계는 이 글에서 다루지 않는다 — 실무 도입 판단에는 이 공백이 핵심 리스크다.

## 비유

OKF는 해운의 ISO 컨테이너 표준과 같다. 컨테이너 규격이 통일되자 어떤 배·트럭·크레인·항구든 내용물을 몰라도 같은 상자를 다룰 수 있게 되어 물류 생태계가 폭발했다. OKF도 지식을 표준 상자(markdown 파일 + `type` frontmatter)에 담아, 어떤 에이전트·카탈로그·뷰어든 만든 쪽을 몰라도 소비할 수 있게 하려는 것이다.

**깨지는 지점**: 컨테이너는 내용물이 무엇이든 규격만 맞으면 가치가 성립하지만, OKF의 가치는 전적으로 상자 안 내용물(마크다운 본문)의 품질에 달려 있다. `type`만 있으면 빈 문서도 스펙 준수(conformant)이므로, 규격 준수가 지식의 정확성·최신성을 전혀 보장하지 않는다. 또 컨테이너는 불투명한 채 운송되지만 OKF 문서는 사람과 에이전트가 열어 읽는 것 자체가 목적이다.

## 곁가지

- **OKF 스펙 원문 정독 (conformance·크로스링크 규칙)** — OKF 번들을 직접 만들거나 파싱하는 코드를 쓰게 될 때.
- **enrichment agent 구조 분석** — 데이터셋 메타데이터 자동 문서화 파이프라인을 우리 환경에 만들고 싶을 때.
- **이 블로그 notes의 OKF 호환성 검토** — 내 노트를 외부 에이전트가 표준 포맷으로 소비하게 하고 싶어질 때 (frontmatter에 `type` 추가 수준인지, 구조 변경이 필요한지).

## 연결

- 이 레포의 notes 구조 — markdown + frontmatter + 허브(`index.md`) + 자식 노트라는 같은 패턴을 독립적으로 수렴했다. 특히 `index.md`를 통한 점진 공개는 OKF의 설계와 동일한 발상.
- [OpenWiki](/inbox/2026-07-05-openwiki-코딩-에이전트를-위한-오픈소스-레포-문서화-에이전트/) — "에이전트가 유지보수하는 문서화"라는 같은 계보의 코드 레포 쪽 구현.
- AGENTS.md/CLAUDE.md 관습 — OKF가 명시적으로 계보로 인용하는, 에이전트용 컨텍스트 파일의 선행 사례.

## 레퍼런스

- [Introducing the Open Knowledge Format — Google Cloud Blog](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) — 1차. 이 노트의 주 소스 (2026-06-13, Sam McVeety·Amir Hormati).
- [OKF 스펙 repo](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf) — 1차. 스펙 전문과 샘플 번들. 기준 버전 v0.1 (확인일 2026-07-05).
- [Karpathy — LLM wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — 2차. OKF가 형식화했다고 밝힌 원 패턴.
- [Obsidian vault](https://obsidian.md/help/vault) — 2차. 같은 계보로 인용된 파일 기반 지식 저장소.

---

## 인출 질문

- OKF의 여섯 가지(문제→스펙→그래프→원칙→생태계→계보)를 기억으로 재생해보기.
- OKF에서 유일한 필수 필드는? 예약 파일 두 개와 각각의 역할은?
- 개념 간 관계(조인 경로 등)는 스펙에서 어떻게 표현되는가?
- 설계 원칙 "Format, not platform"이 구체적으로 배제하는 것은?
- 전이: 우리 팀 dbt 프로젝트의 모델·지표 메타데이터를 OKF 번들로 내보낸다면 디렉토리 트리가 어떤 모양이 될까? 어떤 정보가 frontmatter로 가고 어떤 정보가 본문으로 가야 하나?
- 컨테이너 비유가 깨지는 지점은 어디이고, 그것이 OKF 도입 판단에 왜 중요한가?

## 내 관점

- 이 블로그의 notes는 이미 OKF와 거의 같은 모양(markdown + frontmatter + index.md 점진 공개 + 링크 그래프)으로 독립 수렴해 있다. 전환의 실체는 `type` 필드 추가 수준이라 비용이 낮지만, 뒤집으면 미루는 비용도 낮다.
- 지금 전환하지 않기로 판단 (2026-07-05). 이 노트의 소비자는 나와 이 레포의 Claude Code뿐이고, 후자는 CLAUDE.md + note-promoter 스킬이라는 더 풍부한 계약을 이미 갖고 있다. OKF의 가치는 "만든 쪽을 모르는 제네릭 소비자"가 나타날 때만 발생하는데, 아직 그런 소비자가 없다. v0.1 알파에 조기 베팅해서 선점되는 이득도 개인 노트에는 없다.
- 재검토 트리거: ① 노트를 다른 레포/환경의 에이전트에 컨텍스트 번들로 물려주고 싶은 구체적 순간이 올 때, ② OKF가 v1.0 또는 GCP 밖 소비자를 얻을 때, ③ visualizer 같은 도구를 써보고 싶을 때 — 그때도 전면 전환이 아니라 `type` 필드만 얹는 실험이면 충분하다.
