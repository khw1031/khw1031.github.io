import { sideProjects } from './side-projects';
import { type DocumentPage, documentPageSchema } from './types';

const data: DocumentPage = documentPageSchema.parse({
  title: '김현우',
  description:
    '프론트엔드 제품 개발 경험을 기반으로 AI Transformation과 생산성 향상을 구축하는 김현우 이력서.',
  sections: [
    {
      title: '프로필',
      details: [
        {
          subtitle:
            '프론트엔드 제품 개발 경험을 기반으로 개발·비개발 직무의 AI Transformation을 설계·구축해 조직 생산성을 높이는 개발자',
          content: [
            {
              kind: 'prose',
              description: [
                '8년간 스타트업부터 대기업까지 웹 애플리케이션을 개발했고, 현재 한샘에서 파트 리드로 AI 도구를 활용한 개발 워크플로우 구축과 웹 성능 최적화를 리드하고 있다.',
                'AI가 코드를 더 만들수록 리뷰 부담·맥락 유실·품질 편차라는 과제가 커지는 시대에, 실험과 검증의 균형을 잡으며 팀 단위로 재현 가능한 워크플로우를 만드는 일에 집중한다.',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '핵심 성과',
      details: [
        {
          title: '정량 하이라이트',
          content: [
            {
              description: [
                '인테리어 플래너: 3인 팀·21일 개발로 기존 예상 2~3개월 대비 62% 일정 단축, AI 협업 비율 86.8%, 테스트:소스 비율 0.80 달성',
                'Hanssem AI Toolkit: 37개 Skills/Rules/Agents 항목을 검색·설치 가능한 사내 도구 자산으로 제품화, v2.18.0까지 릴리즈 운영',
                'Feature Workflow Skill: Requirements→Design→Task→Implementation→Review 5단계를 4종 AI 에이전트에서 동일 절차로 사용 가능하게 표준화 (v1.1.0)',
                '한샘몰 전시 컴포넌트: 번들 사이즈 70% 감소(Mobile 927KB→279KB), 빌드 시간 75% 단축 달성',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '경력 사항',
      details: [
        {
          title: '(주)한샘',
          role: '파트 리드',
          period: '2023.02 — 재직중',
          content: [
            {
              title: '프론트엔드 성능 엔지니어링',
              description: [
                '전시 컴포넌트 번들 사이즈 70% 감소(Mobile 927→279KB, PC 1.16MB→462KB)·빌드 시간 75% 단축 — Yarn/Rollup을 pnpm/Turbo/Vite(esbuild)로 전환하고 Lodash-ES·peerDependencies·트리쉐이킹 최적화로 LCP·TBT·CLS 개선',
                '한샘몰 서버 메모리 최적화로 PM2 제거 시 135KB 절감·Sentry 15% 오버헤드 정량 분석, CloudWatch Container Insights 기반 지속 모니터링과 autocannon/nGrinder 부하 테스트 방법론 확보',
              ],
            },
            {
              title: '디자인시스템·전시 플랫폼',
              description: [
                '한샘몰 디자인시스템을 Owner/Maintainer로 구축·운영 — Core·Mobile·PC 3패키지, Storybook 문서화, /release 커맨드 기반 자동 릴리즈, 50+ 정규 릴리즈 운영',
                '한샘몰 전시 시스템 개편 및 HomeSOL 그랜드 오픈 수행 — 전시 컴포넌트 설계, 어드민/클라이언트 분리 아키텍처, Sentry 연동',
                '기간계 모바일 디자인시스템 구현 — 15개 컴포넌트 중 14개(93%)를 Storybook·Jest 기반으로 문서화·테스트',
              ],
            },
            {
              title: 'ERP·기간계 아키텍처',
              description: [
                'ERP 프론트엔드 아키텍처를 팀 내 최초로 구축 — pnpm Workspaces+Turborepo 모노레포(apps 2·packages 9), PR 리뷰·Git 운영 규칙·MSW·Jenkins 선택적 빌드/배포 파이프라인 설계, CMS·WMSM 신규 서비스에 100% 적용',
                'HFCM 홈퍼니싱 시공시스템 PC(250+ 화면) 전담 개발, HFCMS 모바일·PC·고객 웹뷰 3클라이언트 인수 운영',
                '형상관리를 GitHub Enterprise→Bitbucket으로 전환하고 Nexus 기반 npm 레지스트리·내부 패키지 퍼블리싱 워크플로우 구축',
              ],
            },
            {
              title: 'AI 인프라·표준화',
              description: [
                '팀 레벨 AI 코딩 표준화 프레임워크(.ai/ 디렉토리·Grounding Rules·Research→Plan→Review→Implement→Verify 워크플로우)를 설계·문서화하고 Claude Code의 IT본부 도입을 추진해 팀 단위 AI 코딩 기반을 구축',
                'PRD→UIUX→Figma→FE Code 4단계 AI 워크플로우와 Design System Dictionary 기반 Figma/DS/Tailwind 3-way 검증 프레임워크를 설계',
                'Squad Platform PoC(Git-Native 기획 협업 플랫폼)와 Design System Dictionary PoC를 설계해 기획-디자인-개발 협업 모델을 실험',
              ],
            },
          ],
        },
        {
          title: '인프랩',
          role: '파트 리드',
          period: '2018.10 — 2020.05',
          url: 'https://inflearn.com',
          content: [
            {
              description: [
                '코딩 교육 플랫폼 인프런을 git init to production으로 구축 — 워드프레스 웹앱을 NodeJS 기반으로 마이그레이션하고 유닛 테스트·코드 리뷰·스프린트 기반 개발·데일리 스크럼을 도입, Pure JavaScript·FxJS 기반 함수형 프론트엔드로 개발',
              ],
            },
          ],
        },
        {
          title: '(주)한화L&C',
          role: '팀원',
          period: '2014.06 — 2016.05',
          content: [
            {
              description: [
                '재무회계팀에서 Oracle ERP(매출채권·매입채무)와 세무(부가세·원천세)를 담당 — 이후 개발자로 전향',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '주요 프로젝트',
      details: [
        {
          title: '인테리어 플래너 AI 활용 개발',
          period: '2026.02 — 2026.03',
          role: '프론트엔드 개발 / AI 워크플로우 리드 · (주)한샘',
          content: [
            {
              title: 'What',
              kind: 'prose',
              description: [
                '2026.02~2026.03 기간 동안 한샘 인테리어 플래너 웹뷰를 Claude Code 기반 AI 워크플로우로 개발했다 — 3인 팀.',
              ],
            },
            {
              title: 'How',
              description: [
                '5단계 품질 파이프라인: 요구사항 분석 → 시스템 설계 → 태스크 분해 → 구현 → 리뷰 & QA',
                '33개 커스텀 Claude Skills 활용',
                'Figma MCP + AI Rules 기반 UI/UX 정밀도 확보',
                '265+ 작업 산출물, 53개 태스크',
                'React + TypeScript + Tailwind CSS, Jest 기반 TDD',
              ],
            },
            {
              title: 'Impact',
              kind: 'prose',
              description: [
                '기존 예상 2~3개월을 0.95개월(21일)로 단축해 62% 일정 단축을 달성했다. 소스 19,127줄, 테스트 15,227줄, 125 Jira 티켓, 약 410 커밋, AI 협업 비율 86.8%를 기록했다.',
              ],
            },
          ],
        },
        {
          title: 'Feature Workflow Skill 설계 및 사내 표준화',
          period: '2026.02 — 2026.03',
          role: 'AI 워크플로우 설계 / 표준화 리드 · (주)한샘',
          content: [
            {
              title: 'What',
              kind: 'prose',
              description: [
                'AI 에이전트를 활용한 기능 구현을 Requirements → Design → Task → Implementation → Review 5단계로 표준화하는 Claude Skill을 설계·검증·라이브러리화했다. 인테리어 플래너 프로젝트에서 실전 적용해 효과를 검증한 뒤, hanssem-ai-library의 공통 Skill로 추출해 사내 4종 AI 에이전트(Claude Code / Cursor / GitHub Copilot / Antigravity)에서 동일 절차로 사용 가능한 자산으로 전환했다.',
              ],
            },
            {
              title: 'How',
              description: [
                '4대 핵심 원칙: Context Isolation(단계별 독립 실행), Human in the Loop(승인 게이트), Document as Interface(.md 문서 통신), Git as History(체크포인트 커밋)',
                '5단계 워크플로우: Requirements Analyst → System Designer → Task Analyzer → Coordinator → Reviewer, 단계별 입·출력 문서를 .ai/tasks/<TASK_ID>/에 고정',
                '테스트 시나리오 일관성: Step 1의 Given-When-Then(TS-xxx)이 설계·태스크·TDD 구현·리뷰까지 그대로 연결',
                'Step 4 병렬 구현 자동화: TeamCreate → TaskCreate(의존성 그래프) → Task Worker 스폰(최대 5, TDD 강제) → 모니터링 → TeamDelete',
                '작업 재개 보장: status.yaml SSOT + task.sh CLI + resume-guide로 어느 세션에서나 이어 진행',
              ],
            },
            {
              title: 'Impact',
              description: [
                '검증(인테리어 플래너): 53개 태스크 · 265+ 산출물 · 125 Jira 티켓을 5단계 워크플로우로 처리, 62% 일정 단축 · 86.8% AI 협업 비율 · 테스트:소스 0.80 달성의 핵심 메커니즘',
                '표준화(hanssem-ai-toolkit): common/skills/feature-workflow v1.1.0으로 등록, npx 한 줄로 사내 모든 팀이 동일 절차 설치·사용 가능',
                '멀티 에이전트 확산: Claude Code, Cursor, GitHub Copilot, Antigravity 4종 에이전트에서 동일 META.md로 호환',
              ],
            },
          ],
        },
        {
          title: 'Hanssem AI Toolkit / Frontend AI Library 구축',
          period: '2026.01 — 현재',
          role: 'AI 도구 생태계 설계/구축 리드 · (주)한샘',
          content: [
            {
              title: 'What',
              kind: 'prose',
              description: [
                '2026.01부터 AI 에이전트용 Skills, Agents, Rules를 관리하고 배포하는 Hanssem AI Toolkit / Frontend AI Library를 설계·구축했다.',
              ],
            },
            {
              title: 'How',
              description: [
                'Skills/Rules 라이브러리와 META.md 기반 메타데이터 자동 수집',
                'Bitbucket SSH 기반 install-ai CLI: --list, --all, --update, --agent',
                'Claude Code, Cursor, GitHub Copilot, Antigravity 멀티 에이전트 지원',
                'Vite + React 문서 웹 UI: 검색, 그룹/타입/태그 필터, 상세 패널, 설치 명령어 복사, Copy Prompt',
                'Bitbucket CI/CD 파이프라인, semver 기반 버전 관리',
              ],
            },
            {
              title: 'Impact',
              kind: 'prose',
              description: [
                '37개 문서화된 라이브러리 항목을 웹 UI에서 검색·설치 가능하게 구성했고, v2.18.0까지 릴리즈 운영했다. AI 워크플로우 지식을 팀 단위로 배포 가능한 도구 자산으로 전환했다.',
              ],
            },
          ],
        },
        {
          title: 'Hanssem Swagger MCP 서버 개발',
          period: '2026.01 — 2026.03',
          role: 'MCP 서버 개발 및 API 문서 표준화 · (주)한샘',
          url: '/posts/20251218/',
          content: [
            {
              title: 'What',
              kind: 'prose',
              description: [
                '2026.01~2026.03 기간 동안 내부 API 문서를 LLM이 자연어로 조회할 수 있는 Swagger MCP 서버를 개발했다.',
              ],
            },
            {
              title: 'How',
              description: [
                'OpenAPI 3.0+ 지원 MCP 서버 개발',
                'list_services, list_apis, get_api_detail, get_components 도구 제공',
                '자연어 기반 API 조회와 Swagger → Zod 스키마 자동 변환',
                'Drill-down 패턴으로 LLM 컨텍스트 토큰 오버플로우 방지',
                'Node.js, MCP SDK, Cursor/Claude Code/GitHub Copilot 연동',
              ],
            },
            {
              title: 'Impact',
              kind: 'prose',
              description: [
                'Swagger 문서 탐색 없이 API 상세와 컴포넌트 스키마를 조회해 코드 생성을 자동화할 수 있게 했고, drill-down 조회 패턴으로 LLM 컨텍스트 토큰 오버플로우를 방지했다. 오픈소스(@hynu/swagger-mcp)로 공개했다.',
              ],
            },
          ],
        },
        {
          title: 'Figma MCP 연동 및 AI-Ready 디자인 가이드',
          period: '2026.01 — 2026.02',
          role: '프론트엔드 엔지니어 / Design-Code 브릿지 · (주)한샘',
          content: [
            {
              title: 'What',
              kind: 'prose',
              description: [
                '2026.01~2026.02 기간 동안 Figma MCP 연동과 AI-Ready 디자인 가이드를 수립했다.',
              ],
            },
            {
              title: 'How',
              description: [
                'Figma Context MCP 테스트 프레임워크 구축: 컴포넌트 인식, 레이어 계층, 변형 처리 검증',
                'AI-Ready 피그마 디자인 가이드 수립: Layer = DOM 구조, 100% Auto Layout, 시맨틱 네이밍',
                'Local & Global AI Rules 시스템',
                'Figma Desktop MCP + DEV 모드 통합',
              ],
            },
            {
              title: 'Impact',
              kind: 'prose',
              description: ['99% 디자인 충실도 달성과 구현 시간 3배 단축 패턴을 문서화했다.'],
            },
          ],
        },
        {
          title: '바이브 파일럿 AI 워크플로우',
          period: '2025.12',
          role: 'AI 워크플로우 구현 및 파일럿 참여 · (주)한샘',
          content: [
            {
              title: 'What',
              kind: 'prose',
              description: [
                '2025.12에 5인 팀으로 Claude Code 기반 AI 워크플로우 파일럿을 수행했다. 고객 상담 앱 8페이지 웹 구현을 6일간 10 Jira 티켓으로 완료하고 일정 단축과 디자인 정합도를 검증했다.',
              ],
            },
            {
              title: 'How',
              description: [
                'Plan(00-plan.md) → Task(10-task.md) → Implementation(20-result.md) 3단계 워크플로우',
                'Human in the Loop 체크포인트',
                'Rules, Templates, Commands 시스템 표준화',
                'Claude Code, Figma MCP, Swagger API, React + TypeScript + Tailwind CSS 활용',
              ],
            },
            {
              title: 'Impact',
              kind: 'prose',
              description: [
                '6일간 10 Jira 티켓을 완료했고 Figma 디자인 정합도 80~95%, 평균 기획 10분/건, 실행 2시간/건, 53~68% 일정 단축을 검증했다.',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '사이드 프로젝트',
      details: sideProjects,
    },
    {
      title: '교육 사항',
      details: [
        {
          title: '패스트캠퍼스',
          period: '2017 (수료)',
          content: [{ title: '프론트엔드 부트캠프' }],
        },
        {
          title: 'Udacity',
          period: '2016 (수료)',
          content: [{ title: 'Nano Degree, Intro to Programming' }],
        },
        {
          title: '성균관대학교',
          period: '2005.03 — 2014.08 (졸업)',
          content: [{ title: '경영대학 경영학과' }],
        },
        {
          title: '홍익대학교',
          period: '2006.03 — 2010.02 (중퇴)',
          content: [{ title: '미술대학 예술학과' }],
        },
      ],
    },
  ],
});

export const cv = data;
