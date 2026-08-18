
Turborepo 기반 모노레포를 다루며 정리한 개념 노트 모음이다. 크게 네 갈래로 읽으면 된다.

- **구성** — pnpm workspace로 프로젝트를 하나의 단위로 묶고(`pnpm workspace`), `turbo.json`을 상속으로
  설정한다(`turbo.json 구성과 상속`).
- **실행** — task graph가 실행 순서를 정하고(`Task Graph`), `--filter`로 실행 범위를 좁힌다(`filter`).
- **캐싱** — task hash로 로컬 캐시가 재빌드를 줄이고(`로컬 캐싱`), 같은 키로 원격에서 공유한다(`Remote Cache`).
- **배포** — `turbo prune --docker` 산출물을 멀티스테이지로 빌드하며(`Docker 멀티스테이지`), 그 과정의
  pnpm 설치 조건을 따로 정리했다(`--frozen-lockfile`).

대략 구성 → 실행 → 캐싱 → 배포 순으로 읽으면 개념이 앞에서 뒤로 쌓인다. 각 노트는 앞/뒤 링크로
서로 이어져 있어 관심 지점부터 따라가도 된다. 아래 목차 참고.
