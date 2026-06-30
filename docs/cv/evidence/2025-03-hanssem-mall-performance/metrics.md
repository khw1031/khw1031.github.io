# Metrics

## Known Metrics

| Metric | Before | After | Note |
| --- | ---: | ---: | --- |
| LCP | 6s | 1.6s | Google PSI API 기반 측정으로 보이나 device/strategy 확인 필요 |
| TBT | 1200ms | 380ms | Lighthouse lab metric 기준으로 보임 |
| 디자인시스템/전시 컴포넌트 번들 | - | 40%+ 감소 | 기준 번들 파일과 측정 도구 확인 필요 |
| 빌드 시간 | - | 최대 70% 단축 | Vite + ESBuild + Rollup 적용 결과 |
| PSI 모니터링 | - | 1시간 간격 | 자사/경쟁사 일간/주간 평균 트래킹 |

## Verification Needed

- PSI API의 `strategy` 값: mobile/desktop.
- Lighthouse 버전 또는 측정 기간.
- 평균, 중앙값, p75 중 어떤 값인지.
- 배포 전후 비교 기간과 샘플 수.
- 번들 사이즈 기준: gzip/brotli/raw 중 무엇인지.

## CV-Safe Summary

한샘몰 모바일 웹 성능 개선에서 PSI API 기반 정기 모니터링을 구축하고 LCP, TBT, 번들 사이즈, 빌드 시간을 정량 개선.
