
> 한 줄: `turbo prune --docker`로 뽑은 산출물을 **base→pruner→builder→runner** 멀티스테이지로 연결해, 각 스테이지가 입력을 좁혀 최종 이미지를 슬림하고 캐시 효율적으로 만든다.

## 큰 그림

```text
base        공통 베이스 이미지 (node:24-alpine 등)
  │
pruner      turbo prune --docker → 필요한 workspace만 out/json, out/full
  │
builder     json 복사 → install → full 복사 → build
  │
runner      실행에 필요한 것만 복사 (devDeps·turbo CLI·소스 버림)
```

중간 스테이지(pruner·builder)는 최종 이미지에 남지 않는다. 각 스테이지가 다음 스테이지의 **입력을
좁히는 것**이 이 구조의 핵심이다.

## 핵심

공정 라인으로 보면 된다. **pruner**는 필요한 재료만 골라내고, **builder**는 조립하고, **runner**는
완제품만 담는다. 중간 공정에서 쓴 도구·부산물은 최종 상자(이미지)에 들어가지 않는다.

## 깊이

**pruner(`FROM base`) — 왜 필요한가.** `turbo prune @lab/agent --docker`로 대상 package와 그 의존만
추린 산출물(`out/json`=의존 선언, `out/full`=소스)을 만든다. 여기서 `COPY . .`은 이미지의 `/app`
하위가 아니라 **빌드 컨텍스트**(모노레포 루트) 전체를 `.dockerignore` 제외분만 빼고 복사한다 —
turbo가 workspace 의존 그래프를 계산하려면 루트·각 workspace의 `package.json`·lockfile·`turbo.json`이
모두 필요하기 때문이다. `RUN pnpm dlx turbo@2.10.8 prune ...`에서 **`dlx`**를 쓰는 이유: 이 스테이지엔
아직 `node_modules`가 없어서, install 없이 그 자리에서 패키지를 받아 즉시 실행한다. 버전을 고정하는
것은 재현성 때문이다.

**builder(`FROM base`, pruner 위가 아니라) — 왜 base에서 다시 시작하나.** pruner에 이어 붙이지 않고
base에서 새로 시작해야 pruner의 `COPY . .`이 끌어온 **원본 전체 소스를 물려받지 않는다**.
`COPY --from=pruner`로 필요한 산출물만 명시적으로 가져오면 이 스테이지의 **입력이 정확히 그것뿐**임이
보장되고, 그래야 뒤따르는 레이어 캐시가 원본 소스 변경에 흔들리지 않는다.

**Docker 레이어 캐시 — `json → install → full` 순서.** Docker 이미지는 명령마다 생기는 파일시스템
diff(레이어) 스택이다. `COPY`의 캐시 키는 **복사되는 파일 내용의 체크섬**, `RUN`의 캐시 키는 **직전
레이어 상태 + 명령어 문자열**이다. 한 레이어가 미스되면 그 아래 모든 레이어가 연쇄로 다시 실행된다.
그래서 `full`(소스)을 먼저 복사하면 소스 한 줄만 바뀌어도 뒤의 `pnpm install`이 매번 재실행된다.
`json`(의존 선언)을 먼저 복사→install→그다음 `full` 복사 순서면, 의존이 그대로면 앞 두 레이어가
재사용된다. (이 Docker 레이어 캐시는 Turborepo의 task 캐시와 **다른 층**이다.)

**runner(`FROM builder`) — 왜 있나.** 원래 의도는 **이미지 슬림화**다: builder 결과 중 실행에 필요한
것만 골라 복사해 devDependencies·turbo CLI·원본 소스를 버린다(Turborepo 공식 3~4단계 패턴). 다만 이
실습 Dockerfile은 축소 로직 없이 이름만 다시 붙인 상태라, 지금은 "최종 실행 대상"을 표시하는 마커에
가깝다. 실행을 **`node`로 직접** 하는 이유: `turbo build` 후 순수 JS(`dist/index.js`)가 나와 TS 런타임이
불필요하고, base가 `node:24-alpine`이라 node는 이미 있으며, `pnpm run start` 같은 간접 스크립트 해석
단계가 없어 가장 가볍다.

## 용어 풀이

- **multi-stage build(멀티스테이지 빌드)** — 여러 `FROM` 스테이지로 나눠 중간 산출물을 최종 이미지에서
  배제. 깨짐: 스테이지를 이어 붙이면(`FROM 이전스테이지`) 입력 격리가 깨진다.
- **build context(빌드 컨텍스트)** — `docker build`에 넘긴 디렉터리(여기선 모노레포 루트). 깨짐: 이미지
  안 경로로 오해.
- **`pnpm dlx`** — install 없이 패키지를 받아 즉시 실행. 깨짐: 이미 설치된 것을 실행하는 것으로 오해.
- **레이어 캐시(layer cache)** — 명령별 파일시스템 diff의 캐시. 깨짐: Turborepo task 캐시와 같은 것으로 착각.
- **`turbo prune --docker`** — 대상 package의 의존만 추려 `out/json`·`out/full`로 분리.

## 확인 질문

1. builder를 `FROM pruner`가 아니라 `FROM base`로 다시 시작하는 이유는? <details><summary>답</summary>pruner의 `COPY . .`이 끌어온 원본 전체 소스를 물려받지 않으려고. base에서 시작해 `COPY --from=pruner`로 필요한 산출물만 가져오면 입력이 좁게 고정돼 레이어 캐시가 안정된다.</details>
2. `json`을 먼저 복사하고 `full`을 나중에 복사하는 순서가 주는 이점은? <details><summary>답</summary>소스만 바뀌고 의존이 그대로면 `json` COPY와 `install` RUN 레이어가 캐시 재사용된다. `full`을 먼저 넣으면 소스 한 줄 변경에 install까지 연쇄 미스.</details>
3. (본문 밖) 최종 이미지 크기를 줄이려면 이 실습 Dockerfile의 runner에서 무엇을 더 해야 하나? <details><summary>답</summary>이름만 바꾼 현재 상태 대신, `COPY --from=builder`로 실행에 필요한 산출물만 골라 오고 devDependencies·turbo CLI·원본 소스를 빼는 축소 로직을 넣어야 한다.</details>

## 근거

- 출처: turborepo-monorepo-starter 실습(스코프 `@lab/*`).
- `.dig/work/7-1.Dockerfile`, `.dig/work/7-1.md` — 실습 Dockerfile과 공식 3단계 패턴 대조.

## 관련 개념

- 앞: [pnpm workspace 구성과 재귀 실행 규칙](/study-note/turborepo/pnpm-workspace/) — `turbo prune`은 workspace 의존 그래프를 계산해 필요한 package만 추린다.
- 관련: [pnpm --frozen-lockfile 실패 조건](/study-note/turborepo/pnpm-frozen-lockfile/) — builder의 install이 pruned lockfile로도 성공하는 이유.
