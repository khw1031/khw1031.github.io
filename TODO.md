# 재구성 작업 계획 (TDD 기반)

> 목표: 기존 Next.js + MDX → **Astro 5 + md-only** 정적 사이트로 재구성.
> 원칙: **모든 기능은 TDD (Red → Green → Refactor)**. 실패하는 테스트 없이는 구현 PR을 만들지 않는다.
> 호스팅: GitHub Pages 유지 (기존 도메인/URL 보존).

---

## Phase 1. 브랜치 재배치 + Astro 스캐폴드 + Pages 자동 배포 ⭐ FIRST

**이 단계의 정의**: `legacy/nextjs`에 기존 코드 보존 → `main`은 Astro로 새 출발 → push 한 번이면 GitHub Pages에 자동 배포되는 상태까지 완료.

### 1.1 브랜치 재배치 (이력 보존)
- [ ] 1.1.1 현재 `main` 최신 상태 확인 (`git status` clean, `git fetch`)
- [ ] 1.1.2 로컬 `main` → `legacy/nextjs`로 이름 변경 (`git branch -m main legacy/nextjs`)
- [ ] 1.1.3 `legacy/nextjs` 원격 push (`git push -u origin legacy/nextjs`)
- [ ] 1.1.4 새 `main` 브랜치 생성 (`legacy/nextjs` 시점에서 분기 — 히스토리 보존)
- [ ] 1.1.5 새 `main`의 워킹트리 비우기 (`.git`/`TODO.md`/`docs/` 제외) → 스캐폴드 자리 만들기
- [ ] 1.1.6 첫 커밋: `chore: reset main for astro rewrite` (이전 히스토리는 legacy/nextjs에 그대로)
- [ ] 1.1.7 원격 default 브랜치는 일단 그대로(legacy/nextjs로 잠시 전환 가능), Phase 1 완료 시 `main`으로 복귀 (`gh repo edit --default-branch main`)

**Acceptance**: 원격에 `legacy/nextjs` 존재(전체 히스토리), `main`은 스캐폴드 베이스만.

### 1.2 Astro 최소 스캐폴드
- [ ] 1.2.1 `pnpm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`
- [ ] 1.2.2 `package.json#packageManager`를 `pnpm@11.1.2`로 핀 (`.nvmrc`는 Phase 0에서 `24.15.0` 설정 완료)
- [ ] 1.2.3 `astro.config.mjs`
  - `site: 'https://khw1031.github.io'`
  - `trailingSlash: 'never'`
  - `output: 'static'`
- [ ] 1.2.4 `src/pages/index.astro` — 최소 페이지(h1 + 짧은 인트로 + 빌드 일시 표시)
- [ ] 1.2.5 `src/layouts/Base.astro` — head(meta viewport, charset, title), main slot, footer
- [ ] 1.2.6 `public/CNAME`이 있었다면 보존 (커스텀 도메인 사용 여부 확인 후 결정)

### 1.3 툴체인 (TDD 베이스라인, 최소 구성)
- [ ] 1.3.1 **Biome** 설치 + `biome.json`(권장 룰셋, ignore: `dist`, `.astro`, `node_modules`)
  - scripts: `lint`, `lint:fix`, `format`, `format:check`
  - 기존 `.eslintrc.json` 삭제
- [ ] 1.3.2 **Vitest** + `happy-dom`
  - `tests/smoke.test.ts`: **Red 먼저** (`expect(1).toBe(2)`) → Green (`expect(1).toBe(1)`)
  - 러너가 CI에서 동작하는 것만 확인
- [ ] 1.3.3 **Playwright** 최소 1개 E2E
  - `e2e/home.spec.ts`: 홈 200 + `h1` 텍스트 존재 (Red → Green)
- [ ] 1.3.4 **lefthook** pre-commit (biome check) — 선택, 시간 부족하면 Phase 2로
- [ ] 1.3.5 `pnpm exec astro check` 0 errors

### 1.4 CI 워크플로 `.github/workflows/ci.yml`
- [ ] 1.4.1 trigger: `pull_request`, `push` to non-main 브랜치
- [ ] 1.4.2 잡: setup pnpm/node → install → `lint` → `astro check` → `vitest --run` → `astro build` → Playwright e2e
- [ ] 1.4.3 캐시: pnpm store, Playwright browsers
- [ ] 1.4.4 **Red**: 처음에 workflow가 의도적으로 실패하는 step 두고 → Green 만들기

### 1.5 Deploy 워크플로 `.github/workflows/deploy.yml`
- [ ] 1.5.1 trigger: `push` to `main`, `workflow_dispatch`
- [ ] 1.5.2 권한: `pages: write`, `id-token: write`
- [ ] 1.5.3 단계:
  1. checkout
  2. setup pnpm(11.1.2) + node(24.15.0, `.nvmrc` 기준) + 캐시
  3. `pnpm install --frozen-lockfile`
  4. `pnpm exec astro build`
  5. `actions/configure-pages@v5`
  6. `actions/upload-pages-artifact@v3` (`path: dist`)
  7. `actions/deploy-pages@v4`
- [ ] 1.5.4 환경변수 placeholder: `PUBLIC_GA_MEASUREMENT_ID`(secret, Phase 8에서 실제 사용)
- [ ] 1.5.5 concurrency: `group: pages, cancel-in-progress: true`
- [ ] 1.5.6 GitHub Pages 설정: Settings → Pages → Source = "GitHub Actions"
- [ ] 1.5.7 원격 default 브랜치 `main`으로 변경 (`gh repo edit --default-branch main`)

### 1.6 검증 (Phase 1 종료 게이트)
- [ ] 1.6.1 PR 만들어 CI 그린 확인 → main 머지
- [ ] 1.6.2 Actions에서 `deploy.yml` 그린, 배포 URL 200
- [ ] 1.6.3 라이브 사이트에서 스캐폴드 페이지 확인
- [ ] 1.6.4 Lighthouse(빠른 점검) Perf/SEO 90+

**Phase 1 완료 정의**: `main`에 push → 자동 빌드/배포 → 라이브 URL에서 Astro 스캐폴드 페이지가 보임. 이후 모든 작업은 이 파이프라인 위에서 진행된다.

---

## Phase 2. 컨텐츠 모델 & 마이그레이션

순수 `.md`만 사용. frontmatter 스키마는 **Zod**로 강하게 잡는다.

- [ ] 2.1 `src/content/config.ts` 컬렉션 정의: `posts`, `notes`, `cs`, `log`, `cv`, `portfolio`, `cover-letter`
  - 공통 frontmatter: `title`, `description`/`summary`, `pubDate`, `updatedDate?`, `tags?`, `draft?`, `lang`, `canonical?`, `ogImage?`
  - **Red 테스트** (`tests/content-schema.test.ts`): 잘못된 frontmatter는 `getCollection` 단계에서 throw
- [ ] 2.2 `legacy/nextjs`에서 컨텐츠 추출 → `scripts/import-from-legacy.ts`
  - `.mdx`의 JSX 컴포넌트는 사용처 목록 추출 → `docs/jsx-usages.md`(후속 작업에서 `.astro` 컴포넌트로 대체)
  - **Test**: 변환 결과가 `remark-parse`로 valid AST + frontmatter zod 통과
- [ ] 2.3 마크다운 파이프라인 (`astro.config.mjs#markdown`)
  - remark: `remark-gfm`, `remark-smartypants`, (옵션) `remark-math`
  - rehype: `rehype-slug`, `rehype-autolink-headings`, `rehype-external-links`(`rel=noopener`), (옵션) `rehype-katex`
  - 코드 하이라이트: Shiki (light/dark 테마)
  - **Test**: 샘플 md → HTML 스냅샷 (heading id, 외부 링크 rel, 코드블록 클래스)
- [ ] 2.4 `src/lib/reading-time.ts` + 단위 테스트
- [ ] 2.5 `docs/legacy-routes.txt`(legacy 브랜치에서 산출)와 Phase 4 라우트 diff 0이 목표

---

## Phase 3. 레이아웃 & 디자인 시스템

- [ ] 3.1 Tailwind v4 (`@tailwindcss/vite`) 도입, 토큰 정의(컬러/폰트/스페이싱/prose)
- [ ] 3.2 `Base.astro` 확장: SEO 슬롯, 다크모드 no-flash 스크립트
  - **Test (Astro Container API)**: 주어진 props로 title/canonical 정확히 렌더
- [ ] 3.3 다크모드 토글
  - **E2E**: 클릭 시 `data-theme` 토글, localStorage 보존
- [ ] 3.4 Header/Nav/Footer 컴포넌트
- [ ] 3.5 `prose` 스타일

---

## Phase 4. 페이지/라우트

각 페이지 작업 단위 = **(1) 라우트 E2E 작성 → (2) 구현 → (3) 리팩터**.

- [ ] 4.1 `/` 홈 (최근 글 + 자기소개)
- [ ] 4.2 `/posts` 목록 + `/posts/[slug]`
- [ ] 4.3 `/notes`, `/cs`, `/log` 동일 패턴
- [ ] 4.4 `/cv` — `src/data/cv.ts`(TS 객체) + `cv.astro`
  - **Test**: cv 데이터 zod 검증, 필수 섹션 존재
- [ ] 4.5 `/cover-letter`, `/portfolio`
- [ ] 4.6 `/tags/[tag]`
- [ ] 4.7 `404.astro`
- [ ] 4.8 (옵션) 빌드 시 Playwright로 `cv.pdf` 산출

**Acceptance**: legacy 라우트 100% 보존 (`docs/legacy-routes.txt` diff 0).

---

## Phase 5. SEO

- [ ] 5.1 `Seo.astro`(title/desc/canonical/OG/Twitter/robots) + 단위 테스트
- [ ] 5.2 `@astrojs/sitemap` 통합 + draft 제외 filter
  - **Test**: dist의 sitemap에 모든 공개 슬러그 포함
- [ ] 5.3 `@astrojs/rss`로 `/rss.xml`
- [ ] 5.4 OG 이미지 빌드타임 자동 생성 (satori 기반, e.g. `astro-og-canvas`)
  - **Test**: 각 글마다 PNG가 dist에 생성
- [ ] 5.5 JSON-LD 컴포넌트: `Person`, `BlogPosting`, `BreadcrumbList`, `WebSite`+`SearchAction`
- [ ] 5.6 `robots.txt` 라우트 (sitemap 링크 + GPTBot/PerplexityBot/ClaudeBot allow)
- [ ] 5.7 canonical/trailing slash 정책 통일

---

## Phase 6. GEO (Generative Engine Optimization)

- [ ] 6.1 `/llms.txt` 라우트 (사이트 요약 + 섹션 인덱스)
  - **Test**: 모든 공개 컬렉션 인덱스 URL 포함
- [ ] 6.2 `/llms-full.txt` — 전체 글 본문 plain text 결합
- [ ] 6.3 frontmatter `summary`(TL;DR) 필수화
- [ ] 6.4 FAQ 페이지에 `FAQPage` JSON-LD
- [ ] 6.5 author `sameAs`로 GitHub/LinkedIn 링크 (Person schema)
- [ ] 6.6 빌드 후 dist HTML 시맨틱 가드 테스트(cheerio): h1 == 1, `<main>` 존재, `alt` 누락 0

---

## Phase 7. 검색

- [ ] 7.1 **Pagefind** postbuild 인덱싱
- [ ] 7.2 검색 UI(헤더 또는 `/search`)
  - **E2E**: "typescript" 입력 → 결과 1+

---

## Phase 8. Analytics — GA4

- [ ] 8.1 `astro:env` 스키마: `PUBLIC_GA_MEASUREMENT_ID` (public, string, optional)
  - `.env.example` 갱신, `deploy.yml`에서 secret 주입(이미 Phase 1.5.4 placeholder 존재)
- [ ] 8.2 `<GoogleAnalytics>` 컴포넌트
  - prod + ID 있음 → gtag 스니펫 2개
  - dev or ID 없음 → 아무것도 렌더 안 함
  - **Unit Test** 3 케이스 모두 작성
- [ ] 8.3 **Consent Mode v2**
  - default: `ad_storage/analytics_storage/ad_user_data/ad_personalization = denied`
  - `<ConsentBanner>` → 동의 시 `gtag('consent','update', granted)` + localStorage
  - **Test**: default 호출이 config 이전 위치, 동의 후 update 호출 발생
- [ ] 8.4 `src/lib/analytics.ts#track(event, params)` (window.dataLayer 없으면 no-op)
- [ ] 8.5 외부 링크 / CV PDF 다운로드 이벤트 (`outbound_click`, `file_download`)
  - **E2E**: dataLayer push 모킹 검증
- [ ] 8.6 봇/reduced-motion 환경에서 스크립트 로드 차단 (선택)

---

## Phase 9. 성능 & 접근성

- [ ] 9.1 `astro:assets`로 이미지 최적화, lazy 기본
- [ ] 9.2 폰트 self-host, `font-display: swap`, 중요한 1종만 preload
- [ ] 9.3 Lighthouse CI (`@lhci/cli`) — 임계치 Perf/A11y/BP ≥95, SEO=100
- [ ] 9.4 axe-core + Playwright a11y 위반 0

---

## Phase 10. 컷오버 정리

- [ ] 10.1 Next.js 잔존물 검사(혹시 누락된 게 있다면) → 제거
- [ ] 10.2 README 갱신: 새 스택, 로컬 실행, 글 작성 가이드, GA4 환경변수
- [ ] 10.3 legacy-routes diff 최종 0 확인
- [ ] 10.4 태그 `v2.0.0`
- [ ] 10.5 Search Console에 새 sitemap 제출

---

## 작업 규약 (TDD 룰)

1. **모든 PR은 실패하는 테스트로 시작**. 커밋 그래프에서 Red 커밋 식별 가능해야 함.
2. 한 PR = 한 체크박스(또는 묶음 1개).
3. Conventional Commits (`feat:`, `test:`, `refactor:`, `chore:` ...).
4. 리팩터 커밋은 **테스트를 수정하지 않는다**.
5. CI 통과 = lint + typecheck + unit + e2e + build 5종 green.
6. 외부 통신(GA, OG, …)은 단위 테스트에서 모킹, 실제 호출은 E2E에서만.

## 완료 정의 (전체)

- [ ] Lighthouse Perf ≥95 / A11y ≥95 / SEO=100 / BP ≥95
- [ ] `pnpm test`, `pnpm test:e2e`, `pnpm lint`, `pnpm exec astro check` 모두 green
- [ ] sitemap.xml / rss.xml / llms.txt / llms-full.txt 모두 200, 누락 0
- [ ] GA4 Realtime에서 배포 직후 이벤트 수신 확인
- [ ] legacy-routes diff 0
