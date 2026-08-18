---
title: 'Meta Muse Glimmer 로컬 에이전틱 모델 출시와 평가 한계'
pubDate: '2026-08-11T23:45:32+09:00'
noteId: AI-2608-004
description: 'Meta가 공개한 30B급 로컬 에이전틱 멀티모달 모델 Muse Glimmer의 구조, 학습, 양자화·추론 최적화, benchmark 결과와 비교 방법의 한계를 정리한 원문 캡처.'
summary: 'Muse Glimmer는 약 29.6B dense Transformer와 perception encoder를 결합하고, 17GB급 4-bit 양자화와 DFlash speculative decoding으로 24GB 소비자 장치에서 장기 실행 agent workflow를 겨냥한다. 여러 agentic benchmark에서 같은 크기대 모델과 경쟁하지만, 비교 점수는 자체 재현·타사 자체 보고·Artificial Analysis 결과가 섞여 있고 scaffold도 완전히 같지 않아 독립 검증이 필요하다.'
lang: ko
tags:
  - ai-model
  - agent
  - local-llm
  - open-weights
  - multimodal
  - quantization
  - speculative-decoding
  - evaluation
canonical: 'https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model'
lintHash: 'c4438c509662'
---

# TL;DR

- **무엇을 공개했나** — Meta Superintelligence Labs가 약 29.6B 규모의 text+image 입력, text 출력 모델 Muse Glimmer의 가중치를 Apache 2.0으로 공개했다. 131,072+ context, tool use, multi-step reasoning, failure recovery, coding, computer use를 한 모델 안에서 겨냥한다.
- **왜 로컬에서 도는가** — 4-bit에 가까운 K-Quant로 language model을 20GB 미만, 가장 작은 배포본을 약 17GB로 줄였다. perception encoder, KV cache, DFlash drafter까지 포함해 24GB 또는 32GB memory envelope 안에서 실행하는 구상이다.
- **무엇이 빠른가** — DFlash drafter가 16-token block을 먼저 제안하고 본 모델이 병렬 검증한다. Meta 측 측정에서 17GB 양자화 모델의 decode 속도는 RTX 5090에서 74.9→233.4 tok/s(3.1배), M4 Max에서 23.7→37.8 tok/s(1.5배), M5 Max에서 26.6→50.2 tok/s(1.8배)였다.
- **성능은 어떻게 봐야 하나** — MCP-Atlas, DeepSearch QA, SWE-Bench Pro 등에서는 비교 모델보다 높지만, SkillsBench·OSWorld-Verified·SWE-Bench Verified 등에서는 Qwen3.6-27B가 높다. 더 중요한 단서는 점수 출처가 내부 재현, 타사 자체 보고, Artificial Analysis로 섞여 있고 model별 action space와 sampling도 일부 다르다는 점이다.
- **결론** — 이 출시는 “30B도 로컬에서 돈다”보다 **agent model의 배포 단위를 가중치 하나가 아니라 양자화 모델 + perception encoder + KV cache + speculative drafter + scaffold로 본다**는 데 의미가 있다. 반면 local-first가 곧 안전을 뜻하지는 않는다. 실제 행동을 맡기려면 prompt injection 방어와 되돌릴 수 없는 작업의 사람 확인이 여전히 필요하다.

## 모델 한눈에 보기

| 항목 | 내용 |
| --- | --- |
| 구조 | Dense Causal Transformer + 약 1.8B ViT-G/14 perception encoder |
| 전체 규모 | 약 29.6B parameters(vision encoder 포함) |
| Transformer | 52 layers, hidden size 6,656, GQA 32 query / 2 KV heads |
| attention | local 3개 + global 1개 반복, local sliding window 2,048 |
| context | 131,072+ tokens |
| 입출력 | text+image 입력, text 출력 |
| 언어 | 100개가 넘는 언어로 학습했다고 보고 |
| 지식 기준일 | 2026-01-04 |
| reasoning strength | low / medium / high / xhigh |
| 공개 범위 | BF16 weights, 4-bit 양자화 2종, DFlash drafter head, perception encoder |
| 라이선스 | Apache 2.0 |

Meta 원문은 “open sourcing”이라고 표현하지만, 정확한 분류는 **open-weight release**다. 가중치와 배포 artifact는 공개됐지만 학습 data, 전체 학습 code, data curation pipeline까지 재현 가능하게 공개된 것은 아니다.

## 학습 방법

학습은 큰 teacher인 Muse Spark에서 작은 로컬 모델로 agentic behavior를 옮기는 세 단계다.

1. **Pre-training** — Muse Spark 출력에 대한 logit distillation과 teacher와 비슷한 data mix를 사용한다.
2. **Mid-training** — 더 긴 context, agent 비중이 높은 data, 더 풍부한 reasoning trace를 organic data와 함께 학습한다.
3. **Post-training** — supervised fine-tuning, on-policy distillation, reinforcement learning을 general·reasoning·coding·agentic domain에 적용한다.

여기서 제품 방향이 드러난다. 일반 base model을 줄인 뒤 agent scaffold가 모든 동작을 가르치는 구조가 아니라, **tool schema 준수·장기 계획·오류 후 retry·multimodal perception을 weight에 미리 학습하고 scaffold는 실행 경계를 제공하는 구조**다.

## 로컬 배포 설계

### memory를 줄이는 K-Quant

Full precision 30B model은 55GB가 넘는 memory가 필요하다. 공개된 양자화 선택지는 다음과 같다.

| 배포본 | 15개 benchmark 평균 성능 저하 | 목표 hardware memory |
| --- | ---: | ---: |
| Full Precision | 기준 | 64GB VRAM |
| K-Quant-Dynamic | 0.2% | 32GB VRAM |
| K-Quant-17GB | 1.0% | 24GB VRAM |

17GB는 전체 runtime memory가 아니라 **weight 크기에 가까운 이름**으로 읽어야 한다. 실제 실행에는 KV cache, perception encoder, DFlash drafter와 runtime overhead가 더 필요하므로 Meta도 24GB를 목표 envelope로 잡는다. “Mac에서 실행”도 모든 Mac을 뜻하지 않고, 원문 측정 대상은 M4 Max·M5 Max급 unified memory 장치다.

### decode를 빠르게 하는 DFlash

DFlash는 5-layer block diffusion drafter가 한 번에 16 tokens를 제안하고, 52-layer 본 모델이 그 제안을 병렬로 검증하는 lossless speculative decoding 방식이다. 틀린 draft는 본 모델이 고치므로 같은 sampling 조건에서 output quality를 바꾸지 않고 decode throughput을 높이는 것이 목표다.

| 장치 | speculation 없음 | DFlash 평균 | 향상 |
| --- | ---: | ---: | ---: |
| Nvidia RTX 5090 | 74.9 tok/s | 233.4 tok/s | 3.1배 |
| Apple M4 Max | 23.7 tok/s | 37.8 tok/s | 1.5배 |
| Apple M5 Max | 26.6 tok/s | 50.2 tok/s | 1.8배 |

측정은 batch size 1, greedy decoding, 여러 prompt 평균이다. Mac은 ExecuTorch, RTX는 llama.cpp를 썼으므로 hardware뿐 아니라 runtime 차이도 포함된 수치다.

## agentic benchmark에서 보이는 위치

공개 표 전체 중 agent 실행 성격이 강한 항목만 추렸다. 굵은 판단을 피하기 위해 세 모델의 수치를 그대로 둔다.

| benchmark | Muse Glimmer-30B | Gemma4-31B | Qwen3.6-27B |
| --- | ---: | ---: | ---: |
| MCP-Atlas | 75.5 | 54.2 | 62.5 |
| DeepSearch QA | 74.6 | 61.7 | 71.1 |
| Gaia2 | 43.3 | 36.4 | 40.0 |
| SkillsBench(with skills) | 44.3 | 32.4 | 46.6 |
| OSWorld-Verified | 65.9 | 58.5 | 75.6 |
| SWE-Bench Pro | 51.2 | 36.9 | 50.2 |
| SWE-Bench Verified | 76.0 | 66.6 | 77.2 |
| Terminal-Bench 2.1 | 51.7 | 43.4 | 60.7 |

이 표는 Muse Glimmer가 모든 agentic task에서 우세하다는 증거가 아니다. **tool server를 많이 쓰는 MCP-Atlas와 autonomous browsing인 DeepSearch QA에서는 강하고, GUI computer use·skill 활용·terminal task에서는 Qwen3.6-27B가 더 높다.** model의 상대적 강점이 scaffold와 task 유형에 따라 달라지는 모습이다.

## 평가 방법에서 남는 단서

- **출처 혼합** — 비교 모델은 “자체 보고와 Meta 내부 재현 중 더 유리한 값”을 사용하고, 세 모델에 모두 Artificial Analysis 결과가 있으면 그 값을 썼다. 한 표 안 숫자가 하나의 동일한 실험에서 나온 것이 아니다.
- **sampling 차이** — Muse Glimmer와 Gemma4는 대체로 `temperature=1.0`, `top_p=0.95`, `top_k=64`이고 Qwen3.6은 `top_k=20`이다. GAIA2·WildClawBench의 Qwen은 `temperature=0.6`을 사용한다.
- **scaffold 차이** — 같은 평가 framework를 쓰려 했지만, Meta도 자사 tool과 system prompt가 타사 모델에 맞게 조정되지 않았을 수 있다고 적었다. OSWorld에서는 Muse·Qwen과 Gemma가 서로 다른 computer-use action space를 쓴다.
- **judge 의존** — MCP-Atlas는 Gemini 2.5 Pro, DeepSearch QA·Gaia2는 gpt-oss-120b, WildClawBench 일부와 BEAM-128K는 GPT-5.4를 judge로 쓴다. SkillsBench·SWE-Bench처럼 test가 결정적으로 판정하는 항목과 증거 강도가 다르다.
- **반복 평균** — 주요 내부 평가는 task당 3~4회 평균을 내 분산을 줄였지만, 표에는 confidence interval이나 run-level 분포가 없다.
- **수정된 protocol** — OmniDocBench는 공식 v1.6 MGAM 대신 내부 scoring 구현을 사용한다. 같은 benchmark 이름만 보고 공개 leaderboard와 직접 비교하면 안 된다.

따라서 이 결과는 **동급 open-weight model 중 유력한 agent 후보라는 1차 증거**이지, 독립된 공정 비교의 결론은 아니다. 실제 선택은 같은 hardware, quantization, scaffold, tool schema, turn budget으로 다시 측정해야 한다.

## 안전과 privacy

로컬 실행은 prompt·file·개인 context를 cloud에 보내지 않을 선택지를 제공한다. 하지만 agent가 일정, message, file, browser에 깊게 접근할수록 **data가 어디서 계산되는가**와 **model이 어떤 행동을 허가받는가**는 별개 문제가 된다.

Meta의 자체 Siren AgentDojo 평가에서 prompt injection 공격 성공률은 Muse 28.4%, Gemma4 25.6%, Qwen3.6 40.3%였다. Muse가 utility 94.2%로 가장 높았지만 공격 성공률이 0과 멀다. model card도 되돌릴 수 없는 행동에는 human-in-the-loop 확인과 use-case별 별도 안전 평가를 권한다.

즉 local-first의 실질적 장점은 **data egress를 줄일 수 있음**이지 **도구 오용·간접 prompt injection·과도한 권한을 해결함**이 아니다. 안전 경계는 weight보다 scaffold의 permission, confirmation, audit log에 남는다.

## 이 출시에서 읽히는 방향

- **agent model의 배포 artifact가 묶음이 된다** — 본 모델만 내려받는 것이 아니라 quantized target, perception encoder, drafter, chat template, generation config가 함께 배포된다.
- **로컬 agent의 병목이 memory에서 latency로 이동한다** — 4-bit로 “올라가는가”를 해결한 뒤에는 multi-step loop의 반복 latency가 문제라 speculative decoding을 결합한다.
- **agent 성능은 model×scaffold의 결과다** — OpenClaw, Hermes Agent 같은 scaffold 호환성을 model feature로 내세우고, 평가 방법도 harness·action space 차이가 점수에 개입함을 보여 준다.
- **개인 context는 local model의 가장 강한 use case이자 가장 큰 위험 면적이다** — cloud 전송을 줄이는 대신 file·calendar·message에 상시 접근하는 local process가 생긴다. 최소 권한과 action 확인이 제품 설계의 중심이 된다.
- **작은 judge model이라는 선택지가 넓어진다** — 30B model을 local LLM-as-a-judge로 쓸 수 있지만, 자기 model이나 같은 계열 output을 평가할 때의 bias와 judge calibration은 별도 검증해야 한다.

## 열린 질문

- K-Quant artifact와 DFlash를 llama.cpp·MLX·ExecuTorch에서 실제로 설치했을 때 24GB 장치의 최대 usable context와 end-to-end agent latency는 얼마인가?
- 131K context에서 local attention 3개 + global attention 1개 반복이 긴 tool trace의 state tracking에 어떤 failure pattern을 만드는가?
- Meta 내부 scaffold가 아닌 동일한 공개 harness와 동일 turn budget으로 Muse·Gemma·Qwen을 다시 비교하면 순위가 유지되는가?
- 100개가 넘는 학습 언어 중 한국어 tool use, coding instruction, multimodal document 이해 성능은 어느 수준인가? model card는 언어별 결과를 공개하지 않았다.
- Apache 2.0 artifact 공개 뒤 학습 recipe·data mix·evaluation harness가 어느 범위까지 공개돼 독립 재현이 가능해지는가?

## 레퍼런스

- (1차) [Introducing Muse Glimmer: An Open Agentic Model That Runs on Your Device](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model) — Meta Superintelligence Labs의 출시 원문. 2026-08-10 게시·수정본, 2026-08-11 확인.
- (1차) [Muse Glimmer Model Card](https://huggingface.co/meta-models/Muse-Glimmer-30B/blob/97c77dff50b2797bcc558fa2d909761dbc575c59/README.md) — architecture, quantization, benchmark, safety, intended use의 상세 근거. commit `97c77dff50b2797bcc558fa2d909761dbc575c59`, 2026-08-11 확인.
- (1차) [Muse Glimmer Evaluation Methodology](https://research.meta.ai/static/muse-glimmer-methodology) — benchmark별 sample, judge, scaffold, 반복 횟수와 비교 조건을 설명한 Meta의 7쪽 PDF. 문서 version 표기 없음, 2026-08-11 확인.
- (1차) [DFlash: Block Diffusion for Flash Speculative Decoding](https://arxiv.org/abs/2602.06036v2) — block diffusion drafter의 원 논문. arXiv v2·ICML 2026 camera-ready, 2026-05-28 갱신본을 2026-08-11 확인.

> 출처: https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model
