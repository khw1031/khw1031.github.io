---
title: '프롬프트·스킬·워크플로 판매 중개 SaaS'
pubDate: '2026-07-09'
description: '프롬프트/스킬/워크플로 같은 AI 자산을 사고파는 중개 마켓플레이스 아이디어 (인박스 캡처)'
tags: [idea-inbox, marketplace, ai-agents, prompts, saas]
---

## 아이디어

프롬프트, (에이전트) 스킬, 자동화 워크플로 같은 **실행 가능한 AI 자산**을 판매·구매하는 중개 마켓플레이스 SaaS. 판매자는 자산을 올려 수익화하고, 구매자는 검증된 자산을 사서 바로 쓴다. 핵심 직관은 "AI 자산이 폭증하는데 *어떤 게 실제로 쓸 만한가*를 걸러 주는 신뢰·정산 레이어가 필요하다"는 것.

다만 카테고리마다 이미 강한 선점자가 있다 — 프롬프트는 PromptBase, 워크플로는 n8n 커뮤니티 템플릿, MCP 도구/서버는 Smithery·Glama 같은 레지스트리, 범용 디지털 굿즈는 Gumroad. 그래서 "여러 자산 유형을 한곳에서 중개"한다는 통합각이 차별점이 될지, 아니면 한 유형에 집중해야 할지가 초기 관전 포인트.

## 더 해볼 질문

- **1차 타깃 자산**: 프롬프트 / 스킬 / 워크플로 중 무엇으로 시작하나? 각각 이미 마켓이 있는데, 통합 중개의 차별점은 무엇인가(예: 크로스-카테고리 번들, 통합 정산)?
- **해자**: 마켓의 방어력은 큐레이션·"실제 작동 보장"·검색·정산 중 어디서 나오나? 실행 가능한 자산(스킬/워크플로)은 정적 프롬프트와 달리 **실행·호환성·버전** 검증이 어려운데 어떻게 샌드박스/검증하나?
- **수익 모델**: 판매 수수료(PromptBase는 20%) vs 구독 vs 사용량(per-call, MCP 스타일) 중 무엇? 실행형 자산은 per-call 과금과 자연스럽게 붙는가?
- **콜드스타트**: 공급자가 왜 PromptBase/n8n/Smithery 대신 여기에 올리나(더 나은 수익 배분? 노출? 정산?)?
- **IP·법적**: 프롬프트·워크플로의 저작권·재판매·표절·유출을 어떻게 다루나?
- **호환 대상**: 특정 생태계(예: MCP·Claude 스킬·n8n) 종속형인가, 모델/툴 중립형인가?

## 레퍼런스·서비스

_확인일 2026-07-09. 벤더 사이트는 자기 주장에 한해 1차, 집계·비교·수치는 2차._

- **PromptBase** — 프롬프트 마켓 1위, 판매 수수료 20%(판매자 80%). 프롬프트 체인·시스템 프롬프트로 확장 중. 직접 경쟁/벤치마크. 서비스 1차: [promptbase.com](https://promptbase.com/) · 수치 2차: [hubpy.io/blog/promptbase-guide-2026](https://hubpy.io/blog/promptbase-guide-2026)
- **FlowGPT** — 커뮤니티 기반 프롬프트/챗봇 공유, 직접 판매보다 랭킹·무료 공유 모델. "판매 없는 공유"의 대조군. 서비스 1차: [flowgpt.com](https://flowgpt.com/)
- **n8n 워크플로 템플릿** — 7천+ AI 워크플로 템플릿 커뮤니티, 워크플로를 서비스/구독으로 파는 사례 다수. 워크플로 카테고리 경쟁. 서비스 1차: [n8n.io/workflows](https://n8n.io/workflows/) · 수익화 2차: [browseract.com/blog/how-to-make-money-with-n8n-workflow-automation](https://www.browseract.com/blog/how-to-make-money-with-n8n-workflow-automation)
- **Zapier / Make** — AI 에이전트 + 8,000+ 앱 자동화. 워크플로 유통·실행 인프라의 기준선. 서비스 1차: [zapier.com](https://zapier.com/)
- **Apify Store** — 스크레이퍼/Actor 마켓 + 사용량 과금(실행형 자산 수익화의 좋은 선례, MCP 노출까지). 서비스 1차: [apify.com/store](https://apify.com/store)
- **MCP 레지스트리(Smithery·Glama·PulseMCP)** — MCP 서버/도구 디렉토리 + per-call/구독/outcome 과금 모델 등장. "실행형 자산 마켓"의 직접 인접. (이 저장소의 `/idea/mcp-for-apis-agents/` 조사와 연결) 2차: [truefoundry.com/blog/best-mcp-registries](https://www.truefoundry.com/blog/best-mcp-registries)
- **OpenAI GPT Store** — 커스텀 GPT 배포·발견 채널(단, Evals·Prompt Objects 일부 기능 2026 종료 예정 — 플랫폼 종속 리스크의 예). 참고 2차: 위 PromptBase 가이드 및 OpenAI 공지.
