---
title: 'Hanssem Swagger MCP 서버 개발'
period: '2026.01 — 2026.03'
company: '(주)한샘'
role: 'MCP 서버 개발 및 API 문서 표준화'
status: draft
source: 'src/data/cv.ts'
post: 'src/content/posts/20251218.md'
public_url: 'https://khw1031.github.io/posts/20251218/'
evidence_dir: 'docs/cv/evidence/2026-01-hanssem-swagger-mcp-server/'
cv_ready: false
post_ready: false
public_references:
  - '/posts/20251218/'
private_materials: []
---

# Hanssem Swagger MCP 서버 개발

## Current CV Data

- What: 2026.01~2026.03 기간 동안 내부 API 문서를 LLM이 자연어로 조회할 수 있는 Swagger MCP 서버를 개발했다.
- How: OpenAPI 3.0+ 지원 MCP 서버 개발, list_services/list_apis/get_api_detail/get_components 도구 제공, 자연어 기반 API 조회와 Swagger → Zod 스키마 자동 변환, Drill-down 패턴으로 LLM 컨텍스트 토큰 오버플로우 방지, Node.js/MCP SDK/Cursor/Claude Code/GitHub Copilot 연동.
- Impact: Swagger 문서 탐색 없이 API 상세와 컴포넌트 스키마를 조회해 코드 생성을 자동화할 수 있게 했고, drill-down 조회 패턴으로 LLM 컨텍스트 토큰 오버플로우를 방지했다. 오픈소스(@hynu/swagger-mcp)로 공개했다.

## Missing Information

- [ ] 공개 npm/GitHub 링크를 CV에 직접 노출할지 여부
- [ ] 내부용 Hanssem 서버와 오픈소스 패키지의 구분 방식
- [ ] 실제 API 연동 시간 절감 사례
- [ ] 외부 게시 가능한 사용 예시 또는 시퀀스 다이어그램

## Deep-Dive Topics

- Drill-down 조회 패턴의 설계 의도
- OpenAPI 파싱과 Zod 변환의 구현 범위
- MCP tool 설계가 LLM 컨텍스트 사용량에 준 영향

## References

내부 근거와 외부 링크를 구분해 추가한다.

- /posts/20251218/

## Linked Documents

- [Post](../../../src/content/posts/20251218.md)
- [Metrics](../evidence/2026-01-hanssem-swagger-mcp-server/metrics.md)
- [Interview Questions](../evidence/2026-01-hanssem-swagger-mcp-server/interview-questions.md)
- [Concepts](../evidence/2026-01-hanssem-swagger-mcp-server/concepts.md)
- [References](../evidence/2026-01-hanssem-swagger-mcp-server/references.md)
- [Rewrite Notes](../evidence/2026-01-hanssem-swagger-mcp-server/rewrite-notes.md)

## Draft CV Paragraph

작성 전.
