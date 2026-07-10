---
title: 'Task(Taskfile) 시작 가이드: YAML 기반 태스크 러너 기본기'
pubDate: '2026-07-11T02:20:59+09:00'
description: 'Taskfile.yml 생성부터 태스크 호출·빌드 예시까지, Task 러너의 기본 사용법을 정리한 학습 가이드.'
summary: 'Task는 YAML 기반 태스크 러너로, `task --init` 한 줄로 시작해 쉘 명령을 재사용 가능한 태스크로 정의·실행한다. mvdan/sh 기반 크로스플랫폼 쉘 지원이 핵심 차별점이다.'
lang: ko
tags:
  - 'workflow'
  - 'developer-productivity'
  - 'open-source'
canonical: 'https://taskfile.dev/docs/getting-started'
lintHash: '1be9ff87f1c3'
---

## TL;DR
- Task는 `Taskfile.yml`에 쉘 명령을 YAML로 선언하면 `task <이름>` 한 줄로 실행하는 태스크 러너이며, Windows에서도 sh/bash 구문을 그대로 돌릴 수 있는 크로스플랫폼 쉘(mvdan/sh)이 핵심이다.

## 큰 그림
```
Task (태스크 러너)
│
├─ 설정 파일 ─── Taskfile.yml (YAML)
│   ├─ version  : 호환 최소 Task 버전
│   ├─ vars     : 재사용 변수 (Go template {{.VAR}})
│   └─ tasks    : 실행 단위 모음
│       ├─ default  (이름 생략 가능)
│       └─ build 등 (사용자 정의)
│
├─ 실행 엔진 ─── mvdan/sh (Go 네이티브 sh 해석기)
│   └─ Windows 포함 sh/bash 구문 실행 가능
│
└─ CLI 호출 ──── task [태스크명] [--dir] [--taskfile]
```

## 핵심
- Task는 Makefile의 현대적 대안으로, **YAML 선언형**으로 태스크를 정의하고 `task` CLI로 호출한다. `task --init`을 실행하면 현재 디렉터리에 `Taskfile.yml`이 자동 생성되며, 하위 디렉터리나 커스텀 파일명도 인자로 지정 가능하다.
- 생성된 파일의 골격은 **version → vars → tasks** 세 축인데, `vars`에 정의한 변수는 태스크 내부에서 `{{.GREETING}}` 같은 Go template 문법으로 참조된다. 이 구조 덕분에 설정값과 실행 로직이 분리되고, 여러 태스크가 같은 변수를 공유할 수 있다.
- 태스크 호출은 `task <이름>`이지만, **`default`라는 이름의 태스크는 이름 생략이 가능**해 진입점 역할을 한다. 다른 디렉터리나 다른 파일명의 Taskfile은 `--dir`, `--taskfile` 플래그로 지정한다.
- 각 태스크의 `cmds`에는 쉘 명령을 나열하는데, 여기서 Task는 시스템 쉘 대신 **mvdan/sh라는 Go 기반 sh 해석기**를 사용한다. 따라서 Windows처럼 sh/bash가 기본 없는 환경에서도 동일한 스크립트가 동작한다(단, 호출하는 외부 실행파일은 PATH에 있어야 함).

## 깊이
- **[크로스플랫폼 쉘]** mvdan/sh는 POSIX sh 구문을 Go로 재구현한 라이브러리다. 비유하면 "sh 문법을 번역해 Go 프로세스 안에서 직접 실행하는 통역사"인데, 이 비유가 깨지는 지점은 **외부 바이너리 호출**이다: 통역(구문 해석)은 하지만, 실제 `go build`, `gcc` 같은 실행파일은 OS의 PATH에서 찾아야 하므로 플랫폼별 설치 여부는 별도로 관리해야 한다(원문 명시).
- **[silent 속성]** `silent: true`는 태스크 메타데이터 출력을 억제하고 커맨드 결과만 보여준다. CI 로그 정리나 사용자 친화적 CLI 출력에 유용하며, 원문의 `default` 예시에서 이 패턴을 확인할 수 있다.
- **[빌드 태스크 예시]** `build` 태스크에 `go build ./cmd/main.go`를 넣은 예시는 Task가 단순히 echo 수준의 유틸이 아니라 실제 빌드·배포 파이프라인의 진입점으로 확장됨을 보여준다. 여기서 `cmds`는 리스트이므로 여러 명령을 순차 연결할 수 있고(원문의 'so much more' 언급), 이후 문서의 의존성(`deps`), 소스 감시(`sources`/`generates`) 등으로 발전한다.

## 용어 풀이
- **Taskfile** — Task가 읽는 YAML 설정 파일 / Makefile의 YAML 버전이라 생각하면 됨 / 비유가 깨지는 지점: Makefile의 타겟 의존성 그래프·암묵적 규칙 등 고급 기능은 Task에서 `deps`, `sources` 같은 별도 속성으로 재설계되어 있어 1:1 대응은 아님.
- **mvdan/sh** — Go로 작성된 POSIX sh 해석기·포매터 / "내장 통역사" / 외부 실행파일 자체를 대체하지는 않으므로, 쉘 내장 명령(built-in)이 아닌 바이너리는 시스템 PATH 의존.
- **Go template (`{{.VAR}}`)** — 변수 치환 문법 / Jinja, Handlebars와 유사 / Task는 Go template 엔진 전체를 노출하므로 조건문·범위 반복도 가능하지만, 원문 getting-started 범위에서는 단순 변수 참조만 다룸.

## 시각 자료
| 개념 | Makefile 비교 | Task(Taskfile) 특징 |
|---|---|---|
| 선언 형식 | 탭 기반 Make 문법 | YAML (들여쓰기) |
| 쉘 실행 | 시스템 `/bin/sh` | mvdan/sh (내장, 크로스플랫폼) |
| 변수 | `$(VAR)` | `{{.VAR}}` (Go template) |
| 기본 태스크 | `.DEFAULT` 또는 첫 타겟 | `default` 이름 (생략 가능) |

## 핵심 시사점 / 판단
- **(저자 주장)** Task는 "Makefile의 현대적 대안" 포지셔닝이며, YAML 선호·크로스플랫폼 쉘·Go template을 무기로 내세운다.
- **(검증 필요·불확실)** mvdan/sh가 모든 bash 확장을 지원하는지는 원문에 명시되지 않음(bash-ism 사용 시 호환성 테스트 필요). 대규모 모노레포에서의 성능·include 체계는 getting-started 범위 밖.
- **(원문에 없음)** Makefile 대비 실제 속도·캐싱 효율 비교 수치, 팀 도입 시 러닝커브 체감 데이터는 제공되지 않음.

## 레퍼런스
- Getting Started | Task — https://taskfile.dev/docs/getting-started · (2차, 공식 문서 기반 요약) · Taskfile 생성·호출·빌드 태스크 추가까지의 최소 튜토리얼.
- Task Installation Guide — https://taskfile.dev/docs/installation · (1차) · 설치 방법(본문에서 전제).
- Task Usage Guide — https://taskfile.dev/docs/guide · (1차) · 심화 기능 안내.
- Taskfile Schema Reference — https://taskfile.dev/docs/reference/schema · (1차) · 전체 스키마 명세.
- mvdan/sh (GitHub) — https://github.com/mvdan/sh · (1차) · Task가 내부적으로 사용하는 Go sh 해석기.

## 확인 질문
- Q1(전이): Makefile을 이미 쓰는 프로젝트에서 Task로 점진적 마이그레이션할 때, 두 시스템을 공존시키는 최소 전략은?
- Q2(왜·어떻게): mvdan/sh가 외부 바이너리 호출은 OS PATH에 의존한다면, Docker·CI 환경에서 Taskfile의 이식성을 어떻게 보장할까?
- Q3(경계): `default` 태스크 이름 생략이 편의성을 주지만, 실수로 wrong Taskfile이 실행되는 위험(예: 상위 디렉터리 파일 선택)은 어떻게 방어하는가?

> 출처: https://taskfile.dev/docs/getting-started
