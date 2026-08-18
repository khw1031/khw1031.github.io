---
title: "Turborepo boundaries의 태그 규칙과 검사 범위"
description: "패키지별 tags와 루트 boundaries.tags가 결합해 의존 엣지를 검사하는 방식, dependencies와 dependents의 방향, deny(블랙리스트)와 allow(화이트리스트)의 차이, 간접 의존 검사와 turbo run과의 분리."
---

> 한 줄: `boundaries`는 각 패키지의 `tags`와 루트 `boundaries.tags` 규칙을 실제 import·의존 그래프에 맞춰 보는 **정적 검사**이고, `turbo run`에 자동으로 붙지 않는 **별도 명령**(`turbo boundaries`)으로만 돈다.

## 큰 그림

```text
패키지별 turbo.json의 tags          (분류: domain / shared / config / app …)
루트 turbo.json의 boundaries.tags   (태그별 허용·금지 규칙)
소스 import + package.json 의존     (실제 의존 그래프)
        │  세 입력을 맞춰 본다
        ▼
   turbo boundaries → 위반 엣지 보고 (실행·캐시와 무관)
```

`tasks`가 실행 순서·캐시를 정하는 것과 달리 `boundaries`는 **무엇을 무엇에서 가져와도 되는가**만
본다. 두 필드는 같은 `turbo.json`에 살지만 서로 독립적이다.

## 핵심

건물 출입 규정으로 보면 된다. 각 패키지는 자기 `turbo.json`에 **명찰**(`tags`)을 달고, 루트의
`boundaries.tags`는 **명찰별 출입 규정표**다. `turbo boundaries`는 경비가 실제 통행 기록(소스 import와
`package.json` 의존)을 들고 규정표와 대조하는 순간이다. 규정표는 문을 잠그지 않는다 — 위반을
**보고**할 뿐이고, 대조를 시키지 않으면 아무 일도 일어나지 않는다.

최소 예시. 패키지 쪽에서 명찰을 달고,

```jsonc
// packages/core/turbo.json
{ "tags": ["domain"] }
```

루트에서 그 명찰의 규정을 쓴다.

```jsonc
// turbo.json
{
  "boundaries": {
    "tags": {
      "domain":  { "dependencies": { "deny": ["app", "shared", "adapter"] } },
      "adapter": {
        "dependencies": { "allow": ["domain", "config"] },
        "dependents":   { "allow": ["app"] }
      }
    }
  }
}
```

검사는 `turbo boundaries`(실습 저장소에서는 `pnpm boundaries`)로 실행한다.

## 깊이

**`dependencies`와 `dependents`는 방향이 반대다.** `dependencies`는 "이 태그가 **무엇을 import해도
되는가**", `dependents`는 "**누가 이 태그를 import해도 되는가**"를 검사한다. 그래서
`adapter.dependents.allow: ["app"]`은 adapter가 앱을 가져오라는 뜻이 아니라, adapter를 가져갈 수 있는
쪽의 태그를 `app`으로 제한한다는 뜻이다. 방향을 뒤집어 읽으면 규칙의 의미가 정반대가 된다.

**`deny`는 블랙리스트, `allow`는 화이트리스트, 생략은 무제한.**

| 표현 | 의미 | 성격 |
| --- | --- | --- |
| `deny: ["app"]` | `app`만 금지, 나머지 태그는 허용 | 최소한의 금지 |
| `allow: ["domain", "config"]` | 두 태그만 허용, 나머지 전부 금지 | 방향을 강하게 잠금 |
| `dependencies`/`dependents` 자체를 생략 | 그 방향에 제한 없음 | 규칙 부재 |

이 차이 때문에 `domain.dependencies.deny: ["app", "shared", "adapter"]`만 있는 상태는
"domain은 그 셋을 못 가져온다"까지만 말한다 — `domain → domain`, `domain → config`는 여전히 허용이고,
`app → domain`처럼 domain을 **가져가는 쪽**은 이 규칙이 건드리지 않는다. "나머지는 무관"은
**`dependencies` 방향에서만** 맞는 말이다.

**간접(전이) 의존까지 적용된다.** 규칙은 직접 import 한 단계만 보지 않는다. A가 B를 import하고 B가
금지된 C를 의존하면, A도 C에 의존하는 것으로 판정한다. 그래서 중간 패키지를 하나 끼워 우회하는
방식으로는 규칙을 피할 수 없다.

**선언 누락 import도 잡는다.** 검사는 소스의 workspace package import와 `package.json`의 의존 선언을
함께 보므로, 소스에서 가져다 쓰면서 `package.json`에 의존으로 적지 않은 workspace 패키지도 위반으로
보고된다. 태그 규칙 위반과는 별개 종류의 지적이다.

**`turbo run build`는 이 검사를 하지 않는다(흔한 오해).** `boundaries`는 빌드 순서를 바꾸거나
아키텍처를 만들어 주는 기능이 아니고, `turbo run`에 자동으로 끼어들지도 않는다. 실행하지 않으면
규칙은 문서일 뿐이므로, 검사를 원하면 CI나 스크립트에 `turbo boundaries`를 따로 걸어야 한다.

**규칙은 태그가 붙어 있을 때만 검사 대상이 된다(곁가지).** 실습 저장소에서 실제로 붙은 태그는
`domain`(`packages/core`), `shared`(`packages/contracts`), `config`(`packages/tsconfig`),
`app`(`apps/web`, `apps/api`) 네 종류이고, **`adapter` 태그를 붙인 패키지는 없다**. 그래서 위 예시의
adapter 두 규칙은 설정상 유효하지만 지금 검사할 import가 없는 **준비 규칙**이다. 검사 결과가
`no issues found`로 나오는 것이 "규칙이 지켜졌다"인지 "검사 대상이 없었다"인지는 이 지점에서 갈린다.

## 용어 풀이

- **boundaries(경계 검사)** — 워크스페이스 패키지 사이의 import·의존 규칙을 검사하는 Turbo의 정적
  검사 기능. 깨짐: 빌드 순서나 실행 권한을 바꾸는 기능으로 착각.
- **`tags`(태그)** — 개별 패키지 `turbo.json`에 붙이는 역할 분류. 깨짐: 태그를 안 붙이면 그 패키지에는
  규칙이 걸리지 않는다.
- **`dependencies`(의존 방향 규칙)** — 이 태그가 import할 대상을 제한. 깨짐: `dependents`와 방향 혼동.
- **`dependents`(피의존 방향 규칙)** — 이 태그를 import할 수 있는 쪽을 제한.
- **`deny`(블랙리스트)** — 나열한 태그만 금지. 깨짐: 나열하지 않은 태그도 막힌다고 오해.
- **`allow`(화이트리스트)** — 나열한 태그만 허용, 나머지 전부 금지.
- **전이 의존(transitive dependency)** — 중간 패키지를 거쳐 도달하는 의존. 깨짐: 직접 import만 검사한다고
  오해하면 우회가 가능하다고 착각한다.

## 확인 질문

1. `adapter.dependents.allow: ["app"]`은 adapter가 app을 import해도 된다는 뜻인가? <details><summary>답</summary>아니다. `dependents`는 방향이 반대로, adapter를 **import할 수 있는 쪽**의 태그를 `app`으로 제한한다는 뜻이다.</details>
2. `domain.dependencies.deny: ["app", "shared", "adapter"]`만 걸린 상태에서 `app → domain` import는 위반인가? <details><summary>답</summary>아니다. 이 규칙은 domain이 **가져오는** 방향만 제한한다. domain을 가져가는 쪽을 막으려면 `domain.dependents`를 따로 써야 한다.</details>
3. (본문 밖) CI에서 `turbo run build`와 `turbo run test`만 돌리고 있는데 경계 위반 import가 머지됐다. 설정이 잘못된 것인가? <details><summary>답</summary>규칙 자체는 멀쩡할 수 있다. `boundaries`는 `turbo run`에 붙지 않는 별도 검사이므로, CI에 `turbo boundaries` 단계를 추가하지 않은 것이 원인이다.</details>

## 근거

- 출처: turborepo-platform-lab 실습(스코프 `@platform/*`).
- 실습 저장소 실측 — 루트 `turbo.json`의 `boundaries.tags`(`domain`/`shared`/`adapter` 규칙), 패키지별
  `turbo.json`의 `tags`. `pnpm boundaries` 실행 결과: `Checked 64 files in 5 packages, no issues found`
  (5개 패키지·64개 파일, 위반 없음. 2026-08-14 관찰).
- [Boundaries — Turborepo 공식 문서](https://turborepo.dev/docs/reference/boundaries) — 태그 규칙과
  간접 의존 검사 동작(1차 출처, 2026-08-14 확인).
- [Configuring turbo.json — Turborepo 공식 문서](https://turborepo.dev/docs/reference/configuration) —
  `boundaries.tags`의 `dependencies`/`dependents`, `allow`/`deny` 필드 정의(1차 출처, 2026-08-14 확인).

## 관련 개념

- 앞: [Turborepo의 주요 기능 지도와 학습 순서](/study-note/turborepo/commands-overview/) — `boundaries`가
  실행·캐시 기능과 어디서 갈라지는지 먼저 잡는다.
- 관련: [Turborepo Task Graph 구성과 실행 제어](/study-note/turborepo/task-graph/) — 같은 `turbo.json`의
  `tasks`가 만드는 실행 그래프. `boundaries`와 서로 독립적이다.
- 관련: [경계와 모듈성의 설계 근거](/study-note/software-architecture/boundaries-and-modularity/) —
  의존 방향을 왜 강제하는가(정보 은닉·의존 역전)는 이 노트가 아니라 저쪽이 다룬다.
- 관련: [Turborepo 모노레포 개념 정리](/study-note/turborepo/) — 카테고리 허브.
