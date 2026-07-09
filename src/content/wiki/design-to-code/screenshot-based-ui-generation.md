---
type: Reference
title: Screenshot 기반 UI 생성 (소스 무관)
pubDate: '2026-07-08'
description: 어떤 도구로 만들었든 상관없는 스크린샷/스케치 이미지를 비전 모델에 그대로 넣어 코드를 생성하는, 구조화된 디자인 파일 파싱이 필요 없는 접근
lang: ko
tags: ['design-to-code', 'vision-model', 'screenshot-to-code', 'ai-agent-workflow']
summary: "v0, bolt.new, Lovable, Anima를 비롯한 2026년 주요 AI 앱 빌더는 스크린샷·손그림 스케치·경쟁사 사이트 화면 등 '어디서 왔는지 상관없는' 이미지를 비전 모델에 바로 넣어 코드를 생성하는 기능을 공식 지원한다. Figma 파일 파싱이 아예 없다는 점에서 노드 트리 기반 접근과 근본적으로 다르다."
lintHash: 'b1b4d420094a'
polishHash: 'b1b4d420094a'
---

> 한 줄 명제: v0·bolt.new·Lovable·Anima는 모두 "어디서 왔는지 상관없는" 스크린샷 한 장을 비전 모델에 바로 넣어 코드를 생성하는 기능을 공식 지원한다 — 구조화된 디자인 파일 파싱이 아예 없는, 2026년 기준 가장 성숙한 Figma 우회 경로다.

## 핵심

==스크린샷 기반 생성은 이미지를 해석해 코드를 뽑아내는 범용 비전 LLM 능력(Anthropic·OpenAI·Google 멀티모달 모델)에 의존할 뿐, UI 전용 파서를 필요로 하지 않는다.== 그래서 입력 이미지의 출처를 가리지 않는다 — Figma에서 내보낸 PNG든, 손으로 그린 스케치든, 경쟁사 웹사이트 스크린샷이든 동일하게 동작한다. 2026년 중반 기준 주요 벤더 문서는 이를 명시적으로 "어떤 도구에서 왔든" 상관없다고 표현한다.

다만 정도 차이는 있다. v0는 스크린샷 입력을 지원하면서도 "더 나은 결과를 위해 Figma 파일 사용을 고려하라"고 권장해 완전한 스크린샷 전용이 아니라 하이브리드에 가깝다. 반면 bolt.new·Lovable·Anima는 이미지를 스타일/레이아웃 참고 자료로 취급하는 순수 비전 기반 흐름을 문서화한다. bolt.new는 Google Stitch에서 내보낼 때 "스크린샷 + HTML + DESIGN.md" 조합을 받는 별도 연동도 제공해, 스크린샷 단독이 아니라 스크린샷과 텍스트 스펙을 함께 쓰는 패턴도 실제로 운영되고 있음을 보여준다.

주의할 점은, "Claude/Claude Code가 UI 목업을 코드로 바꾼다"는 서술은 실무에서 흔히 쓰이지만 ==이번 조사에서 Anthropic 공식 문서(비전 가이드, 멀티모달 쿡북)는 이를 명시적 유스케이스로 이름 붙이지 않았다== — 해당 프레이밍은 2차 블로그에서만 확인됐다. Claude의 비전 자체(이미지 입력 메커니즘, 고해상도 티어)는 공식 문서로 확인되지만, "UI 목업 → 코드"라는 이름이 붙은 워크플로 문서는 v0/Lovable/Anima처럼 벤더가 직접 만들어 놓지는 않았다.

## 레퍼런스

- [v0 (Vercel), Screenshots](https://v0.app/docs/screenshots) — 1차. "레이아웃·색상·컴포넌트를 분석해 유사한 코드를 생성"하되 "더 나은 결과를 위해 Figma 파일 사용을 고려하라"고 명시 — 하이브리드형.
- [bolt.new (StackBlitz), Upload files](https://support.bolt.new/building/upload-files.md) — 1차. 이미지 첨부로 스타일/레이아웃 참고("attached image for inspiration")를 지원. jpg/jpeg/png/gif/webp/svg, 무료 10MB·Pro 100MB.
- [bolt.new × Google Stitch 연동](https://support.bolt.new/integrations/google-stitch.md) — 1차. Stitch에서 내보내면 Bolt가 "페이지 스크린샷 + HTML + DESIGN.md"를 받는 구체적 핸드오프 형식을 확인.
- [Lovable, Turn Wireframes into Working Apps](https://lovable.dev/guides/wireframe-apps) (2025-12-19) — 1차. "Figma든 손그림 스케치든 다른 무엇이든" 와이어프레임 스크린샷을 붙여넣으면 동작하는 코드를 생성한다고 명시 — 소스 무관을 가장 직접적으로 표현.
- [Lovable, File uploads](https://lovable.dev/blog/lovable-file-uploads) (2025-09-24) — 1차. 이미지 포함 범용 파일 업로드를 프롬프트 컨텍스트로 사용한다는 공식 발표.
- [Anima, Starting from a Prompt](https://docs.animaapp.com/docs/starting-from-a-prompt) — 1차. PNG/JPEG/WebP 이미지 첨부로 "레이아웃 구조와 컴포넌트 배치를 추출"하는 기능과, 실제 운영 중인 웹사이트 URL을 스크레이핑하는("inspired by [URL]") 별도 모드를 함께 문서화.
- [abi/screenshot-to-code (GitHub)](https://github.com/abi/screenshot-to-code) — 2차(OSS 프로젝트 자체 README). 가장 많은 star를 받은 오픈소스 구현체, Gemini 3/3.1 Pro 비전 모델 지원.
- [Claude 공식 Vision 문서](https://platform.claude.com/docs/en/build-with-claude/vision) — 1차. 이미지 입력 메커니즘(base64/URL/Files API)과 고해상도 티어(최대 2576px/4784 비주얼 토큰)를 확인. 다만 "UI 목업 → 코드"를 명명된 유스케이스로 다루지는 않음 — 갭으로 명시.

## 연결

- [Design-to-Code Agent Workflows](/wiki/design-to-code/) — 이 카드가 속한 카테고리, 나머지 세 갈래 대안과의 관계.
- [이식 가능한 텍스트 디자인 스펙](/wiki/design-to-code/design-token-dsl-handoff/) — 스크린샷(이미지)만으로는 부족한 디자인 토큰·규칙을 텍스트로 보완하는 대조 사례(bolt×Stitch 연동이 실제로 스크린샷+DESIGN.md를 함께 쓰는 것이 그 증거).
- [코드/캔버스를 디자인 소스로 쓰는 도구](/wiki/design-to-code/code-as-design-source/) — 스크린샷을 "보고 재현"하는 대신 애초에 구조화된 데이터 모델을 직접 조작하는 더 근본적인 대안.
