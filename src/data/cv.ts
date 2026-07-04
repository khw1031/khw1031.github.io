import { sideProjects } from './side-projects';
import { type DocumentPage, documentPageSchema } from './types';

const data: DocumentPage = documentPageSchema.parse({
  title: '김현우',
  description: '김현우 이력서.',
  sections: [
    {
      title: '경력',
      details: [
        {
          title: '한샘',
          role: '프론트엔드 / AI Transformation',
          period: '2023.02.01 — 재직중',
        },
        {
          title: '슈퍼메이커즈',
          role: '프론트엔드',
          period: '2021.12.20 — 2022.12.31',
        },
        {
          title: '한화생명',
          role: '프론트엔드',
          period: '2021.01.18 — 2021.12.25',
        },
        {
          title: '인프랩',
          role: '프론트엔드',
          period: '2018.10.01 — 2020.04.01',
        },
        {
          title: '텀블벅',
          role: '프론트엔드',
          period: '2017.07.03 — 2018.04.07',
        },
        {
          title: '현대엘엔씨(구 한화L&C)',
          role: '재무팀',
          period: '2014.07.01 — 2016.05.31',
        },
      ],
    },
    {
      title: '주요 프로젝트',
      details: [
        {
          title: '한샘 인테리어 플래너',
          period: '2026.02 — 2026.03',
          role: 'FE 리드',
          url: '/posts/hanssem-interior-planner/',
          content: [
            {
              kind: 'prose',
              description: [
                '리액트 웹뷰 기반으로 인테리어 상담·계약·시공 완료까지 고객 여정 전반을 관리하는 플러터 애플리케이션 개발·런칭',
                '에이전틱 코딩 워크플로우에 Figma CLI, Jira 티켓 → PR 자동화, 자동 코드 리뷰 팀, Figma 작성 규칙(글로벌·로컬 AI Rule, 프레임 관리 규칙)을 결합한 하네스로 일관된 품질로 개발 기간 단축',
                '네이티브·웹 사이 브릿지 인터페이스 아키텍처와 서비스별 HTTP 클라이언트 설계, 토큰 자동 주입·갱신 및 MSW·Sentry·Vitest 기반 품질 체계 구축',
              ],
            },
          ],
          impact: [
            '개발 기간 20일 / 예상 대비 약 62% 절감',
            '코딩 에이전트 협업 비율 83% / 83개 태스크',
            'TDD / 테스트 커버리지 약 90%',
          ],
          references: [
            {
              label: 'App Store',
              url: 'https://apps.apple.com/kr/app/%ED%95%9C%EC%83%98-%EC%9D%B8%ED%85%8C%EB%A6%AC%EC%96%B4-%ED%94%8C%EB%9E%98%EB%84%88/id6760631818',
            },
            {
              label: 'Google Play',
              url: 'https://play.google.com/store/apps/details?id=com.hanssem.consultation',
            },
          ],
        },
        {
          title: '프론트엔드 개발 워크플로우 설계 및 표준화',
          period: '2026.01 — 2026.02',
          role: '리드',
          url: '/posts/feature-workflow/',
          content: [
            {
              kind: 'prose',
              description: [
                'AI 에이전트 기능 구현을 Requirements → Design → Task → Implementation → Review 5단계로 표준화하는 Claude Skill 설계·검증·라이브러리화',
                '인테리어 플래너에서 실전 검증 후 hanssem-ai-library 공통 Skill로 추출, 사내 4종 AI 에이전트(Claude Code / Cursor / GitHub Copilot / Antigravity)에서 동일 절차로 사용 가능한 자산으로 전환',
                '4대 핵심 원칙: Context Isolation(단계별 독립 실행), Human in the Loop(승인 게이트), Document as Interface(.md 문서 통신), Git as History(체크포인트 커밋)',
                '5단계 워크플로우: Requirements Analyst → System Designer → Task Analyzer → Coordinator → Reviewer, 단계별 입·출력 문서를 .ai/tasks/<TASK_ID>/에 고정',
                'Step 1의 Given-When-Then(TS-xxx) 테스트 시나리오를 설계·태스크·TDD 구현·리뷰까지 일관 연결',
                'Step 4 병렬 구현 자동화: TeamCreate → TaskCreate(의존성 그래프) → Task Worker 스폰(최대 5, TDD 강제) → 모니터링 → TeamDelete',
                'status.yaml SSOT + task.sh CLI + resume-guide로 어느 세션에서나 작업 재개 보장',
              ],
            },
          ],
          impact: [
            '검증(인테리어 플래너): 53개 태스크·265+ 산출물·125 Jira 티켓을 5단계로 처리, 62% 일정 단축·86.8% AI 협업·테스트:소스 0.80 달성의 핵심 메커니즘',
            '표준화(hanssem-ai-toolkit): common/skills/feature-workflow v1.1.0 등록, npx 한 줄로 사내 전 팀이 동일 절차 설치·사용',
            '멀티 에이전트 확산: Claude Code·Cursor·GitHub Copilot·Antigravity 4종에서 동일 META.md로 호환',
          ],
        },
        {
          title: 'IT AI 개발 도구 생태계 구축',
          period: '2026.01 — 현재',
          role: '리드',
          url: '/posts/ai-dev-tools/',
          content: [
            {
              kind: 'prose',
              description: [
                'Skills·Agents·Rules를 관리·배포하는 Frontend AI Library와 설치 CLI·문서 웹 UI 구축, Claude Code·Cursor·GitHub Copilot·Antigravity 멀티 에이전트 지원',
                '내부 API를 자연어로 조회해 코드 생성을 자동화하는 Swagger MCP, Figma → 코드 정밀도를 높인 Figma MCP·AI-Ready 디자인 가이드 등 개발 생산성 도구 개발·배포',
                'Bitbucket CI/CD·semver 기반 릴리즈 운영으로 전사 배포 체계 확립',
              ],
            },
          ],
          impact: [
            '37개 도구·규칙을 팀 단위로 배포, v2.18.0까지 릴리즈 운영',
            'Figma 99% 디자인 충실도 / Swagger MCP 오픈소스(@hynu/swagger-mcp) 공개',
          ],
          references: [{ label: 'Swagger MCP', url: '/posts/20251218/' }],
        },
        {
          title: '바이브 파일럿 AI 워크플로우',
          period: '2025.12',
          role: '파트 리드',
          content: [
            {
              kind: 'prose',
              description: [
                '5인 팀 Claude Code 기반 AI 워크플로우 파일럿 — 고객 상담 앱 8페이지 웹 구현',
                'Plan(00-plan.md) → Task(10-task.md) → Implementation(20-result.md) 3단계 워크플로우',
                'Human in the Loop 체크포인트, Rules/Templates/Commands 시스템 표준화',
                'Claude Code, Figma MCP, Swagger API, 리액트 + TypeScript + Tailwind CSS 활용',
              ],
            },
          ],
          impact: [
            '6일간 10 Jira 티켓 완료, Figma 정합도 80~95%',
            '평균 기획 10분·실행 2시간/건, 53~68% 일정 단축 검증',
          ],
        },
      ],
    },
    {
      title: '사이드 프로젝트',
      details: sideProjects,
    },
    {
      title: '교육',
      details: [
        {
          title: '패스트캠퍼스',
          period: '2017',
          content: [{ title: '프론트엔드 풀타임 부트캠프(수료)' }],
        },
        {
          title: 'Udacity',
          period: '2016',
          content: [{ title: 'Nano Degree, Intro to Programming(수료)' }],
        },
        {
          title: '홍익대학교',
          period: '2006.03 - 2010.02',
          content: [{ title: '예술학과(중퇴)' }],
        },
        {
          title: '성균관대학교',
          period: '2005.03 - 2014.07',
          content: [{ title: '경영학과(졸업)' }],
        },
      ],
    },
  ],
});

export const cv = data;
