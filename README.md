# khw1031.github.io

```bash
# 배포
yarn deploy
# 개발
yarn dev
```

## 배포 과정

기본적으로 gh-pages는 `[username].github.io` repo의 master 브랜치를 서빙합니다. 해당 repo에서 블로그 개발 관련 코드를 `dev` 브랜치에 분리해서 관리하고 `matser` 브랜치에 gatsby가 생성해준 정적 파일들을 배포하면 `[username].github.io`로 정상적으로 블로그 접속이 가능하고, `dev` 브랜치에서는 블로그 개발관련 코드와 블로그 콘텐츠(`.md`)를 관리할 수 있습니다.

`master`엔 정적 코드를 서빙하고 `dev`엔 개발 관련 코드를 관리하기 위해서 `husky`의 `pre-push` hook을 이용합니다. `pre-commit` 단계가 `prettier, eslint, test` 등을 수행하고 커밋이 가능한 상태가 되면 `commit`을 수행해준다면, `pre-push` hook은 블로그 개발 관련 코드(혹은 컨텐츠 변경사항)가 dev 브랜치에 push 되기 이전에 동작하여 `dev` 브랜치 현재 상태를 기준으로 정적 파일들을 생성한 뒤에 해당 정적 파일을 `master` 브랜치에 배포하게 됩니다.

위와 같은 과정을 거쳐 `dev` 브랜치에서 작업한 블로그 코드는 `dev` 브랜치에서 관리가능하고, github-pages가 사이트를 서빙하기 위한 정적 파일들은 `master`에서 따로 관리할 수 있게 됩니다.

## Kudos https://www.taniarascia.com

이 블로그의 디자인이나 일부 코드는 위 블로그를 참고해서 만들어졌습니다. 배포 과정이나 내부 코드는 변경된 것이 많지만 해당 블로그의 구성이 마음에 들어서 해당 블로그는 복제하는 과정을 거쳤습니다. 위 블로그의 코드에 대해서 자세히 알고 싶다면 [여기](https://github.com/taniarascia/taniarascia.com)로 가시면 됩니다. 참고로 tania의 블로그와의 차이점은 아래와 같습니다.

#### 변경사항
- Styled-components over Sass
- React Hooks over React Class Components
- Github-pages hosting over netlify hosing
- Small Refactors

## LICENSE

해당 블로그를 구성하는 모든 코드는 자유롭게 가져다가 그대로 쓰셔도 되고, 변형해서 사용하셔도 됩니다. **하지만 `content/` 디렉토리 내부의 제가 작성한 콘텐츠들은 출처를 명시하고 레퍼런스를 작성**해주셔야 합니다. 참고로 `custom` 내부의 데이터를 수정하면 사이트를 쉽게 커스터마이즈 할 수 있도록 구성되어 있습니다. 더 나은 블로그 혹은 코드를 위한 커밋은 언제든지 환영합니다.
