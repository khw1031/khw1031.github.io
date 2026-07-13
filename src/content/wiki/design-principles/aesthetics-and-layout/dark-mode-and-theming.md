---
type: Reference
title: 다크 모드와 테마 (Theming)
pubDate: '2026-07-10T16:55:20+09:00'
resource: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
description: 시맨틱 색 토큰으로 대비를 깨지 않고 테마를 전환하는 원리 — prefers-color-scheme·color-scheme, 역할 기반 토큰, Material 다크 테마(#121212·탈채도), Apple 동적 색
lang: ko
tags: ['dark-mode', 'theming', 'design-tokens', 'prefers-color-scheme', 'color', 'accessibility']
summary: "테마는 색을 하드코딩하지 않고 '역할(role)' 토큰에 매핑해, 값만 바꿔 전체를 다시 칠하는 것이다. 웹은 prefers-color-scheme로 OS 선호를 감지하고 color-scheme/light-dark()로 선언한다. 시맨틱 토큰(surface·on-surface·text-primary)이 라이트/다크에서 다른 값으로 해석된다 — Carbon 4테마(White·g10·g90·g100), Material 색 역할, Apple 동적 시스템 색. Material 다크는 순수 검정 대신 어두운 회색(#121212)·탈채도 색을 권하고 M3는 톤 오버레이로 깊이를 낸다. WCAG 대비(4.5:1)는 두 테마 모두에 동일 적용."
lintHash: '7acacc8f26e1'
---

> 한 줄 명제: 테마는 색을 하드코딩하지 말고 역할 토큰에 매핑해 값만 바꾸는 것 — 순수 검정 대신 어두운 회색, 그리고 두 테마 모두 WCAG 대비를 지켜라.

## 핵심

테마(다크 모드 포함)의 핵심은 색을 화면에 하드코딩하지 않는 것이다. ==색을 "역할(role)" 토큰에 매핑하고, 테마마다 그 토큰이 다른 값으로 해석되게== 하면, 토큰 하나만 바꿔도 전체가 다시 칠해진다([color-and-contrast](/wiki/design-principles/color-and-contrast/)의 톤 스케일 위에 얹히는 시맨틱 층).

**웹 메커니즘.**

- ==`@media (prefers-color-scheme: dark)`== — OS/UA의 라이트·다크 선호를 감지(값 `light`/`dark`, 2020-01 Baseline). 규범은 CSS Media Queries Level 5(§12.5, W3C Working Draft).
- ==`color-scheme: light dark;`== (`:root`에 선언) — UA가 캔버스 배경·스크롤바·폼 컨트롤을 자동 조정. 플래시 방지를 위해 `<head>`에 `<meta name="color-scheme" content="light dark">`. 속성별 압축형은 `light-dark(밝은값, 어두운값)`.

**시맨틱 토큰(역할 기반).** 원리는 ==`color-text-primary: #000` 같은 **이름↔값** 쌍==으로, 이름(역할)을 참조하면 값 교체가 전체 리테마가 된다. 구체 사례:

- **shadcn/ui**(현행 웹 관행) — ==시맨틱 색 변수 쌍(`background`/`foreground`·`primary`·`muted`·`border`·`ring`…)을 `:root`(라이트)와 `.dark`(다크)에 정의==, Tailwind가 유틸로 매핑. 별도 런타임 테마 라이브러리 없이 CSS 변수 오버라이드만으로 전환.
- **IBM Carbon** — 4테마: 라이트 **White·Gray 10**, 다크 **Gray 90·Gray 100**. 같은 역할 토큰이 테마마다 다른 값을 받고 `data-carbon-theme`로 전환.
- **GitHub Primer** — base→functional 토큰 2층, `data-color-mode`/`data-light-theme`/`data-dark-theme`로 전환. ==접근성 우선 9테마==(표준 라이트/다크 + 고대비 + 색맹·삼색각 변형).
- **Apple** — ==의미(동적) 시스템 색==(`label`·`systemBackground`): 목적으로 정의돼 자동 적응. 커스텀 색은 라이트/다크 두 변형 필수.
- **Material 3**(한 사례) — 색 역할(`surface`·`on-surface`·`surface-tint`)이 라이트/다크 `colorScheme`으로 해석.

**다크 테마 특유의 규칙.**

- ==다크 배경은 순수 검정보다 어두운 회색==이 눈부심·눈 피로를 줄인다(예: Material은 #121212 권장 — SPA라 값은 스니펫, design.google는 원칙만 확인).
- ==채도 높은 색은 어두운 배경에서 "진동"하므로 탈채도(pastel)== 한다. Material은 본문 텍스트가 가장 밝은 표면에서도 WCAG AA를 넘도록 최상 대비를 크게(스니펫상 ≥15.8:1) 권한다.
- **깊이 표현** — M3는 다크에서 그림자 대신 ==톤 오버레이(surface tint, 주색 슬롯)==로 엘리베이션을 낸다(→ [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/)). Apple은 base→elevated 배경 전환.

**접근성.** ==WCAG 1.4.3 대비(본문 4.5:1)는 두 테마 모두에 동일 적용==된다 — 대비비는 두 색의 상대 휘도 비율일 뿐 어느 쪽이 어두운지와 무관하다. 라이트에서 통과해도 다크에서 따로 검증해야 한다.

**Gotcha**: (1) W3C **Design Tokens Format Module은 Community Group 리포트로, W3C 표준이 아니다**("do not implement anything in this document") — 토큰 개념의 참고일 뿐. (2) "순수 흰색 on 순수 검정이 난시에 halation을 유발한다"는 널리 인용되나 **권위 있는 1차 출처가 없고 일부는 반박**한다 — #121212·#CCC 완화는 합리적 관행이되 확정 사실로 단정하지 말 것. (3) Material/Apple 페이지는 SPA라 수치는 스니펫 확인.

## 레퍼런스

- [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) · [color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) — 1차/vendor-neutral. 감지·선언 관용구, `light-dark()`. (스펙: [W3C Media Queries L5](https://www.w3.org/TR/mediaqueries-5/), Working Draft.)
- [W3C — WCAG 2.1 SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) — 1차/규범. 4.5:1이 두 테마 모두 적용(대비는 휘도 비율).
- [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming) — 1차. `:root`/`.dark` CSS 변수 시맨틱 쌍(현행 웹 관행).
- [GitHub Primer — Primitives](https://primer.style/foundations/primitives) — 1차. base/functional 2층 토큰, 접근성 우선 9테마.
- [IBM Carbon — Themes](https://carbondesignsystem.com/elements/themes/overview/) — 1차(벤더). White·g10·g90·g100 4테마.
- [Apple HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) — 1차(SPA, 스니펫). 동적 시스템 색.
- [Material Design — Dark theme](https://m2.material.io/design/color/dark-theme.html) — 1차(SPA, 스니펫). #121212·탈채도(한 사례). [Google Design](https://design.google/library/material-design-dark-theme) — 2차(원칙 확인).
- [W3C DTCG — Design Tokens Format Module](https://www.designtokens.org/TR/drafts/format/) — 2차(Community Group, 표준 아님). 토큰=이름↔값 개념.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브.
- [color-and-contrast](/wiki/design-principles/color-and-contrast/) — 테마는 톤 스케일 위에 얹히는 시맨틱 층. 대비는 두 테마 모두 검증.
- [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/) — M3 다크의 톤 엘리베이션.
- [material-design](/wiki/design-principles/material-design/) — 색 역할·동적 색(Material You)의 출처.
- [motion-and-microinteractions](/wiki/design-principles/usability/motion-and-microinteractions/) — prefers-color-scheme와 형제인 prefers-reduced-motion(사용자 선호 감지).
