---
title: 'Crawl4AI: LLM 친화적 오픈소스 웹 크롤러'
pubDate: '2026-07-08'
description: 'Crawl4AI의 핵심 API와 Markdown 생성, 구조화 추출, 브라우저 제어, 배포 기능을 다루는 학습 노트'
summary: '웹 페이지를 LLM이 바로 사용할 수 있는 Markdown으로 변환하는 Crawl4AI의 아키텍처와 핵심 API를 정리한 한 장 학습 노트.'
lang: ko
tags:
  - 'llm'
  - 'open-source'
  - 'api'
  - 'scraping'
canonical: 'https://github.com/unclecode/crawl4ai'
lintHash: '830c56b83353'
---

> 한 줄 명제: Crawl4AI는 웹 페이지를 LLM·RAG·agent가 즉시 소비할 수 있는 구조화된 Markdown과 JSON으로 변환하는 async-first 오픈소스 크롤링 파이프라인이다.

## 큰 그림

```text
                    Crawl4AI
            "웹 → LLM-ready 데이터 파이프라인"
                        │
    ┌───────┬───────┬───┴───┬───────┬───────┐
    │       │       │       │       │       │
 1.설치  2.Markdown 3.추출  4.브라우저 5.딥크롤  6.배포
 ·시작   ·생성      ·구조화  ·제어     ·링       ·보안
         ├─clean    ├─CSS   ├─세션    ├─BFS/DFS ├─Docker API
         ├─fit      ├─LLM   ├─프록시  ├─crash   ├─v0.9 보안
         └─BM25     └─스키마 └─스텔스   recovery └─CLI
                              └─prefetch
```

## 핵심

Crawl4AI는 Python async 기반으로 동작하는 웹 크롤링 라이브러리로, Playwright 브라우저 풀을 사용해 JavaScript가 렌더링하는 동적 페이지까지 포함한 뒤 그 결과를 LLM이 바로 프롬프트에 넣을 수 있는 Markdown 또는 구조화된 JSON으로 변환한다. 핵심 진입점은 `AsyncWebCrawler`이며, `BrowserConfig`로 브라우저 동작을, `CrawlerRunConfig`로 크롤링·추출·캐싱 전략을 각각 선언형으로 지정한다. v0.9 기준으로 pip 라이브러리(pip install 후 in-process 사용)와 Docker API 서버(FastAPI 기반 self-hosted) 두 가지 배포 형태를 제공하며, 이 둘은 독립적으로 버전 관리된다 — pip 라이브러리는 v0.9에서도 breaking change가 없었지만, Docker API 서버는 secure-by-default 전환으로 breaking change가 발생했다.

Markdown 생성 파이프라인은 세 단계 필터를 거친다. 첫째, `DefaultMarkdownGenerator`가 HTML을 구조화된 raw Markdown으로 변환한다. 둘째, `PruningContentFilter`(휴리스틱 기반 노이즈 제거) 또는 `BM25ContentFilter`(사용자 쿼리 기준 관련성 필터)를 적용해 fit Markdown을 만든다. fit Markdown은 RAG 파이프라인에 넣을 때 토큰 비용을 크게 줄여준다.

구조화 데이터 추출은 LLM 없이 가능한 `JsonCssExtractionStrategy`(CSS 선택자 + 스키마)와 LLM을 사용하는 `LLMExtractionStrategy`(Pydantic 스키마 + 자연어 지시) 두 경로가 있다. CSS 방식은 빠르고 비용이 들지 않지만 선택자를 직접 작성해야 하고, LLM 방식은 자연어 지시만으로 추출할 수 있으나 API 비용과 지연 시간이 발생한다.

(원문 예제 — 파이프라인 미검증)
```python
import asyncio
from crawl4ai import *

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://www.nbcnews.com/business",
        )
        print(result.markdown)

if __name__ == "__main__":
    asyncio.run(main())
```

## 깊이

### [1.설치·시작]

⭐ **설치 후 반드시 `crawl4ai-setup`을 실행해야 한다.** `pip install crawl4ai`만으로는 Playwright 브라우저 바이너리가 설치되지 않는다. `crawl4ai-setup`이 Playwright Chromium을 내려받으며, 실패 시 `python -m playwright install --with-deps chromium`으로 수동 설치할 수 있다. 설치 후 `crawl4ai-doctor`로 환경을 검증한다.

📎 **CLI 사용법**: v0.8 이상에서 `crwl` 명령어가 추가되었다. `crwl <url> -o markdown`으로 기본 크롤, `--deep-crawl bfs --max-pages 10`으로 딥 크롤, `-q "질문"`으로 LLM 추출을 수행한다.

### [2.Markdown 생성]

⭐ **`PruningContentFilter`와 `BM25ContentFilter`의 선택 기준**: 특정 쿼리 없이 페이지 전체의 노이즈(네비게이션, 푸터, 광고)를 제거하려면 `PruningContentFilter`를 사용하고, 사용자가 찾는 주제에 맞는 내용만 남기려면 `BM25ContentFilter`에 `user_query`를 전달한다. `threshold` 값이 낮을수록 더 많은 콘텐츠를 잘라낸다.

(원문 예제 — 파이프라인 미검증)
```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.content_filter_strategy import PruningContentFilter, BM25ContentFilter
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

async def main():
    browser_config = BrowserConfig(
        headless=True,  
        verbose=True,
    )
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.ENABLED,
        markdown_generator=DefaultMarkdownGenerator(
            content_filter=PruningContentFilter(threshold=0.48, threshold_type="fixed", min_word_threshold=0)
        ),
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url="https://docs.micronaut.io/4.9.9/guide/",
            config=run_config
        )
        print(len(result.markdown.raw_markdown))
        print(len(result.markdown.fit_markdown))

if __name__ == "__main__":
    asyncio.run(main())
```

📎 **링크를 인용 목록으로 변환**: Markdown 생성 시 페이지 내 링크를 번호가 매겨진 참조 목록으로 자동 변환한다. 원문에 언급만 되어 있고 구체적인 설정 API는 원문에 없음.

### [3.추출]

⭐ **CSS 기반 추출 vs LLM 기반 추출**: `JsonCssExtractionStrategy`는 CSS 선택자와 `baseSelector`를 사용해 반복 패턴(상품 목록, 기사 카드 등)을 JSON 배열로 추출한다. LLM 호출이 없으므로 빠르고 비용이 들지 않는다. `LLMExtractionStrategy`는 Pydantic 스키마와 자연어 `instruction`을 LLM에 전달해 비정형 텍스트에서 구조화된 데이터를 뽑아낸다. OpenAI, Ollama 등 LiteLLM이 지원하는 모든 provider를 사용할 수 있다.

(원문 예제 — 파이프라인 미검증)
```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai import JsonCssExtractionStrategy
import json

async def main():
    schema = {
    "name": "KidoCode Courses",
    "baseSelector": "section.charge-methodology .w-tab-content > div",
    "fields": [
        {
            "name": "section_title",
            "selector": "h3.heading-50",
            "type": "text",
        },
        {
            "name": "section_description",
            "selector": ".charge-content",
            "type": "text",
        },
        {
            "name": "course_name",
            "selector": ".text-block-93",
            "type": "text",
        },
        {
            "name": "course_description",
            "selector": ".course-content-text",
            "type": "text",
        },
        {
            "name": "course_icon",
            "selector": ".image-92",
            "type": "attribute",
            "attribute": "src"
        }
    ]
}

    extraction_strategy = JsonCssExtractionStrategy(schema, verbose=True)

    browser_config = BrowserConfig(
        headless=False,
        verbose=True
    )
    run_config = CrawlerRunConfig(
        extraction_strategy=extraction_strategy,
        js_code=["""(async () => {const tabs = document.querySelectorAll("section.charge-methodology .tabs-menu-3 > div");for(let tab of tabs) {tab.scrollIntoView();tab.click();await new Promise(r => setTimeout(r, 500));}})();"""],
        cache_mode=CacheMode.BYPASS
    )
        
    async with AsyncWebCrawler(config=browser_config) as crawler:
        
        result = await crawler.arun(
            url="https://www.kidocode.com/degrees/technology",
            config=run_config
        )

        companies = json.loads(result.extracted_content)
        print(f"Successfully extracted {len(companies)} companies")
        print(json.dumps(companies[0], indent=2))

if __name__ == "__main__":
    asyncio.run(main())
```

(원문 예제 — 파이프라인 미검증)
```python
import os
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode, LLMConfig
from crawl4ai import LLMExtractionStrategy
from pydantic import BaseModel, Field

class OpenAIModelFee(BaseModel):
    model_name: str = Field(..., description="Name of the OpenAI model.")
    input_fee: str = Field(..., description="Fee for input token for the OpenAI model.")
    output_fee: str = Field(..., description="Fee for output token for the OpenAI model.")

async def main():
    browser_config = BrowserConfig(verbose=True)
    run_config = CrawlerRunConfig(
        word_count_threshold=1,
        extraction_strategy=LLMExtractionStrategy(
            llm_config = LLMConfig(provider="openai/gpt-4o", api_token=os.getenv('OPENAI_API_KEY')), 
            schema=OpenAIModelFee.schema(),
            extraction_type="schema",
            instruction="""From the crawled content, extract all mentioned model names along with their fees for input and output tokens. 
            Do not miss any models in the entire content. One extracted model JSON format should look like this: 
            {"model_name": "GPT-4", "input_fee": "US$10.00 / 1M tokens", "output_fee": "US$30.00 / 1M tokens"}."""
        ),            
        cache_mode=CacheMode.BYPASS,
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url='https://openai.com/api/pricing/',
            config=run_config
        )
        print(result.extracted_content)

if __name__ == "__main__":
    asyncio.run(main())
```

### [4.브라우저 제어]

⭐ **`user_data_dir` + `use_persistent_context`로 로그인 상태 유지**: `BrowserConfig`에 `user_data_dir` 경로와 `use_persistent_context=True`를 설정하면 브라우저 프로필이 디스크에 저장되어, 쿠키·세션·인증 상태가 크롤 세션 사이에 보존된다. 로그인墙이 있는 사이트에서 한 번 수동 로그인한 뒤 자동 크롤링하는 워크플로우에 필수다.

📎 **Anti-bot 우회**: v0.8.5에서 3단계 탐지(known vendor, generic block indicator, structural integrity check)와 프록시 체인 자동 fallback이 추가되었다. `browser_type="undetected"` 설정으로 Cloudflare, Akamai 등 주요 WAF를 우회할 수 있다.

📎 **Shadow DOM 평탄화**: `CrawlerRunConfig(flatten_shadow_dom=True)`로 Web Component 내부 콘텐츠에 접근한다.

(원문 예제 — 파이프라인 미검증)
```python
import os, sys
from pathlib import Path
import asyncio, time
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

async def test_news_crawl():
    user_data_dir = os.path.join(Path.home(), ".crawl4ai", "browser_profile")
    os.makedirs(user_data_dir, exist_ok=True)

    browser_config = BrowserConfig(
        verbose=True,
        headless=True,
        user_data_dir=user_data_dir,
        use_persistent_context=True,
    )
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        url = "ADDRESS_OF_A_CHALLENGING_WEBSITE"
        
        result = await crawler.arun(
            url,
            config=run_config,
            magic=True,
        )
        
        print(f"Successfully crawled {url}")
        print(f"Content length: {len(result.markdown)}")
```

### [5.딥크롤링]

⭐ **Crash recovery**: `BFSDeepCrawlStrategy`에 `on_state_change` 콜백을 등록하면 각 URL 처리 후 상태가 JSON으로 직렬화되어 Redis나 DB에 저장된다. 다음 실행 시 `resume_state` 파라미터에 저장된 상태를 전달하면 중단 지점부터再開한다. 수십 시간 걸리는 대규모 크롤에서 필수다.

⭐ **Prefetch 모드**: `CrawlerRunConfig(prefetch=True)`는 Markdown 생성, 추출, 미디어 처리를 모두 건너뛰고 HTML과 링크만 반환한다. 일반 크롤 대비 5~10배 빠르며, 2단계 파이프라인(1단계: URL 발견, 2단계: 선택적 처리)의 첫 단계에 적합하다.

📎 **전략 선택**: BFS(너비 우선), DFS(깊이 우선), BestFirst(점수 기반 우선) 세 가지 딥 크롤 전략을 제공하며, 모두 `cancel()` 메서드와 `should_cancel` 콜백으로 실행 중 중단할 수 있다.

(원문 예제 — 파이프라인 미검증)
```python
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy

strategy = BFSDeepCrawlStrategy(
    max_depth=3,
    resume_state=saved_state,  # Continue from checkpoint
    on_state_change=save_to_redis,  # Called after each URL
)
```

### [6.배포·보안]

⭐ **v0.9의 가장 중요한 두 가지 breaking change: 인증 기본 활성화와 loopback 바인딩.** v0.9에서 Docker API 서버는 별도 설정 없이 인증이 기본으로 켜지며, 토큰을 제공하지 않으면 loopback(127.0.0.1)에만 바인딩한다. v0.8.x에서 업그레이드할 때는 반드시 migration guide를 읽어야 한다. 그 외 hook 선언형 변경, `output_path`를 artifact store로 대체, TLS 검증 기본 활성화, CORS deny-by-default 등도 breaking change에 포함된다.

📎 **Docker 빠른 시작**: `docker pull unclecode/crawl4ai:latest` 후 `docker run -d -p 11235:11235 --shm-size=1g`로 실행한다. `/dashboard`에서 실시간 모니터링, `/playground`에서 요청 테스트가 가능하다.

(원문 예제 — 파이프라인 미검증)
```python
import requests

response = requests.post(
    "http://localhost:11235/crawl",
    json={"urls": ["https://example.com"], "priority": 10}
)
if response.status_code == 200:
    print("Crawl job submitted successfully.")
    
if "results" in response.json():
    results = response.json()["results"]
    print("Crawl job completed. Results:")
    for result in results:
        print(result)
else:
    task_id = response.json()["task_id"]
    print(f"Crawl job submitted. Task ID:: {task_id}")
    result = requests.get(f"http://localhost:11235/task/{task_id}")
```

## 비유

**Crawl4AI는 "웹 페이지의 동시 통역사"다.** HTML이라는 소스 언어를 LLM이 이해하는 Markdown이라는 타겟 언어로 실시간 번역하되, 원문의 구조(제목 계층, 표, 코드 블록)를 보존하고 노이즈(광고, 네비게이션)는 걸러낸다.

**깨지는 지점**: 인간 통역사는 문맥을 이해하고 의미를 재해석·요약할 수 있지만, Crawl4AI는 구조적 변환만 수행하며 의미 해석은 하지 않는다. 의미 기반 필터링(BM25, Pruning)도 통계적 근사이지 의미 이해가 아니다. 또한 통역사는 1:1 대화지만, Crawl4AI는 브라우저 풀을 통해 수백 페이지를 병렬 처리한다 — 이 규모의 차이는 rate limiting, 메모리 관리, crash recovery 등 통역에는 없는 문제를 만들어낸다.

## 곁가지

- 도메인 특화 스크레이퍼 심화: 특정 사이트(전자상거래, 학술 DB)의 반복 패턴을 자동 스키마로 변환할 때 필요
- Adaptive Crawling 심화: `AdaptiveConfig`로 사이트 패턴을 학습하는 자율 크롤러가 필요해질 때
- LLMTableExtraction 심화: 대규모 테이블을 chunk 단위로 분할·추출·병합해야 할 때
- MCP 통합 심화: Claude Code 등 AI 도구에 Crawl4AI Docker 서버를 직접 연결할 때

## 연결

- **RAG 파이프라인**: Crawl4AI가 생성한 fit Markdown이 RAG의 ingestion 소스로直接进入 — 토큰 비용과 노이즈가 임베딩 품질을 좌우
- **LangChain / LlamaIndex**: 크롤링 결과를 document loader로 래핑하여 vector store에 적재하는 패턴
- **Playwright**: Crawl4AI의 브라우저 자동화 기반 — `crawl4ai-setup`이 Playwright 바이너리를 설치
- **LiteLLM (`unclecode-litellm`)**: `LLMExtractionStrategy`가 다양한 LLM provider를 통합 호출하는 데 사용 (v0.8.6에서 supply chain 공격 대응 위해 fork)
- **MCP (Model Context Protocol)**: Docker 서버가 MCP integration을 제공해 AI agent가 직접 크롤 요청 가능

## 레퍼런스

- [Crawl4AI GitHub 저장소](https://github.com/unclecode/crawl4ai) — 전체 소스 코드, README, 릴리스 노트의 단일 소스 of truth (1차)
- [Crawl4AI 공식 문서](https://docs.crawl4ai.com/) — API 레퍼런스, 가이드, 예제 모음 (1차). 버전 명시 없음
- [v0.9.0 Release Notes](https://github.com/unclecode/crawl4ai/blob/main/docs/blog/release-v0.9.0.md) — Docker API secure-by-default 전환 상세 (1차). 기준 버전 v0.9.0
- [v0.9 Docker Migration Guide](https://github.com/unclecode/crawl4ai/blob/main/deploy/docker/MIGRATION.md) — self-hosted Docker API v0.8.x → v0.9 업그레이드 절차 (1차). 기준 버전 v0.9.0
- [v0.8.7 Release Notes](https://github.com/unclecode/crawl4ai/blob/main/docs/blog/release-v0.8.7.md) — Docker API 취약점(RCE, SSRF, auth bypass 등) 수정 및 DomainMapper 추가 (1차). 기준 버전 v0.8.7
- [Docker 예제 코드](https://github.com/unclecode/crawl4ai/blob/main/docs/examples/docker_example.py) — Docker API 호출 패턴 모음 (1차)
- [Self-Hosting Guide](https://docs.crawl4ai.com/core/self-hosting/) — Docker 배포, 모니터링, 프로덕션 설정 가이드 (1차)
- [Google Colab 데모](https://colab.research.google.com/drive/1SgRPrByQLzjRfwoRNq1wSGE9nYY_EE8C?usp=sharing) — 브라우저 없이 바로 실행해볼 수 있는 인터랙티브 노트북 (2차)

---
## 인출 질문

1. **(맵 재생)** Crawl4AI의 핵심 아키텍처를 구성하는 6가지 가지를 나열하고, 각 가지가 다루는 핵심 concern을 한 단어씩 설명하라.
2. **(전이)** v0.8.x에서 v0.9로 self-hosted Docker API 서버를 업그레이드할 때 가장 중요한 두 가지 breaking change는 무엇이며, 왜 이것이 보안에 중요한가?
3. **(전이)** 상품 목록 페이지에서 가격·상품명·이미지를 추출할 때 `JsonCssExtractionStrategy`를 선택해야 하는가, `LLMExtractionStrategy`를 선택해야 하는가? 선택의 근거를 비용·속도·유지보수 관점에서 설명하라.

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
