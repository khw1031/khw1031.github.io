---
title: 'AI SDK Generative UI: 도구 호출과 React 컴포넌트 연동'
pubDate: '2026-07-07'
description: 'LLM 도구 호출 결과를 React 컴포넌트에 연결하여 대화형 UI를 동적으로 생성하는 Vercel AI SDK 패턴'
summary: 'Generative UI는 LLM이 도구(tool)를 호출하고 그 결과를 React 컴포넌트로 렌더링하는 패턴이다. Vercel AI SDK의 useChat 훅과 streamText API를 결합해 구현하며, 도구 정의→API 라우팅→클라이언트 렌더링→확장의 단계로 구성된다.'
lang: ko
tags:
  - 'ai'
  - 'api'
  - 'frontend'
  - 'workflow'
canonical: 'https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces'
lintHash: '85088251c14d'
polishHash: '85088251c14d'
---

> 한 줄 명제: Generative UI는 LLM의 도구 호출 결과를 React 컴포넌트 매핑으로 전환하여 텍스트 너머의 동적 인터페이스를 생성하는 파이프라인이다.

## 큰 그림

```text
Generative UI: LLM 도구 호출 → React 렌더링 파이프라인
├── 도구 정의: zod 스키마로 입력 제약, execute로 실제 동작 구현
├── API 라우팅: streamText에 tools를 바인딩하고 UI 메시지 스트림 반환
├── 클라이언트 렌더링: message.parts에서 tool-${name} 타입 분기
├── 상태 관리: input-available → output-available → output-error 생명주기
└── 확장 패턴: 도구·컴포넌트 쌍 추가만으로 기능 확장 가능
```

## 핵심

Generative UI의 핵심은 ==LLM이 대화를 분석하여 도구 호출을 결정하고, 해당 도구가 반환한 데이터를 React 컴포넌트에 주입하는 연결 고리==에 있다. 모델은 프롬프트와 대화 맥락을 바탕으로 언제 도구를 호출할지 자체적으로 판단하며, 호출이 발생하면 도구가 실행되어 데이터를 반환하고 이 데이터가 React 컴포넌트의 props로 전달된다. 이 과정에서 Vercel AI SDK는 서버측 `streamText`와 클라이언트측 `useChat` 훅을 스트리밍 프로토콜로 연결하며, AI SDK 5.0에서는 도구 파트가 `tool-${toolName}` 타입으로 명시적으로 구분된다.

다음은 원문에서 제공하는 최소 동작 예제 전체 흐름이다.

**(1) 기본 클라이언트 채팅 컴포넌트**

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }
              return null;
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```
(원문 예제 — 파이프라인 미검증)

**(2) 기본 API 라우트**

```ts
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  UIMessage,
} from 'ai';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: "xai/grok-build-0.1",
    instructions: 'You are a friendly assistant!',
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(5),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
```
(원문 예제 — 파이프라인 미검증)

**(3) 도구 정의 — `ai/tools.ts`**

```ts
import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 75, location };
  },
});

export const tools = {
  displayWeather: weatherTool,
};
```
(원문 예제 — 파이프라인 미검증)

**(4) 도구를 바인딩한 API 라우트 업데이트**

```ts
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  UIMessage,
} from 'ai';
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: "xai/grok-build-0.1",
    instructions: 'You are a friendly assistant!',
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(5),
    tools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
```
(원문 예제 — 파이프라인 미검증)

**(5) 도구 결과를 React 컴포넌트로 렌더링하는 업데이트된 페이지**

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Weather } from '@/components/weather';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }
              if (part.type === 'tool-displayWeather') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading weather...</div>;
                  case 'output-available':
                    return (
                      <div key={index}>
                        <Weather {...part.output} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }
              return null;
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```
(원문 예제 — 파이프라인 미검증)

**(6) Weather React 컴포넌트 — `components/weather.tsx`**

```tsx
type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <div>
      <h2>Current Weather for {location}</h2>
      <p>Condition: {weather}</p>
      <p>Temperature: {temperature}°C</p>
    </div>
  );
};
```
(원문 예제 — 파이프라인 미검증)

**(7) 도구 확장 예시 — 주식 도구 정의**

```ts
// Add a new stock tool
export const stockTool = createTool({
  description: 'Get price for a stock',
  inputSchema: z.object({
    symbol: z.string().describe('The stock symbol to get the price for'),
  }),
  execute: async function ({ symbol }) {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { symbol, price: 100 };
  },
});

// Update the tools object
export const tools = {
  displayWeather: weatherTool,
  getStockPrice: stockTool,
};
```
(원문 예제 — 파이프라인 미검증)

**(8) 도구 확장 예시 — 다중 도구 렌더링 페이지**

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Weather } from '@/components/weather';
import { Stock } from '@/components/stock';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }
              if (part.type === 'tool-displayWeather') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading weather...</div>;
                  case 'output-available':
                    return (
                      <div key={index}>
                        <Weather {...part.output} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }
              if (part.type === 'tool-getStockPrice') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading stock price...</div>;
                  case 'output-available':
                    return (
                      <div key={index}>
                        <Stock {...part.output} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }
              return null;
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```
(원문 예제 — 파이프라인 미검증)

## 깊이

**[도구 정의]** ⭐ 도구 생성 시 `inputSchema`에 zod를 사용하여 모델이 전달할 인자의 타입과 설명을 정의한다. `execute` 함수는 비동기로 동작하며, 실제 프로덕션에서는 시뮬레이션 대신 외부 API 호출로 대체해야 한다. 도구 객체를 `tools`라는 키-값 맵으로 export하면 `streamText`의 `tools` 옵션에 바로 주입할 수 있다. 📎 zod 스키마 고급 패턴(union, discriminated union 등)은 도구 입력이 복잡해질 때 공식 문서에서 확인.

**[API 라우팅]** ⭐ `streamText` 호출 시 `tools` 옵션을 반드시 포함해야 모델이 도구 호출을 수행할 수 있다. `stopWhen: isStepCount(5)`는 무한 도구 호출 루프를 방지하는 안전장치로, 모델이 최대 5번의 스텝(도구 호출+응답 사이클)까지만 실행하도록 제한한다. `createUIMessageStreamResponse`와 `toUIMessageStream`은 서버 스트림을 클라이언트의 `useChat`이 이해할 수 있는 UIMessage 형식으로 변환한다. 📎 `stopWhen`의 다른 옵션(예: `finishReason`, 커스텀 조건)은 원문에 없음 — Vercel AI SDK 공식 문서에서 확인.

**[클라이언트 렌더링]** ⭐ AI SDK 5.0에서 도구 파트는 `tool-${toolName}` 패턴으로 타입이 지정된다(`tool-displayWeather`, `tool-getStockPrice` 등). 각 파트는 `state` 필드를 통해 생명주기를 가지며, `input-available`(도구 호출 직전/로딩 중), `output-available`(도구 실행 완료, `part.output`에 결과 데이터), `output-error`(실패 시 `part.errorText`에 오류 메시지) 세 가지 상태를 switch-case로 분기해야 한다. 원문의 페이지 구현은 `useChat`이 제공하는 `input`/`handleInputChange` 대신 `useState`로 수동 입력 상태를 관리하며 `sendMessage`로 메시지를 전송한다. 📎 `useChat` 훅의 전체 옵션과 반환값은 @ai-sdk/react API 레퍼런스에서 확인.

**[상태 관리]** ⭐ `input-available` 상태는 도구 실행 중 로딩 UI를 보여줄 수 있는 시점이며, `output-available`에서 `part.output`을 스프레드 구문(`{...part.output}`)으로 React 컴포넌트 props에 전달한다. 이 구조는 도구 반환 객체의 키와 컴포넌트 props 타입이 일치할 때 바로 매핑된다. 📎 도구 결과 데이터의 타입 안전성(TypeScript 자동 추론)은 원문에 없음 — 공식 문서에서 확인.

**[확장 패턴]** ⭐ 새로운 기능을 추가할 때는 도구 정의(`ai/tools.ts`에 `createTool` 추가), `tools` 객체에 키 추가, 대응하는 React 컴포넌트 생성, `page.tsx`의 `message.parts` 매핑에 `tool-${toolName}` 케이스 추가의 네 단계를 반복한다. 이 패턴은 도구와 컴포넌트가 1:1로 대응하는 느슨한 결합 구조이므로 기능 추가가 기존 코드에 영향을 주지 않는다. 📎 동적 도구 등록(runtime tool injection), 도구 간 의존성, 병렬 도구 호출은 원문에 없음 — 확장 시 공식 문서 참고.

## 비유

**비유: 도구 호출은 주문서, React 컴포넌트는 배달 상자**
LLM이 "샌프란시스코 날씨를 가져와"라고 판단하면 주문서(tool call)를 작성하고, API가 실행하여 데이터를 수집한 후 배달 상자(React 컴포넌트)에 담아 사용자에게 전달한다. 주문서에는 받을 사람의 이름과 주소(zod inputSchema)가 적혀 있고, 배달 상자는 주문서에 적힌 품목에 맞춰 포맷된다.

**깨지는 지점**: 이 비유는 도구 호출이 항상 순차적·단일이라고 가정하지만, 실제 LLM은 여러 도구를 병렬로 호출하거나 도구 호출 후 추가 추론을 거쳐 다른 도구를 연쇄 호출할 수 있다. 또한 "배달 상자"는 정적이지 않고 `input-available` → `output-available` → `output-error` 상태로 변화하는 동적 객체이므로, 단순한 일회성 배달과는 구조가 다르다.

## 곁가지

- 도구 호출 스트리밍 심화: 도구 실행 중간 결과를 스트리밍하여 실시간 피드백이 필요해질 때
- 동적 도구 등록 심화: 세션별·사용자별 도구 집합을 런타임에 변경해야 할 때
- TypeScript 타입 안전성 심화: `part.output`의 타입을 컴파일 타임에 보장하는 패턴이 필요해질 때
- 에러 복구 심화: 도구 실행 실패 시 재시도·폴백 UI 전략이 필요해질 때

## 연결

- **Tool Calling**: Generative UI의 기반이 되는 도구 호출 메커니즘 — 도구가 없으면 UI 생성 자체가 불가능하다.
- **React Server Components**: 도구 실행 결과를 서버 컴포넌트에서 렌더링하는 방식과 클라이언트 측 `useChat` 렌더링의 아키텍처 선택지가 교차한다.
- **Streaming Protocol**: `toUIMessageStream`과 `createUIMessageStreamResponse`가 사용하는 스트리밍 형식은 다른 AI SDK 기능(streamObject, streamUI)과 공유된다.

## 레퍼런스

- [Generative User Interfaces — Vercel AI SDK 공식 문서](https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces) (1차): Generative UI의 전체 구현 흐름을 도구 정의→API 라우팅→클라이언트 렌더링→확장 순으로 설명하는 기본 가이드. 버전 명시 없음.
- [Tools and Tool Calling — Vercel AI SDK 공식 문서](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling) (1차): 도구 호출의 핵심 개념과 API 레퍼런스. Generative UI의 기반이 되는 도구 시스템 문서. 버전 명시 없음.

---
## 인출 질문

1. Generative UI 파이프라인에서 모델이 도구 호출을 결정한 후 데이터가 React 컴포넌트에 전달되기까지 거치는 네 단계는 무엇인가?
2. AI SDK 5.0에서 `message.parts` 배열의 도구 파트 타입명은 어떤 패턴을 따르며, 각 파트가 가지는 세 가지 상태는 무엇인가?

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
