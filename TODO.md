# 재구성 작업 계획 (TDD 기반)

> 목표: 기존 Next.js + MDX → **Astro 5 + md-only** 정적 사이트로 재구성.
> 원칙: **모든 기능은 TDD (Red → Green → Refactor)**. 실패하는 테스트 없이는 구현 PR을 만들지 않는다.
> 호스팅: GitHub Pages 유지 (기존 도메인/URL 보존).

---

## 📍 세션 핸드오프 (2026-05-19)

**라이브**: https://khw1031.github.io/ — 정상 동작

**완료된 단계**
- ✅ Phase 1 전부 (브랜치 재배치, 스캐폴드, CI/Deploy)
- ✅ Phase 2.1 zod 스키마, 2.3 마크다운 파이프라인, 2.4 reading-time
- ⚠ Phase 2.2 마이그레이션 — **posts(8)**, **read-and-write(5)**만 유지. notes/cs/log는 사용자 결정으로 컬렉션 자체 제거. cv/cover-letter/portfolio는 Phase 4.4에서 TS 데이터 + .astro로 처리 (이번 세션 완료)
- ✅ Phase 3 디자인 시스템 + DESIGN.md
  - 폰트: Latin = Geist Mono, 한글 = Pretendard Variable (둘 다 self-hosted)
  - body 13px, root font-size 13px
  - 헤딩 hierarchy = 배경 tint (h1 18% / h2 12% / h3 6% / h4 무) + size 1.05~1rem
  - 컬러 테마: iTerm2 `.itermcolors` 파일 단일 출처 → `scripts/iterm-to-css.ts`가 빌드 시 CSS 변수 생성. 현재 **Apple System Colors Light** 적용. 라이트/다크 토글 없음
- ✅ Phase 4.2–4.3 라우트 (`/posts/`, `/posts/[slug]/`, `/read-and-write/`, `/read-and-write/[slug]/`, 홈에 Recent 목록)
- ✅ Phase 4.4 — `/cv/`, `/cover-letter/`, `/portfolio/`
  - `src/data/types.ts`에 `documentPageSchema` (zod) — Section/Detail/DetailContent 구조
  - `src/data/{cv,cover-letter,portfolio}.ts`에 타입드 데이터, 빌드 타임 zod parse
  - `src/components/document/{DocumentHeader,Section,Detail,Keywords}.astro` + `src/layouts/DocumentLayout.astro`
  - `cv` / `cover-letter` / `portfolio` 컨텐츠 컬렉션 제거 (glob-loader warning 해소)
  - Footer에 정적 페이지 nav 추가 (탐색 가능)
  - 레거시 `/20251218` 슬러그 → `/posts/20251218/`로 매핑
- ✅ Phase 5 SEO — sitemap-index.xml + sitemap-0.xml + rss.xml + robots.txt + JSON-LD(Person/WebSite/BlogPosting)
- ✅ trailingSlash: 'always' 정착 — 301 리다이렉트 0
- ✅ Shiki 단일 theme(github-light) + transformer로 inline pre bg 제거 → 코드 색상 + 우리 회색 톤 공존
- ✅ Korean word-break (keep-all + overflow-wrap: anywhere)

**테스트 현황**: 57 unit + 18 e2e green

**아직 진행 안 한 작업 (우선순위 추천 순)**

1. **Phase 8** — GA4 + Consent Mode v2
   - 이미 `.github/workflows/deploy.yml`에 `PUBLIC_GA_MEASUREMENT_ID` secret placeholder 있음
   - 구현: `src/components/analytics/GoogleAnalytics.astro` + `<ConsentBanner>` + `src/lib/analytics.ts`
   - 단위테스트: prod/dev 분기, consent default denied → granted
   - **주의**: 동의 배너 UI는 DESIGN.md 미니멀 원칙(카드/그림자 금지) 안에서 결정 필요

2. **Phase 6** — GEO
   - `/llms.txt` — 사이트 인덱스 (cv/cover-letter/portfolio도 포함)
   - `/llms-full.txt` — 모든 글 본문 평문 결합 (TS data 페이지는 별도 직렬화 필요)
   - FAQ schema (필요한 페이지 식별 후)

3. **Phase 7** — Pagefind 검색
   - postbuild 인덱싱 + 검색 UI 컴포넌트
   - cv/cover-letter/portfolio도 정적 HTML이라 자동 인덱싱됨

4. **Phase 9** — 품질 게이트
   - Lighthouse CI (`@lhci/cli`) — Perf/A11y/SEO 임계치
   - axe-core + Playwright a11y 위반 0

5. **Phase 4.5 / 4.7** — `/tags/[tag]/` + 404 페이지

**Polish 후보 (단독 가능)**
- PostLayout의 article 타이틀 h1과 markdown 본문 `# ...` h1이 함께 있는 페이지 — 본문 h1을 h2로 자동 강등하는 rehype 플러그인 추가 검토
- README 갱신 (새 스택/명령어/디자인 토큰/테마 swap 워크플로)
- `--color-surface` (현재 `Selection Color`인 라이트 블루)는 이제 prose에서 직접 안 쓰임 — 토큰 의미 재정의 또는 제거 검토

**아이데이션 필요 항목 (별도 PR 전, 디자인 논의 먼저)**

- **PC 화면의 사이드 여백 활용** — 현재 본문은 `max-w-3xl` 단일 컬럼이라 데스크톱 와이드 화면에서 좌우 공백이 큼. 이 공간을 단순히 비워두지 말고 "실험 공간"으로 활용하는 방향
  - 후보 아이디어 (DESIGN.md 원칙과 양립 가능한 선에서):
    - 사이드 마진 메타데이터: 글 메타(pubDate, reading time, tags), 목차(ToC), 백링크, footnote 인라인 노출
    - "현재 위치" 미니맵 / 스크롤 인디케이터
    - 인용된 외부 링크 미리보기 (호버 시 사이드에 카드 펼침)
    - 좌측 = 글 메타 / 우측 = 동적 ToC + 진행도 라인
    - 글 옆에 손글씨 메모 / 코멘트 영역 (margin notes / Edward Tufte 스타일)
    - 라이브 코드 결과 (Phase 7 검색 + Phase 8 분석과 연계 가능)
    - 사이트 활동 로그 (최근 커밋, 어떤 글이 추가/수정됐는지)
    - 키보드 단축키 안내, 명령 팔레트 (Cmd+K)
    - 글의 ASCII 다이어그램이 본문 폭을 넘어갈 때 사이드로 확장
    - "이 글이 처음 보는 사람을 위한 한 줄 요약" 또는 GEO 요약 (Phase 6과 연계)
  - 제약:
    - DESIGN.md 원칙 1(Density)과 3(Minimal chrome) 유지 — 카드/그림자/큰 라운드 금지
    - 모바일에서는 단일 컬럼으로 깔끔히 정리 (사이드 콘텐츠는 PC 전용 또는 하단으로)
    - JS-only로 만들지 말기 (원칙 8 Agent-readable)
  - 결정 필요:
    - 후보 1~2개 우선 채택 vs 점진 실험
    - "실험 공간" 자체를 별도 라우트(`/lab/`)로 빼서 메인 사이트에 안 섞을지, 본문 옆 직접 통합할지

**참고 문서**
- `DESIGN.md` — UI 결정 단일 출처
- `docs/agentation.md` — UI 피드백 워크플로
- `docs/jsx-usages.md` — legacy JSX 컴포넌트 인벤토리 (Phase 4.4용)
- `src/styles/themes/` — iTerm 테마 파일들 (Darkmatrix, AppleClassic, AppleSystemColorsLight)

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

### Phase 3.6 ⭐ DESIGN.md 초기화 (Hacker News 디자인 철학)

**위치**: `DESIGN.md` (저장소 루트). 이 문서는 이후 모든 UI 결정의 단일 출처(SoT)이며, Phase 4 이후 작업은 이 문서를 참조한다.

**참고**: https://news.ycombinator.com/ — 정보 밀도, 텍스트 우선, 시스템 폰트, 단일 액센트 컬러, 무애니메이션, 카드/그림자/그라데이션 없음, 아이콘 없음.

- [ ] 3.6.1 **철학 / 원칙** 섹션
  - Density over comfort — 한 화면에 최대한 많은 컨텐츠 (적정 가독성 유지하는 선에서)
  - Text-first — 아이콘/이모지/장식 요소 없음. 의미는 단어와 시맨틱 HTML로 전달
  - Minimal chrome — 카드, 박스 그림자, 그라데이션, 라운드 코너 큰 값 금지
  - One accent color — 링크/액션에만 단일 액센트(현 `--color-accent`). 그 외는 회색 계조
  - System / web-safe font stack — 한글: Pretendard 또는 시스템; 영문/숫자: 시스템 sans; 코드: 시스템 mono
  - No motion — `transition`/`animation` 금지(접근성/포커스 상태는 예외)
  - Predictable layout — 단일 컬럼, 좁은 본문 폭(현 `max-w-3xl` 그대로 유지 후보)
- [ ] 3.6.2 **토큰 표** — 현 `src/styles/global.css`의 `@theme` 값과 매핑하고 조정 필요 사항 식별
  - 컬러: background, foreground, muted, accent, border, surface (HN 풍으로 채도/대비 검토)
  - 타이포: base font-size (모바일/데스크톱), 라인하이트, 헤딩 스케일 (큰 헤딩 지양)
  - 스페이싱: 단단한 종축 리듬(작은 gap 위주), 큰 여백 지양
- [ ] 3.6.3 **컴포넌트 가이드**
  - Header: 얇은 한 줄(브랜드 + 토글), 보더 1px
  - Nav: 텍스트 링크만, 현재 위치는 텍스트 색만 변경 (밑줄/박스 X)
  - 글 목록 줄: `title · pubDate · reading-time` 형태의 한 줄, 카드 X
  - 본문 prose: 헤딩 1.25× 정도 스케일, 코드블록 보더 1px, 인용은 좌측 보더 + 회색
  - 링크: 액센트 컬러 + 호버 시 밑줄(또는 항상 밑줄)
  - 메타: 회색 작은 텍스트
- [ ] 3.6.4 **안티패턴 목록** — 명시적으로 금지: 박스 섀도우 lg/xl, blur 배경, 그라데이션, 큰 라운드(rounded-2xl+), 큰 헤더 히어로, 회전/스케일 트랜스폼, 페이드/슬라이드 인 애니메이션, 이모지 장식, 이미지 배경, hover 시 확대
- [ ] 3.6.5 **현 Phase 3 결과물 검토** — DESIGN.md 확정 후 충돌 지점 식별 → 토큰/컴포넌트 조정 별도 커밋 (예: header padding 줄임, footer 단순화, prose 헤딩 스케일 축소)
- [ ] 3.6.6 **테스트 가능한 항목** (선택)
  - dist HTML 정적 분석으로 금지 클래스 미사용 보장 (`tests/design-guard.test.ts`: `class="*shadow-lg*"` 같은 패턴 0건)
  - Lighthouse Accessibility ≥95 임계는 Phase 9에서 강제

**완료 정의**: DESIGN.md 푸시 + 충돌 항목 정리 커밋이 라이브 반영된 상태. 이후 Phase 4부터 모든 UI PR은 본 문서를 인용한다.

---

## Phase 4. 페이지/라우트

> **선결 조건**: Phase 3.6 `DESIGN.md` 머지 완료. 모든 페이지 구현은 본 문서의 원칙·토큰·컴포넌트 가이드를 따른다.

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
