---
type: Reference
title: 이식 가능한 텍스트 디자인 스펙 (DESIGN.md)
pubDate: '2026-07-08'
description: 디자인 시스템을 바이너리 Figma 파일이 아니라 평범한 마크다운으로 표현해, 어떤 코딩 에이전트에도 그대로 넘길 수 있게 만드는 접근
lang: ko
tags: ['design-to-code', 'design-tokens', 'ai-agent-workflow']
summary: "Google Stitch가 만든 DESIGN.md는 색상·폰트·스타일 규칙·WCAG 검증 가능한 시맨틱 컬러 롤을 담은 Apache 2.0 오픈소스 마크다운 파일로, 리포지토리에 커밋해 Claude Code·Cursor·Copilot·Bolt 등 UI 코드를 쓰는 어떤 에이전트든 읽게 하는 것을 목표로 설계됐다. Figma의 노드 트리 대신 사람도 LLM도 직접 편집 가능한 텍스트 포맷을 디자인 핸드오프 매체로 쓰는 사례다."
lintHash: '8fbc283c6ff4'
---

> 한 줄 명제: Google Stitch는 디자인 시스템을 바이너리 Figma 파일이 아니라 사람도 LLM도 읽고 손으로 고칠 수 있는 평범한 마크다운 파일(DESIGN.md)로 표현해, Claude Code·Cursor·Bolt 등 어떤 에이전트에도 그대로 넘길 수 있게 만들었다.

## 핵심

DESIGN.md는 Google Labs의 AI UI 디자인 도구 Stitch가 내놓은, 디자인 시스템을 위한 이식형 텍스트 스펙이다. 색상 팔레트, 폰트, 스타일링 규칙, WCAG 대비 기준으로 검증 가능한 시맨틱 컬러 롤(예: "primary", "on-primary" 같은 역할 이름) 등을 순수 마크다운으로 기술한다. Apache 2.0으로 오픈소스화됐고, 리포지토리 루트에 커밋해 두면 "Claude Code, Cursor, Copilot — UI 코드를 쓰는 어떤 에이전트든" 읽을 수 있다는 것이 공식 설명이다. 실제로 bolt.new는 Stitch에서 내보낼 때 "페이지 스크린샷 + HTML + DESIGN.md"를 함께 받는 연동을 공식 문서화하고 있어, 벤더 경계를 넘나드는 핸드오프가 마케팅 문구가 아니라 실제 파이프라인으로 동작함을 확인할 수 있다.

이 접근이 Figma 노드 트리와 근본적으로 다른 지점은 두 가지다. 첫째, 표현 형식이 벡터 편집기의 내부 씬 그래프가 아니라 처음부터 텍스트라서, 프롬프트에 그대로 붙여넣어도 무관한 필드로 오염되지 않는다. 둘째, 사람이 에디터로 직접 손으로 써서 만들 수도 있다고 명시돼 있어 — "어떤 에디터로든 손으로 작성해 GitHub에 커밋할 수 있다" — 디자인 툴 자체가 없어도 스펙이 존재할 수 있다.

다만 Stitch의 2026년 3월 "멀티 스크린" 업데이트(프로젝트 전체를 아우르는 디자인 에이전트, 한 번의 흐름 설명으로 5개 화면 생성)는 이번 조사에서 Google 공식 블로그 원문을 찾지 못했고 2차 매체(techtimes.com, heypash.com 등)로만 확인됐다 — 확실한 것은 2025-05 최초 출시 발표와 2026-04경 DESIGN.md 공개 발표뿐이다. 또한 Stitch는 여전히 "기존 디자인 파일 가져오기" 옵션도 제공하는 것으로 보이며(2026 Google I/O 요약 공식 글에서 언급), 이는 Figma로의 브리지가 남아 있다는 뜻이지 이 카드가 다루는 "Figma 배제" 시나리오의 반증은 아니다 — DESIGN.md 자체는 Figma 없이도 완결되는 독립 스펙이다.

## 레퍼런스

- [Google, Stitch — AI-powered UI design](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/) (2025-05-20) — 1차. Stitch 최초 공식 발표: 프롬프트/이미지로부터 UI 생성, "Paste to Figma" 또는 프론트엔드 코드로 내보내기 지원.
- [Google, Stitch DESIGN.md 공개](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/) (2차 경로로 확인된 날짜 ~2026-04-21) — 1차(Google 공식 블로그). DESIGN.md를 Apache 2.0으로 오픈소스화한다는 발표.
- [Stitch, DESIGN.md 공식 문서](https://stitch.withgoogle.com/docs/design-md/overview/) — 1차. 파일 포맷·용도·"어떤 에디터로든 손으로 작성 가능"이라는 설계 의도를 서술.
- [bolt.new × Google Stitch 연동 문서](https://support.bolt.new/integrations/google-stitch.md) — 1차. Stitch → Bolt로 "스크린샷 + HTML + DESIGN.md"가 넘어가는 실제 핸드오프 포맷을 확인.
- [Google, Google I/O 2026 전체 발표 정리](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/) — 1차. Stitch가 음성/텍스트 입력과 "기존 코드베이스·디자인 파일 가져오기"를 지원한다고 언급(브리지 옵션 존재를 확인하되, 이 카드의 핵심 주장인 DESIGN.md의 독립성과는 별개).
- Stitch 2026-03 "멀티 스크린" 업데이트 — **1차 미확인**. techtimes.com, heypash.com, tech-insider.org 등 2차 매체에서만 확인됨. Google 공식 원문을 찾으면 갱신 필요.

## 연결

- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — 이 카드가 속한 카테고리.
- [Screenshot 기반 UI 생성](/wiki/design-to-code/screenshot-based-ui-generation/) — bolt×Stitch 연동처럼 스크린샷과 텍스트 스펙을 함께 쓰는 하이브리드 패턴의 다른 축.
- [컴포넌트 레지스트리 기반 생성](/wiki/design-to-code/component-registry-first-generation/) — 둘 다 "텍스트/구조화 스펙을 에이전트에 넘긴다"는 점은 같지만, DESIGN.md는 스타일 토큰을, registry는 실제 컴포넌트 자체를 넘긴다는 차이가 있다.
