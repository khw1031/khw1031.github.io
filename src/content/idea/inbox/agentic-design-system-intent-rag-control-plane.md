---
title: 디자이너의 의도를 에이전트의 실행 계약으로 바꾸는 Agentic Design System
pubDate: '2026-08-15T23:42:26+09:00'
noteId: DS-2608-005
lang: ko
description: 레퍼런스와 제품·디자인 철학을 작업별 맥락으로 제공하고 구현 검증과 결과 평가까지 잇는 에이전트용 디자인 운영 환경 구상.
summary: 디자이너가 모은 시각 자료와 그에 대한 해석을 구조화하고, 작업별 RAG로 필요한 의도만 에이전트에 전달하며, 승인된 결과를 DESIGN.md·토큰·컴포넌트·검증 기준으로 승격하는 Agentic Design System 아이디어.
tags: [idea-inbox, design-system, design-intent, rag, agents, mcp, evaluation]
lintHash: 'ecf0d1223775'
---

## 아이디어

디자이너가 모은 레퍼런스와 제품 철학, 디자이너의 철학을 에이전트가 실제 작업에 사용할 수 있는 디자인
맥락으로 바꾸는 **Agentic Design System**을 만든다. 디자이너는 이미지나 Figma 화면을 저장하는 데서 끝내지
않고, 무엇을 참고할지, 무엇은 피할지, 어느 과업에 적용할지, 제품 철학과 어떻게 연결되는지를 함께 기록한다.
제품은 이 자료를 제품 원칙, 디자인 원칙, 실행 계약, 금지 조건으로 나누어 보존한다.

RAG는 이 시스템의 목적이 아니라 전달 계층이다. 에이전트가 특정 화면이나 상태를 작업할 때 관련 레퍼런스,
디자이너의 주석, 승인된 컴포넌트, 과거의 채택·기각 사례만 검색해 작은 context pack으로 제공한다. 이 맥락은
Google 형식의 DESIGN.md, 디자인 토큰, 컴포넌트 사용 규칙, MCP 응답이나 Agent Skill 같은 실행 가능한 형태로
내보낼 수 있다. 이후에는 문서 계약의 유효성뿐 아니라 실제 코드가 토큰과 컴포넌트를 사용했는지 검증하고,
렌더 결과를 사람이 비교해 승인된 판단을 다음 규칙과 베이스라인으로 승격한다.

핵심 제품 가설은 “레퍼런스를 검색하는 도구”보다 **디자이너의 암묵적인 판단을 출처와 적용 범위를 가진 실행
계약으로 바꾸고, 결과를 통해 계속 갱신하는 운영 환경**에 가치가 있다는 것이다. Figma·Storybook 같은 기존
도구를 대체하기보다, 레퍼런스와 철학에서 에이전트 맥락, 실제 구현, 평가와 환류까지 연결하는 control plane을
지향한다. 기존 [moodbox 아이디어](/idea/inbox/moodbox-design-selection-loop-mcp-skill-cli/)가 후보 선별과 취향
축적에 집중한다면, 이 아이디어는 그 기능을 포함할 수도 있는 상위 디자인 의도 관리 계층에 가깝다.

## 더 해볼 질문

- 첫 사용자는 누구인가. 성숙한 디자인 시스템 조직보다, 여러 coding agent를 쓰지만 디자인 기준을 안정적으로
  전달하지 못하는 작은 제품 팀이나 디자인 리드가 더 선명한 시작점인가.
- 제품 철학과 디자이너 개인의 철학이 충돌하거나 디자이너가 여러 명일 때, 작성자·적용 범위·우선순위·예외와
  최종 승인 권한을 어떤 데이터 구조로 표현할 것인가.
- 이미지 유사도만으로는 의도를 찾기 어렵다. 레퍼런스의 특정 영역, 참고할 점과 피할 점, 적용 과업을 함께
  검색하는 multimodal RAG가 실제로 작업에 맞는 맥락을 안정적으로 고를 수 있는가.
- “실제 적용”을 어떤 공통 검사로 증명할 것인가. 토큰 동기화, 임의 스타일 값, 실제 컴포넌트와 variant 사용을
  여러 프론트엔드 스택에서 검사하려면 어디까지 공통 규약으로 두고 어디부터 adapter로 나눠야 하는가.
- 사람의 평가에서 나온 판단을 언제 DESIGN.md·토큰·컴포넌트·시각 회귀 베이스라인으로 승격하고, 오래되거나
  과하게 일반화된 규칙을 언제 강등할 것인가.
- moodbox를 이 제품의 후보 비교 기능으로 흡수할지, 먼저 독립 도구로 검증할지. 범위를 넓히기 전에 두 아이디어의
  공통 핵심이 선별 데이터인지 디자인 의도 운영인지 결정해야 한다.

## 레퍼런스·서비스

확인일: 2026-08-15. 빠른 스캔이며 사업성 분석이나 전수 경쟁 조사는 하지 않았다.

- [moodbox 아이디어 (본 저장소)](/idea/inbox/moodbox-design-selection-loop-mcp-skill-cli/) — 후보 생성·쌍대 비교·
  평가 언어 축적을 프로젝트 로컬 상태로 만드는 인접 아이디어. Agentic Design System에 흡수할지 독립적으로
  검증할지 결정해야 한다.
- [DESIGN.md Philosophy (Google Labs, GitHub)](https://github.com/google-labs-code/design.md/blob/main/PHILOSOPHY.md)
  — 1차. 토큰보다 의도를 설명하는 산문과 구체적인 레퍼런스를 중시한다. 디자이너의 해석을 구조화하려는 이
  아이디어와 맞닿지만, 지속적인 검색·구현 검증·평가 환류까지 제공하는 제품은 아니다.
- [DESIGN.md (Google Labs, GitHub)](https://github.com/google-labs-code/design.md) — 1차. 에이전트가 읽는 디자인
  맥락 형식과 `lint`·`diff`·`export`를 제공한다. 이 제품이 지원할 출력 형식이자 문서 계약 검증 계층의 후보다.
- [Figma MCP Server 소개 (Figma Developer Docs)](https://developers.figma.com/docs/figma-mcp-server/) — 1차.
  Figma의 변수·컴포넌트·레이아웃 정보를 에이전트에 제공하고 canvas 쓰기도 지원한다. 단순한 Figma 맥락 전달만으로는
  독립 제품의 차별점이 되기 어렵다는 기준선이다.
- [Code Connect 연동 (Figma Developer Docs)](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/)
  — 1차. Figma 컴포넌트를 실제 코드의 import와 사용 예시에 연결한다. 구현 자산 매핑은 새로 만들기보다 연동할
  수 있는 기존 계층이다.
- [Visual tests (Storybook Docs)](https://storybook.js.org/docs/8/writing-tests/visual-testing) ·
  [Accessibility tests (Storybook Docs)](https://storybook.js.org/docs/writing-tests/accessibility-testing) — 1차.
  렌더된 컴포넌트의 시각 회귀와 접근성 검사를 제공한다. Agentic Design System은 검사 엔진을 다시 만들기보다
  어떤 기준을 왜 승인하고 다음 계약으로 승격하는지 관리하는 쪽에 집중할 수 있다.
