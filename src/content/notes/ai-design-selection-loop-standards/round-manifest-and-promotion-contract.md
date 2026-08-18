---
title: '[SPEC] 디자인 선별 라운드의 후보·아티팩트·승격 규약'
pubDate: '2026-08-10T15:04:09+09:00'
noteId: AGENT-2608-018
description: 'MCP, Agent Skills, Git worktree, 시각 회귀 도구와 실험 추적 제품의 경계를 대조해 디자인 선별 라운드에 필요한 최소 매니페스트를 정의한다.'
summary: '기존 도구의 experiment, run, artifact, metric, branch 개념은 재사용할 수 있지만 candidate, comparison, 사람 approval, promotion과 다음 라운드 계보는 moodbox가 정의해야 한다. 초기 제품 표면은 CLI가 적합하다.'
lang: ko
tags:
  - 'round-manifest'
  - 'experiment-tracking'
  - 'visual-testing'
  - 'mcp'
  - 'git-worktree'
lintHash: 'b8936a825483'
---

[상위 노트](/notes/ai-design-selection-loop-standards/)에서 분리한 실행·추적 규격 조사다. 확인일은 2026-08-10이다.

## 인접 규격과 제품

| 대상 | 이미 제공하는 것 | 제공하지 않는 것 |
| --- | --- | --- |
| MCP 2026-07-28 | resources, prompts, tools와 표준화된 호출·결과 계약 | 디자인 라운드, 후보, 선호, 승격의 의미 |
| Agent Skills | `SKILL.md`, scripts, references, assets로 절차 패키징 | 실행 상태와 디자인 후보의 정본 |
| git worktree | 같은 저장소의 여러 작업 트리와 브랜치 격리 | 후보 선호와 승격 상태 |
| Storybook·Chromatic·Percy | 기준 렌더와 새 렌더의 시각 차이 검출·검토 | 여러 신규 후보 사이의 취향 선택과 다음 라운드 계보 |
| MLflow·W&B·DVC | experiment, run, parameter, metric, artifact, 비교와 재현 | 사람이 고르는 디자인 candidate와 선택 이유 |
| Figma MCP·Stitch | 디자인 컨텍스트 접근, 생성 또는 코드 연결 | 저장소형 선별 상태의 공통 규약 |

## 개념 대응

- `experiment`: 하나의 제품 또는 디자인 목표
- `round`: 같은 기준 아래 후보를 생성·비교하는 한 번의 선별 세션
- `run`: 하나의 생성기 또는 에이전트 실행
- `artifact`: 실행이 만든 파일, 화면, 코드, 스크린샷, 메타데이터
- `candidate`: 사람이 비교하고 승격할 선택지. 여러 아티팩트를 묶을 수 있음
- `metric`: 기계 검사, 접근성 결과, 별점, 쌍대 비교 등 출처와 기준이 붙은 관측
- `branch`·`worktree`: 실행 격리 수단
- `approval`: 사람이 남긴 판단
- `promotion`: 기준 후보를 바꾸는 명시적 상태 전이

`artifact`와 `candidate`를 합치면 한 실행이 여러 화면과 파일을 만들 때 무엇을 골랐는지 불분명해진다. `branch`와 `promotion`을 합치면 격리 구조가 곧 취향 판정으로 오해된다.

## 최소 매니페스트

```yaml
manifestVersion: moodbox.round/v0
roundId: round-006
parentRoundId: round-005
baselineCandidateId: candidate-005-b
intent:
  promptRef: prompts/round-006.md
  soulRef: soul.md
  designRef: DESIGN.md
  tokenRef: tokens/design.tokens.json
  rubricRef: rubrics/visual-v3.md
execution:
  gitCommit: abc1234
  branch: moodbox/round-006
  worktree: .moodbox/worktrees/round-006
candidates:
  - candidateId: candidate-006-a
    runId: run-006-a
    artifacts:
      - kind: screenshot
        path: artifacts/candidate-006-a.png
      - kind: source
        path: candidates/candidate-006-a/
    metrics:
      - kind: pairwise
        comparedWith: candidate-006-b
        evaluator: human:owner
    state: shortlisted
decisions:
  - kind: promote
    candidateId: candidate-006-a
    actor: human:owner
    reason: "주요 행동의 계층이 선명하고 정보 밀도가 목표에 맞음"
```

## 불변식

1. `roundId`, `candidateId`, `runId`는 도구가 바뀌어도 유지되는 moodbox 식별자다.
2. 후보는 같은 라운드의 목표와 평가 기준을 공유해야 직접 비교할 수 있다.
3. `baselineCandidateId`와 `gitCommit`은 분리한다. 기준 디자인과 코드 시점은 같은 개념이 아니다.
4. 메트릭에는 `kind`, 평가 주체, 평가 기준 버전을 둔다. 사람 취향과 기계 검사를 같은 숫자로 합치지 않는다.
5. 후보 상태는 `proposed`, `shortlisted`, `rejected`, `promoted`, `archived` 중 하나다.
6. `promoted`는 사람의 `decisions` 이벤트가 있을 때만 성립한다.
7. 다음 라운드는 `parentRoundId`와 `baselineCandidateId`를 모두 기록한다. 하나는 절차 계보이고 다른 하나는 디자인 기준선이다.
8. 외부 도구의 raw 응답은 adapter가 매니페스트 계약으로 바꾼다. 상위 선별 로직이 Figma, MLflow, W&B별 응답 구조를 직접 알지 않는다.

## 제품 표면

1. **CLI가 첫 표면이다.** 로컬 매니페스트, worktree, 비교 화면, 승격 이벤트를 가장 적은 경계로 검증할 수 있다.
2. **Agent Skills는 절차를 공유할 때 더한다.** 라운드 설계, 기준 작성, 평가 순서, 중단 조건을 에이전트에 가르치는 용도다.
3. **MCP는 여러 클라이언트가 같은 상태를 공유할 때 더한다.** MCP는 매니페스트를 읽고 쓰는 외부 어댑터이지 정본이 아니다.
4. **시각 회귀 제품은 기계 게이트로 연결한다.** 픽셀 차이와 회귀는 검출하지만 미적 우승자를 정하지 않는다.
5. **실험 추적 제품은 선택적 export 대상으로 둔다.** moodbox의 로컬 계약을 MLflow나 W&B의 run·artifact에 맞추되, 그 제품을 사용하지 않아도 선별 계보가 완전해야 한다.

---

<div class="refs">

## 참조

- [MCP Specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28) · 외부 데이터와 도구를 resources, prompts, tools로 노출하는 정본 프로토콜. 디자인 라운드 의미는 정의하지 않는다. 정본 저장소 확인 커밋 `f817239`. (1차 · 2026-07-28 · 2026-08-10 확인)
- [Agent Skills Specification](https://agentskills.io/specification) · `SKILL.md`와 선택적 scripts·references·assets의 패키지 구조. (1차 · 2026-08-10 확인)
- [Git worktree 문서](https://git-scm.com/docs/git-worktree) · 같은 저장소에서 여러 작업 트리를 관리하는 정본 명령 문서. (1차 · 2026-08-10 확인)
- [MLflow Tracking](https://mlflow.org/docs/latest/ml/tracking/) · experiment가 run을 묶고 run이 파라미터·코드 버전·메트릭·아티팩트를 기록하는 제품 계약. MLflow 3 문서. (1차 · 2026-08-10 확인)
- [W&B Runs](https://docs.wandb.ai/models/runs) · run을 하나의 계산 단위로 기록하고 비교·재현하는 제품 계약. (1차 · 2026-08-10 확인)
- [DVC Experiment Management](https://dvc.org/doc/user-guide/experiment-management) · Git 기반 실험 생성·비교·적용·보존 흐름. (1차 · 2026-08-10 확인)
- [Storybook Visual Tests](https://storybook.js.org/docs/writing-tests/visual-testing) · 스토리를 렌더해 기준 이미지와 시각 차이를 검출하는 흐름. (1차 · 2026-08-10 확인)
- [Chromatic 문서](https://www.chromatic.com/docs/) · Storybook 기반 시각 테스트와 변경 검토 제품. (1차 · 2026-08-10 확인)
- [Percy 문서](https://www.browserstack.com/docs/percy) · 스크린샷 기준선과 새 빌드의 시각 차이를 비교하는 제품. (1차 · 2026-08-10 확인)
- [Figma MCP server 가이드](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) · Figma 디자인 컨텍스트를 에이전트 도구로 노출하는 공식 제품 문서. (1차 · 2026-08-10 확인)

</div>
