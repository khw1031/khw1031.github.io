---
title: '점검 항목별 소양 개발 방안'
pubDate: '2026-07-31T10:28:54+09:00'
description: '위임 점검 목록의 항목마다 그 소양을 기르는 훈련·개발 방안을 근거 수준과 함께 정리한다.'
summary: 'AI 위임 점검 목록의 항목별 소양 개발 방안을 조사해 근거와 함께 둔다. AI 협업 직접 근거가 있는 항목(맥락·경계 제공, 체계 고정, 보안 위생, 검증 루프)과 인접 분야 유추에 기대는 항목이 갈리고, 여러 항목에서 "많이 하면 좋다"에 상한·역효과 근거가 붙었다.'
lang: ko
tags:
  - 'delegation'
  - 'training'
  - 'evidence'
  - 'rubric'
  - 'ai-native'
polishHash: '3450d078d773'
lintHash: '3450d078d773'
---

[상위 노트](/notes/ai-capability-scoring-axes/)의 점검 목록 각 항목에 대해, 그 소양을 기르는 방안을 근거와 함께 정리한 것이다. 조사 전체를 관통하는 판정 세 개를 먼저 둔다.

1. **==근거의 지형이 항목마다 다르다.==** 맥락·경계 제공, 체계 고정, 보안 위생, 검증 루프에는 AI 협업 맥락에서 직접 수집된 실험 근거가 있다. 요구사항 발굴, 작업 분해, 의도 갱신, 산출물 설명은 교육학·심리학·인간요인 근거를 유추로 이전해야 하고, 완료 정의는 심리학 유추에 AI 직접 근거가 일부 붙는다. 구조화는 훈련 효과의 직접 근거를 찾지 못했다.
1. **=="많이 하면 좋다"가 여러 항목에서 성립하지 않는다.==** 명세는 과잉이 역효과를 내고, 컨텍스트 파일은 평균적으로 성능을 낮추며, 설명 책무는 결론에 먼저 커밋한 상태에서는 방어적 정당화로 흐르고, 사람을 항상 루프에 남기는 설계는 AI가 우위인 과제에서 손실이다. 상한과 조건이 방안의 일부다.
1. **==소양은 자동으로 늘지 않는다.==** 반복 실습만으로 캐묻기가 늘지 않았고, 자동화에 대한 안주는 연습으로 극복되지 않으며, 실패 후 반복은 구조화되지 않으면 대화 길이만 늘린다. 효과를 낸 방안들은 대부분 절차를 바꿔서 효과를 냈다.

## 요구사항 발굴

1. **실수 유형 목록으로 자기 대화를 채점하고, 다른 과제로 다시 캐묻는다.** 요구사항 인터뷰 교육 준실험에서 1차→2차 인터뷰의 실수가 크게 줄었다(d = 1.04). 다만 같은 실험에서 실수 강의·자기평가·동료 리뷰를 얹은 절차가 "두 번 해보기"만 한 대조군보다 유의하게 낫지는 않았다 — 입증된 것은 목록이 아니라 재시도 경험 쪽이다. 목록의 값어치는 어느 실수가 안 고쳐지는지 보이게 하는 데 있다.
1. **빠뜨리는 질문은 훈련하지 말고 종료 전 필수 슬롯으로 강제한다.** 반복 노출로도 개선되지 않은 실수가 정확히 "성공 기준을 묻지 않음"과 "우선순위를 묻지 않음"이었다. 마지막 요약 되돌리기와 함께 대화 종료 조건으로 고정하는 것이 문헌이 가리키는 대안이다.

한계: 근거 전부가 사람↔사람 인터뷰다. AI는 인간 고객과 달리 모른다고 말하지 않고 추측으로 채우므로, 유추는 그만큼 약해진다.

## 맥락·경계 제공

항목 중 근거가 가장 강하다 — 전부 AI 협업 맥락에서 직접 수집됐다.

1. **프롬프트를 성분으로 분해해 고른 뒤 직접 쓰는 훈련은 효과가 있고 유지된다.** 문제·맥락·방법·수신자·가드레일 다섯 성분의 후보를 고르고 전체를 직접 작성하는 조건이 무작위 대조 실험에서 가장 크게 늘었고, 7주 뒤에도 대조군의 4배를 유지했다. 다만 과목 성적으로는 전이되지 않았다.
1. **명시할 요구사항을 고른다 — 전부 쓰지 않는다.** LLM은 말하지 않은 요구사항을 41.1%만 기본으로 채우고, 미명시 항목은 모델·프롬프트가 바뀔 때 2배 더 자주 퇴행한다. 그런데 전부 명시하면 지시 이행 한계로 성능이 최대 19% 떨어진다. 모델이 기본으로 지키는 것은 빼고 지키지 않는 것만 남기는 선별이 이 항목의 소양이다.
1. **자기 대화 로그를 결함 유형으로 진단한다.** 실제 개발자-LLM 대화 8.3만 건의 68%가 멀티턴이었고, 두 번째 턴이 필요했던 이유의 4분의 1이 명세·맥락 누락이었다. 자기 로그에서 이 비중을 세면 개인의 반복 실패 지점이 나온다.

## 작업 분해

1. **서브골 라벨이 붙은 예제로 시작한다.** 완성된 해법의 단계 묶음마다 목표 라벨을 붙인 예제를 본 뒤 다른 맥락의 문제를 푸는 방식이다. 워크드 예제 일반의 메타분석은 g = 0.48(수학 영역)이고, CS1 한 학기 실험에서는 시험 점수 향상 대신 중도 포기·낙제 감소로 나타났다. 프로그래밍 재현은 일관되지 않다.
1. **분해는 사람이 주도하고 AI는 막힌 노드에만 개입시킨다.** 학습자가 단계 트리를 만들고 LLM이 노드별 피드백만 주는 설계가 학습 이득과 관여를 올렸다는 보고가 있으나 N = 24 탐색 연구다. 계획을 실행 추적 같은 검증 가능한 형태로 만들게 한 실험(N = 20)은 추론의 결을 바꿨지만 최종 성능 차이를 내지 못했다.

한계: 교육학 근거는 두껍지만 전부 AI 없는 교실이다. "분해를 배우면 AI에게도 잘 쪼개 맡긴다"의 직접 근거는 없다.

## 완료 정의

1. **완료 판정문을 조건-행동 쌍까지 쓴다.** 구체적 목표가 "잘 해줘"보다 수행을 높인다는 것은 수십 년 축적 근거다(무작위 실험만 모은 메타분석 d = 0.34). 목표 진술만으로는 부족하고, "상황 Y가 오면 행동 X"를 미리 정하는 실행 의도가 d = 0.65의 효과를 낸다. "검증이 실패하면 중단하고 보고한다"류의 문장이 이 형태다(사람의 자기 목표 연구라 위임으로의 이전은 유추).
1. **명세에는 상한이 있다.** 명세 상세도는 AI 산출물 성능을 크게 좌우하지만 도메인마다 포화점이 다르고, 과잉 명세가 정확도를 떨어뜨린다는 탐색 근거도 있다. 실무 관찰에서는 구체성·맥락이 실행 가능한 코드를, 검증 가능성 단서가 코드 채택을 예측했다.
1. **완료 조건은 사람이 직접 쓴다.** LLM이 쓴 목표는 형식 점수가 훨씬 높은데도 심리적 소유감과 실행률이 크게 낮았다 — 2주 후 실행률 72.8% 대 46.6%(사전등록 실험, N = 470, 자기계발 목표 맥락). AI에게는 초안 대필이 아니라 반례 검토를 시킨다.

ATDD·example mapping 같은 실무 규범 자체의 통제 실험 근거는 약하다 — 지지는 goal-setting 문헌에서 간접적으로 온다.

## 의도 갱신

1. **위임 사이클 끝에 네 질문 디브리프를 붙인다.** 무엇을 의도했나, 실제로 무슨 일이 일어났나, 왜 차이가 났나, 다음 지시에서 무엇을 바꾸나. 디브리프 메타분석(46개 표본)은 약 25%의 수행 향상(d = 0.67)을 보고하고, 매일 15분 성찰 기록만으로 훈련 성과가 22.8% 오른 현장 실험이 있다(워킹 페이퍼).
1. **실패를 다음 지시에 명시적으로 편입한다.** 오류를 장려하고 탐색하게 하는 오류 관리 훈련의 효과는 특히 구조가 다른 과제로의 적응적 전이에서 컸다(d = 0.80). 반대쪽 관찰도 있다 — GitHub 이슈의 개발자-LLM 대화 686건에서 실패한 대화는 프롬프트 개수가 아니라 총 길이만 길었다. 구조화되지 않은 반복은 갱신이 아니라 왕복이다.
1. **결정 이유와 기각 대안은 짧은 템플릿으로 남긴다.** ADR 템플릿 비교 실험에서 가장 단순한 형식(Nygard)이 이해·사용성에서 우세했다. 다만 학부생 33명 수준의 근거다.

decision journal 자체의 통제 근거는 없다 — 가장 가까운 것이 위 디브리프 메타분석과 성찰 기록 실험이다.

## 체계 고정

통념과 근거가 가장 크게 어긋나는 항목이다.

1. **컨텍스트 파일은 사람이 직접, 최소로 쓰고, 삭제까지 유지한다.** 실과제 138건 통제 평가에서 컨텍스트 파일은 평균적으로 과제 성공률을 낮추고 추론 비용을 20% 넘게 올렸다. LLM이 생성한 파일은 −2~3%p, 사람이 쓴 파일만 +4%p였고, 흔히 권장되는 저장소 개요는 도움이 되지 않았다. 대규모 관찰에서는 파일이 추가만 되고 삭제되지 않는 컨텍스트 부채가 확인됐다. 고정하는 행위가 아니라 무엇을 얼마나 고정하는지가 소양이다.
1. **체크리스트 효과는 맥락 의존으로 취급한다.** 수술 체크리스트의 사망률 절반 감소는 유명하지만, 병원 101곳·수술 21만 건 규모의 재현에서는 유의한 효과가 없었다. 기저 수행이 낮고 구현 충실도가 높을 때 듣는다는 것이 종합 판정이다(의료 맥락 유추).
1. **개입 지점을 과제 유형으로 분기한다.** 사람-AI 조합은 평균적으로 둘 중 더 나은 단독보다 못했고(메타분석 106개 연구, g = −0.23), 특히 AI가 사람보다 잘하는 결정 과제에서 사람을 루프에 남기는 설계가 가장 큰 손실을 냈다. 사람이 우위인 과제의 조합은 이득이었다. "늘 사람이 확인한다"를 체계로 고정하는 것 자체가 비용일 수 있다.

## 실행성

1. **테스트를 먼저 받고, 테스트의 강도를 사람이 심사한다.** TDD 자체의 메타분석은 외부 품질 소폭 개선·생산성 무효과로 혼재한다. 확실한 쪽은 통과 신호의 신뢰도가 테스트 집합의 강도에 달려 있다는 것이다 — 벤치마크의 테스트를 80배로 늘리자 통과율이 최대 29% 떨어지고 모델 순위가 뒤집혔다. "테스트 통과"를 믿으려면 테스트부터 심사해야 한다.
1. **mock 사용처를 하나씩 승인한다.** 에이전트 커밋은 사람보다 테스트에 mock을 더 자주 추가한다(36% 대 26%, 커밋 120만 건 관찰). 프로세스 경계 밖 의존성만 mock을 허용하고 나머지는 실제 객체·실 인프라로 교체시킨다.
1. **병합 게이트를 CI에 두고, 실패하면 다시 시키기 전에 로그를 사람이 먼저 읽는다.** CI를 안정적으로 쓰는 프로젝트들에서 병합량이 늘어도 사용자 보고 버그는 늘지 않았다(246개 프로젝트 관찰, 인과 아님).

## 구조화

훈련 효과의 직접 근거가 없는 항목이다. 격리 계층·에러 분류 능력을 기르는 방법의 실증 연구를 찾지 못했고, 코딩 카타도 마찬가지다. 인접한 의도적 연습 메타분석에서 직업 영역의 성과 분산 설명력은 1% 미만이었다.

1. **AI가 실제로 어기는 원칙을 체크리스트로 만들어 산출물에 대고 읽는다.** AI 생성 프로젝트는 기능 정확도 91%에서도 설계 이슈 수천 건을 냈고(중복, 과대 메서드, 예외 처리, SRP·SoC·DRY 위반), 코드 분량이 구조 열화의 거의 완벽한 예측자였으며 상세한 프롬프트도 이를 완화하지 못했다. 반면 실환경 측정에서는 AI-사람 차이가 작다는 보고도 있어 결과는 혼재다.
1. **리뷰 커버리지와 참여를 스스로 계측한다.** 리뷰 참여가 낮은 컴포넌트에 릴리스 후 결함이 더 붙는다는 관찰(사람 코드, 유추)을 가져와, 병합한 변경 중 줄 단위로 실제 읽은 비율을 기록하고 떨어지는 주에는 병합량을 줄인다.

## 보안 위생

행동을 바꾸는 개입의 근거가 가장 강한 항목이다.

1. **보안 요구를 프롬프트와 수용 기준 양쪽에 문자로 고정한다.** 비밀번호 저장 실험에서 "안전하게 저장하라"를 명시받지 않은 참가자 10명 전원이 안전한 구현에 실패했고, 명시받은 쪽은 10명 중 7명이 해싱을 넣었다. 프리랜서 개발자 현장 재현에서도 같았다. 지식이 행동을 보장하지 않고, 명시된 요구가 행동을 바꾼다. 스캐너 결과를 채점·보상에 연동한 실험도 보안 이슈 밀도를 유의하게 낮췄다.
1. **"문제 없다"는 프레이밍을 제거하고, 시크릿 스캐너를 커밋 전에 건다.** LLM 보안 리뷰는 확증 편향에 취약해서 취약 코드를 "버그 없음"으로 프레이밍하면 탐지율이 최대 93%p 떨어진다(97.2%→3.6%). "메타데이터를 무시하라"는 명시 지시로 대부분 회복된다. 시크릿은 OWASP 권고대로 pre-commit·IDE 단계에서 차단하고 로그에 절대 남기지 않는다.
1. **훈련 전후를 스캐너로 측정한다.** 보안 훈련 뒤 LLM 보조 개발의 검증된 취약점이 31.5% 준 준실험이 있으나 N = 12 소표본이다. CTF 기반 훈련은 체계적 리뷰(개입 연구 412건)가 증거 기반 부실을 결론냈다 — 참여·자신감 보고는 많지만 행동 변화를 잰 통제 연구가 없다.

## 산출물 설명

1. **화면을 닫고 기억으로 되설명한 뒤 대조한다.** 자기설명 유도는 g = 0.55의 안정적 학습 효과가 있고, 설명은 자료를 보면서 할 때가 아니라 기억에서 인출할 때 지연 이해가 가장 컸다. 상위 노트의 세 하위 질문(근거·구조·동작)을 닫힌 화면에서 답하고, 열어서 어긋난 부분만 다시 읽는다.
1. **설명 예고는 위임 전에 걸되, 실제 설명 산출까지 간다.** 가르칠 것을 예상하고 준비만 해도 g = 0.35, 실제로 가르치면 g = 0.56 — 예고만으로는 지연 효과가 없다는 것이 경계조건이다. 설명 책무는 양날이어서, 결론에 먼저 커밋한 뒤에 걸면 방어적 정당화로 흐른다. 판단을 형성하기 전에 걸어야 한다.
1. **설명을 실행해서 검증한다.** 코드를 보지 않고 쓴 목적 설명만 새 LLM 세션에 넣어 코드를 재생성시키고 원래 테스트를 돌린다(EiPE 방식, 대학 강의에서 자동채점으로 실운영). 통과 여부가 설명의 충실도를 관찰 가능하게 만든다 — 단 이것은 설명의 검증 수단이지, 이 활동이 이해력을 늘린다는 근거는 아니다.

"설명 훈련이 산출물 통제력을 만든다"는 인과는 미확립이다. 설명·추적·작성 능력의 위계를 600여 명으로 재현하려던 연구에서 원래 위계가 최적 모델에 나타나지 않았다.

## 검증 루프

1. **AI를 열기 전에 자기 판단을 먼저 적는다.** 인지적 강제(cognitive forcing) 실험에서 AI가 틀린 문항의 정답률이 크게 올랐다(d = 0.66, 과의존 감소 d = 0.36). 단 세 설계(먼저 답하기, 요청해야 보이기, 30초 지연) 사이에 차이는 없었고, 효과가 큰 조건일수록 참가자 선호는 나빴으며, 과의존이 완전히 사라지지도 않았다.
1. **검증 비용을 읽기 비용보다 싸게 만든다.** 과의존은 인지의 필연이 아니라 비용-편익에 반응하는 전략적 선택이다(실험 5건, N = 731). 위임과 동시에 실패하는 테스트·한 줄 재현 스크립트·경계 조건 어서션을 만들어 두면, 산출물 판정이 "읽어서"에서 "돌려서"로 바뀐다.
1. **자기 지각 대신 관찰치를 기록해 대조한다.** 숙련 개발자들이 실측으로는 19% 느려지고도 20% 빨라졌다고 느낀 무작위 현장 실험이 근거다(후속 정정으로 방향 자체는 인용 불가, 체감-실측 괴리만 살아 있다). 위임 작업마다 소요 시간·재작업 횟수·되돌린 커밋을 기록하고 체감과 나란히 놓는다.
1. **결론 대신 질문으로 받는 것도 판별을 올렸다.** AI가 설명을 서술하는 대신 확인할 지점을 질문으로 던지게 한 조건이 논리 판별 정확도를 유의하게 올렸다(효과크기 미확보, 기술 산출물로의 이전은 유추).

## 공통 기준 — 증거 기반 추론

1. **짧은 확률 추론 훈련이 오래 갔다.** 기준율·베이즈 갱신·독립 증거 평균화 같은 소수 규칙을 1시간 미만으로 훈련한 조건이 예측 토너먼트에서 4년 내내 판단 정확도(Brier 점수)를 6~11% 개선하고 과신을 줄였다. 판단을 확률 문장으로 적고 결과가 확정될 때마다 대조하는 절차로 옮길 수 있다(지리정치 예측 과제 유추).
1. **argument mapping은 채택 보류.** 크게 인용되는 0.8 SD 향상은 옹호자 계열 자료에서만 나오고 원문 확인에 실패했으며, 2025년 독립 리뷰는 견고한 실증 근거가 제한적이라고 결론냈다.

---

<div class="refs">

## 참조

확인 수준은 2026-07-31 조사 시점의 접근 결과다.

**요구사항 발굴**

- [Ferrari, Spoletini, Bano & Zowghi (2019), Learning Requirements Elicitation Interviews with Role-playing, Self-assessment and Peer-review (RE'19)](https://par.nsf.gov/servlets/purl/10171279) · SaPeer 준실험(N = 43). 1차→2차 실수 감소 d = 1.04; 절차 추가분의 우위는 미입증(p = 0.0755). (1차, 원문 확인)
- [Bano, Zowghi, Ferrari, Spoletini & Donati (2019), Teaching requirements elicitation interviews (Requirements Engineering)](https://doi.org/10.1007/s00766-019-00313-0) · 34개 실수 유형 도출. 3회 인터뷰 반복으로 질문 형성·누락이 늘지 않았다는 부정적 결과. (1차, 초록 확인)

**맥락·경계 제공**

- [Xiao et al., Transforming GenAI Policy to Prompting Instruction: An RCT (arXiv:2602.16033)](https://arxiv.org/html/2602.16033) · CS1 4군 RCT(분석 N = 431). 고르고 쓰기 조건 최대 향상, 7주 유지, 과목 성적 전이는 실패. (1차 preprint, 원문 확인)
- [Yang, Shi, Ma, Liu, Kästner & Wu (2026), What Prompts Don't Say (Findings of ACL 2026)](https://aclanthology.org/2026.findings-acl.441.pdf) · 미명시 요구사항 기본 충족 41.1%, 미명시 시 −22.6%p, 전부 명시 시 −19%. (1차, 원문 확인)
- [Zhong, Zou & Adams (2025), Developer-LLM Conversations (arXiv:2509.10402)](https://arxiv.org/pdf/2509.10402) · 대화 82,845건. 68% 멀티턴, 결함 유형 중 명세·맥락 누락 25.3%. (1차 preprint, 원문 확인)

**작업 분해**

- [Margulieux, Morrison & Decker (2020), Reducing withdrawal and failure rates in introductory programming with subgoal labeled worked examples (IJ STEM Ed)](https://doi.org/10.1186/s40594-020-00222-7) · CS1 265명. 퀴즈 향상, 시험 유의차 없음, 중도 포기·낙제 감소. (1차, 초록 확인)
- [Barbieri et al. (2023), A Meta-analysis of the Worked Examples Effect (Educ Psychol Rev)](https://doi.org/10.1007/s10648-023-09745-1) · 55개 연구, g = 0.48. 수학 영역이라 간접 근거. (1차, 초록 확인)
- [Ma et al. (2025), DBox: Learner-LLM Co-Decomposition (CHI)](https://arxiv.org/abs/2502.19133) · N = 24 피험자 내. 학습 이득·관여 향상 보고, 통계치 미확인. (1차, 초록 확인)
- [Jain, Do, Wu & Wang (2026), Tracing in AI-Supported Planning (arXiv:2602.03197)](https://arxiv.org/pdf/2602.03197) · N = 20. 추론의 결 변화, 최종 성능 차이 없음(귀무 결과). (1차 preprint, 원문 확인)

**완료 정의**

- [Locke & Latham (2002), Building a practically useful theory of goal setting (American Psychologist)](https://pubmed.ncbi.nlm.nih.gov/12237980/) · 구체적·난이도 있는 목표 > "do your best". 떠도는 % 수치는 초록에서 미확인이라 인용하지 않음. (1차, 초록 확인)
- [Epton, Currie & Armitage (2017), Unique effects of setting goals (JCCP)](https://pubmed.ncbi.nlm.nih.gov/29189034/) · RCT 141편 메타분석, 목표 설정 고유 효과 d = 0.34. (1차, 초록 확인)
- [Gollwitzer & Sheeran (2006), Implementation intentions and goal achievement](https://kops.uni-konstanz.de/handle/123456789/10973) · 94개 검증, 실행 의도 d = 0.65. (1차, 초록 확인)
- [Zi, Menon & Guha (2025), More Than a Score: Prompt Specificity (arXiv:2508.03678)](https://arxiv.org/html/2508.03678) · 명세 상세도-성능 곡선, 도메인별 포화점. (1차 preprint, 원문 확인)
- [Akli, Papadakis, Cordy & Le Traon (2026), When Prompt Under-Specification Improves Code Correctness (arXiv:2604.24712)](https://arxiv.org/pdf/2604.24712) · 과잉 명세 축소가 정확도를 올리는 경우가 있다는 탐색 결과. (1차 preprint, 주장 방향만 확인 · 수치 미확인)
- [Sserunjogi, Ogenrwot & Businge (2026), Prompt Quality and Pull Request Outcomes (arXiv:2606.19644)](https://arxiv.org/abs/2606.19644v1) · 265건 관찰. 구체성·맥락→실행 가능, 검증 단서→채택. (1차 preprint, 원문 확인)
- [Chi, Rietsche, Göldi, Ungar & Guntuku (2026), Optimized but Unowned (arXiv:2605.12344)](https://arxiv.org/abs/2605.12344) · 사전등록 N = 470. AI 대필 목표는 소유감·실행률 하락. (1차 preprint, 초록 확인)

**의도 갱신**

- [Tannenbaum & Cerasoli (2013), Do team and individual debriefs enhance performance? (Human Factors)](https://pubmed.ncbi.nlm.nih.gov/23516804/) · 46개 표본 메타분석, d = 0.67(약 25% 향상). 군사·의료 맥락 유추. (1차, 초록 확인)
- [Keith & Frese (2008), Effectiveness of error management training (JAP)](https://pubmed.ncbi.nlm.nih.gov/18211135/) · 24개 연구 메타분석, 전체 d = 0.44, 적응적 전이 d = 0.80. (1차, 초록 확인)
- [Di Stefano, Gino, Pisano & Staats, Learning by Thinking (SSRN 2414478)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2414478) · 15분 성찰 기록으로 +22.8%. 워킹 페이퍼, 수치는 검색 요약 경유. (1차, 초록 확인 · 수치 미검증)
- [Ehsani, Pathak, Parra, Haiduc & Chatterjee, What Characteristics Make ChatGPT Effective for Software Issue Resolution? (arXiv:2506.22390)](https://arxiv.org/html/2506.22390) · 대화 686건 중 62%만 유용. 실패 대화는 개수가 아니라 길이만 길었다. (1차 preprint, 원문 확인)
- [Nogueira, Silva & Conte (2026), An Empirical Comparison of ADR Templates (arXiv:2604.27333)](https://arxiv.org/html/2604.27333) · 학부생 33명 크로스오버. 단순 템플릿(Nygard) 우세. (1차 preprint, 원문 확인)

**체계 고정**

- [Gloaguen, Mündler, Müller, Raychev & Vechev (2026), Evaluating AGENTS.md (arXiv:2602.11988)](https://arxiv.org/abs/2602.11988) · 실과제 138건 통제 평가. LLM 생성 파일 −2~3%p, 사람 작성 +4%p, 비용 +20% 이상. 저장소 개요는 무익. (1차 preprint, 원문 확인)
- [Chatlatanagulchai et al. (2025), Agent READMEs (arXiv:2511.12884)](https://arxiv.org/html/2511.12884v1) · 컨텍스트 파일 2,303개 관찰. 보안·성능 가드레일 14.5%, 추가만 되고 삭제 안 되는 컨텍스트 부채. (1차 preprint, 원문 확인)
- [Haynes et al. (2009), A Surgical Safety Checklist (NEJM)](https://pubmed.ncbi.nlm.nih.gov/19144931/) · 8개 병원 전후 비교. 사망률 1.5%→0.8%. (1차, 초록 확인)
- [Urbach et al. (2014), Introduction of Surgical Safety Checklists in Ontario (NEJM)](https://pubmed.ncbi.nlm.nih.gov/24620866/) · 101개 병원·21만 건. 유의한 효과 없음 — 대규모 재현 실패. (1차, 초록 확인)
- [Vaccaro, Almaatouq & Malone (2024), When combinations of humans and AI are useful (Nature Human Behaviour)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11659167/) · 106개 실험 메타분석. 조합 g = −0.23, 결정 과제 손실·생성 과제 이득 경향. (1차, 원문 확인)

**실행성**

- [Rafique & Mišić (2013), The Effects of Test-Driven Development: A Meta-Analysis (IEEE TSE)](https://doi.org/10.1109/TSE.2012.28) · 외부 품질 작은 개선, 생산성 유의 효과 없음. (1차, 초록 확인)
- [Liu, Xia, Wang & Zhang (2023), Is Your Code Generated by ChatGPT Really Correct? (NeurIPS)](https://arxiv.org/abs/2305.01210) · 테스트 80배 확장 시 통과율 최대 −28.9%, 모델 순위 역전. (1차, 초록 확인)
- [Hora & Robbes (2026), Are Coding Agents Generating Over-Mocked Tests? (MSR)](https://arxiv.org/abs/2602.00409) · 커밋 120만 건. 에이전트 mock 추가 36% 대 사람 26%. (1차, 초록 확인)
- [Vasilescu, Yu, Wang, Devanbu & Filkov (2015), Quality and Productivity Outcomes Relating to Continuous Integration (FSE)](https://yuyue.github.io/res/paper/fse2015.pdf) · 246개 프로젝트 관찰. 병합 증가에도 사용자 보고 버그 비증가. (1차, 원문 확인)

**구조화**

- [McIntosh, Kamei, Adams & Hassan (2014), The Impact of Code Review Coverage and Participation (MSR)](https://doi.org/10.1145/2597073.2597076) · 낮은 리뷰 참여 컴포넌트에 릴리스 후 결함 최대 +5건. 사람 코드 관찰이라 유추. (1차, 초록 확인)
- [Kashif et al. (2026), Beyond Functional Correctness (arXiv:2604.06373)](https://arxiv.org/abs/2604.06373) · AI 생성 10개 프로젝트. 기능 정확도 91%에 설계 이슈 4,498건. (1차 preprint, 초록 확인)
- [Zhu, Tsantalis & Rigby (2026), AI-Generated Smells (arXiv:2605.02741)](https://arxiv.org/abs/2605.02741) · 코드 분량이 구조 열화의 예측자, 프롬프트로 완화 안 됨. (1차 preprint, 초록 확인)
- [Mao et al. (2026), A Large-Scale Comprehensive Measurement of AI-Generated Code (arXiv:2603.27130)](https://arxiv.org/abs/2603.27130) · 실환경 저장소에서 AI-사람 코드 지표 차이 작음 — 반대 방향 근거. (1차 preprint, 초록 확인)
- [Macnamara, Hambrick & Oswald (2014), Deliberate Practice and Performance: A Meta-Analysis (Psychological Science)](https://doi.org/10.1177/0956797614535810) · 88개 연구. 의도적 연습의 성과 분산 설명력: 직업 영역 1% 미만. (1차, 초록 확인)

**보안 위생**

- [Naiakshina et al. (2017), Why Do Developers Get Password Storage Wrong? (CCS)](https://arxiv.org/abs/1708.08759) · N = 20 통제 실험. 비명시 10명 전원 실패, 명시 7/10 해싱. (1차, 원문 확인)
- [Naiakshina et al. (2019), A Password-Storage Field Study with Freelance Developers (CHI)](https://doi.org/10.1145/3290605.3300370) · 프리랜서 현장 재현 — 명시 없으면 대다수 불안전. (1차, 검색 요약 경유)
- [Perry, Srivastava, Kumar & Boneh (2023), Do Users Write More Insecure Code with AI Assistants? (CCS)](https://arxiv.org/abs/2211.03622) · AI 보조군 덜 안전 + 과신; 프롬프트를 더 손본 참가자는 취약점 적음. 상위 노트 참조와 동일 출처. (1차, 초록 확인)
- [Mitropoulos, Alexopoulos, Alexopoulos & Spinellis (2026), Confirmation Bias in LLM-Assisted Security Code Review (arXiv:2603.18740)](https://arxiv.org/abs/2603.18740) · "버그 없음" 프레이밍 시 탐지율 최대 −93%p, "메타데이터 무시" 지시로 회복. (1차 preprint, 원문 확인)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) · pre-commit·IDE 단계 차단, 시크릿 로그 금지, 복수 도구 교차. (공식 가이드, 원문 확인)
- [Kharma et al. (2026), A Quasi-Experimental Developer Study of Security Training in LLM-Assisted Development (arXiv:2604.17763)](https://arxiv.org/abs/2604.17763) · N = 12 사전/사후. 취약점 −31.5%, 크리티컬 −79.2%. 소표본·대조군 없음. (1차 preprint, 원문 확인)
- [Mayberry (2026), Assessment and Evidence Practices in Cybersecurity Education: A Systematic Review (JCERP)](https://digitalcommons.kennesaw.edu/jcerp/vol2026/iss1/23/) · 개입 연구 412건 중 45.4%가 평가 없음 — CTF 근거 부실의 출처. (1차, 원문 확인)

**산출물 설명**

- [Bisra, Liu, Nesbit, Salimi & Winne (2018), Inducing Self-Explanation: a Meta-Analysis (Educ Psychol Rev)](https://doi.org/10.1007/s10648-018-9434-x) · 64개 연구·5,917명, g = 0.55. (1차, 초록 확인 + 요약 PDF 교차확인)
- [Kobayashi (2019), Learning by Preparing-to-Teach and Teaching: A Meta-Analysis (Japanese Psychological Research)](https://onlinelibrary.wiley.com/doi/10.1111/jpr.12221) · 준비만 g = 0.35, 실제 교수 g = 0.56. (1차, 검색 요약 경유 · Fiorella 챕터에서 교차확인)
- [Fiorella (2023), Learning by Teaching (APA Division 2 챕터)](https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-learning-by-teaching-fiorella.pdf) · 인출 기반 설명이 최대 효과라는 조건, 예고만으로는 지연 효과 없음이라는 경계조건. (2차, 원문 확인)
- [Denny et al. (2024), Explaining Code with a Purpose (ITiCSE)](https://arxiv.org/abs/2403.06050) · EiPE 설명→LLM 코드 재생성→테스트 자동채점의 실운영 근거. 학습 효과 근거는 아님. (1차, 원문 확인)
- [Fowler et al. (2022), Reevaluating the relationship between explaining, tracing, and writing skills in CS1 (CSE)](https://par.nsf.gov/servlets/purl/10340072) · 600여 명 재현. 설명-작성 능력의 원래 위계가 최적 모델에 없음. (1차, 원문 확인)
- [Hall, Frink & Buckley (2017), An accountability account (JOB)](https://doi.org/10.1002/job.2052) · 책무성은 인지 편향을 줄이기도 키우기도 한다 — 설명 의무의 양날 근거. (1차, 원문 확인)

**검증 루프**

- [Buçinca, Malaya & Gajos (2021), To Trust or to Think: Cognitive Forcing Functions (CSCW)](https://doi.org/10.1145/3449287) · N = 199. AI 오답 문항 정답 d = 0.66, 과의존 감소 d = 0.36. 설계 3종 간 무차이, 선호는 악화. (1차, 원문 확인)
- [Vasconcelos et al. (2023), Explanations Can Reduce Overreliance on AI Systems (CSCW)](https://hci.stanford.edu/publications/2023/xai-cscw-2023.pdf) · 실험 5건·N = 731. 과의존 = 비용-편익에 반응하는 전략적 선택. (1차, 원문 확인)
- [METR (2025), Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · 실측 −19% 대 체감 +20%. 상위 노트 참조와 동일 출처이며 2026-02 정정으로 방향은 인용 불가, 체감-실측 괴리만 유효. (1차, 원문 확인)
- [Prather et al. (2024), The Widening Gap (ICER)](https://arxiv.org/abs/2405.17739) · 초보자의 illusion of competence 관찰. (1차, 초록 확인)
- [Danry, Pataranutaporn, Mao & Maes (2023), Don't Just Tell Me, Ask Me (CHI)](https://doi.org/10.1145/3544548.3580672) · N = 204. 질문 프레이밍이 논리 판별을 유의하게 향상, 효과크기 미확보. (1차, 초록 확인)

**공통 기준**

- [Chang, Chen, Mellers & Tetlock (2016), Developing expert political judgment (Judgment and Decision Making)](https://www.cambridge.org/core/journals/judgment-and-decision-making/article/developing-expert-political-judgment-the-impact-of-training-and-practice-on-judgmental-accuracy-in-geopolitical-forecasting-tournaments/123EB18425391D05FA6581FDBB3F309F) · 1시간 미만 확률 추론 훈련이 4년 내내 Brier 점수 6~11% 개선. (1차, 초록 확인)
- [Chang, Lin & Hwang (2025), Charting the field: argument visualization research (Frontiers in Education)](https://doi.org/10.3389/feduc.2025.1672105) · argument mapping의 견고한 실증 근거는 제한적이라는 독립 리뷰. (2차 리뷰, 원문 확인)

</div>
