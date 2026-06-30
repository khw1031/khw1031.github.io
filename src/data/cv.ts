import { sideProjects } from './side-projects';
import { type DocumentPage, documentPageSchema } from './types';

const data: DocumentPage = documentPageSchema.parse({
  title: '김현우',
  description: '김현우 이력서.',
  sections: [
    {
      title: '경력 사항',
      details: [
        {
          title: '(주)한샘',
          role: '파트 리드',
          period: '2023.02 — 재직중',
        },
        {
          title: '슈퍼메이커즈',
          role: '리드',
          period: '2021.12 — 2022.12',
        },
        {
          title: '(주)한화생명',
          role: '팀원',
          period: '2021.01 — 2021.12',
        },
        {
          title: '인프랩',
          role: '파트 리드',
          period: '2018.10 — 2020.05',
        },
        {
          title: '제플린엑스',
          role: '팀원',
          period: '2018.07 — 2018.09',
        },
        {
          title: '텀블벅',
          role: '팀원',
          period: '2017.07 — 2018.06',
        },
        {
          title: '(주)한화L&C',
          role: '팀원',
          period: '2014.06 — 2016.05',
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
