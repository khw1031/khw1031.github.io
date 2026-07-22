---
title: 'Turborepo·Nx·경량 모노레포 관리 방식 서베이'
pubDate: '2026-07-22T01:20:00+09:00'
description: '모노레포 관리 도구·방식을 세 계층(package-manager workspaces 경량 / Turborepo·Nx task-runner / Bazel heavy)으로 놓고, Turborepo와 Nx의 오늘자(2026-07) 상태와 경량 조합(pnpm workspaces + catalogs + changesets)이 언제 충분한지 정리한 서베이.'
summary: '모노레포 관리는 세 계층으로 나뉜다 — ① package-manager workspaces(pnpm/yarn/npm) + catalogs + changesets의 경량 방식 ② Turborepo(JS/TS 전용, 캐싱·파이프라인, 설정 단순)와 Nx(폴리글롯·경계 강제·코드 생성, 플랫폼) 같은 task-runner ③ Bazel(초대형·다언어)의 heavy. 2026 공통 흐름은 코어 Rust 이식·에이전트 기능 1차화. 대부분의 JS/TS 팀은 경량→Turborepo가 기본선이고, 여러 팀·강한 아키텍처 경계·폴리글롯이면 Nx, Google 스케일에서만 Bazel. Python+React처럼 두 언어가 느슨히 공존하면 도구를 얹기 전에 pnpm+uv 경량 조합으로 충분한 경우가 많다. Lerna는 deprecated가 아니라 Nx 엔진 위에서 발행에 특화된 레거시, moon은 툴체인 pin·폴리글롯을 강조하는 Rust 신흥 러너다.'
lang: ko
tags:
  - 'monorepo'
  - 'turborepo'
  - 'nx'
  - 'pnpm'
  - 'build-tooling'
---

## TL;DR
- 모노레포 관리 도구는 **세 계층**으로 본다: **① 경량** — package-manager workspaces(pnpm/yarn/npm) 자체 + `changesets`(버전/릴리스) + pnpm `catalogs`(의존성 버전 중앙화). **② task-runner** — Turborepo·Nx(캐싱·태스크 그래프·affected). **③ heavy** — Bazel(초대형·다언어, 정밀하지만 설정 비용 큼).
- **Turborepo = JS/TS 전용, "80% 이득을 20% 복잡도로"** — 캐싱·파이프라인이 단순하고 Vercel 통합. 경계 강제(Boundaries)는 아직 experimental.
- **Nx = 플랫폼** — 폴리글롯·코드 생성·성숙한 경계 강제(`enforce-module-boundaries`)·Nx Cloud(원격 캐시·분산 실행·Self-Healing CI). 여러 팀·복잡한 의존 그래프에 강함.
- **선택 순서**: 대부분의 JS/TS 팀은 **경량 → 느려지면 Turborepo**. 여러 팀·강한 아키텍처 경계·다언어면 **Nx**. Google 스케일(1,000+ 엔지니어·다언어)에서만 **Bazel**.
- 관련: 경계(boundary) 설계·에이전트 팀 격리의 상세는 별도 노트([모노레포 에이전트 팀의 서비스 격리와 공통 코드 전략](/inbox/2026-07-22-모노레포-에이전트-팀의-서비스-격리와-공통-코드-전략))에서 다룸. 이 노트는 도구·방식 선택에 집중.

## 세 계층 지형
- **① 경량 (package-manager native)** — pnpm/yarn/npm workspaces가 "여러 패키지를 한 레포에서 링크"를 이미 제공한다. 여기에 릴리스는 `changesets`, 의존성 버전 통일은 pnpm `catalogs`로 얹으면 별도 task-runner 없이도 모노레포가 돌아간다. 태스크 오케스트레이션은 루트 스크립트나 `pnpm --filter`로 처리. **캐싱·affected가 병목이 되기 전까지는 이걸로 충분**하다.
- **② task-runner (Turborepo·Nx)** — 빌드/테스트 결과를 캐싱하고, 의존 그래프로 "바뀐 것만"(affected) 돌리며, 원격 캐시로 CI를 가속한다. 경량으로 감당이 안 될 만큼 패키지·빌드 시간이 커질 때 도입.
- **③ heavy (Bazel)** — 초대형·다언어 저장소(1,000+ 엔지니어)에서 재현성·정밀 캐싱을 극한까지. 강력하지만 학습·설정 비용이 크다. Google 스케일에서 지배적.
- **그 외 — Lerna, moon**(아래 별도 섹션): Lerna는 버전/발행에 특화된 레거시 도구(현재 Nx 엔진 기반), moon은 폴리글롯·툴체인 관리를 강조하는 Rust 기반 신흥 러너.

## Turborepo (확인일 2026-07-22)
- **버전** 2.10.5(≈2026-07-14). 코어 **Rust 이식 진행 중**(2023 말~).
- **성격** JS/TS 전용 task-runner. `turbo.json`에 태스크 파이프라인 선언, 로컬+원격 캐싱, `--filter`로 affected. 설정이 얕고 진입장벽 낮음.
- **2026 릴리스** 2026-03-25에 **Git worktrees·Agent Skill·`turbo docs`** 공식 지원(에이전트 병렬 워크플로우와 직접 맞물림). 2026-06-24에 최대 96% 성능 향상·`turbo query` stable·3.0 준비 deprecation.
- **경계 강제** `Boundaries`(2.4, 2025-04 도입) — **오늘도 experimental**. 기본은 "패키지 디렉토리 밖 파일 import 금지 + 미선언 의존성 import 금지", 태그(dependencies/dependents allow/deny, 전이) 지원. Nx 대비 미성숙 → deep-import/아키텍처 규칙은 `dependency-cruiser`/`eslint-plugin-*` 보조가 흔히 필요.
- **소유** Vercel. → 로드맵이 Vercel 상업 전략에 묶임.
- **한계** **폴리글롯 미지원**(Python 등은 사실상 후보 아님). 코드 생성·아키텍처 거버넌스 기능 없음.

## Nx (확인일 2026-07-22)
- **버전** 23.0.1(≈2026-07-19). 코어 **Rust 이식 완료**(그 위에 새 Terminal UI 등 신기능).
- **성격** 단순 러너를 넘어선 플랫폼: 태스크 그래프·캐싱·affected + **코드 생성(generators)** + **성숙한 경계 강제** + 플러그인 생태계 + 폴리글롯.
- **경계 강제** `@nx/enforce-module-boundaries` — 초기부터 있던 태그 기반 ESLint 규칙(앱→앱 금지, feature→feature 금지, 공개 API 외 deep import 차단). 다언어용 conformance 규칙도 있음. 경계 성숙도는 Turborepo 대비 확실한 우위.
- **2026** **22.5 Nx Agent Skills**(AI 에이전트가 워크스페이스에서 일하는 법을 가르치는 이식 가능 capability), **22.7 Self-Healing CI**(실패 자동 수정 제안, GitHub/GitLab/Bitbucket/Azure). **21**에서 비-JS(Java/Go/Rust/Python) 버저닝까지 폴리글롯 확장.
- **소유** Nrwl(현 Nx사). OSS 코어(MIT) + 유료 **Nx Cloud**(원격 캐시·분산 실행·Self-Healing). `@nrwl`→`@nx` 스코프 이전 완료(v16 이동, v20부터 `@nrwl` 발행 중단).
- **한계** 학습·설정 비용이 Turborepo보다 큼. **Python 지원은 공식이 아닌 커뮤니티 플러그인 `@nxlv/python`**(개인 유지, 구 공식 파이썬 플러그인은 아카이브)에 의존 → 지속성 리스크.

## 경량 방식 — pnpm workspaces (+ catalogs) + changesets
- **언제 충분한가** 패키지 수가 적당하고, 빌드 캐싱·affected가 아직 병목이 아니며, 폴리글롯이 느슨하게 공존하는 경우. task-runner의 학습·설정 비용을 치르기 전 기본선.
- **구성** ① pnpm `workspace` — non-hoisted 심링크 구조라 미선언 의존성 import를 공짜로 차단. ② pnpm `catalogs` — 의존성 버전을 한 곳에서 중앙 관리(버전 드리프트 방지). ③ `changesets` — 패키지별 변경 기록·버전 범프·changelog·npm 발행. ④ 태스크는 루트 스크립트 / `pnpm --filter '...[origin/main]'`로 affected만.
- **2026 모던 경량 스택** 실무 가이드들이 수렴하는 조합: **pnpm catalogs + (필요 시) Turborepo 2.x + changesets**. 즉 "경량 baseline에 Turborepo를 캐싱 레이어로만 얇게 얹는" 중간 지점이 흔함.
- **폴리글롯(Python+React) 경량 조합** JS는 pnpm workspaces, Python은 uv/Poetry로 각자 두고 루트에서 오케스트레이션(Makefile/task runner). 두 언어가 API로만 통신하고 공유가 적으면 Nx의 학습 비용보다 이쪽이 낫다.
- **boundary는 어떻게** task-runner가 없으니 경계는 도구별로 나눠 건다(4평면): JS 내부 = `package.json` `exports` + Sheriff/`dependency-cruiser`, Python 내부 = `import-linter`, 앱 간 = OpenAPI 계약 + 타입 생성, 소유권 = CODEOWNERS. (상세·2단 설계는 [격리 전략 노트](/inbox/2026-07-22-모노레포-에이전트-팀의-서비스-격리와-공통-코드-전략) 참고.)

## 그 외 지형 — Lerna, moon (확인일 2026-07-22)
- **Lerna** — **deprecated 아님.** 한때 사실상 표준이었다가 유지 불확실기를 거쳐 **2022년 Nx 팀(Nrwl)이 stewardship 인수**, 지금은 **Nx의 태스크 엔진 위에서** 돈다(패키지·의존 탐지·병렬·캐시·분산을 Nx에 위임). 강점은 여전히 **버전 관리·npm 발행** 쪽 — Lerna 9(2025-09)에서 **OIDC Trusted Publishing**(CI에 정적 npm 토큰 저장 불필요) 추가. 위치: task-runner를 Nx가 담당하고 Lerna는 발행 레이어. 신규 시작이면 보통 `changesets`(경량) 또는 Nx(통합)가 우선이고, Lerna는 기존 Lerna 레포 유지·발행 워크플로우에 적합.
- **moon (moonrepo)** — **Rust 기반 language-agnostic 러너.** Turborepo/Nx가 JS 중심인 것과 달리 **폴리글롯을 1급으로** 설계: 하나의 `moon.yml` 의존 그래프로 JS 서비스 + Rust CLI + Go 마이크로서비스를 함께 관리하고, 공유 타입 변경 시 어느 서비스가 재빌드돼야 하는지 안다. 차별점은 **툴체인 관리** — Node/pnpm/Bun/Deno/Rust/Go 버전을 워크스페이스별로 설치·pin해 모든 개발자·CI가 동일 버전 사용. 대가: **작은 생태계**(주간 다운로드 ≈50K vs Turborepo ≈2M) → 튜토리얼·엣지케이스 문서·아는 사람 적음. 원격 캐시는 자체 유료 서비스. **툴체인 일관성이 태스크 오케스트레이션만큼 중요하고 다언어일 때** 후보.
  - *주의(Python+React 맥락)*: moon이 pin하는 툴체인 목록에 **Python은 명시돼 있지 않다**(Node/pnpm/Bun/Deno/Rust/Go). Python은 generic system task로 붙이는 수준일 가능성이 높아, "Python 1급 지원"으로 단정하지 말 것 — 필요 시 별도 확인.

## 선택 기준 (요약 매트릭스)
| 상황 | 권장 |
|---|---|
| JS/TS, 소수 패키지, 캐싱 아직 불필요 | **pnpm workspaces + changesets** (경량) |
| JS/TS, 빌드 느려짐, 캐싱·affected 필요 | **Turborepo** (경량 위에 얇게) |
| 여러 팀·강한 아키텍처 경계·코드 생성 필요 | **Nx** |
| 폴리글롯(진짜 통합 빌드·경계 필요) | **Nx** (Python은 `@nxlv/python` 리스크 감안) |
| 폴리글롯이 느슨(API로만 통신) | **경량 조합**(pnpm + uv) + 도구별 경계 lint |
| 폴리글롯 + 툴체인 버전 일관성이 핵심 | **moon** (생태계 작음 감안) |
| 기존 Lerna 레포 유지 / npm 발행 워크플로우 | **Lerna** (Nx 엔진 기반) |
| 초대형·다언어·재현성 극한 (1,000+ eng) | **Bazel** |

## 2026 트렌드 (요약)
- **주류화** — 50명+ 조직의 약 63%가 모노레포(2차 자료 기반, 표본 미검증).
- **코어의 Rust 이식** — Turborepo(진행)·Nx(완료). 그래프 계산·빌드 속도 경쟁이 큰 축.
- **에이전트 기능 1차화** — 두 도구 모두 2026에 "AI 에이전트가 워크스페이스에서 일하는 법"을 공식 기능으로(Turborepo Agent Skill·worktrees, Nx Agent Skills·Self-Healing CI).
- **pnpm이 경량 기본값** — workspaces + catalogs + changesets가 package-manager 계층의 표준 조합으로 자리.

## 검증 메모
- Turborepo·Nx의 버전·기능·경계 성숙도·소유 주체·폴리글롯 지원은 **오늘(2026-07-22) 검색으로 검증됨**.
- 경량 스택(pnpm workspaces/catalogs/changesets, Turborepo 얇게 얹기)은 **2026년 실무 가이드(2차 자료)로 확인**.
- Lerna(Nx 인수·미deprecated·Lerna 9 OIDC)와 moon(Rust·폴리글롯·툴체인 pin·생태계 규모)은 **오늘 재검색으로 검증됨**. 단 moon의 Python 툴체인 1급 지원 여부는 미확정(위 주의 참고).
- Bazel의 "초대형·다언어" 포지셔닝은 이 세션 초반 검색 결과(2차) 기반.

## 레퍼런스 (확인일 2026-07-22)
- 1차: [turbo — npm (v2.10.5)](https://www.npmjs.com/package/turbo) · [Turborepo Blog](https://turborepo.dev/blog) · [Turborepo — Boundaries](https://turborepo.dev/docs/reference/boundaries) — 버전·2026 릴리스·경계 experimental.
- 1차: [nx — npm (v23.0.1)](https://www.npmjs.com/package/nx?activeTab=versions) · [Nx Changelog](https://nx.dev/changelog) · [Nx — Enforce Module Boundaries](https://nx.dev/docs/features/enforce-module-boundaries) · [Nx 2026 Roadmap](https://nx.dev/blog/nx-2026-roadmap) · [Migrating Nx core to Rust (#28434)](https://github.com/nrwl/nx/issues/28434) · [Rescoping @nrwl → @nx](https://nx.dev/docs/reference/deprecated/rescope).
- 2차: [@nxlv/python (npm)](https://www.npmjs.com/package/@nxlv/python) · [구 파이썬 플러그인 아카이브 공지](https://github.com/nrwl/nx/discussions/12670) — Nx Python은 커뮤니티 플러그인 의존.
- 2차: [Monorepo in 2026: Turborepo vs Nx vs Bazel (daily.dev)](https://daily.dev/blog/monorepo-turborepo-vs-nx-vs-bazel-modern-development-teams/) · [Monorepos in 2026: What Actually Works (DEV)](https://dev.to/zny10289/monorepos-in-2026-turborepo-vs-nx-vs-bazel-what-actually-works-1j85) — 계층·포지셔닝·채택률.
- 2차: [A 2026 Monorepo Setup: pnpm catalogs, Turborepo 2.x, changesets](https://chenguangliang.com/en/posts/blog193_monorepo-practice-from-zero-to-production/) · [Workspaces and Monorepos in Package Managers (Nesbitt)](https://nesbitt.io/2026/01/18/workspaces-and-monorepos-in-package-managers.html) — 경량 스택.
- 2차: [Turborepo vs Nx vs Lerna vs pnpm Workspaces Compared 2026](https://viadreams.cc/en/blog/monorepo-tools-2026/) — 도구 비교 개요.
- 1차: [Lerna and Nx](https://lerna.js.org/docs/lerna-and-nx) · [Lerna CHANGELOG](https://github.com/lerna/lerna/blob/main/CHANGELOG.md) · 2차: [Exploring Lerna's second era (LogRocket)](https://blog.logrocket.com/exploring-lerna-second-era/) — Nx 인수·미deprecated·Lerna 9 OIDC Trusted Publishing.
- 1차: [moon — Feature comparison](https://moonrepo.dev/docs/comparison) · [moon (moonrepo)](https://moonrepo.dev/moon) · 2차: [Turborepo vs Nx vs Moon 2026 (PkgPulse)](https://www.pkgpulse.com/guides/turborepo-vs-nx-vs-moon-2026) — Rust·폴리글롯·툴체인 pin·생태계 규모.
