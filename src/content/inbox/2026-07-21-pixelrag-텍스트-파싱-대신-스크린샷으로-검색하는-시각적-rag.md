---
title: 'PixelRAG: 텍스트 파싱 대신 스크린샷으로 검색하는 시각적 RAG'
pubDate: '2026-07-21T01:52:04+09:00'
description: '웹페이지를 스크린샷 타일로 렌더링해 표·차트·레이아웃 등 시각 구조를 보존한 채 검색하는 PixelRAG의 구조와 파이프라인을 정리한다.'
summary: 'PixelRAG는 문서를 텍스트가 아닌 스크린샷 이미지로 변환하고 시각 임베딩 모델로 검색함으로써, 기존 텍스트 RAG가 놓치는 표·차트·인포그래픽 정보를 보존한다. 이 리포트는 렌더링→임베딩→색인→서빙 파이프라인과 핵심 기술적 판단을 한 장에 정리한다.'
lang: ko
tags:
  - 'llm'
  - 'ai'
  - 'retrieval-augmented-generation'
  - 'embedding'
  - 'open-source'
canonical: 'https://github.com/StarTrail-org/PixelRAG'
lintHash: '86e769eab88d'
---

## TL;DR
- 웹페이지를 텍스트로 파싱하지 말고 스크린샷으로 찍어서 이미지 상태에서 검색하면 표·차트·레이아웃 정보가 살아남아 RAG 답변 품질이 올라간다(저자 주장, arXiv 2606.28344).

## 큰 그림
```
                        PixelRAG 전체 흐름
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│  pixelshot  │───▶│  chunk/embed │───▶│ build-index  │───▶│  serve   │
│ (렌더링)    │    │  (벡터화)    │    │ (FAISS/Qdrant)│   │ (검색API)│
│ Playwright  │    │ Qwen3-VL-    │    │              │    │ FastAPI  │
│ CDP/PDF     │    │ Embedding    │    │              │    │          │
└──────┬──────┘    └──────────────┘    └──────────────┘    └────┬─────┘
       │                                                        │
       │  Claude Code plugin                                    │  Query
       │  (pixelbrowse)                                         ▼
       └──────────────────────────────────────────────────▶  답변 생성
                                                            (LLM reader)
```

## 핵심
- 기존 텍스트 기반 RAG는 HTML을 텍스트 청크로 파싱하면서 **표, 차트, 인포그래픽, 레이아웃** 같은 시각 구조를 버린다. PixelRAG는 문서를 스크린샷 타일 이미지로 렌더링하고, 시각 임베딩 모델(Qwen3-VL-Embedding + LoRA)로 이미지를 벡터화해 검색한다.
- 파이프라인은 네 단계로 분리된다: `pixelshot`(렌더링) → `chunk/embed`(벡터화) → `build-index`(색인 구축) → `serve`(검색 API). 각 단계는 독립 실행 가능하며, `pixelrag index`로 전체 오케스트레이션도 가능하다.
- 828만 Wikipedia 페이지에 대한 사전 구축 FAISS 색인이 공개되어 있으며, 별도 설정 없이 호스팅 API(`api.pixelrag.ai`)에서 바로 검색할 수 있다. 텍스트 쿼리뿐 아니라 이미지 쿼리(시각 검색)도 지원한다.

## 깊이
- **[렌더링 → 검색 연결]** 텍스트 파싱은 DOM 구조에 의존하므로 JavaScript 렌더링 결과물, 캔버스 차트, 이미지 내 텍스트를 놓친다. 스크린샷 타일 방식은 브라우저가 최종 렌더링한 픽셀을 그대로 캡처하므로 "사람이 보는 그대로" 검색 대상이 된다. 비유하면, 책의 목차만 발췌하는 대신 책 페이지를 사진으로 찍어두는 것. **비유가 깨지는 지점**: 사진은 텍스트보다 저장·색인 비용이 훨씬 크고, OCR 없이 순수 픽셀 검색이므로 텍스트精确 매칭은 약할 수 있다.
- **[임베딩 모델]** `Qwen3-VL-Embedding-2B`를 스크린샷 데이터로 LoRA fine-tuning하여, 웹페이지 이미지 공간에서 시각적 내용 기반 검색이 가능하도록 한다. 훈련 데이터셋(`screenshot-training-natural-filtered-v2`)과 데이터 큐레이션 파이프라인(LLM 기반 쿼리 생성, hard-negative mining)도 함께 공개되어 있어 다른 백본 모델로의 확장도 가능하다.
- **[Claude Code 통합]** `pixelbrowse` 스킬로 Claude Code에 설치하면, Claude가 HTML 대신 스크린샷을 "보고" 차트·표를 해석할 수 있다. MCP 서버 없이 로컬 Playwright만 사용하므로 경량이다.

## 용어 풀이
- **RAG (Retrieval-Augmented Generation)** — 외부 문서를 검색해 LLM에 컨텍스트로 제공하는 방식 / 도서관에서 관련 책을 꺼내다 책상 위에 펼쳐두는 것 / 비유가 깨지는 지점: 실제 RAG는 검색 순위·청크 크기 등 엔지니어링 변수에 결과가 크게 좌우된다.
- **LoRA (Low-Rank Adaptation)** — 대규모 모델의 일부 가중치만 저차원으로 fine-tuning하는 기법 / 전체 건물을 리모델링하지 않고 한 층만 고치는 것 / 비유가 깨지는 지점: "저차원"이 항상 충분한 표현력을 보장하지는 않는다.
- **FAISS** — Meta의 고속 근사 근접 이웃 검색 라이브러리 / 대규모 색인 카드 Catalog / 비유가 깨지는 지점: 단일 노드 메모리 한계가 있어 초대규모에는 Qdrant 등 분산 백엔드가 필요하다.
- **스크린샷 타일** — 긴 웹페이지를 잘라 여러 장의 이미지 조각으로 나눈 것 / 두루마리를 A4 크기로 재단하는 것.

## 시각 자료
```
| 기존 텍스트 RAG        | PixelRAG                  |
|────────────────────────┼───────────────────────────|
| HTML → 텍스트 청크     | HTML → 스크린샷 타일      |
| 표/차트 정보 소실       | 표/차트/레이아웃 보존     |
| 텍스트 임베딩          | 시각 임베딩 (VLM)         |
| 파싱 로직 복잡         | 렌더링만으로 통일          |
| 저장 비용 ↓            | 저장 비용 ↑               |
```

## 핵심 시사점 / 판단
- **(저자 주장)** "웹 스크린샷이 텍스트보다 RAG에 우월하다" — arXiv 2606.28344에서 벤치마크 결과를 제시하지만, 원문 외부에서 독립 검증된 바는 **불확실**.
- **(저자 주장)** 828만 페이지 사전 구축 색인이 "no setup"으로 동작한다고 하나, ~217GB 다운로드가 필요해 실제 배포 장벽은 낮지 않을 수 있다.
- **(검증 필요)** 시각 검색이 텍스트 검색 대비 정확도·리콜에서 얼마나 우위를 가지는지는 원문 논문 내 수치에 의존하며, 도메인(법률·의학 등 텍스트 밀집 문서)에서의 일반성은 **불확실**.
- **(사실)** Apache-2.0 라이선스, Berkeley SkyLab·BAIR·Berkeley NLP 소속 연구진, 2026년 공개.

## 레퍼런스
- PixelRAG GitHub — https://github.com/StarTrail-org/PixelRAG · (1차) · 공식 코드·문서 저장소.
- PIXELRAG 논문 (arXiv) — https://arxiv.org/abs/2606.28344 · (1차) · 시각 RAG 벤치마크 및 방법론 상세.
- LoRA 가중치 (HuggingFace) — https://huggingface.co/Chrisyichuan/wiki-screenshot-embedding-lora · (1차) · 사전 학습된 LoRA 어댑터.
- PixelRAG Live Demo — https://pixelrag.ai/ · (1차) · 브라우저 기반 시각 검색 데모.

## 확인 질문
- Q1(전이): 텍스트 밀집 문서(법률 조문, API 명세)에서도 스크린샷 기반 검색이 텍스트 검색보다 우위를 유지할까?
- Q2(왜·어떻게): 스크린샷 타일 크기와 청크 전략이 검색 리콜에 미치는 영향은 어떻게 평가되었는가?
- Q3(경계): 시각 검색이 OCR 없이 순수 픽셀 매칭이라면, 키워드 정확 매칭이 중요한 시나리오에서는 성능이 떨어질 수 있지 않은가?

> 출처: https://github.com/StarTrail-org/PixelRAG
