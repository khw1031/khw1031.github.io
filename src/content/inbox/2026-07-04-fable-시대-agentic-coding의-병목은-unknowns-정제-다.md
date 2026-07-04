---
title: 'Fable 시대, agentic coding의 병목은 ''unknowns 정제''다'
pubDate: '2026-07-04'
description: 'trq212의 트위터 아티클 반응 스레드를 정리해 Fable에서 unknowns 관리가 agentic coding 품질 병목이라는 주장과 반론을 분석한다.'
summary: '@trq212는 Fable 모델에서 agentic coding의 품질이 에이전트의 unknowns(모르는 것)를 명확히 하는 능력에 병목된다고 주장했으나, 일부 반론은 확률적 기술의 본질로 2022년부터 동일했다고 반박한다.ідом'
lang: ko
tags:
  - 'agentic-coding'
  - 'ai'
  - 'reasoning'
  - 'prompting'
canonical: 'https://x.com/trq212/status/2073100352921215386?s=46'
lintHash: 'bb5458150c2d'
---

## TL;DR
- 이 스레드는 @trq212의 아티클(원문 대부분은 접근 불가)에 대한 **반응 50건**으로, 핵심 주장은 "agentic coding(특히 Fable)에서 작업 품질은 unknowns를 정제하는 능력에 병목된다"는 것이며, 찬반·확장·스케일 비유 등이 섞여 있다.

## 큰 그림
```
                 @trq212 아티클: "Fable에서 unknowns 정제가 병목"
                              │
   ┌────────────┬─────────────┼──────────────┬─────────────────┐
   ▼            ▼             ▼              ▼                 ▼
핵심 개념      실천 제안       도구/운용       확장 적용          반론·의구심
─ unknowns    ─ 컨텍스트 제공 ─ Fable 5/Extra ─ 인프라 unknowns  ─ "2022년부터
  사분면      ─ 병합 전 퀴즈   ─ skills 유효?    (지연·용량 절벽)    똑같았다"
(known/unknown)─ PR 2단 분할  ─ usage 리셋 요청 ─ Sonnet/Opus 일반화 ─ 확률적 기술
(Rumsfeld/    ─ 에이전트용     ─ agent-friendly   (저자 주장 vs      본질이라
 Johari)        게시처 요청     게시처 요청         경험적 반박)        주장 부풀리기
```

## 핵심
- 스레드 참여자들은 @trq212의 글을 **"agentic coder가 좋을수록 unknowns(미지的东西)가 적다"**는 관점으로 읽었다. 즉, 인간이 "내가 뭘 모르는지"를 미리 드러내고 정제할수록 에이전트가 더 정확히 작동한다는 연결선이다.
- 이 주장은 **known/unknown 사분면**(Rumsfeld 행렬·Johari window)이라는 시각 프레임으로 뒷받침되며, "모르는 것을 줄이는 과정" 자체가 프롬프트/리뷰/병합 게이트의 지점이 된다고 해석된다.

## 깊이
- **[핵심-unknowns 사분면]** 여러 응답이 "four quadrant known/unknown matrix", "Rumsfeld matrix", "Johari's window of known-unknowns"로 동일화. *(2차·응답자 주장; 원문에서의 정확 정의는 원문에 없음)*
- **[핵심-실천]** "merge 전 퀴즈"(you love the idea of being quizzed before merging), "PR을 인간용/에이전트용 두 섹션으로 분할"(human section uses images)이 제안됨. *(2차)*
- **[핵심-Fable 특화 vs 일반화]** 저자는 Fable 5에서 이런 정제가 특히 중요해졌다는 뉘앙스. 반면 반론: "dumber models에서도 더 중요했어야 했다", "probabilistic tech, certainty를 task에 맞추는 건 2022년부터" (스레드 18, 46). *(주장 충돌·검증 불가)*
- **[핵심-확장]** #40은 인프라에 동일 적용: "latency cliffs, capacity ceilings"을 커밋 전 점검 (=unknown-unknowns를 인프라로 확장). *(저자가 아닌 응답자의 확장 주장)*
- **[핵심-경험적 회의]** #26 응답자는 소규모/개인 프로젝트에선 Fable/Opus가 스스로 unknowns를 채운다고 견험 보고, 대규모에서만 격차가 드러난다고 부분 지지. *(2차 경험담)*

## 용어 풀이
- **unknowns(unknown−unknowns)** — "내가 뭘 모르는지" / 비유: 설계도와 실제 지형의 차이 (map vs territory). 비유 깨짐: 지형은 고정이지만, 코드베이스는 에이전트가 스스로 탐색·보완 가능.
- **Johari window** — 자신/타인이 아는 4칸창 / 비유: 거울로 자기 인지 빈칸 찾기. 비유 깨짐: 에이전트는 "타인"이 아니라 비결정적 도구라 칸 경계가 흔들림.
- **agentic coder** — 주체적으로 작업하는 코딩 에이전트 / 비유: 지시만 주면 알아서 끝내는 부사수. 비유 깨짐: 부사수는 고정 능력, 에이전트는 세션마다 확률적 변동.

## 시각 자료
| 지점 | 주장/응답 | 성격 |
|---|---|---|
| 핵심 | Fable에서 unknowns 정제가 병목 | 저자 주장(응답으로 재구성) |
| 프레임 | 사분면 = Rumsfeld = Johari | 응답자 동화(2차) |
| 일반화 | Sonnet/Opus에 동일 적용? | 질문만, 답 원문에 없음 |
| 반론 | 확률적 기술이라 2022년부터 동일 | 반론자 주장(2차) |
| 확장 | 인프라 unknown-unknowns | 응답자 확장(2차) |

## 핵심 시사점 / 판단
- (저자 주장) Fable 모델 시대에 agentic coding 품질은 unknowns 정제 능력에 좌우된다.
- (검증 필요·불확실) Fable 특화성 여부 — 반론 존재; 경험담은 소규모에선 차이 작음.
- (불확실) 원문 아티클 본문은 (X article 접근 제한으로) 확인 불가; 위는 **반응 스레드 기반 2차 재구성**.
- (사실) Claude Sonnet 5가 GitHub Copilot GA됨(#13, 2차·공지 URL); Fable_extra/usage 리셋 요청은 독자 요구일 뿐 사실 근거 아님.

## 레퍼런스
- Thread by @trq212 — https://x.com/trq212/status/2073100352921215386 · (2차) · 원문 아티클+50개 응답 스레드; unknowns 정제 중심 agentic coding 주장과 반론.
- linked article (트위터 아티클 본문) — URL 본문에 명시 없음 · (1차·불가접근) · 원문 전문은 X article 형태로 확인 안 됨 → 원문에 없음 항목 다수.

## 확인 질문
- Q1(전이): unknowns 사분면 프레임을 코드 리뷰 외에(예: 인프라 아키텍처 커밋 전) 동일 게이트로 적용하려면 무엇이 달라지나?
- Q2(왜·어떻게): "모를수록"가 품질을 깎는 기작은, 프롬프트의 애매함이 샘플링 분산을 키우기 때문인지, 아니면 컨텍스트 부족으로 사실 오류가 늘기 때문인지 어떻게 구분하나?
- Q3(경계): "dumber models일수록 unknowns 정제가 더 중요했다"는 반론이 참이면, 저자의 "Fable에서 처음 병목" 명제는 어디서부터 거짓이 되나?

> 출처: https://x.com/trq212/status/2073100352921215386?s=46
