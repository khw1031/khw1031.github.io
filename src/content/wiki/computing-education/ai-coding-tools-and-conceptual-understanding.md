---
type: Reference
title: AI 코딩 도구와 개념적 이해
pubDate: '2026-07-08'
resource: https://doi.org/10.3390/computers14050185
description: AI 코딩 도구가 프로그래밍 학습 성과를 실제로 어떻게 바꾸는지에 대한 체계적 문헌고찰 결과
summary: "AI 코딩 도구(ChatGPT, GitHub Copilot 등)는 과제 완료 속도와 산출물 점수는 뚜렷이 높이지만, 개념 이해나 학습 성공 자체에는 통계적으로 유의한 이점을 보이지 않는다는 것이 35편의 통제 연구를 종합한 체계적 문헌고찰의 결론이다. 컴퓨팅 교육 연구자들은 이와 별개로, 학생이 AI 산출물을 그대로 베끼는지 능동적으로 수정·검증하는지가 실제 학습 효과를 가른다고 지적한다."
lang: ko
tags: ['ai-coding-tools', 'programming-education', 'systematic-review', 'genai']
lintHash: 'dcde9030fcc7'
---

> 한 줄 명제: AI 코딩 도구는 "더 빨리, 더 잘 돌아가는 코드"는 확실히 만들어 주지만, "왜 그렇게 동작하는지"에 대한 이해까지 자동으로 만들어 주지는 않는다 — 그 사이를 가르는 것은 도구가 아니라 학생이 그 결과물을 대하는 방식이다.

## 핵심

Alanazi, Soh, Samra 외(2025)는 2020~2024년에 발표된 AI 코딩 도구(ChatGPT 3.5, GitHub Copilot 등) 관련 통제 연구 35편을 종합한 체계적 문헌고찰·메타분석을 수행했다. 결과는 뚜렷이 갈린다: AI 도구를 쓴 학생은 과제 완료 시간이 줄고 산출물 점수(수행 점수)는 높아졌지만, 학습 성공(learning success)이나 이해의 용이성(ease of understanding) 자체에서는 통계적으로 유의한 이점이 나타나지 않았다. 즉 AI 도구는 "결과물의 질과 속도"와 "그 결과물을 만들어낸 원리에 대한 이해"라는 서로 다른 두 축 중 앞의 축만 뚜렷이 끌어올린다.

같은 맥락에서 Bernstein 외(2025)의 체계적 문헌고찰(Koli Calling '25)은 생성형 AI가 컴퓨팅 교육에 가져오는 위해(harm)를 다룬 224편의 문헌을 분석하며, 학업 성실성 문제와 함께 인지적 효과(과의존 등)를 주요 범주로 꼽는다 — 다만 이 범주의 경험적 근거는 아직 충분히 축적되지 않았다고 지적한다. 여러 연구를 종합하면 실무적 시사점은 하나로 모인다: AI가 만든 코드를 그대로 받아 제출하는 학생은 최적화나 비판적 평가 능력이 잘 늘지 않는 반면, 그 코드를 능동적으로 수정·테스트·디버깅하는 학생은 프로그래밍 개념에 대한 이해가 더 깊어진다는 것이다. 이는 필기 도구가 아니라 인지적 관여 양식이 학습을 가른다는 [ICAP 프레임워크](/wiki/learning-science/icap-framework/)와 같은 결의 결론이며, "AI를 잘 쓰는 것과 이해하는 것은 다르다"는 인터뷰의 직관을 (손으로 써야 한다는 구체적 처방과는 별개로) 실증적으로 뒷받침한다.

## 레퍼런스

- [Alanazi, Soh, Samra 외 (2025), The Influence of Artificial Intelligence Tools on Learning Outcomes in Computer Programming: A Systematic Review and Meta-Analysis — Computers (MDPI), 14(5), 185](https://doi.org/10.3390/computers14050185) — 1차. 통제 연구 35편(2020–2024) 종합. 성능↑, 학습성공·이해 용이성은 유의한 차이 없음.
- [Bernstein, Rahman, Sharifi, Terbish & MacNeil (2025), Beyond the Benefits: A Systematic Review of the Harms and Consequences of Generative AI in Computing Education — Koli Calling '25](https://doi.org/10.1145/3769994.3770036) — 1차. 224편 종합, 인지적 과의존을 포함한 위해 범주화. 해당 범주의 경험적 근거는 아직 부족하다고 명시.

## 연결

- [ICAP Framework](/wiki/learning-science/icap-framework/) — "그대로 받기 vs 능동적으로 재구성하기"라는 이 카드의 핵심 축을 일반화한 학습심리학 틀.
- [Procedural vs Conceptual Knowledge](/wiki/learning-science/procedural-vs-conceptual-knowledge/) — AI 도구가 높이는 것은 절차적 산출(작동하는 코드)이고, 개념적 이해는 별도로 다뤄야 한다는 논의와 연결.
- [Computing Education](/wiki/computing-education/) — 이 카테고리의 허브.
