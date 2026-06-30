# Rewrite Notes

## Target Positioning

이 글은 단순한 최적화 작업 나열이 아니라, 모바일 커머스 환경에서 측정 체계와 병목 제거를 함께 설계한 성능 엔지니어링 사례로 재구성한다.

## Proposed Structure

1. TL;DR
2. 문제 정의: 단발 Lighthouse 점수가 아니라 반복 측정 가능한 성능 관리 체계 필요
3. 측정 체계: PSI API 기반 1시간 간격 모니터링
4. LCP 병목: LCP 후보 이미지 발견과 우선순위 문제
5. TBT 병목: 디자인시스템 번들 구조와 main thread blocking
6. 개선 결과: 수치와 검증 방식
7. 한계와 다음 단계: PSI의 한계, RUM 필요성, INP 관점 보강

## Tone

- `개선했습니다`보다 `개선`, `전환`, `확보`, `구축` 중심으로 작성.
- 면접 질문에 대비해 각 결정의 판단 근거를 명시.

## Open Questions

- LCP/TBT 수치가 평균인지 p75인지 확인 필요.
- 빌드 시간 70% 단축의 기준 파이프라인 확인 필요.
- `unoptimized`를 유지한 상태에서 Next/Image의 어떤 이점을 사용했는지 확인 필요.
