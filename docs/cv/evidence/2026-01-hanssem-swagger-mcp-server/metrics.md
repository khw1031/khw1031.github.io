# Metrics

## Known Metrics

| Metric | Value | Note |
| --- | --- | --- |
| MCP tools | 4개 | list_services, list_apis, get_api_detail, get_components |
| OpenAPI support | 3.0.x / 3.1.x | 포스트 기준 |
| Distribution | npx 기반 실행 | 사내 registry 설정 포함 |
| Public reference | 있음 | `/posts/20251218/` |

## Verification Needed

- 공개 오픈소스 패키지와 사내용 Hanssem MCP의 관계.
- 실제 API 연동 시간 절감 수치.
- 사용 팀/프로젝트 수.
- Swagger → Zod 변환 범위.

## CV-Safe Summary

OpenAPI 문서를 LLM이 drill-down 방식으로 조회하도록 MCP 서버를 설계해 API 스펙 탐색과 타입/연동 코드 생성 흐름 자동화.
