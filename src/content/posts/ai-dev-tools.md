---
title: IT AI 개발 도구 생태계 구축
pubDate: '2026-07-04'
description: "Frontend AI Library·Swagger MCP·Figma MCP를 축으로 개인기에 머물던 AI 활용을 팀 단위 배포·재사용 도구 생태계로 전환한 구축 기록"
draft: true
tags: [ai, developer-tools, mcp, productivity]
summary: "개별 개발자에게 흩어진 AI 활용을 팀 단위로 배포·재사용 가능한 도구 생태계로 전환한 기록 — Frontend AI Library, Swagger MCP, Figma MCP·AI-Ready 가이드 세 축과 CI/CD·semver 릴리즈 운영. (작성 예정)"
lang: ko
---

# TL;DR

- 개별 개발자의 프롬프트·도구 사용에 흩어져 있던 AI 활용을, **팀 단위로 배포·재사용 가능한 도구 생태계**로 전환했다.
- 축은 세 가지 — **Frontend AI Library**(Skills·Agents·Rules 관리·배포), **Swagger MCP**(API → 코드 자동화), **Figma MCP·AI-Ready 가이드**(디자인 → 코드 정밀도).
- Claude Code·Cursor·GitHub Copilot·Antigravity 4종 에이전트에서 동일하게 설치·사용, Bitbucket CI/CD·semver로 릴리즈 운영.

# 문제

AI 코딩이 개인기에 머물면 팀 전체로 확산되지 않는다. 같은 스킬·규칙·도구를 사람마다 다시 만들고, 설치·버전·에이전트 호환이 제각각이라 재사용이 어려웠다. "도구를 만드는 것"을 넘어 **배포·표준화·버전 관리**가 필요했다.

# 구성 요소

## Frontend AI Library

_작성 예정_ — Skills/Agents/Rules 라이브러리, META.md 기반 메타데이터, 설치 CLI(`--list/--all/--update/--agent`), Vite + 리액트 문서 웹 UI(검색·필터·상세·설치 명령 복사·Copy Prompt), 멀티 에이전트 지원.

## Swagger MCP

_작성 예정_ — 내부 API 문서를 LLM이 자연어로 조회(`list_services → list_apis → get_api_detail → get_components`), Swagger → Zod 변환, drill-down으로 컨텍스트 토큰 오버플로우 방지. 오픈소스([@hynu/swagger-mcp](https://github.com/khw1031/swagger-mcp)) 공개. 상세: [Swagger MCP 글](/posts/20251218/).

## Figma MCP · AI-Ready 가이드

_작성 예정_ — Figma Context MCP 테스트 프레임워크, AI-Ready 디자인 가이드(Layer = DOM, 100% Auto Layout, 시맨틱 네이밍), Local/Global AI Rules. 99% 디자인 충실도·구현 시간 3배 단축 패턴 문서화.

# 배포 체계

_작성 예정_ — Bitbucket CI/CD 파이프라인, semver 기반 버전 관리, `npx` 한 줄 설치로 사내 전 팀 배포. v2.18.0까지 운영, 37개 도구·규칙 배포.

# 결과 / 트레이드오프

_작성 예정_ — 개인기 → 팀 자산 전환, 재사용성/일관성 향상, 유지보수·버전 관리 오버헤드 등.
