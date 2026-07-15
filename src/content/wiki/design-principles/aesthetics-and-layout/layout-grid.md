---
type: Reference
title: Layout Grid (스위스 그리드 → 웹 컬럼 그리드)
pubDate: '2026-07-10T16:11:25+09:00'
resource: https://www.w3.org/TR/css-grid-1/
description: 스위스 국제 타이포그래피 양식의 그리드(Tschichold 1928, Müller-Brockmann 1981)가 960.gs 12컬럼과 CSS Grid 스펙으로 이어진 레이아웃 그리드 계보
lang: ko
tags: ['layout-grid', 'grid-system', 'swiss-design', 'css-grid', 'columns']
summary: "레이아웃 그리드는 페이지를 컬럼·행·모듈로 나눠 마진·거터로 질서를 주는 체계다. 뿌리는 Jan Tschichold의 신 타이포그래피(1928)와 Josef Müller-Brockmann의 《Grid Systems in Graphic Design》(1981) — 스위스 국제 타이포그래피 양식의 '질서에의 의지'. 이것이 Nathan Smith의 960 Grid System(2008, 960px·12/16컬럼)으로 웹에 이식됐고, 다시 W3C CSS Grid Layout 스펙(2차원 격자, 아직 Candidate Recommendation)으로 브라우저 네이티브가 됐다."
lintHash: 'e4c8cdd71555'
polishHash: 'e4c8cdd71555'
---

> 한 줄 명제: 페이지를 컬럼·모듈·거터로 나눠 질서를 주는 그리드는 스위스 인쇄 양식에서 왔고, 960.gs 12컬럼을 거쳐 CSS Grid로 웹의 뼈대가 됐다.

## 핵심

레이아웃 그리드는 ==페이지를 규칙적인 **컬럼·행·모듈**의 격자로 나누고 **마진·거터**로 요소를 배치해 객관적·체계적 질서를 만드는 체계==다. 뿌리는 20세기 초 모더니즘 인쇄다. Jan Tschichold의 《Die neue Typographie》(1928)가 중앙 정렬·장식을 버리고 **콘텐츠와 표준 비율이 이끄는 구조**(비대칭·기능적)를 선언했고, Josef Müller-Brockmann의 《Grid Systems in Graphic Design》(1981)이 이를 체계화했다 — 컬럼 그리드부터 8·20·32 필드 모듈 그리드까지, 콘텐츠 필요에 따라 격자 수를 고른다. 그 철학이 ==스위스 국제 타이포그래피 양식의 "질서에의 의지(will to order)"==다.

이 인쇄 그리드가 웹으로 이식된 결정적 계기가 Nathan Smith의 **960 Grid System**(2008)이다. 캔버스 폭을 **960px**로 잡았는데, 960이 2·3·4·5·6·8·10·12·15·16…로 깔끔하게 나뉘기 때문이다. **12컬럼**이면 60px 컬럼, **16컬럼**이면 40px 컬럼, 각 컬럼 좌우 10px 마진 → **20px 거터**. 이것이 Bootstrap의 12컬럼 그리드로, 다시 브라우저 네이티브인 **CSS Grid Layout**으로 이어졌다.

CSS Grid는 이 계보를 웹 표준으로 형식화한다 — ==행·열을 동시에 다루는 **2차원** 격자 시스템으로, 스펙 스스로 "사용자 인터페이스 디자인에 최적화"라 밝힌다==(단축 축만 다루는 Flexbox와 대비). 명시적 그리드 라인·트랙·영역이 Müller-Brockmann의 컬럼/모듈/거터를 코드로 인코딩한 것이다. [Material의 12컬럼 반응형 그리드](/wiki/design-principles/material-design/)도 같은 계보의 제품화다.

**Gotcha(버전)**: CSS Grid Layout Level 1은 모든 브라우저가 구현했지만 형식적으로는 **아직 Candidate Recommendation**(2025-03 기준)이지 완전한 W3C Recommendation이 아니다 — "Recommendation"이라 단정하지 않는 게 정확하다.

## 레퍼런스

- [W3C — CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/) — 1차/규범. 2차원 격자, "UI 디자인에 최적화". 최초 WD 2011, CR 2016~ (아직 CR). 웹의 네이티브 그리드.
- Josef Müller-Brockmann, *Grid Systems in Graphic Design* (1981) — 1차(정본 서적, ISBN 978-3721201451). 컬럼·모듈·거터 정의, "질서에의 의지". ([판본 확인용 출판사](https://niggli.ch/en/products/rastersysteme-fur-die-visuelle-gestaltung))
- Jan Tschichold, *Die neue Typographie* (1928) — 1차(정본 서적, 영역 ISBN 978-0520250123). 그리드 기반 모더니즘 타이포의 선언. ([UC Press](https://www.ucpress.edu/book/9780520250123/the-new-typography))
- [Nathan Smith, 960 Grid System (2008)](https://960.gs/) — 2차. 스위스 컬럼 그리드의 웹 이식(960px·12/16컬럼·20px 거터). ([소스](https://github.com/nathansmith/960-Grid-System))

## 연결

- [aesthetics-and-layout](/wiki/design-principles/aesthetics-and-layout/) — 상위 허브. 출판→웹 계보의 셋째 갈래.
- [spacing-8pt-grid](/wiki/design-principles/aesthetics-and-layout/spacing-8pt-grid/) — 컬럼 그리드의 거터·마진이 spacing 격자와 만나는 지점.
- [gestalt-principles](/wiki/design-principles/usability/gestalt-principles/) — 정렬(연속)·공동영역이 그리드로 구현되는 지각적 근거.
- [Material Design](/wiki/design-principles/material-design/) — 12컬럼 반응형 그리드로 계보를 제품화.
