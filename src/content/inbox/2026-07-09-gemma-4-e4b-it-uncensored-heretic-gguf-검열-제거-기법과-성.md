---
title: 'Gemma 4 E4B-it_uncensored Heretic GGUF: 검열 제거 기법과 성능 트레이드오프 분석'
pubDate: '2026-07-10T02:17:16+09:00'
description: 'Google Gemma 4 E4B-it 모델에 Heretic ARA 기법을 적용해 검열을 제거한 GGUF 모델의 구조, 벤치마크 결과, 트레이드오프를 정리한 학습용 리포트'
summary: '이 리포트는 Gemma 4 E4B-it의 검열 제거(decensoring) 버전이 어떻게 만들어졌는지, 어떤 성능 변화를 겪는지, 그리고 GGUF 양자화로 어떻게 배포되는지를 한 장에 정리한다. 읽으면 abliteration 기법의 원리와 검열 제거가 모델 품질에 미치는 영향을 빠르게 파악할 수 있다.'
lang: ko
tags:
  - 'llm'
  - 'open-source'
  - 'reasoning'
  - 'optimization'
canonical: 'https://huggingface.co/llmfan46/gemma-4-E4B-it-ultra-uncensored-heretic-GGUF'
lintHash: 'd4941eb3160d'
polishHash: 'd4941eb3160d'
---

## TL;DR
- (저자 주장) Heretic ARA 기법으로 Gemma 4 E4B-it의 거부(refusal)를 99/100 → 3/100으로 줄이면서, KL divergence 0.0076 수준으로 원본 품질을 보존했다는 GGUF 배포 모델.

## 큰 그림

```
Google Gemma 4 E4B-it (원본)
  │
  ├─ Dense 아키텍처 (4.5B effective, 42 layers, 128K context)
  ├─ Multimodal: Text + Image + Audio
  └─ 안전 필터 → 높은 refusal (99/100)
        │
        ▼ [Heretic v1.2.0 + ARA 기법]
        │
        ├─ abliteration: refusal 방향 벡터를 weight에서 제거
        │    ├─ 대상: attn.o_proj (layer 7~36)
        │    ├─ preserve_good_behavior_weight: 0.5783
        │    └─ overcorrect_relative_weight: 0.9986
        │
        ▼
llmfan46/gemma-4-E4B-it-ultra-uncensored-heretic
  │
  ├─ refusal: 3/100 (97% 감소)
  ├─ KL divergence: 0.0076 (원본에 매우 근사)
  ├─ PIQA: 85.85% (원본 86.02%, -0.17%p)
  ├─ MMLU: 68.60% (원본 69.46%, -0.86%p)
  │
  └─ GGUF 양자화 배포
       ├─ BF16 / Q8_0 / Q6_K / Q5_K_M / Q5_K_S / Q4_K_M
       └─ Vision Projector (mmproj-BF16) 별도 파일
```

## 핵심

==이 모델의 핵심은 abliteration이라는 사후 기법으로, 이미 학습된 LLM의 weight에서 "거부(refusal)를 유발하는 방향"을 수학적으로 제거한다는 것이다.== 구체적으로는 모델의 특정 layer(7~36)에서 attention 출력 projection(`attn.o_proj`)의 weight 행렬을 분석하고, refusal과 상관 높은 방향 벡터를 ablation(제거/무효화)한다. 이 과정에서 원본 모델의 "좋은 동작"(유용한 답변 능력)을 보존하기 위해 `preserve_good_behavior_weight` 파라미터를 사용하고, 과도한 보정을 막기 위해 `overcorrect_relative_weight`를 조절한다.

그 결과, 거부율은 99/100에서 3/100으로 급감했지만, 이는 검열 제거가 "무료"가 아님을 의미한다. PIQA(-0.17%p)와 MMLU(-0.86%p)에서 소폭의 성능 저하가 관측되었고, KL divergence 0.0076은 원본과 매우 가깝지만 완전히 동일하지는 않음을 보여준다. 최종적으로 이 모델은 GGUF 포맷으로 양자화되어 llama.cpp, LM Studio, Ollama 등 로컬 추론 도구에서 바로 사용할 수 있게 배포된다.

## 깊이

- **[abliteration의 작동 원리]** refusal은 모델 내부에서 특정 "방향"으로 표현된다는 가설이 전제다(저자 주장). 비유하면, 모델의 사고 흐름에서 "이 질문은 위험하니 거부하라"는 신호가 흐르는 특정 신경 경로가 있고, 이 경로의 신호를 외과적으로 차단하는 것이다. ARA(Arbitrary-Rank Ablation)는 기존 abliteration보다 더 유연한 rank 선택이 가능한 개선 방법으로 보인다. **비유가 깨지는 지점**: 실제 신경망에서 "거부 방향"이 깔끔하게 분리된 단일 벡터로 존재한다는 보장은 없으며, 여러 개념이 얽힌 표현 공간에서 일부를 제거하면 예상치 못한 부작용이 생길 수 있다.

- **[성능 트레이드오프의 구체적 수치]** MMLU에서 세부 과목을 비교하면, `moral_scenarios`가 43.91% → 41.23%(-2.68%p)로 가장 크게 하락한 반면, `philosophy`는 70.74%로 변동이 없다. 이는 검열 제거가 윤리적 추론이 필요한 영역에 더 큰 영향을 미칠 수 있음을 시사한다(원문 데이터 기반 추론, 인과관계는 불확실).

- **[GGUF 양자화 스펙트럼]** BF16(풀 정밀도)부터 Q4_K_M(제한된 VRAM용)까지 6단계 양자화를 제공한다. Vision Projector(mmproj)는 BF16만 제공되므로, 멀티모달 사용 시 이미지 처리는 풀 정밀도로만 가능하다. 원문에 명시된 권장 사항은 "Q8_0: near-lossless, recommended"이다.

- **[Gemma 4 E4B의 기반 아키텍처]** "E"는 effective parameters를 의미한다. 총 8B 파라미터 중 4.5B만 추론에 사용되며, 나머지는 Per-Layer Embeddings(PLE)로 각 layer가 토큰별 소형 embedding을 가져가는 구조다. 이는 온디바이스 배포를 위해 메모리 효율을 극대화한 설계다(원문 사실).

## 용어 풀이

- **Abliteration** — 모델 weight에서 특정 행동(예: 거부)을 유발하는 방향 벡터를 제거하는 사후 기법 / 비유: 라디오에서 특정 주파수만 차단하는 노치 필터 / 깨지는 지점: 라디오 필터는 주파수가 물리적으로 분리되지만, 신경망 표현 공간에서는 "거부"와 "유용한 답변"이 완전히 분리되지 않을 수 있다.

- **KL divergence** — 두 확률 분포의 차이를 측정하는 지표. 여기서 0에 가까울수록 원본 모델과 출력 분포가 유사함을 의미 / 비유: 두 사람이 같은 질문에 대해 얼마나 다른 확률로 답변하는지 / 깨지는 지점: KL divergence가 낮아도 특정 입력(예: 민감한 주제)에서는 큰 차이가 날 수 있다.

- **ARA (Arbitrary-Rank Ablation)** — Abliteration의 개선 방법으로, 제거할 방향의 rank를 유연하게 선택 가능 / 원문에 상세 알고리즘 설명은 없음.

- **GGUF** — llama.cpp 생태계에서 사용하는 모델 파일 포맷. 양자화된 weight와 메타데이터를 단일 파일에 담음 / 비유: 압축된 ZIP 파일처럼 모델을 하나의 파일로 패키징.

- **Per-Layer Embeddings (PLE)** — 각 decoder layer가 토큰마다 자체적인 소형 embedding을 갖는 구조 / 비유: 같은 단어를 각 층이 약간씩 다른 "렌즈"로 바라봄.

- **attn.o_proj** — Transformer attention 블록의 output projection 레이어. attention 결과를 residual stream에 투영하는 역할.

## 시각 자료

**벤치마크 비교표 (decensored vs 원본)**

| 지표 | 원본 | Decensored | 차이 |
|---|---|---|---|
| Refusal (100개 샘플) | 99/100 | 3/100 | -96 (저자 주장) |
| KL divergence | 0 (정의상) | 0.0076 | +0.0076 |
| PIQA | 86.02% | 85.85% | -0.17%p |
| MMLU 전체 | 69.46% | 68.60% | -0.86%p |
| MMLU moral_scenarios | 43.91% | 41.23% | -2.68%p |
| MMLU philosophy | 70.74% | 70.74% | 0 |

**Abliteration 파라미터 매핑**

| 파라미터 | 값 | 역할 (추론) |
|---|---|---|
| start_layer / end_layer | 7 / 36 | 적용 범위: 전체 42 layer 중 중간~후반 |
| preserve_good_behavior_weight | 0.5783 | 원본 유용성 보존 강도 |
| steer_bad_behavior_weight | 0.0001 | 거부 방향 제거 강도 (매우 낮음) |
| overcorrect_relative_weight | 0.9986 | 과보정 방지 (거의 1.0) |
| neighbor_count | 15 | 주변 벡터 참조 수 |

## 핵심 시사점 / 판단

- **(저자 주장)** 97% 거부 감소와 0.0076 KL divergence를 동시에 달성했다 → 검열 제거와 품질 보존이 양립 가능하다는 주장. 다만 refusal 테스트가 100개 샘플에 불과하고, 테스트 프롬프트 구성이 원문에 공개되지 않아 재현 가능성 불확실.

- **(저자 주장)** Heretic v1.2.0 + ARA 방법론 사용 → 오픈소스 도구(p-e-w/heretic) 기반이라 방법론 자체는 검증 가능하나, 파라미터 튜닝의 적절성은 별도 평가 필요.

- **(검증 필요·불확실)** "검열 제거 = 안전 장치 제거"이므로, 이 모델을 프로덕션에서 사용할 경우 유해 콘텐츠 생성에 대한 별도 가드레일이 필수적이나 원문에서는 이에 대한 구체적 가이드가 없음.

- **(사실)** GGUF 양자화와 Vision Projector 파일이 제공되어 로컬 배포 준비가 완료된 상태. llama.cpp, LM Studio, Ollama 호환.

- **(원문에 없음)** ARA 기법의 수학적 세부 내용, refusal 테스트용 프롬프트 세트, 장기적 안정성(모델 드리프트 등)에 대한 정보는 원문에 포함되지 않았다.

## 레퍼런스

- Heretic (abliteration 도구) — https://github.com/p-e-w/heretic · (1차) · LLM weight에서 refusal 방향을 제거하는 오픈소스 프레임워크.
- ARA Pull Request — https://github.com/p-e-w/heretic/pull/211 · (1차) · Arbitrary-Rank Ablation 기법의 구현 PR.
- Google Gemma 4 원본 모델 — https://huggingface.co/google/gemma-4-E4B-it · (1차) · 이 모델의 기반이 되는 Google DeepMind의 Gemma 4 E4B-it.
- Gemma 4 Launch Blog — https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/ · (1차) · Google 공식 Gemma 4 출시 발표.
- Gemma 4 Documentation — https://ai.google.dev/gemma/docs/core · (1차) · 아키텍처, 사용법, 라이선스 공식 문서.
- llmfan46/gemma-4-E4B-it-ultra-uncensored-heretic (fp16 원본) — https://huggingface.co/llmfan46/gemma-4-E4B-it-ultra-uncensored-heretic · (2차) · 이 GGUF 모델의 fp16 소스 모델.

## 확인 질문

- Q1(전이): 이 ARA 기반 abliteration 기법을 Gemma 4의 다른 크기(E2B, 26B A4B, 31B)나 다른 모델 패밀리(Llama, Qwen 등)에 적용하면 동일한 refusal 감소율과 KL divergence를 얻을 수 있을까?
- Q2(왜·어떻게): `steer_bad_behavior_weight`가 0.0001로 매우 낮은데도 refusal이 97% 감소한 이유는 무엇이며, 이 파라미터가 실제로 어떤 수학적 연산에 어떻게 작용하는가?
- Q3(경계): refusal 3/100은 여전히 3개의 프롬프트를 거부했다는 뜻인데, 거부한 3개와 거부하지 않은 97개의 경계 기준은 무엇이며, 이것이 모델의 "안전성"을 어떻게 정의하는가?

> 출처: https://huggingface.co/llmfan46/gemma-4-E4B-it-ultra-uncensored-heretic-GGUF
