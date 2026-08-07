---
title: 'Cloudflare OS: 보안 내장형 에이전트·앱 오픈소스 플랫폼'
pubDate: '2026-08-06T11:49:32+09:00'
noteId: AGENT-2608-007
description: 'Cloudflare OS의 에이전트 작업 공간, Gatekeeper 보안 모델, 풀스택 앱 구조를 연결해 해설하는 학습용 리포트.'
summary: '에이전트가 조직 데이터를 다루는 과정에서 접근·관찰·공유 단계까지 정책을 강제하는 Cloudflare OS의 설계를 한 장으로 파악할 수 있다.'
lang: ko
tags:
  - 'ai'
  - 'workflow'
  - 'cloudflare'
  - 'agent-security'
canonical: 'https://news.hada.io/topic?id=32185&utm_source=discord&utm_medium=bot&utm_campaign=5809'
lintHash: '4d90098232dc'
---

## TL;DR
- Cloudflare가 사내 운영하던 에이전트 작업 공간을 오픈소스화하며, 보안을 "앱이 아닌 플랫폼"에 내장하고 관찰된 데이터까지 권한을 따라가게 설계한 것이 핵심 차별점이다.

## 큰 그림
```
Cloudflare OS (세 기둥)
│
├─[1] 에이전트 작업 공간 ──► 조직 맥락·도구·격리 런타임 묶음
│     └─ 조사 → 문서/PPT → 앱 → 결정적 워크플로로 발전
│
├─[2] 보안·거버넌스 (Gatekeeper)
│     ├─ 무권한 시작 ──► capability 바인딩(env.PROJECT)
│     ├─ 서비스별 Worker: OAuth·마스킹·속도제한·승인
│     └─ 관찰 기록 ──► 공유/재사용 시 권한 재검증
│
└─[3] 풀스택 앱 플랫폼
      ├─ Dynamic Worker + Durable Object Facet(SQLite)
      ├─ Cap'n Web (객체 RPC)
      └─ 공유: 앱 자체(실시간 협업) vs Blueprint(독립 사본)

          모든 추론 ──► AI Gateway (모델·비용·예산 중앙 관리)
```

## 핵심
- Cloudflare OS의 출발 문제는 "에이전트가 회사 맥락과 내부 시스템에 어떻게 안전하게 접근할 것인가"였다. 첫 버전은 개인 작업 공간에 집중해 정적 결과물 위주였고, 협업을 켜자 **권한 전파 문제**—에이전트가 본 데이터를 누가 볼 수 있는지 불투명한 문제—가 드러났다(**저자 주장**).
- 새 버전은 해법을 애플리케이션이 아니라 플랫폼 계층으로 내렸다. 모든 에이전트와 앱은 **무권한으로 시작**하고, 필요한 리소스를 capability(`env.PROJECT`)로 받으며, 실제 자격증명은 격리된다.
- Gatekeeper는 도구 호출 통제에서 한 발 더 나가 **에이전트가 관찰한 데이터까지 기록**해, 결과물이 다른 사람에게 공유될 때 원본 권한을 다시 검증한다. 이 설계가 있어야 "민감 테이블로 만든 대시보드"가 권한 없는 사용자에게 새어 나가는 것을 막을 수 있다(**저자 주장**).
- 앱은 정적 산출물이 아니라 Dynamic Worker + Durable Object Facet + SQLite로 돌아가는 **풀스택 애플리케이션**이 되며, Cap'n Web으로 서버 메서드를 클라이언트에서 함수처럼 호출해 에이전트가 사람 부재 중에도 계속 일할 수 있다.
- 추론은 AI Gateway로 단일화해 모델 선택·비용·작업별 라우팅을 조직이 중앙 통제한다. 코어와 스타터 저장소가 오픈소스라 조직이 자체 계정에 배포·확장할 수 있다.

## 깊이
- **관찰 기반 정책(핵심-2의 연장)**. 단순 "도구 허용/차단"은 에이전트가 여러 시스템을 조합해 새 정보를 만드는 경우를 잡지 못한다. Cloudflare OS는 에이전트가 읽은 리소스를 작업 공간에 묶어두고, 이후 쓰기·초대·위임·외부 요청까지 이 기록에 기반해 차단한다. 원문은 이를 '데이터 흐름 추적'으로 표현하지만, 구현 수준(필드 단위인지 쿼리 단위인지)은 **불확실**.
- **Blueprint 공유 모델(핵심-3의 연장)**. 앱 공유는 코드+상태까지 포함해 실시간 협업, Blueprint 공유는 코드만 복사해 독립 사본을 만든다. Notion 템플릿과 유사하지만 SQLite·대화 기록·자격증명은 빠지므로 "데이터 없는 복제본"이라는 점이 비유의 한계다.
- **결정적 워크플로 전환(핵심-1의 연장)**. 모든 단계에 LLM을 쓰지 않고 예측 가능한 단계는 코드로, 판단이 필요한 부분만 모델로 실행한다. 이는 초기 버전의 "반복 작업도 토큰 재소비" 문제(**저자 주장**)를 직접 해결한다.

## 용어 풀이
- **Gatekeeper** — 서비스 앞에 세우는 "정책 담당 직원" / 비유: 클럽 입구 문지기. 깨지는 지점: 문지기가 내용(필드 마스킹)까지 읽어야 하므로 단순 입장 통제보다 무거움.
- **Capability (`env.PROJECT`)** — 특정 리소스를 쓸 수 있는 "열쇠가 달린 사원증" / 깨지는 지점: 실제 자격증명이 아니므로 Gatekeeper가 매번 중개해야 함.
- **Dynamic Worker / Durable Object Facet** — 요청 시 깨어나는 격리 서버와 그에 붙는 영속 상태 / 비유: 필요할 때만 켜지는 개인 사무실. 깨지는 지점: 상시 서버가 아니라 콜드 스타트·수명 주기 제약이 있을 수 있음(원문 미상).
- **Cap'n Web** — 객체 참조를 RPC로 주고받는 Cloudflare 오픈소스 프로토콜 / 비유: 함수 호출을 네트워크 너머로 연장. 깨지는 지점: 기존 REST/JSON 생태계와 호환 비용 발생.

## 시각 자료
| 구성 요소 | 주요 기술 | 역할 |
|---|---|---|
| 에이전트 작업 공간 | 격리 런타임, 조직 맥락 | 조사·문서·앱·워크플로 수행 |
| Gatekeeper | 서비스별 Worker, OAuth | 세밀 권한·마스킹·승인·관찰 기록 |
| 풀스택 앱 | Dynamic Worker, DO Facet, SQLite, Cap'n Web | 서버리스 격리 앱 실행·공유 |
| AI Gateway | 모델 라우팅 | 비용·예산·속도 제한 중앙화 |
| 배포 | core + starter 저장소 | 자체 Cloudflare 계정에 포크·확장 |

## 핵심 시사점 / 판단
- (저자 주장) 에이전트 보안은 "도구 허용 목록"이 아니라 **데이터 관찰→공유→재사용 전 과정의 정책**으로 확장돼야 하며, 이를 플랫폼에 내장해야 개발자 실수를 줄일 수 있다.
- (저자 주장) 비개발자도 브라우저만으로 내부 시스템과 연결된 앱을 만들 수 있어, "소규모 앱 개발"의 병목이 엔지니어링 팀에서 업무 담당자로 이동한다.
- (검증 필요·불확실) 관찰 기록 기반 정책의 실용성(오버헤드, 오탐률, 필드 단위 마스킹 정밀도)과 Dynamic Worker·Cap'n Web의 성숙도는 원문에 수치나 사례가 없다.
- (원문에 없음) 경쟁 플랫폼(LangChain, CrewAI, Microsoft Copilot Studio 등)과의 비교, 온프레미스 배포 가능성.

## 레퍼런스
- Cloudflare OS 공식 사이트 — https://os.cloudflare.app/ · (1차) · 제품 진입점.
- Cloudflare OS core 저장소 — https://github.com/cloudflare/cloudflare-os · (1차) · 오픈소스 코어 소스.
- 예제 배포(starter) 저장소 — https://github.com/cloudflare/cloudflare-os-starter · (1차) · 조직 맞춤화 예제.
- MCP Server Portals — https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/ · (1차) · 기존 MCP 서버 연동 방식.
- Cap'n Web — https://github.com/cloudflare/capnweb · (1차) · 객체 RPC 프로토콜.
- 하다뉴스 원문 — https://news.hada.io/topic?id=32185 · (2차) · 한국어 요약 소개.

## 확인 질문
- Q1(전이): 사내 1년 사용 데이터를 바탕으로 공개했다고 하는데, 엔지니어링 외 직군의 실제 채택률과 업무 유형별 효과는 어떤 지표로 측정했는가?
- Q2(왜·어떻게): 관찰 기록 기반 정책이 대규모 에이전트 세션에서 어떤 성능·저장 오버헤드를 유발하는가?
- Q3(경계): Cloudflare 계정에 배포해야 하므로 타 클라우드·온프레미스 환경에서는 사용하지 못하는가?

> 출처: https://news.hada.io/topic?id=32185&utm_source=discord&utm_medium=bot&utm_campaign=5809
