---
title: 'Grok Build: xAI의 Rust 기반 터미널 AI 코딩 에이전트'
pubDate: '2026-07-17T02:36:11+09:00'
description: 'Grok Build 아키텍처, 설치, ACP·MCP 통합과 crate 구조를 정리한 오픈소스 코딩 에이전트 가이드.'
summary: 'xAI가 공개한 Rust 기반 터미널 코딩 에이전트 Grok Build의 구조, 실행 모드, crate 레이아웃을 한 장으로 파악한다.'
lang: ko
tags:
  - 'agentic-coding'
  - 'open-source'
  - 'mcp'
  - 'developer-productivity'
canonical: 'https://github.com/xai-org/grok-build'
lintHash: '2dd4383f7019'
---

## TL;DR
- Grok Build는 xAI가 Rust로 만든 풀스크린 터미널 코딩 에이전트로, TUI·헤드리스·에디터 임베딩(ACP) 세 모드를 하나의 런타임에서 제공한다(2차).

## 큰 그림
```
                ┌──────────── 사용자 접점 ────────────┐
                │  TUI(대화형)  Headless(CI)  ACP(에디터) │
                └──────────────┬──────────────────────┘
                               ▼
                ┌──── xai-grok-shell (agent runtime) ────┐
                │  leader / stdio / headless entrypoint  │
                └──────┬────────────┬────────────┬──────┘
                       ▼            ▼            ▼
              xai-grok-pager   xai-grok-tools  xai-grok-workspace
              (TUI·렌더링)     (terminal·file  (FS·VCS·checkpoint·
                               edit·search)     execution·sandbox)
                               ▼
                     MCP servers / Skills / Plugins / Hooks
                     (third_party: Mermaid 스택 vendor)
```

## 핵심
- Grok Build는 **단일 바이너리(`xai-grok-pager`, 배포명 `grok`)** 로 코드베이스 이해·파일 편집·셸 실행·웹 검색·장기 작업 관리를 수행하는 에이전트다(2차).
- 실행 모드는 세 가지로 분기한다: 사용자가 직접 조작하는 **TUI**, CI/스크립트용 **headless**, 에디터가 호출하는 **ACP(Agent Client Protocol)** — 즉 하나의 런타임을 다양한 호스트가 소비하는 구조다(2차).
- 코드베이스는 **기능별 crate**로 쪼개져 `pager-bin`(composition root)이 `pager`·`shell`·`tools`·`workspace`를 조합하고, `codegen/...` 아래 config·MCP·마크다운·샌드박스가 붙는다(2차).
- 라이선스는 Apache 2.0이며, **openai/codex와 sst/opencode의 도구 구현을 in-tree로 이식**해 동봉했다(2차, THIRD-PARTY-NOTICES 근거).
- 빌드는 `rust-toolchain.toml`로 고정되고 `protoc`은 dotslash 런처(`bin/protoc`) 또는 `PATH/$PROTOC`로 해결한다(2차).

## 깊이
- **[모드 분기]** TUI는 "풀스크린·마우스 인터랙티브"를 전제로 스크롤백·프롬프트·모달을 `xai-grok-pager`가 직접 렌더링하고, headless는 stdio 입출력으로 CI 파이프라인에 끼워넣을 수 있다(2차). ACP는 에디터가 에이전트를 "클라이언트"처럼 호출하는 규격으로, 에디터 내장 경험을 외부 에이전트로 대체 가능하게 한다(불확실: 프로토콜 세부 사양은 원문에 없음).
- **[대표 crate ① `xai-grok-shell`]** 에이전트 루프와 leader/stdio/headless 엔트리를 갖는 "컨트롤 플레인"이다. 도구 호출·컨텍스트 관리를 여기서 조율하므로, 새 모드를 추가하려면 이 crate의 엔트리만 확장하면 된다고 **추론**된다(불확실: 확장 가이드는 원문에 없음).
- **[대표 crate ② `xai-grok-workspace`]** 호스트 FS, VCS, 실행, **checkpoint**를 담당해 에이전트가 작업 스냅샷을 만들고 되돌리는 기반을 제공한다(2차). 샌드박싱과 쌍으로 안전장치 역할을 하는 구조로 읽힌다.
- **[대표 crate ③ `xai-grok-tools`]** terminal·file edit·search 등 "실제 손발"이 되는 도구 모음. codex/opencode 포트를 포함해 기존 오픈소스 도구를 Rust로 재구현하여 벤더 종속을 줄이려 한 것으로 보인다(2차 + 추론).
- **[생태계 확장]** MCP 서버, skills, plugins, hooks가 사용자 가이드에 포함되어 커스텀 도구·워크플로우 확장을 공식 지원한다(2차).
- **[설치·빌드]** `curl …/install.sh | bash`(macOS/Linux/Git Bash), `irm …/install.ps1 | iex`(Windows)로 바이너리 설치. 소스 빌드는 `cargo run -p xai-grok-pager-bin`, 최초 실행 시 브라우저 OAuth 인증이 필요하다(2차).

## 용어 풀이
- **TUI** — Text-based User Interface. GUI 대신 터미널에 창·버튼·스크롤을 그리는 UI. 비유: "터미널 속 데스크톱". 깨지는 지점: 마우스·색상·리사이즈 지원 수준은 터미널 에뮬레이터마다 달라 일관성이 보장되지 않음.
- **ACP (Agent Client Protocol)** — 에디터가 외부 에이전트를 호출하는 규격. 비유: "에디터와 에이전트 사이의 USB 규격". 깨지는 지점: 원문에 상세 스펙이 없어 MCP/LSP와의 차이는 확인 필요.
- **Headless** — UI 없이 stdio만으로 동작하는 모드. 비유: "조종석 없는 자율주행". 깨지는 지점: 대화형 피드백이 없으므로 출력 포맷·에러 계약이 엄격해야 함.
- **MCP** — Model Context Protocol. LLM이 외부 도구·데이터를 호출하는 표준. 비유: "에이전트용 플러그 소켓". 깨지는 지점: 서버 구현 품질과 보안 정책이 성능·안전성을 좌우.
- **Checkpoint** — 작업 중간 상태를 저장해 되돌리는 지점. 비유: "세이브 파일". 깨지는 지점: FS·VCS 상태와 동기화되지 않으면 복원 시 불일치 발생 가능.
- **Dotslash launcher** — `bin/protoc`처럼 `PATH` 의존 없이 고정 버전 실행파일을 불러오는 래퍼. 비유: "내장 드라이버". 깨지는 지점: 네트워크/캐시 설정에 따라 첫 실행이 느릴 수 있음.

## 시각 자료
| 영역 | Crate | 역할 |
|---|---|---|
| 실행 파일 | `xai-grok-pager-bin` | Composition root, 바이너리 산출 |
| UI | `xai-grok-pager` | 스크롤백·프롬프트·모달·렌더링 |
| 런타임 | `xai-grok-shell` | Agent 루프, leader/stdio/headless |
| 도구 | `xai-grok-tools` | terminal, file edit, search + codex/opencode 포트 |
| 작업공간 | `xai-grok-workspace` | FS·VCS·실행·checkpoint |
| 부가 | `crates/codegen/...` | config, MCP, markdown, sandbox |
| 공용 | `crates/common/`, `crates/build/`, `prod/mc/` | 폐쇄(closure)가 끌어오는 리프 |
| 벤더 | `third_party/` | Mermaid 다이어그램 스택 |

## 핵심 시사점 / 판단
- **(저자 주장)** "코드베이스를 이해하고, 파일을 편집하고, 셸을 실행하고, 웹을 검색하고, 장기 작업을 관리한다" — 범용 코딩 에이전트를 표방(2차).
- **(저자 주장)** Rust + crate 분리 + generated `Cargo.toml`로 대규모 모노레포 동기화를 전제로 한 빌드 체계를 갖춤(2차).
- **(검증 필요·불확실)** ACP의 구체적 스펙, MCP 서버 번들 목록, 샌드박스 격리 수준(네트워크/프로세스), Windows 소스 빌드 안정성은 원문에 상세 없음.
- **(검증 필요·불확실)** "openai/codex, sst/opencode 도구 이식"의 기능 동등성과 Rust 포트로 인한 성능·행동 차이는 벤치마크 없이 미확인.
- **(검증 필요·불확실)** xAI 모노레포에서 주기적 동기화한다고 하나, 업스트림과 공개 트리의 diff·지연 주기는 명시되지 않음.

## 레퍼런스
- GitHub xai-org/grok-build — https://github.com/xai-org/grok-build · (1차) · 리포 README로 설치·빌드·크레이트 레이아웃·라이선스 정보의 원천.
- x.ai/cli — https://x.ai/cli · (1차) · 공식 랜딩/설치 페이지 및 changelog 링크 제공.
- docs.x.ai/build/overview — https://docs.x.ai/build/overview · (1차) · 사용자 가이드(단축키·슬래시 명령·MCP·skills·sandbox 등) 온라인 문서.
- 사용자 가이드(in-tree) — https://github.com/xai-org/grok-build/tree/main/crates/codegen/xai-grok-pager/docs/user-guide · (1차) · 인증·테마·hooks·headless 등 로컬 문서 트리.
- THIRD-PARTY-NOTICES — https://github.com/xai-org/grok-build/blob/main/THIRD-PARTY-NOTICES · (1차) · codex/opencode 포트 및 벤더 UI 테마 등 서드파티 라이선스 고지.

## 확인 질문
- Q1(전이): 기존 MCP 기반 에이전트(Cursor·Windsurf·Claude Code 등)와 Grok Build의 도구·컨텍스트 계약을 어떻게 맞출 것인가?
- Q2(왜·어떻게): `workspace`의 checkpoint는 VCS 커밋·스태시와 어떤 순서로 상호작용하며, 충돌 시 복원 전략은 무엇인가?
- Q3(경계): Windows 소스 빌드가 "best-effort"인 상황에서 CI·프로덕션 사용 범위를 어디까지로 제한할 것인가?

> 출처: https://github.com/xai-org/grok-build
