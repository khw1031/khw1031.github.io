---
title: 디자인 선별 루프를 저장소로 만드는 moodbox — MCP·스킬·CLI 4층 구현
pubDate: '2026-08-08T11:18:10+09:00'
noteId: UX-2608-002
lang: ko
description: 무드보드·soul.md·라운드별 랭킹을 프로젝트 로컬 아티팩트로 영속화하고, MCP·에이전트 스킬·CLI 세 표면으로 노출하는 디자인 선별 루프 도구 구상.
summary: YC 디자인 워크플로우 캡처에서 "생성이 아니라 선별이 병목"이라는 결론을 받아, 그 선별 상태 자체를 저장소(moodbox)로 만들고 MCP(상태 접근)·스킬(절차)·CLI(실행) 3표면으로 얹는 아이디어. 진짜 차별점 후보는 별점·쌍대 비교를 누적해 평가 언어(taste.md)를 자동 성장시키는 것이다.
tags: [design, mcp, agent-skills, cli, evaluation]
lintHash: '9946e3fb7939'
---

## 아이디어

앞서 캡처한 [YC 디자인 워크플로우 재현 기록](/sources/yc-디자인-총괄-ai-디자인-워크플로우-재현과-선별-병목/)의
결론은 생성이 아니라 **선별**이 병목이라는 것이었다. 그런데 그 재현에서 선별 상태 — 어떤 무드를 골랐는지,
`soul.md`에 무슨 철학을 넣었는지, 라운드마다 무엇을 몇 점 주고 왜 그랬는지 — 는 세션 안에서만 살아 있고
라운드가 끝나면 흩어진다. 랭킹 UI조차 매번 새로 만든다. **moodbox**는 그 상태를 프로젝트 로컬 아티팩트로
고정하자는 제안이다. `.moodbox/` 안에 무드 레퍼런스, `soul.md`, 라운드별 시안과 점수·코멘트, 그리고
누적된 평가 기준을 두고, 다음 라운드가 그것을 입력으로 받는다. 취향을 세션이 아니라 저장소에 담는다.

그 위에 세 표면을 얹는다. **CLI**는 실행 계층이다 — `moodbox init`으로 골격을 만들고, `round`로 시안 N개를
생성·격리 실행하고, `rank`로 로컬 랭킹 UI를 띄우고, `diff`로 라운드 간 변화를 본다. **MCP 서버**는 상태
접근 계층이다 — 어떤 에이전트든(Claude Code, Codex, Cursor) `soul.md`와 지난 라운드 점수를 읽고 이번
라운드 평가를 되쓸 수 있게 한다. **에이전트 스킬**은 절차 계층이다 — 회의 녹음에서 `soul.md`를 뽑는 법,
라운드를 어떻게 구성하는지, 언제 멈추는지를 `SKILL.md`에 담는다. 이 3분할은 임의가 아니라 두 표준의 성격
차이를 그대로 따른 것이다: MCP는 외부 능력 연결, 스킬은 절차 지식의 점진적 공개다. 가장 흥미로운 지점은
원본 영상 화자가 자인한 한계 — "왜 이게 좋은지 말로 못 쓰겠다" — 를 겨냥하는 층이다. 별점과 쌍대 비교만
누적해도 그로부터 평가 언어를 역으로 합성해 `taste.md`로 키울 수 있다면, 그게 이 도구가 랭킹 페이지
하나보다 나은 유일한 이유가 된다.

## 더 해볼 질문

- **영속화가 실제로 이득인가.** 원본 영상은 매 라운드 랭킹 UI를 즉석 생성하는 방식으로 6라운드를 돌려
  결과를 냈다. 저장소·스키마·CLI를 도입해서 얻는 것이 그 마찰을 넘는지 먼저 반증해야 한다.
  "일회용으로 충분하다"가 참이면 이 아이디어의 대부분이 무너진다.
- **`taste.md` 자동 성장이 되는가.** 별점 + 쌍대 비교 + 짧은 코멘트에서 다음 라운드에 주입할 만한
  평가 문장을 뽑아낼 수 있는가. 안 되면 이 도구는 "예쁜 파일 구조"에 그친다. 초기엔 LLM이 코멘트를 묶어
  가설 문장을 제안하고 사람이 채택/기각하는 방식이 현실적으로 보인다.
- **4층이 과한가.** CLI만으로 시작하고 MCP·스킬은 나중에 얹는 것과, MCP를 먼저 내서 아무 에이전트에나
  붙게 하는 것 중 무엇이 채택에 유리한가. 스킬은 사실상 마크다운 한 장이라 가장 싸다.
- **시안 격리 수준.** 시안 N개를 한 워크스페이스에서 만들면 서로 오염된다. git worktree 정도로 충분한가,
  컨테이너까지 가야 하는가. 이건 [하네스 A/B 테스트 아이디어](/idea/inbox/agent-harness-model-ab-testing-sandbox/)와
  같은 문제이고, 두 아이디어가 실행 계층을 공유할 수 있는지 확인할 지점이다.
- **무드 레퍼런스의 법적·기술적 취급.** Pinterest·Dribbble 이미지를 로컬에 복제해도 되는가. URL과
  추출한 팔레트·태그만 저장하는 편이 안전한지, 그러면 다음 라운드 주입 품질이 충분한지.
- **도메인 일반화 시점.** 원본 영상은 이 루프가 글쓰기·기획에도 통하는 "유니버설 루틴"이라고 본다.
  moodbox를 디자인 전용으로 좁게 낼지, 처음부터 `ranking loop` 일반 도구로 낼지. 좁게 내는 편이
  이름·UX가 선명하지만, 진짜 가치가 루프 자체라면 조기 협소화가 손해다.
- **경쟁 대체재와의 경계.** Figma MCP는 이미 디자인 컨텍스트를 에이전트에 물려주고 쓰기까지 한다.
  moodbox가 그 앞단(방향 결정·선별)만 담당하고 Figma MCP와 공존하는 그림이 맞는지.

## 레퍼런스·서비스

확인일: 2026-08-08. 빠른 스캔이며 1차 검증은 하지 않았다.

- [YC 디자인 워크플로우 재현 캡처 (본 저장소)](/sources/yc-디자인-총괄-ai-디자인-워크플로우-재현과-선별-병목/)
  — 이 아이디어의 출발점. 절차 원문과 화자가 자인한 "평가 언어화" 병목이 여기 정리돼 있다.
- [Figma MCP server 가이드 (Figma Help Center)](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
  — 1차(벤더 공식). 에이전트가 컴포넌트·변수·레이아웃을 읽고 최근에는 쓰기까지 한다. 디자인 MCP의 기준선이자
  moodbox가 침범하지 말아야 할 영역의 경계.
- [Design Context, Everywhere You Build (Figma Blog)](https://www.figma.com/blog/design-context-everywhere-you-build/)
  — 1차(벤더 발표). 원격 MCP 접근과 Code Connect 확장 발표. "디자인 컨텍스트를 어디서나"라는 포지션 자체가
  moodbox와 겹칠 수 있는 지점.
- [anthropics/skills (GitHub)](https://github.com/anthropics/skills) — 1차(정본 저장소). `SKILL.md` 형식과
  공개 스킬 모음. 절차 계층을 스킬로 낼 때의 형식 근거.
- [mcp-builder SKILL.md (anthropics/skills)](https://github.com/anthropics/skills/blob/main/skills/mcp-builder/SKILL.md)
  — 1차. MCP 서버를 스킬로 만드는 공식 예시. "스킬 + MCP 동시 제공"이 이상하지 않다는 선례.
- [Frontend Code Arena](https://arena.ai/) — 1차. 사람 투표 기반 프론트엔드 A/B 비교. 선호 데이터를 모으는
  현존 사례로, moodbox의 랭킹 데이터가 어디까지 쓸모 있는지 가늠할 대조군.
- [Paper (paper.design)](https://paper.design/) — 1차(벤더). 원본 워크플로우에서 셰이더·디더링 효과를 고르는
  단계에 쓰인 도구. moodbox가 "효과 픽"까지 상태로 잡을지 결정할 때 참고.
- [MoodyBoards](https://moodyboards.ai/) — 2차(제품, 미확인). 텍스트에서 무드보드를 생성하고 그로부터
  온브랜드 이미지를 뽑는 상용 서비스. **생성형 무드보드**라는 반대 방향 접근이라, moodbox의 "사람이 고른
  것을 보존한다"는 전제와 정면으로 다르다. 어느 쪽이 맞는지 확인할 가치가 있다.
- [Venngage AI Moodboard Generator](https://venngage.com/ai-tools/moodboard-generator) — 2차(제품, 미확인).
  프롬프트로 이미지·팔레트를 모아 무드보드를 만들고 사람이 교체할 수 있게 하는 도구. 무드보드 단계만 떼어낸
  대체재 라인.
- [디자이너용 MCP 서버 정리 (meepo.app)](https://www.meepo.app/blog/best-mcp-servers-designers-creative-work-2026)
  — 2차. 디자인 계열 MCP 서버 landscape 개괄. 빈자리 확인용으로만 쓰고 사실 주장 인용은 금지.
