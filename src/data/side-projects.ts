import { type Detail, detailSchema } from './types';

const data: Detail[] = [
  {
    title: 'ai-library',
    url: 'https://github.com/khw1031/ai-library',
    role: 'Open Source',
    subtitle: 'Claude Code 프롬프트 자산 라이브러리',
    content: [
      {
        title: '프로젝트 개요',
        description: [
          'Claude Code 및 LLM 기반 도구를 위한 재사용 가능한 프롬프트 자산(Skills, Rules, Agents) 모음',
          'Progressive Disclosure 원칙 기반 3단계 로드 모델로 LLM 컨텍스트 효율성 극대화',
        ],
      },
      {
        title: '주요 컴포넌트',
        description: [
          'Skills: feature-workflow, qa-workflow, plan-workflow 등 실무 검증된 워크플로우',
          'Agents: task-master(병렬 태스크 오케스트레이터), code-reviewer(시니어 코드 리뷰어)',
          'Rules: progressive-disclosure 등 코드베이스 전반 적용 가이드라인',
        ],
      },
      {
        title: '설계 원칙',
        description: [
          '3단계 Progressive Disclosure: 항상 로드(~100토큰) → 활성화 시(<5000토큰) → 요청 시(무제한)',
          '컨텍스트 격리: 각 워크플로우 단계가 별도 대화 컨텍스트에서 실행',
          'Human in the Loop: 다음 단계 진행 전 사용자 확인',
          'Git 기반 히스토리: 각 단계 완료 시 커밋 체크포인트 생성',
        ],
      },
    ],
  },
  {
    title: 'add-ai-tools',
    url: 'https://www.npmjs.com/package/add-ai-tools',
    role: 'NPM Package',
    subtitle: 'AI 에이전트 리소스 설치 CLI 도구',
    content: [
      {
        title: '주요 기능',
        description: [
          'GitHub, GitLab, Git SSH 등 다양한 소스에서 AI 에이전트 리소스 설치 지원',
          'Claude Code, Cursor, GitHub Copilot, Antigravity 등 멀티 에이전트 플랫폼 지원',
          '인터랙티브 모드 및 자동화 모드(--yes) 지원',
          'ZIP 내보내기 기능으로 오프라인 배포 지원',
        ],
      },
      {
        title: '기술 스택',
        description: ['Node.js / TypeScript', 'CLI 인터페이스 설계', 'Git 저장소 파싱 및 처리'],
      },
      {
        title: '특징',
        description: [
          '프로젝트/글로벌 스코프 설치 지원',
          '에이전트별 설치 경로 자동 매핑',
          'npx를 통한 설치 없이 즉시 실행 가능',
        ],
      },
    ],
  },
  {
    title: 'glowed',
    url: 'https://github.com/khw1031/glowed',
    role: 'Open Source / Go TUI',
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
    url: 'https://www.npmjs.com/package/@hynu/swagger-mcp',
    role: 'NPM Package',
    subtitle: 'Swagger MCP Server',
    content: [
      {
        description: ['Swagger의 정보를 받아오는 MCP Server를 개발해서 오픈소스화'],
      },
    ],
  },
  {
    title: '룰루루틴',
    url: 'https://www.luluroutine.com',
    role: '개인 프로젝트',
    subtitle: '루틴 관리 및 공유 웹 애플리케이션',
    content: [
      {
        description: ['1인 개발', 'Nextjs, supabase 기반의 Fullstack Application'],
      },
    ],
  },
].map((d) => detailSchema.parse(d));

export const sideProjects = data;
