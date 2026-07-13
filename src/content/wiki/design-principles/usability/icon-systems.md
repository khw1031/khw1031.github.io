---
type: Reference
title: 아이콘·픽토그램 시스템
pubDate: '2026-07-10T16:55:10+09:00'
resource: https://www.nngroup.com/articles/icon-usability/
description: 아이콘은 인식(recognition)을 활용하지만 대부분 텍스트 레이블이 필요하다 — 아이콘 사용성, 접근 가능한 이름(WCAG 4.1.2·1.1.1), 비텍스트 대비(1.4.11), 체계적 아이콘 폰트
lang: ko
tags: ['icons', 'pictograms', 'recognition', 'accessibility', 'wcag', 'material-symbols']
summary: "아이콘은 인식-over-회상(Nielsen 6)을 활용하지만, 그 의미가 이미 학습·관습화됐을 때만 통한다 — NN/g 연구는 보편적으로 이해되는 아이콘은 극소수(홈·검색·프린트)이고 대부분 텍스트 레이블이 필요하다고 본다. 애매한 아이콘은 부하만 늘린다. 접근성상 아이콘 전용 버튼은 접근 가능한 이름(WCAG 4.1.2·1.1.1: aria-label/시각 숨김 텍스트)이 필요하고, 의미 있는 아이콘은 3:1 대비(1.4.11)를 지켜야 한다. Material Symbols(가변 폰트 4축)·SF Symbols는 24dp 그리드·옵티컬 사이징으로 체계화한다."
lintHash: '4028d74251c9'
---

> 한 줄 명제: 아이콘은 관습화됐을 때만 인식되고, 대부분 텍스트 레이블이 필요하다 — 아이콘 전용 버튼엔 접근 가능한 이름을, 의미 있는 아이콘엔 3:1 대비를.

## 핵심

아이콘은 [인식-over-회상(Nielsen 휴리스틱 6)](/wiki/design-principles/usability/nielsen-heuristics/)을 활용하는 도구다 — 텍스트를 읽는 대신 형태를 알아본다. ==그러나 이 이점은 아이콘 의미가 **이미 학습·관습화됐을 때만** 성립==한다. 새로운 아이콘은 먼저 배워야(회상) 하므로 인식의 이점이 사라진다. 이것이 이 카드의 핵심 긴장이다.

**대부분의 아이콘은 레이블이 필요하다.** NN/g "Icon Usability"(Harley 2014): ==보편적으로 이해되는 아이콘은 극소수==(홈, 검색=돋보기, 프린트)이고, 대부분은 인터페이스마다 의미가 달라 애매하다. 애매한 아이콘은 [인지 부하](/wiki/design-principles/usability/cognitive-load-and-density/)만 늘리고 기능을 낭비한다(한 연구에서 비표준 아이콘을 클릭한 참가자가 0명). ==그래서 아이콘 옆에 텍스트 레이블을 유지==하고(특히 내비게이션), 인식·기억을 사용자 테스트로 검증한다. 관습 아이콘(돋보기=검색, 휴지통=삭제, 카트=장바구니)이 통하는 건 [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/) — 사용자가 다른 곳에서 이미 학습했기 때문이다.

**접근성(W3C 규범).**

- ==아이콘 전용 컨트롤은 **접근 가능한 이름**이 필요==하다 — WCAG **4.1.2 Name, Role, Value (A)** + **1.1.1 Non-text Content (A)**. 실무: `aria-label`, `aria-labelledby`, 또는 시각적으로 숨긴 텍스트를 **버튼(컨트롤)에** 두고, 장식용 SVG는 `aria-hidden="true"`로 감춘다. ==SVG 자체를 이름 제공 수단으로 쓰면 브라우저·스크린리더 조합에서 실패==한다(Soueidan). 이름 없는 컨트롤 = 실패 F68.
- ==의미를 전달하는 아이콘은 **3:1 대비**== 필요 — WCAG **1.4.11 Non-text Contrast (AA)**. 이해에 필요한 부분만 3:1이면 되고 순수 장식은 예외(→ [color-and-contrast](/wiki/design-principles/color-and-contrast/)).

**체계적 아이콘 라이브러리.** 좋은 아이콘 세트는 낱개가 아니라 시스템이다:

- **Material Symbols** — 단일 가변 폰트에 2,500+ 글리프, 3스타일(Outlined/Rounded/Sharp), ==4개 축: FILL(0–1)·wght(100–700)·GRAD(−50–200)·opsz(20–48dp)==. `font-variation-settings`로 제어. 시스템 아이콘은 **24×24dp 그리드**와 키라인 도형(원·사각·세로/가로 직사각)으로 옵티컬 일관성을 잡는다.
- **Apple SF Symbols** — 7,000+ 심볼, 9 웨이트 × 3 스케일, ==SF 시스템 폰트와 자동 정렬(cap-height 기준)== 및 옵티컬 스케일링. 여러 렌더 모드(Monochrome/Hierarchical/Palette/Multicolor).

공통 원리: ==아이콘 굵기·크기를 옆 텍스트에 맞추고(옵티컬 사이징) 일관된 그리드에 그린다.==

**Gotcha**: SF Symbols의 특정 버전·OS 번호는 페치가 비정상적으로 앞서 보여 인용하지 않음(구조 사실 7,000+/9웨이트/3스케일은 신뢰). Material "ROND(rounding) 축"은 공식 4축에 없어 미확인. NN/g "4대 아이콘 품질 기준"은 검색 요약 경유라 원문 대조 전엔 인용 보류.

## 레퍼런스

- [NN/g — Icon Usability (Harley 2014)](https://www.nngroup.com/articles/icon-usability/) — 2차(권위). 보편 아이콘은 극소수·레이블 필요·애매 아이콘의 부하.
- [W3C — SC 4.1.2 Name, Role, Value (A)](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html) · [1.1.1 Non-text Content (A)](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html) · [1.4.11 Non-text Contrast (AA)](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) — 1차/규범. 접근 가능한 이름·3:1 대비.
- [Sara Soueidan — Accessible Icon Buttons (2019)](https://www.sarasoueidan.com/blog/accessible-icon-buttons/) — 2차(a11y 실무 권위). 이름은 버튼에, SVG는 aria-hidden.
- [Google — Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols) — 2차(벤더, 정적 확인). 가변 폰트 4축(FILL·wght·GRAD·opsz). [System icons (M2)](https://m2.material.io/design/iconography/system-icons.html) — 24dp 그리드·키라인.
- [Apple — SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols) — 2차(벤더). 7,000+·9웨이트·3스케일·텍스트 자동 정렬.
- [Nielsen — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — 2차. 인식-over-회상(휴리스틱 6).

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브. 인식-over-회상의 구체 사례.
- [Nielsen 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/) — 6번(인식 우선)의 적용과 한계.
- [Jakob의 법칙](/wiki/design-principles/usability/jakobs-law/) — 관습 아이콘이 통하는 이유.
- [cognitive-load-and-density](/wiki/design-principles/usability/cognitive-load-and-density/) — 애매한 아이콘 = 부하 증가.
- [color-and-contrast](/wiki/design-principles/color-and-contrast/) — 아이콘 비텍스트 대비(1.4.11).
- [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/) — 아이콘 옵티컬 사이징이 텍스트에 맞춰지는 접점.
- [apple-hig](/wiki/design-principles/apple-hig/) — SF Symbols(7,000+·9 웨이트·3 스케일, 텍스트 자동 정렬)의 구현 사례.
