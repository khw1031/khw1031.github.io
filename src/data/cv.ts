import { sideProjects } from './side-projects';
import { type DocumentPage, documentPageSchema } from './types';

const sideProjectSkeleton = sideProjects.map((p) => ({
  title: p.title,
  url: '/portfolio/',
  role: p.role,
  subtitle: p.subtitle,
}));

const data: DocumentPage = documentPageSchema.parse({
  title: '김현우 · Frontend Based Product Developer',
  description: '김현우 프론트엔드 개발자 이력서.',
  sections: [
    {
      title: '경력 사항',
      details: [
        {
          title: '(주)한샘',
          role: '파트 리드',
          period: '2023.02 — 재직중',
          content: [
            {
              title: '한샘 Swagger MCP Server 개발 및 도입',
              url: '/posts/20251218/',
              description: [
                'Swagger MCP Server를 통해 표준화된 워크플로우 내에서 자동화된 Agentic Coding이 가능하게 함',
                'Swagger 문서를 탐색하지 않고도 자동으로 코드를 생성할 수 있도록 함',
              ],
            },
            {
              title: '팀 기반 Agentic Coding Workflow 구축 리드',
              url: '/posts/20251210/',
              description: [
                '표준화된 워크플로우 구축 및 자동화로 일관된 퀄리티의 Agentic Coding이 가능하게 함',
                '2주 스프린트 파일럿으로 워크플로우 검증 후 1월 신규 프로젝트에 도입 예정',
              ],
            },
            {
              title: 'Figma MCP Server 도입 및 AI 기반 프론트엔드 개발 효율화',
              url: '/posts/20250407/',
              description: [
                'Cursor와 Figma MCP Server를 연동하여 AI 기반 프론트엔드 개발 효율화에 기여',
                '디자인 시스템과 코드 생성 간 일관성 확보로 개발 생산성 향상',
                '혁신TF 검증을 통한 상용 수준의 코드 생성 워크플로우 확립',
              ],
            },
            {
              title: '스토어웹 서비스 Memory Leak, OOM 이슈 분석 및 해결',
              url: '/posts/20250404/',
              description: [
                '한샘몰 웹 애플리케이션 주기적 OOM 장애 원인 분석 및 해결',
                '메모리 누수 분석 및 개선 통한 성능 개선',
              ],
            },
            {
              title: '한샘몰 모바일 웹 성능 개선 리드',
              url: '/posts/20250330/',
              description: [
                '모바일 및 PC 웹 서비스 Core Web Vitals 성능 지표(LCP, TBT, CLS) 개선 계획 수립 및 실행',
                'Google Page Speed Insights 모니터링 시스템 구축(자사 및 타사)',
                '디자인 시스템 및 전시 컴포넌트 번들 사이즈 최적화 (40% 감소)',
                'Unused bytes 최적화로 script 실행시간 감소 (22% 감소)',
              ],
            },
            {
              title: '리모델링 외주 시공 프로 출석 관리 시스템',
              description: [
                '리모델링 공사 현장에서 근무하는 시공 프로의 출석 관리 시스템 클라이언트 개발',
              ],
            },
            {
              title: 'ERP 시스템 개발 및 마이그레이션',
              description: ['리모델링 실시간 관제 시스템, 홈퍼니싱 현장 모바일'],
            },
            {
              title: '홈퍼니싱(가구 배송/시공 시스템) 개발 및 운영',
              description: [
                '홈퍼니싱 모바일 애플리케이션 개발 (웹뷰)',
                '홈퍼니싱 PC 애플리케이션 개발 (어드민)',
              ],
            },
          ],
        },
        {
          title: '슈퍼메이커즈',
          role: '리드',
          period: '2021.12 — 2022.12',
          ect: '이직사유: 오프라인 사업 집중화로 인한 개발팀 해체',
          content: [
            {
              title: "온라인 반찬 커머스 애플리케이션 '슈퍼키친'(미운영) 개발",
              description: ['반찬을 온라인으로 주문하거나 구독할 수 있는 웹 애플리케이션 개발'],
            },
            {
              title: "'슈퍼키친' 어드민 개발",
              description: [
                '커머스 웹 애플리케이션 어드민 플랫폼 개발(CMS, CRM, RMS, BI, OMS, WMS, TMS)',
              ],
            },
          ],
        },
        {
          title: '(주)한화생명',
          role: '팀원',
          period: '2021.01 — 2021.12',
          ect: '이직사유: 전 파트장(슈퍼메이커즈 CTO)의 이직 제안',
          content: [
            {
              title: "보험 상품 컨텐츠 관리 시스템 'HLI-CMS' 개발",
              description: [
                '구독형 보험, 다이렉트 보험의 생성 및 관리를 위한 CMS 툴 개발',
                'API mocking 전략 도입으로 백엔드-프론트엔드 개발 병렬화 구현, 개발 리드타임 40% 단축',
                '신규 보험 상품 출시 프로세스 간소화',
              ],
            },
            {
              title: "다이렉트 보험 웹 애플리케이션 '온슈어' 개발",
              url: 'https://direct.hanwhalife.com',
              description: ['CMS로 생성된 보험 상품을 고객에게 제공하기 위한 보험 플랫폼 개발'],
            },
          ],
        },
        {
          title: '인프랩',
          role: '파트 리드',
          period: '2018.10 — 2020.05',
          ect: '이직사유: 갭 이어 / 창업 시도',
          content: [
            {
              title: "코딩 교육 플랫폼 '인프런' 개발",
              url: 'https://inflearn.com',
              description: [
                'git init to production',
                '워드프레스 기반 웹 애플리케이션을 NodeJS 기반의 애플리케이션으로 마이그레이션',
                '유닛 테스트, 코드 리뷰 프로세스 도입, 스프린트 기반 개발 및 데일리 스크럼 도입',
                'Pure JavaScript와 함수형 기반의 라이브러리 FxJS를 활용한 프론트엔드 개발',
              ],
            },
            {
              title: '인프런 어드민 개발',
              description: ['인프런 강의 로드맵 기능 관리를 위한 웹 어드민 서비스(CMS) 개발'],
            },
          ],
        },
        {
          title: '제플린엑스',
          role: '팀원',
          period: '2018.07 — 2018.09',
          ect: '이직사유: 인프런 대표의 이직 제안',
          content: [
            {
              title: "인터렉티브 컴퓨팅 플랫폼 '제플' 개발",
              url: 'https://zepl.com',
              description: ['Angular 기반의 클라이언트를 React로 마이그레이션'],
            },
          ],
        },
        {
          title: '텀블벅',
          role: '팀원',
          period: '2017.07 — 2018.06',
          ect: '이직사유: 개발팀 인원 감축(경영악화)',
          content: [
            {
              title: "크라우드 펀딩 웹 애플리케이션 '텀블벅' 개발 및 유지보수",
              url: 'https://tumblbug.com',
              description: [
                'Ruby on Rails(SSR)에서 React(SSR+CSR)로 마이그레이션',
                '정적 코드 분석 툴 도입 및 커밋 단계에서 코드 분석 및 유닛 테스팅을 도입하여 협업 방식 개선',
              ],
            },
          ],
        },
        {
          title: '(주)한화L&C',
          role: '팀원',
          period: '2014.06 — 2016.05',
          ect: '이직사유: 직무 전환',
          content: [
            {
              title: '재무회계팀',
              description: [
                'Oracle ERP Account Receivable, Account Payable',
                '회계 담당(매출채권 / 매입채무)',
                '세무 담당(부가세 / 원천세)',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '사이드 프로젝트',
      details: sideProjectSkeleton,
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
          content: [
            {
              title: '경영대학 경영학과',
              description: ['학점: 3.21/4.5', '자퇴 후 재입학'],
            },
          ],
        },
        {
          title: '홍익대학교',
          period: '2006.03 — 2010.02 (중퇴)',
          content: [
            {
              title: '미술대학 예술학과',
              description: ['학점: 2.73/4.5', '제대 후 자퇴'],
            },
          ],
        },
      ],
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
    'Jenkins',
    'Github Actions',
    'Rollup',
    'Vite',
    'Vitest',
    'Confluence',
    'Claude',
    'Claude Code',
    'Firebase',
    'React Native',
  ],
});

export const cv = data;
