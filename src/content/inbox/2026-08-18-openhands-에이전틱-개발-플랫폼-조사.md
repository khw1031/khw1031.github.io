---
title: OpenHands 에이전틱 개발 플랫폼의 구성과 도입 판단 조사
pubDate: '2026-08-18T23:34:11+09:00'
noteId: AGENT-2608-025
description: 'OpenHands의 현재 구성 요소, 실행 방식, 저장소 맞춤화 수단과 에이전트 작업에 적합한 조건을 공식 문서 중심으로 정리한 조사 기록'
summary: 'OpenHands는 브라우저 클라이언트인 Agent Canvas, 원격 실행 API인 Agent Server, Python SDK, 샌드박스 제어면을 분리한 에이전틱 개발 생태계다. 명확한 완료 조건과 검증 가능한 작은 범위의 작업에 적합하며, 저장소별 지침·초기화·완료 전 품질 게이트를 .openhands로 둘 수 있다.'
lang: ko
tags: ['openhands', 'agentic-coding', 'software-agent', 'developer-tools']
lintHash: '75444182033a'
---

## 조사 범위

이 문서는 [OpenHands 소개 문서](https://docs.openhands.dev/overview/introduction)를 출발점으로, 2026-08-18 현재의 제품 구성, 실행 모델, 저장소 맞춤화 방법, 업무 적합성 기준을 정리한다. 과거의 로컬 GUI 하나를 가리키던 인상과 달리, 현재 OpenHands는 여러 배포 및 실행 계층을 가진 AI 기반 소프트웨어 개발 생태계다.

## 무엇인가

OpenHands는 코드베이스를 탐색하고, 파일을 수정하고, 명령과 테스트를 실행하는 소프트웨어 에이전트를 만들고 운영하기 위한 오픈소스 중심 프로젝트군이다. 직접 사용할 때는 대화형 화면에서 작업을 지시하지만, 제품 구조상 핵심은 화면이 아니라 에이전트 실행·도구·워크스페이스를 제공하는 서버와 SDK다.

공식 문서가 구분하는 현재 구성은 다음과 같다.

```text
OpenHands 생태계
├── Agent Canvas: 에이전트 대화와 자동화의 브라우저 제어 화면
├── Software Agent SDK: 코드 작업용 조합 가능한 Python 라이브러리
├── Agent Server: 실행, 대화, 도구, 워크스페이스를 REST·WebSocket으로 노출
├── Sandbox Server: Agent Server가 동작할 격리 환경의 생성·관리 제어면
├── Automation Server: 예약·이벤트 기반 자동화의 수명주기 관리
├── OpenHands Cloud: 관리형 상용 실행 환경
└── OpenHands Enterprise: 자체 호스팅 또는 관리형 배포를 위한 상용 옵션
```

Agent Canvas는 하나 이상의 Agent Server에 연결하는 오픈소스 브라우저 클라이언트다. 로컬 백엔드를 함께 기동하는 일체형 방식도, 별도로 실행해 자체 호스팅·Cloud·Enterprise 백엔드에 연결하는 방식도 지원한다. SDK와 Agent Server는 같은 저장소에서 제공되며, SDK는 에이전트 조합을 위한 Python 라이브러리, Server는 원격 실행 API 역할을 맡는다. [구성 요소와 저장소 매핑은 소개 문서에서 확인할 수 있다](https://docs.openhands.dev/overview/introduction).

여기서 중요한 경계는 다음과 같다. Cloud는 인프라와 샌드박스를 직접 운영하지 않으려는 사용자를 위한 관리형 서비스이고, Agent Canvas와 SDK는 오픈소스 구성 요소다. 또한 예전 Docker 기반 Local GUI는 더 이상 주된 개발 대상이 아니며 Agent Canvas 사용이 권장된다. CLI는 기능이 완성된 안정화 유지 대상이다. 저장소마다 라이선스가 다르므로, 전체 생태계에 하나의 라이선스가 적용된다고 가정해서는 안 된다.

## 작업하는 화면과 실행 흐름

Agent Canvas의 핵심 화면은 대화, 변경 파일, 내장 VS Code, 터미널, 실행 중인 앱, 브라우저 탭으로 나뉜다. 사용자는 대화에서 목표와 제약을 전달하고, 에이전트는 저장소 안에서 파일과 명령을 다룬다. 앱 탭은 에이전트가 실행한 웹 애플리케이션을 사용자가 직접 조작할 수 있게 하지만, 에이전트가 쓰는 브라우저는 비대화형이다. 따라서 사람이 최종 UI 품질을 판정해야 하는 상황은 별도 검증이 필요하다. [Key Features 문서](https://docs.openhands.dev/openhands/usage/key-features)가 이 탭들의 역할을 설명한다.

```text
사용자 요구·완료 기준
        ↓
Agent Canvas 또는 API 클라이언트
        ↓
Agent Server ── SDK의 에이전트·도구·워크스페이스
        ↓
Sandbox Server 또는 관리형 실행 인프라
        ↓
저장소 수정 · 명령 실행 · 테스트 · 결과 검토
```

이 흐름은 "대화형 코딩 도구"로만 이해하기보다, 격리된 실행 환경 위에서 코드 작업을 수행하고 여러 클라이언트가 그 실행을 제어하는 구조로 이해하는 편이 정확하다.

## 저장소에 넣는 운영 규약

OpenHands는 저장소 루트의 `.openhands/` 디렉터리로 저장소별 동작을 맞출 수 있다. 이는 이 저장소의 `AGENTS.md`처럼 에이전트에 맥락을 주는 문서화와, 자동 실행되는 품질 게이트를 한곳에 두는 수단이다.

```text
.openhands/
├── setup.sh                 # 작업 시작 때마다 실행할 의존성 설치·환경 준비
├── hooks.json               # 도구 사용·완료 시점 등에 실행할 훅 정의
└── hooks/
    └── quality_gate.sh      # lint·test 실패 시 완료를 거부하는 검사
```

`setup.sh`는 의존성 설치나 환경 변수 준비를 위한 시작 스크립트다. `hooks.json`의 훅은 위험한 명령 차단, 도구 사용 기록, 완료 전 lint·테스트 강제를 위해 사용할 수 있다. 특히 stop hook은 에이전트가 작업 완료를 시도할 때 실행되어, 검사 실패 시 완료를 막을 수 있다. [Repository Customization 문서](https://docs.openhands.dev/openhands/usage/customization/repository)는 Skills, 시작 스크립트, 훅을 이 구조로 설명한다.

실무에서는 시작 스크립트에 비밀값을 직접 기록하지 않고 실행 환경의 시크릿 주입 방식을 사용해야 한다. 에이전트가 테스트를 통과했다고 말하는 것과 품질 게이트가 실제로 성공하는 것은 다르므로, 빌드·테스트·lint를 가능한 한 훅으로 검증하는 편이 안전하다.

## 어떤 작업에 적합한가

공식 가이드의 기준은 작업의 크기보다 **명확성, 기존 패턴, 검증 가능성**이다. 함수 추가, 명확한 오류가 있는 버그 수정, 단위 테스트, 문서화, 단순 리팩터링은 한 세션에서 처리하기 좋은 사례다. 여러 파일에 걸친 기능·API 엔드포인트·통합 테스트·명확한 지표가 있는 성능 개선도 맥락과 수용 기준을 주면 적합하다.

반면 대규모 리팩터링, 아키텍처 변경, 여러 서비스 통합, 원인이 불명확한 성능 문제, 보안 감사와 주요 의존성 업그레이드는 분석과 구현을 단계로 나누어야 한다. 다음 유형은 바로 위임하기보다 사람이 먼저 경계를 정하는 편이 낫다.

- 완료 기준이 없는 요구: "더 보기 좋게 해줘", "알아서 적절히 해줘"
- 조직 내부 맥락이나 주관적 미감이 핵심인 결정
- 검증 환경이나 외부 시스템 접근이 없어 실제 동작을 시험할 수 없는 구현
- 사람 검토 없이 운영 인프라나 민감한 코드를 변경하는 작업

공식 가이드는 세션 시간, 컨텍스트 크기, 대규모 코드베이스 탐색의 제약도 명시한다. 특히 에이전트는 샌드박스 밖의 로컬 환경에 접근할 수 없고, 사업 맥락이 필요한 결정을 내리거나 운영 안전성을 보장하지 않는다. [When to Use OpenHands](https://docs.openhands.dev/openhands/usage/essential-guidelines/when-to-use-openhands)는 큰 과업을 단계로 분해하고, 시작 전 녹색 빌드·테스트 상태를 만들며, 종료 뒤에는 변경 파일·lint·빌드·수동 테스트를 검토하라고 권한다.

## 이 저장소 관점의 시사점

이 저장소처럼 `AGENTS.md`에 콘텐츠 구조, 렌더링, 검증 규칙이 이미 명시된 프로젝트는 OpenHands에 비교적 유리한 입력을 제공한다. 다만 콘텐츠 품질과 시각 디자인에는 사람의 판단이 남는다. 도입한다면 다음의 작은 검증 가능 과업으로 시작하는 편이 합리적이다.

1. 특정 콘텐츠 컬렉션의 frontmatter 누락을 검사하고 수정 제안을 만드는 작업
2. 재현 절차와 기대 결과가 있는 빌드·링크·렌더링 오류 수정
3. 명시된 규칙을 따르는 테스트 또는 문서 보강

반대로 사이트의 미감이나 정보 구조를 "개선"하는 일을 첫 과업으로 주면 성공 조건이 흐려진다. 먼저 `AGENTS.md`와 빌드·테스트 명령을 에이전트가 읽을 수 있게 하고, `.openhands`의 stop hook으로 실제 검사 통과를 완료 조건에 연결하는 것이 적절하다.

## 참고 자료

- [OpenHands Introduction](https://docs.openhands.dev/overview/introduction)
- [OpenHands Quick Start](https://docs.openhands.dev/overview/quickstart)
- [When to Use OpenHands](https://docs.openhands.dev/openhands/usage/essential-guidelines/when-to-use-openhands)
- [Key Features](https://docs.openhands.dev/openhands/usage/key-features)
- [Repository Customization](https://docs.openhands.dev/openhands/usage/customization/repository)
