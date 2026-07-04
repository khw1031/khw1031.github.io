---
title: 한샘 인테리어 플래너
pubDate: '2026-07-04'
description: "상담·계약·시공 완료까지 흩어진 고객 진행 현황을 Flutter 앱 내장 React 웹앱으로 일원화한 프로젝트의 개발 기록 (작성 예정)"
draft: true
tags: [react, flutter, webview, ai]
summary: "상담·계약·시공 완료까지 흩어진 고객 진행 현황을 Flutter 앱 내장 React 웹앱으로 일원화한 프로젝트 — 3인 팀·17개 페이지, 5단계 코딩 에이전트 워크플로우로 예상 2~3개월을 21일로 단축한 기록. (작성 예정)"
lang: ko
---

# TL;DR

작성 예정 — 한샘 인테리어 플래너 프로젝트의 상세 기록을 준비 중입니다.

- 상담·계약·시공 완료까지 흩어진 고객 진행 현황을 앱 내 단일 웹뷰로 일원화
- 플러터 네이티브 안에서 동작하는 풀 웹앱을 3인 팀으로 개발 및 런칭 (총 17개 페이지)
- 요구사항·설계·태스크·구현·리뷰 5단계 코딩 에이전트 워크플로우 + Figma CLI + AI Rules 하네스로 일관된 품질과 기간 단축 달성
- 기존 예상 2~3개월 → 21일(약 62% 단축), 83개 태스크 처리, 테스트 파일 153개

## 기술 스택 / 아키텍처

_작성 예정 — 아래는 골자._

- **프레임워크**: React 19 (React Compiler) · TypeScript · Vite
- **상태/데이터**: TanStack Query · Zustand · Zod
- **UI**: Tailwind CSS 4 · Radix UI · framer-motion · lottie
- **플랫폼**: Flutter 앱 내장 웹뷰 — Flutter ↔ React 브리지
- **구조**: Feature-Sliced (`features` / `shared` / `pages`), 17개 페이지
- **품질/인프라**: Vitest 기반 TDD (테스트 파일 153개) · MSW 목킹 · Sentry 모니터링 · dev/qa/stg/prod 다환경 CI/CD

## 코딩 에이전트 워크플로우

_작성 예정_ — Requirements → Design → Task → Implementation → Review 5단계 하네스를
이 프로젝트에 적용한 방식. (하네스 자체는 [별도 글](/posts/feature-workflow/)에서 다룸)

## 링크

- [App Store](https://apps.apple.com/kr/app/%ED%95%9C%EC%83%98-%EC%9D%B8%ED%85%8C%EB%A6%AC%EC%96%B4-%ED%94%8C%EB%9E%98%EB%84%88/id6760631818)
- [Google Play](https://play.google.com/store/apps/details?id=com.hanssem.consultation)

_상세 내용은 추후 업데이트 예정입니다._
