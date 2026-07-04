import { type Detail, detailSchema } from './types';

const data: Detail[] = [
  {
    title: 'glowed',
    url: 'https://github.com/khw1031/glowed',
    role: 'Open Source / Go TUI',
    period: '2026.05',
    subtitle: 'Ghostty 중심 터미널 Markdown 브라우저/에디터',
    content: [
      {
        title: '프로젝트 개요',
        description: [
          'Go 기반 터미널 TUI로 Markdown 문서를 스캔·검색·미리보기·원본 편집할 수 있는 개인 지식 워크플로우 도구',
          'Ghostty split과 외부 LLM CLI 세션 연동을 통해 현재 문서 context를 AI 도구로 전달하는 개발자 생산성 실험',
        ],
      },
      {
        title: '주요 기능',
        description: [
          'Bubble Tea, Lipgloss, Glamour 기반 Markdown preview/source/edit mode 구현',
          'frontmatter/tag/path/body 검색, sidebar directory tree, app-managed selection, atomic save와 undo/redo 지원',
          '.glowedignore 및 built-in ignore, polling refresh, JSON schema 설정, Homebrew tap/go install 배포 지원',
        ],
      },
      {
        title: '성과/특징',
        description: [
          'v0.1.0~v0.2.2 릴리즈와 CHANGELOG/릴리즈 자동화 스크립트 운영',
          'Go test 기반 cmd/internal 패키지 테스트와 docs/search/watch/editor 영역 회귀 테스트 구성',
          'AI agent coding harness를 실제 제품 개발 루프에 적용한 사례',
        ],
      },
    ],
  },
  {
    title: '@hynu/swagger-mcp',
    url: 'https://github.com/khw1031/swagger-mcp',
    role: 'Open Source / NPM Package',
    period: '2025.12',
    subtitle: 'Swagger/OpenAPI MCP Server',
    content: [
      {
        title: '프로젝트 개요',
        description: [
          'Swagger/OpenAPI API 문서를 MCP(Model Context Protocol)로 LLM에 제공하는 오픈소스 MCP 서버',
          '개발자가 자연어로 API 명세를 조회하고, LLM의 도움으로 API 연동 코드를 자동 생성할 수 있게 한다',
        ],
      },
      {
        title: '주요 기능',
        description: [
          '4개 MCP 도구: list_services(서비스 목록), list_apis(API 목록), get_api_detail(API 상세), get_components($ref 컴포넌트 스키마)',
          'Drill-down 조회 흐름: 서비스 → API 목록 → API 상세 → 컴포넌트 스키마 단계로 조회해 LLM 컨텍스트 토큰 오버플로우 방지',
          'swagger-config.json 기반 다중 서비스·다중 환경(dev/stg/prod) 관리, OpenAPI 3.0.x/3.1.x 지원',
        ],
      },
      {
        title: '성과/특징',
        description: [
          'npm @hynu/swagger-mcp v1.0.9 배포, npx -y @hynu/swagger-mcp@latest로 설치 없이 즉시 실행',
          '@modelcontextprotocol/sdk, @scalar/openapi-parser, zod 기반, tsdown 빌드, Node.js 18+ 환경',
        ],
      },
    ],
  },
].map((d) => detailSchema.parse(d));

export const sideProjects = data;
