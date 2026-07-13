---
type: Reference
title: 폼과 입력 설계 (Forms & Inputs)
pubDate: '2026-07-10T16:55:00+09:00'
resource: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
description: 데이터 입력의 사용성 원칙 — 지속적 레이블, 에러 예방·식별·복구(WCAG 3.3.x), 인라인 검증, 네이티브 입력 시맨틱, placeholder-as-label 안티패턴
lang: ko
tags: ['forms', 'input', 'validation', 'wcag', 'accessibility', 'usability']
summary: "폼은 사용자가 시스템과 데이터를 주고받는 가장 부하 높은 접점이라 사용성 원칙이 촘촘하다. WCAG는 규범 하한을 정한다 — 3.3.1 에러 식별(A)·3.3.2 레이블/지시(A)·3.3.3 에러 제안(AA)·3.3.4 에러 예방(AA)·1.3.5 입력 목적 식별(AA, autocomplete)·4.1.2 접근 가능한 이름(A), 그리고 2.2 신설 3.3.7 중복 입력·3.3.8 접근 가능한 인증. 실무 근거는 Wroblewski(상단 정렬 레이블이 가장 빠름)·NN/g(인라인 검증, 필드 옆 에러)·Baymard. placeholder를 레이블로 쓰는 것은 안티패턴 — 입력 시작하면 사라져 기억·에러 확인·접근성을 해친다."
lintHash: '5c89853db218'
---

> 한 줄 명제: 레이블은 항상 보이게, 에러는 필드 옆에서 고칠 방법과 함께, 입력은 네이티브 시맨틱으로 — placeholder를 레이블 대신 쓰지 마라.

## 핵심

폼은 사용자가 시스템에 데이터를 넘기는 가장 부하 높은 접점이다. 그래서 [Nielsen 휴리스틱 5·9](/wiki/design-principles/usability/nielsen-heuristics/)(에러 예방·복구)와 [인지 부하](/wiki/design-principles/usability/cognitive-load-and-density/)가 집중되고, 규범도 촘촘하다.

**WCAG 하한(폼 관련 SC).** W3C가 규범으로 정한다:

| SC | 이름 | 레벨 | 규칙 |
|---|---|---|---|
| 3.3.1 | Error Identification | A | 감지된 입력 오류는 **텍스트로** 어느 항목이 왜 틀렸는지 알린다 |
| 3.3.2 | Labels or Instructions | A | 입력이 필요한 곳에 **레이블·지시** 제공 |
| 3.3.3 | Error Suggestion | AA | 교정안을 알면 **제안**한다(보안 위배 아니면) |
| 3.3.4 | Error Prevention | AA | 법적·금전·데이터 변경은 Reversible / Checked / Confirmed 중 하나 |
| 1.3.5 | Identify Input Purpose | AA | 입력 목적을 **프로그램으로 식별**(HTML `autocomplete`) |
| 4.1.2 | Name, Role, Value | A | 컨트롤은 **접근 가능한 이름**을 가져야 함 |
| 3.3.7 | Redundant Entry | A | 이미 입력한 정보는 자동 채움/선택 (2.2 신설) |
| 3.3.8 | Accessible Authentication | AA | 인지 기능 테스트(암기·퍼즐)를 강요하지 않음 (2.2 신설) |

**네이티브 시맨틱을 먼저.** ==`<label for>`↔`<input id>` 연결==은 스크린리더가 라벨을 읽게 하고, 라벨 클릭이 컨트롤을 활성화해 [터치 타깃](/wiki/design-principles/usability/touch-target-size/)을 넓힌다. `type=email/tel/number`·`inputmode`는 모바일 키보드를 맞추고, `required`·`autocomplete`는 검증·자동완성을 준다 — ==직접 만들기 전에 브라우저가 공짜로 주는 것을 쓴다.==

**레이아웃·검증(실무 근거).**

- **레이블 위치** — Luke Wroblewski 《Web Form Design》(2008): ==상단 정렬(top-aligned) 레이블이 완성 속도가 가장 빠르다== — 라벨과 필드를 한 번의 시선 고정으로 잡고, 지역화(긴 라벨)에도 유리. 좌측 정렬은 스캔은 쉽지만 가장 느리다.
- **인라인 검증** — NN/g: 사용자가 필드를 **떠날 때** 필드 옆에서 검증 결과를 보인다(타이핑 중 조기 검증은 "적대적"). 에러 메시지는 먼 다이얼로그가 아니라 ==문제 필드 옆에, 실행 가능하게==.
- **필드 최소화 · 주/보조 액션 구분** — 필드를 줄이고, 주 액션(제출)을 시각적으로 지배시키며 보조(취소)는 약화한다.

**안티패턴: placeholder-as-label.** ==placeholder를 레이블 대신 쓰면, 입력을 시작하는 순간 사라져== 기억 부하를 늘리고, 에러 확인을 막고, 시각·인지 장애 사용자에게 부담을 준다(NN/g·Baymard). Baymard 관찰: 사용자가 라벨을 다시 보려고 입력 전체를 지우기도 한다. placeholder는 **보조 힌트/예시**로만, 레이블은 항상 지속되게.

## 레퍼런스

- [W3C — WCAG 2.2 Understanding: 3.3.2 Labels or Instructions (A)](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) 외 [3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)·[3.3.3](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)·[3.3.4](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)·[1.3.5](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)·[4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)·[3.3.7](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)·[3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) — 1차/규범. 폼 관련 SC(3.3.7/3.3.8은 2.2 신설).
- [MDN — `<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) · [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) — 1차/vendor-neutral(HTML 표준 요약). for/id 연결, 입력 타입·`inputmode`·`autocomplete`.
- [Luke Wroblewski, *Web Form Design: Filling in the Blanks* (Rosenfeld, 2008)](https://rosenfeldmedia.com/books/web-form-design/) — 1차(정본, ISBN 978-1-933820-24-8). 상단 정렬 레이블·필드 최소화·주/보조 액션.
- [NN/g — Website Forms Usability](https://www.nngroup.com/articles/web-form-design/) · [Reporting Errors in Forms](https://www.nngroup.com/articles/errors-forms-design-guidelines/) · [Placeholders Are Harmful](https://www.nngroup.com/articles/form-design-placeholders/) — 2차(권위). 인라인 검증·필드 옆 에러·placeholder 안티패턴.
- [Baymard — Place Labels Above the Field](https://baymard.com/blog/mobile-form-usability-label-position) · [Never Use Inline Labels](https://baymard.com/blog/mobile-forms-avoid-inline-labels) — 2차(연구 기반, 상업). 상단 레이블·placeholder 문제·필수/선택 표기.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브.
- [Nielsen 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/) — 5·9(에러 예방·복구), 3(제어·자유/undo)의 구체 적용.
- [cognitive-load-and-density](/wiki/design-principles/usability/cognitive-load-and-density/) — 폼 필드 최소화 = 부하 줄이기.
- [touch-target-size](/wiki/design-principles/usability/touch-target-size/) — 라벨 클릭이 타깃을 넓히는 접점.
- [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/) — 인라인 검증 피드백이 평가의 간극을 좁힘.
