---
title: "LLM 내부 메커니즘 개념 정리"
description: "LLM이 벡터를 문맥에 맞게 변환하는 내부 연산을 다루는 학습 노트 허브. 현재는 attention의 Q·K·V 가중합을 다룬다."
---

LLM을 "입력 벡터 → 벡터 변환 → 출력 벡터"라는 한 흐름으로 보면, 이 카테고리는 가운데 **변환**의 내부를 다룬다. 모델을 블랙박스로 두고도 서비스는 만들 수 있지만, 무엇이 문맥 의존이고 무엇이 문맥 무관인지를 모르면 검색 품질이 왜 안 나오는지를 설명할 수 없다.

지금은 [Attention의 Q·K·V 가중합 메커니즘과 임베딩과의 경계](/study-note/llm/attention/) 한 편이다. 문맥 무관 lookup인 임베딩과 문맥 의존 갱신인 attention의 구분을 잡는 것이 이 노트의 목적이고, 그 구분이 서면 [ai-service-design](/study-note/ai-service-design/)의 벡터화 설계 노트로 넘어가면 된다. 아래 목차 참고.
