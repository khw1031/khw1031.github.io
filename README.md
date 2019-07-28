# Hyunwoo Kim

```bash
# 배포
yarn deploy
# 개발 
yarn dev
```

## 배포 과정

기본적으로 gh-pages는 `[username].github.io` repo의 master 브랜치를 서빙합니다. 해당 repo에서 블로그 개발 관련 코드를 `dev` 브랜치에 분리해서 관리하고 `matser` 브랜치에 gatsby가 생성해준 정적 파일들을 배포하면 `[username].github.io`로 정상적으로 블로그 접속이 가능하고, `dev` 브랜치에서는 블로그 개발관련 코드와 블로그 콘텐츠(`.md`)를 관리할 수 있습니다.  
`master`엔 정적 코드를 서빙하고 `dev`엔 개발 관련 코드를 관리하기 위해서 `husky`의 `pre-push` hook을 이용합니다. `pre-commit` 단계가 `prettier, eslint, test` 등을 수행하고 커밋이 가능한 상태가 되면 `commit`을 수행해준다면, `pre-push` hook은 블로그 개발 관련 코드(혹은 컨텐츠 변경사항)가 dev 브랜치에 push 되기 이전에 동작하여 `dev` 브랜치 현재 상태를 기준으로 정적 파일들을 생성한 뒤에 해당 정적 파일을 master 브랜치에 배포하게 됩니다. 위와 같은 과정을 거쳐 `dev` 브랜치에서 작업한 블로그 코드는 `dev` 브랜치에서 관리가능하고, github-pages가 사이트를 서빙하기 위한 정적 파일들은 `master`에서 따로 관리할 수 있게 됩니다.
