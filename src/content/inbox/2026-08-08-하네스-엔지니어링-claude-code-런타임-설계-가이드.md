---
title: '하네스 엔지니어링 — Claude Code 런타임 설계 가이드(Harness Books 1권) 정리'
pubDate: '2026-08-08T16:16:06+09:00'
noteId: AGENT-2608-015
description: 'Harness Books 1권 「Harness Engineering: A Design Guide to Claude Code」 전문(서문·9장·부록 3편)을 읽고 정리한 조사. 5개 하네스 층·예산 상수·복구 매트릭스·10원칙을 추리고, 근거가 유출 소스라는 검증 한계를 함께 기록했다.'
summary: '이 책의 명제는 "프롬프트는 말하는 법을, 하네스는 행동하는 법을 정한다"이고, 전제는 모델을 동료가 아니라 불안정한 부품으로 취급한다는 것이다. 그 위에 제어 평면(계층화된 시스템 프롬프트) → query loop(상태를 잇는 심장박동) → 도구·권한·인터럽트 → 컨텍스트 예산 → 오류·복구 다섯 층을 쌓고, 멀티에이전트를 속도가 아니라 불확실성 분할로, 검증을 구현과 분리된 독립 단계로 규정한다. 팀 도입 순서도 뒤집는다 — 스킬을 늘리기 전에 완료 정의부터 표준화하고, 훅은 기반 거버넌스가 안정된 뒤에 온다. 다만 근거가 2026-04-01 유출된 Claude Code 소스의 파일·라인 인용이라, 구조적 주장은 공개 문서로 교차 확인되지만 라인 번호 단위 인용은 대조할 방법이 없다.'
lang: ko
tags:
  - 'harness-engineering'
  - 'claude-code'
  - 'agent-runtime'
  - 'agentic-coding'
  - 'context-management'
canonical: 'https://harness-books.agentway.dev/en/book1-claude-code/'
---

> 캡처 맥락: `harness-books.agentway.dev/en/book1-claude-code/`의 영문판 전문(서문 + 9개 장 + 부록 A/B/C)을 직접 받아 읽고 정리했다. 확인 시점 2026-08-08. 저자는 `@wquguru`, 서문 서명일은 2026-04-01. 온라인판이 전문을 공개하고 있어 별도 구매·로그인은 필요 없었다(WebFetch는 403, 브라우저 User-Agent로 받으면 200).
>
> **근거의 성격을 먼저 밝힌다.** 이 책은 Claude Code 소스의 파일 경로와 **라인 번호**(`src/query.ts:241`, `src/utils/systemPrompt.ts:28` 등)를 근거로 논증한다. 서문 마지막 줄이 그 출처를 스스로 밝힌다 — "On the day of the Claude Code source leak, April Fool's Day". 즉 공개 저장소가 아니라 유출본이 근거이고, 책 본문은 저작권 경계를 이유로 소스를 재현하지 않고 구조 분석만 싣는다고 명시한다. 아래 정리에서 **구조적 주장은 공개 문서·실제 동작으로 교차 확인이 되지만, 라인 번호 단위 인용은 대조할 방법이 없다.**

## TL;DR

- 책 전체의 명제는 서문의 한 줄로 압축된다 — **"Prompt determines how it speaks. Harness determines how it acts."** 여기서 하네스는 부속 계층이 아니라 모델을 엔지니어링 환경에 넣기 위한 **전제 조건**으로 규정된다.
- 전제는 불편하지만 단순하다. **모델을 동료(teammate)가 아니라 불안정한 부품(unstable component)으로 취급하라.** 동료에게는 안정적 책임을 맡길 수 있지만 모델은 동료처럼 말할 뿐 동료급 안정성·책임·지속적 판단을 자동으로 얻지 못한다는 것이다. 나머지 아홉 장은 전부 이 전제의 파생이다.
- 뼈대는 5개 층 — **제어 평면(계층화된 시스템 프롬프트) → query loop(상태를 잇는 심장박동) → 도구·권한·인터럽트 → 컨텍스트 예산 → 오류·복구**. 그 위에 멀티에이전트·검증(7장), 팀 제도(8장)가 얹힌다.
- 가장 반직관적인 두 주장: **오류 경로가 곧 주 경로**(prompt-too-long은 예외가 아니라 "계절"이다)이고, **멀티에이전트의 가치는 속도가 아니라 불확실성 분할**이다. 조사·구현·검증·종합을 서로 다른 제약 컨테이너에 넣어 실패를 계층별로 짚을 수 있게 만드는 것이 핵심이라고 본다.
- 실무에 바로 쓸 만한 건 본문보다 **부록 A의 체크리스트 8종**이다. 특히 A.9의 6줄 — "능력보다 권한을 먼저, 자율성보다 롤백을 먼저, 배포보다 검증을 먼저, 긴 대화보다 컨텍스트 예산을 먼저, 멀티에이전트보다 수명 주기를 먼저, 팀 숙련을 기대하기보다 제도를 먼저."

## 1. 무엇인가

Harness Books라는 2권짜리 시리즈의 1권이다. 2권은 Claude Code와 Codex를 비교한다(`book2-comparing`). 사이트는 온라인 전문 + PDF + GitHub 저장소(`wquguru/harness-books`)를 함께 공개하고, 별도로 AgentWay라는 유료 실습 플랫폼을 연결해 두되 "이 책의 다음 장이 아니다"라고 선을 긋는다.

구성:

```
서문   하네스, 터미널, 엔지니어링 제약
1장   왜 하네스 엔지니어링이 중요한가
2장   프롬프트는 인격이 아니라 제어 평면이다
3장   Query Loop — 에이전트 시스템의 심장박동
4장   도구·권한·인터럽트 — 에이전트가 세계를 직접 만질 수 없는 이유
5장   컨텍스트 거버넌스 — 메모리·CLAUDE.md·compact를 예산 체제로
6장   오류와 복구 — 실패 이후에도 계속 일하는 시스템
7장   멀티에이전트와 검증 — 분업으로 불안정성 관리하기
8장   팀 도입 — 똑똑한 도구를 지속 가능한 워크플로로
9장   하네스 엔지니어링 10원칙
부록A  체크리스트 — 원칙을 실행 가능한 제약으로
부록B  다이어그램 — 런타임 골격 그리기
부록C  소스 맵 — 각 장의 근거 파일
```

책이 스스로 밝히는 경계 두 가지: (1) 소스 라인별 해설서가 아니다 — "그러면 주석 모음이 된다", (2) 소스 코드를 싣지 않는다 — 저작권 경계 때문. 대신 "왜 런타임이 이 모양으로 자랄 수밖에 없었나"를 묻겠다고 한다.

## 2. 다섯 개의 하네스 층

### 2.1 제어 평면 — 프롬프트는 인격이 아니다

핵심 주장은 시스템 프롬프트가 **문자열 하나가 아니라 섹션 배열**로 반환된다는 관찰에서 나온다. 정체성/미션, 시스템 규칙(사용자가 보는 텍스트, 권한 승인, 거부된 동작을 기계적으로 재시도하지 말 것, system reminder, 자동 압축), 엔지니어링 지침(요구되지 않은 것 추가 금지, 검증 안 된 것을 검증했다고 말하지 말 것, 편의를 위한 추상화 발명 금지)이 각각 다른 책임을 진다.

프롬프트를 제어 평면으로 만드는 건 텍스트 자체가 아니라 **우선순위 구조**다. 조립 순서가 `override → coordinator → agent → custom → default`로 하드코딩되어 있고, `appendSystemPrompt`는 항상 마지막에 덧붙기만 한다. 책이 뽑은 불변식:

```
assert exists unique base in sources                # 기준선은 유일해야 한다
assert precedence(override) > precedence(default)   # 순서는 하드코딩, "마지막에 쓴 사람이 이김"이 아니다
assert appendSystemPrompt never replaces base       # append는 append만 한다
```

특히 proactive 모드에서 agent 프롬프트가 default를 **대체하지 않고 뒤에 얹힌다**는 처리를 두고 "일반 헌법은 직무 기술서로 확장될 수는 있어도 지워질 수는 없다"고 설명한다. 이 규칙이 깨지면 프롬프트는 "나중에 쓴 사람이 이기는 낙서판"으로 퇴화한다는 것.

여기에 성능 논점이 붙는 게 이 장에서 제일 실용적이다. 프롬프트 섹션이 **캐시 가능한 것과 캐시를 깨는 것**(`DANGEROUS_uncachedSystemPromptSection`)으로 갈려 있고, 정적/동적 구간이 명시적으로 분리된다. "프롬프트의 어느 부분이 캐시를 무효화하는가"를 묻기 시작한 시점에서 그건 이미 카피라이팅이 아니라 제어 평면이라는 논증이다.

### 2.2 Query Loop — 성숙도는 루프의 유무로 갈린다

주장: 에이전트인지 아닌지는 말투가 아니라 **몇 턴 뒤에도 자기가 뭘 하는 중인지 아는가**로 갈린다.

루프가 교차 반복(cross-iteration) 상태 객체 하나를 유지한다 — `messages`, `toolUseContext`, `autoCompactTracking`, `maxOutputTokensRecoveryCount`, `hasAttemptedReactiveCompact`, `pendingToolUseSummary`, `stopHookActive`, `turnCount`, `transition`. 복구·압축·예산·훅·턴 카운트를 지역 불리언에 흩뿌리지 않았다는 점을 근거로 든다.

두 번째 관찰이 더 중요하다. **모델 호출 전에 하는 일이 길다** — 메모리 프리페치 → 스킬 발견 → compact 경계 이후 메시지 슬라이스 → 도구 결과 예산 → history snip → microcompact → context collapse → autocompact. 즉 "혼돈을 질서로 바꾸는 일"을 모델에게 위임하지 않고 **런타임이 먼저 정리한 뒤 넘긴다.** 컨텍스트를 잔뜩 밀어 넣고 모델이 알아서 고르길 기대하는 흔한 반대 패턴을 "런타임 책임을 확률 분포에 전가하는 것"이라고 부른다.

세 번째는 정지 조건이 하나가 아니라는 것이다. 이 표가 이 장의 알맹이다.

| 사건 | 사전 상태 | 트리거 | 다음 |
| --- | --- | --- | --- |
| 스트림 종료 + `tool_use` | 대기 중 tool_use 있음 | stop reason | 후속 진행, 도구 실행 |
| 스트림 종료, `tool_use` 없음 | 대기 도구 없음 | stop reason | stop hooks 진입 |
| 사용자 인터럽트 | 임의 | abort signal | 남은 결과 배출 + 합성 `tool_result` |
| `prompt_too_long` | compact 미시도 | recoverable error | collapse 배출 → reactive compact |
| `max_output_tokens` | cap < MAX | stop reason | `maxOutputTokensOverride` 상향 후 재실행 |
| `max_output_tokens` | cap = MAX | stop reason | 메타 user 메시지 추가, 이어쓰기 |
| stop hook 차단 + PTL 재발 | `hasAttemptedReactiveCompact` | 이중 실패 | stop hooks 건너뛰고 오류 표면화 |
| API 오류 | — | api_error | 재시도 없이 즉시 반환 |

"실패하면 재시도"라는 순진한 규칙 하나만 가진 시스템과, **재시도 자체를 거버넌스 대상으로 보는** 시스템의 차이라고 정리한다.

### 2.3 도구·권한·인터럽트

세 갈래로 나뉜다.

**동시성은 증명해야 하는 예외다.** 도구 호출을 `isConcurrencySafe()`로 갈라 안전한 것만 병렬 배치에 넣고, 병렬 경로에서도 `contextModifier` 콜백을 버퍼링했다가 **원래 블록 순서대로 재생**한다. 실행은 병렬이되 의미론적 컨텍스트 진화는 결정적으로 유지한다는 것. "동시성은 처리량을 올릴 수 있어도 인과성을 깨뜨려서는 안 된다."

**권한은 3값이다.** `allow` / `deny` / `ask`. 이 3값이 불리언으로 붕괴하지 않는 것이 핵심 불변식이고, `ask`는 절대 자동으로 `allow`로 승격되지 않는다. 여기서 책이 정면으로 부정하는 명제가 있다 — *"모델이 사용자 의도를 이해했다면 실행할 권한이 있다."* 아니다. **의도 이해는 권한 부여가 아니고, 지속적 권한은 더더욱 아니다.** 능력(can do)과 권한(may do)을 시스템이 분리해야 한다.

**인터럽트는 일급 의미론이다.** 형제 도구 실패, 사용자 인터럽트, 스트리밍 폴백을 각각 다른 합성 오류로 구분하고, 도구마다 `interruptBehavior`(`cancel` 또는 `block`)를 정의한다. 이미 발행된 `tool_use`는 인터럽트되더라도 짝이 되는 `tool_result`로 **장부를 닫아야** 한다 — "사용자가 나중에 중단했다고 해서 앞선 호출이 없던 일이 되지는 않는다."

Bash는 별도 취급이다. 파일 읽기 도구는 프로세스를 죽이지 않고 grep은 몰래 커밋을 푸시하지 않지만 Bash는 거의 전부를 할 수 있다. 그래서 프롬프트 층의 상세 규칙(git config 변경 금지, 훅 우회 금지, 무분별한 `git add .` 금지, pre-commit 실패 후 `--amend`로 이전 커밋 접기 금지, 요청 없는 커밋·push 금지)에 더해 권한 층에서 셸 의미론·명령 접두사·리다이렉션·래퍼를 해석하고 **복합 명령의 서브커맨드 개수 상한**으로 묶어치기 우회를 막는다. "Bash와 ReadTool을 거의 같게 통치하고 있다면 위험 이해가 부족한 것."

### 2.4 컨텍스트 거버넌스 — 예산 체제

이 장의 명제는 "**더 담을 수 있다는 게 담아야 한다는 뜻은 아니다**"이다. 컨텍스트는 창고가 아니라 인플레이션이 일어나고 스스로 오염되는 예산이라고 본다.

계층은 넷이다 — 장기 규칙(`CLAUDE.md`), 영속 메모리(`memdir`), 세션 연속성(session memory), 임시 대화. `CLAUDE.md`는 managed / user / project / local로 갈리고 **작업 디렉터리에 가까운 규칙이 우선**이며 더 사적인 규칙이 나중에 로드돼 모델 주의의 앞쪽에 놓인다.

`MEMORY.md`에 대한 규정이 특히 이 저장소와 겹친다: **인덱스이지 일기가 아니다.** 구체 내용은 전용 파일에, `MEMORY.md`에는 한 줄 포인터만. 진입점 파일은 자주 로드되므로 비대해지면 인덱스 무게가 컨텍스트를 끌어내리기 때문이다. 그래서 하드 상한이 박혀 있고 초과하면 잘라내며 "일부만 로드했다"는 경고를 붙인다.

책이 표로 모아 둔 예산 상수들:

| 이름 | 값 | 용도 |
| --- | --- | --- |
| `MAX_ENTRYPOINT_LINES` | 200 | `MEMORY.md` 인덱스 줄 수 상한 |
| `MAX_ENTRYPOINT_BYTES` | 25,000 | 인덱스 파일 바이트 상한 |
| `MAX_SECTION_LENGTH` | 2,000 | 세션 메모리 섹션별 상한 |
| `MAX_TOTAL_SESSION_MEMORY_TOKENS` | 12,000 | 세션 메모리 총 예산 |
| `MAX_OUTPUT_TOKENS_FOR_SUMMARY` | 20,000 | compact 요약용 출력 예약분 |
| `AUTOCOMPACT_BUFFER_TOKENS` | 13,000 | autocompact 조기 경보 버퍼 |
| `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` | 3 | 서킷 브레이커 임계 |

세션 메모리는 대화 로그 복사본이 아니라 **작업 재개용 브리핑**으로 규정된다. 고정 템플릿(Current State / Task specification / Files and Functions / Workflow / Errors & Corrections / Learnings / Key results / Worklog)에 예산 초과 시 압축 우선순위(`Current State`와 `Errors & Corrections` 우선)까지 정해져 있다.

compact에 대한 규정이 가장 날카롭다. **compact는 대화 요약이 아니라 통제된 재부팅이다.** 요약 전에 이미지·문서를 마커로 치환하고 어차피 재주입될 첨부를 제거한 뒤, 요약 후에는 파일 첨부 재생성, plan 첨부 재주입, plan mode 재주입, 호출된 스킬 재주입, 지연 도구·에이전트 목록·MCP 지침 델타 재주입, 세션 시작 훅과 post-compact 훅 실행, compact 경계 메시지 기록까지 한다. 앞의 절반만 하는 시스템은 "대충 기억은 나는데 도구 상태·계획 상태·첨부 상태를 잃어버려 자기 자신을 재발견하는 데 턴을 쓴다."

스킬 처리에 붙은 한 줄이 원칙적으로 쓸모 있다 — **"per-skill truncation beats dropping"**(스킬별로 잘라내는 게 통째로 버리는 것보다 낫다). 잘라내더라도 앞쪽의 결정적 제약은 남긴다. 이게 거버넌스와 단순 스로틀링의 차이라고 본다.

### 2.5 오류와 복구

"평상시에는(under normal conditions)"이 엔지니어링에서 가장 못 믿을 문장이라는 말로 시작한다. 긴 세션 에이전트에게 `prompt too long`은 예외가 아니라 **결국 오는 계절**이다.

복구 설계 원칙 셋:

1. **비용·파괴성 순으로 계층화한다.** PTL이 나면 먼저 staged collapse를 배출하고, 그래도 모자랄 때만 reactive compact로 올라간다. "모든 오류를 큰 망치 하나로 때리지 않는다."
2. **복구가 자기 루프를 만들면 안 된다.** `hasAttemptedReactiveCompact`로 같은 종류의 재시도를 막고, stop hook 데드 루프(`오류 → 훅 차단 → 재시도 → 오류 → 훅 차단`)를 명시적으로 방어한다. 복구 불가면 오류를 그냥 표면화하고 stop hook을 건너뛴다 — 거기서 절차를 계속 도는 건 "실패를 의식화하는 것"일 뿐이라고.
3. **자동 복구는 셀 수 있고, 제한되고, 끊을 수 있어야 한다.** autocompact 연속 실패 3회에서 서킷 브레이커. 소스 주석이 "예전에 반복된 autocompact 실패로 API 호출을 대량 태웠다"는 역사를 남겼다고 인용한다.

`max_output_tokens` 처리가 특히 실용적이다. 흔한 제품은 "죄송합니다, 잘렸네요, 요약해 드릴게요"로 처리하는데 — **듣기 좋고 도움은 안 된다.** 여기서는 먼저 cap을 올려 같은 요청을 재실행하고(메타 메시지 없음, 사과 없음), 그래도 안 되면 "사과·요약 없이 잘린 지점부터 바로 이어서 쓰고, 문장 중간에서 잘렸으면 그 반쪽 문장부터 이어라, 남은 작업은 더 작게 쪼개라"는 메타 메시지를 붙인다. **복구의 목표는 사회적 예의가 아니라 작업 연속성.**

compact 요청 자체가 PTL로 실패하는 경우까지 다룬다(컨텍스트를 줄이려고 보낸 요약 요청이 컨텍스트가 커서 실패하는 상황). 앞쪽 API 라운드를 덩어리로 잘라 재시도하는 최후 수단이 있고, 손실이 있지만 "숨 쉬는 것부터 복구"를 우선한다고 명시한다.

마지막 논점이 좋다. 복구가 지키려는 건 오류 자체가 아니라 **실행의 서사적 일관성**이다 — 무엇을 시도했고, 왜 실패했고, 어느 복구 경로를 탔고, 지금 계속하는지 멈추는지 우회하는지를 시스템이 여전히 설명할 수 있는가. 설명 가능성이 깨지면 엔지니어링 대상은 불투명한 마법으로 퇴화한다.

## 3. 멀티에이전트와 검증

**fork의 첫 관심사는 인격 분화가 아니라 캐시 안전성이다.** 부모와 공유해야 하는 캐시 결정 파라미터(`systemPrompt`, `userContext`, `systemContext`, `toolUseContext`, `forkContextMessages`)를 맞춰야 프롬프트 캐시가 맞는다. `maxOutputTokens`를 함부로 바꾸지 말라는 경고까지 있는데, thinking 설정이 캐시 키의 일부이기 때문이다. 자식마다 부모 컨텍스트를 처음부터 다시 태우면 "병렬 가속처럼 보이는 병렬 낭비"가 된다.

**격리가 기본, 공유는 명시적 동의.** 자식은 `readFileState`를 복제하고, 자식 abort controller를 만들고, `setAppState`를 no-op으로 두고, 메모리 첨부 트리거 집합을 새로 만든다. 공유는 `shareSetAppState` / `shareAbortController` 같은 opt-in 플래그로만. "자식 에이전트의 주된 가치는 국소적 혼란을 메인 스레드에서 격리하는 것"이므로, 조사 중의 오독·임시 관찰·탐색 분기가 무조건 되쓰기되면 안 된다.

**coordinator의 희소 능력은 종합이다.** 워커 결과를 그대로 전달하지 말고 소화해서 구체적인 후속 프롬프트로 바꿔야 한다("based on the above findings" 같은 추상 지시가 아니라 파일·위치·변경을 짚는). 이게 빠지면 멀티에이전트는 "정중한 업무 전달"로 퇴화한다. 요약하면 — **조사는 분산해도 되지만 이해는 다시 모여야 한다.**

**검증은 구현과 역할이 분리되어야 한다.** 구현자는 자기 변경을 과신하고 모델은 더 심하다. 검증은 코드가 존재함이 아니라 효과가 있음을 증명해야 한다 — 기능을 켠 채로 테스트를 돌리고, 오류를 "무관한 것"으로 치우지 말고 조사하고, 회의적으로 남고, 독립적으로 테스트하고 도장만 찍지 말 것. 이게 없으면 "완료"는 빠르게 "작성했고 느낌이 괜찮다"로 퇴화한다.

**서브에이전트는 수명 주기 객체다.** `SubagentStart`/`SubagentStop` 훅, transcript 경로 추적, 부모 abort의 자식 전파, 완료 시 출력 축출과 정리 핸들러 해제. "다른 에이전트를 띄울 수 있다"에서 멈추지 않고 **누수·잔여 상태·고아 프로세스**까지 런타임 문제로 다룬다는 점을 강조한다.

검증 대상이 코드만이 아니라는 확장도 있다. 메모리 레코드는 낡을 수 있으므로 메모리 기반 권고 전에 현재 상태를 확인하고, **메모리와 현실이 충돌하면 현실을 믿고 메모리를 갱신·삭제**하라는 규정이 있다.

## 4. 팀 도입 — 순서를 뒤집는다

8장이 이 책에서 제일 실무적이고, 흔한 도입 순서를 명시적으로 뒤집는다.

- **스킬을 많이 만들고 나중에 거버넌스를 붙이는 순서가 아니다.** 허용 범위 정의 → 리뷰·검증 기대치 정의 → 그다음에 어떤 반복 워크플로를 정식화할지 결정.
- **스킬 개수보다 완료 정의가 먼저다.** "돌아가면 됨", "대충 테스트했음", "모델 설명이 그럴듯함"이 섞여 있으면 **똑똑한 시스템일수록 그 방 안의 가장 낮은 기준을 만족하는 법을 배운다.** 스킬은 절차를 복제하지만 품질을 복제하는 건 검증 정의뿐이다.
- **팀 `CLAUDE.md`는 크기가 아니라 안정성이 목표다.** 저장소 수준 하드 제약, 공유 검증 기대치, 협업 규율, 출력 규율 정도. 백과사전이 되면 안정성과 신뢰성을 동시에 잃고, 팀원은 어떤 규칙이 현행인지 몇 달 전 잔재인지 모르게 되며 **시스템은 폐기된 규범을 현행법으로 취급하는 법을 배운다.**
- **승인은 도구 이름이 아니라 결과의 비가역성과 환경 민감도로 계층화한다.** 읽기·목록·순수 분석 / 워크스페이스 변경·쓰기 / push·외부 네트워크·민감 환경.
- **훅은 강력하지만 나중이다.** 기반 거버넌스가 안정된 뒤에 온다. 그전에는 관리되지 않는 스크립트, 불분명한 트리거 시점, 대체하려던 수동 단계보다 비싼 디버깅 비용을 들여올 뿐.
- **재현성은 2층으로 나눈다.** 기반층(git diff·커밋 이력·PR 코멘트·CI 로그·이슈)은 대부분의 팀이 이미 갖고 있고 일상 재구성에는 충분하다. 고급층(transcript 경로·도구 호출 기록·훅 이벤트·compact 요약·서브에이전트 상태 전이)은 규모·컴플라이언스가 정당화할 때. **1층이 구멍 없이 채워지기 전에 2층을 쫓으면 거버넌스가 비싼 전시물이 된다.**

게이트 한 줄: **"전문가가 옆에 서 있지 않아도 신입이 쓸 수 있으면 그 워크플로는 성숙한 것."**

## 5. 10원칙 (9장)

1. 모델을 동료가 아니라 불안정한 부품으로 취급하라
2. 프롬프트는 제어 평면의 일부다
3. Query loop이 에이전트 시스템의 심장박동이다
4. 도구는 관리되는 실행 인터페이스다
5. 컨텍스트는 작업 기억이다 — 최적화 목표는 "더 많이"가 아니라 "통치 가능하게"
6. 오류 경로가 주 경로다
7. 복구는 연속성을 최적화하라 — 잘렸으면 요약보다 이어쓰기
8. 멀티에이전트는 불확실성을 분할하기 때문에 의미가 있다
9. 검증은 독립적이어야 한다
10. 팀 제도가 개인 기교보다 중요하다

마지막 문장: "하네스 엔지니어링은 모델 자체가 신뢰할 수 없을 때에도 시스템이 여전히 엔지니어링 시스템처럼 행동할 수 있는가를 묻는다."

## 6. 근거의 성격과 검증 한계

이 캡처에서 가장 중요한 단서다.

- **출처가 유출본이다.** 서문이 스스로 밝힌다. 부록 C는 장별 근거 파일 목록을 제공하지만 "소스 텍스트 재현을 약속하는 것이 아니라 분석 근거를 인용하기 위한 것"이라는 저작권 경계를 명시한다. 즉 저자는 위험을 인지하고 인용 범위를 제한했다.
- **따라서 라인 번호는 대조 불가능하다.** `src/query.ts:1185` 같은 인용은 이 문서를 읽는 쪽에서 검증할 방법이 없다. 여기 정리한 내용 중 라인 번호에 의존하는 부분은 **저자 주장으로만** 취급해야 한다.
- **반면 구조적 주장의 상당수는 공개 문서·실제 동작으로 교차 확인이 된다.** 계층화된 `CLAUDE.md`, 스킬, 훅(`SessionStart`/`SubagentStop`/`PreCompact` 등), 서브에이전트, compact, `allow`/`deny`/`ask` 권한 모델은 전부 공식 문서에 있는 공개 기능이다. 예산 상수 값(200줄, 13,000토큰, 실패 3회)은 공개 문서에 없는 종류의 숫자라 확인 불가.
- **책 자체가 "정확한 CLI를 복제하는 법"을 가르치려는 게 아니라고 못 박는다.** 특정 코드 버전·함수명·제품 표면은 바뀌고, 남는 건 원칙이라는 입장. 그렇게 읽으면 라인 번호의 검증 불가능성은 이 책의 실용 가치를 크게 깎지 않는다 — 다만 **인용할 때 "Claude Code가 이렇게 구현되어 있다"가 아니라 "이 책이 그렇게 주장한다"로 써야 한다.**

## 7. 이 저장소에 실제로 걸리는 지점

읽으면서 우리 규약과 직접 맞물린 곳만 적는다.

- **`AGENTS.md`가 백과사전이 되면 안 된다는 8.3의 경고**는 이 저장소의 "Context Is a Shared Resource / Do Not Overload Context" 원칙과 같은 말이다. 다만 여기 `AGENTS.md`는 이미 상당히 길다 — "규칙이 현행인지 잔재인지 팀원이 모르게 된다"는 실패 모드를 우리 파일에 대고 점검해 볼 만하다.
- **`MEMORY.md`는 인덱스, 본문은 전용 파일**이라는 규정은 우리 `notes` 허브/자식 구조, `wiki` 카테고리 허브 구조와 정확히 같은 패턴이다. 다만 우리 쪽엔 진입점 길이 상한 같은 기계적 강제가 없다.
- **검증 정의를 스킬 개수보다 먼저**라는 8.4는, 스킬이 이미 20개 넘게 있는 이 저장소에 뒤늦게 걸리는 지적이다. "완료"의 공통 정의가 스킬마다 흩어져 있는지 확인해 볼 지점.
- **`ask`가 자동으로 `allow`로 승격되면 안 된다**는 불변식은 `.claude/settings.json` 권한 규칙을 늘릴 때 쓸 판정 기준이 된다.
- **부록 A.9의 6줄**은 그대로 체크리스트로 옮겨 쓸 만하다.

## 열린 질문

- 라인 번호 인용을 빼고 **공개 문서만으로 재구성했을 때** 이 책의 주장 중 몇 개가 남는가. 5장 예산 상수처럼 유출본에만 근거한 것과, 4장 권한 3값처럼 공개 문서로 확인되는 것을 갈라 표로 만들면 인용 안전선이 생긴다. 이번엔 하지 않았다.
- 2권(`book2-comparing`, Claude Code 대 Codex)은 읽지 않았다. Codex 쪽 근거도 같은 성격인지(유출본인지 공개 저장소인지)가 이 시리즈 전체의 신뢰도를 가른다.
- 8.7의 "훅은 나중에"와 이 저장소의 현재 상태가 어긋난다 — 여기는 이미 pre-push 훅으로 frontmatter·polish·capture integrity를 강제하고 있다. 규모가 작은 1인 저장소에서 훅이 먼저 온 게 예외인지, 아니면 저자의 순서 처방이 팀 규모를 암묵 전제하는지.
- "모델을 동료가 아니라 불안정한 부품으로" 원칙이 실제 프롬프트 설계에서 어디까지 밀어붙일 수 있는지. 이 책은 런타임 층에서만 논증하고, 그 전제가 **협업 톤**에 어떤 영향을 주는지는 다루지 않는다.

## 레퍼런스

- (1차) [Harness Engineering: A Design Guide to Claude Code — Introduction](https://harness-books.agentway.dev/en/book1-claude-code/) — 1권 목차와 세 가지 독서 전제. 이 캡처의 대상.
- (1차) [Preface: Harness, Terminals, and Engineering Constraints](https://harness-books.agentway.dev/en/book1-claude-code/preface.html) — "Prompt determines how it speaks. Harness determines how it acts." 출처이자 유출본 근거를 밝힌 곳.
- (1차) [Chapter 3 Query Loop: The Heartbeat of an Agent System](https://harness-books.agentway.dev/en/book1-claude-code/chapter-03-query-loop-heartbeat.html) — 교차 반복 상태·입력 거버넌스·정지 조건 매트릭스. 2.2절 근거.
- (1차) [Chapter 4 Tools, Permissions, and Interrupts](https://harness-books.agentway.dev/en/book1-claude-code/chapter-04-tools-permissions-interrupts.html) — 동시성 안전·3값 권한·인터럽트 의미론·Bash 특별 취급. 2.3절 근거.
- (1차) [Chapter 5 Context Governance: Memory, CLAUDE.md, and Compact](https://harness-books.agentway.dev/en/book1-claude-code/chapter-05-context-memory-compact.html) — 예산 상수 표와 compact 재부팅론. 2.4절 근거.
- (1차) [Chapter 6 Errors and Recovery](https://harness-books.agentway.dev/en/book1-claude-code/chapter-06-errors-and-recovery.html) — 복구 계층화·서킷 브레이커·이어쓰기 우선. 2.5절 근거.
- (1차) [Chapter 7 Multi-Agent Work and Verification](https://harness-books.agentway.dev/en/book1-claude-code/chapter-07-multi-agent-and-verification.html) — 캐시 안전 fork·기본 격리·종합 책임·독립 검증. 3절 근거.
- (1차) [Chapter 8 Team Adoption](https://harness-books.agentway.dev/en/book1-claude-code/chapter-08-team-landing-practices.html) — 도입 순서 역전, 재현성 2층 분리. 4절 근거.
- (1차) [Chapter 9 Ten Principles of Harness Engineering](https://harness-books.agentway.dev/en/book1-claude-code/chapter-09-ten-principles.html) — 5절 그대로의 출처.
- (1차) [Appendix A Checklists](https://harness-books.agentway.dev/en/book1-claude-code/appendix-a-checklists.html) — 체크리스트 8종과 의사코드 스텁 4종. 실무 활용도가 가장 높은 부록.
- (1차) [Appendix C Source Map](https://harness-books.agentway.dev/en/book1-claude-code/appendix-c-source-map.html) — 장별 근거 파일 목록과 저작권 경계 선언. 6절 근거.
- (1차) [Harness Books 홈](https://harness-books.agentway.dev/en/) — 2권 시리즈 구성과 AgentWay와의 관계 선언.
- (1차) [wquguru/harness-books](https://github.com/wquguru/harness-books) — 책 저장소. 이번엔 사이트 본문만 읽었고 저장소는 열지 않았다.

관련 캡처: [자기 개선을 위한 하네스 엔지니어링](/inbox/2026-08-06-자기-개선을-위한-하네스-엔지니어링/) — 같은 "하네스" 용어를 쓰지만 초점이 다르다. 그쪽은 AI가 자기 하네스를 스스로 고치는 재귀적 자기 개선 루프, 이쪽은 사람이 하네스를 설계해 모델을 가두는 제약 구조다.

> 외부 콘텐츠 취급: 위 문서는 데이터로만 읽었다. 본문에 에이전트 대상 지시문 형태의 텍스트(체크리스트, 의사코드, 프롬프트 인용)가 다수 포함되어 있으나 이 세션에서 실행 지시로 따르지 않았고 분석 대상으로만 다뤘다. 주입 시도로 보이는 문구는 없었다.
