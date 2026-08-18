---
title: '[SPEC] 디자인 선호 비교의 데이터 계약과 사람 채택 경계'
pubDate: '2026-08-10T15:04:10+09:00'
noteId: UX-2608-003
description: '쌍대 비교, 전체 순위, 별점과 Bradley-Terry·Elo·TrueSkill 계열 모델을 대조해 작은 표본의 디자인 선별 데이터 계약과 taste.md 승격 경계를 정의한다.'
summary: '작은 후보 집합의 기본 판정은 쌍대 비교가 적합하며 Equal, Both-bad, insufficient와 표시 순서, 기준, 신뢰도를 보존해야 한다. 순위는 잠정 방향이고, 취향 규칙은 반복 근거를 모아 사람이 채택한다.'
lang: ko
tags:
  - 'pairwise-comparison'
  - 'preference-learning'
  - 'design-evaluation'
  - 'human-in-the-loop'
  - 'taste-memory'
lintHash: '290bf19d3138'
---

[상위 노트](/notes/ai-design-selection-loop-standards/)에서 분리한 선호 판정 조사다. 확인일은 2026-08-10이다.

## 방식 판정

| 방식 | 적합한 용도 | 주된 한계 |
| --- | --- | --- |
| 쌍대 비교 | 후보가 적고 한 사람의 방향을 빠르게 좁히는 기본 판정 | 비교 수가 늘고, 연결되지 않은 비교 그래프에서는 전역 순위를 만들 수 없음 |
| 전체 순위 | 3~8개 후보를 한 번에 줄이는 보조 판정 | 인지 부담이 크고 한 번의 순위를 절대 품질로 오해하기 쉬움 |
| 별점 | 계층, 대비, 밀도, 브랜드 적합성 같은 기준별 진단 | 평가자마다 척도 사용이 달라 전체 평균으로 우승자를 정하기 어려움 |

기본 조합은 쌍대 비교, 소수 후보의 보조 순위, 기준별 별점이다. 별점 평균과 전역 순위는 탐색을 돕지만 사람의 승격 이벤트를 대신하지 않는다.

## 최소 데이터 계약

```yaml
contextId: checkout-mobile-v2
roundId: round-006
aId: candidate-006-a
bId: candidate-006-b
criterion: overall
label: a
blind: true
positionSeed: 731944
confidence: medium
comment: "A는 주요 행동과 가격 정보의 계층이 더 선명함"
reviewerId: human:owner
createdAt: 2026-08-10T15:04:10+09:00
```

`label`은 `a`, `b`, `equal`, `both_bad`, `insufficient`를 손실 없이 보존한다.

- `equal`: 둘의 채택 가능성이 비슷함
- `both_bad`: 둘 다 기준을 통과하지 못함
- `insufficient`: 렌더 실패, 맥락 부족, 비교 불가 등으로 판단하지 못함

## 수집 불변식

1. A와 B는 같은 `contextId`, 목표, 평가 기준 아래에서 생성된 후보여야 한다.
2. 후보 이름과 생성 주체를 가리고 좌우 위치를 무작위화한다. 실제 표시 순서를 `positionSeed`로 재현할 수 있어야 한다.
3. `overall`과 계층·대비·밀도·충실도 같은 세부 기준을 분리한다.
4. `equal`과 `both_bad`를 승패로 바꾸지 않는다. 정보가 사라지면 낮은 품질의 두 후보 중 하나가 좋은 후보로 기록된다.
5. `chosen`은 같은 문맥의 상대 선호일 뿐 절대 품질 인증이 아니다. preference dataset으로 내보낼 때도 원래 문맥과 기준을 유지한다.
6. 결과에는 비교 수, 승·패·동률, 신뢰 구간, 순위 범위를 함께 표시한다.
7. 불확실성 구간이 겹치면 공동 우세 또는 판정 보류로 표시한다.
8. 일부 비교를 나중에 반복해 같은 사람의 판단 일관성을 확인한다.

## 집계 모델의 사용 경계

- Bradley-Terry는 후보별 잠재 선호 점수를 쌍대 비교에서 추정하는 기본 모델 후보다. 후보마다 하나의 비교적 안정된 점수가 있고 비교가 조건부 독립이라는 가정이 필요하다.
- Elo는 갱신이 단순하지만 비교 순서와 갱신 폭에 민감하고 불확실성을 기본으로 표현하지 않는다. 실시간 임시 순위에는 쓸 수 있어도 최종 판정 근거로는 부족하다.
- TrueSkill은 불확실성, 무승부, 여러 참가자를 모델링한다. 작은 표본의 잠정 순위에 유용하지만 취향이 문맥마다 바뀌면 하나의 잠재 점수로 설명되지 않는다.
- 모든 모델은 비교 그래프가 끊겼거나 위치 편향이 있거나 평가 기준이 섞였을 때 과신한다. 점수는 관측을 압축한 값이지 사람의 취향 원문이 아니다.

## 개인별 취향

DesignPref는 20명의 전문 디자이너가 생성 UI 쌍 12,000건을 평가한 자료다. 이진 선호의 Krippendorff alpha는 0.25였고, 개인별 자료를 사용한 모델이 20배 큰 통합 자료보다 해당 디자이너의 선택을 더 잘 예측했다. 따라서 moodbox는 다음을 분리한다.

- `reviewerId`가 붙은 개인별 비교 원문
- 여러 평가자의 집계 결과
- 개인 `taste.md` 규칙
- 팀이나 제품의 합의 규칙

전체 사용자 평균을 개인 취향의 기본값으로 덮어쓰지 않는다. 개인 취향은 접근성이나 제품 요구사항 같은 비협상 기준도 대신하지 않는다.

## taste.md 승격 경계

1. **자동화 허용:** 반복 선택 묶기, 코멘트 주제 묶기, 편집 차이 요약, 규칙 후보 작성, 잠정 점수와 불확실성 계산.
2. **사람 승인 필요:** `taste.md` 규칙 추가·수정·삭제, 다음 라운드 기본 정책 변경, 서로 충돌하는 취향 규칙의 우선순위 결정.
3. **자동 승격 금지:** 선택 한 건, 라운드 하나의 전체 순위, 편집 한 건, 모델이 만든 요약만으로 규칙 확정.
4. **증거 보존:** 규칙에는 근거가 된 비교·코멘트·편집 식별자와 `proposed`, `accepted`, `rejected`, `retired` 상태를 연결한다.

사용자 편집에는 선호, 정답 수정, 작업 비용이 함께 섞인다. 편집은 규칙의 직접 명령이 아니라 후보 규칙을 제안하는 근거다.

---

<div class="refs">

## 참조

- [Bradley & Terry, 1952](https://doi.org/10.1093/biomet/39.3-4.324) · 쌍대 비교에서 잠재 순위를 추정하는 Bradley-Terry 모델의 원 논문. (1차 · Biometrika 39권 · 2026-08-10 확인)
- [TrueSkill, Microsoft Research](https://www.microsoft.com/en-us/research/publication/trueskilltm-a-bayesian-skill-rating-system-2/) · 불확실성, 무승부, 여러 참가자를 다루는 Bayesian 순위 모델. (1차 · MSR-TR-2006-80 · 2026-08-10 확인)
- [Arena 동작 방식](https://arena.ai/how-it-works) · 익명 쌍대 비교 후 생성 주체를 공개하는 실제 제품 흐름. (1차 · 2026-08-10 확인)
- [Arena 순위 방식](https://arena.ai/blog/ranking-method) · 점수와 신뢰 구간, 순위 범위를 함께 표시하고 겹침을 동률로 다루는 제품 사례. (1차 · 2026-02-28 갱신판 · 2026-08-10 확인)
- [Arena-Rank](https://arena.ai/blog/arena-rank/) · Bradley-Terry, 문맥 특성, 닫힌 형태 신뢰 구간을 제공하는 공개 구현. (1차 · 2026-08-10 확인)
- [LangSmith Annotation Queues](https://docs.langchain.com/langsmith/annotation-queues) · 기준별 A/B/Equal, 여러 검토자, 코멘트와 쌍대 검토 큐의 제품 구현. (1차 · 2026-08-10 확인)
- [Label Studio Pairwise](https://labelstud.io/tags/pairwise.html) · 이미지·HTML·텍스트를 비교하는 범용 쌍대 라벨링 구성. (1차 · 안정판 1.23.0, 확인 커밋 `2a9bfbc` · 2026-08-10 확인)
- [Lyssna Preference Test](https://help.lyssna.com/en/articles/4952946-preference-test-sections) · 2~6개 디자인 선택과 표시 순서 무작위화의 제품 사례. (1차 · 2026-08-10 확인)
- [UserTesting Preference Testing](https://help.usertesting.com/hc/en-us/articles/11880273593629-Preference-testing) · 순서 편향을 줄이는 balanced comparison의 제품 사례. (1차 · 2026-08-10 확인)
- [Hugging Face TRL DPO Trainer](https://huggingface.co/docs/trl/dpo_trainer) · `prompt`, `chosen`, `rejected` 선호 데이터 형식의 제품 구현. 조사 시 TRL 1.9.2. (1차 · 2026-08-10 확인)
- [DesignPref](https://www.cs.cmu.edu/~jbigham/pubs/pdfs/2025/designpref.pdf) · 개인별 디자인 선호와 전문가 사이의 불일치를 측정한 원 논문. (1차 · arXiv:2511.20513v1 · 2026-08-10 확인)
- [Principled Fine-tuning of LLMs from User-Edits](https://papers.nips.cc/paper_files/paper/2025/hash/f6d8ecbfd29e7ad87627758fadf8a7c6-Abstract-Conference.html) · 사용자 편집을 선호, 지도, 비용 신호의 결합으로 다룬 연구. 디자인 편집으로의 적용은 유추다. (1차 · NeurIPS 2025 · 2026-08-10 확인)

</div>
