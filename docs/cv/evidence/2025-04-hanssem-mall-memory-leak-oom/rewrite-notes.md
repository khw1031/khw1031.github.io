# Rewrite Notes

## Target Positioning

프론트엔드 장애 대응 역량을 보여주는 포스트로 재구성한다. 핵심은 "프론트엔드 코드만 본 것이 아니라 컨테이너, 프로세스, SSR 데이터, 관측 도구까지 연결해 원인을 좁힌 분석"이다.

## Proposed Structure

1. TL;DR
2. 장애 상황과 영향 범위
3. 관측된 메모리 패턴
4. 가설 1: PM2와 Kubernetes 리소스 모델 충돌
5. 가설 2: Node heap과 Sentry instrumentation
6. 가설 3: SSR 응답 크기와 Figma metadata
7. 최종 조치와 재발 방지
8. 한계와 배운 점

## Open Questions

- 원인을 "복합적"으로 남길지, 주요 원인을 SSR 응답 크기로 좁힐지 결정 필요.
- Sentry 관련 표현은 정확한 검증 범위 확인 필요.
- 이벤트명이나 트래픽 수치를 공개해도 되는지 확인 필요.
