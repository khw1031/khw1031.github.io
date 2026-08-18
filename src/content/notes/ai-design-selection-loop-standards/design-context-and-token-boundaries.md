---
title: '디자인 맥락·토큰·브랜드 파일의 역할 경계와 채택 근거'
pubDate: '2026-08-10T15:04:08+09:00'
noteId: DS-2608-003
description: 'DTCG, Google DESIGN.md, Figma, Tokens Studio, Style Dictionary와 브랜드 맥락 파일 제안을 비교해 moodbox가 재사용할 규격과 직접 소유할 데이터를 구분한다.'
summary: 'DTCG는 토큰 교환 형식, DESIGN.md는 에이전트가 읽는 적용 맥락, Figma와 토큰 도구는 제품별 저장·변환 경계다. moodbox는 이를 복제하지 않고 제품 의도, 평가 언어, 선별 이력과 참조 버전을 소유한다.'
lang: ko
tags:
  - 'design-tokens'
  - 'design-context'
  - 'figma'
  - 'brand-context'
lintHash: '956d99e7d527'
---

[상위 노트](/notes/ai-design-selection-loop-standards/)에서 분리한 디자인 입력 규격 조사다. 확인일은 2026-08-10이다.

## 채택 판정

| 대상 | 분류 | 확인한 상태 | moodbox 경계 |
| --- | --- | --- | --- |
| DTCG 2025.10 | 공개 규격 | Final Community Group Report이자 Candidate Recommendation. 안정판이지만 W3C 정식 표준은 아님 | 색상·타이포그래피·간격·그림자·참조 등 토큰 교환 정본 |
| Google DESIGN.md | 신생 제안 | 공개 명세·CLI·lint·diff·DTCG export가 있으나 `alpha` | 에이전트가 읽는 표면별 적용 맥락. 직접 호환 전 변환 필요 |
| Tokens Studio | 특정 제품 구현 | Legacy와 DTCG 형식을 선택하고 Figma·Git 저장소와 동기화 | Figma와 토큰 파일 사이 어댑터 |
| Style Dictionary | 특정 제품 구현 | v4부터 DTCG를 직접 지원하지만 2025.10 전체 지원은 진행 중 | 플랫폼별 코드 변환 계층 |
| Figma Variables | 특정 제품 구현 | REST API와 Plugin API로 변수·모드·참조를 관리 | Figma 내부 상태의 읽기·쓰기 경계 |
| Figma Code Connect | 특정 제품 구현 | 디자인 컴포넌트와 실제 코드 컴포넌트를 연결 | 구현 연결 정보의 정본 |
| BRAND.md | 신생 제안 | v0.3.0 Draft | 오래 유지될 브랜드 정체성 입력 후보. 필수 의존 금지 |
| AdCP `brand.json` | 특정 도메인 프로토콜 | AdCP 3.1.2에 규격과 참조 구현이 있음 | 광고 자동화에서 브랜드 식별이 필요할 때만 선택 |
| Brand Context Protocol | 신생 제안 | 공개 사이트 v0.7과 저장소 v0.8 개발 상태가 어긋남 | 현재 정본 의존 금지 |

## 역할 경계

1. **DTCG와 DESIGN.md는 경쟁 형식이 아니라 서로 다른 층이다.**
   1. DTCG는 JSON 기반 토큰 이름, 값, 유형, 그룹, 참조, 확장 데이터를 도구 사이에서 교환한다.
   1. DESIGN.md는 선택적 YAML 토큰과 Markdown 본문을 함께 두어 디자인 의도와 적용 규칙을 에이전트에 전달한다.
   1. Google 도구가 DESIGN.md를 DTCG `tokens.json`으로 내보낼 수 있어도 DESIGN.md의 산문 전체가 DTCG로 변환되는 것은 아니다. 토큰만 교환되고 의도와 금지 규칙은 별도 맥락으로 남는다.
2. **현재 저장소의 루트 `DESIGN.md`는 Google DESIGN.md와 개념은 비슷하지만 직접 호환 형식은 아니다.**
   1. Google 형식은 선택적 YAML 전면부와 정해진 `##` 절 순서를 정의한다.
   1. 현재 저장소 문서는 이 스키마와 고정 절 순서를 그대로 따르지 않는다.
   1. moodbox는 파일 이름이 같다는 이유로 호환을 선언하지 말고, 명시적 import·export 어댑터와 버전 검증을 둔다.
3. **`soul.md`는 토큰과 적용 규칙을 빼고도 남는 정보가 있을 때만 독자 형식으로 유지한다.**
   1. 제품 의도, 느껴야 할 감정, 금지선, 평가 언어, 선택 이유는 DTCG가 다루지 않는다.
   1. 색상·간격·타이포그래피 값은 DTCG로, 표면별 컴포넌트 적용 규칙은 DESIGN.md로 보낸다.
   1. `soul.md`가 같은 토큰과 적용 규칙을 다시 갖는다면 두 정본이 생긴다. 이 경우 `soul.md`는 DESIGN.md와 DTCG 버전을 참조해야 한다.

## moodbox 소유 데이터

- 후보와 원본 참조의 출처, 사용 권한, 라이선스
- 라운드별 생성 목표, 프롬프트, 후보 목록, 실행 조건
- 비교 결과, 선택·탈락·보류, 짧은 판단 근거
- 평가 기준 버전과 기준 변경 이유
- `taste.md` 규칙 후보와 채택·기각 이력
- 라운드 사이의 차이, 재현 정보, 중단 조건
- 사용한 DESIGN.md, DTCG 토큰, 브랜드 맥락 파일의 버전 참조

핵심 빈자리는 디자인 맥락 파일이 아니라, 그 맥락 아래에서 왜 특정 후보를 골랐고 그 판단이 다음 라운드 기준으로 어떻게 바뀌었는지를 저장하는 상태다.

---

<div class="refs">

## 참조

- [DTCG Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/) · 도구 사이의 디자인 토큰 교환 형식과 문서 지위. W3C 정식 표준이 아님을 문서가 직접 명시한다. (1차 · 2025.10 · 2026-08-10 확인)
- [Google design.md 정본 저장소](https://github.com/google-labs-code/design.md) · DESIGN.md 형식, CLI, DTCG export, `alpha` 상태. 조사 시 확인 HEAD `9bf8eae`, 릴리스 v0.4.0. (1차 · 2026-08-10 확인)
- [Google DESIGN.md 명세](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) · YAML 토큰 스키마와 Markdown 절 순서. (1차 · HEAD `9bf8eae` · 2026-08-10 확인)
- [Tokens Studio 토큰 형식 문서](https://docs.tokens.studio/manage-settings/token-format) · Legacy와 DTCG 변환, Figma·Git 동기화, 제품 고유 유형의 차이. (1차 · 2026-08-10 확인)
- [Style Dictionary DTCG 문서](https://styledictionary.com/info/dtcg/) · DTCG 지원과 2025.10 전체 지원이 진행 중이라는 한계. 조사 시 npm 5.5.0, 확인 페이지 최신 커밋 `2b03351`. (1차 · 2026-08-10 확인)
- [Figma Variables API](https://developers.figma.com/docs/rest-api/variables/) · Figma 변수의 조회·생성·수정·삭제 API. (1차 · 2026-08-10 확인)
- [Figma Code Connect](https://developers.figma.com/docs/code-connect/) · Figma 컴포넌트와 실제 코드 컴포넌트의 연결 기능. (1차 · 2026-08-10 확인)
- [BRAND.md 명세](https://github.com/caiopizzol/brand.md/blob/main/spec/brand-md.md) · BRAND.md와 DESIGN.md의 제안된 역할 경계. v0.3.0 Draft, 확인 HEAD `d8e7993`. (1차 · 2026-08-10 확인)
- [AdCP brand.json 명세](https://docs.adcontextprotocol.org/dist/docs/3.1.2/brand-protocol/brand-json) · 광고 자동화에서 쓰는 브랜드 식별·표현 계약. (1차 · AdCP 3.1.2 · 2026-08-10 확인)
- [Brand Context Protocol 정본 저장소](https://github.com/Brand-Context-Protocol/spec) · 브랜드 맥락 스키마의 신생 제안. 확인 HEAD `98f43e1`, 공개 사이트와 버전 불일치. (1차 · 2026-08-10 확인)

</div>
