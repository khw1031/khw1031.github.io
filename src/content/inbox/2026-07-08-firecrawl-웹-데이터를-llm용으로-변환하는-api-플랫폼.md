---
title: 'Firecrawl — 웹 데이터를 LLM용으로 변환하는 API 플랫폼'
pubDate: '2026-07-08T19:18:59+09:00'
description: 'Firecrawl API로 웹 페이지를 검색·스크래핑·상호작용하여 AI 에이전트가 소비 가능한 Markdown·JSON으로 변환하는 방법'
summary: 'Firecrawl은 웹 96%를 커버하는 스크래핑·검색 API로, URL 하나를 LLM-ready Markdown이나 구조화 JSON으로 바꿔준다. Search, Scrape, Interact 세 핵심 엔드포인트와 Agent 자동화 계층으로 구성된다.'
lang: ko
tags:
  - 'api'
  - 'llm'
  - 'mcp'
  - 'open-source'
  - 'agentic-coding'
canonical: 'https://github.com/firecrawl/firecrawl'
lintHash: 'a28f630c73e7'
polishHash: 'a28f630c73e7'
---

> 한 줄 명제: Firecrawl은 웹 페이지를 AI 에이전트가 바로 소비할 수 있는 Markdown·구조화 JSON으로 변환하는 범용 웹 컨텍스트 API다.

## 큰 그림

```text
Firecrawl — 웹 → LLM-ready 데이터 파이프라인
├── Search        : 쿼리 기반 웹 검색 + 결과 페이지 전체 콘텐츠
├── Scrape        : 단일 URL → markdown / HTML / screenshot / JSON
├── Interact      : scrape 후 AI prompt 또는 코드로 페이지 조작
├── Agent         : 자연어 기술만으로 자동 탐색·수집 (Spark 모델)
├── Crawl         : 사이트 전체 URL 비동기 일괄 크롤링 (job 기반)
├── Map           : 사이트 URL 구조 즉시 발견
└── Batch Scrape  : 다수 URL 비동기 동시 스크래핑
```

## 핵심

Firecrawl은 웹 페이지를 AI 시스템이 직접 읽을 수 있는 형태로 변환하는 API 플랫폼이다. 핵심 가치는 =="프록시 회전, JS 렌더링, rate limit 처리 같은 스크래핑 인프라를 개발자가 직접 구축하지 않아도 된다"==는 점으로, P95 latency 3.4초에 웹 96%를 커버한다고 주장한다(원문 기준, 벤치마크 링크 별도 제공). 출력 형식은 clean markdown, 구조화 JSON, screenshot 등을 지원하여 LLM 토큰 소모를 줄이는 데 초점을 맞춘다.

API는 크게 세 계층으로 나뉜다. 첫째는 **Search·Scrape**로, 각각 웹 검색 결과와 단일 URL을 LLM-ready 데이터로 변환하는 기본 엔드포인트다. 둘째는 **Interact**로, scrape한 페이지에 대해 AI prompt나 코드로 추가 상호작용(클릭, 검색 등)을 수행한다. 셋째는 **Agent**로, URL을 몰라도 자연어 설명만으로 데이터를 자동으로 수집하는 자율 계층이다. 이 외에 **Crawl**(사이트 전체), **Map**(URL 발견), **Batch Scrape**(대량 비동기)가 보조 엔드포인트로 제공된다.

플랫폼은 호스팅 서비스(firecrawl.dev)와 AGPL-3.0 오픈소스 두 형태로 제공되며, Python·Node.js·Java·Elixir·Rust 공식 SDK와 MCP 서버 통합을 지원한다.

### Search — 웹 검색 + 전체 콘텐츠

(원문 예제 — 파이프라인 미검증)
```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

search_result = app.search("firecrawl", limit=5)
```

### Scrape — 단일 URL → LLM-ready 데이터

(원문 예제 — 파이프라인 미검증)
```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

result = app.scrape('firecrawl.dev')
```

### Interact — scrape 후 페이지와 상호작용

(원문 예제 — 파이프라인 미검증)
```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

result = app.scrape("https://amazon.com")
scrape_id = result.metadata.scrape_id

app.interact(scrape_id, prompt="Search for 'mechanical keyboard'")
app.interact(scrape_id, prompt="Click the first result")
```

### Agent — 자연어만으로 자동 수집

(원문 예제 — 파이프라인 미검증)
```bash
curl -X POST 'https://api.firecrawl.dev/v2/agent' \
  -H 'Authorization: Bearer fc-YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": "Find the pricing plans for Notion"
  }'
```

## 깊이

### [Search] 검색 결과 구조 ⭐
`search()`는 쿼리 문자열과 `limit`을 받아 URL, title, markdown 필드를 포함한 리스트를 반환한다. 검색 결과 자체에 페이지 전체 markdown이 포함되므로 별도 scrape 호출이 불필요하다. 이는 일반 검색 엔진 API와 차별되는 지점으로, "검색 + 즉시 읽기"를 한 번의 호출로 해결한다.

### [Scrape] 출력 형식 선택 ⭐
`scrape()`는 기본 markdown 외에 `formats` 파라미터로 HTML, screenshot, structured JSON 등을 지정할 수 있다. `onlyMainContent` 옵션으로 본문만 추출 가능하다. 📎 전체 format 목록은 공식 문서를 참조해야 한다(README에 상세 옵션 테이블 없음).

### [Interact] scrape_id 기반 세션 ⭐
Interact는 scrape 호출 시 반환된 `scrape_id`를 재사용하여 동일한 브라우저 세션에서 연속 동작을 수행한다. 이는 stateless한 scrape과 달리 stateful 상호작용을 가능하게 한다. **Gotcha**: scrape_id는 시간 제한이 있을 수 있으며, README에서 TTL을 명시하지 않으므로 프로덕션에서는 세션 만료 처리가 필요하다.

### [Agent] Spark 모델 선택 📎
Agent는 두 가지 Spark 모델을 제공한다: `spark-1-mini`(기본, 60% 저렴)와 `spark-1-pro`(복잡한 연구·다중 사이트 비교용). Pydantic 스키마를 전달하면 구조화 출력을 받을 수 있다. (원문 예제 — 파이프라인 미검증)
```python
from firecrawl import Firecrawl
from pydantic import BaseModel, Field
from typing import List, Optional

app = Firecrawl(api_key="fc-YOUR_API_KEY")

class Founder(BaseModel):
    name: str = Field(description="Full name of the founder")
    role: Optional[str] = Field(None, description="Role or position")

class FoundersSchema(BaseModel):
    founders: List[Founder] = Field(description="List of founders")

result = app.agent(
    prompt="Find the founders of Firecrawl",
    schema=FoundersSchema
)

print(result.data)
```

### [Crawl] 비동기 job 패턴 ⭐
Crawl은 즉시 결과를 반환하지 않고 job ID를 반환한다. SDK는 내부적으로 polling을 자동 처리하지만, cURL로 직접 호출할 경우 `GET /v2/crawl/{job_id}`로 상태를 수동 확인해야 한다. `limit`으로 최대 페이지 수를 제어한다.

### [Map] URL 발견 + 검색 📎
`map()`은 사이트의 전체 URL 구조를 즉시 반환한다. `search` 파라미터를 추가하면 관련성 순으로 정렬된 URL을 얻는다. Crawl 전에 대상 URL을 사전 필터링하는 용도로 유용하다.

### [MCP 통합] 에이전트 연결 ⭐
MCP 서버 설정 한 줄로 Claude Code, Antigravity 등 MCP 호환 클라이언트에 Firecrawl을 연결할 수 있다. (원문 예제 — 파이프라인 미검증)
```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-YOUR_API_KEY"
      }
    }
  }
}
```

## 비유

**Firecrawl은 웹의 "번역기"다**: HTML/JS/CSS로 된 웹 페이지를 LLM이 이해 가능한 Markdown이라는 "공통 언어"로 번역한다.

**깨지는 지점**: 실제 번역기와 달리 Firecrawl은 의미 해석을 하지 않는다. 콘텐츠 추출·정제만 수행하며, 번역(요약, 재구성, 추론)은 다운스트림 LLM의 역할이다. 또한 번역기가 모든 언어를 완벽히 다루지 못하듯, Firecrawl도 JS-heavy 페이지 96% 커버를 주장하지만 100%는 아니며 특정 사이트( CAPTCHA, 고도화된 bot 방어)에서는 실패할 수 있다.

## 곁가지

- **Crawl 심화**: 대규모 사이트 크롤링 시 rate limit·budget 설정·중복 URL 제어가 필요해질 때
- **Agent 심화**: Spark-1-pro 모델의 내부 탐색 전략과 다중 사이트 비교 신뢰도가 궁금해질 때
- **셀프호스팅 심화**: AGPL 오픈소스 버전을 자체 인프라에 배포하여 데이터 주권이 필요해질 때
- **Interact 심화**: scrape_id 세션 TTL, 동시 interact 제한, 브라우저 상태 초기화 전략이 필요해질 때

## 연결

- **RAG (Retrieval-Augmented Generation)**: Firecrawl로 수집한 markdown을 vector DB에 임베딩하면 LLM의 지식 기반을 실시간 웹 데이터로 확장할 수 있다.
- **MCP (Model Context Protocol)**: Firecrawl MCP 서버를 통해 AI 코딩 에이전트가 웹 문서를 실시간 참조하는 도구 체인을 구성할 수 있다.
- **Cheerio / Playwright**: Firecrawl은 내부적으로 이러한 스크래핑 도구를 추상화한 계층으로, 개발자가 직접 Cheerio/Playwright를 다루지 않아도 된다.
- **LangChain / LlamaIndex**: 수집한 Firecrawl 데이터를 이 프레임워크들의 document loader로 연결하여 엔드투엔드 LLM 파이프라인을 구성한다.

## 레퍼런스

- [Firecrawl GitHub 저장소](https://github.com/firecrawl/firecrawl) — 소스 코드, README, SDK 목록 전체 포함 (1차). 버전 명시 없음.
- [Firecrawl 공식 문서](https://docs.firecrawl.dev) — API 상세 파라미터, self-host 가이드, 기능별 심화 문서 (1차).
- [Firecrawl API Reference](https://docs.firecrawl.dev/api-reference/introduction) — 엔드포인트별 요청·응답 스키마 전체 (1차).
- [웹 데이터 API 벤치마크 v25](https://www.firecrawl.dev/blog/the-worlds-best-web-data-api-v25) — 96% 커버리지·P95 3.4초 주장의 근거 벤치마크 (1차, 제조사 자체 측정).
- [firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server) — MCP 통합 서버 소스 및 설정법 (1차).
- [Firecrawl Playground](https://firecrawl.dev/playground) — API 키 없이 브라우저에서 엔드포인트 테스트 가능 (1차).
- [Self-Hosting Guide](https://docs.firecrawl.dev/contributing/self-host) — 오픈소스 버전 자체 배포 절차 (1차).

---
## 인출 질문

1. Firecrawl의 7가지 핵심 엔드포인트를 큰 그림 맵 없이 나열하고, 각각이 "단일 URL 처리"인지 "다중 URL/자동화"인지 분류하라.
2. 당신이 RAG 파이프라인을 구축하면서 최신 웹 문서를 주기적으로 수집해야 한다면, Firecrawl의 어떤 엔드포인트 조합(Search / Scrape / Crawl / Agent)을 선택할 것인가? 선택 근거를 각 엔드포인트의 특성(동기/비동기, URL 사전 지식 필요 여부)과 연결하여 설명하라.
3. AI 코딩 에이전트(Claude Code 등)가 웹 문서를 실시간 참조하게 하려면 Firecrawl을 어떻게 연결하는가? MCP 설정 구조를 설명하라.

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
