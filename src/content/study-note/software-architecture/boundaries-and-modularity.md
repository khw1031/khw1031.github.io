---
title: "모듈성 원칙과 경계 강제 검사의 대응 관계 정리"
description: "의존 방향을 강제하는 경계 검사가 모듈성 상위 카테고리 아래 관심사 분리·정보 은닉·낮은 결합도·의존성 역전·계층형·안정된 의존성 중 무엇을 지키는지, 검사 자체가 아키텍처 적합성 검사인 이유, exports와 배럴로 나뉘는 캡슐화의 두 층위, 도메인 타입과 계약 타입을 분리하는 목적."
---

> 한 줄: 경계 검사가 파는 것은 정보 은닉 하나가 아니라 **의존 방향의 강제**이며, 그 방향 위에 관심사 분리·정보 은닉·낮은 결합도·의존성 역전·계층형·안정된 의존성이 한꺼번에 올라간다.

## 큰 그림

가장 큰 카테고리는 **소프트웨어 아키텍처의 모듈성(modularity)**이다. 경계 규칙은 그 안의 여러
원칙을 한 번에, 자동으로 지키게 하는 장치다.

```text
모듈성 (modularity)
├─ 관심사 분리     — 역할별로 무엇을 맡나
├─ 정보 은닉       — 안쪽이 바깥 구현을 모르게
├─ 낮은 결합도     — 변경이 옆으로 번지지 않게
├─ 의존성 역전     — 바깥 구현이 안쪽 규칙에 맞추게
├─ 계층형 아키텍처 — 의존은 정해진 방향으로만
└─ 안정된 의존성   — 자주 바뀌는 쪽이 안정된 쪽에 의존
```

허용되는 의존 방향은 한 방향으로만 흐른다.

```text
app → domain
app → adapter → domain
domain ↛ app, adapter
```

## 핵심

일방통행 도로로 보면 된다. 표지판만 세워 두면 급할 때 역주행하는 차가 생기고, 몇 달 뒤에는
역주행이 관행이 된다. **일방통행 표지판이 문서 규칙이고, 진입 차단봉이 경계 검사다.**

메커니즘은 태그별 허용·금지 규칙이다. 각 package에 역할 태그를 붙이고, 태그 사이에 어떤 의존
엣지가 가능한지 선언한다.

```text
domain  deny → [app, shared, adapter]
shared  deny → [app, adapter]
app     (규칙 없음 — 무엇이든 의존 가능)
```

읽는 법은 **화살표는 안쪽으로만 간다**다. `app`은 무엇이든 의존할 수 있고, `domain`은 바깥 역할을
의존할 수 없다. 규칙이 없는 방향은 제한하지 않는다는 점이 중요하다 — `domain deny → [app]`은
`domain → app`만 막고, `app → domain`은 이 규칙이 다루지 않는다.

`domain → adapter`를 허용하면 도메인 코드가 DB·HTTP·프레임워크 같은 구현 세부를 알아야 한다.
그러면 사업 규칙인 domain이 바깥 기술 변화에 함께 흔들린다. 검사가 막는 것이 정확히 그 엣지다.

## 깊이

### 정보 은닉인가 의존 방향인가

"경계 검사가 제약을 거는 이유는 정보 은닉 때문인가"는 부분적으로 맞다. domain이 바깥 계층의
존재와 세부를 모르게 되는 점은 정보 은닉에 가깝다. 하지만 **더 큰 목적은 의존 방향을 강제해서
아키텍처의 역할 분리를 지키는 것**이고, 정보 은닉은 그로부터 얻는 효과 중 하나다.

**(가깝지만 아닌 것) 캡슐화.** 경계 검사가 직접 하는 일은 객체 내부의 필드·메서드를 숨기는
캡슐화가 아니라, **패키지 단위로 "누가 누구를 알아도 되는가"를 제한하는 것**이다. 한 변수만
다르다 — 숨김의 단위가 객체 멤버인지 패키지 표면인지. 그래서 핵심은 "정보를 숨긴다"보다
**의존성 역전·변경 격리·역할 보존**이다. 예를 들어 DB 구현을 바꿔도 domain은 바뀌지 않게 만드는
규칙이다.

### 원칙별로 무엇이 지켜지나

| 원칙 | 이 설정에서의 의미 |
| --- | --- |
| 관심사 분리 (Separation of Concerns) | domain은 사업 규칙, adapter는 외부 기술 연동, app은 실행 흐름을 맡음 |
| 정보 은닉 (Information Hiding) | domain이 DB·HTTP·프레임워크 같은 바깥 구현을 몰라도 됨 |
| 낮은 결합도 (Loose Coupling) | 한 계층의 기술 변경이 다른 계층까지 전파되지 않게 함 |
| 의존성 역전 (Dependency Inversion) | 바깥 구현이 안쪽 규칙에 맞추게 함 — 단, Port/인터페이스를 함께 둘 때 가장 분명해짐 |
| 계층형 아키텍처 (Layered Architecture) | 의존은 정해진 방향으로만 흐르게 함 |
| 안정된 의존성 원칙 (Stable Dependencies Principle) | 자주 바뀌는 app·adapter가 비교적 안정적인 domain에 의존하게 함 |

의존성 역전 줄에 붙은 조건이 중요하다. 방향 규칙만으로는 "domain이 adapter를 모른다"까지고,
**domain이 필요한 능력을 Port로 선언해 소유할 때** 비로소 역전이 완성된다. 태그 규칙은 역전의
전제 조건이지 역전 자체가 아니다.

### 검사 자체의 이름

경계 검사 명령은 이 원칙들을 코드 수준에서 실행하는 **아키텍처 적합성 검사(architecture
conformance checking)**, 또는 **아키텍처 테스트**다. 즉 "좋은 구조를 문서로 약속하는 것"에서
멈추지 않고, 잘못된 import를 CI에서 실패시키는 방식으로 구조를 강제한다. 같은 계열의 도구로
ArchUnit(Java), dependency-cruiser·eslint-plugin-boundaries(JS), NetArchTest(.NET)가 있다.

여기서 지킬 원칙 하나가 더 나온다 — **강제 지점은 늘리되 선언 원본은 늘리지 않는다.** 실제 구성은
"선언 두 곳 + 검증 두 곳"이 아니라 **선언 한 곳 + 검증 명령 두 개**다.

```text
선언(단일 원본): 루트 설정의 태그 규칙 + 각 package의 태그
검증 1: 경계 검사   — package 외부 파일 import / 미선언 의존 / 태그 금지 위반
검증 2: 타입 검사   — exports 밖 접근 (경계 검사는 이것을 못 본다)
```

같은 규칙을 ESLint 등 다른 도구 설정에 복제하지 않는 것이 명시적 제약이다. 복제하면 원본이 둘이
되고, 둘이 어긋나는 순간 어느 쪽이 진짜인지 알 수 없어진다.

### 캡슐화의 두 층위

같은 "정보 은닉"이 서로 다른 두 메커니즘으로 걸린다. 둘은 대체재가 아니라 보완재다.

1. **package 간 경계 — `exports` 필드**가 public surface를 정의한다. `core`가 `"."` 하나만 열면
   `dist/internal/*`는 파일이 실재해도 해석 불가다. **모듈 해석기(resolver) 층위의 강제**다.
2. **package 내부 응집 — `index.ts` 배럴**이 무엇을 재수출할지 고른다. `evaluateHealth`와
   `HealthLevel`만 나가고 내부 상수 `DEGRADED_LATENCY_MS`는 안 나간다. **컴파일러 층위의
   선택**이다.

```text
exports 만 있고 index.ts가 전부 재수출 → 문은 하나인데 문이 아주 넓다(표면 과다)
index.ts 만 좁히고 exports가 열려 있음 → 좁은 문 옆에 뚫린 창으로 우회당한다(경로 우회)
```

한쪽이 빠지면 다른 쪽이 무의미해진다는 점이 이 층위 구분의 요점이다. 그리고 두 번째 층위는
**강제가 아니라 선택**이라는 사실을 놓치면, 배럴만 좁혀 두고 경계가 지켜진다고 믿는 상태가 된다.

### 도메인 타입과 계약 타입의 분리

`HealthLevel`(`'ok' | 'degraded'`)과 `HealthResponse.status`(`'ok' | 'degraded'`)를 **구조적으로
동일하지만 별개 선언**으로 두는 경우가 있다. 지금은 순수한 중복으로 보인다.

의도는 도메인 모델의 변경이 **자동으로 API breaking change가 되지 않도록** 결합을 끊는 것이다.
도메인에 `'unknown'` 상태를 하나 추가하는 순간, 타입이 공유돼 있으면 그 변경이 곧 공개 계약의
변경이 된다. 분리해 두면 도메인은 자유롭게 늘어나고, 계약에 노출할지는 매핑 지점에서 따로
결정한다. 두 축이 다른 속도로 변할 때 이 분리가 값을 내며, 매핑 비용은 양쪽을 아는 단 한 곳
(애플리케이션 계층)이 흡수한다.

**(곁가지) 구조적 타입 시스템의 한계.** TypeScript는 구조적 타입이라 모양이 같으면 서로 대입할 수
있다. 즉 컴파일러가 두 경계를 강하게 구별해 주지는 않고, **타입의 소유 위치와 명시적 매핑 코드로
설계 의도를 표시한 상태**다. 더 강한 구분이 필요하면 branded type 같은 방법이 있지만, 대개 학습
단계에서는 과하다.

## 용어 풀이

- **모듈성(modularity)** — 시스템을 독립적으로 이해·변경 가능한 단위로 나누는 성질. 이 노트의
  모든 원칙이 속하는 상위 카테고리. 깨짐: 파일을 많이 쪼갠 상태와 혼동.
- **관심사 분리(Separation of Concerns)** — 서로 다른 이유로 바뀌는 것을 다른 단위에 두기.
- **정보 은닉(information hiding)** — 바깥이 알 필요 없는 결정을 접근 불가능하게 만들기. 깨짐:
  객체 멤버 수준의 캡슐화와 동일시.
- **캡슐화(encapsulation)** — 객체 내부 상태와 표현을 인터페이스 뒤로 감추기. 경계 검사가 하는
  일이 아니다.
- **낮은 결합도(loose coupling)** — 한쪽 변경이 다른 쪽 변경을 강제하지 않는 정도.
- **의존성 역전(Dependency Inversion)** — 고수준이 인터페이스를 소유해 의존 방향을 뒤집기. 깨짐:
  방향 규칙만으로 완성됐다고 판단 — Port 선언이 함께 있어야 한다.
- **안정된 의존성 원칙(Stable Dependencies Principle, SDP)** — 의존은 자기보다 더 안정된 쪽을
  향해야 한다. 깨짐: 안정 = 좋음으로 읽기. 여기서 안정은 "바꾸기 어렵다"는 뜻이다.
- **아키텍처 적합성 검사(architecture conformance checking)** — 선언된 구조 규칙을 실제 코드에
  대해 자동 검증하는 것. 아키텍처 적합성 함수(fitness function)의 한 종류.
- **공개 표면(public surface)** — 바깥에서 접근 가능한 API의 전체 범위. `exports` + 배럴 재수출의
  교집합으로 결정된다.
- **배럴(barrel)** — 여러 모듈을 한 파일에서 재수출하는 `index.ts` 관행. 깨짐: 강제 장치로 착각.
- **계약 타입(contract type)** — 프로세스·서비스 경계를 넘는 데이터의 공개 선언. 도메인 타입과
  구조가 같아도 별개 선언으로 두는 이유는 변경 속도가 다르기 때문이다.

## 확인 질문

1. 태그 규칙에 `domain deny → [app, adapter]`만 있고 domain 안에 Port 인터페이스가 하나도 없다면,
   여섯 원칙 중 아직 성립하지 않은 것은 무엇인가?
   <details><summary>답</summary>의존성 역전이다. 방향 금지만으로는 "domain이 바깥을 모른다"까지고, domain이 필요한 능력을 인터페이스로 선언해 소유해야 바깥 구현이 안쪽 규칙에 맞추는 역전이 완성된다.</details>
2. `exports`를 `"."` 하나로 좁혀 뒀는데 `index.ts`가 내부 모듈 전부를 `export *`로 재수출하고
   있다. 무엇이 무너졌나? <details><summary>답</summary>문은 하나지만 공개 표면이 내부 전체로 넓어졌다. resolver 층위의 강제는 살아 있지만 컴파일러 층위의 선택이 빠져, 내부 상수·보조 함수까지 외부 계약이 되어 버린다 — 이후 그것들을 고치면 바깥이 깨진다.</details>
3. (본문 밖) 경계 규칙을 루트 설정에 선언해 두고, 같은 내용을 ESLint import 규칙으로도 한 번 더
   적어 두면 무엇이 나빠지나? <details><summary>답</summary>선언 원본이 둘이 된다. 강제 지점을 늘리는 것은 이득이지만 원본을 늘리면 두 선언이 어긋날 때 어느 쪽이 진짜 규칙인지 판단할 수 없고, 규칙을 바꿀 때마다 두 곳을 맞춰야 한다. 원본은 하나로 두고 검증 명령만 여러 개 두는 것이 맞다.</details>

## 근거

- 학습 세션 실측: 태그 denylist로 선언된 의존 규칙(`domain deny → [app, shared]`,
  `shared deny → [app]`), 각 package의 `dependencies`가 그 규칙을 실현하는 방식,
  `core`의 `exports`가 `"."` 하나만 여는 구성과 배럴이 내부 상수를 내보내지 않는 구성,
  도메인 `HealthLevel`과 계약 `HealthResponse.status`를 별개 선언으로 둔 주석 —
  `turborepo-platform-lab` M01 정독(2026-08-09) 및 경계 규칙 해석(2026-08-14).
- [Turborepo boundaries 문서](https://turborepo.dev/docs/reference/boundaries) — 태그 기반 의존
  규칙 검사의 동작. 1차 출처(공식 문서).
- Neal Ford·Rebecca Parsons·Patrick Kua, *Building Evolutionary Architectures* — architectural
  fitness function. David L. Parnas(1972) — 정보 은닉. Robert C. Martin, *Clean Architecture* —
  SDP·ADP·ASP와 Dependency Rule.
- 위 외부 출처는 2026-08-09·08-14 학습 세션에서 인용된 것이며, 이 노트를 쓰며 다시 열어 확인하지는
  않았다.

## 관련 개념

- 앞: [모듈러 모놀리스의 개발 단위와 배포 단위 구분 정리](/study-note/software-architecture/modular-monolith/) — 왜 경계를 강제해야 하는지의 이론적 배경.
- 관련: [Turborepo 패키지 경계 검사](/study-note/turborepo/boundaries/) — 태그 규칙과 검사 명령의 실제 동작.
- 관련: [Core–Port–Adapter의 역할 분담과 의존성 역전 정리](/study-note/software-architecture/hexagonal-core-port-adapter/) — 방향 규칙 위에 Port를 얹어 역전을 완성하는 형태.
- 관련: [경계에서의 입력 검증 위치 판정](/study-note/software-architecture/validation-at-boundary/) — 같은 경계에서 데이터를 어디서 검증할지의 문제.
- 뒤: [모노레포 패키지 구조 설계](/study-note/software-architecture/monorepo-package-structure/) — 규칙을 만족하는 package 배치와 태그 부여.
