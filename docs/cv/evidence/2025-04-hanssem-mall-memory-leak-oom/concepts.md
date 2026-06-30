# Concepts

## OOM in Kubernetes

- OOMKilled는 컨테이너가 memory limit을 초과해 커널에 의해 종료되는 상황.
- Pod 재기동은 장애 완화처럼 보일 수 있지만, 트래픽 집중 시 사용자 오류로 확산될 수 있다.

## Node.js Memory

- V8 heap limit은 Node 프로세스가 사용할 수 있는 JS heap 상한과 관련된다.
- `--max-old-space-size`는 여유 시간을 벌 수 있지만 누수 원인을 제거하지는 않는다.
- Native memory, external memory, Buffer, instrumentation overhead도 함께 봐야 한다.

## PM2 vs Kubernetes

- PM2는 프로세스 매니저이고 Kubernetes는 컨테이너 오케스트레이터다.
- 컨테이너 안에서 PM2가 여러 Node process를 띄우면 Pod 단위 리소스 제어와 관측이 복잡해진다.

## SSR Payload

- SSR 응답 데이터가 커지면 서버 메모리, 네트워크 대역폭, HTML 파싱, hydration 비용이 동시에 증가한다.
- Figma export metadata 같은 렌더링과 무관한 문자열은 ingestion 단계에서 제거하는 편이 가장 효과적이다.
