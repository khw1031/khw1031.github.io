---
title: 'Balatro 스타일 카드 게임의 AI 기반 구현 구상'
pubDate: '2026-07-18T21:35:20+09:00'
description: 'Balatro 같은 로그라이크 덱빌딩 포커 카드 게임을 AI를 활용해 구현해보려는 아이디어 (인박스 캡처)'
summary: 'Balatro 같은 로그라이크 덱빌딩 포커 카드 게임을 AI를 활용해 구현해보려는 아이디어 (인박스 캡처)'
lang: ko
tags:
  - 'idea-inbox'
  - 'balatro'
  - 'card-game'
  - 'ai-game'
  - 'deckbuilder'
lintHash: 'db1243100af0'
---

## 아이디어

Balatro는 포커 핸드 기반의 로그라이크 덱빌딩 게임으로, 조커 카드를 조합해 점수를 극대화하는 구조가 핵심이다. 이 아이디어는 이와 유사한 카드 게임을 AI 기술로 구현해보겠다는 구상이다.

'AI로 구현'의 범위는 여러 가지로 해석될 수 있다: AI가 게임 규칙·카드를 프로시저럴 생성하는 것, AI가 플레이어 상대로 적응형 전략을 구사하는 것, 혹은 AI가 덱 빌딩 전략을 추천·평가하는 도우미 역할 등. 어느 쪽이든 Balatro의 간결하면서도 깊이 있는 게임 디자인을 출발점으로 삼고 있다는 점이 흥미롭다.

## 더 해볼 질문

- AI가 어떤 역할을 맡는가? (적 AI, 콘텐츠 생성, 전략 도우미 중 어떤 것인가)
- 포커 핸드 기반 메커닉을 그대로 쓸 것인가, 아니면 다른 카드 조합 체계로 변형할 것인가
- 로그라이크 구조(랜덤성+영구죽음)를 유지할 것인가, 다른 진행 방식으로 바꿀 것인가
- 타깃 플랫폼은 무엇인가 (웹, 모바일, 데스크톱)
- Balatro의 조커 카드처럼 게임성을 변형하는 메타 시스템(업그레이드, 패시브 등)을 어떻게 설계할 것인가

## 레퍼런스·서비스

_확인일 2026-07-18. 후보 URL을 실제 fetch해 검증한 빠른 스캔 — 깊은 1차 검증은 하지 않음._

- **[Balatro](https://www.playbalatro.com/)** — (1차) · 포커 핸드 기반 로그라이크 덱빌더 원본 게임 공식 사이트. Steam·Switch·PlayStation·Xbox 등 멀티 플랫폼 출시 확인.
- **[Slay the Spire (Mega Crit)](https://www.megacrit.com/)** — (1차) · 로그라이크 덱빌더 장르 대표작 개발사 페이지. "Craft a unique deck, encounter bizarre creatures" 등 핵심 구조 설명 확인, Slay the Spire 2 공개.
- **[I tried every Balatro-like game I could find in Next Fest AGAIN](https://nosmallgames.com/2025/06/i-tried-every-balatro-like-game-i-could-find-in-steam-next-fest-again/)** — (2차) · No Small Games 팟캐스트에서 2025년 6월 Steam Next Fest Balatro 유사작을 종합 리뷰한 포스트.
- **[The Best Deck Builders of 2024 — Game Wisdom](https://www.youtube.com/watch?v=tHuXTdcTvH0)** — (2차) · 2024년 최고의 덱빌더 게임 선정 YouTube 영상. Mech Shuffle, Dicefolk, Demon's Mirror 등 비교 대상 목록 포함.
- **[Let's Play: BALATRO — Broyar](https://www.youtube.com/watch?v=8Rtp4Q5WAVM)** — (2차) · Balatro 실황 플레이 영상. "illegal poker hands, game-changing jokers, outrageous combos" 등 공식 설명 인용 확인.
- **[Indie & Roguelike Deck Builders on Live Streaming](https://streamhatchet.com/blog/indie-roguelike-deck-builders-on-live-streaming/)** — (2차) · Stream Hatchet 블로그, 인디·로그라이크 덱빌더의 라이브 스트리밍 생태계 분석. (내용 미확인 — 발췌에 쿠키 동의문만 노출되어 본문 확인 불가)
- **[This is the First Deckbuilding Roguelike to Utilize AI — Olexa](https://www.youtube.com/watch?v=cK04TBmx7IA)** — (2차) · AI를 도입한 덱빌딩 로그라이크 *Verses of Enchantment* 소개 영상. AI 기반 구현 레퍼런스로 직접 관련.
