---
title: "NestJS 조립·주입 구조 개념 정리"
description: "DI 컨테이너와 Provider, 설정에 따라 구성표를 만드는 Dynamic Module, 오류를 HTTP 상태로 번역하는 Exception Filter까지 — NestJS가 객체를 조립하고 경계를 지키는 방식을 다루는 학습 노트 허브."
---

NestJS를 다루며 정리한 개념 노트 모음이다. 관심의 중심은 문법이 아니라 **누가 객체를 만들고, 무엇을 꽂을지 언제 정하며, 안쪽 오류를 어디서 바깥 언어로 번역하는가**다. 세 노트가 그 순서대로 이어진다 — DI 컨테이너가 조립을 대신 맡고(`DI 컨테이너와 Provider`), Dynamic Module이 그 조립표를 설정에 따라 만들고(`Dynamic Module`), Exception Filter가 조립·도메인 오류를 HTTP 계약으로 옮긴다(`Exception Filter`).

여기 나오는 것 대부분은 NestJS 고유 발명이 아니라 **일반 패턴의 프레임워크별 표현**이다. Provider 등록은 DI 컨테이너 개념의 Nest 문법이고(Spring의 Bean, Angular의 Provider, ASP.NET Core의 Service 등록과 같은 계열), Port/Adapter와 계층 책임은 [Core–Port–Adapter의 역할 분담과 의존성 역전](/study-note/software-architecture/hexagonal-core-port-adapter/), [Controller·Application Service·Core의 책임 배분과 오류 번역](/study-note/software-architecture/layer-responsibility/) 쪽 노트가 원본이다. 그래서 Nest 용어가 어렵게 느껴질 때는 프레임워크 문법을 더 파기보다 그 아래 일반 패턴을 먼저 세우는 편이 빠르다.

읽는 순서는 **DI 컨테이너와 Provider → Dynamic Module → Exception Filter**를 권한다. 앞 노트가 "Nest 없이 세 줄"로 구조의 본체를 먼저 보이고, 뒤 노트들이 그 위에 설정 시점과 오류 경계를 얹는 구성이다. 아래 목차 참고.
