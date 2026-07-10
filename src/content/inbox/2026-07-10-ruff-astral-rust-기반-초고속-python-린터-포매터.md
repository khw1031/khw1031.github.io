---
title: 'Ruff: Astral의 Rust 기반 초고속 Python 린터·포매터'
pubDate: '2026-07-10T11:50:14+09:00'
description: 'Ruff는 Flake8·Black·isort 등 파편화된 Python 도구 체인을 Rust로 재구현해 하나로 통합한 린터 겸 포매터로, 900개 이상의 규칙과 10~100배 빠른 속도를 제공한다.'
summary: 'Ruff는 Astral(uv 제작사)이 Rust로 만든 Python 린터 겸 포매터다. Flake8과 60여 개 플러그인, Black, isort, pydocstyle, pyupgrade, autoflake 등 서로 다른 도구가 나눠 하던 일을 900개 이상의 내장 규칙 하나로 흡수하고, --fix로 자동 교정한다. 기존 도구 대비 10~100배 빠르며(CPython 전체 스캔 약 0.4초), FastAPI·Pandas·SciPy·Hugging Face·Apache Airflow 등이 채택했다. MIT 라이선스, GitHub 48.5k 스타.'
lang: ko
tags:
  - 'python'
  - 'rust'
  - 'linter'
  - 'formatter'
  - 'developer-productivity'
  - 'tooling'
  - 'astral'
canonical: 'https://github.com/astral-sh/ruff'
polishHash: 'ea67348356d3'
lintHash: 'ea67348356d3'
---

## TL;DR
- Ruff는 ==파편화된 Python 도구 체인(Flake8+플러그인, Black, isort, pydocstyle, pyupgrade, autoflake…)을 Rust 하나로 재구현해 통합==한 린터 겸 포매터다. 도구 여러 개를 깔고 조율하던 일을 단일 바이너리로 대체한다.
- 핵심 가치는 **속도**다 — 기존 도구 대비 ==10~100배 빠름==. CPython 전체 코드베이스 린트 스캔이 약 0.4초(Pylint는 대형 모듈에서 약 2.5분).
- 900개 이상의 내장 규칙 + `--fix` 자동 교정. Astral(uv 제작사)이 만들었고 MIT 라이선스, GitHub 48.5k 스타. FastAPI·Pandas·SciPy·Hugging Face·Apache Airflow 등이 채택.

## 큰 그림

```text
                    기존 Python 품질 체인 (파편화)
   ┌─────────┬─────────┬─────────┬───────────┬──────────┬──────────┐
   │ Flake8  │ Black   │ isort   │ pydocstyle│ pyupgrade│ autoflake│
   │ +60여   │(포맷)   │(import  │ (docstr)  │ (문법    │ (미사용  │
   │ 플러그인│         │ 정렬)   │           │  현대화) │  제거)   │
   └────┬────┴────┬────┴────┬────┴─────┬─────┴────┬─────┴────┬─────┘
        │ 각각 설치·버전조율·설정 파일 분산 · Python으로 실행(느림)
        ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                    Ruff (Rust, 단일 바이너리)                 │
   │  ruff check  → 린트(900+ 규칙) + --fix 자동 교정 + import 정렬 │
   │  ruff format → Black 호환 포매팅                              │
   │  설정: pyproject.toml / ruff.toml 한 곳                       │
   └──────────────────────────────────────────────────────────────┘
        │ 10~100배 빠름 (CPython 스캔 ~0.4s)
        ▼
   FastAPI · Pandas · SciPy · Hugging Face · Apache Airflow …
```

## 1. 무엇을 푸는가 — 파편화 + 느림

Python 품질 도구는 오랫동안 역할별로 쪼개져 있었다: 린트는 Flake8(+수십 개 플러그인), 포맷은 Black, import 정렬은 isort, docstring은 pydocstyle, 문법 현대화는 pyupgrade… 각각 별도 설치·버전 조율·설정이 필요했고, 모두 Python으로 돌아 대형 코드베이스에서 느렸다.

Ruff는 이 도구들의 규칙을 ==Rust로 네이티브 재구현==해 하나로 합쳤다. 즉 "여러 도구를 붙여 쓰는 대신, 하나가 그 규칙들을 다 안다".

## 2. 두 개의 축 — check와 format

```bash
ruff check path/to/code/          # 린트 (문제 탐지)
ruff check --fix path/to/code/    # 린트 + 자동 교정
ruff format path/to/code/         # 포매팅 (Black 호환)
```

- `ruff check`: 900개 이상의 규칙으로 코드 품질·스타일 위반 탐지. `--fix`로 상당수 자동 교정. import 정렬(isort 대체)도 포함.
- `ruff format`: Black과 호환되는 자동 포매터.

설정은 `pyproject.toml` 또는 `ruff.toml` 한 곳에 모인다.

## 3. 왜 빠른가 — Rust + 단일 프로세스

- 코드베이스의 96.5%가 Rust(나머지 Python 2.6%, TypeScript 0.8%). Python 인터프리터 오버헤드 없이 컴파일된 네이티브 바이너리로 실행.
- 여러 도구를 순차 실행하며 매번 파일을 다시 파싱하는 대신, 한 번 파싱한 AST 위에서 규칙을 한꺼번에 돌린다.
- 결과: 기존 린터/포매터 대비 10~100배. CPython 전체 스캔 약 0.4초 vs Pylint 대형 모듈 약 2.5분.

## 4. 생태계 위치 — Astral의 도구군

Ruff를 만든 Astral은 Python 패키지·프로젝트 매니저 **uv**, 타입 체커 **ty**도 만든다. 공통 전략은 동일하다 — ==느리고 파편화된 Python 도구를 Rust로 재구현해 통합·가속==. Ruff는 이 전략이 가장 먼저 널리 채택된 사례다.

- 설치: pip, uv, pipx, Homebrew, Conda, standalone installer.
- 라이선스: MIT. GitHub 48.5k 스타.
- 채택: FastAPI, Pandas, SciPy, Hugging Face, Apache Airflow 등.

## 곁가지 (탐색 후보)

- Black 호환 포매터를 별도로 두지 않고 `ruff format` 하나로 수렴시킬 때의 스타일 차이·마이그레이션 이슈.
- 규칙 선택 정책: 900+ 규칙을 다 켜지 않고 프로젝트별로 어떤 규칙 세트를 고를 것인가(`select`/`ignore` 설계).
- Astral 도구군(uv·ruff·ty)을 한 번에 쓰는 Python 워크플로 — "Rust로 다시 쓴 Python 툴체인"이라는 큰 그림.
- 파서/AST 재사용 아키텍처: 한 번 파싱해 여러 규칙을 도는 구조가 속도에 기여하는 정도.
- LSP·에디터 통합(ruff-lsp / 네이티브 서버)로 실시간 린트를 붙일 때의 경험.
