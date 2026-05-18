# DESIGN.md

본 사이트의 시각·구조 결정에 대한 단일 출처(SoT). 모든 UI PR은 이 문서의 원칙·토큰·컴포넌트 가이드를 따른다. 충돌 시 본 문서가 우선하며, 변경은 별도 PR로 본 문서를 먼저 갱신한 뒤 적용한다.

## 0. 영감 (Why HN-inspired)

[Hacker News](https://news.ycombinator.com/)의 디자인 원칙을 차용한다:

- 화면 단위 면적당 최대한 많은 정보
- 텍스트가 일하고, 장식은 빠진다
- 카드·그림자·그라데이션·아이콘은 군더더기
- 색은 의미가 있을 때만, 그 외는 회색 계조
- 즉각적인 인터랙션 (애니메이션 없음)
- 시스템/웹 안전 폰트 — 다운로드 비용 최소화

본 사이트는 개인 블로그/이력이라 HN보다 조금 더 가독성을 챙기되(특히 한글), 위 정신은 그대로 유지한다.

## 1. 핵심 원칙

1. **Density over comfort** — 가독성을 깨지 않는 선에서 한 화면에 더 많이.
2. **Text-first** — 의미는 단어와 시맨틱 HTML로. 아이콘·이모지·일러스트 없음.
3. **Minimal chrome** — 카드, 큰 라운드, 박스 그림자, 그라데이션, 블러 배경 금지.
4. **Grayscale only — no chromatic accent** — 모든 색은 회색 계조 + 검정/흰색. 액센트 컬러 없음. 링크는 색이 아니라 **밑줄**로 구분한다.
5. **System-first typography** — 한글 Pretendard / 영문 시스템 sans / 코드 시스템 mono.
6. **No motion** — `transition`/`animation` 사용 금지. 단, 텍스트 색 전환(`transition-colors`, 회색↔회색)과 포커스 링은 허용.
7. **Predictable single column** — 모든 페이지 본문 최대 폭 동일(`max-w-3xl` ≈ 48rem). 모바일/데스크톱 동일 레이아웃, 폰트 크기만 미세 조정.

## 2. 토큰

`src/styles/global.css`의 `@theme` 블록과 1:1 매핑된다.

### 컬러 (Light) — 4-tone grayscale

| Token | Value | 용도 |
| --- | --- | --- |
| `--color-background` | `#fafafa` | 페이지 배경 |
| `--color-foreground` | `#18181b` | 본문 텍스트, 링크 (밑줄로 구분) |
| `--color-muted` | `#71717a` | 메타·캡션·날짜·작은 보조 텍스트, 비활성 nav |
| `--color-border` | `#e4e4e7` | 헤더/푸터 보더, 코드블록 보더, 구분선 |
| `--color-surface` | `#f4f4f5` | 코드블록 / 인라인 코드 배경 |

### 컬러 (Dark; `[data-theme="dark"]` 오버라이드)

| Token | Value |
| --- | --- |
| `--color-background` | `#0a0a0a` |
| `--color-foreground` | `#fafafa` |
| `--color-muted` | `#a1a1aa` |
| `--color-border` | `#27272a` |
| `--color-surface` | `#18181b` |

> `--color-accent` 토큰은 본 디자인에서 **존재하지 않는다.** Tailwind의 `text-accent` / `bg-accent` 유틸리티는 사용 금지. Phase 3에서 이미 코드에 들어간 `hover:text-accent` 등은 Phase 3.7 조정 PR에서 제거한다.

### 타이포그래피

- **본문**: 16px / line-height 1.65 / Pretendard 또는 시스템 sans
- **메타**: 13–14px / muted color
- **헤딩**: H1 1.5× / H2 1.25× / H3 1.125× — 큰 히어로 헤딩 사용 금지
- **코드 (인라인)**: 0.95em mono / `--color-border` 1px box / 가로 패딩 0.25em
- **코드 (블록)**: 13–14px mono / 1px `--color-border` / 좌측 보더 없음 / 가로 스크롤 허용

### 스페이싱

| 값 | 용도 |
| --- | --- |
| `py-2` ~ `py-3` | Header / Footer 내부 |
| `py-8` ~ `py-10` | Main 컨테이너 위/아래 |
| `gap-1.5` ~ `gap-2` | 메타 행 (날짜·태그·읽기시간) |
| `mt-6` ~ `mt-8` | 섹션 간격 |

Tailwind의 `space-y-12+`, `py-16+` 같은 큰 여백은 지양한다. 한 화면에 더 들어가게.

## 3. 컴포넌트 가이드

### Header

- 한 줄. `border-b border-border`, 좌: 브랜드 텍스트 링크 (`text-foreground`), 우: 네비 + 테마 토글
- 브랜드 링크: 밑줄 없음 (예외; 사이트 이름이라 자명). 호버에도 색/밑줄 변화 없음
- 네비 링크: 비활성 `text-muted`, 활성 `text-foreground`. 밑줄·박스 X (네비는 색 대비로 충분)
- 모바일에서도 햄버거 없이 동일 한 줄(공간 부족하면 nav를 두 줄로 wrap)

### Footer

- 한 줄. `border-t border-border`, `text-sm text-muted`
- 내용: 저작권/연도. 소셜 아이콘 X (필요하면 텍스트 링크, 본문 링크 규칙 적용)

### 글 목록 항목 (post list row)

- 카드 금지. 한 줄 구조: `pubDate · title · readingTime`
- title: `text-foreground` + 호버 시 `underline` (본문 링크 규칙)
- 메타(`pubDate`, `readingTime`)는 `text-muted text-sm`, 가운데 점(`·`)으로 구분
- 줄 간격은 `space-y-1.5` 정도

### 글 상세 (post page)

- 헤더 영역: `H1` 제목 + 메타 한 줄(`pubDate · readingTime · tags`)
- 본문은 `prose` (Tailwind typography)에 다음 오버라이드:
  - 헤딩 위 여백 축소
  - `prose-pre`: `border border-border`, `bg-surface`
  - `prose-code`: 인라인 코드는 `border border-border`, 작은 가로 패딩, `bg-surface`
  - 인용은 좌측 보더 + `text-muted`
  - `prose-a`: 본문 링크 규칙 (아래)

### 링크 — **본 사이트의 단일 규칙**

색이 아닌 **밑줄**로 링크임을 표시한다. 모든 본문 링크에 동일 적용.

- 색: `text-foreground` (본문과 동일)
- 밑줄: 기본 `underline` + `underline-offset-2` + `decoration-from-font` (혹은 `decoration-1`)
- 호버: `decoration-2` (밑줄 두꺼움) 또는 단순히 그대로 — 색 변화 없음
- 방문 후: 색 변화 없음 (회색만 쓰므로 구분할 색이 없다 — 의도된 단순화)
- 외부 링크: 새 탭 (`target=_blank rel=noopener noreferrer`) — Phase 2.3 `rehype-external-links`가 자동 적용. 외부 표시 아이콘은 추가하지 않는다

**예외 (밑줄 없는 링크):**
- Header 브랜드 링크 (사이트 이름이라 명확)
- Header 네비 링크 (위치가 명확하고 색 대비로 충분)
- 글 목록의 메타 부분에 들어가는 부가 링크 (호버 시에만 밑줄)

### 태그

- pill/chip 금지. `#tagname` 텍스트 + 사이 간격만
- 태그 링크: 본문 링크 규칙 적용 (밑줄)

### 코드 하이라이트

- Shiki dual theme (`github-light` / `github-dark`)
- `prose-pre`에 1px 보더, `wrap: true` (수평 스크롤 대신 줄바꿈)

## 4. 안티패턴 (명시적 금지)

- `shadow-lg`, `shadow-xl`, `shadow-2xl` — 어떤 그림자도 사용 금지(`shadow-sm`도 일반 컴포넌트에는 금지; 코드블록 등 한정적)
- `rounded-2xl`, `rounded-3xl`, `rounded-full` (단, 버튼/아바타 등 의미 있는 경우 제외)
- `bg-gradient-*`, `from-*`, `to-*`
- `backdrop-blur-*`
- `animate-*`, 모든 `transition-transform`, `transition-all`, `scale-*` 호버 효과
- 이모지·아이콘으로 의미 전달 (텍스트로 대체. SVG 로고는 헤더에서 단 1회 가능)
- 카드 컨테이너(`bg-surface rounded shadow border` 조합)
- 큰 히어로 섹션 (배너 이미지 + 큰 헤딩 + CTA 버튼)
- `text-7xl+` 큰 타이포
- 호버 시 확대·회전·페이드

허용되는 모션은 **링크·버튼의 색 전환 (`transition-colors`)** 과 **포커스 링** 뿐이다.

## 5. 현 Phase 3 결과물과의 조정 사항

Phase 3에서 만든 결과를 본 문서 기준으로 검토했을 때 조정할 항목 (Phase 3.7 별도 PR):

- `src/styles/global.css` `@theme`에서 `--color-accent` (light/dark 양쪽) **제거**
- `src/styles/global.css` `--color-surface` 라이트 값 `#ffffff` → `#f4f4f5` (인라인 코드 배경에서 보이도록 살짝 회색)
- `src/components/Header.astro` 브랜드 링크의 `hover:text-accent` 제거 (호버 변화 없음)
- `src/components/Header.astro` `py-4` → `py-3`
- `src/components/Footer.astro` `py-6` → `py-4`
- `src/layouts/Base.astro` `<main class="py-12">` → `py-8`
- `src/pages/index.astro`의 `prose` 헤딩 스케일 축소 (`prose-h1:text-3xl` 정도) + 모든 `prose` 본문 링크가 `text-foreground underline underline-offset-2`로 적용되도록 오버라이드
- 모든 `transition-*`을 `transition-colors`로 한정 (다른 트랜지션은 lint/grep 가드 검토)

## 6. 변경 절차

1. 본 문서를 먼저 PR로 갱신한다 (Why + What).
2. 동일 PR 또는 후속 PR로 토큰/컴포넌트 적용을 푸시한다.
3. 라이브에서 비주얼 회귀를 눈으로 확인한다.
4. 충돌하는 코드가 발견되면 (예: 어딘가에 `shadow-lg`가 들어옴) DESIGN.md를 인용하며 거절한다.

## 7. 가드 (선택, Phase 9에서 강화)

빌드 산출물 `dist/**/*.html`에 대해 안티패턴 클래스가 0건임을 보장하는 정적 스캔 테스트 (`tests/design-guard.test.ts`) 추가 후보. Phase 9 성능/접근성 작업과 함께 도입.
