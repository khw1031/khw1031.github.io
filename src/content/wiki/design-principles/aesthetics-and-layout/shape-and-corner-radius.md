---
type: Reference
title: Shape와 Corner Radius (경계 반경·곡률)
pubDate: '2026-07-10T20:40:20+09:00'
resource: https://www.w3.org/TR/css-backgrounds-3/
description: DESIGN.md의 Shapes 섹션 근거 — border-radius, 연속 곡률(squircle/superellipse), Material 셰이프 스케일, 그리고 형태가 브랜드·의미를 전달하는 방식
lang: ko
tags: ['shape', 'border-radius', 'squircle', 'corner-radius', 'design-tokens', 'material-design']
summary: "형태(모서리 처리)는 DESIGN.md의 Shapes 섹션이자 rounded 토큰의 근거다. CSS border-radius가 프리미티브(사각/원형/타원 모서리, 음수 불가). 연속 곡률(squircle=superellipse)은 단순 원호와 수학적으로 다르며 곡률이 매끄럽게 이어져(G2 연속) 눈에 '흐르듯' 보인다 — 오래 SVG로 흉내냈으나 이제 CSS corner-shape/superellipse() 제안(Borders L4, 실험적)이 다룬다. Material은 셰이프를 토큰 스케일(None 0→ExtraLarge 28dp→Full 50%)로 두고 rounded/cut/square 세 처리를 지원하며, 셰이프가 주의·브랜드·상태를 전달한다고 본다. 둥근 형태는 따뜻하고 친근하게 지각된다(UXPA)."
lintHash: 'f4b76cd66368'
---

> 한 줄 명제: 모서리 형태는 브랜드·의미를 나르는 토큰이다 — border-radius가 프리미티브, squircle(superellipse)은 곡률이 매끄럽게 이어지는 형태, Material은 셰이프를 스케일로 토큰화한다.

## 핵심

형태(shape, 모서리 처리)는 DESIGN.md의 **Shapes 섹션**이자 `rounded: { sm: 4px }` 같은 토큰의 근거다. 둥근/날카로운/깎인 모서리는 임의 장식이 아니라 ==브랜드 성격과 컴포넌트 의미를 전달하는 레버==다.

**CSS 프리미티브 — `border-radius`.** 요소의 바깥 테두리 모서리를 둥글린다. 값은 ==사각(0)·원형(단일 반경)·타원(슬래시 문법 `수평 / 수직`)==, 네 모서리 개별 지정(TL·TR·BR·BL 시계방향), `<length>`·`%`(수평은 너비, 수직은 높이 기준). ==음수는 무효.== 각 모서리는 "1/4 타원"으로 정의된다(W3C CSS Backgrounds & Borders L3, CR 드래프트 2024-03).

**연속 곡률 — squircle / superellipse.** ==squircle은 단순 원호가 아니라 초타원(superellipse)==으로, 곡률이 직선 변(곡률 0)에서 모서리로 **매끄럽게 이어진다**(이른바 G2 연속). 일반 둥근 사각형은 곡률이 0→고정값으로 급변(G1)하는데, squircle은 그 전환이 연속이라 눈에 "흐르듯" 보인다. iOS 앱 아이콘·다수 컨트롤이 이 형태다. 오래 CSS엔 네이티브가 없어 SVG/`clip-path`로 흉내냈으나, 이제 ==`corner-shape` + `superellipse()` 제안(CSS Borders L4, 실험적·Baseline 아님)==이 다룬다: `round`=`superellipse(1)`, `squircle`=`superellipse(2)`, `bevel`=`superellipse(0)`, `notch`=`superellipse(-∞)`. `border-radius`가 0이면 효과 없음.

**반경도 토큰 스케일이다 (다벤더).** 현대 시스템은 코너 반경을 named 토큰 스케일로 둔다:

```text
Tailwind    rounded-xs 2 · sm 4 · md 6 · lg 8 · xl 12 · 2xl 16 · 3xl 24 · 4xl 32px · full
Fluent 2    None 0 · Small 2 · Medium 4(기본) · Large 8 · X-Large 12px · Circle 50%  (32px 미만은 2px)
Material    None 0 · XS 4 · S 8 · M 12 · L 16 · XL 28 · XXL 48dp · Full 50%  (한 사례; rounded/cut)
```

==반경도 spacing·색처럼 스케일로 토큰화==해 컴포넌트가 raw px가 아니라 "sm/md/lg"를 참조하게 한다. 셰이프는 ==주의 유도·컴포넌트 식별·상태 전달·브랜드 표현==의 레버다(Material·Fluent 공통 관점).

**형태와 의미.** ==둥근 형태는 각진 형태보다 따뜻하고·친근하고·아름답게 지각==된다(UXPA 저널, 곡률을 체계적으로 변화시킨 연구). 셰이프는 [어포던스](/wiki/design-principles/usability/gulf-of-execution-evaluation/) 신호이기도 하다(둥근 버튼=누를 수 있음). 반대로 날카로운 모서리는 격식·정밀함을 준다.

**Gotcha**: (1) `corner-shape`/superellipse는 **실험적**(Chromium 선행, cross-browser Baseline 아님) — 프로덕션은 SVG 대체 필요. (2) Material M3 셰이프 페이지·Apple 아이콘 HIG는 SPA라 dp 값은 Android repo에서 확인(m3 페이지 직접 미확인). (3) "둥근 게 인지적으로 처리하기 쉽다"는 흔한 주장은 **강한 1차 근거 없음** — 근거 있는 건 warmth/친근함 지각(UXPA)이지 측정된 처리 부하 감소가 아니다. (4) Material 4대 셰이프 역할 문구는 m2 셰이프 문서(SPA 스니펫) 소산.

## 레퍼런스

- [W3C — CSS Backgrounds and Borders L3 (border-radius)](https://www.w3.org/TR/css-backgrounds-3/) · [MDN border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) — 1차/규범(+authoritative). 사각/원/타원 모서리, 1/4 타원, 음수 무효.
- [MDN corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape) · [W3C CSS Borders L4](https://drafts.csswg.org/css-borders-4/) — 1차/spec-tracking(실험적). `superellipse()`·squircle 매핑. (Chrome 상태: [chromestatus](https://chromestatus.com/feature/5357329815699456).)
- [Tailwind CSS — border-radius](https://tailwindcss.com/docs/border-radius) — 1차(v4). `rounded-xs`~`4xl`(2~32px)·`full`.
- [Microsoft Fluent 2 — Shapes](https://fluent2.microsoft.design/shapes) — 1차. None 0/Small 2/Medium 4/Large 8/X-Large 12px/Circle 50%(32px 미만 2px).
- [material-components-android — Shape.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Shape.md) — 1차(정본 repo). 셰이프 스케일 dp·rounded/cut(한 사례). [Building the Shape System (Google Dev Blog, 2018)](https://developers.googleblog.com/2018/12/building-shape-system-for-material.html) — 1차. 셰이프가 주의·브랜드·상호작용.
- [UXPA — How a Rounded Aesthetic Translates Beauty to … Warmth](https://uxpajournal.org/rounded-aesthetic-beauty-warmth/) — 2차(peer-review). 둥근 형태 = 따뜻·친근·아름다움 지각.

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브.
- [DESIGN.md](/wiki/design-principles/design-md/) — 이 카드는 DESIGN.md의 **Shapes 섹션**과 `rounded` 토큰의 근거.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 셰이프도 같은 토큰 스케일 사고(반경도 4/8 배수로).
- [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/) — 형태·깊이가 함께 컴포넌트의 시각 성격을 만듦.
- [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/) — 둥근 형태 = 누를 수 있음의 어포던스 신호.
- [apple-hig](/wiki/design-principles/apple-hig/) — 연속 곡률(squircle) 앱 아이콘 마스크의 구현 사례.
