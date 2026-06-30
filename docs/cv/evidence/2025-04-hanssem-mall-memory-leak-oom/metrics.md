# Metrics

## Known Metrics

| Metric | Value | Note |
| --- | ---: | --- |
| 이벤트 유입 | 약 80만 사용자 | 공개 가능 여부 재확인 필요 |
| FE Pod | 15대 → 60대 | 이벤트 대응 증설 |
| BE Pod | 5대 → 60대 | 이벤트 대응 증설 |
| FE Pod resource | 0.5core/4GB → 1core/6GB | 스케일업 후에도 재기동 지속 |
| IDC-AWS bandwidth | 500Mbps 포화 | 임시 증설 필요 |
| NEXT_DATA 큰 케이스 | 2.18MB | 테스트 4-5분 사이 재기동 |
| NEXT_DATA 작은 케이스 | 0.0155MB | 천천히 우상향 |

## Verification Needed

- 종료 코드 137, 143, 129가 실제 관측된 환경과 로그.
- Sentry 제외 전후의 memory slope.
- PM2 제거 전후의 Pod 재기동 주기.
- Figma metadata 제거 또는 BE sanitation 이후 장애 재발 여부.

## CV-Safe Summary

한샘몰 모바일웹 MSA의 OOM 재기동 문제를 Kubernetes, PM2, Node heap, Sentry, SSR 응답 크기 관점에서 분석하고 원인 후보를 단계적으로 축소.
