---
title: 'Cloudflare Agentic Inbox — AI 에이전트 내장 self-hosted 이메일 클라이언트 아키텍처'
pubDate: '2026-07-06'
description: 'Cloudflare Workers, Durable Objects, Workers AI를 조합해 AI 에이전트가 내장된 self-hosted 이메일 시스템을 구축하는 레퍼런스 아키텍처와 설정 흐름'
summary: 'Cloudflare 인프라 위에서 Email Routing, Durable Object 격리, Workers AI 에이전트를 조합하여 AI가 이메일을 읽고 답장 초안을 작성하는 self-hosted 이메일 클라이언트의 전체 아키텍처와 배포 절차를 다룬다.'
lang: ko
tags:
  - 'ai'
  - 'mcp'
  - 'open-source'
  - 'workflow'
  - 'llm'
canonical: 'https://github.com/cloudflare/agentic-inbox'
lintHash: 'ac69038dbd5c'
polishHash: 'ac69038dbd5c'
---

> 한 줄 명제: Cloudflare의 서버리스 인프라(Email Routing, Durable Objects, R2, Workers AI)를 조합하면, AI 에이전트가 메일함을 읽고 답장 초안을 작성하는 self-hosted 이메일 클라이언트를 단일 Workers 배포로 운영할 수 있다.

## 큰 그림

```text
Agentic Inbox: Cloudflare Workers 위에서 AI 에이전트가 메일함을 운영하는 self-hosted 이메일 클라이언트
│
├─ 1. 인프라 구성요소 ─── Email Routing · Durable Objects · R2 · Workers AI · Access
├─ 2. 아키텍처 ────────── Browser → Hono Worker → MailboxDO / EmailAgent DO 분리 구조
├─ 3. 배포 및 설정 ────── Deploy → Access 설정 → Email Routing → Email Service → 사서함 생성
├─ 4. AI 에이전트 ─────── Agents SDK(AIChatAgent) · 9개 이메일 도구 · auto-draft · MCP 서버
├─ 5. 보안 모델 ────────── Cloudflare Access JWT 단일 trust boundary · 사서함 단위 권한 없음
└─ 6. 스택 ─────────────── React 19 · Hono · Durable Objects(SQLite) · @cf/moonshotai/kimi-k2.5
```

## 핵심

Agentic Inbox는 Cloudflare Workers 위에서 동작하는 완전한 self-hosted 이메일 클라이언트로, 수신 이메일은 Cloudflare Email Routing으로 받고, 각 사서함은 독립 Durable Object 안에서 SQLite 데이터베이스로 격리되며, 첨부파일은 R2에 저장된다. 이 구조의 핵심 가치는 ==메일함마다 상태와 저장소가 분리되어 있어 한 사서함의 장애가 다른 사서함에 전파되지 않는다==는 점이다.

내장 AI 에이전트는 Cloudflare Agents SDK의 `AIChatAgent`를 기반으로 하며, Workers AI의 `@cf/moonshotai/kimi-k2.5` 모델을 사용하여 9개의 이메일 도구(읽기, 검색, 초안 작성, 발송 등)를 호출할 수 있다. 에이전트는 새 이메일이 도착하면 자동으로 초안 답장을 생성하지만, 발송 전 반드시 사용자의 명시적 확인을 요구한다. 또한 사서함마다 커스텀 system prompt를 설정할 수 있고, 채팅 기록이 영속적으로 유지된다.

보안은 Cloudflare Access JWT validation으로 이루어지며, 프로덕션 환경에서는 Access 설정이 강제된다. 중요한 설계 결정은 사서함 단위 권한이 없다는 것인데, Access 정책을 통과한 사용자는 앱의 모든 사서함과 `/mcp` 엔드포인트에 접근할 수 있다. 즉 Cloudflare Access 정책이 유일한 trust boundary이다.

(원문 예제 — 파이프라인 미검증)
```
npm install
npm run dev
```

(원문 예제 — 파이프라인 미검증)
```
wrangler r2 bucket create agentic-inbox
```

(원문 예제 — 파이프라인 미검증)
```
npm run deploy
```

(원문 예제 — 파이프라인 미검증)
```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser    │────>│  Hono Worker     │────>│  MailboxDO      │
│  React SPA   │     │  (API + SSR)     │     │  (SQLite + R2)  │
│  Agent Panel │     │                  │     └─────────────────┘
└──────┬───────┘     │  /agents/* ──────┼────>┌─────────────────┐
       │             │                  │     │  EmailAgent DO  │
       │ WebSocket   │                  │     │  (AIChatAgent)  │
       └─────────────┤                  │     │  9 email tools  │
                     │                  │────>│  Workers AI     │
                     └──────────────────┘     └─────────────────┘
```

## 깊이

**[1. 인프라 구성요소]** ⭐
Cloudflare의 네 가지 서비스가 각기 다른 역할을 담당한다. Email Routing은 도메인으로 들어오는 이메일을 Worker로 포워딩하는 수신 게이트웨이이고, Durable Objects는 사서함마다 독립적인 상태 저장소(SQLite 내장)를 제공하며, R2는 첨부파일 같은 바이너리 데이터를 저장하는 object storage이고, Workers AI는 에이전트가 호출하는 LLM 추론 엔드포인트이다. 이 중 하나라도 빠지면 시스템이 동작하지 않으므로 배포 전 모든 서비스의 활성화를 확인해야 한다.

**[3. 배포 및 설정]** 📎
배포는 5단계 순서를 반드시 따라야 한다. (1) Deploy 버튼으로 Workers 배포 → (2) Cloudflare Access one-click 설정 후 `POLICY_AUD`, `TEAM_DOMAIN`을 Worker secrets로 등록 → (3) 도메인의 Email Routing에서 catch-all 규칙을 해당 Worker로 설정 → (4) `send_email` 바인딩으로 Email Service 활성화 → (5) 배포된 앱에서 사서함 생성. Access 설정을 건너뛰면 `Cloudflare Access must be configured in production` 오류가 발생하며, `POLICY_AUD`/`TEAM_DOMAIN` 값이 틀리면 `Invalid or expired Access token` 오류가 난다.

**[4. AI 에이전트]** ⭐
에이전트는 `AIChatAgent` 클래스를 상속한 Durable Object로, Hono Worker의 `/agents/*` 경로로 브라우저와 WebSocket 연결을 맺는다. 9개의 이메일 도구를 통해 메일함 읽기, 대화 검색, 답장 초안 작성, 발송 등을 수행하며, 도구 호출 과정이 UI에 투명하게 노출된다. auto-draft 기능은 새 이메일 수신 시 자동으로 초안을 생성하지만, 발송은 항상 인간 확인을 요구한다. `/mcp` 엔드포인트를 통해 Claude Code, Cursor 같은 외부 AI 도구가 MCP 프로토콜로 사서함을 조작할 수 있으며, 이때 `mailboxId` 파라미터로 대상 사서함을 지정한다.

**[5. 보안 모델]** ⭐
이 프로젝트의 보안은 "단일 trust boundary" 설계이다. Cloudflare Access 정책을 통과한 모든 사용자는 모든 사서함에 접근 가능하며, 사서함별 세분화 권한은 존재하지 않는다. 이는 소규모 팀이나 개인 사용에는 적합하지만, 다중 테넌트 환경에서는 추가 권한 계층이 필요할 수 있다. MCP 서버도 동일한 Access 정책 아래 있으므로, 외부 AI 도구 연동 시 이 점을 반드시 인지해야 한다.

**[6. 스택]** 📎
프론트엔드는 React 19, React Router v7, Tailwind CSS, Zustand(상태 관리), TipTap(리치 텍스트 에디터), `@cloudflare/kumo`를 사용한다. 백엔드는 Hono 프레임워크 위에서 Workers + Durable Objects로 구성되며, AI 계층은 Agents SDK + AI SDK v6 + Workers AI를 조합한다. 마크다운 렌더링은 `react-markdown` + `remark-gfm`을 사용한다.

## 비유

**비유**: Durable Object 사서함은 "개인 금고가 딸린 우체국 사서함"이다. 각 사서함(메일 주소)마다 전용 Durable Object가 할당되어 자체 SQLite 데이터베이스(금고)와 R2 연결(별도 보관함)을 가지며, 다른 사서함의 상태에 간섭하지 않는다.

**깨지는 지점**: 실제 우체국 사서함은 물리적으로 분리되어 있지만, Durable Objects는 같은 Workers 런타임 위에서 논리적으로 격리될 뿐이다. 동일한 Cloudflare 계정과 Workers 배포를 공유하므로, Worker 수준의 오류(배포 실패, 메모리 한도 초과 등)는 모든 사서함에 동시에 영향을 미친다. 또한 "금고"는 Cloudflare의 인프라에 존재하므로, 데이터 주권이 Cloudflare에 위임된다.

## 곁가지

- Durable Objects SQLite 심화: Durable Object 내부에서 SQLite를 활용한 상태 관리 패턴이 필요해질 때
- Cloudflare Agents SDK 심화: `AIChatAgent` 커스터마이징과 도구 정의 방식이 필요해질 때
- MCP 프로토콜 심화: 외부 AI 도구(Claude Code, Cursor 등)와 `/mcp` 엔드포인트 연동 방식이 필요해질 때
- Cloudflare Email Routing 심화: catch-all 규칙 이상의 세분화된 라우팅 규칙 설계가 필요해질 때

## 연결

- **Cloudflare Durable Objects** — 사서함 격리의 핵심 메커니즘으로, 상태가 있는 서버리스 컴퓨팅 패턴의 대표 사례
- **MCP (Model Context Protocol)** — `/mcp` 엔드포인트를 통해 외부 AI 도구가 이메일 시스템을 조작할 수 있게 하는 표준 프로토콜
- **Cloudflare Agents SDK** — `AIChatAgent`와 도구 프레임워크를 제공하는 SDK로, 에이전트 설계의 기반
- **Hono** — 경량 웹 프레임워크로, Workers 위에서 API와 SSR을 동시에 처리하는 라우팅 계층

## 레퍼런스

- https://github.com/cloudflare/agentic-inbox — Agentic Inbox 소스 코드 및 README, 전체 아키텍처와 설정 가이드 (1차). 버전 명시 없음.
- https://blog.cloudflare.com/email-for-agents/ — Cloudflare Email Service와 Agents SDK, MCP, Wrangler CLI 통합 설명 블로그 포스트 (1차).
- https://developers.cloudflare.com/agents/ — Cloudflare Agents SDK 공식 문서, `AIChatAgent` API 레퍼런스 (1차).
- https://developers.cloudflare.com/durable-objects/ — Durable Objects 공식 문서, SQLite 내장 및 상태 관리 패턴 (1차).
- https://developers.cloudflare.com/email-routing/ — Email Routing 설정 및 catch-all 규칙 구성 가이드 (1차).
- https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/ — Email Service `send_email` 바인딩 설정 방법 (1차).
- https://developers.cloudflare.com/r2/ — R2 object storage 공식 문서 (1차).
- https://developers.cloudflare.com/workers-ai/ — Workers AI 모델 카탈로그 및 추론 API (1차).
- https://developers.cloudflare.com/changelog/post/2025-10-03-one-click-access-for-workers/ — Workers one-click Cloudflare Access 설정 방법, `POLICY_AUD`/`TEAM_DOMAIN` 값 확인 (1차).
- https://github.com/cloudflare/agentic-inbox/issues/4#issuecomment-4269118513 — 스크린샷 포함 단계별 설정 가이드 커뮤니티 코멘트 (2차).

---
## 인출 질문

1. **맵 재생**: Agentic Inbox의 아키텍처에서 Browser에서 시작한 요청이 AI 에이전트에 도달하기까지 거치는 구성요소와 프로토콜을 순서대로 설명하라. 또한 사서함 격리에 사용되는 Cloudflare 서비스와 그 내부 저장소를 각각 말하라.
2. **전이 질문**: Agentic Inbox의 "단일 trust boundary" 보안 모델이 적합하지 않은 시나리오를 하나 들고, 어떤 추가 계층이 필요한지 설명하라.
3. **전이 질문**: 이 아키텍처에서 AI 에이전트가 `/mcp` 엔드포인트를 통해 외부 도구와 상호작용할 때 발생할 수 있는 보안 위험과 이를 완화하기 위한 설계 변경을 제안하라.

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
