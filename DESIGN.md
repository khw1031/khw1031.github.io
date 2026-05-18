# DESIGN.md

본 사이트의 시각·구조 결정에 대한 단일 출처(SoT). 모든 UI PR은 이 문서의 원칙·토큰·컴포넌트 가이드를 따른다. 충돌 시 본 문서가 우선하며, 변경은 별도 PR로 본 문서를 먼저 갱신한 뒤 적용한다.

## 0. 영감 (Why HN-inspired + Agent-readable)

**브랜드**: `THNKR`

[Hacker News](https://news.ycombinator.com/)의 디자인 원칙을 차용한다:

- 화면 단위 면적당 최대한 많은 정보
- 텍스트가 일하고, 장식은 빠진다
- 카드·그림자·그라데이션·아이콘은 군더더기
- 색은 의미가 있을 때만, 그 외는 회색 계조
- 즉각적인 인터랙션 (애니메이션 없음)
- 시스템/웹 안전 폰트 — 다운로드 비용 최소화

본 사이트는 개인 블로그/이력이라 HN보다 조금 더 가독성을 챙기되(특히 한글), 위 정신은 그대로 유지한다.

**HN 화면과의 대조 (의도된 차이)**

| 항목 | HN | THNKR |
| --- | --- | --- |
| 헤더 색 | 오렌지 #ff6600 바 | iTerm2 `Apple Classic` 팔레트 (현재 `#2c2b2b` warm dark gray) |
| 배경 | 크림 #f6f6ef | iTerm2 `Background Color` (현재 `#2c2b2b`) |
| 폰트 | Verdana 10pt | **코딩(mono) 스택** — SF Mono / Menlo / D2Coding / Noto Sans Mono CJK KR |
| 본문 폭 | 거의 풀폭 | `max-w-3xl` 단일 컬럼 |
| 업보트 화살표 | `▲` 텍스트 | 없음 (개인 블로그라 투표가 없다) |
| 글 목록 패턴 | `1. ▲ Title (domain)` + submeta | `Title (domain)` + 메타 한 줄 (번호 매김은 선택) |
| nav 구분자 | pipe `\|` | pipe `\|` 또는 가운데 점 `·` |

**Agent-readable 설계**

LLM 기반 검색·요약·코딩 에이전트가 본 사이트와 본 저장소를 정확히 파싱하도록 설계한다.

- 시맨틱 HTML (`<article>`, `<time datetime>`, `<nav>`, `<main>`, h1~h3 1회씩 의미 있게)
- 컨텐츠는 모두 plain `.md` (Phase 2.2 마이그레이션 완료). MDX/JSX 안 씀
- JS-only 컨텐츠 금지. JS 없이도 모든 정보가 HTML로 노출
- `/llms.txt`, `/llms-full.txt`로 사이트 인덱스/본문을 평문으로 공급 (Phase 6 작업)
- JSON-LD (`Person`, `BlogPosting`, `BreadcrumbList`) 일관 적용 (Phase 5 작업)
- 결과: HN의 텍스트 중심 미학과 LLM/에이전트 친화성이 동일한 디자인 결정으로 수렴한다

**디자인 피드백 워크플로 — [Agentation](https://www.agentation.com/)**

UI 미세 조정은 사람의 시각 판단이 필요하다. 모호한 자연어 지시("좀 더 빡빡하게")보다 구조화된 피드백이 에이전트(Claude Code 등)에게 훨씬 잘 전달된다. 이 저장소의 디자인 이터레이션은 다음 원칙을 따른다.

- **Specificity** — "Button text unclear" > "fix this"
- **Atomicity** — 한 어노테이션 = 한 이슈
- **Context** — 기대 동작 vs 실제 동작을 함께 적는다

Agentation은 위 원칙을 자동화한다: 라이브 사이트에서 요소를 클릭 → 노트 추가 → CSS 셀렉터, 파일 경로, 컴포넌트 계층, computed style이 포함된 구조화 출력 생성 → MCP로 Claude Code에 전달. 본 저장소에서 UI 변경을 요청할 때 권장 입력 경로다 (`docs/agentation.md` 참조).

## 1. 핵심 원칙

1. **Density over comfort** — 가독성을 깨지 않는 선에서 한 화면에 더 많이.
2. **Text-first** — 의미는 단어와 시맨틱 HTML로. 아이콘·이모지·일러스트 없음.
3. **Minimal chrome** — 카드, 큰 라운드, 박스 그림자, 그라데이션, 블러 배경 금지.
4. **Single iTerm2-sourced palette** — 컬러는 `src/styles/themes/<name>.itermcolors`를 단일 출처로 사용. 빌드 시 `pnpm theme:gen`이 CSS 변수로 변환. 라이트/다크 토글 없이 **단일 테마**. 현재 채택: `Apple Classic` (amber-on-dark, 클래식 모니터 미학).
5. **Mono-first typography** — 본문·헤딩·메타 모두 코딩 폰트. 라틴 = Geist Mono, 한글 = D2 Coding (둘 다 self-hosted). 의도된 "터미널/CLI" 미학.
6. **No motion** — `transition`/`animation` 사용 금지. 단, 텍스트 색 전환(`transition-colors`)과 포커스 링은 허용.
7. **Predictable single column** — 모든 페이지 본문 최대 폭 동일(`max-w-3xl` ≈ 48rem). 모바일/데스크톱 동일 레이아웃, 폰트 크기만 미세 조정.
8. **Agent-readable** — 시맨틱 HTML + plain `.md` 본문 + JSON-LD + `llms.txt`. JS 없이도 컨텐츠 100% 노출.

## 2. 토큰

`src/styles/global.css`의 `@theme` 블록과 1:1 매핑된다.

### 컬러 — 단일 테마, iTerm2에서 생성

소스: `src/styles/themes/AppleClassic.itermcolors`. 빌드 직전 `scripts/iterm-to-css.ts`가 파싱해 `src/styles/theme.generated.css`로 변환. 그 결과 `:root`에 정의되어 모든 페이지에 적용.

| Token | Source iTerm key | Current value | 용도 |
| --- | --- | --- | --- |
| `--color-background` | `Background Color` | `#2c2b2b` | 페이지 배경 (warm dark gray) |
| `--color-foreground` | `Foreground Color` | `#d5a200` | 본문 텍스트 (Apple ][ amber CRT 미학) |
| `--color-muted` | `Ansi 8 Color` | `#686868` | 메타·캡션·비활성 텍스트 |
| `--color-border` | `Ansi 7 Color` | `#c7c7c7` | 보더, 구분선 (대비가 강한 light gray — 매핑 조정 후보) |
| `--color-surface` | `Selection Color` | `#6b5b02` | 코드블록 / 인라인 코드 배경 (dark amber) |
| `--color-accent` | `Cursor Color` | `#c7c7c7` | (선택) 액센트 — 본 디자인에서는 사용 안 함 |
| `--color-link` | `Link Color` | `#005cbb` | (선택) 링크 색 — 본 디자인은 foreground+밑줄 사용 |

전체 iTerm 팔레트는 `--iterm-*` 변수로도 노출되어 추후 액센트가 필요해지면 즉시 참조 가능.

### 라이트/다크 토글 없음

단일 테마. 페이지 전체가 항상 같은 컬러로 표시. 토글 인프라(`ThemeToggle.astro`, `theme.ts`, 관련 테스트, no-flash 스크립트)는 모두 제거.

### 타이포그래피 — Mono-first

본문, 헤딩, 메타, UI 텍스트 **전부 모노스페이스**. 코드와 본문이 동일한 폰트 패밀리. 의도된 "에이전트/터미널" 미학.

- **스택**: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "D2Coding", "Noto Sans Mono CJK KR", "Liberation Mono", "Courier New", monospace`
- **본문**: 15px (HN의 10pt보단 한글 가독성 우선, 단 일반 sans 16px보다 살짝 작게) / line-height 1.6
- **메타**: 13px / muted color
- **헤딩**: H1 1.4× / H2 1.2× / H3 1.1× — mono는 같은 크기에서도 더 도드라지므로 sans보다 스케일 작게 둠
- **코드 (인라인)**: 동일 mono / `--color-border` 1px box / `--color-surface` 배경 / 0.95em
- **코드 (블록)**: 동일 mono / 1px `--color-border` / `--color-surface` 배경 / 가로 스크롤 허용

### 스페이싱

| 값 | 용도 |
| --- | --- |
| `py-2` ~ `py-3` | Header / Footer 내부 |
| `py-8` ~ `py-10` | Main 컨테이너 위/아래 |
| `gap-1.5` ~ `gap-2` | 메타 행 (날짜·태그·읽기시간) |
| `mt-6` ~ `mt-8` | 섹션 간격 |

Tailwind의 `space-y-12+`, `py-16+` 같은 큰 여백은 지양한다. 한 화면에 더 들어가게.

## 3. 컴포넌트 가이드

### Header (HN-inspired)

- 한 줄. `border-b border-border`, 좌: 브랜드 `THNKR` (`text-foreground font-medium`) + pipe-separated nav, 우: 테마 토글
- 브랜드: `THNKR` 텍스트만. 로고 아이콘 없음. 호버 효과 없음
- 네비 구분자: HN처럼 pipe `|` 또는 가운데 점 `·` — 둘 중 하나 일관 사용
- 네비 링크: 비활성 `text-muted`, 활성 `text-foreground`. 밑줄·박스 X
- 모바일에서도 햄버거 없이 동일 한 줄(공간 부족하면 nav를 두 줄로 wrap)

### Footer

- 한 줄. `border-t border-border`, `text-sm text-muted`
- 내용: 저작권/연도. 소셜 아이콘 X (필요하면 텍스트 링크, 본문 링크 규칙 적용)

### 글 목록 항목 (post list row, HN-inspired)

HN의 `1. ▲ Title (domain)` + submeta 구조를 차용하되 화살표·번호는 생략.

**구조 (HTML 의사 코드)**

```html
<li>
  <a class="title">제목</a>
  <span class="muted">(domain.com)</span>  <!-- 외부 링크일 때만 -->
  <div class="meta">
    <time>2026-05-18</time>
    <span> · </span>
    <span>5 min</span>
    <span> · </span>
    <a>tag1</a>, <a>tag2</a>
  </div>
</li>
```

**규칙**

- 카드 금지. flat list, 한 줄 + 하위 메타 줄
- title: `text-foreground` + 호버 시 `underline` (본문 링크 규칙)
- 외부 도메인은 title 뒤 `(domain.com)`을 `text-muted text-sm` 으로
- 메타 줄(날짜·readingTime·태그)은 `text-muted text-sm`, 구분자 가운데 점(`·`) 또는 pipe(`|`)
- 항목 간 간격 `space-y-3` 정도 (HN의 거의 0에 가까운 간격은 한글에선 너무 빡빡)
- 번호 매김(`1.`)은 옵션 — `<ol>` 사용 시 `list-decimal` 으로 자연스럽게 표시

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

## 5. 현 결과물과의 조정 사항

### 완료 (커밋됨)

- `--color-accent` 제거, `--color-surface` light `#f4f4f5`로 변경
- Header `py-3` / Footer `py-4` / Main `py-8` 밀도 조정
- Header 브랜드 hover 제거
- prose 오버라이드 unlayered로 cascade 정렬 (헤딩 축소·링크 색 통일)
- Tailwind `@source not` 으로 안티패턴 클래스명 유출 차단

### 신규 (이번 PR에서 적용)

- **브랜드 `khw1031` → `THNKR`** — Header 브랜드 텍스트, 레이아웃 기본 title, og:site_name, Footer 저작권, 홈 페이지 h1 / title prop, e2e 기대 텍스트
- **`--font-display`를 mono 스택으로 교체** — `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "D2Coding", "Noto Sans Mono CJK KR", "Liberation Mono", "Courier New", monospace`
- **본문 기본 폰트 사이즈 15px** — body에서 `font-size: 15px` 명시 (mono는 sans 16px보다 시각적으로 크다)
- prose 헤딩 스케일 mono용으로 축소 (1.4× / 1.2× / 1.1×)

## 6. 변경 절차

1. 본 문서를 먼저 PR로 갱신한다 (Why + What).
2. 동일 PR 또는 후속 PR로 토큰/컴포넌트 적용을 푸시한다.
3. 라이브에서 비주얼 회귀를 눈으로 확인한다.
4. 충돌하는 코드가 발견되면 (예: 어딘가에 `shadow-lg`가 들어옴) DESIGN.md를 인용하며 거절한다.

### 6.1 컬러 테마 교체 워크플로

1. 새 `.itermcolors` 파일을 `src/styles/themes/` 아래에 배치 (iterm2colorschemes.com 등에서 다운로드)
2. `scripts/iterm-to-css.ts`의 `SOURCE` 상수를 새 파일 경로로 변경
3. `pnpm theme:gen` 실행 → `src/styles/theme.generated.css` 갱신
4. (필요 시) `scripts/iterm-to-css.ts`의 `TOKEN_MAP` 매핑 조정. 기본 매핑:
   - `Background Color` → `--color-background`
   - `Foreground Color` → `--color-foreground`
   - `Ansi 8 Color` → `--color-muted`
   - `Ansi 7 Color` → `--color-border`
   - `Selection Color` → `--color-surface`
   - `Cursor Color` → `--color-accent` (참조용)
   - `Link Color` → `--color-link` (참조용)
5. `pnpm build`로 시각 확인, 커밋

각 빌드 직전 `prebuild` 훅이 자동으로 `theme:gen`을 실행하므로 generated 파일이 항상 최신이다.

## 7. 가드 (선택, Phase 9에서 강화)

빌드 산출물 `dist/**/*.html`에 대해 안티패턴 클래스가 0건임을 보장하는 정적 스캔 테스트 (`tests/design-guard.test.ts`) 추가 후보. Phase 9 성능/접근성 작업과 함께 도입.
