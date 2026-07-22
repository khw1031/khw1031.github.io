---
title: '개인 채팅·편지·일기 기반 페르소나 챗봇 with 온보딩'
pubDate: '2026-07-23T02:06:29+09:00'
description: '기존 텍스트 데이터를 학습시켜 특정 인물의 말투·성격으로 대화하는 챗봇을 만들고, 구체화 질문 기반 온보딩으로 페르소나를 자연스레 구체화하는 서비스 (인박스 캡처)'
summary: '기존 텍스트 데이터를 학습시켜 특정 인물의 말투·성격으로 대화하는 챗봇을 만들고, 구체화 질문 기반 온보딩으로 페르소나를 자연스레 구체화하는 서비스 (인박스 캡처)'
lang: ko
tags:
  - 'idea-inbox'
  - 'persona-chatbot'
  - 'onboarding'
  - 'personal-ai'
lintHash: '86679c47e84d'
---

## 아이디어

사용자가 가진 기존 채팅 기록, 편지, 일기 등의 텍스트를 입력하면, 그 데이터에 담긴 특정 인물의 말투·성격·ヒ스토리를 반영한 페르소나 챗봇을 생성하는 서비스. 미리 준비된 기본 페르소나 템플릿 선택으로도 시작할 수 있어 진입 장벽을 낮춘다.

핵심 차별점은 'soul(내면)', '말투', '히스토리' 등 페르소나를 구성하는 여러 차원을 구체화 질문(conversational onboarding)을 통해 자연스럽게 끌어낸다는 점이다. 사용자가 한 번에 모든 정보를 입력하는 대신, 대화형 질문 흐름을 따라가다 보면 풍부한 페르소나 프로필이 완성되는 구조를 지향한다.

## 더 해볼 질문

- 입력 데이터(채팅·편지·일기)에서 페르소나를 추출할 때 LLM fine-tuning vs. RAG/프롬프트 기반 중 어떤 방식이 적절한가?
- 온보딩 구체화 질문의 구조(soul·말투·히스토리 등)를 어떻게 정의하고, 몇 단계가 적절한가?
- 생성된 페르소나 챗봇의 공유·배포 모델(비공개 / 링크 공유 / 마켓플레이스)은 어떻게 할 것인가?
- 개인 텍스트 데이터의 프라이버시·보안 처리 방식(로컬 처리 vs. 서버 전송, 암호화, 삭제 정책)은?
- 기본 페르소나 템플릿은 누가·어떻게 큐레이션하며, 사용자 커스텀 템플릿도 허용할 것인가?
- 페르소나 정확도(말투 재현 품질)를 평가하고 사용자가 피드백으로 보정할 수 있는 메커니즘은?

## 레퍼런스·서비스

_확인일 2026-07-23. 후보 URL을 실제 fetch해 검증한 빠른 스캔 — 깊은 1차 검증은 하지 않음._

- **[Character.AI](https://character.ai/)** — (1차) · 10M+ 캐릭터를 보유한 최대 규모 페르소나 챗봇 플랫폼, 캐릭터 정의·온보딩 UX 참고.
- **[Replika](https://replika.com/)** — (1차) · 4,200만+ 사용자를 보유한 AI companion 서비스, 관계 기반 페르소나 형성 모델 참고.
- **[How I Built a RAG-based AI Chatbot from My Personal Data](https://medium.com/keeping-up-with-ai/how-i-built-a-rag-based-ai-chatbot-from-my-personal-data-88eec0d3483c)** — (2차) · (내용 미확인) 개인 데이터 기반 RAG 챗봇 구축 튜토리얼.
- **[How teachers can use AI chatbots in history class](https://schoolai.com/blog/engaging-in-history-class-using-ai-chatbots-as-a-teaching-tool)** — (2차) · (내용 미확인) 교육 환경에서 AI 챗봇 활용 사례.
- **[Hello History](https://www.hellohistory.ai/)** — (2차) · 역사 인물과 실감 나는 대화를 나누는 AI 앱, 특정 페르소나 구현 참고.
- **[Chat history and semantic search - API](https://community.openai.com/t/chat-history-and-semantic-search/460984)** — (2차) · (내용 미확인) OpenAI API 기반 채팅 히스토리·시맨틱 서치 논의.
- **[AI Voice Cloning - Pitch Avatar](https://pitchavatar.com/ai-voice-cloning/)** — (2차) · 음성 클로닝으로 페르소나 목소리를 확장하는 도구, 보이스 페르소나 레이어 참고.
