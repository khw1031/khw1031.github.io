---
title: 'docker-vals: docker compose up만으로 시크릿 주입하는 Docker CLI 플러그인'
pubDate: '2026-07-21T01:58:46+09:00'
description: 'Docker Compose Provider Services를 확장해 AWS SSM, Vault 등에서 시크릿을 자동 주입하는 OSS 도구 docker-vals의 구조와 Docker Compose 본체 기여까지 정리.'
summary: 'docker-vals는 compose.yaml에 시크릿 위치만 선언하면 docker compose up 실행 시 호스트에서 시크릿 스토어를 조회해 컨테이너 환경변수로 주입하는 Docker CLI 플러그인이다. 이 도구를 만들기 위해 Docker Compose 본체에 rawsetenv 프로토콜을 직접 기여한 과정까지 다룬다.'
lang: ko
tags:
  - 'open-source'
  - 'docker'
  - 'secrets-management'
  - 'developer-productivity'
  - 'contribution'
canonical: 'https://zenn.dev/estie/articles/df0fd5f0326f9a'
lintHash: 'aec2569de553'
---

## TL;DR
- `docker compose up` 한 번으로 AWS SSM·Vault·1Password 등 시크릿 스토어에서 값을 가져와 컨테이너에 환경변수로 주입하는 Docker CLI 플러그인 **docker-vals**가 공개되었다.

## 큰 그림
```
┌─────────────────────────────────────────────────────────┐
│  개발자 로컬 환경                                        │
│                                                         │
│  compose.yaml                                           │
│  ┌───────────────┐   depends_on   ┌──────────────┐     │
│  │  secrets      │◄───────────────│  app         │     │
│  │  provider:    │                │  image:myapp │     │
│  │   type: vals  │                └──────────────┘     │
│  │   options:    │                ▲                     │
│  │    env: [...] │                │ 환경변수 주입        │
│  └───────┬───────┘                │                     │
│          │ rawsetenv (JSON)       │                     │
│          ▼                        │                     │
│  ┌───────────────────┐           │                     │
│  │ docker-vals       │───────────┘                     │
│  │ (호스트에서 실행)  │                                 │
│  │  vals(Go lib) 내장 │                                 │
│  └────────┬──────────┘                                 │
│           │ ref+awsssm://, ref+vault://                │
│           ▼                                            │
│  ┌─────────────────────────────┐                       │
│  │ Secret Stores               │                       │
│  │ AWS SSM / Vault / 1Password │                       │
│  └─────────────────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

## 핵심
- **문제**: 여러 레포지토리에서 로컬 개발 시 시크릿 관리 방식이 제각각이라, 새 프로젝트 시작마다 `.env`를 수동으로 구성해야 하고 값이 낡거나 누락되는 문제가 반복되었다.
- **목표**: `compose.yaml`에 시크릿 위치만 선언하면 `git clone` → `docker compose up`만으로 모든 환경 설정이 완료되는 상태.
- **해결**: Docker Compose의 **Provider Services** 확장 메커니즘을 활용해, `type: vals`를 지정하면 호스트에서 docker-vals 플러그인이 실행되어 시크릿을 해결하고 컨테이너에 환경변수로 주입하도록 설계했다.
- **장애와 기여**: Provider Protocol의 `setenv` 메시지는 변수명에 반드시 서비스명 prefix를 붙이는仕様이라 `DB_PASSWORD`가 `SECRETS_DB_PASSWORD`로 전달되는 문제가 있었다. 플러그인 측에서 우회할 수 없어 Docker Compose 본체에 **`rawsetenv`** 메시지 타입을 추가하는 issue와 PR을 직접 제출했고, merge되었다.

## 깊이
- **[Provider Services]** Docker Compose가 `image` 대신 `provider`를 선언하면 `type`에 해당하는 플러그인을 **호스트에서** 실행하는 메커니즘. 원래 Model Runner(LLM)나 Telepresence(K8s 연결) 등 컨테이너 외부 의존성을 다루는 용도였으나, 임의의 Docker CLI 플러그인을 `type`으로 지정할 수 있어 시크릿 해결에도 적용 가능했다. 호스트에서 실행된다는 점이 핵심인데, 덕분에 AWS SSO 세션이나 `op` 로그인 상태를 그대로 활용할 수 있다.
- **[rawsetenv 기여]** 기존 `setenv`는 다중 Provider 간 변수명 충돌 방지를 위해 prefix를 강제한다. 저자는 prefix 없이 전달하는 `rawsetenv`를 **추가**하는 방식으로 기존 설계를 깨지 않고 확장했고, 이 변경은 Docker Compose v5.2.0(Docker Desktop 4.81.0, 2026/07/06)에 포함되었다. (저자 주장에 따르면 "생각보다 수월하게" merge)
- **[docker-vals 구현]** `helmfile/vals`를 Go 라이브러리로 임베딩하여 `ref+<backend>://...` URI 형식으로 다양한 백엔드(SSM, Vault, 1Password 등)를 지원한다. 플러그인 자체는 Go 약 200줄의 얇은 래퍼이며, vals 본체를 별도 설치할 필요 없다.

## 용어 풀이
- **Provider Services** — Docker Compose가 컨테이너 대신 외부 플러그인을 호출하는 확장 인터페이스. / 비유: 식당에서 요리 대신 외부 케이터링을 호출하는 주문서. / 비유가 깨지는 지점: 실제 컨테이너를 대체하는 것이 아니라 컨테이너에 값을 주입하는 보조 역할로도 사용 가능.
- **rawsetenv** — Provider Protocol에 추가된 메시지 타입으로, 변수명 prefix 없이 환경변수를 그대로 전달. / 비유: 봉투에 이름을 다시 써 붙이는 대신 원래 이름표 그대로 전달. / 비유가 깨지는 지점: 다중 Provider가 같은 변수명을 쓰면 충돌할 수 있어 사용 시 주의 필요.
- **vals** — `ref+<backend>://` URI를 해석해 실제 시크릿 값을 가져오는 Go 도구. / 비유: 여러 금고(SSM, Vault 등)의 위치를 적은 메모장에서 실제 열쇠를 찾아오는 심부름꾼.

## 시각 자료

| 구분 | setenv (기존) | rawsetenv (신규) |
|------|--------------|-----------------|
| prefix | 자동 부여 (서비스명) | 없음 |
| 용도 | 다중 Provider 충돌 방지 | 시크릿 등原名 유지 필요 시 |
| 결과 예시 | `SECRETS_DB_PASSWORD` | `DB_PASSWORD` |

## 핵심 시사점 / 판단
- **(저자 주장)** `docker compose up`만으로 시크릿 주입이 완결되므로 팀 내 리포지토리별 시크릿 설정 불일치 문제를 근본적으로 해소할 수 있다.
- **(저자 주장)** Docker의 기존 `docker pass`(`se://` URI)도 유사한思想이지만 발전途上이며, docker-vals는 vals의 `ref+` 체계를 그대로 활용하므로 더 많은 백엔드를 즉시 지원한다.
- **(검증 필요·불확실)** `rawsetenv`가 다중 Provider 환경에서 변수명 충돌을 일으킬 수 있는지에 대한 안전장치 — 원문에 명시 없음.
- **(사실)** Docker Compose 본체에 대한 기여(issue #13727, PR #13742)는 merge 완료.

## 레퍼런스
- docker-vals GitHub — https://github.com/estie-inc/docker-vals · (1차) · docker-vals 소스코드 및 설치 스크립트.
- Docker Compose Provider Services — https://docs.docker.com/compose/how-tos/provider-services/ · (1차) · Provider Services 공식 문서.
- rawsetenv issue — https://github.com/docker/compose/issues/13727 · (1차) · prefix 없이 환경변수 전달 요청.
- rawsetenv PR — https://github.com/docker/compose/pull/13742 · (1차) · `rawsetenv` 메시지 타입 추가 구현.
- helmfile/vals — https://github.com/helmfile/vals · (1차) · `ref+` URI 기반 시크릿 해결 도구.
- docker pass — https://docs.docker.com/reference/cli/docker/pass/ · (1차) · Docker 네이티브 시크릿 해결 CLI.
- 원본 글 — https://zenn.dev/estie/articles/df0fd5f0326f9a · (2차) · 본 아티클.

## 확인 질문
- Q1(전이): Provider Services 메커니즘을 시크릿 주입 외에 로컬 개발에서 어떤 외부 의존성 관리에 적용할 수 있을까?
- Q2(왜·어떻게): `setenv`의 prefix 강제 설계는 왜 유지되었고, `rawsetenv`는 왜 별도 타입으로 추가되었는가? 기존 프로토콜 변경 대신 확장을 선택한 이유는?
- Q3(경계): `rawsetenv` 사용 시 여러 Provider Service가 동일한 변수명을 반환하면 어떻게 되는가? 충돌 방지 책임은 사용자에게 있는가?

> 출처: https://zenn.dev/estie/articles/df0fd5f0326f9a
