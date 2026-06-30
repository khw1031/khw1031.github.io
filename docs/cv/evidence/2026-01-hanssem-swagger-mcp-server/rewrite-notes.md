# Rewrite Notes

## Target Positioning

API 문서 탐색 자동화 글이 아니라, LLM agent가 API 스펙을 안전하게 drill-down 조회하고 코드 생성에 반영하게 만든 MCP 설계 사례로 재구성한다.

## Proposed Structure

1. TL;DR
2. 문제: API 연동의 반복 작업과 context switching
3. MCP와 OpenAPI의 역할
4. drill-down tool 설계
5. Agentic Coding 워크플로우 통합
6. 설정 예시
7. 보안/운영 고려사항
8. 결과와 한계

## Open Questions

- 사내 설정 예시의 registry/token 표현은 더 안전한 placeholder로 정리 필요.
- 오픈소스 패키지명과 사내 패키지명을 어떻게 구분할지 결정 필요.
