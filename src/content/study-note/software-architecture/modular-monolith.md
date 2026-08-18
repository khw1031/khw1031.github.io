---
title: "모듈러 모놀리스의 개발 단위와 배포 단위 구분 정리"
description: "코드를 어떻게 나누는가(module structure)와 무엇을 한 덩어리로 배포하는가(allocation structure)를 다른 구조로 취급하는 이론적 근거, 폴더가 경계가 아닌 이유(Parnas의 접근 불가능성), architecture quantum과 정적·동적 결합, 앱 하나 + 서비스별 package 구성을 권하는 논거, LLM 코딩에서 디렉토리와 package의 차이."
---

> 한 줄: **"코드를 어떻게 나누나"와 "무엇을 한 덩어리로 배포하나"는 서로 다른 구조**이며, 폴더가 경계가 아닌 이유는 은닉의 기준이 의도가 아니라 **접근 불가능성**이기 때문이다.

## 큰 그림

같은 시스템 하나를 두고 도면을 세 장 그린다고 보면 된다.

| 도면 | 무엇을 보나 | 이름 |
| --- | --- | --- |
| 평면도 | 방이 어떻게 나뉘어 있나 | module structure (개발 단위) |
| 배관·전기 계통도 | 무엇이 무엇과 이어져 흐르나 | component-and-connector (런타임·프로세스) |
| 지적도·주소 | 이 집이 어느 필지·건물에 놓였나 | allocation structure (배포 단위) |

세 장은 **층(layer)이 아니라 뷰(view)**다. 집은 한 채고 도면이 세 장이다. 그래서 맞는 질문은
"몇 층인가"가 아니라 "지금 **어느 도면**을 보고 있나"다.

이 구분이 실제로 갈리는 자리는 서비스 여러 개를 담는 방법의 선택이다.

```text
(a) 서비스별로 앱·배포를 분리       → 평면도 N칸, 지적도 N개
(b) 앱 하나 + 서비스별 package     → 평면도 N칸, 지적도 1개
(c) 앱 하나 안에서 폴더로만 분리    → 평면도 0칸(라벨만), 지적도 1개
```

## 핵심

집으로 바꿔 보면 한 번에 잡힌다.

- **커튼으로 나눈 방** = 폴더(`src/billing/`, `src/search/`). 나뉘어 보이긴 한다. 그런데 아무나
  걷고 지나간다. 지키는 건 예의뿐이다.
- **잠긴 문이 달린 방** = package + `exports`. 열어 준 문으로만 들어온다. 나머지는 진짜로 못
  들어온다.
- **건물** = 배포 단위. 방을 몇 개로 나눴든, 정전되면 **모든 방이 같이 어둡다.**

여기서 세 문장이 따라 나온다.

1. **방 나누기와 건물 세기는 다른 질문이다.** 방 5개를 한 건물에 둘 수도, 5개 건물에 하나씩 둘
   수도 있다. 둘을 하나로 착각하는 것이 가장 흔한 실수다.
2. **커튼은 방을 나눈 것이 아니다.** → 폴더는 경계가 아니다.
3. **문을 잠가도 정전은 같이 당한다.** → 패키지 경계는 고장 격리를 주지 않는다.

메커니즘은 Parnas의 정의에서 나온다. 모듈은 **무엇을 숨기는가**로 정의되고, 숨겼다는 주장은
**다른 쪽이 손을 못 넣는다는 사실**로만 증명된다. 폴더는 아무도 막지 않으니 증명할 것이 없고,
그래서 이론상 모듈이 아니다. `exports`나 import 검사가 하는 일은 그 "막혔다"를 실제로 만들어 주는
것뿐이다.

돌아가는 최소 예시는 manifest 한 줄이다.

```json
{
  "name": "@platform/core",
  "exports": { ".": "./dist/index.js" }
}
```

`dist/internal/*.js`가 파일로 실재해도 다른 package에서 그 경로를 import하면 **모듈 해석이
실패한다.** 컨벤션 위반이 아니라 빌드 실패다. `src/billing/`은 이 검사를 통과하지 못한다 —
아무나 import할 수 있으니 숨긴 것이 없다.

## 깊이

### 개발 단위와 배포 단위를 가르는 어휘

- **아키텍처 구조 3분류** — Bass·Clements·Kazman의 *Software Architecture in Practice*(SEI)가
  module / component-and-connector / allocation 셋으로 나눈다. 핵심 주장은
  **module structure와 allocation structure가 동형(isomorphic)일 필요가 없다**는 것이다. 이
  책은 애초에 "구조는 여러 개이며 하나의 그림으로 합칠 수 없다"에서 출발한다.
- **4+1 view model** — Kruchten(1995)의 같은 얘기. Development view(모듈·소스 조직)와
  Physical/Deployment view(배포 토폴로지)가 별개 뷰로 잡혀 있고, **뷰가 나뉘어 있다는 사실
  자체가 "같을 필요 없다"는 주장**이다.
- **Component = unit of deployment** — Robert C. Martin의 *Clean Architecture*가 component를
  "배포 가능한 최소 단위"로 정의한다. 소스 조직과 배포 단위를 어휘 수준에서 분리한다.
- **Architecture quantum** — Richards·Ford의 용어로 "독립 배포 가능하고 기능적 응집도가 높으며
  내부가 동기적으로 결합된 산출물". (a)는 양자 N개, (b)는 양자 1개다.
- **정적 결합과 동적 결합** — static coupling은 부팅에 필요한 것, dynamic coupling은 런타임
  호출이다. "package 경계는 빌드타임 개념"이라는 말의 정식 표현이 이 구분이다.
- **Bounded Context는 배포 단위가 아니다** — Evans의 Bounded Context는 **말이 통하는 범위**(같은
  용어가 같은 뜻인 영역)이고, 배포 단위는 **같이 나가는 범위**다. Bounded Context 3개를 한
  건물에 넣는 것은 완전히 정상이며, DDD에서 가장 흔한 오독이 "bounded context = 서비스 =
  컨테이너"다.

### 왜 층이 아니라 뷰인가

층이라면 아래가 위를 결정해야 한다. 그런데 이 셋은 서로를 결정하지 않는다. package 5개를 프로세스
1개에 넣고 이미지 1개로 배포할 수도 있고, 같은 5개를 프로세스 5개·이미지 5개로 흩을 수도 있다.
**그 매핑 자체가 설계 결정**이며, 자유도가 있다는 것이 곧 층이 아니라는 증거다.

**(가깝지만 아닌 것) 레이어드 아키텍처.** "레이어"는 아키텍처에서 이미 다른 뜻이 확고하다 —
presentation / domain / data처럼 쌓는 layered architecture. 다른 점은 하나다. 그 레이어들은
**module structure 안에서** 코드를 나누는 한 가지 스타일이며, 세 도면과 나란히 있는 것이 아니라
**첫 번째 도면 안에 들어간다.** `domain`/`shared`/`app` 같은 태그도 전부 첫 번째 도면 얘기다.

셋을 고정 개수로 외우는 것도 오해다. SEI의 셋은 **범주**이고 각 범주 안에 여러 구조가 들어간다 —
allocation 안에도 deployment / work assignment / implementation이 따로 있다. Kruchten은 같은
것을 5개 뷰로 자른다. 개수는 관점의 문제고, 변하지 않는 핵심은 "**하나의 그림으로 합칠 수 없다**"다.

### 폴더가 경계가 아닌 이유의 파생 개념

- **REP (Reuse/Release Equivalence Principle)** — "재사용의 granule은 릴리스의 granule이다."
  독립적으로 쓰일 단위라면 공개 표면과 식별자를 가진 릴리스 단위여야 하고, 폴더는 그것이 될 수
  없다.
- **논리적 분리 vs 강제된 분리** — 그림에서만 나뉜 것과 컴파일러가 막아 주는 것은 다르다.
  Simon Brown이 모듈러 모놀리스 강연에서 반복하는 구분이다.
- **명시적 모듈 인터페이스** — Java 9 JPMS의 `module-info.java`(`exports`/`requires`), .NET
  어셈블리의 `internal`, Rust crate의 `pub`, OSGi bundle이 전부 같은 설계다. `package.json`의
  `exports` + 선언된 dependencies는 **JS 생태계의 같은 물건**이다.
- **아키텍처 침식(architectural erosion / drift)** — Perry & Wolf(1992). 설계된 아키텍처와 실제
  코드가 갈라지는 현상이며, 강제 장치가 없는 경계의 기본 운명이다.

### (b)를 권하는 논거

사려는 상품이 무엇인지 먼저 정하면 답이 나온다. **(b)를 권하는 이유는 지금 사려는 상품이
변경 가능성(modularity) 하나이기 때문이다.** (c)는 그것을 못 사고, (a)는 그것을 사려고 분산을
끼워 산다.

1. **무엇을 사려는지 정한다.** Parnas가 모듈을 정보 은닉으로 정의한 목적은 처음부터 **변경의
   국소화**였다 — 바뀔 것 같은 결정을 모듈 안에 가두어 고칠 곳이 하나가 되게 한다. 분산이 파는
   상품은 다르다: 독립 스케일링, 장애 격리, 독립 배포 주기, 이질적 런타임. 두 상품은 이름만
   비슷하고 같은 물건이 아니다.
2. **(c)는 그 상품을 못 산다.** 같은 package 안의 폴더는 누구나 손을 넣을 수 있으므로 숨긴 것이
   없다. (c)는 모듈성을 샀다고 **믿는** 상태이고 실제 잔고는 0이다. 더 나쁜 것은 믿고 있어서
   확인하지 않는다는 점이다.
3. **(a)는 끼워팔기다.** architecture quantum이 N개가 되는 순간 네트워크·부분 실패·재시도·
   타임아웃·최종 일관성이 함께 들어오고, 이것들은 인프라에 머물지 않고 **도메인 코드로 스며든다.**
4. **결제는 되돌리기 어렵다 — 비대칭이 결정을 만든다.** (b)→(a)는 싸다. 경계가 이미 강제돼
   있으면 배포 단위를 쪼개는 일은 **조립 지점을 옮기는 일**이다. 반대 방향은 비싸다 — 코드에
   스며든 네트워크 전제를 걷어내야 한다. 비가역성이 큰 결정을 늦출수록 결정 시점의 정보는 늘어난다.
5. **왜 하필 지금 (b)가 싼가.** 고전 component 이론에서 경계는 공짜가 아니었다. REP가 말하는
   대로 경계를 하나 만들면 **버전·릴리스 주기·배포 조율**이 딸려 왔고, "패키지로 쪼개면 관리가
   늘어난다"는 걱정은 그 시절엔 정당했다. monorepo의 `workspace:*`가 그 묶음을 끊었다 — 독립
   릴리스 없이 **강제되는 경계만** 떼어 온다. 거기에 CI에서 도는 경계 검사가 유지 비용마저
   자동화로 옮겼다. 경계의 두 대가가 모두 사라졌으므로 (b)의 가격은 지금이 가장 낮다.

**(a)와 (b)는 한 변수만 다르다** — 배포 단위의 개수. 모듈 경계, 도메인별 분리, 의존 방향 규칙은
양쪽이 동일하다. 그래서 "마이크로서비스냐 모놀리스냐"는 아키텍처 스타일의 대립이 아니라
**배포 결정 하나**다. 이렇게 좁히면 (a)를 고를 정당한 이유가 셋으로 정리된다 — 독립 스케일링,
장애 격리, 이질적 런타임. 셋 다 해당 없으면 (a)는 이득 없는 비용이다.

여기에 조직 축이 하나 더 붙는다. allocation structure 안에는 **work assignment**가 들어 있고,
이것이 Conway's Law와 *Team Topologies*의 영역이다. 실무에서 (a)를 고르는 진짜 이유는 기술이
아니라 팀이 나뉘어 있어서인 경우가 많다. 개인 프로젝트에서는 이 압력이 0이므로 (a)를 고를 이유가
하나 통째로 사라진다.

### 흔히 잘못 이해하는 지점

**"나눴으니 안전해졌다".** 패키지로 잘 쪼개고 나면 격리까지 얻은 것처럼 느껴진다. 실제로 얻은
것은 **바꾸기 쉬움** 하나다. 한 프로세스에 같이 살면 메모리·이벤트 루프·DB 커넥션을 공유하니
하나가 무너지면 같이 무너진다. 이 오해가 생기는 이유는 "경계"라는 한 단어가 빌드타임 경계와
런타임 경계를 같이 덮어 버리기 때문이다. **(b)가 파는 것은 변경 가능성이고, 가용성은 (a)에서만
판다.**

**"모듈러 모놀리스는 마이크로서비스로 가는 중간 단계다".** 아니다. 종착지여도 된다. 중간
단계로만 보면 (b)의 설계를 임시변통으로 다루게 된다.

**"패키지로 나눠 뒀으니 나중에 쪼개기 쉽다".** 자동이 아니다. 서비스 간 통신을 동기 함수 호출로
두면 쪼개는 순간 그 호출이 전부 네트워크가 되어 **분산 모놀리스**가 된다. (b)에서 미리 갚아 둘
것은 경계가 아니라 **호출의 형태**다 — 계약을 통한 통신, 서비스 간 트랜잭션 금지, 남의 데이터
직접 읽지 않기.

### LLM 코딩에서는 디렉토리 분리가 더 중요하지 않나

충돌하지 않는다. 오히려 그 관찰이 package로 승격할 이유를 하나 더 보탠다. **디렉토리는
신호(signal)이고 package는 신호 + 강제다.** 원래 주장은 "디렉토리를 나누지 말라"가 아니라
"디렉토리만으로는 경계라고 부를 수 없다"였다.

| | 디렉토리만 | package (디렉토리 + manifest + 검사) |
| --- | --- | --- |
| 읽는 쪽에 구조를 알려주나 | 예 | 예 |
| 넘어가면 막히나 | 아니오 | 예 |
| 시간이 지나도 사실로 남나 | **아니오** | 예 |

세 번째 줄이 핵심이다. 강제가 없는 신호는 **썩는다.** 6개월 뒤 `src/billing/`이
`src/search/internal/`을 세 군데서 import하고 있으면, 그 디렉토리 구조는 이제 **거짓말하는
라벨**이다. 그리고 LLM은 그 거짓 라벨을 그대로 믿고 다음 코드를 쓴다 — 사람보다 더 순진하게.
이것이 architectural erosion이고, 강제 장치의 존재 이유가 정확히 그것이다.

LLM 코딩에서 package가 오히려 더 유리한 이유는 셋이다.

1. **프롬프트 예산이 0이 된다.** 폴더로만 나누면 규칙이 `AGENTS.md`에 텍스트로 살아야 한다 —
   "billing에서 search 내부를 import하지 마라". 이것은 매 세션 토큰을 먹고, 컨텍스트가 길어지면
   잊히고, 어겨도 아무 일이 안 일어난다. package 경계는 도구가 강제하니 프롬프트에 한 글자도
   안 쓴다. **LLM은 지침을 잊지만 실패하는 명령은 못 무시한다.**
2. **`exports`가 곧 LLM용 요약 인터페이스다.** public surface가 함수 하나 + 타입 하나뿐이라는
   것을 `dist/index.d.ts` 두 줄로 안다. 폴더였다면 "여기서 뭘 부를 수 있나"를 알려고 `src/`
   전체를 훑어야 한다. `package.json`의 dependencies도 같은 일을 한다 — **"이 코드가 볼 수 있는
   세계"의 확정된 목록**이라 탐색 범위를 추측하지 않는다. 컨텍스트 절약은 부수 효과고 본질은
   **추측 제거**다.
3. **틀린 편집이 즉시 되돌아온다.** 경계를 넘는 import를 쓰면 typecheck와 경계 검사가 그 자리에서
   틀렸다고 말한다. 자율적으로 도는 에이전트에게 이것은 리뷰어보다 값싼 교정 루프다.

경로가 곧 컨텍스트 라벨이라는 직관에도 이름이 있다 — **architecturally-evident coding
style**(Simon Brown), **screaming architecture**(Robert C. Martin). 코드 구조를 보면 아키텍처가
들려야 한다는 주장이며 LLM 시대에 값이 오른 원칙이다. 다만 이 원칙이 요구하는 것은 "폴더를
나누라"가 아니라 "**구조가 사실이게 하라**"다.

**(정직한 반대편 비용)** package 승격은 무료가 아니다. package마다 `package.json`·`tsconfig`·
`turbo.json`이 붙고, 빌드 단계가 생기고, 한 기능을 고치려고 여러 package를 오가야 할 수 있다.
서비스가 2~3개고 경계가 아직 흐릿하면 폴더로 두고 **경계가 안정된 뒤 승격**하는 것이 낫다.
순서를 뒤집으면 잘못된 자리에 콘크리트를 붓게 된다.

### 없었다면 발명됐을까

재발명된다. 서로 다른 생태계가 독립적으로 같은 물건을 만들어 냈다 — JPMS의 `exports`/`requires`,
OSGi bundle, .NET의 `internal`, Rust의 `pub`/crate, Spring Modulith, 그리고 `package.json`의
`exports`. 문제 구조(변경은 국소화하고 싶다 + 네트워크는 비싸다)가 강제하는 형태다. 반대로
**"모듈 하나 = 배포 단위 하나"라는 묶음은 필연이 아니라** 컨테이너·클라우드 시기의 역사적 관행에
가깝다.

## 용어 풀이

- **모듈러 모놀리스(modular monolith)** — 한 배포 단위 안에 강제된 모듈 경계 여러 개를 두는 구성.
  별칭 modulith(Spring Modulith), majestic monolith(DHH). 깨짐: 마이크로서비스로 가는 중간
  단계로만 취급.
- **정보 은닉(information hiding)** — Parnas(1972). 모듈을 "무엇을 숨기는가"로 정의하며, 기준은
  의도가 아니라 접근 불가능성이다. 깨짐: 객체 필드를 숨기는 캡슐화와 동일시.
- **아키텍처 양자(architecture quantum)** — 독립 배포 가능하고 내부가 동기적으로 결합된 산출물.
  깨짐: 모듈 개수와 양자 개수를 같은 수로 가정.
- **정적 결합 / 동적 결합(static / dynamic coupling)** — 부팅에 필요한 의존 / 런타임 호출 의존.
  깨짐: 정적 결합을 끊으면 런타임도 격리됐다고 오해.
- **모듈 구조 / 배치 구조(module / allocation structure)** — 코드의 정적 분할 / 환경 배치. 깨짐:
  동형이어야 한다고 가정.
- **REP(Reuse/Release Equivalence Principle)** — 재사용 단위는 릴리스 단위여야 한다. 깨짐:
  monorepo의 `workspace:*`에도 그대로 적용된다고 가정.
- **아키텍처 적합성 함수(architectural fitness function)** — Ford·Parsons·Kua. 아키텍처 특성을
  자동으로 지키는 객관적 검사. 깨짐: 문서로 약속한 규칙을 fitness function이라 부름.
- **아키텍처 침식(architectural erosion)** — 설계와 실제 코드가 갈라지는 현상(Perry & Wolf, 1992).
- **의존 규칙(Dependency Rule)** — 의존은 항상 안쪽으로. Hexagonal·Onion·Clean이 모두 같은 규칙의
  변형이고, 컴포넌트 수준으로 올리면 ADP(순환 금지)·SDP(안정된 쪽으로)·SAP(안정된 것은 추상적)다.
- **분산 모놀리스(distributed monolith)** — 배포는 쪼개졌지만 동기 호출로 얽혀 있어 독립 배포가
  불가능한 상태.

## 확인 질문

1. 서비스를 전부 package로 쪼개고 경계 검사도 초록불인데, 한 서비스에 무한 루프 버그가 들어갔다.
   나머지 서비스는 계속 응답하나? <details><summary>답</summary>아니다. package 경계는 빌드타임 경계이고 배포 단위는 하나이므로 architecture quantum이 1개다. 같은 프로세스의 이벤트 루프를 막으면 전부 같이 멈춘다 — 정적 결합만 끊겼고 동적·자원 결합은 그대로다.</details>
2. `packages/service-billing`을 새로 만들고 `apps/api`가 그것을 import하게 했다. 도면 세 장 중
   무엇이 바뀌고 무엇은 그대로인가? <details><summary>답</summary>평면도(module structure)만 바뀐다. 프로세스는 여전히 하나이므로 계통도(C&C)는 그대로이고, 배포 이미지도 그대로이므로 지적도(allocation)도 그대로다.</details>
3. (본문 밖) `AGENTS.md`에 "billing은 search 내부를 import하지 말 것"이라고 적는 것과, `search`를
   package로 만들어 `exports`를 좁히는 것 — 6개월 뒤 둘 중 무엇이 여전히 지켜지고 있을까?
   <details><summary>답</summary>후자다. 문서 규칙은 강제가 없어 어겨도 아무 일이 안 생기고 컨텍스트가 길어지면 잊힌다(신호만 있고 강제가 없으니 썩는다). `exports`를 넘는 import는 모듈 해석이 실패하므로 빌드가 통과하는 한 규칙이 사실로 유지된다.</details>

## 근거

- 학습 세션 실측: `exports`로 public surface를 좁히고 태그 기반 경계 검사로 의존 방향을 강제하는
  구성에서, `apps/api` 하나에 서비스를 여러 개 둘 때의 (a)/(b)/(c) 비교 —
  `turborepo-platform-lab` M01 검토(2026-08-08).
- David L. Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules"(1972) —
  정보 은닉으로 모듈을 정의한 1차 출처. 15쪽.
- Bass·Clements·Kazman, *Software Architecture in Practice*(SEI) — module / C&C / allocation
  3분류. Philippe Kruchten, "Architectural Blueprints — The 4+1 View Model"(1995).
- Neal Ford·Mark Richards, *Fundamentals of Software Architecture* / *Software Architecture: The
  Hard Parts* — architecture quantum, 정적·동적 결합.
- Sam Newman, *Monolith to Microservices* 1~3장 — 독립 배포성의 값을 따지는 방법.
  Martin Fowler, [MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html)(2015).
- Neal Ford·Rebecca Parsons·Patrick Kua, *Building Evolutionary Architectures*(2017) —
  architectural fitness function. Perry & Wolf(1992) — architectural erosion.
- [Spring Modulith](https://spring.io/projects/spring-modulith) — 같은 아이디어의 Java 구현체.
  한 배포 단위 안에서 모듈 경계를 선언하고 테스트로 검증한다.
- 위 외부 출처는 2026-08-08 학습 세션에서 이름으로 인용된 것이며, 이 노트를 쓰며 다시 열어
  확인하지는 않았다.

## 관련 개념

- 뒤: [모듈성 원칙과 경계 강제 검사의 대응 관계](/study-note/software-architecture/boundaries-and-modularity/) — 여기서 나온 원칙들이 어떤 검사로 강제되는지.
- 뒤: [모노레포 패키지 구조 설계](/study-note/software-architecture/monorepo-package-structure/) — (b)를 실제 디렉토리·manifest로 배치하는 방법.
- 관련: [Turborepo 패키지 경계 검사](/study-note/turborepo/boundaries/) — 태그 규칙으로 의존 방향을 강제하는 도구 쪽 동작.
- 관련: [Core–Port–Adapter의 역할 분담과 의존성 역전 정리](/study-note/software-architecture/hexagonal-core-port-adapter/) — Dependency Rule을 코드 층위에서 구현한 형태.
