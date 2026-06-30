# Interview Questions

## Measurement

- Lighthouse 점수 대신 PSI API를 1시간 간격으로 사용한 이유는 무엇인가?
- Lab data와 field data의 차이는 무엇이고, 이 프로젝트는 어느 쪽에 가까운가?
- 평균값을 쓰면 어떤 문제가 생기며 p75를 써야 하는 상황은 언제인가?

## LCP

- LCP는 정확히 무엇을 측정하며, 배너 이미지가 LCP 후보가 되는 이유는 무엇인가?
- `background-image`를 `<img>`로 바꾸면 브라우저의 리소스 발견과 우선순위에 어떤 차이가 생기는가?
- Swiper 초기화 전 이미지 로드를 막는 로직은 왜 LCP를 악화시키는가?
- `preload`, `fetchpriority`, Next/Image `priority`는 각각 언제 사용해야 하는가?
- font stylesheet가 render blocking을 만들 때 `preload`와 `font-display`는 어떤 역할을 하는가?

## TBT and JavaScript

- TBT는 어떻게 계산되고 INP와 어떤 관계가 있는가?
- Script Evaluation 7초는 Chrome DevTools에서 어떤 패널로 확인하는가?
- Unused Bytes 74.3%가 높다는 사실만으로 TBT 원인이라고 단정할 수 없는 이유는 무엇인가?
- ESM, tree shaking, code splitting은 각각 어떤 문제를 해결하는가?
- package `exports`를 entry point 단위로 열 때 생길 수 있는 breaking change는 무엇인가?

## Architecture and Tradeoffs

- Next/Image를 쓰면서 `unoptimized`를 사용한 이유는 무엇인가?
- CDN + Lambda 이미지 최적화와 Next/Image custom loader의 책임 경계는 어떻게 나뉘는가?
- 성능 개선이 전환율이나 사용자 경험에 기여했다는 주장을 어떻게 검증할 수 있는가?
