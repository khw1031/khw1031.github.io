---
title: 'Harness Engineering 입문 코스: AI 코딩 에이전트 신뢰성 설계'
pubDate: '2026-08-27T17:04:41+09:00'
description: 'AI 코딩 에이전트 신뢰성을 위한 5개 서브시스템 프레임워크와 14강·8프로젝트 커리큘럼 핵심 정리'
summary: '모델이 아닌 모델 주변 환경(지시·상태·검증·범위·라이프사이클)을 설계해 에이전트 출력을 신뢰 가능하게 만드는 프로젝트 기반 코스의 구조·핵심 논지·학습 경로를 요약한다.'
lang: ko
tags:
  - 'harness-engineering'
  - 'ai-coding-agent'
  - 'agentic-workflow'
  - 'verification'
canonical: 'https://github.com/walkinglabs/learn-harness-engineering'
lintHash: '95738f40c669'
---

## TL;DR
- 모델 성능이 아니라 모델 주변 **환경 설계**(harness)가 에이전트 신뢰성을 결정하며, 이 코스는 그 환경을 5개 서브시스템으로 분해해 14강·8프로젝트로 실습하게 한다.

## 큰 그림
```
HARNESS (5 subsystems)
├─ Instructions  ──→ 무엇을, 어떤 순서로
├─ State         ──→ 어디까지 했나 (디스크 영속화)
├─ Verification  ──→ 통과해야만 "완료"
├─ Scope         ──→ 한 번에 한 기능만
└─ Session Lifecycle ──→ 시작·종료 프로토콜

학습 흐름 (8 Phase)
  문제인식 → 저장소 구조화 → 세션 연결
  → 피드백/범위 → 검증 → 통합 → 루프 → 그래프
```

## 핵심
저자 주장의 출발점은 단순하다. "강한 모델 ≠ 신뢰할 실행." 같은 모델에 같은 프롬프트를 줘도 주변 환경이 없으면 실패하고, 환경이 있으면 성공한다는 것. 이를 뒷받침하기 위해 저자는 Anthropic 통제 실험(같은 Opus 4.5, harness 없이 $9/20분 실패 → 풀 harness로 $200/6시간 성공)을 인용한다. 여기서 "환경"을 구체화한 것이 5개 서브시스템이며, 각 서브시스템이 에이전트 세션의 한 전환점을 담당한다. 이 구조를 실제 저장소에 적용하는 과정이 8개 프로젝트이고, 마지막 두 단계(루프·그래프)는 단일 에이전트 호출을 넘어 자동화와 다중 노드 구조로 확장한다.

## 깊이
- **[5개 서브시스템]** Instructions는 거대한 파일 하나가 아닌 "필요할 때 찾는 지도"(progressive disclosure)로 설계한다. State는 `progress.md`·`feature_list.json`처럼 디스크에 남아 다음 세션이 이어받게 한다. Verification은 "테스트 통과"만 증거로 인정하며, Scope는 "한 기능 하나"로 범위 이탈을 막는다. 이 넷이 갖춰져야 Lifecycle(초기화→정리→핸드오프)이 의미를 가진다.
- **[Anthropic 실험 수치]** (저자 인용, 2차) 같은 모델·같은 프롬프트에서 harness 유무가 $9 실패와 $200 성공을 갈랐다. 저자는 이를 "질적 전환"이라 표현한다. 다만 이 수치가 어떤 태스크·환경에서 재현되는지는 원문에 상세 조건이 없다.
- **[루프→그래프 확장]** L13에서 "프롬프트를 멈추고 루프를 설계하라"고 전환하고, L14에서 "루프는 노드 1개짜리 그래프"라 정의한다. 병렬 분기·공유 상태·롤백이 필요해지면 단일 루프가 구조적으로 한계에 부딪힌다는 논리다.

## 용어 풀이
- **Harness** — 말의 "마구(안장·고삐)"에서 온 비유. 말(모델)의 능력을 바꾸지 않고, 어디로 어떻게 움직이는지 통제하는 장치. 다만 실제 마구와 달리 소프트웨어 파일·스크립트·규칙의 조합이라 "착용"이 아니라 "저장소 구조"로 존재한다.
- **Progressive disclosure** — 백과사전 대신 목차를 주는 것. 에이전트가 한 번에 모든 지시를 읽으면 컨텍스트가 폭발하므로, 필요한 시점에 해당 파일만 읽게 한다.

## 시각 자료
| Phase | 강의 | 핵심 질문 | 프로젝트 |
|---|---|---|---|
| 1 문제인식 | L01–02 | 왜 강한 모델이 실패하는가 | P01 |
| 2 저장소 구조화 | L03–04 | 저장소가 단일 진실원천인 이유 | P02 |
| 3 세션 연결 | L05–06 | 컨텍스트 유지·초기화 | P03 |
| 4 피드백/범위 | L07–08 | 범위 이탈 방지·기능 목록 | P04 |
| 5 검증 | L09–10 | 조기 완료 방지·E2E 검증 | P05 |
| 6 통합 | L11–12 | 관측성·클린 핸드오프 | P06 |
| 7 루프 | L13 | 자동 루프(goal/timer/maker-checker) | P07 |
| 8 그래프 | L14 | 노드·엣지·공유상태·라우팅 | P08 |

전체 강의·프로젝트 상세는 원본 저장소 참조.

## 핵심 시사점 / 판단
- (저자 주장) "모델이 아니라 harness가 신뢰성을 만든다"는 것이 코스 전체 관통 논지이며, OpenAI·Anthropic 사례를 근거로 제시한다.
- (저자 주장) 루프·그래프 공학은 기존 워크플로우 오케스트레이션과 차별화된 새 범주라 주장하나, 저자 스스로 "이름 붙기 전에도 존재한 프로젝트"를 인정한다.
- (검증 필요·불확실) Anthropic 실험의 $9 vs $200 수치는 원문(블로그) 기준이며, 태스크 복잡도·모델 버전에 따라 일반화 가능한지는 이 리포트에서 확인 불가.
- (사실) 14강·8프로젝트·15개 언어 지원, MIT 라이선스, VitePress 기반 문서 사이트는 저장소에서 확인 가능.

## 레퍼런스
- learn-harness-engineering 저장소 — https://github.com/walkinglabs/learn-harness-engineering · (1차) · 코스 전체 커리큘럼·템플릿·프로젝트 코드 포함.
- OpenAI: Harness engineering — https://openai.com/index/harness-engineering/ · (1차) · Codex 기반 에이전트-우선 개발에서 환경 설계 원칙.
- Anthropic: Effective harnesses — https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents · (1차) · 장시간 에이전트용 마구 설계 사례.
- Martin Fowler: Harness engineering — https://martinfowler.com/articles/harness-engineering.html · (2차) · 코딩 에이전트 사용자 관점 종합.

## 확인 질문
- Q1(전이): 이 5-서브시스템 구조를 코딩 외 에이전트(예: 데이터 파이프라인 자동화)에 그대로 적용할 수 있는가, 어떤 서브시스템이 가장 달라지는가?
- Q2(왜·어떻게): "한 기능 하나" 제약을 에이전트가 어기지 않도록 하는 메커니즘은 구체적으로 어떤 파일·검증 단계에서 강제되는가?
- Q3(경계): 저자가 "루프→그래프" 전환을 주장하지만, 실제로 단일 루프가 충분한 태스크의 기준은 무엇이며 과잉 그래프화의 비용(orchestration tax)은 어디서 발생하는가?

> 출처: https://github.com/walkinglabs/learn-harness-engineering
