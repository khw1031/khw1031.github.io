---
type: Category
title: Design-to-Code Agent Workflows
pubDate: '2026-07-08'
description: AI 에이전트가 Figma 같은 범용 디자인 툴의 노드 트리를 파싱하지 않고 디자인 의도를 코드로 옮기는 방식들을 정리한 레퍼런스 모음
lang: ko
tags: ['design-to-code', 'ai-agent-workflow', 'ui-generation', 'mcp']
summary: "Figma REST API/노드 트리를 그대로 LLM 컨텍스트에 넣으면 코드 생성에 무관한 필드(절대좌표, 내부 ID, 벡터 패스 등)가 많아 컨텍스트 오염과 토큰 낭비가 생긴다는 문제의식에서 출발해, 2025~2026년 AI 에이전트 워크플로가 실제로 Figma를 배제하고 쓰는 다섯 갈래 대안 — 소스 무관 스크린샷 생성, 이식 가능한 텍스트 디자인 스펙, 컴포넌트 레지스트리 기반 생성, 코드/캔버스 자체를 디자인 소스로 쓰는 도구, 코드 기반 디자인 시스템 관리 관행 — 을 1차 출처 중심으로 정리한 카테고리."
lintHash: 'e79809f113b1'
---

> 한 줄 명제: 디자인을 코드로 옮기는 데 Figma의 범용 노드 트리를 그대로 파싱할 필요는 없다 — 2026년 현재 에이전트 워크플로는 비전 모델·이식형 텍스트 스펙·컴포넌트 레지스트리·코드-자체-소스·코드 기반 관리 관행이라는 다섯 갈래로 Figma를 우회한다.

## 큰 그림

```text
design-to-code (Figma 노드 트리 우회)
├─ screenshot-based ui generation   — 스크린샷/스케치를 비전 모델에 바로 투입, 소스 무관
├─ design token dsl handoff         — 이식 가능한 텍스트 디자인 스펙 (예: Google Stitch의 DESIGN.md)
├─ component registry-first gen     — 열린 시각 해석 대신 정해진 컴포넌트 집합에서 조합 (shadcn/v0 registry)
├─ code as design source            — 내보낸 디자인 파일 없이 실제 소스코드·캔버스 데이터 모델 자체가 디자인
└─ code-based design system mgmt    — 토큰·컴포넌트·문서 자체가 코드로 관리되는 일반 산업 관행 (Astryx 등)
```

## 핵심

AI 코딩 에이전트가 디자인을 코드로 옮길 때 흔한 경로 하나는 Figma REST API나 MCP 서버로 파일의 노드 트리를 통째로 가져와 LLM에 넣는 것이다. 문제는 그 노드 트리가 벡터 편집기 내부 표현이라는 데 있다 — 절대좌표, 내부 ID, 벡터 패스 데이터처럼 코드 생성과 무관한 필드가 대부분을 차지해, 큰 프레임일수록 컨텍스트가 오염되고 토큰 예산이 빠르게 소진된다. 이 카테고리는 그 문제 자체가 아니라, **Figma를 파이프라인에서 아예 빼고** 대신 무엇을 쓰는지를 조사 범위로 삼는다.

조사 결과 2025~2026년 사이 실제로 자리 잡은 대안은 다섯 갈래로 수렴한다. 첫째, v0·bolt.new·Lovable·Anima처럼 스크린샷 한 장(어디서 왔든 상관없이)을 비전 모델에 바로 넣어 코드를 뽑는 **소스 무관 스크린샷 생성** — 구조화된 파싱이 아예 없다. 둘째, Google Stitch의 `DESIGN.md`처럼 디자인 시스템을 바이너리 파일이 아니라 사람도 LLM도 읽는 평범한 텍스트로 표현해 여러 에이전트 사이에 이식하는 **텍스트 디자인 스펙 핸드오프**. 셋째, shadcn·v0의 registry처럼 열린 시각 디자인을 해석시키는 대신 정해진 실제 컴포넌트 집합에서 고르고 조합하게 해 "디자인 의도 역공학" 문제 자체를 없애는 **컴포넌트 레지스트리 기반 생성**. 넷째, Onlook·Subframe·tldraw처럼 내보낸 디자인 파일이라는 중간 단계를 통째로 없애고 실제 소스코드나 캔버스 데이터 모델을 에이전트가 직접 읽고 고치게 하는 **코드/캔버스를 디자인 소스로 삼는 접근**. 다섯째, Style Dictionary·Storybook·bit.dev·Astryx처럼 AI 에이전트 워크플로 이전부터 이미 산업이 써 온, 토큰·컴포넌트·문서 자체를 코드로 관리하는 **코드 기반 디자인 시스템 관리** 관행이다.

다섯 갈래 모두 공통점이 있다: LLM이 읽는 표현이 Figma의 범용 벡터-씬 그래프가 아니라, 애초에 코드이거나 코드에 가까운(텍스트 스펙, 컴포넌트 레지스트리, 실제 소스) 형태라는 것이다.

## 곁가지

- **Penpot MCP** — 공식 MCP 서버는 확인되나(`penpot.app/ai/mcp-server`), LLM에 실제로 전달되는 JSON 스키마 자체는 1차 출처로 확인하지 못했다. 스키마 레벨 확인이 필요해지면 GitHub 저장소의 MCP 툴 정의를 직접 읽고 카드로 승격.
- **Excalidraw wireframe-to-code / MCP** — 존재 자체는 2차(aggregator) 출처로만 확인됨. Excalidraw/Excalidraw+ 공식 블로그·체인지로그에서 1차 확인이 되면 카드로 승격.
- **MCP Apps / AG-UI 프로토콜** — 에이전트가 상호작용형 UI를 호스트에 렌더링하는 프로토콜(각각 2026-01-26 공식 발표, AG-UI는 CopilotKit 기원)로, "디자인을 코드로 옮기는" 문제라기보다 "에이전트가 UI를 어떻게 기술해 주고받는가"에 가까운 인접 주제. 이 카테고리가 커지면 별도 카테고리(agent-ui-protocol 등)로 분리 후보.
- **Motiff의 Figma 우선 피벗** — 원래 non-Figma 경쟁자였다가 2025년 Figma 중심 모델로 전환하고 2026-06-23 서비스 종료 예정이라는 2차 보도가 있음(1차 미확인). "Figma 우회가 항상 성공하지는 않는다"는 반례로만 참고.

## 연결

- [Screenshot 기반 UI 생성](/wiki/design-to-code/screenshot-based-ui-generation/) · [이식 가능한 텍스트 디자인 스펙](/wiki/design-to-code/design-token-dsl-handoff/) · [컴포넌트 레지스트리 기반 생성](/wiki/design-to-code/component-registry-first-generation/) · [코드/캔버스를 디자인 소스로 쓰는 도구](/wiki/design-to-code/code-as-design-source/) · [코드 기반 디자인 시스템 관리 도구](/wiki/design-to-code/code-based-design-system-tools/) — 이 카테고리의 다섯 갈래 각론.

## 레퍼런스

- [Google, Stitch — AI-powered UI design](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/) (2025-05-20) — 1차. 프롬프트/이미지에서 UI를 생성하는 Stitch 공식 발표.
- [Vercel, AI-powered prototyping with design systems](https://vercel.com/blog/ai-powered-prototyping-with-design-systems) (2025-08-22) — 1차. "시각 도구에서 디자인 의도를 역공학하는 대신" 컴포넌트 레지스트리로 생성한다는, 이 카테고리 전체의 문제의식을 가장 직접적으로 서술한 벤더 공식 글.
