---
project_id: '2025-03-hanssem-mall-performance'
title: '한샘몰 웹 서비스 성능 최적화'
period: '2025.03'
company: '(주)한샘'
role: '프론트엔드 성능 개선 리드'
status: needs-input
source: 'src/content/posts/20250330.md'
post: 'src/content/posts/20250330.md'
public_url: 'https://khw1031.github.io/posts/20250330/'
evidence_dir: 'docs/cv/evidence/2025-03-hanssem-mall-performance/'
cv_ready: false
post_ready: false
public_references:
  - 'https://khw1031.github.io/posts/20250330/'
private_materials: []
---

# 한샘몰 웹 서비스 성능 최적화

## CV Summary

작성 전. 성능 개선 수치가 강하므로 CV 후보로 유지하되, 측정 조건과 산식 확인 후 문단화.

## Post Summary

한샘몰 모바일 웹의 Core Web Vitals 개선 사례. 단발 Lighthouse 점수 대신 PSI API 기반 정기 모니터링을 만들고, LCP/TBT 병목을 이미지 로딩, 폰트 로딩, 디자인시스템 번들 구조, ESM entry point 관점에서 해소한 프로젝트.

## Linked Documents

- [Post](../../../src/content/posts/20250330.md)
- [Metrics](../evidence/2025-03-hanssem-mall-performance/metrics.md)
- [Interview Questions](../evidence/2025-03-hanssem-mall-performance/interview-questions.md)
- [Concepts](../evidence/2025-03-hanssem-mall-performance/concepts.md)
- [References](../evidence/2025-03-hanssem-mall-performance/references.md)
- [Rewrite Notes](../evidence/2025-03-hanssem-mall-performance/rewrite-notes.md)

## Missing Information

- [ ] PSI API 측정 URL, device, strategy, 집계 방식
- [ ] LCP 6초 → 1.6초의 측정 기준
- [ ] TBT 1200ms → 380ms의 측정 기준
- [ ] 번들 40% 감소와 빌드 시간 70% 단축의 비교 대상
- [ ] `Next/Image`에서 `unoptimized`와 custom loader를 함께 쓴 정확한 이유

## Deep-Dive Topics

- LCP resource discovery와 priority
- `background-image`와 `<img>`의 성능/접근성 차이
- font preload와 render blocking
- TBT, long task, Script Evaluation
- ESM, tree shaking, package `exports`, sideEffects

## Draft CV Paragraph

작성 전.
