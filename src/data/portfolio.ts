import { sideProjects } from './side-projects';
import { type DocumentPage, documentPageSchema } from './types';

const data: DocumentPage = documentPageSchema.parse({
  title: '김현우 · Portfolio',
  description: '한샘에서 리드한 AI 도구 도입과 웹 성능 개선 프로젝트, 그리고 사이드 프로젝트.',
  hideContact: true,
  sections: [
    {
      title: '주요 프로젝트',
      details: [
        {
          title: '인테리어 플래너 AI 활용 개발',
          period: '2026.02 — 2026.03',
          role: '프론트엔드 개발 / AI 워크플로우 리드 / (주)한샘',
          content: [
            {
              title: '문제',
              description: [
                '기존 방식으로 2~3개월이 예상되는 인테리어 플래너 프론트엔드를 3인 팀으로 빠르게 완성해야 했고, Claude Code의 실무 적용 가능성도 검증해야 했다.',
              ],
            },
            {
              title: '역할',
              description: ['프론트엔드 개발과 AI 워크플로우 설계·적용을 리드했다.'],
            },
            {
              title: '접근',
              description: [
                '요구사항 분석 → 시스템 설계 → 태스크 분해 → 구현 → 리뷰 & QA의 5단계 품질 파이프라인을 적용했다.',
                '33개 커스텀 Claude Skills, Figma MCP, AI Rules를 활용하고 53개 태스크·265+ 작업 산출물 기반으로 TDD 구현을 진행했다.',
              ],
            },
            {
              title: '성과',
              description: [
                '21일에 완료해 기존 예상 2~3개월 대비 62% 일정을 단축했다.',
                '소스 19,127줄, 테스트 15,227줄, 125 Jira 티켓, 약 410 커밋을 처리했고 AI 협업 비율 86.8%와 테스트:소스 비율 0.80을 달성했다.',
              ],
            },
          ],
        },
        {
          title: 'Feature Workflow Skill 설계 및 사내 표준화',
          period: '2026.02 — 2026.03',
          role: 'AI 워크플로우 설계 / 표준화 리드 / (주)한샘',
          content: [
            {
              title: '문제',
              description: [
                'AI 에이전트 활용 기능 구현이 개인별 프롬프트와 즉흥 절차에 의존해 결과 품질·재현성·테스트 커버리지가 달라지는 문제가 있었다.',
              ],
            },
            {
              title: '역할',
              description: [
                '기능 구현을 표준화하는 Claude Skill을 설계하고 실제 프로젝트 검증 후 사내 공통 자산으로 등록했다.',
              ],
            },
            {
              title: '접근',
              description: [
                'Requirements → Design → Task → Implementation → Review 5단계와 Context Isolation, Human in the Loop, Document as Interface, Git as History 원칙을 정의했다.',
                'Step 간 통신을 `.ai/tasks/<TASK_ID>/`의 문서로 고정하고, 테스트 시나리오가 설계·태스크·TDD 구현·리뷰까지 이어지도록 설계했다.',
              ],
            },
            {
              title: '성과',
              description: [
                '인테리어 플래너 프로젝트에서 53개 태스크·265+ 산출물·125 Jira 티켓을 처리하는 핵심 메커니즘으로 검증했다.',
                'hanssem-ai-library의 `common/skills/feature-workflow` v1.1.0으로 등록해 Claude Code, Cursor, GitHub Copilot, Antigravity 4종 에이전트에서 동일 절차로 사용할 수 있게 표준화했다.',
              ],
            },
          ],
        },
        {
          title: 'Hanssem AI Toolkit / Frontend AI Library 구축',
          period: '2026.01 — 현재',
          role: 'AI 도구 생태계 설계/구축 리드 / (주)한샘',
          content: [
            {
              title: '문제',
              description: [
                'Claude Code, Cursor, GitHub Copilot, Antigravity 등 AI 에이전트 사용이 늘면서 팀 지식과 프롬프트가 개인 로컬 환경에 흩어지고 있었다.',
              ],
            },
            {
              title: '역할',
              description: [
                '사내 AI 에이전트 리소스를 표준 구조로 관리·설치·문서화하는 도구 생태계를 설계하고 구축했다.',
              ],
            },
            {
              title: '접근',
              description: [
                'Skills/Rules/Agents 라이브러리와 META.md 기반 메타데이터 수집, Bitbucket SSH 기반 install-ai CLI, Vite + React 문서 Web UI를 설계했다.',
                'Claude Code, Cursor, GitHub Copilot, Antigravity별 설치 경로를 매핑해 같은 도구를 여러 에이전트에서 재사용할 수 있게 했다.',
              ],
            },
            {
              title: '성과',
              description: [
                '37개 문서화된 라이브러리 항목을 웹 UI에서 검색·설치 가능하게 만들고 v2.18.0까지 릴리즈 운영했다.',
                'AI 워크플로우 지식을 개인 프롬프트에서 팀 단위로 배포 가능한 도구 자산으로 전환했다.',
              ],
            },
          ],
        },
        {
          title: '한샘 Swagger MCP Server 개발',
          period: '2026.01 — 2026.03',
          role: 'MCP 서버 개발 및 API 문서 표준화 / (주)한샘',
          url: '/posts/20251218/',
          content: [
            {
              title: '문제',
              description: [
                '프론트엔드 API 연동 시 Swagger 문서 탐색과 타입 정의 작성이 반복적으로 발생했다.',
              ],
            },
            {
              title: '접근',
              description: [
                'OpenAPI 3.0+ 기반 API 문서를 LLM이 자연어로 조회할 수 있는 MCP Server를 개발했다.',
                '`list_services`, `list_apis`, `get_api_detail`, `get_components` 도구와 Swagger → Zod 스키마 변환을 제공했다.',
              ],
            },
            {
              title: '성과',
              description: [
                'Swagger 문서 탐색 없이 API 상세와 컴포넌트 스키마를 조회해 코드 생성을 자동화할 수 있게 했다.',
                'Drill-down 조회 패턴으로 LLM 컨텍스트 토큰 오버플로우를 방지했다.',
              ],
            },
          ],
        },
        {
          title: 'Figma MCP Server 도입',
          period: '2025.04',
          role: '파트 리드 / (주)한샘',
          url: '/posts/20250407/',
          content: [
            {
              title: '프로젝트 개요',
              description: ['Cursor와 Figma MCP Server를 연동하여 AI 기반 프론트엔드 개발 효율화'],
            },
            {
              title: '주요 성과',
              description: [
                '디자인 시스템과 코드 생성 간 일관성 확보',
                '혁신TF 검증을 통한 상용 수준의 코드 생성 워크플로우 확립',
                'UI/UX 디자인 재현율 90% 이상 달성',
              ],
            },
          ],
        },
        {
          title: '스토어웹 Memory Leak, OOM 이슈 해결',
          period: '2025.04',
          role: '파트 리드 / (주)한샘',
          url: '/posts/20250404/',
          content: [
            {
              title: '프로젝트 개요',
              description: ['한샘몰 웹 애플리케이션의 주기적 OOM 장애 원인 분석 및 해결'],
            },
            {
              title: '주요 성과',
              description: ['메모리 누수 원인 분석 및 근본적 해결', '서비스 안정성 확보'],
            },
          ],
        },
        {
          title: '한샘몰 모바일 웹 성능 개선',
          period: '2025.03',
          role: '파트 리드 / (주)한샘',
          url: '/posts/20250330/',
          content: [
            {
              title: '프로젝트 개요',
              description: ['모바일 및 PC 웹 서비스 Core Web Vitals 성능 지표(LCP, TBT, CLS) 개선'],
            },
            {
              title: '주요 성과',
              description: [
                'Google Page Speed Insights 모니터링 시스템 구축 (자사 및 타사)',
                '디자인 시스템 및 전시 컴포넌트 번들 사이즈 최적화 (40% 감소)',
                'Unused bytes 최적화로 script 실행시간 감소 (22% 감소)',
              ],
            },
          ],
        },
        {
          title: '인프런 플랫폼 개발',
          period: '2018.10 — 2020.05',
          role: '파트 리드 / 인프랩',
          content: [
            {
              title: '프로젝트 개요',
              description: [
                '코딩 교육 플랫폼 인프런(https://inflearn.com) 개발',
                '워드프레스 기반 웹 애플리케이션을 NodeJS 기반으로 마이그레이션',
              ],
            },
            {
              title: '주요 성과',
              description: [
                'git init to production 완수',
                '유닛 테스트, 코드 리뷰 프로세스 도입',
                '스프린트 기반 개발 및 데일리 스크럼 도입',
                'Pure JavaScript와 FxJS를 활용한 함수형 프론트엔드 개발',
              ],
            },
          ],
        },
        {
          title: '텀블벅 플랫폼 개발',
          period: '2017.07 — 2018.06',
          role: '팀원 / 텀블벅',
          content: [
            {
              title: '프로젝트 개요',
              description: [
                '크라우드 펀딩 웹 애플리케이션 텀블벅(https://tumblbug.com) 개발 및 유지보수',
              ],
            },
            {
              title: '주요 성과',
              description: [
                'Ruby on Rails(SSR)에서 React(SSR+CSR)로 마이그레이션',
                '정적 코드 분석 툴 도입 및 커밋 단계 테스팅 프로세스 확립',
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
  ],
  keywords: [
    'NextJS',
    'React',
    'TypeScript',
    'React Query',
    'CSS',
    'HTML',
    'Git',
    'CI/CD',
    'Turborepo',
    'MCP',
    'Claude',
    'Claude Code',
    'Cursor',
  ],
});

export const portfolio = data;
