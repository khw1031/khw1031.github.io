# Concepts

## Model Context Protocol

- LLM 클라이언트가 외부 도구와 데이터 소스를 표준화된 방식으로 호출하게 하는 프로토콜.
- tool 설명, input schema, result shape가 LLM 사용성에 직접 영향을 준다.

## Drill-Down Retrieval

- 서비스 목록 → API 목록 → API 상세 → component schema 순으로 필요한 정보만 가져오는 방식.
- 전체 OpenAPI 문서를 한 번에 주입할 때 생기는 토큰 낭비와 문맥 오염을 줄인다.

## OpenAPI

- paths, operations, requestBody, responses, components/schemas를 이해해야 API 연동 자동화가 가능하다.
- `$ref` 해석이 빠지면 실제 타입 생성이나 validation 코드가 불완전해진다.

## Agentic Coding Integration

- 계획 문서 안의 API 참조를 에이전트가 tool call로 해결하게 만드는 구조.
- Swagger 탐색과 타입 작성의 context switching을 줄이는 것이 핵심 가치.
