
> 한 줄: Turborepo 캐시는 **task hash**(입력 지문 + global hash로 계산)를 키로 `outputs` 산출물을 `.turbo/cache`에 보관했다가, 같은 hash면 실행을 건너뛰고 **복원**한다.

## 큰 그림

```text
inputs(파일 지문) + global hash
        │  결합
        ▼
     task hash  ──┬── 같음(hit)  → outputs 복원 (실행 안 함)
                  └── 다름(miss) → task 실행 → outputs를 cache에 저장
```

## 핵심

캐시는 "이 입력이면 결과는 이것"이라는 **영수증 보관함**이다. 입력 지문(task hash)이 같으면 다시
만들지 않고 보관해 둔 결과(`outputs`)를 꺼낸다. 그래서 캐시의 정확성은 "무엇을 입력으로 볼지"와
"무엇을 결과로 보관할지"를 어떻게 선언하느냐에 달려 있다.

## 깊이

**저장 위치 — `.turbo/cache` vs `dist`.** `dist/`는 build가 **실제로 만든 산출물**이고,
`.turbo/cache`는 hit 때 그 산출물을 **복원하려고 보관하는 영역**이다. 역할이 다르며 `.turbo/`는
Git에 커밋하지 않는다.

**`outputs`는 복원 대상이지 출력 위치가 아니다(흔한 오해).** build 도구가 만든 파일 중 cache에
보관할 범위를 선언할 뿐, 실제 출력 위치는 도구 설정(TypeScript면 `tsconfig.json`의 `outDir`)이 정한다.

**`outputs` vs `outDir`(가깝지만 아닌 것).** `outDir`은 **생성기**(TS)가 파일을 만드는 위치,
`outputs`는 **실행기**(Turborepo)의 cache 경계다. 같은 `dist`를 가리켜도 서로 참조하지 않는다 —
`outDir`을 바꾸고 `outputs`를 안 고치면 cache가 아무것도 복원하지 못한다.

**`inputs`는 task hash를 계산할 입력 범위다.** build와 무관한 파일 변경으로 불필요한 miss가 나는
것을 줄이려고 범위를 좁힌다. 입력 지문 → task hash, 저장소 공통 입력 → global hash. 하나라도 바뀌면
miss가 나고, dependency hash를 통해 dependent task로 **전파**된다(core hash가 바뀌면 `^build`를 타고
agent task까지 miss).

**global hash는 저장소 공통 조건이다.** root `package.json`·lockfile·`globalDependencies`·`globalEnv`·
root task 설정 등을 묶는다. global 조건이 바뀌면 **전체 task**가 영향받고, package source 변경은 해당
task와 그 dependent에만 영향을 준다.

**`--cache`로 소스를 제어한다.** `--cache=local:,remote:r`처럼 `local:`/`remote:` 각각을 `rw`(읽기·
쓰기)·`r`(읽기)·`w`(쓰기)·빈 값(비활성)으로 따로 조절한다.

## 용어 풀이

- **task hash(태스크 해시)** — 특정 `package#task`의 입력 조건 지문. 깨짐: global hash와 혼동하면
  전파 범위를 잘못 짚는다.
- **global hash(글로벌 해시)** — 모든 task에 걸리는 저장소 공통 조건. 깨짐: package source 변경까지
  여기 넣는다고 오해.
- **`outputs`** — cache에 보관·복원할 파일 범위. 깨짐: 출력 위치를 정하는 설정으로 착각.
- **`inputs`** — task hash 계산에 넣을 입력 파일 범위.
- **`.turbo/cache`** — 로컬 캐시 보관 영역(커밋 안 함).

## 확인 질문

1. `outDir`을 `build/`로 바꿨는데 `turbo.json`의 `outputs: ["dist/**"]`를 그대로 두면 cache는
   어떻게 되나? <details><summary>답</summary>생성기는 `build/`에 파일을 만드는데 cache 경계는 `dist/**`라, hit이 나도 복원할 파일이 없다 — `outputs`도 `build/**`로 맞춰야 한다.</details>
2. `core`의 소스 한 줄만 고쳤는데 `agent#build`도 miss가 나는 이유는? <details><summary>답</summary>core의 task hash가 바뀌면 dependency hash를 통해 `^build`로 연결된 agent task로 miss가 전파되기 때문.</details>
3. (본문 밖) 아무 소스도 안 바꾸고 `README`만 고쳤는데 build가 miss났다면, 가장 먼저 볼 곳은? <details><summary>답</summary>`inputs`(또는 global 입력) 범위. build 무관 파일이 hash 입력에 들어가 있으면 좁혀야 한다.</details>

## 근거

- 출처: turborepo-monorepo-starter 실습(스코프 `@lab/*`).
- `turbo.json:6`(`outputs: ["dist/**"]`), `turbo.json:7`(`inputs`), `apps/agent/tsconfig.json:9`·`packages/core/tsconfig.json:8`(`outDir: "dist"`).
- 실행 관찰: `--dry=json`의 `globalCacheInputs`(현재 global 파일·환경은 비어 있고 dependency hash 표시), `--cache=local:,remote:r` 실행 시 core hit·agent miss.

## 관련 개념

- 앞: [Turborepo Task Graph 구성과 실행 제어](/study-note/turborepo/task-graph/) — task hash는 task 단위이고 miss는 task edge를 타고 전파된다.
- 뒤: [Turborepo Remote Cache](/study-note/turborepo/remote-cache/) — 같은 task hash를 키로 캐시를 원격에서 공유한다.
- 관련: [turbo.json 구성과 상속](/study-note/turborepo/config-inheritance/) — `outputs`·`inputs`는 turbo.json에서 선언·상속되는 필드다.
