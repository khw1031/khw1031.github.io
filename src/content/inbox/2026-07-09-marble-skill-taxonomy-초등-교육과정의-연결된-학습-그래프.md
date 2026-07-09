---
title: 'Marble Skill Taxonomy: 초등 교육과정의 연결된 학습 그래프'
pubDate: '2026-07-09'
description: '1590개 micro-topic과 3221개 선행학습 엣지로 구성된 초등 교육과정 오픈소스 택소노미 데이터셋 구조와 활용법 정리'
summary: 'Marble이 공개한 초등 교육과정 연결 그래프 데이터셋의 구조(노드·엣지·표준 정렬)와 다중 라이선스 체계를 한눈에 파악할 수 있다.'
lang: ko
tags:
  - 'education'
  - 'open-source'
  - 'assessment'
canonical: 'https://github.com/withmarbleapp/os-taxonomy'
lintHash: '5bdf3cf1e9db'
---

## TL;DR
- Marble이 공개한 이 데이터셋은 초등 교육과정을 1,590개 **micro-topic**(노드)과 3,221개 **선행학습 관계**(엣지)로 분해해 JSON 그래프로 제공하며, 여러 국가 교육 표준에 정렬되어 있다.

## 큰 그림

```
                        ┌─────────────────────────────────────┐
                        │   Curriculum Standards (원천)        │
                        │   NGSS · Common Core · UK NC · …    │
                        └──────────────┬──────────────────────┘
                                       │ 정렬(alignment)
                                       ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                    topics.json  (1,590 nodes)                 │
   │  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
   │  │ Science  │   │  Math    │   │ English  │   │ History  │  │
   │  │  (547)   │   │  (503)   │   │  (286)   │   │   (90)   │  │
   │  └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
   │  + PSD(88) · Life Skills(37) · Computing(21) · L2L(18)      │
   └──────────────────────┬────────────────────────────────────────┘
                          │ prerequisite edges
                          ▼
   ┌───────────────────────────────────────────────────────────────┐
   │              dependencies.json  (3,221 edges, DAG)            │
   │  topicId ──(hard/soft + reason)──▶ prerequisiteId             │
   └──────────────────────┬────────────────────────────────────────┘
                          │ 집계
                          ▼
   ┌───────────────────────────────────────────────────────────────┐
   │             clusters.json  (183 domain summaries)             │
   │  (subject × domain × age band) → 학부모용 한 문단 요약         │
   └───────────────────────────────────────────────────────────────┘
```

## 핵심
- **왜 이 데이터셋이 필요한가?** 대부분의 커리큘럼 데이터는 평면적인 표준 목록(flat list)이거나 특정 제품 안에 잠겨 있어, "A를 배우려면 B를 먼저 알아야 한다"는 **학습의 연결 구조**를 기계가 읽을 수 없었다. Marble은 이를 열려 있는 **방향성 비순환 그래프(DAG)** 로 만들어 공개했다.
- **노드 = micro-topic**: 하나의 가르칠 수 있는 아이디어(예: "문장 만들기", "별의 겉보기 밝기")에 평문 설명, mastery 증거 기준, 유형(개념·절차·표상·언어·메타), 과목·영역, 대략적 연령대가 붙어 있다.
- **엣지 = 선행학습 관계**: "X를 배우려면 Y가 먼저"라는 의존 관계를 `hard`(필수) 또는 `soft`(권장) 강도로 태깅하고, 왜 그런지 한 줄 `reason`까지 기록해 그래프가 단순 링크 모음이 아니라 **교수학적 근거**를 담게 했다.
- **표준 정렬**: 각 micro-topic은 NGSS, Common Core, UK National Curriculum 등 실제 국가 표준 코드로 매핑되어, 서로 다른 교육 과정 간 **상호운용성**을 확보한다.
- **순수 데이터**: 런타임·의존 라이브러리 없이 JSON만 로드하면 바로 쓸 수 있으며, `validate.mjs` 스크립트로 구조·참조 무결성을 검사할 수 있다.

## 깊이
- **[노드-유형 분류]** micro-topic은 5가지 유형으로 나뉜다 — `CONCEPTUAL`(개념), `PROCEDURAL`(절차), `REPRESENTATIONAL`(표상), `LANGUAGE`(언어), `META`(메타인지). 이는 "아는 것"과 "하는 것", "생각하는 방식"을 구분해, 같은 과목 안에서도 **학습 목표의 성격**에 따라 다른 교수 전략이 필요함을 데이터 수준에서 반영한 것이다(저자 설계 의도).
- **[엣지-강도 태그]** `hard`는 "반드시 먼저 알아야 함", `soft`는 "알면 유리하지만 필수는 아님"을 의미한다. 예시로 든 엣지 `"Must understand vibrations make sound before finding volume patterns"`는 초등학교 과학에서 **음의 진동 → 음량 패턴** 순서가 단순 편의가 아닌 개념적 필수임을 보여준다.
- **[assessmentPrompt]** 각 topic에는 `{{name}}` 플레이스홀더가 포함된 자연어 평가 프롬프트가 있다. 이는 학부모·교사가 "아이가 정말 이해했는지"를 확인하는 **대화형 체크**로 바로 전환할 수 있게 설계된 것으로 보인다(원문에 사용 시나리오 상세 설명 없음).
- **[클러스터]** 183개 domain summary는 `(subject, domain, age band)` 조합마다 한 문단으로 정리되어, 전문가가 아닌 학부모도 아이의 학습 위치를 파악할 수 있게 하는 **접근성 계층**이다.
- **[라이선스 3중 구조]**
  - **데이터베이스**(구조·ID·관계): ODbL 1.0 — 파생 **데이터베이스**는 공개 유지 필수, 하지만 이를 활용한 **제품**은 비공개 가능.
  - **텍스트 콘텐츠**(description, evidence 등): CC BY-SA 4.0.
  - **curriculum-standards.json**: Marble 소유가 아니므로 각 원본 기관의 라이선스를 따라야 한다(PROVENANCE.md 참조).
  - 이 구분은 "오픈 데이터로 상업 제품을 만들 수 있는가?"라는 실무 질문에 대한 Marble의 명확한 답변이다: **가능하다. 단, 택소노미 자체를 개선하면 그 개선분은 다시 공유해야 한다.**

## 용어 풀이
- **micro-topic** — 한 번에 가르칠 수 있는 가장 작은 학습 단위. 비유: 레고 블록 하나. 깨지는 지점: 실제 수업에서는 여러 micro-topic이 동시에 다뤄지므로, "하나씩 독립적"이라는 비유는 교실 현장보다 데이터 모델링 관점에서 더 정확하다.
- **prerequisite graph / DAG** — 선행학습 관계를 화살표로 연결한 그래프로, 순환(사이클)이 없음. 비유: 계단식 폭포 — 물은 위에서만 아래로 흐른다. 깨지는 지점: 실제 학습은 순환적·반복적이므로, DAG는 "개념 의존성"의 단순화 모델이지 학습 경로의 완전한 묘사는 아니다.
- **hard vs soft edge** — 필수 선행 vs 권장 선행. 비유: 운전면허(필수) vs 고속도로 경험(권장). 깨지는 지점: hard/soft 기준이 Marble 내부 판단인지 외부 검증인지 원문에 명시되지 않았다(**불확실**).
- **ODbL 1.0 (Open Database License)** — 데이터베이스 구조·편성에 적용되는 라이선스. 비유: 지도의 '그리는 법'은 공유해야 하지만, 그 지도로 만든 여행 상품은 내 것. 깨지는 지점: "파생 데이터베이스"와 "produced work"의 경계는 사례마다 법적 판단이 다를 수 있다.
- **centrality** — 그래프에서 해당 노드가 얼마나 많은 연결의 중심에 있는지를 나타내는 수치(0~1 추정). 원문에 계산 방식은 명시되지 않았다(**불확실**).

## 시각 자료

| 과목 | 토픽 수 | 전체占比(%) |
|---|---:|---:|
| Science | 547 | 34.4 |
| Mathematics | 503 | 31.6 |
| English | 286 | 18.0 |
| History | 90 | 5.7 |
| Personal & Social Dev. | 88 | 5.5 |
| Life Skills | 37 | 2.3 |
| Computing | 21 | 1.3 |
| Learning to Learn | 18 | 1.1 |
| **합계** | **1,590** | **100** |

```
토픽 1개 구조 (한눈에)
┌─────────────────────────────────────────┐
│ id: mt_N8CpN1EJrP                       │
│ type: CONCEPTUAL                        │
│ subject: English / domain: Grammar      │
│ name: "Building sentences"              │
│ age: 4–6                                │
│ centrality: 0.257                       │
│ evidence: [문장/단편 구별, …]            │
│ assessmentPrompt: "{{name}}이가 …"      │
│ standards: [ccss-ela:L.K.1f, uk-nc…]    │
└───────┬─────────────────────────────────┘
        │ hard/soft edges
        ▼
  prerequisite topic(s)
```

## 핵심 시사점 / 판단
- **(저자 주장)** "대부분의 커리큘럼 데이터는 평면 목록이거나 제품에 잠겨 있다" — Marble은 이를 연결 그래프로 개방함으로써 에듀테크 생태계의 **상호운용성 인프라**를 자처한다.
- **(저자 주장)** ODbL + CC BY-SA 이중 라이선스는 "개선은 공유하되 제품은 자유롭게"라는 균형 전략으로, OpenStreetMap과 유사한 커뮤니티 성장 모델을 의도한 것으로 보인다.
- **(검증 필요 · 불확실)** hard/soft 엣지 판정 기준, centrality 계산 알고리즘, 각 국가 표준 간 매핑의 품질 검증 방법은 원문에 상세히 기술되지 않았다.
- **(검증 필요 · 불확실)** 8개 과목 중 Science·Math·English가 84%를 차지하는데, Computing(21개)이나 Learning to Learn(18개) 같은 영역의 커버리지가 교육 현장에서 충분한지 별도 평가가 필요하다.
- **(사실)** 데이터는 UTF-8 JSON이며 SHA-256 체크섬이 `manifest.json`에 포함되어 있어 무결성 자체 검증이 가능하다.

## 레퍼런스
- Marble Skill Taxonomy GitHub — https://github.com/withmarbleapp/os-taxonomy · (1차) · 1,590개 micro-topic과 3,221개 선행학습 엣지를 포함한 초등 교육과정 오픈소스 데이터셋.
- Marble Curriculum Explorer — https://withmarble.com/curriculum · (1차) · 택소노미를 3D 그래프로 대화형 탐색할 수 있는 웹 뷰어.
- ODbL 1.0 — https://opendatacommons.org/licenses/odbl/1-0/ · (1차) · 오픈 데이터베이스 라이선스 전문.
- PROVENANCE.md — https://github.com/withmarbleapp/os-taxonomy/blob/main/PROVENANCE.md · (1차) · curriculum-standards.json의 제3자 원본 출처별 라이선스 기록.
- CHANGELOG.md — https://github.com/withmarbleapp/os-taxonomy/blob/main/CHANGELOG.md · (1차) · 버전별 변경 사항 및 제외 항목(embeddings, 개인 데이터) 기록.

## 확인 질문
- Q1(전이): 이 택소노미의 hard/soft 엣지 분류 기준이 한국 교육과정(2022 개정)의 성취기준 매핑에도 유효할까? 문화·언어 종속적인 topic(예: English Grammar)은 어떻게 재정의해야 하는가?
- Q2(왜·어떻게): centrality 수치는 어떤 알고리즘(PageRank, betweenness 등)으로 계산되었으며, 이 수치를 활용한 실제 제품 기능(학습 경로 추천 등)은 무엇인가?
- Q3(경계): "의도적으로 제외"한 semantic embeddings와 per-child 데이터가 향후 공개될 경우, 이 택소노미의 라이선스 구조(ODbL + CC BY-SA)는 개인화된 AI 튜터 서비스와 어떻게 양립할 수 있는가?

> 출처: https://github.com/withmarbleapp/os-taxonomy
