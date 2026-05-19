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
          title: '팀 단위 바이브 코딩 워크플로우 구축',
          period: '2025.12',
          role: '파트 리드 / (주)한샘',
          content: [
            {
              title: '프로젝트 개요',
              description: [
                '팀 기반 Agentic Coding Workflow 구축 및 파일럿 운영',
                '표준화된 워크플로우로 일관된 품질의 AI 코딩 산출물 확보',
              ],
            },
            {
              title: '주요 성과',
              description: [
                '개발 시간 80~90% 단축 (API 연동 시간 1/3, 구현 사전 조사 시간 감소)',
                '구현 유사도 80~95% 달성 (1-shot 기준)',
                'Figma MCP로 디자인 재현율 90% 이상',
                'Swagger MCP로 API 연동 시간 1/3로 단축',
              ],
            },
            {
              title: '워크플로우 구성',
              description: [
                'Setup → Research → Plan → Implement → Review 단계별 체계화',
                '공통 Rules + Templates + 명령어로 동일한 Input/Output 품질 확보',
                'MCP 기반 상호운용 아키텍처 설계 (Global → Team → Project 계층 상속)',
              ],
            },
          ],
        },
        {
          title: '한샘 Swagger MCP Server 개발',
          period: '2025.12',
          role: '파트 리드 / (주)한샘',
          url: '/posts/20251218/',
          content: [
            {
              title: '프로젝트 개요',
              description: [
                'Swagger 문서를 AI가 직접 조회할 수 있는 MCP Server 개발 및 오픈소스화',
                '자연어로 API 작성 → MCP 조회 → 스키마 조회 후 타이핑 및 API 연동까지 자동 완성',
              ],
            },
            {
              title: '주요 성과',
              description: [
                'Swagger 문서 탐색 없이 자동 코드 생성 가능',
                'API 연동 작업 시간 1/3로 단축',
                'NPM 패키지로 오픈소스 배포 (@hynu/swagger-mcp)',
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
