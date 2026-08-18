---
title: '[SPEC] Herdr CLI 조작 규정과 명령 표면 지도'
pubDate: '2026-08-08T16:12:36+09:00'
noteId: AGENT-2608-014
description: 'Herdr 스킬 문서가 규정한 에이전트 조작 규칙을, 게이트·조회·생성·agent 표면·pane 표면·비가역 조작·미규정 표면 일곱 갈래의 실제 CLI 명령에 대응시킨 조작 규정.'
summary: 'Herdr 조작은 예측이 아니라 확인으로 이루어진다. 세션 소속은 HERDR_ENV로, 명령 문법은 설치된 바이너리로, 식별자와 상태는 응답 JSON과 주입된 환경변수로 확인하고, 사용자가 소유한 레이아웃·포커스·프로세스는 명시 요청 없이 건드리지 않는다. 같은 이름의 명령이 pane과 agent 두 표면에 쌍으로 있고, 그 선택은 정체성과 생애주기 판정이 필요한가로 갈린다. 문서가 규정한 명령과 바이너리 0.8.0이 실제로 노출하는 명령을 나란히 놓아, 어느 대목이 규정이고 어느 대목이 실측인지 구분해 담는다.'
lang: ko
tags:
  - 'herdr'
  - 'terminal-multiplexer'
  - 'agent-harness'
  - 'cli'
  - 'spec'
---

**최상위:** Herdr 조작은 예측이 아니라 확인으로 이루어진다 — 세션 소속·명령 문법·식별자·에이전트 상태를 전부 실행 시점의 응답에서 확인하고, 사용자가 소유한 레이아웃·포커스·프로세스는 명시 요청 없이 건드리지 않는다.

## 읽는 관점

원문의 장르는 **에이전트용 조작 명세**다. 튜토리얼처럼 보이지만 코드 블록은 예시가 아니라 규정이고, 하중은 산문 문단에 걸려 있다. 문서 전체를 떠받치는 곳은 세 문단이다 — `L54`(pane이냐 agent냐), `L56`(agent 명령이 받는 타깃), `L58`(생애주기 상태 어휘). 뒤의 모든 `--wait`·`--until`·읽기 설명이 이 어휘로 쓰여 있다.

두 축이 반복된다. **확인해서 알아낸다**(바이너리·JSON·감지된 상태)와 **사용자 것은 보존한다**(`--current`, `--no-focus`, 닫지 않기, 죽이지 않기).

아래 갈래 순서는 한 작업의 명령 흐름이다. 1~5는 시간 순으로 한 번의 조작을 관통하고, 6과 7은 그 전 구간에 상시 걸린다.

**표기.** `‹L…›`는 원문(`skills/herdr/SKILL.md`, 195줄)의 줄 번호이고, `(실측)`은 이 기기에서 `herdr` 0.8.0을 직접 실행해 얻은 출력이다(2026-08-08 확인). 원문이 규정한 것과 바이너리가 노출하는 것을 섞지 않는다.

## 1. 게이트와 발견 — 어디 있는지, 무엇이 있는지

1. **첫 명령 이전에 자신이 Herdr가 관리하는 pane 안인지부터 확인한다** ‹L10›
   1. 확인 방법은 환경변수 하나: `test "${HERDR_ENV:-}" = 1` ‹L12-14›
   2. 실패하면 Herdr 안에서 실행 중이 아니라고 말하고 멈춘다. 바깥에서 포커스된 Herdr 세션을 들여다보거나 조작하지 않는다 ‹L16›
   3. 스킬 자체의 발동 조건도 같은 성격이다 — 사용자가 Herdr를 명시적으로 언급할 때만 로드하고, 배경 터미널·위임·병렬 작업에 도움이 된다는 이유만으로는 발동하지 않는다 ‹L3›
   4. 통과하면 `PATH`의 `herdr` 바이너리가 현재 세션과 대화한다 ‹L18›
2. **명령 문법의 권위는 문서가 아니라 설치된 바이너리다** ‹L22›
   1. 시작점은 `herdr --help` ‹L24-26›
   2. 그다음 관련 명령 그룹을 하위 명령 없이 실행하면 그 그룹이 출력된다 ‹L28-40›. 원문이 든 그룹은 아홉 개 — `agent`, `pane`, `workspace`, `tab`, `worktree`, `terminal`, `notification`, `integration`, `session`
   3. (실측) 최상위 usage에는 여기에 `api`, `config`, `channel`, `completion`, `server`가 더 나온다. `terminal`은 usage 요약에는 없지만 `herdr terminal`로 실행하면 하위 명령이 출력된다
3. **발견 행위 자체가 부작용을 낸다** ‹L42›
   1. 인자 없는 맨 `herdr`는 TUI를 띄우거나 붙는다 ‹L42›
   2. 변경성 중첩 명령을 인자 생략으로 찔러보지 않는다 — `herdr workspace create` 같은 명령은 기본값으로 유효해서 그대로 실행된다 ‹L42›
4. (실측) 최상위 옵션: `--no-session`, `--session <name>`, `--remote <ssh-target>`, `--remote-keybindings local|server`, `--handoff`, `--default-config`, `--skill`, `--version`, `--help`. `herdr --skill`은 이 스킬 파일 자체를 출력한다

## 2. 조회 — 지금 무엇이 있나

1. **식별자와 상태는 추측하지 않고, 응답 JSON과 주입된 환경변수에서 읽는다** ‹L44›
   1. 대부분의 제어 명령이 JSON을 반환하고, 식별자와 상태는 거기서 읽는다 ‹L44, L191›
   2. 공개 ID는 불투명하지만 안정적인 핸들 — workspace `w1`, tab `w1:t1`, pane `w1:p1` ‹L62-66›
   3. 호출자 자신의 위치는 Herdr가 각 관리 pane에 주입한 `$HERDR_WORKSPACE_ID`·`$HERDR_TAB_ID`·`$HERDR_PANE_ID`로 안다 ‹L70-74›
2. **원문이 조회에 드는 다섯 명령** ‹L78-86›

   ```bash
   herdr workspace list
   herdr tab list --workspace "$HERDR_WORKSPACE_ID"
   herdr pane current --current
   herdr pane list --workspace "$HERDR_WORKSPACE_ID"
   herdr agent list
   ```

3. **생성 응답이 다음에 쓸 ID를 노출한다** ‹L88›
   1. `workspace create` → `.result.workspace`·`.result.tab`·`.result.root_pane` ‹L88›
   2. `tab create` → `.result.tab`·`.result.root_pane` ‹L88›
   3. `pane split` → `.result.pane`, 분할 후 pane ID는 `.result.pane.pane_id` ‹L88, L106, L164›
4. **ID의 수명과 이동 규칙** ‹L68›
   1. 닫힌 tab·pane ID는 재사용되지 않는다 ‹L68›
   2. 다른 workspace로 옮겨진 pane은 workspace가 붙은 새 pane ID를 받는다. `pane move` 이후에는 `.result.move_result.pane.pane_id` 또는 live agent name으로 이어간다 ‹L68›
   3. 옛 값은 `.result.move_result.previous_pane_id`로 보고되지만, 옮겨진 프로세스가 상속한 caller context에서만 계속 해석된다 — 일반적인 agent 타깃으로 쓰지 않는다 ‹L68›
5. (실측) 원문이 들지 않은 조회 명령: `workspace get`, `tab get`, `pane get`, `pane layout`, `pane process-info`, `pane neighbor --direction`, `pane edges`, `agent get`, `agent explain`, `worktree list`, `session list [--json]`, `status [server|client]`

## 3. 생성 — 자리 만들기

1. **새 작업 자리는 사용자의 레이아웃·포커스·작업 디렉터리를 보존하는 형태로 만든다** ‹L92›
   1. 기본값은 현재 tab의 sibling pane과 현재 작업 디렉터리 ‹L92›
   2. workspace·tab·worktree·다른 cwd는 사용자가 그 토폴로지나 위치를 명시적으로 요청할 때만 만든다 ‹L92›
2. **방향 결정** ‹L94-100›
   1. 사용자가 요청했으면 그대로 따르고, 아니면 호출자 pane을 먼저 본다: `herdr pane layout --pane "$HERDR_PANE_ID"` ‹L96-98›
   2. 넓은 pane은 right로, 좁거나 높은 pane은 down으로 쪼갠다 ‹L100›
   3. 같은 방향 분할을 반복해 쓸 수 없을 만큼 좁은 열이나 낮은 행을 만들지 않는다 ‹L100›
3. **표준형** ‹L102-106›

   ```bash
   herdr pane split --current --direction right --cwd "$PWD" --no-focus
   ```

   1. 포커스는 호출 pane에 남기고(`--no-focus`), 호출자의 작업 디렉터리는 명시적으로 보존한다(`--cwd "$PWD"`) ‹L100›
   2. 적절할 때 `right`를 `down`으로 바꾼다. 새 pane ID는 `.result.pane.pane_id`에서 읽는다 ‹L106›
   3. 이 기하 규칙은 에이전트를 띄울 때와 보통 명령을 돌릴 때 같다 ‹L158-162›
4. (실측) `pane split`의 전체 서명은 `[<pane_id>|--pane ID|--current] --direction right|down [--ratio FLOAT] [--cwd PATH] [--env KEY=VALUE] [--focus] [--no-focus]`
5. (실측) 원문이 "요청할 때만"으로 미뤄 둔 다른 생성 표면: `tab create`, `workspace create`, `worktree create|open`, 그리고 `pane move <pane_id> --tab <tab_id> --split right|down` / `--new-tab` / `--new-workspace`

## 4. agent 표면 — 에이전트에게 일 시키기

1. **판정: 이 일에 agent 표면이 필요한가** ‹L48-54›
   1. pane 명령은 원시 터미널·셸·테스트·서버·입력·출력을 제어하고, agent 명령은 지금 그 pane을 점유한 **인식된** 코딩 에이전트를 제어한다 ‹L50-52›
   2. pane은 에이전트 유무와 무관하게 존재한다. `agent start`는 이미 있는 available shell pane을 요구하며 레이아웃을 만들거나 쪼개거나 옮기지 않는다 ‹L54›
   3. 보통 프로세스면 pane 명령, Herdr가 에이전트 정체성을 검증하거나 `idle`·`working`·`blocked`·`done`·`unknown` 생애주기를 해석해야 하면 agent 명령 ‹L54›
2. **타깃 규칙** ‹L56›
   1. 유일한 live agent name 또는 지금 그 에이전트를 호스팅하는 pane ID만 받는다. terminal ID나 맨 agent-kind 라벨은 받지 않는다 ‹L56›
   2. 이름은 `[a-z][a-z0-9_-]{0,31}`에 맞아야 하고 live agent들 사이에서 유일해야 한다 ‹L56›
   3. 이름은 현재 pane 점유자를 따라가며, 그 에이전트가 종료·해제·교체되면 지워진다 ‹L56›
3. **시작** ‹L108-120›
   1. available shell pane의 정의는 세 조건이다 — 대화형 프롬프트에 있고, 셸 자신이 foreground이며, foreground 명령·에디터·에이전트가 돌고 있지 않다 ‹L108›

      ```bash
      herdr agent start reviewer --kind codex --pane <returned-pane-id>
      herdr agent start reviewer --kind codex --pane <returned-pane-id> -- <agent-args...>
      ```

   2. kind는 사용자가 요청한 것을 쓰고, 설치된 kind 목록과 옵션은 `herdr agent`로 확인한다 ‹L114›
   3. 네이티브 에이전트 인자는 `--` 뒤에만 넘긴다 ‹L114-118›
   4. `agent start`는 같은 pane에서 기대한 에이전트를 감지하고 대화형 입력 준비가 됐다고 판단한 뒤에만 반환한다. 기본 시작 타임아웃 30초 ‹L120›
   5. (실측) 서명은 `herdr agent start <name> --kind KIND --pane ID [--timeout MS] [-- <agent-args...>]`, `--kind`가 받는 값은 21개 — `pi|claude|codex|gemini|cursor|devin|agy|cline|omp|mastracode|opencode|copilot|kimi|kiro|droid|amp|grok|hermes|kilo|qodercli|maki`
4. **제출** ‹L122-128›

   ```bash
   herdr agent prompt reviewer "Review the current diff and report only actionable findings." --wait --timeout 120000
   ```

   1. 텍스트와 인코딩된 Enter를 원자적으로 제출하며, 그 pane의 live bracketed-paste mode를 존중한다 ‹L128›. (배경) bracketed paste는 붙여넣은 텍스트를 `ESC[200~`…`ESC[201~`로 감싸 프로그램이 타이핑과 구분하게 하는 터미널 모드다
   2. 보통 작업에는 `--wait`면 충분하다 — 처음으로 안정된 `idle`·`done`·`blocked` 상태를 기다린다. 이 기본값을 `--until`로 되풀이하지 않는다 ‹L128›
5. **대기가 무엇을 추적하는지** ‹L130-138›
   1. non-working 상태에서 보낸 prompt는 5초 안에 관측된 생애주기 변화를 내야 한다. 아니면 Herdr는 무한 대기 대신 `agent_prompt_stalled`를 반환한다 ‹L130›
   2. 이 대기는 개별 턴이 아니라 생애주기 상태를 추적한다 — 에이전트가 이미 working이면 진행 중인 턴의 완료가 조건을 만족시킬 수 있다 ‹L130›
   3. `--until`은 상태 특정 워크플로에만 쓴다. 예를 들어 이미 돌고 있는 에이전트가 입력을 요구하기를 기다릴 때 `herdr agent wait reviewer --until blocked --timeout 120000` ‹L132-136›
   4. `--until` 없는 단독 `agent wait`은 `agent prompt --wait`과 같은 안정 상태 기본값을 쓴다 ‹L138›
6. **상태 어휘** ‹L58›
   1. `idle` — 입력 받을 준비가 됐고, 그 tab이 포커스된 Herdr UI에서 목격됐다 ‹L58›
   2. `done` — 같은 idle 상태인데, 목격되지 않은 배경 작업이 끝난 경우다 ‹L58›
   3. 목격 표시는 tab을 포커스하거나 focus 명령으로 pane·agent를 타깃할 때 생긴다. CLI 읽기는 목격으로 표시하지 않는다 ‹L58›
   4. `blocked` — Herdr가 승인 또는 질문 UI를 인식했다 ‹L58›
   5. `unknown` — 에이전트는 있지만 확신 있게 분류할 수 없다. 완료의 증거가 아니다 ‹L58›
7. **조작과 읽기** ‹L140-154›

   ```bash
   herdr agent send-keys reviewer esc
   herdr agent send-keys reviewer ctrl+c
   herdr agent get reviewer
   herdr agent read reviewer --source recent-unwrapped --lines 120
   ```

   1. 대화형 UI 조작은 논리 키로 보내고, Herdr는 바이트를 하나라도 쓰기 전에 모든 키를 검증한다 ‹L147›
   2. wait가 실패하거나 `blocked`를 반환하면, 무엇을 보낼지 정하기 전에 `agent get`과 `agent read`로 살핀다. pane 표면은 원시 터미널 제어가 의도적일 때만 쓴다 ‹L154›
8. (실측) 원문이 들지 않은 agent 명령: `agent list`, `agent rename <target> <name>|--clear`, `agent focus <target>`, `agent attach <target> [--takeover]`, `agent explain <target> [--json|--format text|json] [--verbose]`

## 5. pane 표면 — 보통 명령 돌리기

1. **자리는 4번과 같은 기하 규칙으로 만든다** ‹L158-162›
2. **구동과 확인의 세 명령** ‹L164-170›

   ```bash
   herdr pane run <returned-pane-id> "just test"
   herdr pane wait-output <returned-pane-id> --match "test result" --timeout 120000
   herdr pane read <returned-pane-id> --source recent-unwrapped --lines 120
   ```

   1. `pane run`은 명령 텍스트와 Enter를 원자적으로 보낸다 ‹L172›
   2. `pane wait-output`은 선택된 스냅샷을 즉시 검색하므로, 이미 존재하는 출력도 매치될 수 있다 ‹L172›
   3. `--match <text>`는 리터럴 부분 문자열, `--regex <pattern>`은 Rust 정규식. `--timeout`을 생략하면 무한 대기가 허용된다 ‹L172›
3. **읽기 소스 네 가지** ‹L174-181›
   1. `visible` — 현재 렌더된 뷰포트 ‹L176›
   2. `recent` — 소프트 랩을 포함한 최근 출력 ‹L177›
   3. `recent-unwrapped` — 소프트 랩을 이어 붙인 최근 출력. 로그·트랜스크립트에는 이것 ‹L178›
   4. `detection` — 에이전트 감지에 쓰는 평문 하단 버퍼 스냅샷 ‹L179›
   5. 색과 터미널 스타일이 증거일 때만 `--format ansi`, 아니면 text ‹L181›
4. **`--lines`의 한계와 그 뒤의 폴백** ‹L183-185›
   1. `--lines`는 pane의 가용 화면과 호스트 스크롤백에서 더 많은 행을 요청한다 ‹L183›
   2. 늘려도 완료된 응답이 더 드러나지 않으면 그 pane은 터미널의 alternate screen에서 에이전트를 돌리고 있을 가능성이 높다. alternate screen을 벗어난 행은 호스트 스크롤백에 들어가지 않으므로 줄 수를 키워도 복구되지 않는다 ‹L183›. (배경) alternate screen은 TUI가 쓰는 별도 화면 버퍼로, 종료 시 원래 화면을 복원하며 스크롤백을 남기지 않는다
   3. 그 읽기가 실패한 **다음에야**, 에이전트에게 전체 응답을 임시 디렉터리에 Markdown으로 쓰고 파일 경로만 답하게 한 뒤 그 파일을 직접 읽는다. 폴백으로만 쓰고, 최초 프롬프트에 파일 출력을 요구하지 않는다 ‹L185›
5. (실측) 원문이 들지 않은 pane 명령: `pane send-text`, `pane send-keys`, `pane zoom [--toggle|--on|--off]`, `pane resize --direction [--amount FLOAT]`, `pane focus --direction`, `pane swap`, `pane rename`

## 6. 되돌릴 수 없는 것 — 상시 걸리는 금지

1. **타깃은 항상 명시한다** ‹L76, L190›
   1. `--current`, 명시적 pane ID, 또는 유일한 agent name을 쓴다 ‹L190›
   2. 타깃을 생략하면 UI가 포커스한 pane이 쓰일 수 있고, 그 pane은 사용자나 다른 클라이언트의 것일 수 있다 ‹L76›
2. **배경 작업에는 `--no-focus`를 쓴다.** 사용자가 컨텍스트 전환을 요청한 경우는 예외 ‹L189›
3. **내가 만들지 않은 workspace·tab·pane·session은 사용자가 명시적으로 요청하지 않는 한 닫지 않는다** ‹L192›
4. **서버 프로세스** ‹L193-194›
   1. 활성 세션에서 `herdr server stop`을 절대 실행하지 않는다 — 사용자가 서버와 그 pane 프로세스들을 멈출 의도를 명시한 경우만 예외 ‹L193›
   2. 메인 Herdr 프로세스를 죽이지 않는다. 격리된 서버가 필요한 실험은 named test session으로 한다 ‹L194›
5. **실패 신호 구분** — CLI 서버 오류는 stderr의 JSON에 종료 상태 1, CLI 문법 오류는 종료 상태 2 ‹L195›
6. (실측) 이 갈래에 해당하는 명령 표면: `pane close`, `tab close`, `workspace close`, `worktree remove --workspace ID [--force]`, `session stop <name>`, `session delete <name>`, `server stop`

## 7. 원문이 규정하지 않은 표면 (실측)

원문이 사용법을 규정한 것은 `agent`·`pane`·`workspace`·`tab` 네 그룹과 `server stop` 하나다. 아래는 바이너리 0.8.0이 노출하지만 원문에 절차가 없는 표면이라, 쓰려면 `herdr <group>`으로 직접 확인해야 한다 ‹L22›.

1. **상태 보고 경로** — `pane report-agent <pane_id> --source ID --agent LABEL --state idle|working|blocked|unknown`, `pane report-agent-session`, `pane release-agent`, `pane report-metadata`, `workspace report-metadata`. 통합이 Herdr에 에이전트 상태를 알리는 입력구다
2. **`terminal` 그룹** — `terminal attach <terminal_id> [--takeover]`, `terminal session control|observe <target> [--cols N] [--rows N]`, `terminal title set|clear`. 직접 attach에서 빠져나오는 키는 `ctrl+b q`이고, 리터럴 `ctrl+b`는 `ctrl+b ctrl+b`로 보낸다
3. **`integration`** — `integration install|uninstall <kind>`, 대상 16종(`pi`, `omp`, `claude`, `codex`, `copilot`, `devin`, `droid`, `kimi`, `opencode`, `kilo`, `hermes`, `qodercli`, `cursor`, `mastracode`, `antigravity-cli`, `grok`)
4. **`worktree`** — `worktree list|create|open|remove`. 원문은 그룹 이름을 들고 ‹L35› "사용자가 명시 요청할 때만" 만들라고 하지만 ‹L92› 하위 명령은 규정하지 않는다
5. **`notification`** — `notification show <title> [--body TEXT] [--position …] [--sound none|done|request]`
6. **운영·설정** — `api <subcommand>`, `config reset-keys`, `channel set stable|preview`, `update [--handoff]`, `completion zsh`, `server reload-config`. 설정 파일은 `~/.config/herdr/config.toml`

## 원문 읽기 안내

- **먼저 읽을 곳** — `L54`, `L56`, `L58` 세 문단. 나머지가 전부 이 세 문단이 세운 구분 위에 서 있다. 그다음이 `L100-106`의 분할 표준형으로, 3번 갈래와 5번 갈래 도입부가 같은 명령을 공유한다
- **훑어도 되는 곳** — 제목(`L6`), 다리 문장(`L18`), 각 코드 블록 앞의 연결 문장(`L48`, `L78`, `L94`, `L122`, `L140`, `L149`, `L164`, `L174`). 다음 블록을 가리키는 안내라 주장을 싣지 않는다. `L8`도 Herdr가 무엇인지 한 문장으로 세우는 도입이고 그 내용은 `L50-52`에서 다시 쪼개진다
- **원문이 스스로 미결로 표시한 곳** — `unknown`은 확신 있게 분류하지 못한 상태이며 완료의 증거가 아니라고 못박는다 ‹L58›. `L183`의 alternate screen 진단도 단정이 아니라 추정(`probably`)이라, 뒤따르는 파일 폴백 ‹L185›은 확진 없이 넘어가는 우회로다
- **정의가 뒤늦게 나오는 용어** — `available shell pane`은 `L54`에서 먼저 쓰이고 `L108`에 가서야 세 조건으로 정의된다
- **조건의 개수** — available shell pane 세 조건, agent 이름 규칙 세 조건(정규식·유일성·점유자 추종), 읽기 소스 네 가지, 생애주기 상태 다섯 가지(`L54`)인데 정의가 붙는 것은 네 개다. `working`은 이름만 등장한다
- **숫자** — 시작 타임아웃 기본 30초 ‹L120›, prompt 후 생애주기 변화 관측 한계 5초 ‹L130›, 예시의 `--timeout 120000`(밀리초) ‹L125, L135, L168›, 종료 코드 1과 2 ‹L195›
- **한 문장에 접힌 예외** — "CLI 읽기는 목격으로 표시하지 않는다" ‹L58›가 `idle`과 `done`을 가르고, `previous_pane_id`가 "옮겨진 프로세스가 상속한 caller context에서만" 해석된다는 단서 ‹L68›도 한 문장뿐이다
- **순서 제약** — `L185`의 파일 폴백에는 "그 읽기가 실패한 다음에야"라는 선행 조건이 붙고, 마지막 문장이 최초 프롬프트에 파일 출력을 요구하지 말라고 다시 막는다

## 출처

- (1차) Herdr 공식 저장소의 에이전트 스킬 문서 — [herdrdev/herdr `skills/herdr/SKILL.md`](https://raw.githubusercontent.com/herdrdev/herdr/master/skills/herdr/SKILL.md) (master, 195줄, 2026-08-08 확인). 이 기기에 설치된 `~/.agents/skills/herdr/SKILL.md`와 바이트 단위로 동일하다
- (1차) `herdr` 0.8.0 바이너리의 `--help` 및 그룹별 하위 명령 출력 (2026-08-08 실행). `(실측)` 표시가 붙은 항목의 근거다
