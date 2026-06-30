# Interview Questions

## Kubernetes and Process Model

- Kubernetes 환경에서 PM2 cluster mode가 왜 중복되거나 위험할 수 있는가?
- Pod resource limit과 Node spec을 혼동하면 어떤 문제가 생기는가?
- 종료 코드 137, 143, 129는 각각 어떤 상황에서 관측될 수 있는가?

## Node.js Memory

- V8 heap은 어떤 영역으로 나뉘고 old space는 어떤 데이터를 담는가?
- `--max-old-space-size`는 무엇을 바꾸며 memory leak을 해결하지 못할 수 있는 이유는 무엇인가?
- GC 이후에도 메모리가 회수되지 않는 패턴을 어떻게 확인하는가?

## SSR and Data Size

- Next.js SSR에서 `__NEXT_DATA__`가 커지면 서버 메모리, 네트워크, 클라이언트 hydration에 어떤 영향을 주는가?
- 대용량 HTML/Figma metadata 문자열이 DB, BE, FE에 모두 영향을 줄 수 있는 경로는 무엇인가?
- SSR 구간의 Sentry instrumentation이 메모리 사용량을 늘릴 수 있는 지점은 어디인가?

## Troubleshooting

- 스트레스 테스트와 부하 테스트는 어떻게 다르게 설계해야 하는가?
- 개발 환경과 STG/운영 환경의 그래프가 다를 때 어떤 차이를 먼저 확인하는가?
- 원인이 복합적일 때 어떤 순서로 가설을 제거해야 하는가?
