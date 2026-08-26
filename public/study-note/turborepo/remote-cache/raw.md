
> 한 줄: Remote Cache는 **task hash를 키로** log와 `outputs` 산출물을 원격 서버에 저장해 여러 machine·CI가 공유하는 캐시다 — 로컬 캐시 디렉터리를 복사·동기화하는 방식이 **아니다**.

## 큰 그림

```text
task hash 계산
     │  조회
     ▼
local / remote 소스 ──┬── hit  → log·outputs 복원
                      └── miss → task 실행 → (권한 있으면) 원격에 업로드
```

## 핵심

로컬 캐시가 **내 책상 서랍**이라면 Remote Cache는 **팀 공용 사물함**이다. 같은 열쇠(task hash)를
가진 사람은 누구나 결과를 꺼내 쓴다. machine마다 로컬 캐시를 따로 만드느라 생기는 중복 build를
줄이려고 있다.

## 깊이

**원리 — API를 통한 조회·업로드지 디렉터리 복사가 아니다.** `.turbo/cache`를 그대로 복사·동기화하는
게 아니라 **Remote Cache API**로 조회·업로드·복원한다. 흐름은 task hash 계산 → local/remote 조회 →
hit면 log·outputs 복원, miss면 task 실행 → 권한이 있으면 결과 업로드다.

**provider — 호환 API endpoint여야 한다.** Vercel 외에도 **Remote Cache API를 구현한** self-hosted·
서드파티 서버를 쓸 수 있다. 다만 임의의 S3 버킷이나 일반 파일 서버를 가리킬 수는 없고, 호환 API
endpoint여야 한다.

**비용.** 현재 Vercel Remote Cache는 모든 plan에서 무료다. self-hosted·서드파티를 쓰면 Turborepo
사용료와 별개로 인프라·서비스 비용이 생길 수 있다.

## 용어 풀이

- **Remote Cache** — task hash 키로 원격에서 공유하는 캐시. 깨짐: 로컬 디렉터리를 원격에 복사하는
  것으로 오해.
- **Remote Cache API endpoint** — Vercel 또는 그 API를 구현한 서버. 깨짐: 임의 S3·파일 서버를 가리킬
  수 있다고 오해.

## 확인 질문

1. Remote Cache는 로컬 `.turbo/cache`를 그대로 원격에 올려 두는 방식인가? <details><summary>답</summary>아니다. Remote Cache API로 task hash를 키 삼아 조회·업로드·복원한다. 디렉터리 복사가 아니다.</details>
2. 사내 S3 버킷을 Remote Cache로 그대로 지정할 수 있나? <details><summary>답</summary>그대로는 안 된다. Remote Cache API를 구현한 호환 endpoint여야 한다.</details>
3. (본문 밖) CI에서는 원격 캐시를 읽되 절대 오염시키지 않으려면 어떻게 설정하나? <details><summary>답</summary>Remote를 read-only로 — `--cache=...,remote:r`. miss 뒤 실행 결과가 업로드되지 않는다(캐시 소스 제어는 caching 노트 참고).</details>

## 근거

- 출처: turborepo-monorepo-starter 실습(스코프 `@lab/*`).
- 실습 관찰(M4/T1): `--cache=remote:rw`로 한 번 업로드한 뒤 두 task 모두 remote hit로 전환.

## 관련 개념

- 앞: [Turborepo 로컬 캐싱과 캐시 키](/study-note/turborepo/caching/) — task hash와 로컬 캐시를 먼저 이해해야 원격 공유가 서고, `--cache` 소스 제어도 거기서 다룬다.
