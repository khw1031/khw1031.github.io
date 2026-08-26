
> 한 줄: 폴더는 **어디를 봐야 하는지 알려주는 지도**일 뿐이고 경계 자체는 package 이름·`exports`·boundary 검사·AGENTS.md가 강제한다 — 그래서 배치는 "함께 변경되는 코드를 가까이 두고, 독립적으로 보호할 필요가 생긴 경계만 package로 올린다"로 결정한다.

## 큰 그림

```text
규모 ─────────────────────────────────────────────────────────►

flat + 이름 규약            소유 경계별 그룹              별도 workspace·저장소
packages/                   packages/                      (릴리스 주기·도구 체인·
  core/                       backend/                      접근 권한까지 독립일 때만)
  contracts/                  frontend/
  adapter-echo/               contracts/
  adapter-http/               tooling/
```

## 핵심

도시의 주소 체계와 같다. 집이 열 채면 번호만 붙여도 찾는다. 수백 채가 되면 동·구를 나눈다. 그런데
**동을 나눴다고 남의 집에 못 들어가는 것은 아니다** — 들어가지 못하게 하는 것은 담과 잠금장치다.
폴더 그룹화는 동 이름이고, 경계 강제는 담이다. 둘을 같은 것으로 착각하면 "구조를 잘 나눴는데 왜 여전히
아무 데서나 import되지?"에 답할 수 없다.

작은 실습의 평평한 구조는 적은 수의 package로 의존 방향을 선명하게 보기 위한 기준선이다.

```text
packages/
  core/
  contracts/
  adapter-echo/
  adapter-http/
```

헥사고날 아키텍처가 요구하는 것은 이 디렉터리 모양이 아니라 다음 방향뿐이다.

```text
Adapter ──의존──> Core가 소유한 Port
Core    ──의존하지 않음──> Adapter
```

따라서 폴더를 중첩하거나 Adapter 여럿을 같은 package에 묶어도 이 방향만 지키면 된다.

## 깊이

**두 갈래: flat + 이름 규약 vs 도메인별 중첩(필수).** `pnpm-workspace.yaml`이 `packages/*`이기도
하고, 무엇보다 경계를 만드는 것이 폴더가 아니라 package 이름과 tag이므로 **flat이 가장 흔하다.**
규모가 커지면 갈린다.

```text
(A) flat + 이름 규약                    (B) 도메인별 중첩
packages/                               packages/
  billing-core/                           billing/
  billing-web/                              core/
  billing-api/                              web/
  catalog-core/                             api/
  ui/                                     catalog/
                                            core/
```

(B)를 쓰려면 workspace glob을 `packages/*/*`로 바꾸면 되고 pnpm·turbo 둘 다 지원한다. **선택
기준은 강제력이 아니라 가시성이다** — `turbo boundaries`는 어느 쪽이든 tag만 본다. 디렉터리 구조는
**사람과 에이전트가 맥락을 잡는 속도**에만 영향을 준다.

**단일 API라면 모듈러 모놀리스로 시작한다(필수).** API가 하나뿐이고 각 도메인이 아직 별도 배포·소유
단위가 아니라면, package로 잘게 쪼개기 전에 애플리케이션 내부 모듈로 나누는 것이 자연스럽다.

```text
apps/
  a-api/
    src/
      modules/
        orders/
          domain/
          application/
          adapters/
          presentation/
        billing/
          domain/
          application/
          adapters/
          presentation/
      shared/
```

`orders/adapters`와 `billing/adapters`는 서로 다른 기술을 써도 된다. **Adapter 하나당 workspace
package 하나를 만들 필요는 없다** — 같은 도메인에 속하고 함께 변경되는 Adapter들은 그 모듈 안에
둔다.

**여러 API와 독립 경계가 생기면 소유자별 package로 승격한다(필수).**

```text
apps/
  a-api/
  b-api/
  c-api/

packages/
  shared/
    observability/
    test-utils/
  a-api/
    orders-core/
    orders-contracts/
    orders-infrastructure/
  b-api/
    catalog-core/
    catalog-infrastructure/
```

```yaml
packages:
  - apps/*
  - packages/shared/*
  - packages/a-api/*
```

서비스 관련 코드를 한곳에 모으고 싶다면 `services/a-api/{app,packages/*}` 형태도 가능하다. 다만
`apps/a-api` 자체가 하나의 workspace package라면 그 **내부에** 다른 workspace package를 중첩하기
보다, 공통 부모 아래 **형제** package로 두는 편이 도구와 package 경계를 이해하기 쉽다.

**무엇을 package로 만들지 정하는 기준(필수).**

| 코드의 성격 | 권장 위치 |
| --- | --- |
| 한 도메인 모듈에서만 사용 | 해당 모듈의 폴더 |
| 같은 API의 여러 모듈이 쓰지만 외부에서는 안 씀 | `apps/a-api/src/shared` 또는 서비스 전용 package |
| 여러 API가 정말 같은 의미로 사용 | `packages/shared/*` |
| 한 API만 쓰지만 의존 방향을 강하게 강제하거나 별도 소유·테스트가 필요 | `packages/a-api/*` |
| 특정 서비스만 쓰는 Adapter | 해당 모듈의 `adapters/` 또는 서비스 전용 infrastructure package |
| 여러 서비스가 같은 Port·동작으로 재사용하는 Adapter | 공용 Adapter package |

다음 중 하나가 **실제로** 필요할 때 폴더를 workspace package로 승격한다.

- 둘 이상의 소비자가 재사용한다
- 잘못된 import를 도구로 차단해야 할 만큼 경계가 중요하다
- 독립적인 담당 팀·변경 주기·테스트·의존성을 가진다
- 무거운 기술 의존성을 다른 영역에서 격리해야 한다

그렇지 않다면 package보다 일반 모듈 폴더가 비용이 적다.

**FE·BE가 한 평면에 섞이는 문제(필수).** package가 네댓 개일 때는 flat이 오히려 전체 의존 관계를
한눈에 보여준다. 하지만 FE·BE package가 늘어나면 사람과 에이전트 모두 이름을 매번 해석해야 하므로
탐색 비용과 실수 가능성이 커진다. 그때는 **폴더로 큰 실행 경계를 보여주고, 의존 규칙으로 그 경계를
강제한다.**

```text
apps/
  api/
  web/

packages/
  backend/
    assistant-core/
    assistant-adapter-echo/
    assistant-adapter-http/
  frontend/
    design-system/
    assistant-feature/
    api-client/
  contracts/
    assistant/
  tooling/
    tsconfig/
    eslint-config/
```

디렉터리에 들어가는 순간 실행 환경이 드러난다 — `backend/*`는 서버 런타임 전용, `frontend/*`는
브라우저·UI, `contracts/*`는 양쪽이 의존할 수 있는 중립 계약, `tooling/*`은 제품 코드가 아니라
빌드·검사 설정이다. 하나의 root workspace를 유지하면서 glob만 중첩 경로까지 넓히면 된다.

```yaml
packages:
  - apps/*
  - packages/*/*
```

**별도 lockfile을 가진 독립 workspace까지 만들 필요는 보통 없다.** 설치·버전 정합성과 변경 영향
계산이라는 monorepo의 이점을 유지하면서 폴더만 명확히 그룹화할 수 있다. 릴리스 주기·도구 체인·접근
권한까지 정말로 독립일 때만 별도 workspace나 저장소 분리를 고려한다.

**폴더만 나눈다고 경계가 생기지는 않는다(필수).** 폴더 구조는 "어디를 봐야 하는가"를 알려주는
**지도**일 뿐 잘못된 import 자체를 막지 못한다. 실제 경계에는 네 장치가 함께 필요하다.

```text
폴더 구조       → 탐색 범위를 알려준다
package 이름    → 소유자와 용도를 알려준다
exports         → 외부에 공개할 표면을 제한한다
boundary 검사   → 금지된 의존을 실패시킨다
AGENTS.md       → 그 하위에서 작업할 Agent의 규칙을 알려준다
```

package에 개념적 태그(`runtime:browser`, `runtime:node`, `scope:assistant`, `layer:adapter`)를
붙이고 다음을 자동 검사한다.

```text
frontend  ─X→ backend 구현
backend   ─X→ frontend 구현
frontend  ──→ contracts 허용
backend   ──→ contracts 허용
```

이렇게 해야 에이전트가 경로를 잘못 골라도 CI나 로컬 검사에서 바로 실패한다.
`packages/frontend/AGENTS.md`와 `packages/backend/AGENTS.md`에 각 영역의 명령·금지 의존·테스트
방법을 따로 두면 에이전트가 불필요한 반대편 코드를 읽는 일도 줄어든다.

**최상위 축은 FE/BE가 아닐 수도 있다(전문가).** 조직이 FE팀·BE팀으로 나뉘어 있으면
`frontend/`·`backend/` 우선 구조가 자연스럽다. 반대로 한 제품팀이 주문 기능의 FE와 BE를 함께
소유한다면 도메인을 먼저 묶는 편이 찾기 쉽다.

```text
packages/
  orders/
    frontend/
    backend/
    contracts/
  billing/
    frontend/
    backend/
    contracts/
```

즉 최상위 폴더에는 **가장 안정적인 소유·변경 경계**를 둔다. 두 축을 모두 표현해야 한다면 한 축은
폴더에, 다른 축은 package 이름과 태그에 둔다.

**이름에 능력과 소유 범위를 담는다(전문가).** `core`, `adapter-http` 같은 전역 이름은 작은 실습에서는
명확하지만 시스템이 커지면 "무엇의 Core이고 무엇을 위한 HTTP Adapter인가"가 모호해진다.

```text
orders-core
orders-payment-adapter
catalog-search-adapter
assistant-completion-http-adapter
```

**함정: 실습의 확대 표현을 규칙으로 오해하지 않는다(곁가지).** 학습용 저장소에서 `adapter-echo`,
`adapter-http`를 별도 package로 둔 것은 "Adapter마다 package가 필수"라는 규칙이 아니라, 두 구현을
실제 package 경계로 갈아 끼우며 의존 역전을 관찰하기 위한 **의도적인 확대 표현**이다. package가 늘어
이름만 보고 어느 영역인지 즉시 알 수 없게 되는 시점이 바로 그룹화를 도입할 신호다.

**웹의 도메인은 API의 도메인이 아니다(곁가지).** 배치를 도메인별로 묶을 때 흔한 함정이다. 진짜 사업
규칙은 서버가 소유한다 — 신뢰 경계가 거기 있다. 클라이언트가 같은 규칙을 복제하면 진실이 두 벌이
되고, 어긋나는 순간 어느 쪽이 맞는지 알 수 없다. web 쪽 "도메인"이라 부를 만한 것은 뷰 상태 규칙,
UX용 선제 입력 피드백, 표시 규칙이다. **공유해야 하는 것은 규칙이 아니라 계약이다.**

## 용어 풀이

- **workspace / workspace package** — 패키지 매니저가 한 저장소 안의 독립 package로 인식하는 단위.
  깨짐: 폴더와 동일시하면 "중첩된 package 안의 package"처럼 도구가 헷갈리는 배치를 만든다.
- **모듈러 모놀리스(modular monolith)** — 하나의 배포 단위 안에서 모듈 경계를 명확히 유지하는 구조.
  깨짐: 경계 강제 장치 없이 폴더만 나눈 상태를 모듈러라고 부르는 것.
- **workspace glob** — `packages/*`, `packages/*/*`처럼 workspace 대상 경로 패턴. 깨짐: 중첩
  구조로 옮기고 glob을 안 넓혀 package가 인식되지 않는 경우.
- **tag(태그)** — package에 붙이는 역할·런타임 표식으로, boundary 검사의 키다. 깨짐: 이름표로만
  쓰고 금지 규칙을 쓰지 않으면 읽을 것만 늘고 강제되는 것은 없다.
- **`exports`** — package가 외부에 공개하는 진입점을 `package.json`에서 제한하는 필드. 깨짐: 깊은
  경로 import를 허용하면 내부 구조가 곧 공개 API가 된다.
- **boundary 검사(boundary check)** — 금지된 의존을 CI·로컬에서 실패시키는 검사(`turbo boundaries`
  등). 깨짐: 검사 대상 태그를 실제로 붙이지 않으면 규칙만 있고 검사할 것이 없다.
- **BFF(Backends for Frontends)** — 특정 frontend용 별도 서비스 경계. 깨짐: 배치 그룹 이름으로만
  쓰고 소유·배포 단위를 안 나누는 것.

## 확인 질문

1. `packages/`를 `backend/`·`frontend/`·`contracts/`로 그룹화했다. 이제 frontend package가 backend
   구현을 import하는 일이 막히나? <details><summary>답</summary>막히지 않는다. 폴더는 탐색 지도일 뿐이다. 실제로 막으려면 태그 기반 boundary 검사(또는 lint 규칙)와 `exports` 제한이 필요하고, 그 검사가 CI에서 실패해야 한다.</details>
2. 어떤 유틸을 `packages/`로 올릴지 판단하는 네 가지 신호는? <details><summary>답</summary>둘 이상의 소비자가 재사용한다 / 잘못된 import를 도구로 차단해야 할 만큼 경계가 중요하다 / 독립적인 팀·변경 주기·테스트·의존성을 가진다 / 무거운 기술 의존성을 격리해야 한다. 하나도 해당하지 않으면 일반 모듈 폴더가 비용이 적다.</details>
3. (본문 밖) 한 제품팀이 주문 기능의 FE·BE를 함께 소유하고, 동시에 "브라우저 번들에 서버 전용
   package가 실리면 안 된다"는 규칙도 지켜야 한다. 두 축을 어떻게 표현하나?
   <details><summary>답</summary>가장 안정적인 소유 경계인 도메인을 폴더 최상위(`packages/orders/…`)에 두고, 실행 환경 축은 package 이름과 태그(`runtime:browser` / `runtime:node`)로 표현해 boundary 검사가 번들 규칙을 강제하게 한다. 두 축을 모두 폴더로 만들면 조합이 곱해져 탐색이 더 어려워진다.</details>

## 근거

- 실측: `turborepo-platform-lab`의 `packages/{core,contracts,adapter-echo,adapter-http}` flat 배치와
  root `turbo.json`의 태그별 `boundaries` 규칙 — 폴더 구조와 무관하게 검사가 태그만 본다는 관찰.
- 실측: `pnpm-workspace.yaml`의 `packages/*` glob과, 중첩 구조로 옮길 때 필요한 `packages/*/*`
  형태(pnpm·turbo 모두 지원).
- 논의 맥락: 2026-08-09·08-15 질문 로그 — web 쪽 포트-어댑터 배치, 다중 API·다중 도메인 확장,
  FE·BE package 혼재 시 경계 인식 문제를 정리한 항목.

## 관련 개념

- 앞: [모듈러 모놀리스](/study-note/software-architecture/modular-monolith/) — package로 쪼개기 전에 어디까지 하나의 배포 단위 안에서 갈 수 있는지.
- 앞: [경계와 모듈성](/study-note/software-architecture/boundaries-and-modularity/) — 무엇을 경계로 삼을지가 배치보다 먼저 정해진다.
- 관련: [Turborepo boundaries](/study-note/turborepo/boundaries/) — 태그별 allow/deny로 이 배치를 실제로 강제하는 도구.
