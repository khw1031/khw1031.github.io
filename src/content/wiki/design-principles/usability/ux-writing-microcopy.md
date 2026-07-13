---
type: Reference
title: UX 라이팅과 마이크로카피
pubDate: '2026-07-10T20:28:10+09:00'
resource: https://www.nngroup.com/articles/3-is-of-microcopy/
description: 인터페이스 속 단어(버튼·에러·레이블) 설계 — 목적 지향 UX 라이팅, plain language, WCAG 읽기 수준, 에러 메시지 가이드라인, 서술적 액션 레이블
lang: ko
tags: ['ux-writing', 'microcopy', 'plain-language', 'error-messages', 'content-design', 'accessibility']
summary: "인터페이스의 단어는 읽히고 음미되려는 게 아니라 사용자를 원하는 것으로 통과시키는 도구다(Podmajersky). 좋은 UX 라이팅은 목적 지향·간결·대화체·명료하고, voice/tone을 일관되게 유지한다. plain language(미국 Plain Writing Act 2010·ISO 24495-1:2023)는 쉬운 단어·짧은 문장·능동태·'you' 호칭을 권한다. WCAG 3.1.5(AAA)는 하위 중등 교육 수준 초과 시 대체본을 요구한다. 에러 메시지는 사람이 읽을 수 있게·사용자를 탓하지 말고·복구를 도와야 한다(NN/g, 휴리스틱 9). 버튼은 결과를 서술하는 액션 레이블('변경 저장')이 'OK/제출'보다 낫다."
lintHash: 'a892f5ad04fb'
---

> 한 줄 명제: 인터페이스의 단어는 장식이 아니라 사용자를 목적지로 통과시키는 도구다 — 쉬운 말로, 사용자를 탓하지 말고, 버튼은 결과를 서술하라.

## 핵심

UX 라이팅(마이크로카피)은 인터페이스 속 단어 — 버튼·레이블·에러·빈 상태·온보딩 — 를 설계하는 일이다. Torrey Podmajersky 《Strategic Writing for UX》의 명제: =="우리의 단어는 읽히고 음미되려는 게 아니라, 기억되지 않은 채 사람을 원하는 것으로 통과시키려 존재한다."== 그래서 [Nielsen 휴리스틱 2(현실의 언어)](/wiki/design-principles/usability/nielsen-heuristics/)·[gulf의 시스템 이미지](/wiki/design-principles/usability/gulf-of-execution-evaluation/)와 직결된다.

**목적 지향 편집.** Podmajersky의 4단계: ==Purposeful(무슨 일을 하는가) → Concise(짧게) → Conversational(사람답게) → Clear(이해되게).== 그리고 **voice chart**(어휘·문법·문장부호·대문자 규칙)로 일관된 성격을, **텍스트 패턴**(타이틀·버튼·레이블·에러·빈 상태)으로 재사용 가능한 문구를 관리한다.

**Plain language(쉬운 언어).** 규범이 있다:

- **미국 Plain Writing Act(2010)** — 연방 기관의 대중 대상 콘텐츠는 "명확하고 이해하기 쉬워야" 한다는 **법적 요구**. 원칙: ==쉬운/일상 단어, 짧은 문장, 능동태, 독자를 "you"로 호칭==, 논리적 구조.
- **ISO 24495-1:2023 Plain language** — 국제 표준(2023). ==독자를 먼저(readers first)== 두어 독자가 정보를 찾고·이해하고·사용할 수 있게. 25개국 전문가 합의·실증 기반.

**접근성(WCAG, 읽기).** ==SC 3.1.5 Reading Level(AAA)==: 텍스트가 하위 중등 교육 수준보다 높은 독해력을 요구하면 보충 콘텐츠(요약·삽화·오디오)나 쉬운 대체본 제공. 3.1.3 Unusual Words·3.1.4 Abbreviations(AAA)는 전문어·약어의 뜻을 식별할 수단을 요구.

**에러 메시지.** NN/g(휴리스틱 9 기반): ==사람이 읽을 수 있는 말로·문제를 정확히·복구를 돕고·긍정적 톤으로 사용자를 탓하지 마라==("invalid/incorrect" 회피). 문제 지점 옆에 색만이 아닌 표시로, 사용자 입력을 보존해 처음부터 다시 하지 않게 (→ [forms-and-inputs](/wiki/design-principles/usability/forms-and-inputs/), WCAG 3.3.1·3.3.3).

**버튼·레이블 관습.** NN/g "3 I's of Microcopy"(Interaction·Informational·Influential): ==버튼 레이블은 클릭 시 무엇이 일어날지 말한다== — 결과에 놀라면 카피가 틀린 것. ==서술적 액션 레이블("변경 저장", "계정 삭제")이 "OK/제출/예"보다 낫다== — 강한 동사로 시작, 능동태(Shopify Polaris: "add apps", not "you can add apps"), 핵심 단어를 앞에.

**Gotcha**: Podmajersky "usable/useful/on-brand" 3요소는 책 프레이밍이나 1차 페이지(403)에서 verbatim 미확인. 연방 plain-language 세부 기법은 digital.gov 리다이렉트 후 카테고리만 렌더돼, verbatim은 GSA 아카이브 참조. ISO 24495-1:2023 인용은 확인됨. Polaris "7학년 수준" 권고는 벤더 가이드(2차).

## 레퍼런스

- [Torrey Podmajersky, *Strategic Writing for UX* (O'Reilly, 2019)](https://www.oreilly.com/library/view/strategic-writing-for/9781492049388/) — 1차(정본, ISBN 978-1-492-04939-5). 4단계 편집·voice chart·텍스트 패턴.
- [U.S. Federal Plain Language Guidelines](https://digital.gov/guides/plain-language) ([GSA 아카이브](https://github.com/gsa/plainlanguage.gov)) — 1차(정부 지침). Plain Writing Act 2010, 쉬운 단어·짧은 문장·능동태·"you".
- [ISO 24495-1:2023 — Plain language, Part 1](https://www.iso.org/standard/78907.html) — 1차(국제 표준). readers first, 찾기·이해·사용.
- [W3C — SC 3.1.5 Reading Level (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html) · [3.1.3 Unusual Words](https://www.w3.org/WAI/WCAG22/Understanding/unusual-words.html) · [3.1.4 Abbreviations](https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html) — 1차/규범.
- [NN/g — Error-Message Guidelines (2023)](https://www.nngroup.com/articles/error-message-guidelines/) · [The 3 I's of Microcopy](https://www.nngroup.com/articles/3-is-of-microcopy/) · [UI Copy](https://www.nngroup.com/articles/ui-copy/) — 2차(권위). 에러 메시지·버튼 레이블.
- [Shopify Polaris — Content fundamentals](https://polaris-react.shopify.com/content/fundamentals) — 2차(디자인 시스템). voice/tone, 강한 동사 CTA.

## 연결

- [usability](/wiki/design-principles/usability/) — 상위 허브.
- [Nielsen 휴리스틱](/wiki/design-principles/usability/nielsen-heuristics/) — 2(현실의 언어)·9(에러 복구)의 언어적 실행.
- [gulf-of-execution-evaluation](/wiki/design-principles/usability/gulf-of-execution-evaluation/) — 단어가 시스템 이미지를 통해 멘탈 모델을 형성.
- [forms-and-inputs](/wiki/design-principles/usability/forms-and-inputs/) — 에러 메시지·레이블 문구의 적용처.
- [icon-systems](/wiki/design-principles/usability/icon-systems/) — 아이콘에 텍스트 레이블을 더하는 지점.
- [navigation-and-ia](/wiki/design-principles/usability/navigation-and-ia/) — 라벨링 시스템(IA)과 마이크로카피의 접점.
