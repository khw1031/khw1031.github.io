---
title: 'Intelligence Ownership: AI 성과 격차의 핵심, 소유 vs 임대 분기점'
pubDate: '2026-07-29T18:18:14+09:00'
description: 'AI 투자 상위 25% 기업 매출 2.2배 성장의 비결은 오픈소스 모델의 RL 파인튜닝이다.'
summary: 'Ramp 데이터와 Fermisense의 카탈로그 리뷰 실험을 바탕으로, frontier API 임대 대신 자체 파인튜닝이 정확도 +13%·비용 1/68을 만드는 구조와 적용 조건을 정리한다.'
lang: ko
tags:
  - 'llm'
  - 'ai'
  - 'optimization'
  - 'performance'
  - 'fine-tuning'
canonical: 'https://fermisense.com/when-machines-take-the-wheel/'
lintHash: '09f73de53fa8'
polishHash: '09f73de53fa8'
---

## TL;DR
- AI 성과 격차의 분수령은 모델 성능이 아니라 **"Intelligence Ownership(지능 소유)"**—==오픈소스 모델을 자체 데이터로 RL 파인튜닝해 업무 판단을 가중치에 새기는 것이다.==

## 큰 그림
```
AI 투자 성과 격차 (Ramp 2022.11→2025.12)
│
├─ AI 미투자 기업 ───────── 매출 +15%
│
└─ AI 상위 25% 기업 ─────── 매출 ×2.2
    │
    └─ 승리 playbook
        ├─ ① 프로세스 재설계 (McKinsey: EBIT과 가장 높은 상관)
        ├─ ② 실험 인센티브
        ├─ ③ 비즈니스 컨텍스트 주입 (엔지니어링 프로그램)
        ├─ ④ 사용·임팩트 측정
        └─ ⑤ Intelligence Ownership ★
             │
             ├─ 오픈소스 모델 (예: Qwen3.5-9B)
             ├─ 자체 태스크 데이터 + Digital Twin
             └─ GRPO 강화학습
                  ↓
             Frontier 능가 + 비용 1/68
```

## 핵심
- 2022년 이후 AI 투자는 "무엇을 할 수 있나"에서 "무엇이 실제로 성과로 이어지나"로 질문이 바뀌었다. 저자 주장에 따르면, 성과 격차를 만든 5가지 요인 중 가장 결정적인 것은 **업무 자체를 재설계하고 판단을 모델 가중치에 소유**하는 것이다.
- 프론티어 API(GPT-5.5, Claude Opus 4.8 등)는 프로토타입과 베이스라인 수립에 적합하지만, 호출마다 과금되고 프롬프트마다 맥락을 다시 주입해야 하므로 **대량 반복 의사결정에서는 경제성이 깨진다**(Shopify 기준 연 $500M vs $7M).
- 대안은 오픈소스 소형 모델을 **해당 워크플로의 Digital Twin** 안에서 수천~수만 에피소드로 강화학습시키는 것. Fermisense 실험에서 9B 모델은 약 $500·3.5일 훈련으로 프론티어 최고 구성(76.9%)을 87.3%까지 넘었고, 비용은 1,000건당 $0.50으로 가장 싼 프론티어(Gemini $19) 대비 40배 저렴했다.

## 깊이
- **[성과 격차 근거]** Ramp 데이터(저자 인용, 2차)는 AI 지출 상위 25%가 같은 3년간 매출 2.2배, 무지출군은 15% 성장했다고 **주장**. 인과 방향(선도 기업이라 AI를 썼는지, AI가 성장을 견인했는지)은 원문에서 미검증—**불확실**.
- **[Bridgewater · Harvey · Intercom 공통 패턴]** 세 사례 모두 "프론티어로 상한 확인 → 자체 라벨/루브릭으로 오픈weights 파인튜닝 → 프론티어 대비 정확도↑·비용↓" 순서를 따른다(각 1차 블로그 인용). Harvey는 장주기 법률 업무에서 GPT-5.5·Opus 4.8를 자체 루브릭에서 능가했다고 주장.
- **[Digital Twin 설계]** Amazon Berkeley Objects 실데이터 177,767 에피소드 + 인위적 위반·불일치·hard negative 주입. 스코어러가 **비대칭 비용**(위반 놓침 = 거짓 경보의 7배)을 부여해 비즈니스 우선순위를 보상함수에 직접 인코딩한 점이 핵심.
- **[프롬프트 세금]** 2,800자 최적화 지시는 프론티어 정확도를 소폭 올렸으나, 입력 토큰을 28~55% 밀어올려 **호출마다 영구 과세**된다. ==훈련된 전문 모델은 지시가 가중치에 포함되어 이 세금이 없다.==

## 용어 풀이
- **Intelligence Ownership** — 외부 API에 판단을 빌리지 않고, 모델·평가·데이터를 자사 인프라에 소유하는 전략. 비유: "매번 통역사를 부르는 대신, 사내 절차를 외운 전담 직원 육성." 깨지는 지점: 통역사는 여러 언어를 하지만 전담 직원은 해당 업무만 능하므로 **범용 능력은 희생**됨.
- **GRPO (Group Relative Policy Optimization)** — 보상 모델을 따로 훈련하지 않고 같은 프롬프트의 여러 출력 간 상대 서열로 정책 업데이트를 계산하는 RL 방식. 비유: "반 안에서 서로 채점하며 평균 대비 잘한 답만 강화." 깨지는 지점: 보상이 **상대 비교**이므로 절대 기준이 틀리면 집단 편향이 고정될 수 있음.
- **Digital Twin** — 실제 워크플로를 동일한 도구·데이터·스코어로 재현한 훈련용 시뮬레이션. 비유: "비행 시뮬레이터." 깨지는 지점: 시뮬레이터가 재현 못한 실제 예외는 훈련되지 않아 **현장 drift**에 취약.
- **Prompt tax** — 긴 지시로 인해 매 호출마다 붙는 추가 토큰 비용. 비유: "매번 매뉴얼을 복사해 건네는 비용."

## 시각 자료
| 모델 / 구성 | 품질(%) | 비용($/1k) | 비고 |
|---|---|---|---|
| GRPO 9B (전담) | **87.3** | **0.50** | 훈련 비용 ~$500 |
| 프론티어 최고 (Claude Fable 5 계열) | 76.9 | ~34 | 원문 최고 구성 |
| 프론티어 최저 (Gemini) | ~73 | 19 | 프롬프트 최적화 포함 |
| 프론티어 최고가 (GPT-5.5-pro) | ~74 | 172 | — |
| 9B 미훈련 베이스 | 64.2 | ~0.50 | +23pt = 파인튜닝 이득 |

## 핵심 시사점 / 판단
- **(저자 주장)** "판단이 점수화 가능한 고빈도 업무"는 프론티어 임대를 멈추고 소유로 전환해야 하는 영역. ==빈도 낮거나 결과 검증 불가한 업무는 프론티어+인간이 정답.==
- **(검증 필요·불확실)** Ramp 2.2× 성장 수치는 상관관계일 수 있으며, McKinsey 21% 워크플로 재설계 비율과 METR의 "자기보고 시간절약 과대 40%p"는 본 실험과 직접 인과 미연결.
- **(불확실)** 부록의 8개 사례(Cognition, AT&T, LinkedIn 등) 성과 수치는 각 사 자체 발표 기반—독립 검증 여부 원문에 없음.

## 레퍼런스
- Fermisense 원문 — https://fermisense.com/when-machines-take-the-wheel/ · (2차) · 9B GRPO 전담 모델이 카탈로그 리뷰에서 프론티어 대비 품질↑·비용 1/68 달성 주장.
- Ramp CEO X (AI 지출-매출) — https://x.com/eglyman/status/2036477278394138772 · (1차 데이터, 2차 인용) · 2022.11~2025.12 AI 지출 상위 25% 매출 2.2×.
- Bridgewater × Thinking Machines — https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/ · (1차) · 전문가 라벨 훈련 모델이 프론티어 대비 실수 ~30% 감소.
- Harvey Applied Compute — https://www.harvey.ai/blog/training-a-legal-agent-with-applied-compute · (1차) · 법률 에이전트가 자체 루브릭에서 GPT-5.5·Opus 4.8 능가.
- Intercom Fin Apex — https://www.intercom.com/blog/announcing-fin-apex-the-age-of-vertical-models-is-here/ · (1차) · 수직 도메인 post-trained 모델로 해결률↑·비용↓.
- Shopify Engineering — https://shopify.engineering/leveraging-multimodal-llms · (1차) · 일 4천만 추론 규모에서 프론티어 API 경제성 불가 판단.
- METR AI 사용 설문 — https://metr.org/blog/2026-05-11-ai-usage-survey/ · (1차) · 자기보고 시간 절감이 실측 대비 ~40%p 과대.

## 확인 질문
- Q1(전이): 카탈로그 리뷰 외 "판단 점수화 가능한 고빈도 업무"를 우리 조직에서 3가지 꼽을 수 있는가?
- Q2(왜·어떻게): 프롬프트 최적화가 76.9%에서 수렴하는 이유는 **지시로 열거 불가능한 코너 케이스** 때문이라는 주장을, 우리 업무의 코너 케이스 목록으로 반박·확인할 수 있는가?
- Q3(경계): Ramp 데이터의 인과 방향과 부록 사례의 독립 검증 부재를 감안할 때, "소유가 항상 우위"라는 결론이 **우리 규모·데이터 양**에서도 성립하는가?

> 출처: https://fermisense.com/when-machines-take-the-wheel/
