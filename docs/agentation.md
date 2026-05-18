# Agentation Workflow

[Agentation](https://www.agentation.com/)을 이용해 본 저장소의 UI 변경을 효율적으로 요청하기 위한 가이드.

## Agentation이란

데스크톱 어노테이션 도구. 라이브 사이트의 DOM 요소를 클릭하고 메모를 남기면, 다음과 같은 구조화 데이터를 생성한다.

- CSS 셀렉터
- 컴포넌트 파일 경로 (build-time source map 또는 React/Astro devtools 메타 기반)
- 부모-자식 컴포넌트 계층
- Computed style snapshot
- 사용자가 첨부한 자연어 메모

이 출력은 MCP(Model Context Protocol)를 통해 Claude Code 같은 코딩 에이전트에 직접 전달되어, 복사-붙여넣기 없이 "고쳐줘" 요청이 즉시 실행 가능한 컨텍스트가 된다.

## 본 저장소에서의 사용 절차

1. 변경하고 싶은 화면을 라이브(또는 `pnpm dev`)에서 연다
2. Agentation 데스크톱 앱에서 해당 탭을 활성화
3. 변경 대상 요소를 클릭 → 노트 작성
4. 노트는 DESIGN.md의 피드백 원칙을 따른다 (아래)
5. MCP 연결이 있으면 Claude Code에 자동 전달, 없으면 클립보드 출력 → 이 저장소 이슈/PR에 붙여넣기

## 좋은 피드백 작성법 (DESIGN.md와 동일)

| 원칙 | 좋은 예 | 나쁜 예 |
| --- | --- | --- |
| **Specificity** | `Header brand link is misaligned 2px below baseline of theme toggle` | `header 좀 이상함` |
| **Atomicity** | 한 어노테이션 = 한 이슈. 헤더 정렬과 푸터 색은 별도 어노테이션 | 한 노트에 5가지 이슈 묶기 |
| **Context** | `Expected: 16px gap between meta items. Actual: 4px` | `간격 조절 필요` |
| **References** | DESIGN.md 섹션·토큰을 인용 ("Section 3 Header 규칙 위반") | 단순 "이상해 보임" |

## 권장하지 않는 사용 케이스

- 컨텐츠(`.md` 본문) 수정: 직접 파일 편집이 더 빠르고 정확하다
- 컴파일 에러/타입 오류: 빌드 로그가 더 정확하다
- DESIGN.md 자체에 대한 변경: 디자인 원칙 변경은 별도 PR로 토론 + 머지가 필요

## 라이센스

개인·내부 팀용 무료. 상용 재배포 시 별도 라이센스 필요.
