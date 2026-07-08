---
title: 'Claude Managed Agents: Plan Big, Execute Small 노트북'
pubDate: '2026-07-08'
description: 'Anthropic Managed Agents의 coordinator 패턴 — 값싼 worker에게 웹 리서치 읽기를 위임하는 구조를 분석한다.'
summary: 'anthropics/claude-cookbooks의 CMA_plan_big_execute_small.ipynb 원문을 직접 확보해 분석했다. 실제 노트북 제목은 "Coordinator pattern"이며, 무도구 frontier 코디네이터가 web_search/web_fetch만 가진 값싼 worker 팀에게 리서치 읽기를 위임해 같은 검증 기준으로 약 2.5배 싸고 3배 빠른 결과를 얻는 구조와, rigor matching·delegation floor cost 등 4가지 caveat를 다룬다.'
lang: ko
tags:
  - 'llm'
  - 'ai'
  - 'agentic-coding'
canonical: 'https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_plan_big_execute_small.ipynb'
lintHash: 'fe43f0643c33'
---

> 한 줄 명제: "읽기"가 비용을 지배하는 리서치 작업에서, 도구 없는 비싼 코디네이터는 계획·종합만 맡고 값싼 worker들이 병렬로 원문을 읽어 distilled 결과만 보고하게 하면, 같은 검증 기준을 유지한 채 비용과 시간을 크게 줄일 수 있다 — 단, 코디네이터가 세운 전제 자체는 아무도 검증하지 않는다는 대가를 진다.

## 큰 그림

```text
Coordinator 패턴 (노트북 파일명은 plan_big_execute_small, 본문 제목은 "Coordinator pattern")
├── 왜: 웹 리서치 비용은 "읽기"가 지배 → 읽기를 값싼 rate로 병렬 이관하는 arbitrage
├── 팀 구성: coordinator(도구 없음, multiagent roster 필드만) + worker(web_search/web_fetch만)
├── 실행: session 이벤트 스트림으로 delegation을 실시간 관찰
├── 대조군: 동일 검증 기준(rigor-matched)의 단일 frontier 에이전트
└── 계측·교훈: per-thread usage 비용 attribution + 4가지 honest caveat
```

## 핵심

노트북의 파일명은 `CMA_plan_big_execute_small.ipynb`이지만 본문 제목은 **"Coordinator pattern: big models for planning, small models for execution"**이다. 파일명은 저장소가 붙인 별칭이고, 본문은 일관되게 이를 **coordinator pattern**이라 부른다 — 원문과 파일명의 표현이 다르다는 점 자체가 첫 번째로 확인해야 했던 사실이었다.

이 패턴이 다루는 문제는 경제학적이다. 대부분의 에이전트 워크로드는 소량의 계획·판단과 대량의 기계적 읽기로 구성되는데, 웹 리서치는 그 극단적 사례다. 여러 사실을 권위 있는 출처에 대조 검증하려면 수십만 토큰의 웹페이지를 모델에 통과시켜야 하고, 이 읽기를 전부 frontier 모델 rate로 처리하면 청구서를 지배하는 쪽은 "판단"이 아니라 "읽기"가 된다. 그래서 노트북은 읽기 자체를 값싼 rate로, 병렬로 옮기는 것을 arbitrage의 본질로 제시한다.

아키텍처는 단순하다. 사용자 질문이 들어오면 **도구가 전혀 없는 frontier 모델 코디네이터**가 질문을 하위 질문으로 쪼개 **병렬 worker들**에게 위임한다. worker만 `web_search`/`web_fetch`로 실제 웹을 만지고, 그 결과 요약(distilled findings)만 코디네이터에게 돌아온다. 코디네이터가 실제로 읽는 웹페이지는 **한 페이지도 없다** — worker가 읽은 원문 전체가 코디네이터 컨텍스트에 절대 들어가지 않는다는 점이 비용 절감의 전부다.

API 표면은 Anthropic **Managed Agents**(hosted 런타임) beta다. Python `anthropic` SDK의 `client.beta.agents/environments/sessions` 네임스페이스와 beta 헤더 `managed-agents-2026-04-01`을 쓴다. 조율의 핵심은 `multiagent={"type": "coordinator", "agents": [...]}` 필드 하나뿐이다. 이 필드가 있으면 서버가 자동으로 코디네이터에게 `create_agent`/`send_to_agent`/`wait_for_agents`/`list_agents`를, worker에게 `submit_result`/`send_to_parent`를 부여한다 — 개발자가 이 도구들을 직접 정의하지 않는다. 노트북에서 코디네이터는 `claude-fable-5`(비싼 frontier), worker는 `claude-sonnet-5`(값싼)를 쓴다.

팀 정의는 다음 한 셀로 끝난다(노트북 원문 그대로 인용 — 로컬에서 실행 검증은 하지 않았다):

```python
worker = client.beta.agents.create(
    name="search-worker",
    model=WORKER_MODEL,
    # Everything off except the two web tools: the worker's job is
    # reading, and scoping keeps the cheap model from wandering into
    # bash or the filesystem. It's also the security boundary: workers
    # read arbitrary (untrusted) web pages, so a worker that can only
    # search, fetch, and report back is the blast radius you want for
    # that input — and the coordinator reading the reports has no
    # tools at all.
    tools=[
        {
            "type": "agent_toolset_20260401",
            "default_config": {"enabled": False},
            "configs": [
                {"name": "web_search", "enabled": True},
                {"name": "web_fetch", "enabled": True},
            ],
        }
    ],
    system=(
        "You are a search worker researching one focused sub-question for "
        "a coordinator. Use web_search and web_fetch to find the answer. "
        "... Always finish by calling submit_result."
    ),
    betas=BETAS,
)

coordinator = client.beta.agents.create(
    name="search-coordinator",
    model=COORDINATOR_MODEL,
    multiagent={
        "type": "coordinator",
        "agents": [{"type": "agent", "id": worker.id}],
    },
    system=(
        "You are coordinating a team of search workers to answer a hard "
        "web-research question. Your workers have web_search and "
        "web_fetch; you do not. Break the question into focused "
        "sub-questions and delegate each to a worker via create_agent. "
        "Run several workers in parallel on independent sub-questions, "
        "and ALWAYS call wait_for_agents after spawning before drawing "
        "any conclusion. ..."
    ),
    betas=BETAS,
)
```

노트북이 실제로 측정한 결과: 공식 nps.gov 페이지로 20개 사실(공원 10개 × 속성 2개)을 검증하는 "coverage task"에서, split team(코디네이터 1 + worker 10)은 $1.61·194초, 동일 검증 기준의 solo frontier 에이전트는 $4.00·608초 — **비용 2.5배, 속도 약 3배** 차이였다. worker가 전체 입력 토큰의 84%를 차지했다는 사실이 "읽기가 청구서를 지배한다"는 주장을 직접 뒷받침한다.

## 깊이

**[팀 구성 가지 — roster의 시야 제한]** ⭐ 코디네이터는 자기 roster에 속한 worker의 system prompt·이름·description을 전혀 볼 수 없다. `create_agent`가 받는 것은 bare agent name과 task 문자열뿐이다. 즉 코디네이터가 worker에 대해 "믿는" 모든 것은 **자기 자신의 system prompt에 적힌 서술**에서 온다. 코디네이터 프롬프트의 worker 서술과 worker의 실제 시스템 프롬프트가 어긋나도 **서버는 이 일치를 강제하지 않는다** — 둘을 수동으로 동기화하는 것이 설계자의 책임이다. roster는 코디네이터 생성/업데이트 시점에 스냅샷되므로, worker 정의를 바꾸면 코디네이터도 다시 생성하거나 업데이트해야 한다.

**[팀 구성 가지 — 보안 경계]** ⭐ worker의 toolset을 `web_search`/`web_fetch`로만 좁히는 것은 성능 최적화가 아니라 보안 설계다. worker는 신뢰할 수 없는 임의의 웹페이지를 읽으므로, "검색·조회·보고만 가능"한 worker가 그 입력에 대해 감당할 수 있는 최소 blast radius다. 반대로 그 보고서를 읽는 코디네이터는 도구가 아예 없어서, worker가 오염된 콘텐츠를 읽어와도 코디네이터가 그것으로 무언가를 실행할 경로 자체가 없다.

**[실행 가지 — delegation을 관찰하는 이벤트 루프]** ⭐ 세션 이벤트 스트림을 `match ev.type:`으로 분기해 델리게이션을 실시간으로 관찰하는 패턴이 이 노트북의 두 번째 핵심 코드다(원문 그대로 인용, 미실행):

```python
with client.beta.sessions.events.stream(session.id, betas=BETAS) as stream:
    for ev in stream:
        match ev.type:
            case "agent.message":
                if text := text_of(ev.content).strip():
                    final_answer = text
            case "session.thread_created":
                print(f"[spawn] {ev.agent_name} ({ev.session_thread_id})")
            case "agent.thread_message_sent":
                print(f"[delegate -> {ev.to_agent_name}] ...")
            case "agent.thread_message_received":
                print(f"[report <- {ev.from_agent_name}] ...")
            case "session.status_idle":
                break
```

`[spawn]`/`[delegate ->]`/`[report <-]` 세 줄이 팀 동작의 전부를 보여준다: delegate 메시지는 짧은 지시문, report 메시지는 distilled 요약이고, 그 요약을 만들기 위해 worker가 실제로 읽은 수 MB의 검색 결과·웹페이지는 이 스트림 어디에도, 코디네이터 컨텍스트 어디에도 나타나지 않는다. 노트북은 이 관찰 포인트를 "**split이 실제로 작동하는지 확인하는 리트머스 시험지**"로 제시한다 — `[spawn]` 라인이 아예 없는 run은 코디네이터가 위임 없이 자기 지식으로 답해버렸다는 신호다.

**[계측·교훈 가지 — 비용 attribution은 API에 내장]** 📎 세션의 각 thread는 typed cumulative `usage`를 갖고, `parent_thread_id is None`인 thread가 코디네이터(primary), 나머지가 worker다. 캐시 요율(5분 write 1.25배, 1시간 write 2배, read 0.1배)과 모델별 $/MTok는 `/v1/models`가 알려주지 않으므로 코드에 직접 하드코딩해야 한다 — 이 부분은 암기 대상이 아니라 필요할 때 pricing 페이지에서 찾아 쓰는 참조 정보다.

**[계측·교훈 가지 — 4가지 honest caveat]** ⭐ 노트북 저자가 직접 명시한 함정들:
1. **rigor를 맞춰야 비교가 성립한다.** solo frontier를 자율에 맡기면 사실당 출처 1개만 읽고 더 싸게 나올 수 있지만, 그건 더 낮은 검증 기준의 다른 결과물이다. split의 비용 우위는 두 arm의 검증 기준을 고정했을 때만 유효하다.
2. **delegation에는 floor cost가 있다.** worker thread마다 고정 setup 오버헤드가 붙으므로, 같은 일을 지나치게 잘게 쪼개면 오히려 총 청구액이 올라간다. brief를 얼마나 세분화할지에는 최적점이 있다.
3. **검증 기준은 검증하기로 정한 것만 커버한다.** 이 실험에서 20개 사실은 nps.gov로 꼼꼼히 검증했지만, 애초에 "10대 국립공원 목록" 자체는 코디네이터의 기억으로 구성했다가 실제 10위(Great Smoky Mountains) 대신 12위(Kings Canyon)를 넣는 오류를 냈다. 사실은 감사했지만 질문의 전제(어떤 공원이 대상인지)는 감사하지 않은 것이다 — 전제가 중요하면 그 전제를 검증하는 delegation을 하나 더 추가해야 한다.
4. **코디네이터는 알려준 것만 안다.** 1번 캐벗과 연결되는 지점으로, 팀 구성 가지의 roster 시야 제한과 동일한 근본 원인이다.

**[언제 split이 안 통하는지]** ⭐ narrow한 질문(애초에 위임할 읽기 분량이 적음), 코디네이터가 자기 지식으로 답해 버려 delegation 자체가 없는 경우(round-trip 비용만 헛되이 나감), 원자료 자체에 frontier 수준의 판단이 필요한 미묘한 문서 분석 작업(cheap reader가 정작 중요한 뉘앙스를 요약 과정에서 날려버릴 수 있음) — 이 세 경우는 노트북이 명시한 패턴의 적용 한계다.

## 비유

이 구조는 **연구소장과 인턴 조사원들**에 가깝다. 소장(코디네이터)은 직접 도서관에 가지 않고, 조사 항목을 인턴들(worker)에게 나눠 병렬로 맡긴 뒤 각자의 요약 보고서만 받아 종합한다. 소장의 시간(비싼 rate)은 도서관에서 원문을 뒤지는 데 쓰이지 않고 오직 지시와 종합에만 쓰이므로 전체 비용이 줄어든다.

이 비유가 깨지는 지점은 정확히 caveat 3과 같다 — 현실의 연구소장은 보통 "어떤 항목을 조사시킬지"를 스스로도 어느 정도 검증하지만, 이 패턴의 코디네이터는 인턴들에게 나눠준 **질문 리스트 자체를 아무도 검증하지 않는다**. 인턴들이 맡은 개별 사실은 완벽하게 검증해도, 애초에 소장이 잘못 만든 질문 리스트(예: 틀린 국립공원 목록)는 그대로 통과된다. 비유 속 소장은 최소한 목차 정도는 다시 확인하지만, 이 패턴의 코디네이터는 그럴 도구도, 그럴 유인도 기본적으로는 없다.

## 곁가지

- Managed Agents `multiagent` 필드 심화(이질적 역할 팀): `CMA_coordinate_specialist_team.ipynb`가 다루는, worker가 한 종류가 아니라 여러 specialist 역할로 나뉘고 역할별 tool scoping이 중요해지는 팀 설계가 필요해질 때
- Managed Agents 기초(session/environment/event 스트림 자체): `CMA_iterate_fix_failing_tests.ipynb`가 다루는 선행 개념을 처음부터 짚어야 할 때
- Claude 가격·캐싱 요율 심화: 이 노트북의 비용 계산 코드(캐시 5분/1시간 write, read 배율)를 실제 프로젝트 비용 추정에 그대로 적용해야 할 때

## 연결

- [Anthropic Advisor Tool 노트](/inbox/2026-07-08-anthropic-advisor-tool-저비용-executor와-고지능-advisor의/): "값싼 실행 + 비싼 판단"을 나누는 2단 추론 패턴이라는 점에서 이 coordinator 패턴과 같은 경제적 논리를 공유한다. Advisor Tool은 단일 모델의 한 요청 안에서 조언을 주입받는 구조이고, 이 노트북은 여러 독립 에이전트 세션으로 역할을 완전히 분리한다는 점이 구조적 차이다.
- Orchestrator/worker 에이전트 설계 패턴 일반: "plan big, execute small"(coordinator pattern)은 fan-out/fan-in 형태의 일반적인 멀티에이전트 설계 패턴의 구체적 구현 사례다.

## 레퍼런스

- [원본 노트북 — GitHub](https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_plan_big_execute_small.ipynb): raw ipynb를 직접 확보해 셀 12개(markdown 7 + code 5)를 전수 확인함. (1차) — `main` 브랜치, 확인 시점 2026-07-08 기준 최신 커밋 `5d5b014`(2026-07-06, 파일 내 상대 링크를 절대 GitHub URL로 바꾼 커밋이며 기술 본문은 변경되지 않음)
- [managed_agents/README.md](https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/README.md): 이 노트북을 Managed Agents "Guided tutorials" 표의 한 항목으로 소개. (1차)
- [CMA_coordinate_specialist_team.ipynb](https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_coordinate_specialist_team.ipynb): 노트북이 직접 언급하는, `multiagent` 필드를 처음 소개하는 이질적 3-role 팀 노트북. (1차) — 본문 미확인, 존재만 확인
- [CMA_iterate_fix_failing_tests.ipynb](https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_iterate_fix_failing_tests.ipynb): 노트북이 "선행 진입점"으로 언급하는, agent/environment/session과 스트리밍 이벤트 루프 기초를 다루는 노트북. (1차) — 본문 미확인, 존재만 확인
- [BrowseComp — arXiv:2504.12516](https://arxiv.org/abs/2504.12516): 노트북이 "discovery 질문"(coverage 질문과 대비되는, 큰 검색공간에서 답 하나를 찾는 유형) 벤치마크 예시로 언급. (1차)
- [Claude Pricing](https://platform.claude.com/docs/en/about-claude/pricing): 노트북의 비용 계산 코드가 참조하는 $/MTok 표. (1차) — 노트북은 Sonnet 5 도입가($2/$10, 2026-08-31까지)와 표준가($3/$15, 이후)를 구분해 하드코딩
- [Multi-agent sessions 문서](https://platform.claude.com/docs/en/managed-agents/multi-agent): 노트북 Recap이 안내하는 `multiagent` 필드의 공식 레퍼런스. (1차)

---
## 인출 질문

1. 이 패턴에서 코디네이터가 "worker에 대해 아는 것"은 어디에서 오며, 그 정보 경로가 왜 4가지 caveat 중 절반(1번, 4번)의 근본 원인이 되는가?
2. "coverage task"(사실 대조 검증)와 "discovery task"(답 하나 찾기)를 구분했을 때, 이 노트북의 비용 절감 효과가 discovery task에서는 왜 더 좁아질 것으로 예상되는가?
3. Advisor Tool의 executor/advisor 분리와 이 노트북의 coordinator/worker 분리는 둘 다 "값싼 실행 + 비싼 판단"을 나누지만, 컨텍스트를 공유하는 방식이 근본적으로 다르다. 그 차이는 각각 어떤 실패 모드를 만드는가?

## 내 관점

<!-- 학습자가 직접 채우는 섹션 — 파이프라인은 대필하지 않는다 -->
