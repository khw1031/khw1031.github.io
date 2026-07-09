---
title: 'LangChain Generative UI: json-render로 AI가 UI를 조합하는 패턴'
pubDate: '2026-07-07'
description: 'LangChain json-render를 사용한 Generative UI 패턴으로 AI가 컴포넌트 카탈로그를 조합하여 UI를 생성하는 방법'
summary: 'AI가 JSON spec을 통해 선언된 컴포넌트 카탈로그를 조합하여 UI를 생성하는 Generative UI 패턴의 전체 워크플로우를 다룬다. 카탈로그 정의부터 progressive rendering까지의 파이프라인을 이해할 수 있다.'
lang: ko
tags:
  - 'generative-ui'
  - 'json-render'
  - 'frontend'
  - 'ai'
  - 'streaming'
canonical: 'https://docs.langchain.com/oss/python/langchain/frontend/generative-ui'
lintHash: '239e3cea866d'
polishHash: '239e3cea866d'
---

> 한 줄 명제: Generative UI는 개발자가 정의한 컴포넌트 카탈로그 안에서 AI가 JSON spec을 조합해 예측 가능하고 안전한 UI를 생성하는 패턴이다.

## 큰 그림

```text
Generative UI는 AI가 JSON spec을 통해 컴포넌트 조합 UI를 생성하는 패턴이다
│
├─ 1. Catalog 정의 — AI가 사용 가능한 컴포넌트 선언 + Zod props 스키마
├─ 2. Registry 구성 — 컴포넌트 ID를 실제 렌더링 구현체에 매핑
├─ 3. Agent 연결 — useStream으로 spec 추출, tool_calls에서 JSON 수신
├─ 4. Progressive Rendering — 스트리밍 중 부분 spec 필터링 + loading 플래그 처리
└─ 5. Spec 포맷 — flat JSON 구조: root 키 + elements 맵, children ID 참조
```

## 핵심

Generative UI는 AI의 텍스트 응답 대신 UI 자체를 출력하는 패턴이다. 개발자는 먼저 카탈로그를 통해 AI가 사용할 수 있는 컴포넌트와 그 props 타입을 Zod 스키마로 정의한다. ==이 카탈로그가 가드레일 역할을 하여 AI는 선언된 컴포넌트 외에는 사용할 수 없으며, props도 스키마에 맞아야 한다.== 이후 AI에게 자연어로 원하는 UI를 설명하면, AI는 json-render의 spec 포맷에 맞는 JSON을 생성한다. 이 JSON은 컴포넌트 트리를 평탄화된 형태로 기술하며, `root` 키가 루트 요소의 ID를 가리키고 `elements` 맵이 모든 컴포넌트의 타입·props·자식 참조를 담는다.

렌더링 단계에서는 `defineRegistry`로 카탈로그의 각 컴포넌트를 실제 프레임워크(React, Vue, Svelte, Angular)의 렌더링 함수에 연결한다. 에이전트와의 통신에는 `useStream`을 설정하고, AI 메시지의 `tool_calls`에서 spec을 추출한다. 스트리밍 중에는 요소가 하나씩 도착하므로 `type`과 `props`가 모두 있는 완전한 요소만 필터링하고, `loading={true}`를 `Renderer`에 전달해 아직 도착하지 않은 자식을 묵시적으로 건너뛰게 한다. `Renderer`는 반드시 `JSONUIProvider` 내부에 위치해야 내부 컨텍스트(state, visibility, actions)에 접근할 수 있다.

카탈로그 정의 — 컴포넌트별 description은 AI가 언제 각 컴포넌트를 사용할지 판단하는 유일한 힌트이므로 구체적으로 작성해야 한다.

```
(원문 예제 — 파이프라인 미검증)
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

const catalog = defineCatalog(schema, {
  components: {
    Card: {
      description: "A card container with optional title and padding",
      props: z.object({
        title: z.string().optional(),
        padding: z.enum(["sm", "md", "lg"]).optional(),
      }),
    },
    Stack: {
      description: "Layout children vertically or horizontally with consistent spacing",
      props: z.object({
        direction: z.enum(["vertical", "horizontal"]).optional(),
        gap: z.enum(["sm", "md", "lg"]).optional(),
      }),
    },
    TextInput: {
      description: "A text input field with optional label and placeholder",
      props: z.object({
        label: z.string().optional(),
        placeholder: z.string().optional(),
        type: z.enum(["text", "email", "password", "number", "textarea"]).optional(),
      }),
    },
    Button: {
      description: "A clickable button with label and style variants",
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary", "ghost", "link"]).optional(),
        fullWidth: z.boolean().optional(),
      }),
    },
  },
  actions: {},
});
```

Registry 구성 — `defineRegistry`를 통해 타입 안전하게 연결하는 단계. 원문에 실행 예제 없음.

Agent 연결 — `useStream`으로 assistant ID를 설정하고 `tool_calls`에서 spec을 추출. 원문에 실행 예제 없음.

Progressive rendering — 스트리밍 중 부분 spec을 안전하게 필터링하고 점진적으로 렌더링.

```
(원문 예제 — 파이프라인 미검증)
/*
 * Filter the streamed spec to only include elements with valid type/props,
 * enabling progressive rendering as the AI response builds up. Passing
 * loading={true} to the Renderer tells it to skip missing children silently.
 */
const spec = (() => {
  if (!rawSpec?.root || !rawSpec?.elements) return null;
  const rootEl = rawSpec.elements[rawSpec.root];
  if (!rootEl?.type || rootEl?.props == null) return null;

  const safeElements = {};
  for (const [key, el] of Object.entries(rawSpec.elements)) {
    if (el?.type && el?.props != null) {
      safeElements[key] = el;
    }
  }
  return { root: rawSpec.root, elements: safeElements };
})();

return (
  <>
    {spec && (
      <JSONUIProvider registry={registry}>
        <Renderer spec={spec} registry={registry} loading={stream.isLoading} />
      </JSONUIProvider>
    )}
  </>
);
```

Spec 포맷 — 평탄화된 JSON으로 각 요소는 ID로 자식을 참조한다. 리프 요소는 빈 children 배열을 가진다.

```
(원문 예제 — 파이프라인 미검증)
{
  "root": "login-card",
  "elements": {
    "login-card": {
      "type": "Card",
      "props": { "title": "Login" },
      "children": ["login-stack"]
    },
    "login-stack": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": "md" },
      "children": ["email-input", "password-input", "submit-btn"]
    },
    "email-input": {
      "type": "TextInput",
      "props": { "label": "Email", "placeholder": "Enter your email", "type": "email" },
      "children": []
    },
    "password-input": {
      "type": "TextInput",
      "props": { "label": "Password", "placeholder": "Enter your password", "type": "password" },
      "children": []
    },
    "submit-btn": {
      "type": "Button",
      "props": { "label": "Sign In", "variant": "primary", "fullWidth": true },
      "children": []
    }
  }
}
```

## 깊이

- **[1. Catalog 정의]** Zod 스키마로 props를 정의할 때 `z.string()` 같은 required 필드는 AI가 반드시 값을 생성해야 하므로, 선택적 속성은 `optional()`로 감싸야 한다. description이 모호하면 AI가 컴포넌트를 잘못 조합하거나 누락한다. ⭐
- **[1. Catalog 정의]** `actions` 객체는 원문 예제에서 빈 `{}`로 두었으나, 이벤트 핸들러 바인딩이 필요할 때 확장 가능한 자리다. Ⓨ(offload: 실제 액션 정의가 필요해질 때 json-render 공식 문서 참조)
- **[2. Registry 구성]** `defineRegistry`는 카탈로그의 컴포넌트 키를 실제 렌더링 함수와 연결하는 타입 안전 브릿지다. React에서는 함수 컴포넌트, Vue에서는 defineComponent 등을 매핑한다. 📎
- **[3. Agent 연결]** `tool_calls`에서 추출한 JSON이 spec 포맷과 일치하는지 사전 검증이 권장된다. 에이전트의 structured output 설정이 제대로 되어 있지 않으면 유효하지 않은 JSON이 올 수 있다. ⭐
- **[4. Progressive Rendering]** `loading={true}`를 전달하면 `Renderer`가 아직 도착하지 않은 children을 silent skip한다. 이 플래그 없이 partial spec을 넘기면 렌더링 에러가 발생할 수 있다. ⭐
- **[4. Progressive Rendering]** 필터 로직은 `root` 요소 자체의 `type`과 `props`가 유효한지 먼저 확인한 뒤, `elements` 순회 시 둘 다 있는 요소만 수집한다. 이 순서를 바꾸면 루트 없는 트리가 전달될 수 있다. ⭐
- **[5. Spec 포맷]** spec은 트리가 아닌 flat 구조다. `children`은 실제 컴포넌트 객체가 아니라 `elements` 맵의 키(ID) 문자열 배열이다. 이 설계를 통해 스트리밍 중 순서 무관 추가가 가능하다. ⭐
- **[5. Spec 포맷]** 디자인 토큰은 CSS custom properties로 적용해 렌더된 컴포넌트가 light/dark 테마에 자동 적응하게 한다. 원문은 구체적 구현 예시를 제공하지 않는다. 📎

## 비유

카탈로그는 레고 부품 목록, AI는 설명서 없이 부품만으로 조립하는 어린이, Renderer는 완성된 조립품을 전시하는 받침대다. 카탈로그에 없는 부품은 AI가 절대 사용할 수 없고, props는 부품의 규격(홈 크기, 돌기 수)을 의미한다.

**깨지는 지점**: 실제 레고는 물리적 제약(중력, 마찰)으로만 조합이 제한되지만, 여기서는 Zod 스키마가 논리적 제약을 가한다. 또한 레고와 달리 AI는 description이라는 텍스트 힌트에 의존하므로, description이 부정확하면 전혀 다른 조립이 나온다. 비유는 "가용 부품의 제한" 개념까지만 유효하다.

## 곁가지

- json-render 심화: React 외 Vue/Svelte/Angular용 registry 정의가 필요해질 때
- Agent structured output 심화: `useStream`에서 tool_calls 파싱 안정화가 필요해질 때
- Zod 스키마 설계 심화: 중첩 props와 union type이 필요해질 때
- 테마 연동 심화: CSS custom properties 기반 다크모드 자동 적응이 필요해질 때

## 연결

- **Schema validation**: Zod를 컴포넌트 props에 적용하는 패턴은 일반 폼 검증과 동일한 원리지만, AI 생성물 대상이라 런타임 before-render 체크가 필수다.
- **Streaming UI**: progressive rendering은 서버 사이드 스트리밍과 유사하지만, 데이터가 아닌 컴포넌트 트리 구조 자체가 점진적으로 조립된다는 차이가 있다.
- **Component-driven design**: 디자인 시스템의 컴포넌트 카탈로그가 AI의 "사용 허용 목록"으로 전환된다.

## 레퍼런스

- [json-render 공식 사이트 — Generative UI 프레임워크의 컴포넌트 카탈로그 정의, spec 생성, 다중 프레임워크 렌더링을 제공](https://json-render.dev/) (1차). 기준 버전: 버전 명시 없음.
- [LangChain 공식 문서 — Generative UI: json-render를 LangChain 에이전트와 연동하여 UI를 생성하는 패턴 설명](https://docs.langchain.com/oss/python/langchain/frontend/generative-ui) (1차). 기준 버전: 버전 명시 없음.

---
## 인출 질문

1. Generative UI 파이프라인의 4단계를 순서대로 말하고, 각 단계에서 AI의 출력 형태와 개발자의 책임 범위를 구분하라.
2. 스트리밍 중 `loading={true}`를 `Renderer`에 전달하지 않으면 어떤 문제가 발생하는가? 원문의 필터 로직이 해결하는 구체적인 조건은 무엇인가?
3. Spec 포맷에서 `children`이 컴포넌트 객체가 아닌 ID 문자열 배열인 설계적 이점은 스트리밍 환경에서 왜 중요한가?

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
