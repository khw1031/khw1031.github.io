---
title: 'Feature Workflow Skill 설계 및 사내 표준화'
period: '2026.02 — 2026.03'
company: '(주)한샘'
role: 'AI 워크플로우 설계 / 표준화 리드'
status: draft
source: 'src/data/cv.ts'
cv_ready: false
public_references: []
private_materials: []
---

# Feature Workflow Skill 설계 및 사내 표준화

## Current CV Data

- What: AI 에이전트를 활용한 기능 구현을 Requirements → Design → Task → Implementation → Review 5단계로 표준화하는 Claude Skill을 설계·검증·라이브러리화했다. 인테리어 플래너 프로젝트에서 실전 적용해 효과를 검증한 뒤, hanssem-ai-library의 공통 Skill로 추출해 사내 4종 AI 에이전트에서 동일 절차로 사용 가능한 자산으로 전환했다.
- How: Context Isolation, Human in the Loop, Document as Interface, Git as History 원칙 적용, 단계별 입·출력 문서를 .ai/tasks/<TASK_ID>/에 고정, Given-When-Then 테스트 시나리오 연결, Step 4 병렬 구현 자동화, status.yaml SSOT + task.sh CLI + resume-guide 기반 작업 재개 보장.
- Impact: 인테리어 플래너에서 53개 태스크, 265+ 산출물, 125 Jira 티켓 처리, 62% 일정 단축, 86.8% AI 협업 비율, 테스트:소스 0.80 달성의 핵심 메커니즘. common/skills/feature-workflow v1.1.0 등록, Claude Code/Cursor/GitHub Copilot/Antigravity 4종 에이전트 호환.

## Missing Information

- [ ] v1.1.0에서 확정된 외부 게시 가능한 기능 범위
- [ ] 사내 4종 에이전트 호환 구조의 공개 가능 설명
- [ ] 인테리어 플래너 외 적용 사례
- [ ] 외부 게시 가능한 workflow diagram 또는 task folder 예시

## Deep-Dive Topics

- 5단계 워크플로우의 각 단계별 입출력 계약
- status.yaml과 task.sh가 작업 재개를 보장하는 방식
- TDD와 리뷰 단계가 품질 편차를 줄인 방식

## References

내부 근거와 외부 링크를 구분해 추가한다.

- 

## Draft CV Paragraph

작성 전.
