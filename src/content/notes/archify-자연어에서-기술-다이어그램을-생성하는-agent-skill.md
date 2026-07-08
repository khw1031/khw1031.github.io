---
title: 'Archify — 자연어에서 기술 다이어그램을 생성하는 agent skill'
pubDate: '2026-07-08'
description: '자연어 설명을 아키텍처·워크플로·시퀀스·데이터플로·라이프사이클 다이어그램 HTML로 변환하는 agent skill의 구조와 사용법'
summary: 'Archify는 Claude·Codex CLI·opencode에서 동작하는 agent skill로, 자연어 시스템 설명을 JSON IR 기반 렌더링 파이프라인을 통해 테마 전환과 고해상도 내보내기를 지원하는 단일 HTML 기술 다이어그램으로 변환한다.'
lang: ko
tags:
  - 'agent-skill'
  - 'diagram'
  - 'developer-productivity'
  - 'workflow'
canonical: 'https://github.com/tt-a1i/archify'
lintHash: 'd5bd37c73714'
---

> 한 줄 명제: Archify는 자연어 시스템 설명을 JSON IR 중간 표현과 타입별 렌더러를 거쳐 테마 전환·고해상도 내보내기가 가능한 단일 HTML 기술 다이어그램으로 산출하는 agent skill이다.

## 큰 그림

```text
Archify: 자연어 설명 → 검증된 기술 다이어그램 (단일 HTML)
├─ 1. 다이어그램 타입 5종 (architecture / workflow / sequence / data-flow / lifecycle)
├─ 2. JSON IR 렌더링 파이프라인 (generate → validate → render → check → iterate)
├─ 3. 설치 및 프롬프트 인터페이스 (agent skill zip + SKILL.md)
├─ 4. Export 시스템 (dark/light 테마, PNG/JPEG/WebP/SVG, 최대 4× 네이티브 래스터라이즈)
└─ 5. 스타일링 모델 (CSS custom properties + 시맨틱 tech 라벨)
```

## 핵심

Archify는 Claude.ai, Claude Code CLI, Codex CLI, opencode에 설치할 수 있는 agent skill이다. 사용자가 자연어로 시스템 구조나 프로세스를 설명하면, 에이전트는 이를 타입별 JSON IR(intermediate representation)로 변환하고, ajv 기반 스키마 검증과 레이아웃 검사를 거친 뒤 자기 완결적인 단일 HTML 파일로 렌더링한다. 결과물은 의존성이 없고, 브라우저에서 바로 열며 dark/light 테마를 한 번의 클릭으로 전환할 수 있다.

다이어그램은 다섯 가지 타입으로 나뉜다. Architecture는 시스템 컴포넌트와 경계를, Workflow는 스윔레인 기반의 기술 커뮤니케이션 흐름을, Sequence는 호출 체인과 시간 순서를, Data Flow는 데이터 자산의 이동과 변환을, Lifecycle은 상태 머신과 전이를 그린다. 각 타입은 독립적인 타이핑 렌더러를 가지며 스키마 검증 대상이 된다.

내보내기 파이프라인은 SVG를 복제한 뒤 호스트 스타일을 인라인하고, 래스터 포맷의 경우 `width`/`height`를 `viewBox`의 최대 4배로 설정하여 브라우저가 벡터를 목표 해상도에서 네이티브로 래스터라이즈하게 한다. 캔버스에는 자연 크기로 그리므로 업샘플링 흐림이 발생하지 않는다. SVG 내보내기는 dark/light 두 세트의 CSS 변수와 `@media (prefers-color-scheme)` 규칙을 포함하여, GitHub README에 넣으면 읽는이의 환경에 자동으로 반응한다.

(원문 예제 — 파이프라인 미검증)
```bash
# CLI 래퍼를 통한 렌더링·검증·검사
node bin/archify.mjs render workflow examples/agent-tool-call.workflow.json workflow.html
node bin/archify.mjs validate workflow examples/agent-tool-call.workflow.json --json
node bin/archify.mjs check workflow.html
node bin/archify.mjs examples
```

(원문 예제 — 파이프라인 미검증)
```bash
# Codex CLI 전역 설치
unzip archify.zip -d ~/.agents/skills/

# 또는 프로젝트 로컬
unzip archify.zip -d ./.agents/skills/
```

(원문 예제 — 파이프라인 미검증)
```bash
# 렌더러의 ajv 의존성 설치 (1회)
cd ~/.agents/skills/archify && npm install
```

## 깊이

**[가지 1: 다이어그램 타입]** ⭐ 내재화

다섯 타입의 구분 기준은 "무엇을 설명하는가"이다. Architecture는 컴포넌트·경계·연결을, Workflow는 참가자·단계 순서·분기(스윔레인 포함)를, Sequence는 호출자-피호출자 간 시간 순서를, Data Flow는 데이터 소스·처리 단계·저장·민감도 경계를, Lifecycle은 상태·전이 이벤트·재시도·종단 상태를 그린다. Workflow는 범용 플로차트가 아닌 기술 커뮤니케이션 다이어그램으로 설계되어 해피 경로와 비동기·승인·추적 경로를 구분한다.

**[가지 2: JSON IR 렌더링 파이프라인]** ⭐ 내재화

렌더링은 다섯 단계를 거친다. (1) 에이전트가 타입별 JSON IR을 생성하고, (2) ajv가 JSON 스키마를 검증하며(의존성 미설치 시 레이아웃 검사만 실행), (3) 타입별 렌더러가 자기 완결적 HTML/SVG를 산출하고, (4) 포스트 렌더 검사기가 불완전한 SVG, 비유한수 좌표, 우발적 대각선 화살표, 범례 교차 경로를 검출하며, (5) 문제가 있으면 전체 재생성이 아닌 JSON IR 또는 시맨틱 클래스에 대한 표적 수정으로 반복한다. 이 구조는 수정 비용이 낮은 것이 핵심이다.

**[가지 3: 설치 및 프롬프트 인터페이스]** 📎 offload

설치 경로는 플랫폼마다 다르다. Claude Code는 `~/.claude/skills/`, Codex CLI는 `~/.agents/skills/`, opencode는 `~/.config/opencode/skills/` 또는 `~/.agents/skills/`를 사용한다. Claude.ai는 zip 업로드 방식을 취하며, Project Knowledge 업로드는 architecture 모드만 지원한다(코드 실행 불가, 프롬프트 기반 전용). 풀 기능 사용에는 타이핑 렌더러 실행 환경이 필요하다.

**[가지 4: Export 시스템]** ⭐ 내재화

래스터 내보내기의 선명함은 "브라우저 네이티브 래스터라이즈"에서 온다. 복제된 SVG의 `width`/`height`를 `4 × viewBox`로 설정하고, 캔버스를 동일 크기로 맞춘 뒤 자연 크기로 그려 업샘플링 없이 4× 출력을 얻는다. 과도한 해상도가 브라우저 캔버스 한계를 초과하면 자동으로 3×/2×로 단계적 축소한다. WebP는 브라우저의 canvas 인코더 지원에 의존하며(구형 Safari 불가), 클립보드 복사는 `ClipboardItem` + `navigator.clipboard.write` 지원이 필요하다(Chromium, Firefox 127+, Safari 16+).

**[가지 5: 스타일링 모델]** 📎 offload

스타일링은 `:root`의 CSS custom properties와 `[data-theme="light"]` 셀렉터로 구현된다. SVG 요소는 `c-frontend`, `t-muted`, `a-emphasis` 같은 시맨틱 클래스를 참조하며, 테마 토글은 `<html>`의 `data-theme` 속성 전환 한 번으로 그라디언트·그리드·화살표·마스크 전체에 적용된다. 시맨틱 tech 라벨(예: `aws.lambda`, `postgres`, `kafka`)은 아이콘 라이브러리 없이 색상·그룹화·레이블 매핑에 사용된다.

## 비유

**Archify는 "다이어그램 컴파일러"다.** 자연어라는 고수준 소스를 JSON IR이라는 중간 표현으로 컴파일한 뒤, 타입별 렌더러가 최종 HTML/SVG 아티팩트를 산출한다. 검증 단계는 컴파일러의 정적 분석에 해당한다.
**깨지는 지점:** 전통적 컴파일러는 결정론적 문법을 다루지만, Archify의 입력은 자연어이므로 에이전트의 해석에 따라 동일 설명이라도 다른 IR이 산출될 수 있다. "컴파일"이라기보다 "에이전트 주도 생성 + 기계적 검증"에 가깝다.

## 곁가지

- JSON IR 심화: v3.0에서 계획된 `diagram.json` 안정화(로컬 좌표 편집, `git diff` 친화적 출력)가 필요해질 때
- Mermaid 변환 심화: 자동 Mermaid 파서 경로가 폐기된 이유(네이티브 Mermaid 대비 유의미한 품질 차이 없음)와 프롬프트 기반 대체 경로의 구조가 필요해질 때

## 연결

- **agent skill 패턴**: Archify는 SKILL.md 기반 agent skill 패키징의 구체적 인스턴스이므로, 다른 skill 설계 시 설치 경로와 프롬프트 구조를 참고할 수 있다.
- **JSON IR 설계**: 중간 표현 → 검증 → 렌더링 파이프라인은 컴파일러 프론트엔드·백엔드 분리 패턴과 구조적으로 동일하다.
- **CSS custom properties 테마 시스템**: dark/light 전환을 CSS 변수 하나로 구현하는 방식은 모든 자기 완결적 HTML 산출물에 재사용 가능한 패턴이다.

## 레퍼런스

- [tt-a1i/archify GitHub](https://github.com/tt-a1i/archify) — Archify 전체 소스 및 README, 5종 다이어그램 타입·렌더링 파이프라인·설치법·Export 시스템의 1차 출처. 버전 2.10.0 기준. (1차)
- [Archify 프로젝트 페이지](https://tt-a1i.github.io/archify/) — 공식 프로젝트 소개 페이지. (2차)
- [Cocoon-AI/architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator) — Archify의 원본 프로젝트(v1.0, MIT). 다크 전용 HTML 출력 기반. 버전 명시 없음. (2차)

---
## 인출 질문

1. **맵 재생:** Archify의 다섯 MECE 가지를 이름만 나열하고, JSON IR 파이프라인의 다섯 단계를 순서대로 쓰시오.
2. **전이 (Export):** Archify의 4× 래스터 내보내기가 "업샘플링 흐림"을 피하는 메커니즘을 한 문장으로 설명하고, 이것이 전통적인 canvas 업스케일링과 어떻게 다른지 서술하시오.
3. **전이 (파이프라인):** 다이어그램의 일부를 수정할 때 전체 재생성이 아닌 표적 수정이 가능한 이유를 JSON IR 파이프라인 구조에 기반해 설명하시오.

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
