---
title: 'LiteRT.js: 브라우저 내 온디바이스 AI 추론 런타임'
pubDate: '2026-07-11T01:34:20+09:00'
description: 'Google의 LiteRT.js로 브라우저에서 .tflite 모델을 WebGPU/WASM 가속으로 실행하는 방법과 제약사항 정리'
summary: 'LiteRT.js는 브라우저에서 .tflite 모델을 WebGPU 또는 WASM(XNNPACK)으로 추론하는 경량 런타임이다. TFJS 파이프라인과 상호운용 가능하나 2GB 메모리 제한과 WebGPU op 커버리지 한계가 있다.'
lang: ko
tags:
  - 'ai'
  - 'frontend'
  - 'performance'
  - 'open-source'
  - 'optimization'
canonical: 'https://github.com/google-ai-edge/LiteRT/tree/main/litert/js'
lintHash: 'b86bb948a5ec'
---

## TL;DR
- LiteRT.js는 브라우저에서 .tflite 모델을 WebGPU/WASM으로 추론하는 Google 오픈소스 런타임으로, TFJS 대체·혼용이 가능하나 모델 크기와 WebGPU op 지원 범위에 제약이 있다.

## 큰 그림
```
                    ┌─────────────────────────────────────┐
                    │         브라우저 환경                │
                    │  ┌───────────────────────────────┐  │
  .tflite 모델 ───▶ │  │        LiteRT.js Core         │  │
                    │  │  ┌──────────┐ ┌────────────┐  │  │
                    │  │  │ WebGPU   │ │ WASM+XNNPk │  │  │
                    │  │  │(가속)    │ │(CPU 폴백)  │  │  │
                    │  │  └──────────┘ └────────────┘  │  │
                    │  └───────────────────────────────┘  │
                    │            ↕ tensor 변환             │
                    │  ┌───────────────────────────────┐  │
                    │  │    TensorFlow.js (선택)        │  │
                    │  │   전/후처리 · 파이프라인        │  │
                    │  └───────────────────────────────┘  │
                    └─────────────────────────────────────┘
```

## 핵심
- LiteRT.js는 **TFLite에서 리브랜딩된 LiteRT**의 웹 런타임으로, `.tflite` 모델을 브라우저에서 직접 로드·실행한다.
- 가속은 두 경로로 나뉜다: **WebGPU**(지원 브라우저) 또는 **WASM + XNNPACK**(모든 브라우저 CPU).
- WebGPU에서 지원하지 않는 op가 있으면 **JSPI 환경에서는 해당 op만 WASM으로 위임**하고, 비JSPI 환경에서는 **동기 경계 제한으로 모델 전체가 CPU 폴백**된다(저자 설명).
- TFJS와 혼용 시 **동일 WebGPU device 공유 설정**이 필요하며, `@litertjs/tfjs-interop` 패키지가 tensor 변환을 담당한다.
- LiteRT.js는 **추론만 담당**하고 전/후처리는 사용자가 구현하거나 TFJS·MediaPipe 등 외부 라이브러리에서 가져와야 한다.

## 깊이
- **[WebGPU vs WASM 폴백]** JSPI(Javascript Promise Integration)가 핵심 변수다. JSPI가 있으면 비동기 경계가 가능해 GPU 미지원 op만 선택적으로 CPU 위임이 되지만, 없으면 동기 호출 제약 때문에 **모델 전체가 WASM으로 떨어진다**. 즉, 같은 모델이라도 브라우저 환경에 따라 성능 편차가 크다. (불확실: JSPI 지원 브라우저 범위·성능 차이는 원문에 수치 없음.)
- **[2GB 메모리 벽]** WebAssembly CPU 메모리가 2GB로 제한되어 대형 모델 로드 실패 가능성이 있다(저자 주장). 이는 WASM 자체의 메모리 모델 제약에서 기인한다.
- **[TFJS 상호운용]** `tf.removeBackend('webgpu')` 후 LiteRT.js의 device로 재등록하는 과정이 필요하다. 이를 건너뛰면 GPU 버퍼 공유가 안 되어 tensor 변환 시 복사 오버헤드가 발생할 수 있다(추론, 원문에 명시 없음).
- **[Model Tester]** `npx model-tester`로 GPU 위임 비율과 CPU 간 수치 차이를 확인할 수 있어, 프로덕션 배포 전 호환성 검증 도구로 유용하다.

## 용어 풀이
- **XNNPACK** — Google의 고도로 최적화된 CPU 추론 커널 라이브러리 / 비유: "CPU용 터보 엔진" / 깨지는 점: GPU 대비 절대 성능은 낮음.
- **JSPI** — WebAssembly와 JS 간 비동기 호출을 가능하게 하는 브라우저 API / 비유: "동기·비동기 번역기" / 깨지는 점: 아직 모든 브라우저가 지원하지 않음.
- **op (operation)** — 모델 계산 그래프의 개별 노드(conv, matmul 등) / 비유: "레고 블록 하나" / 깨지는 점: op 조합에 따라 fallback 비용이 비선형적으로 증가.

## 시각 자료
| 구분 | WebGPU | WASM (XNNPACK) |
|------|--------|----------------|
| 가속 | GPU | CPU |
| 브라우저 요구 | WebGPU 지원 필수 | 모든 브라우저 |
| 미지원 op 처리 | JSPI: 부분 폴백 / 비JSPI: 전체 폴백 | 해당 없음 |
| 메모리 제한 | GPU VRAM | 2GB (WASM) |

## 핵심 시사점 / 판단
- **(저자 주장)** LiteRT.js는 TFJS Graph Model 대체재로 기존 파이프라인에 슬롯인 가능하다.
- **(저자 주장)** WebGPU 가속 시 성능 이점이 있으나, op 커버리지와 JSPI 여부가 실제 성능을 좌우한다.
- **(검증 필요)** WebGPU vs WASM 실제 벤치마크 수치, 대형 모델(>2GB) 우회 전략은 원문에 없음.
- **(불확실)** JSPI 비지원 브라우저 비율이 현재 어느 정도인지 확인 필요.

## 레퍼런스
- LiteRT JS README — https://github.com/google-ai-edge/LiteRT/tree/main/litert/js · (2차) · Web 런타임 기능·제약·사용법 요약.
- LiteRT 공식 문서 — https://ai.google.dev/edge/litert/web · (1차) · 전체 가이드.
- MediaPipe Web — https://mediapipe-studio.webapps.google.com/home · (1차) · 전/후처리 포함 완전 파이프라인.

## 확인 질문
- Q1(전이): WASM 2GB 제한을 피하기 위해 모델 양자화나 분할 로딩이 가능한가?
- Q2(왜·어떻게): JSPI 유무에 따라 폴백 범위가 달라지는 정확한 메커니즘은 무엇인가?
- Q3(경계): WebGPU 미지원 op 목록은 어디에서 확인하며, 이는 모델 선택에 어떻게 영향을 주는가?

> 출처: https://github.com/google-ai-edge/LiteRT/tree/main/litert/js
