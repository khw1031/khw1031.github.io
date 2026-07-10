---
type: Reference
title: 코드·캔버스 자체를 디자인 소스로 쓰는 도구
pubDate: '2026-07-08T17:23:17+09:00'
description: 내보낸 디자인 파일이라는 중간 단계를 없애고, 실제 소스코드나 캔버스 데이터 모델 자체를 에이전트가 직접 읽고 고치게 하는 도구들
lang: ko
tags: ['design-to-code', 'ai-agent-workflow', 'canvas-sdk']
summary: "Onlook은 실제 Next.js/Tailwind 소스코드를 컨테이너에서 인덱싱해 브라우저 iframe과 코드 사이를 양방향 동기화하고, Subframe은 결정론적으로 React/Tailwind/Radix 코드를 생성해 락인을 피하며, tldraw는 캔버스의 구조화된 shape/JSON 데이터 모델을 에이전트가 API로 직접 조작하게 한다. 세 도구 모두 '내보낸 디자인 파일'이라는 중간 표현 자체를 없애고, 실제 코드 또는 캔버스 데이터 모델을 디자인의 원본으로 삼는다는 공통점이 있다."
lintHash: '7dfdb2186a39'
polishHash: '7dfdb2186a39'
---

> 한 줄 명제: Onlook·Subframe·tldraw는 내보낸 디자인 파일이라는 중간 단계 자체를 없애고, 실제 React 소스코드나 캔버스 데이터 모델을 에이전트가 직접 읽고 고치게 한다.

## 핵심

앞의 세 접근(스크린샷, 텍스트 스펙, 컴포넌트 레지스트리)은 모두 "디자인을 어떤 형태로 표현해 에이전트에 넘길 것인가"를 다룬다. ==이 카드가 묶는 도구들은 질문 자체를 바꾼다 — 애초에 별도 표현을 만들지 않고, 이미 존재하는 코드나 캔버스의 구조화된 데이터 모델을 원본으로 취급한다.==

**Onlook**은 오픈소스 "디자이너를 위한 Cursor"를 표방하며, 실제 Next.js + Tailwind 소스코드를 컨테이너에서 읽고 인덱싱한다. 편집은 브라우저 iframe에서 먼저 일어나고 곧바로 코드에 반영되는 양방향 동기화 구조다(CodeSandbox SDK 기반 컨테이너). 스스로를 "Bolt.new, Lovable, V0, Replit Agent, Figma Make, Webflow 등의 오픈소스 대안"으로 명시적으로 포지셔닝하며, 디자인 파일이라는 추상 계층이 아예 없다 — 코드베이스 자체가 디자인 파일이다.

**Subframe**은 "결정론적 코드 출력 — 디자인을 오해하는 LLM이 없다"는 문구로 스스로를 설명한다. 실제 React/Tailwind/Radix UI 컴포넌트 코드를 Cursor·Claude Code·Copilot에 MCP + Skills로 연결하고, "Subframe이 생성한 코드는 당신의 코드베이스에 그대로 산다 — 이것이 플랫폼 락인을 피한다"고 Figma류 락인의 대안임을 직접 언급한다.

**tldraw**의 "make real" 기능 자체는 캔버스 선택 영역의 이미지를 캡처해 비전 모델에 넘기는 방식이라 스크린샷 계열과 겹치지만, tldraw의 더 최근 포지셔닝은 "에이전트 네이티브 캔버스 SDK"다 — 공식 Agent 스타터 킷은 "에이전트가 에디터 API를 통해 캔버스를 직접 읽고 조작"하도록 지원해, 이미지 캡처가 아니라 tldraw 자체의 구조화된 shape/JSON 데이터 모델에 직접 접근하는 경로를 제공한다.

==세 도구는 결이 다르지만(코드베이스 동기화 / 결정론적 코드 생성 / 캔버스 데이터 모델 직접 조작) 공통적으로 "Figma 같은 범용 디자인 툴이 내보내는 중간 파일 포맷"을 아예 거치지 않는다는 점에서 이 카테고리의 가장 급진적인 갈래다.==

## 레퍼런스

- [Onlook (GitHub)](https://github.com/onlook-dev/onlook) — 1차(프로젝트 공식 저장소). "코드를 컨테이너에서 읽고 인덱싱", iframe↔코드 양방향 동기화 구조와 경쟁 도구 대비 포지셔닝을 README에서 확인. 최신 태그 릴리스 0.2.32(2025-07-17 기준 확인).
- [Subframe, 공식 문서 Overview](https://docs.subframe.com/overview) — 1차. "결정론적 코드 출력" 원칙과 MCP + Skills를 통한 Cursor/Claude Code/Copilot 연동 서술.
- [Subframe, 공식 사이트](https://www.subframe.com/) — 1차. "생성된 코드가 당신의 코드베이스에 그대로 산다 — 플랫폼 락인을 피한다"는 포지셔닝 문구.
- [tldraw, AI 문서](https://tldraw.dev/docs/ai) 및 [Agent 스타터 킷](https://tldraw.dev/starter-kits/agent) — 1차. 에디터 API를 통한 에이전트의 캔버스 직접 조작을 공식 문서화.
- [tldraw/make-real (GitHub)](https://github.com/tldraw/make-real) — 1차(프로젝트 공식 저장소). 캔버스 선택 영역을 이미지로 캡처해 비전 모델(원래 GPT-4V)에 넘겨 HTML을 생성하는 초기 구현 방식.

## 연결

- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — 이 카드가 속한 카테고리.
- [Screenshot 기반 UI 생성](/wiki/design-to-code/screenshot-based-ui-generation/) — tldraw의 "make real" 자체는 이 카드가 다루는 이미지 캡처 방식과 겹친다는 점에 유의.
- [컴포넌트 레지스트리 기반 생성](/wiki/design-to-code/component-registry-first-generation/) — registry가 "설치 가능한 표준 컴포넌트 집합"을 다룬다면, 이쪽은 "이미 존재하는 프로젝트의 실제 소스코드 전체"를 다룬다.
