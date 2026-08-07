---
title: 'LangChain 탈피 vs 프로바이더 추상화 — 자체 구축 시 어떤 패턴이 남는가 (레퍼런스 모음)'
pubDate: '2026-07-25T00:31:52+09:00'
noteId: ARCH-2607-006
description: '무거운 오케스트레이션 프레임워크(LangChain)를 버리고 자체 구축하는 흐름과, 그럼에도 남는 프로바이더 추상화(ports & adapters / 게이트웨이) 패턴에 대한 근거 자료 모음'
summary: 'LLM 앱에서 "오케스트레이션 추상화(프레임워크)"와 "프로바이더 추상화(port/adapter)"는 별개 축이다. 프레임워크는 버리는 흐름이 실증되지만 프로바이더 port는 대개 남으며, 그 구현은 손수 짜기보다 통합 게이트웨이/라이브러리 채택 또는 필요 증명 후 도입이 흔하다. 아래는 그 판단의 근거 자료.'
lang: ko
draft: true
tags:
  - 'ai'
  - 'llm'
  - 'architecture'
  - 'agent'
polishHash: 'e46a0f985bfb'
lintHash: 'e46a0f985bfb'
---

> 캡처 맥락: langgraph-poc `m1_agent_loop.py` fieldwork 세션 중 "자체 구축 시에도 ports&adapters 패턴을 쓰나 / 실증 가능한가" 질문에 대한 답변의 레퍼런스. 아직 노트 파이프라인 미통과(raw 캡처).

## 한 줄 명제

=="오케스트레이션 추상화(LangChain의 chain·agent)"와 "프로바이더 추상화(OpenAI↔Anthropic↔Gemini를 한 port 뒤로)"는 별개 축이다== — 프레임워크는 버려도 프로바이더 port는 남으며, 그 port는 대개 직접 구현이 아니라 게이트웨이/라이브러리 채택 또는 필요 증명 후 도입된다("경계는 필요할 때만").

## 레퍼런스

- https://octoclaw.ai/blog/why-we-no-longer-use-langchain-for-building-our-ai-agents — Octomind 엔지니어링팀이 LangChain을 프로덕션 12개월+ 사용 후(2023→2024) 제거하고 모듈형 빌딩 블록으로 교체한 사례. 서브에이전트 등 복잡해지자 프레임워크의 경직된 추상화가 마찰이 됨 (2차, 검증됨 — 1차 자체 경험 블로그).
- https://news.ycombinator.com/item?id=40739982 — 위 글의 Hacker News 토론(반론 포함, 균형 참고용) (2차).
- https://www.anthropic.com/research/building-effective-agents — Anthropic "Building Effective Agents": API를 직접 써서 시작하라, 성공적 구현들은 복잡한 프레임워크를 쓰지 않았다, 프레임워크는 프롬프트·응답을 가려 디버깅을 어렵게 한다. **벤더의 관찰·권고**(측정 통계 아님, 선택 편향 유의) (1차).
- https://github.com/BerriAI/litellm — LiteLLM: 100+ LLM API를 OpenAI(또는 네이티브) 포맷 단일 인터페이스로. 프로바이더 어댑터 계층을 라이브러리로 제공 = "port를 직접 안 짜고 채택"의 대표 사례 (1차).
- https://www.truefoundry.com/blog/litellm-vs-openrouter — LiteLLM vs OpenRouter 비교(2026): 자체 호스팅 게이트웨이 vs 호스팅 통합 API의 트레이드오프. LiteLLM 채택 지표·OpenRouter 규모 언급 (2차).
- https://www.oreilly.com/radar/the-case-against-building-your-own-agent-platform/ — 반대 증거: 자체 에이전트 플랫폼 구축이 늘 옳지 않다는 반론(한쪽 단정 방지용 균형 자료) (2차).

## 근거 등급 메모

- 실증됨(사실): 프레임워크 탈피 흐름(Octomind 사례), 프로바이더 추상화 라이브러리의 광범위 채택(LiteLLM/OpenRouter).
- 의견·추정: =="자체 구축 팀이 정식 ports&adapters(도메인 소유 Protocol+DI)를 다수 쓴다"는 측정 자료 없음 — 권장 설계 원칙 수준.==
