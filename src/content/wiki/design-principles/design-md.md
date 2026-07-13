---
type: Reference
title: DESIGN.md — 에이전트에 시각 아이덴티티를 넘기는 포맷 (이 카테고리의 앵커)
pubDate: '2026-07-10T20:40:00+09:00'
resource: https://github.com/google-labs-code/design.md
description: 이 카테고리의 산출물 프레임 — DESIGN.md(Google Labs)는 YAML 디자인 토큰 + 마크다운 산문으로 코딩 에이전트에게 디자인 시스템을 전달하는 포맷. 그 섹션 구조가 이 라이브러리의 조직 렌즈다
lang: ko
tags: ['design-md', 'design-tokens', 'ai-agents', 'design-system', 'design-to-code']
summary: "이 카테고리의 앵커는 특정 디자인 시스템(Material 등)이 아니라 산출물 포맷 DESIGN.md다. DESIGN.md(google-labs-code, alpha v0.3.0)는 'AGENTS.md의 시각 디자인 버전' — YAML frontmatter(기계용 토큰: color/dimension/typography/rounded/spacing)와 마크다운 산문(사람·에이전트용 의도)을 한 파일에 담고, 섹션 순서를 Overview→Colors→Typography→Layout→Elevation&Depth→Shapes→Components→Do's and Don'ts로 고정한다. 토큰만으로 판단 안 되는 '왜·언제·예외'를 산문이 채운다. 이 라이브러리의 원리 카드들이 바로 그 산문 섹션을 채울 근거다 — 즉 DESIGN.md의 섹션 구조가 이 카테고리의 조직 렌즈다."
lintHash: 'd09305db614c'
---

> 한 줄 명제: 이 카테고리의 산출물은 특정 디자인 시스템이 아니라 **DESIGN.md** — 좋은 UI/UX 원리를, 코딩 에이전트가 읽는 토큰+산문 포맷의 각 섹션(Colors·Typography·Layout·Elevation·Shapes·Components·Do's&Don'ts)에 채우는 것이 목표다.

## 핵심

이 카테고리를 관통하는 산출물 프레임은 특정 디자인 시스템이 아니라 **DESIGN.md**라는 포맷이다. DESIGN.md(google-labs-code, Apache-2.0, alpha v0.3.0)는 ==**"AGENTS.md의 시각 디자인 버전"**== — 코딩 에이전트가 프롬프트마다 디자인 맥락을 다시 받지 않아도 프로젝트의 시각 아이덴티티를 지속·구조적으로 이해하게 하는 단일 파일 포맷이다.

두 층으로 되어 있다:

- **YAML frontmatter (기계용 토큰)** — `colors`·`typography`·`rounded`·`spacing`·`components` 같은 디자인 토큰을 파싱 가능하게. 토큰 참조 `{colors.primary}`로 컴포넌트 토큰이 기반 토큰을 가리킨다(W3C DTCG에서 영감; `export --format dtcg`로 표준 토큰 산출).
- **마크다운 산문 (사람·에이전트용 의도)** — 정해진 섹션 순서로 "왜 이렇게, 어떻게 적용하는지"를 자연어로. ==토큰만으로는 판단이 안 되는 상황(어떤 색을 어디에, 언제 예외인지)을 산문이 채운다.==

고정된 섹션 순서가 곧 ==이 라이브러리의 조직 렌즈==다:

```text
Overview           — 디자인 의도·성격 (컨셉)
Colors             → color-and-contrast, dark-mode-and-theming
Typography         → typographic-scale, readability-measure, baseline-grid…, fluid-typography
Layout             → layout-grid, spacing-8pt-grid, responsive-layout
Elevation & Depth  → elevation-and-depth
Shapes             → shape-and-corner-radius
Components         → forms-and-inputs, icon-systems, motion-and-microinteractions
Do's and Don'ts    → usability 원리 전반 (nielsen·gulf·fitts·hick·visual-hierarchy…)
```

즉 ==이 카테고리의 원리 카드들은 "DESIGN.md의 각 산문 섹션을 무슨 근거로 채울 것인가"에 대한 1차 출처 라이브러리==다. 전체 섹션↔카드 매핑은 [상위 허브](/wiki/design-principles/)의 "DESIGN.md 섹션 매핑"을 본다.

**CLI 생애주기.** 같이 배포되는 CLI가 파일을 관리한다 — `lint`(구조 검증), `diff`(토큰 수준 변경·회귀 보고), `export`(Tailwind v3/v4·DTCG로 코드 동기화), `spec`(에이전트가 규칙을 프로그래매틱하게 조회):

```bash
npx @google/design.md lint DESIGN.md
npx @google/design.md export --format css-tailwind DESIGN.md > theme.css
```

**중요한 한계 (검증 루프의 부재).** ==`lint`는 파일의 *구조*만 검사할 뿐, 에이전트가 생성한 UI가 실제로 이 디자인을 따랐는지는 포맷도 CLI도 확인해주지 않는다.== 준수 판정은 여전히 사람의 눈(리뷰)에 남는다 — 이 라이브러리의 [Do's and Don'ts용 사용성 원리](/wiki/design-principles/usability/)가 그 리뷰의 근거가 된다.

**Gotcha**: alpha다("Expect changes to the format as it matures") — 도입 시 스펙 버전을 고정하는 게 안전하다. Windows PowerShell은 `npx -p @google/design.md designmd …` 별칭 필요. (코드 예시는 레포 발췌이며 이 카드 작성 시 CLI를 직접 실행하지 않았다 — 외부 패키지 실행 미승인.)

## 레퍼런스

- [google-labs-code/design.md — GitHub](https://github.com/google-labs-code/design.md) — 1차. 스펙·CLI·예제의 원 저장소. 기준 v0.3.0, alpha (확인일 2026-07-05).
- [DESIGN.md Specification — stitch.withgoogle.com](https://stitch.withgoogle.com/docs/design-md/specification) — 1차. 포맷 스펙 전문(섹션 규칙·토큰 스키마).
- [@google/design.md — npm](https://www.npmjs.com/package/@google/design.md) — 1차. CLI 패키지 (v0.3.0, 2026-06-15 게시).
- [W3C Design Tokens (DTCG)](https://www.designtokens.org/) — 2차. 토큰 포맷의 영감이자 `export` 대상 표준(단, DTCG는 W3C 표준이 아니라 Community Group 리포트 — → [dark-mode-and-theming](/wiki/design-principles/aesthetics-and-layout/dark-mode-and-theming/)).

## 연결

- [Design Principles](/wiki/design-principles/) — 이 카드가 앵커로 프레이밍하는 상위 허브. 섹션↔카드 전체 매핑이 거기 있다.
- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — DESIGN.md가 속하는 인접 카테고리(디자인을 코드로 넘기는 파이프라인). 특히 [이식 가능한 텍스트 디자인 스펙](/wiki/design-to-code/design-token-dsl-handoff/)이 DESIGN.md의 핸드오프 메커니즘을 다룬다. 이 카테고리가 "무슨 좋은 디자인을 담을까(규범)"라면 저쪽은 "어떻게 담아 코드로 넘길까(메커니즘)".
- [Material Design](/wiki/design-principles/material-design/) — DESIGN.md에 담을 수 있는 **한 디자인 시스템 사례**(Apple·Carbon·Tailwind와 나란한). 앵커가 아니라 예시.
- [color-and-contrast](/wiki/design-principles/color-and-contrast/) · [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/) · [shape-and-corner-radius](/wiki/design-principles/aesthetics-and-layout/shape-and-corner-radius/) — DESIGN.md 섹션명과 그대로 대응하는 카드들.
