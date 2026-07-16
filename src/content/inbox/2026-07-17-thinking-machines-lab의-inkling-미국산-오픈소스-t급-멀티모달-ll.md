---
title: 'Thinking Machines Lab의 Inkling: 미국산 오픈소스 T급 멀티모달 LLM'
pubDate: '2026-07-17T02:24:03+09:00'
description: '전 OpenAI CTO 미라 무라티의 회사가 공개한 975B MoE 모델 Inkling의 성능과 의의'
summary: 'Inkling은 미국에서 공개된 최고 성능의 오픈소스 T급 멀티모달 모델로, 오디오 지원과 1M 컨텍스트를 제공하며 Muon optimizer를 채택했다.'
lang: ko
tags:
  - 'llm'
  - 'open-source'
  - 'ai'
  - 'multimodal'
  - 'optimization'
canonical: 'https://www.linkedin.com/posts/kiwoong-yeom_chatgpt%EC%9D%98-%EC%96%B4%EB%A8%B8%EB%8B%88-%EC%A0%84-openai-cto-%EB%AF%B8%EB%9D%BC-%EB%AC%B4%EB%9D%BC%ED%8B%B0%EC%9D%98-%ED%9A%8C%EC%82%AC-thinking-share-7483416064022839296-xzvk/?utm_source=social_share_send&utm_medium=ios_app&rcm=ACoAAB15JU0Bh0ozoFHKUp6BqJa4W5v2yqNn5k8&utm_campaign=share_via'
lintHash: 'f2562301680e'
---

## TL;DR
- 전 OpenAI CTO 미라 무라티의 Thinking Machines Lab이 미국 최고 성능의 오픈소스 T급 멀티모달 모델 Inkling을 Apache-2.0으로 공개했다.

## 큰 그림
```
오픈소스 LLM 생태계 (2026년 7월 기준)
│
├─ 중국 계열
│  ├─ Kimi 2.6 ───────────────┐
│  ├─ GLM 5.2 ────────────────┤ (성능 상위)
│  ├─ DeepSeek V4 Pro ────────┘
│  └─ Kimi K2.5 ───────────────── (Inkling보다 아래)
│
├─ 미국 계열
│  ├─ Inkling (Thinking Machines) ─── 975B MoE, 멀티모달, 1M ctx
│  ├─ Gemma 4 (Google) ────────────── 기강잡기 역할
│  └─ Nemotron 3 Ultra (NVIDIA) ───── Inkling보다 아래
│
└─ 기술 트렌드
   ├─ MoE 아키텍처 표준화
   ├─ Muon optimizer 부상
   └─ 멀티모달 + 긴 컨텍스트 필수화
```

## 핵심
- Thinking Machines Lab은 전 OpenAI CTO 미라 무라티가 설립한 회사로, Inkling이라는 T급(Trillion-parameter class) 모델을 공개했다. 이 모델은 총 975B 파라미터를 가지지만 MoE(Mixture of Experts) 구조로 추론 시 41B만 활성화되어 효율성을 확보했다.
- Inkling은 텍스트뿐 아니라 오디오까지 처리하는 범용 멀티모달 모델이며, 1M 토큰 컨텍스트를 지원한다. 이는 단일 프롬프트로 책 한 권 분량을 처리할 수 있음을 의미한다.
- 성능 면에서는 NVIDIA Nemotron 3 Ultra와 Kimi K2.5를 능가하지만, Kimi 2.6, GLM 5.2, DeepSeek V4 Pro에는 미치지 못한다. 저자는 이를 "미국 내 최고 성능 오픈 모델"로 평가하며, 중국 모델 대비 신뢰도 우위를 **주장**한다.

## 깊이
- **[MoE 구조와 효율성]** 975B 파라미터 전체를 쓰지 않고 41B만 활성화한다는 것은 전문가(Specialist) 100명 중 4~5명만 호출하는 것과 유사하다. 이 비유는 라우팅 오버헤드와 전문가 간 부하 불균형 문제를 설명하지 못한다. 실제 추론 효율은 활성화 파라미터만으로 판단하기 어렵다.
- **[Muon optimizer의 부상]** 저자는 "AdamW가 아닌 Muon이 표준이 된 것 같다"고 **주장**한다. Muon은 모멘텀 기반 옵티마이저로 AdamW 대비 메모리 효율이 높다고 알려졌으나, 모든 아키텍처에서 우월하다는 검증은 **불확실**하다. Inkling이 Muon을 채택한 것은 사실이나, 이것이 성능 차이의 주원인인지는 원문에 근거가 없다.
- **[지식 밀도 비교]** 저자는 개인 경험으로 GLM 5.2가 "지식이 부족하다"고 느끼며, Inkling이 더 큰 모델이라 이 부분이 나을 것이라 **기대**한다. 이는 주관적 인상으로, 벤치마크 데이터가 아닌 개인 사용감에 기반한다.

## 용어 풀이
- **T급 모델** — Trillion(조) 단위 파라미터 클래스 / 비유: 도시 인구 규모(조 명) / 깨지는 점: MoE에서는 총 파라미터가 실제 추론 성능과 비례하지 않음
- **MoE (Mixture of Experts)** — 여러 전문 네트워크 중 일부만 활성화하는 구조 / 비유: 종합병원에서 해당 과 의사만 배정 / 깨지는 점: 라우터 판단 오류 시 잘못된 전문가가 응답할 수 있음
- **1M 컨텍스트** — 100만 토큰을 한 번에 처리 / 비유: A4 3,000페이지를 동시에 기억 / 깨지는 점: 토큰당 정보 밀도에 따라 실제 체감 용량은 다름

## 시각 자료
| 모델 | 출처 | 파라미터 | 멀티모달 | Inkling 대비 성능 |
|------|------|----------|----------|------------------|
| Inkling | Thinking Machines (미국) | 975B (A41B) | 텍스트+오디오 | 기준 |
| Kimi 2.6 | Moonshot (중국) | 비공개 | 텍스트 중심 | 상위 |
| GLM 5.2 | Zhipu (중국) | 비공개 | 멀티모달 | 상위 |
| DeepSeek V4 Pro | DeepSeek (중국) | 비공개 | 멀티모달 | 상위 |
| Nemotron 3 Ultra | NVIDIA (미국) | 비공개 | 텍스트 | 하위 |
| Kimi K2.5 | Moonshot (중국) | 비공개 | 텍스트 | 하위 |

## 핵심 시사점 / 판단
- **(저자 주장)** 미국산 오픈 모델은 중국 모델보다 신뢰도가 높으며, Inkling은 미국 최고 성능 오픈 모델이다.
- **(저자 주장)** Muon이 새로운 optimizer 표준으로 자리잡고 있다.
- **(저자 주장)** LLM 제작은 기술적으로 쉬워졌으나 GPU와 자본 접근성이 핵심 병목이다.
- **(검증 필요·불확실)** Inkling이 GLM 5.2보다 지식 밀도에서 우월하다는 주장은 벤치마크 없이 개인 경험에 기반한다.
- **(검증 필요·불확실)** 오디오 멀티모달 성능이 텍스트 성능과 동등한 수준인지는 원문에 명시되지 않음.

## 레퍼런스
- Thinking Machines Lab Inkling 공식 발표 — https://thinkingmachines.ai/news/introducing-inkling · (1차) · 공식 모델 소개 및 성능 공개
- Hugging Face Inkling 모델 페이지 — https://huggingface.co/thinkingmachines/Inkling · (1차) · Apache-2.0 라이센스 모델 가중치 및 기술 문서
- kiwoong yeom LinkedIn 게시물 — https://www.linkedin.com/posts/kiwoong-yeom_chatgpt... · (2차) · 한국어 해설 및 업계 맥락 분석

## 확인 질문
- Q1(전이): Inkling의 MoE 구조가 다른 도메인(코드 생성, 수학 추론)에서도 동일하게 효율적인가?
- Q2(왜·어떻게): Muon optimizer가 AdamW 대비 어떤 메커니즘으로 메모리 효율을 달성하는가?
- Q3(경계): "미국산 = 신뢰도 높음"이라는 주장이 기술적 근거인가, 지정학적 편향인가?

> 출처: https://www.linkedin.com/posts/kiwoong-yeom_chatgpt%EC%9D%98-%EC%96%B4%EB%A8%B8%EB%8B%88-%EC%A0%84-openai-cto-%EB%AF%B8%EB%9D%BC-%EB%AC%B4%EB%9D%BC%ED%8B%B0%EC%9D%98-%ED%9A%8C%EC%82%AC-thinking-share-7483416064022839296-xzvk/?utm_source=social_share_send&utm_medium=ios_app&rcm=ACoAAB15JU0Bh0ozoFHKUp6BqJa4W5v2yqNn5k8&utm_campaign=share_via
