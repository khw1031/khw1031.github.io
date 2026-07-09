---
title: 'Loop Engineering — 에이전트 루프의 네 가지 아키텍처'
pubDate: '2026-07-09'
description: 'AI 에이전트 엔지니어링에서 "루프"가 실제로 가리키는 네 가지 아키텍처(execution·task·product·system)의 반복 대상, 종료 조건, 인간 역할을 비교 분류한 학습 노트.'
summary: 'Aparna Dhinakaran의 분류를 중심으로, 루프라는 용어 아래 혼재된 다섯 아키텍처의 반복 대상과 종료 조건, 자율성 다이얼의 위치를 정리한다.'
tags: ['ai-engineering', 'agent-loops', 'software-factory', 'loop-engineering']
lang: 'ko'
polishHash: 'f07ca7378fc9'
lintHash: 'f07ca7378fc9'
---

> 한 줄 명제: "루프"는 하나의 개념이 아니라, 반복 대상과 종료 조건이 서로 다른 네 가지 아키텍처의 공통 별명이다.

## 큰 그림

```
루프 엔지니어링 — 에이전트가 반복하는 구조의 전체 스택

┌─────────────────────────────────────────────────┐
│  5. Oversight Loop (감시 루프)                   │
│     반복 대상: 목표·예산·작업 선별                │
│     종료 조건: 없음 (지속) / 인간이 판단           │
├─────────────────────────────────────────────────┤
│  4. System Loop (autoresearch)                  │
│     반복 대상: 프롬프트·하네스·모델·eval 자체      │
│     종료 조건: eval 점수·judge·filtered feedback  │
├─────────────────────────────────────────────────┤
│  3. Product Loop (software factory)             │
│     반복 대상: 코드베이스 전체 + 백로그             │
│     종료 조건: 이슈·프로덕션 로그·사용자 피드백      │
├─────────────────────────────────────────────────┤
│  2. Task Loop (Ralph Loop)                      │
│     반복 대상: 단일 산출물(spec 하나)              │
│     종료 조건: spec 충족 + 테스트 통과             │
├─────────────────────────────────────────────────┤
│  1. Execution Loop (act-observe 사이클)          │
│     반복 대상: 한 태스크 안의 개별 단계             │
│     종료 조건: 환경 피드백 (테스트 결과, API 응답)   │
└─────────────────────────────────────────────────┘

  ※ Agentic MapReduce (fan-out)는 루프가 아니라 파이프라인 —
     피드백이 없으면 루프가 아니라 for 문이다.
```

## 핵심

2026년 6월, AI 엔지니어링 커뮤니티에서 "루프"라는 단어가 급격히 확산됐다. Peter Steinberger는 "에이전트에게 프롬프트를 쓰지 말고 루프를 설계하라"고 했고, Anthropic의 Boris Cherny는 "나는 더 이상 Claude에게 프롬프트를 쓰지 않는다. 루프를 짠다"고 했다. Addy Osmani, swyx, LangChain이 연이어 에세이를 발표했고, AI Engineer World's Fair(AIEWF) 메인스테이지를 이 단어가 장악했다.

==문제는 "루프"라고 말하는 사람들이 서로 다른 것을 가리키고 있다는 것이다.== Aparna Dhinakaran은 이 단어 뒤에 최소 네 가지 distinct 아키텍처가 숨어 있다고 분류했다.

**실행 루프(execution loop)**는 에이전트가 도구 호출 → 결과 읽기 → 다음 행동 결정을 반복하는 가장 안쪽 사이클이다. Addy Osmani가 "inner execution loop"라고 부르는 것으로, 인간은 보통 이 루프 중간에는 개입하지 않고 경계(계획 승인, 결과 리뷰)에서만 등장한다. 이 루프의 종료 신호는 환경 피드백 — 테스트 출력, API 응답, 파일 내용 — 이다. 하지만 에이전트가 "다 했다"고 판단하면 실제로든 아니든 끝난다는 문제가 있고, 이를 보완하기 위해 이 루프를 감싸는 바깥 루프가 등장했다.

**태스크 루프(task loop)**는 Geoffrey Huntley의 Ralph Loop에서 이름이 붙었다. 하나의 spec을 두고 에이전트를 매번 완전히 새로운 컨텍스트 윈도우로 재시작한다. "낭비"처럼 보이는 반복이 핵심이다 — ==매번 전체 spec을 다시 주입함으로써, 장시간 세션에서 조용히 누적되는 컨텍스트 부패(context rot)와 압축 이벤트(compaction events)를 방지한다.== 이 루프는 단일 산출물을 반복하고, spec 준수와 테스트 통과로 끝난다. 인간은 spec을 쓰고, 완료 여부를 판단하고, 실패 패턴을 관찰해서 영구 수정하는 역할을 맡는다. Geoffrey Huntley는 이 역할을 "기관사(locomotive engineer)"에 비유했다 — 기차가 레일 위에 있도록 유지하는 것 자체가 직업인 사람.

**프로덕트 루프(product loop)**는 AIEWF에서 가장 크게 다뤄진 버전으로, "소프트웨어 팩토리"라고도 불린다. Factory의 Tereza Tížková는 이를 "소프트웨어를 자율적으로 개발하는 전체 라이프사이클 루프"로 정의했고, Warp의 Zach Lloyd는 그 라이프사이클을 구체적으로 triage → specification → implementation → review → verification → shipping → monitoring으로 나눴다. 이 루프의 반복 대상은 코드베이스 전체와 백로그이고, 종료 신호는 코드베이스 바깥에서 온다 — 신규 이슈, 프로덕션 로그, 사용자 피드백, 리뷰 결과. 인간 역할은 "설정 가능(configurable)"해진다: 라이프사이클 중 어느 부분을 자동화하고 어느 지점에서 인간을 투입할지 조직마다 다르게 결정한다. Anthropic은 내부적으로 제품 팀 코드의 65%가 내부 Claude Tag 버전에서 생성된다고 밝혔고, Mike Krieger는 이를 "위임되고 선제적인(delegated and proactive)" 방식 — "이 버그 고쳐"가 아니라 "이 코드베이스 영역을 담당해, 이 피드백 채널을 모니터링해, 스스로 태스크를 찾아" — 으로 설명했다.

**시스템 루프(system loop)**는 Roland Gavrilescu가 "autoresearch"라고 부르는 것으로, 안쪽 루프(프로덕트 루프 등)가 사용자 대상 작업을 수행하는 동안, 바깥쪽 루프가 그 안쪽 시스템 자체를 연구하고 유지보수한다. 반복 대상은 프롬프트, 하네스, 모델 선택, eval 그 자체다. Roland의 한 줄 요약은 =="루프가 곧 프로덕트다."== 실존 사례로, Andrej Karpathy의 2026년 3월 autoresearch는 약 630줄의 파이썬으로 하룻밤 동안 GPU 하나에서 50개의 hypothesis-edit-evaluate 실험을 돌렸고, Meta의 Brain2Qwerty v2는 에이전트가 코드베이스를 반복 수정하여 더 나은 디코딩 아키텍처를 발명했다고 보고했다. 다만 Meta의 caveat는 시사적이다 — 최종 학습 설정은 여전히 수동으로 선택했다. 플래그십 시스템 루프조차 마지막 체크포인트에는 인간이 있다.

이 네 루프 위에 **oversight 루프(감시 루프)**가 있다. swyx의 다이어그램에서 가장 바깥 고리에 "???? loop"라고 레이블된 것으로, 동사는 목표 설정·배분·선별이고, 종료 조건은 "없음"이다. Aparna는 이 루프에 이름을 붙였다: ==agency(행위 주체성)를 유지하는 고리, 그리고 인간이 반드시 머물러야 하는 고리.== Addy Osmani는 AIEWF 무대에서 "안쪽 루프는 능력(capability)이고, 바깥쪽 루프는 행위 주체성(agency)이다"라고 했다.

AIEWF 폐막 토론에서 가장 날카로운 대립은 결국 이 oversight 루프를 누가 운영하느냐였다. Zach Lloyd와 Roland Gavrilescu는 신뢰가 축적될수록 자율성 다이얼을 올려야 한다고 주장했고, Notion의 Geoffrey Litt은 "이해를 위임하면 에이전트에게 대체된다"고 반론했다. Paul Bakaus는 "자동은 없고, 앞으로도 없다"고 단언했다 — 품질의 문제일 뿐 아니라, 사람은 목적과 자신의 창작물에 대한 역할이 필요하다는 것. Anthropic 내부에서도 Tag 팀이 리뷰와 "시스템이 무엇을 하고 있는지 개념화하는 인간 능력"에 병목이 있다고 보고했는데, 인간이 자신을 위해 남겨둔 체크포인트가 이제 제약 조건이 된 것이다.

## 깊이

### 각 루프의 자율성 다이얼 ⭐내재화

네 루프는 서로 독립적으로 자율성 수준을 설정할 수 있다. 완전히 자율적인 실행 루프를 강력하게 감시되는 프로덕트 루프 안에 넣을 수 있고, 시스템 루프를 에이전트에게 맡기면서도 목표 설정은 완전히 인간이 유지할 수 있다. 흥미로운 엔지니어링 질문은 "어느 진영이 이기느냐"가 아니라, **각 다이얼을 올바르게 설정하기 위해 어떤 정보가 필요한가**다.

| 루프 | 반복 대상 | 종료 신호 | 인간 역할 |
|------|----------|----------|----------|
| Execution | 단계(steps) | 환경 피드백 | 경계에서만 (계획 승인/결과 리뷰) |
| Task | 단일 산출물 | spec 준수 + 테스트 | spec 작성, 실패 패턴 수정 |
| Product | 코드베이스 + 백로그 | 이슈, 로그, 피드백 | 설정 가능 (체크포인트 선택) |
| System | 프롬프트, eval, 하네스 | eval 점수, judge | 최종 체크포인트 |
| Oversight | 목표, 예산, 선별 | 없음 (지속) | 반드시 인간 |

### Agentic MapReduce는 왜 루프가 아닌가 📎offload

Cognition의 Devin Security Swarm은 병렬 bounded agent를 리포지토리 전체에 fan-out하고 결과를 집계하는 패턴("Agentic MapReduce")을 사용한다. 이를 "루프"라고 부르지만, 실제로는 dispatch → gather → validate 파이프라인이다. 아무것도 다음 사이클로 피드백되지 않는다. ==피드백 없는 루프는 그냥 `for` 문이다.== Fan-out은 네 루프 중 어느 것 안에서든 배포할 수 있는 **토폴로지**이지, 루프 그 자체가 아니다.

### Context rot과 Ralph Loop의 "의도적 낭비" ⭐내재화

Ralph Loop가 매번 새 컨텍스트 윈도우로 에이전트를 재시작하는 것은 비효율적으로 보이지만, 이것이 바로 설계 의도다. 장시간 세션에서 발생하는 두 가지 문제를 회피한다: (1) context rot — 대화 기록이 길어질수록 에이전트의 출력이 조용히 저하되는 현상, (2) compaction events — 컨텍스트 윈도우 한계에 도달하면 요약·압축이 발생하며 정보가 손실되는 사건. 매번 전체 spec을 처음부터 주입함으로써, 각 반복이 독립적이고 일관된 품질을 유지한다.

### Gotcha: 루프가 종료 신호 없이 돌 때 📎offload

Aparna의 핵심 경고: 루프에 종료 신호가 실제로 배선되어 있지 않으면, 루프는 수렴하지 않고 외부에서 멈춰줄 때까지 계속 달린다. "종료 조건을 이름 붙이는 것"과 "종료 신호를 실제로 배선하는 것"은 다르. 프로덕션 규모에서 루프가 실제로 닫히고 있는지 확인하려면, 트랜스크립트를 spot-check하는 대신 트레이스를 sweep하고 실패를 연속적으로 클러스터링해야 한다.

## 비유

**공장 비유**: 프로덕트 루프는 "소프트웨어 팩토리"라고 불린다 — 공장이 제품을 만드는 것처럼, 팩토리가 소프트웨어를 만든다. **깨지는 지점**: 공장은 동일한 제품을 반복 생산하지만, 소프트웨어 팩토리는 매 반복마다 다른 산출물을 만들고, 요구사항 자체가 변한다. 공장의 품질 관리는 규격 대비 편차 측정으로 끝나지만, 소프트웨어 팩토리의 품질 판단에는 인간의 해석이 필요한 영역이 남는다.

**기관사 비유**: Geoffrey Huntley는 태스크 루프의 인간을 "기관사"에 비유했다 — 기차가 레일 위에 있도록 유지하는 것이 온전한 직업. **깨지는 지점**: 기관사는 정해진 레일 위에서 정해진 열차를 운영하지만, 태스크 루프의 인간은 레일 자체(실패 패턴)를 수리하고 새로운 레일을 놓아야 한다. 단순 모니터링이 아니라 시스템 개선 엔지니어링이다.

**오케스트라 vs 팩토리**: Roland Gavrilescu의 구분 — 오케스트라는 인간 지휘자를 유지하는 시스템, 팩토리는 인간 없이 돌아가는 시스템. 오케스트라를 먼저 만들고 팩토리로 진화하라. **깨지는 지점**: 오케스트라 지휘자는 연주자들 전체를 실시간으로 듣고 판단하지만, 에이전트 시스템의 "지휘자"는 에이전트 출력을 실제로 이해하지 못한 채 승인만 할 위험이 있다 — 이 경우 지휘자가 아니라 rubber stamp가 된다.

## 곁가지

- **Ralph Loop 심화**: Geoffrey Huntley의 원문과 "everything is a ralph loop" 프레임워크를 깊이 읽고 싶을 때 — 실제 spec 작성 패턴, 실패 패턴 카탈로그, 재시작 전략이 필요해질 때.
- **Software Factory 아키텍처**: Warp의 Oz, Anthropic의 Claude Tag 등 실제 팩토리 구현체의 구체적 아키텍처(triage→ship 파이프라인, 자동 PR merge rate 운영)가 필요해질 때.
- **Autoresearch 실전**: Karpathy의 630줄 구현이나 Meta Brain2Qwerty v2의 실험 설계를 직접 재구성해보고 싶을 때 — eval 설계, hypothesis space 정의가 필요해질 때.
- **Oversight Loop와 자율성 거버넌스**: Paul Bakaus의 "no auto" 주장과 Dex Horthy의 "deterministic control loops" 논의를 깊이 읽으며, 조직에서 자율성 다이얼을 어디에 둘지 결정하는 프레임워크가 필요해질 때.

## 연결

- `claude-managed-agents-plan-big-execute-small-노트북.md` — 계획-실행 분리 패턴은 실행 루프 내부의 한 설계 선택으로 볼 수 있다. 루프 엔지니어링은 그 위에 태스크 루프·프로덕트 루프를 쌓아 올리는 더 큰 프레임워크.
- `evidence-based-learning.md` — "eval이 학습을 결정한다"는 원리는 시스템 루프에서도 동일하게 적용된다. eval 설계가 루프의 수렴 방향을 제어한다.
- `open-knowledge-format.md` — OKF의 "one concept = one file" 원칙은 루프 엔지니어링의 "one loop = one exit condition"과 구조적으로 닮았다. 각 루프가 하나의 책임과 하나의 종료 신호를 갖는 것이 설계의 핵심.

## 레퍼런스

- [Aparna Dhinakaran (@aparnadhinak), "What the hell is a loop, anyway?" — 스레드 원문](https://x.com/aparnadhinak/status/2073492320159510869), 2026-07-04. 1차 — 이 노트의 직접 소스.
- Addy Osmani, "Loop Engineering", 2026-06-07. 1차 — inner execution loop 개념의 원천. (미확인: 본문만 인용)
- swyx, "Loopcraft: The Art of Stacking Loops", 2026-06-12. 1차 — 루프 스택 다이어그램과 "???? loop" 레이블 원천. (미확인: 본문만 인용)
- LangChain, "The Art of Loop Engineering", 2026-06-16. 1차. (미확인: 본문만 인용)
- Geoffrey Huntley, Ralph Loop — "everything is a ralph loop". 1차 — 태스크 루프의 원천 개념. (미확인: 본문만 인용)
- [AI Engineer World's Fair 2026](https://www.ai.engineer/worldsfair/) — 폐막 토론, 소프트웨어 팩토리 트랙, Zach Lloyd·Roland Gavrilescu 인터뷰 등. 1차 — 컨퍼런스 자체.
- [Latent Space Podcast](https://www.latent.space/) — Zach Lloyd·Roland Gavrilescu 인터뷰, AIEWF 폐막 토론 커버리지. 2차 — 스레드가 인용한 인터뷰 소스.
- Andrej Karpathy, autoresearch (2026-03). ~630줄 파이썬, GPU 1개, 50 experiments overnight. 1차 — 시스템 루프 최소 사례. (미확인: 본문만 인용)
- Meta, Brain2Qwerty v2 (2026-06 late). 에이전트 반복 수정으로 디코딩 아키텍처 개선, word error rate 상당 개선. caveat: 최종 학습 설정은 수동 선택. 1차. (미확인: 본문만 인용)

---

## 인출 질문

1. "루프"라고 불리는 네 가지 아키텍처를 안쪽부터 바깥쪽 순서로 나열하고, 각각의 반복 대상을 한 문장으로 말해보시오.
2. Ralph Loop가 매번 새 컨텍스트 윈도우로 재시작하는 이유를 설명하시오. 이것이 해결하는 두 가지 문제는?
3. Agentic MapReduce가 루프가 아니라 파이프라인인 이유를 "피드백"이라는 개념을 사용해 설명하시오.
4. "완전히 자율적인 실행 루프를 강력하게 감시되는 프로덕트 루프 안에 넣을 수 있다" — 이것이 가능한 이유를 루프 간 관계로 설명하시오.
5. Oversight 루프의 종료 조건이 "없음"인 이유와, 왜 인간이 반드시 이 루프에 머물러야 하는지를 swyx와 Addy Osmani의 진술을 활용해 설명하시오.

## 내 관점

