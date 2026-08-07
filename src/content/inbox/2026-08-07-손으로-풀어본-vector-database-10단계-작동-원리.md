---
title: '손으로 풀어본 Vector Database 10단계 작동 원리'
pubDate: '2026-08-07T15:54:14+09:00'
description: 'Vector Database의 indexing·querying 파이프라인을 세 문장 손 계산 예제로 단계별 분해해 RAG의 핵심 메커니즘을 설명한다.'
summary: 'Tom Yeh가 제시한 10단계 워크스루를 따라가며 embedding → pooling → projection → dot product 흐름을 직접 계산하고, toy example의 한계와 실무 보완점까지 짚는다.'
lang: ko
tags:
  - 'ai'
  - 'llm'
  - 'education'
  - 'vector-database'
canonical: 'https://www.linkedin.com/posts/tom-yeh_vector-database-by-hand-10-steps-walkthrough-ugcPost-7486803295873757184-CCBJ/?utm_source=social_share_send&utm_medium=ios_app&rcm=ACoAAB15JU0Bh0ozoFHKUp6BqJa4W5v2yqNn5k8&utm_campaign=share_via'
lintHash: 'f9de351a8a2a'
---

## TL;DR
- Vector Database는 본질적으로 **embedding pipeline + projection(hash) + dot product**의 조합이며, 손으로 계산 가능한 산술의 연속이다(저자 주장).

## 큰 그림
```
         ┌────────── INDEXING (저장) ──────────┐   ┌──── QUERYING ────┐
         │                                     │   │                  │
문장들 ──▶ Word Embedding Lookup ──▶ Encoder ──▶ Mean Pooling ──▶ Projection ──▶ Index 저장
   3개        (22단어, 4d)          (linear+ReLU)   (문장 1개 벡터)    (4d→2d)     {[5/3,2/3],
         │                                                          │            [5/3,0],
         └──── "who are you" / "who am I" 반복 (step 6-7) ─────────┘            [7/3,2/3]}
                                                                                │
쿼리 "am I you" ──▶ 동일 파이프라인 ──▶ [8/3, 2/3] ──▶ dot product ──▶ argmax ──▶ "who am I"
                                           (step 8)        (step 9)    (step 10)
```

## 핵심
- **입력 단계(step 1-2)**: 3문장×3단어의 toy dataset을 전제로, 각 단어를 embedding table에서 4차원 벡터로 찾는다. 실무에서는 수만 어휘·수천 차원으로 확장되지만 저자는 "손 계산 가능한 작은 행렬"로 의도적으로 축소했다(저자 주장).
- **인코딩~풀링(step 3-4)**: 단어별 벡터를 encoder(linear layer + ReLU)로 변환한 뒤, 열 방향으로 평균을 내어 **문장 하나를 대표하는 단일 벡터(sentence embedding)** 로 압축한다. mean pooling이 문장을 하나의 점으로 만드는 결정적 단계다.
- **Indexing(step 5)**: projection matrix를 곱해 4차원을 2차원으로 줄인다. 저자는 이를 "비교가 빠른 짧은 표현"이라는 의미에서 **해시 역할**로 비유한다. 이 2D 벡터가 실제 vector storage에 저장된다.
- **Query 단계(step 8-10)**: 쿼리도 동일 파이프라인을 통과해 같은 2D 공간에 착지하고, 저장된 모든 벡터와의 **dot product**를 한 번의 행렬곱(전치 후 곱)으로 계산해 최댓값을 찾는다. 60/9 > 44/9 > 40/9이므로 답은 "who am I".

## 깊이
- **[Mean pooling의 한계 — 댓글 보완]**: Ignazio De Santis(댓글, 2차)는 mean pooling이 **모든 토큰을 동등하게 취급**해 문서의 결정적 키워드가 일반어에 희석된다고 지적한다. 이것이 실무에서 학습된 sentence embedding이나 **late interaction 모델**(ColBERT 등)로 이동하는 주된 이유 중 하나라는 주장. toy example의 단순 평균이 실제 RAG 정확도 손실의 주요 원인이라는 진단은 **검증 필요**(단일 사례 댓글 기반).
- **[최근접 이웃 탐색의 확장 문제 — step 10]**: 저자는 수십억 벡터를 순차 스캔하는 linear scan이 병목이 되므로, 실무에서는 **HNSW** 같은 approximate nearest neighbour(ANN) 인덱스를 쓴다고 명시한다. 이는 toy example의 정확한(exact) 탐색과 실무의 근사 탐색 간 괴리를 스스로 인정한 부분.
- **[Projection = Hash 비유의 경계]**: 저자가 projection matrix를 "hash 역할"이라 부른 것은 차원 축소로 비교 비용을 낮춘다는 기능적 유사성에서 온 비유다. 그러나 전통적 hash는 이산 버킷 매핑이고, projection은 연속 공간의 선형 변환이므로 **충돌·역상(image) 복원 가능성** 등 hash 고유 속성과는 다르다. 비유가 깨지는 지점.

## 용어 풀이
- **Embedding** — 단어나 문장을 실수 벡터로 표현한 것. / 비유: "단어의 좌표" — 의미 공간에서 가까운 단어끼리 좌표가 비슷하다. / 비유가 깨지는 지점: 좌표는 인간이 해석 가능한 2·3차원이지만, 실제 embedding은 수천 차원이라 기하학적 직관이 통하지 않는다.
- **Mean pooling** — 시퀀스 차원의 평균을 내어 하나의 벡터로 압축. / 비유: 여러 악기 소리를 믹싱해 하나의 음색으로 만드는 것. / 비유가 깨지는 지점: 믹싱은 주파수 조합이지만 mean pooling은 산술 평균이라 특정 토큰(드럼 같은 강조 요소)이 오히려 묻힌다.
- **Dot product** — 두 벡터의 유사도 추정치. / 비유: 두 화살표가 같은 방향을 가리키는 정도. / 비유가 깨지는 지점: 벡터 크기(magnitude)에 의존하므로, 정규화 없이는 "방향 유사도"와 "크기 곱"이 섞인다(코사인 유사도와 다른 이유).
- **HNSW** — 계층적 내비게이션 가능 스몰 월드 그래프로 ANN 탐색을 가속화하는 알고리즘. / 비유: 건너뛰기 링크가 있는 색인(_skip-list_)을 다층으로 쌓은 것. / 비유가 깨지는 지점: skip-list는 정렬된 1차원 구조지만 HNSW는 고차원 벡터 공간의 greedy 탐색이라 "정렬" 개념이 적용되지 않는다.

## 시각 자료
| 단계 | 연산 | Toy 차원 | 실무 규모(저자 언급) |
|------|------|----------|----------------------|
| 2. Word Embedding | 테이블 lookup | 22어휘 × 4d | 수만 어휘 × 수천 d |
| 3. Encoder | linear + ReLU | 4d → 4d | Transformer |
| 4. Mean pooling | 열 평균 | 3개 벡터 → 1개 (4d) | 수백 토큰 → 1개 |
| 5. Projection | 행렬곱 | 4d → 2d | 수천 d → 수백 d |
| 9-10. Search | dot product + argmax | 3개 벡터 전수 스캔 | ANN(HNSW) 인덱스 |

## 핵심 시사점 / 판단
- **(저자 주장)** "vector database는 embedding pipeline, projection, dot product"로 환원되며, "database"라는 명칭에 현혹될 필요가 없다 — toy example의 의도적 단순화.
- **(저자 주장)** projection은 비교 비용을 줄이는 hash-like 역할을 하며, 이 벡터가 저장소에 남는다.
- **(검증 필요·불확실)** mean pooling이 "production RAG 정확도 손실의 주범"이라는 댓글 주장은 단일 의견이며, 실제 손실 크기는 도메인·모델·chunk 전략에 의존.
- **(검증 필요·불확실)** 저자가 예시로 든 수치(60/9, 44/9, 40/9)는 원문 텍스트에 제시되어 있으나, embedding table·encoder 가중치의 구체적 값은 원문에 없어 독자가 **재현**할 수는 없다.

## 레퍼런스
- Tom Yeh, "Vector Database by hand — 10 steps walkthrough" — [LinkedIn](https://www.linkedin.com/posts/tom-yeh_vector-database-by-hand-10-steps-walkthrough-ugcPost-7486803295873757184-CCBJ/) · (2차) · 세 문장 손 계산으로 vector DB의 indexing·querying 전체 파이프라인을 해부한 교육용 게시물.

## 확인 질문
- Q1(전이): 이 toy example의 mean pooling + dot product 구조를 실제 RAG의 sentence embedding + HNSW 인덱스에 그대로 대응시킬 수 있을까? 어느 단계에서 가장 큰 비약이 발생하는가?
- Q2(왜·어떻게): 왜 projection을 "hash"로 비유했을까? 정보 손실이 발생하는 차원 축소를 저장 단계에 두는 공학적 이유는 무엇인가?
- Q3(경계): dot product 기반 유사도 탐색이 **의미적 유사성**이 아니라 **벡터 방향+크기**에 반응한다는 점을 고려할 때, "who am I"가 정답으로 나온 결과가 실제 의미적 근접성을 보장하는가?

> 출처: https://www.linkedin.com/posts/tom-yeh_vector-database-by-hand-10-steps-walkthrough-ugcPost-7486803295873757184-CCBJ/?utm_source=social_share_send&utm_medium=ios_app&rcm=ACoAAB15JU0Bh0ozoFHKUp6BqJa4W5v2yqNn5k8&utm_campaign=share_via
