---
type: Reference
title: Apple Human Interface Guidelines — 플랫폼 네이티브 구현 사례
pubDate: '2026-07-10T21:15:10+09:00'
resource: https://developer.apple.com/design/human-interface-guidelines/
description: 현행(2025~26, Liquid Glass/OS 26) Apple 디자인 시스템을 구현 사례로 정리 — SF Pro·SF Symbols·Dynamic Type·Materials·44pt·연속 곡률·시맨틱 색, 그리고 브레이크포인트가 아닌 size class
lang: ko
tags: ['apple', 'hig', 'design-system', 'liquid-glass', 'sf-symbols', 'accessibility']
summary: "Apple HIG는 이 라이브러리의 원리들이 플랫폼 네이티브로 구현된 한 사례다. 현행 디자인 언어는 Liquid Glass(WWDC25, 2025-06-09 발표; iOS 26·macOS Tahoe 26 등 model-year 26에 탑재) — 반투명·굴절 재질. 검증된 구체값: 터치 타깃 44pt, 시스템 폰트 SF Pro/SF Compact/New York + Dynamic Type(11 텍스트 스타일, 사용자 확대), SF Symbols 7,000+·9 웨이트·3 스케일·4 렌더 모드, Materials 5단계(ultraThin~ultraThick)+vibrancy, 시맨틱 색(고정 hex 미공개·자동 적응), 연속 곡률(squircle). 레이아웃은 고정 브레이크포인트가 아니라 축별 size class(regular/compact). 단 HIG 페이지는 SPA라 일부는 2차·SwiftUI/UIKit 문서로 검증."
lintHash: '5d465f0ca7e5'
---

> 한 줄 명제: Apple HIG는 원리들이 플랫폼 네이티브로 구현된 사례 — 깊이는 그림자 램프가 아니라 반투명 Materials·vibrancy로, 반응형은 브레이크포인트가 아니라 축별 size class로, 색은 고정 hex 없는 시맨틱 색으로 푼다.

## 핵심

Apple의 Human Interface Guidelines(HIG)는 이 라이브러리의 원리들이 ==플랫폼 네이티브로 구현된 한 사례==다([material-design](/wiki/design-principles/material-design/)·[Astryx](/wiki/design-principles/meta-astryx/)와 나란한). 앵커는 여전히 [DESIGN.md](/wiki/design-principles/design-md/)이고, Apple은 그 안에 담길 수 있는 실제 시스템 중 하나다.

**현행 디자인 언어 — Liquid Glass (2025~26).** WWDC25(2025-06-09 발표)에서 도입된 새 재질로, ==반투명하며 실제 유리처럼 주변을 반사·굴절==하고 실시간 렌더링으로 움직임에 반응하며 라이트/다크에 적응한다. ==model-year 26 세대(iOS 26·iPadOS 26·macOS Tahoe 26·watchOS 26·tvOS 26)에 탑재==(2025-09-15 출시). 변형은 Regular(적응형)·Clear(항상 투명). 가이드: "콘텐츠 위에 뜨는 내비게이션 층에 쓰고, glass-on-glass 중첩은 피하라." (Apple은 2025~26 시즌부터 전 OS 버전을 **연도 기반 model-year**로 통일 — "27" 같은 번호는 이 세대에 없다.)

**검증된 구체값** (1차 렌더 확인 표시):

- **터치 타깃 44×44 pt** 최소(→ [touch-target-size](/wiki/design-principles/usability/touch-target-size/)). 〔HIG Layout 페이지는 SPA — 값은 2차로 확인〕
- **타이포**(1차 `developer.apple.com/fonts`): 시스템 폰트 **SF Pro**(iOS/macOS)·**SF Compact**(watchOS)·serif **New York**, 연속 옵티컬 사이즈. **Dynamic Type** = 사용자 크기에 스케일하는 11개 텍스트 스타일(`.largeTitle`~`.caption2`)(→ [typographic-scale](/wiki/design-principles/aesthetics-and-layout/typographic-scale/)).
- **SF Symbols**(1차 렌더 확인): ==7,000+ 심볼·9 웨이트·3 스케일·텍스트 자동 정렬==, 4 렌더 모드(Monochrome/Hierarchical/Palette/Multicolor)(→ [icon-systems](/wiki/design-principles/usability/icon-systems/)).
- **Materials**(1차 SwiftUI 문서): ==`.ultraThinMaterial`~`.ultraThickMaterial` 5단계 + vibrancy==로 깊이 — 그림자 램프가 아니라 반투명 블러(→ [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/)).
- **시맨틱 색**: `label`/`secondaryLabel`… , `systemBackground` 계층, `systemBlue` 등 — 라이트/다크·Increase Contrast에 자동 적응. ==Apple은 고정 hex를 의도적으로 공개하지 않는다==(렌더 색은 trait 환경 의존)(→ [color-and-contrast](/wiki/design-principles/color-and-contrast/)·[dark-mode-and-theming](/wiki/design-principles/aesthetics-and-layout/dark-mode-and-theming/)).
- **연속 곡률(squircle)**: 앱 아이콘 마스크는 ==연속 곡률 초타원==(Icon Composer로 저작, `RoundedRectangle(style: .continuous)`와 같은 프리미티브)(→ [shape-and-corner-radius](/wiki/design-principles/aesthetics-and-layout/shape-and-corner-radius/)).

**레이아웃 — 브레이크포인트가 아니다.** Apple은 ==축별 **size class**(Regular/Compact, 가로·세로 각각)==를 회전·멀티태스킹에 따라 재할당한다 — CSS식 고정 픽셀 브레이크포인트가 아니라 적응형 trait다(→ [responsive-layout](/wiki/design-principles/aesthetics-and-layout/responsive-layout/)의 웹 접근과 대비). safe area, 기본 8pt 레이아웃 마진.

**접근성(1급 관심사).** Dynamic Type(전 크기 수용), Reduce Motion(모든 애니메이션에 대체 필요 → [motion](/wiki/design-principles/usability/motion-and-microinteractions/)), Increase Contrast·Reduce Transparency·Bold Text(시맨틱 색·재질이 유지돼야), VoiceOver 레이블(아이콘 전용 버튼 포함), Differentiate Without Color. 대비 4.5:1/3:1.

**다른 사례와의 차이.** Material은 시각 언어 스펙 + dp 그리드, Astryx는 코드+MCP 배포인 반면, Apple은 ==적응형 trait(size class)·재질(materials/vibrancy)·hex 없는 시맨틱 색==으로 "플랫폼에 맞춰 시스템이 알아서 적응"하는 쪽에 무게를 둔다.

**Gotcha / 확인 한계**: ==HIG(`developer.apple.com/design/...`)는 JS SPA라 자동 페치가 제목만 반환==한다 — 44pt·시맨틱 색 계층·size class·접근성 개요는 1차 HIG를 직접 렌더 인용하지 못하고 2차 iOS-dev 레퍼런스 또는 SwiftUI/UIKit 1차 문서로 확인했다. SF Symbols·폰트·Materials·Icon Composer는 1차 렌더 확인됨. 앱 아이콘 코너 ~22.37%는 2차 리버스 엔지니어링 값(Apple 미공개). "chrome" 재질은 SwiftUI `Material` enum이 아니라 UIKit `UIBlurEffect` 소산.

## 레퍼런스

- [Apple Newsroom — Liquid Glass 새 디자인 (2025-06-09)](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) — 1차. Liquid Glass 정의·광학 거동·OS 26 목록·적용 UI.
- [Apple — Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — 1차(SPA, 구조만). Layout·Color·Typography·Materials·Motion·Icons·Inputs·Accessibility.
- [Apple — Fonts](https://developer.apple.com/fonts/) — 1차(렌더). SF Pro/Compact/New York, 옵티컬 사이즈. [SwiftUI Material](https://developer.apple.com/documentation/swiftui/material) — 1차(렌더). 5단계 재질.
- [Apple — SF Symbols](https://developer.apple.com/sf-symbols/) — 1차(렌더). 7,000+·9 웨이트·3 스케일·4 렌더 모드.
- [Apple — Icon Composer](https://developer.apple.com/icon-composer/) — 1차(렌더). Liquid Glass 아이콘·연속 곡률 마스크.
- [Apple — Reduced Motion 평가 기준](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/) · [Sufficient Contrast](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/sufficient-contrast-evaluation-criteria) — 1차(렌더). 접근성 기준.
- ["Meet Liquid Glass" WWDC25 세션 219](https://developer.apple.com/videos/play/wwdc2025/219/) — 1차(영상, SPA). Regular/Clear 변형·적응 거동.

## 연결

- [DESIGN.md](/wiki/design-principles/design-md/) — 이 카테고리 앵커(산출물 포맷). Apple은 담길 수 있는 실제 시스템 사례 중 하나.
- [Design Principles](/wiki/design-principles/) — 상위 허브. "구현된 디자인 시스템 사례"의 하나.
- [material-design](/wiki/design-principles/material-design/) · [meta-astryx](/wiki/design-principles/meta-astryx/) — 나란한 구현 사례(Google·Meta).
- [touch-target-size](/wiki/design-principles/usability/touch-target-size/) · [icon-systems](/wiki/design-principles/usability/icon-systems/) · [elevation-and-depth](/wiki/design-principles/aesthetics-and-layout/elevation-and-depth/) · [shape-and-corner-radius](/wiki/design-principles/aesthetics-and-layout/shape-and-corner-radius/) · [responsive-layout](/wiki/design-principles/aesthetics-and-layout/responsive-layout/) — Apple이 구현한 각 원리.
