---
project_id: '2025-04-hanssem-mall-memory-leak-oom'
title: '한샘몰 Memory Leak, OOM 이슈 분석'
period: '2025.03 — 2025.04'
company: '(주)한샘'
role: '프론트엔드 장애 분석 / 성능 개선'
status: needs-input
source: 'src/content/posts/20250404.md'
post: 'src/content/posts/20250404.md'
public_url: 'https://khw1031.github.io/posts/20250404/'
evidence_dir: 'docs/cv/evidence/2025-04-hanssem-mall-memory-leak-oom/'
cv_ready: false
post_ready: false
public_references:
  - 'https://khw1031.github.io/posts/20250404/'
private_materials: []
---

# 한샘몰 Memory Leak, OOM 이슈 분석

## CV Summary

작성 전. 장애 분석 경험으로 강점이 있으나, 사내/고객/이벤트 정보 노출 수준을 재검토해야 함.

## Post Summary

한샘몰 모바일웹 MSA의 주기적 재기동과 이벤트 트래픽 상황의 OOM 이슈를 Kubernetes/PM2/Node heap/Sentry/SSR 응답 크기 관점에서 분석한 트러블슈팅 기록.

## Linked Documents

- [Post](../../../src/content/posts/20250404.md)
- [Metrics](../evidence/2025-04-hanssem-mall-memory-leak-oom/metrics.md)
- [Interview Questions](../evidence/2025-04-hanssem-mall-memory-leak-oom/interview-questions.md)
- [Concepts](../evidence/2025-04-hanssem-mall-memory-leak-oom/concepts.md)
- [References](../evidence/2025-04-hanssem-mall-memory-leak-oom/references.md)
- [Rewrite Notes](../evidence/2025-04-hanssem-mall-memory-leak-oom/rewrite-notes.md)

## Missing Information

- [ ] 실제 원인별 영향도 분리: PM2, Sentry, SSR 응답 크기
- [ ] 종료 코드 137/143/129 해석 근거
- [ ] Node heap limit 변경 전후 테스트 조건
- [ ] Sentry 제외 또는 설정 변경의 정량 효과
- [ ] 외부 게시 가능한 장애 영향 범위와 사후 예방책

## Deep-Dive Topics

- Kubernetes OOMKilled와 graceful shutdown
- Node.js V8 heap, old space, GC
- PM2 cluster mode와 Kubernetes pod/container 모델 충돌
- SSR에서 `__NEXT_DATA__` 크기와 메모리/네트워크 영향
- 부하 테스트와 스트레스 테스트의 차이

## Draft CV Paragraph

작성 전.
