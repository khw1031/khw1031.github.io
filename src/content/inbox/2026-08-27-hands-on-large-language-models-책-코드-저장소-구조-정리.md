---
title: 'Hands-On Large Language Models 책·코드 저장소 구조 정리'
pubDate: '2026-08-27T16:33:17+09:00'
description: 'O''Reilly 출간 LLM 실습서 12장 구성, Colab 노트북·보너스 가이드·서평을 한 장으로 파악'
summary: 'Jay Alammar·Maarten Grootendorst 공저의 ''Illustrated LLM Book'' 공식 코드 저장소. 12장 Colab 노트북이 기초→내부 구조→활용→fine-tuning 순으로 이어지며, 보너스 시각 가이드 6편이 최신 주제를 보충한다.'
lang: ko
tags:
  - 'llm'
  - 'hands-on'
  - 'transformer'
  - 'fine-tuning'
  - 'rag'
canonical: 'https://github.com/HandsOnLLM/Hands-On-Large-Language-Models'
lintHash: '27f7414a8f53'
---

## TL;DR
- LLM 개념부터 fine-tuning까지 12장 Colab 노트북 + 약 300장 그림으로 구성된 O'Reilly 실습서의 공식 코드 저장소.

## 큰 그림
```
[Hands-On LLM Book (O'Reilly, 2024)]
│
├─ 기초 구축 (Ch 1~3)
│   LM 소개 → Token·Embedding → Transformer 내부
│
├─ 활용·응용 (Ch 4~9)
│   분류 / 클러스터링·토픽 / Prompt / 생성 / RAG / Multimodal
│
├─ 모델 제작·튜닝 (Ch 10~12)
│   Embedding 모델 구축 → BERT fine-tune → 생성 모델 fine-tune
│
├─ Bonus 시각 가이드 6편
│   Mamba · Quantization · Stable Diffusion · MoE · Reasoning · DeepSeek-R1
│
└─ 환경: Google Colab(T4 16GB 무료) 권장 / 로컬 conda·PyTorch 가이드 동봉
```

## 핵심
이 책은 "그림으로 배우는 LLM"을 표방하며, 저자들이 직접 그린 약 300장의 커스텀 그림이 텍스트 설명을 대체·보완한다. 12장은 단순 나열이 아니라 **의존 사슬**을 이룬다: Ch 1~3에서 token·embedding·attention이라는 언어를 익혀야, Ch 4~9에서 분류·RAG·multimodal 같은 응용 태스크를 "왜 그렇게 동작하는지" 이해할 수 있고, 그 위에 Ch 10~12에서 모델을 직접 만들거나 fine-tune하는 실습이 올라간다. 즉, **개념 → 활용 → 구축**의 3단 구조다.

실행 환경은 Google Colab(T4 GPU 16GB)을 1순위로 권장하며, 로컬 설치는 `.setup` 폴더의 conda 가이드를 따른다. 저자들은 "다른 클라우드도 동작하지만 결과가 미세히 다를 수 있다"고 명시한다.

## 깊이
- **[기초 구축·Ch 2 Token/Embedding]** 모든 장의 토대. 텍스트를 이산 token으로 쪼개고, 이를 연속 벡터(embedding)로 매핑하는 과정을 다룬다. 이 매핑이 없으면 이후 분류·검색·생성이 모두 불가능하므로, 책 전체의 "공용 어휘" 역할을 한다.
- **[활용·Ch 8 RAG]** semantic search와 retrieval-augmented generation을 결합한다. 단순 검색이 아니라 "검색 결과를 context로 주입해 생성 품질을 높이는" 파이프라인을 실습한다. 원문에 따르면 이 장이 책의 핵심 응용 축 중 하나다.
- **[Bonus·Reasoning LLMs & DeepSeek-R1]** 400쪽 본서에 담지 못한 최신 주제를 별도 시각 가이드로 보충. 저자 주장에 따르면 "책을 압도하지 않으면서도" 새 주제를 계속 추가하는 구조다.

## 용어 풀이
- **Embedding** — 단어를 숫자 벡터로 바꾸는 것. 비유: 단서에 좌표를 부여해 "의미가 가까운 단어 = 가까운 점"으로 만드는 지도. 한계: 지도가 2차원이 아니고 수백 차원이므로 직관적 거리감이 깨진다.
- **RAG (Retrieval-Augmented Generation)** — 생성 전에 외부 문서를 검색해 prompt에 끼워 넣는 방식. 비유: 시험 때 교과서 펼쳐 놓고 답안 쓰기. 한계: 검색 품질이 나쁘면 오히려 오답을 유도한다.
- **Fine-tuning** — 사전 학습된 모델 가중치를 특정 데이터로 추가 학습. 비유: 범용 요리사에게 한식 레시피만 집중 훈련. 한계: 원본 지식이 완전히 사라지진 않는다.

## 시각 자료
| 구분 | 장 | 핵심 키워드 |
|---|---|---|
| 기초 | 1·2·3 | LM 소개, Token/Embedding, Transformer 내부 |
| 응용 | 4·5·6·7·8·9 | 분류, 클러스터링, Prompt, 생성, RAG, Multimodal |
| 구축 | 10·11·12 | Embedding 모델, BERT FT, 생성 모델 FT |
| 보너스 | — | Mamba, Quant, SD, MoE, Reasoning, DeepSeek-R1 |

## 핵심 시사점 / 판단
- (저자 주장) "거의 300장 커스텀 그림"으로 시각 교육 효과를 극대화한다는 점은 서평(Andrew Ng, Nils Reimers 등)에서도 일관되게 언급된다. 다만 서평 자체도 2차 홍보 성격이므로 독립 검증은 아니다.
- (저자 주장) Colab T4 16GB로 전 예제 실행 가능. 실제 모든 장이 이 사양에서 안정 동작하는지는 **불확실**(원문은 "should be the most stable"이라 표현).
- (사실) O'Reilly 출간, ISBN 978-1098150969, 2024년. 저자·출판사 정보는 확인 가능.
- 보너스 가이드 6편은 본서와 별도 뉴스레터·블로그 링크로 연결되며, 내용 깊이는 원문에 없음(링크만 제공).

## 레퍼런스
- 공식 저장소 — https://github.com/HandsOnLLM/Hands-On-Large-Language-Models · (1차) · 12장 노트북·보너스·설치 가이드 원본.
- O'Reilly 페이지 — https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/ · (1차) · 출간 정보·목차 확인.
- DeepLearning.AI 코스 — 원문 배너 링크 · (2차) · Transformer LLM 작동 원리 단기 코스 홍보.

## 확인 질문
- Q1(전이): 이 책의 "개념→활용→구축" 3단 구조를 사내 LLM 교육 커리큘럼에 그대로 이식할 때, 어떤 장을 건너뛰어도 학습 사슬이 끊기지 않는가?
- Q2(왜·어떻게): Ch 8 RAG 실습에서 검색 품질이 낮을 때 생성 결과가 어떻게 퇴화하는지, 책에서 어떤 실패 사례를 보여주는가?
- Q3(경계): 보너스 가이드(Reasoning, DeepSeek-R1)는 본서 이후 시점의 내용인데, 본서 12장 지식만으로 보너스를 이해할 수 있는가 아니면 별도 사전 지식이 필요한가?

> 출처: https://github.com/HandsOnLLM/Hands-On-Large-Language-Models
