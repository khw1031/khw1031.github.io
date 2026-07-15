---
title: 'sprite-gen: AI 이미지 모델로 게임용 스프라이트 아틀라스 자동 생성 파이프라인'
pubDate: '2026-07-14T01:11:27+09:00'
description: '기반 이미지 하나로 상태별 행 생성, 크로마 제거, 프레임 추출, 런타임 아틀라스까지 자동화하는 Codex/Claude skill.'
summary: 'sprite-gen은 AI 이미지 생성의 고질적 한계(캐릭터 일관성·배경 제거·격자 정렬)를 component-row 파이프라인으로 해결해 게임 엔진이 바로 소비할 수 있는 스프라이트 아틀라스와 매니페스트를 산출한다.'
lang: ko
tags:
  - 'ai'
  - 'open-source'
  - 'developer-productivity'
  - 'workflow'
  - 'game-dev'
canonical: 'https://github.com/aldegad/sprite-gen'
lintHash: 'fe7910aeb688'
polishHash: 'fe7910aeb688'
---

## TL;DR
- AI 이미지 모델에 "스프라이트 시트"를 요청하면 생기는 캐릭터 불일치·배경 잔여물·격자 틀어짐을, ==**행(row) 단위 생성 → 크로마 알파 → 프레임 추출 → 아틀라스 + 매니페스트** 파이프라인으로 해결==하는 오픈소스 Codex/Claude skill.

## 큰 그림
```
                  ┌────────────────────────┐
                  │  sprite-request.json   │  (수치 SSoT)
                  └──────────┬─────────────┘
                             ▼
                  ┌────────────────────────┐
                  │  layout guides + prompts│
                  └──────────┬─────────────┘
                             ▼
           ┌──────────────────────────────────┐
           │  sprite-gen gen (state row 생성)  │  ← codex / grok provider
           │  상태별 한 줄(strip) 이미지 출력   │
           └────────────────┬─────────────────┘
                            ▼
           ┌──────────────────────────────────┐
           │  chroma alpha + connected comps   │
           │  (크로마 제거 → 투명 프레임 분리)   │
           └────────────────┬─────────────────┘
                            ▼
           ┌──────────────────────────────────┐
           │  curation webview (선택, 사람 보정)│
           └────────────────┬─────────────────┘
                            ▼
           ┌──────────────────────────────────┐
           │  sprite-sheet-alpha.png           │
           │  + manifest.json.frame_layout     │
           │    (절대 좌표·fps·루프 플래그)      │
           └──────────────────────────────────┘
```

## 핵심
- 기존 이미지 생성 모델에 "스프라이트 시트"를 시키면 프레임마다 얼굴이 바뀌고, 배경이 남고, 포즈가 겹치는 등 **게임 엔진에 넣을 수 없는 결과물**이 나온다(저자 주장).
- sprite-gen은 이 문제를 한 번에 해결하려 하지 않고 ==**상태(state)별 한 행씩 생성**하는 component-row 방식으로 쪼개서, 각 행의 캐릭터 정체성을 기반 이미지로 고정==한다.
- 생성 직후에는 여전히 크로마 배경이 남으므로 **soft-alpha unmix**로 안티에일리어스된 머리카락·얇은 외곽선을 살린 채 실제 알파 채널로 바꾼다.
- 이후 **connected component** 분석으로 각 포즈를 개별 투명 프레임으로 자르고, 엔진이 격자를 "추측"하지 않도록 **`manifest.json.frame_layout`**에 절대 좌표·fps·루프 여부를 기록한다.
- 마지막 10%는 기계가 못 맞추므로 **curation webview**에서 사람이 후보를 비교·재배치·변형(이동/회전/확대/전단/좌우반전)하고, 비파괴적으로 `curation.json`에 저장한 뒤 bake한다.

## 깊이
- **[component-row]** — 한 장에 모든 포즈를 넣으려 하지 말고 idle·run·attack 등 **상태마다 별도 행(strip)**을 생성하라는 설계. 이미 생성된 `base-source.png`와 `references/layout-guides/<state>.png`를 참조 이미지로 provider에 넘겨 캐릭터 일관성을 유지한다. 저자에 따르면 이 방식이 "얼굴이 매 프레임 달라지는" 문제를 막는다(검증 필요).
- **[chroma alpha · soft-alpha unmix]** — 기존 "peel" 방식은 경계의 반투명 픽셀을 통째로 벗겨내 머리카락 가닥이 사라졌지만, v1.13.0의 soft-alpha unmix는 크로마 색을 알파로 변환하면서 커버리지(불투명도)를 보존한다. pixel art 스타일에서는 **이진화(binarized)** 출력을 별도로 제공해 픽셀 경계를 깔끔하게 유지한다(저자 주장, 비교 이미지 참조).
- **[curation webview]** — 프레임워크 의존 없는 단독 실행 웹뷰. 상태별 두 줄(재생 순서 + 후보 풀) UI에서 드래그로 순서를 바꾸거나 풀에서 컷을 끌어올려 **서로 다른 테이크의 최고 프레임**으로 루프를 재구성한다. 변환은 preview/bake가 **동일한 affine 행렬**을 공유해 WYSIWYG을 보장한다. isometric 세트에서는 `meta.json`의 타일/앵커 정보를 바탕으로 바닥 격자를 덧씌워 가구 배치 축을 맞출 수 있다.
- **[재사용 경로]** — 완성된 시트만 남아 있어도 `unpack_atlas_run.py`로 격자/매니페스트/알파 자동감지를 통해 curator-ready run 디렉터리를 복원할 수 있어, 기존 자산 역수입에도 쓸 수 있다.

## 용어 풀이
- **component-row pipeline** — 스프라이트 시트를 상태별 "행"으로 나누어 생성·처리하는 방식. / 비유: 영화 필름을 장면별로 따로 촬영해 한 릴에 붙이는 것. / 비유가 깨지는 점: 실제 필름과 달리 각 행은 **동일 캐릭터 정체성**을 유지해야 하므로 기반 이미지 참조가 필수.
- **soft-alpha unmix** — 크로마 배경색을 알파 값으로 "분리"하되 경계 픽셀의 반투명 정보를 보존하는 알고리즘. / 비유: 색종이 뒷면을 물에 불려 조심스럽게 떼어내는 것. / 비유가 깨지는 점: 단순 크로마키와 달리 **수학적 unmix**이므로 키 컬러가 전경에 섞인 경우(예: 녹색 의상) 추가 마스킹이 필요할 수 있음(원문에 명시 없음).
- **manifest.json.frame_layout** — 각 프레임의 절대 좌표 사각형과 상태별 fps/루프 플래그를 담은 JSON. / 비유: 스프라이트 시트의 "목차". 엔진은 격자 크기를 가정하지 않고 이 좌표만 따라 샘플링한다.
- **SSoT (Single Source of Truth)** — 수치 정보를 한 파일(`sprite-request.json`)에만 두어 파이프라인 전체가 동일 수치를 참조하게 하는 설계 원칙.

## 시각 자료
| 단계 | 산출물 | 역할 |
|---|---|---|
| 요청 정의 | `sprite-request.json` | 수치 SSoT (프레임 수·크기·상태 목록) |
| 생성 | `<state>.png` 행 이미지 | provider(codex/grok)가 기준+가이드 참조해 생성 |
| 추출 | 투명 프레임 PNG 집합 | 크로마 제거 + connected component 분리 |
| 보정(선택) | `curation.json` | 비파괴 변환·재배치 사이드카 |
| 최종 | `sprite-sheet-alpha.png` + `manifest.json` | 엔진 소비용 아틀라스 + 프레임 레이아웃 |

## 핵심 시사점 / 판단
- **(저자 주장)** ==이미지 생성 모델의 스프라이트 출력 품질 문제는 "한 번의 프롬프트"가 아니라 **파이프라인과 검증 단계**로 해결해야 하며, 특히 행 분리·크로마 unmix·매니페스트가 3대 핵심이다.==
- **(저자 주장)** curation webview는 "90%는 기계, 10%는 사람"이라는 분업을 전제로 하며, 이것이 실제 출시 품질을 만든다.
- **(검증 필요·불확실)** 캐릭터 정체성 유지가 provider의 참조 이미지 기능에 의존하므로, 모델 버전·provider(codex vs grok)에 따라 품질 편차가 있을 수 있음. 원문에 정량 지표는 없음.
- **(검증 필요·불확실)** 순환 애니메이션(walk/run)은 "실험적"으로 표시된다고 하나, motion QA의 구체적 기준은 원문에 명시되지 않음.
- **(경계)** Python 3.10+와 Pillow 의존. CPython 외 배포판에서는 `venv`/`ensurepip` 문제로 quickstart가 실패할 수 있다고 원문이 직접 경고.

## 레퍼런스
- GitHub - aldegad/sprite-gen — https://github.com/aldegad/sprite-gen · (1차) · 프로젝트 저장소 전체(README, 코드, 이슈).
- 아키텍처 문서 — https://github.com/aldegad/sprite-gen/blob/main/docs/architecture.md · (1차) · 파이프라인 전체 구조 상세.
- 생성 CLI 계약(gen.md) — https://github.com/aldegad/sprite-gen/blob/main/docs/gen.md · (1차) · provider CLI와 검증 계약.
- SKILL.md — https://github.com/aldegad/sprite-gen/blob/main/SKILL.md · (1차) · 에이전트 대상 워크플로와 계약.
- hatch-pet (영감 출처, Apache-2.0) — 원문에 링크 없음 · (1차) · component-row 워크플로의 선행 사례(저자 언급).

## 확인 질문
- Q1(전이): component-row 방식은 캐릭터가 아닌 **오브젝트(무기·이펙트)** 아틀라스에도 동일하게 적용되는가, 아니면 상태(state) 개념이 캐릭터 애니메이션에 종속되는가?
- Q2(왜·어떻게): soft-alpha unmix가 **전경에 키 컬러가 포함된 경우**(예: 녹색 숲 배경의 녹색 의상 캐릭터) 어떻게 동작하는지 원문에 설명이 있는가? 없다면 어떤 fallback이 필요한가?
- Q3(경계): provider를 codex/grok之外 모델로 교체할 때 **참조 이미지(reference image) 지원 여부**가 파이프라인의 전제조건인가, 아니면 프롬프트만으로도 동작하는가?

> 출처: https://github.com/aldegad/sprite-gen
